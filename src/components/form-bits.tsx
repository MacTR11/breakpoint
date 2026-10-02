export const field = "field";
export const label = "block text-sm font-medium";
export const hint = "block font-normal text-muted";

export function FormErrors({ state }: { state: { errors: string[] } | null }) {
  if (!state?.errors.length) return null;
  return (
    <div role="alert" className="border-y border-fail py-3 text-sm text-fail">
      <p className="font-semibold">Not saved</p>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        {state.errors.map((error) => (
          <li key={error} className="whitespace-pre-wrap">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
}
