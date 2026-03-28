import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// GET /api/captures — List user's quick captures with filters
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const archived = searchParams.get("archived");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { userId: user.id };
    if (type) where.type = type;
    if (archived !== null && archived !== undefined) {
      where.archived = archived === "true";
    } else {
      where.archived = false;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const captures = await prisma.quickCapture.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ captures });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch captures";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/captures — Create a new quick capture
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, title, content, tags, priority } = body;

    if (!type || !content) {
      return NextResponse.json(
        { error: "type and content are required" },
        { status: 400 }
      );
    }

    const capture = await prisma.quickCapture.create({
      data: {
        userId: user.id,
        type,
        title: title || null,
        content,
        tags: tags || null,
        priority: priority || "medium",
      },
    });

    return NextResponse.json({ capture }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create capture";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/captures — Update a capture (archive, edit)
// ---------------------------------------------------------------------------

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, archived, content, tags, priority } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await prisma.quickCapture.findFirst({
      where: { id, userId: user.id },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Capture not found" },
        { status: 404 }
      );
    }

    const data: Record<string, unknown> = {};
    if (archived !== undefined) data.archived = archived;
    if (content !== undefined) data.content = content;
    if (tags !== undefined) data.tags = tags;
    if (priority !== undefined) data.priority = priority;

    const capture = await prisma.quickCapture.update({
      where: { id },
      data,
    });

    return NextResponse.json({ capture });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update capture";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
