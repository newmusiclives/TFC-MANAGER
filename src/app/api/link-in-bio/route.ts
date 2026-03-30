import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// Mock data — same as what was hardcoded in the page
// ---------------------------------------------------------------------------

const mockConfig = {
  profileName: "Jordan Davis",
  bio: "Independent artist. Dreamer. Making waves one track at a time.",
  theme: "dark",
  accentColor: "#7c3aed",
  fontStyle: "modern",
  links: [
    { id: "1", type: "latest-release", title: "Midnight Dreams", url: "https://truefans.link/s/midnight-dreams", clicks: 890, enabled: true },
    { id: "2", type: "social-profile", title: "Spotify Profile", url: "https://open.spotify.com/artist/jordandavis", clicks: 420, enabled: true },
    { id: "3", type: "latest-release", title: "New EP Pre-Save", url: "https://truefans.link/s/summer-waves-ep", clicks: 380, enabled: true },
    { id: "4", type: "mailing-list", title: "Join Mailing List", url: "https://truefans.link/ml/jordandavis", clicks: 310, enabled: true },
    { id: "5", type: "fan-funding", title: "Support on Fan Funding", url: "https://truefans.link/fund/jordandavis", clicks: 190, enabled: true },
  ],
  analytics: {
    totalPageViews: 4280,
    totalClicks: 2190,
    ctr: "51.2%",
  },
};

// ---------------------------------------------------------------------------
// GET /api/link-in-bio — Return user's link-in-bio config
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return mock data (replace with DB queries when available)
    return NextResponse.json(mockConfig);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch link-in-bio config";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/link-in-bio — Save link-in-bio config
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { profileName, bio, theme, accentColor, fontStyle, links } = body;

    // Return saved config (replace with DB update when available)
    return NextResponse.json({
      profileName: profileName ?? mockConfig.profileName,
      bio: bio ?? mockConfig.bio,
      theme: theme ?? mockConfig.theme,
      accentColor: accentColor ?? mockConfig.accentColor,
      fontStyle: fontStyle ?? mockConfig.fontStyle,
      links: links ?? mockConfig.links,
      analytics: mockConfig.analytics,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save link-in-bio config";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/link-in-bio — Partial update of link-in-bio config
// ---------------------------------------------------------------------------

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Return merged config (replace with DB update when available)
    return NextResponse.json({
      ...mockConfig,
      ...body,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update link-in-bio config";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
