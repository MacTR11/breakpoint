import { highlight } from "@/lib/highlight";

/** Python, syntax-coloured. One element per line so callers can style lines. */
export function CodeLine({ line }: { line: string }) {
  return (
    <>
      {highlight(line).map(([text, className], index) =>
        className ? (
          <span key={index} className={className}>
            {text}
          </span>
        ) : (
          text
        ),
      )}
    </>
  );
}
