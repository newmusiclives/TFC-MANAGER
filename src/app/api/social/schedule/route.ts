import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import prisma from "@/lib/prisma";
import { schedulePost } from "@/lib/services/social-service";

// ---------------------------------------------------------------------------
// POST /api/social/schedule — Schedule a new social media post
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { platforms, content, mediaUrl, scheduledAt } = body;

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: "At least one platform is required" },
        { status: 400 }
      );
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (!scheduledAt) {
      return NextResponse.json(
        { error: "scheduledAt is required" },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: "scheduledAt must be a valid future date" },
        { status: 400 }
      );
    }

    const post = await schedulePost(user.id, {
      platforms,
      content,
      mediaUrl,
      scheduledAt,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to schedule post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// GET /api/social/schedule — List scheduled posts for user
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const posts = await prisma.scheduledPost.findMany({
      where: {
        userId: user.id,
        ...(status && { status: status as "SCHEDULED" | "POSTING" | "POSTED" | "FAILED" }),
      },
      orderBy: { scheduledAt: "asc" },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch scheduled posts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
