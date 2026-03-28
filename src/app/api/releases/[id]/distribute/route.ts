import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import prisma from "@/lib/prisma";

// Default distribution platforms
const DISTRIBUTION_PLATFORMS = [
  "spotify",
  "apple_music",
  "amazon_music",
  "youtube_music",
  "tidal",
  "deezer",
];

// ---------------------------------------------------------------------------
// POST /api/releases/[id]/distribute — Submit release to distribution
// ---------------------------------------------------------------------------

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const release = await prisma.release.findFirst({
      where: { id, userId: user.id },
      include: { distributions: true },
    });

    if (!release) {
      return NextResponse.json(
        { error: "Release not found" },
        { status: 404 }
      );
    }

    if (release.status === "ARCHIVED") {
      return NextResponse.json(
        { error: "Cannot distribute an archived release" },
        { status: 400 }
      );
    }

    if (release.status === "LIVE") {
      return NextResponse.json(
        { error: "Release is already live" },
        { status: 400 }
      );
    }

    // Read optional platforms from body, fallback to defaults
    let platforms = DISTRIBUTION_PLATFORMS;
    try {
      const body = await request.json();
      if (body.platforms && Array.isArray(body.platforms) && body.platforms.length > 0) {
        platforms = body.platforms;
      }
    } catch {
      // No body or invalid JSON — use defaults
    }

    // Filter out platforms that already have a distribution record
    const existingPlatforms = new Set(
      release.distributions.map((d) => d.platform)
    );
    const newPlatforms = platforms.filter((p) => !existingPlatforms.has(p));

    if (newPlatforms.length === 0) {
      return NextResponse.json(
        { error: "All selected platforms already have distribution records" },
        { status: 400 }
      );
    }

    // Create distribution records
    const distributions = await prisma.$transaction(
      newPlatforms.map((platform) =>
        prisma.distribution.create({
          data: {
            releaseId: id,
            platform,
            status: "PENDING",
            submittedAt: new Date(),
          },
        })
      )
    );

    // Update release status to SUBMITTED
    await prisma.release.update({
      where: { id },
      data: { status: "SUBMITTED" },
    });

    return NextResponse.json(
      {
        message: `Release submitted to ${newPlatforms.length} platform(s)`,
        distributions,
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to distribute release";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
