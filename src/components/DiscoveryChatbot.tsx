import React, { useState } from 'react';
import {
  IntentArchetype,
  FollowUpQuestion,
  ChatbotDiscoveryResult,
  ChatMessage,
  MatchedProjectResult,
} from '../types.ts';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  Clock,
  DollarSign,
  Rocket,
  CheckCircle2,
  Layers,
  HelpCircle,
  RotateCcw,
  MessageSquare,
  TrendingUp,
  Cpu,
  Building2,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface Props {
  onSelectProject?: (projectId: string) => void;
}

export const DiscoveryChatbot: React.FC<Props> = () => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState<IntentArchetype>('answers');
  const [isProcessing, setIsProcessing] = useState(false);

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pendingFollowUp, setPendingFollowUp] = useState<{
    originalPrompt: string;
    category: string;
    followUp: FollowUpQuestion;
  } | null>(null);

  // Single-line width intent tabs (Requirement 8)
  const intentRows = [
    {
      id: 'answers' as IntentArchetype,
      query: '"I need answers."',
      label: 'Chatbot / Q&A Knowledge System',
      description: 'Search & question answering over policies, guidelines, and documentation.',
      icon: MessageSquare,
      sample: 'We need an internal conversational Q&A system for 10,000 staff to query company HR policies and handbook with strict PII masking.',
    },
    {
      id: 'copilot' as IntentArchetype,
      label: 'Copilot / Workflow Assistant',
      query: '"I need help doing my work."',
      description: 'Extracting data from files, invoices, receipts, and automating multi-step office tasks.',
      icon: Bot,
      sample: 'We process 25,000 vendor PDF invoices and photo receipts every month and need to extract line items and tax totals automatically.',
    },
    {
      id: 'predictions' as IntentArchetype,
      label: 'Machine Learning / Predictive Analytics',
      query: '"I need predictions."',
      description: 'Real-time tabular scoring, customer churn forecasting, and risk analysis.',
      icon: TrendingUp,
      sample: 'We need to predict customer churn probability in real time (under 50ms) during user sessions using historical SQL transaction data.',
    },
    {
      id: 'autonomous_agent' as IntentArchetype,
      label: 'AI Agent Platform / Automated Action',
      query: '"I need autonomous execution and decision support."',
      description: 'Monitoring events, dynamic link failover, automated tool actions, and incident alerts.',
      icon: Cpu,
      sample: 'We need to identify network device latency spikes between IPs, automatically alert Teams and email, and execute route link failover.',
    },
  ];

  const handleSelectArchetypeRow = (row: typeof intentRows[0]) => {
    setSelectedArchetype(row.id);
    setInputPrompt(row.sample);
  };

  // Step 1: User submits their prompt
  const handleStartDiscovery = async (promptToUse?: string) => {
    const text = (promptToUse || inputPrompt).trim();
    if (!text || isProcessing) return;

    setIsProcessing(true);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');

    try {
      const response = await fetch('/api/chat/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, archetype: selectedArchetype }),
      });

      const data = await response.json();
      const followUp: FollowUpQuestion = data.followUp;

      setPendingFollowUp({
        originalPrompt: text,
        category: data.category,
        followUp,
      });

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFollowUp: true,
        followUpData: followUp,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Failed to get follow-up:', err);
      // Directly evaluate if step 1 fails
      handleEvaluateDirectly(text);
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2: User answers the decision tree follow-up question
  const handleAnswerFollowUp = async (optionValue: string, optionLabel: string) => {
    if (!pendingFollowUp || isProcessing) return;

    const followUpInfo = pendingFollowUp;
    setPendingFollowUp(null);
    setIsProcessing(true);

    const userResponseMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Selected: ${optionLabel}`,
    };

    setMessages((prev) => [...prev, userResponseMsg]);

    try {
      const response = await fetch('/api/chat/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: followUpInfo.originalPrompt,
          followUpAnswer: optionValue,
          category: followUpInfo.category,
        }),
      });

      const resData = await response.json();
      const result: ChatbotDiscoveryResult = resData.data;

      const finalMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        resultData: result,
      };

      setMessages((prev) => [...prev, finalMsg]);
    } catch (err) {
      console.error('Failed to evaluate:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEvaluateDirectly = async (text: string) => {
    try {
      const response = await fetch('/api/chat/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      const resData = await response.json();
      const finalMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        resultData: resData.data,
      };
      setMessages((prev) => [...prev, finalMsg]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setPendingFollowUp(null);
    setInputPrompt('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Solution Discovery &amp; Decision Assistant</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Interactive Solution Matcher &amp; Decision Guide
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Enter your project idea. Our assistant asks follow-up qualification questions and recommends matching internal projects across 10 enterprise departments.
            </p>
          </div>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Conversation</span>
            </button>
          )}
        </div>

        {/* 1. SINGLE-LINE WIDTH TABS (Requirement 8) */}
        {messages.length === 0 && (
          <div className="mt-5 space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              What are your users fundamentally asking for? (Select or describe below)
            </label>
            <div className="space-y-2">
              {intentRows.map((row) => {
                const isSelected = selectedArchetype === row.id;
                const IconComp = row.icon;
                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => handleSelectArchetypeRow(row)}
                    className={`w-full p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 text-slate-900 dark:text-white ring-1 ring-indigo-500/30'
                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                            {row.query}
                          </span>
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hidden md:inline">
                            — {row.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {row.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hidden sm:inline">
                        Use Example
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Input Bar (if no active conversation or to continue) */}
        <div className="mt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleStartDiscovery();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Describe your project (e.g., monitor device latency and execute failover, invoice OCR, policy Q&A)..."
              disabled={isProcessing}
              className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isProcessing}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Start</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Conversation Thread */}
      {messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              {/* User Message */}
              {msg.sender === 'user' && (
                <div className="flex items-start justify-end gap-2.5">
                  <div className="max-w-2xl bg-indigo-600 text-white rounded-2xl rounded-tr-sm p-4 text-xs sm:text-sm shadow-sm leading-relaxed">
                    {msg.text}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-700 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    <User className="w-4 h-4" />
                  </div>
                </div>
              )}

              {/* Assistant Message with Follow-Up Question (Requirement 1: Decision Tree in Chat) */}
              {msg.sender === 'assistant' && msg.isFollowUp && msg.followUpData && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm p-5 shadow-sm space-y-3.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        Follow-Up Qualification
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {msg.followUpData.category}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      {msg.followUpData.question}
                    </p>

                    {/* Options (Decision Tree branches) */}
                    <div className="space-y-2 pt-1">
                      {msg.followUpData.options.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleAnswerFollowUp(opt.value, opt.label)}
                          disabled={isProcessing}
                          className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition cursor-pointer group"
                        >
                          <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center justify-between">
                            <span>{opt.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {opt.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Assistant Message with Final Evaluation & Multiple Matches (Requirements 1, 2, 3, 4, 6, 7) */}
              {msg.sender === 'assistant' && msg.resultData && (
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1 max-w-4xl space-y-4">
                    {/* Executive Suggestion / Decision Card */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Architectural Decision &amp; Suggestion</span>
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                        {msg.resultData.decisionSuggestion}
                      </p>
                    </div>

                    {/* REALISTIC KPIS (Requirement 7: 120-220 hrs, $15-28k, 3-5 days) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Man-Hours Saved
                          </span>
                          <Clock className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                          ~{msg.resultData.kpis.manHoursSaved} hrs
                        </div>
                        <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                          Bypasses {msg.resultData.kpis.standardBuildWeeks} weeks of redundant dev
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Cost Avoided
                          </span>
                          <DollarSign className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                          ${msg.resultData.kpis.costAvoided.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                          Redundant engineering &amp; cloud setup
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Time to Deploy
                          </span>
                          <Rocket className="w-4 h-4 text-purple-500" />
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                          {msg.resultData.kpis.timeToDeployDays} Days
                        </div>
                        <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-0.5">
                          vs. {msg.resultData.kpis.standardBuildWeeks} weeks custom scratch build
                        </div>
                      </div>
                    </div>

                    {/* MULTIPLE MATCHES (Requirement 6: show them all with percentage and department name) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Matched Internal Projects ({msg.resultData.matchedProjects.length} Matches Found)
                          </h3>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          Ranked by Architecture Fit
                        </span>
                      </div>

                      <div className="space-y-3">
                        {msg.resultData.matchedProjects.map((matchItem, idx) => (
                          <div
                            key={matchItem.asset.id}
                            className={`p-4 rounded-xl border transition ${
                              idx === 0
                                ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-500 ring-1 ring-indigo-500/20'
                                : 'bg-slate-50/60 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-indigo-600 text-white">
                                  {matchItem.asset.id}
                                </span>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">
                                  {matchItem.asset.name}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Department Badge (Requirement 4: just dept names) */}
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                                  <Building2 className="w-3 h-3 text-indigo-500" />
                                  <span>Dept: {matchItem.asset.dept}</span>
                                </span>

                                {/* Match percentage badge (Requirement 6) */}
                                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                                  {matchItem.matchPercentage}% Match
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 mb-2.5">
                              {matchItem.fitReason}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60 pt-2">
                              <span>Department: <strong>{matchItem.asset.deptFullName}</strong></span>
                              <span>•</span>
                              <span>Tech: <strong className="font-mono text-slate-700 dark:text-slate-300">{matchItem.asset.techStack}</strong></span>
                              <span>•</span>
                              <span>Run Cost: <strong>{matchItem.asset.estimatedRunCost}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* WHAT TO IMPLEMENT: What to Reuse vs What to Build (No code snippets, no pros/cons) */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Scope &amp; Implementation Blueprint
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Clear distinction between pre-built department assets and your application tasks.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* What to Reuse */}
                        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 space-y-2">
                          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>What You Reuse From Department</span>
                          </div>
                          <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                            {msg.resultData.whatToReuse.map((item, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* What to Build */}
                        <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 space-y-2">
                          <div className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span>What Your Team Implements</span>
                          </div>
                          <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
                            {msg.resultData.whatToBuild.map((item, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-indigo-600 font-bold">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 3-Step Execution Roadmap */}
                      <div className="pt-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                          Game Plan:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {msg.resultData.implementationRoadmap.map((step, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1"
                            >
                              <div className="flex items-center justify-between text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                                <span>{step.timeline}</span>
                                <span className="text-slate-400 text-[10px]">Step {idx + 1}</span>
                              </div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                {step.title}
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isProcessing && (
            <div className="flex items-center gap-2 p-3 text-xs text-slate-500 dark:text-slate-400 italic">
              <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span>Matching against 50+ enterprise projects across 10 departments...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
