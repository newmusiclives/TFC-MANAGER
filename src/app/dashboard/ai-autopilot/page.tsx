"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { apiGet, apiPost, apiPatch } from "@/lib/api-client";
import {
  Zap,
  Play,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Clock,
  AlertTriangle,
  TrendingUp,
  Target,
  Lightbulb,
  Calendar,
  Mail,
  Music2,
  FileText,
  Shield,
  Loader2,
  CheckCircle2,
  XCircle,
  Activity,
  Timer,
  BarChart3,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActionStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXECUTED" | "FAILED";
type ActionType =
  | "CONTENT_SCHEDULE"
  | "RELEASE_PLAN"
  | "EMAIL_CAMPAIGN"
  | "PLAYLIST_PITCH"
  | "ANOMALY_ALERT"
  | "GOAL_CHECK"
  | "NEGOTIATION_PREP";

interface AIAction {
  id: string;
  type: ActionType;
  status: ActionStatus;
  title: string;
  description: string;
  payload: Record<string, unknown>;
  result?: Record<string, unknown> | null;
  scheduledFor?: string | null;
  executedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AIInsight {
  type: "anomaly" | "opportunity" | "goal_progress" | "alert";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  metric?: string;
  value?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const actionTypeConfig: Record<ActionType, { icon: React.ElementType; color: string; label: string }> = {
  CONTENT_SCHEDULE: { icon: Calendar, color: "text-blue-600 bg-blue-50", label: "Content" },
  RELEASE_PLAN: { icon: Music2, color: "text-purple-600 bg-purple-50", label: "Release" },
  EMAIL_CAMPAIGN: { icon: Mail, color: "text-green-600 bg-green-50", label: "Email" },
  PLAYLIST_PITCH: { icon: Music2, color: "text-orange-600 bg-orange-50", label: "Playlist" },
  ANOMALY_ALERT: { icon: AlertTriangle, color: "text-red-600 bg-red-50", label: "Alert" },
  GOAL_CHECK: { icon: Target, color: "text-indigo-600 bg-indigo-50", label: "Goal" },
  NEGOTIATION_PREP: { icon: Shield, color: "text-slate-600 bg-slate-50", label: "Negotiation" },
};

const statusConfig: Record<ActionStatus, { icon: React.ElementType; color: string; label: string }> = {
  PENDING: { icon: Clock, color: "text-amber-600 bg-amber-50", label: "Pending" },
  APPROVED: { icon: Check, color: "text-blue-600 bg-blue-50", label: "Approved" },
  REJECTED: { icon: X, color: "text-gray-500 bg-gray-50", label: "Rejected" },
  EXECUTED: { icon: CheckCircle2, color: "text-green-600 bg-green-50", label: "Executed" },
  FAILED: { icon: XCircle, color: "text-red-600 bg-red-50", label: "Failed" },
};

const insightTypeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  anomaly: { icon: AlertTriangle, color: "text-red-600 bg-red-50 border-red-100" },
  opportunity: { icon: TrendingUp, color: "text-green-600 bg-green-50 border-green-100" },
  goal_progress: { icon: Target, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  alert: { icon: Lightbulb, color: "text-amber-600 bg-amber-50 border-amber-100" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AIAutopilotPage() {
  const [pending, setPending] = useState<AIAction[]>([]);
  const [recent, setRecent] = useState<AIAction[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [scanSummary, setScanSummary] = useState<string | null>(null);

  // Fetch action queue and insights
  const fetchData = useCallback(async () => {
    try {
      const [queueData, insightsData] = await Promise.all([
        apiGet<{ pending: AIAction[]; recent: AIAction[] }>("/api/ai/actions"),
        apiGet<{ insights: AIInsight[] }>("/api/ai/insights"),
      ]);
      setPending(queueData.pending);
      setRecent(queueData.recent);
      setInsights(insightsData.insights);
    } catch (err) {
      console.error("Failed to fetch autopilot data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Trigger AI scan
  const handleScan = async () => {
    setScanning(true);
    setScanSummary(null);
    try {
      const result = await apiPost<{
        summary: string;
        actionsCreated: number;
        actions: AIAction[];
        insights: AIInsight[];
      }>("/api/ai/actions", {});
      setScanSummary(result.summary);
      // Refresh data
      await fetchData();
    } catch (err) {
      console.error("Scan failed:", err);
      setScanSummary("Scan failed. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  // Approve / Reject
  const handleAction = async (actionId: string, status: "APPROVED" | "REJECTED") => {
    setProcessingIds((prev) => new Set(prev).add(actionId));
    try {
      await apiPatch(`/api/ai/actions/${actionId}`, { status });
      await fetchData();
    } catch (err) {
      console.error(`Failed to ${status.toLowerCase()} action:`, err);
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(actionId);
        return next;
      });
    }
  };

  // Stats
  const totalExecuted = recent.filter((a) => a.status === "EXECUTED").length;
  const totalActions = recent.length + pending.length;
  const successRate = totalActions > 0 ? Math.round((totalExecuted / Math.max(totalExecuted + recent.filter((a) => a.status === "FAILED").length, 1)) * 100) : 0;
  const timeSavedEstimate = totalExecuted * 25; // ~25 min per action

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Zap size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">AI Autopilot</h1>
                <p className="text-sm text-gray-500">Your AI manager takes actions — you approve them</p>
              </div>
            </div>
            <button
              onClick={handleScan}
              disabled={scanning}
              className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {scanning ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Scanning...
                </>
              ) : (
                <>
                  <RefreshCw size={16} /> Run AI Scan
                </>
              )}
            </button>
          </div>
        </div>

        <div className="px-8 py-6 max-w-6xl">
          {/* Scan Summary */}
          {scanSummary && (
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Zap size={18} className="text-purple-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-purple-900">AI Scan Complete</p>
                  <p className="text-sm text-purple-700 mt-1">{scanSummary}</p>
                </div>
                <button onClick={() => setScanSummary(null)} className="ml-auto text-purple-400 hover:text-purple-600">
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                <Activity size={14} /> Total Actions
              </div>
              <p className="text-2xl font-bold">{totalActions}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                <CheckCircle2 size={14} /> Executed
              </div>
              <p className="text-2xl font-bold text-green-600">{totalExecuted}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                <BarChart3 size={14} /> Success Rate
              </div>
              <p className="text-2xl font-bold">{successRate}%</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs font-medium mb-1">
                <Timer size={14} /> Time Saved
              </div>
              <p className="text-2xl font-bold">{timeSavedEstimate > 60 ? `${Math.round(timeSavedEstimate / 60)}h` : `${timeSavedEstimate}m`}</p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-gray-300" />
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Action Queue + Recent */}
              <div className="lg:col-span-2 space-y-6">
                {/* Pending Actions */}
                <div className="bg-white rounded-xl border border-gray-100">
                  <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                    <h2 className="text-base font-bold flex items-center gap-2">
                      <Clock size={16} className="text-amber-500" />
                      Action Queue
                      {pending.length > 0 && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                          {pending.length}
                        </span>
                      )}
                    </h2>
                  </div>

                  {pending.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Zap size={20} className="text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">No pending actions</p>
                      <p className="text-xs text-gray-400 mt-1">Run an AI scan to generate recommendations</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {pending.map((action) => {
                        const config = actionTypeConfig[action.type];
                        const Icon = config.icon;
                        const isExpanded = expandedId === action.id;
                        const isProcessing = processingIds.has(action.id);

                        return (
                          <div key={action.id} className="px-5 py-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                                <Icon size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
                                    {config.label}
                                  </span>
                                  <span className="text-xs text-gray-300">{timeAgo(action.createdAt)}</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 mt-0.5">{action.title}</p>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{action.description}</p>

                                {/* Expand/Collapse */}
                                <button
                                  onClick={() => setExpandedId(isExpanded ? null : action.id)}
                                  className="inline-flex items-center gap-1 text-xs text-[var(--primary)] font-medium mt-2 hover:underline"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp size={12} /> Hide details
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown size={12} /> View details
                                    </>
                                  )}
                                </button>

                                {/* Expanded Details */}
                                {isExpanded && (
                                  <div className="mt-3 bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-600 whitespace-pre-wrap">{action.description}</p>
                                    {action.payload && Object.keys(action.payload).length > 0 && (
                                      <div className="mt-3">
                                        <p className="text-xs font-semibold text-gray-500 mb-1">Action Data:</p>
                                        <pre className="text-xs text-gray-500 bg-white rounded p-2 overflow-x-auto">
                                          {JSON.stringify(action.payload, null, 2)}
                                        </pre>
                                      </div>
                                    )}
                                    {action.scheduledFor && (
                                      <p className="text-xs text-gray-500 mt-2">
                                        <Calendar size={11} className="inline mr-1" />
                                        Scheduled: {new Date(action.scheduledFor).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => handleAction(action.id, "APPROVED")}
                                  disabled={isProcessing}
                                  className="inline-flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                                >
                                  {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleAction(action.id, "REJECTED")}
                                  disabled={isProcessing}
                                  className="inline-flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                                >
                                  <X size={12} /> Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Recent Actions */}
                <div className="bg-white rounded-xl border border-gray-100">
                  <div className="px-5 py-4 border-b border-gray-50">
                    <h2 className="text-base font-bold flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      Recent Actions
                    </h2>
                  </div>

                  {recent.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <p className="text-sm text-gray-400">No recent actions yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {recent.map((action) => {
                        const typeConf = actionTypeConfig[action.type];
                        const statConf = statusConfig[action.status];
                        const TypeIcon = typeConf.icon;
                        const StatusIcon = statConf.icon;

                        return (
                          <div key={action.id} className="px-5 py-3 flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeConf.color}`}>
                              <TypeIcon size={14} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{action.title}</p>
                              <p className="text-xs text-gray-400">{timeAgo(action.updatedAt)}</p>
                            </div>
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${statConf.color}`}>
                              <StatusIcon size={11} />
                              {statConf.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Insights Panel */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-100">
                  <div className="px-5 py-4 border-b border-gray-50">
                    <h2 className="text-base font-bold flex items-center gap-2">
                      <Lightbulb size={16} className="text-amber-500" />
                      AI Insights
                    </h2>
                  </div>

                  {insights.length === 0 ? (
                    <div className="px-5 py-8 text-center">
                      <p className="text-sm text-gray-400">No insights yet</p>
                    </div>
                  ) : (
                    <div className="p-3 space-y-3">
                      {insights.map((insight, idx) => {
                        const conf = insightTypeConfig[insight.type] || insightTypeConfig.alert;
                        const Icon = conf.icon;
                        const colorParts = conf.color.split(" ");

                        return (
                          <div
                            key={idx}
                            className={`rounded-lg border p-3 ${colorParts[1]} ${colorParts[2]}`}
                          >
                            <div className="flex items-start gap-2.5">
                              <Icon size={15} className={`${colorParts[0]} shrink-0 mt-0.5`} />
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{insight.title}</p>
                                <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                                {insight.value && (
                                  <p className="text-xs font-bold text-gray-800 mt-1.5">
                                    {insight.metric}: {insight.value}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Quick Info */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={16} className="text-amber-400" />
                    <p className="text-sm font-bold">How Autopilot Works</p>
                  </div>
                  <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
                    <p>
                      <strong className="text-white">1. Scan</strong> — AI analyzes your analytics, releases, content calendar, and goals.
                    </p>
                    <p>
                      <strong className="text-white">2. Suggest</strong> — It generates specific actions (schedule posts, pitch playlists, send emails).
                    </p>
                    <p>
                      <strong className="text-white">3. Approve</strong> — You review each action and approve or reject.
                    </p>
                    <p>
                      <strong className="text-white">4. Execute</strong> — Approved actions are carried out automatically.
                    </p>
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
