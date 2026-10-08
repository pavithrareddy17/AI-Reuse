import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Server,
  Sparkles,
  GitBranch,
  Bot,
  Building2,
  Zap,
  Lock,
  Workflow,
  Share2,
  Code2,
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visual' | 'flow' | 'stack' | 'mermaid'>('visual');
  const [copied, setCopied] = useState(false);

  const mermaidCode = `graph TD
    %% User & Client Layer
    subgraph ClientLayer ["1. Client Presentation Layer (React 19 + TypeScript + Tailwind CSS)"]
        UI_User["Enterprise User / Innovation Squad"]
        UI_Archetype["Intent Archetype Selector<br/>(Answers | Copilot | Predictions | Agent)"]
        UI_Chat["Interactive Decision Chatbot<br/>(Dynamic Follow-up Questioning)"]
        UI_Catalog["50+ Department Projects Explorer<br/>(10 Business Divisions)"]
        UI_FinOps["FinOps & Reuse KPI Dashboard<br/>(Man-hours Saved & Cost Avoidance)"]
    end

    %% Backend Gateway
    subgraph GatewayLayer ["2. API Gateway & Middleware (Node.js + Express.js)"]
        BFF_Server["BFF Server & Route Controller<br/>(server.ts / Port 3000)"]
        EP_Health["GET /api/health<br/>(Key Telemetry & Diagnostics)"]
        EP_Catalog["GET /api/catalog<br/>(50 Projects across 10 Depts)"]
        EP_ChatStart["POST /api/chat/start<br/>(Archetype & Taxonomy Classifier)"]
        EP_Evaluate["POST /api/chat/evaluate<br/>(Multi-Match Scorer & Synthesis)"]
    end

    %% Intelligence & Core Engine
    subgraph IntelligenceLayer ["3. Intelligence & Decision Orchestration Engine"]
        Engine_Taxonomy["Decision Tree Taxonomy Engine<br/>(4 Intent Branches & 12 Specialized Paths)"]
        Engine_Scorer["Multi-Factor Project Scoring Engine<br/>(Domain, Stack, Compliance, Modality Match)"]
        Engine_KPI["FinOps & Realistic KPI Estimator<br/>(Calibrated Man-hours, Cost & Timeline)"]
        Engine_GenAI["Google GenAI Integration (@google/genai SDK)<br/>(Dual-Model Failover & Telemetry)"]
    end

    %% Models & Fallback
    subgraph AIModels ["4. Generative AI Models & High-Availability Fallback"]
        Model_FlashLite["Primary: Gemini 3.1 Flash Lite<br/>(Ultra-low latency executive synthesis)"]
        Model_Flash["Secondary Fallback: Gemini 3.8 Flash<br/>(Complex multi-criteria synthesis)"]
        Model_Deterministic["Offline Fallback: Deterministic Rule Synthesizer<br/>(100% Zero-failure enterprise guarantee)"]
    end

    %% Enterprise Knowledge Base
    subgraph KnowledgeLayer ["5. Enterprise Knowledge & Asset Registry"]
        Repo_Depts["10 Enterprise Departments<br/>(HCS, IAS, SEC, PRM, OPM, HOS, FIN, SCM, DAT, CXM)"]
        Repo_Assets["50+ Production Internal Assets<br/>(Tech stack, compliance, deployment patterns, lessons)"]
    end

    %% Connections
    UI_User --> UI_Archetype
    UI_Archetype --> UI_Chat
    UI_Chat -->|HTTP REST Payload| EP_ChatStart
    UI_Chat -->|Follow-up Selection| EP_Evaluate
    UI_Catalog --> EP_Catalog

    BFF_Server --> EP_Health
    BFF_Server --> EP_Catalog
    BFF_Server --> EP_ChatStart
    BFF_Server --> EP_Evaluate

    EP_ChatStart --> Engine_Taxonomy
    EP_Evaluate --> Engine_Scorer
    EP_Evaluate --> Engine_KPI
    EP_Evaluate --> Engine_GenAI

    Engine_Scorer --> Repo_Assets
    Engine_Taxonomy --> Repo_Depts

    Engine_GenAI -->|Try 1| Model_FlashLite
    Model_FlashLite -.->|On 503 / High Demand| Model_Flash
    Model_Flash -.->|On Network / API failure| Model_Deterministic

    Engine_Scorer --> UI_FinOps
    Engine_GenAI --> UI_Chat`;

  const handleCopyMermaid = () => {
    navigator.clipboard.writeText(mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Full-Stack Enterprise Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Solution Architecture &amp; System Flow
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              End-to-end layered architecture specification for the AI Solution Discovery &amp; Reuse Intelligence Engine.
              Built for high reliability with dual-engine failover, zero-loss deterministic matching, and enterprise governance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMermaid}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Diagram!' : 'Copy Mermaid Code'}</span>
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'visual'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Interactive Visual Architecture</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('flow')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'flow'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Request Lifecycle &amp; Data Flow</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stack')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'stack'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Technology Stack Inventory</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mermaid')}
            className={`px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'mermaid'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Mermaid / Docs Markdown</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Visual Architecture Diagram */}
      {activeTab === 'visual' && (
        <div className="space-y-6">
          {/* Layer 1: Client Presentation Layer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Client Presentation Layer (SPA)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                React 19 • Vite • TypeScript • Tailwind CSS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <Bot className="w-4 h-4 text-indigo-500" />
                  <span>Intent Selector</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  4 user intent tabs (Answers, Copilot, Predictions, AI Agent Platform) mapped to real user queries.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <GitBranch className="w-4 h-4 text-emerald-500" />
                  <span>Decision Chatbot</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Interactive multi-turn conversation providing tailored follow-up options based on problem category.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <Building2 className="w-4 h-4 text-amber-500" />
                  <span>10-Dept Repository</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instant search, filtering, and inspection across 50 production assets from HCS, IAS, SEC, PRM, and more.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span>FinOps KPI &amp; Roadmap</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Live calculation of man-hours saved, cost avoided, and 3-phase adoption blueprints.
                </p>
              </div>
            </div>
          </div>

          {/* Connection Line */}
          <div className="flex justify-center -my-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
              <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              <span>HTTP REST (JSON Payloads / CORS-safe / Vite Middleware)</span>
            </div>
          </div>

          {/* Layer 2: API Gateway & Backend for Frontend (BFF) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Backend API Gateway &amp; Middleware Layer
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Node.js • Express.js • TSX • Port 3000
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  GET /api/health
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Telemetry health check, verifying Gemini API key status, model availability, and repository counts.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  GET /api/catalog
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Serves 50 enterprise assets with department metadata, compliance profiles, and cost metrics.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  POST /api/chat/start
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Extracts problem category and delivers context-aware decision tree follow-up options.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  POST /api/chat/evaluate
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Executes multi-project match scoring, Gemini generative synthesis, and FinOps calculations.
                </p>
              </div>
            </div>
          </div>

          {/* Connection Line */}
          <div className="flex justify-center -my-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              <span>Orchestrates Scoring, Taxonomy &amp; AI Evaluation</span>
            </div>
          </div>

          {/* Layer 3: Intelligence & Dual-Engine Failover */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Deterministic Scoring Engine */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                    3A
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Multi-Factor Project Match Engine
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                  Deterministic Baseline
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-slate-900 dark:text-white">Token &amp; Keyword Cross-Matching:</strong> Evaluates problem text against domain lexicons (e.g. latency, failover, OCR, churn, RAG).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-slate-900 dark:text-white">Department Affinity Scoring:</strong> Weighs project relevance across 10 distinct divisions (HCS, SEC, IAS, etc.).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-slate-900 dark:text-white">Calibrated Match Percentages:</strong> Generates ranked top 4 matches with Primary, Alternative, and Complementary roles.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <span>
                    <strong className="text-slate-900 dark:text-white">FinOps Quantifier:</strong> Maps implementation effort to realistic saved hours (90–220 hrs) and cost avoidance ($12k–$28k).
                  </span>
                </li>
              </ul>
            </div>

            {/* GenAI Engine & Resilience */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center">
                    3B
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Dual-Model AI Fallback &amp; Synthesis
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                  @google/genai SDK
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-2.5 rounded-lg border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="font-semibold text-slate-900 dark:text-white">Tier 1: gemini-3.1-flash-lite</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900 px-2 py-0.5 rounded">
                    Fastest Execution
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-slate-900 dark:text-white">Tier 2: gemini-3.8-flash</span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                    Failover Model
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-slate-900 dark:text-white">Tier 3: Institutional Rule Synthesizer</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Zero-Downtime Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Layer 4: Enterprise Knowledge Repository */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Enterprise Knowledge Repository (10 Departments • 50 Certified Assets)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                Ground Truth Assets
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
              {[
                { code: 'HCS', name: 'Healthcare & Clinical Services', count: 5 },
                { code: 'IAS', name: 'Intelligent Automation & OCR', count: 5 },
                { code: 'SEC', name: 'Security & Network Operations', count: 5 },
                { code: 'PRM', name: 'Predictive Modeling & Churn', count: 5 },
                { code: 'OPM', name: 'Operations & Process Mgmt', count: 5 },
                { code: 'HOS', name: 'Hospitality & Guest Experience', count: 5 },
                { code: 'FIN', name: 'Financial Systems & Invoicing', count: 5 },
                { code: 'SCM', name: 'Supply Chain & Logistics', count: 5 },
                { code: 'DAT', name: 'Data Engineering & Streaming', count: 5 },
                { code: 'CXM', name: 'Customer Experience & CRM', count: 5 },
              ].map((d) => (
                <div key={d.code} className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                  <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{d.code}</div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 truncate mt-0.5">{d.name}</div>
                  <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{d.count} Assets</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Request Lifecycle & Data Flow Sequence */}
      {activeTab === 'flow' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              End-to-End Discovery &amp; Reuse Execution Lifecycle
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Step-by-step sequence from raw user problem statement to multi-match decision and actionable deployment roadmap.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'User Intent Formulation & Archetype Selection',
                desc: 'The user selects an Intent archetype (Answers, Copilot, Predictions, or AI Agent) or types an open problem statement (e.g. "Identify network device latency spikes between IPs, alert Teams and execute link failover").',
                tags: ['Frontend Client', 'Intent Matrix', 'User Query'],
              },
              {
                step: '02',
                title: 'POST /api/chat/start - Category & Decision Tree Branching',
                desc: 'Backend analyzes the lexical tokens and archetype, identifying the core problem category (e.g., autonomous_execution). It returns a tailored decision tree question with options (e.g., Target SLA latency, Remediation level).',
                tags: ['Express Backend', 'CATEGORY_FOLLOW_UPS', 'Taxonomy Engine'],
              },
              {
                step: '03',
                title: 'User Follow-Up Response & Dynamic Refinement',
                desc: 'The user clicks one of the contextual follow-up options. The client submits both the original problem statement and follow-up selection to POST /api/chat/evaluate.',
                tags: ['Chat UI', 'Decision Fork', 'Payload Synthesis'],
              },
              {
                step: '04',
                title: 'Multi-Project Match Scoring (50 Assets across 10 Depts)',
                desc: 'The deterministic scorer tokenizes technical keywords, measures department affinity, evaluates tech stack compatibility, and calculates match percentages (58% to 96%) across all 50 registered internal assets.',
                tags: ['Ground Truth Registry', 'Affinity Scorer', 'Rank Calibration'],
              },
              {
                step: '05',
                title: 'Dual-Engine Generative AI Synthesis & Fallback Execution',
                desc: 'The backend calls @google/genai SDK with gemini-3.1-flash-lite. If experiencing high traffic or 503, it cascades to gemini-3.8-flash, and falls back to deterministic rule synthesis. The output is a clear executive recommendation.',
                tags: ['Google GenAI SDK', 'gemini-3.1-flash-lite', 'Zero-Loss Fallback'],
              },
              {
                step: '06',
                title: 'FinOps ROI Quantification & 3-Phase Adoption Roadmap',
                desc: 'Client displays the ranked matches, specific reusable features, items to build, realistic KPIs (man-hours saved, cost avoided, deployment days), and a 3-phase implementation roadmap with vault secret setup.',
                tags: ['FinOps Calculator', 'Adoption Blueprint', 'Executive Presentation'],
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div className="space-y-1.5 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Technology Stack Inventory */}
      {activeTab === 'stack' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Open-Source &amp; Third-Party Technology Stack Inventory
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Complete inventory of all runtime libraries, engines, frameworks, and APIs powering the solution.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold font-mono">
                <tr>
                  <th className="py-2.5 px-3">Component</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Version / Source</th>
                  <th className="py-2.5 px-3">Purpose &amp; Role</th>
                  <th className="py-2.5 px-3">License</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400 font-sans">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white font-mono">React</td>
                  <td className="py-2.5 px-3">Frontend Framework</td>
                  <td className="py-2.5 px-3 font-mono">^19.0.0</td>
                  <td className="py-2.5 px-3">Declarative component rendering &amp; responsive state management</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600">MIT</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white font-mono">TypeScript</td>
                  <td className="py-2.5 px-3">Language</td>
                  <td className="py-2.5 px-3 font-mono">^5.7.0</td>
                  <td className="py-2.5 px-3">Strict end-to-end data typing for assets, results, and payloads</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600">Apache 2.0</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white font-mono">Tailwind CSS</td>
                  <td className="py-2.5 px-3">Styling &amp; Design</td>
                  <td className="py-2.5 px-3 font-mono">^4.0.0</td>
                  <td className="py-2.5 px-3">Atomic responsive utilities with native Light/Dark theme switching</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600">MIT</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white font-mono">Lucide React</td>
                  <td className="py-2.5 px-3">Iconography</td>
                  <td className="py-2.5 px-3 font-mono">^1.16.0</td>
                  <td className="py-2.5 px-3">Crisp enterprise UI symbols and visual status indicators</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600">ISC</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white font-mono">Express.js</td>
                  <td className="py-2.5 px-3">Backend Runtime</td>
                  <td className="py-2.5 px-3 font-mono">^4.21.0</td>
                  <td className="py-2.5 px-3">REST API routing, request validation, and BFF endpoint execution</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600">MIT</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white font-mono">@google/genai</td>
                  <td className="py-2.5 px-3">AI / Foundation Model</td>
                  <td className="py-2.5 px-3 font-mono">^0.1.1</td>
                  <td className="py-2.5 px-3">Official SDK for Gemini 3.1 Flash Lite &amp; Gemini 3.8 Flash inference</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600">Apache 2.0</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white font-mono">Vite &amp; TSX</td>
                  <td className="py-2.5 px-3">Build &amp; Server Dev</td>
                  <td className="py-2.5 px-3 font-mono">^6.0.0</td>
                  <td className="py-2.5 px-3">Fast bundling, TypeScript compilation, and Node dev server</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600">MIT</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Mermaid / Docs Markdown */}
      {activeTab === 'mermaid' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Mermaid.js Diagram Specification
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Paste this block directly into GitHub README, Notion, GitLab, or <code className="text-indigo-600 dark:text-indigo-400">docs/architecture/solution-architecture.md</code>.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyMermaid}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
            <code>{mermaidCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
