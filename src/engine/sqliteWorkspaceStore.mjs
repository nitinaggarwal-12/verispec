import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STATE_DIR = path.resolve(__dirname, '../../.local_state');

export const CANONICAL_GITHUB_REPO_URL = 'https://github.com/nitinaggarwal-12/verispec';

let dbInstance = null;
let activeDbPath = null;

function sha256Hex(input) {
  return crypto.createHash('sha256').update(String(input)).digest('hex');
}

const DEFAULT_COLLAB_THREADS = {};

function buildDefaultRfcBlocks(code, title = 'Enterprise Cloud Architecture') {
  const execText = `${title} (${code}) is engineered for zero-trust multi-region high availability (99.999% SLA), deterministic Phase-0 layout geometry, and strict FinOps unit-cost governance. Use the "/" slash command menu below to insert custom narrative sections, callouts, code blocks, or embedded cross-lifecycle diagrams.`;
  const calloutText = 'All inter-zone service-to-service RPCs enforce mTLS 1.3 with SPIFFE workload identities, Cloud DLP inline PII redaction, and Cloud KMS HSM Customer-Managed Encryption Keys (CMEK).';
  const tradeoffText = 'Selected Cloud Spanner Global HA + Memorystore Redis L2 over single-region PostgreSQL to eliminate cross-region failover data loss (RPO = 0s vs 45s) while bounding read p99 latency under 5ms.';
  return [
    {
      id: `blk_${code.toLowerCase()}_exec`,
      type: 'h2',
      title: '1. Executive Context & Architectural Mandate',
      content: execText,
      text: execText,
      embedCode: '',
      diagramCode: '',
      updatedBy: 'Workspace Author',
      updatedAt: new Date().toISOString()
    },
    {
      id: `blk_${code.toLowerCase()}_callout`,
      type: 'callout',
      title: 'SRE & Security Compliance Gate (21 CFR Part 11 / SOC2 Type II)',
      content: calloutText,
      text: calloutText,
      embedCode: '',
      diagramCode: '',
      updatedBy: 'Workspace Author',
      updatedAt: new Date().toISOString()
    },
    {
      id: `blk_${code.toLowerCase()}_tradeoffs`,
      type: 'decision_table',
      title: '2. Key Architectural Trade-Offs & ADR Decisions',
      content: tradeoffText,
      text: tradeoffText,
      embedCode: '',
      diagramCode: '',
      updatedBy: 'Workspace Author',
      updatedAt: new Date().toISOString()
    }
  ];
}

export function initSqliteWorkspaceStore(port = 8080) {
  if (dbInstance && activeDbPath) {
    return dbInstance;
  }
  if (!fs.existsSync(STATE_DIR)) {
    fs.mkdirSync(STATE_DIR, { recursive: true });
  }
  activeDbPath = path.join(STATE_DIR, `verispec_sot_${port}.db`);
  dbInstance = new DatabaseSync(activeDbPath);

  dbInstance.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS workspaces (
      workspace_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      repo_url TEXT NOT NULL,
      active_branch TEXT NOT NULL,
      folders_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS blueprint_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      blueprint_code TEXT NOT NULL,
      version_index INTEGER NOT NULL,
      version TEXT NOT NULL,
      prompt TEXT NOT NULL,
      node_count INTEGER NOT NULL,
      edge_count INTEGER NOT NULL,
      graph_json TEXT NOT NULL,
      sha256_digest TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(blueprint_code, version_index)
    );

    CREATE TABLE IF NOT EXISTS whiteboard_overlays (
      blueprint_code TEXT PRIMARY KEY,
      strokes_json TEXT NOT NULL DEFAULT '[]',
      stickies_json TEXT NOT NULL DEFAULT '[]',
      node_sizes_json TEXT NOT NULL DEFAULT '{}',
      edge_waypoints_json TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rfc_custom_blocks (
      blueprint_code TEXT PRIMARY KEY,
      blocks_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS collab_threads (
      thread_id TEXT PRIMARY KEY,
      blueprint_code TEXT NOT NULL,
      target_node_id TEXT,
      anchor_x INTEGER NOT NULL,
      anchor_y INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'OPEN',
      author TEXT NOT NULL,
      avatar_color TEXT NOT NULL,
      messages_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS workspace_starred_blueprints (
      blueprint_code TEXT PRIMARY KEY,
      starred INTEGER NOT NULL DEFAULT 1,
      starred_by TEXT NOT NULL DEFAULT 'workspace_user',
      updated_at TEXT NOT NULL
    );
  `);

  // Ensure default workspace metadata row exists with unified folder IDs
  const defaultFolders = [
    { id: 'fld_01', name: '01 · Product Discovery & UX (D01–D03)', codes: ['D01', 'D02', 'D03'] },
    { id: 'fld_02', name: '02 · Cloud & C4 Architecture (D04–D09)', codes: ['D04', 'D05', 'D06', 'D07', 'D08', 'D09'] },
    { id: 'fld_03', name: '03 · Data Lakehouse & Agentic AI (D10–D12)', codes: ['D10', 'D11', 'D12'] },
    { id: 'fld_04', name: '04 · Zero-Trust Security & SRE (D13–D18)', codes: ['D13', 'D14', 'D15', 'D16', 'D17', 'D18'] }
  ];

  const upsertWs = dbInstance.prepare(`
    INSERT INTO workspaces (workspace_id, name, repo_url, active_branch, folders_json, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(workspace_id) DO UPDATE SET
      repo_url = excluded.repo_url,
      folders_json = excluded.folders_json,
      updated_at = excluded.updated_at
  `);
  upsertWs.run(
    'ws_verispec_prod',
    'VeriSpec Enterprise Architecture Studio',
    CANONICAL_GITHUB_REPO_URL,
    'main',
    JSON.stringify(defaultFolders),
    new Date().toISOString()
  );

  // Seed default starred blueprints if table is empty
  const starCountRow = dbInstance.prepare(`SELECT COUNT(*) AS cnt FROM workspace_starred_blueprints`).get();
  if (!starCountRow || Number(starCountRow.cnt) === 0) {
    const insStar = dbInstance.prepare(`
      INSERT OR IGNORE INTO workspace_starred_blueprints (blueprint_code, starred, starred_by, updated_at)
      VALUES (?, 1, 'workspace_user', ?)
    `);
    for (const stCode of ['D05', 'D06', 'D10', 'D12', 'D15']) {
      insStar.run(stCode, new Date().toISOString());
    }
  }

  return dbInstance;
}

export function saveBlueprintHistoryToSqlite(blueprintStateStore, port = 8080) {
  const db = initSqliteWorkspaceStore(port);
  const now = new Date().toISOString();

  db.exec('BEGIN IMMEDIATE');
  try {
    const activeCodes = Array.from(blueprintStateStore.keys());
    if (activeCodes.length > 0) {
      const placeholders = activeCodes.map(() => '?').join(',');
      db.prepare(`DELETE FROM blueprint_versions WHERE blueprint_code NOT IN (${placeholders})`).run(...activeCodes);
    } else {
      db.exec(`DELETE FROM blueprint_versions`);
    }

    const delStmt = db.prepare(`DELETE FROM blueprint_versions WHERE blueprint_code = ?`);
    const insStmt = db.prepare(`
      INSERT INTO blueprint_versions (
        blueprint_code, version_index, version, prompt, node_count, edge_count, graph_json, sha256_digest, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const [code, history] of blueprintStateStore.entries()) {
      if (!Array.isArray(history)) continue;
      delStmt.run(code);
      history.forEach((graph, idx) => {
        const jsonStr = JSON.stringify(graph);
        const digest = sha256Hex(jsonStr);
        insStmt.run(
          code,
          idx,
          String(graph.version || (idx === 0 ? 'Baseline' : `Rev-${idx + 1}`)),
          String(graph.prompt || 'Baseline Seed'),
          Array.isArray(graph.nodes) ? graph.nodes.length : 0,
          Array.isArray(graph.edges) ? graph.edges.length : 0,
          jsonStr,
          digest,
          String(graph.timestamp || now)
        );
      });
    }
    db.exec('COMMIT');
  } catch (err) {
    try {
      db.exec('ROLLBACK');
    } catch {
      // ignore rollback error
    }
    throw err;
  }
}

export function loadBlueprintHistoryFromSqlite(blueprintStateStore, port = 8080) {
  const db = initSqliteWorkspaceStore(port);
  const rows = db
    .prepare(`SELECT blueprint_code, version_index, graph_json FROM blueprint_versions ORDER BY blueprint_code ASC, version_index ASC`)
    .all();
  if (!rows || rows.length === 0) {
    return false;
  }
  const grouped = new Map();
  for (const r of rows) {
    if (!grouped.has(r.blueprint_code)) {
      grouped.set(r.blueprint_code, []);
    }
    try {
      const g = JSON.parse(r.graph_json);
      grouped.get(r.blueprint_code).push(g);
    } catch {
      // ignore malformed row
    }
  }
  if (grouped.size < 18) {
    return false;
  }
  blueprintStateStore.clear();
  for (const [code, hist] of grouped.entries()) {
    if (hist.length > 0) {
      blueprintStateStore.set(code, hist);
    }
  }
  return blueprintStateStore.size >= 18;
}

export function getWhiteboardOverlay(code, port = 8080) {
  const db = initSqliteWorkspaceStore(port);
  const cleanCode = String(code || 'D05').toUpperCase();
  const row = db
    .prepare(`SELECT strokes_json, stickies_json, node_sizes_json, edge_waypoints_json, updated_at FROM whiteboard_overlays WHERE blueprint_code = ?`)
    .get(cleanCode);
  if (!row) {
    return {
      blueprintCode: cleanCode,
      freehandStrokes: [],
      stickyNotes: [],
      nodeSizeOverrides: {},
      edgeWaypoints: {},
      updatedAt: null
    };
  }
  return {
    blueprintCode: cleanCode,
    freehandStrokes: JSON.parse(row.strokes_json || '[]'),
    stickyNotes: JSON.parse(row.stickies_json || '[]'),
    nodeSizeOverrides: JSON.parse(row.node_sizes_json || '{}'),
    edgeWaypoints: JSON.parse(row.edge_waypoints_json || '{}'),
    updatedAt: row.updated_at
  };
}

export function saveWhiteboardOverlay(code, overlay, port = 8080) {
  const db = initSqliteWorkspaceStore(port);
  const cleanCode = String(code || 'D05').toUpperCase();
  const current = getWhiteboardOverlay(cleanCode, port);
  const next = {
    freehandStrokes: Array.isArray(overlay.freehandStrokes) ? overlay.freehandStrokes : current.freehandStrokes,
    stickyNotes: Array.isArray(overlay.stickyNotes) ? overlay.stickyNotes : current.stickyNotes,
    nodeSizeOverrides: overlay.nodeSizeOverrides && typeof overlay.nodeSizeOverrides === 'object' ? overlay.nodeSizeOverrides : current.nodeSizeOverrides,
    edgeWaypoints: overlay.edgeWaypoints && typeof overlay.edgeWaypoints === 'object' ? overlay.edgeWaypoints : current.edgeWaypoints
  };
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO whiteboard_overlays (blueprint_code, strokes_json, stickies_json, node_sizes_json, edge_waypoints_json, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(blueprint_code) DO UPDATE SET
      strokes_json = excluded.strokes_json,
      stickies_json = excluded.stickies_json,
      node_sizes_json = excluded.node_sizes_json,
      edge_waypoints_json = excluded.edge_waypoints_json,
      updated_at = excluded.updated_at
  `).run(
    cleanCode,
    JSON.stringify(next.freehandStrokes),
    JSON.stringify(next.stickyNotes),
    JSON.stringify(next.nodeSizeOverrides),
    JSON.stringify(next.edgeWaypoints),
    now
  );
  return getWhiteboardOverlay(cleanCode, port);
}

export function resetWhiteboardOverlay(code = null, port = 8080) {
  const db = initSqliteWorkspaceStore(port);
  if (code) {
    db.prepare(`DELETE FROM whiteboard_overlays WHERE blueprint_code = ?`).run(String(code).toUpperCase());
  } else {
    db.exec(`DELETE FROM whiteboard_overlays`);
  }
}

export function getRfcCustomBlocks(code, defaultTitle = 'Enterprise Cloud Architecture', port = 8080) {
  const db = initSqliteWorkspaceStore(port);
  const cleanCode = String(code || 'D05').toUpperCase();
  const row = db
    .prepare(`SELECT blocks_json, updated_at FROM rfc_custom_blocks WHERE blueprint_code = ?`)
    .get(cleanCode);
  if (!row) {
    const seeded = buildDefaultRfcBlocks(cleanCode, defaultTitle);
    return saveRfcCustomBlocks(cleanCode, seeded, port);
  }
  try {
    const parsed = JSON.parse(row.blocks_json);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return buildDefaultRfcBlocks(cleanCode, defaultTitle);
    }
    return parsed.map((b, idx) => {
      const bodyText = String(b.content || b.text || '').trim();
      const emb = b.embedCode || b.diagramCode ? String(b.embedCode || b.diagramCode).toUpperCase() : '';
      return {
        ...b,
        id: String(b.id || `blk_${cleanCode.toLowerCase()}_${idx + 1}`),
        type: String(b.type || 'paragraph'),
        title: String(b.title || `Section ${idx + 1}`).trim(),
        content: bodyText,
        text: bodyText,
        embedCode: emb,
        diagramCode: emb
      };
    });
  } catch {
    return buildDefaultRfcBlocks(cleanCode, defaultTitle);
  }
}

export function saveRfcCustomBlocks(code, blocks, port = 8080) {
  const db = initSqliteWorkspaceStore(port);
  const cleanCode = String(code || 'D05').toUpperCase();
  const sanitized = (Array.isArray(blocks) ? blocks : []).map((b, idx) => {
    const bodyText = String(b.content || b.text || '').trim();
    const emb = (b.embedCode || b.diagramCode) ? String(b.embedCode || b.diagramCode).toUpperCase() : '';
    return {
      id: String(b.id || `blk_${cleanCode.toLowerCase()}_${idx + 1}`),
      type: String(b.type || 'paragraph'),
      title: String(b.title || `Section ${idx + 1}`).trim(),
      content: bodyText,
      text: bodyText,
      embedCode: emb,
      diagramCode: emb,
      updatedBy: String(b.updatedBy || 'Workspace Author'),
      updatedAt: new Date().toISOString()
    };
  });
  db.prepare(`
    INSERT INTO rfc_custom_blocks (blueprint_code, blocks_json, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(blueprint_code) DO UPDATE SET
      blocks_json = excluded.blocks_json,
      updated_at = excluded.updated_at
  `).run(cleanCode, JSON.stringify(sanitized), new Date().toISOString());
  return sanitized;
}

export function getCollabThreads(code = null, port = 8080) {
  const db = initSqliteWorkspaceStore(port);
  const rows = code
    ? db.prepare(`SELECT * FROM collab_threads WHERE blueprint_code = ? ORDER BY updated_at DESC`).all(String(code).toUpperCase())
    : db.prepare(`SELECT * FROM collab_threads ORDER BY updated_at DESC`).all();
  return rows.map((r) => {
    const msgs = JSON.parse(r.messages_json || '[]');
    const firstMsg = msgs[0] || {};
    return {
      id: r.thread_id,
      threadId: r.thread_id,
      blueprintCode: r.blueprint_code,
      targetNodeId: r.target_node_id || 'canvas_root',
      targetId: r.target_node_id || 'canvas_root',
      anchorX: r.anchor_x,
      anchorY: r.anchor_y,
      status: r.status,
      author: r.author,
      avatarColor: r.avatar_color,
      text: firstMsg.text || '',
      messages: msgs,
      replies: msgs.slice(1),
      updatedAt: r.updated_at
    };
  });
}

function extractMentions(text) {
  const matches = String(text || '').match(/@[a-zA-Z0-9_.-]+/g);
  return matches ? Array.from(new Set(matches)) : [];
}

export function createCollabThread(payload = {}, port = 8080) {
  const db = initSqliteWorkspaceStore(port);
  const cleanCode = String(payload.code || payload.blueprintCode || 'D05').toUpperCase();
  const threadId = payload.threadId || `thr_${cleanCode.toLowerCase()}_${Date.now()}`;
  const author = String(payload.author || 'Workspace Author (@architect)').trim();
  const role = String(payload.role || 'System Architect').trim();
  const text = String(payload.text || '@reviewer Verify HA failover & mTLS 1.3 policy on this tier.').trim();
  const mentions = extractMentions(text);
  const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const messages = [
    {
      id: `msg_${Date.now()}`,
      author,
      role,
      text,
      mentions,
      createdAt: nowTime
    }
  ];

  db.prepare(`
    INSERT INTO collab_threads (
      thread_id, blueprint_code, target_node_id, anchor_x, anchor_y, status, author, avatar_color, messages_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(thread_id) DO UPDATE SET
      messages_json = excluded.messages_json,
      status = excluded.status,
      updated_at = excluded.updated_at
  `).run(
    threadId,
    cleanCode,
    payload.targetNodeId || payload.targetId || 'canvas_root',
    Number(payload.anchorX) || 680,
    Number(payload.anchorY) || 220,
    'OPEN',
    author,
    payload.avatarColor || '#2563EB',
    JSON.stringify(messages),
    new Date().toISOString()
  );

  return getCollabThreads(cleanCode, port);
}

export function replyToCollabThread(threadId, payload = {}, port = 8080) {
  const db = initSqliteWorkspaceStore(port);
  const row = db.prepare(`SELECT * FROM collab_threads WHERE thread_id = ?`).get(String(threadId));
  if (!row) return null;
  const messages = JSON.parse(row.messages_json || '[]');
  const text = String(payload.text || '').trim();
  if (text) {
    messages.push({
      id: `msg_${Date.now()}`,
      author: String(payload.author || 'Workspace Reviewer (@reviewer)'),
      role: String(payload.role || 'Reviewer'),
      text,
      mentions: extractMentions(text),
      createdAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });
  }
  const nextStatus = payload.status ? String(payload.status).toUpperCase() : row.status;
  db.prepare(`UPDATE collab_threads SET messages_json = ?, status = ?, updated_at = ? WHERE thread_id = ?`).run(
    JSON.stringify(messages),
    nextStatus,
    new Date().toISOString(),
    String(threadId)
  );
  return getCollabThreads(row.blueprint_code, port);
}

export function getStarredBlueprints(port = 8080) {
  const db = initSqliteWorkspaceStore(port);
  return db
    .prepare(`SELECT blueprint_code FROM workspace_starred_blueprints WHERE starred = 1 ORDER BY blueprint_code ASC`)
    .all()
    .map((r) => r.blueprint_code);
}

export function toggleStarredBlueprint(code = 'D05', starredOverride = null, port = 8080) {
  const db = initSqliteWorkspaceStore(port);
  const cleanCode = String(code || 'D05').toUpperCase();
  const existing = db
    .prepare(`SELECT starred FROM workspace_starred_blueprints WHERE blueprint_code = ?`)
    .get(cleanCode);
  const nextStarred =
    starredOverride !== null && starredOverride !== undefined
      ? starredOverride
        ? 1
        : 0
      : existing && Number(existing.starred) === 1
        ? 0
        : 1;
  db.prepare(`
    INSERT INTO workspace_starred_blueprints (blueprint_code, starred, starred_by, updated_at)
    VALUES (?, ?, 'workspace_user', ?)
    ON CONFLICT(blueprint_code) DO UPDATE SET
      starred = excluded.starred,
      updated_at = excluded.updated_at
  `).run(cleanCode, nextStarred, new Date().toISOString());
  return {
    code: cleanCode,
    starred: nextStarred === 1,
    starredBlueprints: getStarredBlueprints(port)
  };
}

export function getSqliteStoreTelemetry(port = 8080) {
  const db = initSqliteWorkspaceStore(port);
  const journalMode = db.prepare(`PRAGMA journal_mode`).get()?.journal_mode || 'wal';
  const ws = db.prepare(`SELECT * FROM workspaces WHERE workspace_id = 'ws_verispec_prod'`).get();
  const verStats = db
    .prepare(`SELECT COUNT(DISTINCT blueprint_code) AS bpCount, COUNT(*) AS verCount FROM blueprint_versions`)
    .get();
  const wbCount = db.prepare(`SELECT COUNT(*) AS cnt FROM whiteboard_overlays`).get()?.cnt || 0;
  const rfcCount = db.prepare(`SELECT COUNT(*) AS cnt FROM rfc_custom_blocks`).get()?.cnt || 0;
  const threadCount = db.prepare(`SELECT COUNT(*) AS cnt FROM collab_threads`).get()?.cnt || 0;
  const starredList = getStarredBlueprints(port);
  const digests = db
    .prepare(`SELECT sha256_digest FROM blueprint_versions ORDER BY blueprint_code ASC, version_index ASC`)
    .all()
    .map((r) => r.sha256_digest)
    .join(':');

  const countsObj = {
    blueprints: Number(verStats?.bpCount || 0),
    versions: Number(verStats?.verCount || 0),
    blueprintVersions: Number(verStats?.verCount || 0),
    whiteboardOverlays: Number(wbCount),
    rfcBlockDocs: Number(rfcCount),
    rfcCustomBlocks: Number(rfcCount),
    collabThreads: Number(threadCount),
    starredBlueprints: starredList.length
  };

  return {
    engine: 'node:sqlite (DatabaseSync)',
    journalMode: String(journalMode).toUpperCase(),
    dbPath: activeDbPath,
    workspaceId: ws?.workspace_id || 'ws_verispec_prod',
    workspaceName: ws?.name || 'VeriSpec Enterprise Architecture Studio',
    repoUrl: ws?.repo_url || CANONICAL_GITHUB_REPO_URL,
    activeBranch: ws?.active_branch || 'main',
    folders: JSON.parse(ws?.folders_json || '[]'),
    starredBlueprints: starredList,
    counts: countsObj,
    tableCounts: countsObj,
    combinedSqliteSha256: sha256Hex(digests || 'empty')
  };
}

export function resetSqliteWorkspaceToCanonicalBaseline(blueprintStateStore = null, port = 8080) {
  const db = initSqliteWorkspaceStore(port);
  db.exec(`DELETE FROM whiteboard_overlays;`);
  db.exec(`DELETE FROM rfc_custom_blocks;`);
  db.exec(`DELETE FROM collab_threads;`);
  const insertThread = db.prepare(`
    INSERT OR REPLACE INTO collab_threads (
      thread_id, blueprint_code, target_node_id, anchor_x, anchor_y, status, author, avatar_color, messages_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const threads of Object.values(DEFAULT_COLLAB_THREADS)) {
    for (const t of threads) {
      insertThread.run(
        t.threadId,
        t.blueprintCode,
        t.targetNodeId || null,
        t.anchorX,
        t.anchorY,
        t.status,
        t.author,
        t.avatarColor,
        JSON.stringify(t.messages),
        new Date().toISOString()
      );
    }
  }
  if (blueprintStateStore && typeof blueprintStateStore.entries === 'function') {
    saveBlueprintHistoryToSqlite(blueprintStateStore, port);
  }
  return getSqliteStoreTelemetry(port);
}

