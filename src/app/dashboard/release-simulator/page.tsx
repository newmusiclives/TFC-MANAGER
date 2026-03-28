"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { Bell, FlaskConical, Play, Users, DollarSign, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight, Zap, BarChart3, Target, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useMemo } from "react";

export default function ReleaseSimulatorPage() {
  const [releaseDay, setReleaseDay] = useState("friday");
  const [marketingBudget, setMarketingBudget] = useState(150);
  const [prePromoWeeks, setPrePromoWeeks] = useState(3);
  const [hasPlaylistPitch, setHasPlaylistPitch] = useState(true);
  const [hasPressPitch, setHasPressPitch] = useState(true);
  const [hasMusicVideo, setHasMusicVideo] = useState(false);

  const simulation = useMemo(() => {
    let baseStreams = 3200;
    const dayMultiplier: Record<string, number> = { friday: 1.0, thursday: 0.88, wednesday: 0.75, saturday: 0.82, monday: 0.65 };
    baseStreams *= dayMultiplier[releaseDay] || 1;
    baseStreams += marketingBudget * 8;
    baseStreams += prePromoWeeks * 420;
    if (hasPlaylistPitch) baseStreams *= 1.35;
    if (hasPressPitch) baseStreams *= 1.15;
    if (hasMusicVideo) baseStreams *= 1.45;

    const weeklyDecay = 0.82;
    const projectedWeeks = Array.from({ length: 12 }, (_, i) => {
      const weekStreams = Math.round(baseStreams * Math.pow(weeklyDecay, i) * (1 + Math.random() * 0.1));
      return { week: `W${i + 1}`, streams: weekStreams };
    });
    const totalStreams = projectedWeeks.reduce((a, w) => a + w.streams, 0);
    const peakWeek = projectedWeeks[0].streams;
    const avgRate = 0.0035;
    const revenue = Math.round(totalStreams * avgRate * 100) / 100;
    const newListeners = Math.round(totalStreams * 0.42);
    const playlistProb = hasPlaylistPitch ? Math.min(78, 35 + prePromoWeeks * 8 + (marketingBudget > 100 ? 15 : 0)) : 12;

    return { projectedWeeks, totalStreams, peakWeek, revenue, newListeners, playlistProb };
  }, [releaseDay, marketingBudget, prePromoWeeks, hasPlaylistPitch, hasPressPitch, hasMusicVideo]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Release Simulator <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">BETA</span>
            </h1>
            <p className="text-sm text-gray-500">Predict your release performance before going live</p>
          </div>
          <button className="relative p-2 text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
                  <FlaskConical size={16} className="text-purple-600" /> Simulation Parameters
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Release Day</label>
                    <select value={releaseDay} onChange={(e) => setReleaseDay(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20">
                      <option value="friday">Friday (Recommended)</option>
                      <option value="thursday">Thursday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="saturday">Saturday</option>
                      <option value="monday">Monday</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
                      <span>Marketing Budget</span>
                      <span className="text-purple-600">${marketingBudget}</span>
                    </label>
                    <input type="range" min={0} max={500} step={25} value={marketingBudget} onChange={(e) => setMarketingBudget(Number(e.target.value))} className="w-full accent-purple-600" />
                    <div className="flex justify-between text-xs text-gray-400"><span>$0</span><span>$500</span></div>
                  </div>
                  <div>
                    <label className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
                      <span>Pre-Promo Weeks</span>
                      <span className="text-purple-600">{prePromoWeeks} weeks</span>
                    </label>
                    <input type="range" min={0} max={6} step={1} value={prePromoWeeks} onChange={(e) => setPrePromoWeeks(Number(e.target.value))} className="w-full accent-purple-600" />
                    <div className="flex justify-between text-xs text-gray-400"><span>0</span><span>6 weeks</span></div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={hasPlaylistPitch} onChange={(e) => setHasPlaylistPitch(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                      <div>
                        <span className="text-sm font-medium">Playlist Pitching</span>
                        <p className="text-xs text-gray-400">Submit to Spotify editorial + indie curators</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={hasPressPitch} onChange={(e) => setHasPressPitch(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                      <div>
                        <span className="text-sm font-medium">Press Outreach</span>
                        <p className="text-xs text-gray-400">Send to blogs, radio, and media outlets</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={hasMusicVideo} onChange={(e) => setHasMusicVideo(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                      <div>
                        <span className="text-sm font-medium">Music Video</span>
                        <p className="text-xs text-gray-400">Release with official video on YouTube</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Target size={16} /> Playlist Probability</h3>
                <div className="text-4xl font-extrabold mb-1">{simulation.playlistProb}%</div>
                <p className="text-sm text-purple-200">Chance of editorial playlist placement</p>
                <div className="bg-white/20 rounded-full h-2 mt-3">
                  <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: `${simulation.playlistProb}%` }} />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Prediction cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Est. 12-Week Streams", value: simulation.totalStreams.toLocaleString(), icon: Play, color: "bg-blue-50 text-blue-600" },
                  { label: "Peak Week Streams", value: simulation.peakWeek.toLocaleString(), icon: TrendingUp, color: "bg-green-50 text-green-600" },
                  { label: "New Listeners", value: simulation.newListeners.toLocaleString(), icon: Users, color: "bg-purple-50 text-purple-600" },
                  { label: "Est. Revenue", value: `$${simulation.revenue.toFixed(2)}`, icon: DollarSign, color: "bg-amber-50 text-amber-600" },
                ].map((c) => (
                  <div key={c.label} className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${c.color}`}>
                      <c.icon size={16} />
                    </div>
                    <div className="text-xl font-bold">{c.value}</div>
                    <div className="text-xs text-gray-500">{c.label}</div>
                  </div>
                ))}
              </div>

              {/* Projection chart */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-lg mb-1">Stream Projection</h2>
                <p className="text-sm text-gray-500 mb-6">Estimated weekly streams over 12 weeks</p>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={simulation.projectedWeeks}>
                    <defs>
                      <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
                    <Area type="monotone" dataKey="streams" stroke="#7c3aed" strokeWidth={2.5} fill="url(#simGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Insights */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Zap size={20} className="text-purple-600" /> AI Insights</h2>
                <div className="space-y-3">
                  {[
                    { text: `Releasing on ${releaseDay.charAt(0).toUpperCase() + releaseDay.slice(1)} is ${releaseDay === "friday" ? "optimal" : "suboptimal"} — Friday releases get 18% more first-week streams on average for your audience.`, positive: releaseDay === "friday" },
                    { text: `Your $${marketingBudget} ad budget is projected to generate ~${(marketingBudget * 8).toLocaleString()} additional streams. ${marketingBudget < 100 ? "Consider increasing to $150+ for best ROI." : "Good investment level."}`, positive: marketingBudget >= 100 },
                    { text: `${prePromoWeeks} weeks of pre-promo ${prePromoWeeks >= 3 ? "is a strong lead time" : "may be short — 3+ weeks recommended"} for building anticipation with your 18.2K listener base.`, positive: prePromoWeeks >= 3 },
                    { text: hasMusicVideo ? "Having a music video increases total streams by ~45% over 12 weeks and significantly boosts YouTube algorithmic discovery." : "Adding a music video would increase projected streams by ~45%. Even a lyric video helps.", positive: hasMusicVideo },
                    { text: `Based on your growth rate (+12.8%/mo), you're on track to hit 25K monthly listeners by ${hasMusicVideo ? "June" : "August"} 2026.`, positive: true },
                  ].map((insight, idx) => (
                    <div key={idx} className={`flex items-start gap-3 px-4 py-3 rounded-xl ${insight.positive ? "bg-green-50" : "bg-amber-50"}`}>
                      {insight.positive ? <ArrowUpRight size={16} className="text-green-600 shrink-0 mt-0.5" /> : <ArrowDownRight size={16} className="text-amber-600 shrink-0 mt-0.5" />}
                      <p className={`text-sm ${insight.positive ? "text-green-800" : "text-amber-800"}`}>{insight.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
