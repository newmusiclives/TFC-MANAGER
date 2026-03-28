"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  DollarSign,
  Users,
  Clock,
  TrendingUp,
  Plus,
  Heart,
  Star,
  Music2,
  Headphones,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Target,
  Gift,
  X,
  Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/lib/api-client";

interface Tier {
  id: string;
  name: string;
  price: number;
  icon: React.ElementType;
  description: string;
  backers: number;
  limit: number | null;
}

interface Backer {
  id: string;
  name: string;
  tier: string;
  amount: number;
  date: string;
  avatar: string;
}

interface Campaign {
  id: string;
  title: string;
  artist: string;
  description: string;
  goal: number;
  raised: number;
  backers: number;
  deadline: string;
  daysRemaining: number;
  status: "active" | "completed" | "draft";
  coverGradient: string;
  tiers: Tier[];
  recentBackers: Backer[];
}

const campaigns: Campaign[] = [
  {
    id: "c1",
    title: "Golden Hour EP - Pre-Order Campaign",
    artist: "Jordan Davis",
    description: "Help bring the Golden Hour EP to life. Funds go toward studio time, mixing, mastering, and exclusive fan experiences.",
    goal: 5000,
    raised: 2400,
    backers: 68,
    deadline: "Apr 30, 2026",
    daysRemaining: 33,
    status: "active",
    coverGradient: "from-amber-400 to-orange-600",
    tiers: [
      { id: "t1", name: "Pre-Save Supporter", price: 5, icon: Heart, description: "Early access to the pre-save link + shoutout on release day", backers: 32, limit: null },
      { id: "t2", name: "Signed Postcard", price: 15, icon: Star, description: "Hand-signed postcard with personal thank you note mailed to you", backers: 18, limit: 100 },
      { id: "t3", name: "Private Listening Session", price: 50, icon: Headphones, description: "Exclusive virtual listening party before public release", backers: 12, limit: 30 },
      { id: "t4", name: "Producer Credits", price: 100, icon: Award, description: "Your name in the official credits + all lower tier rewards", backers: 6, limit: 15 },
    ],
    recentBackers: [
      { id: "b1", name: "Sarah M.", tier: "Private Listening Session", amount: 50, date: "2 hours ago", avatar: "SM" },
      { id: "b2", name: "Alex K.", tier: "Signed Postcard", amount: 15, date: "5 hours ago", avatar: "AK" },
      { id: "b3", name: "Chris T.", tier: "Pre-Save Supporter", amount: 5, date: "8 hours ago", avatar: "CT" },
      { id: "b4", name: "Morgan R.", tier: "Producer Credits", amount: 100, date: "1 day ago", avatar: "MR" },
      { id: "b5", name: "Jamie L.", tier: "Pre-Save Supporter", amount: 5, date: "1 day ago", avatar: "JL" },
      { id: "b6", name: "Taylor P.", tier: "Signed Postcard", amount: 15, date: "2 days ago", avatar: "TP" },
    ],
  },
  {
    id: "c2",
    title: "Midnight Dreams - Pre-Order Campaign",
    artist: "Jordan Davis",
    description: "The Midnight Dreams single campaign hit its goal and delivered exclusive rewards to all backers.",
    goal: 2000,
    raised: 2350,
    backers: 94,
    deadline: "Jan 10, 2026",
    daysRemaining: 0,
    status: "completed",
    coverGradient: "from-purple-600 to-indigo-800",
    tiers: [
      { id: "t5", name: "Pre-Save Supporter", price: 5, icon: Heart, description: "Early access to the pre-save link", backers: 52, limit: null },
      { id: "t6", name: "Signed Postcard", price: 15, icon: Star, description: "Hand-signed postcard with thank you note", backers: 24, limit: 50 },
      { id: "t7", name: "Private Listening Session", price: 50, icon: Headphones, description: "Virtual listening party before release", backers: 14, limit: 25 },
      { id: "t8", name: "Producer Credits", price: 100, icon: Award, description: "Your name in the official credits", backers: 4, limit: 10 },
    ],
    recentBackers: [
      { id: "b7", name: "Riley W.", tier: "Producer Credits", amount: 100, date: "Jan 9, 2026", avatar: "RW" },
      { id: "b8", name: "Jordan F.", tier: "Signed Postcard", amount: 15, date: "Jan 8, 2026", avatar: "JF" },
      { id: "b9", name: "Casey N.", tier: "Pre-Save Supporter", amount: 5, date: "Jan 8, 2026", avatar: "CN" },
    ],
  },
];

export default function FanFundingPage() {
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>("c1");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [backerTab, setBacterTab] = useState<Record<string, "tiers" | "backers">>({ c1: "tiers", c2: "tiers" });
  const [formData, setFormData] = useState({
    title: "",
    goal: "",
    deadline: "",
    description: "",
  });
  const [campaignList, setCampaignList] = useState<Campaign[]>(campaigns);

  useEffect(() => {
    apiGet<Campaign[]>("/api/campaigns")
      .then((d) => setCampaignList(d))
      .catch(() => {/* keep mock data */});
  }, []);

  const createCampaign = async (campaignData: typeof formData) => {
    try {
      const newCampaign = await apiPost<Campaign>("/api/campaigns", campaignData);
      setCampaignList((prev) => [...prev, newCampaign]);
      setShowCreateForm(false);
    } catch {
      /* keep current state */
    }
  };

  const totalRaised = campaignList.reduce((sum, c) => sum + c.raised, 0);
  const totalBackers = campaignList.reduce((sum, c) => sum + c.backers, 0);
  const avgPledge = totalBackers > 0 ? (totalRaised / totalBackers).toFixed(2) : "0.00";
  const activeCampaigns = campaignList.filter((c) => c.status === "active");

  const setTabForCampaign = (campaignId: string, tab: "tiers" | "backers") => {
    setBacterTab((prev) => ({ ...prev, [campaignId]: tab }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Fan-Powered Funding</h1>
            <p className="text-sm text-gray-500">
              Pre-orders, crowdfunding, and fan support campaigns
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <Plus size={16} />
              New Campaign
            </button>
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 15%, transparent)" }}>
                  <DollarSign size={20} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <p className="text-2xl font-bold">${totalRaised.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total Raised</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalBackers}</p>
                  <p className="text-sm text-gray-500">Total Backers</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Clock size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeCampaigns.length > 0 ? activeCampaigns[0].daysRemaining : 0}</p>
                  <p className="text-sm text-gray-500">Days Remaining</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <TrendingUp size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${avgPledge}</p>
                  <p className="text-sm text-gray-500">Avg Pledge</p>
                </div>
              </div>
            </div>
          </div>

          {/* Create Campaign Form */}
          {showCreateForm && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--primary)" }}>
                    <Plus size={20} className="text-white" />
                  </div>
                  <h2 className="text-lg font-semibold">Create New Campaign</h2>
                </div>
                <button onClick={() => setShowCreateForm(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Campaign Title</label>
                  <input
                    type="text"
                    placeholder="e.g., New Album Pre-Order"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ "--tw-ring-color": "var(--primary)" } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Funding Goal ($)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ "--tw-ring-color": "var(--primary)" } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ "--tw-ring-color": "var(--primary)" } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <input
                    type="text"
                    placeholder="What are you raising funds for?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                    style={{ "--tw-ring-color": "var(--primary)" } as React.CSSProperties}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Reward Tiers</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { name: "Pre-Save Supporter", price: "$5", icon: Heart },
                    { name: "Signed Postcard", price: "$15", icon: Star },
                    { name: "Private Listening Session", price: "$50", icon: Headphones },
                    { name: "Producer Credits", price: "$100", icon: Award },
                  ].map((tier) => {
                    const Icon = tier.icon;
                    return (
                      <div key={tier.name} className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center">
                          <Icon size={14} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{tier.name}</p>
                          <p className="text-xs text-gray-400">{tier.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createCampaign(formData)}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  <Gift size={16} />
                  Launch Campaign
                </button>
              </div>
            </div>
          )}

          {/* Campaigns */}
          {campaignList.map((campaign) => {
            const isExpanded = expandedCampaign === campaign.id;
            const progress = Math.min((campaign.raised / campaign.goal) * 100, 100);
            const isCompleted = campaign.status === "completed";
            const exceeded = campaign.raised > campaign.goal;
            const currentTab = backerTab[campaign.id] || "tiers";

            return (
              <div key={campaign.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Campaign Header */}
                <button
                  onClick={() => setExpandedCampaign(isExpanded ? null : campaign.id)}
                  className="w-full flex items-center gap-4 p-6 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${campaign.coverGradient} flex items-center justify-center shadow-md`}>
                    <Music2 size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{campaign.title}</h3>
                      {isCompleted ? (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          Funded
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full text-white" style={{ backgroundColor: "var(--primary)" }}>
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{campaign.artist}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: isCompleted ? "#16a34a" : "var(--primary)" }}>
                        ${campaign.raised.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">of ${campaign.goal.toLocaleString()} goal</p>
                    </div>
                    {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                  </div>
                </button>

                {/* Progress Bar */}
                <div className="px-6 pb-4 -mt-2">
                  <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: isCompleted ? "#16a34a" : "var(--primary)",
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-xs text-gray-400">{Math.round(progress)}% funded</span>
                    <span className="text-xs text-gray-400">
                      {isCompleted ? (
                        exceeded ? `${Math.round(((campaign.raised - campaign.goal) / campaign.goal) * 100)}% over goal` : "Goal reached"
                      ) : (
                        `${campaign.daysRemaining} days left`
                      )}
                    </span>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-6 space-y-5">
                    <p className="text-sm text-gray-600">{campaign.description}</p>

                    {/* Quick stats row */}
                    <div className="grid grid-cols-4 gap-3">
                      <div className="text-center p-3 rounded-xl bg-gray-50">
                        <p className="text-lg font-bold text-gray-800">${campaign.raised.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Raised</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gray-50">
                        <p className="text-lg font-bold text-gray-800">{campaign.backers}</p>
                        <p className="text-xs text-gray-500">Backers</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gray-50">
                        <p className="text-lg font-bold text-gray-800">{isCompleted ? "0" : campaign.daysRemaining}</p>
                        <p className="text-xs text-gray-500">Days Left</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-gray-50">
                        <p className="text-lg font-bold text-gray-800">
                          ${campaign.backers > 0 ? (campaign.raised / campaign.backers).toFixed(0) : "0"}
                        </p>
                        <p className="text-xs text-gray-500">Avg Pledge</p>
                      </div>
                    </div>

                    {/* Tab switcher */}
                    <div className="flex bg-gray-100 rounded-lg p-0.5 w-fit">
                      <button
                        onClick={(e) => { e.stopPropagation(); setTabForCampaign(campaign.id, "tiers"); }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${currentTab === "tiers" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
                      >
                        Reward Tiers
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setTabForCampaign(campaign.id, "backers"); }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${currentTab === "backers" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
                      >
                        Backers ({campaign.backers})
                      </button>
                    </div>

                    {/* Tiers */}
                    {currentTab === "tiers" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {campaign.tiers.map((tier) => {
                          const TierIcon = tier.icon;
                          const tierProgress = tier.limit ? (tier.backers / tier.limit) * 100 : null;
                          return (
                            <div key={tier.id} className="rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "color-mix(in srgb, var(--primary) 15%, transparent)" }}>
                                    <TierIcon size={16} style={{ color: "var(--primary)" }} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-800">{tier.name}</p>
                                    <p className="text-lg font-bold" style={{ color: "var(--primary)" }}>${tier.price}</p>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">{tier.backers} backers</span>
                              </div>
                              <p className="text-xs text-gray-500 mb-3">{tier.description}</p>
                              {tier.limit && (
                                <div>
                                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>{tier.backers} / {tier.limit} claimed</span>
                                    <span>{tier.limit - tier.backers} remaining</span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                      className="h-full rounded-full"
                                      style={{ width: `${tierProgress}%`, backgroundColor: "var(--primary)" }}
                                    />
                                  </div>
                                </div>
                              )}
                              {!tier.limit && (
                                <p className="text-xs text-gray-400">Unlimited availability</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Backers */}
                    {currentTab === "backers" && (
                      <div className="space-y-2">
                        {campaign.recentBackers.map((backer) => (
                          <div key={backer.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                              {backer.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800">{backer.name}</p>
                              <p className="text-xs text-gray-400">{backer.tier}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold" style={{ color: "var(--primary)" }}>${backer.amount}</p>
                              <p className="text-xs text-gray-400">{backer.date}</p>
                            </div>
                          </div>
                        ))}
                        {campaign.backers > campaign.recentBackers.length && (
                          <div className="text-center py-3">
                            <button className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: "var(--primary)" }}>
                              View all {campaign.backers} backers
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Campaign actions */}
                    {isCompleted && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100">
                        <CheckCircle2 size={20} className="text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Campaign Successfully Funded!</p>
                          <p className="text-xs text-green-600">
                            Raised ${campaign.raised.toLocaleString()} of ${campaign.goal.toLocaleString()} goal ({Math.round((campaign.raised / campaign.goal) * 100)}%)
                          </p>
                        </div>
                      </div>
                    )}

                    {!isCompleted && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <Target size={20} style={{ color: "var(--primary)" }} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700">
                            ${(campaign.goal - campaign.raised).toLocaleString()} to go
                          </p>
                          <p className="text-xs text-gray-400">{campaign.daysRemaining} days remaining to reach your goal</p>
                        </div>
                        <button
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: "var(--primary)" }}
                        >
                          Share Campaign
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
