import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import {
  getActionQueue,
  scanArtistState,
  generateActions,
} from "@/lib/services/ai-autopilot-service";

// ---------------------------------------------------------------------------
// GET /api/ai/actions — Returns action queue for authenticated user
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const queue = await getActionQueue(user.id);
    return NextResponse.json(queue);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/ai/actions] GET error:", message);
    return NextResponse.json(
      { error: "Failed to fetch action queue", detail: message },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/ai/actions — Trigger a manual AI scan
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Run the AI scan
    const scanResult = await scanArtistState(user.id);

    // Generate action records in the database
    const actions = await generateActions(user.id, scanResult);

    return NextResponse.json({
      summary: scanResult.summary,
      actionsCreated: actions.length,
      actions,
      insights: scanResult.insights,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/ai/actions] POST error:", message);
    return NextResponse.json(
      { error: "AI scan failed", detail: message },
      { status: 500 }
    );
  }
}
