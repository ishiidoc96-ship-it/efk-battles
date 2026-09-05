import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/config';
import { resolveMatch } from '@/lib/resolve';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request, context) {
  try {
    const { matchId } = await context.params;
    const form = await request.formData();

    const gamer_tag = String(form.get('gamer_tag') || '').trim();
    const score = Number(String(form.get('score') || '').trim());
    const opp_score = Number(String(form.get('opp_score') || '').trim());
    const recording = String(form.get('recording') || '').trim();
    const file = form.get('screenshot');

    if (!gamer_tag) return NextResponse.json({ error: 'Enter your gamer tag' }, { status: 400 });
    if (!Number.isInteger(score) || !Number.isInteger(opp_score) || score < 0 || opp_score < 0 || score > 99 || opp_score > 99) {
      return NextResponse.json({ error: 'Scores must be whole numbers 0-99' }, { status: 400 });
    }
    if (!file || !file.name) {
      return NextResponse.json({ error: 'Upload the result screenshot' }, { status: 400 });
    }
    if (!String(file.type || '').startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }
    const bytes = file.size || Number(form.get('size') || 0);
    if (bytes > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'Screenshot too large - max 5MB' }, { status: 400 });
    }

    const supabase = supabaseServer();
    const { data: match, error: mErr } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();
    if (mErr || !match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }
    if (match.status !== 'pending') {
      return NextResponse.json(
        { error: `This match is already ${match.status}` },
        { status: 409 }
      );
    }

    const isA = match.player_a_tag === gamer_tag;
    const isB = match.player_b_tag === gamer_tag;
    if (!isA && !isB) {
      return NextResponse.json(
        { error: `"${gamer_tag}" is not one of the players in this match` },
        { status: 403 }
      );
    }

    if (match.round >= 4) {
      if (!recording || !/^https?:\/\//i.test(recording)) {
        return NextResponse.json({ error: 'Semis & Final require a screen recording link' }, { status: 400 });
      }
    }

    // Upload to Supabase Storage (bucket: screenshots).
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().slice(0, 5);
    const path = `matches/${match.tournament_id}/${match.id}/${isA ? 'a' : 'b'}-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: upErr } = await supabase.storage.from('screenshots').upload(path, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });
    if (upErr) {
      console.error('[upload] storage error:', upErr.message);
      return NextResponse.json(
        { error: 'Could not store screenshot - is the "screenshots" bucket created? See supabase.sql' },
        { status: 500 }
      );
    }
    const publicUrl = supabase.storage.from('screenshots').getPublicUrl(path).data.publicUrl;

    const side = isA ? 'a' : 'b';
    let patch;
    if (side === 'a') {
      patch = {
        upload_a_url: publicUrl,
        a_scored: score,
        a_conceded: opp_score,
        upload_a_at: new Date().toISOString(),
      };
    } else {
      patch = {
        upload_b_url: publicUrl,
        b_scored: score,
        b_conceded: opp_score,
        upload_b_at: new Date().toISOString(),
      };
    }
    if (match.round >= 4 && recording) {
      patch[`recording_${side}_url`] = recording;
    }

    const { error: up2Err } = await supabase.from('matches').update(patch).eq('id', match.id);
    if (up2Err) {
      console.error('[upload] db error:', up2Err.message);
      return NextResponse.json({ error: 'Could not save result' }, { status: 500 });
    }

    const outcome = await resolveMatch(supabase, match.id);
    return NextResponse.json({
      ok: true,
      uploaded: true,
      result: outcome.result,
      reason: outcome.reason || null,
      message:
        outcome.result === 'approved'
          ? 'Result confirmed - check WhatsApp for the next fixture.'
          : outcome.result === 'disputed'
            ? 'Scores do not match. Your upload is kept - admin will review both screenshots.'
            : 'Score recorded. Waiting for your opponent to upload.',
    });
  } catch (err) {
    console.error('[upload] error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}