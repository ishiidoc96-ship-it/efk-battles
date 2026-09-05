'use client';

import { useState, useEffect } from 'react';

export default function RegisterPage() {
  const [step, setStep] = useState('form');
  const [error, setError] = useState('');
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

  const SAFARICIM_RE = /^(07[01245689]\d{7}|011\d{7})$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.gamer_tag.trim() || !form.ef_id.trim()) return setError('Fill in your gamer tag and eFootball ID');
    const raw = form.phone.replace(/\s/g, '');
    if (!/^0[17]\d{8}$/.test(raw)) return setError('Phone number must be like 0712345678');
    if (!SAFARICIM_RE.test(raw)) return setError('M-Pesa only works on Safaricom. Use a Safaricom number (070X, 071X, 072X, 074X, 075X, 076X, 078X, 079X).');
    setStep('pay');
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
    } catch (err) { setError(err.message); setStep('form'); }
  };

  if (step === 'poll') return <PollingScreen txId={txId} />;
  if (step === 'done') return (
    <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <span style={{ fontSize: '32px', color: '#2E7D32' }}>&#10003;</span>
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>You&apos;re locked in!</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Check WhatsApp for your fixture. Game tonight at 8PM.</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
        <a href="/live" className="btn-primary" style={{ padding: '12px 24px' }}>View bracket</a>
        <a href="/" className="btn-secondary" style={{ padding: '12px 24px' }}>Home</a>
      </div>
      <div className="share-box">
        <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Know someone who plays eFootball?</p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Send them this link so they can register too:</p>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`I just registered for EFK Battles! 1v1 eFootball tournament, KES 100 entry, winner takes KES 1,600. Register here: https://efk-battles.vercel.app/register`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-share-btn"
        >
          Share on WhatsApp
        </a>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ maxWidth: '520px', paddingTop: '40px', paddingBottom: '64px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Join EFK Battles</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          KES 100 entry. Winner takes KES 1,600.
        </p>
        {spotsLeft !== null && spotsLeft > 0 && (
          <span style={{ fontSize: '12px', fontWeight: 600, color: spotsLeft <= 10 ? '#D84315' : 'var(--green)', background: spotsLeft <= 10 ? '#FBE9E7' : '#E8F5E9', padding: '4px 10px', borderRadius: '100px' }}>
            {spotsLeft <= 5 ? `Only ${spotsLeft} left!` : `${spotsLeft} spots left`}
          </span>
        )}
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>
        New to this? Read the <a href="/how-to-play" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>step-by-step guide</a> first.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Gamer tag</label>
          <input className="form-input" placeholder="e.g. Rongai Sniper" value={form.gamer_tag} onChange={update('gamer_tag')} />
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Your display name in the tournament. Other players will see this.</p>
        </div>
        <div className="form-group">
          <label className="form-label">eFootball in-game ID</label>
          <input className="form-input" placeholder="Your profile ID" value={form.ef_id} onChange={update('ef_id')} />
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Found in eFootball Mobile &rarr; your profile screen. This is how we verify it&apos;s you.</p>
        </div>
        <div className="form-group">
          <label className="form-label">Safaricom phone number</label>
          <input className="form-input" placeholder="0712345678" value={form.phone} onChange={update('phone')} />
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Must be a <strong>Safaricom number</strong>, M-Pesa only works on Safaricom.
            Used for both M-Pesa payment (STK push) and WhatsApp fixtures/results.
          </p>
        </div>
        {error && <p style={{ fontSize: '13px', color: '#D84315', marginBottom: '16px' }}>{error}</p>}
        <button type="submit" className="form-btn">
          {spotsLeft !== null && spotsLeft <= 10 ? `Pay KES 100, ${spotsLeft} spots left` : 'Pay KES 100 with M-Pesa'}
        </button>
        {spotsLeft !== null && spotsLeft <= 10 && (
          <p style={{ fontSize: '12px', color: '#D84315', textAlign: 'center', marginTop: '8px', fontWeight: 500 }}>
            This tournament sells out fast. Lock your spot now.
          </p>
        )}
      </form>

      <div style={{ marginTop: '24px', padding: '16px', background: 'var(--surface-alt)', borderRadius: '10px', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>What happens next?</p>
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

function PollingScreen({ txId }) {
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

  if (status === 'success') return (
    <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <span style={{ fontSize: '32px', color: '#2E7D32' }}>&#10003;</span>
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>You&apos;re locked in!</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Check WhatsApp for your fixture details.</p>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Bracket generates when 32 players pay.</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px' }}>
        <a href="/live" className="btn-primary" style={{ padding: '12px 24px' }}>View bracket</a>
        <a href="/" className="btn-secondary" style={{ padding: '12px 24px' }}>Home</a>
      </div>
      <div className="share-box">
        <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Know someone who plays eFootball?</p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Send them this link so they can register too:</p>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`I just registered for EFK Battles! 1v1 eFootball tournament, KES 100 entry, winner takes KES 1,600. Register here: https://efk-battles.vercel.app/register`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-share-btn"
        >
          Share on WhatsApp
        </a>
      </div>
    </div>
  );

  if (status === 'failed') return (
    <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Payment failed</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>The M-Pesa payment was not completed. Try again.</p>
      <a href="/register" className="btn-secondary">Back to register</a>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--green)', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Waiting for payment</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Check your phone for the M-Pesa STK push.</p>
      <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Enter your PIN to complete. This page updates automatically.</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}