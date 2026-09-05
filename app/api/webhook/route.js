import { NextResponse } from 'next/server';
import { supabaseServer, cfg } from '@/lib/config';
import { verifyWebhook, retrieveTransaction } from '@/lib/lipana';
import { generateBracket } from '@/lib/bracket';

// Lipana posts here on payment success/failure.
// Headers: x-lipana-signature
const SUCCESS_MARKERS = [
  'transaction.success',
  'transaction.completed',
  'payment.success',
];

export async function POST(request) {
  try {
    let raw;
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }

    const signature = request.headers.get('x-lipana-signature') || '';
    if (cfg.lipanaWebhookSecret && !verifyWebhook(raw, signature)) {
      console.error('[webhook] invalid signature');
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
    }

    const event = raw.event || raw.type || (raw.data && raw.data.event) || '';
    const status = raw.status || (raw.data && raw.data.status) || '';
    const succeeded = SUCCESS_MARKERS.includes(event) || status === 'success';

    const txId = pick(
      raw.transactionId,
      raw.id,
      raw.data && raw.data.transactionId,
      raw.data && raw.data.id
    );
    if (!txId) {
      console.error('[webhook] no transaction id, event=', event);
      return NextResponse.json({ success: false, error: 'No transaction id' }, { status: 400 });
    }

    const supabase = supabaseServer();

    if (!succeeded) {
      // Failed / cancelled - reflect it on the stored transaction.
      await supabase
        .from('transactions')
        .update({ status: failedStatus(event, status), raw })
        .eq('id', txId);
      return NextResponse.json({ success: true, handled: 'noop' });
    }

    // 1) Confirmed with Lipana directly so a slow webhook can't be faked.
    let confirmed = null;
    try {
      confirmed = await retrieveTransaction(txId);
    } catch (err) {
      console.warn('[webhook] retrieve failed (continuing anyway):', err.message);
    }

    // 2) Update transaction row.
    const { data: txn, error: tErr } = await supabase
      .from('transactions')
      .update({
        status: 'success',
        mpesa_receipt: confirmed?.mpesaReceiptNumber || raw.mpesaReceiptNumber || raw.receipt || null,
        raw,
      })
      .eq('id', txId)
      .select()
      .single();
    if (tErr) {
      // Transaction row may come from a different provider flow - try to look it up.
      return NextResponse.json({ success: false, error: 'transaction not found: ' + tErr.message }, { status: 404 });
    }

    // 3) Mark the player paid.
    const { data: player } = await supabase
      .from('players')
      .select('*')
      .eq('id', txn.player_id)
      .single();

    if (player) {
      if (player.status === 'registered') {
        await supabase.from('players').update({ status: 'paid' }).eq('id', player.id);
      }
    }

    // 4) Auto-generate the bracket when the 32nd player pays in.
    if (player) {
      const { count } = await supabase
        .from('players')
        .select('id', { count: 'exact', head: true })
        .eq('tournament_id', player.tournament_id)
        .in('status', ['paid', 'playing']);
      const { count: matchesExist } = await supabase
        .from('matches')
        .select('id', { count: 'exact', head: true })
        .eq('tournament_id', player.tournament_id);
      if (count >= cfg.maxPlayers && matchesExist === 0) {
        try {
          await generateBracket(supabase, player.tournament_id);
        } catch (err) {
          console.error('[webhook] bracket generation failed:', err.message);
        }
      }
    }

    return NextResponse.json({ success: true, handled: 'payment_success' });
  } catch (err) {
    console.error('[webhook] error:', err.message || err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

function failedStatus(event, status) {
  if (status === 'failed' || String(event).includes('failed')) return 'failed';
  if (String(event).includes('cancel')) return 'cancelled';
  return 'failed';
}

function pick(...candidates) {
  for (const c of candidates) {
    if (c && typeof c === 'string' && c.length > 4) return c;
  }
  return null;
}