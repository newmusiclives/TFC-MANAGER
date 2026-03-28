"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Plus,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  Ticket,
  ChevronDown,
  ChevronUp,
  GripVertical,
  ShoppingBag,
  Phone,
  StickyNote,
  BarChart3,
  Sparkles,
  Music2,
  CheckCircle2,
  Circle,
  TrendingUp,
  Map,
} from "lucide-react";
import { useState } from "react";

type Show = {
  id: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  capacity: number;
  ticketsSold: number;
  revenue: number;
  status: "On Sale" | "Announced" | "Sold Out" | "Completed";
  setlist: string[];
  merch: { item: string; units: number }[];
  venueContact: { name: string; phone: string; email: string };
  notes: string;
};

const upcomingShows: Show[] = [
  {
    id: "1",
    venue: "The Echo",
    city: "Los Angeles",
    date: "Apr 12, 2026",
    time: "8:00 PM",
    capacity: 350,
    ticketsSold: 280,
    revenue: 2800,
    status: "On Sale",
    setlist: [
      "Midnight Dreams",
      "Golden Hour",
      "Electric Feel",
      "Summer Waves",
      "First Light",
      "Neon Lights",
    ],
    merch: [
      { item: "T-shirts", units: 50 },
      { item: "Vinyl", units: 20 },
      { item: "Posters", units: 100 },
    ],
    venueContact: {
      name: "Sarah Chen",
      phone: "(213) 555-0142",
      email: "bookings@theecho.la",
    },
    notes: "Load-in at 4PM. Sound check 5:30PM. Green room available.",
  },
  {
    id: "2",
    venue: "Le Petit Bain",
    city: "Paris",
    date: "May 3, 2026",
    time: "9:00 PM",
    capacity: 200,
    ticketsSold: 45,
    revenue: 675,
    status: "On Sale",
    setlist: [
      "Electric Feel",
      "Midnight Dreams",
      "Summer Waves",
      "Golden Hour",
      "First Light",
    ],
    merch: [
      { item: "T-shirts", units: 30 },
      { item: "Vinyl", units: 10 },
      { item: "Posters", units: 50 },
    ],
    venueContact: {
      name: "Marc Dupont",
      phone: "+33 1 42 00 1234",
      email: "contact@lepetitbain.org",
    },
    notes: "EU power adapters needed. Merch table near entrance.",
  },
  {
    id: "3",
    venue: "The Lexington",
    city: "London",
    date: "May 18, 2026",
    time: "8:30 PM",
    capacity: 150,
    ticketsSold: 0,
    revenue: 0,
    status: "Announced",
    setlist: [
      "Golden Hour",
      "Midnight Dreams",
      "Electric Feel",
      "Neon Lights",
      "Summer Waves",
    ],
    merch: [
      { item: "T-shirts", units: 25 },
      { item: "Vinyl", units: 10 },
      { item: "Posters", units: 40 },
    ],
    venueContact: {
      name: "James Wright",
      phone: "+44 20 7837 5371",
      email: "events@thelexington.co.uk",
    },
    notes: "Tickets go on sale Apr 1. Capacity is strict — no overselling.",
  },
];

const pastShows = [
  {
    date: "Mar 8, 2026",
    venue: "Baby's All Right",
    city: "Brooklyn, NY",
    attendance: 220,
    revenue: 1980,
  },
  {
    date: "Feb 22, 2026",
    venue: "The Troubadour",
    city: "Los Angeles",
    attendance: 400,
    revenue: 4800,
  },
  {
    date: "Feb 10, 2026",
    venue: "Schubas Tavern",
    city: "Chicago",
    attendance: 165,
    revenue: 1320,
  },
  {
    date: "Jan 25, 2026",
    venue: "The Borderline",
    city: "London",
    attendance: 300,
    revenue: 3600,
  },
  {
    date: "Jan 12, 2026",
    venue: "Le Pop-Up du Label",
    city: "Paris",
    attendance: 120,
    revenue: 960,
  },
];

const suggestedCities = [
  { city: "Berlin", listeners: 980 },
  { city: "Toronto", listeners: 820 },
  { city: "Sydney", listeners: 640 },
];

// Simple map dots - positions approximate for illustration
const mapLocations = [
  { city: "Los Angeles", x: 18, y: 48 },
  { city: "Paris", x: 50, y: 35 },
  { city: "London", x: 48, y: 30 },
  { city: "Brooklyn", x: 28, y: 42 },
  { city: "Chicago", x: 25, y: 40 },
];

export default function GigsPage() {
  const [expandedShow, setExpandedShow] = useState<string | null>(null);
  const [showAISuggestion, setShowAISuggestion] = useState(false);

  const toggleShow = (id: string) => {
    setExpandedShow(expandedShow === id ? null : id);
  };

  const pctSold = (sold: number, cap: number) =>
    Math.round((sold / cap) * 100);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gigs &amp; Shows</h1>
            <p className="text-sm text-gray-500">
              Manage your live performances and tours
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus size={16} />
              Add Show
            </button>
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Shows",
                value: "8",
                icon: Calendar,
                color: "bg-blue-50 text-blue-600",
              },
              {
                label: "Upcoming",
                value: "3",
                icon: Clock,
                color: "bg-amber-50 text-amber-600",
              },
              {
                label: "Total Revenue",
                value: "$4,200",
                icon: DollarSign,
                color: "bg-green-50 text-green-600",
              },
              {
                label: "Total Attendees",
                value: "1,840",
                icon: Users,
                color: "bg-purple-50 text-purple-600",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-5 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon size={18} />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Upcoming Shows */}
          <h2 className="text-lg font-semibold mb-4">Upcoming Shows</h2>
          <div className="space-y-4 mb-8">
            {upcomingShows.map((show) => {
              const pct = pctSold(show.ticketsSold, show.capacity);
              const isExpanded = expandedShow === show.id;
              return (
                <div
                  key={show.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                >
                  {/* Show card header */}
                  <button
                    onClick={() => toggleShow(show.id)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white">
                        <MapPin size={22} />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-base">
                          {show.venue}{" "}
                          <span className="text-gray-400 font-normal">
                            — {show.city}
                          </span>
                        </h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} /> {show.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} /> {show.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={13} /> {show.capacity} cap
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {show.ticketsSold}/{show.capacity}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({pct}%)
                          </span>
                        </div>
                        <div className="w-32 h-2 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pct >= 75
                                ? "bg-green-500"
                                : pct >= 25
                                ? "bg-amber-400"
                                : "bg-gray-300"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right mr-2">
                        <p className="text-sm font-semibold">
                          ${show.revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">revenue</p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          show.status === "On Sale"
                            ? "bg-green-50 text-green-700"
                            : show.status === "Announced"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {show.status}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={18} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-6 py-5">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Setlist */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                            <Music2 size={15} />
                            Setlist
                          </h4>
                          <div className="space-y-1.5">
                            {show.setlist.map((track, idx) => (
                              <div
                                key={track}
                                className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm group cursor-grab"
                              >
                                <GripVertical
                                  size={14}
                                  className="text-gray-300 group-hover:text-gray-500"
                                />
                                <span className="text-gray-400 text-xs w-5">
                                  {idx + 1}.
                                </span>
                                <span className="font-medium text-gray-700">
                                  {track}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Drag to reorder
                          </p>
                        </div>

                        {/* Merch Checklist */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                            <ShoppingBag size={15} />
                            Merch Checklist
                          </h4>
                          <div className="space-y-2">
                            {show.merch.map((m) => (
                              <div
                                key={m.item}
                                className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5"
                              >
                                <div className="flex items-center gap-2">
                                  <CheckCircle2
                                    size={15}
                                    className="text-green-500"
                                  />
                                  <span className="text-sm font-medium text-gray-700">
                                    {m.item}
                                  </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {m.units} units
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Venue Contact */}
                          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3 mt-6">
                            <Phone size={15} />
                            Venue Contact
                          </h4>
                          <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm space-y-1">
                            <p className="font-medium text-gray-700">
                              {show.venueContact.name}
                            </p>
                            <p className="text-gray-500">
                              {show.venueContact.phone}
                            </p>
                            <p className="text-gray-500">
                              {show.venueContact.email}
                            </p>
                          </div>
                        </div>

                        {/* Notes & Post-Show Analytics */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                            <StickyNote size={15} />
                            Notes
                          </h4>
                          <textarea
                            defaultValue={show.notes}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                          />

                          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3 mt-6">
                            <BarChart3 size={15} />
                            Post-Show Analytics
                          </h4>
                          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-6 text-center">
                            <TrendingUp
                              size={24}
                              className="text-gray-300 mx-auto mb-2"
                            />
                            <p className="text-sm text-gray-400">
                              Available after the show
                            </p>
                            <p className="text-xs text-gray-300 mt-1">
                              New followers from city, merch sold, streams spike
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Past Shows */}
          <h2 className="text-lg font-semibold mb-4">Past Shows</h2>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Venue</th>
                  <th className="px-6 py-3">City</th>
                  <th className="px-6 py-3 text-right">Attendance</th>
                  <th className="px-6 py-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {pastShows.map((show, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-sm text-gray-600">
                      {show.date}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-medium text-gray-800">
                      {show.venue}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-600">
                      {show.city}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-600 text-right">
                      {show.attendance.toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-medium text-gray-800 text-right">
                      ${show.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Map View */}
          <h2 className="text-lg font-semibold mb-4">Show Locations</h2>
          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
            <div className="relative w-full h-64 bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl overflow-hidden">
              {/* Simple world map placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Map size={40} className="text-blue-200" />
              </div>
              {/* Dot markers */}
              {mapLocations.map((loc) => (
                <div
                  key={loc.city}
                  className="absolute group"
                  style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                >
                  <div className="w-3 h-3 bg-indigo-500 rounded-full border-2 border-white shadow-md animate-pulse" />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {loc.city}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Suggest Next Cities */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles size={20} className="text-amber-500" />
                AI City Suggestions
              </h2>
              <button
                onClick={() => setShowAISuggestion(!showAISuggestion)}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              >
                <Sparkles size={15} />
                AI Suggest Next Cities
              </button>
            </div>

            {showAISuggestion && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-5 mt-2">
                <p className="text-sm text-gray-700 mb-4">
                  Based on your <strong>Fan Heatmap</strong> data, your top 3
                  untapped cities are:
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {suggestedCities.map((c, idx) => (
                    <div
                      key={c.city}
                      className="bg-white rounded-xl p-4 border border-indigo-100"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {c.city}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {c.listeners.toLocaleString()} listeners, no shows
                        booked
                      </p>
                      <button className="mt-3 text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                        Find venues <MapPin size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
