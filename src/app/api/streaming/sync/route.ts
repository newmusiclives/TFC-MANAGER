import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { aggregateStats } from "@/lib/services/streaming-service";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// POST /api/streaming/sync — trigger analytics sync for authenticated user
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await aggregateStats(user.id);

    return NextResponse.json({
      success: true,
      snapshot: {
        id: snapshot.id,
        date: snapshot.date,
        totalStreams: snapshot.totalStreams,
        monthlyListeners: snapshot.monthlyListeners,
        followers: snapshot.followers,
        saveRate: snapshot.saveRate,
        platformBreakdown: snapshot.platformBreakdown,
        topCountries: snapshot.topCountries,
        demographics: snapshot.demographics,
      },
    });
  } catch (error) {
    console.error("Streaming sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync streaming data" },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// GET /api/streaming/sync — get latest analytics snapshot
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await prisma.analyticsSnapshot.findFirst({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    if (!snapshot) {
      return NextResponse.json({
        success: true,
        snapshot: null,
        message: "No analytics data yet. Trigger a sync first.",
      });
    }

    return NextResponse.json({
      success: true,
      snapshot: {
        id: snapshot.id,
        date: snapshot.date,
        totalStreams: snapshot.totalStreams,
        monthlyListeners: snapshot.monthlyListeners,
        followers: snapshot.followers,
        saveRate: snapshot.saveRate,
        platformBreakdown: snapshot.platformBreakdown,
        topCountries: snapshot.topCountries,
        demographics: snapshot.demographics,
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
