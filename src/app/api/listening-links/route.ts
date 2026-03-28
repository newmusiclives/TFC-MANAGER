import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// GET /api/listening-links — List user's listening links
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listeningLinks = await prisma.listeningLink.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ listeningLinks });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch listening links";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/listening-links — Create a new listening link
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, audioUrl, password, maxPlays, expiresAt, recipients } =
      body;

    if (!title || !slug || !audioUrl || !expiresAt) {
      return NextResponse.json(
        { error: "title, slug, audioUrl, and expiresAt are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.listeningLink.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A listening link with this slug already exists" },
        { status: 409 }
      );
    }

    const listeningLink = await prisma.listeningLink.create({
      data: {
        userId: user.id,
        title,
        slug,
        audioUrl,
        password: password || null,
        maxPlays: maxPlays ?? 50,
        expiresAt: new Date(expiresAt),
        recipients: recipients || null,
      },
    });

    return NextResponse.json({ listeningLink }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create listening link";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
