import Link from "next/link";
import { Wordmark } from "@/components/brand";

export const metadata = { title: "Page not found" };

/** A missing page, reported the way Python reports a missing key. */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-4 py-10">
      <Link href="/" className="self-start">
        <Wordmark className="text-xl" />
      </Link>
      <div className="mt-6 overflow-hidden rounded-[22px] bg-[#21252b] text-[#f6f8fa]">
        <div className="px-4 pt-2 font-mono text-[13px]">
          <span className="inline-block rounded-t-[10px] bg-[#282c34] px-4 py-1.5">traceback</span>
        </div>
        <pre className="overflow-x-auto bg-[#282c34] p-5 font-mono text-[13px] leading-6">
          <span className="text-[#9198a1]">Traceback (most recent call last):</span>
          {"\n"}
          {'  File "breakpoint/pages.py", line '}
          <span className="text-[#ffa657]">404</span>
          {", in open_page\n"}
          {"    return pages[address]\n"}
          {"           ~~~~~^^^^^^^^^\n"}
          <span className="text-[#ff7b72]">KeyError</span>
          {": 'there is no page at this address'"}
        </pre>
      </div>
      <h1 className="mt-7 font-display text-3xl font-extrabold tracking-tight">Page not found</h1>
      <p className="mt-1 text-muted">The link may be old or mistyped, or the page may be for teachers only.</p>
      <p className="mt-5">
        <Link href="/" className="btn btn-primary">
          Back to Home
        </Link>
      </p>
    </main>
  );
}
