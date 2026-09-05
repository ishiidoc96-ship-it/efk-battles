// Config helpers + Supabase client factory.
// Single source of truth for env-driven settings used across API routes,
// pages and the standalone Express server.

import { createClient } from '@supabase/supabase-js';

const isBrowser = typeof window !== 'undefined';

export const cfg = {
  lipanaSecretKey: process.env.LIPANA_SECRET_KEY || '',
  lipanaWebhookSecret: process.env.LIPANA_WEBHOOK_SECRET || '',
  lipanaEnvironment: process.env.LIPANA_ENVIRONMENT || 'sandbox',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  whatsappToken: process.env.WHATSAPP_TOKEN || '',
  whatsappPhoneId: process.env.WHATSAPP_PHONE_ID || '',
  templates: {
    fixture: process.env.WHATSAPP_TEMPLATE_FIXTURE || '',
    win: process.env.WHATSAPP_TEMPLATE_WIN || '',
    lost: process.env.WHATSAPP_TEMPLATE_LOST || '',
    dispute: process.env.WHATSAPP_TEMPLATE_DISPUTE || '',
  },
  adminPassword: process.env.ADMIN_PASSWORD || '',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.BASE_URL || 'http://localhost:3000',
  entryFee: Number(process.env.ENTRY_FEE_KES || 100),
  maxPlayers: Number(process.env.MAX_PLAYERS || 32),
  tournamentDays: (process.env.TOURNAMENT_DAYS || '1,3,5')
    .split(',')
    .map((d) => Number(d.trim())),
  tournamentHour: Number(process.env.TOURNAMENT_HOUR || 20),
};

// Server-side client (used in API routes / Express). Safe to call with empty
// env - it only throws when you actually make a request without a URL.
export function supabaseServer() {
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required in .env');
  }
  return createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
}

// Browser client (used by pages for live reads). Requires the same env vars
// exposed to the client via NEXT_PUBLIC_... - fall back to an inert client so
// pages still render during `next build`.
let browserClient;
export function supabaseBrowser() {
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey) return null;
  if (!browserClient) {
    browserClient = createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  }
  return browserClient;
}

export { isBrowser };

export const ROUND_LABELS = { 1: 'R32', 2: 'R16', 3: 'QF', 4: 'SF', 5: 'F' };

// Per-round start offsets (minutes after the base fixture time).
export const ROUND_OFFSETS = { 1: 0, 2: 45, 3: 90, 4: 135, 5: 180 };

export const NO_SHOW_MINUTES = 15;