import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { getPitches, createPitch, generatePitchMessage } from "@/lib/services/playlist-pitch-service";
import type { PitchStatus } from "@/lib/services/playlist-pitch-service";

// ---------------------------------------------------------------------------
// GET /api/playlist-pitches — List user's pitches with filters
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as PitchStatus | null;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    const result = await getPitches(user.id, {
      status: status || undefined,
      page,
      limit,
    });

    return NextResponse.json({
      pitches: result.pitches,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch pitches";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/playlist-pitches — Create a new pitch
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { curatorId, trackTitle, genre, message, generateAI, artistName, playlistName, curatorName } = body;

    if (!curatorId || !trackTitle || !genre) {
      return NextResponse.json(
        { error: "curatorId, trackTitle, and genre are required" },
        { status: 400 }
      );
    }

    let pitchMessage = message || "";

    if (generateAI && !message) {
      pitchMessage = await generatePitchMessage(
        trackTitle,
        genre,
        artistName || "Artist",
        playlistName || "Playlist",
        curatorName || "Curator"
      );
    }

    const pitch = await createPitch(user.id, {
      curatorId,
      trackTitle,
      genre,
      message: pitchMessage,
    });

    return NextResponse.json({ pitch }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create pitch";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
