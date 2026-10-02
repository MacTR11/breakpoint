const list = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

export const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Bitwise";

export const allowedDomains = () => list(process.env.ALLOWED_EMAIL_DOMAINS);
export const teacherEmails = () => list(process.env.TEACHER_EMAILS);

export const googleConfigured = () => Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

/** The password-free sign-in form exists only for trying the site locally. */
export const devLoginEnabled = () => process.env.NODE_ENV !== "production" && process.env.ALLOW_DEV_LOGIN === "true";

export function emailAllowed(email: string) {
  const domains = allowedDomains();
  const lower = email.toLowerCase();
  if (teacherEmails().includes(lower)) return true;
  return domains.length === 0 || domains.includes(lower.split("@")[1] ?? "");
}
