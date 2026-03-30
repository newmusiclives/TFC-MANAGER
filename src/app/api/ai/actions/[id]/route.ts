import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import {
  approveAction,
  rejectAction,
} from "@/lib/services/ai-autopilot-service";

// ---------------------------------------------------------------------------
// PATCH /api/ai/actions/[id] — Approve or reject an action
// ---------------------------------------------------------------------------

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be APPROVED or REJECTED." },
        { status: 400 }
      );
    }

    let action;
    if (status === "APPROVED") {
      action = await approveAction(id, user.id);
    } else {
      action = await rejectAction(id, user.id);
    }

    return NextResponse.json({ action });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/ai/actions/[id]] PATCH error:", message);
    return NextResponse.json(
      { error: "Failed to update action", detail: message },
      { status: 500 }
    );
  }
}
