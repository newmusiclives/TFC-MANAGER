import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("password@localhost")) {
    // Return a proxy that throws helpful errors when DB is not configured
    return new Proxy({} as InstanceType<typeof PrismaClient>, {
      get(_target, prop) {
        if (prop === "then" || prop === "$connect" || prop === "$disconnect") {
          return undefined;
        }
        return () => {
          console.warn(
            `[TrueFans Manager] Database not configured. Set DATABASE_URL in .env to connect to PostgreSQL.`
          );
          return Promise.resolve(null);
        };
      },
    });
  }
  // @ts-expect-error -- Prisma 7 constructor signature varies
  return new PrismaClient({ datasourceUrl: url });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
