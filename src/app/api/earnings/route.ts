import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// GET /api/earnings — List user's earnings with filters and aggregations
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period");
    const platform = searchParams.get("platform");

    const where: Record<string, unknown> = { userId: user.id };
    if (period) where.period = period;
    if (platform) where.platform = platform;

    // Current month string for thisMonth aggregation
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const [earnings, totalLifetimeAgg, thisMonthAgg, byPlatformRaw] =
      await Promise.all([
        prisma.earning.findMany({
          where,
          orderBy: { createdAt: "desc" },
          include: {
            release: { select: { id: true, title: true } },
          },
        }),
        prisma.earning.aggregate({
          where: { userId: user.id },
          _sum: { amount: true },
        }),
        prisma.earning.aggregate({
          where: { userId: user.id, period: currentMonth },
          _sum: { amount: true },
        }),
        prisma.earning.groupBy({
          by: ["platform"],
          where: { userId: user.id },
          _sum: { amount: true },
        }),
      ]);

    const byPlatform: Record<string, number> = {};
    for (const entry of byPlatformRaw) {
      byPlatform[entry.platform] = entry._sum.amount || 0;
    }

    return NextResponse.json({
      earnings,
      totalLifetime: totalLifetimeAgg._sum.amount || 0,
      thisMonth: thisMonthAgg._sum.amount || 0,
      byPlatform,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch earnings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
