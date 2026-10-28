import type {
  DashboardApp,
  DashboardUser,
  Ticket,
  Workspace,
  WorkspacePlanKey,
  WorkspaceSummary,
} from "./types";

export const mockUser: DashboardUser = {
  id: "user-1",
  name: "John",
  email: "john@example.com",
};

const stockbot: DashboardApp = {
  id: "app_stockbot",
  name: "stockbot-powered-by-groq",
  slug: "stockbot-powered-by-groq",
  status: "active",
  apiKeyId: "key_stockbot_live",
  icon: "SB",
  color: "bg-emerald-500",
  description: "AI-powered stock analysis bot",
  createdAt: "2025-11-12T00:00:00.000Z",
};

const emailWorker: DashboardApp = {
  id: "app_email_worker",
  name: "email-worker",
  slug: "email-worker",
  status: "active",
  apiKeyId: "key_email_worker_live",
  icon: "EW",
  color: "bg-blue-500",
  description: "Background email processing service",
  createdAt: "2025-12-01T00:00:00.000Z",
};

const webhookDispatcher: DashboardApp = {
  id: "app_webhook_dispatcher",
  name: "webhook-dispatcher",
  slug: "webhook-dispatcher",
  status: "active",
  apiKeyId: "key_webhook_dispatcher_live",
  icon: "WD",
  color: "bg-violet-500",
  description: "Reliable webhook delivery system",
  createdAt: "2026-01-15T00:00:00.000Z",
};

const personalStockbot: DashboardApp = {
  id: "app_stockbot_personal",
  name: "stockbot-powered-by-groq",
  slug: "stockbot-powered-by-groq",
  status: "active",
  apiKeyId: "key_stockbot_personal_live",
  icon: "SB",
  color: "bg-emerald-500",
  description: "AI-powered stock analysis bot",
  createdAt: "2025-11-12T00:00:00.000Z",
};

const sandboxWorker: DashboardApp = {
  id: "app_sandbox_worker",
  name: "sandbox-worker",
  slug: "sandbox-worker",
  status: "active",
  apiKeyId: "key_sandbox_worker_live",
  icon: "SW",
  color: "bg-amber-500",
  description: "Scratch application for testing",
  createdAt: "2026-02-04T00:00:00.000Z",
};

/**
 * Enterprise workspace: multiple apps, multiple members, org-level billing.
 * This is the primary development scenario.
 */
export const mockEnterpriseWorkspace: Workspace = {
  id: "org_apalis_labs",
  name: "Apalis Labs",
  slug: "apalis-labs",
  plan: "Enterprise",
  members: [
    {
      id: "user-1",
      name: "John",
      email: "john@example.com",
      role: "owner",
    },
    {
      id: "user-2",
      name: "Mary",
      email: "mary@example.com",
      role: "admin",
    },
    {
      id: "user-3",
      name: "Peter",
      email: "peter@example.com",
      role: "member",
    },
  ],
  apps: [stockbot, emailWorker, webhookDispatcher],
  subscription: {
    orgId: "org_apalis_labs",
    plan: "Enterprise",
    status: "active",
    seats: 3,
    amount: 9900,
    currency: "USD",
    interval: "monthly",
    nextBillingDate: "2026-08-15",
    clerkSubscriptionId: "sub_apalis_enterprise",
  },
  createdAt: "2025-10-01T00:00:00.000Z",
};

/**
 * Pro workspace: one member, exactly one app, Pro org plan.
 */
export const mockProWorkspace: Workspace = {
  id: "org_john_pro",
  name: "John's Workspace",
  slug: "johns-workspace",
  plan: "Pro",
  members: [
    {
      id: "user-1",
      name: "John",
      email: "john@example.com",
      role: "owner",
    },
  ],
  apps: [personalStockbot],
  subscription: {
    orgId: "org_john_pro",
    plan: "Pro",
    status: "active",
    seats: 1,
    amount: 2900,
    currency: "USD",
    interval: "monthly",
    nextBillingDate: "2026-08-01",
    clerkSubscriptionId: "sub_john_pro",
  },
  createdAt: "2025-11-12T00:00:00.000Z",
};

/**
 * Free workspace: one member, one app, no paid subscription.
 */
export const mockFreeWorkspace: Workspace = {
  id: "org_john_sandbox",
  name: "John's Sandbox",
  slug: "johns-sandbox",
  plan: "Free",
  members: [
    {
      id: "user-1",
      name: "John",
      email: "john@example.com",
      role: "owner",
    },
  ],
  apps: [sandboxWorker],
  subscription: {
    orgId: "org_john_sandbox",
    plan: "Free",
    status: "active",
    seats: 1,
    amount: 0,
    currency: "USD",
    interval: "monthly",
    nextBillingDate: null,
  },
  createdAt: "2026-02-04T00:00:00.000Z",
};

export const mockWorkspaces: Record<WorkspacePlanKey, Workspace> = {
  free: mockFreeWorkspace,
  pro: mockProWorkspace,
  enterprise: mockEnterpriseWorkspace,
};

export const defaultMockWorkspace = mockEnterpriseWorkspace;

export const mockWorkspaceList: Workspace[] = [
  mockEnterpriseWorkspace,
  mockProWorkspace,
  mockFreeWorkspace,
];

export function getMockWorkspace(
  key: string | null | undefined
): Workspace {
  if (key === "free" || key === "pro" || key === "enterprise") {
    return mockWorkspaces[key];
  }

  return defaultMockWorkspace;
}

export function getWorkspaceSummary(
  workspace: Workspace
): WorkspaceSummary {
  return {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    plan: workspace.plan,
    imageUrl: workspace.imageUrl,
  };
}

export function getAppById(
  workspace: Workspace,
  appId: string
): DashboardApp | undefined {
  return workspace.apps.find((app) => app.id === appId);
}

export function getWorkspaceTickets(workspace: Workspace): Ticket[] {
  return mockTickets.filter((ticket) => ticket.orgId === workspace.id);
}

export function getTicketsByAppId(
  workspace: Workspace,
  appId: string
): Ticket[] {
  return getWorkspaceTickets(workspace).filter(
    (ticket) => ticket.appId === appId
  );
}

/**
 * A masked key preview for the UI. The real secret is only returned once by
 * Clerk when a key is created or rotated; it is never stored in app metadata.
 */
export function getApiKeyPreview(app: DashboardApp): string | undefined {
  if (!app.apiKeyId) return undefined;

  return `apk_live_${app.apiKeyId.slice(-4)}••••••••`;
}

export const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    orgId: "org_apalis_labs",
    appId: "app_stockbot",
    subject: "API rate limit exceeded",
    description: "Getting 429 errors during peak hours.",
    status: "open",
    priority: "high",
    createdAt: "2026-07-05",
    updatedAt: "2026-07-05",
  },
  {
    id: "TKT-002",
    orgId: "org_apalis_labs",
    appId: "app_stockbot",
    subject: "Webhook delivery delay",
    description: "Webhooks are delayed by 30+ seconds.",
    status: "in_progress",
    priority: "medium",
    createdAt: "2026-07-03",
    updatedAt: "2026-07-06",
  },
  {
    id: "TKT-003",
    orgId: "org_apalis_labs",
    appId: "app_email_worker",
    subject: "Upgrade to Pro plan",
    description: "Need help upgrading from Free to Pro.",
    status: "resolved",
    priority: "low",
    createdAt: "2026-06-28",
    updatedAt: "2026-07-01",
  },
  {
    id: "TKT-004",
    orgId: "org_apalis_labs",
    appId: "app_webhook_dispatcher",
    subject: "Duplicate webhook deliveries",
    description: "Some events are delivered twice after a retry.",
    status: "open",
    priority: "high",
    createdAt: "2026-07-07",
    updatedAt: "2026-07-07",
  },
  {
    id: "TKT-101",
    orgId: "org_john_pro",
    appId: "app_stockbot_personal",
    subject: "Dashboard shows stale usage",
    description: "Usage figures have not refreshed since yesterday.",
    status: "open",
    priority: "medium",
    createdAt: "2026-07-08",
    updatedAt: "2026-07-08",
  },
];
