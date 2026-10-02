import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { allowedDomains, devLoginEnabled, emailAllowed, googleConfigured, teacherEmails } from "@/lib/config";
import { db } from "@/lib/db";

const providers: Provider[] = [];

if (googleConfigured()) {
  const domains = allowedDomains();
  providers.push(
    Google({
      authorization: {
        params: {
          prompt: "select_account",
          // `hd` only pre-selects the school's accounts on Google's screen;
          // the real check is in the signIn callback below.
          ...(domains.length === 1 ? { hd: domains[0] } : {}),
        },
      },
    }),
  );
}

if (devLoginEnabled()) {
  providers.push(
    Credentials({
      id: "dev",
      name: "Development sign-in",
      credentials: { email: {}, name: {} },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        if (!/^[^@\s]+@[^@\s]+$/.test(email)) return null;
        const name = String(credentials?.name ?? "").trim() || email.split("@")[0];
        return { id: email, email, name };
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;
      if (account?.provider === "google") {
        if (!profile?.email_verified) return false;
        if (!emailAllowed(email)) return "/login?error=domain";
      }
      const role = teacherEmails().includes(email) ? "TEACHER" : "STUDENT";
      await db.user.upsert({
        where: { email },
        create: { email, name: user.name ?? email, image: user.image, role, school: email.split("@")[1] },
        update: { name: user.name ?? undefined, image: user.image ?? undefined, role, lastSeenAt: new Date() },
      });
      return true;
    },
  },
});
