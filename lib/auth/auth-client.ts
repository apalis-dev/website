import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const useSession = authClient.useSession;

export const signInWithEmail = async (email: string, password: string) => {
  return await authClient.signIn.email({
    email,
    password,
  });
};

export const signUpWithEmail = async (email: string, password: string) => {
  return await authClient.signUp.email({
    email,
    password,
    name: email.split("@")[0],
  });
};

export const signInWithGithub = async () => {
  return await authClient.signIn.social({
    provider: "github",
    callbackURL: "/dashboard/apps",
  });
};

export const signOut = async () => {
  await authClient.signOut();
};
