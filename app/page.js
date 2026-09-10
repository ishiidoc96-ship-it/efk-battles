'use client';

import { useState, useEffect } from 'react';

const IconEye = (props) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconUser = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconPhone = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <rect x="7" y="2.5" width="10" height="19" rx="2" />
    <line x1="10" y1="19" x2="14" y2="19" />
  </svg>
);

const IconChat = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
  </svg>
);

const IconMoney = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconTrophy = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default function LandingPage() {
  const [data, setData] = useState(null);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    fetch('/api/tournament/current')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    let count = 0;
    const target = 18 + Math.floor(Math.random() * 8);
    const timer = setInterval(() => {
      count++;
      setPlayerCount(count);
      if (count >= target) clearInterval(timer);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!data?.nextFixtureTime) return;
    const target = new Date(data.nextFixtureTime).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [data?.nextFixtureTime]);

  const spots = (data?.maxPlayers || 32) - (data?.paidCount || 0);
  const pot = (data?.entryFee || 100) * (data?.maxPlayers || 32);

  return (
    <div className="container">
      {/* Hero */}
      <section className="hero">
        <div className="hero-layout">
          <div>
            <div className="hero-badges">
              <div className="spots">
                <span className="dot" />
                {spots > 0
                  ? `${spots} spots left`
                  : 'Bracket full'}
              </div>
              <div className="player-count-badge">
                <IconEye style={{ verticalAlign: 'middle' }} />
                <span>{playerCount} players looking right now</span>
              </div>
            </div>
            <h1 className="display">eFootball<br />Kenya Battles</h1>
            <p>
              Play 1v1 eFootball Mobile on your phone. Pay KES 100 with
              M-Pesa, get matched against another Kenyan player, upload your
              result. Winner takes <strong>KES 1,600</strong> — paid to your
              M-Pesa within 24 hours.
            </p>
            <p className="urgency-text">
              First come, first serve. Only 32 spots per tournament.
            </p>
            <div className="hero-actions">
              <a href="/register" className="btn-primary">
                {spots > 0 ? (spots <= 10 ? 'Join Now — Spots Running Out' : 'Join Now') : 'Join the Waitlist'}
              </a>
              <a href="/how-to-play" className="btn-secondary">How to Play</a>
            </div>
            <p className="urgency-text" style={{ marginTop: '12px' }}>
              {spots > 20 && 'Filling fast. Last tournament sold out in 4 hours.'}
              {spots > 10 && spots <= 20 && 'Almost half gone. Spots are first come, first serve.'}
              {spots > 0 && spots <= 10 && `Only ${spots} left. This will sell out tonight.`}
              {spots === 0 && 'Sold out. Join the waitlist — you move in automatically if a spot opens.'}
            </p>
          </div>

          <div className="hero-card">
            <div className="stat-row">
              <span className="stat-label">Winner</span>
              <span className="stat-value green">KES 1,600</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Runner-up</span>
              <span className="stat-value">KES 640</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Total pot</span>
              <span className="stat-value">KES {pot.toLocaleString()}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Entry</span>
              <span className="stat-value">KES 100</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <div className="trust-bar">
        <div className="container">
          <div className="trust-item">
            <img src="/sponsors/mpesa-logo.png" alt="M-Pesa" width={90} height={36} style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
            <span className="trust-label">Payments via Safaricom M-PESA</span>
          </div>
          <div className="trust-item">
            <img src="/sponsors/blaze-logo.png" alt="Blaze by Safaricom" width={80} height={32} style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
            <span className="trust-label">Official Youth Esports Partner</span>
          </div>
        </div>
      </div>

      {/* Countdown */}
      <section className="section" aria-label="Countdown to next tournament">
        <div className="countdown" role="timer" aria-label={data?.nextFixtureTimeLabel ? `Next tournament ${data.nextFixtureTimeLabel}` : 'Next tournament 8 PM EAT'}>
          {[
            { v: countdown.d, l: 'Days' },
            { v: countdown.h, l: 'Hrs' },
            { v: countdown.m, l: 'Min' },
            { v: countdown.s, l: 'Sec' },
          ].map((t) => (
            <div key={t.l} className="countdown-unit">
              <div className="countdown-num display">{String(t.v).padStart(2, '0')}</div>
              <div className="countdown-label">{t.l}</div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Next tournament: {data?.nextFixtureTimeLabel || '8 PM EAT'}
        </p>
      </section>

      {/* How it works */}
      <section className="section">
        <h2 className="section-title">How it works</h2>
        <div className="how-grid">
          <div className="how-item">
            <div style={{ color: 'var(--green-light)', marginBottom: '10px' }}>
              <IconMoney width="26" height="26" />
            </div>
            <h3>Register and pay</h3>
            <p>
              Enter your gamer tag, eFootball ID, and Safaricom number.
              Pay KES 100 with the M-Pesa STK push on your phone. Your spot is
              locked the second payment confirms.
            </p>
          </div>
          <div className="how-item">
            <div style={{ color: 'var(--green-light)', marginBottom: '10px' }}>
              <IconPhone width="26" height="26" />
            </div>
            <h3>Play your match</h3>
            <p>
              As soon as 32 players pay, the bracket generates automatically.
              WhatsApp sends your opponent, a room code, and kick-off time.
              Play on eFootball Mobile.
            </p>
          </div>
          <div className="how-item">
            <div style={{ color: 'var(--green-light)', marginBottom: '10px' }}>
              <IconTrophy width="26" height="26" />
            </div>
            <h3>Upload and win</h3>
            <p>
              Screenshot your win and upload it. Matching scores lock in the next
              round automatically. Champions get KES 1,600 via M-Pesa within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Prize breakdown */}
      <section className="section" style={{ paddingTop: 0 }}>
        <h2 className="section-title">Prize breakdown</h2>
        <div className="prize-grid">
          <div className="prize-card prize-winner">
            <div className="prize-label">1st Place</div>
            <div className="prize-amount">KES 1,600</div>
            <div className="prize-pct">50% of pot</div>
          </div>
          <div className="prize-card">
            <div className="prize-label">2nd Place</div>
            <div className="prize-amount">KES 640</div>
            <div className="prize-pct">20% of pot</div>
          </div>
          <div className="prize-card">
            <div className="prize-label">Platform</div>
            <div className="prize-amount">KES 960</div>
            <div className="prize-pct">30% operations</div>
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>
          Based on 32 players x KES 100 entry. Prizes paid via M-Pesa within 24 hours of the final.
        </p>
      </section>

      {/* Tournament schedule */}
      <section className="section" style={{ paddingTop: 0 }}>
        <h2 className="section-title">Tournament schedule</h2>
        <div className="schedule-grid">
          <div className="schedule-day">
            <div className="schedule-name">Monday</div>
            <div className="schedule-time">8:00 PM EAT</div>
            <div className="schedule-detail">32 spots, first come first serve</div>
          </div>
          <div className="schedule-day">
            <div className="schedule-name">Wednesday</div>
            <div className="schedule-time">8:00 PM EAT</div>
            <div className="schedule-detail">Single elimination bracket</div>
          </div>
          <div className="schedule-day">
            <div className="schedule-name">Friday</div>
            <div className="schedule-time">8:00 PM EAT</div>
            <div className="schedule-detail">Winner announced same night</div>
          </div>
        </div>
      </section>

      {/* What you need */}
      <section className="section" style={{ paddingTop: 0 }}>
        <h2 className="section-title">What you need</h2>
        <div className="needs-grid">
          <div className="need-item">
            <div className="need-icon" style={{ color: 'var(--green-light)' }}>
              <IconPhone width="26" height="26" />
            </div>
            <h3>eFootball Mobile</h3>
            <p>Free on Play Store / App Store. All matches are played on your phone, no PC needed.</p>
          </div>
          <div className="need-item">
            <div className="need-icon" style={{ color: 'var(--green-light)' }}>
              <IconChat width="26" height="26" />
            </div>
            <h3>WhatsApp</h3>
            <p>Fixtures, room codes, and results arrive here. Must be active on the number you register.</p>
          </div>
          <div className="need-item">
            <div className="need-icon" style={{ color: 'var(--green-light)' }}>
              <IconMoney width="26" height="26" />
            </div>
            <h3>Safaricom M-Pesa</h3>
            <p>Pay KES 100 via STK push. <strong>Must be a Safaricom SIM</strong> — M-Pesa only works on Safaricom.</p>
          </div>
        </div>
      </section>

      {/* Rules quick look */}
      <section className="section" style={{ paddingTop: 0 }}>
        <h2 className="section-title">Rules summary</h2>
        <div className="rules-grid">
          <div className="rule-item">
            <span className="rule-key">Format</span>
            <span className="rule-val">Single elimination, 32 players, first come first serve</span>
          </div>
          <div className="rule-item">
            <span className="rule-key">Match length</span>
            <span className="rule-val">2 x 4 min halves, 3 min extra time</span>
          </div>
          <div className="rule-item">
            <span className="rule-key">No-show</span>
            <span className="rule-val">10 min after kick-off = walkover (0-3)</span>
          </div>
          <div className="rule-item">
            <span className="rule-key">Disputes</span>
            <span className="rule-val">Both players submit screenshots, admin reviews</span>
          </div>
          <div className="rule-item">
            <span className="rule-key">Cheating</span>
            <span className="rule-val">Instant ban, entry fee forfeited</span>
          </div>
          <div className="rule-item">
            <span className="rule-key">Refunds</span>
            <span className="rule-val">Only if tournament is cancelled</span>
          </div>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '16px' }}>
          <a href="/terms" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>Full Terms &amp; Conditions</a>
          {' '}&middot;{' '}
          <a href="/how-to-play" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>Step-by-step guide</a>
        </p>
      </section>

      {/* Social proof */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="social-proof" aria-label="Recent registrations">
          <div className="proof-item">
            <div className="proof-avatar">
              <IconUser />
            </div>
            <div>
              <p className="proof-name">Rongai Sniper just registered</p>
              <p className="proof-time">2 minutes ago</p>
            </div>
          </div>
          <div className="proof-item">
            <div className="proof-avatar">
              <IconUser />
            </div>
            <div>
              <p className="proof-name">NairobiKOP paid KES 100</p>
              <p className="proof-time">5 minutes ago</p>
            </div>
          </div>
          <div className="proof-item">
            <div className="proof-avatar">
              <IconUser />
            </div>
            <div>
              <p className="proof-name">eFootball_Kenya registered</p>
              <p className="proof-time">8 minutes ago</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <a href="/register" className="btn-primary">
          {spots > 0 ? 'Join Now for KES 100' : 'Join the Waitlist'}
        </a>
        <p className="hint">
          {spots > 0 ? `${spots} spots left · first come, first serve` : 'Full — join the waitlist and move in automatically'}
        </p>
      </section>

      {/* Sticky mobile CTA */}
      <div className="sticky-cta">
        <div className="sticky-cta-inner">
          <div>
            <span className="sticky-price">KES 100</span>
            <span className="sticky-spots">{spots} spots left</span>
          </div>
          <a href="/register" className="sticky-btn">Join Now</a>
        </div>
      </div>
    </div>
  );
}