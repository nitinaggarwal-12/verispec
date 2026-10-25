# VeriSpec — Stateful Prompt-Driven Iterative Architecture Diagramming Studio

**VeriSpec** is a Google Stitch Material Design 3 (`Executive Light Theme`) architecture diagramming platform where an initial natural-language prompt synthesizes a complete, collision-free `v1.0.1` architecture diagram, and subsequent prompts iteratively mutate the **Canonical Architecture Graph (CAG)** via surgical AST delta operations (`ADD_NODE`, `REPLACE_NODE`, `SPLIT_NODE`, `REMOVE_NODE`, `ADD_CLOSED_LOOP`) across `v1.0.2`, `v1.0.3` … `v1.0.N`.

## Complete 18-Diagram Product & Project Lifecycle Atlas (6 Phases)

| Phase | Code | Canonical Diagram Archetype | Primary Lifecycle Role |
| :--- | :--- | :--- | :--- |
| **Phase 1: Product Discovery, Strategy & UX** | `D01` | Product Journey & North-Star Value Stream Map | Product Managers & Growth Leads |
| **Phase 1: Product Discovery, Strategy & UX** | `D02` | Multi-Actor User Flow & Conditional UX State Machine | UX Designers & Frontend Leads |
| **Phase 1: Product Discovery, Strategy & UX** | `D03` | Domain Event Storming & Bounded Context Map (DDD) | Domain & Principal Architects |
| **Phase 2: System & Cloud Architecture** | `D04` | C4 System Context & Container Architecture (L1/L2) | System & Solution Architects |
| **Phase 2: System & Cloud Architecture** | `D05` | Cloud-Native Multi-Tier AI Commerce & Microservices Mesh | Cloud & Platform Engineers |
| **Phase 2: System & Cloud Architecture** | `D06` | Enterprise Hub-and-Spoke Multi-VPC Network (`#78`) | Network & Cloud Security Architects |
| **Phase 3: Runtime Behavior, APIs & State** | `D07` | Synchronous & Async API Sequence Flow (`ALT`/`OPT`/`LOOP`) | Staff Backend & API Engineers |
| **Phase 3: Runtime Behavior, APIs & State** | `D08` | Distributed Saga & Finite State Machine Lifecycle (FSM) | Distributed Systems Engineers |
| **Phase 3: Runtime Behavior, APIs & State** | `D09` | API Gateway, Apollo GraphQL Federation & BFF Routing Map | API Platform & Mobile/Web Teams |
| **Phase 4: Data, Storage & Event Streaming** | `D10` | Entity-Relationship (ERD) & Polyglot Persistence Schema | Data Architects & DBAs |
| **Phase 4: Data, Storage & Event Streaming** | `D11` | Real-Time CDC Event Streaming & Medallion Lakehouse | Data & Streaming Engineers |
| **Phase 4: Data, Storage & Event Streaming** | `D12` | Multi-Tier Caching, Read-Replica & Sharding Topology | Performance & Database Engineers |
| **Phase 5: AI, Agentic & ML Pipelines** | `D13` | Enterprise Hybrid GraphRAG & Vector Grounding Pipeline | AI & Search Engineers |
| **Phase 5: AI, Agentic & ML Pipelines** | `D14` | Multi-Agent A2A / MCP Orchestration & Safety Guardrail Mesh | Agentic AI Platform Engineers |
| **Phase 5: AI, Agentic & ML Pipelines** | `D15` | Closed-Loop MLOps, 1:3 Counterfactual Simulation & Eval Gate | ML Scientists & Evaluation Leads |
| **Phase 6: Security, CI/CD & SRE Operations** | `D16` | Zero-Trust Security Perimeter, IAM, CMEK & DLP Governance | CISOs & Cloud Security Engineers |
| **Phase 6: Security, CI/CD & SRE Operations** | `D17` | GitOps CI/CD Release Pipeline & Progressive Canary Delivery | DevOps & Release Engineers |
| **Phase 6: Security, CI/CD & SRE Operations** | `D18` | SRE Observability, SLO Burn-Rate Alerting & Multi-Region DR | SREs & Production Operations |

## Core Studio Capabilities

- **5-Stage Phase-0 Pre-Render Mathematical Constraint Solver (`src/engine/preRenderGeometryPlanner.mjs`)**: Solves viewport pixel budgets (`1366px`–`1920px`), glyph-width typography (`L100`/`L200`/`L300`), pairwise AABB disjointness, and Manhattan routing channels prior to SVG emission.
- **Polyglot Bi-Directional Architecture-as-Code DSL, Terraform HCL & SQL DDL Reverse Decompiler (`src/engine/verispecDslAndJudgeEngine.mjs`)**: Edit VeriSpec DSL, paste raw Terraform HCL (`resource "aws_*" / "google_*"`), or paste SQL `CREATE TABLE` DDL to synthesize versioned diagrams with 44 official multi-cloud vendor icons (`src/engine/iconCatalog.mjs`).
- **Living Engineering RFC & ADR Markdown Co-Synthesis + Cloud FinOps (`$/mo`) & `p99` Latency (`ms`) Telemetry**: Every mutation co-synthesizes a complete Engineering RFC & ADR document (`#wbPanel_rfc`), monthly infrastructure TCO breakdown, critical-path `p99` latency, and composite SLA.
- **Contract-First Parallel Fork-Join Worker-Thread Engine (`src/engine/parallelForkJoinPipeline.mjs`)**: Verifies all `54/54` Blueprint $\times$ LOD states across 4 OS worker threads in `~49ms` with `100%` SHA-256 bit-for-bit sequential parity.
- **Collapsible-by-Default Sidebars & Always-Visible Dual H+V Scrollbars with Changeable Width**: Both the 18-Blueprint Sidebar (`#leftLifecycleRail`) and the Prompt Evolution Lineage Panel (`#atelierAdrPanel`) default to collapsed so the 16:9 vector canvas commands maximum horizontal width, with OS-independent horizontal + vertical scrollbars (`.vs-dual-scroll`), drag-to-resize splitters (`#leftRailResizer`, `#adrPanelResizer`), and live width sliders (`Rail W`, `Lineage W`, `Drawer W`, `Scroll W` `6px`–`20px`).
- **Real Live Vertex AI Gemini API Co-Pilot & Cross-Model Jury (`src/engine/vertexGeminiLiveClient.mjs` — `Rule 55`)**: Executes authenticated HTTP `POST` calls to Vertex AI (`locations/global/publishers/google/models/{model}:generateContent`) across `gemini-3.1-pro-preview` (Lead Architect Judge) and `gemini-3-flash-preview` (Co-Pilot Mutation & Independent SRE Critic) with discrete `thinkingConfig: { thinkingLevel: "LOW" }`, exposing cryptographic `responseId`, `modelVersion`, latency `ms`, token usage, and the live HTTP 200 call ledger in `#wbPanel_judge`.
- **Native `node:sqlite` (`WAL` Mode) Transactional Persistence (`src/engine/sqliteWorkspaceStore.mjs`)**: Persists workspace folders, multi-turn `blueprint_versions`, `whiteboard_overlays`, `rfc_custom_blocks`, and `collab_threads` in a native Node 26 `DatabaseSync` SQLite database (`PRAGMA journal_mode = WAL;`) synced with `https://github.com/nitinaggarwal-12/verispec`.
- **Interactive SVG Whiteboard & Freeform Canvas Tools (`#vsWhiteboardToolbar`)**: Supports Marquee Lasso batch nudge (`⬚ Lasso`), 8-Way Node Resize handles (`↔️ Resize`), Orthogonal Connector Elbow Waypoint drag (`〰️ Elbow`), Freehand SVG Pen highlight strokes (`✏️ Pen`), and Sticky Notes (`🟨 Sticky`), all persisted transactionally in SQLite.
- **Hybrid Notion-Style WYSIWYG Living RFC Editor & `/` Slash Menu (`#wbPanel_rfc`)**: Combines editable rich-text blocks (`contenteditable="true"`), `/` slash commands (`/h2`, `/callout`, `/code`, `/embed-D06`, `/embed-D10`), multi-diagram embeds, and live-computed FinOps (`$/mo`) & `p99` latency (`ms`) telemetry.
- **Multiplayer Collaborator Presence & Anchored `@mention` Review Threads (`#vsCollabPresenceBar`, `#collabThreadsModal`)**: Real-time SSE collaborator cursor presence (`GET /api/events`, `GET /api/collab/state`) and node-anchored `@mention` engineering review threads persisted in SQLite.
- **GitHub PR Diff & FinOps Bot (`src/engine/githubPrBotEngine.mjs`, `.github/workflows/verispec-pr-bot.yml`, `scripts/verispec_github_pr_bot.mjs`)**: Automated PR review bot and interactive Tab 5 previewer (`POST /api/github/pr-preview`) that computes structural AST node diffs, monthly Cloud FinOps (`$/mo`) & annual (`$/yr`) run-rate deltas, `p99` latency impact, and embedded Mermaid diagrams for `https://github.com/nitinaggarwal-12/verispec`.
- **Multi-Format Export**: Export editable Draw.io `.drawio` XML, crisp `.SVG`, `2x` Retina `.PNG` (`2880×1620`), `.tf` Terraform HCL, Mermaid `flowchart LR`, and `RFC.md`.

## Running Locally

```bash
npm start
# Studio listening on http://0.0.0.0:8080

npm run pre-render-gate
# Runs all 10 deterministic invariants + Native node:sqlite WAL + Live Vertex AI Gemini Jury + Parallel Worker-Thread DAG SHA-256 parity

npm run quality-gate
# Runs pre-render-gate + 7-Step Headless Chrome E2E multi-viewport DOM & visual verification
```
