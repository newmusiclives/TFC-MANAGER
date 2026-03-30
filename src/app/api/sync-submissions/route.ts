import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

const mockSubmissions = [
  { id: "ss-1", trackTitle: "Midnight Drive", library: "Musicbed", status: "Placed", genre: "Indie Electronic", mood: "Atmospheric", revenue: 2400, submittedAt: "2026-01-15", placedAt: "2026-02-20" },
  { id: "ss-2", trackTitle: "Golden Hour", library: "Artlist", status: "Under Review", genre: "Indie Folk", mood: "Warm", revenue: 0, submittedAt: "2026-03-10", placedAt: null },
  { id: "ss-3", trackTitle: "City Lights", library: "Epidemic Sound", status: "Accepted", genre: "Pop", mood: "Uplifting", revenue: 850, submittedAt: "2026-02-01", placedAt: null },
  { id: "ss-4", trackTitle: "Slow Burn", library: "Marmoset", status: "Declined", genre: "Alternative", mood: "Melancholic", revenue: 0, submittedAt: "2026-01-20", placedAt: null },
  { id: "ss-5", trackTitle: "Electric Dreams", library: "Musicbed", status: "Submitted", genre: "Synthwave", mood: "Energetic", revenue: 0, submittedAt: "2026-03-25", placedAt: null },
];

const mockTaggedTracks = [
  { id: "tt-1", title: "Midnight Drive", mood: ["Atmospheric", "Dreamy"], tempo: "Mid-tempo", instrumentation: ["Synths", "Guitar", "Drums"], keywords: ["night", "driving", "cinematic"] },
  { id: "tt-2", title: "Golden Hour", mood: ["Warm", "Hopeful"], tempo: "Slow", instrumentation: ["Acoustic Guitar", "Strings", "Piano"], keywords: ["sunset", "nature", "peaceful"] },
  { id: "tt-3", title: "City Lights", mood: ["Uplifting", "Energetic"], tempo: "Fast", instrumentation: ["Synths", "Bass", "Drums"], keywords: ["urban", "nightlife", "modern"] },
];

const mockOpportunities = [
  { id: "op-1", title: "Netflix Original Series — Indie Drama", type: "TV", genre: "Indie / Alternative", budget: "$1,500 - $5,000", deadline: "2026-04-15", description: "Seeking atmospheric indie tracks for a coming-of-age drama series." },
  { id: "op-2", title: "Nike Spring Campaign", type: "Ad", genre: "Pop / Electronic", budget: "$5,000 - $15,000", deadline: "2026-04-01", description: "Upbeat, energetic tracks for spring athletic campaign." },
  { id: "op-3", title: "Indie Film — 'The Quiet Place'", type: "Film", genre: "Folk / Acoustic", budget: "$2,000 - $8,000", deadline: "2026-05-01", description: "Gentle acoustic tracks for award-season indie film." },
  { id: "op-4", title: "EA Sports — Racing Game", type: "Game", genre: "Electronic / Rock", budget: "$3,000 - $10,000", deadline: "2026-04-20", description: "High-energy tracks for in-game racing sequences." },
  { id: "op-5", title: "Apple TV+ Documentary", type: "TV", genre: "Ambient / Post-Rock", budget: "$2,500 - $7,000", deadline: "2026-04-30", description: "Ethereal, textured soundscapes for nature documentary." },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "submissions";

    if (tab === "tagged") {
      return NextResponse.json({ taggedTracks: mockTaggedTracks });
    }
    if (tab === "opportunities") {
      return NextResponse.json({ opportunities: mockOpportunities });
    }

    return NextResponse.json({
      submissions: mockSubmissions,
      stats: {
        totalSubmissions: mockSubmissions.length,
        placed: mockSubmissions.filter((s) => s.status === "Placed").length,
        totalRevenue: mockSubmissions.reduce((sum, s) => sum + s.revenue, 0),
        pendingReview: mockSubmissions.filter((s) => s.status === "Under Review" || s.status === "Submitted").length,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch sync data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type } = body;

    if (type === "submission") {
      const newSubmission = {
        id: `ss-${Date.now()}`,
        trackTitle: body.trackTitle,
        library: body.library,
        status: "Submitted",
        genre: body.genre || "",
        mood: body.mood || "",
        revenue: 0,
        submittedAt: new Date().toISOString().split("T")[0],
        placedAt: null,
      };
      return NextResponse.json({ submission: newSubmission }, { status: 201 });
    }

    if (type === "tag") {
      const newTag = {
        id: `tt-${Date.now()}`,
        title: body.title,
        mood: body.mood || [],
        tempo: body.tempo || "Mid-tempo",
        instrumentation: body.instrumentation || [],
        keywords: body.keywords || [],
      };
      return NextResponse.json({ taggedTrack: newTag }, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
