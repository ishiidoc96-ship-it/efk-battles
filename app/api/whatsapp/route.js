import { NextResponse } from 'next/server';
import { getWhatsAppStatus, getWhatsAppQR, logoutWhatsApp } from '@/lib/whatsapp';
import { cfg } from '@/lib/config';

export async function GET() {
  try {
    const status = await getWhatsAppStatus();
    const qr = status.mode === 'baileys' ? await getWhatsAppQR() : null;
    return NextResponse.json({ ...status, qr });
  } catch (err) {
    return NextResponse.json({ mode: 'unknown', status: 'error', error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const pw = request.headers.get('x-admin-password') || '';
  if (!cfg.adminPassword || pw !== cfg.adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await logoutWhatsApp();
    return NextResponse.json({ ok: true, message: 'Logged out. Re-scan QR on next connection.' });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}