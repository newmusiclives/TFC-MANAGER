"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Upload,
  Music2,
  Clock,
  FileAudio,
  Activity,
  Gauge,
  Waves,
  Mic2,
  Volume2,
  Tag,
  Target,
  CircleDot,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ListMusic,
  Users,
  ArrowRight,
  Disc3,
  Sparkles,
  BarChart3,
  ChevronRight,
  Star,
  Play,
  CalendarDays,
} from "lucide-react";
import { useState } from "react";

/* ───── mock data ───── */

const waveformBars = Array.from({ length: 72 }, (_, i) => {
  const x = i / 72;
  const base = Math.sin(x * Math.PI) * 0.6;
  const noise = Math.random() * 0.35;
  return Math.max(8, Math.round((base + noise) * 100));
});

const audioDNA = [
  { label: "BPM", value: "118", icon: Activity, color: "text-rose-500" },
  { label: "Key", value: "Db Major", icon: Music2, color: "text-violet-500" },
  { label: "Energy", value: 72, max: 100, icon: Gauge, color: "text-amber-500", barColor: "bg-amber-400" },
  { label: "Danceability", value: 65, max: 100, icon: Disc3, color: "text-pink-500", barColor: "bg-pink-400" },
  { label: "Valence (Mood)", value: 58, max: 100, icon: Sparkles, color: "text-indigo-500", barColor: "bg-indigo-400", note: "Bittersweet / Nostalgic" },
  { label: "Acousticness", value: 22, max: 100, icon: Mic2, color: "text-emerald-500", barColor: "bg-emerald-400" },
  { label: "Instrumentalness", value: 8, max: 100, icon: Waves, color: "text-sky-500", barColor: "bg-sky-400" },
  { label: "Loudness", value: "-6.2 dB", icon: Volume2, color: "text-orange-500" },
];

const genreTags = ["Indie Pop", "Electronic", "Synth Pop", "Dream Pop"];
const moodTags = ["Dreamy", "Reflective", "Uplifting", "Atmospheric"];

const playlistReadiness = {
  overall: 82,
  breakdown: [
    { label: "Production quality", score: 88 },
    { label: "Mix balance", score: 79 },
    { label: "Mastering loudness", score: 85 },
    { label: "Genre fit (current trends)", score: 76 },
    { label: "Hook strength", score: 84 },
  ],
};

const mixingSuggestions = [
  {
    title: "Low-end clarity",
    description:
      "Your sub-bass at 60Hz competes with the kick. A 2dB cut at 55-65Hz would clean this up.",
    severity: "medium" as const,
  },
  {
    title: "Vocal presence",
    description:
      "Adding a gentle 2dB shelf at 3kHz would bring the vocal forward without harshness.",
    severity: "low" as const,
  },
  {
    title: "Stereo width",
    description:
      "The synth pad is panned center \u2014 spreading it to 60% L/R would create more space for the vocal.",
    severity: "low" as const,
  },
];

const playlistMatches = [
  { name: "Indie Chill Vibes", followers: "182K", match: 94 },
  { name: "Dreamy Electronica", followers: "67.4K", match: 89 },
  { name: "Synth Pop Rising", followers: "43.1K", match: 85 },
  { name: "Late Night Drives", followers: "124K", match: 81 },
  { name: "Fresh Finds: Indie", followers: "256K", match: 78 },
];

const similarTracks = [
  { title: "Blinding Lights", artist: "The Weeknd", reason: "Shares the synth-driven production style and nostalgic tonal palette" },
  { title: "Somebody Else", artist: "The 1975", reason: "Similar atmospheric synth layering and mid-tempo groove" },
  { title: "Let It Happen", artist: "Tame Impala", reason: "Matching dreamy, layered production with evolving dynamics" },
  { title: "Midnight City", artist: "M83", reason: "Comparable synth textures and bittersweet emotional tone" },
  { title: "On Hold", artist: "The xx", reason: "Shared minimalist electronic feel with intimate vocal delivery" },
];

const previouslyAnalyzed = [
  { title: "Midnight Dreams", date: "Mar 12, 2026", score: 78, genre: "Indie Electronic" },
  { title: "Electric Feel", date: "Feb 28, 2026", score: 71, genre: "Synth Pop" },
];

/* ───── helpers ───── */

function CircularScore({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={10} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-extrabold">{score}</span>
        <span className="text-xs text-gray-400">/100</span>
      </div>
    </div>
  );
}

/* ───── page ───── */

export default function SoundAnalysisPage() {
  const [analyzed, setAnalyzed] = useState(true);
  const [dragging, setDragging] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              AI Sound Analysis <Waves size={20} className="text-[var(--primary)]" />
            </h1>
            <p className="text-sm text-gray-500">Upload a track and let AI break it down</p>
          </div>
          <button
            onClick={() => setAnalyzed(false)}
            className="flex items-center gap-2 bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            <Upload size={16} /> Upload New Track
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* ── upload zone (shown when not yet analyzed) ── */}
          {!analyzed && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); setAnalyzed(true); }}
              className={`border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center text-center transition-colors ${
                dragging ? "border-[var(--primary)] bg-purple-50" : "border-gray-200 bg-white"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <FileAudio size={28} className="text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-1">Drag & drop your audio file here</p>
              <p className="text-sm text-gray-400 mb-4">Supports MP3, WAV, FLAC up to 50 MB</p>
              <button
                onClick={() => setAnalyzed(true)}
                className="bg-[var(--primary)] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
              >
                Browse Files
              </button>
            </div>
          )}

          {/* ── analysis results ── */}
          {analyzed && (
            <>
              {/* 1 ── Track Overview */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Music2 size={20} className="text-[var(--primary)]" /> Track Overview
                </h2>
                <div className="flex items-center gap-6 mb-5">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                    <Play size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Golden Hour</h3>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={14} /> 3:28</span>
                      <span className="flex items-center gap-1"><FileAudio size={14} /> WAV 24-bit / 48kHz</span>
                      <span className="flex items-center gap-1"><CalendarDays size={14} /> Uploaded Mar 27, 2026</span>
                    </div>
                  </div>
                </div>
                {/* waveform */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-2 font-medium">WAVEFORM</p>
                  <div className="flex items-end gap-[2px] h-20">
                    {waveformBars.map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-violet-500 to-pink-400 opacity-80"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0:00</span><span>0:52</span><span>1:44</span><span>2:36</span><span>3:28</span>
                  </div>
                </div>
              </div>

              {/* 2 ── Audio DNA */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-[var(--primary)]" /> Audio DNA
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {audioDNA.map((attr) => {
                    const Icon = attr.icon;
                    const isNumeric = typeof attr.value === "number";
                    return (
                      <div key={attr.label} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon size={16} className={attr.color} />
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{attr.label}</span>
                        </div>
                        <p className="text-xl font-bold">
                          {isNumeric ? `${attr.value}` : attr.value}
                          {isNumeric && <span className="text-sm text-gray-400 font-normal">/100</span>}
                        </p>
                        {isNumeric && (
                          <div className="mt-2 h-1.5 rounded-full bg-gray-200">
                            <div
                              className={`h-full rounded-full ${attr.barColor}`}
                              style={{ width: `${attr.value}%` }}
                            />
                          </div>
                        )}
                        {attr.note && <p className="text-xs text-gray-400 mt-1">{attr.note}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3 ── Genre & Mood Tags */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Tag size={20} className="text-[var(--primary)]" /> Genre & Mood Tags
                </h2>
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Auto-Detected Genres</p>
                  <div className="flex flex-wrap gap-2">
                    {genreTags.map((g) => (
                      <span key={g} className="px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-sm font-medium">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Mood</p>
                  <div className="flex flex-wrap gap-2">
                    {moodTags.map((m) => (
                      <span key={m} className="px-3 py-1.5 rounded-full bg-pink-50 text-pink-700 text-sm font-medium">{m}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4 ── Playlist Readiness Score */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Target size={20} className="text-[var(--primary)]" /> Playlist Readiness Score
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <CircularScore score={playlistReadiness.overall} size={140} />
                  <div className="flex-1 w-full space-y-3">
                    {playlistReadiness.breakdown.map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-semibold">{item.score}/100</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full ${
                              item.score >= 85 ? "bg-green-400" : item.score >= 75 ? "bg-amber-400" : "bg-red-400"
                            }`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5 ── AI Mixing Suggestions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Lightbulb size={20} className="text-[var(--primary)]" /> AI Mixing Suggestions
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {mixingSuggestions.map((s) => (
                    <div
                      key={s.title}
                      className={`rounded-xl border p-5 ${
                        s.severity === "medium"
                          ? "border-amber-200 bg-amber-50/50"
                          : "border-gray-100 bg-gray-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {s.severity === "medium" ? (
                          <AlertCircle size={16} className="text-amber-500" />
                        ) : (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        )}
                        <span className="font-semibold text-sm">{s.title}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6 ── Playlist Matches */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-lg mb-1 flex items-center gap-2">
                  <ListMusic size={20} className="text-[var(--primary)]" /> Playlist Matches
                </h2>
                <p className="text-sm text-gray-500 mb-4">Based on sonic analysis, your track fits these playlists</p>
                <div className="space-y-3">
                  {playlistMatches.map((pl) => (
                    <div key={pl.name} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                          <ListMusic size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{pl.name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1"><Users size={12} /> {pl.followers} followers</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-bold text-green-600">{pl.match}% match</p>
                        </div>
                        <button className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)] hover:underline">
                          Generate Pitch <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7 ── Similar Sounding Tracks */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <CircleDot size={20} className="text-[var(--primary)]" /> Similar Sounding Tracks
                </h2>
                <div className="space-y-3">
                  {similarTracks.map((t) => (
                    <div key={t.title} className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <Music2 size={18} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.title} <span className="font-normal text-gray-400">by {t.artist}</span></p>
                        <p className="text-xs text-gray-500 mt-0.5">{t.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8 ── Previously Analyzed */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-[var(--primary)]" /> Previously Analyzed
                </h2>
                <div className="space-y-3">
                  {previouslyAnalyzed.map((t) => (
                    <div key={t.title} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <FileAudio size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{t.title}</p>
                          <p className="text-xs text-gray-400">{t.genre} &middot; {t.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star size={14} className={t.score >= 75 ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"} />
                          <span className="text-sm font-bold">{t.score}/100</span>
                        </div>
                        <button className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1">
                          View <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
