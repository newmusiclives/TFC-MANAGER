import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { getAIInsights } from "@/lib/services/ai-autopilot-service";

// ---------------------------------------------------------------------------
// GET /api/ai/insights — Returns AI insights/alerts for the dashboard
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const insights = await getAIInsights(user.id);
    return NextResponse.json({ insights });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/ai/insights] GET error:", message);
    return NextResponse.json(
      { error: "Failed to fetch insights", detail: message },
      { status: 500 }
    );
  }
}
