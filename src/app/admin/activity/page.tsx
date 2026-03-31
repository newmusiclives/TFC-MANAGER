"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import {
  Bell,
  Search,
  Filter,
  UserPlus,
  ArrowUpRight,
  Music2,
  AlertTriangle,
  Settings,
  LogIn,
  CreditCard,
  Trash2,
  Shield,
  Download,
} from "lucide-react";

type ActivityEntry = {
  id: number;
  action: string;
  user: string;
  email: string;
  type: string;
  time: string;
  details: string;
};

const activityLog: ActivityEntry[] = [
  {
    id: 1,
    action: "New user signed up",
    user: "Maya Johnson",
    email: "maya@example.com",
    type: "signup",
    time: "2 min ago",
    details: "Starter plan, referred by Smart Link",
  },
  {
    id: 2,
    action: "Plan upgraded to Pro",
    user: "Alex Rivera",
    email: "alex@example.com",
    type: "upgrade",
    time: "15 min ago",
    details: "From Starter to Pro — monthly billing",
  },
  {
    id: 3,
    action: "New release published",
    user: "Jordan Lee",
    email: "jordan@example.com",
    type: "release",
    time: "32 min ago",
    details: '"Midnight Drive" — Single, distributed to all platforms',
  },
  {
    id: 4,
    action: "Account flagged for review",
    user: "Sam Patel",
    email: "sam@example.com",
    type: "flag",
    time: "1 hr ago",
    details: "Suspicious streaming activity detected by AI monitor",
  },
  {
    id: 5,
    action: "Admin login",
    user: "Admin",
    email: "admin@truefansmanager.com",
    type: "admin",
    time: "1 hr ago",
    details: "Login from 192.168.1.1 — Chrome / macOS",
  },
  {
    id: 6,
    action: "Payment received",
    user: "Casey Morgan",
    email: "casey@example.com",
    type: "payment",
    time: "2 hrs ago",
    details: "$29.99 — Pro plan monthly renewal",
  },
  {
    id: 7,
    action: "New user signed up",
    user: "Taylor Kim",
    email: "taylor@example.com",
    type: "signup",
    time: "3 hrs ago",
    details: "Starter plan, organic search",
  },
  {
    id: 8,
    action: "Settings updated",
    user: "Admin",
    email: "admin@truefansmanager.com",
    type: "settings",
    time: "4 hrs ago",
    details: "Email notifications toggled on",
  },
  {
    id: 9,
    action: "Account deleted",
    user: "Chris Thompson",
    email: "chris@example.com",
    type: "delete",
    time: "5 hrs ago",
    details: "User requested account deletion — data purged",
  },
  {
    id: 10,
    action: "New release published",
    user: "Maya Johnson",
    email: "maya@example.com",
    type: "release",
    time: "6 hrs ago",
    details: '"Neon Dreams EP" — EP, 5 tracks',
  },
  {
    id: 11,
    action: "Plan upgraded to Business",
    user: "Jordan Lee",
    email: "jordan@example.com",
    type: "upgrade",
    time: "8 hrs ago",
    details: "From Pro to Business — annual billing",
  },
  {
    id: 12,
    action: "Account flagged for review",
    user: "Pat Nguyen",
    email: "pat@example.com",
    type: "flag",
    time: "12 hrs ago",
    details: "Multiple failed login attempts",
  },
];

const typeIcon = (type: string) => {
  switch (type) {
    case "signup":
      return <UserPlus size={14} />;
    case "upgrade":
      return <ArrowUpRight size={14} />;
    case "release":
      return <Music2 size={14} />;
    case "flag":
      return <AlertTriangle size={14} />;
    case "admin":
      return <Shield size={14} />;
    case "payment":
      return <CreditCard size={14} />;
    case "settings":
      return <Settings size={14} />;
    case "delete":
      return <Trash2 size={14} />;
    default:
      return <LogIn size={14} />;
  }
};

const typeStyle = (type: string) => {
  switch (type) {
    case "signup":
      return "bg-green-50 text-green-600";
    case "upgrade":
      return "bg-blue-50 text-blue-600";
    case "release":
      return "bg-purple-50 text-purple-600";
    case "flag":
      return "bg-red-50 text-red-600";
    case "admin":
      return "bg-gray-100 text-gray-600";
    case "payment":
      return "bg-amber-50 text-amber-600";
    case "settings":
      return "bg-gray-100 text-gray-600";
    case "delete":
      return "bg-red-50 text-red-600";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

const typeBadge = (type: string) => {
  switch (type) {
    case "signup":
      return "bg-green-50 text-green-700";
    case "upgrade":
      return "bg-blue-50 text-blue-700";
    case "release":
      return "bg-purple-50 text-purple-700";
    case "flag":
      return "bg-red-50 text-red-700";
    case "admin":
      return "bg-gray-100 text-gray-700";
    case "payment":
      return "bg-amber-50 text-amber-700";
    case "settings":
      return "bg-gray-100 text-gray-700";
    case "delete":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function AdminActivity() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(() => setLoading(false))
      .catch(() => router.push("/admin/login"));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const filtered = activityLog.filter((a) => {
    const matchesSearch =
      !search ||
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.user.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Activity Log</h1>
            <p className="text-sm text-gray-500">
              {filtered.length} events recorded
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors">
              <Download size={16} /> Export
            </button>
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
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
                  placeholder="Search activity by action, user, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="all">All Types</option>
                  <option value="signup">Signups</option>
                  <option value="upgrade">Upgrades</option>
                  <option value="release">Releases</option>
                  <option value="payment">Payments</option>
                  <option value="flag">Flags</option>
                  <option value="admin">Admin</option>
                  <option value="settings">Settings</option>
                  <option value="delete">Deletions</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activity list */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No activity found.
                </div>
              ) : (
                filtered.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${typeStyle(
                        a.type
                      )}`}
                    >
                      {typeIcon(a.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{a.action}</span>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${typeBadge(
                            a.type
                          )}`}
                        >
                          {a.type}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {a.user} ({a.email}) — {a.details}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">
                      {a.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
