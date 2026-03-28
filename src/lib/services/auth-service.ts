import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "truefans-manager-secret-key-change-in-production"
);

const COOKIE_NAME = "tfm_user_token";
const TOKEN_EXPIRY = "7d";

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------

export async function registerUser(
  email: string,
  password: string,
  name: string,
  artistName?: string
) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("A user with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      artistName: artistName || null,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error("Invalid email or password");
  }

  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
}

// ---------------------------------------------------------------------------
// Verify token
// ---------------------------------------------------------------------------

export async function verifyUserToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.sub) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Get user from request (cookie or Authorization header)
// ---------------------------------------------------------------------------

export async function getUserFromRequest(request: NextRequest) {
  // Try cookie first
  let token = request.cookies.get(COOKIE_NAME)?.value;

  // Fall back to Authorization header
  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }

  if (!token) return null;

  return verifyUserToken(token);
}

// ---------------------------------------------------------------------------
// Update user plan
// ---------------------------------------------------------------------------

export async function updateUserPlan(
  userId: string,
  plan: "STARTER" | "PRO" | "BUSINESS"
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { plan },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// ---------------------------------------------------------------------------
// Link TrueFans CONNECT account
// ---------------------------------------------------------------------------

export async function linkTrueFansConnect(userId: string, connectId: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      truefansConnectId: connectId,
      plan: "PRO",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export { COOKIE_NAME };
