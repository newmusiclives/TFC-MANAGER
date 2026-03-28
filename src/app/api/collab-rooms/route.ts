import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// GET /api/collab-rooms — List user's collaboration rooms
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rooms = await prisma.collabRoom.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ rooms });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch collab rooms";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/collab-rooms — Create a new collaboration room
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, track, members } = body;

    if (!name || !members) {
      return NextResponse.json(
        { error: "name and members are required" },
        { status: 400 }
      );
    }

    const room = await prisma.collabRoom.create({
      data: {
        userId: user.id,
        name,
        track: track || null,
        members,
      },
    });

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create collab room";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
