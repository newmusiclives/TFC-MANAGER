import { NextRequest, NextResponse } from "next/server";
import { processGHLWebhook } from "@/lib/services/gohighlevel-service";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// POST /api/ghl/webhook — Receive GoHighLevel webhooks
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-ghl-signature") || "";

    const { valid, event, data } = processGHLWebhook(rawBody, signature);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    console.log(`[GHL Webhook] Event: ${event}`);

    switch (event) {
      case "contact.created":
      case "contact.updated": {
        await handleContactEvent(data!);
        break;
      }

      case "appointment.created":
      case "appointment.updated": {
        await handleAppointmentEvent(event, data!);
        break;
      }

      case "opportunity.updated":
      case "opportunity.created": {
        await handleOpportunityEvent(event, data!);
        break;
      }

      case "conversation.message": {
        await handleConversationEvent(data!);
        break;
      }

      default:
        console.log(`[GHL Webhook] Unhandled event type: ${event}`);
    }

    return NextResponse.json({ received: true, event });
  } catch (error) {
    console.error("[GHL Webhook] Error:", error);
    // Always return 200 to prevent GHL from retrying on processing errors
    return NextResponse.json({ received: true, error: "Processing failed" });
  }
}

// ---------------------------------------------------------------------------
// Event Handlers
// ---------------------------------------------------------------------------

async function handleContactEvent(data: Record<string, unknown>) {
  const email = data.email as string | undefined;
  if (!email) return;

  const name =
    [data.firstName, data.lastName].filter(Boolean).join(" ") || undefined;

  // Upsert subscriber in our DB if we can match by email
  try {
    const existing = await prisma.subscriber.findFirst({
      where: { email },
    });

    if (existing) {
      await prisma.subscriber.update({
        where: { id: existing.id },
        data: {
          ...(name ? { name } : {}),
          ghlContactId: data.id as string,
        },
      });
      console.log(`[GHL Webhook] Updated subscriber: ${email}`);
    } else {
      console.log(
        `[GHL Webhook] Contact ${email} not found in subscribers — skipping`
      );
    }
  } catch (err) {
    console.error("[GHL Webhook] Contact sync error:", err);
  }
}

async function handleAppointmentEvent(
  event: string,
  data: Record<string, unknown>
) {
  try {
    // Create a notification for the user about the appointment
    const contactId = data.contactId as string | undefined;
    if (!contactId) return;

    // Look up subscriber by GHL contact ID
    const subscriber = await prisma.subscriber
      .findFirst({
        where: { ghlContactId: contactId },
        select: { userId: true, name: true, email: true },
      })
      .catch(() => null);

    if (subscriber?.userId) {
      await prisma.notification
        .create({
          data: {
            userId: subscriber.userId,
            type: "appointment",
            title:
              event === "appointment.created"
                ? "New Appointment Scheduled"
                : "Appointment Updated",
            description: `Appointment with ${subscriber.name || subscriber.email}: ${data.title || "No title"}`,
          },
        })
        .catch(() => null);
    }

    console.log(`[GHL Webhook] Processed appointment event: ${event}`);
  } catch (err) {
    console.error("[GHL Webhook] Appointment event error:", err);
  }
}

async function handleOpportunityEvent(
  event: string,
  data: Record<string, unknown>
) {
  try {
    const contactId = data.contactId as string | undefined;
    if (!contactId) return;

    const subscriber = await prisma.subscriber
      .findFirst({
        where: { ghlContactId: contactId },
        select: { userId: true, name: true, email: true },
      })
      .catch(() => null);

    if (subscriber?.userId) {
      await prisma.notification
        .create({
          data: {
            userId: subscriber.userId,
            type: "opportunity",
            title:
              event === "opportunity.created"
                ? "New Opportunity Created"
                : "Opportunity Updated",
            description: `${data.name || "Opportunity"} — ${data.pipelineStageName || "Stage updated"}`,
          },
        })
        .catch(() => null);
    }

    console.log(`[GHL Webhook] Processed opportunity event: ${event}`);
  } catch (err) {
    console.error("[GHL Webhook] Opportunity event error:", err);
  }
}

async function handleConversationEvent(data: Record<string, unknown>) {
  try {
    const contactId = data.contactId as string | undefined;
    if (!contactId) return;

    const subscriber = await prisma.subscriber
      .findFirst({
        where: { ghlContactId: contactId },
        select: { userId: true, name: true, email: true },
      })
      .catch(() => null);

    if (subscriber?.userId) {
      await prisma.notification
        .create({
          data: {
            userId: subscriber.userId,
            type: "message",
            title: "New Message",
            description: `Message from ${subscriber.name || subscriber.email}: ${(data.body as string)?.slice(0, 100) || ""}`,
          },
        })
        .catch(() => null);
    }

    console.log("[GHL Webhook] Processed conversation message event");
  } catch (err) {
    console.error("[GHL Webhook] Conversation event error:", err);
  }
}
