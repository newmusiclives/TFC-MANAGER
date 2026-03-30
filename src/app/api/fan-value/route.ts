import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { getFanValueAnalytics } from "@/lib/services/fan-value-service";

// ---------------------------------------------------------------------------
// GET /api/fan-value — Returns fan value analytics for authenticated user
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getFanValueAnalytics(user.id);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/fan-value] GET error:", message);
    return NextResponse.json(
      { error: "Failed to fetch fan value data", detail: message },
      { status: 500 }
    );
  }
}
