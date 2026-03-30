import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { analyzeKeywords } from "@/lib/services/seo-aieo-service";

// ---------------------------------------------------------------------------
// GET /api/seo-aieo/keywords — Returns keyword analysis
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get("genre") || "Pop";
    const artistName = user.artistName || user.name || "Artist";

    const data = await analyzeKeywords(genre, artistName);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/seo-aieo/keywords] GET error:", message);
    return NextResponse.json(
      { error: "Failed to fetch keyword analysis", detail: message },
      { status: 500 }
    );
  }
}
