"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Search,
  Plus,
  Link2,
  Copy,
  ExternalLink,
  BarChart3,
  MoreVertical,
  Music2,
  Eye,
  MousePointerClick,
  QrCode,
  Trash2,
  Edit3,
} from "lucide-react";
import { useState } from "react";

const smartLinks = [
  {
    id: "sl1",
    title: "Midnight Dreams",
    slug: "midnight-dreams",
    url: "https://tfm.link/midnight-dreams",
    clicks: 2847,
    views: 4210,
    platforms: [
      { name: "Spotify", url: "#", clicks: 1240 },
      { name: "Apple Music", url: "#", clicks: 680 },
      { name: "YouTube Music", url: "#", clicks: 520 },
      { name: "Deezer", url: "#", clicks: 210 },
      { name: "Tidal", url: "#", clicks: 97 },
      { name: "SoundCloud", url: "#", clicks: 100 },
    ],
    createdAt: "Dec 10, 2025",
    status: "active",
  },
  {
    id: "sl2",
    title: "Electric Feel",
    slug: "electric-feel",
    url: "https://tfm.link/electric-feel",
    clicks: 1934,
    views: 3120,
    platforms: [
      { name: "Spotify", url: "#", clicks: 890 },
      { name: "Apple Music", url: "#", clicks: 450 },
      { name: "YouTube Music", url: "#", clicks: 340 },
      { name: "Deezer", url: "#", clicks: 154 },
      { name: "Tidal", url: "#", clicks: 60 },
      { name: "SoundCloud", url: "#", clicks: 40 },
    ],
    createdAt: "Sep 28, 2025",
    status: "active",
  },
  {
    id: "sl3",
    title: "Summer Waves EP",
    slug: "summer-waves-ep",
    url: "https://tfm.link/summer-waves-ep",
    clicks: 3421,
    views: 5680,
    platforms: [
      { name: "Spotify", url: "#", clicks: 1560 },
      { name: "Apple Music", url: "#", clicks: 820 },
      { name: "YouTube Music", url: "#", clicks: 610 },
      { name: "Deezer", url: "#", clicks: 280 },
      { name: "Tidal", url: "#", clicks: 91 },
      { name: "SoundCloud", url: "#", clicks: 60 },
    ],
    createdAt: "Jul 15, 2025",
    status: "active",
  },
];

export default function SmartLinksPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Smart Links</h1>
            <p className="text-sm text-gray-500">
              One link for all streaming platforms
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus size={16} /> Create Smart Link
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
              <h2 className="font-bold text-lg mb-4">Create New Smart Link</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Release Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Golden Hour"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Custom Slug
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-500">
                      tfm.link/
                    </span>
                    <input
                      type="text"
                      placeholder="golden-hour"
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-r-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                    />
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700">
                Platform Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {[
                  "Spotify",
                  "Apple Music",
                  "YouTube Music",
                  "Deezer",
                  "Tidal",
                  "SoundCloud",
                  "Amazon Music",
                  "Bandcamp",
                ].map((p) => (
                  <div key={p} className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 w-28 shrink-0">
                      {p}
                    </label>
                    <input
                      type="url"
                      placeholder={`Paste ${p} link...`}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors">
                  Create Link
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Link2 size={18} className="text-blue-600" />
                </div>
                <span className="text-sm text-gray-500">Total Links</span>
              </div>
              <div className="text-2xl font-bold">{smartLinks.length}</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
                  <MousePointerClick size={18} className="text-green-600" />
                </div>
                <span className="text-sm text-gray-500">Total Clicks</span>
              </div>
              <div className="text-2xl font-bold">
                {smartLinks
                  .reduce((a, l) => a + l.clicks, 0)
                  .toLocaleString()}
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Eye size={18} className="text-purple-600" />
                </div>
                <span className="text-sm text-gray-500">Total Views</span>
              </div>
              <div className="text-2xl font-bold">
                {smartLinks
                  .reduce((a, l) => a + l.views, 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>

          {/* Links list */}
          <div className="space-y-4">
            {smartLinks.map((link) => (
              <div
                key={link.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center">
                        <Music2
                          size={22}
                          className="text-[var(--primary)]"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{link.title}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm text-[var(--primary)] font-medium">
                            {link.url}
                          </span>
                          <button
                            onClick={() => handleCopy(link.url, link.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Copy size={14} />
                          </button>
                          {copied === link.id && (
                            <span className="text-xs text-green-600 font-medium">
                              Copied!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                        <QrCode size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-6 mb-4 text-sm">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <Eye size={14} />{" "}
                      <strong className="text-gray-800">
                        {link.views.toLocaleString()}
                      </strong>{" "}
                      views
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <MousePointerClick size={14} />{" "}
                      <strong className="text-gray-800">
                        {link.clicks.toLocaleString()}
                      </strong>{" "}
                      clicks
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <BarChart3 size={14} />{" "}
                      <strong className="text-gray-800">
                        {((link.clicks / link.views) * 100).toFixed(1)}%
                      </strong>{" "}
                      CTR
                    </span>
                    <span className="text-gray-400">
                      Created {link.createdAt}
                    </span>
                  </div>

                  {/* Platform breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {link.platforms.map((p) => (
                      <div
                        key={p.name}
                        className="bg-gray-50 rounded-lg p-3 text-center"
                      >
                        <div className="text-xs text-gray-500 mb-1">
                          {p.name}
                        </div>
                        <div className="font-bold text-sm">
                          {p.clicks.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">clicks</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
