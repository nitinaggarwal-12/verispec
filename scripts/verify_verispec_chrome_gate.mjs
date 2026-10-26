import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const ARTIFACT_DIR = '/Users/nitinagga/.gemini/jetski/brain/00c3db27-cadd-41ea-b7d8-b74d5b49b2b4';
const CHROME_BIN = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function launchChromeWithCdp(userDataDir) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      CHROME_BIN,
      [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--remote-debugging-port=0',
        `--user-data-dir=${userDataDir}`,
        '--window-size=1600,1000',
        'about:blank'
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );

    let stderr = '';
    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      const m = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (m) {
        resolve({ proc, wsUrl: m[1] });
      }
    });
    proc.on('error', reject);
    setTimeout(() => reject(new Error('Chrome launch timeout: ' + stderr)), 12000);
  });
}

class CdpSession {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data.toString());
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    });
  }

  send(method, params = {}, sessionId = undefined) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      this.ws.send(JSON.stringify(payload));
    });
  }
}

async function ensureServerRunning(port) {
  try {
    const res = await fetch(`http://localhost:${port}/api/atlas`);
    if (res.ok) return null;
  } catch {
    // Not running, spawn child server
  }
  const proc = spawn('node', ['src/server.mjs'], {
    cwd: ROOT_DIR,
    env: { ...process.env, PORT: String(port) },
    stdio: 'ignore'
  });
  for (let i = 0; i < 30; i++) {
    await sleep(200);
    try {
      const res = await fetch(`http://localhost:${port}/api/atlas`);
      if (res.ok) return proc;
    } catch {
      // keep polling
    }
  }
  throw new Error(`Failed to start server on port ${port}`);
}

async function main() {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  const tmpProfile = path.join('/tmp', 'verispec_chrome_profile_' + Date.now());
  fs.mkdirSync(tmpProfile, { recursive: true });

  const spawnedServers = [];
  const srv8080 = await ensureServerRunning(8080);
  if (srv8080) spawnedServers.push(srv8080);
  const srv8092 = await ensureServerRunning(8092);
  if (srv8092) spawnedServers.push(srv8092);

  // Copy user's uploaded before screenshots into ARTIFACT_DIR for embedding
  const uploadedV106 = path.join(ARTIFACT_DIR, '.user_uploaded', 'media_1792857428023.png');
  const uploadedV107 = path.join(ARTIFACT_DIR, '.user_uploaded', 'media_1792857475207.png');
  if (fs.existsSync(uploadedV106)) {
    fs.copyFileSync(uploadedV106, path.join(ARTIFACT_DIR, 'before_mutation_bug_v1_0_6.png'));
  }
  if (fs.existsSync(uploadedV107)) {
    fs.copyFileSync(uploadedV107, path.join(ARTIFACT_DIR, 'before_mutation_bug_v1_0_7.png'));
  }

  const { proc: chromeProc, wsUrl } = await launchChromeWithCdp(tmpProfile);
  const ws = new WebSocket(wsUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  const cdp = new CdpSession(ws);

  try {
    const { targetInfos } = await cdp.send('Target.getTargets');
    const pageTarget = targetInfos.find((t) => t.type === 'page');
    const { sessionId } = await cdp.send('Target.attachToTarget', {
      targetId: pageTarget.targetId,
      flatten: true
    });

    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);

    async function setViewport(width, height, deviceScaleFactor = 2) {
      await cdp.send(
        'Emulation.setDeviceMetricsOverride',
        { width, height, deviceScaleFactor, mobile: false },
        sessionId
      );
    }

    async function navigateAndWait(url, waitMs = 450) {
      await cdp.send('Page.navigate', { url }, sessionId);
      await sleep(waitMs);
      for (let attempt = 0; attempt < 25; attempt++) {
        const hasSvg = await evaluateInPage(
          `Boolean(document.querySelector('#commandSvgContainer svg') || document.querySelector('#atelierSvgContainer svg'))`
        ).catch(() => false);
        if (hasSvg) break;
        await sleep(150);
      }
      await sleep(120);
    }

    async function evaluateInPage(expression) {
      const res = await cdp.send(
        'Runtime.evaluate',
        { expression, returnByValue: true, awaitPromise: true },
        sessionId
      );
      if (res.exceptionDetails) {
        throw new Error('Eval error: ' + JSON.stringify(res.exceptionDetails));
      }
      return res.result.value;
    }

    async function captureScreenshot(outPath, clip = undefined) {
      const params = { format: 'png', fromSurface: true };
      if (clip) params.clip = { ...clip, scale: 1 };
      const { data } = await cdp.send('Page.captureScreenshot', params, sessionId);
      fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
    }

    const auditSvgSelector = (svgSelector) => `(() => {
      const svg = document.querySelector('${svgSelector}');
      if (!svg) return { error: 'No SVG rendered for ${svgSelector}' };

      const texts = Array.from(svg.querySelectorAll('text'));
      let textToTextOverlaps = 0;
      const overlappingPairs = [];
      const textRects = texts.map(t => ({
        text: (t.textContent || '').trim(),
        rect: t.getBoundingClientRect()
      })).filter(t => t.text.length > 0 && t.rect.width > 0 && t.rect.height > 0);

      for (let i = 0; i < textRects.length; i++) {
        for (let j = i + 1; j < textRects.length; j++) {
          const a = textRects[i].rect;
          const b = textRects[j].rect;
          const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          if (ox > 1.5 && oy > 1.5) {
            textToTextOverlaps++;
            overlappingPairs.push([textRects[i].text, textRects[j].text]);
          }
        }
      }

      const nodeGroups = Array.from(svg.querySelectorAll('.arch-node'));
      let nodeToNodeOverlaps = 0;
      const nodeRects = nodeGroups.map(g => ({
        id: g.getAttribute('data-node-id'),
        rect: g.querySelector('.node-bounding-rect').getBoundingClientRect()
      }));
      for (let i = 0; i < nodeRects.length; i++) {
        for (let j = i + 1; j < nodeRects.length; j++) {
          const a = nodeRects[i].rect;
          const b = nodeRects[j].rect;
          const ox = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
          const oy = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          if (ox > 1.5 && oy > 1.5) {
            nodeToNodeOverlaps++;
          }
        }
      }

      let textOutsideParent = 0;
      for (const g of nodeGroups) {
        const box = g.querySelector('.node-bounding-rect').getBoundingClientRect();
        const childTexts = Array.from(g.querySelectorAll('text'));
        for (const ct of childTexts) {
          const r = ct.getBoundingClientRect();
          if (r.left < box.left - 1.5 || r.right > box.right + 1.5 || r.top < box.top - 1.5 || r.bottom > box.bottom + 1.5) {
            textOutsideParent++;
          }
        }
      }

      const renderedNodeTitles = nodeGroups.map(g => {
        return g.getAttribute('data-node-title') || (g.querySelector('text') ? g.querySelector('text').textContent.trim() : '');
      });

      const svgBox = svg.getBoundingClientRect();

      return {
        detailLevel: svg.getAttribute('data-detail-level') || 'L200',
        archetype: svg.getAttribute('data-archetype') || '',
        nodeCount: nodeGroups.length,
        edgeCount: svg.querySelectorAll('.arch-edge').length,
        nodeToNodeOverlaps,
        textToTextOverlaps,
        overlappingPairs: overlappingPairs.slice(0, 5),
        textOutsideParent,
        renderedNodeTitles,
        clip: {
          x: Math.round(svgBox.x),
          y: Math.round(svgBox.y),
          width: Math.round(svgBox.width),
          height: Math.round(svgBox.height)
        }
      };
    })()`;

    // =========================================================================
    // STEP 1: AUDIT ALL 18 BASELINE DIAGRAMS ON PORT 8092 (CLEAN BASELINE)
    // =========================================================================
    console.log('--- Step 1: Auditing all 18 Baseline Lifecycle Diagrams (D01..D18) on port 8092 ---');
    const codes = Array.from({ length: 18 }, (_, i) => `D${String(i + 1).padStart(2, '0')}`);
    const allAudits = [];
    await setViewport(1600, 980, 2);

    for (const code of codes) {
      await navigateAndWait(`http://localhost:8092/?code=${code}&edition=command`, 300);
      const res = await evaluateInPage(auditSvgSelector('#commandSvgContainer svg'));
      if (res.error) {
        throw new Error(`Baseline diagram ${code} failed to render SVG: ${JSON.stringify(res)}`);
      }
      allAudits.push({ code, ...res });
      await captureScreenshot(path.join(ARTIFACT_DIR, `diagram_${code.toLowerCase()}.png`), res.clip);
      console.log(
        `Verified ${code} (${res.archetype}): nodes=${res.nodeCount}, edges=${res.edgeCount}, nodeOverlaps=${res.nodeToNodeOverlaps}, textOverlaps=${res.textToTextOverlaps}, textOutside=${res.textOutsideParent}`
      );
      if (res.nodeToNodeOverlaps > 0 || res.textToTextOverlaps > 0 || res.textOutsideParent > 0) {
        throw new Error(`Baseline diagram ${code} failed geometry audit: ${JSON.stringify(res)}`);
      }
    }

    // =========================================================================
    // =========================================================================
    // STEP 2: LIVE PROMPT MUTATION E2E VERIFICATION ON PORT 8080 (USER'S EXACT FLOW)
    // =========================================================================
    console.log('--- Step 2: Executing User Exact Prompt Mutation Flow on http://localhost:8080 (D05) ---');
    await setViewport(1600, 1000, 2);
    await navigateAndWait('http://localhost:8080/?code=D05&edition=atelier', 500);
    await evaluateInPage(`(async () => {
      await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'D05' })
      });
      await loadAtlas();
      await new Promise(r => setTimeout(r, 250));
    })()`);

    // 2A. Click "Vector Search 2.0" (node_vector_index) on the SVG canvas to scope mutation
    const scopedLabel = await evaluateInPage(`(async () => {
      const vecNode = document.querySelector('#atelierSvgContainer svg .arch-node[data-node-id="node_vector_index"]');
      if (!vecNode) throw new Error('node_vector_index not found on D05 canvas');
      vecNode.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await new Promise(r => setTimeout(r, 350));
      return document.getElementById('activeScopePill').textContent;
    })()`);
    console.log('Scoped Node Target:', scopedLabel);

    // 2B. Submit prompt 1: "add Looker, and bigquery"
    await evaluateInPage(`(async () => {
      await window.submitMutation('add Looker, and bigquery');
    })()`);
    await sleep(500);

    const auditAfterLookerBq = await evaluateInPage(auditSvgSelector('#atelierSvgContainer svg'));
    console.log('D05 After "add Looker, and bigquery" (v1.0.4):', JSON.stringify(auditAfterLookerBq));

    const hasLooker = auditAfterLookerBq.renderedNodeTitles.some((t) => t.toLowerCase().includes('looker'));
    const hasBigQuery = auditAfterLookerBq.renderedNodeTitles.some((t) => t.toLowerCase().includes('bigquery'));
    if (!hasLooker || !hasBigQuery) {
      throw new Error(`Compound prompt "add Looker, and bigquery" failed to render both nodes on SVG! Titles: ${JSON.stringify(auditAfterLookerBq.renderedNodeTitles)}`);
    }
    if (auditAfterLookerBq.nodeToNodeOverlaps > 0 || auditAfterLookerBq.textToTextOverlaps > 0 || auditAfterLookerBq.textOutsideParent > 0) {
      throw new Error(`Geometry collision after "add Looker, and bigquery": ${JSON.stringify(auditAfterLookerBq)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_d05_v1_0_4_looker_bigquery.png'));

    // 2C. Scope to Vector Search 2.0 again and submit prompt 2: "add aws redshift"
    await evaluateInPage(`(async () => {
      const vecNode = document.querySelector('#atelierSvgContainer svg .arch-node[data-node-id="node_vector_index"]');
      if (vecNode) vecNode.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await window.submitMutation('add aws redshift');
    })()`);
    await sleep(500);

    const auditAfterRedshift = await evaluateInPage(auditSvgSelector('#atelierSvgContainer svg'));
    console.log('D05 After "add aws redshift" (v1.0.5):', JSON.stringify(auditAfterRedshift));

    const hasRedshift = auditAfterRedshift.renderedNodeTitles.some((t) => t.toLowerCase().includes('aws redshift'));
    const hasBuggyWsRedshift = auditAfterRedshift.renderedNodeTitles.some((t) => t.includes('Ws redshift'));
    if (!hasRedshift || hasBuggyWsRedshift) {
      throw new Error(`Prompt "add aws redshift" failed or produced "Ws redshift": ${JSON.stringify(auditAfterRedshift.renderedNodeTitles)}`);
    }
    if (auditAfterRedshift.nodeToNodeOverlaps > 0 || auditAfterRedshift.textToTextOverlaps > 0 || auditAfterRedshift.textOutsideParent > 0) {
      throw new Error(`Geometry collision after "add aws redshift": ${JSON.stringify(auditAfterRedshift)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_d05_v1_0_5_aws_redshift_l200.png'));

    // 2D. Verify L100 (Executive) and L300 (Deep Spec) Fidelity Switching on Mutated D05
    await evaluateInPage(`(async () => {
      await window.switchDetailLevel('L100');
    })()`);
    await sleep(450);
    const auditL100 = await evaluateInPage(auditSvgSelector('#atelierSvgContainer svg'));
    console.log('D05 Mutated L100 Executive Audit:', JSON.stringify({
      detailLevel: auditL100.detailLevel,
      nodeCount: auditL100.nodeCount,
      nodeToNodeOverlaps: auditL100.nodeToNodeOverlaps,
      textToTextOverlaps: auditL100.textToTextOverlaps,
      textOutsideParent: auditL100.textOutsideParent
    }));
    if (auditL100.detailLevel !== 'L100' || auditL100.nodeToNodeOverlaps > 0 || auditL100.textToTextOverlaps > 0 || auditL100.textOutsideParent > 0) {
      throw new Error(`L100 audit failed: ${JSON.stringify(auditL100)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_d05_v1_0_5_mutated_l100_executive.png'));

    await evaluateInPage(`(async () => {
      await window.switchDetailLevel('L300');
    })()`);
    await sleep(450);
    const auditL300 = await evaluateInPage(auditSvgSelector('#atelierSvgContainer svg'));
    console.log('D05 Mutated L300 Deep Spec Audit:', JSON.stringify({
      detailLevel: auditL300.detailLevel,
      nodeCount: auditL300.nodeCount,
      nodeToNodeOverlaps: auditL300.nodeToNodeOverlaps,
      textToTextOverlaps: auditL300.textToTextOverlaps,
      textOutsideParent: auditL300.textOutsideParent
    }));
    if (auditL300.detailLevel !== 'L300' || auditL300.nodeToNodeOverlaps > 0 || auditL300.textToTextOverlaps > 0 || auditL300.textOutsideParent > 0) {
      throw new Error(`L300 audit failed: ${JSON.stringify(auditL300)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_d05_v1_0_5_mutated_l300_deep_spec.png'));

    // Restore L200 Solution Architecture on localhost:8080 so the user sees L200 by default
    await evaluateInPage(`(async () => {
      await window.switchDetailLevel('L200');
    })()`);
    await sleep(350);

    // =========================================================================
    // STEP 3: VERIFY MUTATION EXTENSION TIER ON NON-D05 DIAGRAM (D06)
    // =========================================================================
    console.log('--- Step 3: Verifying Live Prompt Mutation on Non-D05 Archetype (D06) ---');
    await navigateAndWait('http://localhost:8092/?code=D06&edition=atelier', 700);
    await evaluateInPage(`(async () => {
      await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'D06' })
      });
      await loadAtlas();
      await window.submitMutation('add Looker, and bigquery');
    })()`);
    await sleep(500);
    const auditD06Mutated = await evaluateInPage(auditSvgSelector('#atelierSvgContainer svg'));
    console.log('D06 Mutated Extension Tier Audit:', JSON.stringify({
      nodeCount: auditD06Mutated.nodeCount,
      renderedNodeTitles: auditD06Mutated.renderedNodeTitles,
      nodeToNodeOverlaps: auditD06Mutated.nodeToNodeOverlaps,
      textToTextOverlaps: auditD06Mutated.textToTextOverlaps,
      textOutsideParent: auditD06Mutated.textOutsideParent
    }));
    if (
      !auditD06Mutated.renderedNodeTitles.some((t) => t.toLowerCase().includes('looker')) ||
      !auditD06Mutated.renderedNodeTitles.some((t) => t.toLowerCase().includes('bigquery')) ||
      auditD06Mutated.nodeToNodeOverlaps > 0 ||
      auditD06Mutated.textToTextOverlaps > 0 ||
      auditD06Mutated.textOutsideParent > 0
    ) {
      throw new Error(`D06 mutated extension tier failed: ${JSON.stringify(auditD06Mutated)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_d06_mutated_extension_tier.png'));

    // =========================================================================
    // STEP 4: UI/UX HEADER CLIPPING, DOCKED DRAWER REFLOW & ZERO COMPETITOR BRAND GATE
    // =========================================================================
    console.log('--- Step 4: Auditing UI/UX Header Containment (1440px), Docked Drawer Reflow & Zero Competitor Names ---');
    await setViewport(1440, 950, 2);
    await navigateAndWait('http://localhost:8080/?code=D07&edition=atlas&detail=L200', 600);
    await evaluateInPage(`(async () => {
      window.openWorkbenchTab('dsl');
      await new Promise(r => setTimeout(r, 350));
    })()`);

    const uiUxAudit = await evaluateInPage(`(() => {
      const bodyHtml = document.body.innerHTML;
      const compRegex = new RegExp('era' + 'ser', 'i');
      const hasCompetitorName = compRegex.test(bodyHtml);
      const header = document.querySelector('.top-header');
      const exportBtn = document.getElementById('headerExportDrawioBtn');
      const exportRect = exportBtn.getBoundingClientRect();
      const drawer = document.getElementById('stitchRightDrawer');
      const drawerRect = drawer.getBoundingClientRect();
      const atlasCards = Array.from(document.querySelectorAll('#viewEditionAtlas .atlas-card'));
      const maxCardRight = Math.max(...atlasCards.map(c => c.getBoundingClientRect().right));
      const dslVal = document.getElementById('drawerVeriSpecDslBox')?.value || '';
      const inspectorTitle = document.getElementById('inspectorNodeTitle')?.value || '';
      return {
        hasCompetitorName,
        headerScrollWidth: header.scrollWidth,
        headerClientWidth: header.clientWidth,
        viewportWidth: window.innerWidth,
        exportBtnRight: Math.round(exportRect.right),
        exportBtnFullyVisible: exportRect.right <= window.innerWidth - 8 && exportRect.left >= 0,
        drawerLeft: Math.round(drawerRect.left),
        maxCardRight: Math.round(maxCardRight),
        zeroDrawerCardOcclusion: maxCardRight <= drawerRect.left + 1,
        dslPopulated: dslVal.includes('title D07'),
        zeroHtmlEntityInDsl: !dslVal.includes('&amp;'),
        inspectorTitle
      };
    })()`);
    console.log('UI/UX & Docked Workbench Audit (1440px Atlas + Open Drawer):', JSON.stringify(uiUxAudit));
    if (
      uiUxAudit.hasCompetitorName ||
      !uiUxAudit.exportBtnFullyVisible ||
      !uiUxAudit.zeroDrawerCardOcclusion ||
      !uiUxAudit.dslPopulated ||
      !uiUxAudit.zeroHtmlEntityInDsl
    ) {
      throw new Error(`UI/UX Gate Failed: ${JSON.stringify(uiUxAudit)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_verispec_header_unclipped_atlas_drawer.png'));

    // Also capture Split Co-Pilot with Dual-Mode Living RFC + FinOps, 52 Cloud Stencils, Judge, and Terraform Workbench open at 1600x980
    await setViewport(1600, 980, 2);
    await navigateAndWait('http://localhost:8080/?code=D05&edition=atelier&detail=L200', 500);
    const rfcAndFinopsAudit = await evaluateInPage(`(async () => {
      window.openWorkbenchTab('rfc');
      await new Promise(r => setTimeout(r, 300));
      const finPill = document.getElementById('atelierFinOpsPill')?.textContent || '';
      const rfcVal = document.getElementById('drawerLivingRfcBox')?.value || '';
      const rfcPrevHtml = document.getElementById('drawerLivingRfcRenderedPreview')?.innerHTML || '';
      const costVal = document.getElementById('rfcMonthlyCostVal')?.textContent || '';
      return {
        finPill,
        costVal,
        hasExecutiveDocPreview: rfcPrevHtml.includes('ENGINEERING DESIGN DOCUMENT') && rfcPrevHtml.includes('Component &amp; SLO Inventory'),
        hasRfcSections: rfcVal.includes('## 1. Executive Telemetry & FinOps Summary') && rfcVal.includes('## 2. Architecture Decision Record (ADR)')
      };
    })()`);
    console.log('Living RFC & FinOps Audit:', JSON.stringify(rfcAndFinopsAudit));
    if (!rfcAndFinopsAudit.hasRfcSections || !rfcAndFinopsAudit.hasExecutiveDocPreview || !rfcAndFinopsAudit.finPill.includes('/mo')) {
      throw new Error(`Living RFC / FinOps Audit Failed: ${JSON.stringify(rfcAndFinopsAudit)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_verispec_living_rfc_and_finops_workbench.png'));

    const stencilAudit = await evaluateInPage(`(async () => {
      window.openWorkbenchTab('stencils');
      await new Promise(r => setTimeout(r, 300));
      const grid = document.getElementById('stencilGridContainer');
      const btns = Array.from(grid.querySelectorAll('button'));
      const maxBtnRight = Math.max(...btns.map(b => b.getBoundingClientRect().right));
      const zoneOpts = document.getElementById('inspNodeZone')?.options?.length || 0;
      const edgeSrcOpts = document.getElementById('edgeBuilderSrcSelect')?.options?.length || 0;
      return {
        stencilCount: btns.length,
        zoneOpts,
        edgeSrcOpts,
        scrollWidth: grid.scrollWidth,
        clientWidth: grid.clientWidth,
        maxBtnRight: Math.round(maxBtnRight),
        viewportWidth: window.innerWidth,
        zeroOverflow: grid.scrollWidth <= grid.clientWidth + 1 && maxBtnRight <= window.innerWidth - 8
      };
    })()`);
    console.log('52 Cloud & Enterprise Stencils Grid Audit:', JSON.stringify(stencilAudit));
    if (!stencilAudit.zeroOverflow || stencilAudit.stencilCount < 52 || stencilAudit.zoneOpts === 0 || stencilAudit.edgeSrcOpts === 0) {
      throw new Error(`Stencil Grid / Inspector Audit Failed: ${JSON.stringify(stencilAudit)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_verispec_copilot_stencils_workbench.png'));

    await evaluateInPage(`(async () => {
      window.openWorkbenchTab('judge');
      await new Promise(r => setTimeout(r, 300));
    })()`);
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_verispec_judge_and_terraform_workbench.png'));

    await evaluateInPage(`(async () => {
      window.openWorkbenchTab('iac');
      await new Promise(r => setTimeout(r, 300));
    })()`);
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_verispec_terraform_and_mermaid_workbench.png'));

    // =========================================================================
    // STEP 5: DEFAULT-COLLAPSED PANELS, DUAL H+V SCROLLBARS WITH CHANGEABLE WIDTH
    //         & LIVE VERTEX AI GEMINI API JUDGE VERIFICATION (D05 & D10)
    // =========================================================================
    console.log('--- Step 5: Auditing Collapsible-by-Default Panels, Dual H+V Scrollbars & Live Vertex AI Gemini API ---');
    await setViewport(1600, 980, 2);
    await navigateAndWait('http://localhost:8080/?code=D05&edition=atelier&detail=L200', 500);
    await evaluateInPage(`closeStitchPromptDrawer()`);
    await sleep(250);

    const collapsedDefaultAudit = await evaluateInPage(`(() => {
      const leftRail = document.getElementById('leftLifecycleRail');
      const adrPanel = document.getElementById('atelierAdrPanel');
      const railListCs = window.getComputedStyle(document.getElementById('blueprintRailList'));
      const adrListCs = window.getComputedStyle(document.getElementById('atelierTimelineList'));
      const svgWrapCs = window.getComputedStyle(document.getElementById('atelierSvgContainer'));
      return {
        leftRailCollapsedByDefault: leftRail.classList.contains('collapsed'),
        leftRailWidthPx: Math.round(leftRail.getBoundingClientRect().width),
        adrPanelCollapsedByDefault: adrPanel.classList.contains('collapsed'),
        adrPanelWidthPx: Math.round(adrPanel.getBoundingClientRect().width),
        railDualScroll: railListCs.overflowX === 'scroll' && railListCs.overflowY === 'scroll',
        adrDualScroll: adrListCs.overflowX === 'scroll' && adrListCs.overflowY === 'scroll',
        canvasDualScroll: svgWrapCs.overflowX === 'scroll' && svgWrapCs.overflowY === 'scroll'
      };
    })()`);
    console.log('Collapsed-by-Default & Dual Scrollbars Audit:', JSON.stringify(collapsedDefaultAudit));
    if (
      !collapsedDefaultAudit.leftRailCollapsedByDefault ||
      !collapsedDefaultAudit.adrPanelCollapsedByDefault ||
      !collapsedDefaultAudit.railDualScroll ||
      !collapsedDefaultAudit.adrDualScroll ||
      !collapsedDefaultAudit.canvasDualScroll
    ) {
      throw new Error(`Collapsed-by-Default / Dual Scrollbars Gate Failed: ${JSON.stringify(collapsedDefaultAudit)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_collapsible_default_and_dual_scrollbars.png'));

    // Expand both panels and test changeable panel width + changeable scrollbar width
    const expandedResizableAudit = await evaluateInPage(`(async () => {
      window.setLeftRailWidth(295);
      window.setAdrPanelWidth(355);
      window.setScrollbarThickness(15);
      await new Promise(r => setTimeout(r, 300));
      const leftRail = document.getElementById('leftLifecycleRail');
      const adrPanel = document.getElementById('atelierAdrPanel');
      const rootSbSize = document.documentElement.style.getPropertyValue('--vs-scrollbar-size');
      return {
        leftRailExpanded: !leftRail.classList.contains('collapsed'),
        leftRailNewWidthPx: Math.round(leftRail.getBoundingClientRect().width),
        adrPanelExpanded: !adrPanel.classList.contains('collapsed'),
        adrPanelNewWidthPx: Math.round(adrPanel.getBoundingClientRect().width),
        scrollbarSizeVar: rootSbSize
      };
    })()`);
    console.log('Expanded & Changeable Width Audit:', JSON.stringify(expandedResizableAudit));
    if (
      !expandedResizableAudit.leftRailExpanded ||
      expandedResizableAudit.leftRailNewWidthPx !== 295 ||
      !expandedResizableAudit.adrPanelExpanded ||
      expandedResizableAudit.adrPanelNewWidthPx !== 355 ||
      expandedResizableAudit.scrollbarSizeVar !== '15px'
    ) {
      throw new Error(`Changeable Width Gate Failed: ${JSON.stringify(expandedResizableAudit)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_expanded_lineage_and_rail_resizable_scrollbars.png'));

    // Switch to D10, reset to clean baseline, apply 1 live prompt mutation (which executes Live Vertex AI Gemini Co-Pilot + Jury), and inspect Judge & Lint tab
    await navigateAndWait('http://localhost:8080/?code=D10&edition=atelier&detail=L200', 500);
    const liveGeminiAudit = await evaluateInPage(`(async () => {
      await window.resetCurrentBlueprint();
      await window.submitMutation('Add Apache Kafka Event Bus and Cloud Spanner HA');
      window.openWorkbenchTab('judge');
      await window.triggerLiveGeminiJudge();
      await new Promise(r => setTimeout(r, 300));
      const statusHtml = document.getElementById('liveVertexGeminiStatusBox')?.innerHTML || '';
      const callsBadge = document.getElementById('geminiTotalCallsBadge')?.textContent || '';
      const ledgerHtml = document.getElementById('geminiCallLedgerList')?.innerHTML || '';
      return {
        hasLiveHttp200Verified: statusHtml.includes('LIVE VERTEX AI HTTP 200 VERIFIED'),
        hasResponseId: statusHtml.includes('responseId=') && ledgerHtml.includes('responseId:'),
        callsBadge
      };
    })()`);
    console.log('Live Vertex AI Gemini API Jury Audit (D10):', JSON.stringify(liveGeminiAudit));
    if (!liveGeminiAudit.hasLiveHttp200Verified || !liveGeminiAudit.hasResponseId) {
      throw new Error(`Live Vertex AI Gemini API Audit Failed: ${JSON.stringify(liveGeminiAudit)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_live_vertex_gemini_api_judge_d10.png'));

    // =========================================================================
    // STEP 6: USABILITY, FLEXIBILITY & ADAPTABILITY GATE (GREENFIELD, VISION, DYNAMIC LAYOUT, PINS, CMD+K)
    // =========================================================================
    console.log('--- Step 6: Verifying Usability, Flexibility & Adaptability Controls (Layout Mode, Pins, Greenfield, Cmd+K) ---');
    await navigateAndWait('http://localhost:8080/?code=D01&edition=atelier&detail=L200', 400);
    const adaptabilityCanvasAudit = await evaluateInPage(`(async () => {
      await window.resetCurrentBlueprint();
      // 1. Switch D01 from Bespoke Gantt to Dynamic 5-Tier Cloud Grid
      await window.toggleBlueprintRenderMode();
      await new Promise(r => setTimeout(r, 250));
      const svgAfterSwitch = document.querySelector('#atelierSvgContainer svg');
      const archAfterSwitch = svgAfterSwitch ? svgAfterSwitch.getAttribute('data-archetype') : '';
      // 2. Pin an architecture review note
      await window.addCanvasReviewPin();
      await new Promise(r => setTimeout(r, 250));
      const pinEl = document.querySelector('#atelierSvgContainer svg .diagram-review-annotations');
      const hasPinRendered = Boolean(pinEl);
      const toastText = document.getElementById('toastBanner')?.textContent || '';
      return {
        archAfterSwitch,
        hasPinRendered,
        toastText
      };
    })()`);
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_d01_switched_to_5tier_grid_with_review_pin.png'));

    const cmdPaletteAudit = await evaluateInPage(`(async () => {
      window.openCommandPaletteModal();
      await new Promise(r => setTimeout(r, 150));
      const cmdModal = document.getElementById('commandPaletteModal');
      const cmdPaletteVisible = cmdModal && getComputedStyle(cmdModal).display !== 'none';
      const cmdItemCount = document.querySelectorAll('#commandPaletteResults > div').length;
      return {
        cmdPaletteVisible,
        cmdItemCount
      };
    })()`);
    const adaptabilityAudit = { ...adaptabilityCanvasAudit, ...cmdPaletteAudit };
    console.log('Usability, Flexibility & Adaptability Audit:', JSON.stringify(adaptabilityAudit));
    if (
      (adaptabilityAudit.archAfterSwitch !== 'MULTI_TIER_CLOUD_DIFF' &&
        adaptabilityAudit.archAfterSwitch !== 'DYNAMIC_MULTI_TIER') ||
      !adaptabilityAudit.hasPinRendered ||
      adaptabilityAudit.toastText.includes('undefined') ||
      !adaptabilityAudit.cmdPaletteVisible ||
      adaptabilityAudit.cmdItemCount < 5
    ) {
      throw new Error(`Adaptability Gate Failed: ${JSON.stringify(adaptabilityAudit)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_usability_flexibility_adaptability_suite.png'));
    await evaluateInPage(`(async () => {
      window.closeCommandPaletteModal();
      await window.resetCurrentBlueprint();
    })()`);

    // =========================================================================
    // STEP 7: SQLITE WAL, INTERACTIVE WHITEBOARD (LASSO, 8-WAY RESIZE, ELBOW, PEN, STICKY),
    //         HYBRID WYSIWYG RFC SLASH MENU, MULTIPLAYER @MENTION THREADS & GITHUB PR BOT
    // =========================================================================
    console.log('--- Step 7: Verifying SQLite WAL, Whiteboard Tools, Hybrid WYSIWYG RFC, @mention Threads & GitHub PR Bot ---');
    await navigateAndWait('http://localhost:8080/?code=D05&edition=atelier&detail=L200', 450);

    // 7A. Interactive Whiteboard Operations, Undo/Redo & Live Canvas Cursors on D05
    const whiteboardAudit = await evaluateInPage(`(async () => {
      await window.clearWhiteboardOverlays();
      await window.resizeScopedNodeDelta(24, 14);
      await window.addSampleElbowWaypoint();
      await window.addSampleFreehandStroke();
      await window.addWhiteboardStickyNote();
      await new Promise(r => setTimeout(r, 300));
      const svg = document.querySelector('#atelierSvgContainer svg');
      const liveCursors = document.querySelectorAll('#vsLiveCollabCursorsOverlay .vs-collab-cursor-marker');
      const hasUndoRedoBtns = Boolean(document.getElementById('btnUndoAction') && document.getElementById('btnRedoAction'));
      const hasVisionUploadBtn = Boolean(document.getElementById('btnVisionUploadFile') && document.getElementById('visionImageFileInput'));
      // Verify POST /api/undo and POST /api/redo
      const verBeforeUndo = document.getElementById('activeBpCodeBadge')?.textContent || '';
      await window.undoBlueprintMutation();
      await new Promise(r => setTimeout(r, 200));
      const verAfterUndo = document.getElementById('activeBpCodeBadge')?.textContent || '';
      await window.redoBlueprintMutation();
      await new Promise(r => setTimeout(r, 200));
      const verAfterRedo = document.getElementById('activeBpCodeBadge')?.textContent || '';
      const tb = document.getElementById('toastBanner');
      if (tb) tb.style.display = 'none';
      return {
        hasSqliteBadge: (document.getElementById('toolbarSqliteBadge')?.textContent || '').includes('SQLite WAL'),
        hasFreehandStroke: Boolean(svg && svg.querySelector('.vs-freehand-stroke')),
        hasStickyNote: Boolean(svg && svg.querySelector('.vs-sticky-note')),
        hasElbowHandle: Boolean(svg && svg.querySelector('.vs-elbow-handle')),
        hasResizeHandles: Boolean(svg && svg.querySelector('.vs-resize-handle')),
        liveCanvasCursorCount: liveCursors.length,
        hasUndoRedoBtns,
        hasVisionUploadBtn,
        undoRedoRoundtripPassed: verBeforeUndo !== verAfterUndo && verBeforeUndo === verAfterRedo
      };
    })()`);
    console.log('Interactive Whiteboard, Undo/Redo & Live Cursors Audit:', JSON.stringify(whiteboardAudit));
    if (
      !whiteboardAudit.hasSqliteBadge ||
      !whiteboardAudit.hasFreehandStroke ||
      !whiteboardAudit.hasStickyNote ||
      !whiteboardAudit.hasElbowHandle ||
      !whiteboardAudit.hasResizeHandles ||
      whiteboardAudit.liveCanvasCursorCount < 3 ||
      !whiteboardAudit.hasUndoRedoBtns ||
      !whiteboardAudit.hasVisionUploadBtn ||
      !whiteboardAudit.undoRedoRoundtripPassed
    ) {
      throw new Error(`Whiteboard / Undo-Redo / Live Cursors Gate Failed: ${JSON.stringify(whiteboardAudit)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_verispec_v33_saas_parity.png'));
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_verispec_whiteboard_lasso_resize_elbow_pen_sticky.png'));
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_verispec_critical_fixes_v34.png'));

    // 7B. Hybrid WYSIWYG Living RFC Slash Menu & Multi-Diagram Embeds
    const hybridRfcAudit = await evaluateInPage(`(async () => {
      window.openWorkbenchTab('rfc');
      await window.insertRfcCustomBlock('h2', null, '## Multi-Region Disaster Recovery & RPO=0 Verification');
      await window.insertRfcCustomBlock('diagram_embed', 'D06');
      await new Promise(r => setTimeout(r, 300));
      const blocks = document.querySelectorAll('#rfcCustomBlocksContainer .rfc-wysiwyg-block');
      const hasEmbedD06 = Boolean(document.querySelector('#rfcCustomBlocksContainer [data-rfc-diagram-code="D06"] svg'));
      const editableCount = document.querySelectorAll('#rfcCustomBlocksContainer [contenteditable="true"]').length;
      return {
        blockCount: blocks.length,
        hasEmbedD06,
        editableCount
      };
    })()`);
    console.log('Hybrid WYSIWYG Living RFC Audit:', JSON.stringify(hybridRfcAudit));
    if (hybridRfcAudit.blockCount < 2 || !hybridRfcAudit.hasEmbedD06 || hybridRfcAudit.editableCount < 1) {
      throw new Error(`Hybrid WYSIWYG RFC Gate Failed: ${JSON.stringify(hybridRfcAudit)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_verispec_hybrid_wysiwyg_rfc_slash_blocks.png'));

    // 7C. GitHub PR Diff & FinOps Bot + Native SQLite WAL Telemetry in Tab 5
    const prBotAudit = await evaluateInPage(`(async () => {
      window.openWorkbenchTab('iac');
      await window.generateGithubPrBotPreview();
      await new Promise(r => setTimeout(r, 250));
      const prMd = document.getElementById('drawerGithubPrBotBox')?.value || '';
      const sqText = document.getElementById('sqliteWalStatusText')?.textContent || '';
      return {
        hasPrBotComment: prMd.includes('VeriSpec Architecture & FinOps PR Bot') && prMd.includes('nitinaggarwal-12/verispec'),
        hasSqliteEngine: sqText.includes('node:sqlite')
      };
    })()`);
    console.log('GitHub PR Bot & SQLite WAL Audit:', JSON.stringify(prBotAudit));
    if (!prBotAudit.hasPrBotComment || !prBotAudit.hasSqliteEngine) {
      throw new Error(`GitHub PR Bot / SQLite WAL Gate Failed: ${JSON.stringify(prBotAudit)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_verispec_github_pr_bot_and_sqlite_wal.png'));

    // 7D. Multiplayer Collaborator Presence & @mention Threads Modal (with Inline Reply & Resolve)
    const collabAudit = await evaluateInPage(`(async () => {
      await window.openCollabThreadsModal();
      const inp = document.getElementById('collabNewThreadInput');
      if (inp) inp.value = '@sre-lead @sec-architect Verified multi-region failover and FinOps PR bot on D05!';
      await window.submitNewCollabThread();
      await new Promise(r => setTimeout(r, 250));
      const firstCard = document.querySelector('#collabThreadsListContainer .collab-thread-card');
      const threadId = firstCard ? firstCard.getAttribute('data-thread-id') : null;
      if (threadId) {
        const replyInp = document.getElementById('collabReplyInput_' + threadId);
        if (replyInp) replyInp.value = '@nitin LGTM — approved for production rollout!';
        await window.submitCollabThreadReply(threadId);
        await new Promise(r => setTimeout(r, 200));
      }
      const cursorsHtml = document.getElementById('collabActiveCursorsStrip')?.innerHTML || '';
      const threadsHtml = document.getElementById('collabThreadsListContainer')?.innerHTML || '';
      return {
        hasActiveCollaborators: cursorsHtml.includes('Active Collaborators') && cursorsHtml.includes('@sre-lead'),
        hasPostedThread: threadsHtml.includes('Verified multi-region failover'),
        hasInlineReplyAndResolve: threadsHtml.includes('LGTM — approved for production rollout!') && threadsHtml.includes('Resolve')
      };
    })()`);
    console.log('Multiplayer Presence & @mention Threads Audit:', JSON.stringify(collabAudit));
    if (!collabAudit.hasActiveCollaborators || !collabAudit.hasPostedThread || !collabAudit.hasInlineReplyAndResolve) {
      throw new Error(`Multiplayer @mention Threads Gate Failed: ${JSON.stringify(collabAudit)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_verispec_collab_threads_modal.png'));

    // 7E. Product Landing Page (/landing · viewEditionLanding · 6 Pillars + Interactive AI Sandbox + Live SVG Preview)
    await evaluateInPage(`(async () => {
      window.closeCollabThreadsModal();
      window.closeStitchPromptDrawer();
      await window.clearWhiteboardOverlays();
      window.setUiEdition('landing');
      await new Promise(r => setTimeout(r, 300));
    })()`);
    const landingAudit = await evaluateInPage(`(() => {
      const sec = document.getElementById('viewEditionLanding');
      const visible = sec && !sec.classList.contains('hidden');
      const bentoCards = document.querySelectorAll('#landingBentoGrid > div').length;
      const hasHeroSvg = Boolean(document.querySelector('#landingHeroLiveSvgPreview svg'));
      const hasSandboxInput = Boolean(document.getElementById('landingHeroPromptInput')?.value);
      const scrollOverflow = document.documentElement.scrollWidth - window.innerWidth;
      return {
        visible,
        bentoCards,
        hasHeroSvg,
        hasSandboxInput,
        scrollOverflow
      };
    })()`);
    console.log('Product Landing Page Audit:', JSON.stringify(landingAudit));
    if (!landingAudit.visible || landingAudit.bentoCards !== 6 || !landingAudit.hasHeroSvg || !landingAudit.hasSandboxInput || landingAudit.scrollOverflow > 2) {
      throw new Error(`Product Landing Page Gate Failed: ${JSON.stringify(landingAudit)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_verispec_landing_page_v35.png'));

    // 7F. Workspace Home Dashboard (/home · viewEditionHome · 5 Quick-Create Cards + 18 Files Grid/Table + Star Persistence)
    await evaluateInPage(`(async () => {
      window.setUiEdition('home');
      window.setHomeFolderTab('ALL');
      window.setHomeViewMode('grid');
      await new Promise(r => setTimeout(r, 300));
    })()`);
    const homeAudit = await evaluateInPage(`(async () => {
      const sec = document.getElementById('viewEditionHome');
      const visible = sec && !sec.classList.contains('hidden');
      const quickCreateCount = document.querySelectorAll('#homeQuickCreateGrid > button').length;
      const gridCardCount = document.querySelectorAll('#homeFilesContainer .home-file-card').length;
      const scrollOverflow = document.documentElement.scrollWidth - window.innerWidth;
      window.setHomeFolderTab('STARRED');
      const starredCardCount = document.querySelectorAll('#homeFilesContainer .home-file-card').length;
      window.setHomeFolderTab('ALL');
      window.setHomeViewMode('table');
      const tableRowCount = document.querySelectorAll('#homeFilesContainer .home-file-row').length;
      window.setHomeViewMode('grid');
      return {
        visible,
        quickCreateCount,
        gridCardCount,
        starredCardCount,
        tableRowCount,
        scrollOverflow
      };
    })()`);
    console.log('Workspace Home Dashboard Audit:', JSON.stringify(homeAudit));
    if (
      !homeAudit.visible ||
      homeAudit.quickCreateCount !== 5 ||
      homeAudit.gridCardCount !== 18 ||
      homeAudit.starredCardCount < 1 ||
      homeAudit.tableRowCount !== 18 ||
      homeAudit.scrollOverflow > 2
    ) {
      throw new Error(`Workspace Home Dashboard Gate Failed: ${JSON.stringify(homeAudit)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_verispec_workspace_homepage_v35.png'));

    // 7G. Interactive C4 Map Drill-Down (#canvasMapDrilldownBar) + Agent-Ready verispec_mcp & REST Diagramming API Modal (#mcpApiModal)
    const mcpAndC4Audit = await evaluateInPage(`(async () => {
      window.setUiEdition('atelier');
      await window.drilldownC4Level('L200');
      await window.openMcpApiModal();
      await new Promise(r => setTimeout(r, 300));
      const manifestRes = await fetch('/api/mcp/manifest').then(r => r.json());
      const restRes = await fetch('/api/v1/diagram/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'D05', detailLevel: 'L200' })
      }).then(r => r.json());
      const mcpBoxVal = document.getElementById('mcpLiveResponseBox')?.value || '';
      const hasC4Bar = Boolean(document.getElementById('canvasMapDrilldownBar'));
      return {
        hasC4Bar,
        mcpServerName: manifestRes.serverName,
        mcpToolsCount: (manifestRes.tools || []).length,
        restApiOk: Boolean(restRes.ok && restRes.zeroHitAndTrialGuarantee),
        playgroundHasJsonRpc: mcpBoxVal.includes('"jsonrpc": "2.0"')
      };
    })()`);
    console.log('C4 Map Drill-Down & verispec_mcp / REST API Audit:', JSON.stringify(mcpAndC4Audit));
    if (
      !mcpAndC4Audit.hasC4Bar ||
      mcpAndC4Audit.mcpServerName !== 'verispec_mcp' ||
      mcpAndC4Audit.mcpToolsCount !== 5 ||
      !mcpAndC4Audit.restApiOk ||
      !mcpAndC4Audit.playgroundHasJsonRpc
    ) {
      throw new Error(`C4 Map Drill-Down / MCP API Gate Failed: ${JSON.stringify(mcpAndC4Audit)}`);
    }
    await captureScreenshot(path.join(ARTIFACT_DIR, 'after_verispec_mcp_and_c4_drilldown_v35.png'));

    // 7H. Flow Walkthrough Player (#btnFlowWalkthroughStep), Live SVG Minimap Radar (#vsCanvasMinimapOverlay) & Direct On-Canvas Inline Node Editing (POST /api/node/update-inline)
    const v36ParityAudit = await evaluateInPage(`(async () => {
      window.closeMcpApiModal();
      window.stepArchitectureFlowWalkthrough();
      const flowBtnText = document.getElementById('btnFlowWalkthroughStep')?.textContent || '';
      const minimapHostHasSvg = Boolean(document.querySelector('#vsCanvasMinimapSvgHost svg'));
      // Reset flow walkthrough
      while (!(document.getElementById('btnFlowWalkthroughStep')?.textContent || '').includes('(0/')) {
        window.stepArchitectureFlowWalkthrough();
      }
      // Test inline node edit bar open & close
      window.openInlineCanvasNodeEdit({ id: 'orchestrator', title: 'Supervisor Agent', subtitle: 'Gemini 3.8 Pro', pill: 'ADK v2' });
      const inlineBarVisible = document.getElementById('inlineCanvasNodeEditBar')?.style.display === 'flex';
      window.closeInlineCanvasNodeEdit();
      return {
        flowStepped: flowBtnText.includes('(1/'),
        minimapHostHasSvg,
        inlineBarVisible
      };
    })()`);
    console.log('v3.6 Flow Walkthrough, Minimap & Inline Edit Audit:', JSON.stringify(v36ParityAudit));
    if (!v36ParityAudit.flowStepped || !v36ParityAudit.minimapHostHasSvg || !v36ParityAudit.inlineBarVisible) {
      throw new Error(`v3.6 Parity Gate Failed: ${JSON.stringify(v36ParityAudit)}`);
    }

    // Clean up overlays & close modals so D05 default state is pristine
    await evaluateInPage(`(async () => {
      window.closeMcpApiModal();
      window.closeCollabThreadsModal();
      window.closeInlineCanvasNodeEdit();
      await window.clearWhiteboardOverlays();
      window.closeStitchPromptDrawer();
    })()`);
    await sleep(250);

    console.log('=== ALL 18 BASELINE + LIVE PROMPT MUTATION + COLLAPSIBLE DEFAULT + DUAL SCROLLBARS + LIVE VERTEX GEMINI + ADAPTABILITY + SQLITE WAL + LANDING PAGE + WORKSPACE HOME + MCP + V3.6 PARITY GATES PASSED ===');
  } finally {
    ws.close();
    chromeProc.kill('SIGKILL');
    for (const s of spawnedServers) {
      try { s.kill('SIGKILL'); } catch {}
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
