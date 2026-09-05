// =============================================================
// Optional standalone Express server (mirrors the Next.js API).
// Run with: npm run server  (or  node server.js)
//
// This is useful for local testing without Next.js or as a
// fallback if you prefer a plain Express setup. The Next.js
// API routes are the primary runtime and what Vercel deploys.
// =============================================================

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { supabaseServer, cfg } from './lib/config.js';
import { initiateStkPush, retrieveTransaction, verifyWebhook } from './lib/lipana.js';
import { toIntl, normalizeMobile, isValidMobile } from './lib/phone.js';
import { generateBracket, getMatchesForTournament, getOrCreateTournament, listPaidPlayers } from './lib/bracket.js';
import { resolveMatch, resolveNoShows, adminApproveMatch, adminRejectMatch } from './lib/resolve.js';
import { notifyFixture } from './lib/notify.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { gamer_tag, ef_id, whatsapp, mpesa } = req.body || {};
    if (!gamer_tag || !ef_id) return res.status(400).json({ error: 'gamer_tag and ef_id required' });
    if (!isValidMobile(whatsapp) || !isValidMobile(mpesa)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    const supabase = supabaseServer();
    const tournament = await getOrCreateTournament(supabase);
    const { data: player, error } = await supabase
      .from('players')
      .insert({
        tournament_id: tournament.id,
        gamer_tag: String(gamer_tag).trim().slice(0, 40),
        ef_id: String(ef_id).trim(),
        whatsapp: normalizeMobile(whatsapp),
        mpesa: normalizeMobile(mpesa),
        status: 'registered',
      })
      .select()
      .single();
    if (error) throw error;
    res.json({ player });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pay (STK push)
app.post('/api/pay', async (req, res) => {
  try {
    const { player_id } = req.body || {};
    if (!player_id) return res.status(400).json({ error: 'player_id required' });
    const supabase = supabaseServer();
    const { data: player } = await supabase.from('players').select('*').eq('id', player_id).single();
    if (!player) return res.status(404).json({ error: 'Player not found' });
    if (['paid', 'playing'].includes(player.status)) return res.status(409).json({ error: 'Already paid' });

    const phone = toIntl(player.mpesa);
    const stk = await initiateStkPush({ phone, amount: cfg.entryFee, accountReference: `EFK-${player.gamer_tag.slice(0, 18)}` });
    await supabase.from('transactions').insert({ id: stk.transactionId, player_id: player.id, amount: cfg.entryFee, phone: normalizeMobile(player.mpesa), status: 'pending', raw: stk });
    await supabase.from('players').update({ transaction_id: stk.transactionId }).eq('id', player.id);
    res.json({ transactionId: stk.transactionId, customerMessage: stk.customerMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Status poll
app.get('/api/status/:txId', async (req, res) => {
  try {
    const supabase = supabaseServer();
    const { data } = await supabase.from('transactions').select('status').eq('id', req.params.txId).maybeSingle();
    res.json({ status: data?.status || 'pending' });
  } catch {
    res.json({ status: 'pending' });
  }
});

// Webhook
app.post('/api/webhook', async (req, res) => {
  try {
    const sig = req.headers['x-lipana-signature'] || '';
    if (cfg.lipanaWebhookSecret && !verifyWebhook(req.body, sig)) {
      return res.status(401).json({ success: false });
    }
    const raw = req.body;
    const event = raw.event || raw.type || '';
    const txId = raw.transactionId || raw.id || (raw.data && raw.data.transactionId);
    if (!txId) return res.status(400).json({ success: false });

    const supabase = supabaseServer();
    const isOk = String(event).includes('success') || raw.status === 'success';
    if (!isOk) {
      await supabase.from('transactions').update({ status: 'failed', raw }).eq('id', txId);
      return res.json({ success: true });
    }
    let confirmed = null;
    try { confirmed = await retrieveTransaction(txId); } catch {}
    await supabase.from('transactions').update({ status: 'success', mpesa_receipt: confirmed?.mpesaReceiptNumber || null, raw }).eq('id', txId);
    const { data: txn } = await supabase.from('transactions').select('*').eq('id', txId).single();
    if (txn) {
      await supabase.from('players').update({ status: 'paid' }).eq('id', txn.player_id).eq('status', 'registered');
      const { count: paid } = await supabase.from('players').select('id', { count: 'exact', head: true }).eq('tournament_id', (await supabase.from('players').select('tournament_id').eq('id', txn.player_id).single()).data?.tournament_id).in('status', ['paid', 'playing']);
      const { count: mx } = await supabase.from('matches').select('id', { count: 'exact', head: true }).eq('tournament_id', (await supabase.from('players').select('tournament_id').eq('id', txn.player_id).single()).data?.tournament_id);
      if (paid >= cfg.maxPlayers && mx === 0) {
        const pid = (await supabase.from('players').select('tournament_id').eq('id', txn.player_id).single()).data?.tournament_id;
        if (pid) try { await generateBracket(supabase, pid); } catch (e) { console.error('bracket fail:', e.message); }
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Tournament data
app.get('/api/tournament/current', async (_req, res) => {
  try {
    const supabase = supabaseServer();
    const tournament = await getOrCreateTournament(supabase);
    const matches = await getMatchesForTournament(supabase, tournament.id);
    res.json({ tournament, matches });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Match detail
app.get('/api/matches/:id', async (req, res) => {
  try {
    const supabase = supabaseServer();
    const { data } = await supabase.from('matches').select('*').eq('id', req.params.id).single();
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json({ match: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload (simplified for Express - uses base64 in JSON body for demo; Next.js route uses real FormData)
app.post('/api/matches/:id/upload', async (req, res) => {
  try {
    const { gamer_tag, score, opp_score } = req.body || {};
    const supabase = supabaseServer();
    const { data: match } = await supabase.from('matches').select('*').eq('id', req.params.id).single();
    if (!match) return res.status(404).json({ error: 'Not found' });
    if (match.status !== 'pending') return res.status(409).json({ error: 'Already resolved' });

    const isA = match.player_a_tag === gamer_tag;
    const isB = match.player_b_tag === gamer_tag;
    if (!isA && !isB) return res.status(403).json({ error: 'Not a player in this match' });

    const side = isA ? 'a' : 'b';
    const patch = {
      [`${side}_scored`]: Number(score),
      [`${side}_conceded`]: Number(opp_score),
      [`upload_${side}_url`]: 'uploaded-via-express',
      [`upload_${side}_at`]: new Date().toISOString(),
    };
    await supabase.from('matches').update(patch).eq('id', match.id);
    const outcome = await resolveMatch(supabase, match.id);
    res.json({ ok: true, result: outcome.result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin
app.get('/api/admin/action', async (req, res) => {
  if (req.headers['x-admin-password'] !== cfg.adminPassword) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const supabase = supabaseServer();
    const tournament = await getOrCreateTournament(supabase);
    const players = await listPaidPlayers(supabase, tournament.id);
    const matches = await getMatchesForTournament(supabase, tournament.id);
    res.json({ tournament, players, matches, stats: { totalPlayers: players.length, matchCount: matches.length } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/action', async (req, res) => {
  if (req.headers['x-admin-password'] !== cfg.adminPassword) return res.status(401).json({ error: 'Unauthorized' });
  const { action } = req.body || {};
  const supabase = supabaseServer();
  try {
    switch (action) {
      case 'generate_bracket': {
        const r = await generateBracket(supabase, req.body.tournament_id);
        return res.json({ ok: true, ...r });
      }
      case 'resolve_noshows': {
        const r = await resolveNoShows(supabase, req.body.tournament_id);
        return res.json({ ok: true, resolved: r });
      }
      case 'approve': {
        const r = await adminApproveMatch(supabase, req.body.match_id, req.body.winner_player_id);
        return res.json({ ok: true, ...r });
      }
      case 'reject': {
        const r = await adminRejectMatch(supabase, req.body.match_id);
        return res.json({ ok: true, match: r });
      }
      case 'resend_fixture': {
        const { data: match } = await supabase.from('matches').select('*').eq('id', req.body.match_id).single();
        if (!match) return res.status(404).json({ error: 'Not found' });
        const { data: players } = await supabase.from('players').select('*').in('id', [match.player_a_player_id, match.player_b_player_id]);
        for (const p of players || []) await notifyFixture(supabase, match, p);
        return res.json({ ok: true });
      }
      default:
        return res.status(400).json({ error: 'Unknown action' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[efk-express] listening on http://localhost:${PORT}`);
});