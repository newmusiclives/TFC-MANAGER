import { NextRequest, NextResponse } from "next/server";
import { loginUser, COOKIE_NAME } from "@/lib/services/auth-service";
import { validateLogin } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateLogin(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { email, password } = validation.data;
    const { token, user } = await loginUser(email, password);

    const response = NextResponse.json({ user, token });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed";

    return NextResponse.json({ error: message }, { status: 401 });
  }
}
