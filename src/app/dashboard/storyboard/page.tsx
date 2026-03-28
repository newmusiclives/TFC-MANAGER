"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { Bell, Film, Sparkles, Download, RefreshCw, Music2, Palette, Clock, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/lib/api-client";

const storyboards = [
  {
    id: "sb1",
    track: "Midnight Dreams",
    mood: "Dreamy / Nostalgic / Cinematic",
    colorPalette: ["#1a1a2e", "#16213e", "#0f3460", "#e94560", "#533483"],
    scenes: [
      { time: "0:00 - 0:15", shot: "Wide — City skyline at dusk", description: "Slow drone shot pulling back from a window to reveal a sprawling cityscape as lights begin to flicker on. Golden hour fading to blue hour.", visual: "from-amber-900 to-blue-950" },
      { time: "0:15 - 0:35", shot: "Close-up — Artist walking", description: "Artist walks through empty city streets, hands in pockets, lit by neon signs reflecting off wet pavement. Shallow depth of field.", visual: "from-purple-900 to-pink-900" },
      { time: "0:35 - 1:00", shot: "Medium — Rooftop scene", description: "Artist arrives on a rooftop overlooking the city. Wind in hair. Camera circles slowly. First chorus hits as city lights pulse.", visual: "from-indigo-900 to-violet-800" },
      { time: "1:00 - 1:30", shot: "Montage — Memory flashes", description: "Quick cuts between: laughing with friends in a car, dancing alone in a room, staring at a phone screen, watching rain on glass. Each shot 2-3 seconds.", visual: "from-slate-900 to-cyan-900" },
      { time: "1:30 - 2:00", shot: "Wide — Empty theater", description: "Artist sits alone in an ornate but empty theater. Spotlight from above. Camera slowly pulls back to reveal the vast emptiness. Bridge section.", visual: "from-gray-900 to-red-950" },
      { time: "2:00 - 2:30", shot: "Performance — Stage", description: "Quick transition to artist performing on the theater stage with dramatic lighting. Smoke machines. Silhouette shots. Energy builds with final chorus.", visual: "from-red-900 to-orange-900" },
      { time: "2:30 - 3:00", shot: "Wide — Dawn breaking", description: "Return to the rooftop. Dawn is breaking. City comes alive. Artist watches the sunrise. Camera pulls out to a final wide shot. Fade to black.", visual: "from-orange-800 to-sky-600" },
    ],
    createdAt: "Mar 22, 2026",
  },
];

const trackOptions = ["Midnight Dreams", "Electric Feel", "Golden Hour", "Summer Waves", "Neon Lights"];

export default function StoryboardPage() {
  const [selectedTrack, setSelectedTrack] = useState("Midnight Dreams");
  const [generating, setGenerating] = useState(false);
  const [showResult, setShowResult] = useState(true);
  const [boardList, setBoardList] = useState(storyboards);
  const [selectedStyle, setSelectedStyle] = useState("Cinematic / Narrative");

  useEffect(() => {
    apiGet<typeof storyboards>("/api/storyboards")
      .then((d) => { if (d.length > 0) setBoardList(d); })
      .catch(() => {/* keep mock data */});
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setShowResult(false);
    try {
      const result = await apiPost<(typeof storyboards)[0]>("/api/ai/generate", {
        type: "storyboard",
        context: { track: selectedTrack, style: selectedStyle },
      });
      setBoardList([result, ...boardList]);
      setShowResult(true);
    } catch {
      // Fall back to showing existing mock
      setShowResult(true);
    } finally {
      setGenerating(false);
    }
  };

  const saveStoryboard = async (storyboardData: (typeof storyboards)[0]) => {
    try {
      await apiPost("/api/storyboards", storyboardData);
    } catch {
      /* keep current state */
    }
  };

  const board = boardList[0];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Video Storyboard</h1>
            <p className="text-sm text-gray-500">Generate visual concepts from your music</p>
          </div>
          <button className="relative p-2 text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
        </div>

        <div className="p-8">
          {/* Generator */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1.5">Select Track</label>
                <select value={selectedTrack} onChange={(e) => setSelectedTrack(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20">
                  {trackOptions.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1.5">Video Style</label>
                <select value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20">
                  <option>Cinematic / Narrative</option>
                  <option>Performance / Live</option>
                  <option>Abstract / Artistic</option>
                  <option>Lyric Video</option>
                  <option>Animated</option>
                </select>
              </div>
              <button onClick={handleGenerate} disabled={generating} className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] disabled:opacity-50 text-white font-medium text-sm px-6 py-2.5 rounded-xl transition-colors">
                {generating ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {generating ? "Analyzing..." : "Generate Storyboard"}
              </button>
            </div>
          </div>

          {generating && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center mb-6">
              <div className="animate-spin w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Analyzing your track...</h3>
              <p className="text-sm text-gray-500">AI is listening to mood, tempo, lyrics, and energy to craft a visual narrative.</p>
            </div>
          )}

          {showResult && !generating && (
            <>
              {/* Header info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Film size={28} className="text-[var(--primary)]" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl">{board.track} — Storyboard</h2>
                      <p className="text-sm text-gray-500">{board.scenes.length} scenes &bull; {board.mood}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleGenerate} className="inline-flex items-center gap-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                      <RefreshCw size={14} /> Regenerate
                    </button>
                    <button className="inline-flex items-center gap-1.5 text-sm bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      <Download size={14} /> Export Brief
                    </button>
                  </div>
                </div>

                {/* Color palette */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                    <Palette size={12} /> Suggested Color Palette
                  </h3>
                  <div className="flex gap-2">
                    {board.colorPalette.map((c) => (
                      <div key={c} className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-xl border border-gray-200" style={{ backgroundColor: c }} />
                        <span className="text-xs text-gray-400 font-mono">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scene timeline */}
              <div className="space-y-4">
                {board.scenes.map((scene, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="flex">
                      {/* Visual preview */}
                      <div className={`w-64 shrink-0 bg-gradient-to-br ${scene.visual} flex flex-col items-center justify-center p-6 text-white`}>
                        <div className="text-xs font-bold uppercase tracking-widest mb-2 text-white/60">Scene {idx + 1}</div>
                        <Film size={32} className="text-white/40 mb-2" />
                        <div className="text-xs text-white/50 flex items-center gap-1">
                          <Clock size={10} /> {scene.time}
                        </div>
                      </div>
                      {/* Details */}
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{scene.time}</span>
                          <span className="text-xs text-gray-400">{scene.shot}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{scene.shot.split(" — ")[1]}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{scene.description}</p>
                        <div className="flex gap-2 mt-3">
                          <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                            {scene.shot.split(" — ")[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Export CTA */}
              <div className="bg-gradient-to-r from-[var(--primary)] to-emerald-500 rounded-2xl p-8 mt-6 text-white text-center">
                <h3 className="font-bold text-xl mb-2">Ready to bring this to life?</h3>
                <p className="text-white/80 mb-4">Export this storyboard as a PDF brief to share with your videographer or production team.</p>
                <button className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                  <Download size={18} /> Download Storyboard Brief
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
