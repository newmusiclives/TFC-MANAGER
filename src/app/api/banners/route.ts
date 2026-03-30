import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// Mock data — same as what was hardcoded in the page
// ---------------------------------------------------------------------------

const mockBanners = [
  { id: "b1", name: "Midnight Dreams - IG Post", size: "Instagram Post", createdAt: "Dec 12, 2025", template: "Neon Glow" },
  { id: "b2", name: "Midnight Dreams - Story", size: "Instagram Story", createdAt: "Dec 12, 2025", template: "Dark Minimal" },
  { id: "b3", name: "Electric Feel - YT Thumb", size: "YouTube Thumbnail", createdAt: "Sep 30, 2025", template: "Sunset Vibes" },
  { id: "b4", name: "Summer Waves - FB Cover", size: "Facebook Cover", createdAt: "Jul 18, 2025", template: "Ocean Wave" },
];

// ---------------------------------------------------------------------------
// GET /api/banners — Return user's saved banners
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return mock data (replace with DB queries when available)
    return NextResponse.json({ banners: mockBanners });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch banners";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/banners — Save a banner config
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, size, template, title, subtitle, artistName } = body;

    if (!name || !size) {
      return NextResponse.json(
        { error: "name and size are required" },
        { status: 400 }
      );
    }

    // Return mock created banner (replace with DB create when available)
    const newBanner = {
      id: `b${Date.now()}`,
      name,
      size,
      template: template || "Neon Glow",
      title: title || "",
      subtitle: subtitle || "",
      artistName: artistName || "",
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    return NextResponse.json({ banner: newBanner }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save banner";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
