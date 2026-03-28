import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// GET /api/calendar — Combined calendar events from releases, gigs, and posts
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month"); // e.g. "2026-04"

    // Build date range filter
    let dateFrom: Date | undefined;
    let dateTo: Date | undefined;

    if (month) {
      const [year, m] = month.split("-").map(Number);
      dateFrom = new Date(year, m - 1, 1);
      dateTo = new Date(year, m, 1); // first day of next month
    }

    // Fetch releases with releaseDate
    const releasesWhere: Record<string, unknown> = {
      userId: user.id,
      releaseDate: { not: null },
    };
    if (dateFrom && dateTo) {
      releasesWhere.releaseDate = { gte: dateFrom, lt: dateTo };
    }

    // Fetch gigs
    const gigsWhere: Record<string, unknown> = { userId: user.id };
    if (dateFrom && dateTo) {
      gigsWhere.date = { gte: dateFrom, lt: dateTo };
    }

    // Fetch scheduled posts
    const postsWhere: Record<string, unknown> = { userId: user.id };
    if (dateFrom && dateTo) {
      postsWhere.scheduledAt = { gte: dateFrom, lt: dateTo };
    }

    const [releases, gigs, posts] = await Promise.all([
      prisma.release.findMany({
        where: releasesWhere,
        select: {
          id: true,
          title: true,
          releaseDate: true,
          status: true,
        },
      }),
      prisma.gig.findMany({
        where: gigsWhere,
        select: {
          id: true,
          venue: true,
          city: true,
          date: true,
          status: true,
        },
      }),
      prisma.scheduledPost.findMany({
        where: postsWhere,
        select: {
          id: true,
          content: true,
          scheduledAt: true,
          status: true,
        },
      }),
    ]);

    type CalendarEvent = {
      id: string;
      title: string;
      date: Date | null;
      type: "release" | "gig" | "post";
      status: string;
    };

    const events: CalendarEvent[] = [
      ...releases.map((r) => ({
        id: r.id,
        title: r.title,
        date: r.releaseDate,
        type: "release" as const,
        status: r.status,
      })),
      ...gigs.map((g) => ({
        id: g.id,
        title: `${g.venue}, ${g.city}`,
        date: g.date,
        type: "gig" as const,
        status: g.status,
      })),
      ...posts.map((p) => ({
        id: p.id,
        title: p.content.slice(0, 60) + (p.content.length > 60 ? "..." : ""),
        date: p.scheduledAt,
        type: "post" as const,
        status: p.status,
      })),
    ];

    // Sort by date ascending
    events.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return NextResponse.json({ events });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch calendar events";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
