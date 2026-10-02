import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { Wordmark } from "@/components/brand";
import { allowedDomains, devLoginEnabled, googleConfigured } from "@/lib/config";
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

// A real challenge from the bank, shown the way the site shows it.
const sample = ["def sum_to(n):", "    total = 0", "    for i in range(1, n):", "        total = total + i", "    return total"];
const BUG_LINE = 3;

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  if (await getCurrentUser()) redirect("/");
  const { error } = await searchParams;
  const message = errorMessage(typeof error === "string" ? error : undefined);

  return (
    <main className="mx-auto grid w-full max-w-5xl flex-1 gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 lg:py-24">
      <section>
        <h1 className="text-5xl sm:text-6xl">
          <Wordmark />
        </h1>
        <p className="mt-5 max-w-md text-xl text-ink-soft">Python challenges for A Level Computer Science. Write programs, fix broken ones, and compete on the clock.</p>

        <div className="mt-9 max-w-sm">
          {message && (
            <p role="alert" className="mb-5 text-sm text-fail">
              {message}
            </p>
          )}

          {googleConfigured() ? (
            <form action={googleSignIn}>
              <button className="btn btn-primary px-5 py-2.5 text-base">Sign in with Google</button>
              <p className="mt-3 text-sm text-muted">Use your school or college account. There is no separate password.</p>
            </form>
          ) : (
            <p className="text-sm text-warn">
              Google sign-in is not set up yet. Add <code className="font-mono">AUTH_GOOGLE_ID</code> and <code className="font-mono">AUTH_GOOGLE_SECRET</code> to{" "}
              <code className="font-mono">.env</code> (the README explains how).
            </p>
          )}

          {devLoginEnabled() && (
            <form action={devSignIn} className="mt-8 space-y-3 border-t border-line pt-6">
              <p className="text-sm text-muted">
                <span className="font-semibold text-ink">Local testing only.</span> Sign in as anyone. An email listed in{" "}
                <code className="font-mono">TEACHER_EMAILS</code> gets the teacher dashboard. This form does not exist on the live site.
              </p>
              <label className="block text-sm font-medium">
                Name
                <input name="name" placeholder="Taken from the email if left empty" className="field" />
              </label>
              <label className="block text-sm font-medium">
                Email
                <input name="email" type="email" required defaultValue="student@example.test" className="field" />
              </label>
              <button className="btn btn-secondary">Sign in for testing</button>
            </form>
          )}
        </div>
      </section>

      <section aria-label="An example challenge" className="self-start">
        <p className="font-mono text-[13px] text-muted">~/practice/debugging/sum_to.py</p>
        <div className="mt-2 overflow-x-auto rounded-md bg-editor py-4 font-mono text-sm leading-7 text-[#f6f8fa]">
          {sample.map((line, index) => (
            <div key={index} className={`flex ${index + 1 === BUG_LINE ? "bg-brand/20" : ""}`}>
              <span className="flex w-8 shrink-0 items-center justify-center">
                {index + 1 === BUG_LINE && <span className="h-2.5 w-2.5 rounded-full bg-brand" aria-label="breakpoint" />}
              </span>
              <span className="w-6 shrink-0 select-none text-right text-[#9198a1]">{index + 1}</span>
              <pre className="pl-4 pr-6">{line}</pre>
            </div>
          ))}
        </div>
        <div className="mt-3 font-mono text-[13px] leading-6">
          <p>
            <span className="font-semibold text-fail">FAIL</span> sum_to(5) expected 15, returned 10
          </p>
          <p>
            <span className="font-semibold text-pass">PASS</span> sum_to(0) returned 0
          </p>
        </div>
        <p className="mt-4 max-w-md text-muted">One line is wrong. Finding it is the skill: that is what a breakpoint is for, and what a quarter of the challenges here are about.</p>
      </section>
    </main>
  );
}
