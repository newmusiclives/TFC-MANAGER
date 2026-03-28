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
  FileSearch,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
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
} from "lucide-react";
import { useState } from "react";

type NavSection = {
  title: string;
  items: { label: string; href: string; icon: React.ElementType; badge?: string }[];
};

const navSections: NavSection[] = [
  {
    title: "Core",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "AI Manager", href: "/dashboard/ai-manager", icon: MessageCircle, badge: "AI" },
      { label: "Weekly Report", href: "/dashboard/weekly-report", icon: FileBarChart, badge: "AI" },
      { label: "Artist Profile", href: "/artist", icon: Music2 },
      { label: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
      { label: "Quick Capture", href: "/dashboard/quick-capture", icon: Lightbulb },
    ],
  },
  {
    title: "Release Tools",
    items: [
      { label: "Release Plans", href: "/dashboard/release-plans", icon: FileText },
      { label: "Release Simulator", href: "/dashboard/release-simulator", icon: FlaskConical, badge: "AI" },
      { label: "Release Kit", href: "/dashboard/release-kit", icon: Package },
      { label: "Distribution", href: "/dashboard/distribution", icon: Truck },
      { label: "Smart Links", href: "/dashboard/smart-links", icon: Link2 },
      { label: "Listening Links", href: "/dashboard/listening-links", icon: Lock },
    ],
  },
  {
    title: "Create",
    items: [
      { label: "Content Generator", href: "/dashboard/content-generator", icon: Sparkles, badge: "AI" },
      { label: "Social Scheduler", href: "/dashboard/social-scheduler", icon: Share2 },
      { label: "Banner Creator", href: "/dashboard/banner-creator", icon: Image },
      { label: "Video Storyboard", href: "/dashboard/storyboard", icon: Film, badge: "AI" },
      { label: "Website / EPK", href: "/dashboard/website", icon: Globe },
      { label: "Link-in-Bio", href: "/dashboard/link-in-bio", icon: LinkIcon },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { label: "Sound Analysis", href: "/dashboard/sound-analysis", icon: AudioWaveform, badge: "AI" },
      { label: "Fan Heatmap", href: "/dashboard/fan-heatmap", icon: MapPin },
      { label: "Career Path", href: "/dashboard/career-path", icon: Trophy },
      { label: "Trends Radar", href: "/dashboard/trends-radar", icon: Radar },
      { label: "Competitive Intel", href: "/dashboard/competitive-intel", icon: Target, badge: "AI" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Earnings", href: "/dashboard/earnings", icon: Wallet },
      { label: "Fan CRM", href: "/dashboard/fan-crm", icon: Mail },
      { label: "Fan Funding", href: "/dashboard/fan-funding", icon: Heart },
      { label: "Revenue Splits", href: "/dashboard/revenue-splits", icon: DollarSign },
      { label: "Collab Rooms", href: "/dashboard/collab-rooms", icon: Users },
      { label: "Gigs & Shows", href: "/dashboard/gigs", icon: Mic2 },
      { label: "Contract Analysis", href: "/dashboard/contracts", icon: FileSearch, badge: "AI" },
    ],
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-gray-950 text-white flex-col transition-all duration-300 z-40 hidden lg:flex ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-800">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[var(--primary)] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">TF</span>
            </div>
            <span className="font-bold text-base tracking-tight">
              TrueFans<span className="text-[var(--primary)]"> Manager</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 bg-[var(--primary)] rounded-md flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xs">TF</span>
          </div>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-18 w-6 h-6 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <nav className="flex-1 py-1 px-2 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="mb-2">
            {!collapsed && (
              <div className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-gray-600">
                {section.title}
              </div>
            )}
            {collapsed && <div className="border-t border-gray-800 my-1.5" />}
            <div className="space-y-px">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--primary)] text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={16} className="shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-xs font-bold px-1.5 py-0.5 rounded-full leading-none ${
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
          </div>
        ))}
      </nav>

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
