import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// GET /api/contracts — List user's contracts
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contracts = await prisma.contract.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ contracts });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch contracts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/contracts — Create a new contract record
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, fileUrl, pages } = body;

    if (!fileName || !fileUrl) {
      return NextResponse.json(
        { error: "fileName and fileUrl are required" },
        { status: 400 }
      );
    }

    const contract = await prisma.contract.create({
      data: {
        userId: user.id,
        fileName,
        fileUrl,
        pages: pages || 0,
        status: "processing",
      },
    });

    return NextResponse.json({ contract }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create contract";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
