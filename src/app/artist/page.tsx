"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Search,
  Music2,
  Globe,
  MapPin,
  Calendar,
  Edit3,
  ExternalLink,
  Play,
  Users,
  TrendingUp,
  Share2,
  Heart,
  Disc3,
  Mic2,
  Award,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const monthlyListeners = [
  { name: "Jul", value: 8200 },
  { name: "Aug", value: 9100 },
  { name: "Sep", value: 10800 },
  { name: "Oct", value: 11500 },
  { name: "Nov", value: 14200 },
  { name: "Dec", value: 18200 },
];

const discography = [
  {
    title: "Midnight Dreams",
    type: "Single",
    date: "Dec 15, 2025",
    streams: "22.1K",
  },
  {
    title: "Electric Feel",
    type: "Single",
    date: "Oct 3, 2025",
    streams: "18.3K",
  },
  {
    title: "Summer Waves EP",
    type: "EP",
    date: "Jul 20, 2025",
    streams: "45.7K",
  },
  {
    title: "Neon Lights",
    type: "Single",
    date: "Apr 5, 2025",
    streams: "9.4K",
  },
  {
    title: "First Light",
    type: "Album",
    date: "Jan 12, 2025",
    streams: "67.2K",
  },
];

const genres = ["Pop", "Electronic", "Indie"];
const links = [
  { label: "Spotify", url: "#" },
  { label: "Apple Music", url: "#" },
  { label: "YouTube", url: "#" },
  { label: "SoundCloud", url: "#" },
];

const achievements = [
  { label: "Top 50 in Indie charts", icon: Award },
  { label: "10K+ Spotify followers", icon: Users },
  { label: "Featured on 25 playlists", icon: Disc3 },
  { label: "3 sold-out shows", icon: Mic2 },
];

export default function ArtistPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Artist Profile</h1>
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
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-9 h-9 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold text-sm">
              JD
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Profile hero */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8">
            {/* Banner */}
            <div className="h-48 bg-gradient-to-r from-[var(--primary)] via-emerald-400 to-teal-500 relative">
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
            <div className="px-8 pb-8 relative">
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16">
                <div className="w-32 h-32 bg-gray-200 border-4 border-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Music2 size={48} className="text-gray-400" />
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Jordan Davis</h2>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> Los Angeles, CA
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> Joined Jan 2025
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {genres.map((g) => (
                          <span
                            key={g}
                            className="bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold px-3 py-1 rounded-full"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-4 py-2 rounded-lg transition-colors">
                      <Edit3 size={16} /> Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-gray-600 text-sm leading-relaxed max-w-3xl">
                Independent artist blending pop, electronic, and indie
                influences. Creating music that connects hearts and moves feet.
                Currently working on a new EP set to release in Spring 2026.
              </p>

              {/* Platform links */}
              <div className="flex flex-wrap gap-3 mt-5">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.url}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Globe size={14} /> {l.label}{" "}
                    <ExternalLink size={12} className="text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Streams",
                value: "128.5K",
                icon: Play,
                color: "text-blue-600 bg-blue-50",
              },
              {
                label: "Monthly Listeners",
                value: "18.2K",
                icon: Users,
                color: "text-purple-600 bg-purple-50",
              },
              {
                label: "Followers",
                value: "4.8K",
                icon: Heart,
                color: "text-pink-600 bg-pink-50",
              },
              {
                label: "Growth",
                value: "+23.5%",
                icon: TrendingUp,
                color: "text-green-600 bg-green-50",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-xl p-5 border border-gray-100"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}
                >
                  <s.icon size={18} />
                </div>
                <div className="text-xl font-bold">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Listeners chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-6">
                Monthly Listeners Trend
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={monthlyListeners}>
                  <defs>
                    <linearGradient
                      id="listenerGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                      <stop
                        offset="95%"
                        stopColor="#7c3aed"
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
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#7c3aed"
                    strokeWidth={2.5}
                    fill="url(#listenerGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-6">Achievements</h3>
              <div className="space-y-4">
                {achievements.map((a) => (
                  <div key={a.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                      <a.icon size={18} className="text-amber-500" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {a.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-sm mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button className="w-full text-left flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--primary)] py-2 transition-colors">
                    <Share2 size={16} /> Share artist profile
                  </button>
                  <button className="w-full text-left flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--primary)] py-2 transition-colors">
                    <Globe size={16} /> View public website
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Discography */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Discography</h3>
              <button className="text-sm text-[var(--primary)] hover:underline font-medium">
                + Add Release
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3 font-medium">Title</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Release Date</th>
                    <th className="pb-3 font-medium text-right">
                      Total Streams
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {discography.map((d) => (
                    <tr
                      key={d.title}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Music2 size={16} className="text-gray-400" />
                          </div>
                          <span className="font-medium text-sm">{d.title}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            d.type === "Album"
                              ? "bg-purple-50 text-purple-600"
                              : d.type === "EP"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {d.type}
                        </span>
                      </td>
                      <td className="text-sm text-gray-500">{d.date}</td>
                      <td className="text-sm font-medium text-right">
                        {d.streams}
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
