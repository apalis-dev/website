import Database from "better-sqlite3";

const database = new Database("./sqlite.db");

export type StoredSubscription = {
  plan: string;
  status: string;
  currency: string;
  interval: "monthly" | "annually";
  latestReference: string;
  paystackSubscriptionCode: string | null;
  paystackEmailToken: string | null;
};

export type StoredTransaction = {
  reference: string;
  amount: number;
  currency: string;
  paidAt: string | null;
};

database.exec(`
  CREATE TABLE IF NOT EXISTS billing_transactions (
    reference TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL,
    paid_at TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS billing_subscriptions (
    user_id TEXT PRIMARY KEY,
    plan TEXT NOT NULL,
    status TEXT NOT NULL,
    currency TEXT NOT NULL,
    interval TEXT NOT NULL,
    latest_reference TEXT NOT NULL,
    paystack_subscription_code TEXT,
    paystack_email_token TEXT,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

function ensureSubscriptionColumn(name: string) {
  const columns = database
    .prepare("PRAGMA table_info(billing_subscriptions)")
    .all() as { name: string }[];

  if (!columns.some((column) => column.name === name)) {
    database.exec(`ALTER TABLE billing_subscriptions ADD COLUMN ${name} TEXT`);
  }
}

ensureSubscriptionColumn("paystack_subscription_code");
ensureSubscriptionColumn("paystack_email_token");

export function recordSuccessfulPayment({
  reference,
  userId,
  amount,
  currency,
  paidAt,
  interval,
  subscriptionCode,
  emailToken,
}: {
  reference: string;
  userId: string;
  amount: number;
  currency: string;
  paidAt: string | null;
  interval: "monthly" | "annually";
  subscriptionCode?: string;
  emailToken?: string;
}) {
  if (currency !== "KES") {
    throw new Error("Only KES subscriptions are supported.");
  }

  const save = database.transaction(() => {
    database
      .prepare(
        `INSERT INTO billing_transactions (reference, user_id, status, amount, currency, paid_at)
         VALUES (?, ?, 'success', ?, ?, ?)
         ON CONFLICT(reference) DO UPDATE SET
           status = excluded.status,
           amount = excluded.amount,
           currency = excluded.currency,
           paid_at = excluded.paid_at`
      )
      .run(reference, userId, amount, currency, paidAt);

    database
      .prepare(
        `INSERT INTO billing_subscriptions
          (user_id, plan, status, currency, interval, latest_reference, paystack_subscription_code, paystack_email_token, updated_at)
         VALUES (?, 'Pro', 'active', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id) DO UPDATE SET
           plan = excluded.plan,
           status = excluded.status,
           currency = excluded.currency,
           interval = excluded.interval,
           latest_reference = excluded.latest_reference,
           paystack_subscription_code = COALESCE(excluded.paystack_subscription_code, billing_subscriptions.paystack_subscription_code),
           paystack_email_token = COALESCE(excluded.paystack_email_token, billing_subscriptions.paystack_email_token),
           updated_at = CURRENT_TIMESTAMP`
      )
      .run(userId, currency, interval, reference, subscriptionCode ?? null, emailToken ?? null);
  });

  save();
}

export function findSubscriptionByPaystackCode(subscriptionCode: string) {
  return database
    .prepare("SELECT user_id as userId FROM billing_subscriptions WHERE paystack_subscription_code = ?")
    .get(subscriptionCode) as { userId: string } | undefined;
}

export function updateSubscriptionStatus(userId: string, status: string) {
  database
    .prepare(
      "UPDATE billing_subscriptions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?"
    )
    .run(status, userId);
}

export function getBillingSummary(userId: string) {
  const subscription = database
    .prepare(
      `SELECT
        plan,
        status,
        currency,
        interval,
        latest_reference as latestReference,
        paystack_subscription_code as paystackSubscriptionCode,
        paystack_email_token as paystackEmailToken
       FROM billing_subscriptions
       WHERE user_id = ?`
    )
    .get(userId) as StoredSubscription | undefined;

  const transactions = database
    .prepare(
      `SELECT
        reference,
        amount,
        currency,
        paid_at as paidAt
       FROM billing_transactions
       WHERE user_id = ? AND status = 'success'
       ORDER BY COALESCE(paid_at, created_at) DESC`
    )
    .all(userId) as StoredTransaction[];

  return { subscription, transactions };
}
