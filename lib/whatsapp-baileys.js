// WhatsApp Bot using Baileys (free GitHub WhatsApp Web API).
// No Meta business verification needed. Scan QR with your phone to connect.
//
// For local trial:  WHATSAPP_MODE=baileys   (uses this file)
// For production:   WHATSAPP_MODE=meta      (uses Meta Cloud API)
//
// Session data is saved to ./whatsapp-session/ so you don't re-scan every restart.

import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_DIR = path.join(__dirname, '..', 'whatsapp-session');
const logger = pino({ level: 'silent' });

let sock = null;
let qrCallback = null;
let connectionCallback = null;
let isReady = false;

// Initialize the WhatsApp connection.
export async function initWhatsApp(onQR, onConnection) {
  qrCallback = onQR;
  connectionCallback = onConnection;

  if (!fs.existsSync(SESSION_DIR)) {
    fs.mkdirSync(SESSION_DIR, { recursive: true });
  }

  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    logger,
    browser: ['EFK Battles Bot', 'Chrome', '120.0'],
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('[whatsapp-baileys] Scan this QR code with your WhatsApp:');
      if (qrCallback) qrCallback(qr);
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log('[whatsapp-baileys] Connection closed:', statusCode, shouldReconnect ? '(reconnecting)' : '(logged out)');
      isReady = false;
      if (connectionCallback) connectionCallback('disconnected');
      if (shouldReconnect) {
        setTimeout(() => initWhatsApp(onQR, onConnection), 3000);
      }
    }

    if (connection === 'open') {
      isReady = true;
      console.log('[whatsapp-baileys] Connected successfully!');
      if (connectionCallback) connectionCallback('connected');
    }
  });

  return sock;
}

// Send a plain text message to any phone number.
// phone should be in format "2547XXXXXXXX" (no +).
export async function sendText(phone, text) {
  if (!sock || !isReady) {
    console.warn('[whatsapp-baileys] Not connected, skipping message to', phone);
    return { ok: false, error: 'not_connected' };
  }

  const jid = phone.includes('@') ? phone : `${phone.replace(/[^0-9]/g, '')}@s.whatsapp.net`;

  try {
    await sock.sendMessage(jid, { text });
    console.log('[whatsapp-baileys] Sent to', phone);
    return { ok: true };
  } catch (err) {
    console.error('[whatsapp-baileys] Send failed:', err.message);
    return { ok: false, error: err.message };
  }
}

// Template-style message (for Baileys we just send formatted text, no real templates).
export async function sendTemplate(phone, templateName, parameters = []) {
  const text = formatTemplate(templateName, parameters);
  return sendText(phone, text);
}

// Format a template message as plain text.
function formatTemplate(name, params) {
  const [p1, p2, p3, p4] = params;
  switch (name) {
    case 'fixture':
      return `⚽ EFK BATTLES - FIXTURE CONFIRMED!\n\nOpponent: ${p1 || 'TBD'}\nRoom Code: ${p2 || '----'}\nTime: Tonight ${p3 || '8PM'}\n\nUpload your result screenshot here:\n${p4 || 'https://efk.vercel.app/upload'}`;
    case 'win':
      return `🔥 YOU WON! The crowd ni nyama yako!\n\nNext opponent: ${p1 || 'TBD'}\nRoom Code: ${p2 || '----'}\nTime: Tonight ${p3 || '8PM'}\n\nUpload result here:\n${p4 || 'https://efk.vercel.app/upload'}`;
    case 'lost':
      return `😤 Game over G. ${p1 || 'Your opponent'} took the battle.\nYou lost this one - come back for the next EFK Battles. The pot epo!`;
    case 'dispute':
      return `⚠️ We could not confirm your match result vs ${p1 || 'your opponent'}.\nUnder review - admin will check both screenshots and respond soon.`;
    default:
      return params.join(' | ');
  }
}

// Get connection status.
export function getConnectionStatus() {
  return isReady ? 'connected' : 'disconnected';
}

// Get QR code data (for displaying in admin panel).
let latestQR = null;
export function getLatestQR() {
  return latestQR;
}

// Logout / disconnect.
export async function logout() {
  if (sock) {
    try { await sock.logout(); } catch {}
    sock = null;
    isReady = false;
  }
  // Clear session files
  if (fs.existsSync(SESSION_DIR)) {
    fs.rmSync(SESSION_DIR, { recursive: true, force: true });
  }
}