// ---------------------------------------------------------------------------
// prisma/seed.ts — Idempotent seed script for TrueFans MANAGER
// Run with: npx tsx prisma/seed.ts
// ---------------------------------------------------------------------------

import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ------ 1. Admin user ------
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@truefansmanager.com" },
    update: {},
    create: {
      email: "admin@truefansmanager.com",
      passwordHash: adminPasswordHash,
      name: "Admin",
      role: "SUPER_ADMIN",
      plan: "BUSINESS",
      onboardingComplete: true,
    },
  });
  console.log(`  Admin user: ${admin.email} (${admin.id})`);

  // ------ 2. Demo artist user ------
  const demoPasswordHash = await bcrypt.hash("demo123", 10);
  const demo = await prisma.user.upsert({
    where: { email: "demo@truefansmanager.com" },
    update: {},
    create: {
      email: "demo@truefansmanager.com",
      passwordHash: demoPasswordHash,
      name: "Demo User",
      artistName: "Demo Artist",
      role: "ARTIST",
      plan: "PRO",
      onboardingComplete: true,
      genre: "Indie Pop",
      location: "Los Angeles, CA",
      bio: "An up-and-coming indie pop artist pushing creative boundaries.",
    },
  });
  console.log(`  Demo user: ${demo.email} (${demo.id})`);

  // ------ 3. Sample releases for demo user ------
  const releasesData = [
    {
      title: "Midnight Drive",
      type: "SINGLE" as const,
      genre: "Indie Pop",
      status: "LIVE" as const,
      releaseDate: new Date("2026-01-15"),
    },
    {
      title: "Neon Dreams EP",
      type: "EP" as const,
      genre: "Synth Pop",
      status: "LIVE" as const,
      releaseDate: new Date("2026-02-20"),
    },
    {
      title: "Summer Sessions",
      type: "ALBUM" as const,
      genre: "Indie Pop",
      status: "DRAFT" as const,
      releaseDate: new Date("2026-06-01"),
    },
  ];

  const releases = [];
  for (const r of releasesData) {
    const release = await prisma.release.upsert({
      where: {
        id: `seed-release-${r.title.toLowerCase().replace(/\s+/g, "-")}`,
      },
      update: {},
      create: {
        id: `seed-release-${r.title.toLowerCase().replace(/\s+/g, "-")}`,
        userId: demo.id,
        title: r.title,
        type: r.type,
        genre: r.genre,
        status: r.status,
        releaseDate: r.releaseDate,
      },
    });
    releases.push(release);
    console.log(`  Release: ${release.title} (${release.id})`);
  }

  // ------ 4. Sample subscribers ------
  const subscribersData = [
    { email: "fan1@example.com", name: "Alex Rivera", source: "website", engagementScore: 85 },
    { email: "fan2@example.com", name: "Jordan Lee", source: "smart-link", engagementScore: 72 },
    { email: "fan3@example.com", name: "Casey Morgan", source: "campaign", engagementScore: 91 },
    { email: "fan4@example.com", name: "Taylor Kim", source: "truefans_connect", engagementScore: 65 },
    { email: "fan5@example.com", name: "Sam Patel", source: "website", engagementScore: 78 },
  ];

  for (const s of subscribersData) {
    const sub = await prisma.subscriber.upsert({
      where: { userId_email: { userId: demo.id, email: s.email } },
      update: {},
      create: {
        userId: demo.id,
        email: s.email,
        name: s.name,
        source: s.source,
        engagementScore: s.engagementScore,
        tags: ["seed-data"],
      },
    });
    console.log(`  Subscriber: ${sub.name} (${sub.email})`);
  }

  // ------ 5. Sample earnings ------
  const earningsData = [
    { platform: "Spotify", amount: 342.5, period: "2026-01", releaseId: releases[0]?.id },
    { platform: "Apple Music", amount: 187.25, period: "2026-02", releaseId: releases[1]?.id },
  ];

  for (const e of earningsData) {
    const earning = await prisma.earning.create({
      data: {
        userId: demo.id,
        platform: e.platform,
        amount: e.amount,
        period: e.period,
        releaseId: e.releaseId ?? null,
        currency: "USD",
      },
    });
    console.log(`  Earning: $${earning.amount} from ${earning.platform} (${earning.period})`);
  }

  // ------ 6. Analytics snapshot ------
  const existingSnapshot = await prisma.analyticsSnapshot.findFirst({
    where: { userId: demo.id },
    orderBy: { date: "desc" },
  });

  if (!existingSnapshot) {
    const snapshot = await prisma.analyticsSnapshot.create({
      data: {
        userId: demo.id,
        date: new Date("2026-03-01"),
        totalStreams: 125_400,
        monthlyListeners: 8_320,
        followers: 2_150,
        saveRate: 12.5,
        platformBreakdown: {
          spotify: 72000,
          apple_music: 31400,
          youtube_music: 14000,
          tidal: 8000,
        },
        topCountries: [
          { country: "United States", listeners: 3200 },
          { country: "United Kingdom", listeners: 1800 },
          { country: "Canada", listeners: 1100 },
          { country: "Australia", listeners: 720 },
        ],
        demographics: {
          age: { "18-24": 35, "25-34": 42, "35-44": 15, "45+": 8 },
          gender: { male: 48, female: 46, other: 6 },
        },
      },
    });
    console.log(`  Analytics snapshot: ${snapshot.date.toISOString().slice(0, 10)}`);
  } else {
    console.log("  Analytics snapshot already exists, skipping.");
  }

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
