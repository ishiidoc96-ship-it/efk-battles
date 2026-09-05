import { NextResponse } from 'next/server';
import { supabaseServer, cfg } from '@/lib/config';
import { generateBracket, getMatchesForTournament } from '@/lib/bracket';
import { resolveNoShows, adminApproveMatch, adminRejectMatch } from '@/lib/resolve';
import { notifyFixture } from '@/lib/notify';

function authorized(request) {
  const pw = request.headers.get('x-admin-password') || '';
  if (!cfg.adminPassword) {
    return { ok: false, message: 'Set ADMIN_PASSWORD in .env' };
  }
  if (pw !== cfg.adminPassword) {
    return { ok: false, message: 'Wrong admin password' };
  }
  return { ok: true };
}

export async function GET(request) {
  const auth = authorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: 401 });

  try {
    const supabase = supabaseServer();

    const { data: tournament } = await supabase
      .from('tournaments')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const activeTournament =
      tournament ||
      (await supabase
        .from('tournaments')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle())
        .data;

    const tId = activeTournament?.id || null;

    const [players, matches, txns] = await Promise.all([
      tId
        ? supabase.from('players').select('*').eq('tournament_id', tId).order('created_at', { ascending: true })
        : Promise.resolve({ data: [] }),
      tId ? getMatchesForTournament(supabase, tId).catch(() => []) : Promise.resolve([]),
      supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(30),
    ]);

    const paidCount = players.data?.filter((p) => ['paid', 'playing'].includes(p.status)).length || 0;

    return NextResponse.json({
      tournament: activeTournament,
      stats: { totalPlayers: players.data?.length || 0, paidCount, matchCount: matches.length },
      players: players.data || [],
      matches,
      transactions: txns.data || [],
    });
  } catch (err) {
    console.error('[admin] error:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = authorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { action } = body;
  const supabase = supabaseServer();

  try {
    switch (action) {
      case 'generate_bracket': {
        const tId = body.tournament_id;
        if (!tId) return NextResponse.json({ error: 'tournament_id required' }, { status: 400 });
        const res = await generateBracket(supabase, tId);
        return NextResponse.json({ ok: true, ...res });
      }

      case 'reset': {
        const tId = body.tournament_id;
        if (!tId) return NextResponse.json({ error: 'tournament_id required' }, { status: 400 });
        await supabase.from('matches').delete().eq('tournament_id', tId);
        await supabase
          .from('players')
          .update({ status: 'paid' })
          .eq('tournament_id', tId)
          .in('status', ['playing']);
        await supabase.from('tournaments').update({ status: 'open' }).eq('id', tId);
        return NextResponse.json({ ok: true });
      }

      case 'resolve_noshows': {
        const tId = body.tournament_id;
        if (!tId) return NextResponse.json({ error: 'tournament_id required' }, { status: 400 });
        const resolved = await resolveNoShows(supabase, tId);
        return NextResponse.json({ ok: true, resolved });
      }

      case 'approve': {
        if (!body.match_id || !body.winner_player_id) {
          return NextResponse.json({ error: 'match_id and winner_player_id required' }, { status: 400 });
        }
        const res = await adminApproveMatch(supabase, body.match_id, body.winner_player_id);
        return NextResponse.json({ ok: true, ...res });
      }

      case 'reject': {
        if (!body.match_id) return NextResponse.json({ error: 'match_id required' }, { status: 400 });
        const res = await adminRejectMatch(supabase, body.match_id);
        return NextResponse.json({ ok: true, match: res });
      }

      case 'resend_fixture': {
        if (!body.match_id) return NextResponse.json({ error: 'match_id required' }, { status: 400 });
        const { data: match } = await supabase.from('matches').select('*').eq('id', body.match_id).single();
        if (!match) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
        const { data: players } = await supabase
          .from('players')
          .select('*')
          .in('id', [match.player_a_player_id, match.player_b_player_id]);
        const sent = [];
        for (const p of players || []) {
          const r = await notifyFixture(supabase, match, p);
          sent.push({ player: p.gamer_tag, ok: r.ok });
        }
        return NextResponse.json({ ok: true, sent });
      }

      case 'resend_win': {
        if (!body.match_id) return NextResponse.json({ error: 'match_id required' }, { status: 400 });
        const { data: match } = await supabase.from('matches').select('*').eq('id', body.match_id).single();
        if (!match || match.player_a_player_id === null || match.player_b_player_id === null) {
          return NextResponse.json({ error: 'Match not full yet' }, { status: 400 });
        }
        const { data: players } = await supabase
          .from('players')
          .select('*')
          .in('id', [match.player_a_player_id, match.player_b_player_id]);
        const { notifyWinAndNextRound } = await import('@/lib/notify');
        const sent = [];
        for (const p of players || []) {
          const r = await notifyWinAndNextRound(supabase, match, p);
          sent.push({ player: p.gamer_tag, ok: r.ok });
        }
        return NextResponse.json({ ok: true, sent });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    console.error('[admin] action error:', err.message || err);
    return NextResponse.json({ error: err.message || 'Action failed' }, { status: 500 });
  }
}