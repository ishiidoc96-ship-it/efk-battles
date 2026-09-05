// WhatsApp messaging abstraction.
// Switches between Baileys (free, local, QR scan) and Meta Cloud API (production).
//
// Set WHATSAPP_MODE in .env:
//   baileys  -> uses @whiskeysockets/baileys (free, no business verification)
//   meta     -> uses Meta WhatsApp Cloud API (production, requires template approval)

import { cfg } from './config.js';
import { toWhatsapp } from './phone.js';

const MODE = (process.env.WHATSAPP_MODE || 'baileys').toLowerCase();

// Lazy-loaded module instances.
let baileysMod = null;
let metaMod = null;

async function getBaileys() {
  if (!baileysMod) {
    baileysMod = await import('./whatsapp-baileys.js');
  }
  return baileysMod;
}

async function getMeta() {
  if (!metaMod) {
    metaMod = await import('./whatsapp-meta.js');
  }
  return metaMod;
}

// ---- Public API ----

export async function sendWhatsAppText(phone, text) {
  const number = toWhatsapp(phone);
  if (!number) return { ok: false, error: 'Invalid phone number' };

  if (MODE === 'baileys') {
    const mod = await getBaileys();
    return mod.sendText(number, text);
  }
  const mod = await getMeta();
  return mod.sendWhatsAppText(number, text);
}

export async function sendWhatsAppTemplate(phone, templateName, parameters = []) {
  const number = toWhatsapp(phone);
  if (!number) return { ok: false, error: 'Invalid phone number' };

  if (MODE === 'baileys') {
    const mod = await getBaileys();
    return mod.sendTemplate(number, templateName, parameters);
  }
  const mod = await getMeta();
  return mod.sendWhatsAppTemplate(number, templateName, parameters);
}

// Convenience: route a message to a template or plain-text fallback.
export async function sendMessage(phone, { template, text, params = [] } = {}) {
  if (template && cfg.templates[template]) {
    return sendWhatsAppTemplate(phone, cfg.templates[template], params);
  }
  return sendWhatsAppText(phone, text || 'No message content');
}

export async function getWhatsAppStatus() {
  if (MODE === 'baileys') {
    const mod = await getBaileys();
    return { mode: 'baileys', status: mod.getConnectionStatus() };
  }
  return { mode: 'meta', status: cfg.whatsappToken ? 'configured' : 'no_token' };
}

export async function initWhatsAppBot() {
  if (MODE !== 'baileys') return null;
  const mod = await getBaileys();
  return mod.initWhatsApp(
    (qr) => { console.log('[whatsapp] QR received - scan with your phone'); },
    (status) => { console.log('[whatsapp] Connection:', status); }
  );
}

export async function getWhatsAppQR() {
  if (MODE !== 'baileys') return null;
  const mod = await getBaileys();
  return mod.getLatestQR();
}

export async function logoutWhatsApp() {
  if (MODE !== 'baileys') return;
  const mod = await getBaileys();
  return mod.logout();
}