import { NextRequest, NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { artists } from "@/lib/db";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase();
  const status = searchParams.get("status");

  let filtered = [...artists];

  if (search) {
    filtered = filtered.filter(
      (a) =>
        a.name.toLowerCase().includes(search) ||
        a.genre.toLowerCase().includes(search) ||
        a.location.toLowerCase().includes(search)
    );
  }
  if (status && status !== "all") {
    filtered = filtered.filter((a) => a.status === status);
  }

  return NextResponse.json({
    artists: filtered,
    total: filtered.length,
  });
}
