"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  FileText,
  Download,
  Share2,
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  ListMusic,
  Globe,
  Play,
  CheckCircle2,
  Circle,
  AlertTriangle,
  CheckSquare,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronRight,
  DollarSign,
  BarChart3,
  Zap,
  Clock,
  RefreshCw,
  Eye,
  Music2,
} from "lucide-react";
import { useState } from "react";

const metrics = [
  {
    label: "Daily Avg Streams",
    value: "2,950",
    change: "+8.4%",
    up: true,
    icon: Play,
  },
  {
    label: "New Listeners",
    value: "340",
    change: "+12.1%",
    up: true,
    icon: Users,
  },
  {
    label: "New Followers",
    value: "48",
    change: "+6.7%",
    up: true,
    icon: Heart,
  },
  {
    label: "Save Rate",
    value: "24.3%",
    change: "+0.2%",
    up: true,
    icon: CheckCircle2,
  },
  {
    label: "Playlist Adds",
    value: "2",
    change: "This week",
    up: true,
    icon: ListMusic,
  },
  {
    label: "Social Engagement",
    value: "+15%",
    change: "vs last week",
    up: true,
    icon: Globe,
  },
];

const actionItems = [
  { text: "Submit Golden Hour artwork", due: "Mar 30", done: false },
  { text: "Pitch to 3 new playlists", due: "Apr 2", done: false },
  { text: "Post 2x TikTok content", due: "Ongoing", done: false },
  { text: "Review release plan for April", due: "Apr 1", done: false },
  { text: "Respond to sync inquiry from Nike campaign", due: "Mar 31", done: false },
];

const revenueBreakdown = [
  { platform: "Spotify", amount: 9.24, pct: 50.2 },
  { platform: "Apple Music", amount: 4.61, pct: 25.0 },
  { platform: "YouTube Music", amount: 2.58, pct: 14.0 },
  { platform: "Deezer", amount: 1.10, pct: 6.0 },
  { platform: "Other", amount: 0.89, pct: 4.8 },
];

const previousReports = [
  { date: "Mar 14-21, 2026", label: "Week 12" },
  { date: "Mar 7-14, 2026", label: "Week 11" },
  { date: "Feb 28 - Mar 7, 2026", label: "Week 10" },
  { date: "Feb 21-28, 2026", label: "Week 9" },
  { date: "Feb 14-21, 2026", label: "Week 8" },
];

export default function WeeklyReportPage() {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <main className="flex-1 lg:ml-64 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-gray-100 bg-gray-50/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Weekly Report</h1>
                <p className="text-sm text-gray-500">Mar 21 - 28, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4" />
                Download PDF
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors">
                <RefreshCw className="h-4 w-4" />
                Generate New Report
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-8 py-8 space-y-8">
          {/* Executive Summary */}
          <section className="rounded-xl border border-gray-100 bg-white/60 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold">Executive Summary</h2>
            </div>
            <p className="leading-relaxed text-gray-600">
              This was a strong week. Streams are up <span className="font-semibold text-green-600">8.4%</span> week-over-week
              with <span className="font-semibold text-gray-900">340 new listeners</span> discovering your music organically.{" "}
              <span className="italic text-gray-900">&ldquo;Midnight Dreams&rdquo;</span> crossed{" "}
              <span className="font-semibold text-gray-900">22K total streams</span>, making it your strongest track to date. Your
              save rate held steady at <span className="font-semibold text-green-600">24.3%</span>, which signals healthy
              algorithmic support &mdash; Spotify typically boosts tracks with save rates above 20%. Social engagement jumped 15%
              thanks to a well-timed TikTok snippet and an Instagram BTS reel. Overall momentum is building nicely heading into
              your Golden Hour release cycle.
            </p>
          </section>

          {/* Key Metrics */}
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold">Key Metrics This Week</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-gray-100 bg-white/60 p-5 hover:border-gray-200 transition-colors"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <metric.icon className="h-5 w-5 text-gray-500" />
                    {metric.up ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                        <ArrowUpRight className="h-3 w-3" />
                        {metric.change}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                        <ArrowDownRight className="h-3 w-3" />
                        {metric.change}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="mt-1 text-sm text-gray-500">{metric.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* What Worked + What Needs Attention */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* What Worked */}
            <section className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-green-700">What Worked</h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm text-gray-600">
                    TikTok snippet posted Tuesday drove <span className="font-medium text-gray-900">890 profile visits</span> and
                    directly contributed to 120 new listeners
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm text-gray-600">
                    Your track was added to <span className="font-medium text-gray-900">&ldquo;Late Night Indie&rdquo;</span>{" "}
                    (14K followers) &mdash; expect a sustained stream bump over the next 2-3 weeks
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-sm text-gray-600">
                    Instagram Reel with studio BTS got{" "}
                    <span className="font-medium text-gray-900">2.3x your average engagement</span> &mdash; behind-the-scenes
                    content clearly resonates with your audience
                  </span>
                </li>
              </ul>
            </section>

            {/* What Needs Attention */}
            <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold text-amber-700">What Needs Attention</h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                  <span className="text-sm text-gray-600">
                    Facebook engagement continues to decline{" "}
                    <span className="font-medium text-amber-700">(-22%)</span>. Consider deprioritizing or trying a new format
                    like short-form video.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                  <span className="text-sm text-gray-600">
                    Email open rate dropped to <span className="font-medium text-amber-700">38%</span> (was 44%). Subject line
                    A/B testing recommended &mdash; your audience responds better to personal, conversational subject lines.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                  <span className="text-sm text-gray-600">
                    <span className="italic">&ldquo;Neon Lights&rdquo;</span> streams declining steadily &mdash; consider a
                    remix or acoustic version to re-activate algorithmic recommendations.
                  </span>
                </li>
              </ul>
            </section>
          </div>

          {/* Action Items */}
          <section className="rounded-xl border border-gray-100 bg-white/60 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/20">
                <CheckSquare className="h-4 w-4 text-orange-400" />
              </div>
              <h2 className="text-lg font-semibold">This Week&apos;s Action Items</h2>
            </div>
            <div className="space-y-3">
              {actionItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => toggleItem(idx)}
                  className="flex w-full items-center gap-4 rounded-lg border border-gray-100 bg-white/40 px-4 py-3 text-left hover:border-gray-200 transition-colors"
                >
                  <div
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      checkedItems[idx]
                        ? "border-green-500 bg-green-500"
                        : "border-zinc-600"
                    }`}
                  >
                    {checkedItems[idx] && (
                      <svg
                        className="h-3 w-3 text-gray-900"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`flex-1 text-sm ${
                      checkedItems[idx] ? "text-gray-500 line-through" : "text-zinc-200"
                    }`}
                  >
                    {item.text}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {item.due}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Competitive Landscape */}
          <section className="rounded-xl border border-gray-100 bg-white/60 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20">
                <Eye className="h-4 w-4 text-indigo-400" />
              </div>
              <h2 className="text-lg font-semibold">Competitive Landscape</h2>
              <span className="rounded-full bg-gray-50 px-3 py-0.5 text-xs text-gray-500">Artists like you</span>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-500/20 text-sm font-bold text-pink-400">
                      NK
                    </div>
                    <div>
                      <p className="font-medium">Nova Klein</p>
                      <p className="text-xs text-gray-500">Indie-Electronic / 21K monthly listeners</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    12% this week
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Grew <span className="text-gray-900">12%</span> this week (you: 8.4%). She released a remix on Wednesday that
                  gained quick traction on TikTok. Her strategy: remix a track 4 weeks after release to reactivate the algorithm.
                  Worth considering for &ldquo;Midnight Dreams.&rdquo;
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 text-sm font-bold text-cyan-400">
                      SR
                    </div>
                    <div>
                      <p className="font-medium">Suki Ray</p>
                      <p className="text-xs text-gray-500">Dream Pop / 19K monthly listeners</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    Fresh Finds
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Got added to Spotify&apos;s <span className="text-gray-900">&ldquo;Fresh Finds&rdquo;</span> editorial playlist
                  this week. Her pitch strategy: early submission (3 weeks before release) combined with independent press
                  coverage from two blogs. This is the playbook to follow for Golden Hour.
                </p>
              </div>
            </div>
          </section>

          {/* Revenue This Week */}
          <section className="rounded-xl border border-gray-100 bg-white/60 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/20">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold">Revenue This Week</h2>
            </div>
            <div className="mb-6 flex items-end gap-6">
              <div>
                <p className="text-3xl font-bold">$18.42</p>
                <p className="text-sm text-gray-500">Estimated earnings</p>
              </div>
              <div className="rounded-lg bg-gray-50/60 px-3 py-1.5">
                <p className="text-sm font-medium text-gray-600">
                  Projected monthly: <span className="text-green-600">$79.20</span>
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {revenueBreakdown.map((item) => (
                <div key={item.platform} className="flex items-center gap-4">
                  <span className="w-28 text-sm text-gray-500">{item.platform}</span>
                  <div className="flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-gray-50">
                      <div
                        className="h-full rounded-full bg-green-500/70"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-16 text-right text-sm font-medium">${item.amount.toFixed(2)}</span>
                  <span className="w-12 text-right text-xs text-gray-500">{item.pct}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* AI Recommendation of the Week */}
          <section className="rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-zinc-900/60 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-purple-200">AI Recommendation of the Week</h2>
            </div>
            <p className="mb-4 leading-relaxed text-gray-600">
              Based on your audience data, your next release{" "}
              <span className="font-semibold text-gray-900">&ldquo;Golden Hour&rdquo;</span> would perform{" "}
              <span className="font-semibold text-purple-300">23% better</span> with a 3-week teaser campaign starting now.
              Your listeners engage most with behind-the-scenes content (2.3x avg engagement), and your peak discovery window
              is Tuesday-Thursday evenings. I&apos;ve drafted a content calendar that leverages both of these insights.
            </p>
            <button className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors">
              <Zap className="h-4 w-4" />
              Add Content Calendar to Release Plan
              <ChevronRight className="h-4 w-4" />
            </button>
          </section>

          {/* Previous Reports Archive */}
          <section className="rounded-xl border border-gray-100 bg-white/60 p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-700/40">
                <Calendar className="h-4 w-4 text-gray-500" />
              </div>
              <h2 className="text-lg font-semibold">Previous Reports</h2>
            </div>
            <div className="space-y-2">
              {previousReports.map((report) => (
                <button
                  key={report.date}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-100 bg-gray-50/40 px-4 py-3 text-left hover:border-gray-200 hover:bg-white/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{report.date}</span>
                    <span className="rounded-full bg-gray-50 px-2 py-0.5 text-xs text-gray-500">{report.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-600" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
