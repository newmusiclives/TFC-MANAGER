"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Play,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Clock,
  Heart,
  Music2,
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const streamHistory = [
  { date: "Oct 1", streams: 320, listeners: 180 },
  { date: "Oct 8", streams: 410, listeners: 220 },
  { date: "Oct 15", streams: 380, listeners: 195 },
  { date: "Oct 22", streams: 520, listeners: 290 },
  { date: "Oct 29", streams: 480, listeners: 260 },
  { date: "Nov 5", streams: 610, listeners: 340 },
  { date: "Nov 12", streams: 720, listeners: 410 },
  { date: "Nov 19", streams: 680, listeners: 380 },
  { date: "Nov 26", streams: 890, listeners: 490 },
  { date: "Dec 3", streams: 1050, listeners: 580 },
  { date: "Dec 10", streams: 1240, listeners: 680 },
  { date: "Dec 17", streams: 1420, listeners: 720 },
  { date: "Dec 24", streams: 1100, listeners: 590 },
  { date: "Dec 31", streams: 1380, listeners: 710 },
  { date: "Jan 7", streams: 1520, listeners: 810 },
  { date: "Jan 14", streams: 1680, listeners: 890 },
  { date: "Jan 21", streams: 1750, listeners: 920 },
  { date: "Jan 28", streams: 1900, listeners: 1020 },
  { date: "Feb 4", streams: 2100, listeners: 1140 },
  { date: "Feb 11", streams: 2250, listeners: 1200 },
  { date: "Feb 18", streams: 2080, listeners: 1100 },
  { date: "Feb 25", streams: 2340, listeners: 1280 },
  { date: "Mar 4", streams: 2520, listeners: 1350 },
  { date: "Mar 11", streams: 2680, listeners: 1410 },
  { date: "Mar 18", streams: 2790, listeners: 1500 },
  { date: "Mar 25", streams: 2950, listeners: 1580 },
];

const platformBreakdown = [
  { name: "Spotify", value: 48, streams: 61680, color: "#1DB954" },
  { name: "Apple Music", value: 22, streams: 28270, color: "#fc3c44" },
  { name: "YouTube Music", value: 15, streams: 19275, color: "#ff0000" },
  { name: "Deezer", value: 8, streams: 10280, color: "#a238ff" },
  { name: "Tidal", value: 4, streams: 5140, color: "#000000" },
  { name: "Other", value: 3, streams: 3855, color: "#9ca3af" },
];

const topTracks = [
  { name: "Midnight Dreams", streams: 22100, change: "+18.2%", up: true },
  { name: "Summer Waves", streams: 15200, change: "+5.1%", up: true },
  { name: "Electric Feel", streams: 18300, change: "-2.3%", up: false },
  { name: "First Light", streams: 12400, change: "+8.7%", up: true },
  { name: "Neon Lights", streams: 9400, change: "+1.2%", up: true },
];

const topCountries = [
  { country: "United States", listeners: 5840, pct: 32.1 },
  { country: "France", listeners: 2910, pct: 16.0 },
  { country: "United Kingdom", listeners: 2100, pct: 11.5 },
  { country: "Germany", listeners: 1640, pct: 9.0 },
  { country: "Canada", listeners: 1280, pct: 7.0 },
  { country: "Brazil", listeners: 980, pct: 5.4 },
  { country: "Australia", listeners: 740, pct: 4.1 },
  { country: "Other", listeners: 2710, pct: 14.9 },
];

const demographics = [
  { age: "13-17", pct: 8 },
  { age: "18-24", pct: 34 },
  { age: "25-34", pct: 38 },
  { age: "35-44", pct: 14 },
  { age: "45+", pct: 6 },
];

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-sm text-gray-500">
              Centralized stats across all platforms
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>Last 30 days</option>
              <option>Last 7 days</option>
            </select>
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Key metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Streams", value: "128.5K", change: "+23.5%", up: true, icon: Play, color: "bg-blue-50 text-blue-600" },
              { label: "Monthly Listeners", value: "18.2K", change: "+12.8%", up: true, icon: Users, color: "bg-purple-50 text-purple-600" },
              { label: "Avg. Daily Streams", value: "2,950", change: "+8.4%", up: true, icon: TrendingUp, color: "bg-green-50 text-green-600" },
              { label: "Save Rate", value: "24.3%", change: "+2.1%", up: true, icon: Heart, color: "bg-pink-50 text-pink-600" },
            ].map((m) => (
              <div key={m.label} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${m.color}`}>
                    <m.icon size={18} />
                  </div>
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${m.up ? "text-green-600" : "text-red-500"}`}>
                    {m.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {m.change}
                  </span>
                </div>
                <div className="text-2xl font-bold">{m.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Streams chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-lg mb-1">Streams & Listeners</h2>
            <p className="text-sm text-gray-500 mb-6">Weekly trend over the last 6 months</p>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={streamHistory}>
                <defs>
                  <linearGradient id="sgStreams" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00c878" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00c878" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="sgListeners" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} interval={3} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
                <Area type="monotone" dataKey="streams" stroke="#00c878" strokeWidth={2} fill="url(#sgStreams)" name="Streams" />
                <Area type="monotone" dataKey="listeners" stroke="#7c3aed" strokeWidth={2} fill="url(#sgListeners)" name="Listeners" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Platform breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-6">Platform Breakdown</h2>
              <div className="flex items-center gap-6">
                <div className="w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={platformBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                        {platformBreakdown.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2.5">
                  {platformBreakdown.map((p) => (
                    <div key={p.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-sm">{p.name}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">{p.value}%</span>
                        <span className="text-gray-400 ml-2">{p.streams.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top tracks */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-6">Top Tracks</h2>
              <div className="space-y-3">
                {topTracks.map((t, idx) => (
                  <div key={t.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-300 w-5">{idx + 1}</span>
                      <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Music2 size={16} className="text-gray-400" />
                      </div>
                      <span className="font-medium text-sm">{t.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{t.streams.toLocaleString()}</div>
                      <div className={`text-xs ${t.up ? "text-green-600" : "text-red-500"}`}>
                        {t.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top countries */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
                <Globe size={20} className="text-[var(--primary)]" /> Top Countries
              </h2>
              <p className="text-sm text-gray-500 mb-4">Where your listeners are</p>
              <div className="space-y-3">
                {topCountries.map((c) => (
                  <div key={c.country} className="flex items-center gap-3">
                    <span className="text-sm w-32 shrink-0 font-medium">{c.country}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                      <div
                        className="bg-[var(--primary)] h-2.5 rounded-full"
                        style={{ width: `${c.pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-20 text-right">
                      {c.listeners.toLocaleString()} ({c.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Demographics */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
                <Users size={20} className="text-[var(--primary)]" /> Listener Demographics
              </h2>
              <p className="text-sm text-gray-500 mb-4">Age distribution of your audience</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={demographics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="age" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
                  <Bar dataKey="pct" fill="#00c878" radius={[6, 6, 0, 0]} barSize={40} name="%" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-8 mt-4 text-sm text-gray-500">
                <span>Female: <strong className="text-gray-800">52%</strong></span>
                <span>Male: <strong className="text-gray-800">44%</strong></span>
                <span>Other: <strong className="text-gray-800">4%</strong></span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
