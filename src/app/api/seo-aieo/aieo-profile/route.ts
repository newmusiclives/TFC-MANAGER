import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { generateAIEOProfile } from "@/lib/services/seo-aieo-service";

// ---------------------------------------------------------------------------
// GET /api/seo-aieo/aieo-profile — Returns AIEO profile
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await generateAIEOProfile({
      name: user.artistName || user.name,
      genre: "Pop",
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/seo-aieo/aieo-profile] GET error:", message);
    return NextResponse.json(
      { error: "Failed to fetch AIEO profile", detail: message },
      { status: 500 }
    );
  }
}
