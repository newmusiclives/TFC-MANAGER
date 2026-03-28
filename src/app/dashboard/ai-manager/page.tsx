"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { Send, Bot, User, Sparkles, RotateCcw, Lightbulb, TrendingUp, Music2, Megaphone, Clock } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "ai"; content: string; timestamp: string };

const suggestedPrompts = [
  { icon: TrendingUp, text: "My streams dropped 20% this week — what should I do?" },
  { icon: Music2, text: "When is the best time to release my next single?" },
  { icon: Megaphone, text: "Write me a pitch email for BBC Radio 1" },
  { icon: Lightbulb, text: "Give me 5 creative ways to promote my upcoming EP" },
];

const aiResponses: Record<string, string> = {
  "My streams dropped 20% this week — what should I do?": `Looking at your analytics, your streams dipped from ~2,950/day to ~2,360/day this week. Here's what I see and recommend:

**Why it happened:**
• Your last promotional push for "Midnight Dreams" was 3 weeks ago — the organic momentum is naturally tapering
• No new content posted on TikTok/Instagram in the last 5 days
• One of your top playlist placements ("Indie Chill Vibes") rotated your track out on Monday

**Action plan for this week:**
1. **Immediately:** Post a behind-the-scenes clip or acoustic snippet on TikTok/Reels — your short-form content averages 12K views
2. **Tomorrow:** Submit "Midnight Dreams" to 3 new playlists (I can generate the pitch emails)
3. **This week:** Run a $50 Instagram ad targeting your top cities (LA, Paris, London) — your last $50 campaign brought 1,200 new listeners
4. **Consider:** Releasing a remix or acoustic version to re-activate algorithmic recommendations

Your growth trajectory is still strong — this is a normal dip between release cycles. Want me to draft those playlist pitches?`,

  "When is the best time to release my next single?": `Based on your data, here's my analysis:

**Your audience profile:**
• 32% US, 16% France, 11.5% UK — spread across 3 major time zones
• Peak listening hours: 8-10pm local time (your fans are evening listeners)
• 62% of your listeners are 18-34 (Friday release habit is strong in this demo)

**Optimal release window:**
🎯 **Friday at 12:00am ET (midnight)** — This catches:
• Spotify's New Music Friday editorial consideration (submissions need to be in 7+ days before)
• Your US fans at midnight, European fans at 6am (catches morning commuters)
• Full weekend for social engagement

**Best months based on your genre:**
• ✅ **Late April / Early May** — Spring is strong for indie-electronic. Less competition than September.
• ⚠️ Avoid late November-December (holiday music dominates algorithms)

**My recommendation:**
Release "Golden Hour" on **Friday, April 18th**. That gives you 3 weeks for pre-release promotion. I've already drafted a timeline in your Release Plans.

Want me to generate the full release plan?`,

  "Write me a pitch email for BBC Radio 1": `Here's a personalized pitch based on your profile and the track "Golden Hour":

---

**Subject:** New Single from Jordan Davis — "Golden Hour" (Indie-Electronic, April 18)

Hi [Producer Name],

I'm reaching out about my upcoming single **"Golden Hour,"** releasing April 18th. I think it could be a great fit for your show's indie-electronic rotation.

**The track:** "Golden Hour" blends atmospheric synths with warm indie-pop vocals — think a collision between Tame Impala's production and The 1975's melodic sensibility. It was written during a solo trip to Joshua Tree and captures that magic-hour feeling of being between worlds.

**Why now:** My previous single "Midnight Dreams" has generated **22K+ streams** organically and landed on 25+ editorial playlists including Spotify's "Indie Chill Vibes." Monthly listeners have grown **122% in the past 6 months** to 18.2K.

**Listen first:** [Private Listening Link]
**Press Kit:** [EPK Link]

I'd love for you to hear it. Happy to provide anything else you need.

Best,
Jordan Davis
press@jordandavis.com

---

Want me to customize this for specific shows or adjust the tone?`,

  "Give me 5 creative ways to promote my upcoming EP": `Here are 5 unconventional promo ideas tailored to your audience and style:

**1. 🎬 "Track-by-Track" Visual Diary Series**
Film a 60-second video for each EP track explaining the story behind it. Post one per day in the week leading up to release. Your audience over-indexes on "authentic" content — behind-the-scenes performs 3x better than polished posts for you.

**2. 🗺️ Fan City Takeover**
Your top 3 cities are LA, Paris, and London. Create city-specific Instagram Stories — "If you're in Paris right now, go to [café] and tell them Jordan sent you for a free coffee + early EP listen." Partner with one small business in each city. Creates IRL buzz and is insanely shareable.

**3. 🎧 "Choose Your Own Adventure" Listening Experience**
Build an interactive Instagram Story where fans answer questions ("Are you a morning or night person?" "Beach or mountains?") and get directed to different tracks on the EP based on their answers. Drives full-EP streams, not just lead single.

**4. 💌 Handwritten Notes Campaign**
Send physical handwritten postcards to your top 50 Superfans (I can identify them from your analytics). Include a QR code to an exclusive pre-release listening room. Cost: ~$75. Impact: These fans will screenshot and share everywhere.

**5. 🎵 "Stems Challenge"**
Release isolated stems (vocals, synths, drums) from one track and challenge fans/producers to remix it. Feature the best remixes on your socials. Engages the creator community and generates dozens of pieces of user-generated content.

Want me to build out a full campaign timeline combining these?`,
};

const defaultResponse = `Great question! Let me analyze your data and provide a tailored recommendation.

Based on your current metrics:
• **128.5K total streams** across platforms
• **18.2K monthly listeners** (growing 12.8% month over month)
• **24.3% save rate** (above the 20% indie average)

Your profile shows strong engagement metrics. I'd recommend focusing on consistency — your best growth periods correlate with regular content posting (3-4x/week) and release cycles of 6-8 weeks.

Would you like me to dive deeper into any specific area — marketing strategy, release timing, playlist pitching, or audience growth?`;

export default function AIManagerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: `Hey Jordan! 👋 I'm your AI Manager. I have full context on your analytics, releases, and career trajectory.

Here's your quick status:
• **Streams this week:** 2,950/day (up 8.4% from last week)
• **"Golden Hour" release** is in 21 days — we're 35% through the release plan
• **Top action item:** Submit artwork by March 30

What would you like to work on today?`,
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg: Message = { role: "user", content: msg, timestamp: "Just now" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = aiResponses[msg] || defaultResponse;
      const aiMsg: Message = { role: "ai", content: response, timestamp: "Just now" };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64 flex flex-col h-screen">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Bot size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Manager</h1>
              <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Online — Full context loaded
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              setMessages([
                {
                  role: "ai",
                  content: "Chat cleared! What can I help you with?",
                  timestamp: "Just now",
                },
              ])
            }
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
          >
            <RotateCcw size={14} /> Clear chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "ai" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${
                    msg.role === "user"
                      ? "bg-[var(--primary)] text-white"
                      : "bg-white border border-gray-100"
                  }`}
                >
                  <div
                    className={`text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user" ? "text-white" : "text-gray-700"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                  <div className={`text-xs mt-2 ${msg.role === "user" ? "text-white/60" : "text-gray-400"}`}>
                    {msg.timestamp}
                  </div>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts */}
          {messages.length <= 1 && (
            <div className="max-w-3xl mx-auto mt-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Suggested
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedPrompts.map((p) => (
                  <button
                    key={p.text}
                    onClick={() => handleSend(p.text)}
                    className="flex items-center gap-3 bg-white border border-gray-100 hover:border-[var(--primary)]/30 hover:shadow-sm rounded-xl px-4 py-3 text-left transition-all"
                  >
                    <p.icon size={18} className="text-[var(--primary)] shrink-0" />
                    <span className="text-sm text-gray-700">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 bg-white px-8 py-4">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-3"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your AI Manager anything..."
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] pr-12"
                />
                <Sparkles size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] disabled:opacity-40 text-white p-3.5 rounded-xl transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-2 text-center">
              AI Manager has access to your analytics, releases, and career data to provide personalized advice.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
