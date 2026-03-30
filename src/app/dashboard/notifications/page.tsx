"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Music2,
  BarChart3,
  CheckSquare,
  Settings,
  TrendingUp,
  Users,
  ListMusic,
  Sparkles,
  AlertCircle,
  CheckCheck,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiGet, apiPatch } from "@/lib/api-client";
import { requestNotificationPermission } from "@/lib/push-notifications";

type NotificationCategory = "all" | "releases" | "analytics" | "tasks" | "system";

type Notification = {
  id: number;
  title: string;
  description: string;
  time: string;
  category: Exclude<NotificationCategory, "all">;
  read: boolean;
  icon: React.ElementType;
  iconColor: string;
};

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Streams Milestone Reached",
    description: 'Your track "Midnight Dreams" just crossed 25,000 streams on Spotify. Keep the momentum going!',
    time: "2 hours ago",
    category: "analytics",
    read: false,
    icon: TrendingUp,
    iconColor: "bg-green-50 text-green-600",
  },
  {
    id: 2,
    title: "Added to New Playlist",
    description: '"Summer Waves" was added to "Indie Chill Vibes" playlist (12.4K followers) on Spotify.',
    time: "5 hours ago",
    category: "releases",
    read: false,
    icon: ListMusic,
    iconColor: "bg-blue-50 text-blue-600",
  },
  {
    id: 3,
    title: "Task Reminder: Artwork Deadline",
    description: "Final artwork for Golden Hour single is due in 2 days. Upload files before March 30.",
    time: "8 hours ago",
    category: "tasks",
    read: false,
    icon: CheckSquare,
    iconColor: "bg-amber-50 text-amber-600",
  },
  {
    id: 4,
    title: "New Follower Milestone",
    description: "You just reached 5,000 followers on Spotify! You are in the top 15% of indie artists.",
    time: "1 day ago",
    category: "analytics",
    read: false,
    icon: Users,
    iconColor: "bg-purple-50 text-purple-600",
  },
  {
    id: 5,
    title: "Release Plan Generated",
    description: "Your AI-powered release plan for Golden Hour is ready. Review the 6-week rollout strategy.",
    time: "1 day ago",
    category: "releases",
    read: true,
    icon: Sparkles,
    iconColor: "bg-indigo-50 text-indigo-600",
  },
  {
    id: 6,
    title: "Weekly Analytics Report",
    description: "Your weekly report is ready. Total streams up 12.3% with 2,950 average daily streams.",
    time: "2 days ago",
    category: "analytics",
    read: true,
    icon: BarChart3,
    iconColor: "bg-cyan-50 text-cyan-600",
  },
  {
    id: 7,
    title: "Task Completed: Mix Review",
    description: 'You marked "Review final mix for Golden Hour" as complete. Nice work!',
    time: "2 days ago",
    category: "tasks",
    read: true,
    icon: CheckSquare,
    iconColor: "bg-green-50 text-green-600",
  },
  {
    id: 8,
    title: "System Update: New Feature",
    description: "Release Simulator is now available. Test different release strategies before committing.",
    time: "3 days ago",
    category: "system",
    read: true,
    icon: AlertCircle,
    iconColor: "bg-gray-100 text-gray-600",
  },
  {
    id: 9,
    title: "New Track Detection",
    description: '"Electric Feel" has been detected on 3 new user-generated playlists this week.',
    time: "4 days ago",
    category: "releases",
    read: true,
    icon: Music2,
    iconColor: "bg-pink-50 text-pink-600",
  },
  {
    id: 10,
    title: "Subscription Renewal",
    description: "Your TrueFans MANAGER Pro plan renews April 15 for $30/month. Link your TrueFans CONNECT account to get Pro free!",
    time: "5 days ago",
    category: "system",
    read: true,
    icon: Settings,
    iconColor: "bg-gray-100 text-gray-600",
  },
];

const categoryTabs: { key: NotificationCategory; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All", icon: Bell },
  { key: "releases", label: "Releases", icon: Music2 },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "tasks", label: "Tasks", icon: CheckSquare },
  { key: "system", label: "System", icon: Settings },
];

// Map icon names from API to components for hydration
const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  ListMusic,
  CheckSquare,
  Users,
  Sparkles,
  BarChart3,
  AlertCircle,
  Music2,
  Settings,
  Bell,
};

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [pushStatus, setPushStatus] = useState<"default" | "granted" | "denied" | "unsupported">("default");

  // Check current permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPushStatus(Notification.permission as "default" | "granted" | "denied");
    } else {
      setPushStatus("unsupported");
    }
  }, []);

  // Load notifications from API on mount
  useEffect(() => {
    apiGet<{
      notifications?: {
        id: number;
        title: string;
        description: string;
        time: string;
        category: Exclude<NotificationCategory, "all">;
        read: boolean;
        iconName?: string;
        iconColor?: string;
      }[];
    }>("/api/notifications")
      .then((data) => {
        if (data.notifications && data.notifications.length > 0) {
          setNotifications(
            data.notifications.map((n) => ({
              ...n,
              icon: iconMap[n.iconName || "Bell"] || Bell,
              iconColor: n.iconColor || "bg-gray-100 text-gray-600",
            }))
          );
        }
      })
      .catch(() => {
        // API not available, use mock data (initialNotifications already set)
      });
  }, []);

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.category === activeTab);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    // Persist to API
    apiPatch("/api/notifications", { markAllRead: true }).catch(() => {
      // API not available - local state already updated
    });
  };

  const toggleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
    // Persist to API
    apiPatch("/api/notifications", { ids: [id] }).catch(() => {
      // API not available - local state already updated
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-gray-500">
              Stay updated on your releases, stats, and tasks
            </p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:text-green-700 transition-colors"
              >
                <CheckCheck size={16} />
                Mark all as read
              </button>
            )}
            <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600">
              <Bell size={14} />
              {unreadCount} unread
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Push Notification Banner */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">Push Notifications</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {pushStatus === "granted"
                  ? "Push notifications are enabled. You will receive alerts in real time."
                  : pushStatus === "denied"
                  ? "Push notifications are blocked. Enable them in your browser settings."
                  : pushStatus === "unsupported"
                  ? "Your browser does not support push notifications."
                  : "Enable push notifications to get real-time alerts about your releases and stats."}
              </p>
            </div>
            <button
              disabled={pushStatus === "granted" || pushStatus === "unsupported"}
              onClick={async () => {
                const granted = await requestNotificationPermission();
                setPushStatus(granted ? "granted" : "denied");
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pushStatus === "granted"
                  ? "bg-green-50 text-green-700 cursor-default"
                  : pushStatus === "denied" || pushStatus === "unsupported"
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              <Bell size={15} />
              {pushStatus === "granted" ? "Enabled" : pushStatus === "denied" ? "Blocked" : "Enable Push Notifications"}
            </button>
          </div>

          {/* Category Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 p-1.5 flex gap-1 mb-6 w-fit">
            {categoryTabs.map((tab) => {
              const count =
                tab.key === "all"
                  ? notifications.length
                  : notifications.filter((n) => n.category === tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? "bg-[var(--primary)] text-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon size={15} />
                  {tab.label}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell size={24} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  No notifications in this category
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filtered.map((n) => {
                  const Icon = n.icon;
                  return (
                    <button
                      key={n.id}
                      onClick={() => toggleRead(n.id)}
                      className={`w-full flex items-start gap-4 p-5 text-left transition-colors hover:bg-gray-50 ${
                        !n.read ? "bg-green-50/30" : ""
                      }`}
                    >
                      {/* Unread dot */}
                      <div className="pt-1.5 w-2 shrink-0">
                        {!n.read && (
                          <span className="block w-2 h-2 rounded-full bg-[var(--primary)]" />
                        )}
                      </div>

                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.iconColor}`}
                      >
                        <Icon size={18} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            !n.read ? "font-semibold text-gray-900" : "font-medium text-gray-700"
                          }`}
                        >
                          {n.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                          {n.description}
                        </p>
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0 pt-0.5">
                        <Clock size={12} />
                        {n.time}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
