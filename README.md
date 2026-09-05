# EFK Battles - eFootball Kenya Battles

> Official Youth Esports Partner - Blaze by Safaricom
> 100 KES. 32 Warriors. 1 Champion.
> M-Pesa powered by Lipana

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## What Is This?

A fully anonymous, remote eFootball Mobile tournament platform for Kenya:

- **32 players** register, pay **KES 100** via M-Pesa
- **Auto-bracket** generated when all 32 pay
- Players play on their **phones** (eFootball Mobile)
- Upload result **screenshots** for verification
- Auto-score matching + no-show detection
- **WhatsApp** auto-notifications (fixtures, wins, losses)
- Admin panel for disputes

Your PC is just the dev server. Everything runs remotely.

---

## Sponsor Branding

This platform is officially sponsored by **Blaze by Safaricom**.

### Logo Assets

Place your official brand assets in `public/sponsors/`:

```
public/sponsors/
  efk-logo.png      # Your "eFootball Battles KE" logo
  blaze-logo.png    # Blaze by Safaricom official logo
  mpesa-logo.png    # M-Pesa official logo
  lipana-logo.png   # Lipana SDK logo (optional)
```

**Important:** Use ONLY the logos from the official Brand Kit provided by Safaricom. Do not download logos from Google.

The design follows the Blaze brand guidelines:
- Primary green: exact value from your Brand Kit (default `#9CCC65`)
- Black background: `#0A0A0A`
- Footer: "Official Youth Esports Partner - Blaze by Safaricom"

---

## Sponsor Logo Layout

### Top Banner (Green)
- Left: Your "eFootball Battles KE" logo
- Right: "In Partnership with Blaze by Safaricom"

### Footer
- All three logos (EFK, Blaze, M-Pesa)
- Copyright: "2026 eFootball Battles KE. Official Youth Esports Partner - Blaze by Safaricom"
- "M-Pesa Payments Secured by Lipana"

---

## Architecture

```
app/
  page.js                    # Landing page
  register/page.js           # Registration + M-Pesa payment
  live/page.js               # Live bracket view
  upload/[matchId]/page.js   # Screenshot upload + result
  admin/page.js              # Admin panel (password protected)
  api/
    register/route.js        # POST: create player
    pay/route.js             # POST: initiate STK push
    status/[txId]/route.js   # GET: poll payment status
    webhook/route.js         # POST: Lipana webhook
    tournament/current/      # GET: live bracket data
    matches/[id]/            # GET: match detail
    matches/[id]/upload/     # POST: upload result
    admin/action/            # GET/POST: admin operations
    cron/route.js            # GET: no-show resolution cron
  components/
    Bracket.jsx              # Shared bracket component

lib/
  config.js                  # Env + Supabase client
  phone.js                   # Phone normalization (07X -> 254X)
  lipana.js                  # Lipana SDK wrapper
  whatsapp.js                # WhatsApp Cloud API messaging
  time.js                    # EAT timezone helpers
  bracket.js                 # Tournament + bracket generation
  resolve.js                 # Score matching + no-shows
  notify.js                  # WhatsApp message templates

public/sponsors/             # Place your official sponsor logos here
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

| Variable | Where to get |
|---|---|
| `LIPANA_SECRET_KEY` | [lipana.dev](https://lipana.dev) dashboard |
| `LIPANA_WEBHOOK_SECRET` | Lipana dashboard > Settings > Webhooks |
| `SUPABASE_URL` | [supabase.com](https://supabase.com) > Project Settings > API |
| `SUPABASE_ANON_KEY` | Same as above |
| `WHATSAPP_TOKEN` | [developers.facebook.com](https://developers.facebook.com) > WhatsApp > Getting Started |
| `WHATSAPP_PHONE_ID` | Facebook Developer Dashboard > WhatsApp > Phone Numbers |
| `ADMIN_PASSWORD` | Any password you choose |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel domain (e.g. `https://efk.vercel.app`) |
| `BASE_URL` | Same as above |

### WhatsApp Templates

Create these templates in Meta Business Platform:

1. `payment_confirmed_fixture` - 4 params: opponent, room, time, upload_url
2. `match_won` - 4 params: next_opponent, room, time, upload_url
3. `match_lost` - 1 param: winner_tag
4. `match_dispute` - 1 param: opponent_tag

---

## Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Paste the contents of `supabase.sql` and run it
4. Copy the Project URL and Anon Key to `.env`

---

## M-Pesa (Lipana)

1. Create account at [lipana.dev](https://lipana.dev)
2. Get your API Secret Key
3. Set up webhook URL: `https://your-domain.vercel.app/api/webhook`
4. For local testing: `ngrok http 3000` then set webhook to `https://your-ngrok-url.app/api/webhook`

---

## WhatsApp Cloud API

1. Create app at [developers.facebook.com](https://developers.facebook.com)
2. Enable WhatsApp product
3. Get permanent access token
4. Create message templates (see above)
5. Submit templates for review (takes 24-48 hours)

---

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel login
vercel
```

Set environment variables in Vercel dashboard.

### Local with Express (Optional)

```bash
npm run server  # runs on port 3001
```

---

## Testing

### Local Webhook with ngrok

```bash
ngrok http 3000
```

Copy the `https://xxxx.ngrok.io` URL and set it as your Lipana webhook URL.

### Admin Panel

Open `/admin` and enter your `ADMIN_PASSWORD`.

---

## Tournament Flow

1. **Register**: Players fill form, pay KES 100 via M-Pesa STK push
2. **Bracket**: Auto-generates at 32 paid players
3. **Round 1**: WhatsApp sends fixtures (opponent, room code, time)
4. **Play**: Players play on eFootball Mobile
5. **Upload**: Each player uploads result screenshot
6. **Verify**: Auto-matching confirms score; disputes go to admin
7. **Advance**: Winner gets next opponent via WhatsApp
8. **Final**: Champion crowned, KES 1,600 via M-Pesa

---

## Payout Structure

| Place | Amount | % of Pot |
|---|---|---|
| 1st | KES 1,600 | 50% |
| 2nd | KES 640 | 20% |
| Platform | KES 960 | 30% |

---

## License

Private - eFootball Battles KE