export const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Breakpoint";

// A short password is fine while trying the site on your own computer, but the
// live site will not accept one: the teacher account can see every student.
export const MIN_TEACHER_PASSWORD = process.env.NODE_ENV === "production" ? 8 : 1;

/**
 * The teacher's sign-in, which is set in .env (or the host's settings) rather
 * than stored in the database. Null until both values are set and the
 * password is long enough.
 */
export function teacherLogin() {
  const username = (process.env.TEACHER_USERNAME ?? "").trim().toLowerCase();
  const password = process.env.TEACHER_PASSWORD ?? "";
  if (!username || password.length < MIN_TEACHER_PASSWORD) return null;
  return { username, password, name: (process.env.TEACHER_NAME ?? "").trim() || null };
}
