"use client";

import { useActionState } from "react";
import { signInAction } from "@/app/login/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(signInAction, null);
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm font-medium">
        Username
        <input name="username" required autoFocus defaultValue={state?.username} autoComplete="username" autoCapitalize="none" spellCheck={false} className="field" />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input name="password" type="password" required autoComplete="current-password" className="field" />
      </label>
      {state && (
        <p role="alert" className="rise text-sm text-fail">
          {state.error}
        </p>
      )}
      <button disabled={pending} className="btn btn-primary px-5 py-2.5 text-base">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
