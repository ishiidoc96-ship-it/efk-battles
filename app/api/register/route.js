import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/config';
import { getOrCreateTournament } from '@/lib/bracket';
import { normalizeMobile, isValidMobile, isSafaricom } from '@/lib/phone';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const gamer_tag = String(body.gamer_tag || '').trim();
    const ef_id = String(body.ef_id || '').trim();
    const phone = String(body.phone || '').trim();

    if (!gamer_tag || !ef_id) {
      return NextResponse.json({ error: 'Gamer tag and eFootball ID are required' }, { status: 400 });
    }
    if (gamer_tag.length > 40) {
      return NextResponse.json({ error: 'Gamer tag too long (max 40 chars)' }, { status: 400 });
    }
    if (!isValidMobile(phone)) {
      return NextResponse.json({ error: 'Phone number must be like 0712345678' }, { status: 400 });
    }
    if (!isSafaricom(phone)) {
      return NextResponse.json(
        { error: 'M-Pesa only works on Safaricom. Please use a Safaricom number (070X, 071X, 072X, 074X, 075X, 076X, 078X, 079X).' },
        { status: 400 }
      );
    }

    const supabase = supabaseServer();
    const tournament = await getOrCreateTournament(supabase);

    // Hard cap on paid players. Registration is still allowed as a waitlist.
    const { count: paidCount } = await supabase
      .from('players')
      .select('id', { count: 'exact', head: true })
      .eq('tournament_id', tournament.id)
      .in('status', ['paid', 'playing']);

    const normalized = normalizeMobile(phone);
    const { data: player, error } = await supabase
      .from('players')
      .insert({
        tournament_id: tournament.id,
        gamer_tag,
        ef_id,
        whatsapp: normalized,
        mpesa: normalized,
        status: 'registered',
        waitlisted: paidCount >= 32,
      })
      .select()
      .single();
    if (error) {
      console.error('[register] supabase error:', error.message);
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A player with this gamer tag already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: 'Could not save player' }, { status: 500 });
    }

    return NextResponse.json({ player, paidCount });
  } catch (err) {
    console.error('[register] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}