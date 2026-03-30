"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  MapPin,
  Calendar,
  Ticket,
  DollarSign,
  Music,
  ListMusic,
  ShoppingBag,
  QrCode,
  Users,
  ChevronUp,
  ChevronDown,
  Plus,
  Loader2,
  Clock,
  Package,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { apiGet } from "@/lib/api-client";
import { generateQRCodeSVG } from "@/lib/qr-generator";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Show = {
  id: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  capacity: number;
  ticketsSold: number;
  ticketPrice: number;
  revenue: number;
  status: string;
};

type Setlist = {
  id: string;
  name: string;
  showId: string;
  songs: { id: string; title: string; duration: number }[];
  createdAt: string;
};

type MerchItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  sold: number;
  sku: string;
};

type CheckIn = {
  id: string;
  fanName: string;
  email: string;
  checkedInAt: string;
  showId: string;
};

type Tab = "shows" | "setlists" | "merch" | "checkin";

const SHOW_STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  Confirmed: { text: "text-blue-600", bg: "bg-blue-50" },
  "Sold Out": { text: "text-green-600", bg: "bg-green-50" },
  "On Sale": { text: "text-yellow-600", bg: "bg-yellow-50" },
  Cancelled: { text: "text-red-500", bg: "bg-red-50" },
};

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LiveHubPage() {
  const [activeTab, setActiveTab] = useState<Tab>("shows");
  const [loading, setLoading] = useState(true);

  const [shows, setShows] = useState<Show[]>([]);
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [merch, setMerch] = useState<MerchItem[]>([]);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [merchTotalValue, setMerchTotalValue] = useState(0);

  // Setlist state
  const [selectedSetlistIdx, setSelectedSetlistIdx] = useState(0);
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongDuration, setNewSongDuration] = useState("180");

  // Merch modal
  const [showMerchModal, setShowMerchModal] = useState(false);
  const [newMerchName, setNewMerchName] = useState("");
  const [newMerchCategory, setNewMerchCategory] = useState("Apparel");
  const [newMerchPrice, setNewMerchPrice] = useState("");
  const [newMerchQty, setNewMerchQty] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [showData, setlistData, merchData] = await Promise.all([
        apiGet<{ shows: Show[]; checkins: CheckIn[]; stats: { totalRevenue: number } }>("/api/live-hub"),
        apiGet<{ setlists: Setlist[] }>("/api/live-hub/setlists"),
        apiGet<{ merch: MerchItem[]; stats: { totalValue: number } }>("/api/live-hub/merch"),
      ]);
      setShows(showData.shows);
      setCheckins(showData.checkins);
      setTotalRevenue(showData.stats.totalRevenue);
      setSetlists(setlistData.setlists);
      setMerch(merchData.merch);
      setMerchTotalValue(merchData.stats.totalValue);
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentSetlist = setlists[selectedSetlistIdx] || null;
  const totalSetlistDuration = currentSetlist ? currentSetlist.songs.reduce((s, sg) => s + sg.duration, 0) : 0;

  const moveSong = (idx: number, dir: -1 | 1) => {
    if (!currentSetlist) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= currentSetlist.songs.length) return;
    const updated = [...setlists];
    const songs = [...currentSetlist.songs];
    [songs[idx], songs[newIdx]] = [songs[newIdx], songs[idx]];
    updated[selectedSetlistIdx] = { ...currentSetlist, songs };
    setSetlists(updated);
  };

  const addSong = () => {
    if (!currentSetlist || !newSongTitle.trim()) return;
    const updated = [...setlists];
    updated[selectedSetlistIdx] = {
      ...currentSetlist,
      songs: [...currentSetlist.songs, { id: `sg-${Date.now()}`, title: newSongTitle.trim(), duration: parseInt(newSongDuration) || 180 }],
    };
    setSetlists(updated);
    setNewSongTitle("");
    setNewSongDuration("180");
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "shows", label: "Upcoming Shows", icon: Calendar },
    { key: "setlists", label: "Setlist Builder", icon: ListMusic },
    { key: "merch", label: "Merch Inventory", icon: ShoppingBag },
    { key: "checkin", label: "Fan Check-in", icon: QrCode },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Live Performance Hub</h1>
            <p className="text-sm text-gray-500">Manage shows, setlists, merch and fan check-ins</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Upcoming Shows", value: shows.length.toString(), icon: Calendar, color: "bg-blue-50 text-blue-600" },
              { label: "Tickets Sold", value: shows.reduce((s, sh) => s + sh.ticketsSold, 0).toString(), icon: Ticket, color: "bg-green-50 text-green-600" },
              { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-purple-50 text-purple-600" },
              { label: "Merch Value", value: `$${merchTotalValue.toLocaleString()}`, icon: Package, color: "bg-amber-50 text-amber-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><s.icon size={18} /></div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-1.5 mb-6 flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key ? "bg-purple-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-purple-600" size={32} /></div>
          ) : (
            <>
              {/* Shows */}
              {activeTab === "shows" && (
                <div className="grid md:grid-cols-2 gap-4">
                  {shows.map((show) => {
                    const sc = SHOW_STATUS_COLORS[show.status] || { text: "text-gray-600", bg: "bg-gray-50" };
                    const pct = Math.round((show.ticketsSold / show.capacity) * 100);
                    return (
                      <div key={show.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{show.venue}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-500"><MapPin size={14} />{show.city}</div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>{show.status}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1"><Calendar size={14} />{show.date}</span>
                          <span className="flex items-center gap-1"><Clock size={14} />{show.time}</span>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Tickets: {show.ticketsSold} / {show.capacity}</span>
                            <span className="font-medium">{pct}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                        </div>
                        <div className="flex justify-between text-sm mt-3 pt-3 border-t border-gray-50">
                          <span className="text-gray-500">Ticket Price: <span className="font-medium text-gray-900">${show.ticketPrice}</span></span>
                          <span className="text-gray-500">Revenue: <span className="font-medium text-green-600">${show.revenue.toLocaleString()}</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Setlists */}
              {activeTab === "setlists" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-sm font-medium text-gray-700">Setlist:</label>
                    <select
                      value={selectedSetlistIdx}
                      onChange={(e) => setSelectedSetlistIdx(Number(e.target.value))}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                    >
                      {setlists.map((sl, i) => <option key={sl.id} value={i}>{sl.name}</option>)}
                    </select>
                    <span className="ml-auto text-sm text-gray-500">Total: {formatDuration(totalSetlistDuration)}</span>
                  </div>

                  {currentSetlist && (
                    <div className="space-y-1 mb-6">
                      {currentSetlist.songs.map((song, idx) => (
                        <div key={`${song.id}-${idx}`} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                          <span className="text-sm font-medium text-gray-400 w-6">{idx + 1}</span>
                          <Music size={16} className="text-purple-500" />
                          <span className="flex-1 text-sm font-medium">{song.title}</span>
                          <span className="text-xs text-gray-500">{formatDuration(song.duration)}</span>
                          <div className="flex gap-1">
                            <button onClick={() => moveSong(idx, -1)} disabled={idx === 0} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronUp size={14} /></button>
                            <button onClick={() => moveSong(idx, 1)} disabled={idx === currentSetlist.songs.length - 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronDown size={14} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input type="text" value={newSongTitle} onChange={(e) => setNewSongTitle(e.target.value)} placeholder="Song title" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400" />
                    <input type="number" value={newSongDuration} onChange={(e) => setNewSongDuration(e.target.value)} placeholder="Duration (s)" className="w-28 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400" />
                    <button onClick={addSong} className="bg-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-1"><Plus size={16} /> Add</button>
                  </div>
                </div>
              )}

              {/* Merch */}
              {activeTab === "merch" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">Total Inventory Value: <span className="font-bold text-gray-900">${merchTotalValue.toLocaleString()}</span></p>
                    <button onClick={() => setShowMerchModal(true)} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-1"><Plus size={16} /> Add Item</button>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="text-left p-4 font-medium text-gray-600">Name</th>
                            <th className="text-left p-4 font-medium text-gray-600">Category</th>
                            <th className="text-right p-4 font-medium text-gray-600">Price</th>
                            <th className="text-right p-4 font-medium text-gray-600">Quantity</th>
                            <th className="text-right p-4 font-medium text-gray-600">Total Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {merch.map((item) => (
                            <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                              <td className="p-4 font-medium">{item.name}</td>
                              <td className="p-4 text-gray-600">{item.category}</td>
                              <td className="p-4 text-right">${item.price}</td>
                              <td className="p-4 text-right">{item.quantity}</td>
                              <td className="p-4 text-right font-medium">${(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Add Item Modal */}
                  {showMerchModal && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowMerchModal(false)}>
                      <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-4">Add Merch Item</h3>
                        <div className="space-y-3">
                          <input type="text" value={newMerchName} onChange={(e) => setNewMerchName(e.target.value)} placeholder="Item name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400" />
                          <select value={newMerchCategory} onChange={(e) => setNewMerchCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400">
                            {["Apparel", "Music", "Prints", "Accessories", "Other"].map((c) => <option key={c}>{c}</option>)}
                          </select>
                          <input type="number" value={newMerchPrice} onChange={(e) => setNewMerchPrice(e.target.value)} placeholder="Price ($)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400" />
                          <input type="number" value={newMerchQty} onChange={(e) => setNewMerchQty(e.target.value)} placeholder="Quantity" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400" />
                        </div>
                        <div className="flex gap-2 mt-5">
                          <button onClick={() => setShowMerchModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                          <button onClick={() => setShowMerchModal(false)} className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700">Add Item</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Fan Check-in */}
              {activeTab === "checkin" && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center">
                    <h3 className="font-semibold mb-4">QR Check-in Code</h3>
                    <div
                      className="w-48 h-48 rounded-2xl flex items-center justify-center mb-4 overflow-hidden"
                      dangerouslySetInnerHTML={{
                        __html: generateQRCodeSVG(
                          `https://truefansmanager.com/checkin/${shows[0]?.id ?? "default"}`,
                          192
                        ),
                      }}
                    />
                    <p className="text-sm text-gray-500 text-center">Display this QR code at the venue entrance for fans to check in</p>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-semibold mb-4">Recent Check-ins</h3>
                    <div className="space-y-3">
                      {checkins.map((ci) => (
                        <div key={ci.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">
                            {ci.fanName.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{ci.fanName}</div>
                            <div className="text-xs text-gray-500 truncate">{ci.email}</div>
                          </div>
                          <div className="text-xs text-gray-400">{new Date(ci.checkedInAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
