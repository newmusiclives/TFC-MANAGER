import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { generateStructuredData } from "@/lib/services/seo-aieo-service";

// ---------------------------------------------------------------------------
// GET /api/seo-aieo/structured-data — Returns generated JSON-LD
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const schemasParam = searchParams.get("schemas");
    const enabledSchemas = schemasParam
      ? schemasParam.split(",")
      : ["MusicGroup", "Person", "MusicAlbum", "MusicRecording", "Event"];

    const data = await generateStructuredData(
      {
        name: user.artistName || user.name,
        genre: "Pop",
      },
      enabledSchemas
    );
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/seo-aieo/structured-data] GET error:", message);
    return NextResponse.json(
      { error: "Failed to generate structured data", detail: message },
      { status: 500 }
    );
  }
}
