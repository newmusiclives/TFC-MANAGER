import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "truefans-manager-admin-secret-key-change-in-production"
);

const ADMIN_COOKIE = "tfc_admin_token";

// In-memory admin store (replace with DB in production)
const admins = [
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

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<Admin | null> {
  const admin = admins.find((a) => a.email === email);
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
    const admin = admins.find((a) => a.id === payload.sub);
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
