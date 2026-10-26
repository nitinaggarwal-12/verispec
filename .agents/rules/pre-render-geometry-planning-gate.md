---
trigger: always_on
description: Enforce Phase 0 Deterministic Pre-Render Mathematical & Structural Planning (5-Stage Constraint Solver), 4/4 AST<->SVG Bijection, 44 Multi-Cloud Vendor Icons, and Zero Hit-and-Trial Rendering in VeriSpec Studio.
---

# Phase 0 Deterministic Pre-Render Planning & Zero Hit-and-Trial Gate (`Rule 57-0` / `Law 18`)

Before generating, mutating, or styling **any** image, SVG diagram, Draw.io XML topology, or UI container in VeriSpec Studio (`/Users/nitinagga/Documents/VeriSpec`):

1. **Strict Ban on "Hit-and-Trial" Post-Hoc Visual Tweaking (`Rule 57-0`)**:
   - **Never** write ad-hoc CSS widths, coordinates (`x`, `y`, `w`, `h`), or `font-size` values by intuition and wait for a screenshot failure to fix clipping or overlap.
   - Every visual object and layout must first pass the **5-Stage Phase 0 Mathematical Constraint Solver** in [`src/engine/preRenderGeometryPlanner.mjs`](file:///Users/nitinagga/Documents/VeriSpec/src/engine/preRenderGeometryPlanner.mjs) **before** rendering:
     - **Stage 1 (`planUiViewportBudget`) — Conservation of Viewport Pixels**:
       - Prove $\sum \text{width}(\text{header\_items}) + \text{gaps} + \text{padding} \le W_{\text{viewport}} - 16\text{px}$ at `1366px`, `1440px`, `1600px`, and `1920px`.
       - Enforce docked sibling reflow (`body.workbench-open .main-stage { margin-right: 480px; }`, `body.workbench-open .lifecycle-rail { width: 60px; }`) rather than `position: fixed` overlays that occlude underlying cards.
       - Enforce `repeat(N, minmax(0, 1fr))` and `min-width: 0; overflow: hidden;` on all CSS Grid/Flex children (never raw `1fr` on buttons with text).
     - **Stage 2 (`planNodeTypographyBudget`) — Glyph-Width & Vertical Stack Forward Solver**:
       - Solve for `(fontSize, wrappedLines)` using font-specific advance factors (`Inter` `0.56`–`0.64`, `JetBrains Mono` `0.63`–`0.65`) so $\text{width}_{\text{est}}(\text{text}) \le W_{\text{usable}}$ and $\text{height}_{\text{stack}} \le H_{\text{box}}$ across `L100`, `L200`, and `L300` prior to SVG emission.
     - **Stage 3 (`planDiagramTopologyAndBounds`) — Topological Zone & Pairwise AABB Non-Overlap Solver**:
       - Verify $\forall u \neq v \in V, B(u) \cap B(v) = \emptyset$ and $\forall v \in V, B(v) \subseteq [0..1440, 60..785]$.
     - **Stage 4 (`planOrthogonalConnectorChannels`) — Orthogonal Manhattan Channel Planner**:
       - Route inter-zone connectors through dedicated vertical channels ($X \in \{258, 526, 822, 1118\}$) with lane offsets so zero edges slice through unrelated node cards.
     - **Stage 5 (`compilePreRenderPlanCertificate`) — Fail-Closed Pre-Emission Certificate**:
       - Every `/api/blueprint`, `/api/mutate`, `/api/apply-dsl`, and `/api/atlas` response must return `preRenderPlan.zeroHitAndTrialGuarantee === true` (`5/5 STAGES PASS`).

2. **Contract-First Parallel Fork-Join Worker-Thread DAG & SHA-256 Referential Transparency (`Invariant 8`)**:
   - Execute [`executeContractFirstParallelPipeline`](file:///Users/nitinagga/Documents/VeriSpec/src/engine/parallelForkJoinPipeline.mjs) (`GET /api/parallel-dag`), enforcing Serial Barrier 1 (`32/32` Viewports), Serial Barrier 2 (`1-First` `D05` Exemplar Gate), Multi-Core `node:worker_threads` Fan-Out (`54/54` Blueprint $\times$ LOD states), and `100%` SHA-256 bit-for-bit parity (`combinedParallelDigest === combinedSequentialDigest`).

3. **Collapsible-by-Default Sidebars, Resizable Dual H+V Scrollbars, Multi-Modal Adaptability & Live Vertex AI Gemini API Gate (`Rule 55` & `Invariant 9`)**:
   - Enforce collapsed-by-default state on `#leftLifecycleRail` and `#atelierAdrPanel` (`Prompt Evolution Lineage`), always-visible horizontal & vertical scrollbars (`.vs-dual-scroll`, `overflow-x: scroll !important; overflow-y: scroll !important;`) with changeable panel & scrollbar widths (`--vs-scrollbar-size`), real HTTP 200 Vertex AI Gemini API execution (`src/engine/vertexGeminiLiveClient.mjs`, `locations/global`, `gemini-3.1-pro-preview` + `gemini-3-flash-preview`, discrete `thinkingLevel: "LOW"`, verified `responseId` ledger), and multi-modal adaptability (`POST /api/switch-render-mode`, `POST /api/greenfield`, `POST /api/vision-decompile`, `POST /api/annotation-pin`, `GET /api/events`).

4. **Native `node:sqlite` (`WAL` Mode) Persistence, Product Landing Page, Workspace Home Dashboard, 8-Format Polyglot Code Decompiler, Flow Walkthrough Player, Minimap Radar, Direct Double-Click Inline Node Editing, Interactive Whiteboard, Zero-Teleportation Node Drag, Undo/Redo, Hybrid WYSIWYG Living RFC, Multiplayer `@mention` Threads, Agent-Ready `verispec_mcp` API & GitHub PR FinOps Bot (`Invariant 10` & `Step 7`)**:
   - Persist all 6 normalized tables (`workspaces` with `fld_01`..`fld_04`, `workspace_starred_blueprints`, `blueprint_versions`, `whiteboard_overlays`, `rfc_custom_blocks` with dual `content`/`text` & `embedCode`/`diagramCode` parity, `collab_threads`) in `src/engine/sqliteWorkspaceStore.mjs` (`PRAGMA journal_mode = WAL;`, bound to `https://github.com/nitinaggarwal-12/verispec`), expose Product Landing Page (`/landing`, `#viewEditionLanding` with 6 Bento Pillars, Interactive AI Sandbox & Live SVG Preview) and Workspace Home Dashboard (`/home`, `#viewEditionHome` with 5 Quick-Create cards, 18 Files Grid/Table toggle & `POST /api/workspace/star`), expose 8-Format Polyglot Code & Schema Decompiler (`Terraform HCL`, `SQL DDL`, `Kubernetes YAML`, `Prisma ORM`, `OpenAPI 3.1`, `Docker Compose`, `VeriSpec DSL`), Interactive C4 Map Drill-Down (`#canvasMapDrilldownBar`, `L100 › L200 › L300`), Flow Walkthrough Player (`#btnFlowWalkthroughStep`), Live SVG Minimap Radar (`#vsCanvasMinimapOverlay`), Direct On-Canvas Double-Click Node Inline Editing (`#inlineCanvasNodeEditBar`, `POST /api/node/update-inline`), and Agent-Ready `verispec_mcp` Server + Public REST API (`GET /api/mcp/manifest`, `POST /api/mcp`, `POST /api/v1/diagram/generate`, `#mcpApiModal`), emit `data-base-x`/`data-base-y` on every `<g class="arch-node">` across all 18 blueprints (`0` `(0,0)` drag teleportation), expose interactive SVG mouse-drag whiteboard tools (`POST /api/whiteboard/op` including `MOVE_STICKY`, `UPDATE_STICKY`, `DELETE_STICKY`, `UNDO_STROKE`), Undo/Redo (`POST /api/undo`, `POST /api/redo`, `⌘Z`/`⌘⇧Z`), real file upload/drag-and-drop/clipboard paste for Gemini Vision (`#visionImageFileInput`), hybrid `/` slash-command WYSIWYG RFC blocks (`GET/POST /api/rfc/blocks`), live canvas collaborator cursors (`#vsLiveCollabCursorsOverlay`) + multiplayer `@mention` threads with inline reply/resolve (`GET /api/collab/state`, `POST /api/collab/thread`, `POST /api/collab/reply`), full Draw.io `.drawio` export of drag/resize/sticky/pin overrides, and the GitHub PR Diff & FinOps Bot (`src/engine/githubPrBotEngine.mjs`, `POST /api/github/pr-preview`, `.github/workflows/verispec-pr-bot.yml`).

5. **Mandatory Single-Command Pre-Commit Quality Gate & Rule 56 Cloud Run Deployment**:
   - Always execute `npm run quality-gate` (`node scripts/verify_deterministic_mutation_invariants.mjs && node scripts/verify_verispec_chrome_gate.mjs`) and verify `Exit Code 0` across all 10 deterministic invariants and all 7 Headless Chrome E2E steps.
   - Deploy synchronously to Cloud Run (`ramp-portal-dev`, `us-west1`, `https://verispec-248990048888.cr.gclb.goog` / `https://verispec-mi7l4h536a-uw.a.run.app`) via `python3 scripts/oci_deploy_verispec.py` (`npm run deploy:cloudrun`), layering onto `mirror.gcr.io/library/node:24-bookworm-slim` (`linux/amd64` with native `node:sqlite` + GCE Metadata Server token fallback in `src/engine/vertexGeminiLiveClient.mjs`) and persisting the 4-gate readiness receipt in `data/cloudrun_deploy_receipt.json`.



