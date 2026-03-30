import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { getAutoMatches } from "@/lib/services/playlist-pitch-service";

// ---------------------------------------------------------------------------
// POST /api/playlist-pitches/auto-match — AI-matched curators for a release
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { releaseId } = body;

    const matches = await getAutoMatches(user.id, releaseId);

    return NextResponse.json({ matches });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get auto-matches";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
