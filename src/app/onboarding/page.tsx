"use client";

import { useState } from "react";
import { apiPatch } from "@/lib/api-client";
import {
  Music2,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  Target,
  Rocket,
  Disc3,
  Radio,
  Headphones,
  Mic2,
  Guitar,
  Waves,
  Sparkles,
  Calendar,
  Image as ImageIcon,
} from "lucide-react";

const TOTAL_STEPS = 5;

const genres = [
  "Pop",
  "Hip-Hop",
  "R&B",
  "Rock",
  "Electronic",
  "Country",
  "Latin",
  "Indie",
  "Jazz",
  "Classical",
  "Folk",
  "Metal",
  "Afrobeats",
  "Reggaeton",
  "Alternative",
  "Soul",
];

const careerGoals = [
  { id: "grow-streams", label: "Grow my streams", icon: Radio },
  { id: "build-fanbase", label: "Build a loyal fanbase", icon: Headphones },
  { id: "release-music", label: "Release music consistently", icon: Disc3 },
  { id: "go-viral", label: "Go viral on social media", icon: Sparkles },
  { id: "live-shows", label: "Book more live shows", icon: Mic2 },
  { id: "full-time", label: "Go full-time as an artist", icon: Guitar },
];

const releaseFrequencies = [
  "Every week",
  "Every 2 weeks",
  "Monthly",
  "Every 6 weeks",
  "Quarterly",
  "When inspired",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [artistName, setArtistName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [trackName, setTrackName] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [listenerTarget, setListenerTarget] = useState("10000");
  const [releaseFreq, setReleaseFreq] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [launching, setLaunching] = useState(false);

  const handleLaunchDashboard = async () => {
    setLaunching(true);
    try {
      await apiPatch("/api/users/me", {
        artistName,
        genre: selectedGenres,
        bio: "",
        location: "",
        onboarding: {
          connectedPlatforms,
          trackName,
          releaseDate,
          listenerTarget,
          releaseFreq,
          selectedGoals,
        },
      });
    } catch {
      // API not available - fall back to redirect so demo still works
    }
    window.location.href = "/dashboard";
  };

  function toggleGenre(g: string) {
    setSelectedGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  }

  function toggleGoal(id: string) {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function connectPlatform(platform: string) {
    setConnectedPlatforms((prev) =>
      prev.includes(platform) ? prev : [...prev, platform]
    );
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return artistName.trim().length > 0 && selectedGenres.length > 0;
      case 2:
        return true;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar with branding + progress */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center">
              <Music2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">
              TrueFans <span className="text-[var(--primary)]">Manager</span>
            </span>
          </div>
          <span className="text-sm text-gray-400">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-[var(--primary)] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center pt-10 pb-20 px-6">
        <div className="w-full max-w-2xl">
          {/* ===== Step 1: Welcome ===== */}
          {step === 1 && (
            <div className="animate-in fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/10 mb-4">
                  <Sparkles size={28} className="text-[var(--primary)]" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to TrueFans MANAGER
                </h1>
                <p className="text-gray-500 text-lg">
                  Let&apos;s set up your artist profile in a few quick steps.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
                {/* Artist name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Artist / Band Name
                  </label>
                  <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="e.g. The Midnight Waves"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-colors"
                  />
                </div>

                {/* Genre selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Your Genre(s)
                  </label>
                  <p className="text-xs text-gray-400 mb-3">
                    Pick one or more genres that best describe your music.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((g) => (
                      <button
                        key={g}
                        onClick={() => toggleGenre(g)}
                        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          selectedGenres.includes(g)
                            ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== Step 2: Connect Streaming Accounts ===== */}
          {step === 2 && (
            <div className="animate-in fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/10 mb-4">
                  <Waves size={28} className="text-[var(--primary)]" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Connect Your Accounts
                </h1>
                <p className="text-gray-500 text-lg">
                  Link your streaming platforms so we can import your analytics.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    name: "Spotify",
                    desc: "Import listener stats, playlist placements, and more",
                    color: "#1DB954",
                    logo: "S",
                  },
                  {
                    name: "Apple Music",
                    desc: "Sync your Apple Music for Artists data",
                    color: "#fc3c44",
                    logo: "A",
                  },
                  {
                    name: "YouTube",
                    desc: "Connect your YouTube channel and music videos",
                    color: "#ff0000",
                    logo: "Y",
                  },
                ].map((platform) => {
                  const isConnected = connectedPlatforms.includes(platform.name);
                  return (
                    <div
                      key={platform.name}
                      className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: platform.color }}
                        >
                          {platform.logo}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                          <p className="text-sm text-gray-500">{platform.desc}</p>
                        </div>
                      </div>
                      {isConnected ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-600 text-sm font-semibold rounded-xl">
                          <Check size={16} /> Connected
                        </span>
                      ) : (
                        <button
                          onClick={() => connectPlatform(platform.name)}
                          className="px-5 py-2 text-sm font-semibold rounded-xl border-2 border-gray-200 text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-center text-xs text-gray-400 mt-4">
                You can skip this step and connect accounts later from your dashboard.
              </p>
            </div>
          )}

          {/* ===== Step 3: First Release ===== */}
          {step === 3 && (
            <div className="animate-in fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/10 mb-4">
                  <Disc3 size={28} className="text-[var(--primary)]" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Your First Release
                </h1>
                <p className="text-gray-500 text-lg">
                  Tell us about an upcoming or recent release to get started.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
                {/* Track name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Track / Single Name
                  </label>
                  <input
                    type="text"
                    value={trackName}
                    onChange={(e) => setTrackName(e.target.value)}
                    placeholder="e.g. Midnight Dreams"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-colors"
                  />
                </div>

                {/* Release date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Release Date
                  </label>
                  <div className="relative">
                    <Calendar
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                      type="date"
                      value={releaseDate}
                      onChange={(e) => setReleaseDate(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-colors"
                    />
                  </div>
                </div>

                {/* Cover art upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cover Art
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-colors cursor-pointer">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gray-100 mb-3">
                      <ImageIcon size={24} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Drag and drop your cover art here
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG up to 10MB. Recommended 3000 x 3000px
                    </p>
                    <button className="mt-4 px-4 py-2 text-sm font-medium text-[var(--primary)] bg-[var(--primary)]/10 rounded-lg hover:bg-[var(--primary)]/20 transition-colors">
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-gray-400 mt-4">
                You can skip this and add release details later.
              </p>
            </div>
          )}

          {/* ===== Step 4: Set Goals ===== */}
          {step === 4 && (
            <div className="animate-in fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/10 mb-4">
                  <Target size={28} className="text-[var(--primary)]" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Set Your Goals
                </h1>
                <p className="text-gray-500 text-lg">
                  Define what success looks like so we can help you get there.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-8">
                {/* Monthly listener target */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Listener Target
                  </label>
                  <p className="text-xs text-gray-400 mb-3">
                    Where do you want to be in the next 6 months?
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "1000", label: "1K" },
                      { value: "5000", label: "5K" },
                      { value: "10000", label: "10K" },
                      { value: "50000", label: "50K" },
                      { value: "100000", label: "100K" },
                      { value: "500000", label: "500K+" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setListenerTarget(opt.value)}
                        className={`px-4 py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
                          listenerTarget === opt.value
                            ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {opt.label} listeners
                      </button>
                    ))}
                  </div>
                </div>

                {/* Release frequency */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Release Frequency
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {releaseFrequencies.map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setReleaseFreq(freq)}
                        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          releaseFreq === freq
                            ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Career goals */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Career Goals
                  </label>
                  <p className="text-xs text-gray-400 mb-3">
                    Select all that apply. We&apos;ll tailor your dashboard accordingly.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {careerGoals.map((goal) => {
                      const isSelected = selectedGoals.includes(goal.id);
                      return (
                        <button
                          key={goal.id}
                          onClick={() => toggleGoal(goal.id)}
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-colors ${
                            isSelected
                              ? "border-[var(--primary)] bg-[var(--primary)]/10"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              isSelected
                                ? "bg-[var(--primary)] text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <goal.icon size={18} />
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              isSelected ? "text-[var(--primary)]" : "text-gray-700"
                            }`}
                          >
                            {goal.label}
                          </span>
                          {isSelected && (
                            <Check size={16} className="text-[var(--primary)] ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== Step 5: Your First 30 Days ===== */}
          {step === 5 && (
            <div className="animate-in fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary)]/10 mb-4">
                  <Rocket size={28} className="text-[var(--primary)]" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Your Personalized Launch Plan
                </h1>
                <p className="text-gray-500 text-lg">
                  Here&apos;s your AI-generated 30-day plan based on your profile.
                </p>
              </div>

              <div className="space-y-6">
                {/* Week 1 */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      W1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Week 1: Setup</h3>
                      <p className="text-xs text-gray-400">Foundation &amp; connections</p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      "Complete your artist profile with bio, photos, and links",
                      "Connect all streaming platforms (Spotify, Apple Music, YouTube)",
                      "Upload your first release or import an existing one",
                    ].map((task, i) => (
                      <div key={i} className="flex items-start gap-3 pl-2">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] text-gray-400">{i + 1}</span>
                        </div>
                        <p className="text-sm text-gray-600">{task}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Week 2 */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                      W2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Week 2: Content</h3>
                      <p className="text-xs text-gray-400">Create &amp; schedule</p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      "Generate promotional content with AI Content Generator",
                      "Schedule your first social media posts",
                      "Create smart links for your releases",
                      "Set up your link-in-bio page",
                    ].map((task, i) => (
                      <div key={i} className="flex items-start gap-3 pl-2">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] text-gray-400">{i + 1}</span>
                        </div>
                        <p className="text-sm text-gray-600">{task}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Week 3 */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                      W3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Week 3: Growth</h3>
                      <p className="text-xs text-gray-400">Expand your reach</p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      "Pitch your tracks to curated playlists",
                      "Launch your Fan CRM and import contacts",
                      "Share listening links with your network",
                    ].map((task, i) => (
                      <div key={i} className="flex items-start gap-3 pl-2">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] text-gray-400">{i + 1}</span>
                        </div>
                        <p className="text-sm text-gray-600">{task}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Week 4 */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">
                      W4
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Week 4: Analyze</h3>
                      <p className="text-xs text-gray-400">Review &amp; plan ahead</p>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      "Review your analytics and streaming performance",
                      "Get your first AI Manager check-in and recommendations",
                      "Plan your next release with AI-powered insights",
                    ].map((task, i) => (
                      <div key={i} className="flex items-start gap-3 pl-2">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] text-gray-400">{i + 1}</span>
                        </div>
                        <p className="text-sm text-gray-600">{task}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                onClick={() => canProceed() && setStep((s) => s + 1)}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  canProceed()
                    ? "bg-[var(--primary)] text-white hover:opacity-90"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleLaunchDashboard}
                disabled={launching}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-[var(--primary)] text-white hover:opacity-90 transition-all disabled:opacity-60"
              >
                <Rocket size={16} />
                {launching ? "Saving..." : "Start My Journey"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
