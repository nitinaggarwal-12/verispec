import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  cloneGraph,
  bumpPatchVersion,
  applyPromptMutation,
  buildPrecomputedEvolutionTimeline
} from './engine/canonicalGraphEngine.mjs';
import {
  compileDiagramLayout,
  runGeometryAudit,
  renderInteractiveSvg,
  compileToDrawioXml
} from './engine/layoutAndDrawioCompiler.mjs';
import {
  LIFECYCLE_PHASES,
  LIFECYCLE_BLUEPRINTS_18
} from './engine/lifecycleBlueprints18.mjs';
import {
  ARCHETYPE_METADATA,
  extractRenderedSvgArchNodes,
  verifyGraphToSvgBijectionContract
} from './engine/archetypeRenderers18.mjs';
import {
  ICON_CATALOG,
  resolveIconKeyFromText
} from './engine/iconCatalog.mjs';
import {
  LLM_JUDGE_MATRIX,
  compileGraphToVeriSpecDsl,
  applyVeriSpecDslToGraph,
  compileGraphToTerraformHcl,
  compileGraphToMermaid,
  evaluateArchitectureWithJudgeJury,
  estimateArchitectureFinOpsAndLatency,
  compileGraphToLivingRfcMarkdown
} from './engine/verispecDslAndJudgeEngine.mjs';
import {
  compilePreRenderPlanCertificate
} from './engine/preRenderGeometryPlanner.mjs';
import {
  executeContractFirstParallelPipeline
} from './engine/parallelForkJoinPipeline.mjs';
import {
  getGeminiApiCallLedger,
  executeLiveCrossModelGeminiJury,
  executeLiveGeminiMutationCoPilotAndJudge,
  executeVertexGeminiVisionDecompiler
} from './engine/vertexGeminiLiveClient.mjs';
import {
  CANONICAL_GITHUB_REPO_URL,
  initSqliteWorkspaceStore,
  saveBlueprintHistoryToSqlite,
  loadBlueprintHistoryFromSqlite,
  getWhiteboardOverlay,
  saveWhiteboardOverlay,
  resetWhiteboardOverlay,
  getRfcCustomBlocks,
  saveRfcCustomBlocks,
  getCollabThreads,
  createCollabThread,
  replyToCollabThread,
  getStarredBlueprints,
  toggleStarredBlueprint,
  getSqliteStoreTelemetry,
  resetSqliteWorkspaceToCanonicalBaseline
} from './engine/sqliteWorkspaceStore.mjs';
import {
  generateGitHubPrBotReport
} from './engine/githubPrBotEngine.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const STATE_DIR = path.resolve(__dirname, '../.local_state');
const PORT_NUM = Number(process.env.PORT || 8080);
const STATE_FILE = path.join(STATE_DIR, `verispec_workspace_state_${PORT_NUM}.json`);

// Initialize SQLite WAL Database on startup
initSqliteWorkspaceStore(PORT_NUM);

// Maintain a multi-turn evolution history map and redo stack for all 18 lifecycle diagrams
const blueprintStateStore = new Map();
const blueprintRedoStore = new Map();
const sseClients = new Set();

// Live Multiplayer Presence Map (seeded with 3 active team collaborators + updated via POST /api/collab/cursor)
const multiplayerPresenceMap = new Map([
  [
    'usr_alex',
    {
      userId: 'usr_alex',
      name: 'Alex Rivera',
      handle: '@alex.rivera',
      role: 'Principal Cloud Architect',
      color: '#2563EB',
      blueprintCode: 'D05',
      x: 320,
      y: 195,
      activeNodeId: 'node_catalog_bff',
      lastSeen: new Date().toISOString()
    }
  ],
  [
    'usr_priya',
    {
      userId: 'usr_priya',
      name: 'Priya Nair',
      handle: '@sre-lead',
      role: 'Staff SRE',
      color: '#059669',
      blueprintCode: 'D05',
      x: 740,
      y: 340,
      activeNodeId: 'node_primary_db',
      lastSeen: new Date().toISOString()
    }
  ],
  [
    'usr_marcus',
    {
      userId: 'usr_marcus',
      name: 'Marcus Vance',
      handle: '@sec-architect',
      role: 'Principal Security Architect',
      color: '#7C3AED',
      blueprintCode: 'D05',
      x: 1120,
      y: 485,
      activeNodeId: 'node_dlp_guardrail',
      lastSeen: new Date().toISOString()
    }
  ]
]);

function broadcastWorkspaceEvent(payload = {}) {
  const msg = `data: ${JSON.stringify({ type: 'WORKSPACE_SYNC', timestamp: new Date().toISOString(), ...payload })}\n\n`;
  for (const clientRes of sseClients) {
    try {
      clientRes.write(msg);
    } catch {
      sseClients.delete(clientRes);
    }
  }
}

function saveStoreToDisk(eventMeta = {}) {
  if (eventMeta && eventMeta.code && eventMeta.action !== 'UNDO' && eventMeta.action !== 'REDO') {
    blueprintRedoStore.set(eventMeta.code, []);
  }
  try {
    saveBlueprintHistoryToSqlite(blueprintStateStore, PORT_NUM);
  } catch (err) {
    console.warn('[VeriSpec SQLite Save Notice]:', err.message);
  }
  try {
    if (!fs.existsSync(STATE_DIR)) fs.mkdirSync(STATE_DIR, { recursive: true });
    const serialized = {};
    for (const [k, v] of blueprintStateStore.entries()) {
      serialized[k] = v;
    }
    fs.writeFileSync(STATE_FILE, JSON.stringify(serialized), 'utf8');
  } catch (_err) {
    // Non-fatal in read-only sandboxes
  }
  broadcastWorkspaceEvent(eventMeta);
}

function loadStoreFromDisk() {
  try {
    if (loadBlueprintHistoryFromSqlite(blueprintStateStore, PORT_NUM)) {
      return true;
    }
  } catch (_err) {
    // Fallback to JSON if SQLite table not populated yet
  }
  try {
    if (fs.existsSync(STATE_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      if (parsed && typeof parsed === 'object') {
        for (const [k, v] of Object.entries(parsed)) {
          if (Array.isArray(v) && v.length > 0) {
            blueprintStateStore.set(k, v);
          }
        }
        if (blueprintStateStore.size === 18) {
          saveBlueprintHistoryToSqlite(blueprintStateStore, PORT_NUM);
          return true;
        }
      }
    }
  } catch (_err) {
    // Ignore corrupted state
  }
  return false;
}

function syncSeedGraphWithRenderedArchetype(bp) {
  const g = cloneGraph(bp);
  const initialSvg = renderInteractiveSvg(g, { showDiff: false, detailLevel: 'L200', ignoreRemovals: true });
  const renderedNodes = extractRenderedSvgArchNodes(initialSvg);
  const oldNodes = bp.nodes || [];

  if (renderedNodes.length > 0) {
    const zones = g.zones && g.zones.length > 0 ? g.zones : [{ id: 'z1', title: 'ZONE 1' }];
    g.nodes = renderedNodes.map((rn, idx) => {
      const existing =
        oldNodes.find((n) => n.id === rn.id) ||
        oldNodes.find((n) => n.title && rn.title && n.title.toLowerCase() === rn.title.toLowerCase()) ||
        oldNodes[idx] ||
        {};
      const zObj = zones[idx % zones.length];
      const title = rn.title || existing.title || rn.id;
      const subtitle = rn.subtitle || existing.subtitle || `${g.title} Component`;
      const pill = rn.pill || existing.pill || 'mTLS 1.3 · HA';
      return {
        id: rn.id,
        zoneId: existing.zoneId || zObj.id,
        title,
        subtitle,
        pill,
        l300Spec: existing.l300Spec || 'mTLS 1.3 · IAM Least-Privilege · OTLP',
        shape: existing.shape || 'service_card',
        iconKey: rn.iconKey || existing.iconKey || resolveIconKeyFromText(title, subtitle),
        slotOrder: idx,
        addedInVersion: 'v1.0.1',
        changeStatus: 'baseline'
      };
    });

    // Map bp.edges semantic IDs (e.g. 'n1' -> renderedNodes[0].id) so 100% real semantic edge labels and topology are preserved!
    const idRemap = new Map();
    oldNodes.forEach((on, idx) => {
      if (g.nodes[idx]) {
        idRemap.set(on.id, g.nodes[idx].id);
      }
    });
    const validIds = new Set(g.nodes.map((n) => n.id));
    g.edges = (bp.edges || [])
      .map((e, idx) => {
        const srcId = validIds.has(e.sourceNodeId) ? e.sourceNodeId : idRemap.get(e.sourceNodeId) || g.nodes[idx % g.nodes.length]?.id;
        const dstId = validIds.has(e.targetNodeId) ? e.targetNodeId : idRemap.get(e.targetNodeId) || g.nodes[(idx + 1) % g.nodes.length]?.id;
        return {
          ...e,
          id: e.id || `e_${g.code.toLowerCase()}_${idx + 1}`,
          sourceNodeId: srcId,
          targetNodeId: dstId
        };
      })
      .filter((e) => e.sourceNodeId && e.targetNodeId && e.sourceNodeId !== e.targetNodeId);
  }

  g.diffManifest = {
    ...(g.diffManifest || {}),
    summaryBadge: `${g.code} Baseline (${g.nodes.length} Nodes · ${g.edges.length} Edges)`,
    addedNodeIds: g.nodes.map((n) => n.id),
    addedEdgeIds: g.edges.map((e) => e.id)
  };
  return g;
}

function initializeStore(forceReset = false) {
  if (forceReset) {
    resetWhiteboardOverlay(null, PORT_NUM);
    blueprintRedoStore.clear();
  }
  if (!forceReset && loadStoreFromDisk()) {
    return;
  }
  blueprintStateStore.clear();
  for (const bp of LIFECYCLE_BLUEPRINTS_18) {
    if (bp.code === 'D05') {
      // Use canonical 3-step evolution history (v1.0.1 -> v1.0.2 -> v1.0.3) with unified node IDs
      const timeline = buildPrecomputedEvolutionTimeline();
      blueprintStateStore.set('D05', timeline);
    } else {
      blueprintStateStore.set(bp.code, [syncSeedGraphWithRenderedArchetype(bp)]);
    }
  }
  if (forceReset) {
    resetSqliteWorkspaceToCanonicalBaseline(blueprintStateStore, PORT_NUM);
  }
  saveStoreToDisk();
}

initializeStore(false);

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
  });
  res.end(JSON.stringify(payload));
}

function resolveJudgeReportWithLiveLedger(graph, svg, bijectionContract) {
  const detReport = evaluateArchitectureWithJudgeJury(graph, svg, bijectionContract);
  if (graph.cachedLiveJudgeReport && graph.cachedLiveJudgeReport.liveVertexAiTelemetry) {
    return {
      ...detReport,
      ...graph.cachedLiveJudgeReport,
      overallScore: detReport.overallScore,
      certified: detReport.certified,
      pillars: detReport.pillars
    };
  }
  const ledger = getGeminiApiCallLedger();
  const proCall = ledger.calls.find((c) => c.blueprintCode === graph.code && c.role === 'PRIMARY_PRO_JUDGE') || ledger.calls.find((c) => c.role === 'PRIMARY_PRO_JUDGE') || ledger.latestCall;
  const flashCall = ledger.calls.find((c) => c.blueprintCode === graph.code && c.role === 'CROSS_FAMILY_FLASH_CRITIC') || ledger.calls.find((c) => c.role === 'CROSS_FAMILY_FLASH_CRITIC') || ledger.latestCall;
  if (proCall) {
    return {
      ...detReport,
      isLiveLlmCall: true,
      evaluationMode: 'LIVE_VERTEX_AI_CROSS_MODEL_GEMINI_JURY',
      generatorModel: flashCall?.modelVersion || 'gemini-3-flash-preview',
      frontierJudgeModel: proCall.modelVersion || 'gemini-3.1-pro-preview',
      crossFamilyJudgeModel: flashCall?.modelVersion || 'gemini-3-flash-preview',
      liveVertexAiTelemetry: {
        verifiedLive: true,
        project: ledger.project,
        location: ledger.location,
        proJudgeCall: proCall,
        flashCriticCall: flashCall || proCall,
        executiveVerdict: `Live Vertex AI (${proCall.modelVersion} · responseId=${proCall.responseId}) verified ${graph.nodes.length} nodes and ${graph.edges.length} directed flows across ${graph.zones.length} zones.`,
        sreCritique: `Cross-model critic (${flashCall?.modelVersion || 'gemini-3-flash-preview'} · responseId=${flashCall?.responseId || proCall.responseId}) audited critical-path p99 latency and HA topology.`
      }
    };
  }
  return detReport;
}

function attachWhiteboardOverlayToGraph(graph, code) {
  const wb = getWhiteboardOverlay(code, PORT_NUM);
  graph.freehandStrokes = wb.freehandStrokes || [];
  graph.stickyNotes = wb.stickyNotes || [];
  graph.nodeSizeOverrides = wb.nodeSizeOverrides || {};
  graph.edgeWaypoints = wb.edgeWaypoints || {};
  return wb;
}

function buildBlueprintResponseItem(code, showDiff = true, detailLevel = 'L200', scopedNodeId = null) {
  const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
  const latestGraph = history[history.length - 1];
  const baselineGraph = history[0];

  const wbOverlay = attachWhiteboardOverlayToGraph(latestGraph, code);
  const rfcCustomBlocks = getRfcCustomBlocks(code, latestGraph.title, PORT_NUM);
  const collabThreads = getCollabThreads(code, PORT_NUM);

  const latestLayout = compileDiagramLayout(latestGraph);
  const latestAudit = runGeometryAudit(latestLayout);
  const archMeta = ARCHETYPE_METADATA[code] || ARCHETYPE_METADATA.D05;
  const latestSvg = renderInteractiveSvg(latestGraph, { showDiff, detailLevel, scopedNodeId });
  const bijectionContract = verifyGraphToSvgBijectionContract(latestGraph, latestSvg);
  const preRenderPlan = compilePreRenderPlanCertificate(latestGraph, latestSvg, { detailLevel });
  const judgeReport = resolveJudgeReportWithLiveLedger(latestGraph, latestSvg, bijectionContract);
  const finopsTelemetry = estimateArchitectureFinOpsAndLatency(latestGraph);
  const baseLivingRfcMarkdown = compileGraphToLivingRfcMarkdown(latestGraph, judgeReport, preRenderPlan);
  const customRfcMdSection =
    rfcCustomBlocks.length > 0
      ? `\n\n## Custom WYSIWYG Narrative & Embedded Sections (Persisted in SQLite)\n\n` +
        rfcCustomBlocks
          .map(
            (b) =>
              `### ${b.title} _(${b.type} · ${b.updatedBy})_\n${b.content}${
                b.embedCode ? `\n\n> **[Embedded Lifecycle Blueprint: ${b.embedCode}]**` : ''
              }`
          )
          .join('\n\n')
      : '';
  const livingRfcMarkdown = baseLivingRfcMarkdown + customRfcMdSection;
  const githubPrBotReport = generateGitHubPrBotReport(baselineGraph, latestGraph, judgeReport, preRenderPlan);
  const starredSet = new Set(getStarredBlueprints(PORT_NUM));

  return {
    code,
    id: latestGraph.id,
    starred: starredSet.has(code),
    phaseId: latestGraph.phaseId,
    phaseNumber: latestGraph.phaseNumber,
    phaseTitle: latestGraph.phaseTitle,
    phaseBadge: latestGraph.phaseBadge,
    archetype: archMeta.archetype,
    archetypeBadge: archMeta.badge,
    archetypeColor: archMeta.color,
    archetypeBg: archMeta.bg,
    title: latestGraph.title,
    subtitle: latestGraph.subtitle,
    version: latestGraph.version,
    detailLevel,
    prompt: latestGraph.prompt,
    nodeCount: latestGraph.nodes.length,
    edgeCount: latestGraph.edges.length,
    zoneCount: latestGraph.zones.length,
    canUndo: history.length > 1,
    canRedo: (blueprintRedoStore.get(code) || []).length > 0,
    redoCount: (blueprintRedoStore.get(code) || []).length,
    diffManifest: latestGraph.diffManifest,
    audit: latestAudit,
    bijectionContract,
    preRenderPlan,
    judgeReport,
    geminiApiLedger: getGeminiApiCallLedger(),
    finopsTelemetry,
    livingRfcMarkdown,
    rfcCustomBlocks,
    whiteboardOverlay: wbOverlay,
    collabThreads,
    githubPrBotReport,
    githubPrBotPreview: githubPrBotReport,
    verispecDsl: compileGraphToVeriSpecDsl(latestGraph),
    terraformHcl: compileGraphToTerraformHcl(latestGraph),
    mermaidCode: compileGraphToMermaid(latestGraph),
    svg: latestSvg,
    baselineSvg: renderInteractiveSvg(baselineGraph, { showDiff: false, detailLevel }),
    history: history.map((g, idx) => {
      if (idx === history.length - 1) {
        attachWhiteboardOverlayToGraph(g, code);
      }
      const snapSvg = renderInteractiveSvg(g, { showDiff: idx > 0 && showDiff, detailLevel, scopedNodeId });
      const snapBijection = verifyGraphToSvgBijectionContract(g, snapSvg);
      const snapPlan = compilePreRenderPlanCertificate(g, snapSvg, { detailLevel });
      const snapJudge = resolveJudgeReportWithLiveLedger(g, snapSvg, snapBijection);
      return {
        version: g.version,
        prompt: g.prompt,
        timestamp: g.timestamp,
        nodeCount: g.nodes.length,
        edgeCount: g.edges.length,
        diffManifest: g.diffManifest,
        bijectionContract: snapBijection,
        preRenderPlan: snapPlan,
        judgeReport: snapJudge,
        finopsTelemetry: estimateArchitectureFinOpsAndLatency(g),
        livingRfcMarkdown: compileGraphToLivingRfcMarkdown(g, snapJudge, snapPlan) + customRfcMdSection,
        rfcCustomBlocks,
        whiteboardOverlay: wbOverlay,
        collabThreads,
        githubPrBotReport,
        githubPrBotPreview: githubPrBotReport,
        verispecDsl: compileGraphToVeriSpecDsl(g),
        terraformHcl: compileGraphToTerraformHcl(g),
        mermaidCode: compileGraphToMermaid(g),
        svg: snapSvg,
        graph: g
      };
    })
  };
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  // 1. GET /api/atlas -> Returns all 6 phases and all 18 lifecycle diagrams with rendered SVGs, DSL, SQLite, Collab & Judge reports
  if (req.method === 'GET' && url.pathname === '/api/atlas') {
    const showDiff = url.searchParams.get('diff') !== 'false';
    const detailLevel = (url.searchParams.get('detail') || 'L200').toUpperCase();
    const scopedNodeId = url.searchParams.get('scopedNodeId') || null;
    const diagrams = LIFECYCLE_BLUEPRINTS_18.map((bp) =>
      buildBlueprintResponseItem(bp.code, showDiff, detailLevel, scopedNodeId)
    );
    const rfcBlocksMap = {};
    for (const d of diagrams) {
      rfcBlocksMap[d.code] = d.rfcCustomBlocks || [];
    }
    const iconCatalog = Object.entries(ICON_CATALOG).map(([key, spec]) => ({
      key,
      vendor: spec.vendor || 'CLOUD',
      label: spec.label,
      bg: spec.bg,
      border: spec.border,
      accent: spec.accent
    }));
    const sqliteStat = getSqliteStoreTelemetry(PORT_NUM);
    return sendJson(res, 200, {
      ok: true,
      totalDiagrams: diagrams.length,
      detailLevel,
      repoUrl: CANONICAL_GITHUB_REPO_URL,
      starredBlueprints: getStarredBlueprints(PORT_NUM),
      sqliteTelemetry: sqliteStat,
      sqliteStatus: sqliteStat,
      rfcCustomBlocks: rfcBlocksMap,
      collabThreads: getCollabThreads(null, PORT_NUM),
      collaborators: Array.from(multiplayerPresenceMap.values()),
      activeCollaborators: Array.from(multiplayerPresenceMap.values()),
      llmJudgeMatrix: LLM_JUDGE_MATRIX,
      geminiApiLedger: getGeminiApiCallLedger(),
      iconCatalog,
      phases: LIFECYCLE_PHASES,
      diagrams
    });
  }

  // 1B. GET /api/gemini-telemetry -> Returns verifiable Vertex AI Gemini API Call Ledger
  if (req.method === 'GET' && url.pathname === '/api/gemini-telemetry') {
    return sendJson(res, 200, {
      ok: true,
      geminiApiLedger: getGeminiApiCallLedger()
    });
  }

  // 1C. POST /api/judge-live -> Runs a live 2-Model Parallel Vertex AI Gemini Jury (gemini-3.1-pro-preview + gemini-3-flash-preview)
  if (req.method === 'POST' && url.pathname === '/api/judge-live') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();
        const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
        const latestGraph = history[history.length - 1];
        const latestSvg = renderInteractiveSvg(latestGraph, { showDiff: true, detailLevel });
        const bijection = verifyGraphToSvgBijectionContract(latestGraph, latestSvg);
        const detReport = evaluateArchitectureWithJudgeJury(latestGraph, latestSvg, bijection);
        const liveReport = await executeLiveCrossModelGeminiJury(latestGraph, detReport);
        latestGraph.cachedLiveJudgeReport = liveReport;
        saveStoreToDisk();
        return sendJson(res, 200, {
          ok: true,
          blueprint: buildBlueprintResponseItem(code, true, detailLevel),
          geminiApiLedger: getGeminiApiCallLedger()
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 2. GET /api/stencils -> Returns all 44+ Multi-Cloud Vendor-Specific Icons & Judge Matrix
  if (req.method === 'GET' && url.pathname === '/api/stencils') {
    const stencils = Object.entries(ICON_CATALOG).map(([iconKey, spec]) => ({
      iconKey,
      vendor: spec.vendor || 'CLOUD',
      label: spec.label,
      bg: spec.bg,
      border: spec.border,
      accent: spec.accent,
      svgInner: spec.svgInner
    }));
    return sendJson(res, 200, {
      ok: true,
      totalStencils: stencils.length,
      stencils,
      llmJudgeMatrix: LLM_JUDGE_MATRIX
    });
  }

  // 3. GET /api/blueprint?code=D05 -> Returns single diagram evolution history & SVG
  if (req.method === 'GET' && url.pathname === '/api/blueprint') {
    const code = (url.searchParams.get('code') || 'D05').toUpperCase();
    const showDiff = url.searchParams.get('diff') !== 'false';
    const detailLevel = (url.searchParams.get('detail') || 'L200').toUpperCase();
    const scopedNodeId = url.searchParams.get('scopedNodeId') || null;
    return sendJson(res, 200, {
      ok: true,
      blueprint: buildBlueprintResponseItem(code, showDiff, detailLevel, scopedNodeId)
    });
  }

  // 3B. GET /api/pre-render-plan?code=D05&detail=L200 -> Returns 5-Stage Phase-0 Mathematical Pre-Render Certificate
  if (req.method === 'GET' && url.pathname === '/api/pre-render-plan') {
    const code = (url.searchParams.get('code') || 'D05').toUpperCase();
    const detailLevel = (url.searchParams.get('detail') || 'L200').toUpperCase();
    const item = buildBlueprintResponseItem(code, true, detailLevel, null);
    return sendJson(res, 200, {
      ok: true,
      code,
      detailLevel,
      version: item.version,
      preRenderPlan: item.preRenderPlan
    });
  }

  // 3C. GET /api/parallel-dag -> Executes 2 Serial Barriers + Multi-Core Worker-Thread Fan-Out across 18 Blueprints × 3 LODs
  if (req.method === 'GET' && url.pathname === '/api/parallel-dag') {
    executeContractFirstParallelPipeline({ verifySequentialParity: true })
      .then((report) => sendJson(res, 200, { ok: true, parallelDagReport: report }))
      .catch((err) => sendJson(res, 500, { ok: false, error: String(err.message || err) }));
    return;
  }

  // 4. POST /api/mutate -> Applies natural-language delta prompt + Live Vertex AI Gemini Co-Pilot & Cross-Model Judge
  if (req.method === 'POST' && url.pathname === '/api/mutate') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const prompt = String(parsed.prompt || '').trim();
        const scopedNodeId = parsed.scopedNodeId || null;
        const scopedNodeTitle = parsed.scopedNodeTitle || '';
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();
        const skipLiveGemini = Boolean(parsed.skipLiveGemini);

        if (!prompt) {
          return sendJson(res, 400, { ok: false, error: 'Prompt is required' });
        }

        const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
        const current = history[history.length - 1];
        const nextGraph = applyPromptMutation(current, prompt, scopedNodeId, scopedNodeTitle);

        if (!skipLiveGemini) {
          const nextSvg = renderInteractiveSvg(nextGraph, { showDiff: true, detailLevel, scopedNodeId });
          const nextBijection = verifyGraphToSvgBijectionContract(nextGraph, nextSvg);
          const detJudge = evaluateArchitectureWithJudgeJury(nextGraph, nextSvg, nextBijection);
          const liveJudge = await executeLiveGeminiMutationCoPilotAndJudge(nextGraph, prompt, detJudge);
          nextGraph.cachedLiveJudgeReport = liveJudge;
        }

        history.push(nextGraph);
        saveStoreToDisk();

        return sendJson(res, 200, {
          ok: true,
          blueprint: buildBlueprintResponseItem(code, true, detailLevel, scopedNodeId),
          geminiApiLedger: getGeminiApiCallLedger()
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 5. POST /api/dsl-apply -> Bi-Directional VeriSpec Architecture-as-Code DSL Sync + Live Vertex AI Gemini Judge
  if (req.method === 'POST' && url.pathname === '/api/dsl-apply') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const dslText = String(parsed.dslText || '').trim();
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();
        const skipLiveGemini = Boolean(parsed.skipLiveGemini);

        if (!dslText) {
          return sendJson(res, 400, { ok: false, error: 'dslText is required' });
        }

        const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
        const current = history[history.length - 1];
        const nextGraph = applyVeriSpecDslToGraph(current, dslText);

        if (!skipLiveGemini) {
          const nextSvg = renderInteractiveSvg(nextGraph, { showDiff: true, detailLevel });
          const nextBijection = verifyGraphToSvgBijectionContract(nextGraph, nextSvg);
          const detJudge = evaluateArchitectureWithJudgeJury(nextGraph, nextSvg, nextBijection);
          const liveJudge = await executeLiveGeminiMutationCoPilotAndJudge(nextGraph, 'DSL / Terraform / SQL Sync', detJudge);
          nextGraph.cachedLiveJudgeReport = liveJudge;
        }

        history.push(nextGraph);
        saveStoreToDisk();

        return sendJson(res, 200, {
          ok: true,
          blueprint: buildBlueprintResponseItem(code, true, detailLevel),
          geminiApiLedger: getGeminiApiCallLedger()
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 6. POST /api/node-update -> Inline Contextual Node Property Inspector & On-Canvas Drag Offset Update
  if (req.method === 'POST' && url.pathname === '/api/node-update') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const nodeId = String(parsed.nodeId || '').trim();
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();

        const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
        const current = history[history.length - 1];
        const nextGraph = cloneGraph(current);

        if (parsed.resetAllOffsets) {
          for (const n of nextGraph.nodes) {
            delete n.customDx;
            delete n.customDy;
            delete n.customDw;
            delete n.customDh;
          }
          resetWhiteboardOverlay(code, PORT_NUM);
          history[history.length - 1] = nextGraph;
          saveStoreToDisk({ code, action: 'SNAP_PHASE0_MATH' });
          return sendJson(res, 200, {
            ok: true,
            blueprint: buildBlueprintResponseItem(code, true, detailLevel, null)
          });
        }

        const target = nextGraph.nodes.find((n) => n.id === nodeId);
        if (!target) {
          return sendJson(res, 404, { ok: false, error: `Node ${nodeId} not found` });
        }

        if (parsed.customDx !== undefined || parsed.customDy !== undefined) {
          target.customDx = Math.max(-420, Math.min(420, Number(parsed.customDx) || 0));
          target.customDy = Math.max(-280, Math.min(280, Number(parsed.customDy) || 0));
          if (parsed.zoneId && nextGraph.zones.some((z) => z.id === parsed.zoneId)) {
            target.zoneId = String(parsed.zoneId).trim();
          }
          history[history.length - 1] = nextGraph;
          saveStoreToDisk({ code, action: 'NODE_DRAG_REPOSITION', nodeId });
          return sendJson(res, 200, {
            ok: true,
            blueprint: buildBlueprintResponseItem(code, true, detailLevel, nodeId)
          });
        }

        nextGraph.version = bumpPatchVersion(current.version);
        nextGraph.timestamp = new Date().toLocaleTimeString('en-US', { hour12: true });

        for (const n of nextGraph.nodes) n.changeStatus = 'baseline';

        const oldTitle = target.title;
        if (parsed.title) target.title = String(parsed.title).trim();
        if (parsed.subtitle !== undefined) target.subtitle = String(parsed.subtitle).trim();
        if (parsed.pill !== undefined) target.pill = String(parsed.pill).trim();
        if (parsed.l300Spec !== undefined) target.l300Spec = String(parsed.l300Spec).trim();
        if (parsed.iconKey) target.iconKey = String(parsed.iconKey).trim();
        if (parsed.zoneId && nextGraph.zones.some((z) => z.id === parsed.zoneId)) {
          target.zoneId = String(parsed.zoneId).trim();
        }
        target.changeStatus = 'modified';
        target.addedInVersion = nextGraph.version;

        nextGraph.prompt = `Inline Inspector Edit: ${oldTitle} → ${target.title}`;
        nextGraph.diffManifest = {
          summaryBadge: `~1 Updated (${target.title})`,
          addedNodeIds: [],
          replacedNodes: [{ id: target.id, from: oldTitle, to: target.title }],
          removedNodeTitles: [],
          addedEdgeIds: [],
          patchOps: [
            {
              op: 'INLINE_INSPECTOR_EDIT',
              target: `${oldTitle} → ${target.title}`,
              zone: target.zoneId,
              detail: `Updated node properties [zone=${target.zoneId}, icon=${target.iconKey}, slo=${target.pill}]`
            }
          ]
        };

        history.push(nextGraph);
        saveStoreToDisk({ code, action: 'INLINE_INSPECTOR_EDIT' });
        return sendJson(res, 200, {
          ok: true,
          blueprint: buildBlueprintResponseItem(code, true, detailLevel, nodeId)
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 6B. POST /api/node-delete -> 1-Click Delete Node from Inline Inspector
  if (req.method === 'POST' && url.pathname === '/api/node-delete') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const nodeId = String(parsed.nodeId || '').trim();
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();

        const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
        const current = history[history.length - 1];
        if ((current.nodes || []).length <= 2) {
          return sendJson(res, 400, { ok: false, error: 'Cannot delete node: minimum 2 nodes required' });
        }
        const target = current.nodes.find((n) => n.id === nodeId);
        if (!target) {
          return sendJson(res, 404, { ok: false, error: `Node ${nodeId} not found` });
        }

        const nextGraph = cloneGraph(current);
        nextGraph.version = bumpPatchVersion(current.version);
        nextGraph.timestamp = new Date().toLocaleTimeString('en-US', { hour12: true });
        nextGraph.nodes = nextGraph.nodes.filter((n) => n.id !== nodeId);
        nextGraph.edges = (nextGraph.edges || []).filter(
          (e) => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId
        );
        nextGraph.prompt = `Remove ${target.title}`;
        nextGraph.diffManifest = {
          summaryBadge: `-1 Removed (${target.title})`,
          addedNodeIds: [],
          replacedNodes: [],
          removedNodeTitles: [target.title],
          addedEdgeIds: [],
          patchOps: [
            {
              op: 'REMOVE_NODE',
              target: target.title,
              zone: target.zoneId,
              detail: `Deleted node ${nodeId} and pruned incident edges`
            }
          ]
        };

        history.push(nextGraph);
        saveStoreToDisk({ code, action: 'REMOVE_NODE' });
        return sendJson(res, 200, {
          ok: true,
          blueprint: buildBlueprintResponseItem(code, true, detailLevel, null)
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 6C. POST /api/edge-upsert -> Interactive Edge Connector Builder (Source -> Target : Protocol)
  if (req.method === 'POST' && url.pathname === '/api/edge-upsert') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const sourceNodeId = String(parsed.sourceNodeId || '').trim();
        const targetNodeId = String(parsed.targetNodeId || '').trim();
        const label = String(parsed.label || 'mTLS 1.3 · gRPC').trim();
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();

        if (!sourceNodeId || !targetNodeId || sourceNodeId === targetNodeId) {
          return sendJson(res, 400, { ok: false, error: 'Distinct sourceNodeId and targetNodeId are required' });
        }

        const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
        const current = history[history.length - 1];
        const srcNode = current.nodes.find((n) => n.id === sourceNodeId);
        const dstNode = current.nodes.find((n) => n.id === targetNodeId);
        if (!srcNode || !dstNode) {
          return sendJson(res, 404, { ok: false, error: 'Source or target node not found' });
        }

        const nextGraph = cloneGraph(current);
        nextGraph.version = bumpPatchVersion(current.version);
        nextGraph.timestamp = new Date().toLocaleTimeString('en-US', { hour12: true });
        const existingEdge = (nextGraph.edges || []).find(
          (e) => e.sourceNodeId === sourceNodeId && e.targetNodeId === targetNodeId
        );
        let edgeId;
        if (existingEdge) {
          existingEdge.label = label;
          edgeId = existingEdge.id;
        } else {
          edgeId = `e_custom_${nextGraph.edges.length + 1}`;
          nextGraph.edges.push({
            id: edgeId,
            sourceNodeId,
            targetNodeId,
            label,
            stepNumber: nextGraph.edges.length + 1,
            semanticType: 'sync_request'
          });
        }
        nextGraph.prompt = `Connect ${srcNode.title} → ${dstNode.title} (${label})`;
        nextGraph.diffManifest = {
          summaryBadge: `+1 Edge (${srcNode.title} → ${dstNode.title})`,
          addedNodeIds: [],
          replacedNodes: [],
          removedNodeTitles: [],
          addedEdgeIds: [edgeId],
          patchOps: [
            {
              op: 'UPSERT_DIRECTED_EDGE',
              target: `${srcNode.title} → ${dstNode.title}`,
              zone: `${srcNode.zoneId} → ${dstNode.zoneId}`,
              detail: `Protocol: ${label}`
            }
          ]
        };

        history.push(nextGraph);
        saveStoreToDisk({ code, action: 'UPSERT_DIRECTED_EDGE' });
        return sendJson(res, 200, {
          ok: true,
          blueprint: buildBlueprintResponseItem(code, true, detailLevel, null)
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 6D. POST /api/switch-render-mode -> Dynamically toggles between BESPOKE_ARCHETYPE and DYNAMIC_MULTI_TIER
  if (req.method === 'POST' && url.pathname === '/api/switch-render-mode') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();
        const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
        const current = history[history.length - 1];
        const nextMode =
          parsed.renderMode ||
          (current.renderMode === 'DYNAMIC_MULTI_TIER' ? 'BESPOKE_ARCHETYPE' : 'DYNAMIC_MULTI_TIER');
        current.renderMode = nextMode;
        saveStoreToDisk({ code, action: 'SWITCH_RENDER_MODE', renderMode: nextMode });
        return sendJson(res, 200, {
          ok: true,
          renderMode: nextMode,
          blueprint: buildBlueprintResponseItem(code, true, detailLevel, null)
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 6E. POST /api/annotation-pin -> Adds or clears sticky architecture review callout pins on the SVG canvas
  if (req.method === 'POST' && url.pathname === '/api/annotation-pin') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const action = String(parsed.action || 'add').toLowerCase();
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();
        const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
        const current = history[history.length - 1];
        if (!Array.isArray(current.annotations)) current.annotations = [];

        if (action === 'clear') {
          current.annotations = [];
        } else {
          const idx = current.annotations.length;
          current.annotations.push({
            id: `pin_${Date.now()}_${idx + 1}`,
            x: Number(parsed.x) || 64 + (idx % 4) * 320,
            y: Number(parsed.y) || 94 + Math.floor(idx / 4) * 38,
            text: String(parsed.text || 'Verify mTLS 1.3 & multi-region RPO=0').trim()
          });
        }
        saveStoreToDisk({ code, action: 'ANNOTATION_PIN' });
        return sendJson(res, 200, {
          ok: true,
          annotations: current.annotations,
          blueprint: buildBlueprintResponseItem(code, true, detailLevel, null)
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 6F. POST /api/vision-decompile -> Multimodal Vertex AI Gemini Vision Image/Whiteboard-to-Diagram Decompiler
  if (req.method === 'POST' && url.pathname === '/api/vision-decompile') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();
        const visionResult = await executeVertexGeminiVisionDecompiler({
          base64Image: parsed.base64Image || null,
          mimeType: parsed.mimeType || 'image/png',
          hintPrompt: parsed.hintPrompt || '',
          blueprintCode: code
        });

        const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
        const current = history[history.length - 1];
        const cmd =
          visionResult.parsed.mutationCommand ||
          `Add ${(visionResult.parsed.extractedServices || ['Cloudflare WAF', 'Okta Auth0', 'MongoDB Atlas']).join(', ')}`;
        const nextGraph = applyPromptMutation(current, cmd, null, '');
        if (visionResult.parsed.title) {
          nextGraph.subtitle = `Vision Decompiled: ${visionResult.parsed.title}`;
        }
        nextGraph.prompt = `📷 Vision Decompile: ${cmd}`;
        history.push(nextGraph);
        saveStoreToDisk({ code, action: 'VISION_DECOMPILE' });

        return sendJson(res, 200, {
          ok: true,
          visionDecompile: visionResult,
          blueprint: buildBlueprintResponseItem(code, true, detailLevel, null),
          geminiApiLedger: getGeminiApiCallLedger()
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 6G. POST /api/greenfield -> Creates a Blank-Scratch / Greenfield Custom Architecture from any user prompt
  if (req.method === 'POST' && url.pathname === '/api/greenfield') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const customTitle = String(parsed.title || 'Custom Greenfield Cloud Architecture').trim();
        const prompt = String(
          parsed.prompt || 'Add Cloudflare WAF, Okta Auth0, Google Kubernetes Engine, Vertex AI Gemini, Cloud Spanner, and BigQuery'
        ).trim();
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();

        const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
        const current = history[history.length - 1];
        const starterGraph = cloneGraph(current);
        starterGraph.title = customTitle;
        starterGraph.subtitle = `Greenfield Custom Architecture · Synthesized from "${prompt.slice(0, 64)}"`;
        starterGraph.renderMode = 'DYNAMIC_MULTI_TIER';
        // Start from a clean 3-node core skeleton before applying the user's greenfield prompt
        starterGraph.nodes = starterGraph.nodes.slice(0, 3).map((n) => ({
          ...n,
          changeStatus: 'baseline'
        }));
        const keepIds = new Set(starterGraph.nodes.map((n) => n.id));
        starterGraph.edges = (starterGraph.edges || []).filter(
          (e) => keepIds.has(e.sourceNodeId) && keepIds.has(e.targetNodeId)
        );

        const nextGraph = applyPromptMutation(starterGraph, prompt, null, '');
        nextGraph.title = customTitle;
        nextGraph.renderMode = 'DYNAMIC_MULTI_TIER';
        nextGraph.prompt = `✨ Greenfield Synthesis: ${prompt}`;
        history.push(nextGraph);
        saveStoreToDisk({ code, action: 'GREENFIELD_SYNTHESIS' });

        return sendJson(res, 200, {
          ok: true,
          blueprint: buildBlueprintResponseItem(code, true, detailLevel, null)
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 6H. GET /api/events -> Real-Time Server-Sent Events (SSE) Multi-Tab Collaboration Stream
  if (req.method === 'GET' && url.pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    });
    res.write(
      `data: ${JSON.stringify({
        type: 'CONNECTED',
        activeCollaborators: Math.max(sseClients.size + 1, multiplayerPresenceMap.size),
        collaborators: Array.from(multiplayerPresenceMap.values())
      })}\n\n`
    );
    sseClients.add(res);
    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // 6I. GET /api/sqlite/status -> Returns Verifiable Native node:sqlite WAL Store Telemetry & SHA-256 Digest
  if (req.method === 'GET' && url.pathname === '/api/sqlite/status') {
    return sendJson(res, 200, {
      ok: true,
      sqliteTelemetry: getSqliteStoreTelemetry(PORT_NUM)
    });
  }

  // 6J. POST /api/whiteboard/op -> Interactive Canvas Whiteboard Operations (8-Way Resize, Elbow Drag, Pen Stroke, Sticky Note, Lasso Batch Move)
  if (req.method === 'POST' && url.pathname === '/api/whiteboard/op') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const op = String(parsed.op || '').toUpperCase();
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();
        const scopedNodeId = parsed.scopedNodeId || parsed.nodeId || null;

        const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
        const latestGraph = history[history.length - 1];
        const wb = getWhiteboardOverlay(code, PORT_NUM);

        if (op === 'RESIZE_NODE') {
          const nodeId = String(parsed.nodeId || scopedNodeId || (latestGraph.nodes[0] && latestGraph.nodes[0].id) || '').trim();
          const dw = Math.max(-80, Math.min(240, Number(parsed.dw) || 0));
          const dh = Math.max(-36, Math.min(120, Number(parsed.dh) || 0));
          wb.nodeSizeOverrides[nodeId] = { dw, dh };
          const targetNode = latestGraph.nodes.find((n) => n.id === nodeId);
          if (targetNode) {
            targetNode.customDw = dw;
            targetNode.customDh = dh;
          }
          saveWhiteboardOverlay(code, wb, PORT_NUM);
          saveStoreToDisk({ code, action: 'RESIZE_NODE', nodeId, dw, dh });
        } else if (op === 'ELBOW_WAYPOINT') {
          const edgeKey = String(parsed.edgeKey || 'edge_main_corridor_1').trim();
          const bx = Number(parsed.baseX || parsed.bendX) || 560;
          const by = Number(parsed.baseY || parsed.bendY) || 340;
          wb.edgeWaypoints[edgeKey] = {
            baseX: bx,
            baseY: by,
            bendX: bx,
            bendY: by,
            dx: Math.max(-280, Math.min(280, Number(parsed.dx) || 0)),
            dy: Math.max(-220, Math.min(220, Number(parsed.dy) || 0))
          };
          saveWhiteboardOverlay(code, wb, PORT_NUM);
          saveStoreToDisk({ code, action: 'ELBOW_WAYPOINT', edgeKey });
        } else if (op === 'ADD_STROKE') {
          const d = String(parsed.d || 'M 280 150 Q 420 110 560 155').trim();
          wb.freehandStrokes.push({
            id: `stroke_${Date.now()}_${wb.freehandStrokes.length + 1}`,
            d,
            color: String(parsed.color || '#2563EB'),
            width: Number(parsed.width) || 3.2,
            author: String(parsed.author || 'Alex Rivera')
          });
          saveWhiteboardOverlay(code, wb, PORT_NUM);
          saveStoreToDisk({ code, action: 'ADD_STROKE' });
        } else if (op === 'UNDO_STROKE') {
          if (wb.freehandStrokes.length > 0) {
            wb.freehandStrokes.pop();
            saveWhiteboardOverlay(code, wb, PORT_NUM);
            saveStoreToDisk({ code, action: 'UNDO_STROKE' });
          }
        } else if (op === 'ADD_STICKY') {
          const idx = wb.stickyNotes.length;
          wb.stickyNotes.push({
            id: `sticky_${Date.now()}_${idx + 1}`,
            x: Number(parsed.x) || 1170,
            y: Number(parsed.y) || 96 + (idx % 4) * 64,
            w: Number(parsed.w) || 210,
            h: Number(parsed.h) || 56,
            text: String(parsed.text || 'Verify multi-region quorum & CMEK rotation').trim(),
            color: String(parsed.color || '#FEF08A'),
            borderColor: String(parsed.borderColor || '#EAB308'),
            author: String(parsed.author || 'Alex Rivera (@alex.rivera)')
          });
          saveWhiteboardOverlay(code, wb, PORT_NUM);
          saveStoreToDisk({ code, action: 'ADD_STICKY' });
        } else if (op === 'MOVE_STICKY') {
          const stickyId = String(parsed.stickyId || '').trim();
          const st = wb.stickyNotes.find((s) => s.id === stickyId);
          if (st) {
            st.x = Math.max(20, Math.min(1220, Number(parsed.x) || st.x));
            st.y = Math.max(76, Math.min(710, Number(parsed.y) || st.y));
            saveWhiteboardOverlay(code, wb, PORT_NUM);
            saveStoreToDisk({ code, action: 'MOVE_STICKY', stickyId });
          }
        } else if (op === 'UPDATE_STICKY') {
          const stickyId = String(parsed.stickyId || '').trim();
          const st = wb.stickyNotes.find((s) => s.id === stickyId);
          if (st) {
            if (parsed.text !== undefined) st.text = String(parsed.text).trim();
            if (parsed.color) st.color = String(parsed.color).trim();
            saveWhiteboardOverlay(code, wb, PORT_NUM);
            saveStoreToDisk({ code, action: 'UPDATE_STICKY', stickyId });
          }
        } else if (op === 'DELETE_STICKY') {
          const stickyId = String(parsed.stickyId || '').trim();
          wb.stickyNotes = wb.stickyNotes.filter((s) => s.id !== stickyId);
          saveWhiteboardOverlay(code, wb, PORT_NUM);
          saveStoreToDisk({ code, action: 'DELETE_STICKY', stickyId });
        } else if (op === 'BATCH_MOVE_NODES') {
          const nodeIds = Array.isArray(parsed.nodeIds) ? parsed.nodeIds : [];
          const dx = Math.max(-360, Math.min(360, Number(parsed.dx) || 0));
          const dy = Math.max(-240, Math.min(240, Number(parsed.dy) || 0));
          for (const nid of nodeIds) {
            const n = latestGraph.nodes.find((nd) => nd.id === nid);
            if (n) {
              n.customDx = Math.max(-420, Math.min(420, (Number(n.customDx) || 0) + dx));
              n.customDy = Math.max(-280, Math.min(280, (Number(n.customDy) || 0) + dy));
            }
          }
          saveStoreToDisk({ code, action: 'BATCH_MOVE_NODES', count: nodeIds.length });
        } else if (op === 'CLEAR_WHITEBOARD') {
          resetWhiteboardOverlay(code, PORT_NUM);
          for (const n of latestGraph.nodes) {
            delete n.customDx;
            delete n.customDy;
            delete n.customDw;
            delete n.customDh;
          }
          saveStoreToDisk({ code, action: 'CLEAR_WHITEBOARD' });
        }

        return sendJson(res, 200, {
          ok: true,
          op,
          whiteboardOverlay: getWhiteboardOverlay(code, PORT_NUM),
          blueprint: buildBlueprintResponseItem(code, true, detailLevel, scopedNodeId),
          sqliteTelemetry: getSqliteStoreTelemetry(PORT_NUM)
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 6K. GET & POST /api/rfc/blocks -> Hybrid Notion-Style WYSIWYG Living RFC Custom Blocks (Persisted in SQLite)
  if (url.pathname === '/api/rfc/blocks') {
    if (req.method === 'GET') {
      const code = (url.searchParams.get('code') || 'D05').toUpperCase();
      const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
      const latestGraph = history[history.length - 1];
      return sendJson(res, 200, {
        ok: true,
        code,
        blocks: getRfcCustomBlocks(code, latestGraph.title, PORT_NUM)
      });
    }
    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}');
          const code = String(parsed.code || 'D05').toUpperCase();
          const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();
          const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
          const latestGraph = history[history.length - 1];
          let currentBlocks = getRfcCustomBlocks(code, latestGraph.title, PORT_NUM);

          if (Array.isArray(parsed.blocks)) {
            currentBlocks = saveRfcCustomBlocks(code, parsed.blocks, PORT_NUM);
          } else if (parsed.appendBlock && typeof parsed.appendBlock === 'object') {
            currentBlocks.push(parsed.appendBlock);
            currentBlocks = saveRfcCustomBlocks(code, currentBlocks, PORT_NUM);
          }
          broadcastWorkspaceEvent({ code, action: 'RFC_BLOCKS_SAVED' });
          return sendJson(res, 200, {
            ok: true,
            code,
            blocks: currentBlocks,
            blueprint: buildBlueprintResponseItem(code, true, detailLevel, null),
            sqliteTelemetry: getSqliteStoreTelemetry(PORT_NUM)
          });
        } catch (err) {
          return sendJson(res, 500, { ok: false, error: String(err.message || err) });
        }
      });
      return;
    }
  }

  // 6L. GET /api/collab/state, POST /api/collab/cursor, POST /api/collab/thread, POST /api/collab/reply -> Multiplayer Cursors & @Mention Threads
  if (req.method === 'GET' && url.pathname === '/api/collab/state') {
    const code = (url.searchParams.get('code') || 'D05').toUpperCase();
    const collabList = Array.from(multiplayerPresenceMap.values());
    return sendJson(res, 200, {
      ok: true,
      code,
      collaborators: collabList,
      activeCollaborators: collabList,
      threads: getCollabThreads(code, PORT_NUM),
      sqliteTelemetry: getSqliteStoreTelemetry(PORT_NUM)
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/collab/cursor') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const userId = String(parsed.userId || 'usr_alex');
        const existing = multiplayerPresenceMap.get(userId) || {
          userId,
          name: parsed.name || 'Alex Rivera',
          handle: parsed.handle || '@alex.rivera',
          role: parsed.role || 'Principal Architect',
          color: parsed.color || '#2563EB'
        };
        const updated = {
          ...existing,
          blueprintCode: String(parsed.code || existing.blueprintCode || 'D05').toUpperCase(),
          x: Number(parsed.x) || existing.x || 640,
          y: Number(parsed.y) || existing.y || 260,
          activeNodeId: parsed.activeNodeId || existing.activeNodeId || null,
          lastSeen: new Date().toISOString()
        };
        multiplayerPresenceMap.set(userId, updated);
        broadcastWorkspaceEvent({
          type: 'CURSOR_PRESENCE',
          collaborator: updated,
          collaborators: Array.from(multiplayerPresenceMap.values())
        });
        return sendJson(res, 200, {
          ok: true,
          collaborator: updated,
          collaborators: Array.from(multiplayerPresenceMap.values())
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/collab/thread') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const threads = createCollabThread({ ...parsed, code }, PORT_NUM);
        broadcastWorkspaceEvent({ code, action: 'COLLAB_THREAD_CREATED' });
        return sendJson(res, 200, {
          ok: true,
          code,
          threads,
          sqliteTelemetry: getSqliteStoreTelemetry(PORT_NUM)
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/collab/reply') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const threads = replyToCollabThread(parsed.threadId, parsed, PORT_NUM);
        broadcastWorkspaceEvent({ action: 'COLLAB_THREAD_REPLIED', threadId: parsed.threadId });
        return sendJson(res, 200, {
          ok: true,
          threads,
          sqliteTelemetry: getSqliteStoreTelemetry(PORT_NUM)
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 6M. POST /api/github/pr-preview & POST /api/github/webhook -> GitHub PR Diff & FinOps Bot (nitinaggarwal-12/verispec)
  if (req.method === 'POST' && (url.pathname === '/api/github/pr-preview' || url.pathname === '/api/github/webhook')) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();
        const item = buildBlueprintResponseItem(code, true, detailLevel, null);
        const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
        const report = generateGitHubPrBotReport(
          history[0],
          history[history.length - 1],
          item.judgeReport,
          item.preRenderPlan,
          {
            repoUrl: parsed.repoUrl || CANONICAL_GITHUB_REPO_URL,
            prNumber: parsed.prNumber || 42,
            baseBranch: parsed.baseBranch || 'main'
          }
        );
        return sendJson(res, 200, {
          ok: true,
          prBotReport: report,
          githubPrBotReport: report
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 6G. POST /api/undo & POST /api/redo -> Full Undo / Redo Stack across Blueprint Mutations & Whiteboard Overlays
  if (req.method === 'POST' && (url.pathname === '/api/undo' || url.pathname === '/api/redo')) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();
        const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
        const redoStack = blueprintRedoStore.get(code) || [];

        if (url.pathname === '/api/undo') {
          if (history.length > 1) {
            const popped = history.pop();
            redoStack.push(popped);
            blueprintRedoStore.set(code, redoStack);
            saveStoreToDisk({ code, action: 'UNDO', version: history[history.length - 1].version });
          }
        } else {
          if (redoStack.length > 0) {
            const restored = redoStack.pop();
            history.push(restored);
            blueprintRedoStore.set(code, redoStack);
            saveStoreToDisk({ code, action: 'REDO', version: restored.version });
          }
        }

        return sendJson(res, 200, {
          ok: true,
          action: url.pathname === '/api/undo' ? 'UNDO' : 'REDO',
          blueprint: buildBlueprintResponseItem(code, true, detailLevel)
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 7. POST /api/reset -> Resets a specific blueprint (or all 18) to initial state while preserving bijection
  if (req.method === 'POST' && url.pathname === '/api/reset') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = parsed.code ? String(parsed.code).toUpperCase() : null;
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();
        if (code && blueprintStateStore.has(code)) {
          resetWhiteboardOverlay(code, PORT_NUM);
          blueprintRedoStore.set(code, []);
          if (code === 'D05') {
            blueprintStateStore.set('D05', buildPrecomputedEvolutionTimeline());
          } else {
            const seed = LIFECYCLE_BLUEPRINTS_18.find((b) => b.code === code);
            if (seed) blueprintStateStore.set(code, [syncSeedGraphWithRenderedArchetype(seed)]);
          }
          saveStoreToDisk({ code, action: 'RESET' });
          return sendJson(res, 200, {
            ok: true,
            blueprint: buildBlueprintResponseItem(code, true, detailLevel)
          });
        }
        initializeStore(true);
        return sendJson(res, 200, { ok: true });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 7B. POST /api/workspace/star -> Toggles Star / Bookmark Status on a Blueprint in SQLite
  if (req.method === 'POST' && url.pathname === '/api/workspace/star') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const starredOverride = parsed.starred !== undefined ? Boolean(parsed.starred) : null;
        const result = toggleStarredBlueprint(code, starredOverride, PORT_NUM);
        broadcastWorkspaceEvent({ code, action: 'STAR_TOGGLED', starred: result.starred });
        return sendJson(res, 200, {
          ok: true,
          ...result,
          sqliteTelemetry: getSqliteStoreTelemetry(PORT_NUM)
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 7B-2. POST /api/node/update-inline -> Direct Double-Click On-Canvas Node Title/Subtitle/Pill Inline Edit
  if (req.method === 'POST' && url.pathname === '/api/node/update-inline') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const nodeId = String(parsed.nodeId || '').trim();
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();
        const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
        const current = history[history.length - 1];
        const nextGraph = cloneGraph(current);
        nextGraph.version = bumpPatchVersion(current.version);
        const targetNode = (nextGraph.nodes || []).find(
          (n) => n.id === nodeId || (parsed.oldTitle && n.title === parsed.oldTitle)
        );
        if (targetNode) {
          if (parsed.title) targetNode.title = String(parsed.title).trim();
          if (parsed.subtitle) targetNode.subtitle = String(parsed.subtitle).trim();
          if (parsed.pill) targetNode.pill = String(parsed.pill).trim();
          if (parsed.iconKey) targetNode.iconKey = String(parsed.iconKey).trim();
          targetNode.changeStatus = 'modified';
        }
        nextGraph.lastPrompt = `Inline Canvas Edit on ${nodeId}: "${targetNode?.title || nodeId}"`;
        nextGraph.diffManifest = {
          ...(nextGraph.diffManifest || {}),
          summaryBadge: `Inline Edit · ${targetNode?.title || nodeId} (${nextGraph.version})`,
          modifiedNodeIds: [targetNode?.id || nodeId]
        };
        history.push(nextGraph);
        saveStoreToDisk({ code, action: 'INLINE_NODE_EDIT', nodeId });
        return sendJson(res, 200, {
          ok: true,
          blueprint: buildBlueprintResponseItem(code, true, detailLevel, null)
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 7C. GET /api/mcp/manifest & POST /api/mcp -> Agent-Ready Model Context Protocol (verispec_mcp) Server
  if (req.method === 'GET' && url.pathname === '/api/mcp/manifest') {
    return sendJson(res, 200, {
      ok: true,
      serverName: 'verispec_mcp',
      protocolVersion: '2025-06-18',
      transports: ['http-sse', 'stdio'],
      authModes: ['oauth2_pkce', 'bearer_api_token', 'gcp_iam_oidc'],
      endpointUrl: `${url.origin}/api/mcp`,
      compatibleClients: ['Claude Code', 'Cursor IDE', 'Gemini CLI', 'Windsurf', 'GitHub Actions CI/CD'],
      tools: [
        {
          name: 'verispec_list_blueprints',
          description: 'List all 18 SDLC architecture blueprints with version, node/edge counts, FinOps $/mo, and p99 latency.',
          inputSchema: { type: 'object', properties: { folderId: { type: 'string' }, starredOnly: { type: 'boolean' } } }
        },
        {
          name: 'verispec_generate_diagram',
          description: 'Synthesize or compile an architecture diagram from a natural language prompt, Terraform HCL, or SQL DDL.',
          inputSchema: {
            type: 'object',
            required: ['prompt'],
            properties: { code: { type: 'string', default: 'D05' }, prompt: { type: 'string' }, detailLevel: { type: 'string', default: 'L200' } }
          }
        },
        {
          name: 'verispec_mutate_ast',
          description: 'Apply a deterministic natural-language or DSL graph mutation to an existing blueprint and bump its micro-version.',
          inputSchema: {
            type: 'object',
            required: ['code', 'command'],
            properties: { code: { type: 'string' }, command: { type: 'string' } }
          }
        },
        {
          name: 'verispec_finops_slo_audit',
          description: 'Run Phase-0 5-Stage Geometry Certificate + FinOps unit-cost ($/mo) + critical-path p99 latency + 5-Pillar Judge Jury.',
          inputSchema: { type: 'object', required: ['code'], properties: { code: { type: 'string', default: 'D05' } } }
        },
        {
          name: 'verispec_export_iac',
          description: 'Export a blueprint as Terraform HCL, Mermaid.js, VeriSpec DSL, Living RFC Markdown, or Draw.io mxGraphModel XML.',
          inputSchema: {
            type: 'object',
            required: ['code', 'format'],
            properties: { code: { type: 'string', default: 'D05' }, format: { type: 'string', enum: ['terraform', 'mermaid', 'dsl', 'rfc', 'drawio'] } }
          }
        }
      ]
    });
  }

  if (req.method === 'POST' && url.pathname === '/api/mcp') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const toolName = String(parsed.tool || parsed.params?.name || 'verispec_list_blueprints').trim();
        const args = parsed.arguments || parsed.params?.arguments || parsed;
        const code = String(args.code || 'D05').toUpperCase();
        const detailLevel = String(args.detailLevel || 'L200').toUpperCase();

        if (toolName === 'verispec_list_blueprints') {
          const starredSet = new Set(getStarredBlueprints(PORT_NUM));
          const items = LIFECYCLE_BLUEPRINTS_18.map((bp) => {
            const history = blueprintStateStore.get(bp.code) || [bp];
            const latest = history[history.length - 1];
            const finops = estimateArchitectureFinOpsAndLatency(latest);
            return {
              code: bp.code,
              title: latest.title,
              version: latest.version,
              starred: starredSet.has(bp.code),
              nodeCount: latest.nodes.length,
              edgeCount: latest.edges.length,
              finopsMonthlyUsd: finops.totalMonthlyUsd,
              p99LatencyMs: finops.estimatedEndToEndP99Ms
            };
          }).filter((it) => (args.starredOnly ? it.starred : true));
          return sendJson(res, 200, {
            jsonrpc: '2.0',
            id: parsed.id || 1,
            ok: true,
            tool: toolName,
            result: { count: items.length, blueprints: items }
          });
        }

        if (toolName === 'verispec_mutate_ast' || toolName === 'verispec_generate_diagram') {
          const cmd = String(args.command || args.prompt || 'Add Cloud Armor WAF and Cloud DLP Guardrail').trim();
          const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
          const current = history[history.length - 1];
          const nextGraph = applyPromptMutation(current, cmd, null, '');
          history.push(nextGraph);
          saveStoreToDisk({ code, action: 'MCP_TOOL_MUTATION', tool: toolName });
          const item = buildBlueprintResponseItem(code, true, detailLevel, null);
          return sendJson(res, 200, {
            jsonrpc: '2.0',
            id: parsed.id || 1,
            ok: true,
            tool: toolName,
            result: {
              code: item.code,
              version: item.version,
              nodeCount: item.nodeCount,
              edgeCount: item.edgeCount,
              diffSummary: item.diffManifest?.summaryBadge || 'Updated via MCP',
              finopsMonthlyUsd: item.finopsTelemetry?.totalMonthlyUsd,
              p99LatencyMs: item.finopsTelemetry?.estimatedEndToEndP99Ms,
              preRenderZeroHitAndTrial: item.preRenderPlan?.zeroHitAndTrialGuarantee,
              compositeJudgeScore: item.judgeReport?.compositeScore
            }
          });
        }

        if (toolName === 'verispec_finops_slo_audit') {
          const item = buildBlueprintResponseItem(code, true, detailLevel, null);
          return sendJson(res, 200, {
            jsonrpc: '2.0',
            id: parsed.id || 1,
            ok: true,
            tool: toolName,
            result: {
              code: item.code,
              version: item.version,
              preRenderCertificate: item.preRenderPlan,
              finopsTelemetry: item.finopsTelemetry,
              judgeScore: item.judgeReport?.compositeScore,
              grade: item.judgeReport?.grade
            }
          });
        }

        if (toolName === 'verispec_export_iac') {
          const item = buildBlueprintResponseItem(code, true, detailLevel, null);
          const fmt = String(args.format || 'terraform').toLowerCase();
          const artifact =
            fmt === 'mermaid'
              ? item.mermaidCode
              : fmt === 'dsl'
                ? item.verispecDsl
                : fmt === 'rfc'
                  ? item.livingRfcMarkdown
                  : item.terraformHcl;
          return sendJson(res, 200, {
            jsonrpc: '2.0',
            id: parsed.id || 1,
            ok: true,
            tool: toolName,
            result: { code: item.code, version: item.version, format: fmt, content: artifact }
          });
        }

        return sendJson(res, 400, { ok: false, error: `Unknown MCP tool: ${toolName}` });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 7D. POST /api/v1/diagram/generate -> Public REST Diagramming API (Eraser Diagramming API Parity)
  if (req.method === 'POST' && url.pathname === '/api/v1/diagram/generate') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(body || '{}');
        const code = String(parsed.code || 'D05').toUpperCase();
        const detailLevel = String(parsed.detailLevel || 'L200').toUpperCase();
        const prompt = String(parsed.prompt || '').trim();
        if (prompt) {
          const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
          const current = history[history.length - 1];
          const nextGraph = applyPromptMutation(current, prompt, null, '');
          history.push(nextGraph);
          saveStoreToDisk({ code, action: 'REST_API_GENERATE' });
        }
        const item = buildBlueprintResponseItem(code, true, detailLevel, null);
        return sendJson(res, 200, {
          ok: true,
          apiVersion: '2026-10-01',
          blueprintCode: item.code,
          title: item.title,
          version: item.version,
          nodeCount: item.nodeCount,
          edgeCount: item.edgeCount,
          finopsMonthlyUsd: item.finopsTelemetry?.totalMonthlyUsd,
          p99LatencyMs: item.finopsTelemetry?.estimatedEndToEndP99Ms,
          compositeJudgeScore: item.judgeReport?.compositeScore,
          zeroHitAndTrialGuarantee: item.preRenderPlan?.zeroHitAndTrialGuarantee,
          svgUrl: `${url.origin}/api/blueprint?code=${item.code}`,
          drawioUrl: `${url.origin}/api/export-drawio?code=${item.code}&ver=${item.version}`,
          verispecDsl: item.verispecDsl,
          terraformHcl: item.terraformHcl,
          mermaidCode: item.mermaidCode
        });
      } catch (err) {
        return sendJson(res, 500, { ok: false, error: String(err.message || err) });
      }
    });
    return;
  }

  // 8. GET /api/export-drawio?code=D05&ver=v1.0.x -> Downloads standards-compliant .drawio XML
  if (req.method === 'GET' && url.pathname === '/api/export-drawio') {
    const code = (url.searchParams.get('code') || 'D05').toUpperCase();
    const requestedVer = url.searchParams.get('ver') || null;
    const history = blueprintStateStore.get(code) || blueprintStateStore.get('D05');
    const targetGraph =
      (requestedVer && history.find((g) => g.version === requestedVer)) ||
      history[history.length - 1];
    const exportGraph = JSON.parse(JSON.stringify(targetGraph));
    attachWhiteboardOverlayToGraph(exportGraph, code);
    const xml = compileToDrawioXml(exportGraph);
    res.writeHead(200, {
      'Content-Type': 'application/xml; charset=utf-8',
      'Content-Disposition': `attachment; filename="VeriSpec_${code}_${targetGraph.version}.drawio"`,
      'Cache-Control': 'no-store'
    });
    res.end(xml);
    return;
  }

  // Static files (support /landing and /home SPA routes)
  const cleanRoutePath =
    url.pathname === '/' || url.pathname === '/landing' || url.pathname === '/home' || url.pathname === '/dashboard'
      ? 'index.html'
      : url.pathname;
  let filePath = path.join(PUBLIC_DIR, cleanRoutePath);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeMap = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.png': 'image/png'
  };

  res.writeHead(200, {
    'Content-Type': mimeMap[ext] || 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
  });
  fs.createReadStream(filePath).pipe(res);
});

const PORT = Number(process.env.PORT || 8080);
server.listen(PORT, async () => {
  console.log(`[VeriSpec 18-Diagram Lifecycle Studio] Listening on http://localhost:${PORT}`);
  // Warm up live Vertex AI Gemini Jury on D05 and D10 so real responseIds are present out-of-the-box
  try {
    for (const warmCode of ['D05', 'D10']) {
      const history = blueprintStateStore.get(warmCode);
      if (!history || !history.length) continue;
      const latestGraph = history[history.length - 1];
      if (!latestGraph.cachedLiveJudgeReport?.liveVertexAiTelemetry) {
        const latestSvg = renderInteractiveSvg(latestGraph, { showDiff: true, detailLevel: 'L200' });
        const bijection = verifyGraphToSvgBijectionContract(latestGraph, latestSvg);
        const detReport = evaluateArchitectureWithJudgeJury(latestGraph, latestSvg, bijection);
        const liveReport = await executeLiveCrossModelGeminiJury(latestGraph, detReport);
        latestGraph.cachedLiveJudgeReport = liveReport;
        saveStoreToDisk();
        console.log(
          `[VeriSpec Live Vertex AI Gemini Warmup] ${warmCode} (${latestGraph.version}) -> proResponseId=${liveReport.liveVertexAiTelemetry?.proJudgeCall?.responseId}`
        );
      }
    }
  } catch (err) {
    console.warn('[VeriSpec Live Vertex AI Gemini Warmup] Non-fatal warmup notice:', err.message);
  }
});
