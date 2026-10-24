'use client';

import { useEffect, useReducer, useState } from 'react';
import { availableTokens, initialState, planReducer, type Plan, type PlanState } from '@/lib/plans';

// Retain the original storage key so the PullUp rebrand preserves saved plans.
const storageKey = 'lockin-plans-v1';
const categoryKeys = new Set(['study', 'sports', 'food', 'hangout']);

function readState(): PlanState {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (saved && Array.isArray(saved.plans) && saved.plans.every((p: Plan) =>
      p && typeof p.id === 'string' && typeof p.title === 'string' &&
      typeof p.creatorName === 'string' && typeof p.locationName === 'string' &&
      categoryKeys.has(p.category) && Number.isInteger(p.currentCount) && p.currentCount >= 0 &&
      Number.isInteger(p.thresholdCount) && p.thresholdCount >= 2 && p.thresholdCount <= 12 &&
      Number.isFinite(Date.parse(p.expiresAt)) && Array.isArray(p.lockedUsers)
    )) return saved;
  } catch { /* A blocked or cleared store starts a new local session. */ }
  return initialState(Date.now());
}

export function usePlans() {
  const [ready, setReady] = useState(false);
  const [state, dispatch] = useReducer(planReducer, { plans: [] });
  const [now, setNow] = useState(0);

  useEffect(() => {
    const hydration = requestAnimationFrame(() => {
      dispatch({ type: 'restore', state: readState() });
      dispatch({ type: 'expire', now: Date.now() });
      setNow(Date.now());
      setReady(true);
    });
    const timer = setInterval(() => {
      const time = Date.now();
      setNow(time);
      dispatch({ type: 'expire', now: time });
    }, 1000);
    return () => { cancelAnimationFrame(hydration); clearInterval(timer); };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch { /* The app still works in memory if browser storage is unavailable. */ }
  }, [state, ready]);

  return { ready, plans: state.plans, tokens: availableTokens(state.plans), now, dispatch };
}
