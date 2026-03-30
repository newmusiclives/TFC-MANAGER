import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { getReplays, getReplay, generateReplay } from "@/lib/services/release-replay-service";

// ---------------------------------------------------------------------------
// GET /api/release-replay — Returns release list and optional replay data
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const releaseId = searchParams.get("releaseId");

    if (releaseId) {
      const replay = await getReplay(releaseId);
      return NextResponse.json({ replay });
    }

    const releases = await getReplays(user.id);
    return NextResponse.json({ releases });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/release-replay] GET error:", message);
    return NextResponse.json(
      { error: "Failed to fetch release replay data", detail: message },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/release-replay — Generate a new replay for a release
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { releaseId } = body;

    if (!releaseId) {
      return NextResponse.json({ error: "releaseId is required" }, { status: 400 });
    }

    const replay = await generateReplay(user.id, releaseId);
    return NextResponse.json({ replay });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/release-replay] POST error:", message);
    return NextResponse.json(
      { error: "Failed to generate release replay", detail: message },
      { status: 500 }
    );
  }
}
