import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/config';

// Polled by the register page every ~2s until the webhook flips it to success.
export async function GET(_request, context) {
  try {
    const { transactionId } = await context.params;
    if (!transactionId) {
      return NextResponse.json({ status: 'invalid' }, { status: 400 });
    }
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('transactions')
      .select('status')
      .eq('id', transactionId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ status: 'pending' });
    return NextResponse.json({ status: data.status });
  } catch (err) {
    console.error('[status] error:', err.message);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}