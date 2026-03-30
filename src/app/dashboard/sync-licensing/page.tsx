"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Music,
  Tag,
  Tv,
  DollarSign,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Sparkles,
  Film,
  Gamepad2,
  Megaphone,
  Loader2,
  Star,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { apiGet } from "@/lib/api-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Submission = {
  id: string;
  trackTitle: string;
  library: string;
  status: string;
  genre: string;
  mood: string;
  revenue: number;
  submittedAt: string;
  placedAt: string | null;
};

type Opportunity = {
  id: string;
  title: string;
  type: string;
  genre: string;
  budget: string;
  deadline: string;
  description: string;
};

type Tab = "submissions" | "tag" | "opportunities";

// ---------------------------------------------------------------------------
// Status config
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  Submitted: { text: "text-blue-600", bg: "bg-blue-50" },
  "Under Review": { text: "text-yellow-600", bg: "bg-yellow-50" },
  Accepted: { text: "text-green-600", bg: "bg-green-50" },
  Declined: { text: "text-red-500", bg: "bg-red-50" },
  Placed: { text: "text-purple-600", bg: "bg-purple-50" },
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  TV: Tv,
  Film: Film,
  Ad: Megaphone,
  Game: Gamepad2,
};

const GENRES = ["Indie Electronic", "Indie Folk", "Pop", "Alternative", "Synthwave", "Ambient", "Rock", "Hip-Hop", "R&B", "Classical"];
const MOODS = ["Atmospheric", "Warm", "Uplifting", "Melancholic", "Energetic", "Dark", "Dreamy", "Aggressive", "Peaceful", "Playful"];
const INSTRUMENTS = ["Guitar", "Piano", "Synth", "Drums", "Strings", "Brass", "Vocals"];

const HARDCODED_OPPORTUNITIES: Opportunity[] = [
  { id: "ho-1", title: "Netflix Original Series — Looking for atmospheric indie tracks", type: "TV", genre: "Indie / Alternative", budget: "$1,500 - $5,000", deadline: "2026-04-15", description: "Seeking atmospheric indie tracks for a coming-of-age drama series set in the Pacific Northwest." },
  { id: "ho-2", title: "Nike Campaign — High energy pop/electronic", type: "Ad", genre: "Pop / Electronic", budget: "$5,000 - $15,000", deadline: "2026-04-01", description: "Upbeat, energetic tracks for spring athletic campaign targeting Gen Z audience." },
  { id: "ho-3", title: "Indie Film — Gentle acoustic tracks needed", type: "Film", genre: "Folk / Acoustic", budget: "$2,000 - $8,000", deadline: "2026-05-01", description: "Gentle acoustic tracks for award-season indie film about family reconnection." },
  { id: "ho-4", title: "EA Sports Racing Game — Electronic/Rock energy", type: "Game", genre: "Electronic / Rock", budget: "$3,000 - $10,000", deadline: "2026-04-20", description: "High-energy tracks for in-game racing sequences. Needs driving beats and distorted guitars." },
  { id: "ho-5", title: "Apple TV+ Documentary — Ambient soundscapes", type: "TV", genre: "Ambient / Post-Rock", budget: "$2,500 - $7,000", deadline: "2026-04-30", description: "Ethereal, textured soundscapes for nature documentary about ocean ecosystems." },
  { id: "ho-6", title: "Coca-Cola Summer Ad — Feel-good pop vibes", type: "Ad", genre: "Pop / Indie Pop", budget: "$8,000 - $20,000", deadline: "2026-05-10", description: "Bright, summery pop track with whistles, claps, and uplifting energy for global summer campaign." },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SyncLicensingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("submissions");
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Tag form state
  const [tagTitle, setTagTitle] = useState("");
  const [tagGenre, setTagGenre] = useState("");
  const [tagMood, setTagMood] = useState("");
  const [tagTempo, setTagTempo] = useState("120");
  const [tagInstruments, setTagInstruments] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet<{ submissions: Submission[]; stats: { totalRevenue: number } }>("/api/sync-submissions");
      setSubmissions(data.submissions);
      setTotalRevenue(data.stats.totalRevenue);
    } catch {
      // Fallback handled by empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleInstrument = (inst: string) => {
    setTagInstruments((prev) => (prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst]));
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "submissions", label: "My Submissions", icon: Music },
    { key: "tag", label: "Tag My Music", icon: Tag },
    { key: "opportunities", label: "Opportunities", icon: Sparkles },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sync Licensing</h1>
            <p className="text-sm text-gray-500">Submit music for TV, film, ads and games</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Submissions", value: submissions.length.toString(), icon: Send, color: "bg-blue-50 text-blue-600" },
              { label: "Placed", value: submissions.filter((s) => s.status === "Placed").length.toString(), icon: CheckCircle2, color: "bg-green-50 text-green-600" },
              { label: "Under Review", value: submissions.filter((s) => s.status === "Under Review" || s.status === "Submitted").length.toString(), icon: Clock, color: "bg-yellow-50 text-yellow-600" },
              { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-purple-50 text-purple-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><s.icon size={18} /></div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-1.5 mb-6 flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.key ? "bg-purple-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-purple-600" size={32} />
            </div>
          ) : (
            <>
              {/* My Submissions Tab */}
              {activeTab === "submissions" && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                          <th className="text-left p-4 font-medium text-gray-600">Track</th>
                          <th className="text-left p-4 font-medium text-gray-600">Library</th>
                          <th className="text-left p-4 font-medium text-gray-600">Status</th>
                          <th className="text-left p-4 font-medium text-gray-600">Genre</th>
                          <th className="text-left p-4 font-medium text-gray-600">Mood</th>
                          <th className="text-right p-4 font-medium text-gray-600">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map((sub) => {
                          const sc = STATUS_COLORS[sub.status] || { text: "text-gray-600", bg: "bg-gray-50" };
                          return (
                            <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                              <td className="p-4 font-medium">{sub.trackTitle}</td>
                              <td className="p-4 text-gray-600">{sub.library}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>{sub.status}</span>
                              </td>
                              <td className="p-4 text-gray-600">{sub.genre}</td>
                              <td className="p-4 text-gray-600">{sub.mood}</td>
                              <td className="p-4 text-right font-medium">{sub.revenue > 0 ? `$${sub.revenue.toLocaleString()}` : "-"}</td>
                            </tr>
                          );
                        })}
                        {submissions.length === 0 && (
                          <tr><td colSpan={6} className="p-8 text-center text-gray-400">No submissions yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tag My Music Tab */}
              {activeTab === "tag" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl">
                  <h2 className="text-lg font-bold mb-4">Tag Your Track for Sync</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Track Title</label>
                      <input type="text" value={tagTitle} onChange={(e) => setTagTitle(e.target.value)} placeholder="Enter track title" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                      <select value={tagGenre} onChange={(e) => setTagGenre(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400">
                        <option value="">Select genre</option>
                        {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                      <select value={tagMood} onChange={(e) => setTagMood(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400">
                        <option value="">Select mood</option>
                        {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tempo (BPM): {tagTempo}</label>
                      <input type="range" min="60" max="200" value={tagTempo} onChange={(e) => setTagTempo(e.target.value)} className="w-full accent-purple-600" />
                      <div className="flex justify-between text-xs text-gray-400 mt-1"><span>60</span><span>200</span></div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instrumentation</label>
                      <div className="flex flex-wrap gap-2">
                        {INSTRUMENTS.map((inst) => (
                          <button
                            key={inst}
                            onClick={() => toggleInstrument(inst)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                              tagInstruments.includes(inst) ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                            }`}
                          >
                            {inst}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">Save Tags</button>
                  </div>
                </div>
              )}

              {/* Opportunities Tab */}
              {activeTab === "opportunities" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {HARDCODED_OPPORTUNITIES.map((opp) => {
                    const Icon = TYPE_ICONS[opp.type] || Tv;
                    return (
                      <div key={opp.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0"><Icon size={20} /></div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm leading-tight">{opp.title}</h3>
                            <span className="text-xs text-gray-400 mt-0.5 inline-block">{opp.type}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 flex-1">{opp.description}</p>
                        <div className="space-y-1 mb-4">
                          <div className="flex justify-between text-xs"><span className="text-gray-500">Genre</span><span className="font-medium">{opp.genre}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-gray-500">Budget</span><span className="font-medium text-green-600">{opp.budget}</span></div>
                          <div className="flex justify-between text-xs"><span className="text-gray-500">Deadline</span><span className="font-medium">{opp.deadline}</span></div>
                        </div>
                        <button className="w-full bg-purple-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                          <Send size={14} /> Submit Track
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
