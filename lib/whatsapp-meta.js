// Meta WhatsApp Cloud API (Graph API v20.0) - message sending only.
// Use when WHATSAPP_MODE=meta. Requires business verification + template approval.

const API = 'https://graph.facebook.com/v20.0';

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN || ''}`,
  };
}

export async function sendWhatsAppTemplate(phone, templateName, parameters = []) {
  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_ID) {
    console.warn('[whatsapp-meta] token/phone id not configured, skipping');
    return { ok: false, skipped: true };
  }
  const body = {
    messaging_product: 'whatsapp',
    to: phone,
    type: 'template',
    template: {
      name: templateName,
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: parameters.map((text) => ({ type: 'text', text: String(text) })),
        },
      ],
    },
  };

  try {
    const res = await fetch(`${API}/${process.env.WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[whatsapp-meta] send failed', res.status, JSON.stringify(json));
      return { ok: false, error: json };
    }
    return { ok: true, id: json.messages?.[0]?.id || null };
  } catch (err) {
    console.error('[whatsapp-meta] request error:', err.message);
    return { ok: false, error: err.message };
  }
}

export async function sendWhatsAppText(phone, text) {
  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_ID) return { ok: false, skipped: true };
  const body = {
    messaging_product: 'whatsapp',
    to: phone,
    type: 'text',
    text: { preview_url: true, body: text },
  };
  try {
    const res = await fetch(`${API}/${process.env.WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[whatsapp-meta] text send failed', res.status, JSON.stringify(json));
      return { ok: false, error: json };
    }
    return { ok: true, id: json.messages?.[0]?.id || null };
  } catch (err) {
    console.error('[whatsapp-meta] request error:', err.message);
    return { ok: false, error: err.message };
  }
}