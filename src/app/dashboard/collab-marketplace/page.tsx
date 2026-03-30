"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Users,
  Star,
  Briefcase,
  Search,
  DollarSign,
  UserPlus,
  Calendar,
  Loader2,
  Plus,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { apiGet } from "@/lib/api-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Profile = {
  id: string;
  name: string;
  role: string;
  skills: string[];
  genres: string[];
  rate: number;
  rating: number;
  reviews: number;
  availability: string;
  avatar: string | null;
  bio: string;
  portfolio: string[];
};

type Booking = {
  id: string;
  collaboratorName: string;
  role: string;
  project: string;
  status: string;
  startDate: string;
  endDate: string;
  rate: number;
  totalCost: number;
  asClient: boolean;
};

type Tab = "browse" | "profile" | "bookings";

const AVAIL_COLORS: Record<string, { text: string; bg: string }> = {
  Available: { text: "text-green-600", bg: "bg-green-50" },
  Limited: { text: "text-yellow-600", bg: "bg-yellow-50" },
  Busy: { text: "text-red-500", bg: "bg-red-50" },
};

const BOOKING_STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  Inquiry: { text: "text-gray-600", bg: "bg-gray-100" },
  Pending: { text: "text-gray-600", bg: "bg-gray-100" },
  Accepted: { text: "text-blue-600", bg: "bg-blue-50" },
  "In Progress": { text: "text-yellow-600", bg: "bg-yellow-50" },
  Completed: { text: "text-green-600", bg: "bg-green-50" },
  Cancelled: { text: "text-red-500", bg: "bg-red-50" },
};

const ROLES = ["Producer", "Vocalist", "Mixing Engineer", "Guitarist", "Videographer", "Songwriter", "Drummer", "Bassist", "DJ", "Photographer"];
const SKILLS = ["Beat Making", "Mixing", "Mastering", "Lead Vocals", "Harmonies", "Songwriting", "Sound Design", "Session Work", "Music Videos", "Live Recording", "Editing", "Toplining", "Lyrics", "Melody"];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CollabMarketplacePage() {
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [loading, setLoading] = useState(true);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Profile form
  const [formRole, setFormRole] = useState("");
  const [formSkills, setFormSkills] = useState<string[]>([]);
  const [formRate, setFormRate] = useState("");
  const [formProjectRate, setFormProjectRate] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formAvailability, setFormAvailability] = useState("Available");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, bookingData] = await Promise.all([
        apiGet<{ profiles: Profile[] }>("/api/collab-marketplace"),
        apiGet<{ bookings: Booking[] }>("/api/collab-marketplace/bookings"),
      ]);
      setProfiles(profileData.profiles);
      setBookings(bookingData.bookings);
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProfiles = profiles.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.skills.some((s) => s.toLowerCase().includes(q)) || p.genres.some((g) => g.toLowerCase().includes(q));
  });

  const toggleSkill = (skill: string) => {
    setFormSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} size={14} className={i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
    ));
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "browse", label: "Browse Talent", icon: Users },
    { key: "profile", label: "My Profile", icon: UserPlus },
    { key: "bookings", label: "Bookings", icon: Briefcase },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Collab Marketplace</h1>
            <p className="text-sm text-gray-500">Find collaborators, get hired, manage bookings</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Available Talent", value: profiles.filter((p) => p.availability === "Available").length.toString(), icon: Users, color: "bg-blue-50 text-blue-600" },
              { label: "Active Bookings", value: bookings.filter((b) => b.status === "In Progress").length.toString(), icon: Briefcase, color: "bg-green-50 text-green-600" },
              { label: "Completed", value: bookings.filter((b) => b.status === "Completed").length.toString(), icon: Star, color: "bg-purple-50 text-purple-600" },
              { label: "Total Spent", value: `$${bookings.filter((b) => b.asClient).reduce((s, b) => s + b.totalCost, 0).toLocaleString()}`, icon: DollarSign, color: "bg-amber-50 text-amber-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><s.icon size={18} /></div>
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
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
              {/* Browse Talent */}
              {activeTab === "browse" && (
                <div>
                  <div className="mb-4">
                    <div className="relative max-w-md">
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, role, skill, or genre..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProfiles.map((profile) => {
                      const ac = AVAIL_COLORS[profile.availability] || { text: "text-gray-600", bg: "bg-gray-50" };
                      return (
                        <div key={profile.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
                              {profile.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold">{profile.name}</h3>
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{profile.role}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ac.bg} ${ac.text}`}>{profile.availability}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {profile.skills.map((s) => (
                              <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{s}</span>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {profile.genres.map((g) => (
                              <span key={g} className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">{g}</span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mb-3 flex-1 line-clamp-2">{profile.bio}</p>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1">
                              {renderStars(profile.rating)}
                              <span className="text-xs text-gray-500 ml-1">({profile.reviews})</span>
                            </div>
                            <span className="text-sm font-bold">${profile.rate}/hr</span>
                          </div>
                          <button className="w-full bg-purple-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">Book</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* My Profile */}
              {activeTab === "profile" && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-2xl">
                  <h2 className="text-lg font-bold mb-4">Create Your Collaborator Profile</h2>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select value={formRole} onChange={(e) => setFormRole(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400">
                        <option value="">Select role</option>
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {SKILLS.map((skill) => (
                          <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                              formSkills.includes(skill) ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                            }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                        <input type="number" value={formRate} onChange={(e) => setFormRate(e.target.value)} placeholder="100" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Rate ($)</label>
                        <input type="number" value={formProjectRate} onChange={(e) => setFormProjectRate(e.target.value)} placeholder="500" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea value={formBio} onChange={(e) => setFormBio(e.target.value)} placeholder="Tell potential collaborators about yourself..." rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 resize-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                      <select value={formAvailability} onChange={(e) => setFormAvailability(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400">
                        <option value="Available">Available</option>
                        <option value="Limited">Limited</option>
                        <option value="Busy">Busy</option>
                      </select>
                    </div>
                    <button className="bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">Save Profile</button>
                  </div>
                </div>
              )}

              {/* Bookings */}
              {activeTab === "bookings" && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                          <th className="text-left p-4 font-medium text-gray-600">Project</th>
                          <th className="text-left p-4 font-medium text-gray-600">Collaborator</th>
                          <th className="text-left p-4 font-medium text-gray-600">Role</th>
                          <th className="text-right p-4 font-medium text-gray-600">Budget</th>
                          <th className="text-left p-4 font-medium text-gray-600">Status</th>
                          <th className="text-left p-4 font-medium text-gray-600">Dates</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => {
                          const sc = BOOKING_STATUS_COLORS[b.status] || { text: "text-gray-600", bg: "bg-gray-100" };
                          return (
                            <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                              <td className="p-4 font-medium">{b.project}</td>
                              <td className="p-4 text-gray-600">{b.collaboratorName}</td>
                              <td className="p-4 text-gray-600">{b.role}</td>
                              <td className="p-4 text-right font-medium">${b.totalCost.toLocaleString()}</td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>{b.status}</span>
                              </td>
                              <td className="p-4 text-gray-500 text-xs">{b.startDate} — {b.endDate}</td>
                            </tr>
                          );
                        })}
                        {bookings.length === 0 && (
                          <tr><td colSpan={6} className="p-8 text-center text-gray-400">No bookings yet</td></tr>
                        )}
                      </tbody>
                    </table>
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
