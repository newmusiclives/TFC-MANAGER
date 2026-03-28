"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  RefreshCw,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Music2,
  MapPin,
  ListMusic,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Target,
  Lightbulb,
  ChevronRight,
  BarChart3,
  Disc3,
  Heart,
  Play,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const yourPosition = {
  you: { listeners: "18.2K", streams: "128.5K", saveRate: "24.3%", releases: 12 },
  average: { listeners: "22.1K", streams: "156K", saveRate: "19.8%", releases: 15 },
};

const similarArtists = [
  {
    name: "Nova Klein",
    listeners: "24.8K",
    growth: "+12%",
    streams: "186K",
    location: "Berlin",
    genre: "Indie Electronic",
    playlistGap: ["Fresh Finds", "Indie Electronic Mix", "Berlin Beats"],
    recentMove: "Released remix on Wednesday, got 4 new playlist adds",
    highlight: "remix-strategy",
  },
  {
    name: "Suki Ray",
    listeners: "22.8K",
    growth: "+8%",
    streams: "164K",
    location: "London",
    genre: "Dream Pop",
    playlistGap: ["Fresh Finds", "Dream Pop Essentials"],
    recentMove: "Got editorial placement this month — Spotify's 'Fresh Finds'",
    highlight: "editorial",
  },
  {
    name: "Davi Lux",
    listeners: "15.6K",
    growth: "+62%",
    streams: "98K",
    location: "São Paulo",
    genre: "Synth Pop",
    playlistGap: ["Synth Pop Rising"],
    recentMove: "Viral TikTok moment — 15-second hook challenge (+62% growth)",
    highlight: "viral",
  },
  {
    name: "Emi Sato",
    listeners: "18.1K",
    growth: "+5%",
    streams: "142K",
    location: "Tokyo",
    genre: "Indie Pop",
    playlistGap: ["Indie Pop Chill", "Tokyo Nights"],
    recentMove: "Consistent release schedule — new single every 5 weeks",
    highlight: "consistency",
  },
  {
    name: "Marco Ven",
    listeners: "11.4K",
    growth: "+18%",
    streams: "72K",
    location: "Amsterdam",
    genre: "Electronic",
    playlistGap: ["Late Night Synths", "Electronic Focus"],
    recentMove: "Strong sync licensing strategy — 3 placements this quarter",
    highlight: "sync",
  },
];

const playlistGapAnalysis = [
  {
    name: "Fresh Finds",
    competitors: ["Nova Klein", "Suki Ray"],
    yourStatus: "not-on",
    action: "Generate Pitch",
  },
  {
    name: "Indie Chill Vibes",
    competitors: ["Emi Sato", "Davi Lux"],
    yourStatus: "active",
    action: null,
  },
  {
    name: "Late Night Synths",
    competitors: ["Marco Ven"],
    yourStatus: "not-on",
    action: "Generate Pitch",
  },
  {
    name: "Indie Electronic Mix",
    competitors: ["Nova Klein"],
    yourStatus: "not-on",
    action: "Generate Pitch",
  },
  {
    name: "Berlin Beats",
    competitors: ["Nova Klein"],
    yourStatus: "not-on",
    action: "Generate Pitch",
  },
  {
    name: "Dream Pop Essentials",
    competitors: ["Suki Ray", "Emi Sato"],
    yourStatus: "not-on",
    action: "Generate Pitch",
  },
  {
    name: "Synth Pop Rising",
    competitors: ["Davi Lux", "Marco Ven"],
    yourStatus: "active",
    action: null,
  },
];

const strategyInsights = [
  {
    icon: Disc3,
    color: "text-purple-600",
    bg: "bg-purple-50",
    text: "Nova Klein's remix strategy is working — her remixes get 40% more playlist adds than originals. Consider this for 'Midnight Dreams'.",
  },
  {
    icon: Target,
    color: "text-blue-600",
    bg: "bg-blue-50",
    text: "Suki Ray's editorial pitch was submitted 21 days before release with press coverage attached. Your typical lead time is 14 days — extend to 21+ for Golden Hour.",
  },
  {
    icon: Zap,
    color: "text-orange-600",
    bg: "bg-orange-50",
    text: "Davi Lux's TikTok growth came from a 15-second hook challenge. Your track 'Golden Hour' has a strong hook at 0:45 — consider creating a similar challenge.",
  },
];

const growthData = [
  { month: "Oct", you: 12400, novaKlein: 16200, sukiRay: 18400, daviLux: 6800 },
  { month: "Nov", you: 13100, novaKlein: 17800, sukiRay: 19200, daviLux: 7900 },
  { month: "Dec", you: 14800, novaKlein: 19400, sukiRay: 20100, daviLux: 9200 },
  { month: "Jan", you: 15600, novaKlein: 21200, sukiRay: 21800, daviLux: 10400 },
  { month: "Feb", you: 16900, novaKlein: 22800, sukiRay: 22200, daviLux: 12800 },
  { month: "Mar", you: 18200, novaKlein: 24800, sukiRay: 22800, daviLux: 15600 },
];

const highlightColors: Record<string, string> = {
  "remix-strategy": "border-purple-200 bg-purple-50/30",
  editorial: "border-blue-200 bg-blue-50/30",
  viral: "border-orange-200 bg-orange-50/30",
  consistency: "border-green-200 bg-green-50/30",
  sync: "border-cyan-200 bg-cyan-50/30",
};

export default function CompetitiveIntelPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Your Landscape <BarChart3 size={20} className="text-[var(--primary)]" />
            </h1>
            <p className="text-sm text-gray-500">AI-powered competitive intelligence for your music career</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={12} /> Last updated: 2 hours ago
            </span>
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
              <RefreshCw size={14} /> Refresh Analysis
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Your Position Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
              <Target size={20} className="text-[var(--primary)]" /> Your Position
            </h2>
            <p className="text-sm text-gray-500 mb-5">How you compare to similar artists in your genre</p>

            <div className="grid grid-cols-4 gap-4 mb-5">
              {[
                { label: "Monthly Listeners", you: yourPosition.you.listeners, avg: yourPosition.average.listeners, youBetter: false },
                { label: "Total Streams", you: yourPosition.you.streams, avg: yourPosition.average.streams, youBetter: false },
                { label: "Save Rate", you: yourPosition.you.saveRate, avg: yourPosition.average.saveRate, youBetter: true },
                { label: "Releases", you: String(yourPosition.you.releases), avg: String(yourPosition.average.releases), youBetter: false },
              ].map((metric) => (
                <div key={metric.label} className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs text-gray-500 mb-2">{metric.label}</div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xs text-gray-400 mb-0.5">You</div>
                      <div className={`text-lg font-bold ${metric.youBetter ? "text-green-600" : "text-gray-900"}`}>
                        {metric.you}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-0.5">Avg</div>
                      <div className={`text-lg font-bold ${!metric.youBetter ? "text-green-600" : "text-gray-400"}`}>
                        {metric.avg}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    {metric.youBetter ? (
                      <span className="text-xs text-green-600 flex items-center gap-0.5">
                        <ArrowUpRight size={12} /> Above avg
                      </span>
                    ) : (
                      <span className="text-xs text-orange-500 flex items-center gap-0.5">
                        <ArrowDownRight size={12} /> Below avg
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-2">
                <Sparkles size={16} className="text-purple-600 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Verdict:</span> You&apos;re below average on reach but above average on engagement — your fans are more loyal. Focus on discovery channels to grow listeners while maintaining your strong save rate.
                </p>
              </div>
            </div>
          </div>

          {/* Similar Artists */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
              <Users size={20} className="text-indigo-500" /> Similar Artists
            </h2>
            <p className="text-sm text-gray-500 mb-5">Auto-detected from your sound, genre, and audience overlap</p>

            <div className="space-y-4">
              {similarArtists.map((artist) => (
                <div
                  key={artist.name}
                  className={`rounded-xl border p-5 transition-all hover:shadow-md ${highlightColors[artist.highlight] || "border-gray-100"}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base">{artist.name}</h3>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{artist.genre}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin size={11} /> {artist.location}</span>
                        <span className="flex items-center gap-1"><Play size={11} /> {artist.streams} streams</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{artist.listeners}</div>
                      <div className="text-xs text-green-600 font-medium flex items-center justify-end gap-0.5">
                        <TrendingUp size={12} /> {artist.growth} this week
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mb-3 bg-white/60 rounded-lg p-3 border border-gray-100/50">
                    <Zap size={14} className="text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-600">{artist.recentMove}</p>
                  </div>

                  {artist.playlistGap.length > 0 && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1.5 font-medium">Playlists they&apos;re on that you&apos;re not:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {artist.playlistGap.map((pl) => (
                          <span key={pl} className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-100">
                            <ListMusic size={10} className="inline mr-1" />
                            {pl}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Playlist Gap Analysis */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
              <ListMusic size={20} className="text-green-600" /> Playlist Gap Analysis
            </h2>
            <p className="text-sm text-gray-500 mb-5">Playlists your competitors are on vs. you</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Playlist</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Competitors On It</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Your Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {playlistGapAnalysis.map((pl) => (
                    <tr key={pl.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Music2 size={14} className="text-gray-400" />
                          <span className="font-medium">{pl.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {pl.competitors.map((c) => (
                            <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {pl.yourStatus === "active" ? (
                          <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium border border-green-100">
                            Active
                          </span>
                        ) : (
                          <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-medium border border-red-100">
                            Not on it
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {pl.action ? (
                          <button className="text-xs bg-[var(--primary)] text-white px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-1 ml-auto">
                            <Sparkles size={11} /> {pl.action}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategy Insights */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
              <Lightbulb size={20} className="text-amber-500" /> Strategy Insights
            </h2>
            <p className="text-sm text-gray-500 mb-5">AI-generated recommendations based on competitor analysis</p>

            <div className="space-y-3">
              {strategyInsights.map((insight, idx) => {
                const Icon = insight.icon;
                return (
                  <div key={idx} className={`${insight.bg} rounded-xl p-4 border border-gray-100`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                        <Icon size={16} className={insight.color} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 leading-relaxed">{insight.text}</p>
                        <button className="mt-2 text-xs text-[var(--primary)] font-medium flex items-center gap-1 hover:underline">
                          Take Action <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Growth Comparison Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
              <TrendingUp size={20} className="text-green-600" /> Growth Comparison
            </h2>
            <p className="text-sm text-gray-500 mb-5">Monthly listeners over the past 6 months — you vs. top 3 competitors</p>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#999" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#999" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    formatter={(value) => [`${(Number(value) / 1000).toFixed(1)}K`, ""]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line type="monotone" dataKey="you" name="You" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="novaKlein" name="Nova Klein" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="sukiRay" name="Suki Ray" stroke="#ec4899" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="daviLux" name="Davi Lux" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
