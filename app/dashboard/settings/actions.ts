"use server";

import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  isClerkAPIResponseError,
  type ClerkAPIResponseError,
} from "@clerk/nextjs/errors";

export type DeleteAccountResult =
  | { ok: true }
  | { ok: false; error: string };

export type DeleteWorkspaceResult =
  | { ok: true }
  | { ok: false; error: string };

function getErrorMessage(error: unknown): string {
  if (isClerkAPIResponseError(error)) {
    const clerkError = error as ClerkAPIResponseError;

    return (
      clerkError.errors?.[0]?.longMessage ??
      clerkError.errors?.[0]?.message ??
      "The request to Clerk failed."
    );
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Try again.";
}

function isAdminRole(role: string): boolean {
  return role === "org:admin" || role === "org:owner";
}

/**
 * Deletes the signed-in user. A user can only be deleted when they are not the
 * last admin of a workspace that still has other members. Subscriptions are
 * owned by the workspace (Clerk organization), so account deletion must never
 * cancel a shared plan on its own.
 */
export async function deleteAccountAction(): Promise<DeleteAccountResult> {
  const { userId } = await auth();

  if (!userId) {
    return { ok: false, error: "Please sign in to delete your account." };
  }

  try {
    const client = await clerkClient();
    const { data: memberships } =
      await client.users.getOrganizationMembershipList({
        userId,
        limit: 100,
      });

    const adminOrganizations = memberships.filter((membership) =>
      isAdminRole(membership.role)
    );
    const blockedWorkspaces: string[] = [];

    for (const membership of adminOrganizations) {
      const { data: organizationMembers } =
        await client.organizations.getOrganizationMembershipList({
          organizationId: membership.organization.id,
          limit: 100,
        });
      const otherMembers = organizationMembers.filter(
        (member) => member.publicUserData?.userId !== userId
      );

      if (
        otherMembers.length > 0 &&
        !otherMembers.some((member) => isAdminRole(member.role))
      ) {
        blockedWorkspaces.push(membership.organization.name);
      }
    }

    if (blockedWorkspaces.length > 0) {
      return {
        ok: false,
        error: `You are the last admin of ${blockedWorkspaces.join(
          ", "
        )}. Add another admin or delete the workspace before deleting your account.`,
      };
    }

    await client.users.deleteUser(userId);

    return { ok: true };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

/**
 * Deletes the active workspace and ends its subscription immediately.
 * Workspace deletion is the only place a shared workspace subscription is
 * cancelled. Only the workspace creator (owner) can perform this action.
 */
export async function deleteWorkspaceAction(): Promise<DeleteWorkspaceResult> {
  const { userId, orgId } = await auth();

  if (!userId) {
    return { ok: false, error: "Please sign in to delete this workspace." };
  }

  if (!orgId) {
    return { ok: false, error: "Choose a workspace first." };
  }

  try {
    const client = await clerkClient();
    const organization = await client.organizations.getOrganization({
      organizationId: orgId,
      includeMembersCount: true,
    });

    if (organization.createdBy !== userId) {
      return {
        ok: false,
        error: "Only the workspace owner can delete this workspace.",
      };
    }

    const subscription = await client.billing
      .getOrganizationBillingSubscription(orgId)
      .catch((error: unknown) => {
        if (
          isClerkAPIResponseError(error) &&
          (error as ClerkAPIResponseError).status === 404
        ) {
          return null;
        }

        throw error;
      });

    if (subscription) {
      const activeItems = subscription.subscriptionItems.filter(
        (item) => item.status === "active" || item.status === "past_due"
      );

      // End the subscription now. Deleting the organization first would leave
      // an orphaned Stripe subscription that continues to bill the owner.
      for (const item of activeItems) {
        await client.billing.cancelSubscriptionItem(item.id, {
          endNow: true,
        });
      }
    }

    await client.organizations.deleteOrganization(orgId);
    revalidatePath("/", "layout");

    return { ok: true };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}
