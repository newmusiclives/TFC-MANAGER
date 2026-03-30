import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import { updatePitchStatus } from "@/lib/services/playlist-pitch-service";
import type { PitchStatus } from "@/lib/services/playlist-pitch-service";

// ---------------------------------------------------------------------------
// PATCH /api/playlist-pitches/[id] — Update pitch status
// ---------------------------------------------------------------------------

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body as { status: PitchStatus };

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const validStatuses: PitchStatus[] = ["draft", "sent", "opened", "accepted", "declined", "no_response"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const pitch = await updatePitchStatus(id, status);
    if (!pitch) {
      return NextResponse.json(
        { error: "Pitch not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ pitch });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update pitch";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/playlist-pitches/[id] — Delete a draft pitch
// ---------------------------------------------------------------------------

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // In production, verify ownership and that status is "draft"
    // For mock mode, just return success
    return NextResponse.json({ message: `Pitch ${id} deleted` });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete pitch";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
