"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Music2,
  BarChart3,
  Link2,
  Globe,
  FileText,
  Sparkles,
  Image,
  Lock,
  ListMusic,
  FileSearch,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  MapPin,
  FlaskConical,
  Film,
  Trophy,
  Users,
  DollarSign,
  Radar,
  Package,
  Heart,
  CalendarDays,
  Mail,
  Bell,
  FileBarChart,
  AudioWaveform,
  Share2,
  Wallet,
  LinkIcon,
  Truck,
  Mic2,
  Search,
  Lightbulb,
  Target,
  Zap,
  Dna,
  RotateCcw,
  Scale,
  LineChart,
  Receipt,
  Newspaper,
  TrendingUp,
  Disc,
} from "lucide-react";
import { useState, useEffect } from "react";

type NavSection = {
  title: string;
  icon: React.ElementType;
  items: { label: string; href: string; icon: React.ElementType; badge?: string }[];
};

const navSections: NavSection[] = [
  {
    title: "Core",
    icon: LayoutDashboard,
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "AI Manager", href: "/dashboard/ai-manager", icon: MessageCircle, badge: "AI" },
      { label: "AI Autopilot", href: "/dashboard/ai-autopilot", icon: Zap, badge: "AI" },
      { label: "Weekly Report", href: "/dashboard/weekly-report", icon: FileBarChart, badge: "AI" },
      { label: "Artist Profile", href: "/artist", icon: Music2 },
      { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { label: "Quick Capture", href: "/dashboard/quick-capture", icon: Lightbulb },
      { label: "Team", href: "/dashboard/team", icon: Users },
    ],
  },
  {
    title: "Release Tools",
    icon: Music2,
    items: [
      { label: "Release Plans", href: "/dashboard/release-plans", icon: FileText },
      { label: "Release Simulator", href: "/dashboard/release-simulator", icon: FlaskConical, badge: "AI" },
      { label: "Release Kit", href: "/dashboard/release-kit", icon: Package },
      { label: "Distribution", href: "/dashboard/distribution", icon: Truck },
      { label: "Smart Links", href: "/dashboard/smart-links", icon: Link2 },
      { label: "Playlist Pitching", href: "/dashboard/playlist-pitching", icon: ListMusic, badge: "AI" },
      { label: "Sync Licensing", href: "/dashboard/sync-licensing", icon: Disc },
      { label: "Listening Links", href: "/dashboard/listening-links", icon: Lock },
    ],
  },
  {
    title: "Create",
    icon: Sparkles,
    items: [
      { label: "Content Generator", href: "/dashboard/content-generator", icon: Sparkles, badge: "AI" },
      { label: "Social Scheduler", href: "/dashboard/social-scheduler", icon: Share2 },
      { label: "Banner Creator", href: "/dashboard/banner-creator", icon: Image },
      { label: "Video Storyboard", href: "/dashboard/storyboard", icon: Film, badge: "AI" },
      { label: "Website / EPK", href: "/dashboard/website", icon: Globe },
      { label: "Link-in-Bio", href: "/dashboard/link-in-bio", icon: LinkIcon },
      { label: "Press Outreach", href: "/dashboard/press-outreach", icon: Newspaper, badge: "AI" },
    ],
  },
  {
    title: "Intelligence",
    icon: BarChart3,
    items: [
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { label: "Sound Analysis", href: "/dashboard/sound-analysis", icon: AudioWaveform, badge: "AI" },
      { label: "Fan Heatmap", href: "/dashboard/fan-heatmap", icon: MapPin },
      { label: "Career Path", href: "/dashboard/career-path", icon: Trophy },
      { label: "Career DNA", href: "/dashboard/career-dna", icon: Dna, badge: "AI" },
      { label: "Trends Radar", href: "/dashboard/trends-radar", icon: Radar },
      { label: "Competitive Intel", href: "/dashboard/competitive-intel", icon: Target, badge: "AI" },
      { label: "Audience Growth", href: "/dashboard/audience-growth", icon: TrendingUp, badge: "AI" },
      { label: "SEO & AIEO", href: "/dashboard/seo-aieo", icon: Search, badge: "AI" },
      { label: "Opportunity Radar", href: "/dashboard/opportunity-radar", icon: Search, badge: "AI" },
      { label: "Revenue Forecast", href: "/dashboard/revenue-forecast", icon: LineChart, badge: "AI" },
    ],
  },
  {
    title: "Business",
    icon: Wallet,
    items: [
      { label: "Earnings", href: "/dashboard/earnings", icon: Wallet },
      { label: "Fan CRM", href: "/dashboard/fan-crm", icon: Mail },
      { label: "Fan Funding", href: "/dashboard/fan-funding", icon: Heart },
      { label: "Revenue Splits", href: "/dashboard/revenue-splits", icon: DollarSign },
      { label: "Collab Rooms", href: "/dashboard/collab-rooms", icon: Users },
      { label: "Gigs & Shows", href: "/dashboard/gigs", icon: Mic2 },
      { label: "Live Hub", href: "/dashboard/live-hub", icon: Mic2 },
      { label: "Collab Marketplace", href: "/dashboard/collab-marketplace", icon: Users },
      { label: "Royalty Tracker", href: "/dashboard/royalty-tracker", icon: Receipt },
      { label: "Contract Analysis", href: "/dashboard/contracts", icon: FileSearch, badge: "AI" },
      { label: "Smart Negotiator", href: "/dashboard/smart-negotiator", icon: Scale, badge: "AI" },
      { label: "Fan Value Score", href: "/dashboard/fan-value", icon: DollarSign },
      { label: "Release Replay", href: "/dashboard/release-replay", icon: RotateCcw, badge: "AI" },
    ],
  },
];

function sectionHasActiveItem(section: NavSection, pathname: string) {
  return section.items.some((item) => pathname === item.href);
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Auto-expand the section containing the active page
  useEffect(() => {
    const activeSection = navSections.find((s) => sectionHasActiveItem(s, pathname));
    if (activeSection && !openSections[activeSection.title]) {
      setOpenSections((prev) => ({ ...prev, [activeSection.title]: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-950 text-white flex-col transition-all duration-300 z-40 hidden lg:flex ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-800">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[var(--primary)] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">TF</span>
            </div>
            <span className="font-bold text-base tracking-tight">
              TrueFans<span className="text-[var(--primary)]"> MANAGER</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 bg-[var(--primary)] rounded-md flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xs">TF</span>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-18 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-2 overflow-y-auto">
        {navSections.map((section) => {
          const isOpen = openSections[section.title] ?? false;
          const hasActive = sectionHasActiveItem(section, pathname);
          const SectionIcon = section.icon;

          return (
            <div key={section.title} className="mb-1">
              {/* Category header — clickable to expand/collapse */}
              {!collapsed ? (
                <button
                  onClick={() => toggleSection(section.title)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    hasActive
                      ? "text-[var(--primary)]"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                  }`}
                >
                  <SectionIcon size={16} className="shrink-0" />
                  <span className="flex-1 text-left">{section.title}</span>
                  {hasActive && !isOpen && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                  )}
                  <ChevronDown
                    size={14}
                    className={`shrink-0 text-gray-600 transition-transform duration-200 ${
                      isOpen ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>
              ) : (
                <div className="border-t border-gray-800 my-1.5" />
              )}

              {/* Items — collapsible in expanded mode, always shown in collapsed mode */}
              {(collapsed || isOpen) && (
                <div className={`space-y-px ${!collapsed ? "ml-2 pl-2 border-l border-gray-800/60" : ""}`}>
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 px-2.5 py-[6px] rounded-lg text-[13px] font-medium transition-colors ${
                          isActive
                            ? "bg-[var(--primary)] text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <item.icon size={15} className="shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                                  item.badge === "AI"
                                    ? "bg-purple-500/20 text-purple-300"
                                    : "bg-[var(--primary)]/20 text-[var(--primary)]"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-2 space-y-px">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-sm font-medium transition-colors ${
            pathname === "/dashboard/settings"
              ? "bg-[var(--primary)] text-white"
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          <Settings size={16} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </Link>
      </div>
    </aside>
  );
}
