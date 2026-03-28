import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// GET /api/releases/[id] — Single release with full details
// ---------------------------------------------------------------------------

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const release = await prisma.release.findFirst({
      where: { id, userId: user.id },
      include: {
        distributions: true,
        releasePlan: true,
        earnings: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        splits: true,
      },
    });

    if (!release) {
      return NextResponse.json(
        { error: "Release not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ release });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch release";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/releases/[id] — Update release fields
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

    // Verify ownership
    const existing = await prisma.release.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Release not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const allowedFields = [
      "title",
      "type",
      "releaseDate",
      "coverArtUrl",
      "audioUrl",
      "isrc",
      "upc",
      "genre",
      "status",
    ];

    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        data[field] =
          field === "releaseDate" && body[field]
            ? new Date(body[field])
            : body[field];
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const release = await prisma.release.update({
      where: { id },
      data,
    });

    return NextResponse.json({ release });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update release";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/releases/[id] — Soft-delete (archive) release
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

    const existing = await prisma.release.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Release not found" },
        { status: 404 }
      );
    }

    await prisma.release.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    return NextResponse.json({ message: "Release archived" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to archive release";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
