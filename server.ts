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

// Generate realistic KPIs based on matched projects
function calculateRealisticKPIs(asset: InternalAsset): RealisticKPIs {
  let manHours = 140;
  let cost = 18000;
  let deployDays = 3;
  let buildWeeks = 6;

  if (asset.implementationEffort.includes('3 to 5 days') || asset.implementationEffort.includes('2 to 4 days')) {
    manHours = 160;
    cost = 21000;
    deployDays = 4;
    buildWeeks = 7;
  } else if (asset.implementationEffort.includes('1 to 2 weeks')) {
    manHours = 220;
    cost = 28000;
    deployDays = 5;
    buildWeeks = 8;
  } else if (asset.implementationEffort.includes('1 to 2 days')) {
    manHours = 85;
    cost = 11500;
    deployDays = 2;
    buildWeeks = 3;
  }

  return {
    manHoursSaved: manHours,
    costAvoided: cost,
    timeToDeployDays: deployDays,
    standardBuildWeeks: buildWeeks,
  };
}

// Generate tailored blueprint (scope, reuse, build, roadmap, rationale) for any internal asset
function generateBlueprintForAsset(asset: InternalAsset, _problem: string = '') {
  const kpis = calculateRealisticKPIs(asset);

  const whatToReuse = [
    `Core pre-built ${asset.techStack} engine and pipelines from department ${asset.dept} (${asset.deptFullName}).`,
    `Pre-approved security framework: ${asset.securityCompliance}.`,
    `Shared infrastructure allocation with zero need for new standalone cluster provisioning (${asset.estimatedRunCost}).`,
    `Operational lessons learned: ${asset.lessonsLearned}`,
  ];

  const primaryModality = asset.modality.split(',')[0].trim();
  const whatToBuild = [
    `Application integration: Invoke the ${asset.id} API / client daemon with your service credentials.`,
    `Payload schema mapping: Map your incoming payload records to the standard ${primaryModality} format.`,
    `Event & Alert dispatchers: Connect telemetry hooks and webhooks (Teams, email, Prometheus) to pipeline state changes.`,
  ];

  const roadmap = [
    {
      phase: 'Phase 1: Access & Secret Setup',
      timeline: 'Day 1',
      title: 'Provision Service Access & Keys',
      description: `Request tenant namespace credentials from department ${asset.dept} and store keys in HashiCorp Vault.`,
    },
    {
      phase: 'Phase 2: Client Connection & Integration',
      timeline: 'Days 2–3',
      title: `Integrate ${asset.id} Client & Schemas`,
      description: `Connect to ${asset.name} (${asset.techStack}) and configure payload ingestion pipeline.`,
    },
    {
      phase: 'Phase 3: Validation & Deploy',
      timeline: 'Day 4',
      title: 'Smoke Test, Verify Thresholds & Go-Live',
      description: `Execute end-to-end integration tests, verify SLA thresholds, and activate real-time alerts.`,
    },
  ];

  const architectureRationale = `Reusing ${asset.name} [${asset.id}] from department ${asset.dept} eliminates duplicate development, achieves ~${kpis.manHoursSaved} saved engineering hours, and bypasses custom infra overhead.`;

  return {
    kpis,
    whatToReuse,
    whatToBuild,
    implementationRoadmap: roadmap,
    architectureRationale,
  };
}

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

    // Network failover, latency, IP routing, Teams alerting (User's primary scenario)
    if (
      text.includes('latency') ||
      text.includes('failover') ||
      text.includes('route') ||
      text.includes('ip') ||
      text.includes('link') ||
      text.includes('hop') ||
      text.includes('jitter') ||
      text.includes('teams') ||
      text.includes('mail') ||
      text.includes('email') ||
      text.includes('alert') ||
      text.includes('threshold')
    ) {
      if (asset.id === 'NRE-01') score += 70; // Dynamic Link Failover & Alternate Route Switcher
      else if (asset.id === 'HCS-01') score += 68; // Source-to-Destination IP Device Latency Monitor
      else if (asset.id === 'OPM-03') score += 64; // Automated Teams & Email Incident Notification Bridge
      else if (asset.id === 'NRE-02') score += 60; // Packet Loss & Device Latency Threshold Alerting Bus
      else if (asset.id === 'HCS-02') score += 56; // SD-WAN Dynamic Multi-Path Link Quality Controller
      else if (asset.id === 'OPM-01') score += 48;
      else if (asset.dept === 'NRE' || asset.dept === 'HCS' || asset.dept === 'OPM') score += 40;
    }

    // Infrastructure as a Service (IaaS) & Cloud Provisioning
    if (text.includes('vpc') || text.includes('subnet') || text.includes('vm') || text.includes('bare metal') || text.includes('storage') || text.includes('iaas') || text.includes('transit') || text.includes('cloud')) {
      if (asset.dept === 'IAS') score += 60;
    }

    // Security & Compliance
    if (text.includes('security') || text.includes('firewall') || text.includes('zero trust') || text.includes('mtls') || text.includes('dlp') || text.includes('pii') || text.includes('intrusion') || text.includes('iam')) {
      if (asset.dept === 'SEC') score += 60;
    }

    // Network Reliability Engineering
    if (text.includes('reliability') || text.includes('circuit') || text.includes('peering') || text.includes('bgp') || text.includes('packet loss')) {
      if (asset.dept === 'NRE') score += 60;
    }

    // Platform Resource Management (PRM)
    if (text.includes('quota') || text.includes('gpu') || text.includes('qos') || text.includes('capacity') || text.includes('bin-pack') || text.includes('headroom') || text.includes('prm') || text.includes('defragment')) {
      if (asset.dept === 'PRM') score += 60;
    }

    // Operations & Runbooks & Broadcast Alerts
    if (text.includes('incident') || text.includes('triage') || text.includes('on-call') || text.includes('runbook') || text.includes('maintenance') || text.includes('rma') || text.includes('notification')) {
      if (asset.dept === 'OPM') score += 60;
    }

    // Hosting Services
    if (text.includes('hosting') || text.includes('kubernetes') || text.includes('k8s') || text.includes('cluster') || text.includes('datacenter') || text.includes('anycast dns')) {
      if (asset.dept === 'HOS') score += 60;
    }

    // Site Reliability Engineering & SLOs
    if (text.includes('slo') || text.includes('error budget') || text.includes('synthetic') || text.includes('tracing') || text.includes('chaos')) {
      if (asset.dept === 'SRE') score += 60;
    }

    // Data Platform & Telemetry
    if (text.includes('flow log') || text.includes('netflow') || text.includes('syslog') || text.includes('timeseries') || text.includes('telemetry')) {
      if (asset.dept === 'DAT') score += 60;
    }

    // FinOps & Cost
    if (text.includes('cost') || text.includes('finops') || text.includes('egress') || text.includes('budget') || text.includes('spend')) {
      if (asset.dept === 'FIN') score += 60;
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

    const blueprint = generateBlueprintForAsset(item.asset, problem);

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
      kpis: blueprint.kpis,
      whatToReuse: blueprint.whatToReuse,
      whatToBuild: blueprint.whatToBuild,
      implementationRoadmap: blueprint.implementationRoadmap,
      architectureRationale: blueprint.architectureRationale,
    };
  });
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
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 3500)
        );
        const aiPromise = ai.models.generateContent({
          model,
          contents: aiPrompt,
          config: { temperature: 0.2 },
        });

        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        if (response && response.text) {
          decisionSuggestion = response.text.trim();
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} unavailable or timed out:`, err?.message || err);
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

// Chatbot Step 3: Tailor scope and blueprint for any user-selected lower match
app.post('/api/chat/tailor-asset', async (req: Request, res: Response) => {
  const { prompt = '', assetId } = req.body;

  const targetAsset = ALL_INTERNAL_PROJECTS.find((a) => a.id === assetId);
  if (!targetAsset) {
    res.status(404).json({ error: 'Asset not found' });
    return;
  }

  const blueprint = generateBlueprintForAsset(targetAsset, prompt);
  let rationale = blueprint.architectureRationale;

  try {
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    const aiPrompt = `User Problem: ${prompt || 'Enterprise automation project'}
Selected Target Asset: ${targetAsset.id} - ${targetAsset.name} (Department: ${targetAsset.dept} - ${targetAsset.deptFullName})
Tech Stack: ${targetAsset.techStack}
Compliance: ${targetAsset.securityCompliance}
Deployment: ${targetAsset.deploymentPattern}

In 2 short sentences, provide an executive recommendation advising how and why adopting this specific internal project (${targetAsset.id}) satisfies the user problem over building from scratch.`;

    for (const model of candidateModels) {
      try {
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 3500)
        );
        const aiPromise = ai.models.generateContent({
          model,
          contents: aiPrompt,
          config: { temperature: 0.2 },
        });

        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        if (response && response.text) {
          rationale = response.text.trim();
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} tailor unavailable:`, err?.message || err);
      }
    }
  } catch (err) {
    console.warn('AI tailor skipped, using structured baseline');
  }

  res.json({
    success: true,
    data: {
      asset: targetAsset,
      kpis: blueprint.kpis,
      whatToReuse: blueprint.whatToReuse,
      whatToBuild: blueprint.whatToBuild,
      implementationRoadmap: blueprint.implementationRoadmap,
      architectureRationale: rationale,
    },
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
