import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// Mock data — same as what was hardcoded in the page
// ---------------------------------------------------------------------------

const mockData = {
  trendingSounds: [
    { name: "Lo-fi Synth Washes", platform: "TikTok", growth: "+340%", uses: "12.4K", relevance: 92, genre: "Electronic" },
    { name: "Acoustic Guitar + 808s", platform: "Instagram Reels", growth: "+180%", uses: "8.7K", relevance: 78, genre: "Indie Pop" },
    { name: "Slowed + Reverb Vocals", platform: "TikTok", growth: "+520%", uses: "24.1K", relevance: 85, genre: "Pop" },
    { name: "Jazz Chords on Synths", platform: "YouTube Shorts", growth: "+210%", uses: "5.2K", relevance: 88, genre: "Electronic" },
    { name: "Whisper Vocals Trend", platform: "TikTok", growth: "+150%", uses: "6.8K", relevance: 71, genre: "Indie" },
  ],
  risingArtists: [
    { name: "Nova Klein", genre: "Indie Electronic", listeners: "14.2K", growth: "+45%", location: "Berlin", compatibility: 91 },
    { name: "Suki Ray", genre: "Dream Pop", listeners: "22.8K", growth: "+38%", location: "London", compatibility: 87 },
    { name: "Davi Lux", genre: "Synth Pop", listeners: "9.6K", growth: "+62%", location: "S\u00e3o Paulo", compatibility: 84 },
    { name: "Emi Sato", genre: "Indie Pop", listeners: "18.1K", growth: "+29%", location: "Tokyo", compatibility: 79 },
    { name: "Marco Ven", genre: "Electronic / Ambient", listeners: "11.4K", growth: "+51%", location: "Amsterdam", compatibility: 76 },
  ],
  syncOpportunities: [
    { title: "Nike \u2014 Spring Campaign", type: "Commercial", budget: "$5K-15K", genre: "Upbeat Electronic/Pop", deadline: "Apr 10, 2026", match: 88 },
    { title: "Netflix \u2014 Indie Drama Series", type: "TV Show", budget: "$2K-8K", genre: "Atmospheric Indie", deadline: "Apr 25, 2026", match: 82 },
    { title: "EA Sports FC 27 \u2014 Soundtrack", type: "Video Game", budget: "$3K-10K", genre: "Electronic/Indie Pop", deadline: "May 15, 2026", match: 79 },
    { title: "Apple \u2014 Product Launch", type: "Commercial", budget: "$10K-50K", genre: "Minimal Electronic", deadline: "May 1, 2026", match: 74 },
  ],
  playlistCurators: [
    { name: "Chill Electronic Vibes", curator: "@electronica_daily", followers: "48.2K", genre: "Electronic", accepting: true, successRate: 34 },
    { name: "Indie Discoveries", curator: "@indie_finds", followers: "122K", genre: "Indie Pop", accepting: true, successRate: 18 },
    { name: "Late Night Synths", curator: "@synthwave_nights", followers: "31.5K", genre: "Synth/Electronic", accepting: true, successRate: 42 },
    { name: "Fresh Vocals", curator: "@vocal_spotlight", followers: "67.8K", genre: "Pop/Indie", accepting: false, successRate: 22 },
  ],
};

// ---------------------------------------------------------------------------
// GET /api/trends-radar — Return trending data
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return mock data (replace with real trend analysis when available)
    return NextResponse.json(mockData);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch trends data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
