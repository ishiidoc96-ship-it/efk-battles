// Result resolution: score matching, no-shows and disputes.
// A single source so both the auto (upload) path and admin path stay consistent.

import { NO_SHOW_MINUTES } from './config.js';
import { isPastNoShowDeadline } from './time.js';
import { advanceWinner, getMatchesForTournament } from './bracket.js';
import { notifyDispute } from './notify.js';

export async function getMatch(supabase, matchId) {
  const { data, error } = await supabase.from('matches').select('*').eq('id', matchId).single();
  if (error) throw error;
  return data;
}

async function fetchMatch(supabase, matchId) {
  return getMatch(supabase, matchId);
}

export async function approveWithWinner(supabase, matchId, winnerPlayerId, notes = '') {
  const match = await fetchMatch(supabase, matchId);
  const aWon = winnerPlayerId === match.player_a_player_id;
  const valid = aWon || winnerPlayerId === match.player_b_player_id;
  if (!valid) throw new Error('Winner is not one of the two match players');

  const finalScore =
    aWon && match.a_scored != null
      ? `${match.a_scored} - ${match.a_conceded}`
      : match.b_scored != null
        ? `${match.b_scored} - ${match.b_conceded}`
        : null;

  const { data: updated, error } = await supabase
    .from('matches')
    .update({ status: 'approved', winner_player_id: winnerPlayerId, notes: notes || null, final_score: finalScore })
    .eq('id', matchId)
    .select()
    .single();
  if (error) throw error;

  const nextMatch = await advanceWinner(supabase, updated, winnerPlayerId, notes);
  return { match: updated, nextMatch, result: 'approved' };
}

async function markDisputed(supabase, match, reason) {
  const { error } = await supabase
    .from('matches')
    .update({ status: 'disputed', notes: reason })
    .eq('id', match.id);
  if (error) throw error;

  const { data: players } = await supabase
    .from('players')
    .select('*')
    .in('id', [match.player_a_player_id, match.player_b_player_id]);
  const fresh = { ...match, status: 'disputed', notes: reason };
  if (players?.length) {
    await Promise.allSettled(players.map((p) => notifyDispute(supabase, fresh, p)));
  }
  return { match: fresh };
}

// Run the resolution rules after any upload.
export async function resolveMatch(supabase, matchId, { onlyNoShow = false } = {}) {
  const match = await fetchMatch(supabase, matchId);
  if (match.status !== 'pending') return { match, result: match.status, reason: 'already-resolved' };

  const aSent = !!match.upload_a_url;
  const bSent = !!match.upload_b_url;

  if (!onlyNoShow && aSent && bSent) {
    const consistent = match.a_scored === match.b_conceded && match.b_scored === match.a_conceded;
    if (!consistent) {
      await markDisputed(supabase, match, 'Score mismatch between the two players');
      return { result: 'disputed', reason: 'mismatch' };
    }
    if (match.a_scored === match.b_scored) {
      await markDisputed(supabase, match, 'Draw reported - knockout needs a winner');
      return { result: 'disputed', reason: 'draw' };
    }
    const winnerId = match.a_scored > match.b_scored ? match.player_a_player_id : match.player_b_player_id;
    return approveWithWinner(supabase, matchId, winnerId, 'score-matched');
  }

  if (isPastNoShowDeadline(match, NO_SHOW_MINUTES)) {
    if (aSent && !bSent) return approveWithWinner(supabase, matchId, match.player_a_player_id, 'no-show');
    if (bSent && !aSent) return approveWithWinner(supabase, matchId, match.player_b_player_id, 'no-show');
    if (!aSent && !bSent) return { result: 'stale', reason: 'both-no-show' };
  }

  return { result: 'pending' };
}

// Cron / admin: sweep a whole tournament for no-shows.
export async function resolveNoShows(supabase, tournamentId) {
  const matches = await getMatchesForTournament(supabase, tournamentId);
  const pending = matches.filter((m) => m.status === 'pending');
  const resolved = [];
  for (const m of pending) {
    if (m.upload_a_url && !m.upload_b_url && isPastNoShowDeadline(m, NO_SHOW_MINUTES)) {
      const r = await resolveMatch(supabase, m.id, { onlyNoShow: true });
      if (r.result === 'approved') resolved.push({ matchId: m.id, winner: m.player_a_tag });
    } else if (!m.upload_a_url && m.upload_b_url && isPastNoShowDeadline(m, NO_SHOW_MINUTES)) {
      const r = await resolveMatch(supabase, m.id, { onlyNoShow: true });
      if (r.result === 'approved') resolved.push({ matchId: m.id, winner: m.player_b_tag });
    }
  }
  return resolved;
}

// Admin: force a winner (used on disputes or when one side is verified).
export async function adminApproveMatch(supabase, matchId, winnerPlayerId) {
  return approveWithWinner(supabase, matchId, winnerPlayerId, 'admin-approved');
}

// Admin: send a disputed/stale match back to pending, clearing uploads.
export async function adminRejectMatch(supabase, matchId) {
  const { data, error } = await supabase
    .from('matches')
    .update({
      status: 'pending',
      winner_player_id: null,
      final_score: null,
      notes: 'admin: reopened for re-upload',
      a_scored: null,
      a_conceded: null,
      b_scored: null,
      b_conceded: null,
      upload_a_url: null,
      upload_b_url: null,
    })
    .eq('id', matchId)
    .select()
    .single();
  if (error) throw error;
  return data;
}