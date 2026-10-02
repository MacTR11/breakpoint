"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { signIn } from "@/auth";

// React clears the form when the action finishes, so the username is handed back to refill it.
export type SignInState = { error: string; username: string } | null;

export async function signInAction(_previous: SignInState, formData: FormData): Promise<SignInState> {
  const username = String(formData.get("username") ?? "").trim();
  try {
    await signIn("credentials", { username, password: String(formData.get("password") ?? ""), redirectTo: "/" });
  } catch (error) {
    // A successful sign-in leaves by throwing a redirect, which must carry on.
    if (!(error instanceof AuthError)) throw error;
    const locked = error instanceof CredentialsSignin && error.code === "locked";
    return {
      username,
      error: locked ? "Too many wrong attempts for that username. Wait a few minutes, then try again." : "That username and password do not match. Check for capital letters in the password.",
    };
  }
  return null;
}
