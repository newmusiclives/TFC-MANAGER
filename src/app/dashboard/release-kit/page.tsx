"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Package,
  Download,
  Share2,
  Link2,
  Image,
  FileText,
  MessageSquare,
  CalendarDays,
  CheckCircle2,
  Circle,
  Loader2,
  ExternalLink,
  Copy,
  Archive,
  Eye,
  Music2,
  Sparkles,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

type AssetStatus = "ready" | "pending" | "missing";

interface ReleaseAsset {
  id: string;
  label: string;
  icon: React.ElementType;
  status: AssetStatus;
  description: string;
}

interface Release {
  id: string;
  title: string;
  artist: string;
  releaseDate: string;
  coverGradient: string;
  type: string;
  assets: ReleaseAsset[];
}

const releases: Release[] = [
  {
    id: "r1",
    title: "Midnight Dreams",
    artist: "Jordan Davis",
    releaseDate: "Jan 17, 2026",
    coverGradient: "from-purple-600 to-indigo-800",
    type: "Single",
    assets: [
      { id: "a1", label: "Smart Link", icon: Link2, status: "ready", description: "Multi-platform link page with analytics" },
      { id: "a2", label: "Promo Banners", icon: Image, status: "ready", description: "6 banners (IG Post, Story, FB, YT, Twitter, Spotify)" },
      { id: "a3", label: "Press Release", icon: FileText, status: "ready", description: "AI-generated press release with bio and quotes" },
      { id: "a4", label: "Social Content", icon: MessageSquare, status: "ready", description: "12 posts across 4 platforms" },
      { id: "a5", label: "Release Plan", icon: CalendarDays, status: "ready", description: "8-week rollout timeline with milestones" },
    ],
  },
  {
    id: "r2",
    title: "Golden Hour",
    artist: "Jordan Davis",
    releaseDate: "Mar 21, 2026",
    coverGradient: "from-amber-400 to-orange-600",
    type: "EP",
    assets: [
      { id: "b1", label: "Smart Link", icon: Link2, status: "ready", description: "Multi-platform link page with analytics" },
      { id: "b2", label: "Promo Banners", icon: Image, status: "ready", description: "6 banners (IG Post, Story, FB, YT, Twitter, Spotify)" },
      { id: "b3", label: "Press Release", icon: FileText, status: "pending", description: "AI-generated press release with bio and quotes" },
      { id: "b4", label: "Social Content", icon: MessageSquare, status: "ready", description: "8 posts across 3 platforms" },
      { id: "b5", label: "Release Plan", icon: CalendarDays, status: "missing", description: "Rollout timeline not yet created" },
    ],
  },
];

const kitContents = [
  { label: "Smart Link URL + QR Code", format: "PNG + TXT" },
  { label: "Promo Banners (all sizes)", format: "PNG" },
  { label: "Press Release", format: "PDF + DOCX" },
  { label: "Social Media Posts", format: "TXT + Images" },
  { label: "Release Plan Timeline", format: "PDF" },
  { label: "Artist Bio & Photos", format: "PDF + JPG" },
  { label: "Track Credits & Metadata", format: "PDF" },
];

export default function ReleaseKitPage() {
  const [expandedRelease, setExpandedRelease] = useState<string | null>("r1");
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<Record<string, boolean>>({ r1: true });
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = (releaseId: string) => {
    setGenerating(releaseId);
    setTimeout(() => {
      setGenerating(null);
      setGenerated((prev) => ({ ...prev, [releaseId]: true }));
    }, 2500);
  };

  const handleCopyLink = (releaseId: string) => {
    setCopiedLink(releaseId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const getReadyCount = (assets: ReleaseAsset[]) => assets.filter((a) => a.status === "ready").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">One-Click Release Kit</h1>
            <p className="text-sm text-gray-500">
              Export everything you need for your release in one package
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Eye size={16} />
              Kit Contents
            </button>
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Kit Contents Preview */}
          {showPreview && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--primary)" }}>
                  <Package size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">What&apos;s in a Release Kit?</h2>
                  <p className="text-sm text-gray-500">Every kit includes the following assets, ready for distribution</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {kitContents.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <CheckCircle2 size={16} style={{ color: "var(--primary)" }} />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.format}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Archive size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-gray-500">Total Releases</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8 / 10</p>
                  <p className="text-sm text-gray-500">Assets Ready</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Download size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-sm text-gray-500">Kits Generated</p>
                </div>
              </div>
            </div>
          </div>

          {/* Releases */}
          {releases.map((release) => {
            const isExpanded = expandedRelease === release.id;
            const isGenerating = generating === release.id;
            const isGenerated = generated[release.id];
            const readyCount = getReadyCount(release.assets);
            const allReady = readyCount === release.assets.length;

            return (
              <div key={release.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {/* Release Header */}
                <button
                  onClick={() => setExpandedRelease(isExpanded ? null : release.id)}
                  className="w-full flex items-center gap-4 p-6 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${release.coverGradient} flex items-center justify-center shadow-md`}>
                    <Music2 size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{release.title}</h3>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">{release.type}</span>
                      {isGenerated && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full text-white" style={{ backgroundColor: "var(--primary)" }}>
                          Kit Ready
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {release.artist} &middot; {release.releaseDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium" style={{ color: allReady ? "var(--primary)" : "#f59e0b" }}>
                        {readyCount}/{release.assets.length} assets
                      </p>
                      <p className="text-xs text-gray-400">{allReady ? "All ready" : "In progress"}</p>
                    </div>
                    {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-6 space-y-6">
                    {/* Asset Checklist */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Asset Checklist</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {release.assets.map((asset) => {
                          const Icon = asset.icon;
                          return (
                            <div
                              key={asset.id}
                              className={`flex items-start gap-3 p-4 rounded-xl border ${
                                asset.status === "ready"
                                  ? "border-green-100 bg-green-50/50"
                                  : asset.status === "pending"
                                  ? "border-amber-100 bg-amber-50/50"
                                  : "border-gray-100 bg-gray-50"
                              }`}
                            >
                              {asset.status === "ready" ? (
                                <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                              ) : asset.status === "pending" ? (
                                <Loader2 size={18} className="text-amber-500 mt-0.5 flex-shrink-0 animate-spin" />
                              ) : (
                                <Circle size={18} className="text-gray-300 mt-0.5 flex-shrink-0" />
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <Icon size={14} className="text-gray-500" />
                                  <p className="text-sm font-medium text-gray-800">{asset.label}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{asset.description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Generate / Download Area */}
                    {!isGenerated && !isGenerating && (
                      <div className="flex items-center justify-between p-5 rounded-xl bg-gray-50 border border-dashed border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {allReady
                              ? "All assets are ready. Generate your release kit now!"
                              : "Some assets are still being created. You can generate a partial kit."}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Kit includes all ready assets bundled into a shareable package
                          </p>
                        </div>
                        <button
                          onClick={() => handleGenerate(release.id)}
                          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: "var(--primary)" }}
                        >
                          <Sparkles size={16} />
                          Generate Kit
                        </button>
                      </div>
                    )}

                    {isGenerating && (
                      <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-gray-50 border border-gray-200">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: "var(--primary)" }}>
                          <Loader2 size={24} className="text-white animate-spin" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">Generating your release kit...</p>
                        <p className="text-xs text-gray-400 mt-1">Bundling {readyCount} assets into a single package</p>
                        <div className="w-48 h-1.5 rounded-full bg-gray-200 mt-4 overflow-hidden">
                          <div className="h-full rounded-full animate-pulse" style={{ backgroundColor: "var(--primary)", width: "65%" }} />
                        </div>
                      </div>
                    )}

                    {isGenerated && (
                      <div className="rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-5 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--primary)" }}>
                              <Package size={20} className="text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{release.title} - Release Kit</p>
                              <p className="text-xs text-gray-400">{readyCount} assets &middot; ~24 MB &middot; Generated just now</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyLink(release.id)}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                              {copiedLink === release.id ? (
                                <>
                                  <CheckCircle2 size={14} style={{ color: "var(--primary)" }} />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy size={14} />
                                  Copy Link
                                </>
                              )}
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                              <Globe size={14} />
                              Share Page
                            </button>
                            <button
                              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: "var(--primary)" }}
                            >
                              <Download size={14} />
                              Download ZIP
                            </button>
                          </div>
                        </div>
                        {/* Kit preview items */}
                        <div className="border-t border-gray-100 divide-y divide-gray-50">
                          {kitContents.map((item) => (
                            <div key={item.label} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <CheckCircle2 size={14} style={{ color: "var(--primary)" }} />
                                <span className="text-sm text-gray-700">{item.label}</span>
                              </div>
                              <span className="text-xs text-gray-400 font-mono">{item.format}</span>
                            </div>
                          ))}
                        </div>
                        {/* Share options */}
                        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Share2 size={14} className="text-gray-400" />
                              <span className="text-xs text-gray-500">Share options:</span>
                            </div>
                            <button className="flex items-center gap-1.5 text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: "var(--primary)" }}>
                              <Globe size={12} />
                              Hosted Page
                            </button>
                            <button className="flex items-center gap-1.5 text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: "var(--primary)" }}>
                              <ExternalLink size={12} />
                              Direct Link
                            </button>
                            <button className="flex items-center gap-1.5 text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: "var(--primary)" }}>
                              <Download size={12} />
                              ZIP Archive
                            </button>
                          </div>
                        </div>
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
