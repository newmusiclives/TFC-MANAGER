import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import prisma from "@/lib/prisma";
import { validateRelease } from "@/lib/validation";

// ---------------------------------------------------------------------------
// GET /api/releases — List releases with pagination & filters
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const where = {
      userId: user.id,
      ...(status && { status: status as "DRAFT" | "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "LIVE" | "ARCHIVED" }),
      ...(type && { type: type as "SINGLE" | "EP" | "ALBUM" }),
      // Exclude archived by default unless explicitly requested
      ...(!status && { status: { not: "ARCHIVED" as const } }),
    };

    const [releases, total] = await Promise.all([
      prisma.release.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          distributions: { select: { id: true, platform: true, status: true } },
          _count: { select: { earnings: true } },
        },
      }),
      prisma.release.count({ where }),
    ]);

    return NextResponse.json({
      releases,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch releases";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/releases — Create a new release
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const validation = validateRelease(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { title, type, releaseDate, genre } = validation.data;

    const release = await prisma.release.create({
      data: {
        userId: user.id,
        title,
        type: type || "SINGLE",
        releaseDate: releaseDate ? new Date(releaseDate) : null,
        genre: genre || null,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ release }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create release";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
