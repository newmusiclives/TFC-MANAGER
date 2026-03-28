"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { useState } from "react";
import Link from "next/link";
import {
  Plug,
  Music2,
  Headphones,
  Link2,
  Package,
  Video,
  Smartphone,
  Zap,
  Layers,
  ToggleLeft,
  ToggleRight,
  Webhook,
  Key,
  Copy,
  RefreshCw,
  ExternalLink,
  Save,
  Play,
  Check,
  AlertCircle,
  Clock,
  Code2,
  FileText,
  Send,
  ChevronRight,
  Plus,
  Shield,
  Activity,
} from "lucide-react";

interface WebhookEvent {
  name: string;
  description: string;
  enabled: boolean;
}

export default function IntegrationsPage() {
  const [apiKeyRevealed] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://example.com/webhook");
  const [webhooks, setWebhooks] = useState<WebhookEvent[]>([
    { name: "new_release", description: "Fires when a release goes live", enabled: true },
    { name: "stream_milestone", description: "Fires at stream milestones (1K, 10K, 100K)", enabled: true },
    { name: "new_subscriber", description: "When a fan joins your mailing list", enabled: false },
    { name: "playlist_add", description: "When your track is added to a playlist", enabled: true },
  ]);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText("tfm_live_sk_example_key_a3f2");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const toggleWebhook = (index: number) => {
    setWebhooks((prev) =>
      prev.map((wh, i) => (i === index ? { ...wh, enabled: !wh.enabled } : wh))
    );
  };

  const connectedServices = [
    {
      name: "Spotify for Artists",
      icon: Music2,
      connected: true,
      description: "Last synced 2 hours ago",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      name: "Apple Music for Artists",
      icon: Headphones,
      connected: true,
      description: "Stream analytics and playlist data",
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
    {
      name: "TrueFans CONNECT",
      icon: Link2,
      connected: false,
      description: "Link your account to get Pro free",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      connectUrl: "https://truefansconnect.com",
    },
    {
      name: "DistroKid",
      icon: Package,
      connected: true,
      description: "Distribution and release management",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "YouTube",
      icon: Video,
      connected: false,
      description: "Video analytics and channel data",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      name: "TikTok",
      icon: Smartphone,
      connected: false,
      description: "Short-form video performance",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
  ];

  const automationServices = [
    {
      name: "Zapier",
      icon: Zap,
      description: "Connect 5,000+ apps to your workflow",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      examples: ["Auto-post new release to Slack", "Add new subscribers to Mailchimp"],
    },
    {
      name: "Make (Integromat)",
      icon: Layers,
      description: "Visual automation builder",
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      examples: [],
    },
    {
      name: "IFTTT",
      icon: ToggleRight,
      description: "Simple if-this-then-that recipes",
      color: "text-sky-400",
      bgColor: "bg-sky-500/10",
      examples: [],
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      <DashboardSidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Plug className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Integrations</h1>
          </div>
          <p className="text-zinc-400 ml-[52px]">
            Connect your favorite tools and services to supercharge your music career.
          </p>
        </div>

        {/* Connected Services */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-zinc-400" />
            Connected Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedServices.map((service) => (
              <div
                key={service.name}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${service.bgColor}`}>
                    <service.icon className={`w-5 h-5 ${service.color}`} />
                  </div>
                  {service.connected ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
                      <Check className="w-3 h-3" />
                      Connected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      Not connected
                    </span>
                  )}
                </div>
                <h3 className="text-white font-medium mb-1">{service.name}</h3>
                <p className="text-sm text-zinc-400 mb-4">{service.description}</p>
                {service.connected ? (
                  <button className="w-full px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">
                    Disconnect
                  </button>
                ) : service.connectUrl ? (
                  <Link
                    href={service.connectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors"
                  >
                    Connect
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Automation */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-zinc-400" />
            Automation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {automationServices.map((service) => (
              <div
                key={service.name}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
              >
                <div className={`p-2.5 rounded-lg ${service.bgColor} w-fit mb-3`}>
                  <service.icon className={`w-5 h-5 ${service.color}`} />
                </div>
                <h3 className="text-white font-medium mb-1">{service.name}</h3>
                <p className="text-sm text-zinc-400 mb-3">{service.description}</p>
                {service.examples.length > 0 && (
                  <div className="mb-4 space-y-1.5">
                    {service.examples.map((ex) => (
                      <div key={ex} className="flex items-center gap-2 text-xs text-zinc-500">
                        <ChevronRight className="w-3 h-3 text-zinc-600" />
                        {ex}
                      </div>
                    ))}
                  </div>
                )}
                <button className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* API Access */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-zinc-400" />
            API Access
          </h2>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
            {/* API Key */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-zinc-300 mb-2">API Key</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center bg-zinc-800/80 border border-zinc-700 rounded-lg px-4 py-2.5">
                  <Key className="w-4 h-4 text-zinc-500 mr-3 shrink-0" />
                  <code className="text-sm text-zinc-300 font-mono">
                    {apiKeyRevealed ? "tfm_live_sk_example_key_a3f2" : "tfm_live_****\u2026****a3f2"}
                  </code>
                </div>
                <button
                  onClick={handleCopyKey}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copiedKey ? "Copied" : "Copy"}
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-lg transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </button>
              </div>
            </div>

            {/* Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Link
                href="#"
                className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors group"
              >
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-zinc-300 group-hover:text-white">API Documentation</span>
                <ExternalLink className="w-3 h-3 text-zinc-600 ml-auto" />
              </Link>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-400">Rate limit:</span>
                <span className="text-sm text-white font-medium">1,000 requests/hour</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-400">Usage:</span>
                <span className="text-sm text-white font-medium">847 / 1,000 requests this hour</span>
              </div>
            </div>

            {/* Usage Bar */}
            <div className="mb-6">
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-orange-500 h-2 rounded-full transition-all"
                  style={{ width: "84.7%" }}
                />
              </div>
              <p className="text-xs text-zinc-500 mt-1.5">84.7% of hourly limit used</p>
            </div>

            {/* Webhook URL */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Webhook URL</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center bg-zinc-800/80 border border-zinc-700 rounded-lg overflow-hidden">
                  <div className="px-3 py-2.5 bg-zinc-700/50 border-r border-zinc-700">
                    <Webhook className="w-4 h-4 text-zinc-400" />
                  </div>
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-zinc-300 px-3 py-2.5 outline-none placeholder:text-zinc-600"
                    placeholder="https://your-domain.com/webhook"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Available Webhooks */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Webhook className="w-5 h-5 text-zinc-400" />
            Available Webhooks
          </h2>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                    Event
                  </th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                    Description
                  </th>
                  <th className="text-center text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {webhooks.map((wh, index) => (
                  <tr key={wh.name} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <code className="text-sm font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        {wh.name}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{wh.description}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleWebhook(index)}
                        className="inline-flex items-center gap-1.5"
                      >
                        {wh.enabled ? (
                          <>
                            <ToggleRight className="w-6 h-6 text-green-400" />
                            <span className="text-xs text-green-400 font-medium">Enabled</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-6 h-6 text-zinc-600" />
                            <span className="text-xs text-zinc-500 font-medium">Disabled</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                        <Send className="w-3 h-3" />
                        Test
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
