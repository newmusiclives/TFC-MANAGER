"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Globe,
  Eye,
  ExternalLink,
  Edit3,
  Save,
  Palette,
  Type,
  Image,
  Music2,
  Mail,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

const themes = [
  { id: "dark", name: "Dark", bg: "bg-gray-900", text: "text-white" },
  { id: "light", name: "Light", bg: "bg-white", text: "text-gray-900" },
  { id: "gradient", name: "Gradient", bg: "bg-gradient-to-br from-purple-900 to-indigo-900", text: "text-white" },
  { id: "minimal", name: "Minimal", bg: "bg-gray-50", text: "text-gray-800" },
];

export default function WebsitePage() {
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Artist Website / EPK</h1>
            <p className="text-sm text-gray-500">
              Your professional electronic press kit
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setActiveTab("editor")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "editor"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                <Edit3 size={14} className="inline mr-1.5" />
                Editor
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "preview"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500"
                }`}
              >
                <Eye size={14} className="inline mr-1.5" />
                Preview
              </button>
            </div>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
            >
              {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
              {saved ? "Saved!" : "Save & Publish"}
            </button>
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          {activeTab === "editor" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Editor panels */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic info */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Type size={20} className="text-[var(--primary)]" /> Basic
                    Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Artist / Band Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Jordan Davis"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Tagline
                      </label>
                      <input
                        type="text"
                        defaultValue="Independent artist blending pop, electronic, and indie"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Bio
                      </label>
                      <textarea
                        rows={4}
                        defaultValue="Jordan Davis is an independent artist based in Los Angeles, blending pop, electronic, and indie influences to create music that connects hearts and moves feet. With over 128K streams across platforms and a growing fanbase, Jordan is quickly becoming a standout voice in the indie-electronic scene."
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">
                          Genre
                        </label>
                        <input
                          type="text"
                          defaultValue="Pop / Electronic / Indie"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">
                          Location
                        </label>
                        <input
                          type="text"
                          defaultValue="Los Angeles, CA"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Image size={20} className="text-[var(--primary)]" /> Media
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Profile Photo
                      </label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[var(--primary)]/40 transition-colors cursor-pointer">
                        <Image
                          size={32}
                          className="mx-auto text-gray-300 mb-2"
                        />
                        <p className="text-sm text-gray-500">
                          Drop image or click to upload
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Recommended: 800x800px
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Banner Image
                      </label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[var(--primary)]/40 transition-colors cursor-pointer">
                        <Image
                          size={32}
                          className="mx-auto text-gray-300 mb-2"
                        />
                        <p className="text-sm text-gray-500">
                          Drop image or click to upload
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Recommended: 1920x600px
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Music embeds */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Music2 size={20} className="text-[var(--primary)]" />{" "}
                    Featured Music
                  </h2>
                  <div className="space-y-3">
                    {[
                      "Midnight Dreams",
                      "Electric Feel",
                      "Summer Waves EP",
                    ].map((track) => (
                      <div
                        key={track}
                        className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Music2 size={16} className="text-gray-400" />
                          </div>
                          <span className="font-medium text-sm">{track}</span>
                        </div>
                        <button className="text-xs text-red-500 hover:underline">
                          Remove
                        </button>
                      </div>
                    ))}
                    <button className="w-full border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-gray-500 hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-colors">
                      + Add featured track
                    </button>
                  </div>
                </div>

                {/* Contact / Booking */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Mail size={20} className="text-[var(--primary)]" /> Contact
                    & Booking
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Booking Email
                      </label>
                      <input
                        type="email"
                        defaultValue="booking@jordandavis.com"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Management Email
                      </label>
                      <input
                        type="email"
                        defaultValue="mgmt@jordandavis.com"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Press Email
                      </label>
                      <input
                        type="email"
                        defaultValue="press@jordandavis.com"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right sidebar - Theme & Social */}
              <div className="space-y-6">
                {/* Theme picker */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Palette size={20} className="text-[var(--primary)]" />{" "}
                    Theme
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTheme(t.id)}
                        className={`h-20 rounded-xl ${t.bg} ${t.text} text-sm font-medium flex items-center justify-center border-2 transition-all ${
                          selectedTheme === t.id
                            ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
                            : "border-transparent"
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1.5">
                      Accent Color
                    </label>
                    <div className="flex gap-2">
                      {["#00c878", "#7c3aed", "#ef4444", "#f59e0b", "#3b82f6", "#ec4899"].map(
                        (c) => (
                          <button
                            key={c}
                            className="w-8 h-8 rounded-full border-2 border-gray-200 hover:scale-110 transition-transform"
                            style={{ backgroundColor: c }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Share2 size={20} className="text-[var(--primary)]" />{" "}
                    Social Links
                  </h2>
                  <div className="space-y-3">
                    {[
                      { name: "Instagram", placeholder: "@jordandavis" },
                      { name: "TikTok", placeholder: "@jordandavis" },
                      { name: "Twitter / X", placeholder: "@jordandavis" },
                      { name: "YouTube", placeholder: "Channel URL" },
                      { name: "Facebook", placeholder: "Page URL" },
                    ].map((s) => (
                      <div key={s.name}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {s.name}
                        </label>
                        <input
                          type="text"
                          placeholder={s.placeholder}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Website URL */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Globe size={16} className="text-[var(--primary)]" /> Your
                    Website URL
                  </h2>
                  <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-[var(--primary)] font-medium">
                      truefans.link/jordandavis
                    </span>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Share this link with press, fans, and on your socials
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Preview */
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-900 text-white">
                {/* Preview banner */}
                <div className="h-48 bg-gradient-to-r from-[var(--primary)] via-emerald-400 to-teal-500 relative">
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="px-8 pb-8 -mt-16 relative">
                  <div className="w-32 h-32 bg-gray-700 border-4 border-gray-900 rounded-2xl flex items-center justify-center mb-4">
                    <Music2 size={48} className="text-gray-500" />
                  </div>
                  <h2 className="text-3xl font-bold">Jordan Davis</h2>
                  <p className="text-gray-400 mt-1">
                    Independent artist blending pop, electronic, and indie
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Los Angeles, CA &bull; Pop / Electronic / Indie
                  </p>

                  <div className="flex gap-3 mt-6">
                    {["Spotify", "Apple Music", "YouTube", "Instagram", "TikTok"].map(
                      (p) => (
                        <span
                          key={p}
                          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors"
                        >
                          {p}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="px-8 pb-8">
                  <h3 className="font-bold text-lg mb-4">Featured Music</h3>
                  <div className="space-y-3">
                    {["Midnight Dreams", "Electric Feel", "Summer Waves EP"].map(
                      (t) => (
                        <div
                          key={t}
                          className="bg-gray-800 rounded-xl p-4 flex items-center gap-4"
                        >
                          <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center">
                            <Music2 size={24} className="text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{t}</div>
                            <div className="text-sm text-gray-500">
                              Jordan Davis
                            </div>
                          </div>
                          <button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
                            Listen
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="px-8 pb-8">
                  <h3 className="font-bold text-lg mb-4">Bio</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Jordan Davis is an independent artist based in Los Angeles,
                    blending pop, electronic, and indie influences to create
                    music that connects hearts and moves feet. With over 128K
                    streams across platforms and a growing fanbase, Jordan is
                    quickly becoming a standout voice in the indie-electronic
                    scene.
                  </p>
                </div>

                <div className="px-8 pb-8">
                  <h3 className="font-bold text-lg mb-4">Contact</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Booking</div>
                      <div>booking@jordandavis.com</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Management</div>
                      <div>mgmt@jordandavis.com</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Press</div>
                      <div>press@jordandavis.com</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
