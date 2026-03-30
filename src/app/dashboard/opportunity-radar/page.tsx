"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { apiGet, apiPatch } from "@/lib/api-client";
import {
  Radar,
  Loader2,
  Search,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Music2,
  Film,
  Users,
  Tent,
  Banknote,
  Newspaper,
  Award,
  Tag,
  BarChart3,
  Target,
  Send,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OpportunityType = "sync" | "playlist" | "collab" | "festival" | "grant" | "press" | "brand" | "contest";
type OpportunityStatus = "active" | "applied" | "dismissed";

interface Opportunity {
  id: string;
  type: OpportunityType;
  title: string;
  description: string;
  deadline: string;
  matchScore: number;
  source: string;
  status: OpportunityStatus;
  url?: string;
  payout?: string;
  requirements?: string;
  createdAt: string;
}

interface OpportunityStats {
  foundThisMonth: number;
  appliedTo: number;
  successRate: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const typeConfig: Record<OpportunityType, { icon: React.ElementType; color: string; label: string }> = {
  sync: { icon: Film, color: "bg-purple-100 text-purple-700", label: "Sync" },
  playlist: { icon: Music2, color: "bg-blue-100 text-blue-700", label: "Playlist" },
  collab: { icon: Users, color: "bg-green-100 text-green-700", label: "Collab" },
  festival: { icon: Tent, color: "bg-orange-100 text-orange-700", label: "Festival" },
  grant: { icon: Banknote, color: "bg-emerald-100 text-emerald-700", label: "Grant" },
  press: { icon: Newspaper, color: "bg-pink-100 text-pink-700", label: "Press" },
  brand: { icon: Award, color: "bg-indigo-100 text-indigo-700", label: "Brand" },
  contest: { icon: Tag, color: "bg-amber-100 text-amber-700", label: "Contest" },
};

function matchScoreColor(score: number): string {
  if (score >= 70) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

function matchScoreTextColor(score: number): string {
  if (score >= 70) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

const filterTypes: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sync", label: "Sync" },
  { value: "playlist", label: "Playlist" },
  { value: "collab", label: "Collab" },
  { value: "festival", label: "Festival" },
  { value: "grant", label: "Grant" },
];

const thresholdOptions = [
  { value: 0, label: "All" },
  { value: 50, label: "50+" },
  { value: 70, label: "70+" },
  { value: 90, label: "90+" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function OpportunityRadarPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stats, setStats] = useState<OpportunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [threshold, setThreshold] = useState(0);
  const [showDismissed, setShowDismissed] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (threshold > 0) params.set("minMatchScore", threshold.toString());
      const qs = params.toString();
      const result = await apiGet<{ opportunities: Opportunity[]; stats: OpportunityStats }>(
        `/api/opportunity-radar${qs ? `?${qs}` : ""}`
      );
      setOpportunities(result.opportunities);
      setStats(result.stats);
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, threshold]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (id: string, status: OpportunityStatus) => {
    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      await apiPatch("/api/opportunity-radar", { id, status });
      setOpportunities((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error("Failed to update opportunity:", err);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const activeOpps = opportunities.filter((o) => o.status === "active");
  const appliedOpps = opportunities.filter((o) => o.status === "applied");
  const dismissedOpps = opportunities.filter((o) => o.status === "dismissed");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Radar size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Opportunity Radar</h1>
              <p className="text-sm text-gray-500">AI-curated opportunities matched to your profile</p>
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
            <div className="space-y-6">
              {/* Stats Bar */}
              {stats && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                      <Search size={14} /> Found This Month
                    </div>
                    <p className="text-2xl font-bold">{stats.foundThisMonth}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                      <Send size={14} /> Applied
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{stats.appliedTo}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                      <Target size={14} /> Success Rate
                    </div>
                    <p className="text-2xl font-bold text-green-600">{stats.successRate}%</p>
                  </div>
                </div>
              )}

              {/* Filter Bar */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 flex-wrap">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Type:</span>
                <div className="flex gap-1">
                  {filterTypes.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => { setTypeFilter(f.value); setLoading(true); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        typeFilter === f.value
                          ? "bg-[var(--primary)] text-white"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="w-px h-6 bg-gray-200 hidden md:block" />

                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Match:</span>
                <div className="flex gap-1">
                  {thresholdOptions.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => { setThreshold(t.value); setLoading(true); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        threshold === t.value
                          ? "bg-[var(--primary)] text-white"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Opportunities */}
              <div className="space-y-4">
                {[...activeOpps, ...appliedOpps].map((opp) => {
                  const config = typeConfig[opp.type] || typeConfig.sync;
                  const Icon = config.icon;
                  const isProcessing = processingIds.has(opp.id);

                  return (
                    <div key={opp.id} className="bg-white rounded-xl border border-gray-100 p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.color}`}>
                              {config.label}
                            </span>
                            {opp.status === "applied" && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                Applied
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-bold text-gray-900">{opp.title}</h3>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{opp.description}</p>

                          <div className="flex items-center flex-wrap gap-3 mt-3 text-xs text-gray-500">
                            <span>Deadline: <strong className="text-gray-700">{new Date(opp.deadline).toLocaleDateString()}</strong></span>
                            <span>Source: <strong className="text-gray-700">{opp.source}</strong></span>
                            {opp.payout && <span>Payout: <strong className="text-green-600">{opp.payout}</strong></span>}
                          </div>

                          {opp.requirements && (
                            <p className="text-xs text-gray-400 mt-2 italic">{opp.requirements}</p>
                          )}
                        </div>

                        {/* Match score + actions */}
                        <div className="flex flex-col items-end gap-3 shrink-0">
                          {/* Score */}
                          <div className="text-center">
                            <p className={`text-xl font-bold ${matchScoreTextColor(opp.matchScore)}`}>{opp.matchScore}</p>
                            <div className="w-16 bg-gray-100 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${matchScoreColor(opp.matchScore)}`}
                                style={{ width: `${opp.matchScore}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">match</p>
                          </div>

                          {opp.status === "active" && (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleStatusUpdate(opp.id, "applied")}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                              >
                                {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                Apply
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(opp.id, "dismissed")}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                              >
                                <XCircle size={12} /> Dismiss
                              </button>
                            </div>
                          )}

                          {opp.url && (
                            <a href={opp.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1">
                              <ExternalLink size={11} /> View
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {activeOpps.length === 0 && appliedOpps.length === 0 && (
                  <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 size={24} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">No matching opportunities found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
                  </div>
                )}
              </div>

              {/* Dismissed Section */}
              {dismissedOpps.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setShowDismissed(!showDismissed)}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                      <XCircle size={14} />
                      Dismissed ({dismissedOpps.length})
                    </span>
                    {showDismissed ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </button>
                  {showDismissed && (
                    <div className="px-5 pb-4 space-y-3">
                      {dismissedOpps.map((opp) => {
                        const config = typeConfig[opp.type] || typeConfig.sync;
                        return (
                          <div key={opp.id} className="flex items-center gap-3 py-2 border-t border-gray-50">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.color}`}>
                              {config.label}
                            </span>
                            <span className="text-sm text-gray-500">{opp.title}</span>
                            <span className={`ml-auto text-xs font-bold ${matchScoreTextColor(opp.matchScore)}`}>
                              {opp.matchScore}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
