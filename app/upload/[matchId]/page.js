'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function UploadPage() {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ gamer_tag: '', score: '', opp_score: '', recording: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch(`/api/matches/${matchId}`)
      .then((r) => r.json())
      .then((d) => { setMatch(d.match); setLoading(false); })
      .catch(() => { setError('Match not found'); setLoading(false); });
  }, [matchId]);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setError('Max 5MB'); return; }
    if (!f.type.startsWith('image/')) { setError('Must be an image'); return; }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    if (!form.gamer_tag.trim()) { setError('Enter your gamer tag'); setSubmitting(false); return; }
    if (!file) { setError('Upload the screenshot'); setSubmitting(false); return; }
    const score = parseInt(form.score, 10), opp = parseInt(form.opp_score, 10);
    if (isNaN(score) || isNaN(opp) || score < 0 || score > 99 || opp < 0 || opp > 99) { setError('Scores 0-99'); setSubmitting(false); return; }
    try {
      const fd = new FormData();
      fd.append('gamer_tag', form.gamer_tag.trim());
      fd.append('score', String(score));
      fd.append('opp_score', String(opp));
      fd.append('screenshot', file);
      if (form.recording) fd.append('recording', form.recording);
      const res = await fetch(`/api/matches/${matchId}/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) { setError(err.message); }
    setSubmitting(false);
  };

  if (loading) return <div className="container" style={{ paddingTop: '60px', textAlign: 'center' }}><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>;
  if (error && !match) return <div className="container" style={{ paddingTop: '60px', textAlign: 'center' }}><p style={{ color: '#D84315' }}>{error}</p></div>;

  if (result) return (
    <div className="container" style={{ maxWidth: '480px', paddingTop: '80px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>
        {result.result === 'approved' ? 'Result confirmed' : result.result === 'disputed' ? 'Under review' : 'Score recorded'}
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{result.message}</p>
      <a href="/live" className="btn-primary">View bracket</a>
    </div>
  );

  if (match?.status !== 'pending') return (
    <div className="container" style={{ maxWidth: '480px', paddingTop: '80px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Match {match?.status}</h1>
      <a href="/live" className="btn-secondary">View bracket</a>
    </div>
  );

  return (
    <div className="container" style={{ maxWidth: '480px', paddingTop: '40px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Upload result</h1>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
        {match.round_label}, Room {match.room_code}
      </p>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>A: {match.player_a_tag || 'TBD'}</span>
          {match.a_uploaded && <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--green)', background: '#E8F5E9', padding: '2px 8px', borderRadius: '4px' }}>UPLOADED</span>}
        </div>
        <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', padding: '4px 0' }}>vs</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', fontWeight: 500 }}>B: {match.player_b_tag || 'TBD'}</span>
          {match.b_uploaded && <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--green)', background: '#E8F5E9', padding: '2px 8px', borderRadius: '4px' }}>UPLOADED</span>}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Your gamer tag</label>
          <input className="form-input" placeholder="Must match a player in this match" value={form.gamer_tag} onChange={(e) => setForm({ ...form, gamer_tag: e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Your goals</label>
            <input className="form-input" type="number" min="0" max="99" placeholder="0" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Opponent goals</label>
            <input className="form-input" type="number" min="0" max="99" placeholder="0" value={form.opp_score} onChange={(e) => setForm({ ...form, opp_score: e.target.value })} />
          </div>
        </div>
        {match.needs_recording && (
          <div className="form-group">
            <label className="form-label">Screen recording link (required for semis/final)</label>
            <input className="form-input" placeholder="https://..." value={form.recording} onChange={(e) => setForm({ ...form, recording: e.target.value })} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Result screenshot</label>
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: '1px dashed var(--border)', borderRadius: '12px', padding: '32px', cursor: 'pointer', background: 'var(--surface)' }}>
            {preview ? <img src={preview} alt="Preview" style={{ maxHeight: '160px', borderRadius: '8px' }} /> : <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tap to upload (max 5MB)</span>}
            <input type="file" accept="image/*" className="form-input" style={{ display: 'none' }} onChange={handleFile} />
          </label>
        </div>
        {error && <p style={{ fontSize: '13px', color: '#D84315', marginBottom: '16px' }}>{error}</p>}
        <button type="submit" className="form-btn" disabled={submitting}>{submitting ? 'Uploading...' : 'Submit result'}</button>
      </form>
    </div>
  );
}