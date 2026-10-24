'use client';

import { ArrowUpRight, Zap } from 'lucide-react';
import { categoryLabels } from './MeetupCard';
import { currentUser } from '@/lib/mockData';
import type { Plan } from '@/lib/plans';
import type { Category } from '@/lib/types';

export function PlanForm({ tokens, onCreate }: { tokens: number; onCreate: (plan: Plan) => void }) {
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (tokens <= 0) return;
    const data = new FormData(event.currentTarget);
    const title = String(data.get('title')).trim();
    const locationName = String(data.get('location')).trim();
    const thresholdCount = Number(data.get('people'));
    if (!title || !locationName || thresholdCount < 2 || thresholdCount > 12) return;
    onCreate({
      id: crypto.randomUUID(), creatorId: currentUser.id, creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar, title, category: data.get('category') as Category,
      locationName, thresholdCount, maxCount: thresholdCount + 2, currentCount: 1,
      expiresAt: new Date(Date.now() + Number(data.get('duration')) * 60000).toISOString(),
      status: 'pending', isUserLockedIn: true, lockedUsers: [{ ...currentUser, lockedAt: 'Just now' }],
    });
  }

  return (
    <form className="create-form" onSubmit={submit}>
      <p>One good idea. A few good people. That’s all it takes.</p>
      <label>THE PLAN<input name="title" required maxLength={90} placeholder="Late-night pancakes, anyone?" autoFocus /></label>
      <label>THE CATEGORY<select name="category">{Object.entries(categoryLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <label>THE MEETING SPOT<input name="location" required maxLength={120} placeholder="Student Union, outside tables" /></label>
      <div className="form-columns">
        <label>PEOPLE NEEDED<input type="number" name="people" min={2} max={12} defaultValue={4} required /></label>
        <label>TIME TO CONFIRM<select name="duration"><option value="15">15 minutes</option><option value="30">30 minutes</option><option value="45">45 minutes</option><option value="60">1 hour</option></select></label>
      </div>
      <p className="form-note"><Zap size={16} />One token reserved. Get it back when you check in, leave, or the unconfirmed plan expires.</p>
      <button className="primary-button" disabled={tokens <= 0} type="submit">{tokens <= 0 ? 'All your tokens are committed' : 'Put it out there'}<ArrowUpRight size={18} /></button>
    </form>
  );
}
