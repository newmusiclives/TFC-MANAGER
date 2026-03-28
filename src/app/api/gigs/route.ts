import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// GET /api/gigs — List user's gigs, ordered by date
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const upcoming = searchParams.get("upcoming");

    const where: Record<string, unknown> = { userId: user.id };
    if (status) where.status = status;
    if (upcoming === "true") {
      where.date = { gte: new Date() };
    }

    const gigs = await prisma.gig.findMany({
      where,
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ gigs });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch gigs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/gigs — Create a new gig
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { venue, city, country, date, time, capacity, status } = body;

    if (!venue || !city || !country || !date) {
      return NextResponse.json(
        { error: "venue, city, country, and date are required" },
        { status: 400 }
      );
    }

    const gig = await prisma.gig.create({
      data: {
        userId: user.id,
        venue,
        city,
        country,
        date: new Date(date),
        time: time || null,
        capacity: capacity || null,
        status: status || "announced",
      },
    });

    return NextResponse.json({ gig }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create gig";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
