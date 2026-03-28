"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Image,
  Download,
  Plus,
  Trash2,
  Edit3,
  Palette,
  Type,
  Square,
  RectangleHorizontal,
  Smartphone,
  Monitor,
  Copy,
  CheckCircle2,
  Music2,
} from "lucide-react";
import { useState } from "react";

type BannerSize = "instagram-post" | "instagram-story" | "facebook-cover" | "youtube-thumb" | "twitter-header" | "spotify-canvas";

const bannerSizes: { id: BannerSize; label: string; dims: string; icon: React.ElementType }[] = [
  { id: "instagram-post", label: "Instagram Post", dims: "1080 x 1080", icon: Square },
  { id: "instagram-story", label: "Instagram Story", dims: "1080 x 1920", icon: Smartphone },
  { id: "facebook-cover", label: "Facebook Cover", dims: "820 x 312", icon: RectangleHorizontal },
  { id: "youtube-thumb", label: "YouTube Thumbnail", dims: "1280 x 720", icon: Monitor },
  { id: "twitter-header", label: "Twitter Header", dims: "1500 x 500", icon: RectangleHorizontal },
  { id: "spotify-canvas", label: "Spotify Canvas", dims: "720 x 720", icon: Square },
];

const templates = [
  { id: 1, name: "Neon Glow", colors: "from-purple-600 to-pink-600" },
  { id: 2, name: "Dark Minimal", colors: "from-gray-900 to-gray-800" },
  { id: 3, name: "Sunset Vibes", colors: "from-orange-500 to-red-600" },
  { id: 4, name: "Ocean Wave", colors: "from-cyan-500 to-blue-600" },
  { id: 5, name: "Forest Green", colors: "from-green-600 to-emerald-700" },
  { id: 6, name: "Golden Hour", colors: "from-amber-400 to-orange-500" },
];

const savedBanners = [
  { id: "b1", name: "Midnight Dreams - IG Post", size: "Instagram Post", createdAt: "Dec 12, 2025", template: "Neon Glow" },
  { id: "b2", name: "Midnight Dreams - Story", size: "Instagram Story", createdAt: "Dec 12, 2025", template: "Dark Minimal" },
  { id: "b3", name: "Electric Feel - YT Thumb", size: "YouTube Thumbnail", createdAt: "Sep 30, 2025", template: "Sunset Vibes" },
  { id: "b4", name: "Summer Waves - FB Cover", size: "Facebook Cover", createdAt: "Jul 18, 2025", template: "Ocean Wave" },
];

export default function BannerCreatorPage() {
  const [selectedSize, setSelectedSize] = useState<BannerSize>("instagram-post");
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [title, setTitle] = useState("Midnight Dreams");
  const [subtitle, setSubtitle] = useState("New Single Out Now");
  const [artistName, setArtistName] = useState("Jordan Davis");
  const [tab, setTab] = useState<"create" | "saved">("create");

  const currentSize = bannerSizes.find((s) => s.id === selectedSize)!;
  const currentTemplate = templates.find((t) => t.id === selectedTemplate)!;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Promo Banner Creator</h1>
            <p className="text-sm text-gray-500">
              Generate platform-specific visuals for your releases
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setTab("create")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === "create" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
              >
                Create
              </button>
              <button
                onClick={() => setTab("saved")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === "saved" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}
              >
                Saved ({savedBanners.length})
              </button>
            </div>
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          {tab === "create" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Controls */}
              <div className="space-y-6">
                {/* Size */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-sm mb-3">Banner Size</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {bannerSizes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSize(s.id)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl text-xs transition-colors ${
                          selectedSize === s.id
                            ? "bg-[var(--primary)]/10 text-[var(--primary)] ring-1 ring-[var(--primary)]/30"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <s.icon size={18} />
                        <span className="font-medium">{s.label}</span>
                        <span className="text-xs text-gray-400">{s.dims}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Palette size={16} /> Template
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`h-16 rounded-lg bg-gradient-to-br ${t.colors} border-2 transition-all ${
                          selectedTemplate === t.id
                            ? "border-white ring-2 ring-[var(--primary)]"
                            : "border-transparent"
                        }`}
                        title={t.name}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">{currentTemplate.name}</p>
                </div>

                {/* Text */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Type size={16} /> Text Content
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Artist Name</label>
                      <input
                        type="text"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Image upload */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Image size={16} /> Cover Art
                  </h2>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[var(--primary)]/40 transition-colors cursor-pointer">
                    <Image size={28} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Upload cover art</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-bold text-lg">Preview</h2>
                    <div className="flex gap-2">
                      <button className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-4 py-2 rounded-lg transition-colors">
                        <Copy size={14} /> Save
                      </button>
                      <button className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors">
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center bg-gray-100 rounded-xl p-8">
                    <div
                      className={`bg-gradient-to-br ${currentTemplate.colors} rounded-xl flex flex-col items-center justify-center text-white relative overflow-hidden`}
                      style={{
                        width: selectedSize === "instagram-story" ? "240px" : selectedSize === "facebook-cover" || selectedSize === "twitter-header" ? "480px" : "360px",
                        height: selectedSize === "instagram-story" ? "426px" : selectedSize === "facebook-cover" ? "183px" : selectedSize === "twitter-header" ? "160px" : selectedSize === "youtube-thumb" ? "203px" : "360px",
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="relative z-10 text-center px-6">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Music2 size={32} className="text-white/80" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{title}</h3>
                        <p className="text-sm text-white/70 mb-3">{subtitle}</p>
                        <p className="text-xs font-medium text-white/50 uppercase tracking-widest">
                          {artistName}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-3">
                    {currentSize.label} &bull; {currentSize.dims}px
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Saved banners */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {savedBanners.map((b) => (
                <div key={b.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className={`h-40 bg-gradient-to-br ${templates.find((t) => t.name === b.template)?.colors || "from-gray-400 to-gray-600"} flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <Music2 size={32} className="mx-auto mb-2 text-white/60" />
                      <div className="font-bold">{b.name.split(" - ")[0]}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm">{b.name}</h3>
                    <p className="text-xs text-gray-500">{b.size} &bull; {b.createdAt}</p>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                        <Edit3 size={12} /> Edit
                      </button>
                      <button className="flex-1 text-xs bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                        <Download size={12} /> Download
                      </button>
                      <button className="text-xs bg-red-50 hover:bg-red-100 text-red-500 font-medium py-2 px-3 rounded-lg transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
