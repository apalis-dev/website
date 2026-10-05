import { createHmac, timingSafeEqual } from "crypto";

const PAYSTACK_API_URL = "https://api.paystack.co";

export type BillingInterval = "monthly" | "annually";

type PaystackResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

type InitializedTransaction = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export type VerifiedTransaction = {
  id: number;
  status: string;
  reference: string;
  amount: number;
  currency: string;
  paid_at: string | null;
  metadata?: { userId?: string; interval?: BillingInterval };
  plan?: string | PaystackPlan;
  plan_object?: PaystackPlan | null;
  subscription?: PaystackSubscription | null;
};

export type PaystackPlan = {
  plan_code: string;
  amount: number;
  currency: string;
  interval: string;
};

export type PaystackSubscription = {
  subscription_code?: string;
  email_token?: string;
  status?: string;
};

function requiredEnvironment(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function getProPlanCode(interval: BillingInterval) {
  return requiredEnvironment(
    interval === "monthly"
      ? "PAYSTACK_PLAN_PRO_MONTHLY_KES"
      : "PAYSTACK_PLAN_PRO_ANNUAL_KES"
  );
}

function getAppUrl() {
  return requiredEnvironment("APP_URL").replace(/\/$/, "");
}

async function paystackFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${PAYSTACK_API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${requiredEnvironment("PAYSTACK_SECRET_KEY")}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as PaystackResponse<T>;

  if (!response.ok || !payload.status) {
    throw new Error(
      payload.message || "Paystack could not complete the request."
    );
  }

  return payload.data;
}

export async function initializeProSubscription({
  email,
  userId,
  interval,
}: {
  email: string;
  userId: string;
  interval: BillingInterval;
}) {
  return paystackFetch<InitializedTransaction>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email,
      plan: getProPlanCode(interval),
      currency: "KES",
      // Recurring Paystack subscriptions require a reusable card authorization.
      // M-PESA and other Kenyan payment methods cannot be used for this flow.
      channels: ["card"],
      callback_url: `${getAppUrl()}/billing/callback`,
      metadata: {
        userId,
        plan: "pro",
        interval,
        currency: "KES",
      },
    }),
  });
}

export async function verifyTransaction(reference: string) {
  return paystackFetch<VerifiedTransaction>(
    `/transaction/verify/${encodeURIComponent(reference)}`
  );
}

export async function getProPlan(interval: BillingInterval) {
  return paystackFetch<PaystackPlan>(
    `/plan/${encodeURIComponent(getProPlanCode(interval))}`
  );
}

export async function validateProPayment(
  transaction: VerifiedTransaction,
  interval: BillingInterval
) {
  const plan = await getProPlan(interval);
  const transactionPlan =
    typeof transaction.plan === "string"
      ? transaction.plan
      : transaction.plan?.plan_code ?? transaction.plan_object?.plan_code;

  return (
    transaction.status === "success" &&
    transaction.currency === "KES" &&
    plan.currency === "KES" &&
    transactionPlan === plan.plan_code &&
    transaction.amount === plan.amount
  );
}

export async function disableSubscription({
  subscriptionCode,
  emailToken,
}: {
  subscriptionCode: string;
  emailToken: string;
}) {
  return paystackFetch<{ status: string }>("/subscription/disable", {
    method: "POST",
    body: JSON.stringify({ code: subscriptionCode, token: emailToken }),
  });
}

export function isValidPaystackSignature(
  rawBody: string,
  signature: string | null
) {
  if (!signature) return false;

  const expected = createHmac(
    "sha512",
    requiredEnvironment("PAYSTACK_SECRET_KEY")
  )
    .update(rawBody)
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");

  return (
    expectedBuffer.length === signatureBuffer.length &&
    timingSafeEqual(expectedBuffer, signatureBuffer)
  );
}
