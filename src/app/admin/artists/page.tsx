"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  Search,
  Bell,
  MoreVertical,
  Filter,
  MapPin,
  Play,
  Users,
  Music2,
} from "lucide-react";

type Artist = {
  id: string;
  name: string;
  genre: string;
  location: string;
  totalStreams: number;
  monthlyListeners: number;
  followers: number;
  releases: number;
  status: string;
  joinedAt: string;
  plan: string;
};

export default function AdminArtists() {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .catch(() => router.push("/admin/login"));
  }, [router]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "all") params.set("status", statusFilter);

    fetch(`/api/admin/artists?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setArtists(d.artists);
        setTotal(d.total);
        setLoading(false);
      });
  }, [search, statusFilter]);

  const statusColor = (s: string) => {
    switch (s) {
      case "verified":
        return "bg-green-50 text-green-700";
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      case "flagged":
        return "bg-red-50 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Artist Management</h1>
            <p className="text-sm text-gray-500">{total} artists total</p>
          </div>
          <button className="relative p-2 text-gray-500 hover:text-gray-700">
            <Bell size={20} />
          </button>
        </div>

        <div className="p-8">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search artists by name, genre, or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="flagged">Flagged</option>
                </select>
              </div>
            </div>
          </div>

          {/* Artist cards grid */}
          {loading ? (
            <div className="text-center py-16 text-gray-400">Loading...</div>
          ) : artists.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No artists found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {artists.map((a) => (
                <div
                  key={a.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Card header */}
                  <div className="h-20 bg-gradient-to-r from-red-500 to-orange-400 relative">
                    <div className="absolute top-3 right-3">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${statusColor(
                          a.status
                        )}`}
                      >
                        {a.status}
                      </span>
                    </div>
                  </div>

                  <div className="px-5 pb-5 -mt-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl border-4 border-white flex items-center justify-center mb-3">
                      <Music2 size={24} className="text-gray-400" />
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{a.name}</h3>
                        <p className="text-xs text-gray-500">{a.genre}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin size={12} /> {a.location}
                        </p>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                          <Play size={12} />
                        </div>
                        <div className="font-bold text-sm">
                          {a.totalStreams >= 1000
                            ? `${(a.totalStreams / 1000).toFixed(1)}K`
                            : a.totalStreams}
                        </div>
                        <div className="text-xs text-gray-400">Streams</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                          <Users size={12} />
                        </div>
                        <div className="font-bold text-sm">
                          {a.followers >= 1000
                            ? `${(a.followers / 1000).toFixed(1)}K`
                            : a.followers}
                        </div>
                        <div className="text-xs text-gray-400">
                          Followers
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                          <Music2 size={12} />
                        </div>
                        <div className="font-bold text-sm">{a.releases}</div>
                        <div className="text-xs text-gray-400">
                          Releases
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
