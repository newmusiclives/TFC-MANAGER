import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { generatePitchMessage } from "@/lib/services/playlist-pitch-service";

// ---------------------------------------------------------------------------
// POST /api/playlist-pitches/generate — Generate AI pitch message
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { trackTitle, genre, artistName, playlistName, curatorName } = body;

    if (!trackTitle || !genre || !artistName || !playlistName || !curatorName) {
      return NextResponse.json(
        { error: "trackTitle, genre, artistName, playlistName, and curatorName are all required" },
        { status: 400 }
      );
    }

    const message = await generatePitchMessage(
      trackTitle,
      genre,
      artistName,
      playlistName,
      curatorName
    );

    return NextResponse.json({ message });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate pitch";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
