// Phone number helpers. Safaricom-only for M-Pesa + WhatsApp.
// Accepts 07XXXXXXXX (Safaricom), 2547XXXXXXXX, +2547XXXXXXXX, 011X (Safaricom 4G).

const SAFARICIM_PREFIXES = ['070', '071', '072', '074', '075', '076', '078', '079', '011'];

export function normalizeMobile(input) {
  if (!input) return null;
  let s = String(input).replace(/[^\d]/g, '');
  if (s.startsWith('254')) return '254' + s.slice(3);
  if (s.startsWith('0') && s.length === 10) return '254' + s.slice(1);
  if (s.length === 9 && s.startsWith('7')) return '254' + s;
  if (s.length === 9 && s.startsWith('1')) return '254' + s;
  return null;
}

// Check if a number is Safaricom (M-Pesa only works on Safaricom).
export function isSafaricom(input) {
  if (!input) return false;
  let s = String(input).replace(/[^\d]/g, '');
  // Normalize to local format for prefix check
  if (s.startsWith('254')) s = '0' + s.slice(3);
  if (s.length === 9) s = '0' + s;
  return SAFARICIM_PREFIXES.some((p) => s.startsWith(p));
}

// M-Pesa STK push wants international format.
export function toIntl(phone) {
  const n = normalizeMobile(phone);
  return n ? '+' + n : null;
}

// WhatsApp Cloud API wants country code WITHOUT the leading +.
export function toWhatsapp(phone) {
  return normalizeMobile(phone); // already 2547...
}

export const isValidMobile = (input) => !!normalizeMobile(input);
