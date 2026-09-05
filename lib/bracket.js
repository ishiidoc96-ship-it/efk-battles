// Tournament + bracket core: get/create tournament, generate the 32-player
// bracket, and advance winners into later rounds.

import { customAlphabet } from 'nanoid';
import { cfg, ROUND_LABELS } from './config.js';
import { nextFixtureBase, addMinutes } from './time.js';
import { notifyFixture, notifyWinAndNextRound, notifyLost, notifyChampion, notifyRunnerUp } from './notify.js';

const roomCode = customAlphabet('0123456789', 8);

export function nextRoomCode() {
  return roomCode();
}

// ---- tournaments ----

export async function getOrCreateTournament(supabase) {
  const { data: open, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (open) return open;

  const { count } = await supabase.from('tournaments').select('id', { count: 'exact', head: true });
  const { data: created, error: createErr } = await supabase
    .from('tournaments')
    .insert({ name: `EFK Battle #${(count || 0) + 1}`, status: 'open' })
    .select()
    .single();
  if (createErr) throw createErr;
  return created;
}

export async function getTournamentById(supabase, id) {
  const { data, error } = await supabase.from('tournaments').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getCurrentTournament(supabase) {
  return getOrCreateTournament(supabase);
}

export async function listPaidPlayers(supabase, tournamentId) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('tournament_id', tournamentId)
    .in('status', ['paid', 'playing'])
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

// ---- bracket ----

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fixtureTimeForRound(base, round) {
  return addMinutes(base, (round - 1) * 45);
}

async function insertMatch(supabase, { tournament, round, pos, a, b, base }) {
  const row = {
    tournament_id: tournament.id,
    round,
    round_label: ROUND_LABELS[round],
    pos,
    player_a_player_id: a?.id || null,
    player_b_player_id: b?.id || null,
    player_a_tag: a?.gamer_tag || null,
    player_b_tag: b?.gamer_tag || null,
    room_code: roomCode(),
    fixture_time: fixtureTimeForRound(base, round).toISOString(),
    status: a && b ? 'pending' : 'waiting',
  };
  const { data, error } = await supabase.from('matches').insert(row).select().single();
  if (error) throw error;
  return data;
}

// Randomize all paid players of a tournament into a fresh bracket.
export async function generateBracket(supabase, tournamentId) {
  const tournament = await getTournamentById(supabase, tournamentId);
  if (!tournament) throw new Error('Tournament not found');

  const players = await listPaidPlayers(supabase, tournamentId);
  const count = players.length;
  if (count < 2) throw new Error('Not enough paid players yet');

  // Idempotency: regenerate only if no matches exist.
  const { count: existing, error: cntErr } = await supabase
    .from('matches')
    .select('id', { count: 'exact', head: true })
    .eq('tournament_id', tournamentId);
  if (cntErr) throw cntErr;
  if (existing > 0) throw new Error('A bracket already exists for this tournament. Reset it first in /admin.');

  const base = nextFixtureBase();
  const order = shuffle(players);

  // Pairs go from the outside so the R32 layout reads naturally (1 vs 16, 2 vs 15...).
  const created = [];
  for (let i = 0; i < order.length; i += 2) {
    const a = order[i];
    const b = order[i + 1] || null;
    const match = await insertMatch(supabase, { tournament, round: 1, pos: i / 2, a, b, base });
    created.push(match);
    if (b && a) {
      await supabase
        .from('players')
        .update({ status: 'playing' })
        .in('id', [a.id, b.id]);
    }
  }

  await supabase.from('tournaments').update({ status: 'active' }).eq('id', tournamentId);

  // Notify every player in round 1 with their fixture (Template 1).
  const notifications = [];
  for (const match of created) {
    if (match.player_a_player_id && match.player_b_player_id) {
      const a = players.find((p) => p.id === match.player_a_player_id);
      const b = players.find((p) => p.id === match.player_b_player_id);
      notifications.push(notifyFixture(supabase, match, a));
      notifications.push(notifyFixture(supabase, match, b));
    }
  }
  await Promise.allSettled(notifications);

  return { tournament, matches: created, count };
}

// Place a winner into the next round. Returns the (possibly updated) next match.
export async function advanceWinner(supabase, match, winnerPlayerId, notes = '') {
  if (match.round >= 5) {
    // Final complete - crown the champion.
    const winnerTag = match.player_a_player_id === winnerPlayerId ? match.player_a_tag : match.player_b_tag;
    await supabase
      .from('tournaments')
      .update({ status: 'complete', champion_id: winnerPlayerId, champion_tag: winnerTag })
      .eq('id', match.tournament_id);

    const loserPlayerId = match.player_a_player_id === winnerPlayerId ? match.player_b_player_id : match.player_a_player_id;
    const { data: loser } = await supabase.from('players').select('*').eq('id', loserPlayerId).single();
    const { data: winner } = await supabase.from('players').select('*').eq('id', winnerPlayerId).single();
    const tournament = await getTournamentById(supabase, match.tournament_id);

    await Promise.allSettled([
      notifyChampion(supabase, match, winner, tournament.name),
      notifyRunnerUp(supabase, loser, tournament.name),
    ]);
    return null;
  }

  const nextRound = match.round + 1;
  const nextPos = Math.floor(match.pos / 2);
  const slot = match.pos % 2 === 0 ? 'player_a' : 'player_b';

  // Find if the next match already exists (created by the sibling match).
  let { data: next, error } = await supabase
    .from('matches')
    .select('*')
    .eq('tournament_id', match.tournament_id)
    .eq('round', nextRound)
    .eq('pos', nextPos)
    .maybeSingle();
  if (error) throw error;

  const { data: winnerPlayer } = await supabase.from('players').select('*').eq('id', winnerPlayerId).single();

  if (!next) {
    next = await insertMatch(supabase, {
      tournament: await getTournamentById(supabase, match.tournament_id),
      round: nextRound,
      pos: nextPos,
      a: slot === 'player_a' ? winnerPlayer : null,
      b: slot === 'player_a' ? null : winnerPlayer,
      base: nextFixtureBase(),
    });
  } else {
    const update = { [slot + '_player_id']: winnerPlayerId, [slot + '_tag']: winnerPlayer.gamer_tag };
    if (next.player_a_player_id && next.player_b_player_id) update.status = 'pending';
    ({ data: next, error } = await supabase.from('matches').update(update).eq('id', next.id).select().single());
    if (error) throw error;
  }

  // Notifications.
  const notify = [];

  // Loser of the decided match gets Template 3.
  const loserPlayerId = match.player_a_player_id === winnerPlayerId ? match.player_b_player_id : match.player_a_player_id;
  const winnerTag = match.player_a_player_id === winnerPlayerId ? match.player_a_tag : match.player_b_tag;
  const { data: loserPlayer } = await supabase.from('players').select('*').eq('id', loserPlayerId).single();
  if (loserPlayer) notify.push(notifyLost(supabase, match, loserPlayer, winnerTag));

  // When the next match is full, both players get Template 2 (win + next opponent).
  if (next.player_a_player_id && next.player_b_player_id) {
    const { data: a } = await supabase.from('players').select('*').eq('id', next.player_a_player_id).single();
    const { data: b } = await supabase.from('players').select('*').eq('id', next.player_b_player_id).single();
    notify.push(notifyWinAndNextRound(supabase, next, a));
    notify.push(notifyWinAndNextRound(supabase, next, b));
  }

  await Promise.allSettled(notify);
  return next;
}

export async function getMatchesForTournament(supabase, tournamentId) {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('tournament_id', tournamentId)
    .order('round', { ascending: true })
    .order('pos', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getPastWinners(supabase) {
  const { data, error } = await supabase
    .from('tournaments')
    .select('name, champion_tag, created_at')
    .eq('status', 'complete')
    .order('created_at', { ascending: false })
    .limit(5);
  if (error) throw error;
  return data || [];
}