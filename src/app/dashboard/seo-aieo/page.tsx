"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { apiGet, apiPost } from "@/lib/api-client";
import {
  Search,
  RefreshCw,
  Loader2,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Globe,
  Bot,
  Eye,
  Code,
  Users,
  BarChart3,
  Zap,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SEOIssue {
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  fix: string;
}

interface SEOAudit {
  overallScore: number;
  categories: {
    technicalSEO: { score: number; issues: SEOIssue[] };
    contentSEO: { score: number; issues: SEOIssue[] };
    socialSEO: { score: number; issues: SEOIssue[] };
    aiVisibility: { score: number; issues: SEOIssue[] };
  };
  recommendations: string[];
}

interface AIEOProfile {
  aiReadinessScore: number;
  structuredData: {
    hasSchema: boolean;
    schemaTypes: string[];
    missingSchemas: string[];
  };
  entityRecognition: {
    isRecognizedEntity: boolean;
    knowledgeGraphPresence: string[];
    missingPlatforms: string[];
  };
  contentAuthority: {
    score: number;
    signals: string[];
    improvements: string[];
  };
  citationReadiness: {
    score: number;
    existingCitations: string[];
    opportunities: string[];
  };
}

interface KeywordAnalysis {
  primaryKeywords: { keyword: string; volume: string; difficulty: string; currentRank: string }[];
  longTailOpportunities: { keyword: string; volume: string; difficulty: string }[];
  aiQueryOpportunities: { query: string; relevance: number; currentVisibility: string }[];
}

interface CompetitorData {
  name: string;
  seoScore: number;
  aieoScore: number;
  socialPresence: number;
  contentAuthority: number;
}

interface CompetitorAnalysis {
  artist: CompetitorData;
  competitors: CompetitorData[];
  behind: string[];
  ahead: string[];
  recommendations: string[];
}

interface StructuredDataOutput {
  schemas: Record<string, object>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function scoreColor(score: number): string {
  if (score >= 70) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
}

function scoreBg(score: number): string {
  if (score >= 70) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
}

function scoreRingColor(score: number): string {
  if (score >= 70) return "stroke-green-500";
  if (score >= 50) return "stroke-yellow-500";
  return "stroke-red-500";
}

function difficultyColor(difficulty: string): string {
  if (difficulty === "Low") return "text-green-600 bg-green-50";
  if (difficulty === "Medium") return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

function visibilityColor(visibility: string): string {
  if (visibility === "Visible") return "text-green-600 bg-green-50";
  if (visibility === "Partially visible") return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

function SeverityIcon({ severity }: { severity: string }) {
  if (severity === "critical") return <AlertTriangle size={14} className="text-red-500" />;
  if (severity === "warning") return <AlertCircle size={14} className="text-yellow-500" />;
  return <Info size={14} className="text-blue-500" />;
}

function ScoreCircle({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={scoreRingColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-extrabold ${scoreColor(score)}`}>{score}</span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab type
// ---------------------------------------------------------------------------

type TabKey = "audit" | "aieo" | "keywords" | "structured-data" | "competitors";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "audit", label: "SEO Audit", icon: Search },
  { key: "aieo", label: "AI Engine Optimization", icon: Bot },
  { key: "keywords", label: "Keywords & AI Queries", icon: BarChart3 },
  { key: "structured-data", label: "Structured Data", icon: Code },
  { key: "competitors", label: "Competitor Analysis", icon: Users },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SEOAIEOPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("audit");
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);

  // Data
  const [audit, setAudit] = useState<SEOAudit | null>(null);
  const [aieoProfile, setAieoProfile] = useState<AIEOProfile | null>(null);
  const [keywords, setKeywords] = useState<KeywordAnalysis | null>(null);
  const [structuredData, setStructuredData] = useState<StructuredDataOutput | null>(null);
  const [competitors, setCompetitors] = useState<CompetitorAnalysis | null>(null);

  // Structured data toggles
  const [enabledSchemas, setEnabledSchemas] = useState<Record<string, boolean>>({
    MusicGroup: true,
    Person: true,
    MusicAlbum: true,
    MusicRecording: true,
    Event: true,
  });

  // FAQ state
  const [faqs, setFaqs] = useState([
    { question: "Who is this artist?", answer: "An independent music artist creating unique sounds." },
    { question: "What genre of music do they make?", answer: "A blend of contemporary pop and alternative." },
    { question: "Where can I listen to their music?", answer: "Available on Spotify, Apple Music, YouTube Music, and all major platforms." },
  ]);
  const [faqSchema, setFaqSchema] = useState<object | null>(null);

  // Bio state
  const [generatedBio, setGeneratedBio] = useState<string | null>(null);
  const [generatingBio, setGeneratingBio] = useState(false);

  // Issue expand state
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  // Copied state
  const [copied, setCopied] = useState(false);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [auditData, aieoData, keywordsData, sdData] = await Promise.all([
        apiGet<SEOAudit>("/api/seo-aieo/audit"),
        apiGet<AIEOProfile>("/api/seo-aieo/aieo-profile"),
        apiGet<KeywordAnalysis>("/api/seo-aieo/keywords"),
        apiGet<StructuredDataOutput>("/api/seo-aieo/structured-data"),
      ]);
      setAudit(auditData);
      setAieoProfile(aieoData);
      setKeywords(keywordsData);
      setStructuredData(sdData);

      // Mock competitor analysis (not a separate API, use inline mock)
      setCompetitors({
        artist: { name: "You", seoScore: auditData.overallScore, aieoScore: aieoData.aiReadinessScore, socialPresence: 62, contentAuthority: 42 },
        competitors: [
          { name: "Similar Artist A", seoScore: 78, aieoScore: 65, socialPresence: 85, contentAuthority: 72 },
          { name: "Similar Artist B", seoScore: 65, aieoScore: 48, socialPresence: 71, contentAuthority: 55 },
          { name: "Similar Artist C", seoScore: 42, aieoScore: 22, socialPresence: 58, contentAuthority: 30 },
        ],
        behind: [
          "Similar Artist A has structured data on their website, giving them a significant AI visibility advantage",
          "Similar Artist A has a Wikipedia page and Wikidata entry",
          "Similar Artist B has 3x more backlinks from music publications",
          "Both Similar Artist A and Similar Artist B have consistent Open Graph tags",
          "Similar Artist A appears in Google Knowledge Graph",
        ],
        ahead: [
          "Your social media posting frequency is higher than Similar Artist C",
          "Your Spotify profile is more complete than Similar Artist C",
          "You have more consistent cross-platform branding than Similar Artist B",
        ],
        recommendations: [
          "Priority: Add structured data to match Similar Artist A's AI visibility",
          "Create a Wikidata entry and aim for a Wikipedia page",
          "Pursue press coverage and blog features to build backlinks",
          "Implement Open Graph and Twitter Card tags",
          "Focus on content depth with longer, more detailed pages",
        ],
      });
    } catch (err) {
      console.error("Failed to fetch SEO/AIEO data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleRunAudit = async () => {
    setAuditing(true);
    try {
      const data = await apiPost<SEOAudit>("/api/seo-aieo/audit", {});
      setAudit(data);
    } catch (err) {
      console.error("Failed to run audit:", err);
    } finally {
      setAuditing(false);
    }
  };

  const handleGenerateBio = async () => {
    setGeneratingBio(true);
    try {
      const result = await apiPost<{ bio: string }>("/api/seo-aieo/optimize", { type: "bio" });
      setGeneratedBio(result.bio);
    } catch (err) {
      console.error("Failed to generate bio:", err);
    } finally {
      setGeneratingBio(false);
    }
  };

  const handleCopyStructuredData = () => {
    if (!structuredData) return;
    const enabled = Object.entries(enabledSchemas)
      .filter(([, v]) => v)
      .map(([k]) => k);
    const filtered: Record<string, object> = {};
    for (const key of enabled) {
      if (structuredData.schemas[key]) {
        filtered[key] = structuredData.schemas[key];
      }
    }
    const text = Object.values(filtered)
      .map((s) => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateFAQSchema = async () => {
    try {
      const result = await apiPost<{ schema: object }>("/api/seo-aieo/optimize", { type: "faq-schema", faqs });
      setFaqSchema(result.schema);
    } catch (err) {
      console.error("Failed to generate FAQ schema:", err);
    }
  };

  const toggleIssue = (key: string) => {
    setExpandedIssues((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleRefreshStructuredData = async () => {
    const enabled = Object.entries(enabledSchemas)
      .filter(([, v]) => v)
      .map(([k]) => k);
    try {
      const data = await apiGet<StructuredDataOutput>(`/api/seo-aieo/structured-data?schemas=${enabled.join(",")}`);
      setStructuredData(data);
    } catch (err) {
      console.error("Failed to refresh structured data:", err);
    }
  };

  // Collect all issues sorted by severity
  const allIssues: (SEOIssue & { category: string })[] = [];
  if (audit) {
    for (const [cat, data] of Object.entries(audit.categories)) {
      for (const issue of data.issues) {
        allIssues.push({ ...issue, category: cat });
      }
    }
  }
  const severityOrder: Record<string, number> = { critical: 0, warning: 1, info: 2 };
  allIssues.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Search size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">SEO & AIEO</h1>
                <p className="text-sm text-gray-500">Optimize for search engines AND AI engines</p>
              </div>
            </div>
            <button
              onClick={handleRunAudit}
              disabled={auditing}
              className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {auditing ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Running Audit...
                </>
              ) : (
                <>
                  <RefreshCw size={16} /> Run New Audit
                </>
              )}
            </button>
          </div>
        </div>

        <div className="px-8 py-6 max-w-6xl">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-gray-300" />
            </div>
          )}

          {!loading && (
            <>
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-[var(--primary)] text-white"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
                      }`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: SEO Audit */}
              {activeTab === "audit" && audit && (
                <div className="space-y-6">
                  {/* Overall Score + Category Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center justify-center">
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">Overall Score</p>
                      <ScoreCircle score={audit.overallScore} />
                    </div>
                    {[
                      { key: "technicalSEO", label: "Technical SEO", icon: Globe },
                      { key: "contentSEO", label: "Content SEO", icon: FileText },
                      { key: "socialSEO", label: "Social SEO", icon: Users },
                      { key: "aiVisibility", label: "AI Visibility", icon: Bot },
                    ].map((cat) => {
                      const catData = audit.categories[cat.key as keyof typeof audit.categories];
                      return (
                        <div key={cat.key} className="bg-white rounded-xl border border-gray-100 p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <cat.icon size={16} className="text-gray-400" />
                            <span className="text-sm font-bold text-gray-700">{cat.label}</span>
                          </div>
                          <div className="flex items-end justify-between">
                            <span className={`text-3xl font-extrabold ${scoreColor(catData.score)}`}>{catData.score}</span>
                            <span className="text-xs text-gray-400">{catData.issues.length} issues</span>
                          </div>
                          <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
                            <div className={`h-2 rounded-full ${scoreBg(catData.score)}`} style={{ width: `${catData.score}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Issues */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-base font-bold mb-4">Issues ({allIssues.length})</h2>
                    <div className="space-y-2">
                      {allIssues.map((issue, i) => {
                        const key = `${issue.category}-${i}`;
                        const isExpanded = expandedIssues.has(key);
                        return (
                          <div key={key} className={`border rounded-lg ${issue.severity === "critical" ? "border-red-200 bg-red-50/50" : issue.severity === "warning" ? "border-yellow-200 bg-yellow-50/50" : "border-blue-200 bg-blue-50/50"}`}>
                            <button
                              onClick={() => toggleIssue(key)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left"
                            >
                              <SeverityIcon severity={issue.severity} />
                              <span className="flex-1 text-sm font-medium text-gray-800">{issue.title}</span>
                              <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                                issue.severity === "critical" ? "bg-red-100 text-red-700" : issue.severity === "warning" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                              }`}>
                                {issue.severity}
                              </span>
                              {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                            </button>
                            {isExpanded && (
                              <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                                <p className="text-sm text-gray-600 mb-3">{issue.description}</p>
                                <div className="bg-white rounded-lg border border-gray-200 p-3">
                                  <p className="text-xs font-bold uppercase text-gray-500 mb-1">How to fix</p>
                                  <p className="text-sm text-gray-700">{issue.fix}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 rounded-xl p-6">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                      <Sparkles size={16} className="text-cyan-500" />
                      Top Recommendations
                    </h2>
                    <div className="space-y-3">
                      {audit.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-xs font-bold bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full mt-0.5">{i + 1}</span>
                          <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: AIEO */}
              {activeTab === "aieo" && aieoProfile && (
                <div className="space-y-6">
                  {/* AI Readiness Score */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col items-center">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">AI Readiness Score</p>
                    <ScoreCircle score={aieoProfile.aiReadinessScore} size={160} />
                    <p className="text-sm text-gray-500 mt-3">
                      {aieoProfile.aiReadinessScore < 40
                        ? "Low AI visibility. Significant improvements needed."
                        : aieoProfile.aiReadinessScore < 70
                        ? "Moderate AI presence. Room for improvement."
                        : "Strong AI visibility. Keep optimizing."}
                    </p>
                  </div>

                  {/* Structured Data */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                      <Code size={16} className="text-purple-500" />
                      Structured Data
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {["MusicGroup", "Person", "MusicAlbum", "MusicRecording", "Event", "FAQPage"].map((schema) => {
                        const hasIt = aieoProfile.structuredData.schemaTypes.includes(schema);
                        return (
                          <div key={schema} className={`flex items-center gap-2 p-3 rounded-lg border ${hasIt ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                            {hasIt ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />}
                            <span className="text-sm font-medium">{schema}</span>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setActiveTab("structured-data")}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline"
                    >
                      <Zap size={14} /> Generate Missing Schemas
                    </button>
                  </div>

                  {/* Entity Recognition */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                      <Globe size={16} className="text-blue-500" />
                      Entity Recognition
                    </h2>
                    <div className="flex items-center gap-2 mb-4">
                      {aieoProfile.entityRecognition.isRecognizedEntity ? (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                          <CheckCircle2 size={14} /> Recognized Entity
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                          <XCircle size={14} /> Not Recognized as Entity
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Present On</p>
                        <div className="space-y-2">
                          {aieoProfile.entityRecognition.knowledgeGraphPresence.map((p) => (
                            <div key={p} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 size={14} className="text-green-500" /> {p}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Missing From</p>
                        <div className="space-y-2">
                          {aieoProfile.entityRecognition.missingPlatforms.map((p) => (
                            <div key={p} className="flex items-center gap-2 text-sm">
                              <XCircle size={14} className="text-red-500" /> {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Authority */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-1">
                      <Eye size={16} className="text-amber-500" />
                      Content Authority
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">Score: <span className={`font-bold ${scoreColor(aieoProfile.contentAuthority.score)}`}>{aieoProfile.contentAuthority.score}/100</span></p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Trust Signals</p>
                        <div className="space-y-2">
                          {aieoProfile.contentAuthority.signals.map((s, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" /> {s}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Improvements</p>
                        <div className="space-y-2">
                          {aieoProfile.contentAuthority.improvements.map((s, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <Zap size={14} className="text-amber-500 mt-0.5 shrink-0" /> {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Citation Readiness */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-1">
                      <FileText size={16} className="text-indigo-500" />
                      Citation Readiness
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">Score: <span className={`font-bold ${scoreColor(aieoProfile.citationReadiness.score)}`}>{aieoProfile.citationReadiness.score}/100</span></p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Existing Citations</p>
                        <div className="space-y-2">
                          {aieoProfile.citationReadiness.existingCitations.map((c, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" /> {c}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-gray-500 mb-2">Opportunities</p>
                        <div className="space-y-2">
                          {aieoProfile.citationReadiness.opportunities.map((o, i) => (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <Sparkles size={14} className="text-indigo-500 mt-0.5 shrink-0" /> {o}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generate AI-Optimized Bio */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-6">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-3">
                      <Sparkles size={16} className="text-purple-500" />
                      AI-Optimized Bio
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">Generate a bio optimized for AI engine understanding and citation.</p>
                    <button
                      onClick={handleGenerateBio}
                      disabled={generatingBio}
                      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    >
                      {generatingBio ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} /> Generate AI-Optimized Bio
                        </>
                      )}
                    </button>
                    {generatedBio && (
                      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{generatedBio}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Keywords & AI Queries */}
              {activeTab === "keywords" && keywords && (
                <div className="space-y-6">
                  {/* Primary Keywords */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-base font-bold mb-4">Primary Keywords</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 pr-4 font-bold text-gray-500 text-xs uppercase">Keyword</th>
                            <th className="text-left py-2 pr-4 font-bold text-gray-500 text-xs uppercase">Volume</th>
                            <th className="text-left py-2 pr-4 font-bold text-gray-500 text-xs uppercase">Difficulty</th>
                            <th className="text-left py-2 font-bold text-gray-500 text-xs uppercase">Current Rank</th>
                          </tr>
                        </thead>
                        <tbody>
                          {keywords.primaryKeywords.map((kw, i) => (
                            <tr key={i} className="border-b border-gray-50">
                              <td className="py-2.5 pr-4 font-medium text-gray-800">{kw.keyword}</td>
                              <td className="py-2.5 pr-4 text-gray-600">{kw.volume}</td>
                              <td className="py-2.5 pr-4">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${difficultyColor(kw.difficulty)}`}>{kw.difficulty}</span>
                              </td>
                              <td className="py-2.5 text-gray-600">{kw.currentRank}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Long-Tail Opportunities */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-base font-bold mb-4">Long-Tail Opportunities</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 pr-4 font-bold text-gray-500 text-xs uppercase">Keyword</th>
                            <th className="text-left py-2 pr-4 font-bold text-gray-500 text-xs uppercase">Volume</th>
                            <th className="text-left py-2 font-bold text-gray-500 text-xs uppercase">Difficulty</th>
                          </tr>
                        </thead>
                        <tbody>
                          {keywords.longTailOpportunities.map((kw, i) => (
                            <tr key={i} className="border-b border-gray-50">
                              <td className="py-2.5 pr-4 font-medium text-gray-800">{kw.keyword}</td>
                              <td className="py-2.5 pr-4 text-gray-600">{kw.volume}</td>
                              <td className="py-2.5">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${difficultyColor(kw.difficulty)}`}>{kw.difficulty}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* AI Query Opportunities */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-base font-bold mb-2">AI Query Opportunities</h2>
                    <p className="text-sm text-gray-500 mb-4">Questions people ask AI about artists like you</p>
                    <div className="space-y-3">
                      {keywords.aiQueryOpportunities.map((q, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">&ldquo;{q.query}&rdquo;</p>
                          </div>
                          <div className="w-32 shrink-0">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: `${q.relevance}%` }} />
                              </div>
                              <span className="text-xs font-bold text-gray-600 w-8 text-right">{q.relevance}%</span>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${visibilityColor(q.currentVisibility)}`}>
                            {q.currentVisibility}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What AI says about you */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-6">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                      <Bot size={16} className="text-indigo-500" />
                      What AI Says About You
                    </h2>
                    <div className="space-y-4">
                      {[
                        { engine: "ChatGPT", response: "I don't have specific information about this artist in my training data. They may be a newer or independent artist. I'd recommend checking their Spotify or social media profiles for the latest information." },
                        { engine: "Perplexity", response: "Based on available sources, this artist is an independent musician active on Spotify and Apple Music. Limited biographical information is available online. Their social media presence suggests an active engagement with fans." },
                      ].map((ai) => (
                        <div key={ai.engine} className="bg-white rounded-lg border border-gray-200 p-4">
                          <p className="text-xs font-bold uppercase text-gray-500 mb-2">{ai.engine}</p>
                          <p className="text-sm text-gray-600 italic">&ldquo;{ai.response}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Structured Data Generator */}
              {activeTab === "structured-data" && structuredData && (
                <div className="space-y-6">
                  {/* Schema Toggles */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-base font-bold mb-4">Schema Types</h2>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {Object.keys(enabledSchemas).map((schema) => (
                        <button
                          key={schema}
                          onClick={() => {
                            setEnabledSchemas((prev) => ({ ...prev, [schema]: !prev[schema] }));
                          }}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                            enabledSchemas[schema]
                              ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {enabledSchemas[schema] ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {schema}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleRefreshStructuredData}
                      className="text-sm font-semibold text-[var(--primary)] hover:underline"
                    >
                      Refresh preview
                    </button>
                  </div>

                  {/* JSON-LD Preview */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-bold">Generated JSON-LD</h2>
                      <button
                        onClick={handleCopyStructuredData}
                        className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Copy size={14} />
                        {copied ? "Copied!" : "Copy to Clipboard"}
                      </button>
                    </div>
                    <div className="bg-gray-950 rounded-lg p-4 overflow-x-auto">
                      {Object.entries(structuredData.schemas)
                        .filter(([key]) => enabledSchemas[key])
                        .map(([key, schema]) => (
                          <div key={key} className="mb-4 last:mb-0">
                            <p className="text-xs font-bold text-gray-400 mb-1">{`<!-- ${key} -->`}</p>
                            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                              {`<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`}
                            </pre>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* How to implement */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-6">
                    <h2 className="text-base font-bold mb-3">How to Implement</h2>
                    <ol className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-0.5">1</span>
                        Copy the JSON-LD scripts above using the &ldquo;Copy to Clipboard&rdquo; button.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-0.5">2</span>
                        Paste the scripts into the {`<head>`} section of your website&apos;s HTML.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-0.5">3</span>
                        Test with Google&apos;s Rich Results Test (search.google.com/test/rich-results).
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mt-0.5">4</span>
                        Submit your updated pages to Google Search Console for re-indexing.
                      </li>
                    </ol>
                  </div>

                  {/* FAQ Schema Generator */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                      <FileText size={16} className="text-purple-500" />
                      FAQ Schema Generator
                    </h2>
                    <div className="space-y-4">
                      {faqs.map((faq, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold uppercase text-gray-500">Question {i + 1}</label>
                            <button
                              onClick={() => setFaqs(faqs.filter((_, j) => j !== i))}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const updated = [...faqs];
                              updated[i] = { ...updated[i], question: e.target.value };
                              setFaqs(updated);
                            }}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-[var(--primary)]"
                          />
                          <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Answer</label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => {
                              const updated = [...faqs];
                              updated[i] = { ...updated[i], answer: e.target.value };
                              setFaqs(updated);
                            }}
                            rows={2}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)] resize-none"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline"
                      >
                        <Plus size={14} /> Add Question
                      </button>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={handleGenerateFAQSchema}
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      >
                        <Code size={16} /> Generate FAQ Schema
                      </button>
                    </div>
                    {faqSchema && (
                      <div className="mt-4 bg-gray-950 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
                          {`<script type="application/ld+json">\n${JSON.stringify(faqSchema, null, 2)}\n</script>`}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 5: Competitor Analysis */}
              {activeTab === "competitors" && competitors && (
                <div className="space-y-6">
                  {/* Comparison Table */}
                  <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h2 className="text-base font-bold mb-4">SEO & AIEO Comparison</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 pr-4 font-bold text-gray-500 text-xs uppercase">Artist</th>
                            <th className="text-left py-2 pr-4 font-bold text-gray-500 text-xs uppercase">SEO Score</th>
                            <th className="text-left py-2 pr-4 font-bold text-gray-500 text-xs uppercase">AIEO Score</th>
                            <th className="text-left py-2 pr-4 font-bold text-gray-500 text-xs uppercase">Social</th>
                            <th className="text-left py-2 font-bold text-gray-500 text-xs uppercase">Authority</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[competitors.artist, ...competitors.competitors].map((c, i) => (
                            <tr key={i} className={`border-b border-gray-50 ${i === 0 ? "bg-blue-50/50 font-semibold" : ""}`}>
                              <td className="py-3 pr-4">
                                <span className="font-medium text-gray-800">{c.name}</span>
                                {i === 0 && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">You</span>}
                              </td>
                              <td className="py-3 pr-4">
                                <span className={`font-bold ${scoreColor(c.seoScore)}`}>{c.seoScore}</span>
                              </td>
                              <td className="py-3 pr-4">
                                <span className={`font-bold ${scoreColor(c.aieoScore)}`}>{c.aieoScore}</span>
                              </td>
                              <td className="py-3 pr-4">
                                <span className={`font-bold ${scoreColor(c.socialPresence)}`}>{c.socialPresence}</span>
                              </td>
                              <td className="py-3">
                                <span className={`font-bold ${scoreColor(c.contentAuthority)}`}>{c.contentAuthority}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Gap Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                        <AlertTriangle size={16} className="text-red-500" />
                        You&apos;re Behind On
                      </h2>
                      <div className="space-y-3">
                        {competitors.behind.map((b, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <XCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-gray-700">{b}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-6">
                      <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                        <CheckCircle2 size={16} className="text-green-500" />
                        You&apos;re Ahead On
                      </h2>
                      <div className="space-y-3">
                        {competitors.ahead.map((a, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                            <p className="text-sm text-gray-700">{a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-6">
                    <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                      <Sparkles size={16} className="text-amber-500" />
                      Recommendations Based on Competitor Analysis
                    </h2>
                    <div className="space-y-3">
                      {competitors.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mt-0.5">{i + 1}</span>
                          <p className="text-sm text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
