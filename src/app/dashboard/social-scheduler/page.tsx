"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  CalendarDays,
  List,
  Layers,
  Plus,
  Sparkles,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  TrendingUp,
  Edit3,
  Trash2,
  RefreshCw,
  Upload,
  Image,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Zap,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ViewMode = "calendar" | "list" | "queue";
type Platform = "instagram" | "tiktok" | "twitter" | "facebook";
type PostStatus = "scheduled" | "posted" | "failed";

interface ScheduledPost {
  id: number;
  platforms: Platform[];
  content: string;
  date: string; // ISO
  time: string; // HH:mm
  day: number; // 0=Mon .. 6=Sun
  hour: number;
  status: PostStatus;
  engagement?: { likes: number; comments: number; shares: number; views: number };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const platformMeta: Record<Platform, { abbr: string; color: string; bg: string }> = {
  instagram: { abbr: "IG", color: "text-pink-600", bg: "bg-pink-100" },
  tiktok: { abbr: "TT", color: "text-gray-900", bg: "bg-gray-200" },
  twitter: { abbr: "X", color: "text-sky-500", bg: "bg-sky-100" },
  facebook: { abbr: "FB", color: "text-blue-600", bg: "bg-blue-100" },
};

const platformLabels: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  twitter: "Twitter / X",
  facebook: "Facebook",
};

const platformIcons: Record<Platform, React.ElementType> = {
  instagram: Smartphone,
  tiktok: Monitor,
  twitter: Globe,
  facebook: Heart,
};

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const mockPosts: ScheduledPost[] = [
  { id: 1, platforms: ["instagram", "facebook"], content: "New single 'Midnight Dreams' dropping this Friday! Pre-save link in bio.", date: "2026-03-23", time: "10:00", day: 0, hour: 10, status: "posted", engagement: { likes: 842, comments: 67, shares: 31, views: 4210 } },
  { id: 2, platforms: ["twitter"], content: "Studio session vibes today. Something big is coming... stay tuned.", date: "2026-03-23", time: "14:00", day: 0, hour: 14, status: "posted", engagement: { likes: 324, comments: 18, shares: 45, views: 1890 } },
  { id: 3, platforms: ["tiktok"], content: "POV: When the beat drops on the new track and you can't stop vibing", date: "2026-03-24", time: "19:00", day: 1, hour: 19, status: "posted", engagement: { likes: 2140, comments: 203, shares: 189, views: 18400 } },
  { id: 4, platforms: ["instagram"], content: "Behind the scenes of the 'Midnight Dreams' music video shoot. This was such an incredible day.", date: "2026-03-25", time: "12:00", day: 2, hour: 12, status: "posted", engagement: { likes: 1053, comments: 89, shares: 42, views: 5620 } },
  { id: 5, platforms: ["twitter", "facebook"], content: "Thank you for 100K streams on 'Electric Sunrise'! You all are incredible.", date: "2026-03-25", time: "18:00", day: 2, hour: 18, status: "posted", engagement: { likes: 567, comments: 34, shares: 78, views: 3100 } },
  { id: 6, platforms: ["instagram", "tiktok"], content: "Snippet of an unreleased track. Should I drop it this month? Comment YES if you want it!", date: "2026-03-28", time: "11:00", day: 5, hour: 11, status: "scheduled" },
  { id: 7, platforms: ["twitter"], content: "Excited to announce I'll be performing at Indie Fest 2026! Tickets on sale next week.", date: "2026-03-28", time: "15:00", day: 5, hour: 15, status: "scheduled" },
  { id: 8, platforms: ["facebook", "instagram"], content: "Fan Q&A this Sunday at 3pm EST! Drop your questions below and I'll answer them live.", date: "2026-03-29", time: "09:00", day: 6, hour: 9, status: "scheduled" },
  { id: 9, platforms: ["tiktok"], content: "Dance challenge for 'Midnight Dreams' starts NOW. Show me your moves!", date: "2026-03-27", time: "19:00", day: 4, hour: 19, status: "scheduled" },
  { id: 10, platforms: ["instagram"], content: "Golden hour photo dump from the rooftop session last week.", date: "2026-03-26", time: "17:00", day: 3, hour: 17, status: "scheduled" },
  { id: 11, platforms: ["twitter"], content: "Late night thoughts: music is the only language everyone understands.", date: "2026-03-24", time: "23:00", day: 1, hour: 23, status: "posted", engagement: { likes: 198, comments: 12, shares: 25, views: 980 } },
  { id: 12, platforms: ["instagram", "facebook"], content: "Merch drop coming soon! Sneak peek at the new designs.", date: "2026-03-26", time: "10:00", day: 3, hour: 10, status: "failed" },
];

/* ------------------------------------------------------------------ */
/*  Heatmap data (engagement intensity 0-10 by day x hour)             */
/* ------------------------------------------------------------------ */

const heatmapData: number[][] = Array.from({ length: 7 }, () =>
  Array.from({ length: 24 }, () => 0),
);
// Populate with realistic patterns
[[1, 19, 10], [2, 12, 8], [2, 18, 7], [0, 10, 6], [0, 14, 5], [3, 17, 7], [4, 19, 9], [5, 11, 6], [5, 15, 5], [6, 9, 4], [1, 23, 3],
 [0, 9, 3], [1, 12, 4], [2, 9, 3], [3, 12, 5], [4, 12, 4], [5, 19, 8], [6, 15, 5], [6, 19, 7],
 [0, 19, 7], [1, 10, 3], [2, 20, 6], [3, 19, 8], [4, 10, 3], [5, 20, 7], [6, 20, 6],
].forEach(([d, h, v]) => { heatmapData[d][h] = v; });

function heatColor(v: number): string {
  if (v === 0) return "bg-gray-100";
  if (v <= 2) return "bg-emerald-100";
  if (v <= 4) return "bg-emerald-200";
  if (v <= 6) return "bg-emerald-400";
  if (v <= 8) return "bg-emerald-500";
  return "bg-emerald-600";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SocialSchedulerPage() {
  const [view, setView] = useState<ViewMode>("calendar");
  const [showModal, setShowModal] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["instagram"]);
  const [postContent, setPostContent] = useState("");
  const [postDate, setPostDate] = useState("2026-03-28");
  const [postTime, setPostTime] = useState("19:00");
  const [aiOptimized, setAiOptimized] = useState(false);

  const scheduledPosts = mockPosts.filter((p) => p.status === "scheduled");
  const postedPosts = mockPosts.filter((p) => p.status === "posted");

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  const handleAiOptimize = () => {
    setPostTime("19:00");
    setPostDate("2026-03-31");
    setAiOptimized(true);
    setTimeout(() => setAiOptimized(false), 2500);
  };

  const handleAiSuggestTimes = () => {
    // In a real app this would trigger an AI analysis
  };

  /* ---- calendar hours to show ---- */
  const calHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* ---- Header ---- */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Social Scheduler</h1>
            <p className="text-sm text-gray-500">Plan, schedule &amp; optimize your social posts</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAiSuggestTimes}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-purple-200 text-purple-600 bg-purple-50 hover:bg-purple-100 text-sm font-medium transition-colors"
            >
              <Sparkles size={16} />
              AI Suggest Times
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Schedule Post
            </button>
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* ---- Stats Bar ---- */}
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: "Posts This Week", value: "5", sub: "+2 from last week", icon: CalendarDays },
              { label: "Avg Engagement", value: "4.2%", sub: "+0.6% improvement", icon: TrendingUp },
              { label: "Best Day", value: "Tuesday", sub: "Highest reach", icon: BarChart3 },
              { label: "Best Time", value: "7:00 PM", sub: "Peak engagement", icon: Clock },
              { label: "Queue", value: "8 pending", sub: "Next: Today 11am", icon: Layers },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{s.label}</span>
                  <s.icon size={16} className="text-purple-500" />
                </div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* ---- View Toggle ---- */}
          <div className="flex items-center gap-1 bg-white rounded-xl border border-gray-100 p-1 w-fit">
            {(
              [
                { id: "calendar", label: "Calendar", icon: CalendarDays },
                { id: "list", label: "List", icon: List },
                { id: "queue", label: "Queue", icon: Layers },
              ] as const
            ).map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === v.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <v.icon size={15} />
                {v.label}
              </button>
            ))}
          </div>

          {/* ---- Main Content Area ---- */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Left: Calendar / List / Queue */}
            <div className="xl:col-span-3 space-y-6">
              {/* ===================== CALENDAR VIEW ===================== */}
              {view === "calendar" && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {/* Calendar header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <button className="p-1 hover:bg-gray-100 rounded-lg"><ChevronLeft size={18} /></button>
                      <h3 className="font-semibold text-sm">March 23 &ndash; 29, 2026</h3>
                      <button className="p-1 hover:bg-gray-100 rounded-lg"><ChevronRight size={18} /></button>
                    </div>
                    <span className="text-xs text-gray-400">This Week</span>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-gray-100">
                    <div className="p-2" />
                    {dayLabels.map((d, i) => (
                      <div key={d} className={`text-center py-2 text-xs font-semibold ${i === 5 ? "text-purple-600" : "text-gray-500"}`}>
                        {d}
                        <div className={`text-lg font-bold ${i === 5 ? "text-purple-600" : "text-gray-800"}`}>{23 + i}</div>
                      </div>
                    ))}
                  </div>

                  {/* Time grid */}
                  <div className="max-h-[480px] overflow-y-auto">
                    {calHours.map((h) => (
                      <div key={h} className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-gray-50 min-h-[48px]">
                        <div className="text-xs text-gray-400 p-2 text-right pr-3 pt-1">
                          {h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}
                        </div>
                        {dayLabels.map((_, dayIdx) => {
                          const posts = mockPosts.filter((p) => p.day === dayIdx && p.hour === h);
                          return (
                            <div key={dayIdx} className="border-l border-gray-50 px-1 py-0.5 relative">
                              {posts.map((post) => (
                                <div
                                  key={post.id}
                                  className={`rounded-lg px-2 py-1.5 mb-0.5 cursor-pointer text-xs leading-tight border transition-shadow hover:shadow-md ${
                                    post.status === "posted"
                                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                      : post.status === "failed"
                                      ? "bg-red-50 border-red-200 text-red-700"
                                      : "bg-purple-50 border-purple-200 text-purple-800"
                                  }`}
                                >
                                  <div className="flex items-center gap-1 mb-0.5">
                                    {post.platforms.map((pl) => (
                                      <span key={pl} className={`font-bold ${platformMeta[pl].color}`}>
                                        {platformMeta[pl].abbr}
                                      </span>
                                    ))}
                                    <span className="text-gray-400 ml-auto">{post.time}</span>
                                  </div>
                                  <p className="truncate">{post.content.slice(0, 40)}...</p>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ===================== LIST VIEW ===================== */}
              {view === "list" && (
                <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-sm">All Scheduled &amp; Posted</h3>
                  </div>
                  {[...mockPosts]
                    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
                    .map((post) => (
                      <div key={post.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex gap-1">
                          {post.platforms.map((pl) => (
                            <span key={pl} className={`text-xs font-bold px-1.5 py-0.5 rounded ${platformMeta[pl].bg} ${platformMeta[pl].color}`}>
                              {platformMeta[pl].abbr}
                            </span>
                          ))}
                        </div>
                        <p className="flex-1 text-sm text-gray-700 truncate">{post.content}</p>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{post.date} {post.time}</span>
                        <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                          post.status === "posted" ? "bg-emerald-100 text-emerald-700" : post.status === "failed" ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"
                        }`}>
                          {post.status}
                        </span>
                        <div className="flex items-center gap-1">
                          <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"><Edit3 size={14} /></button>
                          <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"><RefreshCw size={14} /></button>
                          <button className="p-1 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* ===================== QUEUE VIEW ===================== */}
              {view === "queue" && (
                <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-sm">Post Queue</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{scheduledPosts.length} posts waiting to be published</p>
                  </div>
                  {scheduledPosts
                    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
                    .map((post, idx) => (
                      <div key={post.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {post.platforms.map((pl) => (
                              <span key={pl} className={`text-xs font-bold px-1.5 py-0.5 rounded ${platformMeta[pl].bg} ${platformMeta[pl].color}`}>
                                {platformMeta[pl].abbr}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-400">{post.date} at {post.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"><Edit3 size={14} /></button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"><RefreshCw size={14} /></button>
                          <button className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* ---- Performance Section ---- */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent posted items */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <BarChart3 size={16} className="text-purple-500" />
                    Recent Performance
                  </h3>
                  <div className="space-y-3">
                    {postedPosts.slice(0, 5).map((post) => (
                      <div key={post.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                        <div className="flex gap-1 flex-shrink-0 pt-0.5">
                          {post.platforms.map((pl) => (
                            <span key={pl} className={`text-xs font-bold px-1 py-0.5 rounded ${platformMeta[pl].bg} ${platformMeta[pl].color}`}>
                              {platformMeta[pl].abbr}
                            </span>
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 truncate">{post.content}</p>
                          {post.engagement && (
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-xs text-gray-400 flex items-center gap-1"><Heart size={10} />{post.engagement.likes.toLocaleString()}</span>
                              <span className="text-xs text-gray-400 flex items-center gap-1"><MessageCircle size={10} />{post.engagement.comments}</span>
                              <span className="text-xs text-gray-400 flex items-center gap-1"><Share2 size={10} />{post.engagement.shares}</span>
                              <span className="text-xs text-gray-400 flex items-center gap-1"><Eye size={10} />{post.engagement.views.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heatmap */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-purple-500" />
                    Best Posting Times
                  </h3>
                  <div className="overflow-x-auto">
                    <div className="min-w-[420px]">
                      {/* Hour labels */}
                      <div className="flex gap-0.5 mb-1 ml-10">
                        {Array.from({ length: 24 }, (_, h) => (
                          <div key={h} className="w-3 text-[7px] text-gray-400 text-center">
                            {h % 6 === 0 ? (h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`) : ""}
                          </div>
                        ))}
                      </div>
                      {/* Rows */}
                      {dayLabels.map((day, dIdx) => (
                        <div key={day} className="flex items-center gap-0.5 mb-0.5">
                          <span className="w-10 text-xs text-gray-500 text-right pr-2">{day}</span>
                          {Array.from({ length: 24 }, (_, h) => (
                            <div
                              key={h}
                              className={`w-3 h-3 rounded-[2px] ${heatColor(heatmapData[dIdx][h])} transition-colors`}
                              title={`${day} ${h}:00 — engagement: ${heatmapData[dIdx][h]}/10`}
                            />
                          ))}
                        </div>
                      ))}
                      <div className="flex items-center gap-1 mt-3 ml-10">
                        <span className="text-xs text-gray-400">Low</span>
                        {["bg-gray-100", "bg-emerald-100", "bg-emerald-200", "bg-emerald-400", "bg-emerald-500", "bg-emerald-600"].map((c) => (
                          <div key={c} className={`w-3 h-3 rounded-[2px] ${c}`} />
                        ))}
                        <span className="text-xs text-gray-400">High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Post */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowUpRight size={18} />
                  <h3 className="font-semibold text-sm">Top Performing Post This Month</h3>
                </div>
                <p className="text-sm opacity-90 mb-4">
                  &ldquo;POV: When the beat drops on the new track and you can&apos;t stop vibing&rdquo;
                </p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-2xl font-bold">18.4K</p>
                    <p className="text-xs opacity-70">Views</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">2,140</p>
                    <p className="text-xs opacity-70">Likes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">203</p>
                    <p className="text-xs opacity-70">Comments</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">189</p>
                    <p className="text-xs opacity-70">Shares</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-white/20">TT</span>
                    <p className="text-xs opacity-70 mt-1">TikTok</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ---- Right: Post Queue Sidebar ---- */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 sticky top-24">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-sm">Upcoming Queue</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{scheduledPosts.length} scheduled</p>
                </div>
                <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                  {[...scheduledPosts, ...mockPosts.filter((p) => p.status === "failed")]
                    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
                    .map((post) => (
                      <div key={post.id} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-1.5 mb-1">
                          {post.platforms.map((pl) => (
                            <span key={pl} className={`text-xs font-bold px-1 py-0.5 rounded ${platformMeta[pl].bg} ${platformMeta[pl].color}`}>
                              {platformMeta[pl].abbr}
                            </span>
                          ))}
                          <span className={`ml-auto text-xs font-bold uppercase px-1.5 py-0.5 rounded-full ${
                            post.status === "failed" ? "bg-red-100 text-red-700" : "bg-purple-100 text-purple-700"
                          }`}>
                            {post.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mb-1.5">{post.content}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={10} />{post.date} {post.time}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"><Edit3 size={12} /></button>
                            <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"><RefreshCw size={12} /></button>
                            <button className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SCHEDULE POST MODAL ===================== */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold">Schedule New Post</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Platform selection */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Platforms</label>
                  <div className="flex flex-wrap gap-3">
                    {(Object.keys(platformLabels) as Platform[]).map((p) => {
                      const Icon = platformIcons[p];
                      const selected = selectedPlatforms.includes(p);
                      return (
                        <button
                          key={p}
                          onClick={() => togglePlatform(p)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                            selected
                              ? "border-purple-300 bg-purple-50 text-purple-700"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          {selected && <Check size={14} />}
                          <Icon size={16} />
                          {platformLabels[p]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Content</label>
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Write your post content here..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <span className={`text-xs ${postContent.length > 280 ? "text-red-500" : "text-gray-400"}`}>
                      {postContent.length} / 280 characters
                    </span>
                    <button className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                      <Sparkles size={12} />
                      Import from Content Generator
                    </button>
                  </div>
                </div>

                {/* Media upload */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Media</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-purple-300 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Upload size={20} className="text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">Drop images or videos here</p>
                      <p className="text-xs text-gray-400">PNG, JPG, GIF, MP4 up to 50MB</p>
                      <button className="mt-2 px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors flex items-center gap-1.5">
                        <Image size={14} />
                        Browse Files
                      </button>
                    </div>
                  </div>
                </div>

                {/* Date / Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Date</label>
                    <input
                      type="date"
                      value={postDate}
                      onChange={(e) => setPostDate(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Time</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={postTime}
                        onChange={(e) => setPostTime(e.target.value)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleAiOptimize}
                        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          aiOptimized
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                            : "bg-purple-50 border border-purple-200 text-purple-600 hover:bg-purple-100"
                        }`}
                      >
                        {aiOptimized ? <Check size={14} /> : <Sparkles size={14} />}
                        {aiOptimized ? "Optimized!" : "AI Optimize Time"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Platform previews */}
                {selectedPlatforms.length > 0 && postContent.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Preview</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedPlatforms.map((pl) => {
                        const Icon = platformIcons[pl];
                        return (
                          <div key={pl} className="border border-gray-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className={`w-8 h-8 rounded-full ${platformMeta[pl].bg} flex items-center justify-center`}>
                                <Icon size={14} className={platformMeta[pl].color} />
                              </div>
                              <div>
                                <p className="text-xs font-semibold">{platformLabels[pl]}</p>
                                <p className="text-xs text-gray-400">@jordandavis</p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              {pl === "twitter" ? postContent.slice(0, 280) : postContent}
                            </p>
                            <div className="mt-3 pt-2 border-t border-gray-100 flex items-center gap-4 text-gray-400">
                              <Heart size={13} />
                              <MessageCircle size={13} />
                              <Share2 size={13} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                    Save as Draft
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 rounded-xl bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <CalendarDays size={15} />
                    Schedule Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
