"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Mic,
  Camera,
  StickyNote,
  Music2,
  UserPlus,
  CheckSquare,
  Link2,
  Search,
  Filter,
  Plus,
  Tag,
  Edit3,
  Archive,
  Trash2,
  ArrowRight,
  Clock,
  ChevronDown,
  Inbox,
  Sparkles,
  Bookmark,
} from "lucide-react";
import { useState } from "react";

type CaptureType = "note" | "lyric" | "contact" | "task" | "link";
type Priority = "low" | "medium" | "high";

const typeConfig: Record<CaptureType, { icon: typeof StickyNote; color: string; bg: string }> = {
  note: { icon: StickyNote, color: "text-blue-600", bg: "bg-blue-50" },
  lyric: { icon: Music2, color: "text-purple-600", bg: "bg-purple-50" },
  contact: { icon: UserPlus, color: "text-green-600", bg: "bg-green-50" },
  task: { icon: CheckSquare, color: "text-orange-600", bg: "bg-orange-50" },
  link: { icon: Link2, color: "text-cyan-600", bg: "bg-cyan-50" },
};

const priorityConfig: Record<Priority, { color: string; dot: string }> = {
  low: { color: "text-gray-400", dot: "bg-gray-300" },
  medium: { color: "text-amber-500", dot: "bg-amber-400" },
  high: { color: "text-red-500", dot: "bg-red-500" },
};

const tagColors: Record<string, string> = {
  lyrics: "bg-purple-100 text-purple-700",
  production: "bg-blue-100 text-blue-700",
  marketing: "bg-pink-100 text-pink-700",
  visual: "bg-teal-100 text-teal-700",
  collab: "bg-indigo-100 text-indigo-700",
  "golden-hour": "bg-amber-100 text-amber-700",
  press: "bg-rose-100 text-rose-700",
  contacts: "bg-green-100 text-green-700",
  merch: "bg-orange-100 text-orange-700",
  business: "bg-slate-100 text-slate-700",
  mixing: "bg-cyan-100 text-cyan-700",
  fans: "bg-fuchsia-100 text-fuchsia-700",
  gigs: "bg-lime-100 text-lime-700",
  ep: "bg-violet-100 text-violet-700",
};

interface CaptureItem {
  id: number;
  type: CaptureType;
  content: string;
  tags: string[];
  priority: Priority;
  time: string;
}

const mockCaptures: CaptureItem[] = [
  {
    id: 1,
    type: "lyric",
    content: "Chasing shadows in the golden light / every ending feels like taking flight",
    tags: ["lyrics", "golden-hour"],
    priority: "medium",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "note",
    content: "Try 808 pattern from Davi Lux's latest — could work for bridge section",
    tags: ["production"],
    priority: "medium",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "contact",
    content: "Met Sarah from Pitchfork at SXSW — email: sarah@pitchfork.com — interested in reviewing next EP",
    tags: ["press", "contacts"],
    priority: "high",
    time: "1 day ago",
  },
  {
    id: 4,
    type: "task",
    content: "Research vinyl pressing costs for EP physical release",
    tags: ["merch", "business"],
    priority: "medium",
    time: "1 day ago",
  },
  {
    id: 5,
    type: "link",
    content: "https://example.com/mixing-tips — Great article on vocal chain for indie pop",
    tags: ["production", "mixing"],
    priority: "low",
    time: "2 days ago",
  },
  {
    id: 6,
    type: "lyric",
    content: "Neon reflections on the dashboard / driving nowhere felt like freedom",
    tags: ["lyrics"],
    priority: "low",
    time: "3 days ago",
  },
  {
    id: 7,
    type: "note",
    content: "Fan @luna_music covered Midnight Dreams on TikTok — repost and engage!",
    tags: ["marketing", "fans"],
    priority: "high",
    time: "3 days ago",
  },
  {
    id: 8,
    type: "contact",
    content: "DJ Flux wants to collab on a remix — flux@email.com",
    tags: ["collab"],
    priority: "medium",
    time: "4 days ago",
  },
  {
    id: 9,
    type: "note",
    content: "Venue The Echo confirmed for Apr 12 — need to send rider",
    tags: ["gigs"],
    priority: "high",
    time: "5 days ago",
  },
  {
    id: 10,
    type: "task",
    content: "Update EPK with new press photos",
    tags: ["marketing"],
    priority: "medium",
    time: "1 week ago",
  },
  {
    id: 11,
    type: "lyric",
    content: "We were infinite in that moment / time forgot to move",
    tags: ["lyrics", "ep"],
    priority: "low",
    time: "1 week ago",
  },
  {
    id: 12,
    type: "note",
    content: "Banner concept: split screen — day/night city — matches Golden Hour theme",
    tags: ["visual"],
    priority: "medium",
    time: "2 weeks ago",
  },
];

const allTags = ["lyrics", "production", "marketing", "visual", "collab", "golden-hour", "press", "contacts", "merch", "business", "mixing", "fans", "gigs", "ep"];

const captureTypes: CaptureType[] = ["note", "lyric", "contact", "task", "link"];

export default function QuickCapturePage() {
  const [activeType, setActiveType] = useState<CaptureType>("note");
  const [filterType, setFilterType] = useState<CaptureType | "all">("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("medium");

  const filteredCaptures = mockCaptures.filter((item) => {
    if (filterType !== "all" && item.type !== filterType) return false;
    if (filterTag !== "all" && !item.tags.includes(filterTag)) return false;
    if (searchQuery && !item.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Quick Capture <Inbox size={20} className="text-[var(--primary)]" />
            </h1>
            <p className="text-sm text-gray-500">Your unified inbox for ideas, lyrics, contacts, and more</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <Mic size={16} /> Voice Memo
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <Camera size={16} /> Photo
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <StickyNote size={16} /> Note
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <Music2 size={16} /> Lyric
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              <UserPlus size={16} /> Contact
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Capture Form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Plus size={20} className="text-[var(--primary)]" /> New Capture
            </h2>

            {/* Type Selector Tabs */}
            <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1 w-fit">
              {captureTypes.map((type) => {
                const config = typeConfig[type];
                const Icon = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      activeType === type
                        ? "bg-white shadow-sm text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon size={14} /> {type}
                  </button>
                );
              })}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Title</label>
                <input
                  type="text"
                  placeholder={`Enter ${activeType} title...`}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Content</label>
                <textarea
                  rows={4}
                  placeholder={
                    activeType === "lyric"
                      ? "Write your lyrics here..."
                      : activeType === "contact"
                      ? "Name, email, context..."
                      : activeType === "link"
                      ? "Paste URL and add notes..."
                      : "What's on your mind?"
                  }
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] resize-y min-h-[100px]"
                />
              </div>

              <div className="flex gap-4">
                {/* Tags */}
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">
                    <Tag size={12} className="inline mr-1" /> Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {["lyrics", "production", "marketing", "visual", "collab"].map((tag) => (
                      <button
                        key={tag}
                        className={`text-xs px-2.5 py-1 rounded-full border border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors ${tagColors[tag] || "bg-gray-100 text-gray-600"}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Priority</label>
                  <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                    {(["low", "medium", "high"] as Priority[]).map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedPriority(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                          selectedPriority === p
                            ? p === "high"
                              ? "bg-red-500 text-white shadow-sm"
                              : p === "medium"
                              ? "bg-amber-400 text-white shadow-sm"
                              : "bg-gray-400 text-white shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                <Bookmark size={14} /> Save Capture
              </button>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search captures..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
              />
            </div>

            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as CaptureType | "all")}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
              >
                <option value="all">All Types</option>
                {captureTypes.map((t) => (
                  <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
              >
                <option value="all">All Tags</option>
                {allTags.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <span className="text-xs text-gray-400">{filteredCaptures.length} captures</span>
          </div>

          {/* Captures Inbox */}
          <div className="space-y-2">
            {filteredCaptures.map((item) => {
              const config = typeConfig[item.type];
              const Icon = config.icon;
              const pConfig = priorityConfig[item.priority];

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {/* Type Icon */}
                    <div className={`p-2 rounded-lg ${config.bg} shrink-0`}>
                      <Icon size={16} className={config.color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm text-gray-800 leading-relaxed">
                          {item.type === "lyric" ? (
                            <span className="italic">&ldquo;{item.content}&rdquo;</span>
                          ) : item.type === "link" ? (
                            <>
                              <a href="#" className="text-[var(--primary)] hover:underline">
                                {item.content.split(" — ")[0]}
                              </a>
                              {item.content.includes(" — ") && (
                                <span className="text-gray-600"> — {item.content.split(" — ")[1]}</span>
                              )}
                            </>
                          ) : (
                            item.content
                          )}
                        </p>

                        {/* Priority Dot */}
                        <div className={`w-2 h-2 rounded-full ${pConfig.dot} shrink-0 mt-1.5`} title={`${item.priority} priority`} />
                      </div>

                      {/* Tags & Meta */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-xs font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${config.bg} ${config.color}`}>
                            {item.type}
                          </span>
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-xs px-2 py-0.5 rounded-full ${tagColors[tag] || "bg-gray-100 text-gray-600"}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-400 flex items-center gap-1 mr-2">
                            <Clock size={11} /> {item.time}
                          </span>

                          {/* Actions */}
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                              <Edit3 size={13} />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Archive">
                              <Archive size={13} />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Convert to Release Plan Task">
                              <ArrowRight size={13} />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Convert to Release Plan */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm">
                <Sparkles size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Convert to Release Plan Task</h3>
                <p className="text-xs text-gray-500 mt-0.5">Link selected captures to your active release plans and workflows</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
              <ArrowRight size={14} /> Convert Selected
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
