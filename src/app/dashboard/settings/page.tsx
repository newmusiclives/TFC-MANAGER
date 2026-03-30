"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  User,
  Link2,
  CreditCard,
  BellRing,
  AlertTriangle,
  Camera,
  Check,
  ExternalLink,
  ChevronRight,
  Music2,
  MonitorSpeaker,
  Headphones,
  Shield,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiGet, apiPatch } from "@/lib/api-client";

type ConnectedAccount = {
  name: string;
  icon: React.ElementType;
  color: string;
  connected: boolean;
  username?: string;
};

const defaultProfile = {
  name: "Jordan Rivera",
  email: "jordan@truefans.io",
  artistName: "JRVR",
};

const defaultAccounts: ConnectedAccount[] = [
  { name: "Spotify", icon: Music2, color: "bg-green-50 text-green-600", connected: true, username: "jrvr_official" },
  { name: "Apple Music", icon: Headphones, color: "bg-pink-50 text-pink-600", connected: true, username: "jordanrivera" },
  { name: "YouTube", icon: MonitorSpeaker, color: "bg-red-50 text-red-600", connected: false },
];

const defaultNotifPrefs = {
  emailStreams: true,
  emailPlaylists: true,
  emailTasks: false,
  pushReleases: true,
  pushMilestones: true,
  pushWeekly: true,
};

const platformAuthUrls: Record<string, string> = {
  "Spotify": "/api/auth/spotify",
  "Apple Music": "/api/auth/apple-music",
  "YouTube": "/api/auth/youtube",
};

export default function SettingsPage() {
  const [profile, setProfile] = useState(defaultProfile);

  const [accounts, setAccounts] = useState<ConnectedAccount[]>(defaultAccounts);

  const [notifPrefs, setNotifPrefs] = useState(defaultNotifPrefs);

  const [saved, setSaved] = useState(false);

  // Load profile data from API on mount
  useEffect(() => {
    apiGet<{
      name?: string;
      email?: string;
      artistName?: string;
      connectedAccounts?: { name: string; connected: boolean; username?: string }[];
      notificationPreferences?: typeof defaultNotifPrefs;
    }>("/api/users/me")
      .then((data) => {
        if (data.name || data.email || data.artistName) {
          setProfile({
            name: data.name || defaultProfile.name,
            email: data.email || defaultProfile.email,
            artistName: data.artistName || defaultProfile.artistName,
          });
        }
        if (data.connectedAccounts) {
          setAccounts((prev) =>
            prev.map((a) => {
              const match = data.connectedAccounts!.find((ca) => ca.name === a.name);
              return match ? { ...a, connected: match.connected, username: match.username } : a;
            })
          );
        }
        if (data.notificationPreferences) {
          setNotifPrefs(data.notificationPreferences);
        }
      })
      .catch(() => {
        // API not available, use hardcoded defaults
      });
  }, []);

  const handleSave = async () => {
    try {
      await apiPatch("/api/users/me", {
        ...profile,
        notificationPreferences: notifPrefs,
      });
    } catch {
      // API not available - show saved anyway for demo
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleAccount = (index: number) => {
    const account = accounts[index];
    if (!account.connected) {
      // Redirect to OAuth flow for connecting
      const authUrl = platformAuthUrls[account.name];
      if (authUrl) {
        window.location.href = authUrl;
        return;
      }
    }
    // Disconnect - call API then update state
    (async () => {
      try {
        await apiPatch("/api/users/me", {
          disconnectAccount: account.name,
        });
      } catch {
        // API not available - toggle locally for demo
      }
      setAccounts((prev) =>
        prev.map((a, i) =>
          i === index ? { ...a, connected: !a.connected, username: a.connected ? undefined : "connected_user" } : a
        )
      );
    })();
  };

  const toggleNotif = (key: keyof typeof notifPrefs) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(updated);
    // Persist notification preferences
    apiPatch("/api/users/me", { notificationPreferences: updated }).catch(() => {
      // API not available - local state already updated for demo
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-gray-500">
              Manage your account and preferences
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8 max-w-3xl">
          {/* Profile Section */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <User size={18} className="text-[var(--primary)]" />
              <h2 className="text-base font-bold">Profile</h2>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-emerald-400 flex items-center justify-center text-white text-2xl font-bold">
                  JR
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Camera size={13} className="text-gray-600" />
                </button>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{profile.name}</p>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    value={profile.artistName}
                    onChange={(e) => setProfile({ ...profile, artistName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-[var(--primary)] hover:bg-green-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
              >
                {saved ? <Check size={16} /> : null}
                {saved ? "Saved!" : "Save Changes"}
              </button>
            </div>
          </section>

          {/* Connected Accounts */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Link2 size={18} className="text-[var(--primary)]" />
              <h2 className="text-base font-bold">Connected Accounts</h2>
            </div>

            <div className="space-y-3">
              {accounts.map((account, i) => {
                const Icon = account.icon;
                return (
                  <div
                    key={account.name}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${account.color}`}
                      >
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {account.name}
                        </p>
                        {account.connected && account.username ? (
                          <p className="text-xs text-gray-500">
                            @{account.username}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400">Not connected</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleAccount(i)}
                      className={`text-xs font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                        account.connected
                          ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                          : "bg-[var(--primary)] text-white hover:bg-green-600"
                      }`}
                    >
                      {account.connected ? (
                        <>Disconnect</>
                      ) : (
                        <>
                          <ExternalLink size={12} />
                          Connect
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Subscription & Billing */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard size={18} className="text-[var(--primary)]" />
              <h2 className="text-base font-bold">Subscription & Billing</h2>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">TrueFans MANAGER Pro</span>
                    <span className="text-xs font-bold bg-[var(--primary)] text-white px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    $30/month &middot; Renews April 15, 2026
                  </p>
                </div>
                <button className="text-xs font-medium text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 bg-white transition-colors">
                  Manage Billing
                </button>
              </div>
            </div>

            {/* TrueFans CONNECT Integration */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">TrueFans CONNECT</span>
                    <span className="text-xs font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                      NOT LINKED
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Link your active TrueFans CONNECT account to get <strong>Pro for free</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Artists with an active TrueFans CONNECT subscription at truefansconnect.com get TrueFans MANAGER Pro at no extra charge.
                  </p>
                </div>
                <a
                  href="https://truefansconnect.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg transition-colors shrink-0"
                >
                  Link Account
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Upgrade to Business</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Collaborate with your manager, label, and producer
                  </p>
                </div>
                <button className="flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:text-green-700 transition-colors">
                  Learn more
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </section>

          {/* Notification Preferences */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-6">
              <BellRing size={18} className="text-[var(--primary)]" />
              <h2 className="text-base font-bold">Notification Preferences</h2>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                Email Notifications
              </h3>
              {([
                { key: "emailStreams" as const, label: "Streaming milestones", desc: "When your tracks hit key stream counts" },
                { key: "emailPlaylists" as const, label: "Playlist additions", desc: "When tracks are added to playlists" },
                { key: "emailTasks" as const, label: "Task reminders", desc: "Upcoming deadlines and overdue tasks" },
              ]).map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotif(item.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifPrefs[item.key] ? "bg-[var(--primary)]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        notifPrefs[item.key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}

              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 mt-6 pt-4">
                Push Notifications
              </h3>
              {([
                { key: "pushReleases" as const, label: "Release updates", desc: "Status changes for your scheduled releases" },
                { key: "pushMilestones" as const, label: "Milestone alerts", desc: "Follower and stream milestone achievements" },
                { key: "pushWeekly" as const, label: "Weekly digest", desc: "Summary of your weekly performance" },
              ]).map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotif(item.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifPrefs[item.key] ? "bg-[var(--primary)]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        notifPrefs[item.key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-white rounded-2xl border border-red-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-red-500" />
              <h2 className="text-base font-bold text-red-600">Danger Zone</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/30">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Export Your Data</p>
                  <p className="text-xs text-gray-500">
                    Download all your data including analytics, release plans, and content
                  </p>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-200 bg-white transition-colors">
                  <Shield size={13} />
                  Export
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50/30">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Delete Account</p>
                  <p className="text-xs text-gray-500">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <button className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-100 px-4 py-2 rounded-lg border border-red-200 bg-white transition-colors">
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
