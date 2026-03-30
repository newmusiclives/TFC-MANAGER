"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { apiGet, apiPost } from "@/lib/api-client";
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
  LayoutTemplate,
  BarChart3,
  Users,
  X,
  Target,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
} from "lucide-react";
import { useState, useEffect } from "react";

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

const mockReleasePlans: ReleasePlan[] = [
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

const templateLibrary = [
  {
    id: "tpl-single",
    title: "Single Release (4 weeks)",
    duration: "4 weeks",
    tasks: 12,
    phases: 3,
    description: "Perfect for dropping a single track with a focused marketing push across socials and playlists.",
  },
  {
    id: "tpl-ep",
    title: "EP Release (6 weeks)",
    duration: "6 weeks",
    tasks: 18,
    phases: 4,
    description: "A comprehensive plan for EPs covering pre-release buzz, launch week, sustain, and wrap-up phases.",
  },
  {
    id: "tpl-album",
    title: "Album Release (12 weeks)",
    duration: "12 weeks",
    tasks: 30,
    phases: 5,
    description: "Full album rollout including lead single strategy, press tour, content series, and long-tail promotion.",
  },
  {
    id: "tpl-surprise",
    title: "Surprise Drop (1 week)",
    duration: "1 week",
    tasks: 6,
    phases: 2,
    description: "Quick-turn plan for surprise releases with day-of blitz and rapid follow-up engagement.",
  },
];

const mockRetrospective = {
  streams: { actual: 45000, goal: 50000 },
  whatWorked: [
    "TikTok teaser campaign drove 60% of pre-save conversions",
    "Email newsletter had a 42% open rate, well above the 25% average",
    "Playlist placements on 3 editorial playlists within the first week",
  ],
  whatDidnt: [
    "Instagram Reels underperformed with only 1.2K average views vs 5K expected",
    "Press outreach yielded only 1 feature out of 15 pitches sent",
  ],
  recommendations: [
    "Double down on TikTok with longer lead time (start teasers 3 weeks out instead of 2)",
    "Invest in building direct press relationships before next release cycle",
    "Consider allocating more ad budget to TikTok over Instagram based on engagement data",
  ],
};

const assigneeOptions = ["Me", "Manager", "Label", "Social Media"] as const;

export default function ReleasePlansPage() {
  const [releasePlans, setReleasePlans] = useState<ReleasePlan[]>(mockReleasePlans);
  const [expandedPlan, setExpandedPlan] = useState<string | null>("rp1");
  const [showCreate, setShowCreate] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formType, setFormType] = useState("Single");
  const [formGenre, setFormGenre] = useState("Pop / Electronic");
  const [formContext, setFormContext] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRetro, setShowRetro] = useState<string | null>(null);
  const [taskAssignments, setTaskAssignments] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet<ReleasePlan[]>("/api/releases");
        if (data && data.length > 0) {
          setReleasePlans(data);
        }
      } catch {
        // keep mock data
      }
    })();
  }, []);

  const statusIcon = (s: TaskStatus) => {
    switch (s) {
      case "done": return <CheckCircle2 size={16} className="text-green-600" />;
      case "in-progress": return <Clock size={16} className="text-yellow-600" />;
      case "upcoming": return <Circle size={16} className="text-gray-300" />;
    }
  };

  const handleGenerate = async () => {
    setShowCreate(false);
    setGenerating(true);
    try {
      const data = await apiPost<{ plan: ReleasePlan }>("/api/ai/generate", {
        type: "release-plan",
        context: { title: formTitle, releaseDate: formDate, type: formType, genre: formGenre, additionalContext: formContext },
      });
      if (data.plan) {
        // Also persist the release
        try {
          await apiPost("/api/releases", { title: formTitle, type: formType, releaseDate: formDate, genre: formGenre });
        } catch {
          // ignore save error — plan was still generated
        }
        setReleasePlans((prev) => [data.plan, ...prev]);
        setExpandedPlan(data.plan.id);
      }
    } catch {
      // Fall back to mock animation only
    } finally {
      setGenerating(false);
    }
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
          {/* Toast notification */}
          {toastMessage && (
            <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={18} />
              <span className="text-sm font-medium">{toastMessage}</span>
              <button onClick={() => setToastMessage(null)} className="ml-2 hover:text-green-200"><X size={14} /></button>
            </div>
          )}

          {/* Template Library */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <LayoutTemplate size={20} className="text-[var(--primary)]" />
              <h2 className="font-bold text-lg">Template Library</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">Start with a proven release strategy template and customize it to your needs.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {templateLibrary.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    setToastMessage("Template loaded!");
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="text-left border border-gray-200 rounded-xl p-4 hover:border-[var(--primary)] hover:shadow-md transition-all group"
                >
                  <h3 className="font-semibold text-sm group-hover:text-[var(--primary)] transition-colors">{tpl.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">{tpl.tasks} tasks</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full">{tpl.phases} phases</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{tpl.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Create */}
          {showCreate && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h2 className="font-bold text-lg mb-4">Generate New Release Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Release Title</label>
                  <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Golden Hour" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Release Date</label>
                  <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Release Type</label>
                  <select value={formType} onChange={(e) => setFormType(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20">
                    <option>Single</option>
                    <option>EP</option>
                    <option>Album</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Genre</label>
                  <input type="text" value={formGenre} onChange={(e) => setFormGenre(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5">Additional context for the AI</label>
                <textarea rows={3} value={formContext} onChange={(e) => setFormContext(e.target.value)} placeholder="Any details about the release, target audience, goals..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 resize-none" />
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
                          {phase.tasks.map((task, tIdx) => {
                            const assignKey = `${plan.id}-${pIdx}-${tIdx}`;
                            return (
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
                              <select
                                value={taskAssignments[assignKey] || ""}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  setTaskAssignments((prev) => ({ ...prev, [assignKey]: e.target.value }));
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/30 shrink-0"
                              >
                                <option value="">Assign</option>
                                {assigneeOptions.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${task.status === "done" ? "bg-green-50 text-green-600" : task.status === "in-progress" ? "bg-yellow-50 text-yellow-600" : "bg-gray-50 text-gray-400"}`}>
                                {task.status === "in-progress" ? "in progress" : task.status}
                              </span>
                            </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
                      <button className="inline-flex items-center gap-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                        <Download size={14} /> Export Plan
                      </button>
                      {plan.status === "completed" && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowRetro(plan.id); }}
                          className="inline-flex items-center gap-1.5 text-sm bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                          <BarChart3 size={14} /> View Retrospective
                        </button>
                      )}
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

        {/* Retrospective Modal */}
        {showRetro && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowRetro(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <BarChart3 size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Post-Release Retrospective</h2>
                    <p className="text-sm text-gray-500">{releasePlans.find((p) => p.id === showRetro)?.title}</p>
                  </div>
                </div>
                <button onClick={() => setShowRetro(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Performance vs Goals */}
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <Target size={16} className="text-blue-600" /> Performance vs Goals
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Total Streams</span>
                      <span className="text-sm font-bold">
                        {mockRetrospective.streams.actual.toLocaleString()} / {mockRetrospective.streams.goal.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${Math.min(100, (mockRetrospective.streams.actual / mockRetrospective.streams.goal) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Reached {Math.round((mockRetrospective.streams.actual / mockRetrospective.streams.goal) * 100)}% of streaming goal
                    </p>
                  </div>
                </div>

                {/* What Worked */}
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <ThumbsUp size={16} className="text-green-600" /> What Worked
                  </h3>
                  <div className="space-y-2">
                    {mockRetrospective.whatWorked.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 bg-green-50 rounded-lg px-4 py-2.5">
                        <CheckCircle2 size={14} className="text-green-600 mt-0.5 shrink-0" />
                        <span className="text-sm text-green-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What Didn't Work */}
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <ThumbsDown size={16} className="text-red-600" /> What Didn&apos;t Work
                  </h3>
                  <div className="space-y-2">
                    {mockRetrospective.whatDidnt.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 bg-red-50 rounded-lg px-4 py-2.5">
                        <Circle size={14} className="text-red-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-red-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                    <Lightbulb size={16} className="text-amber-500" /> Recommendations
                  </h3>
                  <div className="space-y-2">
                    {mockRetrospective.recommendations.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 bg-amber-50 rounded-lg px-4 py-2.5">
                        <ArrowRight size={14} className="text-amber-600 mt-0.5 shrink-0" />
                        <span className="text-sm text-amber-900">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
