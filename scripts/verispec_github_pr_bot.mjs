import fs from 'node:fs';
import { buildPrecomputedEvolutionTimeline, applyPromptMutation } from '../src/engine/canonicalGraphEngine.mjs';
import { LIFECYCLE_BLUEPRINTS_18 } from '../src/engine/lifecycleBlueprints18.mjs';
import { renderInteractiveSvg } from '../src/engine/layoutAndDrawioCompiler.mjs';
import { verifyGraphToSvgBijectionContract } from '../src/engine/archetypeRenderers18.mjs';
import { evaluateArchitectureWithJudgeJury } from '../src/engine/verispecDslAndJudgeEngine.mjs';
import { compilePreRenderPlanCertificate } from '../src/engine/preRenderGeometryPlanner.mjs';
import { generateGitHubPrBotReport } from '../src/engine/githubPrBotEngine.mjs';

const args = process.argv.slice(2);
const codeArg = (args.find((a) => a.startsWith('--code=')) || '--code=D05').split('=')[1].toUpperCase();
const outArg = (args.find((a) => a.startsWith('--out=')) || '').split('=')[1] || null;

let baselineGraph;
let currentGraph;

if (codeArg === 'D05') {
  const timeline = buildPrecomputedEvolutionTimeline();
  baselineGraph = timeline[0];
  currentGraph = applyPromptMutation(timeline[timeline.length - 1], 'Add Looker, and BigQuery');
} else {
  const bp = LIFECYCLE_BLUEPRINTS_18.find((b) => b.code === codeArg) || LIFECYCLE_BLUEPRINTS_18[4];
  baselineGraph = bp;
  currentGraph = applyPromptMutation(bp, 'Add Looker, and BigQuery');
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
