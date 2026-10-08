# Solution Architecture Document: AI Solution Discovery & Reuse Intelligence Engine

**Document Reference**: `docs/architecture/solution-architecture.md`  
**Application**: AI Solution Discovery & Reuse Intelligence Engine  
**Target Enterprise**: Multi-Department Enterprise (10 Divisions, 50+ Certified Production Assets)  
**Classification**: Internal Enterprise Tooling / Hackathon Architecture Deliverable  

---

## 1. Executive Architecture Overview

The **AI Solution Discovery & Reuse Intelligence Engine** is a high-availability enterprise decision engine designed to eliminate redundant AI engineering, enforce institutional reuse, and provide instant technical match recommendations across 10 functional business divisions (HCS, IAS, SEC, PRM, OPM, HOS, FIN, SCM, DAT, CXM).

The solution utilizes a **layered hybrid architecture** coupling a responsive React 19 Single Page Application (SPA), a Node.js/Express.js Backend-For-Frontend (BFF), a deterministic token-affinity scoring engine, and Google Gemini foundation models with automated dual-model failover (`gemini-3.1-flash-lite` → `gemini-3.8-flash` → deterministic rule synthesis).

```
+-----------------------------------------------------------------------------------+
|                        1. CLIENT PRESENTATION LAYER                                |
|          React 19 + TypeScript + Tailwind CSS (Light & Dark Mode Support)          |
|  +--------------------+  +----------------------+  +----------------------------+  |
|  |  Intent Archetype  |  | Interactive Decision |  |  50+ Reusable Asset Catalog |  |
|  |  Selector (4 Rows) |  |   Chatbot (2-Turn)   |  |   (10 Enterprise Depts)    |  |
|  +--------------------+  +----------------------+  +----------------------------+  |
+-----------------------------------------+-----------------------------------------+
                                          | HTTP REST (JSON / CORS-safe)
                                          v
+-----------------------------------------------------------------------------------+
|                  2. API GATEWAY & BACKEND-FOR-FRONTEND (BFF)                      |
|                  Node.js + Express.js Engine (server.ts / Port 3000)               |
|  +--------------------+  +----------------------+  +----------------------------+  |
|  |   GET /api/health  |  |   GET /api/catalog   |  |     POST /api/chat/start   |  |
|  | (Diagnostics & Key)|  |  (50 Production Reps)|  | (Category Follow-Up Branch)|  |
|  +--------------------+  +----------------------+  +----------------------------+  |
|                          |    POST /api/chat/evaluate                            |  |
|                          | (Scoring + AI Synthesis + FinOps Roadmap)             |  |
|                          +-------------------------------------------------------+  |
+-----------------------------------------+-----------------------------------------+
                                          |
        +---------------------------------+---------------------------------+
        v                                                                   v
+---------------------------------------+   +---------------------------------------+
|  3A. DETERMINISTIC MULTI-MATCH SCORER  |   | 3B. GENAI DUAL-MODEL SYNTHESIS ENGINE |
| - Lexical token cross-matching        |   | - @google/genai TypeScript SDK        |
| - 10-department affinity weighting    |   | - Primary: gemini-3.1-flash-lite      |
| - Tech stack & compliance calibration |   | - Secondary Fallback: gemini-3.8-flash|
| - Realistic FinOps calculator         |   | - Failover: Institutional rule engine |
+-------------------+-------------------+   +-------------------+-------------------+
                    |                                           |
                    +---------------------+---------------------+
                                          v
+-----------------------------------------------------------------------------------+
|                  4. ENTERPRISE KNOWLEDGE REPOSITORY & GROUND TRUTH                |
|              50 Certified Production Projects Across 10 Business Units             |
|   HCS (Healthcare)   | IAS (Automation/OCR) | SEC (Network/Latency) | PRM (Churn) |
|   OPM (Operations)   | HOS (Hospitality)    | FIN (Finance/Billing) | SCM (Logist)|
|   DAT (Data Streams) | CXM (Customer Exp)                                         |
+-----------------------------------------------------------------------------------+
```

---

## 2. End-to-End Mermaid Architecture Diagram

```mermaid
graph TD
    %% User & Client Layer
    subgraph ClientLayer ["1. Client Presentation Layer (React 19 + TypeScript + Tailwind CSS)"]
        UI_User["Enterprise User / Innovation Squad"]
        UI_Archetype["Intent Archetype Selector<br/>(Answers | Copilot | Predictions | Agent)"]
        UI_Chat["Interactive Decision Chatbot<br/>(Dynamic Follow-up Questioning)"]
        UI_Catalog["50+ Department Projects Explorer<br/>(10 Business Divisions)"]
        UI_FinOps["FinOps & Reuse KPI Dashboard<br/>(Man-hours Saved & Cost Avoidance)"]
        UI_Arch["Interactive Architecture Viewer<br/>(System Diagram & Docs Export)"]
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
    UI_Arch --> BFF_Server

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

    Engine_GenAI -->|Try 1: Primary| Model_FlashLite
    Model_FlashLite -.->|On 503 / High Demand| Model_Flash
    Model_Flash -.->|On Network / API failure| Model_Deterministic

    Engine_Scorer --> UI_FinOps
    Engine_GenAI --> UI_Chat
```

---

## 3. Layer-by-Layer Architectural Breakdown

### 3.1 Layer 1: Client Presentation Layer
* **Technologies**: React 19, TypeScript, Tailwind CSS, Lucide React icons.
* **Responsibilities**:
  1. **Intent Formulation**: Provides 4 single-line width Intent tabs based on standard user demands:
     - *"I need answers."* → Chatbot / Q&A Knowledge System
     - *"I need help doing my work."* → Copilot / Workflow Assistant
     - *"I need predictions."* → Machine Learning / Predictive Analytics
     - *"I need autonomous execution and decision support."* → AI Agent Platform / Automated Action
  2. **Conversational Decision Tree Interface**: Manages two-turn prompt input, contextual follow-up selection, and rendering of multi-match results.
  3. **Multi-Project Comparison Cards**: Shows top 4 ranked matches with percentages (58%–96%), division badge, role (`Primary Match`, `Alternative Match`, `Complementary Asset`), and reusable components.
  4. **FinOps ROI & 3-Phase Roadmap**: Displays clear man-hours saved, dollar cost avoidance, time-to-deploy versus build-from-scratch timelines, and actionable phase steps.
  5. **Enterprise Theme Toggle**: Real-time Light Mode / Dark Mode switching with persistent state in `localStorage`.

### 3.2 Layer 2: API Gateway & Middleware Layer (BFF)
* **Technologies**: Node.js, Express.js (`server.ts`), Vite middleware in development.
* **Responsibilities**:
  1. `GET /api/health`: Provides continuous liveness monitoring, Gemini API key telemetry, and catalog asset counts.
  2. `GET /api/catalog`: Serves the 50 production assets across 10 enterprise departments.
  3. `POST /api/chat/start`: Parses incoming user problem statements, maps them to decision taxonomy categories, and returns dynamic follow-up options.
  4. `POST /api/chat/evaluate`: Orchestrates scoring, invokes Gemini with failover, maps FinOps metrics, and delivers the final discovery payload.

### 3.3 Layer 3: Intelligence & Decision Orchestration Engine
* **Components**:
  1. **Deterministic Match Scorer**:
     - Tokenizes technical terms and business goals.
     - Computes department affinity (e.g., latency/failover triggers SEC & DAT; invoice/OCR triggers IAS & FIN).
     - Ranks top 4 compatible internal projects with calibrated match percentages.
  2. **Dual-Model GenAI Orchestrator**:
     - Connects to Google GenAI SDK (`@google/genai`).
     - Executes primary prompt on `gemini-3.1-flash-lite`.
     - Automatically catches HTTP 503 / high demand spikes and cascades to `gemini-3.8-flash`.
     - Gracefully falls back to institutional deterministic summary if external network access fails.
  3. **Realistic FinOps Calculator**:
     - Computes engineering hours avoided (90 hrs for lightweight assets, up to 220 hrs for heavy distributed systems).
     - Calculates dollar cost avoidance ($12,000 to $28,000).
     - Compares adoption deployment duration (2–5 days) against standard build-from-scratch time (4–8 weeks).

### 3.4 Layer 4: Enterprise Knowledge Repository
* **Registry Structure**: 50 certified assets across 10 business divisions:
  - **HCS** (Healthcare & Clinical Services): FHIR clinical search, HIPAA medical note parser, patient triage copilot.
  - **IAS** (Intelligent Automation & OCR): Multi-modal invoice parser, compliance document auditor, ID verifier.
  - **SEC** (Security & Network Operations): Multi-IP real-time latency monitor & auto link failover, anomaly detector.
  - **PRM** (Predictive Modeling & Churn): Real-time customer churn scoring, tabular risk modeling, retention engine.
  - **OPM** (Operations & Process Mgmt): Work-order router, bottleneck detection, field engineer scheduler.
  - **HOS** (Hospitality & Guest Experience): Multi-lingual guest concierge, dynamic room pricing, sentiment analyzer.
  - **FIN** (Financial Systems & Invoicing): Automated invoice line-item reconciliation, ledger anomaly detection.
  - **SCM** (Supply Chain & Logistics): Route optimization, warehouse inventory demand forecasting.
  - **DAT** (Data Engineering & Streaming): Kafka high-throughput streaming broker, real-time analytics engine.
  - **CXM** (Customer Experience & CRM): Omnichannel support copilot, CSAT prediction, call transcript summarizer.

---

## 4. Request Lifecycle Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Squad Lead / Engineer
    participant UI as React 19 Frontend
    participant BFF as Express.js BFF (server.ts)
    participant Scorer as Deterministic Match Engine
    participant Repo as 50-Asset Registry (10 Depts)
    participant Gemini as Google GenAI SDK

    User->>UI: 1. Types problem statement or selects Intent Tab
    UI->>BFF: 2. POST /api/chat/start { prompt, archetype }
    BFF->>BFF: 3. Classify category (e.g. autonomous_execution)
    BFF-->>UI: 4. Returns dynamic decision tree question & options
    User->>UI: 5. Selects specific constraint (e.g. "<500ms latency, automatic failover")
    UI->>BFF: 6. POST /api/chat/evaluate { prompt, followUpAnswer, category }
    BFF->>Scorer: 7. Score & rank 50 assets against tokens + dept affinity
    Scorer->>Repo: 8. Query asset profiles (techStack, compliance, run cost)
    Scorer-->>BFF: 9. Top 4 matches with % (Primary, Alternative, Complementary)
    BFF->>Gemini: 10. Invoke gemini-3.1-flash-lite for executive summary
    alt Model 1 Available
        Gemini-->>BFF: Executive recommendation text
    else Model 1 503 / High Demand
        BFF->>Gemini: Cascade to gemini-3.8-flash
        Gemini-->>BFF: Fallback response text
    else Offline / No Key
        BFF->>BFF: Generate deterministic institutional recommendation
    end
    BFF->>BFF: 11. Calculate realistic KPIs (saved hours, avoided cost, roadmap)
    BFF-->>UI: 12. Return complete ChatbotDiscoveryResult
    UI-->>User: 13. Displays matches, what to reuse, what to build & 3-phase roadmap
```

---

## 5. Technology Stack Inventory

| Component | Category | Version | Purpose & Role | License |
| :--- | :--- | :--- | :--- | :--- |
| **React** | Frontend Library | `^19.0.0` | High-performance reactive UI rendering | MIT |
| **TypeScript** | Programming Language | `^5.7.0` | End-to-end static typing and contract validation | Apache 2.0 |
| **Tailwind CSS** | Styling Engine | `^4.0.0` | Atomic styling with native Dark & Light theme switching | MIT |
| **Lucide React** | Iconography | `^1.16.0` | Professional enterprise UI and architecture icons | ISC |
| **Express.js** | Backend Framework | `^4.21.0` | Lightweight REST API gateway and static file server | MIT |
| **@google/genai** | AI Foundation SDK | `^0.1.1` | Official SDK for Gemini 3.1 Flash Lite & 3.8 Flash | Apache 2.0 |
| **Vite & TSX** | Tooling & Bundler | `^6.0.0` | Instant HMR development and optimized production build | MIT |

---

## 6. Security, Compliance & Responsible AI

1. **API Key Isolation**:
   - The `GEMINI_API_KEY` is loaded strictly on the server-side (`server.ts`) via environment variables.
   - Zero keys or credentials are leaked or sent to client-side browser bundles.
2. **Zero Telemetry Leaks**:
   - No sensitive enterprise prompts are logged to unverified external analytics services.
   - All internal assets are stored with pre-certified compliance stamps (`SOC2 Type II`, `HIPAA`, `PCI-DSS`).
3. **Graceful Degradation**:
   - System remains 100% operational even during external AI service spikes or network disconnections via the deterministic rule engine.
