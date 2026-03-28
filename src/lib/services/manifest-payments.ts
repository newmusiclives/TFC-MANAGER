// ---------------------------------------------------------------------------
// Manifest Financials Payment Service
// ---------------------------------------------------------------------------

const MANIFEST_API_KEY = process.env.MANIFEST_API_KEY || "your-key-here";
const MANIFEST_API_URL =
  process.env.MANIFEST_API_URL || "https://api.manifestfinancials.com/v1";
const MANIFEST_MERCHANT_ID =
  process.env.MANIFEST_MERCHANT_ID || "your-merchant-id-here";

const PLAN_PRICES: Record<string, number> = {
  starter: 0,
  pro: 3000, // $30.00 in cents
  business: 10000, // $100.00 in cents
};

function isMockMode(): boolean {
  return MANIFEST_API_KEY.includes("your-key-here");
}

function mockId(): string {
  return `mock_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

// ---------------------------------------------------------------------------
// Authenticated fetch helper
// ---------------------------------------------------------------------------

async function manifestRequest<T = unknown>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown
): Promise<T> {
  const url = `${MANIFEST_API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${MANIFEST_API_KEY}`,
    "Content-Type": "application/json",
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(
      `Manifest API error ${res.status}: ${errorBody}`
    );
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// createSubscription
// ---------------------------------------------------------------------------

export async function createSubscription(params: {
  userId: string;
  email: string;
  planId: string;
  amount?: number;
}) {
  const { userId, email, planId } = params;
  const amount = params.amount ?? PLAN_PRICES[planId] ?? 0;

  if (planId === "starter" || amount === 0) {
    return {
      manifestSubscriptionId: `free_${userId}`,
      status: "active",
      planId,
      amount: 0,
    };
  }

  if (isMockMode()) {
    return {
      manifestSubscriptionId: mockId(),
      status: "active",
      planId,
      amount,
      email,
      userId,
      createdAt: new Date().toISOString(),
    };
  }

  const data = await manifestRequest<{
    id: string;
    status: string;
    [key: string]: unknown;
  }>("/subscriptions", "POST", {
    merchantId: MANIFEST_MERCHANT_ID,
    customerEmail: email,
    planId,
    amount,
    currency: "USD",
    interval: "monthly",
    metadata: { userId },
  });

  return {
    ...data,
    manifestSubscriptionId: data.id,
    planId,
    amount,
  };
}

// ---------------------------------------------------------------------------
// cancelSubscription
// ---------------------------------------------------------------------------

export async function cancelSubscription(manifestSubscriptionId: string) {
  if (manifestSubscriptionId.startsWith("free_")) {
    return { status: "cancelled", manifestSubscriptionId };
  }

  if (isMockMode()) {
    return {
      manifestSubscriptionId,
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
    };
  }

  const data = await manifestRequest<{ status: string; [key: string]: unknown }>(
    `/subscriptions/${manifestSubscriptionId}/cancel`,
    "POST"
  );

  return { manifestSubscriptionId, ...data };
}

// ---------------------------------------------------------------------------
// processPayment (one-time, e.g. fan funding pledges)
// ---------------------------------------------------------------------------

export async function processPayment(params: {
  amount: number;
  currency?: string;
  description: string;
  recipientEmail: string;
}) {
  const { amount, currency = "USD", description, recipientEmail } = params;

  if (isMockMode()) {
    return {
      transactionId: mockId(),
      status: "succeeded",
      amount,
      currency,
      description,
      recipientEmail,
      createdAt: new Date().toISOString(),
    };
  }

  const data = await manifestRequest<{ id: string; status: string; [key: string]: unknown }>(
    "/payments",
    "POST",
    {
      merchantId: MANIFEST_MERCHANT_ID,
      amount,
      currency,
      description,
      recipientEmail,
    }
  );

  return {
    ...data,
    transactionId: data.id,
    amount,
    currency,
    description,
    recipientEmail,
  };
}

// ---------------------------------------------------------------------------
// createPayout (revenue splits to collaborators)
// ---------------------------------------------------------------------------

export async function createPayout(params: {
  recipientEmail: string;
  amount: number;
  currency?: string;
  description: string;
}) {
  const { recipientEmail, amount, currency = "USD", description } = params;

  if (isMockMode()) {
    return {
      payoutId: mockId(),
      status: "completed",
      recipientEmail,
      amount,
      currency,
      description,
      createdAt: new Date().toISOString(),
    };
  }

  const data = await manifestRequest<{ id: string; status: string; [key: string]: unknown }>(
    "/payouts",
    "POST",
    {
      merchantId: MANIFEST_MERCHANT_ID,
      recipientEmail,
      amount,
      currency,
      description,
    }
  );

  return {
    payoutId: data.id,
    recipientEmail,
    amount,
    currency,
    description,
    ...data,
  };
}

// ---------------------------------------------------------------------------
// getTransactionHistory
// ---------------------------------------------------------------------------

export async function getTransactionHistory(
  merchantId: string,
  params?: { limit?: number; offset?: number }
) {
  const limit = params?.limit ?? 50;
  const offset = params?.offset ?? 0;

  if (isMockMode()) {
    return {
      transactions: [],
      total: 0,
      limit,
      offset,
    };
  }

  const qs = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });

  return manifestRequest<{
    transactions: unknown[];
    total: number;
    limit: number;
    offset: number;
  }>(`/merchants/${merchantId}/transactions?${qs.toString()}`);
}

// ---------------------------------------------------------------------------
// createFundingCampaign
// ---------------------------------------------------------------------------

export async function createFundingCampaign(params: {
  title: string;
  goalAmount: number;
  userId: string;
}) {
  const { title, goalAmount, userId } = params;

  if (isMockMode()) {
    return {
      campaignId: mockId(),
      status: "active",
      title,
      goalAmount,
      raisedAmount: 0,
      userId,
      createdAt: new Date().toISOString(),
    };
  }

  const data = await manifestRequest<{ id: string; status: string; [key: string]: unknown }>(
    "/campaigns",
    "POST",
    {
      merchantId: MANIFEST_MERCHANT_ID,
      title,
      goalAmount,
      metadata: { userId },
    }
  );

  return {
    campaignId: data.id,
    title,
    goalAmount,
    ...data,
  };
}

// ---------------------------------------------------------------------------
// processWebhook
// ---------------------------------------------------------------------------

export async function processWebhook(payload: string, signature: string) {
  if (isMockMode()) {
    const parsed = JSON.parse(payload);
    return { verified: true, event: parsed };
  }

  // Verify the webhook signature by calling Manifest's verification endpoint
  const verification = await manifestRequest<{
    valid: boolean;
    event: { type: string; data: Record<string, unknown> };
  }>("/webhooks/verify", "POST", {
    payload,
    signature,
    merchantId: MANIFEST_MERCHANT_ID,
  });

  if (!verification.valid) {
    throw new Error("Invalid webhook signature");
  }

  return { verified: true, event: verification.event };
}

// ---------------------------------------------------------------------------
// verifyTrueFansConnect
// ---------------------------------------------------------------------------

export async function verifyTrueFansConnect(connectId: string) {
  if (isMockMode()) {
    return {
      active: true,
      connectId,
      plan: "pro",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  const data = await manifestRequest<{
    active: boolean;
    plan: string;
    validUntil: string;
    [key: string]: unknown;
  }>(`/truefans-connect/${connectId}/verify`);

  return {
    active: data.active,
    connectId,
    plan: data.plan,
    validUntil: data.validUntil,
  };
}
