export interface InternalAsset {
  id: string;
  name: string;
  dept: 'HCS' | 'IAS' | 'SEC' | 'PRM' | 'OPM' | 'HOS' | 'FIN' | 'SCM' | 'DAT' | 'CXM' | string;
  deptFullName: string;
  domain: string;
  techStack: string;
  modality: string;
  securityCompliance: string;
  deploymentPattern: string;
  reusability: string;
  implementationEffort: string;
  estimatedRunCost: string;
  lessonsLearned: string;
  matchPercentage?: number;
  matchReason?: string;
}

export interface MatchedProjectResult {
  asset: InternalAsset;
  matchPercentage: number;
  role: 'Primary Match' | 'Alternative Match' | 'Complementary Asset';
  fitReason: string;
  reusableFeatures: string[];
}

export interface RealisticKPIs {
  manHoursSaved: number; // e.g. 140 hrs
  costAvoided: number; // e.g. $17,500
  timeToDeployDays: number; // e.g. 3 days
  standardBuildWeeks: number; // e.g. 7 weeks
}

export interface ImplementationPlanItem {
  phase: string;
  timeline: string;
  title: string;
  description: string;
}

export interface FollowUpQuestion {
  id: string;
  category: string;
  question: string;
  options: {
    label: string;
    description: string;
    value: string;
  }[];
}

export interface ChatbotDiscoveryResult {
  decisionSuggestion: string;
  matchedProjects: MatchedProjectResult[];
  kpis: RealisticKPIs;
  whatToReuse: string[];
  whatToBuild: string[];
  implementationRoadmap: ImplementationPlanItem[];
}

export type IntentArchetype = 'answers' | 'copilot' | 'predictions' | 'autonomous_agent';
export type ValueDriver = 'Productivity gain' | 'Revenue gain' | 'Both';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text?: string;
  isFollowUp?: boolean;
  followUpData?: FollowUpQuestion;
  resultData?: ChatbotDiscoveryResult;
}
