// Safaricom Daraja API — raw M-Pesa integration.
// Free. Register at https://developer.safaricom.co.ke
//
// Environment variables needed:
//   DARAJA_CONSUMER_KEY=
//   DARAJA_CONSUMER_SECRET=
//   DARAJA_PASSKEY=         (from Lipa Na M-Pesa Online > Shortcode credentials)
//   DARAJA_SHORTCODE=       (your till/paybill number)
//   DARAJA_CALLBACK_URL=    (https://your-domain.com/api/daraja-callback)

const BASE_URL = process.env.DARAJA_ENV === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const key = process.env.DARAJA_CONSUMER_KEY;
  const secret = process.env.DARAJA_CONSUMER_SECRET;
  if (!key || !secret) throw new Error('DARAJA_CONSUMER_KEY and DARAJA_CONSUMER_SECRET required');

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');
  const res = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: { Authorization: `Basic ${auth}` },
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Daraja auth failed: ' + JSON.stringify(data));

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

function generateTimestamp() {
  const d = new Date();
  return d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0') +
    String(d.getHours()).padStart(2, '0') +
    String(d.getMinutes()).padStart(2, '0') +
    String(d.getSeconds()).padStart(2, '0');
}

function generatePassword(shortcode, passkey, timestamp) {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
}

// Initiate STK Push. Returns { MerchantRequestID, CheckoutRequestID, ResponseCode, ... }
export async function stkPush({ phone, amount, accountReference = 'EFK BATTLES' }) {
  const token = await getAccessToken();
  const shortcode = process.env.DARAJA_SHORTCODE;
  const passkey = process.env.DARAJA_PASSKEY;
  const callbackUrl = process.env.DARAJA_CALLBACK_URL || '';

  if (!shortcode || !passkey) throw new Error('DARAJA_SHORTCODE and DARAJA_PASSKEY required');

  const timestamp = generateTimestamp();
  const password = generatePassword(shortcode, passkey, timestamp);

  // Format phone: ensure 254 prefix, no + or spaces
  const formatted = phone.replace(/[^0-9]/g, '');
  const phone254 = formatted.startsWith('254') ? formatted : '254' + formatted.replace(/^0/, '');

  const res = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone254,
      PartyB: shortcode,
      PhoneNumber: phone254,
      CallBackURL: callbackUrl,
      AccountReference: accountReference.slice(0, 12),
      TransactionDesc: 'EFK Battles entry fee',
    }),
  });

  const data = await res.json();
  return {
    transactionId: data.MerchantRequestID || data.CheckoutRequestID || `daraja-${Date.now()}`,
    CheckoutRequestID: data.CheckoutRequestID,
    MerchantRequestID: data.MerchantRequestID,
    ResponseCode: data.ResponseCode,
    ResponseDescription: data.ResponseDescription,
    CustomerMessage: data.CustomerMessage,
  };
}

// Query STK push status.
export async function queryStkStatus(checkoutRequestId) {
  const token = await getAccessToken();
  const shortcode = process.env.DARAJA_SHORTCODE;
  const passkey = process.env.DARAJA_PASSKEY;
  const timestamp = generateTimestamp();
  const password = generatePassword(shortcode, passkey, timestamp);

  const res = await fetch(`${BASE_URL}/mpesa/stkpushquery/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
  });

  return res.json();
}