import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import {
  getOpportunities,
  updateOpportunityStatus,
} from "@/lib/services/opportunity-radar-service";
import type { OpportunityType, OpportunityStatus } from "@/lib/services/opportunity-radar-service";

// ---------------------------------------------------------------------------
// GET /api/opportunity-radar — Returns opportunities for authenticated user
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as OpportunityType | null;
    const minMatchScore = searchParams.get("minMatchScore");
    const status = searchParams.get("status") as OpportunityStatus | null;

    const filters: Record<string, unknown> = {};
    if (type) filters.type = type;
    if (minMatchScore) filters.minMatchScore = parseInt(minMatchScore, 10);
    if (status) filters.status = status;

    const data = await getOpportunities(user.id, filters as Parameters<typeof getOpportunities>[1]);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/opportunity-radar] GET error:", message);
    return NextResponse.json(
      { error: "Failed to fetch opportunities", detail: message },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/opportunity-radar — Update opportunity status
// ---------------------------------------------------------------------------

export async function PATCH(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "id and status are required" }, { status: 400 });
    }

    const updated = await updateOpportunityStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/opportunity-radar] PATCH error:", message);
    return NextResponse.json(
      { error: "Failed to update opportunity", detail: message },
      { status: 500 }
    );
  }
}
