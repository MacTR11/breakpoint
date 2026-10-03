import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cleanUsername } from "@/lib/accounts";
import { teacherLogin, teacherSessionHours } from "@/lib/config";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/passwords";
import { clearFailures, isLocked, recordFailure } from "@/lib/throttle";

declare module "next-auth" {
  interface User {
    epoch?: number;
    role?: string;
  }
  interface Session {
    epoch?: number;
  }
}

/** Thrown instead of a plain "wrong password" when a username has had too many wrong attempts. */
class Locked extends CredentialsSignin {
  code = "locked";
}

const digest = (text: string) => createHash("sha256").update(text).digest();

/**
 * A fingerprint of the teacher's .env sign-in, kept in the teacher's session
 * so that changing TEACHER_USERNAME or TEACHER_PASSWORD ends every teacher
 * session at once. Keyed with AUTH_SECRET; never log it.
 */
const teacherKey = (login: { username: string; password: string }) =>
  createHmac("sha256", process.env.AUTH_SECRET ?? "")
    .update(`${login.username}\n${login.password}`)
    .digest("base64url")
    .slice(0, 32);
const sameText = (a: string, b: string) => timingSafeEqual(digest(a), digest(b));

/** The teacher signs in with the username and password from .env. Their row is made on first sign-in. */
async function teacherSignIn(login: NonNullable<ReturnType<typeof teacherLogin>>, password: string) {
  if (!sameText(password, login.password)) return null;
  const holder = await db.user.findUnique({ where: { username: login.username } });
  if (holder && holder.role !== "TEACHER") {
    console.error(`TEACHER_USERNAME "${login.username}" is already a student's username. Rename that student or choose another.`);
    return null;
  }
  const existing = holder ?? (await db.user.findFirst({ where: { role: "TEACHER" } }));
  const data = { username: login.username, lastSeenAt: new Date(), ...(login.name ? { name: login.name } : {}) };
  return existing ? db.user.update({ where: { id: existing.id }, data }) : db.user.create({ data: { ...data, name: login.name ?? "Teacher", role: "TEACHER" } });
}

async function studentSignIn(username: string, password: string) {
  const user = await db.user.findUnique({ where: { username } });
  const student = user?.role === "STUDENT" ? user : null;
  if (!(await verifyPassword(password, student?.passwordHash)) || !student) return null;
  return db.user.update({ where: { id: student.id }, data: { lastSeenAt: new Date() } });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: { username: {}, password: {} },
      authorize: async (credentials) => {
        const username = cleanUsername(String(credentials?.username ?? ""));
        const password = String(credentials?.password ?? "");
        if (!username || !password) return null;
        if (await isLocked(username)) throw new Locked();
        const teacher = teacherLogin();
        const user = teacher?.username === username ? await teacherSignIn(teacher, password) : await studentSignIn(username, password);
        if (!user) {
          await recordFailure(username);
          return null;
        }
        await clearFailures(username);
        return { id: user.id, name: user.name, epoch: user.sessionEpoch, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    // Returning null ends the session. The teacher's account can see every
    // student, so its sessions are shorter and can be ended from outside: by
    // "Sign out everywhere" (sessionEpoch, checked in getCurrentUser), by a new
    // .env sign-in, or after TEACHER_SESSION_HOURS.
    async jwt({ token, user }) {
      const now = Math.floor(Date.now() / 1000);
      if (user) {
        token.epoch = user.epoch ?? 0;
        token.role = user.role;
        if (user.role === "TEACHER") {
          const login = teacherLogin();
          token.teacherKey = login ? teacherKey(login) : "";
          token.signedInAt = now;
        }
        return token;
      }
      // Sessions from before roles were recorded: look the role up, and have the teacher sign in again.
      if (token.role === undefined) {
        const row = token.sub ? await db.user.findUnique({ where: { id: token.sub }, select: { role: true } }) : null;
        if (!row || row.role === "TEACHER") return null;
        token.role = row.role;
      }
      if (token.role === "TEACHER") {
        const login = teacherLogin();
        if (!login || token.teacherKey !== teacherKey(login)) return null;
        if (typeof token.signedInAt !== "number" || now - token.signedInAt > teacherSessionHours() * 3600) return null;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? "";
      session.epoch = typeof token.epoch === "number" ? token.epoch : 0;
      return session;
    },
  },
});
