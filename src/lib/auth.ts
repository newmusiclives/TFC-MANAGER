import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "truefans-manager-admin-secret-key-change-in-production"
);

const ADMIN_COOKIE = "tfc_admin_token";

// Fallback in-memory admin store (used when DB is not configured)
const fallbackAdmins = [
  {
    id: "1",
    email: "admin@truefansmanager.com",
    password: bcrypt.hashSync("admin123", 10),
    name: "Admin",
    role: "super_admin" as const,
    avatar: "AD",
    createdAt: "2025-01-01",
  },
];

export type Admin = {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "moderator";
  avatar: string;
};

/** Map Prisma UserRole enum values to the Admin role type used throughout the admin panel. */
function mapDbRole(role: string): "super_admin" | "admin" | "moderator" | null {
  switch (role) {
    case "SUPER_ADMIN":
      return "super_admin";
    case "ADMIN":
      return "admin";
    default:
      return null;
  }
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<Admin | null> {
  // Try database first
  try {
    const dbUser = await prisma.user.findUnique({ where: { email } });
    if (dbUser) {
      const mappedRole = mapDbRole(dbUser.role);
      if (!mappedRole) return null; // Not an admin

      const valid = await bcrypt.compare(password, dbUser.passwordHash);
      if (!valid) return null;

      return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: mappedRole,
        avatar: dbUser.avatar || dbUser.name.slice(0, 2).toUpperCase(),
      };
    }
  } catch {
    // Database not configured or query failed — fall through to fallback
  }

  // Fallback to in-memory admin
  const admin = fallbackAdmins.find((a) => a.email === email);
  if (!admin) return null;

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return null;

  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    avatar: admin.avatar,
  };
}

export async function createToken(admin: Admin): Promise<string> {
  return new SignJWT({ sub: admin.id, email: admin.email, role: admin.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string
): Promise<Admin | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const id = payload.sub;
    if (!id) return null;

    // Try database first
    try {
      const dbUser = await prisma.user.findUnique({ where: { id } });
      if (dbUser) {
        const mappedRole = mapDbRole(dbUser.role);
        if (!mappedRole) return null;
        return {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: mappedRole,
          avatar: dbUser.avatar || dbUser.name.slice(0, 2).toUpperCase(),
        };
      }
    } catch {
      // Database not configured — fall through to fallback
    }

    // Fallback to in-memory admin
    const admin = fallbackAdmins.find((a) => a.id === id);
    if (!admin) return null;
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      avatar: admin.avatar,
    };
  } catch {
    return null;
  }
}

export async function getAdminFromCookies(): Promise<Admin | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export { ADMIN_COOKIE };
