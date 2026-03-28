import { NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import {
  platformStats,
  revenueData,
  planDistribution,
  recentActivity,
} from "@/lib/db";

export async function GET() {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    stats: platformStats,
    revenueData,
    planDistribution,
    recentActivity,
  });
}
