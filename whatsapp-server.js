// Standalone WhatsApp Baileys bot server.
// Runs alongside Next.js on port 3002.
// The admin panel calls this server to get QR and send messages.
//
// Start with: node whatsapp-server.js

import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import QRCode from 'qrcode';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_DIR = path.join(__dirname, 'whatsapp-session');
const PORT = process.env.WHATSAPP_PORT || 3002;
const logger = pino({ level: 'silent' });

let sock = null;
let latestQR = null;
let connectionStatus = 'disconnected';

async function startBot() {
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
      latestQR = qr;
      connectionStatus = 'waiting_scan';
      console.log('[whatsapp] QR code received. Scan with your phone.');
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log('[whatsapp] Connection closed:', statusCode, shouldReconnect ? '(reconnecting)' : '(logged out)');
      connectionStatus = 'disconnected';
      latestQR = null;
      if (shouldReconnect) {
        setTimeout(startBot, 3000);
      }
    }

    if (connection === 'open') {
      connectionStatus = 'connected';
      latestQR = null;
      console.log('[whatsapp] Connected! Bot is ready.');
    }
  });
}

// Send text message to a phone number
async function sendText(phone, text) {
  if (!sock || connectionStatus !== 'connected') {
    return { ok: false, error: 'not_connected' };
  }
  const jid = phone.includes('@') ? phone : `${phone.replace(/[^0-9]/g, '')}@s.whatsapp.net`;
  try {
    await sock.sendMessage(jid, { text });
    console.log('[whatsapp] Sent to', phone);
    return { ok: true };
  } catch (err) {
    console.error('[whatsapp] Send failed:', err.message);
    return { ok: false, error: err.message };
  }
}

// HTTP server for admin panel to communicate with
const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // GET /status - connection status + QR
  if (url.pathname === '/status' && req.method === 'GET') {
    let qrImage = null;
    if (latestQR) {
      try {
        qrImage = await QRCode.toDataURL(latestQR, { width: 256, margin: 2 });
      } catch {}
    }
    res.writeHead(200);
    return res.end(JSON.stringify({
      status: connectionStatus,
      qr: qrImage,
      connected: connectionStatus === 'connected',
    }));
  }

  // POST /send - send a message
  if (url.pathname === '/send' && req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;
    try {
      const { phone, text } = JSON.parse(body);
      if (!phone || !text) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: 'phone and text required' }));
      }
      const result = await sendText(phone, text);
      res.writeHead(result.ok ? 200 : 500);
      return res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(500);
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  // POST /logout - disconnect and clear session
  if (url.pathname === '/logout' && req.method === 'POST') {
    try {
      if (sock) {
        try { await sock.logout(); } catch {}
        sock = null;
      }
      connectionStatus = 'disconnected';
      latestQR = null;
      if (fs.existsSync(SESSION_DIR)) {
        fs.rmSync(SESSION_DIR, { recursive: true, force: true });
      }
      res.writeHead(200);
      return res.end(JSON.stringify({ ok: true, message: 'Logged out. Restart server to re-scan QR.' }));
    } catch (err) {
      res.writeHead(500);
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Start everything
startBot();
server.listen(PORT, () => {
  console.log(`[whatsapp] Bot server running on http://localhost:${PORT}`);
  console.log(`[whatsapp] Endpoints:`);
  console.log(`  GET  /status  - connection status + QR code`);
  console.log(`  POST /send    - send message { phone, text }`);
  console.log(`  POST /logout  - disconnect and clear session`);
});
