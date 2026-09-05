import { NextResponse } from 'next/server';
import { cfg, ROUND_LABELS } from '@/lib/config';
import { nextFixtureBase, formatEventTime } from '@/lib/time';

export async function GET() {
  try {
    let supabase;
    try { supabase = (await import('@/lib/config')).supabaseServer(); } catch { supabase = null; }

    if (!supabase) {
      const next = nextFixtureBase();
      return NextResponse.json({
        tournament: { id: 'mock', status: 'registering' },
        maxPlayers: cfg.maxPlayers,
        entryFee: cfg.entryFee,
        paidCount: Math.floor(Math.random() * 12) + 14,
        registeredCount: Math.floor(Math.random() * 12) + 14,
        nextFixtureTime: next.toISOString(),
        nextFixtureTimeLabel: formatEventTime(next),
        matches: [],
        byRound: {},
        players: [],
        pastWinners: [],
      });
    }

    const { getCurrentTournament, getMatchesForTournament, getPastWinners } = await import('@/lib/bracket');
    const tournament = await getCurrentTournament(supabase);

    const [matches, pastWinners, paidRows] = await Promise.all([
      getMatchesForTournament(supabase, tournament.id),
      getPastWinners(supabase),
      supabase
        .from('players')
        .select('gamer_tag, status, created_at')
        .eq('tournament_id', tournament.id)
        .in('status', ['paid', 'playing', 'registered'])
        .order('created_at', { ascending: true }),
    ]);

    const paidCount = paidRows.data?.filter((p) => p.status !== 'registered').length || 0;
    const registeredCount = paidRows.data?.length || 0;

    const byRound = {};
    for (const m of matches || []) {
      byRound[m.round_label || ROUND_LABELS[m.round]] = byRound[m.round_label || ROUND_LABELS[m.round]] || [];
      byRound[m.round_label || ROUND_LABELS[m.round]].push(m);
    }

    return NextResponse.json({
      tournament,
      maxPlayers: cfg.maxPlayers,
      entryFee: cfg.entryFee,
      paidCount,
      registeredCount,
      nextFixtureTime: nextFixtureBase().toISOString(),
      nextFixtureTimeLabel: formatEventTime(nextFixtureBase()),
      matches: matches || [],
      byRound,
      players: (paidRows.data || []).map((p) => ({
        tag: p.gamer_tag,
        status: p.status,
      })),
      pastWinners,
    });
  } catch (err) {
    console.error('[tournament] error:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}