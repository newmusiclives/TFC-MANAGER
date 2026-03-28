"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Music2,
  CheckSquare,
  Flag,
  Megaphone,
  CalendarDays,
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api-client";

type CalendarEvent = {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  type: "release" | "task" | "milestone" | "promo";
  description: string;
  time?: string;
};

const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Artwork Deadline",
    date: "2026-03-30",
    type: "task",
    description: "Final artwork files due for Golden Hour single cover",
    time: "5:00 PM",
  },
  {
    id: 2,
    title: "Press Outreach Begins",
    date: "2026-04-05",
    type: "promo",
    description: "Send press kits to bloggers and playlist curators",
    time: "10:00 AM",
  },
  {
    id: 3,
    title: "Mix & Master Review",
    date: "2026-04-08",
    type: "task",
    description: "Review final mix and master from the studio",
    time: "2:00 PM",
  },
  {
    id: 4,
    title: "Pre-save Campaign Live",
    date: "2026-04-10",
    type: "promo",
    description: "Launch pre-save links across all platforms",
    time: "9:00 AM",
  },
  {
    id: 5,
    title: "10K Followers Milestone",
    date: "2026-04-12",
    type: "milestone",
    description: "Projected to hit 10K Spotify followers",
  },
  {
    id: 6,
    title: "Music Video Shoot",
    date: "2026-04-15",
    type: "task",
    description: "On-location shoot for Golden Hour music video",
    time: "8:00 AM",
  },
  {
    id: 7,
    title: "Golden Hour Release",
    date: "2026-04-18",
    type: "release",
    description: "Official release of Golden Hour single on all platforms",
    time: "12:00 AM",
  },
  {
    id: 8,
    title: "Instagram Live Q&A",
    date: "2026-04-18",
    type: "promo",
    description: "Live session to celebrate release day with fans",
    time: "7:00 PM",
  },
  {
    id: 9,
    title: "First Week Streams Review",
    date: "2026-04-25",
    type: "milestone",
    description: "Analyze first-week streaming performance",
  },
  {
    id: 10,
    title: "Submit to Playlists",
    date: "2026-04-03",
    type: "task",
    description: "Submit Golden Hour to Spotify editorial playlists",
    time: "11:00 AM",
  },
];

const eventConfig: Record<
  CalendarEvent["type"],
  { color: string; bg: string; icon: React.ElementType; label: string }
> = {
  release: { color: "bg-[var(--primary)]", bg: "bg-green-50 text-green-700", icon: Music2, label: "Release" },
  task: { color: "bg-blue-500", bg: "bg-blue-50 text-blue-700", icon: CheckSquare, label: "Task" },
  milestone: { color: "bg-amber-500", bg: "bg-amber-50 text-amber-700", icon: Flag, label: "Milestone" },
  promo: { color: "bg-purple-500", bg: "bg-purple-50 text-purple-700", icon: Megaphone, label: "Promo" },
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);

  useEffect(() => {
    const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
    apiGet<CalendarEvent[]>(`/api/calendar?month=${monthStr}`)
      .then((d) => setEvents(d))
      .catch(() => {/* keep mock data */});
  }, [currentMonth, currentYear]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const formatDateKey = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

  const getEventsForDate = (dateStr: string) =>
    events.filter((e) => e.date === dateStr);

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Build calendar grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Release Calendar</h1>
            <p className="text-sm text-gray-500">
              Track releases, deadlines, and milestones
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="flex gap-6">
            {/* Calendar Grid */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6">
              {/* Month Nav */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <h2 className="text-lg font-bold">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-2">
                {dayNames.map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-semibold text-gray-400 py-2"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day Cells */}
              <div className="grid grid-cols-7">
                {cells.map((day, i) => {
                  if (day === null) {
                    return <div key={`empty-${i}`} className="h-24 border border-gray-50" />;
                  }
                  const dateKey = formatDateKey(day);
                  const events = getEventsForDate(dateKey);
                  const isToday = dateKey === todayKey;
                  const isSelected = dateKey === selectedDate;

                  return (
                    <button
                      key={dateKey}
                      onClick={() => setSelectedDate(dateKey)}
                      className={`h-24 border border-gray-100 p-1.5 text-left transition-colors hover:bg-gray-50 relative ${
                        isSelected ? "bg-green-50 ring-2 ring-[var(--primary)]" : ""
                      }`}
                    >
                      <span
                        className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          isToday
                            ? "bg-[var(--primary)] text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {day}
                      </span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {events.map((ev) => (
                          <span
                            key={ev.id}
                            className={`w-2 h-2 rounded-full ${eventConfig[ev.type].color}`}
                            title={ev.title}
                          />
                        ))}
                      </div>
                      {events.length > 0 && (
                        <div className="mt-0.5">
                          {events.slice(0, 2).map((ev) => (
                            <div
                              key={ev.id}
                              className={`text-xs font-medium truncate px-1 py-0.5 rounded ${eventConfig[ev.type].bg} mb-0.5`}
                            >
                              {ev.title}
                            </div>
                          ))}
                          {events.length > 2 && (
                            <div className="text-xs text-gray-400 px-1">
                              +{events.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-100">
                {Object.entries(eventConfig).map(([type, cfg]) => (
                  <div key={type} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${cfg.color}`} />
                    <span className="text-xs text-gray-600 font-medium">{cfg.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Side Panel */}
            <div className="w-80 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarDays size={18} className="text-[var(--primary)]" />
                  <h3 className="font-bold text-sm">
                    {selectedDate
                      ? new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })
                      : "Select a Date"}
                  </h3>
                </div>

                {!selectedDate && (
                  <p className="text-sm text-gray-400">
                    Click on a date in the calendar to see events.
                  </p>
                )}

                {selectedDate && selectedEvents.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CalendarDays size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">No events on this date</p>
                  </div>
                )}

                {selectedEvents.length > 0 && (
                  <div className="space-y-3">
                    {selectedEvents.map((ev) => {
                      const cfg = eventConfig[ev.type];
                      const Icon = cfg.icon;
                      return (
                        <div
                          key={ev.id}
                          className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}
                            >
                              <Icon size={14} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {ev.title}
                              </p>
                              <span
                                className={`text-xs font-bold uppercase tracking-wide ${cfg.bg} px-1.5 py-0.5 rounded-full inline-block mt-1`}
                              >
                                {cfg.label}
                              </span>
                              <p className="text-xs text-gray-500 mt-1.5">
                                {ev.description}
                              </p>
                              {ev.time && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {ev.time}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upcoming events summary */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
                    Upcoming
                  </h4>
                  <div className="space-y-2">
                    {events
                      .filter((e) => e.date >= todayKey)
                      .sort((a, b) => a.date.localeCompare(b.date))
                      .slice(0, 4)
                      .map((ev) => {
                        const cfg = eventConfig[ev.type];
                        return (
                          <button
                            key={ev.id}
                            onClick={() => setSelectedDate(ev.date)}
                            className="w-full flex items-center gap-2 text-left p-2 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <span className={`w-2 h-2 rounded-full ${cfg.color} shrink-0`} />
                            <span className="text-xs text-gray-700 font-medium truncate flex-1">
                              {ev.title}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(ev.date + "T12:00:00").toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
