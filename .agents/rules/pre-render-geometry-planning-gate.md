---
trigger: always_on
description: Enforce Phase 0 Deterministic Pre-Render Mathematical & Structural Planning (5-Stage Constraint Solver), 1:1 AST<->SVG Bijection, 52 Multi-Cloud Vendor Icons, and Honest Live Vertex AI Telemetry in VeriSpec Studio.
---

# Phase 0 Deterministic Pre-Render Planning & Zero Hit-and-Trial Gate

Before generating, mutating, or styling any SVG diagram, Draw.io XML topology, or UI container in VeriSpec Studio (`/Users/nitinagga/Documents/VeriSpec`):

1. **5-Stage Phase 0 Mathematical Constraint Solver ([`src/engine/preRenderGeometryPlanner.mjs`](file:///Users/nitinagga/Documents/VeriSpec/src/engine/preRenderGeometryPlanner.mjs))**:
   - **Stage 1 (`planUiViewportBudget`)**: Conserve viewport pixels across `1366px`, `1440px`, `1600px`, and `1920px` with docked sibling reflow (`body.workbench-open .main-stage { margin-right: 480px; }`) and `minmax(0, 1fr)` grid tracks.
   - **Stage 2 (`planNodeTypographyBudget`)**: Forward-solve `(fontSize, wrappedLines)` across `L100`, `L200`, and `L300` prior to SVG emission.
   - **Stage 3 (`planDiagramTopologyAndBounds`)**: Verify pairwise AABB disjointness (`0` node overlaps) and `[0..1440, 60..785]` canvas containment, with zero non-uniform vertical `scale(1, sy)` compression.
   - **Stage 4 (`planOrthogonalConnectorChannels`)**: Route inter-zone connectors through Manhattan channels and verify all rendered SVG `.arch-edge` segments have `0` intersections through non-endpoint node bounding boxes.
   - **Stage 5 (`compilePreRenderPlanCertificate`)**: Require `preRenderPlan.zeroHitAndTrialGuarantee === true` (`5/5 STAGES PASS`) across `/api/blueprint`, `/api/mutate`, `/api/apply-dsl`, and `/api/atlas`.

2. **Parallel Worker-Thread DAG & SHA-256 Parity ([`src/engine/parallelForkJoinPipeline.mjs`](file:///Users/nitinagga/Documents/VeriSpec/src/engine/parallelForkJoinPipeline.mjs))**:
   - Verify `32/32` viewports, `D05` exemplar gate, `54/54` Blueprint × LOD states across `node:worker_threads`, and `combinedParallelDigest === combinedSequentialDigest`.

3. **Honest Live Vertex AI Gemini Execution ([`src/engine/vertexGeminiLiveClient.mjs`](file:///Users/nitinagga/Documents/VeriSpec/src/engine/vertexGeminiLiveClient.mjs))**:
   - Execute real HTTP `200` calls to Vertex AI (`locations/global`, `gemini-3.1-pro-preview` + `gemini-3-flash-preview`, `thinkingLevel: "LOW"`), never cross-attributing `responseId` across diagrams or silently fabricating fallback architectures on empty/failed inputs.

4. **SQLite WAL Persistence, Standalone `DOC-*` Diagrams & Pre-Commit Quality Gate**:
   - Persist workspace state in [`src/engine/sqliteWorkspaceStore.mjs`](file:///Users/nitinagga/Documents/VeriSpec/src/engine/sqliteWorkspaceStore.mjs) (`PRAGMA journal_mode = WAL;`), mint standalone `DOC-01..DOC-NN` diagrams when `code === "NEW"`, cap in-memory revision history at 15 steps, and reset cleanly to `D05 · Turn-3` (`12 Nodes · 11 Edges`) on `POST /api/reset` and container build.
   - Always verify `npm run quality-gate` (`Exit Code 0`) prior to synchronous Cloud Run deployment (`python3 scripts/oci_deploy_verispec.py` -> `ramp-portal-dev`, `us-west1`).
