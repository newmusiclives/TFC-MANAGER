import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// Mock data — same as what was hardcoded in the page
// ---------------------------------------------------------------------------

const mockData = {
  yourPosition: {
    you: { listeners: "18.2K", streams: "128.5K", saveRate: "24.3%", releases: 12 },
    average: { listeners: "22.1K", streams: "156K", saveRate: "19.8%", releases: 15 },
  },
  similarArtists: [
    {
      name: "Nova Klein",
      listeners: "24.8K",
      growth: "+12%",
      streams: "186K",
      location: "Berlin",
      genre: "Indie Electronic",
      playlistGap: ["Fresh Finds", "Indie Electronic Mix", "Berlin Beats"],
      recentMove: "Released remix on Wednesday, got 4 new playlist adds",
      highlight: "remix-strategy",
    },
    {
      name: "Suki Ray",
      listeners: "22.8K",
      growth: "+8%",
      streams: "164K",
      location: "London",
      genre: "Dream Pop",
      playlistGap: ["Fresh Finds", "Dream Pop Essentials"],
      recentMove: "Got editorial placement this month \u2014 Spotify's 'Fresh Finds'",
      highlight: "editorial",
    },
    {
      name: "Davi Lux",
      listeners: "15.6K",
      growth: "+62%",
      streams: "98K",
      location: "S\u00e3o Paulo",
      genre: "Synth Pop",
      playlistGap: ["Synth Pop Rising"],
      recentMove: "Viral TikTok moment \u2014 15-second hook challenge (+62% growth)",
      highlight: "viral",
    },
    {
      name: "Emi Sato",
      listeners: "18.1K",
      growth: "+5%",
      streams: "142K",
      location: "Tokyo",
      genre: "Indie Pop",
      playlistGap: ["Indie Pop Chill", "Tokyo Nights"],
      recentMove: "Consistent release schedule \u2014 new single every 5 weeks",
      highlight: "consistency",
    },
    {
      name: "Marco Ven",
      listeners: "11.4K",
      growth: "+18%",
      streams: "72K",
      location: "Amsterdam",
      genre: "Electronic",
      playlistGap: ["Late Night Synths", "Electronic Focus"],
      recentMove: "Strong sync licensing strategy \u2014 3 placements this quarter",
      highlight: "sync",
    },
  ],
  playlistGapAnalysis: [
    { name: "Fresh Finds", competitors: ["Nova Klein", "Suki Ray"], yourStatus: "not-on", action: "Generate Pitch" },
    { name: "Indie Chill Vibes", competitors: ["Emi Sato", "Davi Lux"], yourStatus: "active", action: null },
    { name: "Late Night Synths", competitors: ["Marco Ven"], yourStatus: "not-on", action: "Generate Pitch" },
    { name: "Indie Electronic Mix", competitors: ["Nova Klein"], yourStatus: "not-on", action: "Generate Pitch" },
    { name: "Berlin Beats", competitors: ["Nova Klein"], yourStatus: "not-on", action: "Generate Pitch" },
    { name: "Dream Pop Essentials", competitors: ["Suki Ray", "Emi Sato"], yourStatus: "not-on", action: "Generate Pitch" },
    { name: "Synth Pop Rising", competitors: ["Davi Lux", "Marco Ven"], yourStatus: "active", action: null },
  ],
  strategyInsights: [
    {
      color: "text-purple-600",
      bg: "bg-purple-50",
      text: "Nova Klein's remix strategy is working \u2014 her remixes get 40% more playlist adds than originals. Consider this for 'Midnight Dreams'.",
    },
    {
      color: "text-blue-600",
      bg: "bg-blue-50",
      text: "Suki Ray's editorial pitch was submitted 21 days before release with press coverage attached. Your typical lead time is 14 days \u2014 extend to 21+ for Golden Hour.",
    },
    {
      color: "text-orange-600",
      bg: "bg-orange-50",
      text: "Davi Lux's TikTok growth came from a 15-second hook challenge. Your track 'Golden Hour' has a strong hook at 0:45 \u2014 consider creating a similar challenge.",
    },
  ],
  growthData: [
    { month: "Oct", you: 12400, novaKlein: 16200, sukiRay: 18400, daviLux: 6800 },
    { month: "Nov", you: 13100, novaKlein: 17800, sukiRay: 19200, daviLux: 7900 },
    { month: "Dec", you: 14800, novaKlein: 19400, sukiRay: 20100, daviLux: 9200 },
    { month: "Jan", you: 15600, novaKlein: 21200, sukiRay: 21800, daviLux: 10400 },
    { month: "Feb", you: 16900, novaKlein: 22800, sukiRay: 22200, daviLux: 12800 },
    { month: "Mar", you: 18200, novaKlein: 24800, sukiRay: 22800, daviLux: 15600 },
  ],
};

// ---------------------------------------------------------------------------
// GET /api/competitive-intel — Return competitive intelligence data
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return mock data (replace with real analysis when available)
    return NextResponse.json(mockData);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch competitive intel";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
