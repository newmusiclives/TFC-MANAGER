import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { getCareerDNA, generateCareerDNA } from "@/lib/services/career-dna-service";

// ---------------------------------------------------------------------------
// GET /api/career-dna — Returns career DNA data for authenticated user
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getCareerDNA(user.id);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/career-dna] GET error:", message);
    return NextResponse.json(
      { error: "Failed to fetch career DNA", detail: message },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/career-dna — Regenerate career DNA
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await generateCareerDNA(user.id);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/career-dna] POST error:", message);
    return NextResponse.json(
      { error: "Failed to regenerate career DNA", detail: message },
      { status: 500 }
    );
  }
}
