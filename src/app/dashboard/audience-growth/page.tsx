"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Users,
  Target,
  Megaphone,
  Lightbulb,
  Sparkles,
  TrendingUp,
  DollarSign,
  Eye,
  MousePointer,
  ArrowRight,
  Loader2,
  Plus,
  X,
  BarChart3,
  Music,
  Share2,
  UserPlus,
  Zap,
  Star,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost } from "@/lib/api-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Persona = {
  id: string;
  name: string;
  ageRange: string;
  gender: string;
  interests: string[];
  platforms: string[];
  listeningHabits: string;
  location: string;
  spending: string;
};

type Campaign = {
  id: string;
  platform: string;
  name: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  status: string;
  startDate: string;
  endDate: string;
};

type Strategy = {
  id: string;
  title: string;
  description: string;
  priority: string;
  impact: string;
  effort: string;
  category: string;
};

type Tab = "personas" | "campaigns" | "strategies";

const CAMPAIGN_STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  Active: { text: "text-green-600", bg: "bg-green-50" },
  Completed: { text: "text-blue-600", bg: "bg-blue-50" },
  Draft: { text: "text-gray-600", bg: "bg-gray-100" },
  Paused: { text: "text-yellow-600", bg: "bg-yellow-50" },
};

const PLATFORM_COLORS: Record<string, { text: string; bg: string }> = {
  "Meta (Instagram)": { text: "text-pink-600", bg: "bg-pink-50" },
  "Meta (Facebook)": { text: "text-blue-600", bg: "bg-blue-50" },
  TikTok: { text: "text-gray-900", bg: "bg-gray-100" },
  "Google (YouTube)": { text: "text-red-600", bg: "bg-red-50" },
};

const STRATEGY_ICONS: Record<string, React.ElementType> = {
  Social: Share2,
  Playlists: Music,
  "Fan Engagement": Users,
  Collaborations: UserPlus,
  Profile: Star,
};

const IMPACT_COLORS: Record<string, string> = {
  High: "text-green-600",
  Medium: "text-yellow-600",
  Low: "text-gray-500",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AudienceGrowthPage() {
  const [activeTab, setActiveTab] = useState<Tab>("personas");
  const [loading, setLoading] = useState(true);

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [stats, setStats] = useState({ totalReach: 0, totalSpent: 0, totalConversions: 0, avgCostPerConversion: 0 });

  const [generatingPersona, setGeneratingPersona] = useState(false);

  // Campaign modal
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCampName, setNewCampName] = useState("");
  const [newCampPlatform, setNewCampPlatform] = useState("Meta (Instagram)");
  const [newCampBudget, setNewCampBudget] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet<{
        personas: Persona[];
        campaigns: Campaign[];
        strategies: Strategy[];
        stats: typeof stats;
      }>("/api/audience-growth");
      setPersonas(data.personas);
      setCampaigns(data.campaigns);
      setStrategies(data.strategies);
      setStats(data.stats);
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGeneratePersona = async () => {
    setGeneratingPersona(true);
    try {
      const data = await apiPost<{ persona: Persona }>("/api/audience-growth/personas", {});
      setPersonas((prev) => [...prev, data.persona]);
    } catch {
      // empty
    } finally {
      setGeneratingPersona(false);
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "personas", label: "Audience Personas", icon: Users },
    { key: "campaigns", label: "Ad Campaigns", icon: Megaphone },
    { key: "strategies", label: "Growth Strategies", icon: Lightbulb },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Audience Growth</h1>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-600">AI</span>
            </div>
            <p className="text-sm text-gray-500">Personas, ad campaigns, and growth strategies</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Reach", value: stats.totalReach.toLocaleString(), icon: Eye, color: "bg-blue-50 text-blue-600" },
              { label: "Total Spent", value: `$${stats.totalSpent.toLocaleString()}`, icon: DollarSign, color: "bg-green-50 text-green-600" },
              { label: "Conversions", value: stats.totalConversions.toString(), icon: Target, color: "bg-purple-50 text-purple-600" },
              { label: "Avg Cost / Conv", value: `$${stats.avgCostPerConversion.toFixed(2)}`, icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
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
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-purple-600" size={32} /></div>
          ) : (
            <>
              {/* Personas */}
              {activeTab === "personas" && (
                <div>
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={handleGeneratePersona}
                      disabled={generatingPersona}
                      className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-1 disabled:opacity-60"
                    >
                      {generatingPersona ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      Generate New Persona
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {personas.map((persona) => (
                      <div key={persona.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                            {persona.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <h3 className="font-semibold">{persona.name}</h3>
                            <p className="text-xs text-gray-500">{persona.ageRange} / {persona.gender}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-xs font-medium text-gray-500">Interests</span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {persona.interests.map((i) => (
                                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">{i}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500">Platforms</span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {persona.platforms.map((p) => (
                                <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{p}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500">Listening Habits</span>
                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{persona.listeningHabits}</p>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Location</span>
                            <span className="font-medium text-gray-700">{persona.location}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">Spending</span>
                            <span className="font-medium text-gray-700">{persona.spending.split(" ")[0]}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Campaigns */}
              {activeTab === "campaigns" && (
                <div>
                  <div className="flex justify-end mb-4">
                    <button onClick={() => setShowCampaignModal(true)} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-1"><Plus size={16} /> Create Campaign</button>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="text-left p-4 font-medium text-gray-600">Campaign</th>
                            <th className="text-left p-4 font-medium text-gray-600">Platform</th>
                            <th className="text-right p-4 font-medium text-gray-600">Budget</th>
                            <th className="text-left p-4 font-medium text-gray-600">Spent</th>
                            <th className="text-right p-4 font-medium text-gray-600">Impressions</th>
                            <th className="text-right p-4 font-medium text-gray-600">Clicks</th>
                            <th className="text-right p-4 font-medium text-gray-600">CTR</th>
                            <th className="text-right p-4 font-medium text-gray-600">Conv.</th>
                            <th className="text-left p-4 font-medium text-gray-600">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {campaigns.map((camp) => {
                            const sc = CAMPAIGN_STATUS_COLORS[camp.status] || { text: "text-gray-600", bg: "bg-gray-100" };
                            const pc = PLATFORM_COLORS[camp.platform] || { text: "text-gray-600", bg: "bg-gray-100" };
                            const pctSpent = camp.budget > 0 ? Math.round((camp.spent / camp.budget) * 100) : 0;
                            const ctr = camp.impressions > 0 ? ((camp.clicks / camp.impressions) * 100).toFixed(2) : "0.00";
                            return (
                              <tr key={camp.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                <td className="p-4 font-medium">{camp.name}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pc.bg} ${pc.text}`}>{camp.platform}</span>
                                </td>
                                <td className="p-4 text-right">${camp.budget}</td>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                                      <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${Math.min(pctSpent, 100)}%` }} />
                                    </div>
                                    <span className="text-xs text-gray-500">${camp.spent}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-right">{camp.impressions.toLocaleString()}</td>
                                <td className="p-4 text-right">{camp.clicks.toLocaleString()}</td>
                                <td className="p-4 text-right">{ctr}%</td>
                                <td className="p-4 text-right font-medium">{camp.conversions}</td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>{camp.status}</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Campaign Modal */}
                  {showCampaignModal && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCampaignModal(false)}>
                      <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold">Create Campaign</h3>
                          <button onClick={() => setShowCampaignModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
                        </div>
                        <div className="space-y-3">
                          <input type="text" value={newCampName} onChange={(e) => setNewCampName(e.target.value)} placeholder="Campaign name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400" />
                          <select value={newCampPlatform} onChange={(e) => setNewCampPlatform(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400">
                            {["Meta (Instagram)", "Meta (Facebook)", "TikTok", "Google (YouTube)"].map((p) => <option key={p}>{p}</option>)}
                          </select>
                          <input type="number" value={newCampBudget} onChange={(e) => setNewCampBudget(e.target.value)} placeholder="Budget ($)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400" />
                        </div>
                        <div className="flex gap-2 mt-5">
                          <button onClick={() => setShowCampaignModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                          <button onClick={() => setShowCampaignModal(false)} className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700">Create</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Strategies */}
              {activeTab === "strategies" && (
                <div className="space-y-4 max-w-3xl">
                  {strategies.map((strategy) => {
                    const Icon = STRATEGY_ICONS[strategy.category] || Zap;
                    return (
                      <div key={strategy.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4">
                        <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                          <Icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold">{strategy.title}</h3>
                            <span className={`text-xs font-medium ${IMPACT_COLORS[strategy.impact] || "text-gray-500"}`}>
                              {strategy.impact} Impact
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{strategy.category}</span>
                            <span className="text-xs text-gray-400">Priority: {strategy.priority}</span>
                            <span className="text-xs text-gray-400">Effort: {strategy.effort}</span>
                          </div>
                        </div>
                        <button className="self-center bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-1 whitespace-nowrap">
                          Take Action <ArrowRight size={14} />
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
