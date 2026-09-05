// Thin wrapper around the official @lipana/sdk so the rest of the codebase
// (and the API routes) never touches it directly.

import { Lipana } from '@lipana/sdk';
import { cfg } from './config.js';

let client;

export function lipanaClient() {
  if (!cfg.lipanaSecretKey) {
    throw new Error('LIPANA_SECRET_KEY is required in .env');
  }
  if (!client) {
    client = new Lipana({
      apiKey: cfg.lipanaSecretKey,
      environment: cfg.lipanaEnvironment === 'production' ? 'production' : 'sandbox',
      baseUrl: process.env.LIPANA_BASE_URL || undefined,
    });
  }
  return client;
}

// Initiate an STK push. Returns { transactionId, checkoutRequestID, ... }.
export async function initiateStkPush({ phone, amount, accountReference }) {
  const lipana = lipanaClient();
  return lipana.transactions.initiateStkPush({
    phone,
    amount,
    accountReference: accountReference || 'EFK BATTLES',
    transactionDesc: 'EFK Battles entry fee',
  });
}

export async function retrieveTransaction(transactionId) {
  const lipana = lipanaClient();
  return lipana.transactions.retrieve(transactionId);
}

// Verify the x-lipana-signature header on incoming webhooks.
export function verifyWebhook(body, signature) {
  const lipana = lipanaClient();
  try {
    return lipana.webhooks.verify(body, signature, cfg.lipanaWebhookSecret);
  } catch (err) {
    console.error('[lipana] signature verify failed:', err.message);
    return false;
  }
}