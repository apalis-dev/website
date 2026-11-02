import { cache } from "react";
import { redirect } from "next/navigation";
import {
  auth,
  clerkClient,
  type Organization,
  type OrganizationMembership,
} from "@clerk/nextjs/server";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

import type {
  DashboardApp,
  Workspace,
  WorkspaceMember,
  WorkspacePlan,
  WorkspaceSubscription,
  WorkspaceSummary,
} from "./types";
import {
  parseWorkspaceMetadata,
  toDashboardApp,
} from "@/lib/workspace/metadata";
import {
  isKnownPlanSlug,
  mapSubscriptionStatus,
  resolveWorkspacePlan,
} from "@/lib/workspace/plan";

interface BillingMoneyLike {
  amount?: number;
  currency?: string;
}

interface BillingPlanLike {
  slug?: string | null;
  name?: string | null;
  isDefault?: boolean;
  fee?: BillingMoneyLike | null;
}

interface BillingItemLike {
  status?: string;
  planPeriod?: "month" | "annual";
  plan?: BillingPlanLike | null;
  amount?: BillingMoneyLike | null;
  seats?: { quantity?: number | null } | null;
  periodEnd?: number | null;
  canceledAt?: number | null;
  nextPayment?: { date?: number } | null;
}

interface BillingSubscriptionLike {
  id?: string;
  status?: string;
  subscriptionItems?: readonly BillingItemLike[];
  nextPayment?: { date?: number } | null;
}

const MEMBERSHIP_PAGE_LIMIT = 100;

function toIsoDate(timestamp: number | null | undefined): string | null {
  if (!timestamp) return null;
  return new Date(timestamp).toISOString().slice(0, 10);
}

function getPrimarySubscriptionItem(
  subscription: BillingSubscriptionLike | null
): BillingItemLike | null {
  if (!subscription) return null;

  const items = subscription.subscriptionItems ?? [];
  const knownPlans = items.filter((item) =>
    isKnownPlanSlug(item.plan?.slug)
  );
  const candidates = knownPlans.length > 0 ? knownPlans : items;
  const primary =
    candidates.find((item) => item.plan?.isDefault) ??
    candidates.find((item) => item.status === "active") ??
    candidates[0];

  return primary ?? null;
}

function getPlanFromSubscription(
  subscription: BillingSubscriptionLike | null
): WorkspacePlan {
  const item = getPrimarySubscriptionItem(subscription);

  if (!item) return "Free";

  return resolveWorkspacePlan({
    slug: item.plan?.slug,
    name: item.plan?.name,
  });
}

function buildSubscription(
  orgId: string,
  plan: WorkspacePlan,
  subscription: BillingSubscriptionLike | null,
  memberCount: number
): WorkspaceSubscription {
  if (!subscription) {
    return {
      orgId,
      plan: "Free",
      status: "active",
      seats: 1,
      amount: 0,
      currency: "USD",
      interval: "monthly",
      nextBillingDate: null,
    };
  }

  const item = getPrimarySubscriptionItem(subscription);

  if (!item || plan === "Free") {
    return {
      orgId,
      plan: "Free",
      status: mapSubscriptionStatus(subscription.status),
      seats: 1,
      amount: 0,
      currency: "USD",
      interval: "monthly",
      nextBillingDate: null,
      clerkSubscriptionId: subscription.id,
    };
  }

  const seats =
    item.seats?.quantity ??
    (plan === "Enterprise" ? Math.max(memberCount, 1) : 1);
  const nextPaymentDate =
    subscription.nextPayment?.date ??
    item.nextPayment?.date ??
    item.periodEnd;
  const status: WorkspaceSubscription["status"] = item.canceledAt
    ? "non-renewing"
    : mapSubscriptionStatus(subscription.status);

  return {
    orgId,
    plan,
    status,
    seats,
    amount: item.amount?.amount ?? item.plan?.fee?.amount ?? 0,
    currency: item.amount?.currency || item.plan?.fee?.currency || "USD",
    interval: item.planPeriod === "annual" ? "yearly" : "monthly",
    nextBillingDate: toIsoDate(nextPaymentDate),
    clerkSubscriptionId: subscription.id,
  };
}

function toWorkspaceRole(
  role: string,
  isCreator: boolean
): WorkspaceMember["role"] {
  if (isCreator || role === "org:owner") return "owner";
  if (role === "org:admin" || role.endsWith(":admin")) return "admin";
  return "member";
}

function toWorkspaceMember(
  membership: OrganizationMembership,
  createdBy: string | undefined
): WorkspaceMember {
  const user = membership.publicUserData;
  const email = user?.identifier ?? user?.userId ?? membership.id;
  const name = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    id: user?.userId ?? membership.id,
    name: name || email,
    email,
    role: toWorkspaceRole(
      membership.role,
      Boolean(createdBy && user?.userId === createdBy)
    ),
    avatar: user?.imageUrl || undefined,
  };
}

function sortMembers(members: WorkspaceMember[]): WorkspaceMember[] {
  const rank: Record<WorkspaceMember["role"], number> = {
    owner: 0,
    admin: 1,
    member: 2,
  };

  return [...members].sort(
    (a, b) => rank[a.role] - rank[b.role] || a.name.localeCompare(b.name)
  );
}

const getOrganizationBilling = cache(
  async (organizationId: string): Promise<BillingSubscriptionLike | null> => {
    const client = await clerkClient();

    try {
      return await client.billing.getOrganizationBillingSubscription(
        organizationId
      );
    } catch (error) {
      // An organization without a subscription is a valid Free workspace.
      // Other billing failures should surface instead of silently downgrading
      // a paid workspace and applying the wrong app cap.
      if (isClerkAPIResponseError(error) && error.status === 404) {
        return null;
      }

      throw error;
    }
  }
);

const getOrganization = cache(
  async (organizationId: string): Promise<Organization> => {
    const client = await clerkClient();

    return client.organizations.getOrganization({
      organizationId,
      includeMembersCount: true,
    });
  }
);

const getOrganizationMemberships = cache(
  async (organizationId: string): Promise<OrganizationMembership[]> => {
    const client = await clerkClient();
    const { data } = await client.organizations.getOrganizationMembershipList({
      organizationId,
      limit: MEMBERSHIP_PAGE_LIMIT,
    });

    return data;
  }
);

export async function getOrganizationPlan(
  organizationId: string
): Promise<WorkspacePlan> {
  const subscription = await getOrganizationBilling(organizationId);

  return getPlanFromSubscription(subscription);
}

/**
 * Resolves the signed-in user's active Clerk organization into the dashboard
 * view model. Auth, org identity, app metadata and billing are read from
 * Clerk; no local database or mock workspace is involved.
 */
export const getDashboardWorkspace = cache(async (): Promise<Workspace> => {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error("A signed-in user is required to load a workspace.");
  }

  if (!orgId) {
    redirect("/select-workspace");
  }

  let organization: Organization;

  try {
    organization = await getOrganization(orgId);
  } catch (error) {
    // A stale session can point at an organization that no longer exists.
    if (isClerkAPIResponseError(error) && error.status === 404) {
      redirect("/select-workspace");
    }

    throw error;
  }

  const [memberships, subscription] = await Promise.all([
    getOrganizationMemberships(orgId),
    getOrganizationBilling(orgId),
  ]);

  const plan = getPlanFromSubscription(subscription);
  const members = sortMembers(
    memberships.map((membership) =>
      toWorkspaceMember(membership, organization.createdBy)
    )
  );
  const metadata = parseWorkspaceMetadata(organization.publicMetadata);
  const apps = Object.values(metadata.apps).map(toDashboardApp);

  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    plan,
    members,
    apps,
    subscription: buildSubscription(
      organization.id,
      plan,
      subscription,
      members.length
    ),
    createdAt: new Date(organization.createdAt * 1000).toISOString(),
    imageUrl: organization.imageUrl || undefined,
  };
});

/**
 * Lists the organizations the signed-in user belongs to. Used by the workspace
 * switcher and the no-active-organization selection screen.
 *
 * Reads pending sessions as signed-in: a user with an incomplete
 * `choose-organization` task still needs to see (and pick) their workspaces.
 */
export const getAvailableWorkspaces = cache(
  async (): Promise<WorkspaceSummary[]> => {
    const { userId } = await auth({ treatPendingAsSignedOut: false });

    if (!userId) return [];

    const client = await clerkClient();
    const { data } = await client.users.getOrganizationMembershipList({
      userId,
      limit: MEMBERSHIP_PAGE_LIMIT,
    });

    const workspaces = await Promise.all(
      data.map(async (membership): Promise<WorkspaceSummary> => {
        const organization = membership.organization;
        const subscription = await getOrganizationBilling(organization.id);

        return {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          plan: getPlanFromSubscription(subscription),
          imageUrl: organization.imageUrl || undefined,
        };
      })
    );

    return workspaces.sort((a, b) => a.name.localeCompare(b.name));
  }
);

export function getWorkspaceApp(
  workspace: Workspace,
  appId: string
): DashboardApp | undefined {
  return workspace.apps.find((app) => app.id === appId);
}
