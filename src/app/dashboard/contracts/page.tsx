"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import {
  Bell,
  FileSearch,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Info,
  Shield,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Eye,
  Download,
  Trash2,
} from "lucide-react";
import { useState } from "react";

type RiskLevel = "low" | "medium" | "high";

type ContractClause = {
  title: string;
  risk: RiskLevel;
  summary: string;
  detail: string;
  recommendation: string;
};

type Contract = {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  pages: number;
  status: "analyzed" | "processing";
  overallRisk: RiskLevel;
  clauses: ContractClause[];
};

const analyzedContracts: Contract[] = [
  {
    id: "c1",
    name: "Distribution_Agreement_DistroMax_2026.pdf",
    type: "Distribution Agreement",
    uploadedAt: "Mar 25, 2026",
    pages: 12,
    status: "analyzed",
    overallRisk: "medium",
    clauses: [
      {
        title: "Term & Renewal",
        risk: "low",
        summary: "3-year term with automatic renewal unless 90 days notice given.",
        detail: "The agreement runs for an initial period of 3 years from the effective date. Unless either party gives written notice of termination at least 90 days before the end of the term, the agreement automatically renews for successive 1-year periods.",
        recommendation: "Standard clause. Set a calendar reminder 100 days before expiry to evaluate whether to renew.",
      },
      {
        title: "Revenue Split",
        risk: "medium",
        summary: "80/20 split in artist's favor, but net receipts definition is broad.",
        detail: "The distributor retains 20% of 'Net Receipts,' defined as gross revenue minus distribution fees, platform charges, marketing costs, and 'reasonable administrative expenses.' The broad definition of deductible expenses could reduce the artist's effective share.",
        recommendation: "Request a cap on 'administrative expenses' or an itemized definition. Ask for gross revenue reporting alongside net receipts.",
      },
      {
        title: "Exclusivity Clause",
        risk: "high",
        summary: "Full exclusivity across all platforms and territories worldwide.",
        detail: "During the term, the artist grants exclusive worldwide distribution rights for all recorded music, including future releases. The artist cannot distribute through any other channel, including direct-to-fan platforms.",
        recommendation: "This is very restrictive. Negotiate to exclude direct-to-fan sales (e.g., Bandcamp, personal website) and limit territorial exclusivity if possible.",
      },
      {
        title: "Rights Post-Termination",
        risk: "medium",
        summary: "Distributor retains catalog for 2 years after termination.",
        detail: "Upon termination, the distributor retains the right to distribute all releases made during the term for an additional 24 months. New releases after termination are not covered.",
        recommendation: "Try to reduce the post-termination window to 6-12 months. Ensure you can request takedown of content after this period.",
      },
      {
        title: "Accounting & Payments",
        risk: "low",
        summary: "Quarterly payments with 60-day reporting delay.",
        detail: "The distributor will provide quarterly accounting statements and payments within 60 days after the end of each calendar quarter. The artist has the right to audit once per year at their own expense.",
        recommendation: "Quarterly with 60 days is industry standard. Consider requesting monthly reporting even if payments remain quarterly.",
      },
    ],
  },
  {
    id: "c2",
    name: "Sync_License_AdAgency_March2026.pdf",
    type: "Sync License",
    uploadedAt: "Mar 20, 2026",
    pages: 6,
    status: "analyzed",
    overallRisk: "low",
    clauses: [
      {
        title: "Usage Rights",
        risk: "low",
        summary: "Non-exclusive sync for 1 TV commercial, 12 months.",
        detail: "License grants non-exclusive rights to synchronize the track with one specific TV commercial for a period of 12 months from first broadcast.",
        recommendation: "Standard and fair. Non-exclusive means you can license the same track elsewhere.",
      },
      {
        title: "Compensation",
        risk: "low",
        summary: "$5,000 upfront fee, no backend royalties.",
        detail: "One-time sync fee of $5,000 payable within 30 days of execution. No performance royalties from the sync usage (these flow through your PRO separately).",
        recommendation: "Ensure your PRO registration is up to date to capture performance royalties from broadcasts.",
      },
      {
        title: "Territory",
        risk: "low",
        summary: "United States only, digital and broadcast.",
        detail: "License is limited to the United States across broadcast television and digital streaming of the commercial.",
        recommendation: "Clean territorial limitation. If the ad goes international, a new license would be required.",
      },
    ],
  },
];

export default function ContractsPage() {
  const [expandedContract, setExpandedContract] = useState<string | null>("c1");
  const [expandedClause, setExpandedClause] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const riskColor = (r: RiskLevel) => {
    switch (r) {
      case "low": return "bg-green-50 text-green-700";
      case "medium": return "bg-yellow-50 text-yellow-700";
      case "high": return "bg-red-50 text-red-700";
    }
  };

  const riskIcon = (r: RiskLevel) => {
    switch (r) {
      case "low": return <CheckCircle2 size={16} className="text-green-600" />;
      case "medium": return <Info size={16} className="text-yellow-600" />;
      case "high": return <AlertTriangle size={16} className="text-red-600" />;
    }
  };

  const handleUpload = () => {
    setShowUpload(false);
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 3000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Contract Analysis</h1>
            <p className="text-sm text-gray-500">AI-powered legal document simplification</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowUpload(!showUpload)} className="inline-flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors">
              <Upload size={16} /> Upload Contract
            </button>
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Upload */}
          {showUpload && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <h2 className="font-bold text-lg mb-4">Upload Contract for Analysis</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-[var(--primary)]/40 transition-colors cursor-pointer mb-4">
                <FileText size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-600 font-medium">Drop your contract here or click to browse</p>
                <p className="text-sm text-gray-400 mt-1">PDF, DOC, DOCX up to 20MB</p>
              </div>
              <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3 mb-4">
                <Shield size={18} className="text-blue-600 shrink-0" />
                <p className="text-sm text-blue-700">Your documents are encrypted and analyzed privately. We never share your contract data.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleUpload} className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2">
                  <Sparkles size={16} /> Analyze Contract
                </button>
                <button onClick={() => setShowUpload(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-5 py-2.5 rounded-lg transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {analyzing && (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 mb-6 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Analyzing your contract...</h3>
              <p className="text-sm text-gray-500">Our AI is reviewing each clause and identifying key terms, risks, and recommendations.</p>
            </div>
          )}

          {/* Contracts list */}
          <div className="space-y-4">
            {analyzedContracts.map((contract) => (
              <div key={contract.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => setExpandedContract(expandedContract === contract.id ? null : contract.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <FileSearch size={22} className="text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-bold">{contract.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                          <span>{contract.type}</span>
                          <span>&bull;</span>
                          <span>{contract.pages} pages</span>
                          <span>&bull;</span>
                          <span>{contract.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${riskColor(contract.overallRisk)}`}>
                        {contract.overallRisk} risk
                      </span>
                      {expandedContract === contract.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </div>
                  </div>
                </div>

                {expandedContract === contract.id && (
                  <div className="border-t border-gray-100 px-6 pb-6">
                    {/* Summary bar */}
                    <div className="flex gap-4 mt-4 mb-6">
                      <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
                        <div className="font-bold text-green-700">{contract.clauses.filter((c) => c.risk === "low").length}</div>
                        <div className="text-xs text-green-600">Low Risk</div>
                      </div>
                      <div className="flex-1 bg-yellow-50 rounded-xl p-3 text-center">
                        <div className="font-bold text-yellow-700">{contract.clauses.filter((c) => c.risk === "medium").length}</div>
                        <div className="text-xs text-yellow-600">Medium Risk</div>
                      </div>
                      <div className="flex-1 bg-red-50 rounded-xl p-3 text-center">
                        <div className="font-bold text-red-700">{contract.clauses.filter((c) => c.risk === "high").length}</div>
                        <div className="text-xs text-red-600">High Risk</div>
                      </div>
                    </div>

                    {/* Clauses */}
                    <h4 className="font-semibold text-sm mb-3">Clause Analysis</h4>
                    <div className="space-y-3">
                      {contract.clauses.map((clause, idx) => {
                        const clauseKey = `${contract.id}-${idx}`;
                        const isExpanded = expandedClause === clauseKey;
                        return (
                          <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                            <div
                              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={(e) => { e.stopPropagation(); setExpandedClause(isExpanded ? null : clauseKey); }}
                            >
                              <div className="flex items-center gap-3">
                                {riskIcon(clause.risk)}
                                <div>
                                  <span className="font-medium text-sm">{clause.title}</span>
                                  <p className="text-xs text-gray-500 mt-0.5">{clause.summary}</p>
                                </div>
                              </div>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${riskColor(clause.risk)}`}>
                                {clause.risk}
                              </span>
                            </div>
                            {isExpanded && (
                              <div className="border-t border-gray-100 px-4 py-4 bg-gray-50/50 space-y-3">
                                <div>
                                  <h5 className="text-xs font-semibold text-gray-500 uppercase mb-1">Full Detail</h5>
                                  <p className="text-sm text-gray-700 leading-relaxed">{clause.detail}</p>
                                </div>
                                <div className="bg-blue-50 rounded-lg px-4 py-3">
                                  <h5 className="text-xs font-semibold text-blue-700 uppercase mb-1">AI Recommendation</h5>
                                  <p className="text-sm text-blue-800 leading-relaxed">{clause.recommendation}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button className="inline-flex items-center gap-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                        <Download size={14} /> Download Report
                      </button>
                      <button className="inline-flex items-center gap-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                        <Eye size={14} /> View Original
                      </button>
                      <button className="inline-flex items-center gap-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors">
                        <Trash2 size={14} /> Delete
                      </button>
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
