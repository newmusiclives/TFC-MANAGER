import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// Mock data — same as what was hardcoded in the page
// ---------------------------------------------------------------------------

const mockAnalysis = {
  audioDNA: [
    { label: "BPM", value: "118", color: "text-rose-500" },
    { label: "Key", value: "Db Major", color: "text-violet-500" },
    { label: "Energy", value: 72, max: 100, color: "text-amber-500", barColor: "bg-amber-400" },
    { label: "Danceability", value: 65, max: 100, color: "text-pink-500", barColor: "bg-pink-400" },
    { label: "Valence (Mood)", value: 58, max: 100, color: "text-indigo-500", barColor: "bg-indigo-400", note: "Bittersweet / Nostalgic" },
    { label: "Acousticness", value: 22, max: 100, color: "text-emerald-500", barColor: "bg-emerald-400" },
    { label: "Instrumentalness", value: 8, max: 100, color: "text-sky-500", barColor: "bg-sky-400" },
    { label: "Loudness", value: "-6.2 dB", color: "text-orange-500" },
  ],
  genreTags: ["Indie Pop", "Electronic", "Synth Pop", "Dream Pop"],
  moodTags: ["Dreamy", "Reflective", "Uplifting", "Atmospheric"],
  playlistReadiness: {
    overall: 82,
    breakdown: [
      { label: "Production quality", score: 88 },
      { label: "Mix balance", score: 79 },
      { label: "Mastering loudness", score: 85 },
      { label: "Genre fit (current trends)", score: 76 },
      { label: "Hook strength", score: 84 },
    ],
  },
  mixingSuggestions: [
    {
      title: "Low-end clarity",
      description: "Your sub-bass at 60Hz competes with the kick. A 2dB cut at 55-65Hz would clean this up.",
      severity: "medium",
    },
    {
      title: "Vocal presence",
      description: "Adding a gentle 2dB shelf at 3kHz would bring the vocal forward without harshness.",
      severity: "low",
    },
    {
      title: "Stereo width",
      description: "The synth pad is panned center \u2014 spreading it to 60% L/R would create more space for the vocal.",
      severity: "low",
    },
  ],
  playlistMatches: [
    { name: "Indie Chill Vibes", followers: "182K", match: 94 },
    { name: "Dreamy Electronica", followers: "67.4K", match: 89 },
    { name: "Synth Pop Rising", followers: "43.1K", match: 85 },
    { name: "Late Night Drives", followers: "124K", match: 81 },
    { name: "Fresh Finds: Indie", followers: "256K", match: 78 },
  ],
  similarTracks: [
    { title: "Blinding Lights", artist: "The Weeknd", reason: "Shares the synth-driven production style and nostalgic tonal palette" },
    { title: "Somebody Else", artist: "The 1975", reason: "Similar atmospheric synth layering and mid-tempo groove" },
    { title: "Let It Happen", artist: "Tame Impala", reason: "Matching dreamy, layered production with evolving dynamics" },
    { title: "Midnight City", artist: "M83", reason: "Comparable synth textures and bittersweet emotional tone" },
    { title: "On Hold", artist: "The xx", reason: "Shared minimalist electronic feel with intimate vocal delivery" },
  ],
};

const mockPreviousAnalyses = [
  { id: "a1", title: "Midnight Dreams", date: "Mar 12, 2026", score: 78, genre: "Indie Electronic" },
  { id: "a2", title: "Electric Feel", date: "Feb 28, 2026", score: 71, genre: "Synth Pop" },
];

// ---------------------------------------------------------------------------
// GET /api/sound-analysis — Return recent analyses for user
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return mock data (replace with DB queries when available)
    return NextResponse.json({
      analyses: mockPreviousAnalyses,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch analyses";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/sound-analysis — Analyze a track
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { trackTitle } = body;

    if (!trackTitle) {
      return NextResponse.json(
        { error: "trackTitle is required" },
        { status: 400 }
      );
    }

    // Return mock analysis data (replace with AI service call when available)
    return NextResponse.json({
      trackTitle,
      ...mockAnalysis,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to analyze track";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
