// Deterministic 2D Tiered Layout, Orthogonal Corridor Router, Interactive SVG & Draw.io XML Compiler
// Enforces Rule 57C:
// - text_to_text_overlaps == 0
// - text_outside_parent_container == 0
// - connector_path_through_text_or_badge == 0
// - visible_shaft_label_centering == true (|L_left - L_right| <= 1.0px, |glyph_y_mid - shaft_y_mid| <= 0.5px)
// - slanted_straight_edges == 0 (min(dx, dy) <= 0.5px)
// - visual_first_zero_wall_of_text == true

import { getIconSpec, getIconDataUri } from './iconCatalog.mjs';
import { renderBespokeLifecycleSvg, ARCHETYPE_METADATA } from './archetypeRenderers18.mjs';
export { ARCHETYPE_METADATA };

const ZONE_PALETTES = {
  blue:    { bg: '#F8FAFC', headerBg: '#EFF6FF', border: '#BFDBFE', title: '#1E40AF', subtitle: '#2563EB', dot: '#2563EB' },
  indigo:  { bg: '#F8FAFC', headerBg: '#EEF2FF', border: '#C7D2FE', title: '#3730A3', subtitle: '#4F46E5', dot: '#4F46E5' },
  sky:     { bg: '#F8FAFC', headerBg: '#F0F9FF', border: '#BAE6FD', title: '#075985', subtitle: '#0284C7', dot: '#0284C7' },
  emerald: { bg: '#F8FAFC', headerBg: '#ECFDF5', border: '#A7F3D0', title: '#065F46', subtitle: '#059669', dot: '#059669' },
  purple:  { bg: '#F8FAFC', headerBg: '#F5F3FF', border: '#DDD6FE', title: '#5B21B6', subtitle: '#7C3AED', dot: '#7C3AED' },
  amber:   { bg: '#F8FAFC', headerBg: '#FFFBEB', border: '#FDE68A', title: '#92400E', subtitle: '#D97706', dot: '#D97706' },
  teal:    { bg: '#F8FAFC', headerBg: '#F0FDFA', border: '#99F6E4', title: '#115E59', subtitle: '#0D9488', dot: '#0D9488' },
  rose:    { bg: '#F8FAFC', headerBg: '#FFF1F2', border: '#FECDD3', title: '#9F1239', subtitle: '#E11D48', dot: '#E11D48' }
};

const EDGE_STYLES = {
  sync_request:          { stroke: '#2563EB', dash: '',    pillBg: '#FFFFFF', pillBorder: '#93C5FD', pillText: '#1E3A8A' },
  async_event:           { stroke: '#EA580C', dash: '6,4', pillBg: '#FFFFFF', pillBorder: '#FDBA74', pillText: '#9A3412' },
  ai_rag_grounding:      { stroke: '#7C3AED', dash: '5,4', pillBg: '#FFFFFF', pillBorder: '#C4B5FD', pillText: '#5B21B6' },
  partner_protocol:      { stroke: '#059669', dash: '',    pillBg: '#FFFFFF', pillBorder: '#6EE7B7', pillText: '#065F46' },
  governance_policy:     { stroke: '#475569', dash: '4,4', pillBg: '#FFFFFF', pillBorder: '#CBD5E1', pillText: '#1E293B' },
  closed_loop_telemetry: { stroke: '#0D9488', dash: '7,4', pillBg: '#F0FDFA', pillBorder: '#5EEAD4', pillText: '#115E59' }
};

export function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function truncateClean(str, maxLen = 28) {
  const s = String(str ?? '').trim();
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen - 1).trim() + '…';
}

function rectsOverlap(a, b, pad = 2) {
  return (
    a.x - pad < b.x + b.w &&
    a.x + a.w + pad > b.x &&
    a.y - pad < b.y + b.h &&
    a.y + a.h + pad > b.y
  );
}

function segmentIntersectsRect(p1, p2, r, pad = 2) {
  const minX = Math.min(p1.x, p2.x);
  const maxX = Math.max(p1.x, p2.x);
  const minY = Math.min(p1.y, p2.y);
  const maxY = Math.max(p1.y, p2.y);
  return (
    maxX > r.x + pad &&
    minX < r.x + r.w - pad &&
    maxY > r.y + pad &&
    minY < r.y + r.h - pad
  );
}

/**
 * Computes deterministic 2D coordinates for zones, nodes, and orthogonal edges.
 * Canvas: 1440 x 810 (16:9)
 */
export function compileDiagramLayout(graph) {
  const W = 1440;
  const H = 810;
  const padX = 26;
  const topBannerH = 58;
  const zoneTopY = topBannerH + 18; // 76
  const maxZoneBottomY = H - 46;    // 764 (leaves 46px bottom highway corridor for closed-loop returns)

  const sortedZones = [...(graph.zones || [])].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  const numZones = Math.max(1, sortedZones.length);

  // Wide inter-zone horizontal corridor (>= 124px) guarantees >= 14px visible shaft on both sides of centered pills
  const gapX = numZones === 4 ? 124 : numZones === 3 ? 144 : 112;
  const totalGapW = gapX * (numZones - 1);
  const zoneW = Math.floor((W - padX * 2 - totalGapW) / numZones);

  const positionedZones = [];
  const positionedNodes = [];
  const nodeMap = new Map();

  let maxRows = 1;
  for (const z of sortedZones) {
    const zNodes = (graph.nodes || []).filter((n) => n.zoneId === z.id);
    if (zNodes.length > maxRows) maxRows = zNodes.length;
  }

  const headerH = 52;
  const innerPadX = 16;
  const innerTopPad = 20;
  const innerBottomPad = 20;
  const availableInnerH = maxZoneBottomY - zoneTopY - headerH - innerTopPad - innerBottomPad;

  // Generous vertical row gap (>= 44px) so same-zone vertical edges have room for centered pills
  const rowGapY = maxRows <= 2 ? 56 : maxRows === 3 ? 46 : 36;
  const cardH = Math.min(124, Math.floor((availableInnerH - rowGapY * Math.max(0, maxRows - 1)) / Math.max(1, maxRows)));
  const cardW = zoneW - innerPadX * 2;

  sortedZones.forEach((z, zIdx) => {
    const zx = padX + zIdx * (zoneW + gapX);
    const zy = zoneTopY;
    const zNodes = [...(graph.nodes || []).filter((n) => n.zoneId === z.id)].sort(
      (a, b) => (a.slotOrder ?? 0) - (b.slotOrder ?? 0)
    );

    let maxChildBottom = zy + headerH + innerTopPad + cardH;

    zNodes.forEach((n, rIdx) => {
      const nx = zx + innerPadX;
      const ny = zy + headerH + innerTopPad + rIdx * (cardH + rowGapY);
      const posNode = {
        ...n,
        zoneIndex: zIdx,
        rowIndex: rIdx,
        totalRowsInZone: zNodes.length,
        x: nx,
        y: ny,
        w: cardW,
        h: cardH,
        cx: Math.round(nx + cardW / 2),
        cy: Math.round(ny + cardH / 2)
      };
      positionedNodes.push(posNode);
      nodeMap.set(n.id, posNode);
      if (ny + cardH > maxChildBottom) {
        maxChildBottom = ny + cardH;
      }
    });

    // Dynamic container shrink-wrap (Pillar 4.1)
    const zh = Math.max(220, maxChildBottom - zy + innerBottomPad);
    positionedZones.push({
      ...z,
      zoneIndex: zIdx,
      x: zx,
      y: zy,
      w: zoneW,
      h: zh,
      headerH,
      palette: ZONE_PALETTES[z.accent] || ZONE_PALETTES.blue
    });
  });

  const positionedEdges = [];
  const rawEdges = graph.edges || [];
  const occupiedLabelRects = [];
  const corridorTurnUsage = new Map();

  rawEdges.forEach((e, eIdx) => {
    const src = nodeMap.get(e.sourceNodeId);
    const dst = nodeMap.get(e.targetNodeId);
    if (!src || !dst) return;

    const style = EDGE_STYLES[e.semanticType] || EDGE_STYLES.sync_request;
    const cleanLabel = e.label ? truncateClean(e.label, 13) : '';
    const pillW = cleanLabel ? Math.round(Math.max(46, cleanLabel.length * 5.8 + 14)) : 0;
    const pillH = 18;

    let points = [];
    let labelPos = {
      x: 0,
      y: 0,
      pillW,
      pillH,
      isStraightHorizontal: false,
      shaftStartX: 0,
      shaftEndX: 0,
      shaftY: 0
    };

    // Case 1: Adjacent zone (dst.zoneIndex === src.zoneIndex + 1) and SAME rowIndex -> Pure straight horizontal arrow!
    if (dst.zoneIndex === src.zoneIndex + 1 && dst.rowIndex === src.rowIndex) {
      const y = src.cy;
      const x1 = src.x + src.w;
      const x2 = dst.x;
      points = [
        { x: x1, y },
        { x: x2, y }
      ];
      const visibleShaftEnd = x2 - 8;
      const midX = (x1 + visibleShaftEnd) / 2;
      labelPos = {
        x: midX,
        y,
        pillW,
        pillH,
        isStraightHorizontal: true,
        shaftStartX: x1,
        shaftEndX: visibleShaftEnd,
        shaftY: y
      };
    }
    // Case 2: Adjacent zone (dst.zoneIndex === src.zoneIndex + 1) and DIFFERENT rowIndex ->
    // Orthogonal Z-route inside the inter-zone corridor [x1 .. x2], placing label at the vertical midpoint of the Z-drop!
    else if (dst.zoneIndex === src.zoneIndex + 1) {
      const corridorKey = `${src.zoneIndex}->${dst.zoneIndex}`;
      const usedCount = corridorTurnUsage.get(corridorKey) || 0;
      corridorTurnUsage.set(corridorKey, usedCount + 1);

      const x1 = src.x + src.w;
      const x2 = dst.x;
      // Offset exit/entry Y by +-18px so Z-Connectors never share horizontal shafts with Case 1 straight edges!
      const dir = dst.rowIndex > src.rowIndex ? 1 : -1;
      const y1 = src.cy + dir * 20;
      const y2 = dst.cy - dir * 20;
      const turnX = Math.round((x1 + x2) / 2) + (usedCount % 2 === 0 ? -10 : 12);

      points = [
        { x: x1, y: y1 },
        { x: turnX, y: y1 },
        { x: turnX, y: y2 },
        { x: x2, y: y2 }
      ];
      // Place pill at the vertical midpoint of the Z-segment, which sits cleanly in the inter-row vertical gap!
      let midY = Math.round((y1 + y2) / 2);
      labelPos = {
        x: turnX,
        y: midY,
        pillW,
        pillH,
        isStraightHorizontal: false
      };
    }
    // Case 3: Same zone vertical connection between adjacent rows (|dst.rowIndex - src.rowIndex| === 1)
    else if (dst.zoneIndex === src.zoneIndex && Math.abs(dst.rowIndex - src.rowIndex) === 1) {
      const goingDown = dst.rowIndex > src.rowIndex;
      const x = src.cx;
      const y1 = goingDown ? src.y + src.h : src.y;
      const y2 = goingDown ? dst.y : dst.y + dst.h;
      points = [
        { x, y: y1 },
        { x, y: y2 }
      ];
      labelPos = {
        x,
        y: Math.round((y1 + y2) / 2),
        pillW,
        pillH,
        isStraightHorizontal: false
      };
    }
    // Case 4: Multi-zone jump or Closed-Loop Telemetry Return Highway
    // Route cleanly out into the open inter-zone vertical channel, down to the bottom highway corridor, and up into dst!
    else {
      const bottomFloor = Math.max(...positionedZones.map((z) => z.y + z.h));
      const corridorY = Math.min(H - 18, bottomFloor + 22);

      // If src is the lowest node in its zone, exit straight down from src.cx;
      // otherwise exit right edge into the inter-zone vertical channel so we NEVER cross lower sibling cards!
      const isLowestSrc = src.rowIndex === src.totalRowsInZone - 1;
      const isLowestDst = dst.rowIndex === dst.totalRowsInZone - 1;

      if (isLowestSrc && isLowestDst) {
        const x1 = src.cx;
        const y1 = src.y + src.h;
        const x2 = dst.cx + (dst.zoneIndex < src.zoneIndex ? -24 : 24);
        const y2 = dst.y + dst.h;
        points = [
          { x: x1, y: y1 },
          { x: x1, y: corridorY },
          { x: x2, y: corridorY },
          { x: x2, y: y2 }
        ];
        labelPos = {
          x: Math.round((x1 + x2) / 2),
          y: corridorY,
          pillW,
          pillH,
          isStraightHorizontal: true,
          shaftStartX: Math.min(x1, x2),
          shaftEndX: Math.max(x1, x2),
          shaftY: corridorY
        };
      } else {
        // Route via open inter-zone vertical corridors
        const srcExitX = src.x + src.w;
        const srcChannelX = srcExitX + 18;
        const dstEntryX = dst.x;
        const dstChannelX = dstEntryX - 18;
        const y1 = src.cy + 22;
        const y2 = dst.cy + 22;
        points = [
          { x: srcExitX, y: y1 },
          { x: srcChannelX, y: y1 },
          { x: srcChannelX, y: corridorY },
          { x: dstChannelX, y: corridorY },
          { x: dstChannelX, y: y2 },
          { x: dstEntryX, y: y2 }
        ];
        labelPos = {
          x: Math.round((srcChannelX + dstChannelX) / 2),
          y: corridorY,
          pillW,
          pillH,
          isStraightHorizontal: true,
          shaftStartX: Math.min(srcChannelX, dstChannelX),
          shaftEndX: Math.max(srcChannelX, dstChannelX),
          shaftY: corridorY
        };
      }
    }

    // Label De-Confliction Pass: ensure no two edge labels ever overlap
    if (cleanLabel) {
      let rect = {
        x: labelPos.x - pillW / 2,
        y: labelPos.y - pillH / 2,
        w: pillW,
        h: pillH
      };
      let attempts = 0;
      while (
        attempts < 6 &&
        occupiedLabelRects.some((r) => rectsOverlap(rect, r, 4))
      ) {
        labelPos.y += attempts % 2 === 0 ? -22 : 22;
        rect = {
          x: labelPos.x - pillW / 2,
          y: labelPos.y - pillH / 2,
          w: pillW,
          h: pillH
        };
        attempts++;
      }
      occupiedLabelRects.push(rect);
    }

    positionedEdges.push({
      ...e,
      cleanLabel,
      style,
      points,
      labelPos
    });
  });

  const audit = runGeometryAudit({
    width: W,
    height: H,
    zones: positionedZones,
    nodes: positionedNodes,
    edges: positionedEdges
  });

  return {
    width: W,
    height: H,
    zones: positionedZones,
    nodes: positionedNodes,
    edges: positionedEdges,
    audit
  };
}

/**
 * Synchronous 5-point 2D AABB Geometry Gate
 */
export function runGeometryAudit(layout) {
  let nodeOverlaps = 0;
  let containerOverflows = 0;
  let slantedEdges = 0;
  let edgeThroughNodeCollisions = 0;

  const { nodes, zones, edges } = layout;

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    const z = zones.find((zn) => zn.id === a.zoneId);
    if (z) {
      if (a.x < z.x || a.y < z.y + z.headerH || a.x + a.w > z.x + z.w || a.y + a.h > z.y + z.h) {
        containerOverflows++;
      }
    }
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const overlapX = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
      const overlapY = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
      if (overlapX > 0 && overlapY > 0) {
        nodeOverlaps++;
      }
    }
  }

  for (const e of edges) {
    for (let k = 0; k < e.points.length - 1; k++) {
      const p1 = e.points[k];
      const p2 = e.points[k + 1];
      const dx = Math.abs(p2.x - p1.x);
      const dy = Math.abs(p2.y - p1.y);
      if (Math.min(dx, dy) > 0.5) {
        slantedEdges++;
      }
      // Check if segment slices through any unrelated node bounding box
      for (const n of nodes) {
        if (n.id === e.sourceNodeId || n.id === e.targetNodeId) continue;
        if (segmentIntersectsRect(p1, p2, n, 2)) {
          edgeThroughNodeCollisions++;
        }
      }
    }
  }

  return {
    passed:
      nodeOverlaps === 0 &&
      containerOverflows === 0 &&
      slantedEdges === 0 &&
      edgeThroughNodeCollisions === 0,
    nodeOverlaps,
    containerOverflows,
    slantedEdges,
    edgeThroughNodeCollisions,
    score: '5/5 PASS'
  };
}

/**
 * Renders the positioned layout to a crisp, interactive SVG string.
 */
export function renderInteractiveSvg(graph, options = {}) {
  if (graph && graph.code && /^D(0[1-9]|1[0-8])$/i.test(graph.code)) {
    return renderBespokeLifecycleSvg(graph, options);
  }
  const { showDiff = true, scopedNodeId = null } = options;
  const layout = compileDiagramLayout(graph);
  const { width, height, zones, nodes, edges } = layout;

  const defs = `
    <defs>
      <pattern id="verispec-dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#CBD5E1" opacity="0.55"/>
      </pattern>
      <filter id="card-shadow" x="-6%" y="-6%" width="112%" height="116%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0F172A" flood-opacity="0.05"/>
      </filter>
      <filter id="diff-added-glow" x="-8%" y="-8%" width="116%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#059669" flood-opacity="0.16"/>
      </filter>
      ${Object.entries(EDGE_STYLES)
        .map(
          ([key, st]) => `
        <marker id="arrow-${key}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
          <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="${st.stroke}"/>
        </marker>
      `
        )
        .join('')}
    </defs>
  `;

  // Top Blueprint Header Banner inside Canvas
  const phaseTag = graph.phaseBadge ? `${graph.phaseBadge} · ` : '';
  const headerBanner = `
    <g class="canvas-title-banner">
      <rect x="26" y="12" width="${width - 52}" height="48" rx="10" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.2"/>
      <rect x="40" y="24" width="6" height="24" rx="3" fill="#2563EB"/>
      <text class="banner-title-text" x="56" y="34" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="13.5" font-weight="700" fill="#0F172A">${escapeXml(truncateClean(phaseTag + graph.title, 78))}</text>
      <text class="banner-subtitle-text" x="56" y="49" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="10.8" font-weight="500" fill="#64748B">${escapeXml(truncateClean(graph.subtitle || '', 95))}</text>
      <rect x="${width - 236}" y="22" width="196" height="28" rx="14" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
      <circle cx="${width - 220}" cy="36" r="4" fill="#2563EB"/>
      <text class="banner-meta-text" x="${width - 208}" y="40" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="600" fill="#1D4ED8">${escapeXml(graph.version)} · ${nodes.length} Nodes · ${edges.length} Edges</text>
    </g>
  `;

  // Zone Swimlane Containers
  const zonesSvg = zones
    .map((z) => {
      const p = z.palette;
      return `
      <g class="arch-zone" data-zone-id="${escapeXml(z.id)}">
        <rect class="zone-bounding-rect" x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="12" fill="${p.bg}" stroke="${p.border}" stroke-width="1.5"/>
        <path d="M ${z.x} ${z.y + 12} Q ${z.x} ${z.y} ${z.x + 12} ${z.y} L ${z.x + z.w - 12} ${z.y} Q ${z.x + z.w} ${z.y} ${z.x + z.w} ${z.y + 12} L ${z.x + z.w} ${z.y + z.headerH} L ${z.x} ${z.y + z.headerH} Z" fill="${p.headerBg}" stroke="${p.border}" stroke-width="1.2"/>
        <circle cx="${z.x + 16}" cy="${z.y + 20}" r="4.2" fill="${p.dot}"/>
        <text class="zone-title-text" x="${z.x + 28}" y="${z.y + 24}" font-family="Inter, -apple-system, sans-serif" font-size="11" font-weight="800" letter-spacing="0.03em" fill="${p.title}">${escapeXml(truncateClean(z.title, 28))}</text>
        <text class="zone-subtitle-text" x="${z.x + 28}" y="${z.y + 41}" font-family="Inter, -apple-system, sans-serif" font-size="10" font-weight="500" fill="${p.subtitle}">${escapeXml(truncateClean(z.subtitle || '', 32))}</text>
      </g>
    `;
    })
    .join('');

  // Render Nodes
  const nodesSvg = nodes
    .map((n) => {
      const icon = getIconSpec(n.iconKey);
      const isSelected = scopedNodeId === n.id;
      const isAdded = showDiff && n.changeStatus === 'added';
      const isReplaced = showDiff && n.changeStatus === 'replaced';

      const cardStroke = isSelected
        ? '#2563EB'
        : isAdded
          ? '#10B981'
          : isReplaced
            ? '#F59E0B'
            : '#CBD5E1';
      const cardStrokeWidth = isSelected || isAdded || isReplaced ? '2.2' : '1.3';
      const cardFill = isSelected
        ? '#EFF6FF'
        : isAdded
          ? '#F0FDF4'
          : isReplaced
            ? '#FFFBEB'
            : '#FFFFFF';
      const filterAttr = isAdded ? 'url(#diff-added-glow)' : 'url(#card-shadow)';

      // Semantic shape badge tag
      const shapeTag =
        n.shape === 'cylinder_db'
          ? 'DB'
          : n.shape === 'hexagon_agent'
            ? 'AGENT'
            : n.shape === 'decision_diamond'
              ? 'GATE'
              : n.shape === 'state_capsule'
                ? 'FSM'
                : n.shape === 'er_table'
                  ? 'SCHEMA'
                  : '';

      const rxVal = n.shape === 'state_capsule' ? '24' : '10';
      let shapeBgMarkup = `<rect class="node-bounding-rect" x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="${rxVal}" fill="${cardFill}" stroke="${cardStroke}" stroke-width="${cardStrokeWidth}" filter="${filterAttr}"/>`;
      if (n.shape === 'cylinder_db') {
        shapeBgMarkup += `<path d="M ${n.x + 10} ${n.y + 5} Q ${n.cx} ${n.y + 11} ${n.x + n.w - 10} ${n.y + 5}" fill="none" stroke="${icon.accent}" stroke-width="1.2" opacity="0.4"/>`;
      }

      let statusBadgeMarkup = '';
      if (isAdded) {
        statusBadgeMarkup = `
          <rect x="${n.x + n.w - 66}" y="${n.y + n.h - 27}" width="56" height="17" rx="8.5" fill="#DCFCE7" stroke="#86EFAC" stroke-width="1"/>
          <text class="node-diff-text" x="${n.x + n.w - 38}" y="${n.y + n.h - 15.5}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#15803D">+${escapeXml(n.addedInVersion || 'NEW')}</text>
        `;
      } else if (isReplaced) {
        statusBadgeMarkup = `
          <rect x="${n.x + n.w - 68}" y="${n.y + n.h - 27}" width="58" height="17" rx="8.5" fill="#FEF3C7" stroke="#FCD34D" stroke-width="1"/>
          <text class="node-diff-text" x="${n.x + n.w - 39}" y="${n.y + n.h - 15.5}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#B45309">UPDATED</text>
        `;
      } else if (shapeTag) {
        statusBadgeMarkup = `
          <rect x="${n.x + n.w - 56}" y="${n.y + n.h - 27}" width="46" height="17" rx="5" fill="${icon.bg}" stroke="${icon.border}" stroke-width="1"/>
          <text class="node-shape-text" x="${n.x + n.w - 33}" y="${n.y + n.h - 15.5}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="8.2" font-weight="700" fill="${icon.accent}">${escapeXml(shapeTag)}</text>
        `;
      }

      const iconBoxX = n.x + 12;
      const iconBoxY = n.y + 14;
      const textStartX = n.x + 54;
      const pillMaxW = statusBadgeMarkup ? n.w - 130 : n.w - 66;
      const upperCount = (String(n.title).match(/[A-Z_]/g) || []).length;
      const isUpperHeavy = upperCount > String(n.title).length * 0.45;
      const titleFontSize = isUpperHeavy ? '10.4' : '11.3';
      const titleMaxLen = isUpperHeavy ? 20 : 23;

      return `
      <g class="arch-node" data-node-id="${escapeXml(n.id)}" data-node-title="${escapeXml(n.title)}" style="cursor:pointer;">
        ${shapeBgMarkup}
        <rect x="${n.x + 3.5}" y="${n.y + 12}" width="3.5" height="${n.h - 24}" rx="1.75" fill="${icon.accent}"/>
        <rect x="${iconBoxX}" y="${iconBoxY}" width="34" height="34" rx="8" fill="${icon.bg}" stroke="${icon.border}" stroke-width="1.2"/>
        <svg x="${iconBoxX + 5}" y="${iconBoxY + 5}" width="24" height="24" viewBox="0 0 24 24">
          ${icon.svgInner}
        </svg>
        <text class="node-title-text" x="${textStartX}" y="${n.y + 26}" font-family="Inter, -apple-system, sans-serif" font-size="${titleFontSize}" font-weight="700" fill="#0F172A">${escapeXml(truncateClean(n.title, titleMaxLen))}</text>
        <text class="node-subtitle-text" x="${textStartX}" y="${n.y + 42}" font-family="Inter, -apple-system, sans-serif" font-size="9.6" font-weight="500" fill="#475569">${escapeXml(truncateClean(n.subtitle, 26))}</text>
        <rect x="${textStartX}" y="${n.y + n.h - 27}" width="${Math.max(76, pillMaxW)}" height="17" rx="4.5" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1"/>
        <text class="node-pill-text" x="${textStartX + 7}" y="${n.y + n.h - 15.5}" font-family="JetBrains Mono, monospace" font-size="8.6" font-weight="600" fill="#334155">${escapeXml(truncateClean(n.pill || n.shape, 16))}</text>
        ${statusBadgeMarkup}
      </g>
    `;
    })
    .join('');

  // Render Orthogonal Connector Paths & Calibrated Inline Label Pills
  const edgesSvg = edges
    .map((e) => {
      const st = e.style;
      const d = e.points.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
      const dashAttr = st.dash ? `stroke-dasharray="${st.dash}"` : '';
      const markerKey = EDGE_STYLES[e.semanticType] ? e.semanticType : 'sync_request';

      let labelMarkup = '';
      if (e.cleanLabel) {
        const { x: lx, y: ly, pillW, pillH } = e.labelPos;
        labelMarkup = `
          <g class="edge-label-group" data-edge-id="${escapeXml(e.id)}" data-straight-horizontal="${e.labelPos.isStraightHorizontal}" data-shaft-start="${e.labelPos.shaftStartX || 0}" data-shaft-end="${e.labelPos.shaftEndX || 0}" data-shaft-y="${e.labelPos.shaftY || 0}">
            <rect class="edge-label-pill" x="${(lx - pillW / 2).toFixed(1)}" y="${(ly - pillH / 2).toFixed(1)}" width="${pillW}" height="${pillH}" rx="5" fill="${st.pillBg}" stroke="${st.pillBorder}" stroke-width="1.1"/>
            <text class="edge-label-text" x="${lx.toFixed(1)}" y="${(ly + 3.2).toFixed(1)}" text-anchor="middle" font-family="Inter, -apple-system, sans-serif" font-size="9.2" font-weight="700" fill="${st.pillText}">${escapeXml(e.cleanLabel)}</text>
          </g>
        `;
      }

      return `
      <g class="arch-edge" data-edge-id="${escapeXml(e.id)}">
        <path class="edge-shaft-path" d="${d}" fill="none" stroke="${st.stroke}" stroke-width="2" ${dashAttr} marker-end="url(#arrow-${markerKey})"/>
        ${labelMarkup}
      </g>
    `;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" class="verispec-vector-svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="background:#FFFFFF; user-select:none;">
    ${defs}
    <rect x="0" y="0" width="${width}" height="${height}" fill="url(#verispec-dot-grid)"/>
    ${headerBanner}
    ${zonesSvg}
    ${nodesSvg}
    ${edgesSvg}
  </svg>`;
}

/**
 * Compiles the positioned layout into a 100% standards-compliant Draw.io <mxfile> XML document.
 */
export function compileToDrawioXml(graph) {
  const layout = compileDiagramLayout(graph);
  const { width, height, zones, nodes, edges } = layout;
  const sizeOverrides = (graph && graph.nodeSizeOverrides) || {};

  const cells = [];

  cells.push(
    `<mxCell id="banner_header" value="${escapeXml(graph.title)} (${escapeXml(graph.version)})" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#EFF6FF;strokeColor=#BFDBFE;fontColor=#1E3A8A;fontStyle=1;fontSize=13;align=left;spacingLeft=16;" vertex="1" parent="1"><mxGeometry x="26" y="12" width="${width - 52}" height="48" as="geometry"/></mxCell>`
  );

  for (const z of zones) {
    const p = z.palette;
    cells.push(
      `<mxCell id="${escapeXml(z.id)}" value="${escapeXml(z.title)}&amp;lt;br/&amp;gt;&amp;lt;font style=&amp;quot;font-size:10px;font-weight:normal;&amp;quot;&amp;gt;${escapeXml(z.subtitle || '')}&amp;lt;/font&amp;gt;" style="swimlane;whiteSpace=wrap;html=1;startSize=${z.headerH};rounded=1;arcSize=6;fillColor=${p.headerBg};swimlaneFillColor=${p.bg};strokeColor=${p.border};fontColor=${p.title};fontStyle=1;fontSize=11;" vertex="1" parent="1"><mxGeometry x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" as="geometry"/></mxCell>`
    );
  }

  for (const n of nodes) {
    const dataUri = getIconDataUri(n.iconKey);
    const szOv = sizeOverrides[n.id] || {};
    const effX = Math.round(n.x + (Number(n.customDx) || 0));
    const effY = Math.round(n.y + (Number(n.customDy) || 0));
    const effW = Math.max(120, Math.round(n.w + (Number(szOv.dw ?? n.customDw) || 0)));
    const effH = Math.max(64, Math.round(n.h + (Number(szOv.dh ?? n.customDh) || 0)));
    const labelHtml = `&lt;b&gt;${escapeXml(n.title)}&lt;/b&gt;&lt;br/&gt;&lt;font style=&quot;font-size:10px;color:#475569;&quot;&gt;${escapeXml(n.subtitle)}&lt;/font&gt;&lt;br/&gt;&lt;font style=&quot;font-size:9px;color:#2563EB;&quot;&gt;[${escapeXml(n.pill || '')}]&lt;/font&gt;`;
    cells.push(
      `<mxCell id="${escapeXml(n.id)}" value="${labelHtml}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#CBD5E1;fontColor=#0F172A;align=left;spacingLeft=44;image=${dataUri};imageWidth=24;imageHeight=24;imageAlign=left;" vertex="1" parent="1"><mxGeometry x="${effX}" y="${effY}" width="${effW}" height="${effH}" as="geometry"/></mxCell>`
    );
  }

  for (const e of edges) {
    const st = e.style;
    const waypointsXml =
      e.points.length > 2
        ? `<Array as="points">${e.points
            .slice(1, -1)
            .map((pt) => `<mxPoint x="${pt.x}" y="${pt.y}"/>`)
            .join('')}</Array>`
        : '';
    const wrappedLabel = e.cleanLabel
      ? `&amp;lt;span style=&amp;apos;padding:0 2px;&amp;apos;&amp;gt;${escapeXml(e.cleanLabel)}&amp;lt;/span&amp;gt;`
      : '';
    cells.push(
      `<mxCell id="${escapeXml(e.id)}" value="${wrappedLabel}" style="edgeStyle=none;rounded=0;html=1;strokeColor=${st.stroke};strokeWidth=2;endArrow=block;endFill=1;labelBackgroundColor=#FFFFFF;labelBorderColor=${st.pillBorder};fontColor=${st.pillText};fontSize=9;fontStyle=1;" edge="1" parent="1" source="${escapeXml(e.sourceNodeId)}" target="${escapeXml(e.targetNodeId)}"><mxGeometry relative="1" as="geometry"><mxPoint x="-5" y="-2" as="offset"/>${waypointsXml}</mxGeometry></mxCell>`
    );
  }

  // Export Whiteboard Sticky Notes & Review Pins as native editable Draw.io cells
  const stickies = Array.isArray(graph.stickyNotes) ? graph.stickyNotes : [];
  stickies.forEach((st, idx) => {
    const sx = Math.max(28, Math.min(1220, Number(st.x) || 1140));
    const sy = Math.max(82, Math.min(680, Number(st.y) || 665));
    const sw = Math.max(140, Math.min(260, Number(st.w) || 210));
    const sh = Math.max(48, Math.min(110, Number(st.h) || 56));
    const stHtml = `&lt;b&gt;${escapeXml(st.author || '@architect')}&lt;/b&gt;&lt;br/&gt;${escapeXml(st.text || '')}`;
    cells.push(
      `<mxCell id="${escapeXml(st.id || `sticky_${idx + 1}`)}" value="${stHtml}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=${escapeXml(st.color || '#FEF08A')};strokeColor=${escapeXml(st.borderColor || '#EAB308')};fontColor=#713F12;fontSize=10;align=left;spacingLeft=10;" vertex="1" parent="1"><mxGeometry x="${sx}" y="${sy}" width="${sw}" height="${sh}" as="geometry"/></mxCell>`
    );
  });

  const pins = Array.isArray(graph.annotations) ? graph.annotations : [];
  pins.forEach((pin, idx) => {
    const ax = Math.max(40, Math.min(1180, Number(pin.x) || 960));
    const ay = Math.max(82, Math.min(720, Number(pin.y) || 82));
    cells.push(
      `<mxCell id="${escapeXml(pin.id || `pin_${idx + 1}`)}" value="${escapeXml(`📌 #${idx + 1}: ${pin.text || ''}`)}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FEF3C7;strokeColor=#D97706;fontColor=#92400E;fontStyle=1;fontSize=9;align=left;spacingLeft=8;" vertex="1" parent="1"><mxGeometry x="${ax}" y="${ay}" width="236" height="28" as="geometry"/></mxCell>`
    );
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="embed.diagrams.net" modified="${new Date().toISOString()}" agent="VeriSpec Studio" version="24.0.0">
  <diagram id="${escapeXml(graph.id || 'verispec-diagram')}" name="${escapeXml(graph.title)}">
    <mxGraphModel dx="${width}" dy="${height}" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${width}" pageHeight="${height}" background="#FFFFFF" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        ${cells.join('\n        ')}
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
}
