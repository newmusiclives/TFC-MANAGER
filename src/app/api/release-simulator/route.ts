import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// POST /api/release-simulator — Simulate release performance
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      releaseDay = "friday",
      marketingBudget = 150,
      prePromoWeeks = 3,
      hasPlaylistPitch = true,
      hasPressPitch = true,
      hasMusicVideo = false,
    } = body;

    // Simulation logic (same as was in the page)
    let baseStreams = 3200;
    const dayMultiplier: Record<string, number> = {
      friday: 1.0,
      thursday: 0.88,
      wednesday: 0.75,
      saturday: 0.82,
      monday: 0.65,
    };
    baseStreams *= dayMultiplier[releaseDay] || 1;
    baseStreams += marketingBudget * 8;
    baseStreams += prePromoWeeks * 420;
    if (hasPlaylistPitch) baseStreams *= 1.35;
    if (hasPressPitch) baseStreams *= 1.15;
    if (hasMusicVideo) baseStreams *= 1.45;

    const weeklyDecay = 0.82;
    const projectedWeeks = Array.from({ length: 12 }, (_, i) => {
      const weekStreams = Math.round(
        baseStreams * Math.pow(weeklyDecay, i) * (1 + Math.random() * 0.1)
      );
      return { week: `W${i + 1}`, streams: weekStreams };
    });
    const totalStreams = projectedWeeks.reduce((a, w) => a + w.streams, 0);
    const peakWeek = projectedWeeks[0].streams;
    const avgRate = 0.0035;
    const revenue = Math.round(totalStreams * avgRate * 100) / 100;
    const newListeners = Math.round(totalStreams * 0.42);
    const playlistProb = hasPlaylistPitch
      ? Math.min(78, 35 + prePromoWeeks * 8 + (marketingBudget > 100 ? 15 : 0))
      : 12;

    return NextResponse.json({
      projectedWeeks,
      totalStreams,
      peakWeek,
      revenue,
      newListeners,
      playlistProb,
      params: {
        releaseDay,
        marketingBudget,
        prePromoWeeks,
        hasPlaylistPitch,
        hasPressPitch,
        hasMusicVideo,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to run simulation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
