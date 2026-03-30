import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// Mock data — same as what was hardcoded in the page
// ---------------------------------------------------------------------------

const mockSplits = [
  {
    id: "sp1",
    track: "Midnight Dreams",
    status: "active",
    totalRevenue: 487.20,
    pending: 0,
    collaborators: [
      { name: "Jordan Davis", role: "Artist / Songwriter", split: 50, earned: 243.60, paid: 243.60 },
      { name: "Alex Producer", role: "Producer", split: 25, earned: 121.80, paid: 100.00 },
      { name: "Sam Beats", role: "Beat Maker", split: 15, earned: 73.08, paid: 73.08 },
      { name: "Lisa Words", role: "Co-Writer", split: 10, earned: 48.72, paid: 48.72 },
    ],
    createdAt: "Dec 1, 2025",
  },
  {
    id: "sp2",
    track: "Golden Hour",
    status: "draft",
    totalRevenue: 0,
    pending: 0,
    collaborators: [
      { name: "Jordan Davis", role: "Artist / Songwriter", split: 60, earned: 0, paid: 0 },
      { name: "Alex Producer", role: "Producer", split: 30, earned: 0, paid: 0 },
      { name: "Mia Keys", role: "Featured Artist", split: 10, earned: 0, paid: 0 },
    ],
    createdAt: "Mar 18, 2026",
  },
  {
    id: "sp3",
    track: "Electric Feel",
    status: "active",
    totalRevenue: 312.45,
    pending: 45.20,
    collaborators: [
      { name: "Jordan Davis", role: "Artist / Songwriter", split: 70, earned: 218.72, paid: 187.00 },
      { name: "Beat Factory", role: "Producer", split: 30, earned: 93.73, paid: 80.25 },
    ],
    createdAt: "Sep 15, 2025",
  },
];

// ---------------------------------------------------------------------------
// GET /api/revenue-splits — Return user's revenue splits
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return mock data (replace with DB queries when available)
    return NextResponse.json({ splits: mockSplits });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch revenue splits";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/revenue-splits — Create a new revenue split
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { track, collaborators } = body;

    if (!track || !collaborators || !Array.isArray(collaborators)) {
      return NextResponse.json(
        { error: "track and collaborators are required" },
        { status: 400 }
      );
    }

    const totalSplit = collaborators.reduce(
      (sum: number, c: { split: number }) => sum + c.split,
      0
    );
    if (totalSplit !== 100) {
      return NextResponse.json(
        { error: "Splits must total 100%" },
        { status: 400 }
      );
    }

    // Return mock created split (replace with DB create when available)
    const newSplit = {
      id: `sp${Date.now()}`,
      track,
      status: "draft",
      totalRevenue: 0,
      pending: 0,
      collaborators: collaborators.map((c: { name: string; role: string; split: number }) => ({
        ...c,
        earned: 0,
        paid: 0,
      })),
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    return NextResponse.json({ split: newSplit }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create revenue split";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
