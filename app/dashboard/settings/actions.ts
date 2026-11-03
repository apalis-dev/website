"use server";

import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  isClerkAPIResponseError,
  type ClerkAPIResponseError,
} from "@clerk/nextjs/errors";

import { isCancelablePaidSubscriptionItem } from "@/lib/workspace/plan";

export type DeleteAccountResult =
  | { ok: true }
  | { ok: false; error: string };

export type DeleteWorkspaceResult =
  | { ok: true }
  | { ok: false; error: string };

export type InviteWorkspaceMemberResult =
  | { ok: true }
  | { ok: false; error: string };

export type RemoveWorkspaceMemberResult =
  | { ok: true }
  | { ok: false; error: string };

export type RevokeWorkspaceInvitationResult =
  | { ok: true }
  | { ok: false; error: string };

type ClerkBackendClient = Awaited<ReturnType<typeof clerkClient>>;

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

function isAdminRole(role: string | null | undefined): boolean {
  return Boolean(
    role &&
      (role === "org:admin" ||
        role === "org:owner" ||
        role.endsWith(":admin"))
  );
}

async function cancelPaidSubscriptionItems(
  client: ClerkBackendClient,
  organizationId: string
): Promise<void> {
  const subscription = await client.billing
    .getOrganizationBillingSubscription(organizationId)
    .catch((error: unknown) => {
      if (
        isClerkAPIResponseError(error) &&
        (error as ClerkAPIResponseError).status === 404
      ) {
        return null;
      }

      throw error;
    });

  if (!subscription) return;

  const cancelableItems = subscription.subscriptionItems.filter(
    isCancelablePaidSubscriptionItem
  );

  for (const item of cancelableItems) {
    await client.billing.cancelSubscriptionItem(item.id, { endNow: true });
  }
}

async function getOrganizationMemberships(
  client: ClerkBackendClient,
  organizationId: string
) {
  const { data } = await client.organizations.getOrganizationMembershipList({
    organizationId,
    limit: 100,
  });

  return data;
}

/**
 * Deletes the signed-in user.
 *
 * Workspace ownership is tied to Clerk's immutable `createdBy` field, so a
 * shared workspace owned by this user must be deleted explicitly before the
 * account can be removed. Otherwise the organization would be left without an
 * owner and its subscription would keep billing.
 *
 * Workspaces where this user is the only member are personal workspaces. They
 * are deleted with the account, and any paid subscription is ended immediately.
 * Shared subscriptions are never canceled by this action.
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

    const ownedSharedWorkspaces: string[] = [];
    const lastAdminWorkspaces: string[] = [];
    const personalWorkspaceIds: string[] = [];

    for (const membership of memberships) {
      const organization = membership.organization;
      const organizationMembers = await getOrganizationMemberships(
        client,
        organization.id
      );
      const memberCount = organization.membersCount ?? organizationMembers.length;

      if (memberCount <= 1) {
        personalWorkspaceIds.push(organization.id);
        continue;
      }

      if (organization.createdBy === userId) {
        ownedSharedWorkspaces.push(organization.name);
        continue;
      }

      if (!isAdminRole(membership.role)) {
        continue;
      }

      const otherMembers = organizationMembers.filter(
        (member) => member.publicUserData?.userId !== userId
      );

      if (!otherMembers.some((member) => isAdminRole(member.role))) {
        lastAdminWorkspaces.push(organization.name);
      }
    }

    if (ownedSharedWorkspaces.length > 0 || lastAdminWorkspaces.length > 0) {
      const problems: string[] = [];

      if (ownedSharedWorkspaces.length > 0) {
        problems.push(
          `You own ${ownedSharedWorkspaces.join(
            ", "
          )}. Delete the workspace before deleting your account.`
        );
      }

      if (lastAdminWorkspaces.length > 0) {
        problems.push(
          `You are the last admin of ${lastAdminWorkspaces.join(
            ", "
          )}. Add another admin before deleting your account.`
        );
      }

      return { ok: false, error: problems.join(" ") };
    }

    // Personal workspaces have no other members to protect. Delete them with
    // the account so their subscription cannot outlive the payer.
    for (const organizationId of personalWorkspaceIds) {
      await cancelPaidSubscriptionItems(client, organizationId);
      await client.organizations.deleteOrganization(organizationId);
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

    // End paid items now. Deleting the organization first would leave an
    // orphaned Stripe subscription that continues to bill the owner. The
    // default Free item cannot be canceled and goes away with the org.
    await cancelPaidSubscriptionItems(client, orgId);

    await client.organizations.deleteOrganization(orgId);
    revalidatePath("/", "layout");

    return { ok: true };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

/**
 * Sends a workspace invitation. Shared Enterprise subscriptions stay intact;
 * members join the existing billing context instead of creating their own.
 */
export async function inviteWorkspaceMemberAction(input: {
  emailAddress: string;
  role: "org:member" | "org:admin";
}): Promise<InviteWorkspaceMemberResult> {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    return { ok: false, error: "Please sign in to invite members." };
  }

  if (!orgId) {
    return { ok: false, error: "Choose a workspace first." };
  }

  if (!isAdminRole(orgRole)) {
    return { ok: false, error: "Only workspace admins can invite members." };
  }

  try {
    const client = await clerkClient();
    await client.organizations.createOrganizationInvitation({
      organizationId: orgId,
      inviterUserId: userId,
      emailAddress: input.emailAddress,
      role: input.role,
    });

    return { ok: true };
  } catch (error) {
    if (isClerkAPIResponseError(error) && error.status === 402) {
      return {
        ok: false,
        error:
          "This workspace has no seats available. Increase the purchased seats or revoke a pending invitation.",
      };
    }

    return { ok: false, error: getErrorMessage(error) };
  }
}

/**
 * Removes a workspace member without touching the workspace subscription.
 * Admins can remove regular members; only the workspace owner can remove
 * another admin. The owner's own membership is never removable.
 */
export async function removeWorkspaceMemberAction(input: {
  userId: string;
}): Promise<RemoveWorkspaceMemberResult> {
  const { userId: currentUserId, orgId } = await auth();

  if (!currentUserId) {
    return { ok: false, error: "Please sign in first." };
  }

  if (!orgId) {
    return { ok: false, error: "Choose a workspace first." };
  }

  if (input.userId === currentUserId) {
    return { ok: false, error: "You can't remove your own membership." };
  }

  try {
    const client = await clerkClient();
    const organization = await client.organizations.getOrganization({
      organizationId: orgId,
    });
    const memberships = await getOrganizationMemberships(client, orgId);
    const currentMembership = memberships.find(
      (membership) =>
        membership.publicUserData?.userId === currentUserId
    );
    const targetMembership = memberships.find(
      (membership) => membership.publicUserData?.userId === input.userId
    );

    if (!currentMembership || !isAdminRole(currentMembership.role)) {
      return {
        ok: false,
        error: "Only workspace admins can remove members.",
      };
    }

    if (!targetMembership) {
      return {
        ok: false,
        error: "That person is not a member of this workspace.",
      };
    }

    if (input.userId === organization.createdBy) {
      return {
        ok: false,
        error: "The workspace owner can't be removed.",
      };
    }

    if (
      isAdminRole(targetMembership.role) &&
      organization.createdBy !== currentUserId
    ) {
      return {
        ok: false,
        error: "Only the workspace owner can remove admins.",
      };
    }

    await client.organizations.deleteOrganizationMembership({
      organizationId: orgId,
      userId: input.userId,
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}

/**
 * Revokes a pending invitation, freeing the seat it reserved.
 */
export async function revokeWorkspaceInvitationAction(input: {
  invitationId: string;
}): Promise<RevokeWorkspaceInvitationResult> {
  const { userId, orgId } = await auth();

  if (!userId) {
    return { ok: false, error: "Please sign in first." };
  }

  if (!orgId) {
    return { ok: false, error: "Choose a workspace first." };
  }

  try {
    const client = await clerkClient();
    const memberships = await getOrganizationMemberships(client, orgId);
    const currentMembership = memberships.find(
      (membership) => membership.publicUserData?.userId === userId
    );

    if (!currentMembership || !isAdminRole(currentMembership.role)) {
      return {
        ok: false,
        error: "Only workspace admins can revoke invitations.",
      };
    }

    await client.organizations.revokeOrganizationInvitation({
      organizationId: orgId,
      invitationId: input.invitationId,
      requestingUserId: userId,
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, error: getErrorMessage(error) };
  }
}
