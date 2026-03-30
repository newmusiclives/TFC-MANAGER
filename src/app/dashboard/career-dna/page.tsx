"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { apiGet, apiPost } from "@/lib/api-client";
import {
  Dna,
  RefreshCw,
  Loader2,
  Users,
  Globe,
  Smartphone,
  Monitor,
  Speaker,
  Clock,
  TrendingUp,
  Star,
  Music2,
  Target,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types (matching career-dna-service)
// ---------------------------------------------------------------------------

interface SoundProfile {
  energy: number;
  danceability: number;
  acoustic: number;
  vocalPresence: number;
  productionComplexity: number;
  uniqueness: number;
}

interface AudienceDNA {
  primaryAgeRange: string;
  topGenders: { label: string; percentage: number }[];
  topCountries: { name: string; percentage: number }[];
  peakListeningTime: string;
  deviceSplit: { mobile: number; desktop: number; smartSpeaker: number };
}

interface SimilarArtist {
  name: string;
  genre: string;
  breakthroughMoment: string;
  whatTheyDid: string;
  currentMonthlyListeners: string;
}

interface CareerDNA {
  soundProfile: SoundProfile;
  audienceDNA: AudienceDNA;
  growthPattern: { classification: string; explanation: string };
  similarArtists: SimilarArtist[];
  optimalPath: string;
  strengths: string[];
  growthAreas: string[];
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function scoreColor(score: number): string {
  if (score >= 70) return "bg-green-500";
  if (score >= 40) return "bg-yellow-500";
  return "bg-red-500";
}

function scoreTextColor(score: number): string {
  if (score >= 70) return "text-green-600";
  if (score >= 40) return "text-yellow-600";
  return "text-red-600";
}

const soundMetricLabels: Record<string, string> = {
  energy: "Energy",
  danceability: "Danceability",
  acoustic: "Acoustic",
  vocalPresence: "Vocal Presence",
  productionComplexity: "Production Complexity",
  uniqueness: "Uniqueness",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CareerDNAPage() {
  const [data, setData] = useState<CareerDNA | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const result = await apiGet<CareerDNA>("/api/career-dna");
      setData(result);
    } catch (err) {
      console.error("Failed to fetch career DNA:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const result = await apiPost<CareerDNA>("/api/career-dna", {});
      setData(result);
    } catch (err) {
      console.error("Failed to regenerate career DNA:", err);
    } finally {
      setRegenerating(false);
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
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Dna size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Career DNA</h1>
                <p className="text-sm text-gray-500">Your unique artist fingerprint and growth blueprint</p>
              </div>
            </div>
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {regenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Regenerating...
                </>
              ) : (
                <>
                  <RefreshCw size={16} /> Regenerate DNA
                </>
              )}
            </button>
          </div>
        </div>

        <div className="px-8 py-6 max-w-6xl">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-gray-300" />
            </div>
          )}

          {!loading && data && (
            <div className="space-y-8">
              {/* Sound Profile */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-base font-bold flex items-center gap-2 mb-5">
                  <Music2 size={16} className="text-purple-500" />
                  Sound Profile
                </h2>
                <div className="space-y-4">
                  {Object.entries(data.soundProfile).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {soundMetricLabels[key] || key}
                        </span>
                        <span className={`text-sm font-bold ${scoreTextColor(value)}`}>
                          {value}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${scoreColor(value)}`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audience DNA */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-base font-bold flex items-center gap-2 mb-5">
                  <Users size={16} className="text-blue-500" />
                  Audience DNA
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Age Range */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Primary Age Range</p>
                    <p className="text-2xl font-bold text-gray-900">{data.audienceDNA.primaryAgeRange}</p>
                  </div>

                  {/* Peak Listening */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Clock size={12} /> Peak Listening Time
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{data.audienceDNA.peakListeningTime}</p>
                  </div>

                  {/* Device Split */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Device Split</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Smartphone size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600 w-20">Mobile</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${data.audienceDNA.deviceSplit.mobile}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700">{data.audienceDNA.deviceSplit.mobile}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Monitor size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600 w-20">Desktop</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${data.audienceDNA.deviceSplit.desktop}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700">{data.audienceDNA.deviceSplit.desktop}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Speaker size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-600 w-20">Speaker</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${data.audienceDNA.deviceSplit.smartSpeaker}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700">{data.audienceDNA.deviceSplit.smartSpeaker}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Genders */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Gender Split</p>
                    <div className="space-y-2">
                      {data.audienceDNA.topGenders.map((g) => (
                        <div key={g.label} className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 w-24">{g.label}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${g.percentage}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-700">{g.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Countries */}
                  <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Globe size={12} /> Top Countries
                    </p>
                    <div className="space-y-2">
                      {data.audienceDNA.topCountries.map((c) => (
                        <div key={c.name} className="flex items-center gap-2">
                          <span className="text-xs text-gray-600 w-32">{c.name}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${c.percentage}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-700">{c.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Pattern */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-6">
                <h2 className="text-base font-bold flex items-center gap-2 mb-3">
                  <TrendingUp size={16} className="text-indigo-500" />
                  Growth Pattern
                </h2>
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                    <Sparkles size={14} />
                    {data.growthPattern.classification}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{data.growthPattern.explanation}</p>
              </div>

              {/* Similar Artists Who Broke Through */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-base font-bold flex items-center gap-2 mb-5">
                  <Star size={16} className="text-amber-500" />
                  Similar Artists Who Broke Through
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.similarArtists.map((artist) => (
                    <div key={artist.name} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-gray-900">{artist.name}</h3>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{artist.genre}</span>
                      </div>
                      <p className="text-xs text-purple-600 font-semibold mb-1">{artist.breakthroughMoment}</p>
                      <p className="text-xs text-gray-600 leading-relaxed mb-2">{artist.whatTheyDid}</p>
                      <p className="text-xs font-bold text-gray-800">
                        {artist.currentMonthlyListeners} monthly listeners
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optimal Path */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
                <h2 className="text-base font-bold flex items-center gap-2 mb-3">
                  <Target size={16} className="text-amber-400" />
                  Optimal Path
                </h2>
                <p className="text-sm text-gray-300 leading-relaxed">{data.optimalPath}</p>
              </div>

              {/* Strengths & Growth Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                    <CheckCircle2 size={16} className="text-green-500" />
                    Strengths
                  </h2>
                  <div className="space-y-3">
                    {data.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-700">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                    <ArrowUpRight size={16} className="text-orange-500" />
                    Growth Areas
                  </h2>
                  <div className="space-y-3">
                    {data.growthAreas.map((g, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <ArrowUpRight size={14} className="text-orange-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-700">{g}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
