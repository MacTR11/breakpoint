import { BrandDot } from "@/components/brand-dot";
import { siteName } from "@/lib/config";

/**
 * The mark: a breakpoint, the red dot an editor puts in the gutter. Each
 * letter of the name is its own element, which an Easter egg makes use of
 * (src/components/easter-eggs.tsx).
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display font-extrabold tracking-tight ${className}`}>
      <BrandDot />
      <span data-wordmark aria-label={siteName} role="img">
        {[...siteName].map((letter, index) => (
          <span key={index} className="letter" aria-hidden="true">
            {letter === " " ? " " : letter}
          </span>
        ))}
      </span>
    </span>
  );
}
