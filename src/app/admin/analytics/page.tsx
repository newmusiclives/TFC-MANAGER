"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  Bell,
  BarChart3,
  TrendingUp,
  Users,
  Music2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
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

const signupData = [
  { month: "Oct", signups: 42, churns: 5 },
  { month: "Nov", signups: 58, churns: 8 },
  { month: "Dec", signups: 71, churns: 6 },
  { month: "Jan", signups: 89, churns: 10 },
  { month: "Feb", signups: 104, churns: 7 },
  { month: "Mar", signups: 127, churns: 9 },
];

const platformData = [
  { name: "Spotify", users: 2840 },
  { name: "Apple Music", users: 1620 },
  { name: "YouTube Music", users: 980 },
  { name: "Tidal", users: 340 },
  { name: "SoundCloud", users: 520 },
];

const genreData = [
  { genre: "Hip-Hop/Rap", count: 1240, color: "#ef4444" },
  { genre: "Pop", count: 980, color: "#f59e0b" },
  { genre: "R&B/Soul", count: 720, color: "#8b5cf6" },
  { genre: "Rock", count: 540, color: "#3b82f6" },
  { genre: "Electronic", count: 380, color: "#10b981" },
  { genre: "Other", count: 640, color: "#6b7280" },
];

const engagementData = [
  { week: "W1", dau: 320, wau: 1240 },
  { week: "W2", dau: 345, wau: 1310 },
  { week: "W3", dau: 380, wau: 1420 },
  { week: "W4", dau: 410, wau: 1500 },
];

const metrics = [
  {
    label: "Total Users",
    value: "4,502",
    change: "+12.3%",
    up: true,
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Active Artists",
    value: "3,218",
    change: "+8.7%",
    up: true,
    icon: Music2,
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "Avg. Revenue/User",
    value: "$14.50",
    change: "+5.2%",
    up: true,
    icon: DollarSign,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Churn Rate",
    value: "2.1%",
    change: "-0.4%",
    up: false,
    icon: TrendingUp,
    color: "bg-green-50 text-green-600",
  },
];

export default function AdminAnalytics() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(() => setLoading(false))
      .catch(() => router.push("/admin/login"));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-sm text-gray-500">
              Platform-wide metrics and insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/20">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last 12 months</option>
              <option>All time</option>
            </select>
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.color}`}
                  >
                    <m.icon size={20} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      m.up ? "text-green-600" : "text-green-600"
                    }`}
                  >
                    {m.up ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                    {m.change}
                  </div>
                </div>
                <div className="text-2xl font-bold">{m.value}</div>
                <div className="text-sm text-gray-500 mt-1">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Signups & Churn chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-lg">Signups vs Churn</h2>
                  <p className="text-sm text-gray-500">
                    Monthly user acquisition and retention
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={signupData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="signups"
                    fill="#ef4444"
                    radius={[6, 6, 0, 0]}
                    barSize={28}
                    name="Signups"
                  />
                  <Bar
                    dataKey="churns"
                    fill="#d1d5db"
                    radius={[6, 6, 0, 0]}
                    barSize={28}
                    name="Churns"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Genre distribution */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-lg mb-6">Genre Distribution</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="genre"
                  >
                    {genreData.map((entry) => (
                      <Cell key={entry.genre} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2.5 mt-4">
                {genreData.map((g) => (
                  <div key={g.genre} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: g.color }}
                      />
                      <span className="text-sm">{g.genre}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {g.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform connections */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-lg mb-6">
                Platform Connections
              </h2>
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
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#374151" }}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                    }}
                    formatter={(value) => [
                      `${Number(value).toLocaleString()} users`,
                      "Connected",
                    ]}
                  />
                  <Bar
                    dataKey="users"
                    fill="#ef4444"
                    radius={[0, 6, 6, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Engagement trends */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-lg mb-6">Engagement Trends</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={engagementData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="dau"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{ fill: "#ef4444", r: 4 }}
                    name="Daily Active"
                  />
                  <Line
                    type="monotone"
                    dataKey="wau"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ fill: "#f59e0b", r: 4 }}
                    name="Weekly Active"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
