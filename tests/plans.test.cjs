const { test } = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
// Compile the reducer in memory so these tests run without another runtime dependency.
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} }; cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('require', 'module', 'exports', code)(id => id.startsWith('.') ? load(path.join(path.dirname(file), `${id}.ts`)) : require(id), module, module.exports);
  return module.exports;
}
const { initialState, planReducer, availableTokens } = load('src/lib/plans.ts');
const now = Date.parse('2026-10-24T12:00:00Z');
test('joining confirms a plan and leaving returns exactly one reserved token', () => {
  let state = initialState(now);
  assert.equal(availableTokens(state.plans), 4);
  state = planReducer(state, { type: 'toggle', id: 'meetup-1', now });
  assert.equal(state.plans[0].status, 'confirmed');
  assert.equal(availableTokens(state.plans), 3);
  state = planReducer(state, { type: 'toggle', id: 'meetup-1', now });
  assert.equal(state.plans[0].status, 'pending');
  assert.equal(availableTokens(state.plans), 4);
});
test('check-in is idempotent, and checked-in participation cannot be toggled', () => {
  const state = initialState(now);
  const checked = planReducer(state, { type: 'checkin', id: 'meetup-3', now });
  assert.equal(availableTokens(checked.plans), 5);
  assert.deepEqual(planReducer(checked, { type: 'checkin', id: 'meetup-3', now }), checked);
  assert.deepEqual(planReducer(checked, { type: 'toggle', id: 'meetup-3', now }), checked);
  assert.deepEqual(planReducer(state, { type: 'checkin', id: 'meetup-1', now }), state);
});
test('expiration dissolves pending plans and releases reserved tokens', () => {
  let state = initialState(now);
  state.plans[3] = { ...state.plans[3], isUserLockedIn: true };
  const expired = planReducer(state, { type: 'expire', now: now + 3600000 });
  assert.equal(expired.plans[3].status, 'dissolved');
  assert.equal(availableTokens(expired.plans), 4);
  assert.equal(expired.plans[2].status, 'confirmed');
  assert.deepEqual(planReducer(expired, { type: 'toggle', id: 'meetup-4', now }), expired);
});
test('full plans, expired pending plans, and exhausted token balances reject joins', () => {
  const state = initialState(now);
  state.plans[1].maxCount = 9;
  assert.deepEqual(planReducer(state, { type: 'toggle', id: 'meetup-2', now }), state);
  assert.deepEqual(planReducer(state, { type: 'toggle', id: 'meetup-1', now: now + 3600000 }), state);
  const exhausted = { plans: [...state.plans, ...Array.from({ length: 4 }, (_, i) => ({ ...state.plans[2], id: `extra-${i}` }))] };
  assert.equal(availableTokens(exhausted.plans), 0);
  assert.deepEqual(planReducer(exhausted, { type: 'toggle', id: 'meetup-1', now }), exhausted);
  assert.deepEqual(planReducer(exhausted, { type: 'create', plan: { ...state.plans[0], id: 'new' } }), exhausted);
});
test('restoring state preserves order, check-ins, and expired plans', () => {
  const saved = initialState(now);
  saved.plans[0].status = 'dissolved';
  saved.plans[2].checkedIn = true;
  assert.deepEqual(planReducer({ plans: [] }, { type: 'restore', state: saved }), saved);
});
