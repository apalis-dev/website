export type AppPlan = "Free" | "Pro" | "Enterprise"

export type AppStatus = "active" | "inactive" | "pending"

export type SubscriptionStatus = "active" | "cancelled" | "past_due" | "trialing"

export interface DashboardApp {
  id: string
  name: string
  slug: string
  plan: AppPlan
  status: AppStatus
  apiKey: string
  icon: string
  color: string
  description?: string
  createdAt: string
}

export interface Subscription {
  appId: string
  plan: AppPlan
  status: SubscriptionStatus
  amount: number
  currency: string
  interval: "monthly" | "yearly"
  nextBillingDate: string
  paystackReference?: string
}

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high"

export interface Ticket {
  id: string
  appId: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: string
  updatedAt: string
}

export interface DashboardUser {
  id: string
  name: string
  email: string
  avatar?: string
}
