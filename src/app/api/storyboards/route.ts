import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// GET /api/storyboards — List user's storyboards
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storyboards = await prisma.storyboard.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ storyboards });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch storyboards";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/storyboards — Create a new storyboard
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { trackTitle, style, scenes, colorPalette, mood } = body;

    if (!trackTitle || !style || !scenes) {
      return NextResponse.json(
        { error: "trackTitle, style, and scenes are required" },
        { status: 400 }
      );
    }

    const storyboard = await prisma.storyboard.create({
      data: {
        userId: user.id,
        trackTitle,
        style,
        scenes,
        colorPalette: colorPalette || null,
        mood: mood || null,
      },
    });

    return NextResponse.json({ storyboard }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create storyboard";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
