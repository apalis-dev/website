"use server";

import { revalidatePath } from "next/cache";

import type { DashboardApp } from "@/lib/dashboard/types";
import {
  createWorkspaceApp,
  deleteWorkspaceApp,
  updateWorkspaceApp,
  type CreateAppInput,
  type UpdateAppInput,
} from "@/lib/workspace/mutations";

export type CreateAppResult =
  | { ok: true; app: DashboardApp }
  | { ok: false; error: string };

export type UpdateAppResult =
  | { ok: true; app: DashboardApp }
  | { ok: false; error: string };

export type DeleteAppResult = { ok: true } | { ok: false; error: string };

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Try again.";
}

export async function createAppAction(
  input: CreateAppInput
): Promise<CreateAppResult> {
  try {
    const app = await createWorkspaceApp(input);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/apps");

    return { ok: true, app };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function updateAppAction(
  input: UpdateAppInput
): Promise<UpdateAppResult> {
  try {
    const app = await updateWorkspaceApp(input);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/apps");
    revalidatePath(`/dashboard/apps/${app.id}`);

    return { ok: true, app };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

export async function deleteAppAction(
  appId: string
): Promise<DeleteAppResult> {
  try {
    await deleteWorkspaceApp(appId);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/apps");
    revalidatePath(`/dashboard/apps/${appId}`);

    return { ok: true };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}
