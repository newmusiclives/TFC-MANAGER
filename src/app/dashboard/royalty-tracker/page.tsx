"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  DollarSign,
  FileText,
  CheckCircle2,
  XCircle,
  Upload,
  Scale,
  Calculator,
  Loader2,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Music,
  ShoppingBag,
  Ticket,
  Tv,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { apiGet } from "@/lib/api-client";
import { exportToCSV } from "@/lib/pdf-export";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Statement = {
  id: string;
  distributor: string;
  period: string;
  totalAmount: number;
  streams: number;
  downloads: number;
  isReconciled: boolean;
  importedAt: string;
};

type Tab = "statements" | "reconciliation" | "tax";

// ---------------------------------------------------------------------------
// Reconciliation mock data
// ---------------------------------------------------------------------------

const PLATFORM_RATES = [
  { platform: "Spotify", minRate: 0.003, maxRate: 0.005, reportedStreams: 420000, expectedPayment: 1470, actualPayment: 1398, hasDiscrepancy: true },
  { platform: "Apple Music", minRate: 0.006, maxRate: 0.01, reportedStreams: 185000, expectedPayment: 1480, actualPayment: 1480, hasDiscrepancy: false },
  { platform: "YouTube Music", minRate: 0.002, maxRate: 0.004, reportedStreams: 310000, expectedPayment: 930, actualPayment: 872, hasDiscrepancy: true },
  { platform: "Amazon Music", minRate: 0.004, maxRate: 0.006, reportedStreams: 95000, expectedPayment: 475, actualPayment: 475, hasDiscrepancy: false },
  { platform: "Tidal", minRate: 0.008, maxRate: 0.012, reportedStreams: 42000, expectedPayment: 420, actualPayment: 420, hasDiscrepancy: false },
  { platform: "Deezer", minRate: 0.003, maxRate: 0.005, reportedStreams: 68000, expectedPayment: 272, actualPayment: 247, hasDiscrepancy: true },
];

// ---------------------------------------------------------------------------
// Tax mock data
// ---------------------------------------------------------------------------

const TAX_BREAKDOWN = {
  streaming: 5892.61,
  sync: 3250.00,
  merch: 8420.00,
  shows: 35530.00,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RoyaltyTrackerPage() {
  const [activeTab, setActiveTab] = useState<Tab>("statements");
  const [loading, setLoading] = useState(true);

  const [statements, setStatements] = useState<Statement[]>([]);
  const [stats, setStats] = useState({ totalAmount: 0, totalStreams: 0, totalDownloads: 0, reconciledCount: 0, unreconciledCount: 0 });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet<{ statements: Statement[]; stats: typeof stats }>("/api/royalty-tracker");
      setStatements(data.statements);
      setStats(data.stats);
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalAnnual = TAX_BREAKDOWN.streaming + TAX_BREAKDOWN.sync + TAX_BREAKDOWN.merch + TAX_BREAKDOWN.shows;
  const estimatedTax = totalAnnual * 0.3;

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "statements", label: "Statements", icon: FileText },
    { key: "reconciliation", label: "Reconciliation", icon: Scale },
    { key: "tax", label: "Tax Prep", icon: Calculator },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Royalty Tracker</h1>
            <p className="text-sm text-gray-500">Track royalties, reconcile payments, prepare taxes</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Royalties", value: `$${stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "bg-green-50 text-green-600" },
              { label: "Total Streams", value: stats.totalStreams.toLocaleString(), icon: Music, color: "bg-blue-50 text-blue-600" },
              { label: "Reconciled", value: stats.reconciledCount.toString(), icon: CheckCircle2, color: "bg-purple-50 text-purple-600" },
              { label: "Unreconciled", value: stats.unreconciledCount.toString(), icon: AlertTriangle, color: "bg-amber-50 text-amber-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><s.icon size={18} /></div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-1.5 mb-6 flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.key ? "bg-purple-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-purple-600" size={32} /></div>
          ) : (
            <>
              {/* Statements */}
              {activeTab === "statements" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">Total: <span className="font-bold text-gray-900">${stats.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></p>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-1">
                      <Upload size={16} /> Import Statement
                    </button>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="text-left p-4 font-medium text-gray-600">Distributor</th>
                            <th className="text-left p-4 font-medium text-gray-600">Period</th>
                            <th className="text-right p-4 font-medium text-gray-600">Amount</th>
                            <th className="text-right p-4 font-medium text-gray-600">Streams</th>
                            <th className="text-right p-4 font-medium text-gray-600">Downloads</th>
                            <th className="text-center p-4 font-medium text-gray-600">Reconciled</th>
                            <th className="text-left p-4 font-medium text-gray-600">Imported</th>
                          </tr>
                        </thead>
                        <tbody>
                          {statements.map((stmt) => (
                            <tr key={stmt.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                              <td className="p-4 font-medium">{stmt.distributor}</td>
                              <td className="p-4 text-gray-600">{stmt.period}</td>
                              <td className="p-4 text-right font-medium">${stmt.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                              <td className="p-4 text-right">{stmt.streams.toLocaleString()}</td>
                              <td className="p-4 text-right">{stmt.downloads}</td>
                              <td className="p-4 text-center">
                                {stmt.isReconciled
                                  ? <CheckCircle2 size={18} className="text-green-500 inline" />
                                  : <XCircle size={18} className="text-red-400 inline" />}
                              </td>
                              <td className="p-4 text-gray-500 text-xs">{stmt.importedAt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Reconciliation */}
              {activeTab === "reconciliation" && (
                <div className="space-y-4 max-w-4xl">
                  <p className="text-sm text-gray-500 mb-2">Compare reported streams against actual payments to identify discrepancies.</p>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="text-left p-4 font-medium text-gray-600">Platform</th>
                            <th className="text-left p-4 font-medium text-gray-600">Per-Stream Rate</th>
                            <th className="text-right p-4 font-medium text-gray-600">Reported Streams</th>
                            <th className="text-right p-4 font-medium text-gray-600">Expected Payment</th>
                            <th className="text-right p-4 font-medium text-gray-600">Actual Payment</th>
                            <th className="text-right p-4 font-medium text-gray-600">Difference</th>
                          </tr>
                        </thead>
                        <tbody>
                          {PLATFORM_RATES.map((pr) => {
                            const diff = pr.actualPayment - pr.expectedPayment;
                            return (
                              <tr key={pr.platform} className={`border-b border-gray-50 ${pr.hasDiscrepancy ? "bg-red-50/30" : "hover:bg-gray-50/50"}`}>
                                <td className="p-4 font-medium">{pr.platform}</td>
                                <td className="p-4 text-gray-600">${pr.minRate.toFixed(3)} - ${pr.maxRate.toFixed(3)}</td>
                                <td className="p-4 text-right">{pr.reportedStreams.toLocaleString()}</td>
                                <td className="p-4 text-right">${pr.expectedPayment.toLocaleString()}</td>
                                <td className="p-4 text-right font-medium">${pr.actualPayment.toLocaleString()}</td>
                                <td className={`p-4 text-right font-medium ${pr.hasDiscrepancy ? "text-red-600" : "text-green-600"}`}>
                                  {pr.hasDiscrepancy && <AlertTriangle size={14} className="inline mr-1 -mt-0.5" />}
                                  {diff >= 0 ? "" : "-"}${Math.abs(diff).toLocaleString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">3 discrepancies found</p>
                      <p className="text-xs text-yellow-700 mt-0.5">
                        Total underpayment of ${Math.abs(PLATFORM_RATES.filter((p) => p.hasDiscrepancy).reduce((s, p) => s + (p.actualPayment - p.expectedPayment), 0)).toLocaleString()} detected across Spotify, YouTube Music, and Deezer. Consider contacting your distributor.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tax Prep */}
              {activeTab === "tax" && (
                <div className="max-w-3xl space-y-6">
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                      <div className="text-sm text-gray-500 mb-1">Total Annual Earnings</div>
                      <div className="text-3xl font-bold text-green-600">${totalAnnual.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                      <div className="text-sm text-gray-500 mb-1">Estimated Tax (30%)</div>
                      <div className="text-3xl font-bold text-red-500">${estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-semibold mb-4">Earnings by Source</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Streaming Royalties", value: TAX_BREAKDOWN.streaming, icon: Music, color: "bg-blue-50 text-blue-600" },
                        { label: "Sync Licensing", value: TAX_BREAKDOWN.sync, icon: Tv, color: "bg-purple-50 text-purple-600" },
                        { label: "Merchandise", value: TAX_BREAKDOWN.merch, icon: ShoppingBag, color: "bg-amber-50 text-amber-600" },
                        { label: "Live Shows", value: TAX_BREAKDOWN.shows, icon: Ticket, color: "bg-green-50 text-green-600" },
                      ].map((item) => {
                        const pct = totalAnnual > 0 ? Math.round((item.value / totalAnnual) * 100) : 0;
                        return (
                          <div key={item.label} className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}><item.icon size={18} /></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{item.label}</span>
                                <span className="font-medium">${item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">{pct}% of total</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const taxData = [
                        { source: "Streaming Royalties", amount: TAX_BREAKDOWN.streaming },
                        { source: "Sync Licensing", amount: TAX_BREAKDOWN.sync },
                        { source: "Merchandise", amount: TAX_BREAKDOWN.merch },
                        { source: "Live Shows", amount: TAX_BREAKDOWN.shows },
                        { source: "TOTAL", amount: totalAnnual },
                        { source: "Estimated Tax (30%)", amount: estimatedTax },
                      ];
                      exportToCSV(taxData, "truefans-1099-summary.csv");
                    }}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <FileText size={16} /> Generate 1099 Summary
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
