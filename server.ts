import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  ALL_INTERNAL_PROJECTS,
  DEPARTMENTS,
  CATEGORY_FOLLOW_UPS,
} from './src/data/groundTruth.ts';
import {
  InternalAsset,
  MatchedProjectResult,
  ChatbotDiscoveryResult,
  RealisticKPIs,
} from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Deterministic multi-match scorer
function scoreAndRankProjects(
  problem: string,
  followUpAnswer?: string,
  category?: string
): MatchedProjectResult[] {
  const text = (problem + ' ' + (followUpAnswer || '') + ' ' + (category || '')).toLowerCase();

  const scored = ALL_INTERNAL_PROJECTS.map((asset) => {
    let score = 30; // base score

    const assetTokens = (
      asset.name + ' ' +
      asset.domain + ' ' +
      asset.techStack + ' ' +
      asset.modality + ' ' +
      asset.dept + ' ' +
      asset.deptFullName
    ).toLowerCase();

    // Specific domain keywords
    if (text.includes('latency') || text.includes('network') || text.includes('ip') || text.includes('failover') || text.includes('route') || text.includes('teams') || text.includes('alert')) {
      if (asset.id === 'SEC-02' || asset.id === 'SEC-01' || asset.id === 'DAT-04') score += 65;
      else if (asset.dept === 'SEC' || asset.dept === 'DAT') score += 35;
    }

    if (text.includes('invoice') || text.includes('receipt') || text.includes('ocr') || text.includes('pdf') || text.includes('extract')) {
      if (asset.id === 'IAS-02' || asset.id === 'OPM-01' || asset.id === 'FIN-03') score += 65;
      else if (asset.dept === 'IAS' || asset.dept === 'OPM' || asset.dept === 'FIN') score += 30;
    }

    if (text.includes('churn') || text.includes('predict') || text.includes('tabular') || text.includes('scoring') || text.includes('retention')) {
      if (asset.id === 'PRM-01' || asset.id === 'PRM-04' || asset.id === 'FIN-02') score += 65;
      else if (asset.dept === 'PRM' || asset.dept === 'FIN') score += 30;
    }

    if (text.includes('qa') || text.includes('q&a') || text.includes('handbook') || text.includes('policy') || text.includes('search') || text.includes('rag') || text.includes('answers')) {
      if (asset.id === 'IAS-01' || asset.id === 'CXM-04' || asset.id === 'DAT-01') score += 65;
      else if (asset.dept === 'IAS' || asset.dept === 'CXM') score += 30;
    }

    if (text.includes('clinical') || text.includes('hipaa') || text.includes('patient') || text.includes('health') || text.includes('hospital')) {
      if (asset.dept === 'HCS') score += 55;
    }

    if (text.includes('guest') || text.includes('hotel') || text.includes('room') || text.includes('review') || text.includes('hospitality')) {
      if (asset.dept === 'HOS') score += 55;
    }

    if (text.includes('supply') || text.includes('shipping') || text.includes('warehouse') || text.includes('inventory') || text.includes('pallet')) {
      if (asset.dept === 'SCM') score += 55;
    }

    if (text.includes('support') || text.includes('customer') || text.includes('call') || text.includes('chat') || text.includes('csat')) {
      if (asset.dept === 'CXM') score += 50;
    }

    // Word token overlap
    const words = text.split(/\s+/).filter((w) => w.length > 3);
    for (const w of words) {
      if (assetTokens.includes(w)) {
        score += 8;
      }
    }

    // Cap at 96%
    const finalPct = Math.min(96, Math.max(52, score));
    return {
      asset,
      score: finalPct,
    };
  });

  // Sort descending
  scored.sort((a, b) => b.score - a.score);

  // Return top 3-4 matches with calibrated percentages and roles
  const topResults = scored.slice(0, 4);

  return topResults.map((item, index) => {
    let role: 'Primary Match' | 'Alternative Match' | 'Complementary Asset' = 'Complementary Asset';
    let fitReason = `Provides complementary components in ${item.asset.deptFullName}.`;

    if (index === 0) {
      role = 'Primary Match';
      fitReason = `Directly matches core functional scope and tech requirements (${item.asset.techStack}).`;
    } else if (index === 1) {
      role = 'Alternative Match';
      fitReason = `Viable alternative deployment pattern with pre-configured ${item.asset.securityCompliance.split(',')[0]}.`;
    }

    return {
      asset: item.asset,
      matchPercentage: Math.max(58, item.score - index * 6),
      role,
      fitReason,
      reusableFeatures: [
        `Pre-built ${item.asset.deploymentPattern.split(' ')[0]} pipeline`,
        `Pre-approved ${item.asset.securityCompliance.split(',')[0]} controls`,
        `Shared compute cluster (${item.asset.estimatedRunCost})`,
      ],
    };
  });
}

// Generate realistic KPIs based on matched projects
function calculateRealisticKPIs(primaryAsset: InternalAsset): RealisticKPIs {
  let manHours = 140;
  let cost = 18000;
  let deployDays = 3;
  let buildWeeks = 6;

  if (primaryAsset.implementationEffort.includes('1 to 2 weeks')) {
    manHours = 220;
    cost = 28000;
    deployDays = 5;
    buildWeeks = 8;
  } else if (primaryAsset.implementationEffort.includes('1 to 2 days')) {
    manHours = 90;
    cost = 12000;
    deployDays = 2;
    buildWeeks = 4;
  }

  return {
    manHoursSaved: manHours,
    costAvoided: cost,
    timeToDeployDays: deployDays,
    standardBuildWeeks: buildWeeks,
  };
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    departmentsCount: DEPARTMENTS.length,
    projectsCount: ALL_INTERNAL_PROJECTS.length,
    timestamp: new Date().toISOString(),
  });
});

// Full catalog of all 50+ projects
app.get('/api/catalog', (_req: Request, res: Response) => {
  res.json({
    departments: DEPARTMENTS,
    projects: ALL_INTERNAL_PROJECTS,
    totalProjects: ALL_INTERNAL_PROJECTS.length,
  });
});

// Chatbot Step 1: Analyze prompt & return decision tree follow-up question
app.post('/api/chat/start', (req: Request, res: Response) => {
  const { prompt = '', archetype = 'answers' } = req.body;

  const lower = (prompt + ' ' + archetype).toLowerCase();

  let categoryKey = 'search_knowledge';
  if (
    lower.includes('latency') ||
    lower.includes('failover') ||
    lower.includes('network') ||
    lower.includes('ip') ||
    lower.includes('route') ||
    lower.includes('router') ||
    lower.includes('alert') ||
    lower.includes('autonomous') ||
    lower.includes('remediation') ||
    archetype === 'autonomous_agent'
  ) {
    categoryKey = 'autonomous_execution';
  } else if (
    lower.includes('invoice') ||
    lower.includes('receipt') ||
    lower.includes('ocr') ||
    lower.includes('pdf') ||
    lower.includes('extract') ||
    lower.includes('workflow') ||
    lower.includes('ticket') ||
    lower.includes('contract') ||
    archetype === 'copilot'
  ) {
    categoryKey = 'process_automation';
  } else if (
    lower.includes('churn') ||
    lower.includes('predict') ||
    lower.includes('tabular') ||
    lower.includes('scoring') ||
    lower.includes('forecast') ||
    lower.includes('sql') ||
    lower.includes('fraud') ||
    archetype === 'predictions'
  ) {
    categoryKey = 'predictive_analytics';
  }

  const followUp = CATEGORY_FOLLOW_UPS[categoryKey] || CATEGORY_FOLLOW_UPS.process_automation;

  res.json({
    category: categoryKey,
    followUp,
  });
});

// Chatbot Step 2: Evaluate prompt + follow-up answer & produce multi-match decision
app.post('/api/chat/evaluate', async (req: Request, res: Response) => {
  const { prompt, followUpAnswer, category } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    res.status(400).json({ error: 'prompt is required' });
    return;
  }

  // Pre-calculate ranked deterministic baseline from 50 projects
  const matches = scoreAndRankProjects(prompt, followUpAnswer, category);
  const primaryMatch = matches[0].asset;
  const kpis = calculateRealisticKPIs(primaryMatch);

  // Formulate what to reuse & what to build
  const whatToReuse = [
    `Core pre-built ${primaryMatch.techStack} engine and pipelines from department ${primaryMatch.dept} (${primaryMatch.deptFullName}).`,
    `Pre-approved security framework: ${primaryMatch.securityCompliance}.`,
    `Shared infrastructure allocation with zero need for new GPU cluster provisioning (${primaryMatch.estimatedRunCost}).`,
    `Operational lessons learned: ${primaryMatch.lessonsLearned}`,
  ];

  const whatToBuild = [
    `Application integration: Invoke the ${primaryMatch.id} REST endpoint with your service credentials.`,
    `Payload schema mapping: Map your incoming payload records to the standard ingestion format.`,
    `Monitoring & Notification hooks: Connect webhook alerts (Teams, Slack, or email) to match lifecycle events.`,
  ];

  const roadmap = [
    {
      phase: 'Phase 1: Access & Secret Setup',
      timeline: 'Day 1',
      title: 'Provision Access Token & Service Key',
      description: `Request tenant namespace credentials from department ${primaryMatch.dept} and store keys in HashiCorp Vault.`,
    },
    {
      phase: 'Phase 2: Client Connection',
      timeline: 'Days 2–3',
      title: 'Connect Client & Map Payload',
      description: `Integrate the ${primaryMatch.id} REST client and map data schemas into your service.`,
    },
    {
      phase: 'Phase 3: Validation & Deploy',
      timeline: 'Day 4',
      title: 'Smoke Test & Release to Production',
      description: `Execute integration tests, verify latency thresholds, and activate alerts.`,
    },
  ];

  let decisionSuggestion = `Recommendation: Reusing ${primaryMatch.name} [${primaryMatch.id}] from department ${primaryMatch.dept} eliminates duplicate development, achieves ${kpis.manHoursSaved} saved engineering hours, and bypasses custom infra overhead.`;

  // Try Gemini AI to enhance decision summary if key is available
  try {
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    const aiPrompt = `User Problem: ${prompt}
Follow-up Answer: ${followUpAnswer || 'Standard enterprise configuration'}
Category: ${category || 'General'}
Primary Matched Project: ${primaryMatch.id} - ${primaryMatch.name} (Department: ${primaryMatch.dept})
Other Matches: ${matches.map((m) => `${m.asset.id} (${m.asset.dept}, ${m.matchPercentage}%)`).join(', ')}

In 2 short sentences, provide an executive recommendation advising why adopting internal project ${primaryMatch.id} from ${primaryMatch.dept} is the best decision over building from scratch.`;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: aiPrompt,
          config: { temperature: 0.2 },
        });
        if (response.text) {
          decisionSuggestion = response.text.trim();
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} unavailable:`, err?.message || err);
      }
    }
  } catch (err) {
    console.warn('AI enhancement skipped, using structured decision baseline');
  }

  const result: ChatbotDiscoveryResult = {
    decisionSuggestion,
    matchedProjects: matches,
    kpis,
    whatToReuse,
    whatToBuild,
    implementationRoadmap: roadmap,
  };

  res.json({
    success: true,
    data: result,
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
