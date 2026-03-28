"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  Users,
  Music2,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  UserPlus,
  ArrowDown,
  Activity,
  Bell,
  Shield,
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
} from "recharts";

type Admin = { name: string; avatar: string; role: string };

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [revenueData, setRevenueData] = useState<Record<string, unknown>[]>([]);
  const [planDist, setPlanDist] = useState<
    { plan: string; count: number; percentage: number }[]
  >([]);
  const [activity, setActivity] = useState<
    { id: number; action: string; user: string; time: string; type: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => setAdmin(d.admin))
      .catch(() => router.push("/admin/login"));

    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setRevenueData(d.revenueData);
        setPlanDist(d.planDistribution);
        setActivity(d.recentActivity);
      });
  }, [router]);

  if (!admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const s = stats as Record<string, number> | null;
  const COLORS = ["#6b7280", "#ef4444", "#f59e0b"];

  const statCards = s
    ? [
        {
          label: "Total Users",
          value: s.totalUsers?.toLocaleString(),
          change: "+7.2%",
          icon: Users,
          color: "bg-blue-50 text-blue-600",
        },
        {
          label: "Active Users",
          value: s.activeUsers?.toLocaleString(),
          change: "+4.1%",
          icon: Activity,
          color: "bg-green-50 text-green-600",
        },
        {
          label: "Revenue (MRR)",
          value: `$${s.revenue?.toLocaleString()}`,
          change: "+12.3%",
          icon: DollarSign,
          color: "bg-amber-50 text-amber-600",
        },
        {
          label: "New This Month",
          value: s.newUsersThisMonth?.toString(),
          change: "+15.8%",
          icon: UserPlus,
          color: "bg-purple-50 text-purple-600",
        },
      ]
    : [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Overview</h1>
            <p className="text-sm text-gray-500">
              Platform performance and management
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {admin.avatar}
              </div>
              <div className="text-sm">
                <div className="font-medium">{admin.name}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Shield size={10} /> {admin.role.replace("_", " ")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((c) => (
              <div
                key={c.label}
                className="bg-white rounded-2xl p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}
                  >
                    <c.icon size={20} />
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <ArrowUpRight size={16} />
                    {c.change}
                  </div>
                </div>
                <div className="text-2xl font-bold">{c.value}</div>
                <div className="text-sm text-gray-500 mt-1">{c.label}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-lg">Revenue & Growth</h2>
                  <p className="text-sm text-gray-500">
                    Monthly recurring revenue
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <TrendingUp size={14} /> +12.3% vs last month
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="revGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                      <stop
                        offset="95%"
                        stopColor="#ef4444"
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
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value) => [
                      `$${Number(value).toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    fill="url(#revGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Plan distribution */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-lg mb-6">Plan Distribution</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={planDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {planDist.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={COLORS[idx % COLORS.length]}
                        stroke="none"
                      />
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
              <div className="space-y-3 mt-4">
                {planDist.map((p, idx) => (
                  <div key={p.plan} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx] }}
                      />
                      <span className="text-sm font-medium">{p.plan}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {p.count} ({p.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User growth bar chart */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-lg mb-6">User Growth</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={revenueData}>
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
                    }}
                  />
                  <Bar
                    dataKey="users"
                    fill="#ef4444"
                    radius={[6, 6, 0, 0]}
                    barSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-lg mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {activity.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          a.type === "signup"
                            ? "bg-green-50 text-green-600"
                            : a.type === "upgrade"
                            ? "bg-blue-50 text-blue-600"
                            : a.type === "release"
                            ? "bg-purple-50 text-purple-600"
                            : a.type === "flag"
                            ? "bg-red-50 text-red-600"
                            : "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {a.type === "signup" ? (
                          <UserPlus size={14} />
                        ) : a.type === "upgrade" ? (
                          <ArrowUpRight size={14} />
                        ) : a.type === "release" ? (
                          <Music2 size={14} />
                        ) : a.type === "flag" ? (
                          <ArrowDown size={14} />
                        ) : (
                          <Activity size={14} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{a.action}</div>
                        <div className="text-xs text-gray-500">{a.user}</div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
