"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Link2,
  Globe,
  Sparkles,
  BarChart3,
  Image,
  Lock,
  FileSearch,
  Upload,
  Zap,
  ClipboardList,
  MessageSquare,
  FileText,
  Music,
  PenTool,
  TrendingUp,
  Eye,
  Target,
  Users,
  Calendar,
  DollarSign,
  PieChart,
  Briefcase,
  Heart,
  Star,
  Radio,
  Send,
  Layers,
  Video,
  Map,
  Compass,
  Mic,
  Share2,
  LayoutGrid,
  Wallet,
  Scale,
  Ticket,
  HeartHandshake,
  Lightbulb,
  Search,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const aiFeatures = [
  {
    icon: MessageSquare,
    title: "AI Manager Chat",
    desc: "Your 24/7 virtual A&R. Ask anything about your career, releases, or strategy and get expert-level guidance instantly.",
  },
  {
    icon: FileText,
    title: "AI Weekly Reports",
    desc: "Automated manager briefings delivered every week summarizing your streams, growth, opportunities, and next steps.",
  },
  {
    icon: Music,
    title: "AI Sound Analysis",
    desc: "Upload a track and receive detailed feedback on mix quality, genre positioning, mood profiling, and commercial potential.",
  },
  {
    icon: PenTool,
    title: "AI Content Generator",
    desc: "Generate social posts, email campaigns, press releases, and artist bios tailored to your brand and upcoming releases.",
  },
  {
    icon: TrendingUp,
    title: "AI Release Simulator",
    desc: "Predict streaming performance before you release. Model different scenarios, timing, and promotional budgets.",
  },
  {
    icon: Video,
    title: "AI Video Storyboards",
    desc: "Turn your music into visual concepts. Get scene-by-scene storyboards for music videos based on lyrics and mood.",
  },
  {
    icon: Search,
    title: "AI Competitive Intel",
    desc: "Know your landscape. Track similar artists, discover playlist opportunities, and benchmark your growth against peers.",
  },
  {
    icon: Search,
    title: "SEO & AI Engine Optimization",
    desc: "Optimize your presence for Google AND AI engines like ChatGPT and Perplexity. Get found by both humans and machines.",
  },
];

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Connect & Upload",
    desc: "Link your streaming accounts, upload your tracks, and tell us about your goals. Setup takes under 5 minutes.",
  },
  {
    icon: Zap,
    step: "02",
    title: "AI Does the Work",
    desc: "Our AI analyzes your music, audience, and market to generate a complete release strategy, content, and promotional plan.",
  },
  {
    icon: ClipboardList,
    step: "03",
    title: "Execute & Grow",
    desc: "Follow your personalized action plan, schedule content, track results in real-time, and watch your career accelerate.",
  },
];

type TabKey =
  | "release"
  | "create"
  | "intelligence"
  | "business"
  | "fan";

const featureTabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "release", label: "Release Tools", icon: Radio },
  { key: "create", label: "Create & Promote", icon: PenTool },
  { key: "intelligence", label: "Intelligence & Analytics", icon: BarChart3 },
  { key: "business", label: "Business & Revenue", icon: DollarSign },
  { key: "fan", label: "Fan Engagement", icon: Heart },
];

const featuresByTab: Record<
  TabKey,
  { icon: React.ElementType; title: string; desc: string }[]
> = {
  release: [
    { icon: ClipboardList, title: "Release Plans", desc: "Step-by-step rollout strategies customized to your genre, audience, and goals." },
    { icon: TrendingUp, title: "Release Simulator", desc: "Predict streaming performance and test different launch scenarios before going live." },
    { icon: Share2, title: "Release Kit Export", desc: "Download a complete press kit with artwork, one-sheets, and promotional copy." },
    { icon: Compass, title: "Distribution Tracker", desc: "Monitor your release across every distributor and store in real-time." },
    { icon: Link2, title: "Smart Links", desc: "One link for all platforms. Fan-choice landing pages that maximize conversions." },
    { icon: Lock, title: "Private Listening Links", desc: "Secure pre-release sharing for press, labels, A&Rs, and collaborators." },
  ],
  create: [
    { icon: PenTool, title: "Content Generator", desc: "AI-crafted social posts, captions, emails, and press releases on demand." },
    { icon: Send, title: "Social Scheduler", desc: "Plan and auto-publish across all social platforms from one calendar." },
    { icon: Image, title: "Banner Creator", desc: "Generate platform-specific visuals, stories, and cover art variations instantly." },
    { icon: Video, title: "Video Storyboard", desc: "Scene-by-scene visual concepts for music videos generated from your tracks." },
    { icon: Globe, title: "Website / EPK", desc: "Professional artist website and electronic press kit, always up to date." },
    { icon: LayoutGrid, title: "Link-in-Bio", desc: "Customizable hub page with music, merch, socials, and upcoming shows." },
  ],
  intelligence: [
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Unified view of streams, listeners, revenue, and growth across all platforms." },
    { icon: Music, title: "Sound Analysis", desc: "AI feedback on mix, genre fit, mood profiling, and commercial readiness." },
    { icon: Map, title: "Fan Heatmap", desc: "Visualize where your listeners are geographically and discover touring opportunities." },
    { icon: Target, title: "Career Path", desc: "AI-generated milestone roadmap with actionable steps toward your goals." },
    { icon: Lightbulb, title: "Trends Radar", desc: "Stay ahead with real-time genre trends, viral sounds, and playlist movements." },
    { icon: Search, title: "Competitive Intel", desc: "Benchmark against peers, track similar artists, and find whitespace opportunities." },
    { icon: Search, title: "SEO & AIEO", desc: "Comprehensive search engine and AI engine optimization. Structured data, keyword analysis, and AI visibility tracking." },
  ],
  business: [
    { icon: Wallet, title: "Earnings Dashboard", desc: "Track revenue from every source: streams, merch, sync, and live in one place." },
    { icon: PieChart, title: "Revenue Splits", desc: "Manage collaborator splits, automate payments, and keep accounting transparent." },
    { icon: Scale, title: "Contract Analysis", desc: "AI-powered legal doc simplification. Understand what you are signing before you sign." },
    { icon: Ticket, title: "Gig Manager", desc: "Organize shows, manage riders, track guarantees, and settle finances." },
    { icon: HeartHandshake, title: "Fan Funding", desc: "Accept tips, pre-orders, and crowdfunding directly from your biggest supporters." },
  ],
  fan: [
    { icon: Users, title: "Fan CRM", desc: "Manage your entire fanbase with segments, tags, and communication history." },
    { icon: Star, title: "Superfan Detection", desc: "AI identifies your most engaged fans so you can reward and retain them." },
    { icon: Layers, title: "Collaboration Rooms", desc: "Private spaces to share works-in-progress and collaborate with other artists." },
    { icon: Mic, title: "Quick Capture", desc: "Record voice memos, lyric ideas, or melodies on the go and organize them later." },
    { icon: Calendar, title: "Calendar", desc: "Unified schedule with release dates, deadlines, shows, and promotional milestones." },
  ],
};

const testimonials = [
  {
    name: "Yaya Mint\u00e9",
    genre: "Soul / Pop",
    quote:
      "Thanks to TrueFans MANAGER, I was able to focus on music creation while benefiting from a complete and professional marketing plan. It changed everything.",
    avatar: "YM",
  },
  {
    name: "Pablo Lucas",
    genre: "Pop / Rock",
    quote:
      "The detailed release plan and pre-formatted promotional materials made launching my latest single incredibly smooth. Highly recommend it!",
    avatar: "PL",
  },
  {
    name: "Janis Carmelo",
    genre: "R&B / Pop",
    quote:
      "This platform gave me the essential promotional guidance I needed and simplified my entire career management. A game-changer for independents.",
    avatar: "JC",
  },
  {
    name: "Kwame Asante",
    genre: "Afrobeats / Hip-Hop",
    quote:
      "The AI Manager chat alone is worth it. It is like having a real A&R on call 24/7 who actually understands independent artists. My streams tripled in three months.",
    avatar: "KA",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    period: "Forever",
    highlight: false,
    cta: "Get started",
    features: [
      "1 release plan per month",
      "Basic analytics dashboard",
      "1 smart link",
      "Link-in-Bio page",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$30",
    period: "/mo",
    highlight: true,
    cta: "Get started",
    badge: "FREE with TrueFans CONNECT",
    features: [
      "Unlimited release plans",
      "AI Manager Chat",
      "Sound Analysis",
      "Content Generator",
      "Social Scheduler",
      "Fan CRM & Superfan Detection",
      "Full analytics dashboard",
      "Unlimited smart links",
      "Website / EPK",
      "Distribution tracking",
    ],
  },
  {
    name: "Business",
    price: "$100",
    period: "/mo",
    highlight: false,
    cta: "Get started",
    features: [
      "Everything in Pro",
      "Contract Analysis",
      "Revenue Splits",
      "Gig Manager",
      "Competitive Intel",
      "AI Weekly Reports",
      "Release Simulator",
      "Priority support",
      "Multi-artist management",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("release");

  return (
    <>
      <Header />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="hero-section pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Sparkles size={16} />
            AI-Powered Artist Management
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            The AI-Powered Platform
            <br />
            <span className="text-[var(--primary)]">
              That Manages Your Music Career
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
            Release plans, analytics, content, distribution, fan engagement,
            earnings &mdash; all powered by AI.
          </p>
          <p className="text-gray-500 dark:text-gray-500 mb-10">
            Everything independent artists need. Nothing they don&apos;t.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              Sign up for free
              <ArrowRight size={20} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold px-8 py-4 rounded-full text-lg transition-colors"
            >
              Explore features
            </a>
          </div>
        </div>
      </section>

      {/* ── Trusted By Numbers ────────────────────────────────── */}
      <section className="py-10 px-4 bg-white dark:bg-[#111] border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "2,400+", label: "Artists" },
            { value: "4.5M+", label: "Streams Managed" },
            { value: "12,000+", label: "Releases" },
            { value: "48", label: "Countries" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl sm:text-4xl font-extrabold text-[var(--primary)]">
                {s.value}
              </div>
              <div className="text-sm text-gray-500 mt-1 font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI-First Management ───────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <Sparkles size={16} />
              AI-First
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Your AI management team,
              <span className="text-[var(--primary)]"> always on</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              Seven AI-powered tools working around the clock so you can focus on
              making music.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiFeatures.map((f) => (
              <div
                key={f.title}
                className="flex gap-5 bg-white dark:bg-[#1a1a1a] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-[var(--primary)]/30 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center shrink-0">
                  <f.icon size={24} className="text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white dark:bg-[#111]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              From upload to action plan in minutes &mdash; not weeks.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div
                key={s.step}
                className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <s.icon size={28} className="text-[var(--primary)]" />
                </div>
                <div className="text-xs font-bold text-[var(--primary)] mb-2">
                  STEP {s.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Complete Feature Suite (Tabbed) ───────────────────── */}
      <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Complete feature suite
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              Everything you need to release, promote, analyze, monetize, and
              grow &mdash; in one platform.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {featureTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[var(--primary)] text-white"
                      : "bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresByTab[activeTab].map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] p-6 hover:border-[var(--primary)]/30 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[var(--primary)]/20 transition-colors">
                  <f.icon size={24} className="text-[var(--primary)]" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section id="testimonials" className="py-20 px-4 bg-white dark:bg-[#111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What artists say
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Join thousands of independent artists already growing with
              TrueFans MANAGER.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-gray-50 dark:bg-[#1a1a1a] rounded-2xl p-8 border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.genre}</div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────── */}
      <section id="about" className="py-20 px-4 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              About TrueFans MANAGER
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              Built by music industry veterans who understand what independent
              artists actually need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
              <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                AD
              </div>
              <h3 className="text-xl font-bold mb-1">Alexandre Deniot</h3>
              <p className="text-sm text-[var(--primary)] font-medium mb-4">
                Founder &amp; CEO
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                20+ years of music industry experience. Formerly worked with
                Grammy-nominated artists and multi-platinum producers. Former
                director at major music events and labels.
              </p>
              <blockquote className="mt-4 border-l-2 border-[var(--primary)] pl-4 text-sm text-gray-500 italic">
                &ldquo;I&apos;ve met thousands of artists worldwide and I
                understand their challenges. That&apos;s why we created TrueFans
                MANAGER: to give them the support they need to succeed.&rdquo;
              </blockquote>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
              <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                TQ
              </div>
              <h3 className="text-xl font-bold mb-1">Thomas Quenoil</h3>
              <p className="text-sm text-[var(--primary)] font-medium mb-4">
                Co-founder &amp; COO
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                20+ years of industry experience with a focus on operational
                excellence. Passionate about transforming creative passion into
                sustainable careers while maintaining artist independence through
                AI-assisted management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-4 bg-gray-950 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start for free
          </h2>
          <p className="text-gray-400 mb-12 max-w-md mx-auto">
            No credit card required. Upgrade when you&apos;re ready.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-gray-900 rounded-2xl p-8 relative ${
                  plan.highlight
                    ? "border-2 border-[var(--primary)]"
                    : "border border-gray-800"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--primary)] text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                <div className="text-4xl font-extrabold mb-1">
                  {plan.price}
                  {plan.period !== "Forever" && (
                    <span className="text-lg font-normal text-gray-500">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-4">
                  {plan.period === "Forever" ? "Forever" : "Billed monthly"}
                </p>
                {plan.name === "Pro" && (
                  <div className="mb-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl px-3 py-2 text-center">
                    <a href="https://truefansconnect.com" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors">
                      FREE with TrueFans CONNECT
                    </a>
                  </div>
                )}
                <ul className="text-sm text-gray-400 space-y-3 text-left mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex gap-2">
                      <CheckCircle2
                        size={16}
                        className="text-[var(--primary)] shrink-0 mt-0.5"
                      />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signin"
                  className={`block text-center rounded-full py-3 font-semibold text-sm transition-colors ${
                    plan.highlight
                      ? "bg-[var(--primary)] hover:bg-[var(--primary-dark)]"
                      : "border border-gray-700 hover:border-gray-500"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* TrueFans CONNECT callout */}
          <div className="max-w-2xl mx-auto mt-12 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 text-center">
            <h3 className="font-bold text-lg text-white mb-2">
              Already on TrueFans CONNECT?
            </h3>
            <p className="text-gray-400 text-sm mb-4 max-w-lg mx-auto">
              Artists with an active{" "}
              <a
                href="https://truefansconnect.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
              >
                TrueFans CONNECT
              </a>{" "}
              subscription get <strong className="text-white">TrueFans MANAGER Pro ($30/mo) completely free</strong>.
              Link your account after signing up to activate.
            </p>
            <a
              href="https://truefansconnect.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
            >
              Learn about TrueFans CONNECT
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[var(--primary)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to boost your music career?
          </h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Join thousands of independent artists using AI-powered management to
            release smarter and grow faster.
          </p>
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-8 py-4 rounded-full text-lg hover:bg-gray-100 transition-colors"
          >
            Sign up for free
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
