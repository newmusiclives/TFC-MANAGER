import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/auth-service";

const mockStatements = [
  { id: "rs-1", distributor: "DistroKid", period: "2026-01", totalAmount: 1842.56, streams: 614187, downloads: 89, isReconciled: true, importedAt: "2026-02-15" },
  { id: "rs-2", distributor: "TuneCore", period: "2026-01", totalAmount: 623.41, streams: 178117, downloads: 42, isReconciled: true, importedAt: "2026-02-16" },
  { id: "rs-3", distributor: "CD Baby", period: "2026-01", totalAmount: 312.89, streams: 89397, downloads: 28, isReconciled: false, importedAt: "2026-02-17" },
  { id: "rs-4", distributor: "DistroKid", period: "2026-02", totalAmount: 2105.73, streams: 701910, downloads: 104, isReconciled: true, importedAt: "2026-03-14" },
  { id: "rs-5", distributor: "TuneCore", period: "2026-02", totalAmount: 718.92, streams: 205406, downloads: 51, isReconciled: false, importedAt: "2026-03-15" },
  { id: "rs-6", distributor: "CD Baby", period: "2026-02", totalAmount: 289.10, streams: 82600, downloads: 19, isReconciled: false, importedAt: "2026-03-16" },
];

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalAmount = mockStatements.reduce((s, r) => s + r.totalAmount, 0);
    const totalStreams = mockStatements.reduce((s, r) => s + r.streams, 0);
    const reconciled = mockStatements.filter((r) => r.isReconciled).length;

    return NextResponse.json({
      statements: mockStatements,
      stats: {
        totalAmount: +totalAmount.toFixed(2),
        totalStreams,
        totalDownloads: mockStatements.reduce((s, r) => s + r.downloads, 0),
        reconciledCount: reconciled,
        unreconciledCount: mockStatements.length - reconciled,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch royalty data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
