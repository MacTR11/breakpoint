import { BrandDot } from "@/components/brand-dot";
import { siteName } from "@/lib/config";

/** The mark: a breakpoint, the red dot an editor puts in the gutter. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-extrabold tracking-tight ${className}`}>
      <BrandDot />
      {siteName}
    </span>
  );
}
