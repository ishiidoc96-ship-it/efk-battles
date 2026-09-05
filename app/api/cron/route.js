import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/config';
import { resolveNoShows } from '@/lib/resolve';

const CRON_SECRET = process.env.CRON_SECRET || '';

export async function GET(request) {
  if (CRON_SECRET && request.headers.get('x-cron-secret') !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = supabaseServer();
    const { data: tournaments } = await supabase
      .from('tournaments')
      .select('id,name')
      .in('status', ['open', 'active']);

    const results = [];
    for (const t of tournaments || []) {
      const resolved = await resolveNoShows(supabase, t.id);
      if (resolved.length) results.push({ tournament: t.name, resolved });
    }
    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error('[cron] error:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}