import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// POST /api/truefans-connect/webhook — Receive webhooks from TrueFans CONNECT
// ---------------------------------------------------------------------------
// Events: donation.received, show.created, show.updated, fan.new, fan.checkin
// ---------------------------------------------------------------------------

const CONNECT_WEBHOOK_SECRET =
  process.env.TRUEFANS_CONNECT_WEBHOOK_SECRET || "";

function verifyWebhookSignature(
  payload: string,
  signature: string | null
): boolean {
  // In production, verify HMAC signature from CONNECT
  if (!CONNECT_WEBHOOK_SECRET || !signature) {
    // Allow in development / mock mode
    return !CONNECT_WEBHOOK_SECRET;
  }

  // TODO: Implement HMAC-SHA256 verification when CONNECT provides signing details
  // For now, compare raw secret as a simple auth token
  return signature === CONNECT_WEBHOOK_SECRET;
}

interface WebhookPayload {
  event: string;
  connectId: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-truefans-signature");
    const rawBody = await request.text();

    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const payload: WebhookPayload = JSON.parse(rawBody);
    const { event, connectId, data } = payload;

    if (!event || !connectId) {
      return NextResponse.json(
        { error: "Missing event or connectId" },
        { status: 400 }
      );
    }

    // Find the linked user
    const user = await prisma.user.findUnique({
      where: { truefansConnectId: connectId },
    });

    if (!user) {
      // No linked user — acknowledge but skip processing
      return NextResponse.json({ received: true, processed: false });
    }

    switch (event) {
      case "donation.received":
        await handleDonation(user.id, data);
        break;

      case "show.created":
        await handleShowCreated(user.id, data);
        break;

      case "show.updated":
        await handleShowUpdated(user.id, data);
        break;

      case "fan.new":
        await handleNewFan(user.id, data);
        break;

      case "fan.checkin":
        await handleFanCheckin(user.id, data);
        break;

      default:
        console.warn(`[webhook] Unknown event type: ${event}`);
        return NextResponse.json({ received: true, processed: false });
    }

    return NextResponse.json({ received: true, processed: true });
  } catch (error) {
    console.error("[truefans-connect/webhook] Error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Event Handlers
// ---------------------------------------------------------------------------

async function handleDonation(
  userId: string,
  data: Record<string, unknown>
) {
  const amount = (data.amount as number) || 0;
  const currency = (data.currency as string) || "USD";
  const donationId = data.donationId as string;
  const donorName = data.donorName as string;
  const date = (data.date as string) || new Date().toISOString();

  // Avoid duplicates
  if (donationId) {
    const existing = await prisma.earning.findFirst({
      where: { userId, platform: "truefans_connect", manifestTxId: donationId },
    });
    if (existing) return;
  }

  await prisma.earning.create({
    data: {
      userId,
      platform: "truefans_connect",
      amount,
      currency,
      period: date.slice(0, 7),
      manifestTxId: donationId || null,
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      title: "New Donation via TrueFans CONNECT",
      description: donorName
        ? `${donorName} donated $${amount.toFixed(2)}`
        : `You received a $${amount.toFixed(2)} donation`,
      type: "system",
      link: "/dashboard/earnings",
    },
  });
}

async function handleShowCreated(
  userId: string,
  data: Record<string, unknown>
) {
  const venue = data.venue as string;
  const city = data.city as string;
  const country = (data.country as string) || "US";
  const date = data.date as string;
  const time = data.time as string | undefined;
  const capacity = data.capacity as number | undefined;

  if (!venue || !city || !date) return;

  // Check for duplicate
  const existing = await prisma.gig.findFirst({
    where: {
      userId,
      venue,
      date: new Date(date),
    },
  });
  if (existing) return;

  await prisma.gig.create({
    data: {
      userId,
      venue,
      city,
      country,
      date: new Date(date),
      time: time || null,
      capacity: capacity || null,
      status: "announced",
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      title: "New Show from TrueFans CONNECT",
      description: `${venue} in ${city} on ${date}`,
      type: "system",
      link: "/dashboard/gigs",
    },
  });
}

async function handleShowUpdated(
  userId: string,
  data: Record<string, unknown>
) {
  const venue = data.venue as string;
  const date = data.date as string;
  const ticketsSold = data.ticketsSold as number | undefined;
  const revenue = data.revenue as number | undefined;
  const status = data.status as string | undefined;

  if (!venue || !date) return;

  const gig = await prisma.gig.findFirst({
    where: {
      userId,
      venue,
      date: new Date(date),
    },
  });

  if (!gig) return;

  await prisma.gig.update({
    where: { id: gig.id },
    data: {
      ...(ticketsSold !== undefined && { ticketsSold }),
      ...(revenue !== undefined && { revenue }),
      ...(status && { status }),
    },
  });
}

async function handleNewFan(
  userId: string,
  data: Record<string, unknown>
) {
  const email = data.email as string;
  const name = data.name as string | undefined;

  if (!email) return;

  // Check if subscriber already exists
  const existing = await prisma.subscriber.findUnique({
    where: { userId_email: { userId, email } },
  });
  if (existing) return;

  await prisma.subscriber.create({
    data: {
      userId,
      email,
      name: name || null,
      source: "truefans_connect",
      status: "active",
      engagementScore: 50,
      tags: { truefansConnect: true },
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      title: "New Fan from TrueFans CONNECT",
      description: name
        ? `${name} (${email}) joined your fanbase`
        : `${email} joined your fanbase`,
      type: "system",
      link: "/dashboard/fans",
    },
  });
}

async function handleFanCheckin(
  userId: string,
  data: Record<string, unknown>
) {
  const email = data.email as string;
  const venue = data.venue as string;

  if (!email) return;

  const subscriber = await prisma.subscriber.findUnique({
    where: { userId_email: { userId, email } },
  });

  if (subscriber) {
    // Boost engagement score on check-in
    const newScore = Math.min(100, subscriber.engagementScore + 5);
    const tags = (subscriber.tags as Record<string, unknown>) || {};
    const attended = ((tags.connectShowsAttended as number) || 0) + 1;

    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        engagementScore: newScore,
        tags: { ...tags, connectShowsAttended: attended },
      },
    });
  }

  if (venue) {
    await prisma.notification.create({
      data: {
        userId,
        title: "Fan Check-in at Show",
        description: `${subscriber?.name || email} checked in at ${venue}`,
        type: "system",
        link: "/dashboard/gigs",
      },
    });
  }
}
