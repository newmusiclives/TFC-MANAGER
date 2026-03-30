"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { apiGet, apiPost } from "@/lib/api-client";
import {
  Shield,
  Loader2,
  Send,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Lightbulb,
  Scale,
  Clock,
  BarChart3,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

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
// Helpers
// ---------------------------------------------------------------------------

function fairnessColor(score: number): string {
  if (score >= 70) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

function fairnessBg(score: number): string {
  if (score >= 70) return "border-green-300 bg-green-50";
  if (score >= 50) return "border-yellow-300 bg-yellow-50";
  return "border-red-300 bg-red-50";
}

function fairnessRingColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 50) return "#eab308";
  return "#ef4444";
}

const riskBadge: Record<string, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
  Critical: "bg-red-200 text-red-900 font-black",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SmartNegotiatorPage() {
  const [offerText, setOfferText] = useState("");
  const [analysis, setAnalysis] = useState<NegotiationAnalysis | null>(null);
  const [history, setHistory] = useState<NegotiationAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const result = await apiGet<{ analyses: NegotiationAnalysis[] }>("/api/smart-negotiator");
      setHistory(result.analyses);
    } catch (err) {
      console.error("Failed to fetch negotiation history:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleAnalyze = async () => {
    if (!offerText.trim() || offerText.trim().length < 10) return;
    setAnalyzing(true);
    try {
      const result = await apiPost<{ analysis: NegotiationAnalysis }>("/api/smart-negotiator", {
        offerText: offerText.trim(),
      });
      setAnalysis(result.analysis);
      setHistory((prev) => [result.analysis, ...prev]);
    } catch (err) {
      console.error("Failed to analyze offer:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  const loadHistorical = (item: NegotiationAnalysis) => {
    setAnalysis(item);
    setOfferText(item.offerText);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-gray-800 rounded-xl flex items-center justify-center">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Smart Negotiator</h1>
              <p className="text-sm text-gray-500">AI-powered contract and offer analysis</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 max-w-6xl">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-gray-300" />
            </div>
          )}

          {!loading && (
            <div className="space-y-8">
              {/* Input Section */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                  <FileText size={16} className="text-gray-500" />
                  Paste Offer / Contract Terms
                </h2>
                <textarea
                  value={offerText}
                  onChange={(e) => setOfferText(e.target.value)}
                  placeholder="Paste the offer terms, contract clauses, or deal details here...

Example: Distribution deal with 80/20 revenue split, 3-year exclusive term, worldwide rights, quarterly reporting, $5,000 advance recoupable against royalties..."
                  className="w-full h-40 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-y"
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-400">
                    {offerText.length > 0 ? `${offerText.length} characters` : "Minimum 10 characters"}
                  </p>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing || offerText.trim().length < 10}
                    className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Analyzing...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Analyze Offer
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Analysis Results */}
              {analysis && (
                <>
                  {/* Fairness Score */}
                  <div className={`rounded-xl border-2 p-6 text-center ${fairnessBg(analysis.fairnessScore)}`}>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Fairness Score</p>
                    <div className="relative w-32 h-32 mx-auto mb-3">
                      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                        <circle
                          cx="60" cy="60" r="52"
                          fill="none"
                          stroke={fairnessRingColor(analysis.fairnessScore)}
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${(analysis.fairnessScore / 100) * 327} 327`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-4xl font-black ${fairnessColor(analysis.fairnessScore)}`}>
                          {analysis.fairnessScore}
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm font-bold ${fairnessColor(analysis.fairnessScore)}`}>
                      {analysis.fairnessScore >= 70 ? "Fair Deal" : analysis.fairnessScore >= 50 ? "Needs Improvement" : "Below Market"}
                    </p>
                  </div>

                  {/* Clause Analysis */}
                  <div className="bg-white rounded-xl border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-50">
                      <h2 className="text-base font-bold flex items-center gap-2">
                        <Scale size={16} className="text-indigo-500" />
                        Clause Analysis
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-50 bg-gray-50/50">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Clause</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Assessment</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Market Comparison</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Risk</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysis.clauses.map((clause, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{clause.name}</td>
                              <td className="px-4 py-3 text-gray-600 text-xs leading-relaxed max-w-xs">{clause.assessment}</td>
                              <td className="px-4 py-3 text-gray-500 text-xs">{clause.marketComparison}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${riskBadge[clause.risk]}`}>
                                  {clause.risk}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Counter-Proposal */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-3">
                      <FileText size={16} className="text-amber-400" />
                      Counter-Proposal
                    </h2>
                    <p className="text-sm text-gray-300 leading-relaxed">{analysis.counterProposal}</p>
                  </div>

                  {/* Comparable Deals */}
                  <div className="bg-white rounded-xl border border-gray-100">
                    <div className="px-6 py-4 border-b border-gray-50">
                      <h2 className="text-base font-bold flex items-center gap-2">
                        <BarChart3 size={16} className="text-blue-500" />
                        Comparable Deals
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-50 bg-gray-50/50">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Deal Type</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Typical Terms</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">What You Were Offered</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Comparison</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysis.comparableDeals.map((deal, i) => {
                            const isWorse = deal.offered.toLowerCase() !== deal.typical.toLowerCase();
                            return (
                              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                                <td className="px-4 py-3 font-medium text-gray-900">{deal.type}</td>
                                <td className="px-4 py-3 text-gray-600 text-xs">{deal.typical}</td>
                                <td className="px-4 py-3 text-gray-600 text-xs">{deal.offered}</td>
                                <td className="px-4 py-3 text-center">
                                  {isWorse ? (
                                    <AlertTriangle size={16} className="text-yellow-500 mx-auto" />
                                  ) : (
                                    <CheckCircle2 size={16} className="text-green-500 mx-auto" />
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Negotiation Tips */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                      <Lightbulb size={16} className="text-amber-500" />
                      Negotiation Tips
                    </h2>
                    <div className="space-y-3">
                      {analysis.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-50 text-xs font-bold text-amber-600 shrink-0">
                            {i + 1}
                          </span>
                          <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* History */}
              {history.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-50">
                    <h2 className="text-base font-bold flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      Previous Analyses
                    </h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => loadHistorical(item)}
                        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${fairnessBg(item.fairnessScore)}`}>
                          <span className={`text-sm font-bold ${fairnessColor(item.fairnessScore)}`}>{item.fairnessScore}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{item.offerText.slice(0, 80)}...</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(item.analyzedAt).toLocaleDateString()} — {item.clauses.length} clauses analyzed
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {item.clauses.filter((c) => c.risk === "Critical" || c.risk === "High").length > 0 && (
                            <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                              {item.clauses.filter((c) => c.risk === "Critical" || c.risk === "High").length} risks
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
