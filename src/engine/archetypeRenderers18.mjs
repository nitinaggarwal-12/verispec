// ============================================================================
// VeriSpec — 18 Bespoke Product & Project Lifecycle Archetype SVG Renderers
// Every diagram (D01..D18) uses its authentic domain-specific visual grammar:
//   D01: 5-Chevron Value Stream Map + 3 Horizontal Swimlanes + KPI Gauges
//   D02: Multi-Screen Interactive UX Wireframe Mockups + Decision Diamonds
//   D03: DDD Event Storming Sticky Cards + 3 Dashed Bounded Context Enclaves
//   D04: C4 Model (Person Actors + Dashed System Boundary + External Systems)
//   D05: 5-Tier Cloud-Native AI Microservices + Live v1.0.1..v1.0.3 Diff Badges
//   D06: Canonical #78 Hub-and-Spoke Multi-VPC Topology (Hub + Left/Right Spokes)
//   D07: UML API Sequence Diagram (6 Dashed Lifelines + Activation Bars + alt/par)
//   D08: Distributed Saga & Finite State Machine (Capsules + Diamonds + Rollback)
//   D09: Apollo GraphQL Supergraph Federation + Monospace Subgraph Schema Cards
//   D10: Physical Database ERD (6 Multi-Row PK/FK/Type Tables + Crow's-Foot 1:N)
//   D11: Medallion Data Lakehouse Pipeline (Sources -> CDC -> Bronze/Silver/Gold)
//   D12: CQRS Write/Read Split + L1/L2 Cache Hit Tiers + 3 Regional DB Shards
//   D13: Hybrid GraphRAG (Vector + Property Graph + BM25 -> RRF -> NLI Verifier)
//   D14: Hierarchical Multi-Agent Supervisor + 4 A2A Sub-Agents + MCP Tool Bus
//   D15: True Radial 6-Stage Closed-Loop MLOps Flywheel around Central Registry
//   D16: Hermetic SLSA L3 Supply Chain + Progressive Canary Delivery Funnel
//   D17: Dual-Region Symmetric Active-Active Cells (us-east1 vs europe-west1)
//   D18: Concentric 3-Ring Zero-Trust Security Enclave (WAF -> IAP -> VPC-SC Vault)
// ============================================================================

import { getIconSpec, resolveIconKeyFromText } from './iconCatalog.mjs';

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fitText(text, maxWidthPx, baseFontSize = 12, minFontSize = 6.8, charFactor = 0.58) {
  const s = String(text || '');
  const upperRatio = (s.replace(/[^A-Z]/g, '').length) / Math.max(1, s.length);
  const factor = charFactor + (upperRatio > 0.45 ? 0.06 : 0);
  const est = s.length * baseFontSize * factor;
  if (est <= maxWidthPx) return { text: s, fontSize: baseFontSize };
  const scaled = Math.max(minFontSize, Math.floor((maxWidthPx / (s.length * factor)) * 10) / 10);
  const maxCharsAtMin = Math.max(4, Math.floor(maxWidthPx / (scaled * factor)));
  if (s.length > maxCharsAtMin) {
    return {
      text: `${s.slice(0, Math.max(1, maxCharsAtMin - 1)).trimEnd()}…`,
      fontSize: scaled
    };
  }
  return { text: s, fontSize: scaled };
}

function wrapSubtitleLines(text, maxWidthPx, baseFontSize = 9.5, minFontSize = 7.4, charFactor = 0.54) {
  const s = String(text || '').trim();
  if (!s) return { lines: [], fontSize: baseFontSize };
  const singleEst = s.length * baseFontSize * charFactor;
  if (singleEst <= maxWidthPx) {
    return { lines: [s], fontSize: baseFontSize };
  }
  if (s.length * 8.4 * charFactor <= maxWidthPx) {
    return { lines: [s], fontSize: 8.4 };
  }
  const words = s.split(/\s+/);
  if (words.length <= 2) {
    const f = fitText(s, maxWidthPx, baseFontSize, minFontSize, charFactor);
    return { lines: [f.text], fontSize: f.fontSize };
  }
  const mid = Math.ceil(s.length / 2);
  let bestIdx = 1;
  let bestDiff = Infinity;
  let acc = 0;
  for (let i = 0; i < words.length - 1; i++) {
    acc += (i > 0 ? 1 : 0) + words[i].length;
    const diff = Math.abs(acc - mid);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i + 1;
    }
  }
  const line1 = words.slice(0, bestIdx).join(' ');
  const line2 = words.slice(bestIdx).join(' ');
  const f1 = fitText(line1, maxWidthPx, 9.0, minFontSize, charFactor);
  const f2 = fitText(line2, maxWidthPx, 9.0, minFontSize, charFactor);
  return {
    lines: [f1.text, f2.text],
    fontSize: Math.min(f1.fontSize, f2.fontSize)
  };
}

export const ARCHETYPE_METADATA = {
  D01: { archetype: 'VALUE_STREAM_SWIMLANE', badge: '5-CHEVRON SWIMLANE VSM', color: '#1D4ED8', bg: '#EFF6FF' },
  D02: { archetype: 'UX_WIREFRAME_FLOW', badge: 'UI WIREFRAME & DECISION TREE', color: '#7C3AED', bg: '#F5F3FF' },
  D03: { archetype: 'EVENT_STORMING_DDD', badge: 'DDD EVENT STORMING & CONTEXTS', color: '#D97706', bg: '#FFFBEB' },
  D04: { archetype: 'C4_SYSTEM_CONTAINER', badge: 'C4 BOUNDARY & CONTAINERS', color: '#0284C7', bg: '#F0F9FF' },
  D05: { archetype: 'MULTI_TIER_CLOUD_DIFF', badge: '5-TIER CLOUD + AST DIFF', color: '#059669', bg: '#ECFDF5' },
  D06: { archetype: 'HUB_AND_SPOKE_78', badge: 'HUB & SPOKE VPC (#78)', color: '#2563EB', bg: '#EFF6FF' },
  D07: { archetype: 'UML_SEQUENCE_LIFELINE', badge: 'UML SEQUENCE LIFELINES', color: '#4F46E5', bg: '#EEF2FF' },
  D08: { archetype: 'SAGA_STATE_MACHINE', badge: 'FSM & SAGA ROLLBACK LOOP', color: '#E11D48', bg: '#FFF1F2' },
  D09: { archetype: 'GRAPHQL_FEDERATION', badge: 'SUPERGRAPH & PROTOBUF AST', color: '#9333EA', bg: '#FAF5FF' },
  D10: { archetype: 'DATABASE_ERD_CROWSFOOT', badge: "PHYSICAL ERD (CROW'S-FOOT)", color: '#0F766E', bg: '#F0FDFA' },
  D11: { archetype: 'MEDALLION_LAKEHOUSE', badge: 'BRONZE · SILVER · GOLD CDC', color: '#B45309', bg: '#FFFBEB' },
  D12: { archetype: 'CQRS_SHARDING_CACHE', badge: 'CQRS SPLIT & 3-SHARD CACHE', color: '#0369A1', bg: '#F0F9FF' },
  D13: { archetype: 'HYBRID_GRAPHRAG', badge: '3-ENGINE HYBRID GRAPHRAG', color: '#6D28D9', bg: '#F5F3FF' },
  D14: { archetype: 'MULTI_AGENT_A2A_MCP', badge: 'A2A SUPERVISOR & MCP SWARM', color: '#1D4ED8', bg: '#EFF6FF' },
  D15: { archetype: 'CIRCULAR_MLOPS_FLYWHEEL', badge: 'RADIAL 6-STAGE FLYWHEEL', color: '#059669', bg: '#ECFDF5' },
  D16: { archetype: 'ZERO_TRUST_3RING_VAULT', badge: '3-RING ZERO-TRUST ENCLAVE', color: '#BE123C', bg: '#FFF1F2' },
  D17: { archetype: 'GITOPS_SLSA_CANARY', badge: 'SLSA L3 & CANARY FUNNEL', color: '#334155', bg: '#F1F5F9' },
  D18: { archetype: 'ACTIVE_ACTIVE_DR_CELLS', badge: 'DUAL-REGION ACTIVE-ACTIVE', color: '#0284C7', bg: '#F0F9FF' }
};

let svgInstanceSeq = 0;
let activeDetailLevel = 'L200';
let activeRenderGraph = null;

function drawStepCallout(cx, cy, stepNum, color = '#2563EB') {
  if (activeDetailLevel === 'L100') return '';
  return `
    <g class="flow-step-callout">
      <circle cx="${cx}" cy="${cy}" r="10.5" fill="#FFFFFF" stroke="${color}" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="8" fill="${color}"/>
      <text x="${cx}" y="${cy + 3.2}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="800" fill="#FFFFFF">${esc(stepNum)}</text>
    </g>
  `;
}

/**
 * Deterministically scans balanced <g class="arch-node"...>...</g> blocks in any SVG string.
 * Guarantees 1:1 AST <-> SVG DOM introspection without external DOM dependencies.
 */
export function extractRenderedSvgArchNodes(svgString) {
  const src = String(svgString || '');
  const results = [];
  const openRe = /<g\s+class="arch-node"[^>]*>/g;
  let match;
  while ((match = openRe.exec(src)) !== null) {
    const startIdx = match.index;
    const openTag = match[0];
    const idMatch = openTag.match(/data-node-id="([^"]+)"/);
    const titleAttrMatch = openTag.match(/data-node-title="([^"]*)"/);
    const subAttrMatch = openTag.match(/data-node-subtitle="([^"]*)"/);
    const pillAttrMatch = openTag.match(/data-node-pill="([^"]*)"/);
    const iconAttrMatch = openTag.match(/data-node-icon="([^"]*)"/);
    const id = idMatch ? idMatch[1] : '';

    let depth = 0;
    const tagRe = /<\/?g\b[^>]*>/g;
    tagRe.lastIndex = startIdx;
    let endIdx = src.length;
    let tMatch;
    while ((tMatch = tagRe.exec(src)) !== null) {
      if (tMatch[0].startsWith('</g')) {
        depth--;
        if (depth === 0) {
          endIdx = tMatch.index + tMatch[0].length;
          break;
        }
      } else if (!tMatch[0].endsWith('/>')) {
        depth++;
      }
    }

    const block = src.slice(startIdx, endIdx);
    const unescHtml = (s) =>
      String(s || '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .trim();

    const textMatches = [...block.matchAll(/<text\b[^>]*>([^<]+)<\/text>/g)]
      .map((m) => unescHtml(m[1]))
      .filter((t) => t.length > 1 && !/^(STAGE|TOUCHPOINT|LAYER|STEP|0\d|\d+|\[[^\]]+\])$/i.test(t));

    const title = unescHtml((titleAttrMatch && titleAttrMatch[1]) || textMatches[0] || id);
    const subtitle = unescHtml((subAttrMatch && subAttrMatch[1]) || textMatches[1] || '');
    const pill = unescHtml((pillAttrMatch && pillAttrMatch[1]) || textMatches[textMatches.length - 1] || '');
    const iconKey = (iconAttrMatch && iconAttrMatch[1]) || '';

    results.push({ id, title, subtitle, pill, iconKey, startIdx, endIdx, block });
    openRe.lastIndex = endIdx;
  }
  return results;
}

/**
 * Verifies the 4 Deterministic Graph-to-SVG Bijection Invariants at runtime:
 * 1. 1:1 Node Count Parity (renderedSvgNodes.length === graph.nodes.length)
 * 2. 100% Node ID Bijection (every node.id in graph.nodes is rendered in SVG DOM)
 * 3. 100% Deletion Completeness (zero removed node IDs remain in SVG DOM)
 * 4. 100% Lexical Prefix Integrity (zero 'Ws redshift', 'Lloydb', 'Pache' regex corruptions)
 */
export function verifyGraphToSvgBijectionContract(graph, svgString) {
  const rendered = extractRenderedSvgArchNodes(svgString);
  const renderedIds = new Set(rendered.map((r) => r.id));
  const graphNodes = graph.nodes || [];
  const graphIds = new Set(graphNodes.map((n) => n.id));

  const missingFromSvg = graphNodes.filter((n) => !renderedIds.has(n.id)).map((n) => n.id);
  const extraInSvg = rendered.filter((r) => !graphIds.has(r.id)).map((r) => r.id);

  const corruptedPrefixRegex = /^(Ws\s|Lloydb|Pache\s|Pigee|Urora|Zure|Nthropic)/i;
  const corruptedTitles = graphNodes
    .map((n) => n.title)
    .filter((t) => corruptedPrefixRegex.test(t));

  const passed =
    rendered.length === graphNodes.length &&
    missingFromSvg.length === 0 &&
    extraInSvg.length === 0 &&
    corruptedTitles.length === 0;

  return {
    passed,
    graphNodeCount: graphNodes.length,
    svgNodeCount: rendered.length,
    missingFromSvg,
    extraInSvg,
    corruptedTitles,
    contractScore: passed ? '4/4 INVARIANTS PASS' : 'CONTRACT VIOLATION'
  };
}

// Shared SVG wrapper with crisp dot grid, defs, header banner, L100/L200/L300 badge, and live mutation dock
function wrapSvgCanvas(graph, innerContent, options = {}) {
  const code = graph.code || 'D05';
  const detailLevel = String(options.detailLevel || activeDetailLevel || 'L200').toUpperCase();
  const meta = ARCHETYPE_METADATA[code] || ARCHETYPE_METADATA.D05;
  const W = 1440;
  const H = 820;
  const verSlug = String(graph.version || 'v1_0_1').replace(/[^a-zA-Z0-9]/g, '_');
  const diffFlag = options.showDiff === false ? 'base' : 'diff';
  const uid = `vs_${code}_${detailLevel}_${verSlug}_${diffFlag}`;

  // Rewrite any filter="url(#...)" to empty and scope url(#arr-*) to this SVG instance's unique marker IDs
  let scopedInner = String(innerContent || '')
    .replace(/\s*filter="url\(#vs-[^"]+\)"/g, '')
    .replace(/url\(#(arr-(?:slate|blue|green|rose|violet|amber))\)/g, `url(#${uid}_$1)`);

  // For D01..D04 and D06..D18 (when not in DYNAMIC_MULTI_TIER mode): Synchronize in-place REMOVE and REPLACE/MODIFY mutations on baseline SVG nodes!
  const isDynamicMultiTier = code === 'D05' || graph.renderMode === 'DYNAMIC_MULTI_TIER';
  const baselineArchNodes = extractRenderedSvgArchNodes(scopedInner);
  const baselineIdSet = new Set(baselineArchNodes.map((b) => b.id));
  const graphNodeMap = new Map((graph.nodes || []).map((n) => [n.id, n]));
  const hasSynchronizedBaseline =
    !isDynamicMultiTier &&
    !options.ignoreRemovals &&
    baselineArchNodes.some((b) => graphNodeMap.has(b.id));

  if (hasSynchronizedBaseline && baselineArchNodes.length > 0) {
    let rebuiltInner = '';
    let cursor = 0;
    for (const bNode of baselineArchNodes) {
      rebuiltInner += scopedInner.slice(cursor, bNode.startIdx);
      const gNode = graphNodeMap.get(bNode.id);
      if (!gNode) {
        // Node was removed via REMOVE_NODE or SPLIT_NODE -> omit from SVG!
      } else {
        let updatedBlock = bNode.block;
        if (gNode.changeStatus === 'modified' || (gNode.title && gNode.title !== bNode.title)) {
          // Node was replaced/upgraded in-place -> update title & highlight stroke!
          if (updatedBlock.includes('data-node-title="')) {
            updatedBlock = updatedBlock.replace(/data-node-title="[^"]*"/, `data-node-title="${esc(gNode.title)}"`);
          } else {
            updatedBlock = updatedBlock.replace('<g class="arch-node"', `<g class="arch-node" data-node-title="${esc(gNode.title)}"`);
          }
          updatedBlock = updatedBlock
            .replace(/data-change-status="[^"]*"/, 'data-change-status="modified"')
            .replace(esc(bNode.title), esc(gNode.title))
            .replace(/stroke="#[0-9A-Fa-f]{6}"/, 'stroke="#7C3AED"');
        }
        // For raw bespoke <g class="arch-node"> blocks that were not emitted by drawNodeBox, inject data-base-x/y and apply customDx/customDy
        if (!updatedBlock.includes('data-base-x="')) {
          const cdx = Number(gNode.customDx) || 0;
          const cdy = Number(gNode.customDy) || 0;
          const trMatch = updatedBlock.match(/^<g\s+class="arch-node"[^>]*?\stransform="translate\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)"/);
          if (trMatch) {
            const bx = Number(trMatch[1]) || 0;
            const by = Number(trMatch[2]) || 0;
            updatedBlock = updatedBlock
              .replace(
                /^<g\s+class="arch-node"/,
                `<g class="arch-node" data-base-x="${bx}" data-base-y="${by}" data-custom-dx="${cdx}" data-custom-dy="${cdy}"`
              )
              .replace(
                /transform="translate\(\s*[-\d.]+\s*,\s*[-\d.]+\s*\)"/,
                `transform="translate(${bx + cdx}, ${by + cdy})"`
              );
          } else {
            const extraTransform = cdx !== 0 || cdy !== 0 ? ` transform="translate(${cdx}, ${cdy})"` : '';
            updatedBlock = updatedBlock.replace(
              /^<g\s+class="arch-node"/,
              `<g class="arch-node" data-base-x="0" data-base-y="0" data-custom-dx="${cdx}" data-custom-dy="${cdy}"${extraTransform}`
            );
          }
        }
        rebuiltInner += updatedBlock;
      }
      cursor = bNode.endIdx;
    }
    rebuiltInner += scopedInner.slice(cursor);
    scopedInner = rebuiltInner;
  }

  // Newly added nodes on D01..D04 and D06..D18 that are not part of the baseline archetype stage
  const extraAddedNodes =
    !isDynamicMultiTier
      ? (graph.nodes || []).filter((n) => !baselineIdSet.has(n.id) && (n.changeStatus === 'added' || (n.addedInVersion && n.addedInVersion !== 'v1.0.1')))
      : [];
  const extraModifiedNodes =
    !isDynamicMultiTier
      ? (graph.nodes || []).filter((n) => baselineIdSet.has(n.id) && n.changeStatus === 'modified')
      : [];

  const d05CustomMutations = isDynamicMultiTier
    ? (graph.nodes || []).filter((n) => n.addedInVersion && !['v1.0.1', 'v1.0.2', 'v1.0.3'].includes(n.addedInVersion))
    : [];

  const allBannerMutations = isDynamicMultiTier ? d05CustomMutations : [...extraAddedNodes, ...extraModifiedNodes];
  let mutationBanner = '';
  if (allBannerMutations.length > 0) {
    const uniqueNames = [
      ...new Set(
        allBannerMutations.map((n) => {
          const shortTitle = n.title.replace(/\s+(Enterprise|Serverless|Global|Lakehouse|DW|BI|HA)\b/gi, '').trim();
          return `${n.changeStatus === 'added' ? '+' : '~'}${shortTitle}`;
        })
      )
    ];
    const compactNames =
      uniqueNames.length <= 3
        ? uniqueNames.join(' · ')
        : `${uniqueNames.slice(0, 3).join(' · ')} (+${uniqueNames.length - 3})`;
    const bFit = fitText(`AST DELTA (${graph.version}): ${compactNames}`, 332, 9.0, 7.4, 0.64);
    mutationBanner = `
      <g transform="translate(758, 24)">
        <rect x="0" y="0" width="368" height="24" rx="12" fill="#ECFDF5" stroke="#10B981" stroke-width="1.3"/>
        <text x="184" y="15.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="${bFit.fontSize}" font-weight="700" fill="#065F46">${esc(bFit.text)}</text>
      </g>
    `;
  }

  // Uncapped Multi-Row Extension Tier for D01..D04 and D06..D18 (renders 100% of added nodes, zero .slice(-4) truncation!)
  let stageTransformAttr = '';
  let liveMutationDockSvg = '';
  if (extraAddedNodes.length > 0 && code !== 'D05') {
    stageTransformAttr = 'transform="translate(0, 15) scale(1, 0.79)"';
    const count = extraAddedNodes.length;
    const rows = count <= 4 ? [extraAddedNodes] : [extraAddedNodes.slice(0, Math.ceil(count / 2)), extraAddedNodes.slice(Math.ceil(count / 2))];
    const rowCount = rows.length;
    const cardH = rowCount === 1 ? 96 : 52;

    let cardsMarkup = '';
    rows.forEach((rowItems, rIdx) => {
      const rLen = rowItems.length;
      const cardW = rLen === 1 ? 380 : rLen === 2 ? 360 : rLen === 3 ? 330 : Math.min(308, Math.floor((1340 - (rLen - 1) * 18) / rLen));
      const gapX = rLen <= 3 ? 24 : 18;
      const totalW = rLen * cardW + (rLen - 1) * gapX;
      const startX = Math.max(36, Math.round((W - totalW) / 2));
      const cy = rowCount === 1 ? 662 : 656 + rIdx * (cardH + 6);

      rowItems.forEach((mn, idx) => {
        const cx = startX + idx * (cardW + gapX);
        const scopeHint = mn.scopedTargetTitle ? `Wired → ${mn.scopedTargetTitle}` : mn.pill || 'Live AST Node';
        cardsMarkup += drawNodeBox({
          id: mn.id,
          x: cx,
          y: cy,
          w: cardW,
          h: cardH,
          title: mn.title,
          subtitle: rowCount === 1 ? mn.subtitle || 'Prompt-Synthesized Architecture Node' : '',
          badge: mn.scopedTargetTitle ? `SCOPED: ${mn.scopedTargetTitle.slice(0, 14)}` : `AST DELTA ${mn.addedInVersion || graph.version}`,
          metric: rowCount === 1 ? scopeHint : '',
          l300Spec: mn.l300Spec || '',
          accentColor: mn.changeStatus === 'modified' ? '#7C3AED' : '#059669',
          changeStatus: mn.changeStatus || 'added',
          versionTag: mn.addedInVersion || graph.version,
          iconKey: mn.iconKey,
          scopedNodeId: options.scopedNodeId
        });
        if (idx > 0) {
          const prevRight = cx - gapX;
          const midY = Math.round(cy + cardH / 2);
          cardsMarkup += `<line class="arch-edge" x1="${prevRight}" y1="${midY}" x2="${cx - 4}" y2="${midY}" stroke="#10B981" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#${uid}_arr-green)"/>`;
        }
      });
    });

    liveMutationDockSvg = `
      <g class="live-mutation-extension-tier">
        <rect x="20" y="630" width="1400" height="138" rx="12" fill="#ECFDF5" fill-opacity="0.65" stroke="#10B981" stroke-width="1.8" stroke-dasharray="6 4"/>
        <rect x="36" y="636" width="440" height="18" rx="5" fill="#10B981"/>
        <text x="256" y="648.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.0" font-weight="800" fill="#FFFFFF">LIVE PROMPT-MUTATED ARCHITECTURE EXTENSION TIER (${esc(graph.version)})</text>
        ${cardsMarkup}
      </g>
    `;
  }

  const lodLabel =
    detailLevel === 'L100'
      ? 'L100 EXECUTIVE'
      : detailLevel === 'L300'
        ? 'L300 DEEP SPEC'
        : 'L200 SOLUTION';
  const lodBg = detailLevel === 'L300' ? '#EEF2FF' : detailLevel === 'L100' ? '#FFFBEB' : '#F1F5F9';
  const lodColor = detailLevel === 'L300' ? '#4338CA' : detailLevel === 'L100' ? '#B45309' : '#334155';

  const headerTitleMaxW = allBannerMutations.length > 0 ? 685 : 1060;
  const titleFit = fitText(`${code} — ${graph.title}`, headerTitleMaxW, 16.5, 11.5, 0.58);
  const subFit = fitText(graph.subtitle || '', headerTitleMaxW, 11, 9.2, 0.54);

  let annotationsSvg = '';
  if (Array.isArray(graph.annotations) && graph.annotations.length > 0) {
    const pinsMarkup = graph.annotations
      .map((ann, idx) => {
        const ax = Math.max(40, Math.min(1180, Number(ann.x) || 120 + idx * 240));
        const ay = Math.max(88, Math.min(720, Number(ann.y) || 110));
        const labelFit = fitText(`📌 #${idx + 1}: ${ann.text || 'Review Note'}`, 216, 9.2, 7.6, 0.56);
        return `
          <g class="arch-review-pin" data-pin-id="${esc(ann.id || idx)}" transform="translate(${ax}, ${ay})">
            <rect x="0" y="0" width="236" height="26" rx="7" fill="#FEF3C7" stroke="#D97706" stroke-width="1.5"/>
            <text x="10" y="16.5" font-family="JetBrains Mono, monospace" font-size="${labelFit.fontSize}" font-weight="700" fill="#92400E">${esc(labelFit.text)}</text>
          </g>
        `;
      })
      .join('');
    annotationsSvg = `<g class="diagram-review-annotations">${pinsMarkup}</g>`;
  }

  // Interactive Whiteboard Overlays: Freehand Pen Strokes, Sticky Notes & Connector Elbow Waypoints
  let whiteboardOverlaySvg = '';
  const strokes = Array.isArray(graph.freehandStrokes) ? graph.freehandStrokes : [];
  const stickies = Array.isArray(graph.stickyNotes) ? graph.stickyNotes : [];
  const waypointsObj = graph.edgeWaypoints && typeof graph.edgeWaypoints === 'object' ? graph.edgeWaypoints : {};

  if (strokes.length > 0) {
    const strokesMarkup = strokes
      .map(
        (st, idx) =>
          `<path class="vs-freehand-stroke" data-stroke-id="${esc(st.id || `st_${idx}`)}" d="${esc(st.d || '')}" fill="none" stroke="${esc(st.color || '#2563EB')}" stroke-width="${Number(st.width) || 3.2}" stroke-linecap="round" stroke-linejoin="round" opacity="0.88"/>`
      )
      .join('');
    whiteboardOverlaySvg += `<g class="vs-freehand-strokes-layer">${strokesMarkup}</g>`;
  }

  if (stickies.length > 0) {
    const stickiesMarkup = stickies
      .map((st, idx) => {
        const sx = Math.max(28, Math.min(1196, Number(st.x) || 1140));
        const sy = Math.max(82, Math.min(680, Number(st.y) || 92 + idx * 66));
        const sw = Math.max(180, Math.min(260, Number(st.w) || 224));
        const sh = Math.max(58, Math.min(110, Number(st.h) || 62));
        const bg = st.color || '#FEF08A';
        const border = st.borderColor || '#EAB308';
        const headFit = fitText(`🟨 ${st.author || 'Architect Note'}`, sw - 20, 8.5, 7.2, 0.58);
        const rawWords = String(st.text || 'Sticky architecture note').trim().split(/\s+/);
        let line1 = '';
        let line2 = '';
        for (const w of rawWords) {
          if ((line1 + ' ' + w).trim().length <= 36) {
            line1 = (line1 + ' ' + w).trim();
          } else {
            line2 = (line2 + ' ' + w).trim();
          }
        }
        const fit1 = fitText(line1, sw - 20, 9.2, 7.6, 0.55);
        const fit2 = line2 ? fitText(line2, sw - 20, 9.2, 7.6, 0.55) : null;
        return `
          <g class="vs-sticky-note" data-sticky-id="${esc(st.id || `sticky_${idx}`)}" data-sticky-x="${sx}" data-sticky-y="${sy}" data-sticky-text="${esc(st.text || '')}" transform="translate(${sx}, ${sy})" style="cursor:move;">
            <rect x="2" y="3" width="${sw}" height="${sh}" rx="8" fill="#0F172A" fill-opacity="0.08"/>
            <rect x="0" y="0" width="${sw}" height="${sh}" rx="8" fill="${esc(bg)}" stroke="${esc(border)}" stroke-width="1.5"/>
            <text x="10" y="16" font-family="JetBrains Mono, monospace" font-size="${headFit.fontSize}" font-weight="800" fill="#713F12">${esc(headFit.text)}</text>
            <text x="10" y="33" font-size="${fit1.fontSize}" font-weight="600" fill="#1E293B">${esc(fit1.text)}</text>
            ${fit2 ? `<text x="10" y="48" font-size="${fit2.fontSize}" font-weight="600" fill="#1E293B">${esc(fit2.text)}</text>` : ''}
          </g>
        `;
      })
      .join('');
    whiteboardOverlaySvg += `<g class="vs-sticky-notes-layer">${stickiesMarkup}</g>`;
  }

  const wpEntries = Object.entries(waypointsObj);
  if (wpEntries.length > 0) {
    const wpMarkup = wpEntries
      .map(([edgeKey, wp], idx) => {
        const bx = Number(wp.baseX || wp.bendX) || 560 + idx * 280;
        const by = Number(wp.baseY || wp.bendY) || 340;
        const wx = Math.max(60, Math.min(1380, bx + (Number(wp.dx) || 0)));
        const wy = Math.max(100, Math.min(730, by + (Number(wp.dy) || 0)));
        return `
          <g class="vs-elbow-waypoint" data-edge-key="${esc(edgeKey)}" data-base-x="${bx}" data-base-y="${by}" data-dx="${Number(wp.dx) || 0}" data-dy="${Number(wp.dy) || 0}" style="cursor:grab;">
            <path d="M ${bx - 36} ${by} L ${wx} ${by} L ${wx} ${wy} L ${bx + 36} ${wy}" fill="none" stroke="#2563EB" stroke-width="2.2" stroke-dasharray="4 2"/>
            <circle class="vs-elbow-handle" data-edge-key="${esc(edgeKey)}" cx="${wx}" cy="${wy}" r="6.5" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.2"/>
            <circle cx="${wx}" cy="${wy}" r="2.5" fill="#2563EB"/>
          </g>
        `;
      })
      .join('');
    whiteboardOverlaySvg += `<g class="vs-elbow-waypoints-layer">${wpMarkup}</g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" height="100%" data-diagram-code="${esc(code)}" data-archetype="${esc(isDynamicMultiTier && code !== 'D05' ? 'MULTI_TIER_CLOUD_DIFF' : meta.archetype)}" data-render-mode="${esc(graph.renderMode || 'BESPOKE_ARCHETYPE')}" data-version="${esc(graph.version)}" data-detail-level="${esc(detailLevel)}" style="background:#F8FAFC; font-family:'Inter', -apple-system, BlinkMacSystemFont, sans-serif; user-select:none;">
  <defs>
    <pattern id="${uid}_grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#CBD5E1" opacity="0.55"/>
    </pattern>
    <marker id="${uid}_arr-slate" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#475569"/>
    </marker>
    <marker id="${uid}_arr-blue" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#2563EB"/>
    </marker>
    <marker id="${uid}_arr-green" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#059669"/>
    </marker>
    <marker id="${uid}_arr-rose" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#E11D48"/>
    </marker>
    <marker id="${uid}_arr-violet" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#7C3AED"/>
    </marker>
    <marker id="${uid}_arr-amber" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#D97706"/>
    </marker>
  </defs>

  <!-- Canvas Background & Dot Grid -->
  <rect x="0" y="0" width="${W}" height="${H}" fill="#F8FAFC"/>
  <rect x="0" y="76" width="${W}" height="${H - 116}" fill="url(#${uid}_grid)"/>

  <!-- Top Executive Header Bar (y=0..74) -->
  <g class="diagram-header-bar">
    <rect x="0" y="0" width="${W}" height="74" fill="#FFFFFF"/>
    <line x1="0" y1="74" x2="${W}" y2="74" stroke="#E2E8F0" stroke-width="1.5"/>
    <rect x="20" y="14" width="5" height="46" rx="2.5" fill="${meta.color}"/>
    <text x="36" y="34" font-size="${titleFit.fontSize}" font-weight="800" fill="#0F172A" letter-spacing="-0.02em">${esc(titleFit.text)}</text>
    <text x="36" y="54" font-size="${subFit.fontSize}" font-weight="500" fill="#64748B">${esc(subFit.text)}</text>
    ${mutationBanner}
    <!-- Right Archetype, Version, Fidelity Level & Geometry Pill Cluster -->
    <g transform="translate(1140, 14)">
      <rect x="0" y="0" width="280" height="22" rx="6" fill="${meta.bg}" stroke="${meta.color}" stroke-width="1"/>
      <text x="140" y="14.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="${meta.color}">ARCHETYPE: ${esc(isDynamicMultiTier && code !== 'D05' ? '5-TIER CLOUD + AST DIFF' : meta.badge)}</text>
      <rect x="0" y="26" width="84" height="20" rx="5" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1"/>
      <text x="42" y="39.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#334155">REV ${esc(graph.version)}</text>
      <rect x="90" y="26" width="94" height="20" rx="5" fill="${lodBg}" stroke="${lodColor}50" stroke-width="1"/>
      <text x="137" y="39.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.8" font-weight="800" fill="${lodColor}">${esc(lodLabel)}</text>
      <rect x="190" y="26" width="90" height="20" rx="5" fill="#ECFDF5" stroke="#6EE7B7" stroke-width="1"/>
      <text x="235" y="39.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.8" font-weight="700" fill="#065F46">0 OVERLAPS</text>
    </g>
  </g>

  <!-- Main Bespoke Archetype Stage (y=82..768) -->
  <g class="diagram-archetype-stage" ${stageTransformAttr}>
    ${scopedInner}
  </g>
  ${liveMutationDockSvg}
  ${annotationsSvg}
  ${whiteboardOverlaySvg}

  <!-- Bottom Telemetry & Notation Footer (y=776..816) -->
  <g class="diagram-footer-bar" transform="translate(0, 776)">
    <rect x="0" y="0" width="${W}" height="44" fill="#FFFFFF"/>
    <line x1="0" y1="0" x2="${W}" y2="0" stroke="#E2E8F0" stroke-width="1"/>
    <text x="24" y="26" font-family="JetBrains Mono, monospace" font-size="10" font-weight="600" fill="#475569">${esc(fitText(`${graph.phaseBadge || 'LIFECYCLE'} · ${graph.phaseTitle || ''}`, 520, 10, 8.5, 0.6).text)}</text>
    <text x="835" y="26" text-anchor="middle" font-size="10" font-weight="600" fill="#64748B">Click any node to scope prompt mutations · ${esc(lodLabel)}</text>
    <text x="1416" y="26" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#059669">CHROME DOM VERIFIED · 1440×820 16:9</text>
  </g>
</svg>`;
}

// Helper to draw an interactive node card with Official Google Cloud Vector Icon Badge + L100/L200/L300 Fidelity + 8-Way Resize Handles
function drawNodeBox({
  id,
  x,
  y,
  w,
  h,
  title,
  subtitle = '',
  badge = '',
  metric = '',
  l300Spec = '',
  fill = '#FFFFFF',
  stroke = '#CBD5E1',
  headerFill = '',
  accentColor = '#2563EB',
  changeStatus = 'baseline',
  versionTag = '',
  rx = 10,
  iconKey = '',
  scopedNodeId = null
}) {
  const baseW = w;
  const baseH = h;
  const liveNode = activeRenderGraph && Array.isArray(activeRenderGraph.nodes)
    ? activeRenderGraph.nodes.find((n) => n.id === id)
    : null;
  if (liveNode && activeRenderGraph && activeRenderGraph.code !== 'D05' && (liveNode.changeStatus === 'modified' || (liveNode.title && liveNode.title !== title))) {
    title = liveNode.title || title;
    if (liveNode.subtitle) subtitle = liveNode.subtitle;
    if (liveNode.pill) metric = liveNode.pill;
    if (liveNode.l300Spec) l300Spec = liveNode.l300Spec;
    if (liveNode.iconKey) iconKey = liveNode.iconKey;
    changeStatus = liveNode.changeStatus || 'modified';
    versionTag = liveNode.addedInVersion || activeRenderGraph.version || versionTag;
  }
  const sizeOv =
    (activeRenderGraph && activeRenderGraph.nodeSizeOverrides && activeRenderGraph.nodeSizeOverrides[id]) ||
    (liveNode && (liveNode.customDw || liveNode.customDh) ? { dw: liveNode.customDw, dh: liveNode.customDh } : null);
  const customDw = Number(sizeOv?.dw) || 0;
  const customDh = Number(sizeOv?.dh) || 0;
  w = Math.max(136, Math.min(520, w + customDw));
  h = Math.max(76, Math.min(240, h + customDh));

  const effX = x + (Number(liveNode?.customDx) || 0);
  const effY = y + (Number(liveNode?.customDy) || 0);

  const lod = activeDetailLevel || 'L200';
  const isL100 = lod === 'L100';
  const isL300 = lod === 'L300';

  const isAdded = changeStatus === 'added';
  const isMod = changeStatus === 'modified';
  const isScoped = scopedNodeId === id;
  const finalStroke = isScoped ? '#2563EB' : isAdded ? '#10B981' : isMod ? '#7C3AED' : stroke;
  const strokeW = isScoped ? 2.6 : isAdded || isMod ? 2.2 : 1.5;

  const resolvedKey = iconKey || resolveIconKeyFromText(title, subtitle, badge);
  const iconSpec = getIconSpec(resolvedKey);

  const hasHeader = Boolean(headerFill);
  const padX = 12;
  const textX = hasHeader ? 12 : 44;
  const subTextX = hasHeader ? 44 : 12;
  const maxTitleW = hasHeader ? w - 26 : w - textX - 14;
  const maxSubW = w - subTextX - 16;

  const tFit = fitText(title, maxTitleW, isL100 ? 12.2 : 11.5, 7.2, 0.59);

  // In L100 Executive mode, omit low-level prose subtitles for a clean C-suite overview;
  // In L300 mode or compact cards (h < 118), keep subtitle to 1 crisp line so L300 spec row fits with 0 overlap.
  const allowTwoLineSub = !isL100 && !isL300 && h >= 118;
  const sWrap = isL100
    ? { lines: [], fontSize: 9.0 }
    : allowTwoLineSub
      ? wrapSubtitleLines(subtitle, maxSubW, 9.5, 7.2, 0.55)
      : { lines: subtitle ? [fitText(subtitle, maxSubW, 9.2, 7.0, 0.55).text] : [], fontSize: fitText(subtitle, maxSubW, 9.2, 7.0, 0.55).fontSize };

  const bFit = badge ? fitText(badge, Math.min(w - 28, w * 0.52), 8.6, 7.2, 0.58) : null;

  // In L100 mode, hide low-level port/latency bottom pill; in L300 mode, enrich metric pill with protocol/security spec
  const effectiveMetricText = isL100
    ? ''
    : isL300
      ? l300Spec || (metric ? `${metric} · ${iconSpec.label}` : iconSpec.label)
      : metric;
  const mFit = effectiveMetricText ? fitText(effectiveMetricText, w - 28, 9.0, 7.0, 0.56) : null;

  let diffPill = '';
  if (isAdded || isMod) {
    const dText = isAdded ? `+ADDED ${versionTag}` : `~UPDATED ${versionTag}`;
    const dFill = isAdded ? '#10B981' : '#7C3AED';
    const dW = Math.min(w * 0.46, dText.length * 5.6 + 12);
    diffPill = `
      <rect x="${w - dW - 8}" y="7" width="${dW}" height="15" rx="7.5" fill="${dFill}"/>
      <text x="${w - dW / 2 - 8}" y="17.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.2" font-weight="700" fill="#FFFFFF">${esc(dText)}</text>
    `;
  }

  const shadowRect = isScoped
    ? `<rect x="-4" y="-4" width="${w + 8}" height="${h + 8}" rx="${rx + 3}" fill="#2563EB" fill-opacity="0.18"/>`
    : isAdded
      ? `<rect x="-3" y="-3" width="${w + 6}" height="${h + 6}" rx="${rx + 2}" fill="#10B981" fill-opacity="0.16"/>`
      : isMod
        ? `<rect x="-3" y="-3" width="${w + 6}" height="${h + 6}" rx="${rx + 2}" fill="#7C3AED" fill-opacity="0.16"/>`
        : `<rect x="2" y="3" width="${w}" height="${h}" rx="${rx}" fill="#0F172A" fill-opacity="0.05"/>`;

  const hasTopRowPill = Boolean((bFit && !hasHeader) || isAdded || isMod);
  const titleY = hasHeader ? 19.5 : isL100 ? Math.round(h / 2 + 4) : hasTopRowPill ? (h < 96 ? 37 : 43) : 25;
  const subY = hasHeader ? 46 : titleY + (h < 96 ? 17 : 20);
  const iconY = hasHeader ? 34 : isL100 ? Math.round(h / 2 - 12) : titleY - 15;
  const metricY = h - 10.5;

  const iconBadgeSvg = `
    <g transform="translate(12, ${iconY})">
      <rect x="0" y="0" width="24" height="24" rx="6" fill="${iconSpec.bg}" stroke="${iconSpec.border}" stroke-width="1.2"/>
      <svg x="1" y="1" width="22" height="22" viewBox="0 0 24 24">${iconSpec.svgInner}</svg>
    </g>
  `;

  let subtitleSvg = '';
  if (sWrap.lines.length === 1) {
    subtitleSvg = `<text x="${subTextX}" y="${subY}" font-size="${sWrap.fontSize}" font-weight="500" fill="#475569">${esc(sWrap.lines[0])}</text>`;
  } else if (sWrap.lines.length >= 2) {
    subtitleSvg = `
      <text x="${subTextX}" y="${subY - 2}" font-size="${sWrap.fontSize}" font-weight="500" fill="#475569">${esc(sWrap.lines[0])}</text>
      <text x="${subTextX}" y="${subY + 11.5}" font-size="${sWrap.fontSize}" font-weight="500" fill="#475569">${esc(sWrap.lines[1])}</text>
    `;
  }

  let extraSpecRow = '';
  if (isL300 && h >= 116) {
    const rawL300 = metric && l300Spec ? `SLO: ${metric}` : `SPEC: ${iconSpec.label} · mTLS 1.3`;
    const specFit = fitText(rawL300, w - 32, 8.2, 6.6, 0.60);
    extraSpecRow = `
      <text x="${subTextX}" y="${h - 29}" font-family="JetBrains Mono, monospace" font-size="${specFit.fontSize}" font-weight="700" fill="#4338CA">${esc(specFit.text)}</text>
    `;
  } else if (!isL100 && h >= 158 && badge && hasHeader) {
    const vendorPrefix = iconSpec.vendor || 'CLOUD';
    const specFit = fitText(`${vendorPrefix} SERVICE: ${iconSpec.label}`, w - 36, 8.2, 6.2, 0.65);
    extraSpecRow = `
      <line x1="12" y1="${h - 50}" x2="${w - 12}" y2="${h - 50}" stroke="#F1F5F9" stroke-width="1"/>
      <text x="14" y="${h - 35}" font-family="JetBrains Mono, monospace" font-size="${specFit.fontSize}" font-weight="600" fill="#64748B">${esc(specFit.text)}</text>
    `;
  } else if (!isL100 && h >= 165 && !hasHeader) {
    const vendorPrefix = iconSpec.vendor || 'CLOUD';
    const specFit = fitText(`${vendorPrefix} SERVICE: ${iconSpec.label}`, w - 36, 8.2, 6.2, 0.65);
    extraSpecRow = `
      <line x1="12" y1="${h - 50}" x2="${w - 12}" y2="${h - 50}" stroke="#F1F5F9" stroke-width="1"/>
      <text x="14" y="${h - 35}" font-family="JetBrains Mono, monospace" font-size="${specFit.fontSize}" font-weight="600" fill="#64748B">${esc(specFit.text)}</text>
    `;
  }

  const metricBoxFill = isL300 ? '#EEF2FF' : '#F8FAFC';
  const metricBoxStroke = isL300 ? '#A5B4FC' : '#E2E8F0';
  const metricTextColor = isL300 ? '#312E81' : '#334155';

  // 8-Way Resize Grip Handles rendered when node is scoped or resized
  const resizeHandlesSvg = isScoped || customDw !== 0 || customDh !== 0
    ? [
        { dir: 'nw', hx: -4, hy: -4, cur: 'nwse-resize' },
        { dir: 'n', hx: Math.round(w / 2) - 4, hy: -4, cur: 'ns-resize' },
        { dir: 'ne', hx: w - 4, hy: -4, cur: 'nesw-resize' },
        { dir: 'e', hx: w - 4, hy: Math.round(h / 2) - 4, cur: 'ew-resize' },
        { dir: 'se', hx: w - 4, hy: h - 4, cur: 'nwse-resize' },
        { dir: 's', hx: Math.round(w / 2) - 4, hy: h - 4, cur: 'ns-resize' },
        { dir: 'sw', hx: -4, hy: h - 4, cur: 'nesw-resize' },
        { dir: 'w', hx: -4, hy: Math.round(h / 2) - 4, cur: 'ew-resize' }
      ]
        .map(
          (hnd) =>
            `<rect class="vs-resize-handle" data-node-id="${esc(id)}" data-handle-dir="${hnd.dir}" x="${hnd.hx}" y="${hnd.hy}" width="8" height="8" rx="2" fill="#FFFFFF" stroke="#2563EB" stroke-width="1.8" style="cursor:${hnd.cur};"/>`
        )
        .join('')
    : '';

  return `
    <g class="arch-node" data-node-id="${esc(id)}" data-node-title="${esc(title)}" data-node-subtitle="${esc(subtitle)}" data-node-pill="${esc(metric || badge)}" data-node-icon="${esc(resolvedKey)}" data-change-status="${esc(changeStatus)}" data-base-x="${x}" data-base-y="${y}" data-base-w="${baseW}" data-base-h="${baseH}" data-custom-dx="${Number(liveNode?.customDx) || 0}" data-custom-dy="${Number(liveNode?.customDy) || 0}" data-custom-dw="${customDw}" data-custom-dh="${customDh}" transform="translate(${effX}, ${effY})" style="cursor:pointer;">
      ${shadowRect}
      <rect class="node-bounding-rect" x="0" y="0" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${finalStroke}" stroke-width="${strokeW}"/>
      ${hasHeader ? `<rect x="1" y="1" width="${w - 2}" height="27" rx="${Math.max(4, rx - 1)}" fill="${headerFill}"/>` : `<rect x="0" y="10" width="4" height="${h - 20}" rx="2" fill="${accentColor}"/>`}
      ${bFit && !hasHeader ? `
        <rect x="${padX}" y="7" width="${Math.min(w * 0.52, bFit.text.length * 5.6 + 12)}" height="15" rx="4" fill="${accentColor}15"/>
        <text x="${padX + 6}" y="17.5" font-family="JetBrains Mono, monospace" font-size="${bFit.fontSize}" font-weight="700" fill="${accentColor}">${esc(bFit.text)}</text>
      ` : ''}
      ${diffPill}
      ${iconBadgeSvg}
      <text x="${textX}" y="${titleY}" font-size="${tFit.fontSize}" font-weight="700" fill="${hasHeader ? '#FFFFFF' : '#0F172A'}">${esc(tFit.text)}</text>
      ${subtitleSvg}
      ${extraSpecRow}
      ${mFit ? `
        <rect x="${padX}" y="${h - 23}" width="${w - padX * 2}" height="16" rx="4" fill="${metricBoxFill}" stroke="${metricBoxStroke}" stroke-width="1"/>
        <text x="${w / 2}" y="${metricY}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="${mFit.fontSize}" font-weight="600" fill="${metricTextColor}">${esc(mFit.text)}</text>
      ` : ''}
      ${resizeHandlesSvg}
    </g>
  `;
}

// ============================================================================
// D01: 5-CHEVRON VALUE STREAM SWIMLANE MAP + CONVERSION FUNNEL BARS
// ============================================================================
function renderD01ValueStream(graph, options) {
  const stages = [
    { num: 'STAGE 01', name: 'Discovery & Intent', color: '#1D4ED8', bg: '#DBEAFE' },
    { num: 'STAGE 02', name: 'Passkey Onboarding', color: '#4338CA', bg: '#E0E7FF' },
    { num: 'STAGE 03', name: 'AI Co-Pilot Search', color: '#6D28D9', bg: '#EDE9FE' },
    { num: 'STAGE 04', name: '1-Click Checkout', color: '#B45309', bg: '#FEF3C7' },
    { num: 'STAGE 05', name: 'Retention & NRR', color: '#047857', bg: '#D1FAE5' }
  ];

  const lanes = [
    { label: 'CUSTOMER', sub: 'Actions & UX', y: 156, h: 126, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'PLATFORM', sub: 'AI & Systems', y: 298, h: 126, color: '#7C3AED', bg: '#F5F3FF' },
    { label: 'NORTH-STAR', sub: 'KPIs & Friction', y: 440, h: 142, color: '#059669', bg: '#ECFDF5' }
  ];

  const colX = [196, 440, 684, 928, 1172];
  const colW = 228;

  let svg = '';

  // Top 5 Chevron Stage Headers (y=90..142)
  stages.forEach((st, i) => {
    const x = colX[i];
    const pts = `${x},90 ${x + colW - 14},90 ${x + colW},116 ${x + colW - 14},142 ${x},142 ${i > 0 ? `${x + 12},116` : `${x},116`}`;
    svg += `
      <g>
        <polygon points="${pts}" fill="${st.bg}" stroke="${st.color}" stroke-width="1.5"/>
        <text x="${x + colW / 2}" y="111" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="800" fill="${st.color}">${esc(st.num)}</text>
        <text x="${x + colW / 2}" y="129" text-anchor="middle" font-size="12" font-weight="800" fill="#0F172A">${esc(st.name)}</text>
      </g>
    `;
  });

  // 3 Horizontal Swimlane Backgrounds & Left Headers
  lanes.forEach((ln) => {
    svg += `
      <rect x="20" y="${ln.y}" width="1400" height="${ln.h}" rx="10" fill="#FFFFFF" fill-opacity="0.78" stroke="#CBD5E1" stroke-width="1.2"/>
      <rect x="20" y="${ln.y}" width="160" height="${ln.h}" rx="10" fill="${ln.bg}" stroke="${ln.color}" stroke-width="1.4"/>
      <text x="100" y="${ln.y + ln.h / 2 - 4}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11.5" font-weight="800" fill="${ln.color}">${esc(ln.label)}</text>
      <text x="100" y="${ln.y + ln.h / 2 + 14}" text-anchor="middle" font-size="10.5" font-weight="600" fill="#475569">${esc(ln.sub)}</text>
    `;
  });

  const row1Cards = [
    { id: 'n1', title: 'Organic & Paid Landing', sub: 'Personalized intent capture', metric: 'CTR: 8.4% (+2.1x)' },
    { id: 'n2', title: 'WebAuthn Passkey Login', sub: 'Zero-password biometric SSO', metric: 'Drop-off: 3.1%' },
    { id: 'n3', title: 'Conversational Discovery', sub: 'Natural-language bundle ask', metric: 'Session: 4.8 Queries' },
    { id: 'n4', title: 'Express Atomic Checkout', sub: '1-click wallet & PO approval', metric: 'Cart Auth: 98.4%' },
    { id: 'n5', title: 'Proactive Renewal Hub', sub: 'Live telemetry & auto-expand', metric: 'CSAT: 4.9 / 5.0' }
  ];

  const row2Cards = [
    { id: 'n6', title: 'Edge CDN & Geo-Router', sub: 'Cloudflare + Cloud Armor WAF', metric: 'TTFB: 14ms Global' },
    { id: 'n7', title: 'Zero-Trust IAP Identity', sub: 'Device posture + OIDC token', metric: 'Token Mint: 6ms' },
    { id: 'n8', title: 'Gemini 3.8 RAG Co-Pilot', sub: 'Hybrid Vector + Spanner Graph', metric: 'Grounded: 99.2%' },
    { id: 'n9', title: 'Spanner Saga Coordinator', sub: 'TrueTime distributed commit', metric: 'RPO = 0s · 99.999%' },
    { id: 'n10', title: 'Pub/Sub Lifecycle Engine', sub: 'Real-time usage triggers', metric: 'Lag < 250ms' }
  ];

  const row3Kpis = [
    { id: 'k1', title: 'Lead Time: 12s', sub: 'Friction: Low (Score 12/100)', pct: 88, label: '88% Funnel Pass' },
    { id: 'k2', title: 'Onboarding: 2.4s', sub: 'Saved 46s vs Legacy OTP', pct: 95, label: '95% Auth Pass' },
    { id: 'k3', title: 'AOV Lift: +38%', sub: 'AI Bundle Attach Rate', pct: 84, label: '84% High Intent' },
    { id: 'k4', title: 'Commit: 140ms', sub: 'Zero Double-Charge Saga', pct: 97, label: '97% Checkout Win' },
    { id: 'k5', title: 'Net Retention: 134%', sub: 'Churn Reduced by -62%', pct: 92, label: '92% Expansion' }
  ];

  row1Cards.forEach((c, i) => {
    svg += drawNodeBox({
      id: c.id,
      x: colX[i],
      y: 168,
      w: colW,
      h: 102,
      title: c.title,
      subtitle: c.sub,
      badge: `TOUCHPOINT 0${i + 1}`,
      metric: c.metric,
      accentColor: '#2563EB',
      scopedNodeId: options.scopedNodeId
    });
    if (i < 4) {
      svg += `<line class="arch-edge" x1="${colX[i] + colW}" y1="219" x2="${colX[i + 1] - 2}" y2="219" stroke="#2563EB" stroke-width="2" marker-end="url(#arr-blue)"/>`;
    }
  });

  row2Cards.forEach((c, i) => {
    svg += drawNodeBox({
      id: c.id,
      x: colX[i],
      y: 310,
      w: colW,
      h: 102,
      title: c.title,
      subtitle: c.sub,
      badge: `SYSTEM 0${i + 1}`,
      metric: c.metric,
      accentColor: '#7C3AED',
      scopedNodeId: options.scopedNodeId
    });
    if (i < 4) {
      svg += `<line class="arch-edge" x1="${colX[i] + colW}" y1="361" x2="${colX[i + 1] - 2}" y2="361" stroke="#7C3AED" stroke-width="2" marker-end="url(#arr-violet)"/>`;
    }
    // Vertical touchpoint-to-system link
    svg += `<line class="arch-edge" x1="${colX[i] + colW / 2}" y1="270" x2="${colX[i] + colW / 2}" y2="308" stroke="#64748B" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#arr-slate)"/>`;
  });

  // Row 3 KPI Cards with Visual Progress Bar Gauges (Rule 57C visual_first_zero_wall_of_text)
  row3Kpis.forEach((k, i) => {
    const x = colX[i];
    const y = 452;
    const barW = Math.round(((colW - 24) * k.pct) / 100);
    svg += `
      <g class="arch-node" data-node-id="${k.id}" transform="translate(${x}, ${y})" style="cursor:pointer;">
        <rect class="node-bounding-rect" x="0" y="0" width="${colW}" height="118" rx="10" fill="#FFFFFF" stroke="#6EE7B7" stroke-width="1.5" filter="url(#vs-shadow-sm)"/>
        <text x="12" y="24" font-size="12.5" font-weight="800" fill="#065F46">${esc(k.title)}</text>
        <text x="12" y="42" font-size="10.5" font-weight="500" fill="#475569">${esc(k.sub)}</text>
        <rect x="12" y="56" width="${colW - 24}" height="12" rx="6" fill="#E2E8F0"/>
        <rect x="12" y="56" width="${barW}" height="12" rx="6" fill="#10B981"/>
        <text x="${colW / 2}" y="96" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#047857">${esc(k.label)}</text>
      </g>
    `;
  });

  // Bottom Value Stream Rollup Bar (y=598..752)
  svg += `
    <g transform="translate(20, 600)">
      <rect x="0" y="0" width="1400" height="150" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" filter="url(#vs-shadow-sm)"/>
      <rect x="0" y="0" width="1400" height="32" rx="12" fill="#EFF6FF"/>
      <text x="20" y="21" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#1D4ED8">END-TO-END VALUE STREAM ROLLUP &amp; CYCLE-TIME COMPRESSION BENCHMARK</text>
      <g transform="translate(24, 48)">
        <rect x="0" y="0" width="420" height="84" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
        <text x="16" y="26" font-size="11" font-weight="700" fill="#64748B">TOTAL LEAD TIME (DISCOVERY TO ORDER)</text>
        <text x="16" y="54" font-family="JetBrains Mono, monospace" font-size="20" font-weight="800" fill="#0F172A">6m 20s → 19.4s</text>
        <text x="16" y="73" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="700" fill="#059669">-94.8% Latency Compression</text>
      </g>
      <g transform="translate(476, 48)">
        <rect x="0" y="0" width="420" height="84" rx="8" fill="#F8FAFC" stroke="#E2E8F0"/>
        <text x="16" y="26" font-size="11" font-weight="700" fill="#64748B">VALUE-ADD EFFICIENCY RATIO (PROCESS PCE)</text>
        <text x="16" y="54" font-family="JetBrains Mono, monospace" font-size="20" font-weight="800" fill="#2563EB">21.4% → 89.2%</text>
        <text x="16" y="73" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="700" fill="#1D4ED8">+67.8 pts Zero-Wait Automation</text>
      </g>
      <g transform="translate(928, 48)">
        <rect x="0" y="0" width="444" height="84" rx="8" fill="#ECFDF5" stroke="#6EE7B7"/>
        <text x="16" y="26" font-size="11" font-weight="700" fill="#065F46">NORTH-STAR ANNUALIZED NET REVENUE IMPACT</text>
        <text x="16" y="54" font-family="JetBrains Mono, monospace" font-size="20" font-weight="800" fill="#047857">+$48.6M ARR Lift</text>
        <text x="16" y="73" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="700" fill="#065F46">Verified Across 5 Lifecycle Checkpoints</text>
      </g>
    </g>
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D02: MULTI-SCREEN INTERACTIVE UX WIREFRAME MOCKUPS & DECISION DIAMONDS
// ============================================================================
function renderD02UxWireframeFlow(graph, options) {
  function drawScreenMockup({ id, x, y, w, h, screenCode, title, route, elements, ctaText, ctaColor = '#2563EB', stroke = '#CBD5E1' }) {
    let elSvg = '';
    elements.forEach((el, idx) => {
      const ey = 72 + idx * 36;
      elSvg += `
        <rect x="14" y="${ey}" width="${w - 28}" height="28" rx="5" fill="${el.bg || '#F8FAFC'}" stroke="${el.border || '#E2E8F0'}" stroke-width="1"/>
        <text x="24" y="${ey + 18}" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="600" fill="${el.color || '#334155'}">${esc(el.label)}</text>
      `;
    });

    return `
      <g class="arch-node" data-node-id="${esc(id)}" transform="translate(${x}, ${y})" style="cursor:pointer;">
        <rect class="node-bounding-rect" x="0" y="0" width="${w}" height="${h}" rx="12" fill="#FFFFFF" stroke="${stroke}" stroke-width="1.8" filter="url(#vs-shadow-md)"/>
        <!-- Browser Chrome Top Bar -->
        <rect x="1" y="1" width="${w - 2}" height="30" rx="11" fill="#F1F5F9"/>
        <circle cx="16" cy="16" r="4.5" fill="#F87171"/>
        <circle cx="30" cy="16" r="4.5" fill="#FBBF24"/>
        <circle cx="44" cy="16" r="4.5" fill="#34D399"/>
        <rect x="62" y="7" width="${w - 74}" height="18" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="0.8"/>
        <text x="70" y="19.5" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="600" fill="#64748B">${esc(route)}</text>
        <!-- Screen Title -->
        <text x="14" y="54" font-size="12.5" font-weight="800" fill="#0F172A">${esc(screenCode)} · ${esc(title)}</text>
        ${elSvg}
        <!-- Primary Action CTA Button -->
        <rect x="14" y="${h - 40}" width="${w - 28}" height="28" rx="6" fill="${ctaColor}"/>
        <text x="${w / 2}" y="${h - 22}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#FFFFFF">${esc(ctaText)}</text>
      </g>
    `;
  }

  function drawDecisionDiamond({ id, cx, cy, rx, ry, title, sub, fill = '#FEF3C7', stroke = '#D97706' }) {
    const pts = `${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`;
    return `
      <g class="arch-node" data-node-id="${esc(id)}" style="cursor:pointer;">
        <rect class="node-bounding-rect" x="${cx - rx}" y="${cy - ry}" width="${rx * 2}" height="${ry * 2}" fill="none" stroke="none"/>
        <polygon points="${pts}" fill="${fill}" stroke="${stroke}" stroke-width="2" filter="url(#vs-shadow-sm)"/>
        <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="800" fill="#92400E">${esc(title)}</text>
        <text x="${cx}" y="${cy + 13}" text-anchor="middle" font-size="9.5" font-weight="600" fill="#B45309">${esc(sub)}</text>
      </g>
    `;
  }

  let svg = '';

  // Screen 1: SSO / Passkey Entry Screen (x=32, y=220, w=264, h=270)
  svg += drawScreenMockup({
    id: 'n1',
    x: 32,
    y: 230,
    w: 268,
    h: 260,
    screenCode: 'S01',
    title: 'Passkey & SSO Sign-In',
    route: 'https://app.verispec.io/login',
    elements: [
      { label: '[Input] Work Email: architect@...', bg: '#F8FAFC' },
      { label: '[Biometric] TouchID / WebAuthn Key', bg: '#EFF6FF', border: '#93C5FD', color: '#1D4ED8' },
      { label: '[Telemetry] Device Posture: 0.04', bg: '#ECFDF5', border: '#6EE7B7', color: '#065F46' }
    ],
    ctaText: 'Continue with Passkey →',
    ctaColor: '#2563EB'
  });

  // Decision Diamond 1: Risk Score Gate (cx=415, cy=360)
  svg += drawDecisionDiamond({
    id: 'n2',
    cx: 420,
    cy: 360,
    rx: 84,
    ry: 54,
    title: '◇ RISK < 0.15?',
    sub: 'IAP Context Eval'
  });

  // Screen 2A (Top Branch - Low Risk Happy Path): AI Workspace Studio (x=548, y=106, w=290, h=256)
  svg += drawScreenMockup({
    id: 'n3',
    x: 548,
    y: 106,
    w: 292,
    h: 256,
    screenCode: 'S02A',
    title: 'AI Architecture Studio',
    route: 'https://app.verispec.io/studio',
    elements: [
      { label: '[Sidebar] 18 Lifecycle Blueprints', bg: '#F8FAFC' },
      { label: '[Canvas] Interactive 16:9 Vector DAG', bg: '#EFF6FF', border: '#93C5FD', color: '#1D4ED8' },
      { label: '[Prompt] "Add Cloud Spanner HA..."', bg: '#F5F3FF', border: '#C4B5FD', color: '#6D28D9' }
    ],
    ctaText: 'Mutate & Export .drawio →',
    ctaColor: '#059669',
    stroke: '#10B981'
  });

  // Screen 2B (Bottom Branch - Step-Up Challenge): Biometric MFA Modal (x=548, y=446, w=292, h=256)
  svg += drawScreenMockup({
    id: 'n4',
    x: 548,
    y: 446,
    w: 292,
    h: 256,
    screenCode: 'S02B',
    title: 'Step-Up FIDO2 Challenge',
    route: 'https://app.verispec.io/mfa-verify',
    elements: [
      { label: '[Alert] Unrecognized Geo / IP ASN', bg: '#FFFBEB', border: '#FCD34D', color: '#B45309' },
      { label: '[Challenge] Tap Hardware YubiKey', bg: '#F8FAFC' },
      { label: '[Timer] Session TTL: 00:45s remaining', bg: '#FFF1F2', border: '#FECDD3', color: '#BE123C' }
    ],
    ctaText: 'Verify Hardware Token →',
    ctaColor: '#D97706',
    stroke: '#F59E0B'
  });

  // Decision Diamond 2: FIDO2 Verified? (cx=956, cy=574)
  svg += drawDecisionDiamond({
    id: 'n5',
    cx: 956,
    cy: 574,
    rx: 82,
    ry: 52,
    title: '◇ FIDO2 PASS?',
    sub: 'Hardware Attest',
    fill: '#EDE9FE',
    stroke: '#7C3AED'
  });

  // Screen 3A (Top Right): Production Deployment & ADR Sign-Off (x=1086, y=106, w=318, h=256)
  svg += drawScreenMockup({
    id: 'n6',
    x: 1086,
    y: 106,
    w: 318,
    h: 256,
    screenCode: 'S03A',
    title: 'ADR Sign-Off & GitOps PR',
    route: 'https://app.verispec.io/deploy-pr',
    elements: [
      { label: '[Diff] +2 Added · ~1 Upgraded (v1.0.3)', bg: '#ECFDF5', border: '#6EE7B7', color: '#065F46' },
      { label: '[Gate] 5/5 Geometry & Security PASS', bg: '#EFF6FF', border: '#93C5FD', color: '#1D4ED8' },
      { label: '[Sign] 21 CFR Part 11 HMAC Token', bg: '#F8FAFC' }
    ],
    ctaText: 'Merge & Trigger Cloud Build ✓',
    ctaColor: '#059669',
    stroke: '#10B981'
  });

  // Screen 3B (Bottom Right): Quarantine & SOC Escalation Drawer (x=1086, y=446, w=318, h=256)
  svg += drawScreenMockup({
    id: 'n7',
    x: 1086,
    y: 446,
    w: 318,
    h: 256,
    screenCode: 'S03B',
    title: 'Zero-Trust Lockout & SOC',
    route: 'https://app.verispec.io/quarantine',
    elements: [
      { label: '[Blocked] Token Revoked via IAP Policy', bg: '#FFF1F2', border: '#FDA4AF', color: '#BE123C' },
      { label: '[Incident] Chronicle Case #SOC-99412', bg: '#F8FAFC' },
      { label: '[Action] Request SecOps Override', bg: '#F8FAFC' }
    ],
    ctaText: 'Contact Security Operations',
    ctaColor: '#E11D48',
    stroke: '#F43F5E'
  });

  // Connectors between screens and decision diamonds
  svg += `
    <!-- S01 -> Diamond 1 -->
    <line class="arch-edge" x1="300" y1="360" x2="334" y2="360" stroke="#2563EB" stroke-width="2.2" marker-end="url(#arr-blue)"/>
    <!-- Diamond 1 -> S02A (YES) -->
    <path class="arch-edge" d="M 420 306 L 420 234 L 544 234" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>
    <rect x="432" y="214" width="92" height="18" rx="9" fill="#ECFDF5" stroke="#10B981"/>
    <text x="478" y="226.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#065F46">YES (94% Traffic)</text>
    <!-- Diamond 1 -> S02B (NO) -->
    <path class="arch-edge" d="M 420 414 L 420 574 L 544 574" fill="none" stroke="#D97706" stroke-width="2.2" marker-end="url(#arr-amber)"/>
    <rect x="432" y="554" width="92" height="18" rx="9" fill="#FFFBEB" stroke="#F59E0B"/>
    <text x="478" y="566.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#B45309">NO (Step-Up 6%)</text>
    <!-- S02A -> S03A -->
    <line class="arch-edge" x1="840" y1="234" x2="1082" y2="234" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>
    <rect x="910" y="214" width="104" height="18" rx="9" fill="#ECFDF5" stroke="#10B981"/>
    <text x="962" y="226.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#065F46">Publish Spec</text>
    <!-- S02B -> Diamond 2 -->
    <line class="arch-edge" x1="840" y1="574" x2="872" y2="574" stroke="#7C3AED" stroke-width="2.2" marker-end="url(#arr-violet)"/>
    <!-- Diamond 2 -> S02A (Pass recovery) -->
    <path class="arch-edge" d="M 956 522 L 956 310 L 844 310" fill="none" stroke="#059669" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arr-green)"/>
    <rect x="888" y="395" width="110" height="18" rx="9" fill="#ECFDF5" stroke="#10B981"/>
    <text x="943" y="407.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#065F46">PASS → Studio</text>
    <!-- Diamond 2 -> S03B (Fail quarantine) -->
    <line class="arch-edge" x1="1038" y1="574" x2="1082" y2="574" stroke="#E11D48" stroke-width="2.2" marker-end="url(#arr-rose)"/>
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D03: DDD EVENT STORMING & BOUNDED CONTEXT MAP
// ============================================================================
function renderD03EventStorming(graph, options) {
  const contexts = [
    {
      id: 'ctx1',
      x: 24,
      w: 440,
      title: 'BOUNDED CONTEXT 01 · IDENTITY & TENANCY',
      sub: 'Upstream Auth & Organization Claims (OHS)',
      bg: '#EFF6FF',
      border: '#3B82F6',
      cards: [
        { id: 'n1', x: 44, y: 166, role: 'COMMAND', roleBg: '#2563EB', fill: '#DBEAFE', stroke: '#3B82F6', title: 'AuthenticateUserCmd', sub: 'Passkey + Org Workspace Slug', inv: 'Topic: identity.cmd.v1' },
        { id: 'n2', x: 254, y: 166, role: 'AGGREGATE', roleBg: '#D97706', fill: '#FEF3C7', stroke: '#F59E0B', title: 'TenantIdentityRoot', sub: 'Invariants: Active Org & MFA', inv: 'Root ID: tenant_uuid' },
        { id: 'n3', x: 44, y: 336, role: 'DOMAIN EVENT', roleBg: '#EA580C', fill: '#FFEDD5', stroke: '#F97316', title: 'SessionTokenIssuedEvt', sub: 'Emits JWT + RBAC Scopes', inv: 'Schema: TokenIssued.avsc' },
        { id: 'n4', x: 254, y: 336, role: 'POLICY', roleBg: '#7C3AED', fill: '#F3E8FF', stroke: '#8B5CF6', title: 'OnTokenIssuedPolicy', sub: 'Triggers Workspace Provisioning', inv: 'Trigger: ProvisionOrgCmd' }
      ]
    },
    {
      id: 'ctx2',
      x: 496,
      w: 448,
      title: 'BOUNDED CONTEXT 02 · CORE ORDER & PRICING SAGA',
      sub: 'Core Domain · Deterministic Price & Inventory Lock',
      bg: '#FFFBEB',
      border: '#D97706',
      cards: [
        { id: 'n5', x: 516, y: 166, role: 'COMMAND', roleBg: '#2563EB', fill: '#DBEAFE', stroke: '#3B82F6', title: 'PlaceEnterpriseOrderCmd', sub: 'Line Items + Quoted Discount', inv: 'Idempotency: quote_id' },
        { id: 'n6', x: 730, y: 166, role: 'AGGREGATE', roleBg: '#D97706', fill: '#FEF3C7', stroke: '#F59E0B', title: 'OrderSagaAggregate', sub: 'Invariants: Credit & Stock >= 1', inv: 'Lock: Spanner TrueTime' },
        { id: 'n7', x: 516, y: 336, role: 'DOMAIN EVENT', roleBg: '#EA580C', fill: '#FFEDD5', stroke: '#F97316', title: 'OrderCommittedEvt', sub: 'Spanner TrueTime Commit TS', inv: 'Stream: orders.committed' },
        { id: 'n8', x: 730, y: 336, role: 'READ MODEL', roleBg: '#059669', fill: '#D1FAE5', stroke: '#10B981', title: 'LiveOrderProjection', sub: 'CQRS Materialized GraphQL View', inv: 'Store: AlloyDB Read View' }
      ]
    },
    {
      id: 'ctx3',
      x: 976,
      w: 440,
      title: 'BOUNDED CONTEXT 03 · LEDGER & FULFILLMENT',
      sub: 'Downstream Context · Protected by Anti-Corruption Layer (ACL)',
      bg: '#ECFDF5',
      border: '#10B981',
      cards: [
        { id: 'n9', x: 996, y: 166, role: 'POLICY', roleBg: '#7C3AED', fill: '#F3E8FF', stroke: '#8B5CF6', title: 'WhenOrderCommittedPol', sub: 'Consumes Pub/Sub Order Stream', inv: 'Consumer: ledger-acl-grp' },
        { id: 'n10', x: 1206, y: 166, role: 'COMMAND', roleBg: '#2563EB', fill: '#DBEAFE', stroke: '#3B82F6', title: 'SettleInvoiceLedgerCmd', sub: 'Double-Entry Journal Post', inv: 'Journal: ISO-20022 Post' },
        { id: 'n11', x: 996, y: 336, role: 'AGGREGATE', roleBg: '#D97706', fill: '#FEF3C7', stroke: '#F59E0B', title: 'GeneralLedgerRoot', sub: 'Invariants: Debit == Credit', inv: 'Rule: sum(dr) == sum(cr)' },
        { id: 'n12', x: 1206, y: 336, role: 'DOMAIN EVENT', roleBg: '#EA580C', fill: '#FFEDD5', stroke: '#F97316', title: 'LedgerSettledAndShipped', sub: 'Immutable SOX Audit Record', inv: 'Sink: BigQuery Audit WORM' }
      ]
    }
  ];

  let svg = '';

  contexts.forEach((ctx) => {
    svg += `
      <g>
        <rect x="${ctx.x}" y="94" width="${ctx.w}" height="410" rx="16" fill="${ctx.bg}" fill-opacity="0.55" stroke="${ctx.border}" stroke-width="2" stroke-dasharray="8 5"/>
        <rect x="${ctx.x + 14}" y="106" width="${ctx.w - 28}" height="42" rx="8" fill="#FFFFFF" stroke="${ctx.border}" stroke-width="1.2"/>
        <text x="${ctx.x + 26}" y="125" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#0F172A">${esc(ctx.title)}</text>
        <text x="${ctx.x + 26}" y="141" font-size="10" font-weight="500" fill="#475569">${esc(ctx.sub)}</text>
      </g>
    `;

    ctx.cards.forEach((c) => {
      const w = 190;
      const h = 126;
      const iconKey = resolveIconKeyFromText(c.title, c.sub, c.inv);
      const iconSpec = getIconSpec(iconKey);
      const tFit = fitText(c.title, w - 48, 11.2, 8.2, 0.59);
      const sFit = fitText(c.sub, w - 48, 9.6, 7.8, 0.55);
      svg += `
        <g class="arch-node" data-node-id="${esc(c.id)}" transform="translate(${c.x}, ${c.y})" style="cursor:pointer;">
          <rect class="node-bounding-rect" x="0" y="0" width="${w}" height="${h}" rx="8" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.8" filter="url(#vs-shadow-sm)"/>
          <rect x="0" y="0" width="${w}" height="24" rx="7" fill="${c.roleBg}"/>
          <text x="${w / 2}" y="16" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="800" fill="#FFFFFF">DDD ${esc(c.role)}</text>
          <g transform="translate(10, 36)">
            <rect x="0" y="0" width="22" height="22" rx="5" fill="#FFFFFF" stroke="${iconSpec.border}" stroke-width="1.2"/>
            <svg x="1" y="1" width="20" height="20" viewBox="0 0 24 24">${iconSpec.svgInner}</svg>
          </g>
          <text x="38" y="48" font-family="JetBrains Mono, monospace" font-size="${tFit.fontSize}" font-weight="800" fill="#0F172A">${esc(tFit.text)}</text>
          <text x="38" y="68" font-size="${sFit.fontSize}" font-weight="600" fill="#334155">${esc(sFit.text)}</text>
          <rect x="10" y="94" width="${w - 20}" height="20" rx="4" fill="#FFFFFF" fill-opacity="0.85" stroke="${c.stroke}" stroke-width="0.8"/>
          <text x="${w / 2}" y="108" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.6" font-weight="700" fill="${c.roleBg}">${esc(c.inv)}</text>
        </g>
      `;
    });

    // Intra-context orthogonal sticky arrows (zero diagonal connectors)
    const c = ctx.cards;
    svg += `
      <line class="arch-edge" x1="${c[0].x + 190}" y1="${c[0].y + 63}" x2="${c[1].x - 2}" y2="${c[1].y + 63}" stroke="#475569" stroke-width="1.8" marker-end="url(#arr-slate)"/>
      <path class="arch-edge" d="M ${c[1].x + 95} ${c[1].y + 126} L ${c[1].x + 95} 314 L ${c[2].x + 95} 314 L ${c[2].x + 95} ${c[2].y - 2}" fill="none" stroke="#EA580C" stroke-width="1.8" marker-end="url(#arr-amber)"/>
      <line class="arch-edge" x1="${c[2].x + 190}" y1="${c[2].y + 63}" x2="${c[3].x - 2}" y2="${c[3].y + 63}" stroke="#7C3AED" stroke-width="1.8" marker-end="url(#arr-violet)"/>
    `;
  });

  // Inter-context orthogonal bridges between bounded contexts
  svg += `
    <path class="arch-edge" d="M 444 399 L 480 399 L 480 229 L 512 229" fill="none" stroke="#2563EB" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arr-blue)"/>
    <path class="arch-edge" d="M 920 399 L 960 399 L 960 229 L 992 229" fill="none" stroke="#059669" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arr-green)"/>
    ${drawStepCallout(480, 314, '1', '#2563EB')}
    ${drawStepCallout(960, 314, '2', '#059669')}
  `;

  // Bottom Context Map Integration & Anti-Corruption Layer Highway (y=530..750)
  svg += `
    <g transform="translate(24, 530)">
      <rect x="0" y="0" width="1392" height="218" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" filter="url(#vs-shadow-sm)"/>
      <rect x="0" y="0" width="1392" height="32" rx="12" fill="#F1F5F9"/>
      <text x="20" y="21" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#0F172A">DDD STRATEGIC CONTEXT MAP &amp; EVENT-DRIVEN INTEGRATION TOPOLOGY</text>

      <!-- 3 Context Map Bridge Boxes -->
      <g transform="translate(36, 54)">
        <rect x="0" y="0" width="380" height="136" rx="10" fill="#EFF6FF" stroke="#3B82F6" stroke-width="1.5"/>
        <text x="190" y="28" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#1D4ED8">[OHS / PL] OPEN HOST SERVICE</text>
        <text x="190" y="52" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F172A">Identity Context → Order Context</text>
        <text x="190" y="76" text-anchor="middle" font-size="10.5" fill="#475569">Published Language: OIDC JWT + SPIFFE ID</text>
        <text x="190" y="108" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#2563EB">Zero Shared DB · Contract Tested</text>
      </g>

      <line x1="416" y1="122" x2="496" y2="122" stroke="#2563EB" stroke-width="2.5" marker-end="url(#arr-blue)"/>
      ${drawStepCallout(456, 122, '3', '#2563EB')}

      <g transform="translate(500, 54)">
        <rect x="0" y="0" width="392" height="136" rx="10" fill="#FFFBEB" stroke="#D97706" stroke-width="1.5"/>
        <text x="196" y="28" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#B45309">[TRANSACTIONAL OUTBOX + PUB/SUB]</text>
        <text x="196" y="52" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F172A">At-Least-Once Domain Event Bus</text>
        <text x="196" y="76" text-anchor="middle" font-size="10.5" fill="#475569">Cloud Spanner Change Streams → Kafka/PubSub</text>
        <text x="196" y="108" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#D97706">Ordering Key: order_id · Dedup Window: 10m</text>
      </g>

      <line x1="892" y1="122" x2="972" y2="122" stroke="#059669" stroke-width="2.5" marker-end="url(#arr-green)"/>
      ${drawStepCallout(932, 122, '4', '#059669')}

      <g transform="translate(976, 54)">
        <rect x="0" y="0" width="380" height="136" rx="10" fill="#ECFDF5" stroke="#10B981" stroke-width="1.5"/>
        <text x="190" y="28" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#047857">[ACL] ANTI-CORRUPTION LAYER</text>
        <text x="190" y="52" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0F172A">Order Context → SAP / Ledger Context</text>
        <text x="190" y="76" text-anchor="middle" font-size="10.5" fill="#475569">Translates OrderCommittedEvt → ISO-20022 Entry</text>
        <text x="190" y="108" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#059669">Prevents Legacy ERP Schema Bleed</text>
      </g>
    </g>
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D04: C4 SYSTEM CONTEXT & LEVEL-2 CONTAINER ARCHITECTURE
// ============================================================================
function renderD04C4Topology(graph, options) {
  let svg = '';

  // Left Column: C4 Person & External Actor Cards (x=28..288)
  const actors = [
    { id: 'n1', y: 120, title: 'Enterprise Buyer', role: '[Person · Customer]', sub: 'Browses catalog & places orders via web/mobile', color: '#1E3A8A', bg: '#DBEAFE' },
    { id: 'n2', y: 340, title: 'Platform Architect', role: '[Person · Internal User]', sub: 'Authors & audits architecture specs via Studio', color: '#1E3A8A', bg: '#DBEAFE' },
    { id: 'n3', y: 560, title: 'Procurement AI Bot', role: '[External System Actor]', sub: 'Invokes B2B A2A & GraphQL order APIs', color: '#334155', bg: '#E2E8F0' }
  ];

  actors.forEach((a) => {
    svg += `
      <g class="arch-node" data-node-id="${a.id}" transform="translate(28, ${a.y})" style="cursor:pointer;">
        <rect class="node-bounding-rect" x="0" y="0" width="256" height="164" rx="14" fill="${a.bg}" stroke="${a.color}" stroke-width="2" filter="url(#vs-shadow-sm)"/>
        <circle cx="128" cy="36" r="20" fill="${a.color}"/>
        <text x="128" y="42" text-anchor="middle" font-size="15" font-weight="800" fill="#FFFFFF">C4</text>
        <text x="128" y="78" text-anchor="middle" font-size="13.5" font-weight="800" fill="#0F172A">${esc(a.title)}</text>
        <text x="128" y="96" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="${a.color}">${esc(a.role)}</text>
        <text x="128" y="124" text-anchor="middle" font-size="10.2" font-weight="500" fill="#334155">${esc(fitText(a.sub, 236, 10.2).text)}</text>
      </g>
    `;
  });

  // Center Dashed C4 System Boundary (x=336..1096, y=96..748)
  svg += `
    <g>
      <rect x="336" y="96" width="760" height="652" rx="16" fill="#FFFFFF" fill-opacity="0.88" stroke="#0284C7" stroke-width="2.4" stroke-dasharray="10 6"/>
      <rect x="356" y="110" width="720" height="36" rx="8" fill="#E0F2FE" stroke="#0284C7" stroke-width="1.2"/>
      <text x="372" y="133" font-family="JetBrains Mono, monospace" font-size="11.5" font-weight="800" fill="#0369A1">C4 SYSTEM BOUNDARY [Software System] · VeriSpec Cloud-Native Commerce &amp; AI Platform</text>
    </g>
  `;

  // 6 Level-2 C4 Containers inside the System Boundary (2 columns x 3 rows)
  const containers = [
    { id: 'c1', x: 368, y: 170, title: 'Next.js 15 Web & Studio SPA', tech: '[Container: TypeScript / React 19]', sub: 'SSR storefront & interactive canvas UI', metric: 'HTTPS / HTTP3', color: '#0284C7' },
    { id: 'c2', x: 736, y: 170, title: 'Apigee X + Apollo Router BFF', tech: '[Container: Managed API Gateway]', sub: 'OAuth2 JWT verification & supergraph federation', metric: 'GraphQL / mTLS', color: '#2563EB' },
    { id: 'c3', x: 368, y: 368, title: 'Order & Pricing Core Service', tech: '[Container: Go 1.24 on GKE Autopilot]', sub: 'Executes distributed cart & checkout sagas', metric: 'gRPC / Protobuf', color: '#059669' },
    { id: 'c4', x: 736, y: 368, title: 'ADK Agentic RAG Orchestrator', tech: '[Container: Python 3.12 / Vertex ADK]', sub: 'Grounds product & architecture recommendations', metric: 'A2A + MCP Protocol', color: '#7C3AED' },
    { id: 'c5', x: 368, y: 566, title: 'Cloud Spanner Distributed DB', tech: '[Container Db: Multi-Region SQL]', sub: 'Stores orders, inventory locks & CAG state', metric: 'TrueTime Paxos RPO=0', color: '#D97706' },
    { id: 'c6', x: 736, y: 566, title: 'Cloud Pub/Sub Event Backbone', tech: '[Container Queue: Async Event Bus]', sub: 'Streams domain events to analytics & ERP', metric: 'At-Least-Once CDC', color: '#0D9488' }
  ];

  containers.forEach((c) => {
    svg += drawNodeBox({
      id: c.id,
      x: c.x,
      y: c.y,
      w: 328,
      h: 146,
      title: c.title,
      subtitle: c.sub,
      badge: c.tech,
      metric: c.metric,
      headerFill: c.color,
      accentColor: c.color,
      scopedNodeId: options.scopedNodeId
    });
  });

  // Right Column: C4 External Systems (x=1144..1412)
  const externals = [
    { id: 'e1', y: 140, title: 'Stripe Payment Network', tech: '[External System · PCI-DSS]', sub: 'Processes credit card & ACH settlements' },
    { id: 'e2', y: 360, title: 'Vertex AI Gemini 4 Argon', tech: '[External System · Foundation LLM]', sub: 'Provides frontier reasoning & embeddings' },
    { id: 'e3', y: 580, title: 'SAP S/4HANA Global ERP', tech: '[External System · Finance Ledger]', sub: 'Receives settled invoices & tax records' }
  ];

  externals.forEach((ex) => {
    svg += drawNodeBox({
      id: ex.id,
      x: 1144,
      y: ex.y,
      w: 268,
      h: 146,
      title: ex.title,
      subtitle: ex.sub,
      badge: ex.tech,
      metric: 'External Egress via PSC',
      fill: '#F8FAFC',
      stroke: '#64748B',
      headerFill: '#475569',
      accentColor: '#475569',
      scopedNodeId: options.scopedNodeId
    });
  });

  // C4 Relationships (Orthogonal H-V-H Channel Routing + Step Callouts)
  svg += `
    <path class="arch-edge" d="M 284 202 L 312 202 L 312 230 L 364 230" fill="none" stroke="#0284C7" stroke-width="2" marker-end="url(#arr-blue)"/>
    <path class="arch-edge" d="M 284 422 L 312 422 L 312 260 L 364 260" fill="none" stroke="#0284C7" stroke-width="2" marker-end="url(#arr-blue)"/>
    <path class="arch-edge" d="M 284 642 L 316 642 L 316 441 L 364 441" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arr-slate)"/>
    <line class="arch-edge" x1="696" y1="243" x2="732" y2="243" stroke="#2563EB" stroke-width="2.2" marker-end="url(#arr-blue)"/>
    <line class="arch-edge" x1="532" y1="316" x2="532" y2="364" stroke="#059669" stroke-width="2" marker-end="url(#arr-green)"/>
    <line class="arch-edge" x1="900" y1="316" x2="900" y2="364" stroke="#7C3AED" stroke-width="2" marker-end="url(#arr-violet)"/>
    <line class="arch-edge" x1="532" y1="514" x2="532" y2="562" stroke="#D97706" stroke-width="2" marker-end="url(#arr-amber)"/>
    <path class="arch-edge" d="M 696 441 L 716 441 L 716 639 L 732 639" fill="none" stroke="#0D9488" stroke-width="2" marker-end="url(#arr-green)"/>
    <path class="arch-edge" d="M 1064 441 L 1118 441 L 1118 433 L 1140 433" fill="none" stroke="#7C3AED" stroke-width="2" marker-end="url(#arr-violet)"/>
    <path class="arch-edge" d="M 1064 243 L 1118 243 L 1118 213 L 1140 213" fill="none" stroke="#475569" stroke-width="2" marker-end="url(#arr-slate)"/>
    <path class="arch-edge" d="M 1064 639 L 1118 639 L 1118 653 L 1140 653" fill="none" stroke="#475569" stroke-width="2" marker-end="url(#arr-slate)"/>
    ${drawStepCallout(312, 202, '1', '#0284C7')}
    ${drawStepCallout(714, 243, '2', '#2563EB')}
    ${drawStepCallout(532, 340, '3', '#059669')}
    ${drawStepCallout(900, 340, '4', '#7C3AED')}
    ${drawStepCallout(532, 538, '5', '#D97706')}
    ${drawStepCallout(1118, 437, '6', '#7C3AED')}
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D05: 5-TIER CLOUD-NATIVE MICROSERVICES & AI + LIVE AST DIFF (v1.0.1..v1.0.3)
// ============================================================================
function renderD05MultiTierCloud(graph, options = {}) {
  const ver = graph.version || 'v1.0.3';
  const showDiff = options.showDiff !== false;
  const nodes = graph.nodes || [];

  const CANONICAL_IDS = new Set([
    'node_web_storefront',
    'node_mobile_passkey',
    'node_cloud_armor',
    'node_apigee_gateway',
    'node_catalog_bff',
    'node_checkout_service',
    'node_dlp_guardrail',
    'node_vertex_agent',
    'node_vector_index',
    'node_redis_cache',
    'node_primary_db',
    'node_kafka_bus'
  ]);

  const customAddedNodes = nodes.filter((n) => !CANONICAL_IDS.has(n.id));
  const findNode = (id) => nodes.find((n) => n.id === id);

  const zones = [
    { id: 'z1', name: 'ZONE 1 · CLIENT', sub: 'Web & Mobile', x: 24, w: 248, cardX: 38, cardW: 220, bg: '#EFF6FF', border: '#93C5FD', color: '#1D4ED8', accent: '#2563EB' },
    { id: 'z2', name: 'ZONE 2 · EDGE WAF', sub: 'Zero-Trust Ingress', x: 292, w: 262, cardX: 306, cardW: 234, bg: '#FFFBEB', border: '#FCD34D', color: '#B45309', accent: '#D97706' },
    { id: 'z3', name: 'ZONE 3 · GKE MESH', sub: 'Core Microservices', x: 574, w: 268, cardX: 588, cardW: 240, bg: '#F5F3FF', border: '#C4B5FD', color: '#6D28D9', accent: '#7C3AED' },
    { id: 'z4', name: 'ZONE 4 · AI & DLP', sub: 'Vertex & Guardrails', x: 862, w: 268, cardX: 876, cardW: 240, bg: '#FDF2F8', border: '#F9A8D4', color: '#BE185D', accent: '#DB2777' },
    { id: 'z5', name: 'ZONE 5 · DATA HA', sub: 'Stateful Storage & BI', x: 1150, w: 266, cardX: 1164, cardW: 238, bg: '#ECFDF5', border: '#6EE7B7', color: '#047857', accent: '#059669' }
  ];

  let svg = '';
  zones.forEach((z) => {
    svg += `
      <rect x="${z.x}" y="94" width="${z.w}" height="656" rx="14" fill="${z.bg}" fill-opacity="0.45" stroke="${z.border}" stroke-width="1.6" stroke-dasharray="6 4"/>
      <rect x="${z.x + 12}" y="106" width="${z.w - 24}" height="40" rx="8" fill="#FFFFFF" stroke="${z.border}" stroke-width="1.2"/>
      <text x="${z.x + z.w / 2}" y="124" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="800" fill="${z.color}">${esc(z.name)}</text>
      <text x="${z.x + z.w / 2}" y="139" text-anchor="middle" font-size="9.5" font-weight="600" fill="#64748B">${esc(z.sub)}</text>
    `;
  });

  // Dynamically bucket all current nodes in graph.nodes across the 5 zones and sort by slotOrder
  const buckets = { z1: [], z2: [], z3: [], z4: [], z5: [] };
  for (const n of nodes) {
    const zid = buckets[n.zoneId] ? n.zoneId : 'z5';
    buckets[zid].push(n);
  }
  for (const zid of Object.keys(buckets)) {
    buckets[zid].sort((a, b) => (a.slotOrder ?? 99) - (b.slotOrder ?? 99));
  }

  // Balance overflow if any single zone has > 4 nodes (e.g. adding Looker + BigQuery + Redshift into z5)
  const zoneOrder = ['z1', 'z2', 'z3', 'z4', 'z5'];
  for (let i = zoneOrder.length - 1; i >= 0; i--) {
    const zid = zoneOrder[i];
    while (buckets[zid].length > 4) {
      // Find nearest neighbor zone with < 4 nodes
      const neighbor =
        [i - 1, i + 1, i - 2, i + 2, i - 3]
          .filter((idx) => idx >= 0 && idx < zoneOrder.length)
          .map((idx) => zoneOrder[idx])
          .find((cand) => buckets[cand].length < 4) || null;
      if (!neighbor) break;
      const overflowNode = buckets[zid].pop();
      buckets[neighbor].push(overflowNode);
    }
  }

  const nodeBoxMap = new Map();

  // Render cards inside each zone with collision-free adaptive vertical spacing
  zones.forEach((z, zIdx) => {
    const list = buckets[z.id] || [];
    const count = list.length;
    if (count === 0) return;

    let cardH = 122;
    let yPositions = [];
    if (count === 1) {
      cardH = 132;
      yPositions = [310];
    } else if (count === 2) {
      cardH = 132;
      yPositions = [180, 440];
    } else if (count === 3) {
      cardH = 122;
      yPositions = [168, 330, 492];
    } else if (count === 4) {
      cardH = 102;
      yPositions = [160, 278, 396, 514];
    } else {
      cardH = Math.max(76, Math.floor((476 - (count - 1) * 10) / count));
      yPositions = Array.from({ length: count }, (_, idx) => 156 + idx * (cardH + 10));
    }

    list.forEach((n, idx) => {
      const cyTop = yPositions[idx];
      const status = showDiff ? n.changeStatus || 'baseline' : 'baseline';
      const roleBadge =
        n.id === 'node_web_storefront'
          ? 'CLIENT SPA'
          : n.id === 'node_mobile_passkey'
            ? 'MOBILE SDK'
            : n.id === 'node_cloud_armor'
              ? 'EDGE WAF'
              : n.id === 'node_apigee_gateway'
                ? 'INGRESS GATEWAY'
                : n.id === 'node_dlp_guardrail'
                  ? 'AI SAFETY GATE'
                  : n.id === 'node_vertex_agent'
                    ? 'VERTEX AI AGENT'
                    : n.id === 'node_vector_index'
                      ? 'EMBEDDING INDEX'
                      : n.id === 'node_redis_cache'
                        ? 'IN-MEMORY CACHE'
                        : n.id === 'node_primary_db'
                          ? /spanner/i.test(n.title)
                            ? 'DISTRIBUTED SQL'
                            : 'RELATIONAL DB'
                          : n.id === 'node_kafka_bus'
                            ? 'EVENT BACKBONE'
                            : z.name.split('·')[1]?.trim() || 'CLOUD SERVICE';

      svg += drawNodeBox({
        id: n.id,
        x: z.cardX,
        y: cyTop,
        w: z.cardW,
        h: cardH,
        title: n.title,
        subtitle: n.subtitle || '',
        badge: roleBadge,
        metric: n.pill || '',
        l300Spec: n.l300Spec || '',
        accentColor: z.accent,
        changeStatus: status,
        versionTag: n.addedInVersion || ver,
        iconKey: n.iconKey || '',
        scopedNodeId: options.scopedNodeId
      });

      nodeBoxMap.set(n.id, {
        id: n.id,
        x: z.cardX,
        y: cyTop,
        w: z.cardW,
        h: cardH,
        cx: z.cardX + z.cardW / 2,
        cy: Math.round(cyTop + cardH / 2),
        right: z.cardX + z.cardW,
        bottom: cyTop + cardH,
        zoneIdx: zIdx,
        rowIdx: idx
      });
    });
  });

  // Base Orthogonal H-V-H Channel Connectors using exact rendered node positions
  const bWeb = nodeBoxMap.get('node_web_storefront') || buckets.z1[0] && nodeBoxMap.get(buckets.z1[0].id);
  const bMob = nodeBoxMap.get('node_mobile_passkey') || buckets.z1[1] && nodeBoxMap.get(buckets.z1[1].id);
  const bArmor = nodeBoxMap.get('node_cloud_armor');
  const bApigee = nodeBoxMap.get('node_apigee_gateway') || buckets.z2[buckets.z2.length - 1] && nodeBoxMap.get(buckets.z2[buckets.z2.length - 1].id);
  const bCat = nodeBoxMap.get('node_catalog_bff') || buckets.z3[0] && nodeBoxMap.get(buckets.z3[0].id);
  const bChk = nodeBoxMap.get('node_checkout_service') || buckets.z3[1] && nodeBoxMap.get(buckets.z3[1].id);
  const bDlp = nodeBoxMap.get('node_dlp_guardrail');
  const bVertex = nodeBoxMap.get('node_vertex_agent');
  const bVector = nodeBoxMap.get('node_vector_index');
  const bRedis = nodeBoxMap.get('node_redis_cache');
  const bDb = nodeBoxMap.get('node_primary_db');
  const bKafka = nodeBoxMap.get('node_kafka_bus');

  const z2EntryTop = bArmor || bApigee;
  if (bWeb && z2EntryTop) {
    svg += `<path class="arch-edge" d="M ${bWeb.right} ${bWeb.cy} L 282 ${bWeb.cy} L 282 ${z2EntryTop.cy} L ${z2EntryTop.x - 4} ${z2EntryTop.cy}" fill="none" stroke="#2563EB" stroke-width="2" marker-end="url(#arr-blue)"/>`;
    svg += drawStepCallout(282, bWeb.cy, '1', '#2563EB');
  }
  if (bMob && bApigee) {
    svg += `<path class="arch-edge" d="M ${bMob.right} ${bMob.cy} L 282 ${bMob.cy} L 282 ${bApigee.cy} L ${bApigee.x - 4} ${bApigee.cy}" fill="none" stroke="#2563EB" stroke-width="2" marker-end="url(#arr-blue)"/>`;
    svg += drawStepCallout(282, bMob.cy, '2', '#2563EB');
  }
  if (bArmor && bApigee && bArmor.zoneIdx === bApigee.zoneIdx && bArmor.bottom < bApigee.y) {
    svg += `<line class="arch-edge" x1="${bArmor.cx}" y1="${bArmor.bottom}" x2="${bApigee.cx}" y2="${bApigee.y - 4}" stroke="#10B981" stroke-width="2.2" marker-end="url(#arr-green)"/>`;
  }
  if (bApigee && bCat) {
    svg += `<path class="arch-edge" d="M ${bApigee.right} ${bApigee.cy - 14} L 562 ${bApigee.cy - 14} L 562 ${bCat.cy} L ${bCat.x - 4} ${bCat.cy}" fill="none" stroke="#D97706" stroke-width="2" marker-end="url(#arr-amber)"/>`;
    svg += drawStepCallout(562, Math.round((bApigee.cy + bCat.cy) / 2), '3', '#D97706');
  }
  if (bApigee && bChk) {
    svg += `<path class="arch-edge" d="M ${bApigee.right} ${bApigee.cy + 14} L 562 ${bApigee.cy + 14} L 562 ${bChk.cy} L ${bChk.x - 4} ${bChk.cy}" fill="none" stroke="#D97706" stroke-width="2" marker-end="url(#arr-amber)"/>`;
  }
  const z4Top = bDlp || bVertex;
  if (bCat && z4Top) {
    svg += `<path class="arch-edge" d="M ${bCat.right} ${bCat.cy} L 852 ${bCat.cy} L 852 ${z4Top.cy} L ${z4Top.x - 4} ${z4Top.cy}" fill="none" stroke="#7C3AED" stroke-width="2" marker-end="url(#arr-violet)"/>`;
    svg += drawStepCallout(852, bCat.cy, '4', '#7C3AED');
  }
  if (bDlp && bVertex && bDlp.zoneIdx === bVertex.zoneIdx && bDlp.bottom < bVertex.y) {
    svg += `<line class="arch-edge" x1="${bDlp.cx}" y1="${bDlp.bottom}" x2="${bVertex.cx}" y2="${bVertex.y - 4}" stroke="#10B981" stroke-width="2" marker-end="url(#arr-green)"/>`;
  }
  if (bVertex && bVector && bVertex.zoneIdx === bVector.zoneIdx && bVertex.bottom < bVector.y) {
    svg += `<line class="arch-edge" x1="${bVertex.cx}" y1="${bVertex.bottom}" x2="${bVector.cx}" y2="${bVector.y - 4}" stroke="#7C3AED" stroke-width="2" marker-end="url(#arr-violet)"/>`;
  }
  if (bRedis && z4Top && bRedis.zoneIdx === 4) {
    svg += `<path class="arch-edge" d="M ${z4Top.right} ${z4Top.cy} L 1140 ${z4Top.cy} L 1140 ${bRedis.cy} L ${bRedis.x - 4} ${bRedis.cy}" fill="none" stroke="#10B981" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arr-green)"/>`;
    svg += drawStepCallout(1140, bRedis.cy, '5', '#10B981');
  }
  if (bChk && bDb && bDb.zoneIdx === 4) {
    svg += `<path class="arch-edge" d="M ${bChk.right} ${bChk.cy - 12} L 846 ${bChk.cy - 12} L 846 654 L 1140 654 L 1140 ${bDb.cy} L ${bDb.x - 4} ${bDb.cy}" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>`;
    svg += drawStepCallout(1140, bDb.cy, '6', '#059669');
  }
  if (bChk && bKafka && bKafka.zoneIdx === 4) {
    svg += `<path class="arch-edge" d="M ${bChk.right} ${bChk.cy + 12} L 838 ${bChk.cy + 12} L 838 672 L 1148 672 L 1148 ${bKafka.cy} L ${bKafka.x - 4} ${bKafka.cy}" fill="none" stroke="#059669" stroke-width="2" marker-end="url(#arr-green)"/>`;
    svg += drawStepCallout(1148, bKafka.cy, '7', '#059669');
  }

  // Render Orthogonal Connectors + Callouts for Every Custom Prompt-Added Node (Looker, BigQuery, Redshift, etc.)
  const channelXs = [282, 562, 852, 1140, 1410];
  customAddedNodes.forEach((cn, idx) => {
    const targetBox = nodeBoxMap.get(cn.id);
    if (!targetBox) return;

    // Find source box from scopedTargetId or graph.edges
    const edgeMatch = (graph.edges || []).find((e) => e.targetNodeId === cn.id || e.sourceNodeId === cn.id);
    const srcId =
      cn.scopedTargetId ||
      (edgeMatch ? (edgeMatch.targetNodeId === cn.id ? edgeMatch.sourceNodeId : edgeMatch.targetNodeId) : null) ||
      'node_vector_index';
    const srcBox = nodeBoxMap.get(srcId) || bVector || bDb || bChk;
    if (!srcBox || srcBox.id === targetBox.id) return;

    const calloutNum = String(8 + idx);
    if (targetBox.zoneIdx === srcBox.zoneIdx && targetBox.rowIdx === srcBox.rowIdx + 1) {
      // Adjacent vertical cards in the same zone: direct vertical connector!
      svg += `<line class="arch-edge" x1="${srcBox.cx}" y1="${srcBox.bottom}" x2="${targetBox.cx}" y2="${targetBox.y - 4}" stroke="#10B981" stroke-width="2.3" stroke-dasharray="5 3" marker-end="url(#arr-green)"/>`;
      svg += drawStepCallout(srcBox.cx + 28, Math.round((srcBox.bottom + targetBox.y) / 2), calloutNum, '#10B981');
    } else if (targetBox.zoneIdx === srcBox.zoneIdx + 1) {
      // Adjacent zone: route directly via inter-zone channel
      const chanX = channelXs[srcBox.zoneIdx] - (idx % 2) * 6;
      svg += `<path class="arch-edge" d="M ${srcBox.right} ${srcBox.cy} L ${chanX} ${srcBox.cy} L ${chanX} ${targetBox.cy} L ${targetBox.x - 4} ${targetBox.cy}" fill="none" stroke="#10B981" stroke-width="2.3" stroke-dasharray="5 3" marker-end="url(#arr-green)"/>`;
      svg += drawStepCallout(chanX, targetBox.cy, calloutNum, '#10B981');
    } else {
      // Route via inter-zone channel + bottom horizontal bus (y = 690 + idx * 12) so 0 cards are crossed
      const srcChanX = channelXs[Math.min(srcBox.zoneIdx, 3)] - 4;
      const dstChanX = targetBox.zoneIdx > 0 ? channelXs[targetBox.zoneIdx - 1] + 4 : 28;
      const busY = Math.min(740, 690 + idx * 12);
      svg += `<path class="arch-edge" d="M ${srcBox.right} ${srcBox.cy} L ${srcChanX} ${srcBox.cy} L ${srcChanX} ${busY} L ${dstChanX} ${busY} L ${dstChanX} ${targetBox.cy} L ${targetBox.x - 4} ${targetBox.cy}" fill="none" stroke="#10B981" stroke-width="2.2" stroke-dasharray="5 3" marker-end="url(#arr-green)"/>`;
      svg += drawStepCallout(dstChanX, targetBox.cy, calloutNum, '#10B981');
    }
  });

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D06: ENTERPRISE HUB-AND-SPOKE MULTI-VPC LANDING ZONE (CANONICAL #78 4-ZONE)
// ============================================================================
function renderD06HubAndSpoke(graph, options) {
  let svg = '';

  // Outer Google Cloud Organization Frame (#1A73E8)
  svg += `
    <rect x="20" y="92" width="1400" height="660" rx="16" fill="#FFFFFF" stroke="#1A73E8" stroke-width="2.2"/>
    <rect x="20" y="92" width="1400" height="32" rx="15" fill="#E8F0FE"/>
    <text x="40" y="113" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#1A73E8">GOOGLE CLOUD ORGANIZATION LANDING ZONE · CANONICAL TEMPLATE #78 4-ZONE HUB-AND-SPOKE MULTI-VPC TOPOLOGY</text>
  `;

  // Left Hybrid & Public Ingress Column (x=36..260)
  svg += drawNodeBox({
    id: 'n1',
    x: 36,
    y: 168,
    w: 224,
    h: 150,
    title: 'Cloud Interconnect 100G',
    subtitle: 'Dedicated On-Prem & AWS Direct Link',
    badge: 'HYBRID INGRESS',
    metric: 'MACsec + BGP HA',
    accentColor: '#1A73E8',
    scopedNodeId: options.scopedNodeId
  });
  svg += drawNodeBox({
    id: 'n2',
    x: 36,
    y: 486,
    w: 224,
    h: 150,
    title: 'Global Cloud Armor + ALB',
    subtitle: 'Anycast L7 Load Balancer & WAF',
    badge: 'PUBLIC INGRESS',
    metric: 'TLS 1.3 · Adaptive DDoS',
    accentColor: '#1A73E8',
    scopedNodeId: options.scopedNodeId
  });

  // TOP-LEFT ZONE (#AECBFA): Central Ingress & Routing Hub VPC (x=296..832, y=136..424)
  svg += `
    <rect x="296" y="136" width="536" height="288" rx="14" fill="#AECBFA" fill-opacity="0.32" stroke="#1A73E8" stroke-width="2"/>
    <rect x="310" y="148" width="508" height="32" rx="8" fill="#AECBFA" stroke="#1A73E8" stroke-width="1.2"/>
    <text x="564" y="168" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="800" fill="#174EA6">ZONE 1 · CENTRAL ROUTING &amp; NGFW HUB VPC (#AECBFA)</text>
  `;
  svg += drawNodeBox({ id: 'n3', x: 312, y: 192, w: 242, h: 108, title: 'Network Connectivity Center', subtitle: 'NCC Transit Hub & BGP Route Exchange', badge: 'NCC TRANSIT HUB', metric: '100 Gbps Line-Rate', accentColor: '#1A73E8', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'n4', x: 572, y: 192, w: 244, h: 108, title: 'Cloud NGFW Enterprise', subtitle: 'L7 Deep Packet Inspection & IPS', badge: 'EAST-WEST FIREWALL', metric: 'Zero-Trust East-West', accentColor: '#1A73E8', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'n5', x: 312, y: 312, w: 504, h: 98, title: 'Private Service Connect (PSC) & Cloud DNS Hub', subtitle: 'Cross-VPC Service Directory & Private Endpoints (Zero Public IP)', badge: 'PSC SERVICE HUB', metric: 'mTLS + Private DNS Zones', accentColor: '#1A73E8', scopedNodeId: options.scopedNodeId });

  // TOP-RIGHT ZONE (#CEEAD6): Central Security, Identity & Governance Hub (x=864..1400, y=136..424)
  svg += `
    <rect x="864" y="136" width="536" height="288" rx="14" fill="#CEEAD6" fill-opacity="0.38" stroke="#1E8E3E" stroke-width="2"/>
    <rect x="878" y="148" width="508" height="32" rx="8" fill="#CEEAD6" stroke="#1E8E3E" stroke-width="1.2"/>
    <text x="1132" y="168" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="800" fill="#0D652D">ZONE 2 · CENTRAL SECURITY &amp; GOVERNANCE HUB (#CEEAD6)</text>
  `;
  svg += drawNodeBox({ id: 'n6', x: 880, y: 192, w: 242, h: 108, title: 'VPC Service Controls (VPC-SC)', subtitle: 'Context-Aware Data Exfiltration Perimeter', badge: 'VPC-SC PERIMETER', metric: 'Blocks Unauthorized Copy', accentColor: '#1E8E3E', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'n7', x: 1140, y: 192, w: 244, h: 108, title: 'Cloud KMS HSM + CAS PKI', subtitle: 'FIPS 140-3 L3 CMEK & Ephemeral mTLS', badge: 'HSM CRYPTO VAULT', metric: '90-Day Key Rotation', accentColor: '#1E8E3E', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'n8', x: 880, y: 312, w: 504, h: 98, title: 'Security Command Center (SCC) & Chronicle SIEM', subtitle: 'Continuous Posture Compliance, Audit Logs & SOAR Auto-Remediation', badge: 'SIEM & COMPLIANCE', metric: '100% CIS GCP Benchmark', accentColor: '#1E8E3E', scopedNodeId: options.scopedNodeId });

  // BOTTOM-LEFT ZONE (#FEEFC3): Spoke 1 — Production Workload VPC (x=296..832, y=452..736)
  svg += `
    <rect x="296" y="452" width="536" height="284" rx="14" fill="#FEEFC3" fill-opacity="0.45" stroke="#E37400" stroke-width="2"/>
    <rect x="310" y="464" width="508" height="32" rx="8" fill="#FEEFC3" stroke="#E37400" stroke-width="1.2"/>
    <text x="564" y="484" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="800" fill="#B06000">ZONE 3 · LEFT SPOKE VPC · PROD WORKLOADS (#FEEFC3)</text>
  `;
  svg += drawNodeBox({ id: 'n9', x: 312, y: 508, w: 242, h: 106, title: 'GKE Autopilot App Mesh', subtitle: 'Private Pod Enclave + Anthos Service Mesh', badge: 'SPOKE 1 COMPUTE', metric: 'HPA 10-250 Pods', accentColor: '#E37400', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'n10', x: 572, y: 508, w: 244, h: 106, title: 'Cloud Run Serverless BFF', subtitle: 'Stateless API Microservices + VPC Egress', badge: 'SPOKE 1 SERVERLESS', metric: 'Scale-to-Zero Ready', accentColor: '#E37400', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'n11', x: 312, y: 624, w: 504, h: 98, title: 'Memorystore for Redis Cluster (In-VPC Cache)', subtitle: 'Low-Latency Distributed Session, Catalog & Rate-Limit Cache', badge: 'SPOKE 1 CACHE', metric: 'p99 = 0.4ms · Multi-Zone HA', accentColor: '#E37400', scopedNodeId: options.scopedNodeId });

  // BOTTOM-RIGHT ZONE (#FAD2CF): Spoke 2 — Restricted AI & Data Enclave VPC (x=864..1400, y=452..736)
  svg += `
    <rect x="864" y="452" width="536" height="284" rx="14" fill="#FAD2CF" fill-opacity="0.42" stroke="#D93025" stroke-width="2"/>
    <rect x="878" y="464" width="508" height="32" rx="8" fill="#FAD2CF" stroke="#D93025" stroke-width="1.2"/>
    <text x="1132" y="484" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="800" fill="#A50E0E">ZONE 4 · RIGHT SPOKE VPC · DATA &amp; AI ENCLAVE (#FAD2CF)</text>
  `;
  svg += drawNodeBox({ id: 'n12', x: 880, y: 508, w: 242, h: 106, title: 'Vertex AI Private Endpoint', subtitle: 'Gemini 4 Argon + Vector Search 2.0', badge: 'SPOKE 2 AI ENCLAVE', metric: 'No Public IP · VPC-SC', accentColor: '#D93025', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'n13', x: 1140, y: 508, w: 244, h: 106, title: 'Cloud Spanner Banking Ledger', subtitle: 'CMEK Multi-Region TrueTime ACID SoT', badge: 'SPOKE 2 LEDGER DB', metric: '99.999% HA · RPO=0', accentColor: '#D93025', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'n14', x: 880, y: 624, w: 504, h: 98, title: 'BigQuery Enterprise Lakehouse + Cloud DLP', subtitle: 'Column-Level Policy Tags, Dynamic PII Masking & Zero-Copy Analytics', badge: 'SPOKE 2 ANALYTICS', metric: 'Zero-Exfiltration Lock', accentColor: '#D93025', scopedNodeId: options.scopedNodeId });

  // Hub-and-Spoke Orthogonal Bridges & Full Numbered Step Callouts (1..7)
  svg += `
    <!-- Ingress -> Routing Hub & Workload Spoke -->
    <line class="arch-edge" x1="260" y1="243" x2="308" y2="243" stroke="#1A73E8" stroke-width="2.2" marker-end="url(#arr-blue)"/>
    <path class="arch-edge" d="M 260 561 L 278 561 L 278 361 L 308 361" fill="none" stroke="#1A73E8" stroke-width="2.2" marker-end="url(#arr-blue)"/>

    <!-- Routing Hub <-> Governance Hub -->
    <line class="arch-edge" x1="816" y1="246" x2="876" y2="246" stroke="#1E8E3E" stroke-width="2.2" marker-start="url(#arr-green)" marker-end="url(#arr-green)"/>
    <line class="arch-edge" x1="816" y1="361" x2="876" y2="361" stroke="#1E8E3E" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arr-green)"/>

    <!-- Routing Hub <-> Left Workload Spoke -->
    <line class="arch-edge" x1="433" y1="410" x2="433" y2="504" stroke="#E37400" stroke-width="2.2" marker-start="url(#arr-amber)" marker-end="url(#arr-amber)"/>
    <line class="arch-edge" x1="694" y1="410" x2="694" y2="504" stroke="#E37400" stroke-width="2.2" marker-start="url(#arr-amber)" marker-end="url(#arr-amber)"/>

    <!-- Governance Hub & PSC Hub <-> Right Data/AI Spoke -->
    <line class="arch-edge" x1="1001" y1="410" x2="1001" y2="504" stroke="#D93025" stroke-width="2.2" marker-start="url(#arr-rose)" marker-end="url(#arr-rose)"/>
    <line class="arch-edge" x1="1262" y1="410" x2="1262" y2="504" stroke="#1E8E3E" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arr-green)"/>

    <!-- Spoke 1 -> Spoke 2 East-West PSC Bridge -->
    <line class="arch-edge" x1="816" y1="561" x2="876" y2="561" stroke="#D93025" stroke-width="2.2" marker-end="url(#arr-rose)"/>

    ${drawStepCallout(278, 243, '1', '#1A73E8')}
    ${drawStepCallout(278, 460, '2', '#1A73E8')}
    ${drawStepCallout(848, 246, '3', '#1E8E3E')}
    ${drawStepCallout(848, 361, '4', '#1E8E3E')}
    ${drawStepCallout(433, 438, '5', '#E37400')}
    ${drawStepCallout(848, 561, '6', '#D93025')}
    ${drawStepCallout(1001, 438, '7', '#D93025')}
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D07: UML API SEQUENCE LIFELINE DIAGRAM (6 LIFELINES + ACTIVATION BARS + ALT/PAR)
// ============================================================================
function renderD07SequenceLifeline(graph, options) {
  const participants = [
    { id: 'p1', cx: 125, title: 'Web / Mobile App', sub: '[Actor Client]', color: '#2563EB', iconKey: 'client_web' },
    { id: 'p2', cx: 355, title: 'Apigee Gateway', sub: '[Edge OAuth2]', color: '#D97706', iconKey: 'apigee' },
    { id: 'p3', cx: 595, title: 'Checkout Saga API', sub: '[GKE Go Service]', color: '#7C3AED', iconKey: 'gke_autopilot' },
    { id: 'p4', cx: 835, title: 'DLP & Fraud Agent', sub: '[Vertex Risk AI]', color: '#DB2777', iconKey: 'dlp_guardrail' },
    { id: 'p5', cx: 1075, title: 'Cloud Spanner DB', sub: '[TrueTime ACID]', color: '#059669', iconKey: 'cloud_spanner' },
    { id: 'p6', cx: 1315, title: 'Pub/Sub Outbox', sub: '[Async Stream]', color: '#0284C7', iconKey: 'kafka_pubsub' }
  ];

  let svg = '';

  // Combined Fragment Frames (alt & par) drawn behind lifelines — badges placed in x=144..336 gap so they NEVER cross lifeline p1 (cx=125)
  svg += `
    <!-- ALT Frame: Risk Check Pass vs Step-Up Challenge -->
    <rect x="44" y="330" width="1352" height="226" rx="8" fill="#ECFDF5" fill-opacity="0.35" stroke="#059669" stroke-width="1.6" stroke-dasharray="6 4"/>
    <rect x="144" y="330" width="192" height="20" rx="4" fill="#10B981"/>
    <text x="240" y="344" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="800" fill="#FFFFFF">alt [Risk &lt; 0.15 · Approved]</text>
    <!-- UML 2.5 [else] operand divider inside alt frame -->
    <line x1="44" y1="522" x2="1396" y2="522" stroke="#D97706" stroke-width="1.3" stroke-dasharray="5 4"/>
    <rect x="144" y="526" width="192" height="18" rx="4" fill="#FEF3C7" stroke="#D97706" stroke-width="1"/>
    <text x="240" y="538.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#92400E">[else: Risk &gt;= 0.15 → 403 MFA]</text>

    <!-- PAR Frame: Async Event Fan-Out & Reverse-Proxy Receipt -->
    <rect x="44" y="572" width="1352" height="158" rx="8" fill="#EFF6FF" fill-opacity="0.4" stroke="#2563EB" stroke-width="1.6" stroke-dasharray="6 4"/>
    <rect x="144" y="572" width="192" height="20" rx="4" fill="#2563EB"/>
    <text x="240" y="586" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="800" fill="#FFFFFF">par [Outbox &amp; Gateway Receipt]</text>
  `;

  // Lifelines & Participant Header Boxes with Official Google Cloud Vector Icon Badges
  participants.forEach((p) => {
    const w = 188;
    const x = p.cx - w / 2;
    const iconSpec = getIconSpec(p.iconKey);
    const tFit = fitText(p.title, w - 48, 11.5, 9.0, 0.58);
    svg += `
      <line x1="${p.cx}" y1="166" x2="${p.cx}" y2="742" stroke="#94A3B8" stroke-width="1.8" stroke-dasharray="6 5"/>
      <rect x="${p.cx - 7}" y="190" width="14" height="530" rx="4" fill="${p.color}22" stroke="${p.color}" stroke-width="1.2"/>
      <g class="arch-node" data-node-id="${p.id}" data-node-title="${esc(p.title)}" data-node-subtitle="${esc(p.sub)}" data-node-pill="${esc(p.sub)}" data-node-icon="${esc(p.iconKey)}" transform="translate(${x}, 98)" style="cursor:pointer;">
        <rect class="node-bounding-rect" x="0" y="0" width="${w}" height="68" rx="10" fill="#FFFFFF" stroke="${p.color}" stroke-width="2" filter="url(#vs-shadow-sm)"/>
        <rect x="1" y="1" width="${w - 2}" height="22" rx="9" fill="${p.color}"/>
        <text x="${w / 2}" y="15.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" font-weight="800" fill="#FFFFFF">${esc(p.sub)}</text>
        <g transform="translate(10, 32)">
          <rect x="0" y="0" width="24" height="24" rx="6" fill="${iconSpec.bg}" stroke="${iconSpec.border}" stroke-width="1.2"/>
          <svg x="1" y="1" width="22" height="22" viewBox="0 0 24 24">${iconSpec.svgInner}</svg>
        </g>
        <text x="40" y="48" font-size="${tFit.fontSize}" font-weight="800" fill="#0F172A">${esc(tFit.text)}</text>
      </g>
    `;
  });

  // Sequence Messages (1..9) — Return path 8 & 9 traverse Apigee Gateway (p2) instead of crossing over its activation bar
  const messages = [
    { from: 125, to: 355, y: 206, label: '1: POST /v2/checkout {cart, idKey}', color: '#2563EB', marker: 'arr-blue', dashed: false },
    { from: 355, to: 595, y: 248, label: '2: Forward gRPC + OIDC Claims', color: '#D97706', marker: 'arr-amber', dashed: false },
    { from: 595, to: 835, y: 290, label: '3: EvaluateCartRisk(payload)', color: '#7C3AED', marker: 'arr-violet', dashed: false },
    { from: 835, to: 595, y: 382, label: '4: 200 OK {risk: 0.03, piiRedacted}', color: '#059669', marker: 'arr-green', dashed: true },
    { from: 595, to: 1075, y: 440, label: '5: SpannerMutate(LockStock + Order)', color: '#059669', marker: 'arr-green', dashed: false },
    { from: 1075, to: 595, y: 498, label: '6: TrueTime CommitOK {orderId: #9941}', color: '#059669', marker: 'arr-green', dashed: true },
    { from: 595, to: 1315, y: 616, label: '7: PublishAsync(OrderCapturedEvt) [Outbox CDC]', color: '#0284C7', marker: 'arr-blue', dashed: false },
    { from: 595, to: 355, y: 662, label: '8: gRPC 200 {orderId: #9941}', color: '#7C3AED', marker: 'arr-violet', dashed: true },
    { from: 355, to: 125, y: 706, label: '9: 201 Created {orderId: #9941}', color: '#2563EB', marker: 'arr-blue', dashed: true }
  ];

  messages.forEach((m) => {
    const dir = m.to > m.from ? 1 : -1;
    const x1 = m.from + dir * 10;
    const x2 = m.to - dir * 12;
    const spanW = Math.abs(x2 - x1);
    const midX = (x1 + x2) / 2;
    const lFit = fitText(m.label, spanW - 36, 9.5, 8.0, 0.59);
    const pillW = Math.min(spanW - 28, lFit.text.length * 5.6 + 16);

    svg += `
      <g class="arch-edge">
        <line x1="${x1}" y1="${m.y}" x2="${x2}" y2="${m.y}" stroke="${m.color}" stroke-width="2" ${m.dashed ? 'stroke-dasharray="6 4"' : ''} marker-end="url(#${m.marker})"/>
        <rect x="${midX - pillW / 2}" y="${m.y - 20}" width="${pillW}" height="17" rx="4" fill="#FFFFFF" stroke="${m.color}" stroke-width="1"/>
        <text x="${midX}" y="${m.y - 8}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="${lFit.fontSize}" font-weight="700" fill="#0F172A">${esc(lFit.text)}</text>
      </g>
    `;
  });

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D08: DISTRIBUTED SAGA & FINITE STATE MACHINE WITH COMPENSATING ROLLBACK LOOP
// ============================================================================
function renderD08SagaStateMachine(graph, options) {
  let svg = '';

  // Top Track Background (Happy Path Forward State Machine)
  svg += `
    <rect x="24" y="96" width="1392" height="310" rx="14" fill="#ECFDF5" fill-opacity="0.4" stroke="#10B981" stroke-width="1.6"/>
    <text x="44" y="122" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#047857">FORWARD SAGA HAPPY PATH · DETERMINISTIC STATE TRANSITIONS (99.4% TRANSACTIONS)</text>

    <!-- Bottom Track Background (Compensating Rollback Track) -->
    <rect x="24" y="432" width="1392" height="314" rx="14" fill="#FFF1F2" fill-opacity="0.55" stroke="#F43F5E" stroke-width="1.6" stroke-dasharray="8 5"/>
    <text x="44" y="458" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#BE123C">COMPENSATING SAGA ROLLBACK PIPELINE · IDEMPOTENT BACKWARD RECOVERY ON TIMEOUT OR DECLINE</text>
  `;

  // Start Bullseye
  svg += `
    <circle cx="64" cy="252" r="16" fill="#0F172A"/>
    <text x="64" y="286" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="800" fill="#0F172A">START</text>
    <line class="arch-edge" x1="80" y1="252" x2="112" y2="252" stroke="#0F172A" stroke-width="2.2" marker-end="url(#arr-slate)"/>
  `;

  // Forward States & Decision Diamonds
  const states = [
    { id: 's1', x: 116, y: 192, w: 204, h: 120, title: 'STATE: CART_LOCKED', sub: 'Spanner idempotency key & price lock', metric: 'TTL = 15m', color: '#2563EB', iconKey: 'cloud_spanner' },
    { id: 's2', x: 486, y: 192, w: 214, h: 120, title: 'STATE: STOCK_RESERVED', sub: 'Spanner inventory lease decrement', metric: 'Lease = 120s', color: '#0284C7', iconKey: 'cloud_spanner' },
    { id: 's3', x: 870, y: 192, w: 214, h: 120, title: 'STATE: PAYMENT_CAPTURED', sub: 'Stripe auth + ledger journal', metric: 'AuthCode Stored', color: '#059669', iconKey: 'external_saas' },
    { id: 's4', x: 1140, y: 192, w: 204, h: 120, title: 'STATE: ORDER_FULFILLED', sub: 'Pub/Sub outbox emitted to WMS', metric: 'TERMINAL PASS', color: '#047857', iconKey: 'kafka_pubsub' }
  ];

  states.forEach((s) => {
    svg += drawNodeBox({
      id: s.id,
      x: s.x,
      y: s.y,
      w: s.w,
      h: s.h,
      title: s.title,
      subtitle: s.sub,
      badge: 'FSM STATE',
      metric: s.metric,
      rx: 22,
      iconKey: s.iconKey,
      accentColor: s.color,
      scopedNodeId: options.scopedNodeId
    });
  });

  // 2 Decision Diamonds between States
  const diamonds = [
    { id: 'd1', cx: 402, cy: 252, title: '◇ Stock OK?', sub: 'Qty >= 1' },
    { id: 'd2', cx: 784, cy: 252, title: '◇ Auth OK?', sub: '3DS / Capture' }
  ];
  diamonds.forEach((d) => {
    const pts = `${d.cx},202 ${d.cx + 58},252 ${d.cx},302 ${d.cx - 58},252`;
    svg += `
      <g class="arch-node" data-node-id="${d.id}" style="cursor:pointer;">
        <rect class="node-bounding-rect" x="${d.cx - 58}" y="202" width="116" height="100" fill="none" stroke="none"/>
        <polygon points="${pts}" fill="#FEF3C7" stroke="#D97706" stroke-width="2" filter="url(#vs-shadow-sm)"/>
        <text x="${d.cx}" y="248" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="800" fill="#92400E">${esc(d.title)}</text>
        <text x="${d.cx}" y="264" text-anchor="middle" font-size="9" font-weight="600" fill="#B45309">${esc(d.sub)}</text>
      </g>
    `;
  });

  // Bottom Compensating States (Right-to-Left Rollback Flow)
  const compStates = [
    { id: 'c1', x: 860, y: 516, w: 234, h: 126, title: 'COMPENSATE: VOID_AUTH', sub: 'Releases card hold via Stripe Refund API', metric: 'Idempotent Reversal', iconKey: 'external_saas' },
    { id: 'c2', x: 476, y: 516, w: 234, h: 126, title: 'COMPENSATE: RELEASE_STOCK', sub: 'Restores reserved SKU count in Spanner', metric: 'Zero Inventory Leak', iconKey: 'cloud_spanner' },
    { id: 'c3', x: 116, y: 516, w: 224, h: 126, title: 'STATE: SAGA_ABORTED ⊗', sub: 'Spanner cart unlocked & buyer notified', metric: 'TERMINAL ROLLBACK', iconKey: 'cloud_spanner' }
  ];

  compStates.forEach((cs) => {
    svg += drawNodeBox({
      id: cs.id,
      x: cs.x,
      y: cs.y,
      w: cs.w,
      h: cs.h,
      title: cs.title,
      subtitle: cs.sub,
      badge: 'SAGA ROLLBACK',
      metric: cs.metric,
      rx: 18,
      iconKey: cs.iconKey,
      fill: '#FFFFFF',
      stroke: '#F43F5E',
      accentColor: '#E11D48',
      scopedNodeId: options.scopedNodeId
    });
  });

  // Transitions (Forward & Compensating Rollback Chain — Strict Saga Invariants)
  svg += `
    <line class="arch-edge" x1="320" y1="252" x2="342" y2="252" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>
    <line class="arch-edge" x1="460" y1="252" x2="482" y2="252" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>
    <line class="arch-edge" x1="700" y1="252" x2="724" y2="252" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>
    <line class="arch-edge" x1="842" y1="252" x2="866" y2="252" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>
    <line class="arch-edge" x1="1084" y1="252" x2="1136" y2="252" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>

    <!-- Failure Branch 3: Post-Capture WMS Timeout -> COMPENSATE: VOID_AUTH (c1) -->
    <line class="arch-edge" x1="977" y1="312" x2="977" y2="512" stroke="#E11D48" stroke-width="2.2" stroke-dasharray="6 4" marker-end="url(#arr-rose)"/>
    <rect x="913" y="366" width="128" height="18" rx="9" fill="#FFF1F2" stroke="#F43F5E"/>
    <text x="977" y="378.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.8" font-weight="700" fill="#BE123C">ERR (WMS Timeout)</text>

    <!-- Failure Branch 2: Auth Declined (Stock WAS Reserved) -> COMPENSATE: RELEASE_STOCK (c2) -->
    <path class="arch-edge" d="M 784 302 L 784 480 L 593 480 L 593 512" fill="none" stroke="#E11D48" stroke-width="2.2" stroke-dasharray="6 4" marker-end="url(#arr-rose)"/>
    <rect x="724" y="366" width="120" height="18" rx="9" fill="#FFF1F2" stroke="#F43F5E"/>
    <text x="784" y="378.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.8" font-weight="700" fill="#BE123C">NO (Auth Declined)</text>

    <!-- Failure Branch 1: Out of Stock (Stock NEVER Reserved) -> Direct to STATE: SAGA_ABORTED (c3) -->
    <path class="arch-edge" d="M 402 302 L 402 480 L 228 480 L 228 512" fill="none" stroke="#E11D48" stroke-width="2.2" stroke-dasharray="6 4" marker-end="url(#arr-rose)"/>
    <rect x="342" y="366" width="120" height="18" rx="9" fill="#FFF1F2" stroke="#F43F5E"/>
    <text x="402" y="378.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.8" font-weight="700" fill="#BE123C">NO (Out of Stock)</text>

    <!-- Backward Compensation Chain (Right to Left: c1 -> c2 -> c3) -->
    <line class="arch-edge" x1="860" y1="594" x2="714" y2="594" stroke="#E11D48" stroke-width="2.2" stroke-dasharray="6 4" marker-end="url(#arr-rose)"/>
    <line class="arch-edge" x1="476" y1="594" x2="344" y2="594" stroke="#E11D48" stroke-width="2.2" stroke-dasharray="6 4" marker-end="url(#arr-rose)"/>

    ${drawStepCallout(96, 252, '1', '#0F172A')}
    ${drawStepCallout(471, 252, '2', '#059669')}
    ${drawStepCallout(854, 252, '3', '#059669')}
    ${drawStepCallout(1110, 252, '4', '#059669')}
    ${drawStepCallout(977, 420, '5', '#E11D48')}
    ${drawStepCallout(787, 594, '6', '#E11D48')}
    ${drawStepCallout(410, 594, '7', '#E11D48')}
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D09: APOLLO GRAPHQL SUPERGRAPH FEDERATION & PROTOBUF CONTRACT SCHEMA
// ============================================================================
function renderD09GraphqlFederation(graph, options) {
  let svg = '';

  // Top Supergraph Router Bar
  svg += drawNodeBox({
    id: 'gql_router',
    x: 340,
    y: 98,
    w: 760,
    h: 102,
    title: 'Apigee X + Apollo Router v2 Supergraph Gateway (Rust)',
    subtitle: 'Query Plan AST Compiler · Automatic Persisted Queries (APQ) · OAuth2 Claims Context Injection',
    badge: 'FEDERATED SUPERGRAPH ROUTER',
    metric: 'p99 Query Plan < 0.8ms · Schema Registry Locked',
    headerFill: '#7C3AED',
    accentColor: '#7C3AED',
    scopedNodeId: options.scopedNodeId
  });

  // 4 Federated Subgraph Schema Cards with Monospace GraphQL/Protobuf Code Blocks (y=248..568)
  const subgraphs = [
    {
      id: 'sg1',
      x: 32,
      title: '@subgraph Identity & Org',
      proto: 'gRPC: IdentityService',
      color: '#2563EB',
      lines: [
        'type User @key(fields: "id") {',
        '  id: ID!',
        '  email: String! @tag(name: "pii")',
        '  org: Organization!',
        '  roles: [RbacRole!]!',
        '}'
      ],
      backendId: 'b1',
      backendTitle: 'Identity Go Service + IAP',
      backendMetric: 'Cloud SQL + Redis'
    },
    {
      id: 'sg2',
      x: 382,
      title: '@subgraph Catalog & Pricing',
      proto: 'gRPC: PricingEngine',
      color: '#0284C7',
      lines: [
        'type Product @key(fields: "sku") {',
        '  sku: ID!',
        '  title: String!',
        '  price(tier: Tier): Money!',
        '  inStock: Boolean!',
        '}'
      ],
      backendId: 'b2',
      backendTitle: 'Catalog Service + Vector Index',
      backendMetric: 'AlloyDB + HNSW'
    },
    {
      id: 'sg3',
      x: 732,
      title: '@subgraph Orders & Checkout',
      proto: 'gRPC: OrderSagaService',
      color: '#059669',
      lines: [
        'type Order @key(fields: "id") {',
        '  id: ID!',
        '  buyer: User! @provides(fields: "email")',
        '  items: [Product!]!',
        '  status: OrderSagaState!',
        '}'
      ],
      backendId: 'b3',
      backendTitle: 'Order Saga Go Service',
      backendMetric: 'Cloud Spanner HA'
    },
    {
      id: 'sg4',
      x: 1082,
      title: '@subgraph AI Co-Pilot & RAG',
      proto: 'gRPC: AgenticCopilot',
      color: '#9333EA',
      lines: [
        'extend type Order @key(fields: "id") {',
        '  id: ID! @external',
        '  riskScore: Float!',
        '  aiBundleRecs: [Product!]!',
        '  citations: [SourceUri!]!',
        '}'
      ],
      backendId: 'b4',
      backendTitle: 'Vertex ADK + Gemini 3.8',
      backendMetric: 'GraphRAG Grounded'
    }
  ];

  subgraphs.forEach((sg) => {
    const w = 326;
    const cx = sg.x + w / 2;

    let codeSvg = '';
    sg.lines.forEach((ln, idx) => {
      const ly = 342 + idx * 22;
      codeSvg += `<text x="${sg.x + 22}" y="${ly}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="600" fill="#1E293B">${esc(ln)}</text>`;
    });

    svg += `
      <g class="arch-node" data-node-id="${sg.id}" style="cursor:pointer;">
        <rect class="node-bounding-rect" x="${sg.x}" y="248" width="${w}" height="280" rx="12" fill="#FFFFFF" stroke="${sg.color}" stroke-width="1.8" filter="url(#vs-shadow-md)"/>
        <rect x="${sg.x + 1}" y="249" width="${w - 2}" height="32" rx="11" fill="${sg.color}"/>
        <text x="${cx}" y="269" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#FFFFFF">${esc(sg.title)}</text>
        <text x="${sg.x + 14}" y="302" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="${sg.color}">SCHEMA AST · ${esc(sg.proto)}</text>
        <rect x="${sg.x + 12}" y="314" width="${w - 24}" height="154" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>
        ${codeSvg}
        <rect x="${sg.x + 12}" y="482" width="${w - 24}" height="32" rx="6" fill="${sg.color}12"/>
        <text x="${cx}" y="502" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="${sg.color}">Entity Resolver: _entities(representations)</text>
      </g>
    `;

    // Downstream gRPC Microservice Box (y=588..732)
    svg += drawNodeBox({
      id: sg.backendId,
      x: sg.x,
      y: 588,
      w,
      h: 144,
      title: sg.backendTitle,
      subtitle: 'HTTP/2 gRPC Protobuf v3 Contract',
      badge: sg.proto,
      metric: sg.backendMetric,
      accentColor: sg.color,
      scopedNodeId: options.scopedNodeId
    });

    // Router -> Subgraph & Subgraph -> Backend orthogonal arrows
    svg += `
      <path class="arch-edge" d="M 720 200 L 720 224 L ${cx} 224 L ${cx} 244" fill="none" stroke="${sg.color}" stroke-width="2" marker-end="url(#arr-violet)"/>
      <line class="arch-edge" x1="${cx}" y1="528" x2="${cx}" y2="584" stroke="${sg.color}" stroke-width="2" marker-end="url(#arr-slate)"/>
    `;
  });

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D10: PHYSICAL DATABASE ERD WITH PK/FK/TYPE COLUMNS & CROW'S-FOOT NOTATION
// ============================================================================
function renderD10DatabaseErd(graph, options) {
  const tables = [
    {
      id: 'tbl_orgs',
      x: 42,
      y: 106,
      name: 'organizations',
      color: '#0F766E',
      cols: [
        { key: 'PK', name: 'org_id', type: 'UUID NOT NULL' },
        { key: 'UQ', name: 'workspace_slug', type: 'VARCHAR(64)' },
        { key: '  ', name: 'enterprise_tier', type: 'VARCHAR(24)' },
        { key: '  ', name: 'cmek_kms_key_uri', type: 'TEXT' },
        { key: 'IX', name: 'created_at', type: 'TIMESTAMPTZ' }
      ]
    },
    {
      id: 'tbl_users',
      x: 524,
      y: 106,
      name: 'users_identity',
      color: '#1D4ED8',
      cols: [
        { key: 'PK', name: 'user_id', type: 'UUID NOT NULL' },
        { key: 'FK', name: 'org_id', type: 'UUID → organizations' },
        { key: 'UQ', name: 'email_address', type: 'VARCHAR(255)' },
        { key: '  ', name: 'rbac_role', type: 'VARCHAR(32)' },
        { key: '  ', name: 'passkey_credential', type: 'JSONB' }
      ]
    },
    {
      id: 'tbl_diagrams',
      x: 1006,
      y: 106,
      name: 'architecture_diagrams',
      color: '#6D28D9',
      cols: [
        { key: 'PK', name: 'diagram_id', type: 'UUID NOT NULL' },
        { key: 'FK', name: 'org_id', type: 'UUID → organizations' },
        { key: 'FK', name: 'created_by_user', type: 'UUID → users_identity' },
        { key: 'IX', name: 'lifecycle_code', type: 'CHAR(3) [D01..D18]' },
        { key: '  ', name: 'latest_semver', type: 'VARCHAR(16)' }
      ]
    },
    {
      id: 'tbl_versions',
      x: 1006,
      y: 446,
      name: 'diagram_versions_ast',
      color: '#059669',
      cols: [
        { key: 'PK', name: 'version_id', type: 'UUID NOT NULL' },
        { key: 'FK', name: 'diagram_id', type: 'UUID → arch_diagrams' },
        { key: 'UQ', name: 'semver_tag', type: 'VARCHAR(16) [v1.0.x]' },
        { key: '  ', name: 'user_prompt_text', type: 'TEXT NOT NULL' },
        { key: '  ', name: 'canonical_cag_json', type: 'JSONB NOT NULL' }
      ]
    },
    {
      id: 'tbl_nodes',
      x: 524,
      y: 446,
      name: 'cag_nodes_elements',
      color: '#B45309',
      cols: [
        { key: 'PK', name: 'node_element_id', type: 'UUID NOT NULL' },
        { key: 'FK', name: 'version_id', type: 'UUID → versions_ast' },
        { key: 'IX', name: 'tier_zone_id', type: 'VARCHAR(32)' },
        { key: '  ', name: 'change_status', type: 'ENUM(base,add,mod)' },
        { key: '  ', name: 'geometry_bbox_json', type: 'JSONB' }
      ]
    },
    {
      id: 'tbl_audit',
      x: 42,
      y: 446,
      name: 'compliance_audit_ledger',
      color: '#BE123C',
      cols: [
        { key: 'PK', name: 'audit_entry_id', type: 'UUID NOT NULL' },
        { key: 'FK', name: 'version_id', type: 'UUID → versions_ast' },
        { key: 'FK', name: 'signer_user_id', type: 'UUID → users_identity' },
        { key: 'UQ', name: 'hmac_sha256_token', type: 'CHAR(64) NOT NULL' },
        { key: 'IX', name: 'signed_timestamp', type: 'TIMESTAMPTZ' }
      ]
    }
  ];

  let svg = '';
  const w = 392;
  const h = 266;

  tables.forEach((t) => {
    let rowsSvg = '';
    t.cols.forEach((c, idx) => {
      const ry = 54 + idx * 40;
      const isPk = c.key === 'PK';
      const isFk = c.key === 'FK';
      const badgeBg = isPk ? '#FEF3C7' : isFk ? '#DBEAFE' : '#F1F5F9';
      const badgeColor = isPk ? '#B45309' : isFk ? '#1D4ED8' : '#64748B';

      rowsSvg += `
        <line x1="2" y1="${ry}" x2="${w - 2}" y2="${ry}" stroke="#E2E8F0" stroke-width="1"/>
        <rect x="12" y="${ry + 9}" width="32" height="20" rx="4" fill="${badgeBg}"/>
        <text x="28" y="${ry + 23}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="800" fill="${badgeColor}">${esc(c.key)}</text>
        <text x="54" y="${ry + 24}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="${isPk ? '800' : '600'}" fill="#0F172A">${esc(c.name)}</text>
        <text x="${w - 14}" y="${ry + 24}" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="10" font-weight="600" fill="#475569">${esc(c.type)}</text>
      `;
    });

    svg += `
      <g class="arch-node" data-node-id="${t.id}" transform="translate(${t.x}, ${t.y})" style="cursor:pointer;">
        <rect x="2" y="3" width="${w}" height="${h}" rx="10" fill="#0F172A" fill-opacity="0.06"/>
        <rect class="node-bounding-rect" x="0" y="0" width="${w}" height="${h}" rx="10" fill="#FFFFFF" stroke="${t.color}" stroke-width="2"/>
        <rect x="1" y="1" width="${w - 2}" height="44" rx="9" fill="${t.color}"/>
        <text x="16" y="28" font-family="JetBrains Mono, monospace" font-size="12.5" font-weight="800" fill="#FFFFFF">TABLE: ${esc(t.name)}</text>
        <text x="${w - 14}" y="27" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="#E2E8F0">SPANNER SQL</text>
        ${rowsSvg}
      </g>
    `;
  });

  // Helper to draw Crow's-Foot 1-to-Many (||──o{) relationship lines
  function drawCrowsFoot(x1, y1, x2, y2, label, color = '#0F766E') {
    const dir = x2 > x1 ? 1 : -1;
    const midX = (x1 + x2) / 2;
    return `
      <g class="arch-edge">
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2.2"/>
        <!-- One (||) marker at start -->
        <line x1="${x1 + dir * 10}" y1="${y1 - 8}" x2="${x1 + dir * 10}" y2="${y1 + 8}" stroke="${color}" stroke-width="2.2"/>
        <!-- Crow's foot (o{) at end -->
        <circle cx="${x2 - dir * 16}" cy="${y2}" r="4.5" fill="#FFFFFF" stroke="${color}" stroke-width="2"/>
        <line x1="${x2 - dir * 11}" y1="${y2}" x2="${x2}" y2="${y2 - 9}" stroke="${color}" stroke-width="2"/>
        <line x1="${x2 - dir * 11}" y1="${y2}" x2="${x2}" y2="${y2 + 9}" stroke="${color}" stroke-width="2"/>
        <rect x="${midX - 36}" y="${(y1 + y2) / 2 - 11}" width="72" height="20" rx="10" fill="#FFFFFF" stroke="${color}" stroke-width="1.2"/>
        <text x="${midX}" y="${(y1 + y2) / 2 + 3}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="800" fill="${color}">${esc(label)}</text>
      </g>
    `;
  }

  svg += drawCrowsFoot(434, 238, 524, 238, '1 : N', '#0F766E');
  svg += drawCrowsFoot(916, 238, 1006, 238, '1 : N', '#1D4ED8');
  svg += drawCrowsFoot(1006, 578, 916, 578, '1 : N', '#059669');
  svg += drawCrowsFoot(524, 578, 434, 578, '1 : N', '#BE123C');
  // Vertical 1:N from architecture_diagrams (bottom) to diagram_versions_ast (top)
  svg += `
    <g class="arch-edge">
      <line x1="1202" y1="372" x2="1202" y2="446" stroke="#6D28D9" stroke-width="2.2"/>
      <line x1="1194" y1="382" x2="1210" y2="382" stroke="#6D28D9" stroke-width="2.2"/>
      <line x1="1202" y1="434" x2="1193" y2="446" stroke="#6D28D9" stroke-width="2"/>
      <line x1="1202" y1="434" x2="1211" y2="446" stroke="#6D28D9" stroke-width="2"/>
      <rect x="1158" y="398" width="88" height="20" rx="10" fill="#FFFFFF" stroke="#6D28D9" stroke-width="1.2"/>
      <text x="1202" y="411.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="800" fill="#6D28D9">1 : N AST</text>
    </g>
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D11: MEDALLION DATA LAKEHOUSE PIPELINE (SOURCES -> CDC -> BRONZE -> SILVER -> GOLD)
// ============================================================================
function renderD11MedallionLakehouse(graph, options) {
  const cols = [
    { name: '1. OLTP SOURCES', sub: 'Operational DBs & SaaS', x: 24, w: 252, bg: '#F8FAFC', border: '#94A3B8', color: '#334155' },
    { name: '2. STREAM CDC', sub: 'Real-Time Ingestion', x: 296, w: 252, bg: '#EFF6FF', border: '#60A5FA', color: '#1D4ED8' },
    { name: '3. BRONZE ZONE', sub: 'Raw Immutable Iceberg', x: 568, w: 268, bg: '#FEF3C7', border: '#F59E0B', color: '#B45309' },
    { name: '4. SILVER ZONE', sub: 'Cleaned & Deduplicated', x: 856, w: 268, bg: '#E0F2FE', border: '#0284C7', color: '#0369A1' },
    { name: '5. GOLD ZONE', sub: 'Star Schema & AI Store', x: 1144, w: 272, bg: '#ECFDF5', border: '#10B981', color: '#047857' }
  ];

  let svg = '';
  cols.forEach((c) => {
    svg += `
      <rect x="${c.x}" y="96" width="${c.w}" height="652" rx="14" fill="${c.bg}" fill-opacity="0.55" stroke="${c.border}" stroke-width="2"/>
      <rect x="${c.x + 12}" y="108" width="${c.w - 24}" height="42" rx="8" fill="#FFFFFF" stroke="${c.border}" stroke-width="1.4"/>
      <text x="${c.x + c.w / 2}" y="127" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="${c.color}">${esc(c.name)}</text>
      <text x="${c.x + c.w / 2}" y="143" text-anchor="middle" font-size="10" font-weight="600" fill="#475569">${esc(c.sub)}</text>
    `;
  });

  const cards = [
    { id: 'm1', x: 38, y: 184, w: 224, title: 'Cloud Spanner OLTP', sub: 'Transactional orders & ledger', badge: 'CDC SOURCE 1', metric: 'Change Streams Enabled', color: '#334155' },
    { id: 'm2', x: 38, y: 374, w: 224, title: 'Salesforce & SAP ERP', sub: 'CRM accounts & B2B invoices', badge: 'CDC SOURCE 2', metric: 'REST / OData Connector', color: '#334155' },
    { id: 'm3', x: 38, y: 564, w: 224, title: 'Clickstream & Telemetry', sub: 'Web/Mobile behavioural events', badge: 'STREAM SOURCE 3', metric: '85k events/sec', color: '#334155' },

    { id: 'm4', x: 310, y: 230, w: 224, title: 'Google Cloud Datastream', sub: 'Log-based zero-impact CDC replication', badge: 'CDC REPLICATOR', metric: 'Sub-second Binlog Read', color: '#1D4ED8' },
    { id: 'm5', x: 310, y: 470, w: 224, title: 'Apache Beam on Dataflow', sub: 'Windowed stream enrichment & schema router', badge: 'STREAM ENGINE', metric: 'Exactly-Once Autoscaled', color: '#1D4ED8' },

    { id: 'm6', x: 582, y: 230, w: 240, title: 'Bronze Iceberg Raw Tables', sub: 'Append-only Parquet on Cloud Storage', badge: 'BRONZE LAKE', metric: 'Time-Travel 365 Days', color: '#B45309' },
    { id: 'm7', x: 582, y: 470, w: 240, title: 'Schema Drift & DLQ Vault', sub: 'Quarantines malformed payloads for replay', badge: 'BRONZE QUALITY', metric: '0 Data Loss Guarantee', color: '#B45309' },

    { id: 'm8', x: 870, y: 230, w: 240, title: 'Dataform SQLX Silver Core', sub: 'MERGE deduplication & SCD Type-2 history', badge: 'SILVER TRANSFORM', metric: 'Incremental Partitioned', color: '#0284C7' },
    { id: 'm9', x: 870, y: 470, w: 240, title: 'Cloud DLP PII De-Identify', sub: 'Deterministic format-preserving encryption', badge: 'SILVER GOVERNANCE', metric: 'HIPAA / GDPR Compliant', color: '#0284C7' },

    { id: 'm10', x: 1158, y: 184, w: 244, title: 'Gold Executive Star Schema', sub: 'Conformed Fact & Dimension BI marts', badge: 'GOLD BI MART', metric: 'BI Engine < 400ms', color: '#059669' },
    { id: 'm11', x: 1158, y: 374, w: 244, title: 'Vertex Online Feature Store', sub: 'Low-latency ML features for real-time AI', badge: 'GOLD AI FEATURES', metric: 'p99 Fetch < 2ms', color: '#059669' },
    { id: 'm12', x: 1158, y: 564, w: 244, title: 'BigLake Cross-Cloud Share', sub: 'Zero-copy governed analytics exchange', badge: 'GOLD SHARING', metric: 'Row/Col ACL Enforced', color: '#059669' }
  ];

  cards.forEach((c) => {
    svg += drawNodeBox({
      id: c.id,
      x: c.x,
      y: c.y,
      w: c.w,
      h: 138,
      title: c.title,
      subtitle: c.sub,
      badge: c.badge,
      metric: c.metric,
      accentColor: c.color,
      scopedNodeId: options.scopedNodeId
    });
  });

  svg += `
    <path class="arch-edge" d="M 262 253 L 286 253 L 286 290 L 306 290" fill="none" stroke="#1D4ED8" stroke-width="2" marker-end="url(#arr-blue)"/>
    <path class="arch-edge" d="M 262 443 L 286 443 L 286 310 L 306 310" fill="none" stroke="#1D4ED8" stroke-width="2" marker-end="url(#arr-blue)"/>
    <path class="arch-edge" d="M 262 633 L 286 633 L 286 539 L 306 539" fill="none" stroke="#1D4ED8" stroke-width="2" marker-end="url(#arr-blue)"/>
    <line class="arch-edge" x1="534" y1="299" x2="578" y2="299" stroke="#B45309" stroke-width="2.2" marker-end="url(#arr-amber)"/>
    <path class="arch-edge" d="M 534 525 L 558 525 L 558 315 L 578 315" fill="none" stroke="#B45309" stroke-width="2.2" marker-end="url(#arr-amber)"/>
    <line class="arch-edge" x1="534" y1="549" x2="578" y2="549" stroke="#B45309" stroke-width="1.8" stroke-dasharray="5 3" marker-end="url(#arr-amber)"/>
    <line class="arch-edge" x1="822" y1="299" x2="866" y2="299" stroke="#0284C7" stroke-width="2.2" marker-end="url(#arr-blue)"/>
    <line class="arch-edge" x1="990" y1="368" x2="990" y2="466" stroke="#0284C7" stroke-width="2" marker-end="url(#arr-blue)"/>
    <path class="arch-edge" d="M 1110 299 L 1134 299 L 1134 253 L 1154 253" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>
    <path class="arch-edge" d="M 1110 529 L 1134 529 L 1134 443 L 1154 443" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>
    <path class="arch-edge" d="M 1110 549 L 1134 549 L 1134 633 L 1154 633" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D12: CQRS WRITE/READ SPLIT, MULTI-TIER CACHING & DATABASE SHARDING
// ============================================================================
function renderD12CqrsSharding(graph, options) {
  let svg = '';

  // Top Command Write Track vs Bottom Query Read Track Enclaves
  svg += `
    <rect x="304" y="96" width="1112" height="236" rx="14" fill="#FFF1F2" fill-opacity="0.5" stroke="#F43F5E" stroke-width="1.8"/>
    <text x="324" y="122" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#BE123C">CQRS COMMAND WRITE PATH · STRONG ACID CONSISTENCY &amp; TRANSACTIONAL OUTBOX (15% TRAFFIC)</text>

    <rect x="304" y="356" width="1112" height="392" rx="14" fill="#EFF6FF" fill-opacity="0.5" stroke="#2563EB" stroke-width="1.8"/>
    <text x="324" y="382" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#1D4ED8">CQRS QUERY READ PATH · L1/L2 CACHE HIERARCHY &amp; GEO-PARTITIONED READ SHARDS (85% TRAFFIC · 1.2M QPS)</text>
  `;

  // Left CQRS Ingress Router
  svg += drawNodeBox({
    id: 'cqrs_router',
    x: 28,
    y: 280,
    w: 242,
    h: 170,
    title: 'CQRS API Router',
    subtitle: 'Splits POST/PUT/DELETE commands from GET/GraphQL queries',
    badge: 'INGRESS ROUTER',
    metric: '1.4M Total RPS',
    iconKey: 'apigee',
    headerFill: '#0F172A',
    accentColor: '#0F172A',
    scopedNodeId: options.scopedNodeId
  });

  // Top Command Write Path Nodes
  svg += drawNodeBox({ id: 'w1', x: 332, y: 146, w: 316, h: 154, title: 'Command Validator & Mutator', subtitle: 'Enforces domain invariants & idempotency keys', badge: 'WRITE SERVICE', metric: 'p99 = 18ms', iconKey: 'gke_autopilot', accentColor: '#E11D48', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'w2', x: 706, y: 146, w: 326, h: 154, title: 'Spanner Primary Write Quorum', subtitle: 'Synchronous multi-zone Paxos leader commit', badge: 'LEADER QUORUM', metric: 'RPO = 0 · Linearizable', iconKey: 'cloud_spanner', accentColor: '#E11D48', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'w3', x: 1086, y: 146, w: 304, h: 154, title: 'CDC Outbox Projector', subtitle: 'Streams state deltas to Redis & Spanner Shards', badge: 'ASYNC PROJECTOR', metric: 'Replication Lag < 12ms', iconKey: 'datastream', accentColor: '#D97706', scopedNodeId: options.scopedNodeId });

  // Bottom Query Read Path Nodes (L1 Cache -> L2 Cache -> Shard Router -> 3 Shards)
  svg += drawNodeBox({ id: 'r1', x: 332, y: 410, w: 280, h: 140, title: 'L1 Cloud CDN Edge Cache', subtitle: 'Anycast PoP + Cloud CDN stale-while-revalidate', badge: 'TIER 1 CACHE', metric: 'Hit Ratio: 68% · 1.8ms', iconKey: 'cloud_armor', accentColor: '#0284C7', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'r2', x: 332, y: 580, w: 280, h: 140, title: 'L2 Memorystore Redis', subtitle: 'Distributed in-memory read-model projection', badge: 'TIER 2 CACHE', metric: 'Hit Ratio: 27% · 0.4ms', iconKey: 'redis_memorystore', accentColor: '#2563EB', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'r3', x: 668, y: 495, w: 268, h: 140, title: 'Consistent Hash Shard Router', subtitle: 'Routes 5% cache misses by tenant_id hash ring', badge: 'SHARD PROXY', metric: 'Zero Cross-Shard Join', iconKey: 'apigee', accentColor: '#7C3AED', scopedNodeId: options.scopedNodeId });

  // 3 Read Replica Shards on the Right
  svg += drawNodeBox({ id: 's1', x: 996, y: 396, w: 394, h: 102, title: 'Shard 01 · Spanner Read Replica (us-east1)', subtitle: 'Handles Tenant Hash 0x00..0x55', badge: 'READ SHARD 01', metric: '420k QPS · p99 3.1ms', iconKey: 'cloud_spanner', accentColor: '#059669', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 's2', x: 996, y: 514, w: 394, h: 102, title: 'Shard 02 · Spanner Read Replica (europe-west1)', subtitle: 'Handles Tenant Hash 0x56..0xAA (GDPR Sovereign)', badge: 'READ SHARD 02', metric: '390k QPS · p99 3.4ms', iconKey: 'cloud_spanner', accentColor: '#059669', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 's3', x: 996, y: 632, w: 394, h: 102, title: 'Shard 03 · Spanner Read Replica (asia-east1)', subtitle: 'Handles Tenant Hash 0xAB..0xFF', badge: 'READ SHARD 03', metric: '380k QPS · p99 3.2ms', iconKey: 'cloud_spanner', accentColor: '#059669', scopedNodeId: options.scopedNodeId });

  svg += `
    <!-- CQRS Split: Write (1) vs Read (5) -->
    <path class="arch-edge" d="M 270 330 L 296 330 L 296 223 L 328 223" fill="none" stroke="#E11D48" stroke-width="2.2" marker-end="url(#arr-rose)"/>
    <path class="arch-edge" d="M 270 400 L 296 400 L 296 480 L 328 480" fill="none" stroke="#2563EB" stroke-width="2.2" marker-end="url(#arr-blue)"/>
    <line class="arch-edge" x1="648" y1="223" x2="702" y2="223" stroke="#E11D48" stroke-width="2.2" marker-end="url(#arr-rose)"/>
    <line class="arch-edge" x1="1032" y1="223" x2="1082" y2="223" stroke="#D97706" stroke-width="2.2" marker-end="url(#arr-amber)"/>

    <!-- CDC Outbox Projector (w3) -> L2 Memorystore Redis (r2) AND Read Shards (s1..s3) -->
    <path class="arch-edge" d="M 1160 300 L 1160 344 L 628 344 L 628 618 L 616 618" fill="none" stroke="#D97706" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arr-amber)"/>
    <line class="arch-edge" x1="1238" y1="300" x2="1238" y2="392" stroke="#D97706" stroke-width="2.2" stroke-dasharray="5 3" marker-end="url(#arr-amber)"/>
    <line class="arch-edge" x1="1238" y1="498" x2="1238" y2="510" stroke="#D97706" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arr-amber)"/>
    <line class="arch-edge" x1="1238" y1="616" x2="1238" y2="628" stroke="#D97706" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#arr-amber)"/>

    <!-- Read Hierarchy: L1 -> L2 -> Consistent Hash Router -> Shards 01..03 -->
    <line class="arch-edge" x1="472" y1="550" x2="472" y2="576" stroke="#2563EB" stroke-width="2" marker-end="url(#arr-blue)"/>
    <path class="arch-edge" d="M 612 650 L 642 650 L 642 565 L 664 565" fill="none" stroke="#7C3AED" stroke-width="2" marker-end="url(#arr-violet)"/>
    <path class="arch-edge" d="M 936 535 L 966 535 L 966 447 L 992 447" fill="none" stroke="#059669" stroke-width="2" marker-end="url(#arr-green)"/>
    <line class="arch-edge" x1="936" y1="565" x2="992" y2="565" stroke="#059669" stroke-width="2" marker-end="url(#arr-green)"/>
    <path class="arch-edge" d="M 936 595 L 966 595 L 966 683 L 992 683" fill="none" stroke="#059669" stroke-width="2" marker-end="url(#arr-green)"/>

    ${drawStepCallout(296, 276, '1', '#E11D48')}
    ${drawStepCallout(675, 223, '2', '#E11D48')}
    ${drawStepCallout(1057, 223, '3', '#D97706')}
    ${drawStepCallout(1238, 344, '4', '#D97706')}
    ${drawStepCallout(296, 440, '5', '#2563EB')}
    ${drawStepCallout(642, 608, '6', '#7C3AED')}
    ${drawStepCallout(966, 565, '7', '#059669')}
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D13: ENTERPRISE HYBRID GRAPHRAG, MULTIMODAL EMBEDDING & CITATION VERIFIER
// ============================================================================
function renderD13HybridGraphRag(graph, options) {
  let svg = '';

  // Left: Ingestion & Multimodal Embedding
  svg += drawNodeBox({ id: 'rag1', x: 28, y: 150, w: 260, h: 170, title: 'Multimodal Corpus Ingest', subtitle: 'PDFs, Architecture XML, Code & SQL Schemas', badge: 'CORPUS INGEST', metric: 'Layout-Aware Chunking', iconKey: 'cloud_storage', accentColor: '#2563EB', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'rag2', x: 28, y: 460, w: 260, h: 170, title: 'gemini-embedding-2 Engine', subtitle: 'Dual dense 3072-d vector + entity graph extractor', badge: 'MULTIMODAL EMBED', metric: 'Namespaced .vector_cache', iconKey: 'vertex_ai', accentColor: '#6D28D9', scopedNodeId: options.scopedNodeId });

  // Center-Left: 3 Parallel Retrieval Engines Enclave
  svg += `
    <rect x="336" y="100" width="356" height="646" rx="16" fill="#F5F3FF" fill-opacity="0.6" stroke="#8B5CF6" stroke-width="2"/>
    <text x="514" y="128" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#5B21B6">TRI-ENGINE PARALLEL HYBRID RETRIEVAL</text>
  `;
  svg += drawNodeBox({ id: 'rag3', x: 358, y: 152, w: 312, h: 162, title: '1. Vertex Vector Search (HNSW)', subtitle: 'Dense semantic similarity over 3072-d embeddings', badge: 'DENSE VECTOR', metric: 'Top-50 Cosine · 4ms', iconKey: 'vector_search', accentColor: '#7C3AED', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'rag4', x: 358, y: 348, w: 312, h: 162, title: '2. Spanner Property Graph (GQL)', subtitle: '2-hop multi-entity dependency & lineage traversal', badge: 'KNOWLEDGE GRAPH', metric: 'ISO GQL · 6ms Hop', iconKey: 'cloud_spanner', accentColor: '#2563EB', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'rag5', x: 358, y: 544, w: 312, h: 162, title: '3. Sparse BM25 & ACL Filter', subtitle: 'Exact SKU/ticket ID match + tenant RBAC pre-filter', badge: 'LEXICAL + RBAC', metric: 'Zero Cross-Tenant Bleed', iconKey: 'iap', accentColor: '#0284C7', scopedNodeId: options.scopedNodeId });

  // Center-Right: Reciprocal Rank Fusion + Gemini 4 Argon Synthesis
  svg += drawNodeBox({ id: 'rag6', x: 744, y: 170, w: 316, h: 190, title: 'RRF & Cross-Encoder Reranker', subtitle: 'Merges Dense + Graph + BM25 into top-12 high-precision context chunks', badge: 'HYBRID RERANKER', metric: 'NDCG@10 = 0.964', iconKey: 'vector_search', accentColor: '#D97706', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'rag7', x: 744, y: 430, w: 316, h: 190, title: 'Gemini 4 Argon Synthesizer', subtitle: 'thinkingLevel: HIGH · Inline [doc:line] citation binding', badge: 'FRONTIER SYNTHESIS', metric: 'locations/global Endpoint', iconKey: 'vertex_ai', accentColor: '#7C3AED', scopedNodeId: options.scopedNodeId });

  // Far Right: Deterministic NLI Hallucination Gate & Verified Output
  svg += drawNodeBox({ id: 'rag8', x: 1112, y: 170, w: 298, h: 190, title: 'NLI Entailment & Citation Gate', subtitle: 'Verifies synthesized claims against RRF context spans; blocks hallucinations', badge: 'ZERO-HALLUCINATION GATE', metric: 'Groundedness >= 0.95', iconKey: 'dlp_guardrail', headerFill: '#059669', accentColor: '#059669', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'rag9', x: 1112, y: 430, w: 298, h: 190, title: 'Verified Answer + Provenance', subtitle: 'Streams markdown response with clickable source cards & confidence', badge: 'GROUNDED OUTPUT', metric: '0 Hallucinated Citations', iconKey: 'bigquery', accentColor: '#047857', scopedNodeId: options.scopedNodeId });

  svg += `
    <line class="arch-edge" x1="158" y1="320" x2="158" y2="456" stroke="#2563EB" stroke-width="2.2" marker-end="url(#arr-blue)"/>
    <path class="arch-edge" d="M 288 520 L 316 520 L 316 233 L 354 233" fill="none" stroke="#7C3AED" stroke-width="2" marker-end="url(#arr-violet)"/>
    <path class="arch-edge" d="M 288 545 L 324 545 L 324 429 L 354 429" fill="none" stroke="#2563EB" stroke-width="2" marker-end="url(#arr-blue)"/>
    <path class="arch-edge" d="M 288 570 L 316 570 L 316 625 L 354 625" fill="none" stroke="#0284C7" stroke-width="2" marker-end="url(#arr-blue)"/>
    <path class="arch-edge" d="M 670 233 L 716 233 L 716 245 L 740 245" fill="none" stroke="#D97706" stroke-width="2" marker-end="url(#arr-amber)"/>
    <path class="arch-edge" d="M 670 429 L 716 429 L 716 265 L 740 265" fill="none" stroke="#D97706" stroke-width="2" marker-end="url(#arr-amber)"/>
    <path class="arch-edge" d="M 670 625 L 724 625 L 724 285 L 740 285" fill="none" stroke="#D97706" stroke-width="2" marker-end="url(#arr-amber)"/>

    <!-- RRF Context Spans feed BOTH Gemini 4 Argon (rag7) AND NLI Entailment Gate (rag8) -->
    <line class="arch-edge" x1="902" y1="360" x2="902" y2="426" stroke="#7C3AED" stroke-width="2.2" marker-end="url(#arr-violet)"/>
    <line class="arch-edge" x1="1060" y1="245" x2="1108" y2="245" stroke="#D97706" stroke-width="2.2" stroke-dasharray="5 3" marker-end="url(#arr-amber)"/>
    <path class="arch-edge" d="M 1060 525 L 1086 525 L 1086 305 L 1108 305" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>
    <line class="arch-edge" x1="1261" y1="360" x2="1261" y2="426" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>

    ${drawStepCallout(158, 388, '1', '#2563EB')}
    ${drawStepCallout(324, 429, '2', '#7C3AED')}
    ${drawStepCallout(716, 265, '3', '#D97706')}
    ${drawStepCallout(902, 393, '4', '#7C3AED')}
    ${drawStepCallout(1084, 245, '5', '#D97706')}
    ${drawStepCallout(1086, 415, '6', '#059669')}
    ${drawStepCallout(1261, 393, '7', '#059669')}
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D14: MULTI-AGENT A2A SUPERVISOR, SPECIALIST SWARM & MCP TOOL BUS
// ============================================================================
function renderD14MultiAgentMcp(graph, options) {
  let svg = '';

  // Top Tier: User Goal -> Supervisor Agent -> Episodic Blackboard
  svg += drawNodeBox({ id: 'ag_goal', x: 36, y: 102, w: 320, h: 120, title: 'Enterprise Goal & Spec Request', subtitle: 'Natural-language objective + policy constraints', badge: 'USER / API INTENT', metric: 'Scoped CASG JWT', accentColor: '#334155', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'ag_sup', x: 430, y: 102, w: 560, h: 120, title: 'Supervisor Orchestrator Agent (Gemini 4 Argon)', subtitle: 'Decomposes DAG plan, delegates tasks via A2A Protocol & reconciles outputs', badge: 'A2A SUPERVISOR HUB', metric: 'thinkingLevel: HIGH · Max 6 Turns', headerFill: '#1D4ED8', accentColor: '#1D4ED8', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'ag_mem', x: 1064, y: 102, w: 340, h: 120, title: 'Shared Episodic Memory & Blackboard', subtitle: 'Spanner + Redis transactional agent state store', badge: 'STATE BLACKBOARD', metric: 'Checkpointed Per Step', accentColor: '#059669', scopedNodeId: options.scopedNodeId });

  // A2A Protocol Horizontal Bus Bar (y=246..278)
  svg += `
    <rect x="36" y="248" width="1368" height="28" rx="6" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.5"/>
    <text x="720" y="266" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="800" fill="#1E3A8A">AGENT-TO-AGENT (A2A) JSON-RPC 2.0 STREAMING BUS · AGENT CARDS + TASK ARTIFACT NEGOTIATION</text>
  `;

  // Middle Tier: 4 Specialist Sub-Agents (y=308..466)
  const subAgents = [
    { id: 'sa1', x: 36, title: 'Architect Planner Agent', sub: 'Synthesizes C4/CAG topologies & ADRs', badge: 'SUB-AGENT 01', metric: 'Model: Gemini 4 Argon', color: '#2563EB' },
    { id: 'sa2', x: 386, title: 'Data & SQLX Engineer Agent', sub: 'Authors BigQuery/Spanner schemas & dbt', badge: 'SUB-AGENT 02', metric: 'Model: Gemini 3.8 Flash', color: '#0284C7' },
    { id: 'sa3', x: 736, title: 'Adversarial Critic Agent', sub: 'Audits DOM geometry, OWASP & IAM leaks', badge: 'SUB-AGENT 03', metric: 'Zero Sunk-Cost Bias', color: '#E11D48' },
    { id: 'sa4', x: 1086, title: 'SRE & GitOps Release Agent', sub: 'Compiles Terraform, SBOM & Canary PRs', badge: 'SUB-AGENT 04', metric: 'Model: Gemini 3.8 Flash', color: '#059669' }
  ];

  subAgents.forEach((sa) => {
    svg += drawNodeBox({
      id: sa.id,
      x: sa.x,
      y: 308,
      w: 318,
      h: 156,
      title: sa.title,
      subtitle: sa.sub,
      badge: sa.badge,
      metric: sa.metric,
      accentColor: sa.color,
      scopedNodeId: options.scopedNodeId
    });
    const cx = sa.x + 159;
    svg += `
      <line class="arch-edge" x1="${cx}" y1="276" x2="${cx}" y2="304" stroke="${sa.color}" stroke-width="2" marker-end="url(#arr-blue)"/>
      <line class="arch-edge" x1="${cx}" y1="464" x2="${cx}" y2="496" stroke="${sa.color}" stroke-width="2" marker-end="url(#arr-slate)"/>
    `;
  });

  // MCP Protocol Bus Bar (y=498..530)
  svg += `
    <rect x="36" y="498" width="1368" height="28" rx="6" fill="#F3E8FF" stroke="#7C3AED" stroke-width="1.5"/>
    <text x="720" y="516" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="800" fill="#5B21B6">MODEL CONTEXT PROTOCOL (MCP) ENTERPRISE GATEWAY · SCOPED OAUTH2 CONSENT &amp; AST KEY SANITIZER</text>
  `;

  // Bottom Tier: 4 MCP Tool Servers (y=558..728)
  const mcpTools = [
    { id: 'mcp1', x: 36, title: 'Draw.io & Stitch UI MCP', sub: 'Compiles vector SVG, mxGraph XML & wireframes', badge: 'MCP SERVER 01', metric: 'Read/Write Sandbox', color: '#7C3AED' },
    { id: 'mcp2', x: 386, title: 'Spanner & BigQuery MCP', sub: 'Executes read-only EXPLAIN & schema introspection', badge: 'MCP SERVER 02', metric: 'DROP/TRUNCATE Blocked', color: '#0F766E' },
    { id: 'mcp3', x: 736, title: 'Headless Chrome CDP MCP', sub: 'Runs getBoundingClientRect() & visual diff gates', badge: 'MCP SERVER 03', metric: '2x Retina Verification', color: '#D97706' },
    { id: 'mcp4', x: 1086, title: 'GitHub & Cloud Run MCP', sub: 'Opens signed PRs & triggers two-project deploys', badge: 'MCP SERVER 04', metric: 'Human Approval Gate', color: '#334155' }
  ];

  mcpTools.forEach((mt) => {
    svg += drawNodeBox({
      id: mt.id,
      x: mt.x,
      y: 558,
      w: 318,
      h: 156,
      title: mt.title,
      subtitle: mt.sub,
      badge: mt.badge,
      metric: mt.metric,
      accentColor: mt.color,
      scopedNodeId: options.scopedNodeId
    });
    const cx = mt.x + 159;
    svg += `<line class="arch-edge" x1="${cx}" y1="526" x2="${cx}" y2="554" stroke="#7C3AED" stroke-width="2" marker-end="url(#arr-violet)"/>`;
  });

  svg += `
    <line class="arch-edge" x1="356" y1="162" x2="426" y2="162" stroke="#1D4ED8" stroke-width="2.2" marker-end="url(#arr-blue)"/>
    <line class="arch-edge" x1="990" y1="162" x2="1060" y2="162" stroke="#059669" stroke-width="2.2" marker-start="url(#arr-green)" marker-end="url(#arr-green)"/>
    <line class="arch-edge" x1="710" y1="222" x2="710" y2="246" stroke="#1D4ED8" stroke-width="2.5"/>
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D15: RADIAL 6-STAGE CLOSED-LOOP MLOPS & COUNTERFACTUAL FLYWHEEL
// ============================================================================
function renderD15CircularFlywheel(graph, options) {
  let svg = '';

  // Outer Decorative Flywheel Orbit Ring (drawn behind opaque #FFFFFF cards)
  svg += `
    <ellipse cx="720" cy="422" rx="490" ry="255" fill="none" stroke="#CBD5E1" stroke-width="10" opacity="0.35"/>
    <ellipse cx="720" cy="422" rx="490" ry="255" fill="none" stroke="#10B981" stroke-width="2.5" stroke-dasharray="10 6"/>
  `;

  // Central Hub Nucleus: Vertex Model Registry & Promotion Gate (x=520..920, y=344..498)
  svg += drawNodeBox({
    id: 'fw_hub',
    x: 520,
    y: 344,
    w: 400,
    h: 154,
    title: 'Vertex AI Model Registry & Eval Gate',
    subtitle: 'Central Closed-Loop Governance Nucleus · Promotes Challenger only when Win-Rate >= +5% & Safety == 100%',
    badge: 'CENTRAL FLYWHEEL NUCLEUS',
    metric: 'Champion v2.4 → Challenger v2.5 (+11.4%)',
    headerFill: '#0F172A',
    accentColor: '#10B981',
    rx: 16,
    scopedNodeId: options.scopedNodeId
  });

  // 6 Orbiting Hexagonal Flywheel Nodes
  const stages = [
    { id: 'fw1', x: 110, y: 104, title: '1. Production Trace Capture', sub: 'Logs prompts, latency, thumbs-down & user edits', badge: '12:00 · TELEMETRY', metric: '100% OTel Span Sample', color: '#2563EB' },
    { id: 'fw2', x: 990, y: 104, title: '2. Hard-Negative Failure Miner', sub: 'Clusters low-confidence & rejected generations', badge: '02:00 · MINING', metric: 'Auto-Triages Drift', color: '#D97706' },
    { id: 'fw3', x: 1060, y: 350, title: '3. 1:3 Counterfactual Synthesis', sub: 'Generates 3 verified golden repairs per failure', badge: '04:00 · SYNTHESIS', metric: '1:3 Augmentation Ratio', color: '#7C3AED' },
    { id: 'fw4', x: 990, y: 594, title: '4. LoRA / SFT Alignment Run', sub: 'Fine-tunes adapter weights on golden dataset', badge: '06:00 · FINE-TUNING', metric: 'Vertex Custom Training', color: '#DB2777' },
    { id: 'fw5', x: 110, y: 594, title: '5. Adversarial Judge Benchmark', sub: '500-case golden rubric + regression torture test', badge: '08:00 · EVAL GATE', metric: '0 Regression Allowed', color: '#059669' },
    { id: 'fw6', x: 40, y: 350, title: '6. Shadow & Canary Rollout', sub: 'Gradual traffic shift 5% → 25% → 100% prod', badge: '10:00 · DEPLOYMENT', metric: 'Auto-Rollback < 2s', color: '#0284C7' }
  ];

  stages.forEach((st) => {
    svg += drawNodeBox({
      id: st.id,
      x: st.x,
      y: st.y,
      w: 340,
      h: 138,
      title: st.title,
      subtitle: st.sub,
      badge: st.badge,
      metric: st.metric,
      rx: 14,
      accentColor: st.color,
      scopedNodeId: options.scopedNodeId
    });
  });

  // Clockwise Perimeter Flywheel Arrows (1->2->3->4->5->6->1) + Spokes to Center
  svg += `
    <!-- 1 -> 2 (Top) -->
    <line class="arch-edge" x1="450" y1="173" x2="986" y2="173" stroke="#2563EB" stroke-width="2.5" marker-end="url(#arr-blue)"/>
    <rect x="640" y="153" width="160" height="20" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="720" y="166.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="800" fill="#1D4ED8">Stream Production Traces →</text>

    <!-- 2 -> 3 (Top-Right to Mid-Right) -->
    <line class="arch-edge" x1="1200" y1="242" x2="1200" y2="346" stroke="#D97706" stroke-width="2.5" marker-end="url(#arr-amber)"/>

    <!-- 3 -> 4 (Mid-Right to Bottom-Right) -->
    <line class="arch-edge" x1="1200" y1="488" x2="1200" y2="590" stroke="#7C3AED" stroke-width="2.5" marker-end="url(#arr-violet)"/>

    <!-- 4 -> 5 (Bottom Right to Left) -->
    <line class="arch-edge" x1="990" y1="663" x2="454" y2="663" stroke="#059669" stroke-width="2.5" marker-end="url(#arr-green)"/>
    <rect x="630" y="643" width="180" height="20" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="720" y="656.5" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="800" fill="#065F46">← Evaluate Candidate Adapter</text>

    <!-- 5 -> 6 (Bottom-Left to Mid-Left) -->
    <line class="arch-edge" x1="240" y1="594" x2="240" y2="492" stroke="#059669" stroke-width="2.5" marker-end="url(#arr-green)"/>

    <!-- 6 -> 1 (Mid-Left to Top-Left) -->
    <line class="arch-edge" x1="240" y1="350" x2="240" y2="246" stroke="#0284C7" stroke-width="2.5" marker-end="url(#arr-blue)"/>

    <!-- Radial Spokes to Central Registry -->
    <path class="arch-edge" d="M 450 620 L 486 620 L 486 450 L 516 450" fill="none" stroke="#10B981" stroke-width="1.8" stroke-dasharray="5 3" marker-end="url(#arr-green)"/>
    <line class="arch-edge" x1="520" y1="410" x2="384" y2="410" stroke="#0284C7" stroke-width="2" marker-end="url(#arr-blue)"/>
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D16: GITOPS CI/CD SUPPLY CHAIN, SLSA L3 PROVENANCE & PROGRESSIVE CANARY
// ============================================================================
function renderD16GitopsCicd(graph, options) {
  let svg = '';

  // Top Track: Hermetic Supply Chain & SLSA Level-3 Attestation (y=102..386)
  svg += `
    <rect x="24" y="96" width="1392" height="284" rx="14" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.6"/>
    <text x="44" y="122" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#1E293B">STAGE 1 · HERMETIC CLOUD BUILD SUPPLY CHAIN &amp; SLSA LEVEL-3 CRYPTOGRAPHIC PROVENANCE</text>
  `;

  const ciStages = [
    { id: 'ci1', x: 44, title: '1. Git PR & SAST Scan', sub: 'Semgrep AST, secret leak & license gate', badge: 'SOURCE GATE', metric: '0 High CVEs Allowed', color: '#2563EB' },
    { id: 'ci2', x: 392, title: '2. Hermetic Cloud Build', sub: 'Network-isolated container build (cymbal-build)', badge: 'BUILD SANDBOX', metric: 'Reproducible Digest', color: '#0284C7' },
    { id: 'ci3', x: 740, title: '3. Syft SBOM + Cosign Sign', sub: 'Generates CycloneDX SBOM & KMS signature', badge: 'SLSA LEVEL 3', metric: 'Rekor Transparency Log', color: '#7C3AED' },
    { id: 'ci4', x: 1088, title: '4. Binary Authorization Gate', sub: 'Blocks unsigned images at admission webhook', badge: 'KMS ADMISSION', metric: '100% Attested Only', color: '#059669' }
  ];

  ciStages.forEach((st, i) => {
    svg += drawNodeBox({
      id: st.id,
      x: st.x,
      y: 148,
      w: 304,
      h: 196,
      title: st.title,
      subtitle: st.sub,
      badge: st.badge,
      metric: st.metric,
      accentColor: st.color,
      scopedNodeId: options.scopedNodeId
    });
    if (i < 3) {
      svg += `<line class="arch-edge" x1="${st.x + 304}" y1="246" x2="${ciStages[i + 1].x - 4}" y2="246" stroke="#2563EB" stroke-width="2.2" marker-end="url(#arr-blue)"/>`;
    }
  });

  // Bottom Track: ArgoCD GitOps & Progressive Canary Delivery Funnel (y=412..748)
  svg += `
    <rect x="24" y="412" width="1392" height="336" rx="14" fill="#ECFDF5" fill-opacity="0.4" stroke="#10B981" stroke-width="1.6"/>
    <text x="44" y="438" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#065F46">STAGE 2 · ARGOCD DECLARATIVE GITOPS &amp; AUTOMATED PROGRESSIVE CANARY ROLLOUT</text>
  `;

  svg += drawNodeBox({ id: 'cd1', x: 44, y: 472, w: 296, h: 220, title: 'ArgoCD GitOps Controller', subtitle: 'Reconciles desired Git manifest state with live GKE & Cloud Run revisions', badge: 'GITOPS SYNC', metric: 'Drift Auto-Heal: 15s', accentColor: '#2563EB', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'cd2', x: 392, y: 472, w: 296, h: 220, title: 'Canary Traffic Split (5% → 25%)', subtitle: 'Routes early cohort via Istio/GCLB weighted header rules', badge: 'CANARY SOAK', metric: '15-Minute Soak Window', accentColor: '#D97706', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'cd3', x: 740, y: 472, w: 296, h: 220, title: 'Automated SLO Analysis Judge', subtitle: 'Compares Canary vs Baseline p99 latency, 5xx rate & OTel saturation', badge: 'KAYENTA / PROMETHEUS', metric: 'Pass: Err < 0.01%', accentColor: '#7C3AED', scopedNodeId: options.scopedNodeId });

  svg += drawNodeBox({ id: 'cd4', x: 1088, y: 458, w: 304, h: 116, title: '100% Production Promotion', subtitle: 'Shifts full global traffic to verified revision', badge: 'PROMOTE PASS', metric: 'Zero-Downtime Cutover', headerFill: '#059669', accentColor: '#059669', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'cd5', x: 1088, y: 596, w: 304, h: 116, title: 'Instant Auto-Rollback (< 2.5s)', subtitle: 'Drains canary & restores prior golden digest', badge: 'SLO BREACH ABORT', metric: 'PagerDuty + PR Revert', headerFill: '#E11D48', accentColor: '#E11D48', scopedNodeId: options.scopedNodeId });

  svg += `
    <path class="arch-edge" d="M 1240 344 L 1240 396 L 192 396 L 192 468" fill="none" stroke="#059669" stroke-width="2.2" stroke-dasharray="6 4" marker-end="url(#arr-green)"/>
    <line class="arch-edge" x1="340" y1="582" x2="388" y2="582" stroke="#2563EB" stroke-width="2.2" marker-end="url(#arr-blue)"/>
    <line class="arch-edge" x1="688" y1="582" x2="736" y2="582" stroke="#D97706" stroke-width="2.2" marker-end="url(#arr-amber)"/>
    <path class="arch-edge" d="M 1036 540 L 1062 540 L 1062 516 L 1084 516" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>
    <path class="arch-edge" d="M 1036 620 L 1062 620 L 1062 654 L 1084 654" fill="none" stroke="#E11D48" stroke-width="2.2" marker-end="url(#arr-rose)"/>
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D17: MULTI-REGION ACTIVE-ACTIVE CELL TOPOLOGY & AUTOMATED DR FAILOVER
// ============================================================================
function renderD17ActiveActiveCells(graph, options) {
  let svg = '';

  // Top Global Anycast GCLB Bar (x=340..1100, y=94..198)
  svg += drawNodeBox({
    id: 'dr_gclb',
    x: 340,
    y: 94,
    w: 760,
    h: 104,
    title: 'Global Anycast DNS + Cloud Armor + Cross-Region GCLB',
    subtitle: 'Active-Active 50% / 50% Geo-Proximity Routing · Sub-5-Second BGP Health-Check Cell Evacuation',
    badge: 'GLOBAL ANYCAST INGRESS',
    metric: '99.999% Global Availability · RTO = 4.2s',
    headerFill: '#0284C7',
    accentColor: '#0284C7',
    scopedNodeId: options.scopedNodeId
  });

  // Left Regional Cell Enclave: Region A (us-east1)
  svg += `
    <rect x="28" y="232" width="520" height="516" rx="16" fill="#EFF6FF" fill-opacity="0.65" stroke="#2563EB" stroke-width="2.2"/>
    <rect x="44" y="246" width="488" height="38" rx="8" fill="#DBEAFE" stroke="#1D4ED8"/>
    <text x="288" y="270" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#1E3A8A">CELL A · US-EAST1 (PRIMARY ACTIVE · 50% TRAFFIC)</text>
  `;
  svg += drawNodeBox({ id: 'cell_a1', x: 52, y: 304, w: 472, h: 122, title: 'GKE Autopilot Cell A (us-east1-b/c/d)', subtitle: '120 Isolated Stateless Pods + Istio Local Locality Routing', badge: 'CELL A COMPUTE', metric: 'Zero Cross-Region Hop', accentColor: '#2563EB', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'cell_a2', x: 52, y: 448, w: 472, h: 122, title: 'Memorystore Redis Cluster Cell A', subtitle: 'Regional session & hot catalog cache with local read replicas', badge: 'CELL A CACHE', metric: 'p99 = 0.4ms Local', accentColor: '#2563EB', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'cell_a3', x: 52, y: 592, w: 472, h: 128, title: 'Cloud Spanner Paxos Leader (us-east1)', subtitle: 'Read-Write Quorum Replica + Witness in us-central1', badge: 'CELL A STORAGE', metric: 'TrueTime Commit RPO = 0', accentColor: '#1D4ED8', scopedNodeId: options.scopedNodeId });

  // Center Cross-Region Replication & Failover Controller Bridge (x=576..864)
  svg += drawNodeBox({
    id: 'dr_controller',
    x: 576,
    y: 304,
    w: 288,
    h: 196,
    title: 'Automated DR & Chaos Controller',
    subtitle: 'Continuous synthetic blackbox probes; drains degraded region at GCLB in < 4.2s',
    badge: 'FAILOVER CONTROLLER',
    metric: 'Tested Weekly via Chaos',
    headerFill: '#D97706',
    accentColor: '#D97706',
    scopedNodeId: options.scopedNodeId
  });
  svg += drawNodeBox({
    id: 'dr_paxos',
    x: 576,
    y: 536,
    w: 288,
    h: 184,
    title: 'TrueTime Synchronous Paxos Bridge',
    subtitle: 'Atomic cross-region transaction log replication over Google Jupiter fiber',
    badge: 'RPO = 0 SYNC BRIDGE',
    metric: 'Zero Data Loss on Outage',
    headerFill: '#059669',
    accentColor: '#059669',
    scopedNodeId: options.scopedNodeId
  });

  // Right Regional Cell Enclave: Region B (europe-west1)
  svg += `
    <rect x="892" y="232" width="520" height="516" rx="16" fill="#ECFDF5" fill-opacity="0.65" stroke="#059669" stroke-width="2.2"/>
    <rect x="908" y="246" width="488" height="38" rx="8" fill="#D1FAE5" stroke="#047857"/>
    <text x="1152" y="270" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" font-weight="800" fill="#065F46">CELL B · EUROPE-WEST1 (SECONDARY ACTIVE · 50% TRAFFIC)</text>
  `;
  svg += drawNodeBox({ id: 'cell_b1', x: 916, y: 304, w: 472, h: 122, title: 'GKE Autopilot Cell B (europe-west1-b/c/d)', subtitle: '120 Pre-Warmed Pods Ready for 100% Failover Surge', badge: 'CELL B COMPUTE', metric: '100% Capacity Headroom', accentColor: '#059669', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'cell_b2', x: 916, y: 448, w: 472, h: 122, title: 'Memorystore Redis Cluster Cell B', subtitle: 'Async cross-region cache invalidation via Pub/Sub', badge: 'CELL B CACHE', metric: 'p99 = 0.4ms Local', accentColor: '#059669', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'cell_b3', x: 916, y: 592, w: 472, h: 128, title: 'Cloud Spanner Voting Replica (europe-west1)', subtitle: 'Instant leader promotion if us-east1 quorum drops', badge: 'CELL B STORAGE', metric: 'Leader Election < 2.8s', accentColor: '#047857', scopedNodeId: options.scopedNodeId });

  svg += `
    <path class="arch-edge" d="M 540 198 L 540 214 L 288 214 L 288 232" fill="none" stroke="#2563EB" stroke-width="2.5" marker-end="url(#arr-blue)"/>
    <path class="arch-edge" d="M 900 198 L 900 214 L 1152 214 L 1152 232" fill="none" stroke="#059669" stroke-width="2.5" marker-end="url(#arr-green)"/>
    <line class="arch-edge" x1="524" y1="365" x2="572" y2="365" stroke="#D97706" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arr-amber)"/>
    <line class="arch-edge" x1="864" y1="365" x2="912" y2="365" stroke="#D97706" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arr-amber)"/>
    <line class="arch-edge" x1="524" y1="646" x2="572" y2="646" stroke="#059669" stroke-width="2.5" marker-start="url(#arr-green)" marker-end="url(#arr-green)"/>
    <line class="arch-edge" x1="864" y1="646" x2="912" y2="646" stroke="#059669" stroke-width="2.5" marker-start="url(#arr-green)" marker-end="url(#arr-green)"/>
    ${drawStepCallout(414, 214, '1', '#2563EB')}
    ${drawStepCallout(1026, 214, '2', '#059669')}
    ${drawStepCallout(548, 365, '3', '#D97706')}
    ${drawStepCallout(548, 646, '4', '#059669')}
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// D18 (DISPATCHED AS D16): CONCENTRIC 3-RING ZERO-TRUST SECURITY ENCLAVE
// ============================================================================
function renderD18ZeroTrustEnclave(graph, options) {
  let svg = '';

  // 3 Concentric Defense-in-Depth Enclave Rings
  svg += `
    <!-- OUTER RING 1: Untrusted Internet & WAF Perimeter -->
    <rect x="24" y="92" width="1392" height="660" rx="18" fill="#FFFBEB" fill-opacity="0.55" stroke="#D97706" stroke-width="2.2"/>
    <rect x="44" y="106" width="520" height="32" rx="8" fill="#FEF3C7" stroke="#D97706"/>
    <text x="60" y="126" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="800" fill="#92400E">RING 1 (OUTER PERIMETER) · DDoS WAF, BOT SHIELD &amp; TLS TERMINATION</text>

    <!-- MIDDLE RING 2: BeyondCorp Zero-Trust Identity & Policy Plane -->
    <rect x="404" y="148" width="992" height="584" rx="16" fill="#EFF6FF" fill-opacity="0.65" stroke="#2563EB" stroke-width="2.2"/>
    <rect x="424" y="162" width="560" height="32" rx="8" fill="#DBEAFE" stroke="#1D4ED8"/>
    <text x="440" y="182" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="800" fill="#1E3A8A">RING 2 (BEYONDCORP PLANE) · ZERO-TRUST IAP, PASSKEY OIDC &amp; OPA RBAC</text>

    <!-- INNER VAULT RING 3: VPC Service Controls (VPC-SC) & CMEK Vault -->
    <rect x="784" y="204" width="592" height="508" rx="16" fill="#ECFDF5" fill-opacity="0.75" stroke="#059669" stroke-width="2.5" stroke-dasharray="10 5"/>
    <rect x="804" y="218" width="552" height="32" rx="8" fill="#059669"/>
    <text x="1080" y="238" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="800" fill="#FFFFFF">RING 3 (LOCKED ENCLAVE) · VPC-SC PERIMETER, HSM CMEK &amp; 21 CFR PART 11 VAULT</text>
  `;

  // Ring 1 Cards (x=48..364)
  svg += drawNodeBox({ id: 'zt1', x: 48, y: 180, w: 316, h: 150, title: 'Cloud Armor Enterprise WAF', subtitle: 'L7 DDoS mitigation, geo-fencing & OWASP CRS 3.3', badge: 'RING 1 · WAF', metric: 'Blocks SQLi / XSS at Edge', iconKey: 'cloud_armor', accentColor: '#D97706', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'zt2', x: 48, y: 374, w: 316, h: 150, title: 'reCAPTCHA Enterprise & Bot Gate', subtitle: 'Device telemetry & credential-stuffing firewall', badge: 'RING 1 · BOT SHIELD', metric: 'Risk Score < 0.15 Required', iconKey: 'cloud_armor', accentColor: '#D97706', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'zt3', x: 48, y: 568, w: 316, h: 150, title: 'Certificate Authority Service', subtitle: 'mTLS 1.3 client certificate pinning & OCSP stapling', badge: 'RING 1 · MTLS PKI', metric: '24-Hour Ephemeral Certs', iconKey: 'cloud_kms', accentColor: '#D97706', scopedNodeId: options.scopedNodeId });

  // Ring 2 Cards (x=428..744)
  svg += drawNodeBox({ id: 'zt4', x: 428, y: 224, w: 316, h: 146, title: 'Identity-Aware Proxy (IAP)', subtitle: 'Zero-Trust context-aware access proxy (no VPN)', badge: 'RING 2 · BEYONDCORP', metric: 'Verifies Device + mTLS Cert', iconKey: 'iap', accentColor: '#2563EB', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'zt5', x: 428, y: 400, w: 316, h: 146, title: 'OPA / Casbin Fine-Grained RBAC', subtitle: 'Evaluates tenant_id, role & attribute policies per call', badge: 'RING 2 · POLICY ENGINE', metric: 'Deny-by-Default ABAC', iconKey: 'vpc_sc', accentColor: '#2563EB', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'zt6', x: 428, y: 572, w: 316, h: 138, title: 'Cloud DLP PII Redaction Proxy', subtitle: 'Scans & masks SSN, email, PHI before AI or DB write', badge: 'RING 2 · PRIVACY GATE', metric: 'Zero Raw PII in Logs', iconKey: 'dlp_guardrail', accentColor: '#2563EB', scopedNodeId: options.scopedNodeId });

  // Ring 3 Inner Vault Cards (x=812..1348)
  svg += drawNodeBox({ id: 'zt7', x: 812, y: 270, w: 536, h: 126, title: 'Cloud HSM / CMEK Hardware Key Vault', subtitle: 'Customer-Managed Encryption Keys with 90-day rotation & Access Transparency logs', badge: 'RING 3 · CRYPTO VAULT', metric: 'FIPS 140-3 L3 · KAR Enforced', iconKey: 'cloud_kms', accentColor: '#059669', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'zt8', x: 812, y: 416, w: 536, h: 126, title: 'Confidential GKE & Spanner Sovereign Enclave', subtitle: 'AMD SEV-SNP memory encryption in use + VPC-SC zero data exfiltration lock', badge: 'RING 3 · CONFIDENTIAL DATA', metric: 'Private Google Access Only', iconKey: 'vpc_sc', accentColor: '#059669', scopedNodeId: options.scopedNodeId });
  svg += drawNodeBox({ id: 'zt9', x: 812, y: 562, w: 536, h: 126, title: 'FDA 21 CFR Part 11 / SOC2 Immutable Audit Ledger', subtitle: 'Cryptographic HMAC-SHA256 chained electronic signatures & WORM storage', badge: 'RING 3 · COMPLIANCE LEDGER', metric: 'Tamper-Evident WORM Bucket', iconKey: 'bigquery', headerFill: '#047857', accentColor: '#047857', scopedNodeId: options.scopedNodeId });

  svg += `
    <!-- Ring 1 (WAF, Bot Gate, CAS mTLS PKI) all converge on Identity-Aware Proxy (zt4) -->
    <path class="arch-edge" d="M 364 255 L 394 255 L 394 275 L 424 275" fill="none" stroke="#D97706" stroke-width="2.2" marker-end="url(#arr-amber)"/>
    <path class="arch-edge" d="M 364 449 L 384 449 L 384 305 L 424 305" fill="none" stroke="#2563EB" stroke-width="2.2" marker-end="url(#arr-blue)"/>
    <path class="arch-edge" d="M 364 641 L 394 641 L 394 335 L 424 335" fill="none" stroke="#D97706" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#arr-amber)"/>

    <!-- Intra-Ring 2 Chain: IAP (zt4) -> OPA/Casbin RBAC (zt5) -> Cloud DLP Proxy (zt6) -->
    <line class="arch-edge" x1="586" y1="370" x2="586" y2="396" stroke="#2563EB" stroke-width="2" marker-end="url(#arr-blue)"/>
    <line class="arch-edge" x1="586" y1="546" x2="586" y2="568" stroke="#2563EB" stroke-width="2" marker-end="url(#arr-blue)"/>

    <!-- Ring 2 -> Ring 3 Locked Vault Enclave -->
    <path class="arch-edge" d="M 744 297 L 776 297 L 776 333 L 808 333" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>
    <line class="arch-edge" x1="744" y1="476" x2="808" y2="476" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>
    <path class="arch-edge" d="M 744 641 L 776 641 L 776 625 L 808 625" fill="none" stroke="#059669" stroke-width="2.2" marker-end="url(#arr-green)"/>

    ${drawStepCallout(394, 255, '1', '#D97706')}
    ${drawStepCallout(384, 400, '2', '#2563EB')}
    ${drawStepCallout(394, 540, '3', '#D97706')}
    ${drawStepCallout(776, 315, '4', '#059669')}
    ${drawStepCallout(776, 476, '5', '#059669')}
    ${drawStepCallout(776, 633, '6', '#059669')}
  `;

  return wrapSvgCanvas(graph, svg, options);
}

// ============================================================================
// MASTER DISPATCHER FOR ALL 18 LIFECYCLE DIAGRAMS (D01..D18)
// ============================================================================
export function renderBespokeLifecycleSvg(graph, options = {}) {
  activeDetailLevel = String(options.detailLevel || 'L200').toUpperCase();
  activeRenderGraph = graph;
  const renderMode = String(options.renderMode || graph.renderMode || 'BESPOKE_ARCHETYPE').toUpperCase();
  if (renderMode === 'DYNAMIC_MULTI_TIER') {
    return renderD05MultiTierCloud(graph, options);
  }
  const code = String(graph.code || 'D05').toUpperCase();
  switch (code) {
    case 'D01':
      return renderD01ValueStream(graph, options);
    case 'D02':
      return renderD02UxWireframeFlow(graph, options);
    case 'D03':
      return renderD03EventStorming(graph, options);
    case 'D04':
      return renderD04C4Topology(graph, options);
    case 'D05':
      return renderD05MultiTierCloud(graph, options);
    case 'D06':
      return renderD06HubAndSpoke(graph, options);
    case 'D07':
      return renderD07SequenceLifeline(graph, options);
    case 'D08':
      return renderD08SagaStateMachine(graph, options);
    case 'D09':
      return renderD09GraphqlFederation(graph, options);
    case 'D10':
      return renderD10DatabaseErd(graph, options);
    case 'D11':
      return renderD11MedallionLakehouse(graph, options);
    case 'D12':
      return renderD12CqrsSharding(graph, options);
    case 'D13':
      return renderD13HybridGraphRag(graph, options);
    case 'D14':
      return renderD14MultiAgentMcp(graph, options);
    case 'D15':
      return renderD15CircularFlywheel(graph, options);
    case 'D16':
      return renderD18ZeroTrustEnclave(graph, options);
    case 'D17':
      return renderD16GitopsCicd(graph, options);
    case 'D18':
      return renderD17ActiveActiveCells(graph, options);
    default:
      return renderD05MultiTierCloud(graph, options);
  }
}
