import { NextRequest, NextResponse } from "next/server";
import { getAdminFromCookies } from "@/lib/auth";
import { users } from "@/lib/db";

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookies();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase();
  const plan = searchParams.get("plan");
  const status = searchParams.get("status");

  let filtered = [...users];

  if (search) {
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
    );
  }
  if (plan && plan !== "all") {
    filtered = filtered.filter((u) => u.plan === plan);
  }
  if (status && status !== "all") {
    filtered = filtered.filter((u) => u.status === status);
  }

  return NextResponse.json({
    users: filtered,
    total: filtered.length,
    plans: {
      starter: users.filter((u) => u.plan === "starter").length,
      pro: users.filter((u) => u.plan === "pro").length,
      business: users.filter((u) => u.plan === "business").length,
    },
  });
}
