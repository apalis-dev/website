export type WorkspacePlan = "Free" | "Pro" | "Enterprise";

export type WorkspacePlanKey = "free" | "pro" | "enterprise";

export type AppStatus = "active" | "inactive" | "pending";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "cancelled"
  | "non-renewing";

/**
 * An application belongs to exactly one workspace (Clerk organization).
 * Plan, billing, and API-key secrets are intentionally not stored here.
 */
export interface DashboardApp {
  id: string;
  name: string;
  slug: string;
  status: AppStatus;
  apiKeyId?: string;
  icon: string;
  color: string;
  description?: string;
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  avatar?: string;
}

/**
 * Org-level subscription. There is no per-app subscription.
 * `orgId` is the Clerk organization ID.
 */
export interface WorkspaceSubscription {
  orgId: string;
  plan: WorkspacePlan;
  status: SubscriptionStatus;
  seats: number;
  amount: number;
  currency: string;
  interval: "monthly" | "yearly";
  nextBillingDate: string | null;
  clerkSubscriptionId?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: WorkspacePlan;
  members: WorkspaceMember[];
  apps: DashboardApp[];
  subscription: WorkspaceSubscription;
  createdAt: string;
  imageUrl?: string;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  plan: WorkspacePlan;
  imageUrl?: string;
}

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export interface Ticket {
  id: string;
  orgId: string;
  appId: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
}

/**
 * Safe API-key view model. The secret is never part of this type.
 * Use a one-time response from create/rotate for the full secret.
 */
export interface AppApiKey {
  id: string;
  appId: string;
  preview: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
