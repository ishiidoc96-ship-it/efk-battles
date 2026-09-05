'use client';

import { useState, useEffect } from 'react';

export default function LivePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    fetch('/api/tournament/current')
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError('Could not load'));
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  if (error && !data) return (
    <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Live Bracket</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{error}</p>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        Connect Supabase and run supabase.sql to activate.
      </p>
      <button onClick={load} className="form-btn" style={{ width: 'auto', padding: '10px 24px' }}>Retry</button>
    </div>
  );

  if (!data) return (
    <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Loading bracket...</p>
    </div>
  );

  const tournament = data.tournament || {};
  const matches = data.matches || [];
  const players = data.players || [];
  const paidCount = data.paidCount || 0;
  const maxPlayers = data.maxPlayers || 32;
  const entryFee = data.entryFee || 100;
  const pot = entryFee * maxPlayers;

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{tournament.name || 'EFK Battles'}</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          {paidCount}/{maxPlayers} paid, Pot KES {pot.toLocaleString()}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '4px' }}>1st</div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>KES {(pot * 0.5).toLocaleString()}</div>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '4px' }}>2nd</div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>KES {(pot * 0.2).toLocaleString()}</div>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '4px' }}>Pot</div>
          <div style={{ fontSize: '18px', fontWeight: 700 }}>KES {pot.toLocaleString()}</div>
        </div>
      </div>

      {matches.length > 0 ? (
        <div className="bracket-scroll">
          <div className="bracket-row">
            {['R32', 'R16', 'QF', 'SF', 'F'].filter(r => matches.some(m => m.round_label === r)).map(round => (
              <div key={round} className="bracket-round">
                <div className="bracket-round-title">{round}</div>
                {matches.filter(m => m.round_label === round).map(m => (
                  <div key={m.id} className="match-card">
                    <div className="room">Room {m.room_code || '----'}</div>
                    <div className={`player ${m.winner_player_id === m.player_a_player_id ? 'winner' : ''}`}>
                      <span>{m.player_a_tag || 'TBD'}</span>
                      {m.a_scored != null && <span className="score">{m.a_scored} - {m.a_conceded}</span>}
                    </div>
                    <div className="vs">vs</div>
                    <div className={`player ${m.winner_player_id === m.player_b_player_id ? 'winner' : ''}`}>
                      <span>{m.player_b_tag || 'TBD'}</span>
                      {m.b_scored != null && <span className="score">{m.b_scored} - {m.b_conceded}</span>}
                    </div>
                    <span className={`status status-${m.status}`}>{m.status}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>No matches yet.</p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Bracket generates when {maxPlayers} players pay.</p>
        </div>
      )}

      {players.length > 0 && (
        <section style={{ marginTop: '48px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', color: 'var(--text-secondary)' }}>Registered players</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
            {players.map((p, i) => (
              <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', fontSize: '13px' }}>
                <span style={{ fontWeight: 500 }}>{p.tag}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>{p.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '32px' }}>Auto-refreshes every 10s</p>
    </div>
  );
}