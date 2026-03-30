"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Mail,
  Plus,
  X,
  Check,
  Clock,
  Shield,
  Eye,
  DollarSign,
  Send,
  Settings,
  BarChart3,
  FileText,
  Activity,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string | null;
  joinedAt: string;
}

interface ActivityEntry {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Role colours
// ---------------------------------------------------------------------------

const roleBadgeColors: Record<string, string> = {
  Manager: "bg-blue-100 text-blue-700",
  "Label Rep": "bg-purple-100 text-purple-700",
  Accountant: "bg-amber-100 text-amber-700",
  "Social Media": "bg-pink-100 text-pink-700",
  Producer: "bg-emerald-100 text-emerald-700",
  Viewer: "bg-gray-100 text-gray-600",
};

const roleOptions = [
  "Manager",
  "Label Rep",
  "Accountant",
  "Social Media",
  "Producer",
  "Viewer",
];

// ---------------------------------------------------------------------------
// Permissions grid data
// ---------------------------------------------------------------------------

const permissionMatrix: Record<string, Record<string, boolean>> = {
  Manager:        { "View Analytics": true,  "Edit Releases": true,  "Manage Finances": true,  "Send Communications": true,  "Admin Settings": true },
  "Label Rep":    { "View Analytics": true,  "Edit Releases": true,  "Manage Finances": false, "Send Communications": true,  "Admin Settings": false },
  Accountant:     { "View Analytics": true,  "Edit Releases": false, "Manage Finances": true,  "Send Communications": false, "Admin Settings": false },
  "Social Media": { "View Analytics": true,  "Edit Releases": false, "Manage Finances": false, "Send Communications": true,  "Admin Settings": false },
  Producer:       { "View Analytics": true,  "Edit Releases": true,  "Manage Finances": false, "Send Communications": false, "Admin Settings": false },
  Viewer:         { "View Analytics": true,  "Edit Releases": false, "Manage Finances": false, "Send Communications": false, "Admin Settings": false },
};

const permissionLabels = [
  "View Analytics",
  "Edit Releases",
  "Manage Finances",
  "Send Communications",
  "Admin Settings",
];

const permissionIcons: Record<string, React.ElementType> = {
  "View Analytics": BarChart3,
  "Edit Releases": FileText,
  "Manage Finances": DollarSign,
  "Send Communications": Send,
  "Admin Settings": Settings,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.members ?? []);
        setActivity(data.activity ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleInvite = async () => {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    setInviting(true);
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: inviteName, email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json();
      if (data.member) {
        setMembers((prev) => [...prev, data.member]);
      }
    } catch {
      // non-critical
    }
    setInviting(false);
    setShowInviteModal(false);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("Viewer");
  };

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={24} /> Team
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage team members, roles, and permissions.
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Invite Member
        </button>
      </div>

      {/* ========== Team Members Table ========== */}
      <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase text-gray-400 border-b border-gray-100">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {m.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    {m.name}
                  </td>
                  <td className="px-6 py-3.5 text-gray-500">{m.email}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${roleBadgeColors[m.role] ?? "bg-gray-100 text-gray-600"}`}>
                      <Shield size={12} /> {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    {m.status === "Accepted" ? (
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold">
                        <Check size={14} /> Accepted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-yellow-600 text-xs font-semibold">
                        <Clock size={14} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-gray-400 text-xs">
                    {new Date(m.joinedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========== Activity Log ========== */}
      <section className="bg-white rounded-2xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity size={18} /> Activity Log
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {activity.map((a) => (
            <div key={a.id} className="px-6 py-3.5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0 mt-0.5">
                {a.user.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">{a.user}</span>{" "}
                  {a.action}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{timeAgo(a.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== Permissions Grid ========== */}
      <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Eye size={18} /> Permissions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase text-gray-400 border-b border-gray-100">
                <th className="px-6 py-3">Role</th>
                {permissionLabels.map((p) => {
                  const Icon = permissionIcons[p];
                  return (
                    <th key={p} className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Icon size={14} />
                        <span className="leading-tight">{p}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {roleOptions.map((role) => (
                <tr key={role} className="border-b border-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${roleBadgeColors[role]}`}>
                      {role}
                    </span>
                  </td>
                  {permissionLabels.map((perm) => (
                    <td key={perm} className="px-4 py-3 text-center">
                      {permissionMatrix[role]?.[perm] ? (
                        <Check size={16} className="text-green-500 mx-auto" />
                      ) : (
                        <X size={16} className="text-gray-300 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========== Invite Modal ========== */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Jamie Taylor"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="jamie@example.com"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] bg-white"
                >
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={inviting || !inviteName.trim() || !inviteEmail.trim()}
                className="px-5 py-2 text-sm font-semibold text-white bg-[var(--primary)] rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {inviting ? "Sending..." : "Send Invite"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
