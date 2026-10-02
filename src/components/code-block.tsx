import { CodeLine } from "@/components/code-text";
import { CopyButton } from "@/components/copy-button";

/**
 * Python to read rather than edit: a file tab, syntax colours and, for
 * teachers, a Copy button (after Rare UI's code block). Students get no Copy
 * button: pasting a model answer back into the editor would be flagged.
 */
export function CodeBlock({ code, fileName, copy = false }: { code: string; fileName: string; copy?: boolean }) {
  return (
    <div className="overflow-hidden rounded-[14px] border border-line">
      <div className="flex items-center justify-between border-b border-line bg-paper px-3 py-1.5">
        <span className="font-mono text-[13px] text-muted">{fileName}</span>
        {copy && <CopyButton text={code} />}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-sm leading-6">
        {code.split("\n").map((line, index) => (
          <span key={index} className="block">
            <CodeLine line={line} />
            {line === "" && "​"}
          </span>
        ))}
      </pre>
    </div>
  );
}
