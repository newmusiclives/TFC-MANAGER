"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { Bell, Radar, TrendingUp, Music2, Users, Tv, Film, Gamepad2, ArrowUpRight, ExternalLink, Sparkles, Flame, Clock, Target } from "lucide-react";

const trendingSounds = [
  { name: "Lo-fi Synth Washes", platform: "TikTok", growth: "+340%", uses: "12.4K", relevance: 92, genre: "Electronic" },
  { name: "Acoustic Guitar + 808s", platform: "Instagram Reels", growth: "+180%", uses: "8.7K", relevance: 78, genre: "Indie Pop" },
  { name: "Slowed + Reverb Vocals", platform: "TikTok", growth: "+520%", uses: "24.1K", relevance: 85, genre: "Pop" },
  { name: "Jazz Chords on Synths", platform: "YouTube Shorts", growth: "+210%", uses: "5.2K", relevance: 88, genre: "Electronic" },
  { name: "Whisper Vocals Trend", platform: "TikTok", growth: "+150%", uses: "6.8K", relevance: 71, genre: "Indie" },
];

const risingArtists = [
  { name: "Nova Klein", genre: "Indie Electronic", listeners: "14.2K", growth: "+45%", location: "Berlin", compatibility: 91 },
  { name: "Suki Ray", genre: "Dream Pop", listeners: "22.8K", growth: "+38%", location: "London", compatibility: 87 },
  { name: "Davi Lux", genre: "Synth Pop", listeners: "9.6K", growth: "+62%", location: "São Paulo", compatibility: 84 },
  { name: "Emi Sato", genre: "Indie Pop", listeners: "18.1K", growth: "+29%", location: "Tokyo", compatibility: 79 },
  { name: "Marco Ven", genre: "Electronic / Ambient", listeners: "11.4K", growth: "+51%", location: "Amsterdam", compatibility: 76 },
];

const syncOpportunities = [
  { title: "Nike — Spring Campaign", type: "Commercial", budget: "$5K-15K", genre: "Upbeat Electronic/Pop", deadline: "Apr 10, 2026", match: 88 },
  { title: "Netflix — Indie Drama Series", type: "TV Show", budget: "$2K-8K", genre: "Atmospheric Indie", deadline: "Apr 25, 2026", match: 82 },
  { title: "EA Sports FC 27 — Soundtrack", type: "Video Game", budget: "$3K-10K", genre: "Electronic/Indie Pop", deadline: "May 15, 2026", match: 79 },
  { title: "Apple — Product Launch", type: "Commercial", budget: "$10K-50K", genre: "Minimal Electronic", deadline: "May 1, 2026", match: 74 },
];

const playlistCurators = [
  { name: "Chill Electronic Vibes", curator: "@electronica_daily", followers: "48.2K", genre: "Electronic", accepting: true, successRate: 34 },
  { name: "Indie Discoveries", curator: "@indie_finds", followers: "122K", genre: "Indie Pop", accepting: true, successRate: 18 },
  { name: "Late Night Synths", curator: "@synthwave_nights", followers: "31.5K", genre: "Synth/Electronic", accepting: true, successRate: 42 },
  { name: "Fresh Vocals", curator: "@vocal_spotlight", followers: "67.8K", genre: "Pop/Indie", accepting: false, successRate: 22 },
];

export default function TrendsRadarPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">Trends Radar <Radar size={20} className="text-[var(--primary)]" /></h1>
            <p className="text-sm text-gray-500">Industry intelligence tailored to your genre</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> Updated 2 hours ago</span>
            <button className="relative p-2 text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
          </div>
        </div>

        <div className="p-8">
          {/* Trending sounds */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-lg mb-1 flex items-center gap-2"><Flame size={20} className="text-orange-500" /> Trending Sounds</h2>
            <p className="text-sm text-gray-500 mb-4">Hot audio trends on social platforms right now</p>
            <div className="space-y-3">
              {trendingSounds.map((t, idx) => (
                <div key={t.name} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <span className="text-lg font-bold text-gray-200 w-6">{idx + 1}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full">{t.platform}</span>
                      <span>{t.genre}</span>
                      <span>{t.uses} uses</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600 flex items-center gap-0.5"><ArrowUpRight size={14} />{t.growth}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-gray-400">Match:</span>
                      <div className="w-12 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[var(--primary)] h-1.5 rounded-full" style={{ width: `${t.relevance}%` }} />
                      </div>
                      <span className="text-xs font-bold text-[var(--primary)]">{t.relevance}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Rising artists */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-1 flex items-center gap-2"><Users size={20} className="text-purple-600" /> Rising Artists to Watch</h2>
              <p className="text-sm text-gray-500 mb-4">Potential collaborators in your orbit</p>
              <div className="space-y-3">
                {risingArtists.map((a) => (
                  <div key={a.name} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">
                      {a.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{a.name}</div>
                      <div className="text-xs text-gray-500">{a.genre} &bull; {a.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{a.listeners} listeners</div>
                      <div className="text-xs text-green-600 font-medium">{a.growth}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Compatibility</div>
                      <div className="text-sm font-bold text-[var(--primary)]">{a.compatibility}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Playlist curators */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-1 flex items-center gap-2"><Music2 size={20} className="text-[var(--primary)]" /> Playlist Curators</h2>
              <p className="text-sm text-gray-500 mb-4">Active curators accepting submissions</p>
              <div className="space-y-3">
                {playlistCurators.map((c) => (
                  <div key={c.name} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-medium text-sm">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.curator} &bull; {c.followers} followers</div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.accepting ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                        {c.accepting ? "Accepting" : "Closed"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Genre: {c.genre}</span>
                      <span className="text-gray-500">Success rate: <strong className="text-gray-700">{c.successRate}%</strong></span>
                    </div>
                    {c.accepting && (
                      <button className="w-full mt-2 text-xs bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] font-medium py-2 rounded-lg transition-colors">
                        Generate Pitch
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sync opportunities */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-1 flex items-center gap-2"><Target size={20} className="text-amber-500" /> Sync Opportunities</h2>
            <p className="text-sm text-gray-500 mb-4">Brands, shows, and games looking for music like yours</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {syncOpportunities.map((s) => (
                <div key={s.title} className="border border-gray-100 rounded-xl p-5 hover:border-[var(--primary)]/30 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    {s.type === "Commercial" && <Tv size={16} className="text-blue-500" />}
                    {s.type === "TV Show" && <Film size={16} className="text-purple-500" />}
                    {s.type === "Video Game" && <Gamepad2 size={16} className="text-green-500" />}
                    <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s.type}</span>
                    <span className="text-xs text-[var(--primary)] font-bold ml-auto">{s.match}% match</span>
                  </div>
                  <h3 className="font-bold mb-1">{s.title}</h3>
                  <div className="text-xs text-gray-500 space-y-0.5">
                    <p>Looking for: {s.genre}</p>
                    <p>Budget: <strong className="text-gray-700">{s.budget}</strong></p>
                    <p>Deadline: {s.deadline}</p>
                  </div>
                  <button className="w-full mt-3 text-xs bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium py-2.5 rounded-lg transition-colors inline-flex items-center justify-center gap-1">
                    <Sparkles size={12} /> Generate Submission
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
