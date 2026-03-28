"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Lock,
  Plus,
  Copy,
  ExternalLink,
  Music2,
  Eye,
  Clock,
  Users,
  Shield,
  CheckCircle2,
  Trash2,
  Download,
  Play,
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/lib/api-client";

const listeningLinks = [
  {
    id: "ll1",
    title: "Golden Hour (Unreleased)",
    slug: "golden-hour-preview",
    url: "https://listen.truefans.link/p/golden-hour-preview",
    password: "GH2026",
    expiresAt: "Apr 15, 2026",
    plays: 12,
    visitors: 18,
    maxPlays: 50,
    status: "active" as const,
    recipients: [
      { name: "Sarah @ Pitchfork", email: "sarah@pitchfork.com", played: true, playedAt: "Mar 26" },
      { name: "Mike @ NME", email: "mike@nme.com", played: true, playedAt: "Mar 27" },
      { name: "DJ Luna @ BBC Radio", email: "luna@bbc.co.uk", played: false, playedAt: null },
      { name: "Label A&R - Jake", email: "jake@recordlabel.com", played: true, playedAt: "Mar 25" },
    ],
    createdAt: "Mar 20, 2026",
  },
  {
    id: "ll2",
    title: "Midnight Dreams (Pre-Release)",
    slug: "midnight-dreams-pre",
    url: "https://listen.truefans.link/p/midnight-dreams-pre",
    password: "MD2025",
    expiresAt: "Dec 15, 2025",
    plays: 34,
    visitors: 42,
    maxPlays: 100,
    status: "expired" as const,
    recipients: [
      { name: "Alex @ Rolling Stone", email: "alex@rs.com", played: true, playedAt: "Dec 2" },
      { name: "Promo Team", email: "promo@distro.com", played: true, playedAt: "Dec 3" },
    ],
    createdAt: "Nov 28, 2025",
  },
  {
    id: "ll3",
    title: "Summer Waves EP (Full Preview)",
    slug: "summer-waves-preview",
    url: "https://listen.truefans.link/p/summer-waves-preview",
    password: "SW2025",
    expiresAt: "Jul 20, 2025",
    plays: 67,
    visitors: 89,
    maxPlays: 100,
    status: "expired" as const,
    recipients: [],
    createdAt: "Jun 30, 2025",
  },
];

export default function ListeningLinksPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedLink, setExpandedLink] = useState<string | null>("ll1");
  const [links, setLinks] = useState(listeningLinks);

  useEffect(() => {
    apiGet<typeof listeningLinks>("/api/listening-links")
      .then((d) => setLinks(d))
      .catch(() => {/* keep mock data */});
  }, []);

  const createLink = async (linkData: { title: string; password: string; expiresAt: string; maxPlays: number }) => {
    try {
      const newLink = await apiPost<(typeof listeningLinks)[0]>("/api/listening-links", linkData);
      setLinks((prev) => [...prev, newLink]);
      setShowCreate(false);
    } catch {
      /* keep current state */
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Private Listening Links</h1>
            <p className="text-sm text-gray-500">
              Secure pre-release sharing for press, labels, and collaborators
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus size={16} /> Create Listening Link
            </button>
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Create form */}
          {showCreate && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h2 className="font-bold text-lg mb-4">New Private Listening Link</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Track / EP Title</label>
                  <input type="text" placeholder="e.g. Golden Hour" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Password (optional)</label>
                  <input type="text" placeholder="Leave blank for no password" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Expiry Date</label>
                  <input type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Max Plays</label>
                  <input type="number" defaultValue={50} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5">Upload Audio</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[var(--primary)]/40 transition-colors cursor-pointer">
                  <Music2 size={28} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">Drop audio file or click to upload</p>
                  <p className="text-xs text-gray-400">MP3, WAV, FLAC up to 50MB</p>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5">Recipients (one per line)</label>
                <textarea
                  rows={3}
                  placeholder={"name@email.com\npress@outlet.com"}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors">
                  Create Link
                </button>
                <button onClick={() => setShowCreate(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-5 py-2.5 rounded-lg transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center"><Lock size={18} className="text-blue-600" /></div>
                <span className="text-sm text-gray-500">Total Links</span>
              </div>
              <div className="text-2xl font-bold">{links.length}</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center"><CheckCircle2 size={18} className="text-green-600" /></div>
                <span className="text-sm text-gray-500">Active</span>
              </div>
              <div className="text-2xl font-bold">{links.filter((l) => l.status === "active").length}</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center"><Play size={18} className="text-purple-600" /></div>
                <span className="text-sm text-gray-500">Total Plays</span>
              </div>
              <div className="text-2xl font-bold">{links.reduce((a, l) => a + l.plays, 0)}</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center"><Eye size={18} className="text-orange-600" /></div>
                <span className="text-sm text-gray-500">Total Visitors</span>
              </div>
              <div className="text-2xl font-bold">{links.reduce((a, l) => a + l.visitors, 0)}</div>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => setExpandedLink(expandedLink === link.id ? null : link.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${link.status === "active" ? "bg-green-50" : "bg-gray-100"}`}>
                        <Lock size={22} className={link.status === "active" ? "text-green-600" : "text-gray-400"} />
                      </div>
                      <div>
                        <h3 className="font-bold">{link.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${link.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {link.status}
                          </span>
                          <span className="flex items-center gap-1"><Clock size={12} /> Expires: {link.expiresAt}</span>
                          <span className="flex items-center gap-1"><Shield size={12} /> Password: {link.password}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{link.plays}/{link.maxPlays} plays</span>
                      <span>{link.visitors} visitors</span>
                    </div>
                  </div>
                </div>

                {expandedLink === link.id && (
                  <div className="border-t border-gray-100 px-6 pb-6">
                    {/* URL */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 mt-4 mb-4">
                      <span className="text-sm text-[var(--primary)] font-medium flex-1 truncate">{link.url}</span>
                      <button onClick={() => handleCopy(link.url, link.id)} className="inline-flex items-center gap-1.5 text-xs bg-white border border-gray-200 text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-lg">
                        {copied === link.id ? <><CheckCircle2 size={12} className="text-green-600" /> Copied</> : <><Copy size={12} /> Copy</>}
                      </button>
                    </div>

                    {/* Recipients */}
                    {link.recipients.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-3">Recipients</h4>
                        <div className="space-y-2">
                          {link.recipients.map((r) => (
                            <div key={r.email} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5">
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${r.played ? "bg-green-500" : "bg-gray-300"}`} />
                                <div>
                                  <span className="text-sm font-medium">{r.name}</span>
                                  <span className="text-xs text-gray-500 ml-2">{r.email}</span>
                                </div>
                              </div>
                              <span className="text-xs text-gray-400">
                                {r.played ? `Played ${r.playedAt}` : "Not yet played"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{link.plays} plays used</span>
                        <span>{link.maxPlays} max</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${link.plays / link.maxPlays > 0.8 ? "bg-red-500" : "bg-[var(--primary)]"}`}
                          style={{ width: `${(link.plays / link.maxPlays) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
