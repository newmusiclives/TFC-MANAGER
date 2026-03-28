import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { syncAll } from "@/lib/services/truefans-connect-service";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// POST /api/truefans-connect/sync — Trigger full bidirectional sync
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch full user to get truefansConnectId
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { truefansConnectId: true },
    });

    if (!fullUser?.truefansConnectId) {
      return NextResponse.json(
        {
          error:
            "No TrueFans CONNECT account linked. Link your account first at /api/truefans-connect/link",
        },
        { status: 400 }
      );
    }

    const result = await syncAll(user.id, fullUser.truefansConnectId);

    // Create a notification about the sync
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "TrueFans CONNECT Sync Complete",
        description: `Synced ${result.shows.synced} shows, ${result.fans.synced} fans, and ${result.donations.synced} donations from CONNECT.`,
        type: "system",
        link: "/dashboard/truefans-connect",
      },
    });

    return NextResponse.json({
      success: true,
      syncedAt: new Date().toISOString(),
      results: result,
    });
  } catch (error) {
    console.error("[truefans-connect/sync] POST error:", error);
    return NextResponse.json(
      { error: "Sync failed. Please try again later." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// GET /api/truefans-connect/sync — Get sync status & last sync timestamp
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { truefansConnectId: true },
    });

    if (!fullUser?.truefansConnectId) {
      return NextResponse.json({
        linked: false,
        lastSync: null,
        message: "No TrueFans CONNECT account linked.",
      });
    }

    // Determine last sync time from the most recent CONNECT-sourced data
    const [lastEarning, lastSubscriber, lastNotification] = await Promise.all([
      prisma.earning.findFirst({
        where: { userId: user.id, platform: "truefans_connect" },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
      prisma.subscriber.findFirst({
        where: { userId: user.id, source: "truefans_connect" },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
      prisma.notification.findFirst({
        where: {
          userId: user.id,
          title: "TrueFans CONNECT Sync Complete",
        },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ]);

    const timestamps = [
      lastEarning?.createdAt,
      lastSubscriber?.createdAt,
      lastNotification?.createdAt,
    ].filter(Boolean) as Date[];

    const lastSync =
      timestamps.length > 0
        ? new Date(Math.max(...timestamps.map((t) => t.getTime())))
        : null;

    // Count synced data
    const [donationCount, fanCount, gigCount] = await Promise.all([
      prisma.earning.count({
        where: { userId: user.id, platform: "truefans_connect" },
      }),
      prisma.subscriber.count({
        where: { userId: user.id, source: "truefans_connect" },
      }),
      prisma.gig.count({ where: { userId: user.id } }),
    ]);

    return NextResponse.json({
      linked: true,
      connectId: fullUser.truefansConnectId,
      lastSync: lastSync?.toISOString() || null,
      syncedData: {
        donations: donationCount,
        fans: fanCount,
        gigs: gigCount,
      },
    });
  } catch (error) {
    console.error("[truefans-connect/sync] GET error:", error);
    return NextResponse.json(
      { error: "Failed to get sync status" },
      { status: 500 }
    );
  }
}
