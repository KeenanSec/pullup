'use client';

import { ArrowUpRight, MapPin, Clock3, Check, ArrowRight } from 'lucide-react';
import { PlanArtwork } from './PlanArtwork';
import type { Plan } from '@/lib/plans';

export const categoryLabels = {
  study: 'Study', sports: 'Sports', food: 'Food & coffee', hangout: 'Hangouts',
};

export function MeetupCard({ meetup: plan, now, tokens, onToggle }: {
  meetup: Plan; now: number; tokens: number; onToggle: (id: string) => void;
}) {
  const remaining = Math.max(0, Math.ceil((Date.parse(plan.expiresAt) - now) / 60000));
  const full = plan.currentCount >= (plan.maxCount ?? Infinity);
  const expired = plan.status === 'dissolved';
  const needed = Math.max(0, plan.thresholdCount - plan.currentCount);
  const confirmed = plan.status === 'confirmed';
  const unavailable = expired || plan.checkedIn || (!plan.isUserLockedIn && (full || tokens <= 0));

  return (
    <article className={`meetup-card ${plan.category} ${expired ? 'is-expired' : ''}`}>
      <div className="card-cover">
        <PlanArtwork category={plan.category} />
        <span className="cover-category">{categoryLabels[plan.category]}</span>
        <span className="cover-number">{plan.category === 'study' ? '01' : plan.category === 'sports' ? '02' : plan.category === 'food' ? '03' : '04'} / THE CAMPUS COLLECTION</span>
        <span className="cover-mark"><ArrowUpRight size={22} strokeWidth={1.5} /></span>
      </div>
      <div className="card-content">
        <div className="card-meta">
          <span className={`plan-status ${confirmed ? 'confirmed' : ''}`}>
            <i />{expired ? 'Closed' : confirmed ? 'It’s happening' : needed === 1 ? 'You could make it happen' : `${needed} more to make it happen`}
          </span>
          <span className="card-countdown"><Clock3 size={12} />{expired ? 'Expired' : confirmed ? 'Confirmed' : `${remaining}m left`}</span>
        </div>
        <h3>{plan.title}</h3>
        <p className="card-location"><MapPin size={14} />{plan.locationName}</p>
        <p className="card-details">{plan.locationDetails || 'Meet your people at the spot.'}</p>
        <div className="commitment-row">
          <span><strong>{String(plan.currentCount).padStart(2, '0')}</strong><span className="count-divider">/</span>{String(plan.thresholdCount).padStart(2, '0')} <span className="count-caption">locked in</span></span>
          <span>{expired ? 'Time’s up' : confirmed ? 'People found. Plan on.' : `${needed} to go`}</span>
        </div>
        <div className="progress-track" role="progressbar" aria-label="People committed" aria-valuemin={0} aria-valuemax={plan.thresholdCount} aria-valuenow={Math.min(plan.currentCount, plan.thresholdCount)}>
          {Array.from({ length: plan.thresholdCount }, (_, i) => <span key={i} className={i < plan.currentCount ? 'filled' : ''} />)}
        </div>
        <div className="card-bottom">
          <div className="host"><span className="host-avatar">{plan.creatorName.split(' ').map(n => n[0]).slice(0, 2).join('')}</span><span>By {plan.creatorName.split(' ')[0]}</span></div>
          <button className={`join-button ${plan.isUserLockedIn ? 'joined' : ''}`} disabled={unavailable} onClick={() => onToggle(plan.id)} aria-label={plan.isUserLockedIn && !plan.checkedIn ? `Leave ${plan.title}` : `Join ${plan.title}`}>
            {plan.checkedIn ? <><Check size={15} />Checked in</> : plan.isUserLockedIn ? <><Check size={15} />You’re in <span className="leave-label">· Leave</span></> : expired ? 'Expired' : full ? 'Full' : tokens <= 0 ? 'No tokens' : <>Pull up <ArrowRight size={16} /></>}
          </button>
        </div>
      </div>
    </article>
  );
}
