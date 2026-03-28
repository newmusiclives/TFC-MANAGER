"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Bell, Save, Shield } from "lucide-react";

export default function AdminSettings() {
  const router = useRouter();
  const [admin, setAdmin] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => setAdmin(d.admin))
      .catch(() => router.push("/admin/login"));
  }, [router]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!admin) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-gray-500">
              Manage your admin account and platform settings
            </p>
          </div>
          <button className="relative p-2 text-gray-500 hover:text-gray-700">
            <Bell size={20} />
          </button>
        </div>

        <div className="p-8 max-w-3xl">
          {/* Profile */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Shield size={20} className="text-red-600" /> Admin Profile
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue={admin.name}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={admin.email}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Role
                </label>
                <input
                  type="text"
                  value={admin.role.replace("_", " ")}
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 capitalize"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
                >
                  <Save size={16} />
                  {saved ? "Saved!" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Platform settings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="font-bold text-lg mb-6">Platform Settings</h2>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">
                    Allow new registrations
                  </div>
                  <div className="text-xs text-gray-500">
                    Enable or disable new user sign-ups
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-red-600 transition-colors"
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    const isOn = btn.getAttribute("data-on") !== "false";
                    btn.setAttribute("data-on", isOn ? "false" : "true");
                    btn.className = `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOn ? "bg-gray-300" : "bg-red-600"}`;
                    const knob = btn.firstElementChild as HTMLElement;
                    knob.className = `inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${isOn ? "translate-x-1" : "translate-x-6"}`;
                  }}
                >
                  <span className="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform translate-x-6" />
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                <div>
                  <div className="font-medium text-sm">
                    Email notifications
                  </div>
                  <div className="text-xs text-gray-500">
                    Receive alerts for new sign-ups and flagged accounts
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-red-600 transition-colors"
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    const isOn = btn.getAttribute("data-on") !== "false";
                    btn.setAttribute("data-on", isOn ? "false" : "true");
                    btn.className = `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOn ? "bg-gray-300" : "bg-red-600"}`;
                    const knob = btn.firstElementChild as HTMLElement;
                    knob.className = `inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${isOn ? "translate-x-1" : "translate-x-6"}`;
                  }}
                >
                  <span className="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform translate-x-6" />
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                <div>
                  <div className="font-medium text-sm">Maintenance mode</div>
                  <div className="text-xs text-gray-500">
                    Temporarily disable the platform for maintenance
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors"
                  onClick={(e) => {
                    const btn = e.currentTarget;
                    const isOn = btn.getAttribute("data-on") === "true";
                    btn.setAttribute("data-on", isOn ? "false" : "true");
                    btn.className = `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isOn ? "bg-gray-300" : "bg-red-600"}`;
                    const knob = btn.firstElementChild as HTMLElement;
                    knob.className = `inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${isOn ? "translate-x-1" : "translate-x-6"}`;
                  }}
                >
                  <span className="inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white rounded-2xl border border-red-200 p-6">
            <h2 className="font-bold text-lg text-red-600 mb-4">
              Danger Zone
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">
                  Reset all user data
                </div>
                <div className="text-xs text-gray-500">
                  This action cannot be undone. All user data will be permanently
                  deleted.
                </div>
              </div>
              <button className="text-sm border border-red-300 text-red-600 hover:bg-red-50 font-medium px-4 py-2 rounded-lg transition-colors">
                Reset Data
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
