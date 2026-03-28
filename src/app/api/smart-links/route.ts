import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// GET /api/smart-links — List user's smart links with click/view counts
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const smartLinks = await prisma.smartLink.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        release: { select: { id: true, title: true, coverArtUrl: true } },
      },
    });

    return NextResponse.json({ smartLinks });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch smart links";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/smart-links — Create a new smart link
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, releaseId, platformLinks } = body;

    if (!title || !slug || !platformLinks) {
      return NextResponse.json(
        { error: "title, slug, and platformLinks are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.smartLink.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A smart link with this slug already exists" },
        { status: 409 }
      );
    }

    const smartLink = await prisma.smartLink.create({
      data: {
        userId: user.id,
        title,
        slug,
        releaseId: releaseId || null,
        platformLinks,
      },
    });

    return NextResponse.json({ smartLink }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create smart link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
