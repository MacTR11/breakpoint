"use server";

import { AuthError, CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

// React clears the form when the action finishes, so the username is handed back to refill it.
export type SignInState = { error: string; username: string } | null;

export async function signInAction(_previous: SignInState, formData: FormData): Promise<SignInState> {
  const username = String(formData.get("username") ?? "").trim();
  try {
    await signIn("credentials", { username, password: String(formData.get("password") ?? ""), redirect: false });
  } catch (error) {
    if (!(error instanceof AuthError)) throw error;
    const locked = error instanceof CredentialsSignin && error.code === "locked";
    return {
      username,
      error: locked ? "Too many wrong attempts for that username. Wait a few minutes, then try again." : "That username and password do not match. Check for capital letters in the password.",
    };
  }
  // Redirect by path, so it works whatever address the site was opened at
  // (localhost, the computer's network address, or a real domain).
  redirect("/");
}
