import { redirect } from "next/navigation";
import { Wordmark } from "@/components/brand";
import { CodeLine } from "@/components/code-text";
import { LoginForm } from "@/components/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { teacherLogin } from "@/lib/config";
import { getCurrentUser } from "@/lib/session";

export const metadata = { title: "Sign in" };

// A real challenge from the bank, shown the way the site shows it.
const sample = ["def sum_to(n):", "    total = 0", "    for i in range(1, n):", "        total = total + i", "    return total"];
const BUG_LINE = 3;

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-5 sm:px-6 sm:py-8 lg:justify-center">
      <div className="mb-3 flex justify-end px-2 text-sm">
        <ThemeToggle />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <section className="card px-6 py-9 sm:px-9 sm:py-11">
          <h1 className="text-5xl sm:text-[3.5rem]">
            <Wordmark />
          </h1>
          <p className="mt-4 max-w-md text-lg text-ink-soft">Python challenges for A Level Computer Science. Write programs, fix broken ones, and compete on the clock.</p>

          <div className="mt-9 max-w-sm">
            <LoginForm />
            <p className="mt-4 text-sm text-muted">Your teacher gives you your username and password. If you have lost them, ask your teacher to set a new password.</p>
            {!teacherLogin() && (
              <p className="mt-6 border-t border-line pt-4 text-sm text-warn">
                The teacher account is not set up yet. Add <code className="font-mono">TEACHER_USERNAME</code> and <code className="font-mono">TEACHER_PASSWORD</code> (8 characters or more) to{" "}
                <code className="font-mono">.env</code>, then restart the site. The README explains how.
              </p>
            )}
          </div>
        </section>

        <section aria-label="An example challenge" className="tile flex flex-col justify-center rounded-[22px] px-6 py-9 sm:px-9" style={{ "--tone": "#e5372c" } as React.CSSProperties}>
          <span className="glyph right-6 top-4 text-[5rem]" aria-hidden="true">
            !=
          </span>
          <p className="text-[13px] font-semibold opacity-90">Fix the bug · Debugging</p>
          <p className="mt-1 font-display text-3xl font-extrabold tracking-tight">Fix: Sum to N</p>
          <div className="dark mt-5 overflow-x-auto rounded-[16px] bg-[#21252b] py-4 font-mono text-sm leading-7 text-[#f6f8fa]">
            {sample.map((line, index) => (
              <div key={index} className={`flex ${index + 1 === BUG_LINE ? "bg-brand/20" : ""}`}>
                <span className="flex w-8 shrink-0 items-center justify-center">
                  {index + 1 === BUG_LINE && <span className="h-2.5 w-2.5 rounded-full bg-brand" aria-label="breakpoint" />}
                </span>
                <span className="w-6 shrink-0 select-none text-right text-[#9198a1]">{index + 1}</span>
                <pre className="pl-4 pr-6">
                  <CodeLine line={line} />
                </pre>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-[16px] bg-[#21252b] px-4 py-3 font-mono text-[13px] leading-6 text-[#f6f8fa]">
            <p>
              <span className="inline-block w-[5.75rem] font-semibold text-[#ff7b72]">✗ Failed</span>sum_to(5) expected 15, returned 10
            </p>
            <p>
              <span className="inline-block w-[5.75rem] font-semibold text-[#3fb950]">✓ Passed</span>sum_to(0) returned 0
            </p>
          </div>
          <p className="mt-5 max-w-md text-[15px] opacity-95">One line is wrong. Finding it is the skill: that is what a breakpoint is for, and what a quarter of the challenges here are about.</p>
        </section>
      </div>
    </main>
  );
}
