"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { Bell, MapPin, Users, Star, Heart, TrendingUp, ArrowUpRight, Globe, Filter, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api-client";

type CityData = {
  city: string; country: string; lat: number; lng: number;
  listeners: number; superfans: number; growth: string; intensity: number;
};
type SuperfanData = {
  name: string; city: string; score: number; saves: number;
  shares: number; streams: number; lastActive: string;
};

const defaultCities: CityData[] = [
  { city: "Los Angeles", country: "US", lat: 34, lng: -118, listeners: 2840, superfans: 42, growth: "+18%", intensity: 95 },
  { city: "Paris", country: "FR", lat: 48.8, lng: 2.3, listeners: 1920, superfans: 28, growth: "+24%", intensity: 80 },
  { city: "London", country: "UK", lat: 51.5, lng: -0.1, listeners: 1640, superfans: 22, growth: "+12%", intensity: 72 },
  { city: "New York", country: "US", lat: 40.7, lng: -74, listeners: 1380, superfans: 19, growth: "+15%", intensity: 65 },
  { city: "Berlin", country: "DE", lat: 52.5, lng: 13.4, listeners: 980, superfans: 14, growth: "+31%", intensity: 52 },
  { city: "Toronto", country: "CA", lat: 43.7, lng: -79.4, listeners: 820, superfans: 11, growth: "+9%", intensity: 44 },
  { city: "Sydney", country: "AU", lat: -33.9, lng: 151.2, listeners: 640, superfans: 8, growth: "+22%", intensity: 36 },
  { city: "S\u00e3o Paulo", country: "BR", lat: -23.5, lng: -46.6, listeners: 580, superfans: 7, growth: "+45%", intensity: 32 },
  { city: "Tokyo", country: "JP", lat: 35.7, lng: 139.7, listeners: 420, superfans: 5, growth: "+38%", intensity: 24 },
  { city: "Mexico City", country: "MX", lat: 19.4, lng: -99.1, listeners: 380, superfans: 4, growth: "+52%", intensity: 20 },
];

const defaultSuperfans: SuperfanData[] = [
  { name: "Alex M.", city: "Los Angeles", score: 98, saves: 47, shares: 23, streams: 312, lastActive: "2 hours ago" },
  { name: "Marie L.", city: "Paris", score: 96, saves: 41, shares: 19, streams: 289, lastActive: "4 hours ago" },
  { name: "James K.", city: "London", score: 94, saves: 38, shares: 31, streams: 267, lastActive: "1 hour ago" },
  { name: "Sarah T.", city: "New York", score: 91, saves: 35, shares: 15, streams: 245, lastActive: "6 hours ago" },
  { name: "Lukas B.", city: "Berlin", score: 89, saves: 33, shares: 28, streams: 221, lastActive: "3 hours ago" },
  { name: "Emma R.", city: "Toronto", score: 87, saves: 29, shares: 12, streams: 198, lastActive: "8 hours ago" },
  { name: "Yuki S.", city: "Tokyo", score: 85, saves: 27, shares: 17, streams: 186, lastActive: "5 hours ago" },
  { name: "Pedro C.", city: "S\u00e3o Paulo", score: 82, saves: 24, shares: 22, streams: 174, lastActive: "12 hours ago" },
];

const defaultStats = {
  citiesReached: "48", countries: "23", superfansCount: "160", avgEngagement: "24.3%",
};

const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  activity: Math.round(
    (i >= 8 && i <= 10 ? 60 : i >= 18 && i <= 22 ? 90 : i >= 12 && i <= 14 ? 45 : i >= 0 && i <= 5 ? 15 : 35) +
    Math.random() * 20
  ),
}));

export default function FanHeatmapPage() {
  const [cities, setCities] = useState<CityData[]>(defaultCities);
  const [superfans, setSuperfans] = useState<SuperfanData[]>(defaultSuperfans);
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ cities: CityData[]; superfans: SuperfanData[]; stats: typeof defaultStats }>("/api/fan-heatmap")
      .then((d) => {
        if (d.cities) setCities(d.cities);
        if (d.superfans) setSuperfans(d.superfans);
        if (d.stats) setStats({
          citiesReached: String(d.stats.citiesReached),
          countries: String(d.stats.countries),
          superfansCount: String(d.stats.superfansCount),
          avgEngagement: String(d.stats.avgEngagement),
        });
      })
      .catch(() => {/* keep mock data */})
      .finally(() => setLoading(false));
  }, []);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Fan Heatmap</h1>
            <p className="text-sm text-gray-500">Where your fans are and who your superfans are</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
            </select>
            <button className="relative p-2 text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
          </div>
        </div>

        <div className="p-8">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full" />
            </div>
          )}
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Cities Reached", value: stats.citiesReached, icon: Globe, color: "bg-blue-50 text-blue-600" },
              { label: "Countries", value: stats.countries, icon: MapPin, color: "bg-green-50 text-green-600" },
              { label: "Superfans (Top 1%)", value: stats.superfansCount, icon: Star, color: "bg-amber-50 text-amber-600" },
              { label: "Avg. Engagement", value: stats.avgEngagement, icon: Heart, color: "bg-pink-50 text-pink-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                  <s.icon size={18} />
                </div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Map visualization */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-[var(--primary)]" /> Global Fan Distribution
            </h2>
            <div className="bg-gradient-to-b from-blue-50 to-green-50 rounded-xl relative overflow-hidden border border-gray-200" style={{ height: 420 }}>
              {/* World map SVG with actual continent shapes */}
              <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* Ocean background */}
                <rect width="1000" height="500" fill="#e8f4f8" />
                {/* Grid lines */}
                {[100, 200, 300, 400].map((y) => (
                  <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y} stroke="#d1e3ea" strokeWidth="0.5" />
                ))}
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
                  <line key={`v${x}`} x1={x} y1="0" x2={x} y2="500" stroke="#d1e3ea" strokeWidth="0.5" />
                ))}
                {/* North America */}
                <path d="M 120 80 L 180 60 L 250 70 L 280 100 L 270 140 L 240 160 L 220 200 L 190 230 L 170 250 L 150 240 L 130 200 L 110 180 L 100 140 L 105 110 Z" fill="#c8dfc8" stroke="#9aba9a" strokeWidth="1" />
                <path d="M 170 250 L 200 260 L 210 280 L 190 300 L 170 310 L 160 290 L 155 265 Z" fill="#c8dfc8" stroke="#9aba9a" strokeWidth="1" />
                {/* South America */}
                <path d="M 230 300 L 260 290 L 290 310 L 300 350 L 290 400 L 270 430 L 250 440 L 240 420 L 230 380 L 225 340 Z" fill="#c8dfc8" stroke="#9aba9a" strokeWidth="1" />
                {/* Europe */}
                <path d="M 440 80 L 480 70 L 520 80 L 540 100 L 530 130 L 510 145 L 490 150 L 470 140 L 450 130 L 440 110 Z" fill="#c8dfc8" stroke="#9aba9a" strokeWidth="1" />
                <path d="M 520 80 L 560 75 L 580 90 L 570 110 L 550 120 L 530 130 Z" fill="#c8dfc8" stroke="#9aba9a" strokeWidth="1" />
                {/* Africa */}
                <path d="M 460 170 L 500 160 L 540 170 L 560 200 L 560 250 L 550 300 L 530 340 L 510 360 L 490 350 L 470 310 L 460 260 L 455 220 Z" fill="#c8dfc8" stroke="#9aba9a" strokeWidth="1" />
                {/* Asia */}
                <path d="M 560 60 L 620 50 L 700 55 L 780 70 L 820 90 L 830 130 L 810 160 L 770 180 L 720 190 L 670 180 L 630 160 L 600 140 L 570 120 L 560 90 Z" fill="#c8dfc8" stroke="#9aba9a" strokeWidth="1" />
                <path d="M 630 160 L 660 170 L 680 200 L 670 230 L 640 240 L 620 220 L 615 190 Z" fill="#c8dfc8" stroke="#9aba9a" strokeWidth="1" />
                {/* Southeast Asia / Indonesia */}
                <path d="M 720 190 L 760 200 L 790 220 L 810 230 L 800 250 L 770 240 L 740 230 L 720 210 Z" fill="#c8dfc8" stroke="#9aba9a" strokeWidth="1" />
                {/* Japan */}
                <path d="M 830 100 L 845 90 L 855 100 L 850 130 L 840 140 L 830 125 Z" fill="#c8dfc8" stroke="#9aba9a" strokeWidth="1" />
                {/* Australia */}
                <path d="M 780 320 L 830 310 L 870 320 L 890 350 L 880 380 L 850 400 L 810 400 L 785 380 L 775 350 Z" fill="#c8dfc8" stroke="#9aba9a" strokeWidth="1" />

                {/* City markers */}
                {cities.map((c) => {
                  const cx = ((c.lng + 180) / 360) * 1000;
                  const cy = ((90 - c.lat) / 180) * 500;
                  const r = Math.max(8, c.intensity / 5);
                  return (
                    <g key={c.city}>
                      {/* Glow ring */}
                      <circle cx={cx} cy={cy} r={r + 6} fill="rgba(0,200,120,0.12)" />
                      <circle cx={cx} cy={cy} r={r + 3} fill="rgba(0,200,120,0.2)" />
                      {/* Main dot */}
                      <circle cx={cx} cy={cy} r={r} fill="#00c878" fillOpacity={0.7} stroke="#00c878" strokeWidth="2" />
                      <circle cx={cx} cy={cy} r={3} fill="white" />
                      {/* Label */}
                      <text x={cx} y={cy - r - 8} textAnchor="middle" fontSize="11" fontWeight="600" fill="#374151">{c.city}</text>
                      <text x={cx} y={cy - r + 4} textAnchor="middle" fontSize="9" fill="#6b7280">{c.listeners.toLocaleString()}</text>
                    </g>
                  );
                })}
              </svg>

              {/* Hover tooltips overlay */}
              {cities.map((c) => {
                const x = ((c.lng + 180) / 360) * 100;
                const y = ((90 - c.lat) / 180) * 100;
                return (
                  <div
                    key={`tip-${c.city}`}
                    className="absolute group"
                    style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", width: 40, height: 40 }}
                  >
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-white text-gray-900 text-xs rounded-xl px-4 py-3 whitespace-nowrap z-10 shadow-lg border border-gray-200">
                      <div className="font-bold text-sm">{c.city}, {c.country}</div>
                      <div className="text-gray-600 mt-1">{c.listeners.toLocaleString()} listeners</div>
                      <div className="text-gray-600">{c.superfans} superfans</div>
                      <div className="text-green-600 font-medium">{c.growth} growth</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top cities */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-4">Top Cities</h2>
              <div className="space-y-3">
                {cities.map((c, idx) => (
                  <div key={c.city} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-300 w-5">{idx + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{c.city}, {c.country}</span>
                        <span className="text-sm font-bold">{c.listeners.toLocaleString()}</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[var(--primary)] h-1.5 rounded-full" style={{ width: `${c.intensity}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
                      <ArrowUpRight size={10} />{c.growth}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity heatmap by hour */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-4">Listening Activity by Hour</h2>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={hourlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9ca3af" }} interval={3} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
                  <Bar dataKey="activity" fill="#00c878" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Superfans */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Star size={20} className="text-amber-500" /> Superfans — Top 1%
              </h2>
              <button className="text-sm text-[var(--primary)] hover:underline font-medium flex items-center gap-1">
                <Zap size={14} /> Send exclusive content
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3 font-medium">Fan</th>
                    <th className="pb-3 font-medium">City</th>
                    <th className="pb-3 font-medium">Score</th>
                    <th className="pb-3 font-medium">Streams</th>
                    <th className="pb-3 font-medium">Saves</th>
                    <th className="pb-3 font-medium">Shares</th>
                    <th className="pb-3 font-medium">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {superfans.map((f) => (
                    <tr key={f.name} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-xs font-bold text-amber-600">
                            {f.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="font-medium text-sm">{f.name}</span>
                        </div>
                      </td>
                      <td className="text-sm text-gray-500">{f.city}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 rounded-full h-1.5">
                            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${f.score}%` }} />
                          </div>
                          <span className="text-xs font-bold text-amber-600">{f.score}</span>
                        </div>
                      </td>
                      <td className="text-sm font-medium">{f.streams}</td>
                      <td className="text-sm">{f.saves}</td>
                      <td className="text-sm">{f.shares}</td>
                      <td className="text-xs text-gray-400">{f.lastActive}</td>
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
