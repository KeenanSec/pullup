'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowUpRight, ArrowDown, ArrowRight, Plus, MapPin, Search, Zap, Check, X, SlidersHorizontal } from 'lucide-react';
import { MeetupCard } from '@/components/MeetupCard';
import { PlanDialog } from '@/components/PlanDialog';
import { PlanForm } from '@/components/PlanForm';
import { usePlans } from '@/hooks/usePlans';
import type { Category } from '@/lib/types';

const categories = [
  { id: 'all', label: 'All plans' }, { id: 'study', label: 'Study' },
  { id: 'sports', label: 'Sports' }, { id: 'food', label: 'Food & coffee' },
  { id: 'hangout', label: 'Hangouts' },
] as const;

export default function Home() {
  const { ready, plans, tokens, now, dispatch } = usePlans();
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [view, setView] = useState<'discover' | 'plans'>('discover');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('soon');
  const [dialog, setDialog] = useState<'create' | 'rules' | null>(null);
  const [notice, setNotice] = useState<{ text: string; id: number } | null>(null);
  const myPlans = plans.filter(p => p.isUserLockedIn && p.status !== 'dissolved');
  const eligiblePlans = useMemo(() => plans.filter(p => view === 'discover' ? p.status !== 'dissolved' : p.isUserLockedIn), [plans, view]);
  const filtered = useMemo(() => eligiblePlans.filter(p =>
    (category === 'all' || p.category === category) &&
    `${p.title} ${p.locationName}`.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => sort === 'soon'
    ? Date.parse(a.expiresAt) - Date.parse(b.expiresAt)
    : (b.currentCount / b.thresholdCount) - (a.currentCount / a.thresholdCount)
  ), [eligiblePlans, category, search, sort]);

  function notify(text: string) { setNotice({ text, id: Date.now() }); }
  function changeView(next: 'discover' | 'plans') {
    setView(next); setCategory('all'); setSearch('');
    requestAnimationFrame(() => document.getElementById('feed')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
  }

  return (
    <>
      <a className="skip-link" href="#feed">Skip to plans</a>
      <header className="site-header">
        <Link href="/" className="wordmark" aria-label="PullUp home">PullUp<span>®</span></Link>
        <span className="header-descriptor">A little less online.<br />A little more out there.</span>
        <nav aria-label="Main navigation">
          <button className={view === 'discover' ? 'nav-active' : ''} onClick={() => changeView('discover')}>Discover<span className="nav-dot" /></button>
          <button className={view === 'plans' ? 'nav-active' : ''} onClick={() => changeView('plans')}>My plans <span className="nav-count">{ready ? myPlans.length : '–'}</span></button>
          <button className="how-nav" onClick={() => setDialog('rules')}>The idea <ArrowUpRight size={13} /></button>
        </nav>
        <div className="header-actions">
          <button className="token-button" onClick={() => setDialog('rules')} aria-label={`${tokens} of 5 commitment tokens available`}><Zap size={14} /><span>{ready ? tokens : '–'}<span className="token-max"> / 5</span></span></button>
          <button className="header-create" onClick={() => setDialog('create')}>Start a plan <Plus size={16} /></button>
        </div>
      </header>

      <main>
        <section className="hero page-width" aria-labelledby="hero-heading">
          <div className="hero-kicker"><span><span className="live-dot" /> OPEN INVITATIONS. REAL CONNECTIONS.</span><span className="campus-label"><MapPin size={12} /> MAIN CAMPUS</span></div>
          <div className="hero-main">
            <h1 id="hero-heading">Life happens<br />when you <span className="hero-serif">show up.</span><span className="heading-period">*</span></h1>
            <div className="hero-aside">
              <div className="connection-symbol" aria-hidden="true"><span /><span /><span /><span /></div>
              <p>For the plans that never<br />make it out of the group chat.</p>
              <span>Find your people. Pick a plan.<br />Make “we should” a real thing.</span>
              <a className="browse-link" href="#feed">Find your next plan <ArrowDown size={17} /></a>
            </div>
          </div>
          <div className="hero-bottom"><span>* No perfect plan required. Just you.</span><span className="edition">THE CAMPUS EDITION — VOL. 01</span></div>
        </section>

        <div className="principles-bar"><div className="page-width principles-inner"><span><i>01</i> Find something that feels like you.</span><span><i>02</i> Put a token behind your “yes.”</span><span><i>03</i> Enough people? See you there.</span><button onClick={() => setDialog('rules')} aria-label="Learn how plans and tokens work"><ArrowUpRight size={19} /></button></div></div>

        <section id="feed" className="feed page-width" aria-labelledby="feed-heading">
          <div className="feed-heading"><div><span className="section-index">{view === 'discover' ? '01 / THE OPEN INVITATION' : '01 / YOUR COMMITMENTS'}</span><h2 id="feed-heading">{view === 'discover' ? 'Find your kind of thing.' : 'You said “I’m in.”'}</h2></div><span className="feed-caption">{view === 'discover' ? <>Small plans.<br />Entirely worth leaving the house for.</> : <>Your people. Your plans.<br />Your reason to get out there.</>}</span></div>

          {view === 'plans' && myPlans.some(p => p.status === 'confirmed') && <div className="checkin-list">{myPlans.filter(p => p.status === 'confirmed').map(p => <div className="checkin-row" key={p.id}><div><span className="live-dot" /><strong>{p.title}</strong><span>{p.locationName}</span></div><button disabled={p.checkedIn} onClick={() => { dispatch({ type: 'checkin', id: p.id, now: Date.now() }); notify('You showed up. Your token is back.'); }}>{p.checkedIn ? <><Check size={16} /> Checked in</> : <>I’m here · Check in <ArrowUpRight size={16} /></>}</button></div>)}</div>}

          <div className="feed-toolbar">
            <div className="category-tabs" aria-label="Filter plans by category">{categories.map(c => <button key={c.id} aria-pressed={category === c.id} className={category === c.id ? 'selected' : ''} onClick={() => setCategory(c.id)}>{c.label}<span>{eligiblePlans.filter(p => c.id === 'all' || p.category === c.id).length.toString().padStart(2, '0')}</span></button>)}</div>
            <div className="feed-tools"><label className="search-field"><Search size={16} /><span className="sr-only">Search plans or campus spots</span><input type="search" placeholder="Find your thing" value={search} onChange={e => setSearch(e.target.value)} /></label><label className="sort-field"><SlidersHorizontal size={15} /><span className="sr-only">Sort plans</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="soon">Ending soon</option><option value="popular">Almost happening</option></select></label></div>
          </div>

          <div className="results-line"><span>{ready ? `${String(filtered.length).padStart(2, '0')} PLANS ${view === 'discover' ? 'ON THE TABLE' : 'IN YOUR COLLECTION'}` : 'FINDING YOUR PEOPLE…'}</span><span>ONE GOOD “YES” AWAY <ArrowDown size={11} /></span></div>
          <div className="card-grid" aria-busy={!ready}>
            {!ready ? Array.from({ length: 3 }, (_, i) => <div className="skeleton-card" key={i}><span /><span /><span /></div>) : filtered.length ? <>
              {filtered.map(p => <MeetupCard key={p.id} meetup={p} now={now} tokens={tokens} onToggle={id => { dispatch({ type: 'toggle', id, now: Date.now() }); notify(p.isUserLockedIn ? 'You left the plan. Your token is back.' : 'You’re in. Find it in My plans.'); }} />)}
              {view === 'discover' && !search && category === 'all' && <button className="create-tile" onClick={() => setDialog('create')}><span className="tile-kicker">THERE’S ROOM FOR YOUR IDEA.</span><span className="tile-symbol" aria-hidden="true">↗</span><span className="tile-title">Your people<br />are out there.</span><span className="tile-bottom">Give them a plan. <Plus size={20} /></span></button>}
            </> : <div className="empty-state"><span className="empty-symbol">↗</span><h3>{search ? 'No plans found. Yet.' : view === 'plans' ? 'Your next yes is out there.' : 'An open space. A fresh start.'}</h3><p>{search ? 'Try a different search, or put your own idea out there.' : 'A coffee, a game, a study break. It starts with a plan.'}</p><div><button className="primary-button" onClick={() => setDialog('create')}>Start a plan <Plus size={17} /></button>{(search || category !== 'all') && <button className="text-button" onClick={() => { setSearch(''); setCategory('all'); }}>Clear filters <X size={15} /></button>}{view === 'plans' && <button className="text-button" onClick={() => changeView('discover')}>Discover plans <ArrowRight size={16} /></button>}</div></div>}
          </div>
          <div className="feed-end"><span>NOT A FEED TO SCROLL. A REASON TO GO.</span><button onClick={() => setDialog('rules')}>How this whole thing works <ArrowUpRight size={14} /></button></div>
        </section>

        <section className="invitation-section" aria-labelledby="invite-heading"><div className="page-width invitation-inner"><div><span className="section-index">02 / THE FIRST MOVE IS YOURS</span><h2 id="invite-heading">Someone has to<br />say <span>“let’s.”</span></h2></div><div className="invitation-aside"><p>That study session. That pickup game.<br />That very necessary coffee break.</p><p>You don’t need a whole crew.<br />You just need to start.</p><button className="dark-button" onClick={() => setDialog('create')}>Be that someone <ArrowUpRight size={21} /></button></div></div></section>
      </main>

      <footer className="site-footer page-width"><div className="footer-top"><span>LESS “SOMEDAY.” MORE TODAY.</span><button onClick={() => setDialog('rules')}>The idea behind PullUp <ArrowUpRight size={15} /></button><a href="#hero-heading">Back to top <ArrowUpRight size={15} /></a></div><Link href="/" className="footer-wordmark" aria-label="PullUp home"><span className="brand-name">PullUp</span><span className="brand-arrow" aria-hidden="true">↗</span></Link><div className="footer-bottom"><span>GOOD THINGS HAPPEN WHEN YOU SHOW UP.</span><span>Campus prototype · Saved on this device</span><span>© PullUp — THE CAMPUS EDITION</span></div></footer>

      {notice && <div className="toast" role="status" key={notice.id}><Check size={16} /><span>{notice.text}</span><button onClick={() => setNotice(null)} aria-label="Dismiss notification"><X size={14} /></button></div>}
      {dialog && <PlanDialog title={dialog === 'create' ? 'It starts with a “let’s.”' : 'A little commitment. A real plan.'} onClose={() => setDialog(null)}>
        {dialog === 'create' ? <PlanForm tokens={tokens} onCreate={plan => { dispatch({ type: 'create', plan }); setDialog(null); changeView('plans'); notify('Your plan is out there. Let’s make it happen.'); }} /> : <div className="rules-content"><p>Built for the gap between “we should” and “see you there.”</p><ol><li><strong>Find a plan. Or start your own.</strong><p>Every plan needs a minimum number of people. Pick something you’d actually like to do.</p></li><li><strong>Make your “yes” mean something.</strong><p>You get five commitment tokens. Joining or creating a plan reserves one. Leaving returns it.</p></li><li><strong>Enough people? It’s on.</strong><p>Check in to a confirmed plan to get your token back. If a pending plan expires, the token comes back automatically.</p></li></ol><div className="demo-note">You’re exploring a local prototype. Other participants are sample data. Your plans stay in this browser, and check-in is self-reported.</div><button className="primary-button" onClick={() => setDialog(null)}>Sounds like a plan <ArrowUpRight size={18} /></button></div>}
      </PlanDialog>}
    </>
  );
}
