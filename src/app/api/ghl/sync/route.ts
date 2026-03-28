import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { bulkSyncSubscribers } from "@/lib/services/gohighlevel-service";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// POST /api/ghl/sync — Sync all Fan CRM subscribers to GoHighLevel
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscribers = await prisma.subscriber.findMany({
      where: { userId: user.id },
      select: { email: true, name: true, status: true, source: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({
        message: "No subscribers to sync",
        synced: 0,
      });
    }

    // Map subscribers to GHL format with tags based on status/source
    const mapped = subscribers.map((sub) => ({
      email: sub.email,
      name: sub.name || sub.email.split("@")[0],
      tags: [
        "truefans-subscriber",
        ...(sub.status ? [`status-${sub.status}`] : []),
        ...(sub.source ? [`source-${sub.source}`] : []),
      ],
    }));

    const result = await bulkSyncSubscribers(mapped);

    // Record sync as a notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "GHL Sync Complete",
        description: `Synced ${result.synced} subscribers to GoHighLevel`,
        type: "system",
      },
    }).catch(() => {});

    return NextResponse.json({
      message: `Synced ${result.synced} of ${subscribers.length} subscribers to GoHighLevel`,
      synced: result.synced,
      errors: result.errors,
      total: subscribers.length,
    });
  } catch (error) {
    console.error("[GHL Sync] Error:", error);
    const message =
      error instanceof Error ? error.message : "GHL sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// GET /api/ghl/sync — Return sync status
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriberCount = await prisma.subscriber.count({
      where: { userId: user.id },
    });

    // Get last sync notification
    const lastSync = await prisma.notification.findFirst({
      where: { userId: user.id, title: "GHL Sync Complete" },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      subscriberCount,
      lastSynced: lastSync?.createdAt ?? null,
      lastSyncInfo: lastSync?.description ?? null,
    });
  } catch (error) {
    console.error("[GHL Sync Status] Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to get sync status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
