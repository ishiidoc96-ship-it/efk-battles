'use client';

import { useState, useEffect } from 'react';

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

const TICKER = [
  'Kick-off 20:00 EAT',
  '32 spots · first come, first served',
  'KES 100 in',
  'KES 1,600 to the winner',
  '4 wins · KES 1,600',
  'M-Pesa only · Safaricom',
  'Mon / Wed / Fri',
  'Usikose · the bracket never waits',
];

export default function LandingPage() {
  const [data, setData] = useState(null);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    fetch('/api/tournament/current')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
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

  const maxPlayers = data?.maxPlayers || 32;
  const paidCount = data?.paidCount || 0;
  const entryFee = data?.entryFee || 100;
  const spots = maxPlayers - paidCount;
  const pot = entryFee * maxPlayers;
  const winnerCut = Math.round(pot * 0.5);
  const runnerCut = Math.round(pot * 0.2);
  const platformCut = Math.round(pot * 0.3);
  const pct = Math.min(100, Math.round((paidCount / maxPlayers) * 100));

  const hasCountdown = data?.nextFixtureTime != null;
  const champions = data?.pastWinners || [];
  const ke = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="container">
      {/* Ticker */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {TICKER.map((t) => (
            <span key={t} className="ticker-item">{t} ·</span>
          ))}
          {TICKER.map((t) => (
            <span key={t + '-b'} className="ticker-item">{t} ·</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="hero-layout">
          <div>
            <div className="hero-meta">
              <span className="hero-line">
                <span className="dot" />
                NEXT: {data?.nextFixtureTimeLabel || '8 PM EAT'}
              </span>
              <span className="hero-line" style={{ color: 'var(--text-muted)' }}>
                BRACKET CLOSES AT 20:00 EAT · {spots} SPOTS LEFT
              </span>
            </div>

            <h1 className="display">
              PAY 100. PLAY. THE LAST ONE STANDING TAKES <span className="hl">1,600.</span>
            </h1>

            <p className="hero-sub">
              1v1 eFootball Mobile, straight from your phone. Pay <strong>KES 100</strong> with
              M-Pesa, get paired with another Kenyan player, upload your result when it&apos;s
              done. Winner walks with <strong>KES {winnerCut.toLocaleString()}</strong> to M-Pesa
              within 24 hours. The bracket never waits.
            </p>

            <div className="progress" aria-live="polite">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="progress-label">
                <span>{paidCount} of {maxPlayers} registered</span>
                <span>pool: KES {pot.toLocaleString()}</span>
              </div>
            </div>

            <div className="hero-actions" style={{ marginTop: '20px' }}>
              <a href="/register" className="btn-primary">
                {spots > 0 ? 'Get Your Spot · KES 100' : 'Join the Waitlist'}
              </a>
              <a href="/how-to-play" className="btn-secondary">How it works</a>
            </div>
            <p className="urgency-text">
              {spots > 20 && 'Filling up. Last one sold out in four hours.'}
              {spots > 10 && spots <= 20 && 'Past half now. First come, first served.'}
              {spots > 0 && spots <= 10 && `Only ${spots} left. When they go, they go.`}
              {spots === 0 && 'Sold out. Join the waitlist and we move you in if a spot opens.'}
            </p>
            {hasCountdown && (
              <p className="tminus">
                T-MINUS {String(countdown.d).padStart(2, '0')}:
                {String(countdown.h).padStart(2, '0')}:
                {String(countdown.m).padStart(2, '0')}:
                {String(countdown.s).padStart(2, '0')} {data?.nextFixtureTimeLabel || ''}
              </p>
            )}
          </div>

          {/* Entry ticket */}
          <div className="entry-ticket" aria-label="Tournament payout summary">
            <div className="entry-ticket-head">
              <span>EFK Battle</span>
              <span className="tk-right">1V1 · EFootball Mobile</span>
            </div>
            <div className="tk-winner">
              <div className="tk-label">To the last one standing</div>
              <div className="tk-amount">KES {winnerCut.toLocaleString()}</div>
              <div className="tk-note">50% of the pool · paid on M-Pesa</div>
            </div>
            <div className="tk-rows">
              <div className="tk-row">
                <span className="tk-k">Runner-up</span>
                <span className="tk-v">KES {runnerCut.toLocaleString()} · 20%</span>
              </div>
              <div className="tk-row">
                <span className="tk-k">Platform</span>
                <span className="tk-v">KES {platformCut.toLocaleString()} · 30%</span>
              </div>
              <div className="tk-row">
                <span className="tk-k">You pay</span>
                <span className="tk-v">KES {entryFee}</span>
              </div>
            </div>
            <div className="tk-foot">M-Pesa payout · within 24h of the final</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="band band--tint" aria-label="How it works">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">01 / The setup</div>
            <h2>Four steps. All on your phone.</h2>
            <p>No installs, no PC, no joining random rooms. The bracket does the matching for you.</p>
          </div>

          <div className="split">
            <ol className="steps">
              <li>
                <div>
                  <h3>Register and pay</h3>
                  <p>Gamer tag, eFootball ID, Safaricom number. Pay <strong>KES 100</strong> with the STK push that lands on your phone.</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>Bracket locks at 8 PM</h3>
                  <p>Once all 32 players are in, the bracket generates itself. We WhatsApp you your opponent and the 4-digit room code.</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>Play your match</h3>
                  <p>2 x 4-minute halves in a Friend Match. Extra time and penalties if you&apos;re still level.</p>
                </div>
              </li>
              <li>
                <div>
                  <h3>Upload the result</h3>
                  <p>Screenshot the final score and submit it. When both players agree on the score, the next round locks in on its own.</p>
                </div>
              </li>
            </ol>

            <div className="chat-mock" role="img" aria-label="Example WhatsApp message: your opponent, room code and kick-off time">
              <div className="chat-mock-head">
                <span className="ava">EF</span>
                <div>
                  <div className="nm">EFK Battles</div>
                  <div className="st">ONLINE</div>
                </div>
              </div>
              <div className="chat-body">
                <div className="bubble">
                  Your bracket is live. 32 players in. Welcome.
                  <span className="meta">19:58</span>
                </div>
                <div className="bubble">
                  Match 12
                  <br />vs <strong>Rongai Sniper</strong>
                  <br />Room <span className="room">4821</span>
                  <br />Kick-off: 8:00 PM EAT
                  <br />Upload result here: <a href="/live">efk-battles.vercel.app/live</a>
                  <span className="meta">19:59 · {new Date().getFullYear()}</span>
                </div>
                <div className="bubble user">
                  Bet. Sending my result after the game.
                  <span className="meta">20:01</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bracket */}
      <section className="band" aria-label="The bracket">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">02 / The bracket</div>
            <h2>16 → 8 → 4 → 2 → 1</h2>
            <p>Four wins, maximum. Win four matches and the KES 1,600 is yours. The bracket generates the second the 32nd player pays.</p>
          </div>

          <div className="mini-bracket">
            {['Round of 16', 'Quarter', 'Semi', 'Final'].map((r) => (
              <div key={r} className="m-round">
                <div className="m-round-title">{r}</div>
                <div className="m-match"><b>Seed 01</b><span>0 · 0</span></div>
                <div className="m-match"><b>Seed 16</b><span>0 · 0</span></div>
                <div className="m-match" style={{ opacity: 0.5 }}><b>Seed 08</b><span>- · -</span></div>
                <div className="m-match" style={{ opacity: 0.5 }}><b>Seed 09</b><span>- · -</span></div>
              </div>
            ))}
            <div className="m-round">
              <div className="m-round-title">Champ</div>
              <div className="m-match" style={{ borderColor: 'var(--green-dark)', background: 'var(--success-bg)' }}>
                <b>???</b>
                <span>last one standing</span>
              </div>
            </div>
          </div>

          <div className="m-footer">
            <span className="f-k">Full pool</span>
            <span className="f-v">KES {pot.toLocaleString()}</span>
            <span className="f-k" style={{ textAlign: 'right' }}>paid on M-Pesa within 24h of the final</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
            Placeholder structure. The real bracket shows on the <a href="/live" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>live bracket page</a> once the pool fills.
          </p>
        </div>
      </section>

      {/* The numbers */}
      <section className="band band--edge" aria-label="Prize breakdown">
        <div className="container">
          <div className="split" style={{ alignItems: 'center' }}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <div className="eyebrow">03 / The numbers</div>
              <h2>50% goes to the winner.<br />Written in the rules, not a vibe.</h2>
              <p>32 players × KES 100 = KES {pot.toLocaleString()} pool. Split 50 / 20 / 30, no hidden fees, payouts on M-Pesa within 24 hours of the final.</p>
            </div>
            <div className="money-rows">
              <div className="money-row winner">
                <span className="m-k">1st place<small>50% of pool</small></span>
                <span className="m-v">KES {winnerCut.toLocaleString()}</span>
              </div>
              <div className="money-row">
                <span className="m-k">2nd place<small>20% of pool</small></span>
                <span className="m-v">KES {runnerCut.toLocaleString()}</span>
              </div>
              <div className="money-row">
                <span className="m-k">Platform<small>30% · runs the bracket</small></span>
                <span className="m-v">KES {platformCut.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="band" aria-label="Tournament schedule">
        <div className="container">
          <div className="split" style={{ alignItems: 'start' }}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <div className="eyebrow">04 / The schedule</div>
              <h2>Three nights a week. 8 PM sharp.</h2>
              <p>Registration opens about 48 hours before each tournament and closes when the bracket is full or kick-off hits.</p>
            </div>
            <div className="sched">
              <div className="sched-row">
                <span className="d">Monday</span>
                <span className="t">8:00 PM EAT</span>
                <span className="n">32 spots, first come, first served</span>
              </div>
              <div className="sched-row">
                <span className="d">Wednesday</span>
                <span className="t">8:00 PM EAT</span>
                <span className="n">Single-elimination bracket</span>
              </div>
              <div className="sched-row">
                <span className="d">Friday</span>
                <span className="t">8:00 PM EAT</span>
                <span className="n">Champion paid within 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you need */}
      <section className="band band--tint" aria-label="What you need">
        <div className="container">
          <div className="split" style={{ alignItems: 'start' }}>
            <div className="section-head" style={{ marginBottom: 0 }}>
              <div className="eyebrow">05 / What you need</div>
              <h2>Three things. That&apos;s the whole list.</h2>
            </div>
            <div className="need-list">
              <div className="need-line">
                <div className="ni"><IconPhone width="22" height="22" /></div>
                <div>
                  <h3>eFootball Mobile</h3>
                  <p>Free on Play Store and App Store. All matches happen on your phone, no PC.</p>
                </div>
              </div>
              <div className="need-line">
                <div className="ni"><IconChat width="22" height="22" /></div>
                <div>
                  <h3>WhatsApp</h3>
                  <p>We send fixtures, room codes and results here. Use the same number you registered with.</p>
                </div>
              </div>
              <div className="need-line">
                <div className="ni"><IconMoney width="22" height="22" /></div>
                <div>
                  <h3>Safaricom M-Pesa</h3>
                  <p>You pay and get paid on M-Pesa. That means a Safaricom SIM, full stop.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rules quick look */}
      <section className="band band--deep" aria-label="Rules summary">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">06 / Ground rules</div>
            <h2>Short version.</h2>
          </div>
          <div className="rules-grid">
            <div className="rule-item">
              <span className="rule-key">Format</span>
              <span className="rule-val">Single elimination · 32 players · first come, first served</span>
            </div>
            <div className="rule-item">
              <span className="rule-key">Match length</span>
              <span className="rule-val">2 × 4 min halves · 3 min extra time</span>
            </div>
            <div className="rule-item">
              <span className="rule-key">No-show</span>
              <span className="rule-val">10 min past kick-off = walkover (0-3)</span>
            </div>
            <div className="rule-item">
              <span className="rule-key">Disputes</span>
              <span className="rule-val">Both upload screenshots · admin reviews</span>
            </div>
            <div className="rule-item">
              <span className="rule-key">Cheating</span>
              <span className="rule-val">Instant ban · entry fee forfeited</span>
            </div>
            <div className="rule-item">
              <span className="rule-key">Refunds</span>
              <span className="rule-val">Only if the tournament gets cancelled</span>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '16px' }}>
            <a href="/terms" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>Full terms &amp; conditions</a>
            {' '}·{' '}
            <a href="/how-to-play" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>Step-by-step guide</a>
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="band" aria-label="Tournament status">
        <div className="container">
          <div className="stats-strip">
            <div className="stat-cell">
              <div className="sv">{paidCount} / {maxPlayers}</div>
              <div className="sk">PAID FOR THIS TOURNAMENT</div>
            </div>
            <div className="stat-cell">
              <div className="sv">KES {pot.toLocaleString()}</div>
              <div className="sk">FULL POOL</div>
            </div>
            <div className="stat-cell">
              <div className="sv">{data?.nextFixtureTimeLabel || '20:00 EAT'}</div>
              <div className="sk">KICK-OFF · MON / WED / FRI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Champion's wall */}
      <section className="band band--tint" aria-label="Recent champions">
        <div className="container">
          <div className="section-head">
            <div className="eyebrow">07 / Champion&apos;s wall</div>
            <h2>People get paid here.</h2>
            <p>No hype, no promises on daydreams. Champions take KES 1,600 to M-Pesa within 24 hours of the final. Full stop.</p>
          </div>
          {champions.length > 0 ? (
            <div className="champ-list">
              {champions.map((c) => (
                <div key={(c.created_at || '') + (c.name || '')} className="champ-row">
                  <span className="champ-k">Champion</span>
                  <span className="champ-tag">{c.champion_tag || 'Anonymous'}</span>
                  <span className="champ-event">{c.name || ''}{c.created_at ? ` · ${ke.format(new Date(c.created_at))}` : ''}</span>
                  <span className="champ-v">KES {winnerCut.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: '1.6' }}>
              The wall goes live the night the first champion gets paid. Could be you, tonight at 20:00 EAT.
            </p>
          )}
        </div>
      </section>

      {/* Poster CTA */}
      <section className="band band--edge" aria-label="Join the bracket">
        <div className="container">
          <div className="poster">
            <div className="big">
              KES <span className="hl">{winnerCut.toLocaleString()}</span> to the last<br />player standing.
            </div>
            <p className="sub">
              KES 100 to get in and that&apos;s the whole entry fee. Safaricom number,
              eFootball Mobile, WhatsApp. The bracket does the rest.
            </p>
            <a href="/register" className="btn-primary">
              {spots > 0 ? `Pay KES 100 · Join the bracket` : 'Join the Waitlist'}
            </a>
            <p className="hint">
              {spots > 0 ? `${spots} spots left · first come, first served` : 'Full · waitlist opens a spot for you automatically'}
            </p>
          </div>
        </div>
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