import { NextRequest, NextResponse } from "next/server";
import { registerUser, loginUser, COOKIE_NAME } from "@/lib/services/auth-service";
import { validateRegister } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = validateRegister(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { email, password, name, artistName } = validation.data;
    const user = await registerUser(email, password, name, artistName);

    // Log the user in immediately after registration
    const { token } = await loginUser(email, password);

    const response = NextResponse.json({ user }, { status: 201 });

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
      error instanceof Error ? error.message : "Registration failed";

    const status = message.includes("already exists") ? 409 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
