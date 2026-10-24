import { currentUser, initialMeetupsRaw } from './mockData';
import type { Meetup } from './types';
export type Plan = Meetup & {
    checkedIn?: boolean;
};
export type PlanState = {
    plans: Plan[];
};
export type PlanAction = {
    type: 'restore';
    state: PlanState;
} | {
    type: 'toggle' | 'checkin';
    id: string;
    now: number;
} | {
    type: 'expire';
    now: number;
} | {
    type: 'create';
    plan: Plan;
};
export const availableTokens = (plans: Plan[]) => currentUser.maxTokens - plans.filter(p => p.isUserLockedIn && !p.checkedIn && p.status !== 'dissolved').length;
export function initialState(now: number): PlanState {
    return { plans: initialMeetupsRaw.map((p, i) => ({ ...p, expiresAt: new Date(now + [24, 16, 42, 55][i] * 60000).toISOString() })) };
}
export function planReducer(state: PlanState, action: PlanAction): PlanState {
    if (action.type === 'restore')
        return action.state;
    if (action.type === 'create') {
        if (availableTokens(state.plans) < 1)
            return state;
        return { plans: [action.plan, ...state.plans] };
    }
    if (action.type === 'expire' && !state.plans.some(p => p.status === 'pending' && Date.parse(p.expiresAt) <= action.now)) return state;
    return { plans: state.plans.map(p => {
            const expired = Date.parse(p.expiresAt) <= action.now;
            if (action.type === 'expire')
                return expired && p.status === 'pending' ? { ...p, status: 'dissolved' } : p;
            if (p.id !== action.id || p.status === 'dissolved')
                return p;
            if (action.type === 'checkin')
                return p.isUserLockedIn && p.status === 'confirmed' && !p.checkedIn ? { ...p, checkedIn: true } : p;
            if (p.checkedIn || (expired && p.status === 'pending'))
                return p;
            if (!p.isUserLockedIn && (availableTokens(state.plans) <= 0 || p.currentCount >= (p.maxCount ?? Infinity)))
                return p;
            const count = p.currentCount + (p.isUserLockedIn ? -1 : 1);
            return { ...p, currentCount: count, isUserLockedIn: !p.isUserLockedIn, status: count >= p.thresholdCount ? 'confirmed' : expired ? 'dissolved' : 'pending', lockedUsers: p.isUserLockedIn ? p.lockedUsers.filter(u => u.id !== currentUser.id) : [...p.lockedUsers, { ...currentUser, lockedAt: 'Just now' }] };
        }) };
}
