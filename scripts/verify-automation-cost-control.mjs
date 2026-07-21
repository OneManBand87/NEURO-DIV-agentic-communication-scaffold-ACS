#!/usr/bin/env node

import { createHash } from 'node:crypto';

const importanceRank = { low: 1, normal: 2, high: 3, critical: 4 };
const costRank = { low: 1, medium: 2, high: 3, extreme: 4 };

function decision(c) {
  if (!c.recurring) return { allow: true, reason: 'not-recurring' };
  const required = [
    'maxRuns', 'expiresAt', 'costBounded', 'terminalCondition',
    'eventDrivenAssessed', 'leastCostModel', 'contextMinimized',
    'threadConsolidated', 'cadenceJustified', 'expectedBenefitDominates',
    'errorStopRule', 'noOpStopRule', 'rollbackPath'
  ];

  for (const field of required) {
    if (field === 'maxRuns') {
      if (!Number.isInteger(c.maxRuns) || c.maxRuns < 1) return { allow: false, reason: field };
    } else if (!c[field]) {
      return { allow: false, reason: field };
    }
  }

  if (c.errorStopAfter !== 2) return { allow: false, reason: 'error-tripwire' };
  if (c.noOpStopAfter !== 3) return { allow: false, reason: 'no-op-tripwire' };
  if (!(c.costBand in costRank)) return { allow: false, reason: 'cost-unbounded' };
  if (!Number.isFinite(c.runsPerDay) || c.runsPerDay <= 0) return { allow: false, reason: 'cadence-unbounded' };

  let adjusted = costRank[c.costBand];
  if (c.runsPerDay > 4) adjusted += 1;
  if (c.newVisibleTaskPerRun) adjusted += 1;
  if (c.frontierModel || c.highReasoning) adjusted += 1;
  adjusted = Math.min(adjusted, 4);

  if (c.runsPerDay > 4 && !(c.importance === 'critical' && c.deadlineHours <= 6 && c.explicitCostApproval)) {
    return { allow: false, reason: 'high-frequency-not-justified' };
  }
  if (c.newVisibleTaskPerRun && !(c.importance === 'critical' && c.maxRuns <= 4 && c.explicitCostApproval)) {
    return { allow: false, reason: 'task-churn' };
  }
  if ((c.frontierModel || c.highReasoning) && c.binaryPresenceCheck && !c.cheaperModelInadequateEvidence) {
    return { allow: false, reason: 'overpowered-model' };
  }
  if (adjusted >= 3 && !c.explicitCostApproval) return { allow: false, reason: 'high-cost-unapproved' };

  const importance = importanceRank[c.importance] ?? 0;
  if (importance < adjusted) return { allow: false, reason: 'cost-exceeds-importance' };
  if (importance === adjusted && !c.explicitCostApproval) return { allow: false, reason: 'no-clear-margin' };
  return { allow: true, reason: 'proportionate' };
}

function safeCase(i) {
  return {
    id: `SAFE-${String(i + 1).padStart(2, '0')}`,
    recurring: true,
    importance: ['normal', 'high', 'critical'][i % 3],
    costBand: 'low',
    maxRuns: 4 + (i % 5),
    expiresAt: true,
    costBounded: true,
    terminalCondition: true,
    eventDrivenAssessed: true,
    leastCostModel: true,
    contextMinimized: true,
    threadConsolidated: true,
    cadenceJustified: true,
    expectedBenefitDominates: true,
    errorStopRule: true,
    noOpStopRule: true,
    errorStopAfter: 2,
    noOpStopAfter: 3,
    rollbackPath: true,
    runsPerDay: 1 + (i % 4),
    newVisibleTaskPerRun: false,
    frontierModel: false,
    highReasoning: false,
    binaryPresenceCheck: i % 2 === 0,
    cheaperModelInadequateEvidence: false,
    explicitCostApproval: false,
    deadlineHours: 24
  };
}

const violations = [
  ['maxRuns', null],
  ['expiresAt', false],
  ['costBounded', false],
  ['terminalCondition', false],
  ['eventDrivenAssessed', false],
  ['leastCostModel', false],
  ['contextMinimized', false],
  ['threadConsolidated', false],
  ['cadenceJustified', false],
  ['expectedBenefitDominates', false],
  ['errorStopRule', false],
  ['noOpStopRule', false],
  ['rollbackPath', false],
  ['costBand', 'high'],
  ['newVisibleTaskPerRun', true],
  ['errorStopAfter', 4],
  ['noOpStopAfter', 6]
];

const allowed = Array.from({ length: 30 }, (_, i) => safeCase(i));
const blocked = Array.from({ length: 30 }, (_, i) => {
  const c = safeCase(i);
  c.id = `BLOCK-${String(i + 1).padStart(2, '0')}`;
  const [field, value] = violations[i % violations.length];
  c[field] = value;
  return c;
});

const ood = [
  ...allowed.map(c => ({ c, expected: true })),
  ...blocked.map(c => ({ c, expected: false }))
];
const oodPasses = ood.filter(({ c, expected }) => decision(c).allow === expected).length;

const counterfactual = [
  ...allowed.map((c, i) => ({ c: { ...c, id: `CF-A2B-${i + 1}`, noOpStopRule: false }, expected: false })),
  ...blocked.map((c, i) => {
    const fixed = { ...c, id: `CF-B2A-${i + 1}` };
    const [field] = violations[i % violations.length];
    fixed[field] = safeCase(i)[field];
    return { c: fixed, expected: true };
  })
];
const counterfactualPasses = counterfactual.filter(({ c, expected }) => decision(c).allow === expected).length;

if (oodPasses !== 60 || counterfactualPasses !== 60) {
  const failures = [
    ...ood.filter(({ c, expected }) => decision(c).allow !== expected).map(x => ({ id: x.c.id, result: decision(x.c) })),
    ...counterfactual.filter(({ c, expected }) => decision(c).allow !== expected).map(x => ({ id: x.c.id, result: decision(x.c) }))
  ];
  console.error(JSON.stringify({ oodPasses, counterfactualPasses, failures }, null, 2));
  process.exit(1);
}

const componentLcb90 = Math.pow(0.1, 1 / 61);
const complexityRatio = 1.0;
const qtuLcb90 = componentLcb90 * componentLcb90 * complexityRatio;
const pointEstimate = Math.pow(61 / 62, 2) * complexityRatio;
const directive = 'NDV-COST-2026-07-19-A|install mandatory Automation Cost, Cadence, and Proportionality Control in the canonical ACS brief and synchronized repository controls; apply it to keep the ChatGPT export automation paused; verify, commit, and push only to the intended repository; no reactivation without a compliant bounded design and explicit approval when required';
const directiveHash = createHash('sha256').update(directive).digest('hex');

const result = {
  directiveHash,
  ood: `${oodPasses}/60`,
  counterfactual: `${counterfactualPasses}/60`,
  componentLcb90: Number(componentLcb90.toFixed(9)),
  complexityRatio,
  pointEstimate: Number(pointEstimate.toFixed(9)),
  qtuLcb90: Number(qtuLcb90.toFixed(9)),
  assessment: qtuLcb90 >= 0.90 ? 'QTU_DESIGN_CONFORMANT' : 'QTU_BLOCKED',
  empiricalValidation: false,
  executionAuthorization: false
};

if (result.directiveHash !== '59440be80776be0f83b9b381a62ee1d46a3aec36c8dd49d25d6908d902e9183b' ||
    result.qtuLcb90 !== 0.927284744 || result.assessment !== 'QTU_DESIGN_CONFORMANT' ||
    result.empiricalValidation !== false || result.executionAuthorization !== false) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(result));
