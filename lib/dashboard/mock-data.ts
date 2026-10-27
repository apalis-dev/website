import type {
  DashboardApp,
  DashboardUser,
  Subscription,
  Ticket,
} from "./types";

export const mockUser: DashboardUser = {
  id: "user-1",
  name: "John",
  email: "john@example.com",
};

export const mockApps: DashboardApp[] = [
  {
    id: "app-1",
    name: "stockbot-powered-by-groq",
    slug: "stockbot-powered-by-groq",
    plan: "Pro",
    status: "active",
    apiKey: "apk_live_7f3k9m2n8p1q4r6s",
    icon: "SB",
    color: "bg-emerald-500",
    description: "AI-powered stock analysis bot",
    createdAt: "2025-11-12",
  },
  {
    id: "app-2",
    name: "email-worker",
    slug: "email-worker",
    plan: "Free",
    status: "active",
    apiKey: "apk_live_2a8b4c6d9e1f3g5h",
    icon: "EW",
    color: "bg-blue-500",
    description: "Background email processing service",
    createdAt: "2025-12-01",
  },
  {
    id: "app-3",
    name: "webhook-dispatcher",
    slug: "webhook-dispatcher",
    plan: "Enterprise",
    status: "active",
    apiKey: "apk_live_9x2y4z6a8b0c2d4e",
    icon: "WD",
    color: "bg-violet-500",
    description: "Reliable webhook delivery system",
    createdAt: "2026-01-15",
  },
];

export const mockSubscriptions: Record<string, Subscription> = {
  "app-1": {
    appId: "app-1",
    plan: "Pro",
    status: "active",
    amount: 2900,
    currency: "USD",
    interval: "monthly",
    nextBillingDate: "2026-08-01",
    paystackReference: "PSK_ref_abc123",
  },
  "app-2": {
    appId: "app-2",
    plan: "Free",
    status: "active",
    amount: 0,
    currency: "USD",
    interval: "monthly",
    nextBillingDate: "—",
  },
  "app-3": {
    appId: "app-3",
    plan: "Enterprise",
    status: "active",
    amount: 9900,
    currency: "USD",
    interval: "monthly",
    nextBillingDate: "2026-08-15",
    paystackReference: "PSK_ref_xyz789",
  },
};

export const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    appId: "app-1",
    subject: "API rate limit exceeded",
    description: "Getting 429 errors during peak hours.",
    status: "open",
    priority: "high",
    createdAt: "2026-07-05",
    updatedAt: "2026-07-05",
  },
  {
    id: "TKT-002",
    appId: "app-1",
    subject: "Webhook delivery delay",
    description: "Webhooks are delayed by 30+ seconds.",
    status: "in_progress",
    priority: "medium",
    createdAt: "2026-07-03",
    updatedAt: "2026-07-06",
  },
  {
    id: "TKT-003",
    appId: "app-2",
    subject: "Upgrade to Pro plan",
    description: "Need help upgrading from Free to Pro.",
    status: "resolved",
    priority: "low",
    createdAt: "2026-06-28",
    updatedAt: "2026-07-01",
  },
];

export function getAppById(id: string): DashboardApp | undefined {
  return mockApps.find((app) => app.id === id);
}

export function getSubscriptionByAppId(
  appId: string
): Subscription | undefined {
  return mockSubscriptions[appId];
}

export function getTicketsByAppId(appId: string): Ticket[] {
  return mockTickets.filter((ticket) => ticket.appId === appId);
}
