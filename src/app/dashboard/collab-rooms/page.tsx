"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { Bell, Users, Plus, Music2, Play, Pause, MessageSquare, ThumbsUp, ThumbsDown, Clock, Lock, ExternalLink, Crown } from "lucide-react";
import { useState } from "react";

const rooms = [
  {
    id: "r1",
    name: "Golden Hour — Final Mix Review",
    track: "Golden Hour",
    status: "active" as const,
    members: [
      { name: "Jordan Davis", role: "Artist", avatar: "JD", online: true },
      { name: "Alex Producer", role: "Producer", avatar: "AP", online: true },
      { name: "Sarah Mix", role: "Mix Engineer", avatar: "SM", online: false },
    ],
    comments: [
      { author: "Alex Producer", text: "I think the synth pad at 1:22 could come down 2dB. It's masking the vocal.", time: "10 min ago", timestamp: "1:22" },
      { author: "Jordan Davis", text: "Agreed! Also, can we add a bit more reverb on the bridge vocals?", time: "8 min ago", timestamp: "2:15" },
      { author: "Sarah Mix", text: "Updated mix uploaded — v3. Addressed both notes.", time: "2 min ago", timestamp: null },
    ],
    versions: [
      { name: "Golden Hour v3 (latest)", date: "Mar 28", votes: { up: 2, down: 0 } },
      { name: "Golden Hour v2", date: "Mar 26", votes: { up: 1, down: 1 } },
      { name: "Golden Hour v1 (rough)", date: "Mar 22", votes: { up: 0, down: 2 } },
    ],
    createdAt: "Mar 20, 2026",
  },
  {
    id: "r2",
    name: "EP Artwork — Vote on Concepts",
    track: "Untitled EP",
    status: "active" as const,
    members: [
      { name: "Jordan Davis", role: "Artist", avatar: "JD", online: true },
      { name: "Kim Design", role: "Designer", avatar: "KD", online: true },
    ],
    comments: [
      { author: "Kim Design", text: "3 concepts uploaded. Let me know which direction speaks to you!", time: "1 hour ago", timestamp: null },
      { author: "Jordan Davis", text: "Concept B is amazing. Can we try it with a darker blue?", time: "45 min ago", timestamp: null },
    ],
    versions: [
      { name: "Concept A — Minimalist", date: "Mar 27", votes: { up: 0, down: 1 } },
      { name: "Concept B — Gradient Wave", date: "Mar 27", votes: { up: 2, down: 0 } },
      { name: "Concept C — Photo Collage", date: "Mar 27", votes: { up: 1, down: 1 } },
    ],
    createdAt: "Mar 25, 2026",
  },
  {
    id: "r3",
    name: "Midnight Dreams — Remix Collab",
    track: "Midnight Dreams",
    status: "completed" as const,
    members: [
      { name: "Jordan Davis", role: "Artist", avatar: "JD", online: true },
      { name: "DJ Flux", role: "Remixer", avatar: "DF", online: false },
    ],
    comments: [],
    versions: [
      { name: "Midnight Dreams (DJ Flux Remix) — Final", date: "Feb 14", votes: { up: 2, down: 0 } },
    ],
    createdAt: "Jan 28, 2026",
  },
];

export default function CollabRoomsPage() {
  const [expandedRoom, setExpandedRoom] = useState<string | null>("r1");
  const [showCreate, setShowCreate] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Collaboration Rooms</h1>
            <p className="text-sm text-gray-500">Real-time collaboration with your team</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCreate(!showCreate)} className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors">
              <Plus size={16} /> Create Room
            </button>
            <button className="relative p-2 text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
          </div>
        </div>

        <div className="p-8">
          {showCreate && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h2 className="font-bold text-lg mb-4">Create Collaboration Room</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Room Name</label>
                  <input type="text" placeholder="e.g. Golden Hour Final Review" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Track / Project</label>
                  <input type="text" placeholder="e.g. Golden Hour" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5">Invite Members (emails)</label>
                <input type="text" placeholder="email1@example.com, email2@example.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5">Upload Audio (optional)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[var(--primary)]/40">
                  <Music2 size={24} className="mx-auto text-gray-300 mb-1" />
                  <p className="text-sm text-gray-500">Drop audio file here</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors">Create Room</button>
                <button onClick={() => setShowCreate(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-5 py-2.5 rounded-lg transition-colors">Cancel</button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setExpandedRoom(expandedRoom === room.id ? null : room.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${room.status === "active" ? "bg-[var(--primary)]/10" : "bg-gray-100"}`}>
                        <Users size={22} className={room.status === "active" ? "text-[var(--primary)]" : "text-gray-400"} />
                      </div>
                      <div>
                        <h3 className="font-bold">{room.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${room.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{room.status}</span>
                          <span>{room.members.length} members</span>
                          <span>{room.comments.length} comments</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      {room.members.map((m) => (
                        <div key={m.name} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white ${m.online ? "bg-[var(--primary)] text-white" : "bg-gray-300 text-gray-600"}`}>{m.avatar}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {expandedRoom === room.id && (
                  <div className="border-t border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                      {/* Player & versions */}
                      <div className="p-6">
                        <h4 className="font-semibold text-sm mb-3">Versions</h4>
                        {/* Synced player */}
                        <div className="bg-gray-900 rounded-xl p-4 mb-4 text-white">
                          <div className="flex items-center gap-3 mb-3">
                            <button onClick={() => setPlaying(!playing)} className="w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center">
                              {playing ? <Pause size={18} /> : <Play size={18} />}
                            </button>
                            <div className="flex-1">
                              <div className="text-sm font-medium">{room.versions[0]?.name}</div>
                              <div className="text-xs text-gray-400">Synced playback for all members</div>
                            </div>
                          </div>
                          <div className="bg-gray-800 rounded-full h-1.5">
                            <div className="bg-[var(--primary)] h-1.5 rounded-full w-1/3" />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1"><span>1:05</span><span>3:22</span></div>
                        </div>
                        <div className="space-y-2">
                          {room.versions.map((v, idx) => (
                            <div key={v.name} className={`flex items-center justify-between p-3 rounded-lg ${idx === 0 ? "bg-[var(--primary)]/5 border border-[var(--primary)]/20" : "bg-gray-50"}`}>
                              <div>
                                <div className="text-sm font-medium">{v.name}</div>
                                <div className="text-xs text-gray-400">{v.date}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-0.5 text-xs text-green-600"><ThumbsUp size={12} />{v.votes.up}</span>
                                <span className="flex items-center gap-0.5 text-xs text-red-500"><ThumbsDown size={12} />{v.votes.down}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Comments */}
                      <div className="p-6 lg:col-span-1">
                        <h4 className="font-semibold text-sm mb-3">Comments</h4>
                        <div className="space-y-3 mb-4">
                          {room.comments.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">No comments yet</p>
                          ) : room.comments.map((c, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold">{c.author}</span>
                                <span className="text-xs text-gray-400">{c.time}</span>
                              </div>
                              <p className="text-sm text-gray-700">{c.text}</p>
                              {c.timestamp && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-mono mt-1 inline-block">@{c.timestamp}</span>}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input type="text" placeholder="Add a comment..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" />
                          <button className="bg-[var(--primary)] text-white p-2 rounded-lg"><MessageSquare size={16} /></button>
                        </div>
                      </div>

                      {/* Members */}
                      <div className="p-6">
                        <h4 className="font-semibold text-sm mb-3">Members</h4>
                        <div className="space-y-2">
                          {room.members.map((m) => (
                            <div key={m.name} className="flex items-center gap-3 py-2">
                              <div className="relative">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${m.online ? "bg-[var(--primary)] text-white" : "bg-gray-200 text-gray-600"}`}>{m.avatar}</div>
                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${m.online ? "bg-green-500" : "bg-gray-400"}`} />
                              </div>
                              <div>
                                <div className="text-sm font-medium flex items-center gap-1">{m.name} {m.role === "Artist" && <Crown size={12} className="text-amber-500" />}</div>
                                <div className="text-xs text-gray-400">{m.role}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button className="w-full mt-3 text-sm text-[var(--primary)] bg-[var(--primary)]/5 hover:bg-[var(--primary)]/10 font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                          <Plus size={14} /> Invite member
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
