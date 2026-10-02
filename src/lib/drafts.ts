// Unsubmitted code, kept per problem in this browser so a refresh doesn't lose
// work. Falls back to memory when localStorage is unavailable (private windows,
// locked-down school browsers).
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

export function readDraft(key: string): string | null {
  const held = memory.get(key);
  if (held !== undefined) return held;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeDraft(key: string, value: string) {
  memory.set(key, value);
  try {
    localStorage.setItem(key, value);
  } catch {}
  listeners.forEach((listener) => listener());
}

export function subscribeToDrafts(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
