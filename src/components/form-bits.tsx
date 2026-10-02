export const field = "field";
export const label = "block text-sm font-medium";
export const hint = "block font-normal text-muted";

export function FormErrors({ state }: { state: { errors: string[] } | null }) {
  if (!state?.errors.length) return null;
  return (
    <div role="alert" className="rounded-2xl border border-[#ff453a]/30 bg-[#ff453a]/12 px-5 py-4 text-sm text-[#a51d13]">
      <p className="font-semibold">Not saved yet</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {state.errors.map((error) => (
          <li key={error} className="whitespace-pre-wrap">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
}
