import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { runSEOAudit } from "@/lib/services/seo-aieo-service";

// ---------------------------------------------------------------------------
// GET /api/seo-aieo/audit — Returns latest SEO audit for user
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await runSEOAudit({
      name: user.artistName || user.name,
      genre: "Pop",
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/seo-aieo/audit] GET error:", message);
    return NextResponse.json(
      { error: "Failed to fetch SEO audit", detail: message },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/seo-aieo/audit — Run a new audit
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const data = await runSEOAudit({
      name: user.artistName || user.name,
      genre: body.genre || "Pop",
      website: body.website,
      socialLinks: body.socialLinks,
    });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/seo-aieo/audit] POST error:", message);
    return NextResponse.json(
      { error: "Failed to run SEO audit", detail: message },
      { status: 500 }
    );
  }
}
