import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { getCurators } from "@/lib/services/playlist-pitch-service";

// ---------------------------------------------------------------------------
// GET /api/playlist-pitches/curators — Curator database with filters
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre") || undefined;
    const platform = searchParams.get("platform") || undefined;
    const search = searchParams.get("search") || undefined;

    const curators = await getCurators({ genre, platform, search });

    return NextResponse.json({ curators });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch curators";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
