// Payment abstraction — tries Lipana first, falls back to raw Daraja.
// Set whichever credentials you have in .env.

import { cfg } from './config.js';

let lipanaMod = null;
let darajaMod = null;

async function getLipana() {
  if (!lipanaMod && cfg.lipanaSecretKey) {
    lipanaMod = await import('./lipana.js');
  }
  return lipanaMod;
}

async function getDaraja() {
  if (!darajaMod) {
    darajaMod = await import('./daraja.js');
  }
  return darajaMod;
}

export async function initiatePayment({ phone, amount, accountReference }) {
  // Try Lipana first if configured
  if (cfg.lipanaSecretKey) {
    try {
      const mod = await getLipana();
      if (mod) return await mod.initiateStkPush({ phone, amount, accountReference });
    } catch (err) {
      console.warn('[payment] Lipana failed, trying Daraja:', err.message);
    }
  }

  // Fall back to raw Daraja
  if (process.env.DARAJA_CONSUMER_KEY) {
    try {
      const mod = await getDaraja();
      return await mod.stkPush({ phone, amount, accountReference });
    } catch (err) {
      console.error('[payment] Daraja failed:', err.message);
      throw err;
    }
  }

  throw new Error('No payment provider configured. Set LIPANA_SECRET_KEY or DARAJA_CONSUMER_KEY in .env');
}

export async function queryPaymentStatus(transactionId) {
  // For Lipana
  if (cfg.lipanaSecretKey) {
    try {
      const { retrieveTransaction } = await import('./lipana.js');
      const tx = await retrieveTransaction(transactionId);
      return tx?.status || 'pending';
    } catch {}
  }

  // For Daraja, query the STK status
  if (process.env.DARAJA_CONSUMER_KEY && transactionId) {
    try {
      const { queryStkStatus } = await import('./daraja.js');
      const result = await queryStkStatus(transactionId);
      if (result.ResponseCode === '0') return 'success';
      if (result.ResponseCode === '1032') return 'cancelled';
      if (result.ResultCode === '0') return 'success';
      return 'pending';
    } catch {}
  }

  return 'pending';
}

export function hasPaymentProvider() {
  return !!(cfg.lipanaSecretKey || process.env.DARAJA_CONSUMER_KEY);
}

export function getPaymentProvider() {
  if (cfg.lipanaSecretKey) return 'lipana';
  if (process.env.DARAJA_CONSUMER_KEY) return 'daraja';
  return 'none';
}