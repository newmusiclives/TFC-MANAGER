"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { Bell, Trophy, Star, TrendingUp, ArrowRight, CheckCircle2, Circle, Lock, Zap, Target, Users, Play, Music2, Award } from "lucide-react";

const levels = [
  { name: "Bedroom Artist", range: "0 - 1K streams", icon: "🎵", unlocked: true, current: false },
  { name: "Local Act", range: "1K - 10K streams", icon: "🎤", unlocked: true, current: false },
  { name: "Rising Star", range: "10K - 100K streams", icon: "⭐", unlocked: true, current: true },
  { name: "Breakout", range: "100K - 500K streams", icon: "🚀", unlocked: false, current: false },
  { name: "Established", range: "500K - 1M streams", icon: "💎", unlocked: false, current: false },
  { name: "Major", range: "1M+ streams", icon: "👑", unlocked: false, current: false },
];

const achievements = [
  { title: "First 1K", desc: "Reached 1,000 total streams", earned: true, date: "Feb 2025", icon: Play },
  { title: "Release Machine", desc: "Published 10+ releases", earned: true, date: "Nov 2025", icon: Music2 },
  { title: "Fan Magnet", desc: "Hit 1,000 monthly listeners", earned: true, date: "May 2025", icon: Users },
  { title: "Playlist Pioneer", desc: "Added to 25+ playlists", earned: true, date: "Dec 2025", icon: Star },
  { title: "Century Club", desc: "Reached 100K total streams", earned: true, date: "Jan 2026", icon: Trophy },
  { title: "Going Global", desc: "Listeners in 20+ countries", earned: true, date: "Mar 2026", icon: Target },
  { title: "Superfan Army", desc: "100+ superfans identified", earned: false, date: null, icon: Award },
  { title: "Half Million", desc: "Reach 500K total streams", earned: false, date: null, icon: Zap },
];

const nextSteps = [
  { title: "Grow monthly listeners to 25K", progress: 73, current: "18.2K", target: "25K", tip: "Consistent releases every 6-8 weeks drive the strongest listener growth at your level." },
  { title: "Get featured on an editorial playlist", progress: 45, current: "Indie curators only", target: "Spotify editorial", tip: "Your save rate (24.3%) is above the threshold. Pitch 'Golden Hour' — it matches current editorial trends." },
  { title: "Build email list to 500 subscribers", progress: 38, current: "190", target: "500", tip: "Add a signup CTA to your EPK and smart link pages. Offer an exclusive acoustic track as incentive." },
  { title: "Cross 200K total streams", progress: 64, current: "128.5K", target: "200K", tip: "At your current growth rate, you'll hit this in ~8 weeks. A strong 'Golden Hour' launch could accelerate it to 5 weeks." },
];

const benchmarks = [
  { metric: "Monthly Listener Growth", yours: "+12.8%", average: "+6.2%", percentile: 82 },
  { metric: "Save Rate", yours: "24.3%", average: "18.5%", percentile: 78 },
  { metric: "Release Frequency", yours: "Every 7 weeks", average: "Every 12 weeks", percentile: 85 },
  { metric: "Fan Engagement", yours: "High", average: "Medium", percentile: 74 },
  { metric: "Platform Diversity", yours: "6 platforms", average: "3 platforms", percentile: 90 },
];

export default function CareerPathPage() {
  const currentLevel = levels.find((l) => l.current)!;
  const currentIdx = levels.indexOf(currentLevel);
  const progress = 78; // within current level

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Career Path</h1>
            <p className="text-sm text-gray-500">Track your progression and unlock milestones</p>
          </div>
          <button className="relative p-2 text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
        </div>

        <div className="p-8">
          {/* Current level hero */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl mb-2">{currentLevel.icon}</div>
                <h2 className="text-3xl font-extrabold mb-1">{currentLevel.name}</h2>
                <p className="text-white/80">Level {currentIdx + 1} of {levels.length} &bull; {currentLevel.range}</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-extrabold">{progress}%</div>
                <p className="text-white/80 text-sm">to next level</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-full h-3 mt-6">
              <div className="bg-white h-3 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-sm text-white/70 mt-2">You&apos;re growing faster than <strong className="text-white">78%</strong> of artists at your level</p>
          </div>

          {/* Level timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-lg mb-6">Your Journey</h2>
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -translate-y-1/2" />
              <div className="absolute left-0 top-1/2 h-0.5 bg-[var(--primary)] -translate-y-1/2" style={{ width: `${((currentIdx + progress / 100) / (levels.length - 1)) * 100}%` }} />
              {levels.map((level, idx) => (
                <div key={level.name} className="relative flex flex-col items-center z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-4 ${
                    level.current ? "border-[var(--primary)] bg-[var(--primary)]/10 scale-125" :
                    level.unlocked ? "border-[var(--primary)] bg-white" : "border-gray-300 bg-gray-100"
                  }`}>
                    {level.unlocked ? level.icon : <Lock size={16} className="text-gray-400" />}
                  </div>
                  <span className={`text-xs font-semibold mt-2 ${level.current ? "text-[var(--primary)]" : level.unlocked ? "text-gray-700" : "text-gray-400"}`}>
                    {level.name}
                  </span>
                  <span className="text-xs text-gray-400">{level.range}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Next steps */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Target size={20} className="text-[var(--primary)]" /> Next Steps to Level Up
              </h2>
              <div className="space-y-4">
                {nextSteps.map((step) => (
                  <div key={step.title} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{step.title}</span>
                      <span className="text-xs font-bold text-[var(--primary)]">{step.progress}%</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2 mb-2">
                      <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: `${step.progress}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Current: {step.current}</span>
                      <span>Target: {step.target}</span>
                    </div>
                    <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                      <Zap size={10} className="inline text-amber-500 mr-1" /> {step.tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benchmarks */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-[var(--primary)]" /> How You Compare
                </h2>
                <div className="space-y-4">
                  {benchmarks.map((b) => (
                    <div key={b.metric}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{b.metric}</span>
                        <span className="text-xs text-[var(--primary)] font-bold">Top {100 - b.percentile}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: `${b.percentile}%` }} />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Avg: {b.average}</span>
                        <span>You: <strong className="text-gray-700">{b.yours}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" /> Achievements
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((a) => (
                <div key={a.title} className={`rounded-xl p-4 text-center border ${a.earned ? "border-amber-200 bg-amber-50" : "border-gray-100 bg-gray-50 opacity-50"}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${a.earned ? "bg-amber-100" : "bg-gray-200"}`}>
                    <a.icon size={20} className={a.earned ? "text-amber-600" : "text-gray-400"} />
                  </div>
                  <div className="font-bold text-sm">{a.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{a.desc}</div>
                  {a.earned && <div className="text-xs text-amber-600 font-medium mt-1">{a.date}</div>}
                  {!a.earned && <div className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1"><Lock size={8} /> Locked</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
