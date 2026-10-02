import { siteName } from "@/lib/config";

/** The mark: a breakpoint, the red dot an editor puts in the gutter. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <span aria-hidden="true" className="inline-block h-[0.62em] w-[0.62em] rounded-full bg-brand" />
      {siteName}
    </span>
  );
}
