import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// GET /api/subscribers — List subscribers with filters
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));

    const where = {
      userId: user.id,
      ...(status && { status }),
      ...(source && { source }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: "insensitive" as const } },
          { name: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [subscribers, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.subscriber.count({ where }),
    ]);

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch subscribers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/subscribers — Add subscriber
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { email, name, source } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check for duplicate
    const existing = await prisma.subscriber.findUnique({
      where: {
        userId_email: {
          userId: user.id,
          email,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Subscriber with this email already exists" },
        { status: 409 }
      );
    }

    const subscriber = await prisma.subscriber.create({
      data: {
        userId: user.id,
        email,
        name: name || null,
        source: source || null,
        status: "active",
      },
    });

    return NextResponse.json({ subscriber }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add subscriber";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/subscribers — Remove subscriber
// ---------------------------------------------------------------------------

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Subscriber id is required" },
        { status: 400 }
      );
    }

    const subscriber = await prisma.subscriber.findFirst({
      where: { id, userId: user.id },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    await prisma.subscriber.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Subscriber removed" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to remove subscriber";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
