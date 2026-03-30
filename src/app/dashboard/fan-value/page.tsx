"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { apiGet } from "@/lib/api-client";
import {
  Heart,
  Loader2,
  DollarSign,
  Users,
  TrendingUp,
  Crown,
  Star,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types (matching fan-value-service)
// ---------------------------------------------------------------------------

interface FanSegment {
  tier: string;
  label: string;
  color: string;
  minValue: number;
  maxValue: number | null;
  count: number;
  totalValue: number;
  percentageOfFans: number;
}

interface TopFan {
  id: string;
  name: string;
  email: string;
  lifetimeValue: number;
  streams: number;
  merchPurchases: number;
  showAttendance: number;
  engagementScore: number;
  lastActive: string;
  tier: string;
}

interface ValueDriver {
  source: string;
  percentage: number;
  color: string;
}

interface GrowthOpportunity {
  title: string;
  description: string;
  estimatedImpact: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
}

interface FanValueAnalytics {
  overview: {
    totalFanbaseValue: number;
    averageFanValue: number;
    topTenPercentValue: number;
    totalFans: number;
    valueTrend: { month: string; value: number }[];
  };
  segments: FanSegment[];
  topFans: TopFan[];
  valueDrivers: ValueDriver[];
  growthOpportunities: GrowthOpportunity[];
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return `${local.slice(0, 2)}***@${domain}`;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function formatCurrencyDecimal(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}

const tierBadgeColors: Record<string, string> = {
  platinum: "bg-purple-100 text-purple-700",
  gold: "bg-amber-100 text-amber-700",
  silver: "bg-gray-200 text-gray-700",
  bronze: "bg-orange-100 text-orange-700",
  inactive: "bg-gray-100 text-gray-400",
};

const difficultyColors: Record<string, string> = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FanValuePage() {
  const [data, setData] = useState<FanValueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await apiGet<FanValueAnalytics>("/api/fan-value");
      setData(result);
    } catch (err) {
      console.error("Failed to fetch fan value data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Value trend calculation
  const valueTrend = data?.overview.valueTrend;
  const trendPercent = valueTrend && valueTrend.length >= 2
    ? (((valueTrend[valueTrend.length - 1].value - valueTrend[valueTrend.length - 2].value) / valueTrend[valueTrend.length - 2].value) * 100).toFixed(1)
    : null;
  const trendUp = trendPercent ? parseFloat(trendPercent) >= 0 : true;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
              <Heart size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Fan Value Score</h1>
              <p className="text-sm text-gray-500">Understand what your fans are worth and how to grow their value</p>
            </div>
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
              {/* Overview Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                    <DollarSign size={14} /> Total Fanbase Value
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(data.overview.totalFanbaseValue)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                    <Users size={14} /> Avg Fan Value
                  </div>
                  <p className="text-2xl font-bold">{formatCurrencyDecimal(data.overview.averageFanValue)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                    <Crown size={14} /> Top 10% Value
                  </div>
                  <p className="text-2xl font-bold">{formatCurrencyDecimal(data.overview.topTenPercentValue)}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                    <TrendingUp size={14} /> Value Trend
                  </div>
                  <p className={`text-2xl font-bold ${trendUp ? "text-green-600" : "text-red-600"}`}>
                    {trendUp ? "+" : ""}{trendPercent}%
                  </p>
                </div>
              </div>

              {/* Value Tiers */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-base font-bold flex items-center gap-2 mb-5">
                  <Star size={16} className="text-amber-500" />
                  Value Tiers
                </h2>
                <div className="space-y-4">
                  {data.segments.map((seg) => (
                    <div key={seg.tier} className="flex items-center gap-4">
                      <div className="w-28 shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${tierBadgeColors[seg.tier] || "bg-gray-100 text-gray-600"}`}>
                          {seg.label}
                        </span>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {seg.maxValue ? `$${seg.minValue}-$${seg.maxValue}` : `$${seg.minValue}+`}
                        </p>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>{seg.count.toLocaleString()} fans</span>
                          <span>{formatCurrency(seg.totalValue)}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                          <div
                            className="h-3 rounded-full transition-all"
                            style={{ width: `${seg.percentageOfFans}%`, backgroundColor: seg.color }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{seg.percentageOfFans}% of fans</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Fans */}
              <div className="bg-white rounded-xl border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-50">
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <Crown size={16} className="text-purple-500" />
                    Top Fans
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-50 bg-gray-50/50">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">#</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Name</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Email</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Lifetime Value</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Engagement</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Last Active</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Tier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topFans.slice(0, 15).map((fan, idx) => (
                        <tr key={fan.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3 text-xs text-gray-400 font-bold">{idx + 1}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">{fan.name}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{maskEmail(fan.email)}</td>
                          <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrencyDecimal(fan.lifetimeValue)}</td>
                          <td className="px-4 py-3 text-right">
                            <span className={`text-xs font-bold ${fan.engagementScore >= 80 ? "text-green-600" : fan.engagementScore >= 60 ? "text-yellow-600" : "text-gray-500"}`}>
                              {fan.engagementScore}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{new Date(fan.lastActive).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${tierBadgeColors[fan.tier] || "bg-gray-100 text-gray-500"}`}>
                              {fan.tier}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Value Drivers */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-base font-bold flex items-center gap-2 mb-5">
                  <BarChart3 size={16} className="text-blue-500" />
                  Value Drivers
                </h2>
                {/* Stacked bar */}
                <div className="w-full h-10 rounded-full overflow-hidden flex mb-4">
                  {data.valueDrivers.map((d) => (
                    <div
                      key={d.source}
                      className="h-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ width: `${d.percentage}%`, backgroundColor: d.color }}
                      title={`${d.source}: ${d.percentage}%`}
                    >
                      {d.percentage >= 15 ? `${d.percentage}%` : ""}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  {data.valueDrivers.map((d) => (
                    <div key={d.source} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-sm text-gray-600">{d.source}</span>
                      <span className="text-sm font-bold text-gray-800">{d.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Opportunities */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-base font-bold flex items-center gap-2 mb-5">
                  <Lightbulb size={16} className="text-amber-500" />
                  Growth Opportunities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.growthOpportunities.map((opp, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-gray-900">{opp.title}</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${difficultyColors[opp.difficulty]}`}>
                          {opp.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed mb-2">{opp.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full">
                          {opp.estimatedImpact}
                        </span>
                        <span className="text-xs text-gray-400">{opp.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
