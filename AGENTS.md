# VeriSpec Studio — Engineering & Architecture Guidelines

1. **Deterministic Phase-0 Geometry Solver**:
   - Every topology and layout change passes the 5-stage constraint solver in [`src/engine/preRenderGeometryPlanner.mjs`](file:///Users/nitinagga/Documents/VeriSpec/src/engine/preRenderGeometryPlanner.mjs): viewport conservation (`1366px`–`1920px`), glyph-width typography (`L100`/`L200`/`L300`), pairwise AABB disjointness, orthogonal Manhattan routing channels (`0` edge-through-obstacle intersections), and pre-emission certificate verification.
   - Never apply non-uniform SVG `scale(1, sy)` vertical squashing (`sy < 1.0`) or disconnected parking-lot strips when adding nodes to bespoke blueprints; promote mutated bespoke blueprints cleanly to connected Manhattan routing.

2. **Real Vertex AI Gemini Models & Honest Telemetry**:
   - Use only verified Google Cloud Vertex AI model IDs (`gemini-3.1-pro-preview` and `gemini-3-flash-preview` on `locations/global`) in [`src/engine/vertexGeminiLiveClient.mjs`](file:///Users/nitinagga/Documents/VeriSpec/src/engine/vertexGeminiLiveClient.mjs).
   - Never report `isLiveLlmCall: true` or copy another diagram's `responseId` onto un-judged diagrams; un-judged diagrams report `isLiveLlmCall: false` and `responseId: null` until explicitly evaluated.
   - Return `HTTP 400` on empty greenfield prompts or failed vision decompilations rather than substituting unrelated fallback topologies.

3. **Workspace Persistence, Standalone Diagrams & Quality Gate**:
   - Persist state in native `node:sqlite` (`WAL` mode) via [`src/engine/sqliteWorkspaceStore.mjs`](file:///Users/nitinagga/Documents/VeriSpec/src/engine/sqliteWorkspaceStore.mjs), mint standalone `DOC-01..DOC-NN` diagrams by default on `POST /api/diagram/create` (`code: "NEW"`), cap Undo/Redo history to 15 revisions, and exclude `.local_state`, `.env*`, and secrets from Git and OCI container builds.
   - Run `npm run quality-gate` (`Exit Code 0`) before committing or deploying via `python3 scripts/oci_deploy_verispec.py`.
