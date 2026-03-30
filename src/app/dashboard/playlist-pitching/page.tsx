"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  ListMusic,
  Search,
  Filter,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  Sparkles,
  Users,
  BarChart3,
  TrendingUp,
  Target,
  Zap,
  X,
  ChevronDown,
  Music,
  ExternalLink,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPatch } from "@/lib/api-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PitchStatus = "draft" | "sent" | "opened" | "accepted" | "declined" | "no_response";

type Pitch = {
  id: string;
  curatorId: string;
  curatorName: string;
  playlistName: string;
  trackTitle: string;
  genre: string;
  message: string;
  status: PitchStatus;
  sentAt: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Curator = {
  id: string;
  name: string;
  email: string;
  playlistName: string;
  platform: string;
  genres: string[];
  followerCount: number;
  acceptanceRate: number;
  avgResponseDays: number;
  lastActive: string;
  bio: string;
};

type AutoMatch = {
  curator: Curator;
  matchScore: number;
  matchReasons: string[];
};

type PitchAnalytics = {
  totalPitches: number;
  sentCount: number;
  acceptedCount: number;
  declinedCount: number;
  noResponseCount: number;
  openedCount: number;
  successRate: number;
  responseRate: number;
  avgResponseDays: number;
  bestGenres: { genre: string; successRate: number; count: number }[];
  monthlyData: { month: string; sent: number; accepted: number }[];
  totalPlacements: number;
};

type Tab = "pitches" | "curators" | "auto-match" | "analytics";

// ---------------------------------------------------------------------------
// Mock data (fallback)
// ---------------------------------------------------------------------------

const MOCK_PITCHES: Pitch[] = [
  { id: "pitch_01", curatorId: "cur_01", curatorName: "Alex Rivera", playlistName: "Indie Gems", trackTitle: "Midnight Echoes", genre: "indie", message: "Hi Alex, I'd love to submit my latest single...", status: "accepted", sentAt: "2026-03-15T10:00:00Z", respondedAt: "2026-03-18T14:30:00Z", createdAt: "2026-03-14T09:00:00Z", updatedAt: "2026-03-18T14:30:00Z" },
  { id: "pitch_02", curatorId: "cur_05", curatorName: "Elena Kowalski", playlistName: "Fresh Finds Friday", trackTitle: "Neon Dreams", genre: "electro-pop", message: "Hey Elena, 'Neon Dreams' is a synth-driven...", status: "sent", sentAt: "2026-03-25T08:00:00Z", respondedAt: null, createdAt: "2026-03-24T16:00:00Z", updatedAt: "2026-03-25T08:00:00Z" },
  { id: "pitch_03", curatorId: "cur_03", curatorName: "Marcus Johnson", playlistName: "Soul Selections", trackTitle: "Golden Hour", genre: "neo-soul", message: "Marcus, I think 'Golden Hour' would be a perfect fit...", status: "opened", sentAt: "2026-03-20T12:00:00Z", respondedAt: null, createdAt: "2026-03-19T14:00:00Z", updatedAt: "2026-03-22T09:00:00Z" },
  { id: "pitch_04", curatorId: "cur_09", curatorName: "Liam Chen", playlistName: "Rock Vault", trackTitle: "Broken Frequencies", genre: "alternative", message: "Hi Liam, 'Broken Frequencies' blends alternative rock...", status: "declined", sentAt: "2026-03-10T09:00:00Z", respondedAt: "2026-03-16T11:00:00Z", createdAt: "2026-03-09T15:00:00Z", updatedAt: "2026-03-16T11:00:00Z" },
  { id: "pitch_05", curatorId: "cur_12", curatorName: "Sofia Andersson", playlistName: "Nordic Vibes", trackTitle: "Midnight Echoes", genre: "dream-pop", message: "Sofia, 'Midnight Echoes' has that dreamy, ethereal quality...", status: "draft", sentAt: null, respondedAt: null, createdAt: "2026-03-28T10:00:00Z", updatedAt: "2026-03-28T10:00:00Z" },
  { id: "pitch_06", curatorId: "cur_10", curatorName: "Ava Schmidt", playlistName: "Dancefloor Ready", trackTitle: "Pulse", genre: "house", message: "Hey Ava, 'Pulse' is a deep house track with...", status: "no_response", sentAt: "2026-03-01T07:00:00Z", respondedAt: null, createdAt: "2026-02-28T18:00:00Z", updatedAt: "2026-03-15T00:00:00Z" },
  { id: "pitch_07", curatorId: "cur_02", curatorName: "Samira Patel", playlistName: "Lo-Fi Study Beats", trackTitle: "Rainy Afternoon", genre: "lo-fi", message: "Samira, 'Rainy Afternoon' is a lo-fi beat...", status: "accepted", sentAt: "2026-03-05T11:00:00Z", respondedAt: "2026-03-10T08:00:00Z", createdAt: "2026-03-04T20:00:00Z", updatedAt: "2026-03-10T08:00:00Z" },
  { id: "pitch_08", curatorId: "cur_07", curatorName: "Isabelle Moreau", playlistName: "Acoustic Mornings", trackTitle: "Sunlit Path", genre: "acoustic", message: "Isabelle, 'Sunlit Path' is an acoustic track...", status: "sent", sentAt: "2026-03-27T06:00:00Z", respondedAt: null, createdAt: "2026-03-26T22:00:00Z", updatedAt: "2026-03-27T06:00:00Z" },
];

const MOCK_CURATORS: Curator[] = [
  { id: "cur_01", name: "Alex Rivera", email: "alex@playlisthub.com", playlistName: "Indie Gems", platform: "spotify", genres: ["indie", "alternative", "indie-pop"], followerCount: 45200, acceptanceRate: 18, avgResponseDays: 3, lastActive: "2026-03-28", bio: "Curating the best undiscovered indie tracks since 2019." },
  { id: "cur_02", name: "Samira Patel", email: "samira@beatdrop.co", playlistName: "Lo-Fi Study Beats", platform: "spotify", genres: ["lo-fi", "chillhop", "ambient"], followerCount: 128000, acceptanceRate: 8, avgResponseDays: 5, lastActive: "2026-03-27", bio: "The go-to playlist for focus and study sessions." },
  { id: "cur_03", name: "Marcus Johnson", email: "marcus@soulselections.com", playlistName: "Soul Selections", platform: "spotify", genres: ["r&b", "soul", "neo-soul"], followerCount: 67800, acceptanceRate: 15, avgResponseDays: 4, lastActive: "2026-03-29", bio: "Smooth R&B and neo-soul curated with love." },
  { id: "cur_04", name: "Yuki Tanaka", email: "yuki@tokyobeats.jp", playlistName: "Tokyo Night Drive", platform: "spotify", genres: ["electronic", "synthwave", "city-pop"], followerCount: 89300, acceptanceRate: 12, avgResponseDays: 7, lastActive: "2026-03-25", bio: "Late night electronic vibes from Tokyo and beyond." },
  { id: "cur_05", name: "Elena Kowalski", email: "elena@freshfinds.pl", playlistName: "Fresh Finds Friday", platform: "spotify", genres: ["pop", "indie-pop", "electro-pop"], followerCount: 156000, acceptanceRate: 6, avgResponseDays: 10, lastActive: "2026-03-28", bio: "Discovering tomorrow's pop stars today." },
  { id: "cur_06", name: "DeShawn Williams", email: "deshawn@hiphopunderground.com", playlistName: "Underground Heat", platform: "spotify", genres: ["hip-hop", "rap", "trap"], followerCount: 234000, acceptanceRate: 5, avgResponseDays: 14, lastActive: "2026-03-26", bio: "Raw, unfiltered hip-hop from the underground scene." },
  { id: "cur_07", name: "Isabelle Moreau", email: "isabelle@acousticmornings.fr", playlistName: "Acoustic Mornings", platform: "apple_music", genres: ["acoustic", "folk", "singer-songwriter"], followerCount: 31400, acceptanceRate: 22, avgResponseDays: 2, lastActive: "2026-03-29", bio: "Gentle acoustic tracks to start your day." },
  { id: "cur_08", name: "Omar Hassan", email: "omar@worldsounds.me", playlistName: "World Sounds", platform: "spotify", genres: ["world", "afrobeats", "latin"], followerCount: 52100, acceptanceRate: 20, avgResponseDays: 3, lastActive: "2026-03-28", bio: "Music without borders. Global beats and rhythms." },
  { id: "cur_09", name: "Liam Chen", email: "liam@rockvault.com", playlistName: "Rock Vault", platform: "spotify", genres: ["rock", "alternative", "punk"], followerCount: 98700, acceptanceRate: 10, avgResponseDays: 6, lastActive: "2026-03-27", bio: "New rock discoveries and timeless classics." },
  { id: "cur_10", name: "Ava Schmidt", email: "ava@dancefloorready.de", playlistName: "Dancefloor Ready", platform: "spotify", genres: ["house", "techno", "dance"], followerCount: 175000, acceptanceRate: 7, avgResponseDays: 8, lastActive: "2026-03-26", bio: "Club-ready tracks tested on real dancefloors." },
  { id: "cur_11", name: "Sofia Andersson", email: "sofia@nordicvibes.se", playlistName: "Nordic Vibes", platform: "spotify", genres: ["indie", "dream-pop", "shoegaze"], followerCount: 28900, acceptanceRate: 25, avgResponseDays: 2, lastActive: "2026-03-29", bio: "Ethereal sounds from Scandinavia and beyond." },
  { id: "cur_12", name: "Mei Lin", email: "mei@jazzlounge.hk", playlistName: "Jazz Lounge", platform: "tidal", genres: ["jazz", "smooth-jazz", "nu-jazz"], followerCount: 19800, acceptanceRate: 30, avgResponseDays: 2, lastActive: "2026-03-29", bio: "Contemporary and classic jazz for discerning ears." },
];

const MOCK_AUTO_MATCHES: AutoMatch[] = [
  { curator: MOCK_CURATORS[0], matchScore: 94, matchReasons: ["Genre alignment: indie", "Playlist energy level matches track", "Curator has history of accepting similar artists"] },
  { curator: MOCK_CURATORS[10], matchScore: 88, matchReasons: ["Dream-pop aesthetic fits Nordic Vibes", "Track BPM matches playlist average", "High acceptance rate for new artists"] },
  { curator: MOCK_CURATORS[6], matchScore: 82, matchReasons: ["Acoustic elements align with playlist", "Singer-songwriter approach fits curation style", "Active curator with fast response time"] },
  { curator: MOCK_CURATORS[4], matchScore: 76, matchReasons: ["Pop crossover potential", "Track production quality matches playlist standard", "Friday release timing advantage"] },
  { curator: MOCK_CURATORS[8], matchScore: 71, matchReasons: ["Alternative rock elements present", "Guitar-driven sections fit Rock Vault", "Growing listener base in target demographic"] },
  { curator: MOCK_CURATORS[1], matchScore: 65, matchReasons: ["Ambient intro section fits lo-fi aesthetic", "Mellow mood alignment", "Study-friendly tempo"] },
];

const MOCK_ANALYTICS: PitchAnalytics = {
  totalPitches: 47,
  sentCount: 42,
  acceptedCount: 8,
  declinedCount: 12,
  noResponseCount: 15,
  openedCount: 7,
  successRate: 19,
  responseRate: 47.6,
  avgResponseDays: 5.2,
  bestGenres: [
    { genre: "indie", successRate: 28, count: 14 },
    { genre: "lo-fi", successRate: 25, count: 8 },
    { genre: "neo-soul", successRate: 22, count: 9 },
    { genre: "electronic", successRate: 15, count: 6 },
    { genre: "pop", successRate: 10, count: 10 },
  ],
  monthlyData: [
    { month: "Oct", sent: 5, accepted: 1 },
    { month: "Nov", sent: 7, accepted: 1 },
    { month: "Dec", sent: 6, accepted: 2 },
    { month: "Jan", sent: 8, accepted: 1 },
    { month: "Feb", sent: 9, accepted: 2 },
    { month: "Mar", sent: 7, accepted: 1 },
  ],
  totalPlacements: 8,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<PitchStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  draft: { label: "Draft", color: "text-gray-600", bg: "bg-gray-100", icon: FileText },
  sent: { label: "Sent", color: "text-blue-600", bg: "bg-blue-50", icon: Send },
  opened: { label: "Opened", color: "text-amber-600", bg: "bg-amber-50", icon: Eye },
  accepted: { label: "Accepted", color: "text-green-600", bg: "bg-green-50", icon: CheckCircle2 },
  declined: { label: "Declined", color: "text-red-500", bg: "bg-red-50", icon: XCircle },
  no_response: { label: "No Response", color: "text-gray-500", bg: "bg-gray-100", icon: Clock },
};

const PLATFORM_LABELS: Record<string, string> = {
  spotify: "Spotify",
  apple_music: "Apple Music",
  youtube_music: "YouTube Music",
  tidal: "Tidal",
  deezer: "Deezer",
};

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ---------------------------------------------------------------------------
// Genres for filter
// ---------------------------------------------------------------------------

const ALL_GENRES = [
  "indie", "alternative", "pop", "indie-pop", "electro-pop", "r&b", "soul", "neo-soul",
  "hip-hop", "rap", "trap", "electronic", "synthwave", "house", "techno", "dance",
  "lo-fi", "chillhop", "ambient", "acoustic", "folk", "singer-songwriter",
  "rock", "punk", "metal", "jazz", "country", "world", "afrobeats", "latin",
  "dream-pop", "shoegaze", "edm", "classical",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlaylistPitchingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pitches");
  const [pitches, setPitches] = useState<Pitch[]>(MOCK_PITCHES);
  const [curators, setCurators] = useState<Curator[]>(MOCK_CURATORS);
  const [autoMatches, setAutoMatches] = useState<AutoMatch[]>(MOCK_AUTO_MATCHES);
  const [analytics, setAnalytics] = useState<PitchAnalytics>(MOCK_ANALYTICS);

  // Filters
  const [statusFilter, setStatusFilter] = useState<PitchStatus | "all">("all");
  const [genreFilter, setGenreFilter] = useState("");
  const [curatorSearch, setCuratorSearch] = useState("");
  const [selectedRelease, setSelectedRelease] = useState("release_01");

  // Modal state
  const [pitchModalOpen, setPitchModalOpen] = useState(false);
  const [pitchDetailOpen, setPitchDetailOpen] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [selectedCurator, setSelectedCurator] = useState<Curator | null>(null);

  // Form state
  const [pitchTrack, setPitchTrack] = useState("");
  const [pitchGenre, setPitchGenre] = useState("");
  const [pitchMessage, setPitchMessage] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [bulkGenerating, setBulkGenerating] = useState(false);

  // Fetch pitches
  const fetchPitches = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      const qs = params.toString();
      const data = await apiGet<{ pitches: Pitch[] }>(`/api/playlist-pitches${qs ? `?${qs}` : ""}`);
      if (data.pitches && data.pitches.length > 0) {
        setPitches(data.pitches);
      }
    } catch {
      // Keep mock data
    }
  }, [statusFilter]);

  // Fetch curators
  const fetchCurators = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (genreFilter) params.set("genre", genreFilter);
      if (curatorSearch) params.set("search", curatorSearch);
      const qs = params.toString();
      const data = await apiGet<{ curators: Curator[] }>(`/api/playlist-pitches/curators${qs ? `?${qs}` : ""}`);
      if (data.curators && data.curators.length > 0) {
        setCurators(data.curators);
      }
    } catch {
      // Keep mock data
    }
  }, [genreFilter, curatorSearch]);

  useEffect(() => {
    fetchPitches();
  }, [fetchPitches]);

  useEffect(() => {
    if (activeTab === "curators") fetchCurators();
  }, [activeTab, fetchCurators]);

  // Filter pitches client-side
  const filteredPitches = pitches.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  // Filter curators client-side
  const filteredCurators = curators.filter((c) => {
    if (genreFilter && !c.genres.some((g) => g.toLowerCase().includes(genreFilter.toLowerCase()))) return false;
    if (curatorSearch) {
      const q = curatorSearch.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.playlistName.toLowerCase().includes(q) || c.genres.some((g) => g.includes(q));
    }
    return true;
  });

  // Generate AI pitch message
  const handleGenerateAI = async () => {
    if (!selectedCurator) return;
    setGeneratingAI(true);
    try {
      const data = await apiPost<{ message: string }>("/api/playlist-pitches/generate", {
        trackTitle: pitchTrack || "My Latest Track",
        genre: pitchGenre || "indie",
        artistName: "Artist",
        playlistName: selectedCurator.playlistName,
        curatorName: selectedCurator.name,
      });
      if (data.message) setPitchMessage(data.message);
    } catch {
      setPitchMessage(`Hi ${selectedCurator.name},\n\nI'd love to submit "${pitchTrack || "my latest track"}" for "${selectedCurator.playlistName}". I think it would be a great fit for your playlist's vibe.\n\nWould you be open to giving it a listen?\n\nBest regards`);
    } finally {
      setGeneratingAI(false);
    }
  };

  // Create pitch
  const handleCreatePitch = async () => {
    if (!selectedCurator || !pitchTrack) return;
    setLoading(true);
    try {
      await apiPost("/api/playlist-pitches", {
        curatorId: selectedCurator.id,
        trackTitle: pitchTrack,
        genre: pitchGenre,
        message: pitchMessage,
        curatorName: selectedCurator.name,
        playlistName: selectedCurator.playlistName,
      });
      // Add to local state
      const newPitch: Pitch = {
        id: `pitch_${Date.now()}`,
        curatorId: selectedCurator.id,
        curatorName: selectedCurator.name,
        playlistName: selectedCurator.playlistName,
        trackTitle: pitchTrack,
        genre: pitchGenre,
        message: pitchMessage,
        status: "draft",
        sentAt: null,
        respondedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPitches((prev) => [newPitch, ...prev]);
      closePitchModal();
      setActiveTab("pitches");
    } catch {
      // Still add locally
    } finally {
      setLoading(false);
    }
  };

  // Send pitch
  const handleSendPitch = async (pitchId: string) => {
    try {
      await apiPatch(`/api/playlist-pitches/${pitchId}`, { status: "sent" });
    } catch {
      // Continue with local update
    }
    setPitches((prev) =>
      prev.map((p) =>
        p.id === pitchId ? { ...p, status: "sent" as PitchStatus, sentAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : p
      )
    );
  };

  // Run auto-match
  const handleAutoMatch = async () => {
    setMatchLoading(true);
    try {
      const data = await apiPost<{ matches: AutoMatch[] }>("/api/playlist-pitches/auto-match", {
        releaseId: selectedRelease,
      });
      if (data.matches && data.matches.length > 0) {
        setAutoMatches(data.matches);
      }
    } catch {
      // Keep mock data
    } finally {
      setMatchLoading(false);
    }
  };

  // Bulk generate
  const handleBulkGenerate = async () => {
    setBulkGenerating(true);
    const newPitches: Pitch[] = autoMatches.map((match) => ({
      id: `pitch_${Date.now()}_${match.curator.id}`,
      curatorId: match.curator.id,
      curatorName: match.curator.name,
      playlistName: match.curator.playlistName,
      trackTitle: "Midnight Echoes",
      genre: "indie",
      message: `AI-generated pitch for ${match.curator.playlistName}...`,
      status: "draft" as PitchStatus,
      sentAt: null,
      respondedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setPitches((prev) => [...newPitches, ...prev]);
    setBulkGenerating(false);
    setActiveTab("pitches");
  };

  // Open pitch modal for a curator
  const openPitchModal = (curator: Curator) => {
    setSelectedCurator(curator);
    setPitchTrack("");
    setPitchGenre(curator.genres[0] || "");
    setPitchMessage("");
    setPitchModalOpen(true);
  };

  const closePitchModal = () => {
    setPitchModalOpen(false);
    setSelectedCurator(null);
    setPitchTrack("");
    setPitchGenre("");
    setPitchMessage("");
  };

  // Open pitch detail
  const openPitchDetail = (pitch: Pitch) => {
    setSelectedPitch(pitch);
    setPitchDetailOpen(true);
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "pitches", label: "My Pitches", icon: Send },
    { key: "curators", label: "Find Curators", icon: Users },
    { key: "auto-match", label: "Auto-Match", icon: Zap },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Playlist Pitching</h1>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-600">AI</span>
            </div>
            <p className="text-sm text-gray-500">Pitch your tracks to playlist curators and grow your streams</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Pitches", value: analytics.totalPitches.toString(), icon: Send, color: "bg-blue-50 text-blue-600" },
              { label: "Accepted", value: analytics.acceptedCount.toString(), icon: CheckCircle2, color: "bg-green-50 text-green-600" },
              { label: "Success Rate", value: `${analytics.successRate}%`, icon: Target, color: "bg-purple-50 text-purple-600" },
              { label: "Placements", value: analytics.totalPlacements.toString(), sub: "all time", icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                  <s.icon size={18} />
                </div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-gray-500">
                  {s.label}
                  {s.sub && <span className="ml-1 text-gray-400">{s.sub}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-1.5 mb-6 flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-[var(--primary)] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ============================================================= */}
          {/* TAB 1: My Pitches */}
          {/* ============================================================= */}
          {activeTab === "pitches" && (
            <>
              {/* Filter bar */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-400" />
                  {(["all", "draft", "sent", "opened", "accepted", "declined", "no_response"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        statusFilter === s
                          ? "bg-[var(--primary)] text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {s === "all" ? "All" : STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pitches table */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/60">
                        <th className="text-left font-semibold text-gray-600 px-6 py-3">Track</th>
                        <th className="text-left font-semibold text-gray-600 px-6 py-3">Curator / Playlist</th>
                        <th className="text-left font-semibold text-gray-600 px-6 py-3">Genre</th>
                        <th className="text-left font-semibold text-gray-600 px-6 py-3">Status</th>
                        <th className="text-left font-semibold text-gray-600 px-6 py-3">Sent</th>
                        <th className="text-left font-semibold text-gray-600 px-6 py-3">Response</th>
                        <th className="text-left font-semibold text-gray-600 px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPitches.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-gray-400">
                            <ListMusic size={40} className="mx-auto mb-3 text-gray-300" />
                            <p className="font-medium">No pitches yet</p>
                            <p className="text-sm mt-1">Find curators and start pitching your tracks</p>
                          </td>
                        </tr>
                      ) : (
                        filteredPitches.map((pitch) => {
                          const cfg = STATUS_CONFIG[pitch.status];
                          const StatusIcon = cfg.icon;
                          return (
                            <tr
                              key={pitch.id}
                              className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                              onClick={() => openPitchDetail(pitch)}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-emerald-300 flex items-center justify-center text-white">
                                    <Music size={14} />
                                  </div>
                                  <span className="font-medium text-gray-900">{pitch.trackTitle}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-gray-900 font-medium">{pitch.curatorName}</div>
                                <div className="text-xs text-gray-500">{pitch.playlistName}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                                  {pitch.genre}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                                  <StatusIcon size={12} />
                                  {cfg.label}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-500">{formatDate(pitch.sentAt)}</td>
                              <td className="px-6 py-4 text-gray-500">{formatDate(pitch.respondedAt)}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                  {pitch.status === "draft" && (
                                    <button
                                      onClick={() => handleSendPitch(pitch.id)}
                                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[var(--primary)] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1"
                                    >
                                      <Send size={12} />
                                      Send
                                    </button>
                                  )}
                                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                    <MoreHorizontal size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 bg-gray-50/40 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                  <span>Showing {filteredPitches.length} pitches</span>
                </div>
              </div>
            </>
          )}

          {/* ============================================================= */}
          {/* TAB 2: Find Curators */}
          {/* ============================================================= */}
          {activeTab === "curators" && (
            <>
              {/* Search / Filter bar */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search curators or playlists..."
                    value={curatorSearch}
                    onChange={(e) => setCuratorSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
                  />
                </div>
                <div className="relative">
                  <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
                  >
                    <option value="">All Genres</option>
                    {ALL_GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Curator cards */}
              {filteredCurators.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <Users size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-gray-600">No curators found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredCurators.map((curator) => (
                    <div key={curator.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{curator.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <ListMusic size={14} />
                            {curator.playlistName}
                          </div>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                          {PLATFORM_LABELS[curator.platform] || curator.platform}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{curator.bio}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {curator.genres.map((g) => (
                          <span key={g} className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            {g}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-sm font-bold text-gray-900">{formatNumber(curator.followerCount)}</div>
                          <div className="text-[10px] text-gray-500">Followers</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-sm font-bold text-green-600">{curator.acceptanceRate}%</div>
                          <div className="text-[10px] text-gray-500">Accept Rate</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <div className="text-sm font-bold text-gray-900">{curator.avgResponseDays}d</div>
                          <div className="text-[10px] text-gray-500">Avg Response</div>
                        </div>
                      </div>

                      <button
                        onClick={() => openPitchModal(curator)}
                        className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-[var(--primary)] rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <Send size={14} />
                        Create Pitch
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ============================================================= */}
          {/* TAB 3: Auto-Match */}
          {/* ============================================================= */}
          {activeTab === "auto-match" && (
            <>
              {/* Release selector */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select a Release</label>
                    <div className="relative">
                      <select
                        value={selectedRelease}
                        onChange={(e) => setSelectedRelease(e.target.value)}
                        className="appearance-none w-full pl-3 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
                      >
                        <option value="release_01">Midnight Echoes (Single) - Indie</option>
                        <option value="release_02">Neon Dreams (Single) - Electro-Pop</option>
                        <option value="release_03">Golden Hour (EP) - Neo-Soul</option>
                        <option value="release_04">Broken Frequencies (Album) - Alternative</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleAutoMatch}
                      disabled={matchLoading}
                      className="px-5 py-2.5 text-sm font-semibold text-white bg-[var(--primary)] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                    >
                      {matchLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                      {matchLoading ? "Analyzing..." : "Find Matches"}
                    </button>
                    {autoMatches.length > 0 && (
                      <button
                        onClick={handleBulkGenerate}
                        disabled={bulkGenerating}
                        className="px-5 py-2.5 text-sm font-semibold text-[var(--primary)] bg-[var(--primary)]/10 rounded-lg hover:bg-[var(--primary)]/20 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {bulkGenerating ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                        Bulk Generate All
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Match results */}
              {autoMatches.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <Sparkles size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-gray-600">No matches yet</p>
                  <p className="text-sm text-gray-400 mt-1">Select a release and click &quot;Find Matches&quot; to get AI-powered curator suggestions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {autoMatches.map((match, idx) => (
                    <div key={match.curator.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Match score */}
                        <div className="flex items-center gap-4 lg:w-48 shrink-0">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold ${
                            match.matchScore >= 85 ? "bg-green-50 text-green-600" :
                            match.matchScore >= 70 ? "bg-blue-50 text-blue-600" :
                            match.matchScore >= 55 ? "bg-amber-50 text-amber-600" :
                            "bg-gray-100 text-gray-600"
                          }`}>
                            {match.matchScore}%
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase">Match #{idx + 1}</div>
                            <div className="text-sm font-bold text-gray-900">{match.curator.name}</div>
                            <div className="text-xs text-gray-500">{match.curator.playlistName}</div>
                          </div>
                        </div>

                        {/* Match reasons */}
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2">
                            {match.matchReasons.map((reason, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-100">
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Stats + action */}
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-center">
                            <div className="text-sm font-bold text-gray-900">{formatNumber(match.curator.followerCount)}</div>
                            <div className="text-[10px] text-gray-500">Followers</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold text-green-600">{match.curator.acceptanceRate}%</div>
                            <div className="text-[10px] text-gray-500">Accept</div>
                          </div>
                          <button
                            onClick={() => openPitchModal(match.curator)}
                            className="px-4 py-2 text-sm font-semibold text-white bg-[var(--primary)] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5"
                          >
                            <Send size={14} />
                            Pitch
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ============================================================= */}
          {/* TAB 4: Analytics */}
          {/* ============================================================= */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Top metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="text-sm font-medium text-gray-500 mb-1">Success Rate</div>
                  <div className="text-3xl font-bold text-green-600">{analytics.successRate}%</div>
                  <div className="mt-2 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${analytics.successRate}%` }} />
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="text-sm font-medium text-gray-500 mb-1">Response Rate</div>
                  <div className="text-3xl font-bold text-blue-600">{analytics.responseRate}%</div>
                  <div className="mt-2 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${analytics.responseRate}%` }} />
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="text-sm font-medium text-gray-500 mb-1">Avg Response Time</div>
                  <div className="text-3xl font-bold text-gray-900">{analytics.avgResponseDays}d</div>
                  <div className="text-xs text-gray-400 mt-1">days on average</div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="text-sm font-medium text-gray-500 mb-1">Total Placements</div>
                  <div className="text-3xl font-bold text-purple-600">{analytics.totalPlacements}</div>
                  <div className="text-xs text-gray-400 mt-1">playlists featuring your tracks</div>
                </div>
              </div>

              {/* Pitch status breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Pitch Status Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { label: "Accepted", count: analytics.acceptedCount, total: analytics.sentCount, color: "bg-green-500" },
                    { label: "Opened", count: analytics.openedCount, total: analytics.sentCount, color: "bg-amber-500" },
                    { label: "Declined", count: analytics.declinedCount, total: analytics.sentCount, color: "bg-red-500" },
                    { label: "No Response", count: analytics.noResponseCount, total: analytics.sentCount, color: "bg-gray-400" },
                  ].map((item) => {
                    const pct = item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
                    return (
                      <div key={item.label} className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600 w-28">{item.label}</span>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-sm font-bold text-gray-700 w-16 text-right">{item.count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monthly trend */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Monthly Pitch Activity</h3>
                <div className="flex items-end gap-3 h-40">
                  {analytics.monthlyData.map((m) => {
                    const maxSent = Math.max(...analytics.monthlyData.map((d) => d.sent));
                    const sentHeight = maxSent > 0 ? (m.sent / maxSent) * 100 : 0;
                    const acceptedHeight = maxSent > 0 ? (m.accepted / maxSent) * 100 : 0;
                    return (
                      <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex items-end justify-center gap-1 h-28">
                          <div className="w-5 bg-blue-200 rounded-t" style={{ height: `${sentHeight}%` }} title={`Sent: ${m.sent}`} />
                          <div className="w-5 bg-green-400 rounded-t" style={{ height: `${acceptedHeight}%` }} title={`Accepted: ${m.accepted}`} />
                        </div>
                        <span className="text-[10px] text-gray-500">{m.month}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-200" /> Sent</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400" /> Accepted</span>
                </div>
              </div>

              {/* Best performing genres */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Best Performing Genres</h3>
                <div className="space-y-3">
                  {analytics.bestGenres.map((g) => (
                    <div key={g.genre} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-600 w-28 capitalize">{g.genre}</span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${g.successRate}%` }} />
                      </div>
                      <span className="text-sm font-bold text-gray-700 w-20 text-right">{g.successRate}% ({g.count})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================= */}
        {/* Create Pitch Modal */}
        {/* ============================================================= */}
        {pitchModalOpen && selectedCurator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={closePitchModal}>
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden m-4" onClick={(e) => e.stopPropagation()}>
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Create Pitch</h2>
                  <p className="text-sm text-gray-500">
                    Pitching to <span className="font-medium">{selectedCurator.name}</span> — {selectedCurator.playlistName}
                  </p>
                </div>
                <button onClick={closePitchModal} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Track Title *</label>
                  <input
                    type="text"
                    value={pitchTrack}
                    onChange={(e) => setPitchTrack(e.target.value)}
                    placeholder="Enter your track title"
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Genre</label>
                  <div className="relative">
                    <select
                      value={pitchGenre}
                      onChange={(e) => setPitchGenre(e.target.value)}
                      className="appearance-none w-full pl-3 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
                    >
                      <option value="">Select genre</option>
                      {ALL_GENRES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-gray-700">Pitch Message</label>
                    <button
                      onClick={handleGenerateAI}
                      disabled={generatingAI}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 disabled:opacity-50"
                    >
                      {generatingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      {generatingAI ? "Generating..." : "Generate with AI"}
                    </button>
                  </div>
                  <textarea
                    value={pitchMessage}
                    onChange={(e) => setPitchMessage(e.target.value)}
                    rows={8}
                    placeholder="Write your pitch message or use AI to generate one..."
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] resize-none"
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={closePitchModal}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePitch}
                  disabled={!pitchTrack || loading}
                  className="px-5 py-2 text-sm font-semibold text-white bg-[var(--primary)] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                  Save as Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* Pitch Detail Modal */}
        {/* ============================================================= */}
        {pitchDetailOpen && selectedPitch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setPitchDetailOpen(false)}>
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden m-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Pitch Details</h2>
                  <p className="text-sm text-gray-500">{selectedPitch.trackTitle} → {selectedPitch.playlistName}</p>
                </div>
                <button onClick={() => setPitchDetailOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Curator</span>
                    <p className="text-sm font-medium text-gray-900">{selectedPitch.curatorName}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
                    <p className="text-sm">
                      {(() => {
                        const cfg = STATUS_CONFIG[selectedPitch.status];
                        const StatusIcon = cfg.icon;
                        return (
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                            <StatusIcon size={12} />
                            {cfg.label}
                          </span>
                        );
                      })()}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Genre</span>
                    <p className="text-sm font-medium text-gray-900">{selectedPitch.genre}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Created</span>
                    <p className="text-sm text-gray-600">{formatDate(selectedPitch.createdAt)}</p>
                  </div>
                  {selectedPitch.sentAt && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Sent</span>
                      <p className="text-sm text-gray-600">{formatDate(selectedPitch.sentAt)}</p>
                    </div>
                  )}
                  {selectedPitch.respondedAt && (
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Response</span>
                      <p className="text-sm text-gray-600">{formatDate(selectedPitch.respondedAt)}</p>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase">Message</span>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedPitch.message}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                {selectedPitch.status === "draft" && (
                  <button
                    onClick={() => {
                      handleSendPitch(selectedPitch.id);
                      setPitchDetailOpen(false);
                    }}
                    className="px-5 py-2 text-sm font-semibold text-white bg-[var(--primary)] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Send size={14} />
                    Send Pitch
                  </button>
                )}
                <button
                  onClick={() => setPitchDetailOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
