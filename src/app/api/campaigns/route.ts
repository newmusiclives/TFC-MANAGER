import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// GET /api/campaigns — List user's fan funding campaigns
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const campaigns = await prisma.fanCampaign.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch campaigns";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/campaigns — Create a new fan funding campaign
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, goalAmount, tiers, endsAt } = body;

    if (!title || !goalAmount || !tiers || !endsAt) {
      return NextResponse.json(
        { error: "title, goalAmount, tiers, and endsAt are required" },
        { status: 400 }
      );
    }

    const campaign = await prisma.fanCampaign.create({
      data: {
        userId: user.id,
        title,
        description: description || null,
        goalAmount,
        tiers,
        endsAt: new Date(endsAt),
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create campaign";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
