import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { HintCoin, Logo } from "@/components/brand";
import { allowedDomains, devLoginEnabled, googleConfigured, siteName } from "@/lib/config";
import { getCurrentUser } from "@/lib/session";

export const metadata = { title: "Sign in" };

async function googleSignIn() {
  "use server";
  await signIn("google", { redirectTo: "/" });
}

async function devSignIn(formData: FormData) {
  "use server";
  if (!devLoginEnabled()) return;
  try {
    await signIn("dev", { email: formData.get("email"), name: formData.get("name"), redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) redirect("/login?error=dev");
    throw error;
  }
}

function errorMessage(code: string | undefined) {
  if (!code) return null;
  const domains = allowedDomains();
  if (code === "domain" || code === "AccessDenied") {
    return domains.length
      ? `Please sign in with your school or college Google account (@${domains.join(" or @")}).`
      : "That account could not be used to sign in.";
  }
  if (code === "dev") return "Enter a valid email address.";
  return "Sign-in did not complete. Please try again.";
}

const features = [
  ["Write it.", "Real Python in your browser, marked in seconds. Searching, sorting, recursion, classes and more."],
  ["Fix it.", "Broken programs to repair and bugs to spot. The fastest way to get good at debugging."],
  ["Win it.", "Timed competitions with a live leaderboard. Earn hints as you solve, and spend them wisely."],
];

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getCurrentUser()) redirect("/");
  const { error } = await searchParams;
  const message = errorMessage(typeof error === "string" ? error : undefined);

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-5xl px-6 pt-16 sm:pt-24 pb-14 text-center">
        <div className="flex justify-center">
          <Logo size={84} />
        </div>
        <h1 className="mt-7 text-6xl sm:text-8xl font-semibold tracking-tighter">{siteName}</h1>
        <p className="mx-auto mt-5 max-w-xl text-xl sm:text-2xl text-muted leading-snug">Python challenges for A Level Computer Science. Write it. Fix it. Win it.</p>

        <div className="mx-auto mt-10 w-full max-w-sm">
          {message && (
            <p role="alert" className="mb-5 rounded-2xl bg-[#ffe6e4] px-4 py-3 text-sm text-[#c4271b]">
              {message}
            </p>
          )}

          {googleConfigured() ? (
            <form action={googleSignIn}>
              <button className="btn btn-dark w-full py-3.5 text-[17px]">
                <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.7 1.2 9.2 3.6l6.9-6.9C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l8 6.2C12.5 13.7 17.8 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.6 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.2 5.5-4.7 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z" />
                  <path fill="#FBBC05" d="M10.6 28.6a14.5 14.5 0 0 1 0-9.2l-8-6.2a24 24 0 0 0 0 21.6l8-6.2z" />
                  <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.2 1.5-5 2.3-8.2 2.3-6.2 0-11.5-4.2-13.4-9.9l-8 6.2C6.5 42.6 14.6 48 24 48z" />
                </svg>
                Continue with Google
              </button>
              <p className="mt-4 text-sm text-muted">Use your school or college account. There is no separate password.</p>
            </form>
          ) : (
            <p className="rounded-2xl bg-[#fff2d9] px-4 py-3 text-sm text-[#7a4700]">
              Google sign-in is not set up yet. Add <code className="font-mono">AUTH_GOOGLE_ID</code> and <code className="font-mono">AUTH_GOOGLE_SECRET</code> to{" "}
              <code className="font-mono">.env</code> (the README explains how).
            </p>
          )}

          {devLoginEnabled() && (
            <form action={devSignIn} className="glass mt-8 rounded-3xl p-6 space-y-4 text-left">
              <div>
                <p className="text-sm font-semibold">Local testing only</p>
                <p className="mt-1 text-sm text-muted">
                  Sign in as anyone to try the site. An email listed in <code className="font-mono">TEACHER_EMAILS</code> gets the teacher dashboard. This form
                  does not exist on the live site.
                </p>
              </div>
              <label className="block text-sm font-medium">
                Name
                <input name="name" placeholder="Taken from the email if left empty" className="field" />
              </label>
              <label className="block text-sm font-medium">
                Email
                <input name="email" type="email" required defaultValue="student@example.test" className="field" />
              </label>
              <button className="btn btn-primary w-full py-2.5 text-base">Sign in for testing</button>
            </form>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-6 pb-24 sm:grid-cols-3">
        {features.map(([title, text], index) => (
          <div key={title} className="glass rounded-3xl p-8">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              {title}
              {index === 2 && <HintCoin size={22} />}
            </h2>
            <p className="mt-2 text-muted">{text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
