"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { apiGet } from "@/lib/api-client";
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
  Zap,
  Target,
  ListMusic,
  FileDown,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { exportToCSV } from "@/lib/pdf-export";
import { useState, useEffect } from "react";
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

const mockStreamHistory = [
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

const mockPlatformBreakdown = [
  { name: "Spotify", value: 48, streams: 61680, color: "#1DB954" },
  { name: "Apple Music", value: 22, streams: 28270, color: "#fc3c44" },
  { name: "YouTube Music", value: 15, streams: 19275, color: "#ff0000" },
  { name: "Deezer", value: 8, streams: 10280, color: "#a238ff" },
  { name: "Tidal", value: 4, streams: 5140, color: "#000000" },
  { name: "Other", value: 3, streams: 3855, color: "#9ca3af" },
];

const mockTopTracks = [
  { name: "Midnight Dreams", streams: 22100, change: "+18.2%", up: true },
  { name: "Summer Waves", streams: 15200, change: "+5.1%", up: true },
  { name: "Electric Feel", streams: 18300, change: "-2.3%", up: false },
  { name: "First Light", streams: 12400, change: "+8.7%", up: true },
  { name: "Neon Lights", streams: 9400, change: "+1.2%", up: true },
];

const mockTopCountries = [
  { country: "United States", listeners: 5840, pct: 32.1 },
  { country: "France", listeners: 2910, pct: 16.0 },
  { country: "United Kingdom", listeners: 2100, pct: 11.5 },
  { country: "Germany", listeners: 1640, pct: 9.0 },
  { country: "Canada", listeners: 1280, pct: 7.0 },
  { country: "Brazil", listeners: 980, pct: 5.4 },
  { country: "Australia", listeners: 740, pct: 4.1 },
  { country: "Other", listeners: 2710, pct: 14.9 },
];

const mockDemographics = [
  { age: "13-17", pct: 8 },
  { age: "18-24", pct: 34 },
  { age: "25-34", pct: 38 },
  { age: "35-44", pct: 14 },
  { age: "45+", pct: 6 },
];

const mockMetrics = [
  { label: "Total Streams", value: "128.5K", change: "+23.5%", up: true, icon: Play, color: "bg-blue-50 text-blue-600" },
  { label: "Monthly Listeners", value: "18.2K", change: "+12.8%", up: true, icon: Users, color: "bg-purple-50 text-purple-600" },
  { label: "Avg. Daily Streams", value: "2,950", change: "+8.4%", up: true, icon: TrendingUp, color: "bg-green-50 text-green-600" },
  { label: "Save Rate", value: "24.3%", change: "+2.1%", up: true, icon: Heart, color: "bg-pink-50 text-pink-600" },
];

type Metric = { label: string; value: string; change: string; up: boolean; icon: React.ElementType; color: string };

const mockAlerts = [
  { id: 1, text: "You just hit 10K streams on Midnight Dreams", time: "2 hours ago", type: "milestone" as const },
  { id: 2, text: "Monthly listeners up 15% this week", time: "5 hours ago", type: "growth" as const },
  { id: 3, text: "New playlist placement detected: Chill Vibes (12.4K followers)", time: "1 day ago", type: "playlist" as const },
  { id: 4, text: "Save rate on Electric Feel increased to 28%", time: "2 days ago", type: "growth" as const },
];

const mockPlaylistPlacements = [
  { playlist: "Chill Vibes", platform: "Spotify", followers: "12.4K", track: "Midnight Dreams", estStreams: "3,200", addedDate: "Mar 22, 2026" },
  { playlist: "Indie Electronic", platform: "Spotify", followers: "45.8K", track: "Midnight Dreams", estStreams: "8,100", addedDate: "Mar 10, 2026" },
  { playlist: "New Music Friday", platform: "Apple Music", followers: "120K", track: "Electric Feel", estStreams: "15,400", addedDate: "Feb 28, 2026" },
  { playlist: "Late Night Drives", platform: "Spotify", followers: "8.2K", track: "Summer Waves", estStreams: "1,800", addedDate: "Feb 15, 2026" },
  { playlist: "Discover Weekly", platform: "Spotify", followers: "N/A", track: "Neon Lights", estStreams: "4,500", addedDate: "Jan 20, 2026" },
];

const mockProjectionData = [
  { month: "Jan", actual: 8200, projected: null },
  { month: "Feb", actual: 12100, projected: null },
  { month: "Mar", actual: 18200, projected: null },
  { month: "Apr", actual: null, projected: 22800 },
  { month: "May", actual: null, projected: 28400 },
  { month: "Jun", actual: null, projected: 34200 },
  { month: "Jul", actual: null, projected: 41500 },
  { month: "Aug", actual: null, projected: 50000 },
];

const mockCohorts = [
  { month: "Oct 2025", discovered: 420, retained30d: 78, retained60d: 62, retained90d: 51 },
  { month: "Nov 2025", discovered: 580, retained30d: 81, retained60d: 67, retained90d: 55 },
  { month: "Dec 2025", discovered: 890, retained30d: 74, retained60d: 58, retained90d: 0 },
  { month: "Jan 2026", discovered: 1240, retained30d: 82, retained60d: 0, retained90d: 0 },
  { month: "Feb 2026", discovered: 1580, retained30d: 85, retained60d: 0, retained90d: 0 },
  { month: "Mar 2026", discovered: 1920, retained30d: 0, retained60d: 0, retained90d: 0 },
];

export default function AnalyticsPage() {
  const [streamHistory, setStreamHistory] = useState(mockStreamHistory);
  const [platformBreakdown, setPlatformBreakdown] = useState(mockPlatformBreakdown);
  const [topTracks, setTopTracks] = useState(mockTopTracks);
  const [topCountries, setTopCountries] = useState(mockTopCountries);
  const [demographics, setDemographics] = useState(mockDemographics);
  const [metrics, setMetrics] = useState<Metric[]>(mockMetrics);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<Record<string, unknown>>("/api/streaming/sync");
        if (data) {
          if (Array.isArray((data as any).streamHistory)) setStreamHistory((data as any).streamHistory);
          if (Array.isArray((data as any).platformBreakdown)) setPlatformBreakdown((data as any).platformBreakdown);
          if (Array.isArray((data as any).topTracks)) setTopTracks((data as any).topTracks);
          if (Array.isArray((data as any).topCountries)) setTopCountries((data as any).topCountries);
          if (Array.isArray((data as any).demographics)) setDemographics((data as any).demographics);
          if ((data as any).metrics) setMetrics((data as any).metrics);
        }
      } catch {
        // keep mock data
      }
    })();
  }, []);

  const [exportToast, setExportToast] = useState(false);

  const handleExport = () => {
    // Build a flat array of analytics data for CSV export
    const csvData = streamHistory.map((row) => ({
      date: row.date,
      streams: row.streams,
      listeners: row.listeners,
    }));
    exportToCSV(csvData, "truefans-analytics-report.csv");
    setExportToast(true);
    setTimeout(() => setExportToast(false), 3000);
  };

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
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
            >
              <FileDown size={16} /> Export Report
            </button>
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

        {/* Export Toast */}
        {exportToast && (
          <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <FileDown size={16} /> Report exported successfully
          </div>
        )}

        <div className="p-8">
          {/* Real-time Alerts */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-5 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-blue-600" />
              <h2 className="font-bold text-sm text-blue-900">Recent Alerts</h2>
            </div>
            <div className="space-y-2">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between bg-white/80 rounded-xl px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${alert.type === "milestone" ? "bg-green-500" : alert.type === "playlist" ? "bg-purple-500" : "bg-blue-500"}`} />
                    <span className="text-sm text-gray-800">{alert.text}</span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 ml-4">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((m) => (
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

          {/* Predictive Analytics */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
            <div className="flex items-center gap-2 mb-1">
              <Target size={20} className="text-[var(--primary)]" />
              <h2 className="font-bold text-lg">Predictive Analytics</h2>
            </div>
            <p className="text-sm text-gray-500 mb-2">At your current growth rate, you&apos;ll reach <strong className="text-gray-900">50K monthly listeners</strong> by <strong className="text-gray-900">August 2026</strong></p>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <div className="text-gray-500">Current</div>
                  <div className="font-bold text-lg text-gray-900">18.2K</div>
                </div>
                <ArrowRight size={20} className="text-gray-300" />
                <div>
                  <div className="text-gray-500">Projected (Aug)</div>
                  <div className="font-bold text-lg text-[var(--primary)]">50K</div>
                </div>
                <div className="ml-auto">
                  <div className="text-gray-500">Monthly Growth</div>
                  <div className="font-bold text-lg text-green-600">+22.4%</div>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={mockProjectionData}>
                <defs>
                  <linearGradient id="sgActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00c878" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#00c878" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="sgProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
                <Area type="monotone" dataKey="actual" stroke="#00c878" strokeWidth={2} fill="url(#sgActual)" name="Actual" connectNulls={false} />
                <Area type="monotone" dataKey="projected" stroke="#7c3aed" strokeWidth={2} strokeDasharray="6 3" fill="url(#sgProjected)" name="Projected" connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Playlist Tracking */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
            <div className="flex items-center gap-2 mb-1">
              <ListMusic size={20} className="text-[var(--primary)]" />
              <h2 className="font-bold text-lg">Playlist Tracking</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">Playlists where your tracks are currently featured</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left font-semibold text-gray-600 px-4 py-3">Playlist</th>
                    <th className="text-left font-semibold text-gray-600 px-4 py-3">Platform</th>
                    <th className="text-left font-semibold text-gray-600 px-4 py-3">Followers</th>
                    <th className="text-left font-semibold text-gray-600 px-4 py-3">Track</th>
                    <th className="text-left font-semibold text-gray-600 px-4 py-3">Est. Streams</th>
                    <th className="text-left font-semibold text-gray-600 px-4 py-3">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPlaylistPlacements.map((p, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{p.playlist}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${p.platform === "Spotify" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                          {p.platform}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{p.followers}</td>
                      <td className="px-4 py-3 text-gray-700">{p.track}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{p.estStreams}</td>
                      <td className="px-4 py-3 text-gray-500">{p.addedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cohort Analysis */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays size={20} className="text-[var(--primary)]" />
              <h2 className="font-bold text-lg">Cohort Analysis</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">When did fans discover you &mdash; and how many stayed</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left font-semibold text-gray-600 px-4 py-3">Cohort</th>
                    <th className="text-left font-semibold text-gray-600 px-4 py-3">New Listeners</th>
                    <th className="text-left font-semibold text-gray-600 px-4 py-3">30-day Retention</th>
                    <th className="text-left font-semibold text-gray-600 px-4 py-3">60-day Retention</th>
                    <th className="text-left font-semibold text-gray-600 px-4 py-3">90-day Retention</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCohorts.map((cohort, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{cohort.month}</td>
                      <td className="px-4 py-3 text-gray-700">{cohort.discovered.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {cohort.retained30d > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-green-500" style={{ width: `${cohort.retained30d}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-green-700">{cohort.retained30d}%</span>
                          </div>
                        ) : <span className="text-xs text-gray-300">--</span>}
                      </td>
                      <td className="px-4 py-3">
                        {cohort.retained60d > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-blue-500" style={{ width: `${cohort.retained60d}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-blue-700">{cohort.retained60d}%</span>
                          </div>
                        ) : <span className="text-xs text-gray-300">--</span>}
                      </td>
                      <td className="px-4 py-3">
                        {cohort.retained90d > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-purple-500" style={{ width: `${cohort.retained90d}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-purple-700">{cohort.retained90d}%</span>
                          </div>
                        ) : <span className="text-xs text-gray-300">--</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
