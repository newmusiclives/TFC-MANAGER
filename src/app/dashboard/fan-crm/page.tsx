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

export default function FanCRMPage() {
  const [activeSegment, setActiveSegment] = useState<Segment>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribers, setSubscribers] = useState<Subscriber[]>(mockSubscribers);

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
        </div>
      </main>
    </div>
  );
}
