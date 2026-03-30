"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Music,
  Calendar,
  Users,
  BarChart3,
  FileText,
  Settings,
  MessageSquare,
  TrendingUp,
  Radio,
  Mic2,
  DollarSign,
  Globe,
  Target,
  Headphones,
  Library,
  ListMusic,
  PenTool,
  Share2,
  Bell,
  Megaphone,
  ShoppingBag,
  Heart,
  Ticket,
  Video,
  Image,
  Sparkles,
  Upload,
  Plus,
  Bot,
  Clock,
  ArrowRight,
  Command,
} from "lucide-react";

interface CommandItem {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: "Pages" | "Actions" | "Recent" | "Search Results";
  path: string;
  shortcut?: string;
}

// ------ Searchable mock data ------
const searchableData: CommandItem[] = [
  // Releases
  { id: "search-release-1", name: "Midnight Dreams", description: "Release", icon: Music, category: "Search Results", path: "/dashboard/releases" },
  { id: "search-release-2", name: "Golden Hour", description: "Release", icon: Music, category: "Search Results", path: "/dashboard/releases" },
  { id: "search-release-3", name: "Electric Pulse", description: "Release", icon: Music, category: "Search Results", path: "/dashboard/releases" },
  // Subscribers
  { id: "search-sub-1", name: "Sarah Johnson", description: "Subscriber", icon: Users, category: "Search Results", path: "/dashboard/fans" },
  { id: "search-sub-2", name: "Mike Chen", description: "Subscriber", icon: Users, category: "Search Results", path: "/dashboard/fans" },
  { id: "search-sub-3", name: "Alex Rivera", description: "Subscriber", icon: Users, category: "Search Results", path: "/dashboard/fans" },
  // Contracts
  { id: "search-contract-1", name: "Sony Distribution Agreement", description: "Contract", icon: FileText, category: "Search Results", path: "/dashboard/contracts" },
  { id: "search-contract-2", name: "Sync License - Nike", description: "Contract", icon: FileText, category: "Search Results", path: "/dashboard/contracts" },
];

const pages: CommandItem[] = [
  { id: "dashboard", name: "Dashboard", description: "Overview and key metrics", icon: LayoutDashboard, category: "Pages", path: "/dashboard" },
  { id: "releases", name: "Releases", description: "Manage release plans", icon: Music, category: "Pages", path: "/dashboard/releases" },
  { id: "calendar", name: "Calendar", description: "Release schedule calendar", icon: Calendar, category: "Pages", path: "/dashboard/calendar" },
  { id: "team", name: "Team", description: "Team members and roles", icon: Users, category: "Pages", path: "/dashboard/team" },
  { id: "analytics", name: "Analytics", description: "Performance analytics", icon: BarChart3, category: "Pages", path: "/dashboard/analytics" },
  { id: "content", name: "Content", description: "Content management", icon: FileText, category: "Pages", path: "/dashboard/content" },
  { id: "settings", name: "Settings", description: "Account settings", icon: Settings, category: "Pages", path: "/dashboard/settings" },
  { id: "messages", name: "Messages", description: "Inbox and conversations", icon: MessageSquare, category: "Pages", path: "/dashboard/messages" },
  { id: "growth", name: "Growth", description: "Growth tracking and goals", icon: TrendingUp, category: "Pages", path: "/dashboard/growth" },
  { id: "radio", name: "Radio Tracking", description: "Radio play monitoring", icon: Radio, category: "Pages", path: "/dashboard/radio" },
  { id: "recordings", name: "Recordings", description: "Studio sessions and recordings", icon: Mic2, category: "Pages", path: "/dashboard/recordings" },
  { id: "revenue", name: "Revenue", description: "Revenue and royalties", icon: DollarSign, category: "Pages", path: "/dashboard/revenue" },
  { id: "distribution", name: "Distribution", description: "Distribution channels", icon: Globe, category: "Pages", path: "/dashboard/distribution" },
  { id: "goals", name: "Goals", description: "Goals and milestones", icon: Target, category: "Pages", path: "/dashboard/goals" },
  { id: "streaming", name: "Streaming", description: "Streaming platform stats", icon: Headphones, category: "Pages", path: "/dashboard/streaming" },
  { id: "catalog", name: "Catalog", description: "Music catalog", icon: Library, category: "Pages", path: "/dashboard/catalog" },
  { id: "playlists", name: "Playlists", description: "Playlist pitching and tracking", icon: ListMusic, category: "Pages", path: "/dashboard/playlists" },
  { id: "playlist-pitching", name: "Playlist Pitching", description: "AI-powered playlist pitching", icon: ListMusic, category: "Pages", path: "/dashboard/playlist-pitching" },
  { id: "songwriting", name: "Songwriting", description: "Songwriting sessions and splits", icon: PenTool, category: "Pages", path: "/dashboard/songwriting" },
  { id: "social", name: "Social Media", description: "Social media management", icon: Share2, category: "Pages", path: "/dashboard/social" },
  { id: "notifications", name: "Notifications", description: "Alerts and notifications", icon: Bell, category: "Pages", path: "/dashboard/notifications" },
  { id: "marketing", name: "Marketing", description: "Marketing campaigns", icon: Megaphone, category: "Pages", path: "/dashboard/marketing" },
  { id: "merch", name: "Merch", description: "Merchandise store", icon: ShoppingBag, category: "Pages", path: "/dashboard/merch" },
  { id: "fans", name: "Fans", description: "Fan engagement and CRM", icon: Heart, category: "Pages", path: "/dashboard/fans" },
  { id: "events", name: "Events", description: "Live events and tours", icon: Ticket, category: "Pages", path: "/dashboard/events" },
  { id: "videos", name: "Videos", description: "Music video management", icon: Video, category: "Pages", path: "/dashboard/videos" },
  { id: "artwork", name: "Artwork", description: "Cover art and visual assets", icon: Image, category: "Pages", path: "/dashboard/artwork" },
  { id: "ai-manager", name: "AI Manager", description: "AI-powered music manager", icon: Sparkles, category: "Pages", path: "/dashboard/ai-manager" },
  { id: "ai-autopilot", name: "AI Autopilot", description: "AI action queue and autonomous management", icon: Bot, category: "Pages", path: "/dashboard/ai-autopilot" },
  { id: "contracts", name: "Contracts", description: "Contracts and agreements", icon: FileText, category: "Pages", path: "/dashboard/contracts" },
  { id: "sync", name: "Sync Licensing", description: "Sync and licensing deals", icon: Globe, category: "Pages", path: "/dashboard/sync" },
  { id: "press", name: "Press", description: "Press kit and media coverage", icon: Megaphone, category: "Pages", path: "/dashboard/press" },
  { id: "collabs", name: "Collaborations", description: "Artist collaborations", icon: Users, category: "Pages", path: "/dashboard/collabs" },
  { id: "publishing", name: "Publishing", description: "Music publishing admin", icon: FileText, category: "Pages", path: "/dashboard/publishing" },
  { id: "sync-licensing", name: "Sync Licensing", description: "Sync and licensing deals", icon: Globe, category: "Pages", path: "/dashboard/sync-licensing" },
  { id: "live-hub", name: "Live Hub", description: "Live performance management", icon: Mic2, category: "Pages", path: "/dashboard/live-hub" },
  { id: "collab-marketplace", name: "Collab Marketplace", description: "Find and manage collaborations", icon: Users, category: "Pages", path: "/dashboard/collab-marketplace" },
  { id: "press-outreach", name: "Press Outreach", description: "AI-powered press and media outreach", icon: Megaphone, category: "Pages", path: "/dashboard/press-outreach" },
  { id: "audience-growth", name: "Audience Growth", description: "Audience growth strategies and tracking", icon: TrendingUp, category: "Pages", path: "/dashboard/audience-growth" },
  { id: "royalty-tracker", name: "Royalty Tracker", description: "Track and reconcile royalty payments", icon: DollarSign, category: "Pages", path: "/dashboard/royalty-tracker" },
  { id: "career-dna", name: "Career DNA", description: "AI-powered career analysis and insights", icon: Sparkles, category: "Pages", path: "/dashboard/career-dna" },
  { id: "fan-value-score", name: "Fan Value Score", description: "Measure and track fan engagement value", icon: Heart, category: "Pages", path: "/dashboard/fan-value" },
  { id: "release-replay", name: "Release Replay", description: "Replay and analyze past releases", icon: Clock, category: "Pages", path: "/dashboard/release-replay" },
  { id: "opportunity-radar", name: "Opportunity Radar", description: "Discover new career opportunities", icon: Target, category: "Pages", path: "/dashboard/opportunity-radar" },
  { id: "smart-negotiator", name: "Smart Negotiator", description: "AI-powered deal negotiation assistant", icon: Bot, category: "Pages", path: "/dashboard/smart-negotiator" },
  { id: "revenue-forecast", name: "Revenue Forecast", description: "AI revenue projections and forecasting", icon: TrendingUp, category: "Pages", path: "/dashboard/revenue-forecast" },
  { id: "seo-aieo", name: "SEO & AIEO", description: "Search engine and AI engine optimization", icon: Search, category: "Pages", path: "/dashboard/seo-aieo" },
];

const actions: CommandItem[] = [
  { id: "action-release", name: "Create Release Plan", description: "Start a new release plan", icon: Plus, category: "Actions", path: "/dashboard/releases/new", shortcut: "N" },
  { id: "action-content", name: "Generate Content", description: "AI-generate social content", icon: Sparkles, category: "Actions", path: "/dashboard/content/generate", shortcut: "G" },
  { id: "action-upload", name: "Upload Track", description: "Upload a new track", icon: Upload, category: "Actions", path: "/dashboard/catalog/upload", shortcut: "U" },
  { id: "action-ai", name: "Ask AI Manager", description: "Chat with your AI manager", icon: Bot, category: "Actions", path: "/dashboard/ai-manager", shortcut: "A" },
];

const recentItems: CommandItem[] = [
  { id: "recent-1", name: "Analytics", description: "Last visited 2 hours ago", icon: BarChart3, category: "Recent", path: "/dashboard/analytics" },
  { id: "recent-2", name: "Releases", description: "Last visited 5 hours ago", icon: Music, category: "Recent", path: "/dashboard/releases" },
  { id: "recent-3", name: "AI Manager", description: "Last visited yesterday", icon: Sparkles, category: "Recent", path: "/dashboard/ai-manager" },
];

const allItems = [...recentItems, ...actions, ...pages];

const categoryOrder: Record<string, number> = { "Search Results": 0, Recent: 1, Actions: 2, Pages: 3 };

const categoryBadgeColors: Record<string, string> = {
  "Search Results": "bg-green-100 text-green-700",
  Recent: "bg-gray-100 text-gray-600",
  Actions: "bg-purple-100 text-purple-700",
  Pages: "bg-blue-100 text-blue-700",
};

export default function CommandK() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    // Search across mock data as well when there is a query
    const matchingSearchResults = searchableData.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
    const matchingPages = allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
    return [...matchingSearchResults, ...matchingPages];
  }, [query]);

  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const item of filtered) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return Object.entries(groups).sort(
      ([a], [b]) => (categoryOrder[a] ?? 99) - (categoryOrder[b] ?? 99)
    );
  }, [filtered]);

  const flatFiltered = useMemo(() => {
    return grouped.flatMap(([, items]) => items);
  }, [grouped]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      setOpen(false);
      router.push(item.path);
    },
    [router]
  );

  // Arrow key navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < flatFiltered.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : flatFiltered.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (flatFiltered[selectedIndex]) {
          handleSelect(flatFiltered[selectedIndex]);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    },
    [flatFiltered, selectedIndex, handleSelect]
  );

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!open) return null;

  let runningIndex = 0;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, actions..."
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {flatFiltered.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-gray-500">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {grouped.map(([category, items]) => {
            const startIndex = runningIndex;
            runningIndex += items.length;

            return (
              <div key={category}>
                <div className="px-4 pt-3 pb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    {category}
                  </span>
                </div>
                {items.map((item, i) => {
                  const globalIndex = startIndex + i;
                  const isSelected = globalIndex === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      data-index={globalIndex}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isSelected
                          ? "bg-blue-50 text-blue-900"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                    >
                      <Icon
                        className={`h-4 w-4 flex-shrink-0 ${
                          isSelected ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="ml-2 text-xs text-gray-400">
                          {item.description}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          categoryBadgeColors[item.category]
                        }`}
                      >
                        {item.category}
                      </span>
                      {item.shortcut && (
                        <kbd className="ml-1 inline-flex items-center rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-400">
                          {item.shortcut}
                        </kbd>
                      )}
                      {isSelected && (
                        <ArrowRight className="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-gray-200 px-4 py-2 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-medium">
              <span className="text-[10px]">&#8593;&#8595;</span>
            </kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-medium">
              &#9166;
            </kbd>
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-medium">
              esc
            </kbd>
            close
          </span>
          <span className="ml-auto flex items-center gap-1">
            <Command className="h-3 w-3" />K to toggle
          </span>
        </div>
      </div>
    </div>
  );
}
