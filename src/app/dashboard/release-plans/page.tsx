"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Plus,
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  Music2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Download,
  Trash2,
  Eye,
} from "lucide-react";
import { useState } from "react";

type TaskStatus = "done" | "in-progress" | "upcoming";
type PlanPhase = {
  name: string;
  dateRange: string;
  tasks: { title: string; status: TaskStatus; detail: string }[];
};

type ReleasePlan = {
  id: string;
  title: string;
  releaseDate: string;
  status: "active" | "completed" | "draft";
  progress: number;
  createdAt: string;
  phases: PlanPhase[];
};

const releasePlans: ReleasePlan[] = [
  {
    id: "rp1",
    title: "Golden Hour - Single Release",
    releaseDate: "Apr 18, 2026",
    status: "active",
    progress: 35,
    createdAt: "Mar 15, 2026",
    phases: [
      {
        name: "Pre-Release (4 weeks before)",
        dateRange: "Mar 21 - Apr 4",
        tasks: [
          { title: "Finalize master and get ISRC code", status: "done", detail: "Upload final master to distributor and obtain ISRC code for tracking." },
          { title: "Create artwork and visual assets", status: "done", detail: "Design cover art (3000x3000px), promotional banners for all social platforms." },
          { title: "Set up Smart Link page", status: "done", detail: "Create pre-save smart link with all platform links. Share in bio." },
          { title: "Write press release", status: "in-progress", detail: "Draft press release highlighting the story behind the track. Include quotes, bio, and hi-res images." },
          { title: "Prepare social media content calendar", status: "in-progress", detail: "Plan 3 weeks of teaser content: behind-the-scenes, lyric snippets, countdown posts." },
          { title: "Send to press and playlist curators", status: "upcoming", detail: "Email press release + private listening link to your media list and playlist curators." },
        ],
      },
      {
        name: "Release Week",
        dateRange: "Apr 14 - Apr 20",
        tasks: [
          { title: "Launch day announcement across all socials", status: "upcoming", detail: "Post coordinated announcement on Instagram, TikTok, Twitter, and Facebook at release time." },
          { title: "Send fan email newsletter", status: "upcoming", detail: "Send email blast to your mailing list with personal note + streaming links." },
          { title: "Go live on Instagram/TikTok", status: "upcoming", detail: "Host a live session on release day to connect with fans and talk about the song." },
          { title: "Share user-generated content", status: "upcoming", detail: "Repost fan reactions, stories, and covers throughout the week." },
        ],
      },
      {
        name: "Post-Release (weeks 2-4)",
        dateRange: "Apr 21 - May 9",
        tasks: [
          { title: "Release lyric or visualizer video", status: "upcoming", detail: "Publish a lyric video or visual content on YouTube to sustain engagement." },
          { title: "Pitch for additional playlists", status: "upcoming", detail: "Follow up with curators and submit to editorial playlists on all platforms." },
          { title: "Run targeted ad campaign", status: "upcoming", detail: "Set up Instagram/TikTok ads targeting similar artists' audiences. Budget: $100-300." },
          { title: "Analyze performance and adjust", status: "upcoming", detail: "Review analytics after 2 weeks. Double down on what's working. Adjust ad targeting." },
        ],
      },
    ],
  },
  {
    id: "rp2",
    title: "Midnight Dreams - Single Release",
    releaseDate: "Dec 15, 2025",
    status: "completed",
    progress: 100,
    createdAt: "Nov 10, 2025",
    phases: [
      {
        name: "Pre-Release",
        dateRange: "Nov 17 - Dec 1",
        tasks: [
          { title: "Finalize master and distribute", status: "done", detail: "" },
          { title: "Create artwork", status: "done", detail: "" },
          { title: "Set up Smart Link", status: "done", detail: "" },
          { title: "Press outreach", status: "done", detail: "" },
        ],
      },
      {
        name: "Release Week",
        dateRange: "Dec 12 - Dec 18",
        tasks: [
          { title: "Launch day posts", status: "done", detail: "" },
          { title: "Fan email blast", status: "done", detail: "" },
          { title: "Instagram Live", status: "done", detail: "" },
        ],
      },
      {
        name: "Post-Release",
        dateRange: "Dec 19 - Jan 5",
        tasks: [
          { title: "YouTube lyric video", status: "done", detail: "" },
          { title: "Ad campaign", status: "done", detail: "" },
          { title: "Performance review", status: "done", detail: "" },
        ],
      },
    ],
  },
];

export default function ReleasePlansPage() {
  const [expandedPlan, setExpandedPlan] = useState<string | null>("rp1");
  const [showCreate, setShowCreate] = useState(false);
  const [generating, setGenerating] = useState(false);

  const statusIcon = (s: TaskStatus) => {
    switch (s) {
      case "done": return <CheckCircle2 size={16} className="text-green-600" />;
      case "in-progress": return <Clock size={16} className="text-yellow-600" />;
      case "upcoming": return <Circle size={16} className="text-gray-300" />;
    }
  };

  const handleGenerate = () => {
    setShowCreate(false);
    setGenerating(true);
    setTimeout(() => setGenerating(false), 2500);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Release Plans</h1>
            <p className="text-sm text-gray-500">AI-generated step-by-step release strategies</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCreate(!showCreate)} className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors">
              <Plus size={16} /> New Release Plan
            </button>
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Create */}
          {showCreate && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h2 className="font-bold text-lg mb-4">Generate New Release Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Release Title</label>
                  <input type="text" placeholder="e.g. Golden Hour" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Release Date</label>
                  <input type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Release Type</label>
                  <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20">
                    <option>Single</option>
                    <option>EP</option>
                    <option>Album</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Genre</label>
                  <input type="text" defaultValue="Pop / Electronic" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5">Additional context for the AI</label>
                <textarea rows={3} placeholder="Any details about the release, target audience, goals..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={handleGenerate} className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2">
                  <Sparkles size={16} /> Generate Plan
                </button>
                <button onClick={() => setShowCreate(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-5 py-2.5 rounded-lg transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {generating && (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 mb-6 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Generating your release plan...</h3>
              <p className="text-sm text-gray-500">AI is crafting a customized step-by-step strategy for your release.</p>
            </div>
          )}

          {/* Plans list */}
          <div className="space-y-4">
            {releasePlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.status === "completed" ? "bg-green-50" : plan.status === "active" ? "bg-[var(--primary)]/10" : "bg-gray-100"}`}>
                        <FileText size={22} className={plan.status === "completed" ? "text-green-600" : plan.status === "active" ? "text-[var(--primary)]" : "text-gray-400"} />
                      </div>
                      <div>
                        <h3 className="font-bold">{plan.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${plan.status === "completed" ? "bg-green-50 text-green-700" : plan.status === "active" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                            {plan.status}
                          </span>
                          <span className="flex items-center gap-1"><Calendar size={12} /> Release: {plan.releaseDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-bold">{plan.progress}%</div>
                        <div className="w-24 bg-gray-100 rounded-full h-1.5 mt-1">
                          <div className={`h-1.5 rounded-full ${plan.progress === 100 ? "bg-green-500" : "bg-[var(--primary)]"}`} style={{ width: `${plan.progress}%` }} />
                        </div>
                      </div>
                      {expandedPlan === plan.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </div>
                  </div>
                </div>

                {expandedPlan === plan.id && (
                  <div className="border-t border-gray-100 px-6 pb-6">
                    {plan.phases.map((phase, pIdx) => (
                      <div key={pIdx} className="mt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="font-semibold text-sm">{phase.name}</h4>
                          <span className="text-xs text-gray-400">{phase.dateRange}</span>
                        </div>
                        <div className="space-y-2 ml-1">
                          {phase.tasks.map((task, tIdx) => (
                            <div key={tIdx} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                              <div className="mt-0.5">{statusIcon(task.status)}</div>
                              <div className="flex-1">
                                <div className={`text-sm font-medium ${task.status === "done" ? "line-through text-gray-400" : ""}`}>
                                  {task.title}
                                </div>
                                {task.detail && (
                                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{task.detail}</p>
                                )}
                              </div>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${task.status === "done" ? "bg-green-50 text-green-600" : task.status === "in-progress" ? "bg-yellow-50 text-yellow-600" : "bg-gray-50 text-gray-400"}`}>
                                {task.status === "in-progress" ? "in progress" : task.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
                      <button className="inline-flex items-center gap-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                        <Download size={14} /> Export Plan
                      </button>
                      <button className="inline-flex items-center gap-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors">
                        <Trash2 size={14} /> Delete
                      </button>
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
