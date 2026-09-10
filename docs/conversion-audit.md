# Conversion Audit + Implemented Changes — EFK Battles

> Source: cro skill. Audit findings applied in this pass, plus the experiment backlog.

## Value Proposition
- **Before:** Home hero led with product name; conversion message buried.
- **After:** Hero leads with outcome ("Winner takes KES 1,600, paid to M-Pesa within 24h"), entry price, and scarcity ("First come, first serve. Only 32 spots") above the fold.

## Quick Wins (implemented now)
- Successful copy/CTA shift: "Join Now — Spots Running Out" when ≤10 spots
- Live spots-left counter visible on register page + sticky mobile CTA
- Countdown next-tournament timer with explicit "Next tournament: 8 PM EAT"
- Social proof block (live registrations) placed above final CTA
- Register page: zero-friction phone validation (Safaricom guard), inline per-field errors with aria, helper text on every field
- Removed weak CTAs ("Sign Up"/"Submit") in favor of "Join Now", "Lock My Spot — KES 100"
- WhatsApp referral/share box on the success screen (referral loop)
- Single primary action per screen (Join/Register); secondary actions visually subordinate

## High-Impact Changes (implemented)
- Sticky mobile bottom CTA across landing page
- "What happens next" 5-step expectations block under the register form (removes anxiety)
- Urgency ladder: 4-tier CTA + message based on remaining spots (>20, 11-20, 1-10, 0)
- Dark Blaze theme = on-brand trust (official partner credibility)

## Funnel Optimization
- Field count kept at 3 (gamer tag, eFootball ID, phone) — minimal friction
- Multi-step progress modeled by states (form → pay → poll → done), each with clear feedback + escape (back/retry)
- Payment polling screen gives exact next step ("Check your phone for the STK push… page updates automatically")
- Error recovery paths on every failure: dismiss + retry, and back-to-register

## Experiment Backlog (A/B candidates)
1. Hero CTA: "Join Now" vs "Win KES 1,600 Tonight"
2. Register button: "Pay KES 100 with M-Pesa" vs "Lock My Spot — KES 100"
3. Hero layout: stat card on right vs below on mobile (reduce above-fold clutter)
4. Social proof: rotate proof items with real recent registrations from API
5. Waitlist: "Join the Waitlist" vs "Notify me for Friday" (email/WhatsApp capture?)
6. Countdown visibility: hide days when 0 (declutter)

## Measurement Setup (recommended)
- Client events: `register_form_submitted`, `payment_poll_success`, `share_clicked`
- Server events: payment callback (authoritative "paid player" conversion)
- UTM attribution per channel (ad-playbook.md)