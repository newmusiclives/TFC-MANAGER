"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { apiGet, apiPost } from "@/lib/api-client";
import {
  RotateCcw,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ListOrdered,
  BarChart3,
  Sparkles,
  Play,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ReleaseOption {
  id: string;
  title: string;
  type: string;
  releaseDate: string;
}

interface PerformanceMetric {
  label: string;
  goal: number;
  actual: number;
  unit: string;
}

interface ReleaseReplay {
  id: string;
  releaseId: string;
  releaseTitle: string;
  releaseType: string;
  releaseDate: string;
  performance: PerformanceMetric[];
  whatWorked: string[];
  whatDidnt: string[];
  aiRecommendations: string[];
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ReleaseReplayPage() {
  const [releases, setReleases] = useState<ReleaseOption[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [replay, setReplay] = useState<ReleaseReplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingReplay, setLoadingReplay] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Fetch releases list
  const fetchReleases = useCallback(async () => {
    try {
      const result = await apiGet<{ releases: ReleaseOption[] }>("/api/release-replay");
      setReleases(result.releases);
      if (result.releases.length > 0) {
        setSelectedId(result.releases[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch releases:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  // Fetch replay for selected release
  const fetchReplay = useCallback(async (releaseId: string) => {
    if (!releaseId) return;
    setLoadingReplay(true);
    setReplay(null);
    try {
      const result = await apiGet<{ replay: ReleaseReplay | null }>(`/api/release-replay?releaseId=${releaseId}`);
      setReplay(result.replay);
    } catch (err) {
      console.error("Failed to fetch replay:", err);
    } finally {
      setLoadingReplay(false);
    }
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchReplay(selectedId);
    }
  }, [selectedId, fetchReplay]);

  const handleGenerate = async () => {
    if (!selectedId) return;
    setGenerating(true);
    try {
      const result = await apiPost<{ replay: ReleaseReplay }>("/api/release-replay", { releaseId: selectedId });
      setReplay(result.replay);
    } catch (err) {
      console.error("Failed to generate replay:", err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <RotateCcw size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Release Replay</h1>
                <p className="text-sm text-gray-500">Post-release retrospective with AI insights</p>
              </div>
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
              {/* Select Release */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 flex-wrap">
                <label className="text-sm font-semibold text-gray-700">Select Release:</label>
                <div className="relative">
                  <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  >
                    {releases.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.type}) — {new Date(r.releaseDate).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={generating || !selectedId}
                  className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  {generating ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Play size={14} /> Generate Replay
                    </>
                  )}
                </button>
              </div>

              {loadingReplay && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={28} className="animate-spin text-gray-300" />
                </div>
              )}

              {!loadingReplay && replay && (
                <>
                  {/* Performance Summary */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-5">
                      <BarChart3 size={16} className="text-emerald-500" />
                      Performance Summary
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {replay.performance.map((metric) => {
                        const exceeded = metric.actual >= metric.goal;
                        return (
                          <div
                            key={metric.label}
                            className={`rounded-lg p-4 border ${exceeded ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}
                          >
                            <p className="text-xs font-medium text-gray-500 mb-1">{metric.label}</p>
                            <div className="flex items-baseline gap-2">
                              <span className={`text-xl font-bold ${exceeded ? "text-green-700" : "text-red-700"}`}>
                                {metric.actual.toLocaleString()}{metric.unit === "%" ? "%" : ""}
                              </span>
                              <span className="text-xs text-gray-400">
                                / {metric.goal.toLocaleString()}{metric.unit === "%" ? "%" : ""} goal
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {exceeded ? (
                                <CheckCircle2 size={12} className="text-green-500" />
                              ) : (
                                <XCircle size={12} className="text-red-500" />
                              )}
                              <span className={`text-xs font-semibold ${exceeded ? "text-green-600" : "text-red-600"}`}>
                                {exceeded ? "Exceeded" : "Missed"} by {Math.abs(metric.actual - metric.goal).toLocaleString()}{metric.unit === "%" ? "%" : ` ${metric.unit}`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* What Worked + What Didn't */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                        <CheckCircle2 size={16} className="text-green-500" />
                        What Worked
                      </h2>
                      <div className="space-y-3">
                        {replay.whatWorked.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-gray-700">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                        <XCircle size={16} className="text-red-500" />
                        What Didn&apos;t Work
                      </h2>
                      <div className="space-y-3">
                        {replay.whatDidnt.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <XCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-gray-700">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                      <Sparkles size={16} className="text-amber-400" />
                      AI Recommendations
                    </h2>
                    <div className="space-y-3">
                      {replay.aiRecommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-bold text-amber-400 shrink-0">
                            {i + 1}
                          </span>
                          <p className="text-sm text-gray-300 leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {!loadingReplay && !replay && selectedId && (
                <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ListOrdered size={24} className="text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">No replay generated for this release yet</p>
                  <p className="text-xs text-gray-400 mt-1">Click &quot;Generate Replay&quot; to create an AI analysis</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
