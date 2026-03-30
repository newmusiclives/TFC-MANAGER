import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // Return a nested proxy that mimics prisma.model.method() calls
    const modelProxy = new Proxy({}, {
      get(_target, method) {
        if (method === "then") return undefined;
        return (..._args: unknown[]) => {
          console.warn(
            `[TrueFans MANAGER] Database not configured. Set DATABASE_URL in .env to connect to PostgreSQL.`
          );
          return Promise.resolve(null);
        };
      },
    });
    return new Proxy({} as InstanceType<typeof PrismaClient>, {
      get(_target, prop) {
        if (prop === "then" || prop === "$connect" || prop === "$disconnect") {
          return undefined;
        }
        return modelProxy;
      },
    });
  }

  const adapter = new PrismaPg(url);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
