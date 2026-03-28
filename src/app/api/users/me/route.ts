import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get user profile";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Only allow updating specific fields
    const allowedFields = ["name", "artistName", "bio", "genre", "location", "avatar"];
    const updateData: Record<string, string | null> = {};

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        artistName: true,
        avatar: true,
        bio: true,
        genre: true,
        location: true,
        plan: true,
        role: true,
        truefansConnectId: true,
        onboardingComplete: true,
        createdAt: true,
        updatedAt: true,
      },
      data: updateData,
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
