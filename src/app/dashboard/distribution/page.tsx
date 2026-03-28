"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  Package,
  Radio,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Unplug,
  Plus,
  Music2,
  Image,
  FileText,
  Calendar,
  Tag,
  Hash,
  Disc3,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";

type PipelineStep = {
  label: string;
  status: "completed" | "active" | "pending" | "not-started";
  detail?: string;
};

type PlatformStatus = {
  name: string;
  status: "live" | "submitted" | "pending" | "not-submitted" | "in-review";
  detail?: string;
  liveSince?: string;
};

type Release = {
  title: string;
  status: "upcoming" | "live";
  estimatedLive?: string;
  isrc?: string;
  upc?: string;
  pipeline?: PipelineStep[];
  platforms: PlatformStatus[];
};

const releases: Release[] = [
  {
    title: "Golden Hour",
    status: "upcoming",
    estimatedLive: "Apr 18, 2026",
    isrc: "USXX62600001",
    upc: "198765432100",
    pipeline: [
      { label: "Submitted Mar 25", status: "completed" },
      { label: "In Review", status: "active", detail: "DistroKid reviewing" },
      { label: "Approved", status: "pending" },
      { label: "Live", status: "not-started" },
    ],
    platforms: [
      { name: "DistroKid", status: "in-review", detail: "Submitted Mar 25" },
      { name: "Spotify", status: "submitted" },
      { name: "Apple Music", status: "submitted" },
      { name: "YouTube Music", status: "pending" },
      { name: "Deezer", status: "submitted" },
      { name: "Tidal", status: "pending" },
      { name: "Amazon Music", status: "not-submitted" },
    ],
  },
  {
    title: "Midnight Dreams",
    status: "live",
    platforms: [
      { name: "Spotify", status: "live", liveSince: "Feb 14, 2026" },
      { name: "Apple Music", status: "live", liveSince: "Feb 14, 2026" },
      { name: "YouTube Music", status: "live", liveSince: "Feb 15, 2026" },
      { name: "Deezer", status: "live", liveSince: "Feb 14, 2026" },
      { name: "Tidal", status: "live", liveSince: "Feb 16, 2026" },
      { name: "Amazon Music", status: "live", liveSince: "Feb 14, 2026" },
    ],
  },
  {
    title: "Electric Feel",
    status: "live",
    platforms: [
      { name: "Spotify", status: "live", liveSince: "Dec 1, 2025" },
      { name: "Apple Music", status: "live", liveSince: "Dec 1, 2025" },
      { name: "YouTube Music", status: "live", liveSince: "Dec 2, 2025" },
      { name: "Deezer", status: "live", liveSince: "Dec 1, 2025" },
      { name: "Tidal", status: "live", liveSince: "Dec 3, 2025" },
      { name: "Amazon Music", status: "live", liveSince: "Dec 1, 2025" },
    ],
  },
];

const distributors = [
  { name: "DistroKid", connected: true, logo: "🎵" },
  { name: "TuneCore", connected: false, logo: "🎶" },
  { name: "CD Baby", connected: false, logo: "💿" },
  { name: "AWAL", connected: false, logo: "🔊" },
];

const submissionChecklist = [
  { label: "Audio file (WAV/FLAC)", icon: Music2, complete: true },
  { label: "Artwork (3000×3000 px)", icon: Image, complete: true },
  { label: "Metadata (title, artist, album)", icon: FileText, complete: true },
  { label: "ISRC code", icon: Hash, complete: true },
  { label: "Release date set", icon: Calendar, complete: false },
  { label: "Genre tags", icon: Tag, complete: false },
];

function PlatformStatusBadge({ platform }: { platform: PlatformStatus }) {
  switch (platform.status) {
    case "live":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
          <CheckCircle2 size={13} />
          Live{platform.liveSince ? ` since ${platform.liveSince}` : ""}
        </span>
      );
    case "submitted":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
          <CheckCircle2 size={13} />
          Submitted
        </span>
      );
    case "in-review":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
          <Clock size={13} />
          In Review
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          <Circle size={13} />
          Pending
        </span>
      );
    case "not-submitted":
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
          <AlertCircle size={13} />
          Not submitted
        </span>
      );
  }
}

export default function DistributionPage() {
  const [expandedRelease, setExpandedRelease] = useState<string | null>(
    "Golden Hour"
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Distribution</h1>
            <p className="text-sm text-gray-500">
              Track your releases across all platforms
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus size={16} />
              New Release Submission
            </button>
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Releases Distributed",
                value: "12",
                icon: Package,
                color: "bg-blue-50 text-blue-600",
              },
              {
                label: "Platforms Active",
                value: "6",
                icon: Radio,
                color: "bg-green-50 text-green-600",
              },
              {
                label: "Pending Review",
                value: "2",
                icon: Clock,
                color: "bg-amber-50 text-amber-600",
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

          {/* Active Submissions Pipeline */}
          <h2 className="text-lg font-semibold mb-4">Active Submissions</h2>
          <div className="space-y-4 mb-8">
            {releases.map((release) => (
              <div
                key={release.title}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                {/* Release header */}
                <button
                  onClick={() =>
                    setExpandedRelease(
                      expandedRelease === release.title
                        ? null
                        : release.title
                    )
                  }
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                      <Disc3 size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{release.title}</h3>
                      <p className="text-xs text-gray-500">
                        {release.status === "upcoming"
                          ? `Estimated live: ${release.estimatedLive}`
                          : "Live on all platforms"}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        release.status === "live"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {release.status === "live" ? "Live" : "Upcoming"}
                    </span>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`text-gray-400 transition-transform ${
                      expandedRelease === release.title ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Expanded content */}
                {expandedRelease === release.title && (
                  <div className="border-t border-gray-100 px-6 py-5">
                    {/* Pipeline steps for upcoming releases */}
                    {release.pipeline && (
                      <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          DistroKid Submission Pipeline
                        </p>
                        <div className="flex items-center gap-2">
                          {release.pipeline.map((step, idx) => (
                            <div key={step.label} className="flex items-center">
                              <div
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                                  step.status === "completed"
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : step.status === "active"
                                    ? "bg-amber-50 text-amber-700 border-2 border-amber-300 shadow-sm"
                                    : "bg-gray-50 text-gray-400 border border-gray-200"
                                }`}
                              >
                                {step.status === "completed" && (
                                  <CheckCircle2 size={15} />
                                )}
                                {step.status === "active" && (
                                  <Clock size={15} className="animate-pulse" />
                                )}
                                {(step.status === "pending" ||
                                  step.status === "not-started") && (
                                  <Circle size={15} />
                                )}
                                {step.label}
                              </div>
                              {idx < release.pipeline!.length - 1 && (
                                <ArrowRight
                                  size={16}
                                  className="mx-1 text-gray-300"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Platform statuses */}
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Platform Status
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                      {release.platforms.map((p) => (
                        <div
                          key={p.name}
                          className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                        >
                          <span className="text-sm font-medium text-gray-700">
                            {p.name}
                          </span>
                          <PlatformStatusBadge platform={p} />
                        </div>
                      ))}
                    </div>

                    {/* ISRC / UPC for upcoming */}
                    {release.isrc && (
                      <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            ISRC
                          </p>
                          <p className="text-sm font-mono font-medium mt-0.5">
                            {release.isrc}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            UPC
                          </p>
                          <p className="text-sm font-mono font-medium mt-0.5">
                            {release.upc}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide">
                            Est. Live Date
                          </p>
                          <p className="text-sm font-medium mt-0.5">
                            {release.estimatedLive}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Distributor Connections */}
          <h2 className="text-lg font-semibold mb-4">
            Distributor Connections
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {distributors.map((d) => (
              <div
                key={d.name}
                className="bg-white rounded-xl border border-gray-100 p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{d.logo}</span>
                  <div>
                    <p className="font-semibold text-sm">{d.name}</p>
                    <p
                      className={`text-xs ${
                        d.connected ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {d.connected ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
                {d.connected ? (
                  <button className="w-full text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg py-2 flex items-center justify-center gap-2 transition-colors">
                    <Unplug size={14} />
                    Disconnect
                  </button>
                ) : (
                  <button className="w-full text-sm text-indigo-600 hover:text-indigo-700 border border-indigo-200 hover:border-indigo-300 rounded-lg py-2 flex items-center justify-center gap-2 transition-colors">
                    <ExternalLink size={14} />
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submission Checklist */}
          <h2 className="text-lg font-semibold mb-4">
            New Release Submission Checklist
          </h2>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <p className="text-sm text-gray-500 mb-4">
              Ensure all items are ready before submitting a new release.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {submissionChecklist.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                    item.complete
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      item.complete
                        ? "bg-green-600 text-white"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {item.complete ? <Check size={14} /> : <X size={14} />}
                  </div>
                  <div className="flex items-center gap-2">
                    <item.icon
                      size={15}
                      className={
                        item.complete ? "text-green-600" : "text-red-400"
                      }
                    />
                    <span
                      className={`text-sm font-medium ${
                        item.complete ? "text-green-800" : "text-red-700"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
