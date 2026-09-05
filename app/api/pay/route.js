import { NextResponse } from 'next/server';
import { supabaseServer, cfg } from '@/lib/config';
import { initiateStkPush } from '@/lib/lipana';
import { toIntl } from '@/lib/phone';

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const player_id = String(body.player_id || '');
    if (!player_id) {
      return NextResponse.json({ error: 'player_id is required' }, { status: 400 });
    }

    const supabase = supabaseServer();
    const { data: player, error: pErr } = await supabase
      .from('players')
      .select('*')
      .eq('id', player_id)
      .single();
    if (pErr || !player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }

    if (['paid', 'playing'].includes(player.status)) {
      return NextResponse.json(
        { error: 'Payment already confirmed for this player' },
        { status: 409 }
      );
    }

    const phone = toIntl(player.mpesa);
    if (!phone) {
      return NextResponse.json({ error: 'Player has an invalid M-Pesa number' }, { status: 400 });
    }

    const amount = cfg.entryFee;
    const stk = await initiateStkPush({
      phone,
      amount,
      accountReference: `EFK-${player.gamer_tag.slice(0, 18)}`,
    });

    const { error: tErr } = await supabase.from('transactions').insert({
      id: stk.transactionId,
      player_id: player.id,
      amount,
      phone: normalizeForStore(player.mpesa),
      status: 'pending',
      raw: stk,
    });
    if (tErr) {
      console.error('[pay] txn insert error:', tErr.message);
      return NextResponse.json({ error: 'Could not store transaction' }, { status: 500 });
    }

    await supabase.from('players').update({ transaction_id: stk.transactionId }).eq('id', player.id);

    return NextResponse.json({
      transactionId: stk.transactionId,
      customerMessage: stk.customerMessage,
      message: 'STK push sent. Enter your M-Pesa PIN.',
    });
  } catch (err) {
    console.error('[pay] error:', err.message || err);
    const msg = (err.message || '').toLowerCase();
    if (msg.includes('api') || msg.includes('lipana') || msg.includes('initiate')) {
      return NextResponse.json({ error: 'Payment init failed - check LIPANA_SECRET_KEY' }, { status: 500 });
    }
    return NextResponse.json({ error: err.message || 'Could not initiate payment' }, { status: 500 });
  }
}

function normalizeForStore(phone) {
  return String(phone).replace(/[^\d]/g, '');
}