'use client';

import { useState, useEffect } from 'react';

const SAFARICIM_RE = /^(07[01245689]\d{7}|011\d{7})$/;
const PHONE_RE = /^0[17]\d{8}$/;

export default function RegisterPage() {
  const [step, setStep] = useState('form');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [txId, setTxId] = useState('');
  const [form, setForm] = useState({ gamer_tag: '', ef_id: '', phone: '' });
  const [spotsLeft, setSpotsLeft] = useState(null);
  const [playerName, setPlayerName] = useState('');

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  useEffect(() => {
    fetch('/api/tournament/current')
      .then(r => r.json())
      .then(d => setSpotsLeft((d.maxPlayers || 32) - (d.paidCount || 0)))
      .catch(() => {});
  }, []);

  const validate = (values, touched = {}) => {
    const errs = {};
    if ((touched.gamer_tag || true) && !values.gamer_tag.trim())
      errs.gamer_tag = 'Enter your gamer tag to register';
    if ((touched.ef_id || true) && !values.ef_id.trim())
      errs.ef_id = 'Enter your eFootball in-game ID';
    if ((touched.phone || true) && values.phone) {
      const raw = values.phone.replace(/\s/g, '');
      if (!PHONE_RE.test(raw))
        errs.phone = 'Phone number must look like 0712345678';
      else if (!SAFARICIM_RE.test(raw))
        errs.phone = 'M-Pesa only works on Safaricom. Use a Safaricom number (070X, 071X, 072X, 074X, 075X, 076X, 078X, 079X).';
    } else if (touched.phone) {
      errs.phone = 'Enter your Safaricom phone number';
    }
    return errs;
  };

  const onBlur = (f) => () => {
    const errs = validate(form, { [f]: true, gamer_tag: true, ef_id: true, phone: true });
    setFieldErrors((prev) => ({ ...prev, [f]: errs[f] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validate(form, { gamer_tag: true, ef_id: true, phone: true });
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      const reg = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const regData = await reg.json();
      if (!reg.ok) throw new Error(regData.error);
      const pay = await fetch('/api/pay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ player_id: regData.player.id }) });
      const payData = await pay.json();
      if (!pay.ok) throw new Error(payData.error);
      setPlayerName(form.gamer_tag);
      setTxId(payData.transactionId);
      setStep('poll');
    } catch (err) {
      setError(err.message);
      setStep('form');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'poll') return <PollingScreen txId={txId} playerName={playerName} />;
  if (step === 'done') return <DoneScreen playerName={playerName} />;

  const urgent = spotsLeft !== null && spotsLeft <= 10;

  return (
    <div className="container" style={{ maxWidth: '520px', paddingTop: '40px', paddingBottom: '80px' }}>
      <a href="/" style={{ display: 'inline-block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>&larr; Back home</a>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Join EFK Battles</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          KES 100 entry. Winner takes KES 1,600.
        </p>
        {spotsLeft !== null && spotsLeft > 0 && (
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            color: urgent ? 'var(--urgent)' : 'var(--green-light)',
            background: urgent ? 'var(--danger-bg)' : 'var(--success-bg)',
            padding: '4px 10px',
            borderRadius: '100px',
          }}>
            {spotsLeft <= 5 ? `Only ${spotsLeft} left!` : `${spotsLeft} spots left`}
          </span>
        )}
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
        New here? Read the <a href="/how-to-play" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>step-by-step guide</a> first.
        <br />The whole thing takes about 30 seconds. You pay with a normal M-Pesa STK push on your phone.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="gamer_tag">Gamer tag</label>
          <input
            id="gamer_tag"
            className="form-input"
            placeholder="e.g. Rongai Sniper"
            value={form.gamer_tag}
            onChange={update('gamer_tag')}
            onBlur={onBlur('gamer_tag')}
            aria-invalid={fieldErrors.gamer_tag ? true : undefined}
            aria-describedby={fieldErrors.gamer_tag ? 'gamer_tag-err' : 'gamer_tag-hint'}
            autoComplete="nickname"
            maxLength={24}
          />
          {fieldErrors.gamer_tag ? (
            <p id="gamer_tag-err" className="form-error" role="alert">{fieldErrors.gamer_tag}</p>
          ) : (
            <p id="gamer_tag-hint" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Your display name in the tournament. Other players will see this.
            </p>
          )}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="ef_id">eFootball in-game ID</label>
          <input
            id="ef_id"
            className="form-input"
            placeholder="e.g. 88631245"
            value={form.ef_id}
            onChange={update('ef_id')}
            onBlur={onBlur('ef_id')}
            aria-invalid={fieldErrors.ef_id ? true : undefined}
            aria-describedby={fieldErrors.ef_id ? 'ef_id-err' : 'ef_id-hint'}
            inputMode="numeric"
            autoComplete="off"
          />
          {fieldErrors.ef_id ? (
            <p id="ef_id-err" className="form-error" role="alert">{fieldErrors.ef_id}</p>
          ) : (
            <p id="ef_id-hint" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Found in eFootball Mobile &rarr; your profile screen. This is how we verify it&apos;s you.
            </p>
          )}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="phone">Safaricom phone number</label>
          <input
            id="phone"
            className="form-input"
            placeholder="0712345678"
            value={form.phone}
            onChange={update('phone')}
            onBlur={onBlur('phone')}
            aria-invalid={fieldErrors.phone ? true : undefined}
            aria-describedby={fieldErrors.phone ? 'phone-err' : 'phone-hint'}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel-national"
          />
          {fieldErrors.phone ? (
            <p id="phone-err" className="form-error" role="alert">{fieldErrors.phone}</p>
          ) : (
            <p id="phone-hint" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Must be a <strong>Safaricom number</strong> — M-Pesa only works on Safaricom.
              This number receives both the STK push and your WhatsApp fixtures.
            </p>
          )}
        </div>
        {error && <p className="form-error" style={{ marginBottom: '16px' }} role="alert">{error} <button type="button" onClick={() => setError('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', textDecoration: 'underline', fontSize: '12px' }}>Dismiss</button></p>}
        <button type="submit" className="form-btn" disabled={submitting}>
          {submitting ? 'Sending STK push…' : urgent ? 'Lock my spot · KES 100' : 'Pay KES 100 with M-Pesa'}
        </button>
        {urgent && (
          <p style={{ fontSize: '12px', color: 'var(--urgent)', textAlign: 'center', marginTop: '8px', fontWeight: 500 }}>
            First come, first serve. This tournament sells out fast. Lock your spot now.
          </p>
        )}
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px', lineHeight: '1.5' }}>
          Tournament cancelled? Full KES 100 refund to your M-Pesa.
          <br />Winner paid within 24h of the final, no exceptions.
        </p>
      </form>

      <div style={{ marginTop: '24px', padding: '16px', background: 'var(--surface-alt)', borderRadius: '10px', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>What happens next?</p>
        <ol style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.7', paddingLeft: '16px', listStyle: 'decimal' }}>
          <li>You&apos;ll get an M-Pesa STK push on your phone. Enter your PIN to pay.</li>
          <li>Once payment is confirmed, you&apos;re registered.</li>
          <li>When 32 players pay, the bracket generates and you get a WhatsApp with your opponent + room code.</li>
          <li>Play your match on eFootball Mobile at the scheduled time.</li>
          <li>Upload the result screenshot to advance to the next round.</li>
        </ol>
      </div>
    </div>
  );
}

function DoneScreen({ playerName }) {
  const shareText = `I just registered for EFK Battles! 1v1 eFootball tournament, KES 100 entry, winner takes KES 1,600. Register here: https://efk-battles.vercel.app/register`;
  return (
    <div className="container" style={{ paddingTop: '80px', textAlign: 'center', maxWidth: '520px' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--green-light)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>You&apos;re locked in{playerName ? `, ${playerName}` : ''}!</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Check WhatsApp for your fixture. Game tonight at 8 PM EAT.</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
        <a href="/live" className="btn-primary" style={{ padding: '12px 24px' }}>View bracket</a>
        <a href="/" className="btn-secondary" style={{ padding: '12px 24px' }}>Home</a>
      </div>
      <div className="share-box">
        <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Know someone who plays eFootball?</p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Send them this link so they can register too:</p>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-share-btn"
        >
          Share on WhatsApp
        </a>
      </div>
    </div>
  );
}

function PollingScreen({ txId, playerName }) {
  const [status, setStatus] = useState('pending');
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/status/${txId}`);
        const data = await res.json();
        if (data.status === 'success') { clearInterval(id); setStatus('success'); }
        else if (data.status === 'failed' || data.status === 'cancelled') { clearInterval(id); setStatus('failed'); }
      } catch {}
    }, 2000);
    return () => clearInterval(id);
  }, [txId]);

  if (status === 'success') return <DoneScreen playerName={playerName} />;

  if (status === 'failed') return (
    <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Payment failed</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>The M-Pesa payment was not completed. Try again.</p>
      <a href="/register" className="btn-secondary">Back to register</a>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--green)', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} role="status" aria-label="Waiting for payment" />
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Waiting for payment</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Check your phone for the M-Pesa STK push.</p>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Enter your PIN to complete. This page updates automatically.</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}