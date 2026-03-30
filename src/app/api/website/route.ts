import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// Mock data — same as what was hardcoded in the page
// ---------------------------------------------------------------------------

const mockConfig = {
  artistName: "Jordan Davis",
  tagline: "Independent artist blending pop, electronic, and indie",
  bio: "Jordan Davis is an independent artist based in Los Angeles, blending pop, electronic, and indie influences to create music that connects hearts and moves feet. With over 128K streams across platforms and a growing fanbase, Jordan is quickly becoming a standout voice in the indie-electronic scene.",
  genre: "Pop / Electronic / Indie",
  location: "Los Angeles, CA",
  theme: "dark",
  accentColor: "#00c878",
  featuredMusic: ["Midnight Dreams", "Electric Feel", "Summer Waves EP"],
  contact: {
    bookingEmail: "booking@jordandavis.com",
    managementEmail: "mgmt@jordandavis.com",
    pressEmail: "press@jordandavis.com",
    phone: "",
  },
  socialLinks: {
    instagram: "@jordandavis",
    tiktok: "@jordandavis",
    twitter: "@jordandavis",
    youtube: "",
    facebook: "",
  },
  websiteUrl: "truefans.link/jordandavis",
};

// ---------------------------------------------------------------------------
// GET /api/website — Return user's website/EPK config
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
      error instanceof Error ? error.message : "Failed to fetch website config";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/website — Save website/EPK config
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Return saved config (replace with DB update when available)
    return NextResponse.json({
      ...mockConfig,
      ...body,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save website config";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/website — Partial update of website/EPK config
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
      error instanceof Error ? error.message : "Failed to update website config";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
