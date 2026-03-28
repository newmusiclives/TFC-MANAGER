import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// GET /api/auth/youtube — redirect to Google/YouTube OAuth authorization
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const baseUrl = process.env.NEXTAUTH_URL || "";

  if (!clientId || clientId.includes("your-") || !baseUrl) {
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=not-configured", baseUrl || request.url)
    );
  }

  const redirectUri = `${baseUrl}/api/auth/youtube/callback`;
  const scopes = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/yt-analytics.readonly",
  ].join(" ");

  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString(
    "base64url"
  );

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    state,
    access_type: "offline",
    prompt: "consent",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
