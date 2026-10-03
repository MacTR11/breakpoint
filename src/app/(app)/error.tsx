"use client";

import Link from "next/link";

/** Something that went wrong inside the site, reported the way Python reports an error (like the missing page). */
export default function ErrorPage({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <div className="overflow-hidden rounded-[22px] bg-[#21252b] text-[#f6f8fa]">
        <div className="px-4 pt-2 font-mono text-[13px]">
          <span className="inline-block rounded-t-[10px] bg-[#282c34] px-4 py-1.5">traceback</span>
        </div>
        <pre className="overflow-x-auto bg-[#282c34] p-5 font-mono text-[13px] leading-6">
          <span className="text-[#9198a1]">Traceback (most recent call last):</span>
          {"\n"}
          {'  File "breakpoint/pages.py", line '}
          <span className="text-[#ffa657]">500</span>
          {", in show_page\n"}
          {"    return render(page)\n"}
          <span className="text-[#ff7b72]">RuntimeError</span>
          {": 'something went wrong on our side'"}
          {error.digest && <span className="text-[#9198a1]">{`\n# reference ${error.digest}`}</span>}
        </pre>
      </div>
      <h1 className="mt-7 font-display text-3xl font-extrabold tracking-tight">Something went wrong</h1>
      <p className="mt-1 text-muted">Try again. If you have been signed out, sign in again first.</p>
      <p className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => retry()} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-secondary">
          Back to Home
        </Link>
      </p>
    </main>
  );
}
