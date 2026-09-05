import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/config';

// Public match detail for the upload page.
export async function GET(_request, context) {
  try {
    const { matchId } = await context.params;
    const supabase = supabaseServer();

    const { data: match, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();
    if (error || !match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json({
      match: {
        id: match.id,
        round_label: match.round_label,
        round: match.round,
        player_a_tag: match.player_a_tag,
        player_b_tag: match.player_b_tag,
        fixture_time: match.fixture_time,
        room_code: match.room_code,
        status: match.status,
        winner_player_id: match.winner_player_id,
        final_score: match.final_score,
        notes: match.notes,
        a_uploaded: !!match.upload_a_url,
        b_uploaded: !!match.upload_b_url,
        a_scored: match.a_scored,
        a_conceded: match.a_conceded,
        b_scored: match.b_scored,
        b_conceded: match.b_conceded,
        needs_recording: match.round >= 4,
      },
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.BASE_URL || '',
    });
  } catch (err) {
    console.error('[match] error:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}