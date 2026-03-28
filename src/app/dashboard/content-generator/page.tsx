"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { apiPost } from "@/lib/api-client";
import {
  Bell,
  Sparkles,
  Copy,
  RefreshCw,
  CheckCircle2,
  Music2,
  MessageSquare,
  Mail,
  Megaphone,
  Hash,
  Wand2,
  BookOpen,
} from "lucide-react";
import { useState } from "react";

type ContentType = "social" | "email" | "press" | "captions" | "hashtags" | "story";

const contentTypes: { id: ContentType; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "social", label: "Social Post", icon: Megaphone, desc: "Instagram, TikTok, or Twitter post" },
  { id: "captions", label: "Captions", icon: MessageSquare, desc: "Engaging captions for your content" },
  { id: "hashtags", label: "Hashtags", icon: Hash, desc: "Relevant hashtags for reach" },
  { id: "email", label: "Fan Email", icon: Mail, desc: "Newsletter for your fans" },
  { id: "press", label: "Press Release", icon: BookOpen, desc: "Media pitch for press outreach" },
  { id: "story", label: "Story Ideas", icon: Wand2, desc: "Story/Reel content ideas" },
];

const generatedExamples: Record<ContentType, string[]> = {
  social: [
    "🎵 \"Midnight Dreams\" is OUT NOW! This track was born from late-night studio sessions and that feeling when the city lights blur together. Stream it on all platforms — link in bio. \n\nWhich lyric hits you the hardest? Drop it below 👇",
    "New music alert 🚨 I poured everything into \"Midnight Dreams\" and I can't wait for you to hear it. This one's different. This one's special.\n\nAvailable everywhere you stream music 🌙✨",
    "POV: You're driving through the city at 2am and \"Midnight Dreams\" comes on shuffle. 🌃🎶\n\nOut now on all platforms. Link in bio 🔗",
  ],
  captions: [
    "The dream was always the music. Now the music is the dream. 🌙 \"Midnight Dreams\" out now.",
    "2am sessions. Raw emotions. Real music. New single available everywhere.",
    "Some songs choose you. \"Midnight Dreams\" chose me at 3am in a dark studio. Listen now.",
  ],
  hashtags: [
    "#MidnightDreams #NewMusic #OutNow #IndieMusic #ElectronicPop #IndieArtist #NewSingle2026 #MusicRelease #StreamNow #IndependentArtist #PopMusic #IndiePop #ElectronicMusic #NewMusicFriday #JordanDavis",
  ],
  email: [
    "Subject: 🌙 \"Midnight Dreams\" is finally here\n\nHey [First Name],\n\nI've been working on something special, and today it's finally yours.\n\n\"Midnight Dreams\" is my most personal track yet — written during those quiet hours when the world goes still and the music takes over.\n\nI'd love for you to be one of the first to hear it.\n\n👉 [Listen to Midnight Dreams]\n\nIf it resonates with you, share it with someone who needs to hear it.\n\nWith love,\nJordan",
  ],
  press: [
    "FOR IMMEDIATE RELEASE\n\nLos Angeles-based artist Jordan Davis releases new single \"Midnight Dreams\"\n\nLOS ANGELES, CA — Independent artist Jordan Davis announces the release of \"Midnight Dreams,\" a genre-blending single that fuses electronic production with indie-pop sensibilities.\n\nWith over 128,000 streams across platforms and a rapidly growing fanbase, Davis continues to carve out a unique space in the indie-electronic landscape. \"Midnight Dreams\" explores themes of late-night introspection and urban solitude.\n\n\"This song came from a very real place,\" says Davis. \"I wanted to capture that feeling of being completely awake when the rest of the world is asleep.\"\n\nThe single is available on all major streaming platforms.\n\nFor press inquiries: press@jordandavis.com\nFor booking: booking@jordandavis.com",
  ],
  story: [
    "📱 Story Idea 1: Behind-the-scenes studio timelapse of making \"Midnight Dreams\" with the track playing. Add a poll: \"Vibes?\" ✨ / 🔥\n\n📱 Story Idea 2: Screen record scrolling through streaming platforms showing the song is live. Add \"OUT NOW\" sticker + link.\n\n📱 Story Idea 3: Film yourself reacting to fan DMs about the new song. Authentic + engaging.\n\n📱 Story Idea 4: 15-second clip of the most catchy part of the song with lyric overlay animation.\n\n📱 Story Idea 5: \"Day in my life on release day\" — wake up, check streams, celebrate milestones, thank fans.",
  ],
};

export default function ContentGeneratorPage() {
  const [selectedType, setSelectedType] = useState<ContentType>("social");
  const [release, setRelease] = useState("Midnight Dreams");
  const [tone, setTone] = useState("authentic");
  const [platform, setPlatform] = useState("All Platforms");
  const [additionalContext, setAdditionalContext] = useState("");
  const [generated, setGenerated] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated([]);
    try {
      const data = await apiPost<{ content: string[] | string }>("/api/ai/generate", {
        type: selectedType,
        context: { track: release, tone, platform, additionalContext },
      });
      const results = Array.isArray(data.content) ? data.content : [data.content];
      setGenerated(results);
    } catch {
      // Fall back to hardcoded examples
      setGenerated(generatedExamples[selectedType]);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Content Generator</h1>
            <p className="text-sm text-gray-500">
              AI-powered promotional content for your releases
            </p>
          </div>
          <button className="relative p-2 text-gray-500 hover:text-gray-700">
            <Bell size={20} />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Config */}
            <div className="space-y-6">
              {/* Content type */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-sm mb-3">Content Type</h2>
                <div className="space-y-2">
                  {contentTypes.map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => setSelectedType(ct.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors ${
                        selectedType === ct.id
                          ? "bg-[var(--primary)]/10 text-[var(--primary)] font-medium"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <ct.icon size={18} />
                      <div>
                        <div className="font-medium">{ct.label}</div>
                        <div className="text-xs text-gray-400">{ct.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-sm mb-3">Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Release / Track
                    </label>
                    <select
                      value={release}
                      onChange={(e) => setRelease(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    >
                      <option>Midnight Dreams</option>
                      <option>Electric Feel</option>
                      <option>Summer Waves EP</option>
                      <option>Neon Lights</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    >
                      <option value="authentic">Authentic & Personal</option>
                      <option value="hype">Hype & Energetic</option>
                      <option value="professional">Professional</option>
                      <option value="casual">Casual & Fun</option>
                      <option value="mysterious">Mysterious & Intriguing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Platform Focus
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    >
                      <option>All Platforms</option>
                      <option>Instagram</option>
                      <option>TikTok</option>
                      <option>Twitter / X</option>
                      <option>Facebook</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Additional Context
                    </label>
                    <textarea
                      rows={3}
                      value={additionalContext}
                      onChange={(e) => setAdditionalContext(e.target.value)}
                      placeholder="Any specific angle, message, or detail to include..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 resize-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] disabled:opacity-50 text-white font-medium text-sm py-3 rounded-xl transition-colors"
                >
                  {generating ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  {generating ? "Generating..." : "Generate Content"}
                </button>
              </div>
            </div>

            {/* Right: Results */}
            <div className="lg:col-span-2">
              {generated.length === 0 && !generating ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                  <Sparkles
                    size={48}
                    className="mx-auto text-gray-200 mb-4"
                  />
                  <h3 className="font-bold text-lg text-gray-400 mb-2">
                    Ready to generate
                  </h3>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    Select your content type and settings, then click Generate to
                    create AI-powered promotional content for your release.
                  </p>
                </div>
              ) : generating ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
                  <RefreshCw
                    size={48}
                    className="mx-auto text-[var(--primary)] mb-4 animate-spin"
                  />
                  <h3 className="font-bold text-lg mb-2">
                    Generating content...
                  </h3>
                  <p className="text-sm text-gray-500">
                    AI is crafting your {contentTypes.find((c) => c.id === selectedType)?.label.toLowerCase()}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg">
                      Generated{" "}
                      {contentTypes.find((c) => c.id === selectedType)?.label}
                    </h2>
                    <button
                      onClick={handleGenerate}
                      className="inline-flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline font-medium"
                    >
                      <RefreshCw size={14} /> Regenerate
                    </button>
                  </div>
                  {generated.map((text, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl border border-gray-100 p-6"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <span className="text-xs font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-2.5 py-0.5 rounded-full">
                          Option {idx + 1}
                        </span>
                        <button
                          onClick={() => handleCopy(text, idx)}
                          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {copied === idx ? (
                            <>
                              <CheckCircle2 size={12} className="text-green-600" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy size={12} /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                        {text}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
