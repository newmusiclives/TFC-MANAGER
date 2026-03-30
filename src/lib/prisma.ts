import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("password@localhost")) {
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
        // Return a model-level proxy so prisma.user.findUnique() works
        return modelProxy;
      },
    });
  }
  // @ts-expect-error -- Prisma 7 constructor signature varies
  return new PrismaClient({ datasourceUrl: url });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
