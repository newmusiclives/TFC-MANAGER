"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { Bell, DollarSign, Plus, FileText, Users, CheckCircle2, Clock, AlertCircle, Download, Music2, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/lib/api-client";

const COLORS = ["#00c878", "#7c3aed", "#ef4444", "#f59e0b", "#3b82f6"];

const splits = [
  {
    id: "sp1",
    track: "Midnight Dreams",
    status: "active" as const,
    totalRevenue: 487.20,
    pending: 0,
    collaborators: [
      { name: "Jordan Davis", role: "Artist / Songwriter", split: 50, earned: 243.60, paid: 243.60 },
      { name: "Alex Producer", role: "Producer", split: 25, earned: 121.80, paid: 100.00 },
      { name: "Sam Beats", role: "Beat Maker", split: 15, earned: 73.08, paid: 73.08 },
      { name: "Lisa Words", role: "Co-Writer", split: 10, earned: 48.72, paid: 48.72 },
    ],
    createdAt: "Dec 1, 2025",
  },
  {
    id: "sp2",
    track: "Golden Hour",
    status: "draft" as const,
    totalRevenue: 0,
    pending: 0,
    collaborators: [
      { name: "Jordan Davis", role: "Artist / Songwriter", split: 60, earned: 0, paid: 0 },
      { name: "Alex Producer", role: "Producer", split: 30, earned: 0, paid: 0 },
      { name: "Mia Keys", role: "Featured Artist", split: 10, earned: 0, paid: 0 },
    ],
    createdAt: "Mar 18, 2026",
  },
  {
    id: "sp3",
    track: "Electric Feel",
    status: "active" as const,
    totalRevenue: 312.45,
    pending: 45.20,
    collaborators: [
      { name: "Jordan Davis", role: "Artist / Songwriter", split: 70, earned: 218.72, paid: 187.00 },
      { name: "Beat Factory", role: "Producer", split: 30, earned: 93.73, paid: 80.25 },
    ],
    createdAt: "Sep 15, 2025",
  },
];

export default function RevenueSplitsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [expandedSplit, setExpandedSplit] = useState<string | null>("sp1");
  const [collaborators, setCollaborators] = useState([
    { name: "", role: "", split: 50 },
    { name: "", role: "", split: 50 },
  ]);
  const [splitsData, setSplitsData] = useState(splits);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ splits: typeof splits }>("/api/revenue-splits")
      .then((d) => {
        if (d.splits && d.splits.length > 0) setSplitsData(d.splits);
      })
      .catch(() => {/* keep mock data */})
      .finally(() => setLoading(false));
  }, []);

  const totalEarned = splitsData.reduce((a, s) => a + s.totalRevenue, 0);
  const totalPending = splitsData.reduce((a, s) => a + s.pending, 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Revenue Splits</h1>
            <p className="text-sm text-gray-500">Manage collaborator splits and track payments</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCreate(!showCreate)} className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors">
              <Plus size={16} /> New Split Sheet
            </button>
            <button className="relative p-2 text-gray-500 hover:text-gray-700"><Bell size={20} /></button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center"><DollarSign size={18} className="text-green-600" /></div>
                <span className="text-sm text-gray-500">Total Revenue</span>
              </div>
              <div className="text-2xl font-bold">${totalEarned.toFixed(2)}</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center"><Clock size={18} className="text-amber-600" /></div>
                <span className="text-sm text-gray-500">Pending Payments</span>
              </div>
              <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center"><FileText size={18} className="text-blue-600" /></div>
                <span className="text-sm text-gray-500">Active Splits</span>
              </div>
              <div className="text-2xl font-bold">{splitsData.length}</div>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full" />
            </div>
          )}

          {showCreate && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h2 className="font-bold text-lg mb-4">Create Split Sheet</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5">Track</label>
                <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20">
                  <option>Golden Hour</option>
                  <option>New Track</option>
                </select>
              </div>
              <h3 className="font-semibold text-sm mb-3">Collaborators</h3>
              <div className="space-y-3 mb-4">
                {collaborators.map((c, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Name</label>
                      <input type="text" placeholder="Name" value={c.name} onChange={(e) => { const n = [...collaborators]; n[idx].name = e.target.value; setCollaborators(n); }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Role</label>
                      <input type="text" placeholder="Role" value={c.role} onChange={(e) => { const n = [...collaborators]; n[idx].role = e.target.value; setCollaborators(n); }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Split %</label>
                      <input type="number" value={c.split} onChange={(e) => { const n = [...collaborators]; n[idx].split = Number(e.target.value); setCollaborators(n); }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20" />
                    </div>
                    <button onClick={() => setCollaborators(collaborators.filter((_, i) => i !== idx))} className="text-xs text-red-500 hover:underline py-2">Remove</button>
                  </div>
                ))}
              </div>
              <div className={`text-xs mb-4 px-3 py-2 rounded-lg ${collaborators.reduce((a, c) => a + c.split, 0) === 100 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                Total: {collaborators.reduce((a, c) => a + c.split, 0)}% {collaborators.reduce((a, c) => a + c.split, 0) !== 100 && "— Must equal 100%"}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setCollaborators([...collaborators, { name: "", role: "", split: 0 }])} className="text-sm text-[var(--primary)] font-medium">+ Add collaborator</button>
                <div className="flex-1" />
                <button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors">Create Split Sheet</button>
                <button onClick={() => setShowCreate(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-5 py-2.5 rounded-lg transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {/* Splits */}
          <div className="space-y-4">
            {splitsData.map((split) => (
              <div key={split.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors" onClick={() => setExpandedSplit(expandedSplit === split.id ? null : split.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center"><Music2 size={22} className="text-gray-400" /></div>
                      <div>
                        <h3 className="font-bold">{split.track}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${split.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{split.status}</span>
                          <span>{split.collaborators.length} collaborators</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">${split.totalRevenue.toFixed(2)}</div>
                      {split.pending > 0 && <div className="text-xs text-amber-600">${split.pending.toFixed(2)} pending</div>}
                    </div>
                  </div>
                </div>

                {expandedSplit === split.id && (
                  <div className="border-t border-gray-100 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold text-sm mb-3">Split Distribution</h4>
                        <ResponsiveContainer width="100%" height={180}>
                          <PieChart>
                            <Pie data={split.collaborators.map((c) => ({ name: c.name, value: c.split }))} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                              {split.collaborators.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} stroke="none" />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb" }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="lg:col-span-2">
                        <h4 className="font-semibold text-sm mb-3">Collaborators</h4>
                        <div className="space-y-2">
                          {split.collaborators.map((c, idx) => (
                            <div key={c.name} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">{c.name}</div>
                                <div className="text-xs text-gray-500">{c.role}</div>
                              </div>
                              <div className="text-sm font-bold">{c.split}%</div>
                              <div className="text-right">
                                <div className="text-sm font-medium">${c.earned.toFixed(2)}</div>
                                {c.earned > c.paid && <div className="text-xs text-amber-600">${(c.earned - c.paid).toFixed(2)} owed</div>}
                                {c.earned <= c.paid && c.earned > 0 && <div className="text-xs text-green-600 flex items-center gap-0.5"><CheckCircle2 size={8} /> Paid</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button className="inline-flex items-center gap-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"><Download size={14} /> Export PDF</button>
                      <button className="inline-flex items-center gap-1.5 text-sm bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] px-4 py-2 rounded-lg font-medium transition-colors"><DollarSign size={14} /> Process Payments</button>
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
