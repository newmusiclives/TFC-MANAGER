"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Mail,
  Users,
  FileText,
  Send,
  ExternalLink,
  Search,
  Eye,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Copy,
  Download,
  Loader2,
  Plus,
  X,
  Globe,
  Mic,
  PenTool,
  User,
  Award,
  BarChart3,
  Quote,
  Image,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost } from "@/lib/api-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OutreachItem = {
  id: string;
  journalistName: string;
  outlet: string;
  subject: string;
  status: string;
  sentAt: string | null;
  articleUrl: string | null;
  openedAt: string | null;
  repliedAt: string | null;
};

type Contact = {
  id: string;
  name: string;
  outlet: string;
  role: string;
  genres: string[];
  email: string;
  twitter: string;
  followers: number;
  lastPitched: string | null;
};

type Tab = "outreach" | "contacts" | "presskit";

const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  Draft: { text: "text-gray-600", bg: "bg-gray-100" },
  Sent: { text: "text-blue-600", bg: "bg-blue-50" },
  Opened: { text: "text-yellow-600", bg: "bg-yellow-50" },
  Replied: { text: "text-green-600", bg: "bg-green-50" },
  Published: { text: "text-purple-600", bg: "bg-purple-50" },
  "No Response": { text: "text-gray-500", bg: "bg-gray-100" },
};

const CONTACT_TYPE_COLORS: Record<string, { text: string; bg: string; icon: React.ElementType }> = {
  "Senior Writer": { text: "text-blue-600", bg: "bg-blue-50", icon: PenTool },
  "Music Editor": { text: "text-purple-600", bg: "bg-purple-50", icon: BookOpen },
  "Staff Writer": { text: "text-blue-600", bg: "bg-blue-50", icon: PenTool },
  "Senior Editor": { text: "text-purple-600", bg: "bg-purple-50", icon: BookOpen },
  "Features Editor": { text: "text-purple-600", bg: "bg-purple-50", icon: BookOpen },
  "Music Writer": { text: "text-blue-600", bg: "bg-blue-50", icon: PenTool },
  Founder: { text: "text-green-600", bg: "bg-green-50", icon: Globe },
  "Host/Producer": { text: "text-amber-600", bg: "bg-amber-50", icon: Mic },
};

function formatFollowers(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
}

// ---------------------------------------------------------------------------
// Press Kit mock data
// ---------------------------------------------------------------------------

const PRESS_KIT = {
  bio: "An emerging indie artist blending atmospheric production with introspective songwriting. With roots in the Brooklyn music scene, their sound draws from dream-pop, indie folk, and electronic textures. Featured on Pitchfork, NME, and Spotify Editorial playlists.",
  stats: [
    { label: "Monthly Listeners", value: "45.2K" },
    { label: "Total Streams", value: "2.1M" },
    { label: "Social Followers", value: "78K" },
    { label: "Press Features", value: "12" },
  ],
  achievements: [
    "Featured on Spotify's 'Fresh Finds' editorial playlist",
    "Pitchfork review — 7.8 Best New Music",
    "SXSW 2026 Official Showcase Artist",
    "Opening for Phoebe Bridgers — Spring Tour 2026",
    "Sync placement in Netflix series 'The In Between'",
  ],
  pressQuotes: [
    { quote: "A stunning debut that signals the arrival of a major new voice in indie music.", outlet: "Pitchfork" },
    { quote: "Atmospheric and deeply personal — this is the future of dream-pop.", outlet: "NME" },
    { quote: "One of the most exciting emerging artists of 2026.", outlet: "The FADER" },
  ],
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PressOutreachPage() {
  const [activeTab, setActiveTab] = useState<Tab>("outreach");
  const [loading, setLoading] = useState(true);

  const [outreach, setOutreach] = useState<OutreachItem[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("");

  // Modal state
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [pitchContactId, setPitchContactId] = useState("");
  const [pitchSubject, setPitchSubject] = useState("");
  const [pitchMessage, setPitchMessage] = useState("");
  const [generating, setGenerating] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [outreachData, contactData] = await Promise.all([
        apiGet<{ outreach: OutreachItem[]; stats: Record<string, number> }>("/api/press-outreach"),
        apiGet<{ contacts: Contact[] }>("/api/press-outreach/contacts"),
      ]);
      setOutreach(outreachData.outreach);
      setContacts(contactData.contacts);
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredContacts = contacts.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.outlet.toLowerCase().includes(q) && !c.role.toLowerCase().includes(q)) return false;
    }
    if (genreFilter && !c.genres.some((g) => g.toLowerCase().includes(genreFilter.toLowerCase()))) return false;
    return true;
  });

  const allGenres = [...new Set(contacts.flatMap((c) => c.genres))].sort();

  const handleGenerate = async () => {
    setGenerating(true);
    setTimeout(() => {
      setPitchMessage("Hi [Name],\n\nI wanted to reach out about my upcoming EP release. The project blends atmospheric indie production with introspective lyrics, drawing comparisons to artists like Phoebe Bridgers and Big Thief.\n\nI'd love to discuss a potential feature, premiere, or review. I've attached a private link to the EP along with hi-res press photos.\n\nLet me know if you'd be interested!\n\nBest regards");
      setGenerating(false);
    }, 1500);
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "outreach", label: "My Outreach", icon: Mail },
    { key: "contacts", label: "Media Contacts", icon: Users },
    { key: "presskit", label: "Press Kit", icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Press Outreach</h1>
            <p className="text-sm text-gray-500">Pitch journalists, manage contacts and press kit</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Pitches", value: outreach.length.toString(), icon: Send, color: "bg-blue-50 text-blue-600" },
              { label: "Published", value: outreach.filter((o) => o.status === "Published").length.toString(), icon: BookOpen, color: "bg-green-50 text-green-600" },
              { label: "Replied", value: outreach.filter((o) => o.status === "Replied").length.toString(), icon: CheckCircle2, color: "bg-purple-50 text-purple-600" },
              { label: "Media Contacts", value: contacts.length.toString(), icon: Users, color: "bg-amber-50 text-amber-600" },
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
              {/* My Outreach */}
              {activeTab === "outreach" && (
                <div>
                  <div className="flex justify-end mb-4">
                    <button onClick={() => setShowPitchModal(true)} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-1"><Plus size={16} /> New Pitch</button>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="text-left p-4 font-medium text-gray-600">Journalist</th>
                            <th className="text-left p-4 font-medium text-gray-600">Outlet</th>
                            <th className="text-left p-4 font-medium text-gray-600">Subject</th>
                            <th className="text-left p-4 font-medium text-gray-600">Status</th>
                            <th className="text-left p-4 font-medium text-gray-600">Sent</th>
                            <th className="text-left p-4 font-medium text-gray-600">Article</th>
                          </tr>
                        </thead>
                        <tbody>
                          {outreach.map((item) => {
                            const sc = STATUS_COLORS[item.status] || { text: "text-gray-600", bg: "bg-gray-100" };
                            return (
                              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                <td className="p-4 font-medium">{item.journalistName}</td>
                                <td className="p-4 text-gray-600">{item.outlet}</td>
                                <td className="p-4 text-gray-600">{item.subject}</td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>{item.status}</span>
                                </td>
                                <td className="p-4 text-gray-500 text-xs">{item.sentAt || "-"}</td>
                                <td className="p-4">
                                  {item.articleUrl ? (
                                    <a href={item.articleUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 flex items-center gap-1 text-xs">
                                      <ExternalLink size={12} /> View
                                    </a>
                                  ) : <span className="text-gray-300">-</span>}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* New Pitch Modal */}
                  {showPitchModal && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowPitchModal(false)}>
                      <div className="bg-white rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold">New Pitch</h3>
                          <button onClick={() => setShowPitchModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                            <select value={pitchContactId} onChange={(e) => setPitchContactId(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400">
                              <option value="">Select contact</option>
                              {contacts.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.outlet}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input type="text" value={pitchSubject} onChange={(e) => setPitchSubject(e.target.value)} placeholder="Enter subject line" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-sm font-medium text-gray-700">Message</label>
                              <button onClick={handleGenerate} disabled={generating} className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1">
                                {generating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Generate with AI
                              </button>
                            </div>
                            <textarea value={pitchMessage} onChange={(e) => setPitchMessage(e.target.value)} rows={8} placeholder="Write your pitch..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 resize-none" />
                          </div>
                        </div>
                        <div className="flex gap-2 mt-5">
                          <button onClick={() => setShowPitchModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Save as Draft</button>
                          <button onClick={() => setShowPitchModal(false)} className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 flex items-center justify-center gap-1"><Send size={14} /> Send Pitch</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Media Contacts */}
              {activeTab === "contacts" && (
                <div>
                  <div className="flex gap-3 mb-4">
                    <div className="relative flex-1 max-w-md">
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search contacts..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400" />
                    </div>
                    <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400">
                      <option value="">All Genres</option>
                      {allGenres.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredContacts.map((contact) => {
                      const typeConf = CONTACT_TYPE_COLORS[contact.role] || { text: "text-gray-600", bg: "bg-gray-50", icon: User };
                      const TypeIcon = typeConf.icon;
                      return (
                        <div key={contact.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                              {contact.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold">{contact.name}</h3>
                              <p className="text-sm text-gray-500">{contact.outlet}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${typeConf.bg} ${typeConf.text}`}>
                              <TypeIcon size={10} /> {contact.role}
                            </span>
                            <span className="text-xs text-gray-500">{formatFollowers(contact.followers)} followers</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {contact.genres.map((g) => (
                              <span key={g} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{g}</span>
                            ))}
                          </div>
                          <button
                            onClick={() => { setPitchContactId(contact.id); setShowPitchModal(true); setActiveTab("outreach"); }}
                            className="w-full bg-purple-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-1"
                          >
                            <Send size={14} /> Pitch
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Press Kit */}
              {activeTab === "presskit" && (
                <div className="max-w-3xl space-y-6">
                  <div className="flex justify-end gap-2">
                    <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center gap-1"><Copy size={14} /> Copy Link</button>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 flex items-center gap-1"><Download size={14} /> Download PDF</button>
                  </div>

                  {/* Bio */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2"><User size={18} className="text-purple-600" /> Artist Bio</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{PRESS_KIT.bio}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {PRESS_KIT.stats.map((stat) => (
                      <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
                        <div className="text-2xl font-bold text-purple-600">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Achievements */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2"><Award size={18} className="text-purple-600" /> Achievements</h3>
                    <ul className="space-y-2">
                      {PRESS_KIT.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" /> {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Press Quotes */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2"><Quote size={18} className="text-purple-600" /> Press Quotes</h3>
                    <div className="space-y-4">
                      {PRESS_KIT.pressQuotes.map((pq, i) => (
                        <blockquote key={i} className="border-l-4 border-purple-300 pl-4">
                          <p className="text-sm text-gray-700 italic">&ldquo;{pq.quote}&rdquo;</p>
                          <cite className="text-xs text-gray-500 not-italic mt-1 block">-- {pq.outlet}</cite>
                        </blockquote>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Photos */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2"><Image size={18} className="text-purple-600" /> Suggested Photos</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {["Press Photo 1 — Headshot", "Press Photo 2 — Live Performance", "Press Photo 3 — Studio Session"].map((label, i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-center p-3">
                          <span className="text-xs text-gray-400">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
