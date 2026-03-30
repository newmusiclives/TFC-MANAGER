"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { apiGet } from "@/lib/api-client";
import {
  TrendingUp,
  Loader2,
  DollarSign,
  BarChart3,
  Lightbulb,
  Target,
  ArrowUpRight,
  Minus,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

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
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

const sourceColors: Record<string, string> = {
  streaming: "#3b82f6",
  sync: "#8b5cf6",
  merch: "#f59e0b",
  shows: "#10b981",
  fanFunding: "#ec4899",
};

const sourceLabels: Record<string, string> = {
  streaming: "Streaming",
  sync: "Sync Licensing",
  merch: "Merchandise",
  shows: "Live Shows",
  fanFunding: "Fan Funding",
};

const scenarioConfig: Record<string, { color: string; bgColor: string; icon: React.ElementType }> = {
  conservative: { color: "text-gray-700", bgColor: "bg-gray-50 border-gray-200", icon: Minus },
  expected: { color: "text-blue-700", bgColor: "bg-blue-50 border-blue-200", icon: Target },
  optimistic: { color: "text-green-700", bgColor: "bg-green-50 border-green-200", icon: ArrowUpRight },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function RevenueForecastPage() {
  const [data, setData] = useState<RevenueForecast | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await apiGet<RevenueForecast>("/api/revenue-forecast");
      setData(result);
    } catch (err) {
      console.error("Failed to fetch revenue forecast:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate max value for chart scaling
  const allAmounts = data
    ? [...data.actual.map((a) => a.amount), ...data.predicted.map((p) => p.high)]
    : [];
  const maxAmount = Math.max(...allAmounts, 1);

  const bySourceEntries = data
    ? Object.entries(data.bySource).sort(([, a], [, b]) => b - a)
    : [];
  const maxSource = bySourceEntries.length > 0 ? bySourceEntries[0][1] : 1;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Revenue Forecast</h1>
              <p className="text-sm text-gray-500">AI-predicted revenue with actionable growth strategies</p>
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
              {/* Forecast Chart */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-base font-bold flex items-center gap-2 mb-2">
                  <BarChart3 size={16} className="text-green-500" />
                  12-Month Revenue Forecast
                </h2>
                <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-green-500" /> Actual
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-green-300 border border-dashed border-green-500" /> Predicted
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-sm bg-green-100" /> Confidence Range
                  </span>
                </div>

                <div className="flex items-end gap-2 h-64">
                  {/* Actual months */}
                  {data.actual.map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center justify-end h-full">
                      <p className="text-xs font-bold text-gray-700 mb-1">{formatCurrency(m.amount)}</p>
                      <div
                        className="w-full bg-green-500 rounded-t-md min-h-[4px] transition-all"
                        style={{ height: `${(m.amount / maxAmount) * 100}%` }}
                      />
                      <p className="text-xs text-gray-500 mt-2 whitespace-nowrap">{m.month.split(" ")[0].slice(0, 3)}</p>
                    </div>
                  ))}

                  {/* Predicted months */}
                  {data.predicted.map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center justify-end h-full relative">
                      <p className="text-xs font-bold text-green-600 mb-1">{formatCurrency(m.amount)}</p>
                      {/* Confidence range background */}
                      <div className="w-full relative" style={{ height: `${(m.high / maxAmount) * 100}%` }}>
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-green-100 rounded-t-md"
                          style={{ height: "100%" }}
                        />
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-green-300 rounded-t-md border border-dashed border-green-400"
                          style={{ height: `${(m.amount / m.high) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 whitespace-nowrap">{m.month.split(" ")[0].slice(0, 3)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue by Source */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-base font-bold flex items-center gap-2 mb-5">
                  <DollarSign size={16} className="text-blue-500" />
                  Predicted Revenue by Source (Next 6 Months)
                </h2>
                <div className="space-y-4">
                  {bySourceEntries.map(([key, value]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{sourceLabels[key] || key}</span>
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(value)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all"
                          style={{
                            width: `${(value / maxSource) * 100}%`,
                            backgroundColor: sourceColors[key] || "#6b7280",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Factors */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                  <Lightbulb size={16} className="text-amber-500" />
                  Key Factors Driving the Forecast
                </h2>
                <div className="space-y-2">
                  {data.factors.map((factor, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <p className="text-sm text-gray-700">{factor}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scenarios */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["conservative", "expected", "optimistic"] as const).map((key) => {
                  const scenario = data.scenarios[key];
                  const config = scenarioConfig[key];
                  const Icon = config.icon;

                  return (
                    <div key={key} className={`rounded-xl border p-5 ${config.bgColor}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon size={16} className={config.color} />
                        <h3 className={`text-sm font-bold capitalize ${config.color}`}>{key}</h3>
                      </div>
                      <p className={`text-2xl font-black mb-3 ${config.color}`}>{formatCurrency(scenario.total)}</p>
                      <div className="space-y-1.5">
                        {scenario.assumptions.map((a, i) => (
                          <p key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                            {a}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions to Increase Revenue */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-base font-bold flex items-center gap-2 mb-5">
                  <Target size={16} className="text-green-500" />
                  Actions to Increase Revenue
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.actions.map((action, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-bold text-gray-900">{action.title}</h3>
                        <span className="text-xs bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                          {action.estimatedImpact}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{action.description}</p>
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
