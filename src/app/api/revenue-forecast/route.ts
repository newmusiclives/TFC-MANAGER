import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActualMonth {
  month: string;
  amount: number;
}

interface PredictedMonth {
  month: string;
  amount: number;
  low: number;
  high: number;
}

interface RevenueForecast {
  actual: ActualMonth[];
  predicted: PredictedMonth[];
  bySource: {
    streaming: number;
    sync: number;
    merch: number;
    shows: number;
    fanFunding: number;
  };
  factors: string[];
  scenarios: {
    conservative: { total: number; assumptions: string[] };
    expected: { total: number; assumptions: string[] };
    optimistic: { total: number; assumptions: string[] };
  };
  actions: { title: string; estimatedImpact: string; description: string }[];
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

function getMockForecast(): RevenueForecast {
  return {
    actual: [
      { month: "Oct 2025", amount: 3200 },
      { month: "Nov 2025", amount: 3650 },
      { month: "Dec 2025", amount: 4100 },
      { month: "Jan 2026", amount: 3800 },
      { month: "Feb 2026", amount: 4400 },
      { month: "Mar 2026", amount: 4950 },
    ],
    predicted: [
      { month: "Apr 2026", amount: 5200, low: 4600, high: 5800 },
      { month: "May 2026", amount: 5600, low: 4800, high: 6400 },
      { month: "Jun 2026", amount: 6100, low: 5100, high: 7100 },
      { month: "Jul 2026", amount: 5800, low: 4700, high: 6900 },
      { month: "Aug 2026", amount: 6400, low: 5200, high: 7600 },
      { month: "Sep 2026", amount: 7000, low: 5600, high: 8400 },
    ],
    bySource: {
      streaming: 18500,
      sync: 8000,
      merch: 6200,
      shows: 9800,
      fanFunding: 3600,
    },
    factors: [
      "Streaming growth rate of 12% month-over-month based on playlist momentum",
      "Upcoming single release in April expected to boost streams by 30%",
      "Summer festival season typically increases show revenue by 40%",
      "Merch sales correlate with live show activity — expect Q3 bump",
      "Fan funding is growing 8% monthly since launching supporter tiers",
      "Sync licensing pipeline has 3 active placements pending",
    ],
    scenarios: {
      conservative: {
        total: 32400,
        assumptions: [
          "No new playlist placements",
          "Current streaming growth slows to 5%",
          "Only confirmed shows (no new bookings)",
          "No sync placements close",
        ],
      },
      expected: {
        total: 42600,
        assumptions: [
          "2-3 new editorial playlist placements",
          "Current growth rate maintained at 12%",
          "3 additional shows booked for summer",
          "1 sync placement closes ($3-5K)",
        ],
      },
      optimistic: {
        total: 56200,
        assumptions: [
          "Viral moment or major playlist feature",
          "Growth accelerates to 20%+",
          "Full summer tour (8+ shows)",
          "2-3 sync placements close",
          "Merch collab or limited drop success",
        ],
      },
    },
    actions: [
      {
        title: "Release single in early April",
        estimatedImpact: "+$2,400/month",
        description: "Capitalize on your playlist momentum. A well-timed single can boost streaming revenue by 30% and feed the algorithm.",
      },
      {
        title: "Book 3 more summer shows",
        estimatedImpact: "+$4,500 total",
        description: "Your show revenue is your second-highest source. Summer festival slots are still available for emerging artists.",
      },
      {
        title: "Launch limited merch drop",
        estimatedImpact: "+$1,800 one-time",
        description: "A limited-edition item tied to your new release creates urgency. Your Platinum fans have a 70% merch purchase rate.",
      },
      {
        title: "Follow up on sync opportunities",
        estimatedImpact: "+$3,000-$5,000",
        description: "You have 3 sync placements in the pipeline. Proactive follow-up increases close rate by 40%.",
      },
      {
        title: "Grow fan funding to 200 supporters",
        estimatedImpact: "+$800/month recurring",
        description: "You're at 120 supporters now. A targeted campaign to your top engaged fans could hit 200 by summer.",
      },
    ],
    generatedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// GET /api/revenue-forecast — Returns forecast data
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = getMockForecast();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/revenue-forecast] GET error:", message);
    return NextResponse.json(
      { error: "Failed to fetch revenue forecast", detail: message },
      { status: 500 }
    );
  }
}
