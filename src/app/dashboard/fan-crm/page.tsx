"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Users,
  Mail,
  MousePointerClick,
  TrendingUp,
  Search,
  Download,
  Upload,
  Send,
  Filter,
  Star,
  UserPlus,
  UserMinus,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Crown,
  ToggleLeft,
  ToggleRight,
  Award,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost } from "@/lib/api-client";

type Segment = "all" | "superfans" | "new" | "inactive";

type Subscriber = {
  name: string;
  email: string;
  source: string;
  joined: string;
  status: "active" | "unsubscribed";
  engagement: number;
};

const mockSubscribers: Subscriber[] = [
  {
    name: "Alex Morrison",
    email: "alex.morrison@email.com",
    source: "website",
    joined: "Mar 12, 2026",
    status: "active",
    engagement: 94,
  },
  {
    name: "Marie Laurent",
    email: "marie.l@email.com",
    source: "smart-link",
    joined: "Mar 8, 2026",
    status: "active",
    engagement: 91,
  },
  {
    name: "James Kim",
    email: "jamesk@email.com",
    source: "campaign",
    joined: "Feb 28, 2026",
    status: "active",
    engagement: 87,
  },
  {
    name: "Sarah Torres",
    email: "sarah.t@email.com",
    source: "website",
    joined: "Feb 20, 2026",
    status: "active",
    engagement: 82,
  },
  {
    name: "Lukas Braun",
    email: "lukas.b@email.com",
    source: "smart-link",
    joined: "Feb 14, 2026",
    status: "active",
    engagement: 76,
  },
  {
    name: "Emma Richardson",
    email: "emma.r@email.com",
    source: "campaign",
    joined: "Jan 30, 2026",
    status: "unsubscribed",
    engagement: 23,
  },
  {
    name: "Yuki Sato",
    email: "yuki.sato@email.com",
    source: "website",
    joined: "Jan 18, 2026",
    status: "active",
    engagement: 68,
  },
  {
    name: "Pedro Costa",
    email: "pedro.c@email.com",
    source: "smart-link",
    joined: "Jan 5, 2026",
    status: "active",
    engagement: 55,
  },
];

function engagementColor(score: number) {
  if (score >= 80) return "text-green-600 bg-green-50";
  if (score >= 50) return "text-amber-600 bg-amber-50";
  return "text-red-500 bg-red-50";
}

function sourceLabel(source: string) {
  switch (source) {
    case "website":
      return { label: "Website", cls: "bg-blue-50 text-blue-600" };
    case "smart-link":
      return { label: "Smart Link", cls: "bg-purple-50 text-purple-600" };
    case "campaign":
      return { label: "Campaign", cls: "bg-amber-50 text-amber-600" };
    default:
      return { label: source, cls: "bg-gray-50 text-gray-600" };
  }
}

type CRMTab = "subscribers" | "fan-journey" | "automation" | "vip-tiers";

const mockFunnelStages = [
  { stage: "Discovery", count: 8400, color: "bg-blue-500", pct: 100 },
  { stage: "First Listen", count: 5200, color: "bg-purple-500", pct: 62 },
  { stage: "Follow", count: 2800, color: "bg-indigo-500", pct: 33 },
  { stage: "Engaged", count: 1240, color: "bg-green-500", pct: 15 },
  { stage: "Superfan", count: 340, color: "bg-amber-500", pct: 4 },
];

const mockAutomationRules = [
  { id: "a1", name: "Tag VIP fans", trigger: "Engagement score > 80", action: "Add tag: VIP", enabled: true },
  { id: "a2", name: "Welcome new subscribers", trigger: "New subscriber joins", action: "Send welcome email", enabled: true },
  { id: "a3", name: "Re-engage inactive fans", trigger: "No activity for 30 days", action: "Send re-engagement email", enabled: false },
  { id: "a4", name: "Superfan alert", trigger: "Engagement score > 95", action: "Send Slack notification + add to Superfan list", enabled: true },
  { id: "a5", name: "Birthday reward", trigger: "Fan birthday (if known)", action: "Send personalized birthday message", enabled: false },
];

const mockVIPTiers = [
  { tier: "Platinum", minScore: 95, color: "bg-gradient-to-r from-gray-300 to-gray-100", textColor: "text-gray-800", borderColor: "border-gray-300", count: 3, icon: Crown },
  { tier: "Gold", minScore: 80, color: "bg-gradient-to-r from-amber-200 to-amber-100", textColor: "text-amber-800", borderColor: "border-amber-300", count: 4, icon: Award },
  { tier: "Silver", minScore: 60, color: "bg-gradient-to-r from-slate-200 to-slate-100", textColor: "text-slate-700", borderColor: "border-slate-300", count: 3, icon: Star },
  { tier: "Bronze", minScore: 40, color: "bg-gradient-to-r from-orange-200 to-orange-100", textColor: "text-orange-800", borderColor: "border-orange-300", count: 5, icon: Users },
];

export default function FanCRMPage() {
  const [activeSegment, setActiveSegment] = useState<Segment>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribers, setSubscribers] = useState<Subscriber[]>(mockSubscribers);
  const [activeTab, setActiveTab] = useState<CRMTab>("subscribers");
  const [automationRules, setAutomationRules] = useState(mockAutomationRules);

  const fetchSubscribers = useCallback(async (segment?: Segment, search?: string) => {
    try {
      const params = new URLSearchParams();
      if (segment && segment !== "all") {
        const statusMap: Record<string, string> = { superfans: "active", inactive: "inactive" };
        if (statusMap[segment]) params.set("status", statusMap[segment]);
        if (segment === "new") params.set("status", "new");
      }
      if (search) params.set("search", search);
      const qs = params.toString();
      const data = await apiGet<Subscriber[]>(`/api/subscribers${qs ? `?${qs}` : ""}`);
      if (Array.isArray(data) && data.length > 0) {
        setSubscribers(data);
      }
    } catch {
      // API unavailable — keep mock data
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  useEffect(() => {
    fetchSubscribers(activeSegment, searchQuery);
  }, [activeSegment, searchQuery, fetchSubscribers]);

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase());

    switch (activeSegment) {
      case "superfans":
        return matchesSearch && sub.engagement >= 80 && sub.status === "active";
      case "new":
        return matchesSearch && sub.joined.startsWith("Mar");
      case "inactive":
        return matchesSearch && (sub.status === "unsubscribed" || sub.engagement < 40);
      default:
        return matchesSearch;
    }
  });

  const segments: { key: Segment; label: string; count: number }[] = [
    { key: "all", label: "All", count: subscribers.length },
    { key: "superfans", label: "Superfans", count: subscribers.filter((s) => s.engagement >= 80 && s.status === "active").length },
    { key: "new", label: "New Subscribers", count: subscribers.filter((s) => s.joined.startsWith("Mar")).length },
    { key: "inactive", label: "Inactive", count: subscribers.filter((s) => s.status === "unsubscribed" || s.engagement < 40).length },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Fan CRM</h1>
            <p className="text-sm text-gray-500">Manage your mailing list and engage your audience</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Subscribers", value: "1,240", icon: Users, color: "bg-blue-50 text-blue-600" },
              { label: "Open Rate", value: "42.3%", icon: Mail, color: "bg-green-50 text-green-600" },
              { label: "Click Rate", value: "18.7%", icon: MousePointerClick, color: "bg-purple-50 text-purple-600" },
              { label: "Growth", value: "+12%", sub: "this month", icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                  <s.icon size={18} />
                </div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-gray-500">
                  {s.label}
                  {s.sub && <span className="ml-1 text-gray-400">{s.sub}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 bg-white rounded-xl border border-gray-100 p-1 w-fit">
            {([
              { key: "subscribers" as CRMTab, label: "Subscribers" },
              { key: "fan-journey" as CRMTab, label: "Fan Journey" },
              { key: "automation" as CRMTab, label: "Automation Rules" },
              { key: "vip-tiers" as CRMTab, label: "VIP Tiers" },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-[var(--primary)] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Fan Journey Tab */}
          {activeTab === "fan-journey" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h2 className="font-bold text-lg mb-1">Fan Journey Pipeline</h2>
              <p className="text-sm text-gray-500 mb-6">How fans move through your engagement funnel</p>
              <div className="space-y-4">
                {mockFunnelStages.map((stage, idx) => (
                  <div key={stage.stage} className="flex items-center gap-4">
                    <div className="w-28 shrink-0 text-sm font-medium text-gray-700">{stage.stage}</div>
                    <div className="flex-1 relative">
                      <div className="h-10 bg-gray-100 rounded-xl overflow-hidden">
                        <div
                          className={`h-full ${stage.color} rounded-xl flex items-center justify-end pr-3 transition-all`}
                          style={{ width: `${Math.max(stage.pct, 8)}%` }}
                        >
                          <span className="text-xs font-bold text-white">{stage.count.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm font-semibold text-gray-500">{stage.pct}%</div>
                    {idx < mockFunnelStages.length - 1 && (
                      <ArrowRight size={16} className="text-gray-300 absolute -right-6 hidden" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800">
                  <strong>Insight:</strong> Your Discovery-to-Follow conversion rate is <strong>33%</strong>, which is above the indie average of 25%. Focus on converting Followers to Engaged fans with exclusive content and direct outreach.
                </p>
              </div>
            </div>
          )}

          {/* Automation Rules Tab */}
          {activeTab === "automation" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-lg">Automation Rules</h2>
                  <p className="text-sm text-gray-500">Automate fan engagement based on triggers</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors">
                  <Zap size={14} /> Add Rule
                </button>
              </div>
              <div className="space-y-3">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rule.enabled ? "bg-green-50" : "bg-gray-100"}`}>
                        <Zap size={18} className={rule.enabled ? "text-green-600" : "text-gray-400"} />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{rule.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          <span className="text-gray-400">When:</span> {rule.trigger} <span className="text-gray-300 mx-1">|</span> <span className="text-gray-400">Then:</span> {rule.action}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setAutomationRules((prev) => prev.map((r) => r.id === rule.id ? { ...r, enabled: !r.enabled } : r))}
                      className="p-1"
                    >
                      {rule.enabled ? (
                        <ToggleRight size={28} className="text-green-600" />
                      ) : (
                        <ToggleLeft size={28} className="text-gray-300" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIP Tiers Tab */}
          {activeTab === "vip-tiers" && (
            <div className="mb-6">
              <h2 className="font-bold text-lg mb-1">VIP Tiers</h2>
              <p className="text-sm text-gray-500 mb-4">Fan loyalty tiers based on engagement score</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockVIPTiers.map((tier) => (
                  <div key={tier.tier} className={`${tier.color} rounded-2xl border ${tier.borderColor} p-5`}>
                    <div className="flex items-center gap-2 mb-3">
                      <tier.icon size={20} className={tier.textColor} />
                      <h3 className={`font-bold text-lg ${tier.textColor}`}>{tier.tier}</h3>
                    </div>
                    <div className={`text-3xl font-bold ${tier.textColor}`}>{tier.count}</div>
                    <div className="text-sm text-gray-600 mt-1">Score {tier.minScore}+</div>
                    <div className="mt-3 pt-3 border-t border-white/50">
                      <div className="text-xs text-gray-600">
                        {tier.tier === "Platinum" && "Top fans, early access, merch discounts"}
                        {tier.tier === "Gold" && "Priority support, exclusive content"}
                        {tier.tier === "Silver" && "Newsletter perks, fan wall access"}
                        {tier.tier === "Bronze" && "Basic engagement rewards"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-4">
                <h3 className="font-semibold text-sm mb-3">Fans by Tier</h3>
                <div className="space-y-2">
                  {mockVIPTiers.map((tier) => {
                    const fans = subscribers.filter((s) => {
                      if (tier.tier === "Platinum") return s.engagement >= 95;
                      if (tier.tier === "Gold") return s.engagement >= 80 && s.engagement < 95;
                      if (tier.tier === "Silver") return s.engagement >= 60 && s.engagement < 80;
                      return s.engagement >= 40 && s.engagement < 60;
                    });
                    return (
                      <div key={tier.tier} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-20">{tier.tier}</span>
                        <div className="flex -space-x-2">
                          {fans.slice(0, 5).map((f) => (
                            <div key={f.email} className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary)] to-emerald-300 flex items-center justify-center text-white text-[10px] font-bold border-2 border-white">
                              {f.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                          ))}
                        </div>
                        {fans.length > 0 && <span className="text-xs text-gray-400">{fans.map((f) => f.name).join(", ")}</span>}
                        {fans.length === 0 && <span className="text-xs text-gray-300">No subscribers in mock data</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Toolbar: Segments + Search + Actions (original Subscribers tab) */}
          {activeTab === "subscribers" && <>
          {/* Toolbar: Segments + Search + Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Segment filters */}
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              {segments.map((seg) => (
                <button
                  key={seg.key}
                  onClick={() => setActiveSegment(seg.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeSegment === seg.key
                      ? "bg-[var(--primary)] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {seg.label}
                  <span
                    className={`ml-1.5 text-xs ${
                      activeSegment === seg.key ? "text-white/80" : "text-gray-400"
                    }`}
                  >
                    {seg.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscribers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
              />
            </div>

            {/* Import / Export */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Upload size={14} />
                Import
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Download size={14} />
                Export
              </button>
            </div>
          </div>

          {/* Subscriber Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left font-semibold text-gray-600 px-6 py-3">Name</th>
                    <th className="text-left font-semibold text-gray-600 px-6 py-3">Email</th>
                    <th className="text-left font-semibold text-gray-600 px-6 py-3">Source</th>
                    <th className="text-left font-semibold text-gray-600 px-6 py-3">Joined</th>
                    <th className="text-left font-semibold text-gray-600 px-6 py-3">Status</th>
                    <th className="text-left font-semibold text-gray-600 px-6 py-3">Engagement</th>
                    <th className="text-left font-semibold text-gray-600 px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-400">
                        No subscribers match your current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((sub) => {
                      const src = sourceLabel(sub.source);
                      return (
                        <tr key={sub.email} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--primary)] to-emerald-300 flex items-center justify-center text-white text-xs font-bold">
                              {sub.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            {sub.name}
                          </td>
                          <td className="px-6 py-4 text-gray-500">{sub.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${src.cls}`}>
                              {src.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500">{sub.joined}</td>
                          <td className="px-6 py-4">
                            {sub.status === "active" ? (
                              <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                                <CheckCircle2 size={14} /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium">
                                <XCircle size={14} /> Unsubscribed
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${sub.engagement}%`,
                                    backgroundColor:
                                      sub.engagement >= 80
                                        ? "#00c878"
                                        : sub.engagement >= 50
                                        ? "#f59e0b"
                                        : "#ef4444",
                                  }}
                                />
                              </div>
                              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${engagementColor(sub.engagement)}`}>
                                {sub.engagement}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {/* Table footer */}
            <div className="px-6 py-3 bg-gray-50/40 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <span>
                Showing {filteredSubscribers.length} of {subscribers.length} subscribers
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600">
                  Previous
                </button>
                <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Compose Email CTA */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                <Send size={22} className="text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Compose Email Campaign</h3>
                <p className="text-sm text-gray-500">
                  Send a newsletter or announcement to your subscribers. Use the AI content generator for help.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/dashboard/content-generator"
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                AI Content Generator
              </a>
              <button className="px-5 py-2 text-sm font-semibold text-white bg-[var(--primary)] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                <Mail size={16} />
                Compose Email
              </button>
            </div>
          </div>
          </>}
        </div>
      </main>
    </div>
  );
}
