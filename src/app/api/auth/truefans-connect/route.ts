import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// GET /api/auth/truefans-connect — redirect to TrueFans CONNECT linking flow
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connectApiUrl = process.env.TRUEFANS_CONNECT_API_URL || "";
  const baseUrl = process.env.NEXTAUTH_URL || "";

  if (!connectApiUrl || connectApiUrl.includes("your-") || !baseUrl) {
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=not-configured", baseUrl || request.url)
    );
  }

  const redirectUri = `${baseUrl}/api/auth/truefans-connect/callback`;

  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString(
    "base64url"
  );

  const params = new URLSearchParams({
    redirect_uri: redirectUri,
    state,
  });

  return NextResponse.redirect(
    `${connectApiUrl}/oauth/authorize?${params.toString()}`
  );
}
