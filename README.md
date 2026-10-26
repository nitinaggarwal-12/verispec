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
- **8-Format Polyglot Bi-Directional Architecture-as-Code DSL & Schema Reverse Decompiler (`src/engine/verispecDslAndJudgeEngine.mjs`)**: Edit VeriSpec DSL, or paste raw **Terraform HCL** (`resource "aws_*" / "google_*"`), **SQL DDL** (`CREATE TABLE`), **Kubernetes YAML** (`kind: Deployment`), **Prisma ORM** (`model ...`), **OpenAPI 3.1 / Swagger** (`paths:`), or **Docker Compose** (`services:`) to synthesize versioned diagrams with 44 official multi-cloud vendor icons (`src/engine/iconCatalog.mjs`).
- **Living Engineering RFC & ADR Markdown Co-Synthesis + Cloud FinOps (`$/mo`) & `p99` Latency (`ms`) Telemetry**: Every mutation co-synthesizes a complete Engineering RFC & ADR document (`#wbPanel_rfc`), monthly infrastructure TCO breakdown, critical-path `p99` latency, and composite SLA.
- **Contract-First Parallel Fork-Join Worker-Thread Engine (`src/engine/parallelForkJoinPipeline.mjs`)**: Verifies all `54/54` Blueprint $\times$ LOD states across 4 OS worker threads in `~49ms` with `100%` SHA-256 bit-for-bit sequential parity.
- **Collapsible-by-Default Sidebars & Always-Visible Dual H+V Scrollbars with Changeable Width**: Both the 18-Blueprint Sidebar (`#leftLifecycleRail`) and the Prompt Evolution Lineage Panel (`#atelierAdrPanel`) default to collapsed so the 16:9 vector canvas commands maximum horizontal width, with OS-independent horizontal + vertical scrollbars (`.vs-dual-scroll`), drag-to-resize splitters (`#leftRailResizer`, `#adrPanelResizer`), and live width sliders (`Rail W`, `Lineage W`, `Drawer W`, `Scroll W` `6px`–`20px`).
- **Real Live Vertex AI Gemini API Co-Pilot & Cross-Model Jury (`src/engine/vertexGeminiLiveClient.mjs` — `Rule 55`)**: Executes authenticated HTTP `POST` calls to Vertex AI (`locations/global/publishers/google/models/{model}:generateContent`) across `gemini-3.1-pro-preview` (Lead Architect Judge) and `gemini-3-flash-preview` (Co-Pilot Mutation & Independent SRE Critic) with discrete `thinkingConfig: { thinkingLevel: "LOW" }`, exposing cryptographic `responseId`, `modelVersion`, latency `ms`, token usage, and the live HTTP 200 call ledger in `#wbPanel_judge`.
- **Native `node:sqlite` (`WAL` Mode) Transactional Persistence (`src/engine/sqliteWorkspaceStore.mjs`)**: Persists workspace folders (`fld_01`..`fld_04`), multi-turn `blueprint_versions`, `whiteboard_overlays`, `rfc_custom_blocks` (dual `content`/`text` and `embedCode`/`diagramCode` parity), and `collab_threads` in a native Node 26 `DatabaseSync` SQLite database (`PRAGMA journal_mode = WAL;`) synced with `https://github.com/nitinaggarwal-12/verispec`.
- **Interactive SVG Whiteboard, Zero-Teleportation 12px Grid-Snap Node Drag, Direct Double-Click Inline Node Editing & Undo/Redo Stack (`#vsWhiteboardToolbar`, `POST /api/node/update-inline`, `POST /api/undo`, `POST /api/redo`)**: All 18 archetypes emit `data-base-x`/`data-base-y` coordinates so dragging any node (`✋ Drag` or `Shift+Drag`) smoothly translates from `(baseX + snappedDx, baseY + snappedDy)`. Double-clicking any canvas node opens `#inlineCanvasNodeEditBar` to update its `Title`, `Subtitle`, and `Protocol Pill` in-place (`POST /api/node/update-inline`). Supports real mouse-drag Freehand SVG Pen drawing (`✏️ Pen`), Marquee Lasso multi-node selection (`⬚ Lasso`), 8-Way Node Resize grip dragging (`↔️ Resize`), Orthogonal Connector Elbow Waypoint dragging (`〰️ Elbow`), Sticky Note dragging & double-click inline editing (`🟨 Sticky`), `Ctrl/⌘ + Wheel` smooth zoom, and full `⌘Z` / `⌘⇧Z` Undo/Redo (`↶` / `↷`) + `Delete`/`Backspace` node removal.
- **Multimodal Gemini Vision Decompiler with Real File Upload, Drag-and-Drop & Clipboard Paste (`POST /api/vision-decompile`)**: Upload any PNG/JPEG/WebP architecture diagram via `📂 Upload` (`#visionImageFileInput`), drag-and-drop an image file onto the canvas, or paste (`⌘V`) from clipboard to decompile into a multi-tier topology via `gemini-3-flash-preview`.
- **Hybrid Notion-Style WYSIWYG Living RFC Editor & `/` Slash Menu (`#wbPanel_rfc`)**: Combines editable rich-text blocks (`contenteditable="true"` with `onblur` SQLite WAL auto-save), `/` slash commands (`/h2`, `/callout`, `/code`, `/embed-D06`, `/embed-D10`), multi-diagram embeds, and live-computed FinOps (`$/mo`) & `p99` latency (`ms`) telemetry.
- **Multiplayer Collaborator Cursors on Canvas & Anchored `@mention` Review Threads (`#vsLiveCollabCursorsOverlay`, `#vsCollabPresenceBar`, `#collabThreadsModal`)**: Live collaborator cursor markers rendered over the canvas (`@alex.rivera`, `@priya.sre`, `@marcus.sec`) plus node-anchored `@mention` threads with inline `Reply ↵` and `✓ Resolve / ↺ Reopen` controls persisted in SQLite (`POST /api/collab/reply`).
- **GitHub PR Diff & FinOps Bot (`src/engine/githubPrBotEngine.mjs`, `.github/workflows/verispec-pr-bot.yml`, `scripts/verispec_github_pr_bot.mjs`)**: Automated PR review bot and interactive Tab 5 previewer (`POST /api/github/pr-preview`) that computes structural AST node diffs, monthly Cloud FinOps (`$/mo`) & annual (`$/yr`) run-rate deltas, `p99` latency impact, and embedded Mermaid diagrams for `https://github.com/nitinaggarwal-12/verispec`.
- **Product Landing Page (`/landing`, `🏠 Landing` Edition) & Workspace Home Dashboard (`/home`, `🗂️ Home` Edition)**:
  - **Product Landing Page (`#viewEditionLanding`)**: Executive Light Theme product showcase featuring a Product Mega-Navigation strip, Hero banner (`"AI for Architecture Diagrams That Matter"`), Interactive Live AI Diagrammer Sandbox (`💬 Text Prompt`, `🧬 Terraform / SQL / K8s`, `📷 Whiteboard Vision`, `📄 Living RFC Spec`) with 1-click starter recipes, live 16:9 SVG Architecture Preview with collaborator cursors, 6-Card Bento Product Pillar Grid, Customer Engineering Testimonials, and 5-Column Footer.
  - **Workspace Home Dashboard (`#viewEditionHome`)**: Full file and folder hub with 5 Quick-Create Action Cards (`➕ Blank Canvas`, `✨ AI Diagrammer`, `📄 AI Design Doc`, `📷 Gemini Vision`, `🤖 Agent MCP & API`), instant search/filter bar (`#homeSearchInput`), folder & category tabs (`🕒 All Files (18)`, `⭐ Starred`, `📁 01..04`), `⊞ Grid` vs `☰ Table` view toggle, and SQLite-persisted `⭐` Starred Blueprints (`POST /api/workspace/star`, `workspace_starred_blueprints`).
- **Interactive C4 System Map Drill-Down (`#canvasMapDrilldownBar`), Flow Walkthrough Player (`#btnFlowWalkthroughStep`), Live SVG Minimap Radar (`#vsCanvasMinimapOverlay`) & Agent-Ready `verispec_mcp` Server + Public REST API (`#mcpApiModal`)**:
  - **C4 Map Drill-Down, Flow Hop Player & Minimap Radar**: Seamlessly zoom across C4 Level 1 System Context (`L100`), Level 2 Container Mesh (`L200`), and Level 3 Component & Protocol Spec (`L300`), step hop-by-hop through directed request flows (`▶️ Flow Hop (k/N)`), and monitor full-canvas topology in the live bottom-right SVG minimap (`#vsCanvasMinimapOverlay`).
  - **Model Context Protocol (`verispec_mcp`) & REST Diagramming API**: Exposes `GET /api/mcp/manifest` (`protocolVersion: "2025-06-18"`, 5 tools: `verispec_list_blueprints`, `verispec_generate_diagram`, `verispec_mutate_ast`, `verispec_finops_slo_audit`, `verispec_export_iac`), `POST /api/mcp` (JSON-RPC 2.0 execution), and `POST /api/v1/diagram/generate` for Claude Code, Cursor IDE, Gemini CLI, and CI/CD pipelines.
- **Multi-Format Export with Full Whiteboard & Offset Preservation**: Export editable Draw.io `.drawio` XML (including custom node drag offsets `customDx`/`customDy`, 8-way resize overrides `customDw`/`customDh`, whiteboard sticky notes, and review pins), crisp `.SVG`, `2x` Retina `.PNG` (`2880×1620`), `.tf` Terraform HCL, Mermaid `flowchart LR`, and `RFC.md`.

## Running Locally & Cloud Run Deployment (`Rule 56`)

- **BeyondCorp URL**: [`https://verispec-248990048888.cr.gclb.goog`](https://verispec-248990048888.cr.gclb.goog)
- **Direct Cloud Run URL (`us-west1`, Revision `verispec-00005-gms`, `Ready=True`, `Traffic=100%`)**: [`https://verispec-mi7l4h536a-uw.a.run.app`](https://verispec-mi7l4h536a-uw.a.run.app)
- **GitHub Repository**: [`https://github.com/nitinaggarwal-12/verispec`](https://github.com/nitinaggarwal-12/verispec)

```bash
npm start
# Studio listening on http://0.0.0.0:8080

npm run pre-render-gate
# Runs all 10 deterministic invariants + Native node:sqlite WAL + Live Vertex AI Gemini Jury + Parallel Worker-Thread DAG SHA-256 parity

npm run quality-gate
# Runs pre-render-gate + 7-Step Headless Chrome E2E multi-viewport DOM & visual verification

npm run deploy:cloudrun
# Executes quality-gate + Zero-Daemon OCI Container Image Assembler (node:24-bookworm-slim) & Cloud Run 4-Gate Readiness Verifier
```

