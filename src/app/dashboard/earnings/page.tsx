"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  CreditCard,
  FileText,
  Music2,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  Disc3,
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
  Cell,
} from "recharts";

const monthlyEarnings = [
  { month: "Apr '25", earnings: 82 },
  { month: "May '25", earnings: 96 },
  { month: "Jun '25", earnings: 110 },
  { month: "Jul '25", earnings: 135 },
  { month: "Aug '25", earnings: 158 },
  { month: "Sep '25", earnings: 172 },
  { month: "Oct '25", earnings: 198 },
  { month: "Nov '25", earnings: 220 },
  { month: "Dec '25", earnings: 245 },
  { month: "Jan '26", earnings: 268 },
  { month: "Feb '26", earnings: 290 },
  { month: "Mar '26", earnings: 312 },
];

const platformBreakdown = [
  { platform: "Spotify", earned: 1420.3, pct: 49.9, color: "#1DB954" },
  { platform: "Apple Music", earned: 684.2, pct: 24.0, color: "#fc3c44" },
  { platform: "YouTube", earned: 398.5, pct: 14.0, color: "#ff0000" },
  { platform: "Deezer", earned: 198.4, pct: 7.0, color: "#a238ff" },
  { platform: "Tidal", earned: 89.2, pct: 3.1, color: "#000000" },
  { platform: "Other", earned: 57.0, pct: 2.0, color: "#9ca3af" },
];

const releaseEarnings = [
  { title: "Midnight Dreams", type: "Single", totalEarned: 1240.5, thisMonth: 142.3, trend: "+12.4%", up: true },
  { title: "Summer Waves EP", type: "EP", totalEarned: 680.2, thisMonth: 78.6, trend: "+8.1%", up: true },
  { title: "Electric Feel", type: "Single", totalEarned: 420.1, thisMonth: 45.2, trend: "-3.2%", up: false },
  { title: "First Light", type: "Single", totalEarned: 310.8, thisMonth: 32.1, trend: "+5.7%", up: true },
  { title: "Neon Lights", type: "Single", totalEarned: 196.0, thisMonth: 14.25, trend: "+1.8%", up: true },
];

const revenuePerStream = [
  { platform: "Tidal", rps: 0.012, color: "#000000" },
  { platform: "Apple Music", rps: 0.008, color: "#fc3c44" },
  { platform: "Deezer", rps: 0.005, color: "#a238ff" },
  { platform: "Spotify", rps: 0.003, color: "#1DB954" },
  { platform: "YouTube", rps: 0.002, color: "#ff0000" },
];

const paymentHistory = [
  { date: "Mar 15, 2026", amount: 312.45, status: "pending", source: "All Platforms" },
  { date: "Feb 15, 2026", amount: 290.1, status: "paid", source: "All Platforms" },
  { date: "Jan 15, 2026", amount: 268.3, status: "paid", source: "All Platforms" },
  { date: "Dec 15, 2025", amount: 245.0, status: "paid", source: "All Platforms" },
  { date: "Nov 15, 2025", amount: 220.8, status: "paid", source: "All Platforms" },
  { date: "Oct 15, 2025", amount: 198.55, status: "paid", source: "All Platforms" },
];

export default function EarningsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Earnings</h1>
            <p className="text-sm text-gray-500">Track royalties, payments &amp; revenue across all platforms</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <Calendar size={14} className="text-gray-400" />
              <select className="text-sm bg-transparent focus:outline-none">
                <option>Last 12 months</option>
                <option>Last 6 months</option>
                <option>Last 3 months</option>
                <option>This year</option>
              </select>
            </div>
            <button className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              <FileText size={16} />
              Export Tax Report
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Lifetime Earnings", value: "$2,847.60", icon: DollarSign, color: "bg-green-50 text-green-600", sub: "Since Apr 2025" },
              { label: "This Month", value: "$312.45", icon: CreditCard, color: "bg-blue-50 text-blue-600", sub: "+7.7% vs last month" },
              { label: "Projected Monthly", value: "$385.00", icon: TrendingUp, color: "bg-purple-50 text-purple-600", sub: "Based on growth rate" },
              { label: "Avg Per Stream", value: "$0.0035", icon: BarChart3, color: "bg-orange-50 text-orange-600", sub: "Across all platforms" },
            ].map((m) => (
              <div key={m.label} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${m.color}`}>
                    <m.icon size={18} />
                  </div>
                </div>
                <div className="text-2xl font-bold">{m.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{m.label}</div>
                <div className="text-xs text-gray-400 mt-1">{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Monthly Earnings Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-lg mb-1">Monthly Earnings</h2>
            <p className="text-sm text-gray-500 mb-6">Revenue trend over the last 12 months</p>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={monthlyEarnings}>
                <defs>
                  <linearGradient id="egEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00c878" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00c878" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, "Earnings"]}
                />
                <Area type="monotone" dataKey="earnings" stroke="#00c878" strokeWidth={2.5} fill="url(#egEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Platform Breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-5">Platform Breakdown</h2>
              <div className="space-y-3">
                {platformBreakdown.map((p) => (
                  <div key={p.platform} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{p.platform}</span>
                        <span className="text-sm font-semibold">${p.earned.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${p.pct}%`, backgroundColor: p.color }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 w-12 text-right">{p.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Per Stream Comparison */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-1">Revenue Per Stream</h2>
              <p className="text-sm text-gray-500 mb-5">Comparison across platforms</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={revenuePerStream} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="platform"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#374151" }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }}
                    formatter={(value) => [`$${Number(value).toFixed(4)}`, "Per Stream"]}
                  />
                  <Bar dataKey="rps" radius={[0, 6, 6, 0]} barSize={28}>
                    {revenuePerStream.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per-Release Earnings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-lg mb-5">Per-Release Earnings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Release</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium text-right">Total Earned</th>
                    <th className="pb-3 font-medium text-right">This Month</th>
                    <th className="pb-3 font-medium text-right">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {releaseEarnings.map((r) => (
                    <tr key={r.title} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                            <Music2 size={14} className="text-white" />
                          </div>
                          <span className="font-medium text-sm">{r.title}</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{r.type}</span>
                      </td>
                      <td className="py-3.5 text-right font-semibold text-sm">${r.totalEarned.toFixed(2)}</td>
                      <td className="py-3.5 text-right text-sm text-gray-600">${r.thisMonth.toFixed(2)}</td>
                      <td className="py-3.5 text-right">
                        <span className={`text-xs font-medium flex items-center justify-end gap-0.5 ${r.up ? "text-green-600" : "text-red-500"}`}>
                          {r.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {r.trend}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Payment History */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-5">Payment History</h2>
              <div className="space-y-4">
                {paymentHistory.map((p, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        p.status === "paid" ? "bg-green-50" : "bg-yellow-50"
                      }`}>
                        {p.status === "paid" ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          <Clock size={16} className="text-yellow-500" />
                        )}
                      </div>
                      {i < paymentHistory.length - 1 && (
                        <div className="w-px h-6 bg-gray-200 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">${p.amount.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{p.date} &middot; {p.source}</div>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        p.status === "paid"
                          ? "bg-green-50 text-green-600"
                          : "bg-yellow-50 text-yellow-600"
                      }`}>
                        {p.status === "paid" ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tax Summary & Projections */}
            <div className="space-y-6">
              {/* Tax Summary */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={18} className="text-gray-700" />
                  <h2 className="font-bold text-lg">Tax Summary</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-600">YTD Earnings (2026)</span>
                    <span className="font-semibold text-sm">$870.75</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-600">Estimated Tax Liability</span>
                    <span className="font-semibold text-sm text-orange-600">$191.57</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-gray-600">Tax Rate (est.)</span>
                    <span className="font-semibold text-sm">22%</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2.5">
                  <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-amber-800">1099-MISC Reminder</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      If you earn over $600 this year, you&apos;ll receive a 1099-MISC from your distributor. Set aside estimated taxes quarterly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Projections */}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={18} />
                  <h2 className="font-bold text-lg">Projections</h2>
                </div>
                <p className="text-purple-100 text-sm mb-4">Based on your current growth trajectory</p>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-3">
                  <div className="text-3xl font-bold">$4,200</div>
                  <div className="text-sm text-purple-200 mt-1">Projected 2026 annual earnings</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-lg font-bold">$385</div>
                    <div className="text-xs text-purple-200">Projected next month</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-lg font-bold">+7.7%</div>
                    <div className="text-xs text-purple-200">Monthly growth rate</div>
                  </div>
                </div>
                <p className="text-xs text-purple-200 mt-4">
                  At current growth rate, you&apos;ll earn $4,200 in 2026 -- up 47% from last year.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
