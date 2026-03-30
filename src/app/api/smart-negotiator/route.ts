import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ClauseAnalysis {
  name: string;
  assessment: string;
  marketComparison: string;
  risk: "Low" | "Medium" | "High" | "Critical";
}

interface ComparableDeal {
  type: string;
  typical: string;
  offered: string;
}

interface NegotiationAnalysis {
  id: string;
  offerText: string;
  fairnessScore: number;
  clauses: ClauseAnalysis[];
  counterProposal: string;
  comparableDeals: ComparableDeal[];
  tips: string[];
  analyzedAt: string;
}

// ---------------------------------------------------------------------------
// Mock analysis store (in-memory)
// ---------------------------------------------------------------------------

const mockHistory: NegotiationAnalysis[] = [
  {
    id: "neg-1",
    offerText: "Distribution deal with 80/20 split, 3-year term, exclusive rights...",
    fairnessScore: 54,
    clauses: [
      { name: "Revenue Split (80/20)", assessment: "Below market average. Most indie deals offer 85/15 or better.", marketComparison: "Market avg: 85/15", risk: "High" },
      { name: "Term Length (3 years)", assessment: "Standard for indie deals but limits flexibility.", marketComparison: "Market avg: 1-2 years", risk: "Medium" },
      { name: "Exclusive Rights", assessment: "Full exclusivity is aggressive. Consider carving out sync and direct-to-fan.", marketComparison: "Market: Often non-exclusive or limited exclusivity", risk: "Critical" },
    ],
    counterProposal: "Counter with 85/15 split, 18-month term with renewal option, and non-exclusive rights for sync licensing and direct-to-fan sales. Request quarterly transparent reporting and audit rights.",
    comparableDeals: [
      { type: "Indie Distribution", typical: "85/15 split, 1-2 year term", offered: "80/20 split, 3-year term" },
      { type: "Exclusivity", typical: "Non-exclusive or limited", offered: "Full exclusive" },
      { type: "Reporting", typical: "Monthly with audit rights", offered: "Quarterly, no audit clause" },
    ],
    tips: [
      "Never sign exclusive deals longer than 2 years without a performance clause",
      "Request a minimum marketing spend commitment",
      "Add a key-person clause in case your A&R contact leaves",
      "Negotiate for reversion rights if sales targets aren't met",
    ],
    analyzedAt: "2026-03-25T14:30:00Z",
  },
];

function generateMockAnalysis(offerText: string): NegotiationAnalysis {
  return {
    id: `neg-${Date.now()}`,
    offerText,
    fairnessScore: 62,
    clauses: [
      { name: "Advance Payment", assessment: "The offered advance of $5,000 is below market for an artist at your level with your streaming numbers.", marketComparison: "Market avg: $8,000-$15,000", risk: "High" },
      { name: "Revenue Split", assessment: "75/25 split is below the current indie standard. Push for at least 80/20.", marketComparison: "Market avg: 80/20 to 85/15", risk: "High" },
      { name: "Term Length", assessment: "2-year term is reasonable but should include performance benchmarks.", marketComparison: "Market avg: 1-3 years", risk: "Medium" },
      { name: "Rights Scope", assessment: "Worldwide rights are standard but ensure you retain sync licensing control.", marketComparison: "Market: Worldwide common, sync carve-out typical", risk: "Medium" },
      { name: "Marketing Commitment", assessment: "No guaranteed marketing spend mentioned. This is a red flag.", marketComparison: "Market: $2,000-$10,000 minimum common", risk: "Critical" },
      { name: "Audit Rights", assessment: "Standard audit clause present. This is acceptable.", marketComparison: "Market: Standard inclusion", risk: "Low" },
      { name: "Termination Clause", assessment: "30-day notice termination is fair for both parties.", marketComparison: "Market: 30-90 days standard", risk: "Low" },
    ],
    counterProposal: "Based on your streaming numbers and growth trajectory, counter with: $10,000 advance (recoupable against royalties only), 82/18 revenue split, 2-year term with 6-month performance review, worldwide distribution with sync rights retained by artist, minimum $5,000 marketing commitment per release, and monthly transparent reporting with annual audit rights.",
    comparableDeals: [
      { type: "Advance", typical: "$8,000-$15,000", offered: "$5,000" },
      { type: "Revenue Split", typical: "80/20 - 85/15", offered: "75/25" },
      { type: "Marketing Budget", typical: "$2,000-$10,000 guaranteed", offered: "Not specified" },
      { type: "Term Length", typical: "1-3 years with benchmarks", offered: "2 years, no benchmarks" },
      { type: "Sync Rights", typical: "Retained by artist", offered: "Included in deal" },
    ],
    tips: [
      "Always negotiate the advance upward — it signals the label's confidence in your project",
      "Insist on a guaranteed marketing budget per release, even if modest",
      "Retain sync licensing rights — this is increasingly the most lucrative revenue stream for indie artists",
      "Add a performance clause: if streams don't hit X in Y months, you can exit the deal",
      "Request quarterly (not annual) royalty statements for better cash flow planning",
      "Consider asking for a 'most favored nations' clause that ensures you get terms at least as good as similar artists on the roster",
    ],
    analyzedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// GET /api/smart-negotiator — Returns analysis history
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({ analyses: mockHistory });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/smart-negotiator] GET error:", message);
    return NextResponse.json(
      { error: "Failed to fetch negotiation history", detail: message },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/smart-negotiator — Analyze an offer
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { offerText } = body;

    if (!offerText || typeof offerText !== "string" || offerText.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide offer/contract text (at least 10 characters)" },
        { status: 400 }
      );
    }

    const analysis = generateMockAnalysis(offerText.trim());
    mockHistory.unshift(analysis);

    return NextResponse.json({ analysis });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/smart-negotiator] POST error:", message);
    return NextResponse.json(
      { error: "Failed to analyze offer", detail: message },
      { status: 500 }
    );
  }
}
