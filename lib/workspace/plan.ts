import type {
  SubscriptionStatus,
  WorkspacePlan,
} from "@/lib/dashboard/types";

/**
 * Clerk Billing is the source of truth for a workspace's plan. The free plan
 * is named `free_org`; the Enterprise plan was originally created with the
 * `enterpise` slug, so both spellings are treated as Enterprise until the
 * dashboard plan is renamed.
 */
const PLAN_BY_SLUG: Record<string, WorkspacePlan> = {
  free: "Free",
  free_org: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
  enterpise: "Enterprise",
};

const PLAN_BY_NAME: Record<string, WorkspacePlan> = {
  free: "Free",
  pro: "Pro",
  enterprise: "Enterprise",
  enterpise: "Enterprise",
};

interface PlanIdentity {
  slug?: string | null;
  name?: string | null;
}

export function isKnownPlanSlug(slug: string | null | undefined): boolean {
  if (!slug) return false;
  return Boolean(PLAN_BY_SLUG[slug.trim().toLowerCase()]);
}

export function resolveWorkspacePlan({
  slug,
  name,
}: PlanIdentity): WorkspacePlan {
  const normalizedSlug = slug?.trim().toLowerCase();
  const normalizedName = name?.trim().toLowerCase();

  if (normalizedSlug && PLAN_BY_SLUG[normalizedSlug]) {
    return PLAN_BY_SLUG[normalizedSlug];
  }

  if (normalizedName && PLAN_BY_NAME[normalizedName]) {
    return PLAN_BY_NAME[normalizedName];
  }

  return "Free";
}

export function isPaidPlan(plan: WorkspacePlan): boolean {
  return plan !== "Free";
}

interface SubscriptionItemIdentity {
  status?: string | null;
  plan?: {
    slug?: string | null;
    name?: string | null;
    isDefault?: boolean;
    fee?: { amount?: number } | null;
  } | null;
}

/**
 * The default Free plan item cannot be canceled through Clerk Billing. When a
 * workspace is deleted we only need to end paid items; the Free item goes away
 * with the organization.
 */
export function isCancelablePaidSubscriptionItem(
  item: SubscriptionItemIdentity
): boolean {
  if (item.status !== "active" && item.status !== "past_due") {
    return false;
  }

  if (item.plan?.isDefault) {
    return false;
  }

  if ((item.plan?.fee?.amount ?? 0) > 0) {
    return true;
  }

  return (
    resolveWorkspacePlan({
      slug: item.plan?.slug,
      name: item.plan?.name,
    }) !== "Free"
  );
}

export function mapSubscriptionStatus(
  status: string | null | undefined
): SubscriptionStatus {
  switch (status) {
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
    case "ended":
    case "abandoned":
      return "cancelled";
    case "incomplete":
      return "past_due";
    default:
      return "active";
  }
}
