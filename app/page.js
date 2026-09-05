'use client';

import { useState, useEffect } from 'react';

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
                <span className="eye-icon">&#128065;</span>
                {playerCount} players looking right now
              </div>
            </div>
            <h1>eFootball<br />Kenya Battles</h1>
            <p>
              1v1 eFootball Mobile tournaments for Kenyan players.
              Pay KES 100 via M-Pesa, get matched, play on your phone,
              upload the result. Winner takes 50% of the pot.
            </p>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#D84315', marginBottom: '12px' }}>
              First come, first serve. Only 32 spots per tournament.
            </p>
            <div className="hero-actions">
              <a href="/register" className="btn-primary">
                {spots > 0 ? `Join ${spots > 10 ? 'Now' : 'Before It Fills'}` : 'Join Waitlist'}
              </a>
              <a href="/how-to-play" className="btn-secondary">How to Play</a>
            </div>
            <p className="urgency-text">
              {spots > 20 && 'Filling fast. First come, first serve. Last tournament sold out in 4 hours.'}
              {spots > 10 && spots <= 20 && 'Almost half gone. Spots are first come, first serve.'}
              {spots > 0 && spots <= 10 && `Only ${spots} left. First come, first serve. This will sell out tonight.`}
              {spots === 0 && 'Sold out. First come, first serve. Next tournament opens soon.'}
            </p>
          </div>

          <div className="hero-card">
            <div className="stat-row">
              <span className="stat-label">Winner</span>
              <span className="stat-value" style={{ color: 'var(--green)' }}>KES 1,600</span>
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
            <img src="/sponsors/mpesa-logo.png" alt="M-Pesa" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
            <span className="trust-label">Payments via Safaricom M-PESA</span>
          </div>
          <div className="trust-item">
            <img src="/sponsors/blaze-logo.png" alt="Blaze" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
            <span className="trust-label">Official Youth Esports Partner</span>
          </div>
        </div>
      </div>

      {/* Countdown */}
      <section className="section">
        <div className="countdown">
          {[
            { v: countdown.d, l: 'Days' },
            { v: countdown.h, l: 'Hrs' },
            { v: countdown.m, l: 'Min' },
            { v: countdown.s, l: 'Sec' },
          ].map((t) => (
            <div key={t.l} className="countdown-unit">
              <div className="countdown-num">{String(t.v).padStart(2, '0')}</div>
              <div className="countdown-label">{t.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <h2 className="section-title">How it works</h2>
        <div className="how-grid">
          <div className="how-item">
            <h3>Register and pay</h3>
            <p>
              Enter your gamer tag, eFootball ID, WhatsApp, and M-Pesa number.
              Pay KES 100 through the STK push on your phone.
            </p>
          </div>
          <div className="how-item">
            <h3>Play your match</h3>
            <p>
              First come, first serve. Once 32 players pay, the bracket generates. WhatsApp sends your
              opponent and room code. Play on eFootball Mobile.
            </p>
          </div>
          <div className="how-item">
            <h3>Upload the result</h3>
            <p>
              Screenshot your win. Upload it here. If both scores match, the
              next round locks in automatically.
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
          Based on 32 players x KES 100 entry. Prizes paid via M-Pesa within 24 hours.
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
            <div className="need-icon">&#128241;</div>
            <h3>eFootball Mobile</h3>
            <p>Free on Play Store / App Store. You play matches on your phone, no PC needed.</p>
          </div>
          <div className="need-item">
            <div className="need-icon">&#128172;</div>
            <h3>WhatsApp</h3>
            <p>We send your fixtures, room codes, and results here. Must be active on your phone.</p>
          </div>
          <div className="need-item">
            <div className="need-icon">&#128176;</div>
            <h3>Safaricom M-Pesa</h3>
            <p>Pay KES 100 via STK push. <strong>Must be a Safaricom SIM card</strong>. M-Pesa only works on Safaricom.</p>
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
        <div className="social-proof">
          <div className="proof-item">
            <div className="proof-avatar">&#128100;</div>
            <div>
              <p className="proof-name">Rongai Sniper just registered</p>
              <p className="proof-time">2 minutes ago</p>
            </div>
          </div>
          <div className="proof-item">
            <div className="proof-avatar">&#128100;</div>
            <div>
              <p className="proof-name">NairobiKOP paid KES 100</p>
              <p className="proof-time">5 minutes ago</p>
            </div>
          </div>
          <div className="proof-item">
            <div className="proof-avatar">&#128100;</div>
            <div>
              <p className="proof-name">eFootball_Kenya registered</p>
              <p className="proof-time">8 minutes ago</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <a href="/register" className="btn-primary" style={{ padding: '16px 36px', fontSize: '16px' }}>
          {spots > 0 ? `Join for KES 100` : 'Join Waitlist'}
        </a>
        <p className="hint">
          Next tournament: {data?.nextFixtureTimeLabel || '8 PM EAT'} &middot; {spots > 0 ? `${spots} spots left` : 'Full, join the waitlist'}
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