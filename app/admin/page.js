'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [pw, setPw] = useState('');
  const [authed, setAuthed] = useState(false);
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [qrImage, setQrImage] = useState('');

  const headers = { 'Content-Type': 'application/json', 'x-admin-password': pw };

  const load = async () => {
    try {
      const res = await fetch('/api/admin/action', { headers: { 'x-admin-password': pw } });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
    } catch (err) { setMsg(err.message); }
  };

  const checkQR = async () => {
    try {
      const res = await fetch('/api/whatsapp?action=status', { headers: { 'x-admin-password': pw } });
      const json = await res.json();
      if (json.qr) {
        setQrImage(json.qr);
        setShowQR(true);
      } else {
        setMsg(json.error || 'No QR available — start WhatsApp server first');
      }
    } catch { setMsg('WhatsApp server not reachable'); }
  };

  useEffect(() => { if (authed) load(); }, [authed]);

  const doAction = async (action, body = {}) => {
    setLoading(action);
    setMsg('');
    try {
      const res = await fetch('/api/admin/action', { method: 'POST', headers, body: JSON.stringify({ action, ...body }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMsg(`${action} — done`);
      await load();
    } catch (err) { setMsg(`${action} — ${err.message}`); }
    setLoading('');
  };

  if (!authed) return (
    <div className="container" style={{ maxWidth: '400px', paddingTop: '80px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Admin</h1>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input className="form-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && pw && setAuthed(true)} />
      </div>
      <button className="form-btn" onClick={() => pw && setAuthed(true)} disabled={!pw}>Login</button>
    </div>
  );

  const tournament = data?.tournament;
  const matches = data?.matches || [];
  const players = data?.players || [];

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>Admin</h1>
        <button onClick={load} style={{ fontSize: '13px', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>Refresh</button>
      </div>

      {msg && <p style={{ fontSize: '13px', color: msg.includes('—') && !msg.includes('done') ? '#D84315' : 'var(--green)', marginBottom: '16px' }}>{msg}</p>}

      {tournament && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>{tournament.name}</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="form-btn" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => doAction('generate_bracket', { tournament_id: tournament.id })} disabled={!!loading}>
              {loading === 'generate_bracket' ? '...' : 'Generate bracket'}
            </button>
            <button className="form-btn" style={{ width: 'auto', padding: '10px 20px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }} onClick={() => doAction('resolve_noshows', { tournament_id: tournament.id })} disabled={!!loading}>
              Resolve no-shows
            </button>
            <button className="form-btn" style={{ width: 'auto', padding: '10px 20px', background: '#FBE9E7', color: '#D84315', border: '1px solid #F5C6CB' }} onClick={() => { if (confirm('Reset?')) doAction('reset', { tournament_id: tournament.id }); }} disabled={!!loading}>
              Reset
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>Matches ({matches.length})</h2>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {matches.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', marginBottom: '6px', fontSize: '13px' }}>
              <div>
                <span style={{ fontWeight: 600, marginRight: '8px' }}>{m.round_label}</span>
                <span>{m.player_a_tag || '?'} vs {m.player_b_tag || '?'}</span>
                {m.final_score && <span style={{ color: 'var(--green)', fontWeight: 600, marginLeft: '8px' }}>{m.final_score}</span>}
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {(m.status === 'pending' || m.status === 'disputed') && m.player_a_player_id && (
                  <button style={{ fontSize: '10px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px', border: 'none', background: '#E8F5E9', color: '#2E7D32', cursor: 'pointer' }} onClick={() => doAction('approve', { match_id: m.id, winner_player_id: m.player_a_player_id })} disabled={!!loading}>A wins</button>
                )}
                {(m.status === 'pending' || m.status === 'disputed') && m.player_b_player_id && (
                  <button style={{ fontSize: '10px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px', border: 'none', background: '#E8F5E9', color: '#2E7D32', cursor: 'pointer' }} onClick={() => doAction('approve', { match_id: m.id, winner_player_id: m.player_b_player_id })} disabled={!!loading}>B wins</button>
                )}
                <button style={{ fontSize: '10px', fontWeight: 600, padding: '4px 10px', borderRadius: '4px', border: 'none', background: '#E3F2FD', color: '#1565C0', cursor: 'pointer' }} onClick={() => doAction('resend_fixture', { match_id: m.id })} disabled={!!loading}>Resend</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>Players ({players.length})</h2>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {players.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', marginBottom: '4px', fontSize: '13px' }}>
              <span style={{ fontWeight: 500 }}>{p.gamer_tag}</span>
              <span style={{ color: 'var(--text-muted)' }}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '24px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>WhatsApp Bot</h2>
        {showQR && qrImage ? (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Scan this QR code with WhatsApp:</p>
            <img src={qrImage} alt="WhatsApp QR" style={{ maxWidth: '256px', borderRadius: '8px', border: '1px solid var(--border)' }} />
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>Open WhatsApp &rarr; Settings &rarr; Linked Devices &rarr; Link a Device</p>
          </div>
        ) : (
          <button className="form-btn" style={{ width: 'auto', padding: '10px 20px' }} onClick={checkQR}>Show WhatsApp QR</button>
        )}
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
          Baileys (free): scan QR with personal WhatsApp. No Meta app needed.
        </p>
      </div>
    </div>
  );
}