"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Link2,
  ExternalLink,
  Eye,
  MousePointerClick,
  BarChart3,
  GripVertical,
  Plus,
  Trash2,
  Upload,
  Disc3,
  Music2,
  Mail,
  CalendarDays,
  Heart,
  ShoppingBag,
  Globe,
  Palette,
  Type,
  ToggleLeft,
  ToggleRight,
  Sun,
  Moon,
  Sparkles,
  ChevronDown,
  Check,
  Copy,
} from "lucide-react";
import { useState } from "react";

interface LinkBlock {
  id: string;
  type: string;
  title: string;
  url: string;
  clicks: number;
  enabled: boolean;
}

const linkTypeOptions = [
  { type: "latest-release", label: "Latest Release", icon: Disc3 },
  { type: "social-profile", label: "Social Profile", icon: Globe },
  { type: "custom-link", label: "Custom Link", icon: Link2 },
  { type: "mailing-list", label: "Mailing List Signup", icon: Mail },
  { type: "upcoming-show", label: "Upcoming Show", icon: CalendarDays },
  { type: "fan-funding", label: "Fan Funding", icon: Heart },
  { type: "merch-store", label: "Merch Store", icon: ShoppingBag },
];

const defaultLinks: LinkBlock[] = [
  { id: "1", type: "latest-release", title: "Midnight Dreams", url: "https://truefans.link/s/midnight-dreams", clicks: 890, enabled: true },
  { id: "2", type: "social-profile", title: "Spotify Profile", url: "https://open.spotify.com/artist/jordandavis", clicks: 420, enabled: true },
  { id: "3", type: "latest-release", title: "New EP Pre-Save", url: "https://truefans.link/s/summer-waves-ep", clicks: 380, enabled: true },
  { id: "4", type: "mailing-list", title: "Join Mailing List", url: "https://truefans.link/ml/jordandavis", clicks: 310, enabled: true },
  { id: "5", type: "fan-funding", title: "Support on Fan Funding", url: "https://truefans.link/fund/jordandavis", clicks: 190, enabled: true },
];

const linkIconMap: Record<string, typeof Disc3> = {
  "latest-release": Disc3,
  "social-profile": Globe,
  "custom-link": Link2,
  "mailing-list": Mail,
  "upcoming-show": CalendarDays,
  "fan-funding": Heart,
  "merch-store": ShoppingBag,
};

export default function LinkInBioPage() {
  const [profileName, setProfileName] = useState("Jordan Davis");
  const [bio, setBio] = useState("Independent artist. Dreamer. Making waves one track at a time.");
  const [links, setLinks] = useState<LinkBlock[]>(defaultLinks);
  const [theme, setTheme] = useState<"dark" | "light" | "gradient">("dark");
  const [accentColor, setAccentColor] = useState("#7c3aed");
  const [fontStyle, setFontStyle] = useState<"modern" | "classic" | "rounded">("modern");
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyUrl = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const removeLink = (id: string) => {
    setLinks(links.filter((l) => l.id !== id));
  };

  const toggleLink = (id: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  };

  const addLink = () => {
    const newLink: LinkBlock = {
      id: Date.now().toString(),
      type: "custom-link",
      title: "New Link",
      url: "https://",
      clicks: 0,
      enabled: true,
    };
    setLinks([...links, newLink]);
  };

  const updateLink = (id: string, field: keyof LinkBlock, value: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const topLink = links.reduce((top, l) => (l.clicks > top.clicks ? l : top), links[0]);

  // Theme styles for preview
  const previewBg =
    theme === "dark"
      ? "bg-gray-900"
      : theme === "gradient"
        ? "bg-gradient-to-b from-purple-900 via-indigo-900 to-gray-900"
        : "bg-white";
  const previewText = theme === "light" ? "text-gray-900" : "text-white";
  const previewSubtext = theme === "light" ? "text-gray-500" : "text-gray-400";
  const previewBtnBg = theme === "light" ? "bg-gray-100 hover:bg-gray-200" : "bg-white/10 hover:bg-white/15";
  const previewBtnText = theme === "light" ? "text-gray-800" : "text-white";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Link-in-Bio</h1>
            <p className="text-sm text-gray-500">Build your personalized landing page</p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={copyUrl}
            >
              <Link2 size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">truefans.link/jordandavis</span>
              {copied ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <Copy size={14} className="text-gray-400" />
              )}
            </div>
            <button className="flex items-center gap-2 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              Publish
              <ExternalLink size={14} />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="flex gap-8">
            {/* Editor Column */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Profile Section */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-lg mb-4">Profile</h2>
                <div className="flex items-start gap-5">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold">
                      JD
                    </div>
                    <button className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload size={18} className="text-white" />
                    </button>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Display Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Bio</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={2}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Links Section */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">Links</h2>
                  <button
                    onClick={addLink}
                    className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <Plus size={16} />
                    Add Link
                  </button>
                </div>
                <div className="space-y-3">
                  {links.map((link) => {
                    const IconComponent = linkIconMap[link.type] || Link2;
                    return (
                      <div
                        key={link.id}
                        className={`border rounded-xl p-4 transition-all ${
                          link.enabled ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50 opacity-60"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 cursor-grab text-gray-300 hover:text-gray-400">
                            <GripVertical size={16} />
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                            <IconComponent size={14} className="text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <input
                              type="text"
                              value={link.title}
                              onChange={(e) => updateLink(link.id, "title", e.target.value)}
                              className="w-full text-sm font-medium bg-transparent focus:outline-none focus:bg-gray-50 rounded px-1 -ml-1"
                            />
                            <input
                              type="text"
                              value={link.url}
                              onChange={(e) => updateLink(link.id, "url", e.target.value)}
                              className="w-full text-xs text-gray-400 bg-transparent focus:outline-none focus:bg-gray-50 rounded px-1 -ml-1"
                            />
                            <div className="flex items-center gap-3">
                              <select
                                value={link.type}
                                onChange={(e) => updateLink(link.id, "type", e.target.value)}
                                className="text-xs bg-gray-50 border border-gray-200 rounded-md px-2 py-1 focus:outline-none"
                              >
                                {linkTypeOptions.map((opt) => (
                                  <option key={opt.type} value={opt.type}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              {showAnalytics && (
                                <span className="text-xs text-gray-400">
                                  <MousePointerClick size={10} className="inline mr-1" />
                                  {link.clicks} clicks
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleLink(link.id)}
                              className="text-gray-300 hover:text-gray-500"
                            >
                              {link.enabled ? (
                                <ToggleRight size={20} className="text-purple-500" />
                              ) : (
                                <ToggleLeft size={20} />
                              )}
                            </button>
                            <button
                              onClick={() => removeLink(link.id)}
                              className="text-gray-300 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Style Section */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-lg mb-4">Style</h2>
                <div className="space-y-5">
                  {/* Theme Toggle */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-2 block">Theme</label>
                    <div className="flex gap-2">
                      {[
                        { value: "dark" as const, label: "Dark", icon: Moon },
                        { value: "light" as const, label: "Light", icon: Sun },
                        { value: "gradient" as const, label: "Gradient", icon: Sparkles },
                      ].map((t) => (
                        <button
                          key={t.value}
                          onClick={() => setTheme(t.value)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            theme === t.value
                              ? "bg-gray-900 text-white"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <t.icon size={14} />
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-2 block">Accent Color</label>
                    <div className="flex items-center gap-3">
                      {["#7c3aed", "#00c878", "#3b82f6", "#f59e0b", "#ef4444", "#ec4899", "#06b6d4"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setAccentColor(color)}
                          className={`w-8 h-8 rounded-full transition-all ${
                            accentColor === color ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <div className="relative">
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="w-8 h-8 rounded-full cursor-pointer appearance-none border-2 border-dashed border-gray-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Font Style */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-2 block">Font Style</label>
                    <div className="flex gap-2">
                      {[
                        { value: "modern" as const, label: "Modern" },
                        { value: "classic" as const, label: "Classic" },
                        { value: "rounded" as const, label: "Rounded" },
                      ].map((f) => (
                        <button
                          key={f.value}
                          onClick={() => setFontStyle(f.value)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            fontStyle === f.value
                              ? "bg-gray-900 text-white"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <Type size={12} className="inline mr-1.5" />
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Analytics Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <div className="text-sm font-medium">Show Click Counts</div>
                      <div className="text-xs text-gray-500">Display analytics on link editor</div>
                    </div>
                    <button onClick={() => setShowAnalytics(!showAnalytics)}>
                      {showAnalytics ? (
                        <ToggleRight size={28} className="text-purple-500" />
                      ) : (
                        <ToggleLeft size={28} className="text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-lg mb-4">Page Analytics</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Page Views", value: "4,280", icon: Eye, color: "bg-blue-50 text-blue-600" },
                    { label: "Total Clicks", value: "2,190", icon: MousePointerClick, color: "bg-green-50 text-green-600" },
                    { label: "CTR", value: "51.2%", icon: BarChart3, color: "bg-purple-50 text-purple-600" },
                    { label: "Top Link", value: topLink?.title || "N/A", icon: Sparkles, color: "bg-amber-50 text-amber-600", sub: `${topLink?.clicks || 0} clicks` },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color} mb-2`}>
                        <s.icon size={15} />
                      </div>
                      <div className="text-lg font-bold">{s.value}</div>
                      <div className="text-xs text-gray-500">{s.label}</div>
                      {"sub" in s && s.sub && <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Phone Preview Column */}
            <div className="w-[380px] flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="text-sm font-medium text-gray-500 mb-3 text-center">Live Preview</h3>
                {/* Phone Frame */}
                <div className="mx-auto w-[320px] rounded-[3rem] border-[8px] border-gray-800 bg-gray-800 shadow-2xl overflow-hidden">
                  {/* Notch */}
                  <div className="relative bg-gray-800 flex justify-center py-2">
                    <div className="w-28 h-5 bg-gray-900 rounded-full" />
                  </div>
                  {/* Screen */}
                  <div className={`${previewBg} min-h-[560px] px-5 py-6 overflow-y-auto`}>
                    {/* Profile */}
                    <div className="flex flex-col items-center mb-6">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3"
                        style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)` }}
                      >
                        JD
                      </div>
                      <h2 className={`font-bold text-lg ${previewText}`}>{profileName}</h2>
                      <p className={`text-xs text-center mt-1 px-4 leading-relaxed ${previewSubtext}`}>
                        {bio}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-2.5">
                      {links
                        .filter((l) => l.enabled)
                        .map((link) => {
                          const IconComponent = linkIconMap[link.type] || Link2;
                          return (
                            <button
                              key={link.id}
                              className={`w-full ${previewBtnBg} ${previewBtnText} rounded-xl px-4 py-3 flex items-center gap-3 transition-all text-left`}
                              style={{ borderLeft: `3px solid ${accentColor}` }}
                            >
                              <IconComponent size={16} style={{ color: accentColor }} />
                              <span className="text-sm font-medium flex-1">{link.title}</span>
                              <ExternalLink size={12} className="opacity-40" />
                            </button>
                          );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex justify-center">
                      <div className={`text-xs ${previewSubtext} flex items-center gap-1`}>
                        <Music2 size={10} />
                        truefans.link
                      </div>
                    </div>
                  </div>
                  {/* Home Indicator */}
                  <div className="bg-gray-800 flex justify-center py-2">
                    <div className="w-28 h-1 bg-gray-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
