import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { buildPrecomputedEvolutionTimeline, applyPromptMutation } from '../src/engine/canonicalGraphEngine.mjs';
import { LIFECYCLE_BLUEPRINTS_18 } from '../src/engine/lifecycleBlueprints18.mjs';
import { renderInteractiveSvg } from '../src/engine/layoutAndDrawioCompiler.mjs';
import { verifyGraphToSvgBijectionContract } from '../src/engine/archetypeRenderers18.mjs';
import { evaluateArchitectureWithJudgeJury, parseVerispecDslToGraph } from '../src/engine/verispecDslAndJudgeEngine.mjs';
import { compilePreRenderPlanCertificate } from '../src/engine/preRenderGeometryPlanner.mjs';
import { generateGitHubPrBotReport } from '../src/engine/githubPrBotEngine.mjs';
import { loadBlueprintHistoryFromSqlite } from '../src/engine/sqliteWorkspaceStore.mjs';

const args = process.argv.slice(2);
const codeArg = (args.find((a) => a.startsWith('--code=')) || '--code=D05').split('=')[1].toUpperCase();
const outArg = (args.find((a) => a.startsWith('--out=')) || '').split('=')[1] || null;
const promptArg = (args.find((a) => a.startsWith('--prompt=')) || '').slice('--prompt='.length).trim();
const dslFileArg = (args.find((a) => a.startsWith('--dsl-file=')) || '').slice('--dsl-file='.length).trim();

let baselineGraph;
let currentGraph;

const persistedStore = new Map();
const loadedFromSqlite = loadBlueprintHistoryFromSqlite(persistedStore);
const persistedHistory = loadedFromSqlite ? persistedStore.get(codeArg) : null;

if (persistedHistory && persistedHistory.length > 0) {
  baselineGraph = persistedHistory[0];
  currentGraph = persistedHistory[persistedHistory.length - 1];
} else if (codeArg === 'D05') {
  const timeline = buildPrecomputedEvolutionTimeline();
  baselineGraph = timeline[0];
  currentGraph = timeline[timeline.length - 1];
} else {
  const bp = LIFECYCLE_BLUEPRINTS_18.find((b) => b.code === codeArg) || LIFECYCLE_BLUEPRINTS_18[4];
  baselineGraph = bp;
  currentGraph = bp;
}

if (dslFileArg && fs.existsSync(dslFileArg)) {
  currentGraph = parseVerispecDslToGraph(fs.readFileSync(dslFileArg, 'utf8'), currentGraph);
} else if (promptArg) {
  currentGraph = applyPromptMutation(currentGraph, promptArg);
} else {
  try {
    const changedFiles = execSync('git diff --name-only HEAD~1 HEAD 2>/dev/null', { encoding: 'utf8' })
      .split('\n')
      .map((s) => s.trim())
      .filter((f) => /\.(tf|sql|prisma|verispec)$/i.test(f) && fs.existsSync(f));
    if (changedFiles.length > 0) {
      const combinedIac = changedFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n\n');
      currentGraph = parseVerispecDslToGraph(combinedIac, currentGraph);
    }
  } catch {
    // No git parent commit or IaC diff; compare baseline against current persisted state honestly
  }
}

const svg = renderInteractiveSvg(currentGraph, { showDiff: true, detailLevel: 'L200' });
const bijection = verifyGraphToSvgBijectionContract(currentGraph, svg);
const judgeReport = evaluateArchitectureWithJudgeJury(currentGraph, svg, bijection);
const preRenderPlan = compilePreRenderPlanCertificate(currentGraph, svg, { detailLevel: 'L200' });

const report = generateGitHubPrBotReport(baselineGraph, currentGraph, judgeReport, preRenderPlan, {
  prNumber: Number(process.env.PR_NUMBER || 42)
});

if (outArg) {
  fs.writeFileSync(outArg, report.prCommentMarkdown, 'utf8');
  console.log(`[VeriSpec PR Bot] Wrote PR diff comment (${report.prCommentMarkdown.length} bytes) to ${outArg}`);
} else {
  console.log(report.prCommentMarkdown);
}
