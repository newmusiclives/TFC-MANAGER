"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { useState } from "react";
import Link from "next/link";
import {
  Music2,
  TrendingUp,
  Users,
  Play,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Search,
  Calendar,
  Sparkles,
  X,
  CircleDot,
  ExternalLink,
  ListMusic,
  Heart,
  BarChart3,
  DollarSign,
  Clock,
  ArrowRight,
  Zap,
  FileImage,
  Send,
  Share2,
  MessageSquare,
  MapPin,
  Bot,
  Headphones,
  Mic2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const streamData = [
  { name: "Jan", streams: 4200 },
  { name: "Feb", streams: 5800 },
  { name: "Mar", streams: 7200 },
  { name: "Apr", streams: 6100 },
  { name: "May", streams: 9400 },
  { name: "Jun", streams: 11200 },
  { name: "Jul", streams: 10800 },
  { name: "Aug", streams: 13500 },
  { name: "Sep", streams: 15200 },
  { name: "Oct", streams: 14800 },
  { name: "Nov", streams: 18300 },
  { name: "Dec", streams: 22100 },
];

const platformData = [
  { name: "Spotify", streams: 12400 },
  { name: "Apple", streams: 6200 },
  { name: "YouTube", streams: 4800 },
  { name: "Deezer", streams: 2100 },
  { name: "Tidal", streams: 980 },
];

const stats = [
  {
    label: "Total Streams",
    value: "128.5K",
    change: "+23.5%",
    up: true,
    icon: Play,
    sparkline: [40, 55, 48, 62, 58, 72, 80],
  },
  {
    label: "Monthly Listeners",
    value: "18.2K",
    change: "+12.8%",
    up: true,
    icon: Users,
    sparkline: [30, 35, 42, 38, 50, 55, 60],
  },
  {
    label: "Releases",
    value: "12",
    change: "+3",
    up: true,
    icon: Music2,
    sparkline: [10, 10, 20, 20, 30, 30, 40],
  },
  {
    label: "Growth Rate",
    value: "23.5%",
    change: "+5.2%",
    up: true,
    icon: TrendingUp,
    sparkline: [20, 28, 35, 32, 45, 52, 65],
  },
];

const aiTasks = [
  {
    priority: "critical",
    task: "Submit artwork for 'Golden Hour'",
    link: "/dashboard/release-plans",
    linkLabel: "Release Plans",
    due: "Mar 30",
    reasoning:
      "This is blocking your distribution submission. Without artwork, the release cannot be processed by DSPs.",
  },
  {
    priority: "high",
    task: "Review and approve master for April single",
    link: "/dashboard/sound-analysis",
    linkLabel: "Sound Analysis",
    due: "Apr 1",
    reasoning:
      "Your mastering engineer delivered 2 days early. Approve now to stay ahead of schedule.",
  },
  {
    priority: "high",
    task: "Generate pre-save campaign content",
    link: "/dashboard/content-generator",
    linkLabel: "Content Generator",
    due: "Apr 3",
    reasoning:
      "Pre-save campaigns launched 2+ weeks before release get 3x more saves based on your history.",
  },
  {
    priority: "medium",
    task: "Respond to playlist curator pitch",
    link: "/dashboard/ai-manager",
    linkLabel: "AI Manager",
    due: "Apr 5",
    reasoning:
      "A curator from 'Chill Vibes' (45K followers) opened your pitch email yesterday. Strike while warm.",
  },
  {
    priority: "medium",
    task: "Schedule TikTok teaser clips for next week",
    link: "/dashboard/content-generator",
    linkLabel: "Content Generator",
    due: "Apr 7",
    reasoning:
      "Your last 3 TikTok posts averaged 12K views. Consistent posting keeps momentum going.",
  },
];

const activityFeed = [
  {
    icon: ListMusic,
    color: "bg-green-500",
    text: "Your track was added to 'Late Night Indie' playlist",
    time: "2 hours ago",
  },
  {
    icon: Heart,
    color: "bg-pink-500",
    text: "New superfan detected: Alex M. from LA (score: 98)",
    time: "4 hours ago",
  },
  {
    icon: BarChart3,
    color: "bg-blue-500",
    text: "Weekly report is ready — view insights",
    time: "6 hours ago",
  },
  {
    icon: DollarSign,
    color: "bg-amber-500",
    text: "Fan funding: $45 pledge from supporter",
    time: "8 hours ago",
  },
  {
    icon: Clock,
    color: "bg-purple-500",
    text: "Content scheduled: TikTok post going live at 7pm",
    time: "12 hours ago",
  },
];

const quickActions = [
  {
    label: "Create Release Plan",
    href: "/dashboard/release-plans",
    icon: Calendar,
    description: "Plan and schedule your next release",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    label: "Generate Content",
    href: "/dashboard/content-generator",
    icon: Zap,
    description: "AI-powered social media content",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    label: "Analyze a Track",
    href: "/dashboard/sound-analysis",
    icon: Headphones,
    description: "Get AI insights on your audio",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    label: "Check Earnings",
    href: "/dashboard/earnings",
    icon: DollarSign,
    description: "Revenue breakdown and payouts",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    label: "View Fan Map",
    href: "/dashboard/fan-heatmap",
    icon: MapPin,
    description: "See where your fans are worldwide",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    label: "Ask AI Manager",
    href: "/dashboard/ai-manager",
    icon: Bot,
    description: "Get personalized career advice",
    gradient: "from-teal-500 to-cyan-600",
  },
];

function MiniSparkline({ data, up }: { data: number[]; up: boolean }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[3px] h-8">
      {data.map((val, i) => (
        <div
          key={i}
          className={`w-[5px] rounded-sm transition-all ${
            up
              ? i === data.length - 1
                ? "bg-green-500"
                : "bg-green-300/60"
              : i === data.length - 1
              ? "bg-red-500"
              : "bg-red-300/60"
          }`}
          style={{ height: `${(val / max) * 100}%`, minHeight: "3px" }}
        />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [showAiBanner, setShowAiBanner] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome back! Here&apos;s your command center.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] w-64"
              />
            </div>
            <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-9 h-9 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold text-sm">
              JD
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* AI Insight Banner */}
          {showAiBanner && (
            <div className="relative bg-gradient-to-r from-green-600 to-teal-500 rounded-2xl p-6 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold leading-snug">
                      Good morning, Jordan! 🎵 Your streams are up 8.4% this
                      week.
                    </p>
                    <p className="text-white/85 mt-1.5 text-sm leading-relaxed">
                      Golden Hour is 21 days away — your next priority is
                      submitting artwork by March 30. Stay on track and
                      you&apos;ll hit your Q2 release goal.
                    </p>
                    <Link
                      href="/dashboard/release-plans"
                      className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      View Release Plan <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiBanner(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Dismiss"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats with Sparklines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center">
                    <s.icon size={20} className="text-[var(--primary)]" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      s.up ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {s.up ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                    {s.change}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                  </div>
                  <MiniSparkline data={s.sparkline} up={s.up} />
                </div>
              </div>
            ))}
          </div>

          {/* What To Do Today */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">What To Do Today</h2>
                  <p className="text-xs text-gray-500">
                    AI-prioritized based on your goals and deadlines
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {aiTasks.map((t, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      t.priority === "critical"
                        ? "bg-red-500"
                        : t.priority === "high"
                        ? "bg-orange-500"
                        : "bg-yellow-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm">{t.task}</p>
                        <p className="text-xs text-gray-400 mt-1 italic">
                          {t.reasoning}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            t.priority === "critical"
                              ? "bg-red-50 text-red-600"
                              : t.priority === "high"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-yellow-50 text-yellow-600"
                          }`}
                        >
                          {t.priority}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} /> {t.due}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={t.link}
                      className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-[var(--primary)] hover:underline"
                    >
                      {t.linkLabel} <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Streams chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-lg">Streams Overview</h2>
                <select className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none">
                  <option>Last 12 months</option>
                  <option>Last 6 months</option>
                  <option>Last 30 days</option>
                </select>
              </div>
              {/* AI Summary Badge */}
              <div className="inline-flex items-start gap-2 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200/60 rounded-lg px-3 py-2 mb-5">
                <Sparkles
                  size={14}
                  className="text-green-600 mt-0.5 flex-shrink-0"
                />
                <p className="text-xs text-green-800 leading-relaxed">
                  Streams grew <span className="font-semibold">8.4%</span>{" "}
                  week-over-week. Primary driver: playlist addition to
                  &apos;Late Night Indie&apos; on Monday.
                </p>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={streamData}>
                  <defs>
                    <linearGradient
                      id="streamGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#00c878" stopOpacity={0.2} />
                      <stop
                        offset="95%"
                        stopColor="#00c878"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="streams"
                    stroke="#00c878"
                    strokeWidth={2.5}
                    fill="url(#streamGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Platform breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-lg mb-6">Platform Breakdown</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={platformData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Bar
                    dataKey="streams"
                    fill="#00c878"
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Activity Feed</h2>
              <button className="text-sm text-[var(--primary)] hover:underline font-medium flex items-center gap-1">
                View all <ExternalLink size={14} />
              </button>
            </div>
            <div className="space-y-1">
              {activityFeed.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-3 px-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <a.icon size={18} className="text-gray-600" />
                    </div>
                    <div
                      className={`absolute -top-0.5 -right-0.5 w-3 h-3 ${a.color} rounded-full border-2 border-white`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {a.text}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {a.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-11 h-11 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      <action.icon size={20} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm flex items-center gap-1.5">
                        {action.label}
                        <ArrowRight
                          size={14}
                          className="text-gray-300 group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
