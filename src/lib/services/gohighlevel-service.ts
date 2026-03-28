// Env vars needed:
// GHL_API_KEY - GoHighLevel API key (Bearer token)
// GHL_LOCATION_ID - GoHighLevel location/sub-account ID
// GHL_WEBHOOK_SECRET - For webhook verification

import crypto from "crypto";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const GHL_API_KEY = process.env.GHL_API_KEY || "";
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || "";
const GHL_WEBHOOK_SECRET = process.env.GHL_WEBHOOK_SECRET || "";
const GHL_BASE_URL = "https://services.leadconnectorhq.com";

const IS_MOCK = !GHL_API_KEY || GHL_API_KEY.includes("your-");

// ---------------------------------------------------------------------------
// Helper — authenticated request to GHL API
// ---------------------------------------------------------------------------

async function ghlRequest(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: Record<string, unknown>
) {
  if (IS_MOCK) {
    console.warn(
      `[GHL MOCK] ${method} ${endpoint} — API key missing or placeholder`
    );
    return { mock: true, endpoint, method };
  }

  const url = `${GHL_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${GHL_API_KEY}`,
    "Content-Type": "application/json",
    Version: "2021-07-28",
  };

  const res = await fetch(url, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GHL API error ${res.status}: ${text}`);
  }

  return res.json();
}

// ===========================================================================
// Contacts / CRM
// ===========================================================================

/**
 * Creates or updates a contact in GoHighLevel.
 * Maps TrueFans subscriber data to GHL contact fields.
 */
export async function syncContactToGHL(params: {
  email: string;
  name: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, string>;
}) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] syncContactToGHL:", params.email);
    return {
      mock: true,
      contactId: `mock_ghl_${Date.now()}`,
      email: params.email,
    };
  }

  const [firstName, ...rest] = params.name.split(" ");
  const lastName = rest.join(" ");

  const payload: Record<string, unknown> = {
    locationId: GHL_LOCATION_ID,
    email: params.email,
    firstName,
    lastName,
    source: "TrueFans Manager",
  };

  if (params.phone) payload.phone = params.phone;
  if (params.tags?.length) payload.tags = params.tags;
  if (params.customFields) {
    payload.customFields = Object.entries(params.customFields).map(
      ([key, value]) => ({ id: key, value })
    );
  }

  const data = await ghlRequest(
    "/contacts/upsert",
    "POST",
    payload
  );

  return {
    contactId: data.contact?.id ?? data.id,
    email: params.email,
    new: data.new ?? false,
  };
}

/** Get a single contact from GHL by ID. */
export async function getGHLContact(contactId: string) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] getGHLContact:", contactId);
    return {
      mock: true,
      id: contactId,
      firstName: "Mock",
      lastName: "Contact",
      email: "mock@example.com",
    };
  }

  const data = await ghlRequest(`/contacts/${contactId}`);
  return data.contact ?? data;
}

/** Add a tag to a contact (e.g. "superfan", "pro-subscriber"). */
export async function addTagToContact(contactId: string, tag: string) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] addTagToContact:", contactId, tag);
    return { mock: true, contactId, tag };
  }

  return ghlRequest(`/contacts/${contactId}/tags`, "POST", { tags: [tag] });
}

/** Sync all Fan CRM subscribers to GoHighLevel in bulk. */
export async function bulkSyncSubscribers(
  subscribers: Array<{ email: string; name: string; tags?: string[] }>
) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] bulkSyncSubscribers:", subscribers.length, "contacts");
    return {
      mock: true,
      synced: subscribers.length,
      results: subscribers.map((s) => ({
        email: s.email,
        contactId: `mock_ghl_${Date.now()}`,
      })),
    };
  }

  const results = [];
  // GHL has no native bulk upsert — process in batches of 10 with delay
  const BATCH_SIZE = 10;
  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map((sub) =>
        syncContactToGHL({
          email: sub.email,
          name: sub.name,
          tags: sub.tags,
        }).catch((err) => ({
          email: sub.email,
          error: err instanceof Error ? err.message : "Unknown error",
        }))
      )
    );
    results.push(...batchResults);

    // Rate-limit pause between batches
    if (i + BATCH_SIZE < subscribers.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return {
    synced: results.filter((r) => !("error" in r)).length,
    errors: results.filter((r) => "error" in r).length,
    results,
  };
}

/** Get all contacts with a specific tag. */
export async function getContactsByTag(tag: string) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] getContactsByTag:", tag);
    return { mock: true, contacts: [], total: 0 };
  }

  const data = await ghlRequest(
    `/contacts/?locationId=${GHL_LOCATION_ID}&query=${encodeURIComponent(tag)}`
  );
  return { contacts: data.contacts ?? [], total: data.total ?? 0 };
}

// ===========================================================================
// Communications
// ===========================================================================

/** Send an SMS via GHL to a contact. */
export async function sendSMS(params: { contactId: string; message: string }) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] sendSMS:", params.contactId);
    return { mock: true, messageId: `mock_sms_${Date.now()}` };
  }

  return ghlRequest("/conversations/messages", "POST", {
    type: "SMS",
    contactId: params.contactId,
    message: params.message,
  });
}

/** Send an email via GHL to a contact. */
export async function sendEmail(params: {
  contactId: string;
  subject: string;
  htmlBody: string;
  fromName?: string;
}) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] sendEmail:", params.contactId);
    return { mock: true, messageId: `mock_email_${Date.now()}` };
  }

  return ghlRequest("/conversations/messages", "POST", {
    type: "Email",
    contactId: params.contactId,
    subject: params.subject,
    html: params.htmlBody,
    emailFrom: params.fromName ?? "TrueFans Manager",
  });
}

/** Send a WhatsApp message via GHL. */
export async function sendWhatsApp(params: {
  contactId: string;
  message: string;
}) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] sendWhatsApp:", params.contactId);
    return { mock: true, messageId: `mock_wa_${Date.now()}` };
  }

  return ghlRequest("/conversations/messages", "POST", {
    type: "WhatsApp",
    contactId: params.contactId,
    message: params.message,
  });
}

/** Initiate an outbound voice call via GHL. */
export async function initiateVoiceCall(params: {
  contactId: string;
  fromNumber?: string;
}) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] initiateVoiceCall:", params.contactId);
    return { mock: true, callId: `mock_call_${Date.now()}` };
  }

  return ghlRequest("/conversations/messages", "POST", {
    type: "Call",
    contactId: params.contactId,
    ...(params.fromNumber ? { phone: params.fromNumber } : {}),
  });
}

/** Send bulk SMS to multiple contacts. */
export async function sendBulkSMS(params: {
  contactIds: string[];
  message: string;
}) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] sendBulkSMS:", params.contactIds.length, "recipients");
    return {
      mock: true,
      sent: params.contactIds.length,
      results: params.contactIds.map((id) => ({
        contactId: id,
        messageId: `mock_sms_${Date.now()}`,
      })),
    };
  }

  const results = [];
  for (const contactId of params.contactIds) {
    try {
      const result = await sendSMS({ contactId, message: params.message });
      results.push({ contactId, success: true, ...result });
    } catch (err) {
      results.push({
        contactId,
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return {
    sent: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  };
}

/** Send bulk email to multiple contacts. */
export async function sendBulkEmail(params: {
  contactIds: string[];
  subject: string;
  htmlBody: string;
}) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] sendBulkEmail:", params.contactIds.length, "recipients");
    return {
      mock: true,
      sent: params.contactIds.length,
      results: params.contactIds.map((id) => ({
        contactId: id,
        messageId: `mock_email_${Date.now()}`,
      })),
    };
  }

  const results = [];
  for (const contactId of params.contactIds) {
    try {
      const result = await sendEmail({
        contactId,
        subject: params.subject,
        htmlBody: params.htmlBody,
      });
      results.push({ contactId, success: true, ...result });
    } catch (err) {
      results.push({
        contactId,
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return {
    sent: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  };
}

// ===========================================================================
// Conversations
// ===========================================================================

/** Get all conversation threads for a contact. */
export async function getConversations(contactId: string) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] getConversations:", contactId);
    return { mock: true, conversations: [] };
  }

  const data = await ghlRequest(
    `/conversations/search?locationId=${GHL_LOCATION_ID}&contactId=${contactId}`
  );
  return { conversations: data.conversations ?? [] };
}

/** Send a message in an existing conversation thread. */
export async function sendConversationMessage(params: {
  conversationId: string;
  type: "sms" | "email" | "whatsapp";
  message: string;
}) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] sendConversationMessage:", params.conversationId);
    return { mock: true, messageId: `mock_conv_${Date.now()}` };
  }

  const typeMap: Record<string, string> = {
    sms: "SMS",
    email: "Email",
    whatsapp: "WhatsApp",
  };

  return ghlRequest(
    `/conversations/${params.conversationId}/messages`,
    "POST",
    {
      type: typeMap[params.type],
      message: params.message,
    }
  );
}

// ===========================================================================
// Calendar
// ===========================================================================

/**
 * Create a calendar event (for gig scheduling, release dates, etc.).
 */
export async function createCalendarEvent(params: {
  title: string;
  startTime: string;
  endTime: string;
  contactId?: string;
  description?: string;
}) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] createCalendarEvent:", params.title);
    return { mock: true, eventId: `mock_event_${Date.now()}` };
  }

  return ghlRequest("/calendars/events", "POST", {
    locationId: GHL_LOCATION_ID,
    title: params.title,
    startTime: params.startTime,
    endTime: params.endTime,
    ...(params.contactId ? { contactId: params.contactId } : {}),
    ...(params.description ? { description: params.description } : {}),
  });
}

/** Get calendar events in a date range. */
export async function getCalendarEvents(params: {
  startDate: string;
  endDate: string;
}) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] getCalendarEvents");
    return { mock: true, events: [] };
  }

  const data = await ghlRequest(
    `/calendars/events?locationId=${GHL_LOCATION_ID}&startTime=${params.startDate}&endTime=${params.endDate}`
  );
  return { events: data.events ?? [] };
}

// ===========================================================================
// Opportunities / Pipeline
// ===========================================================================

/**
 * Create a deal in a pipeline (for tracking release campaigns, brand deals,
 * sync licensing opportunities, etc.).
 */
export async function createOpportunity(params: {
  contactId: string;
  pipelineId: string;
  stageId: string;
  name: string;
  value?: number;
}) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] createOpportunity:", params.name);
    return { mock: true, opportunityId: `mock_opp_${Date.now()}` };
  }

  return ghlRequest("/opportunities/", "POST", {
    locationId: GHL_LOCATION_ID,
    contactId: params.contactId,
    pipelineId: params.pipelineId,
    pipelineStageId: params.stageId,
    name: params.name,
    ...(params.value !== undefined ? { monetaryValue: params.value } : {}),
  });
}

/** Move a deal through a pipeline stage. */
export async function updateOpportunityStage(
  opportunityId: string,
  stageId: string
) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] updateOpportunityStage:", opportunityId, stageId);
    return { mock: true, opportunityId, stageId };
  }

  return ghlRequest(`/opportunities/${opportunityId}`, "PUT", {
    pipelineStageId: stageId,
  });
}

// ===========================================================================
// Automation / Workflows
// ===========================================================================

/**
 * Trigger a GHL workflow for a contact (e.g. "new release announcement",
 * "fan re-engagement", "welcome sequence").
 */
export async function triggerWorkflow(params: {
  workflowId: string;
  contactId: string;
}) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] triggerWorkflow:", params.workflowId);
    return { mock: true, workflowId: params.workflowId };
  }

  return ghlRequest(
    `/workflows/${params.workflowId}/trigger`,
    "POST",
    { contactId: params.contactId }
  );
}

/** Add multiple contacts to a workflow. */
export async function addToWorkflow(params: {
  workflowId: string;
  contactIds: string[];
}) {
  if (IS_MOCK) {
    console.warn("[GHL MOCK] addToWorkflow:", params.contactIds.length, "contacts");
    return { mock: true, workflowId: params.workflowId, added: params.contactIds.length };
  }

  const results = [];
  for (const contactId of params.contactIds) {
    try {
      const result = await triggerWorkflow({
        workflowId: params.workflowId,
        contactId,
      });
      results.push({ contactId, success: true, ...result });
    } catch (err) {
      results.push({
        contactId,
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return {
    added: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
    results,
  };
}

// ===========================================================================
// Webhooks
// ===========================================================================

/**
 * Verify and parse an incoming GHL webhook payload.
 * Returns the parsed event data if the signature is valid.
 */
export function processGHLWebhook(
  payload: unknown,
  signature: string
): { valid: boolean; event?: string; data?: Record<string, unknown> } {
  if (!GHL_WEBHOOK_SECRET) {
    console.warn("[GHL] No webhook secret configured — skipping verification");
    const body = payload as Record<string, unknown>;
    return { valid: true, event: body.type as string, data: body };
  }

  const raw =
    typeof payload === "string" ? payload : JSON.stringify(payload);

  const expected = crypto
    .createHmac("sha256", GHL_WEBHOOK_SECRET)
    .update(raw)
    .digest("hex");

  if (signature !== expected) {
    console.error("[GHL] Invalid webhook signature");
    return { valid: false };
  }

  const body =
    typeof payload === "string" ? JSON.parse(payload) : payload;
  const data = body as Record<string, unknown>;

  return { valid: true, event: data.type as string, data };
}
