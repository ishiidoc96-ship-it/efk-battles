# Brand Guidelines v1.0

> Last updated: September 2026
> Status: Approved
> Brand: EFK Battles (eFootball Battles KE) in partnership with Blaze by Safaricom

## Quick Reference

| Element | Value |
|---------|-------|
| Primary Color | #9CCC65 |
| Secondary Color | #689F38 |
| Accent Color | #F43F5E |
| Primary Font | Russo One (display) / DM Sans (body) |
| Voice | Bold, competitive, clear, youth-first |

---

## 1. Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Blaze Green | #9CCC65 | rgb(156,204,101) | CTAs, primary buttons, accents, sponsor bar |
| Green Dark | #558B2F | rgb(85,139,47) | Hover borders, focus accents |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Green Muted | #689F38 | rgb(104,159,56) | Badges, secondary highlights |
| Accent Rose | #F43F5E | rgb(244,63,94) | Promotional / React CTA accents (use sparingly) |

### Neutral Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Background | #0A0A0A | rgb(10,10,10) | Page background (Blaze black) |
| Surface | #141412 | rgb(20,20,18) | Cards, sections, forms |
| Surface Alt | #1C1C19 | rgb(28,28,25) | Raised surfaces, callouts |
| Text Primary | #F4F4F0 | rgb(244,244,240) | Headings, body text |
| Text Secondary | #C6C6BF | rgb(198,198,191) | Subheadings, captions |
| Text Muted | #8E8E88 | rgb(142,142,136) | Helper text, timestamps |
| Border | #2A2A27 | rgb(42,42,39) | Dividers, borders |

### Semantic Colors

| State | Hex | Usage |
|-------|-----|-------|
| Success | #9CCC65 | Confirmations, approved states, live badge |
| Warning | #FFD54F | Pending, "looking now" counters, cautions |
| Error | #FF8A65 | Errors, urgent/scarcity messaging |
| Info | #64B5F6 | Informational messages |

### Dark-Mode Contrast

- Text Primary (#F4F4F0) on Background (#0A0A0A): 16.1:1 (AAA)
- Text Secondary (#C6C6BF) on Background: 10.0:1 (AAA)
- Text Muted (#8E8E88) on Background: 4.8:1 (AA)
- Blaze Green (#9CCC65) buttons use `#0A0A0A` text (Blaze brand pattern), not white
- All interactive elements meet WCAG 2.1 AA standards

---

## 2. Typography

### Font Stack

```css
--font-display: 'Russo One', 'DM Sans', sans-serif;
--font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
--font-gaming: 'Chakra Petch', 'DM Sans', sans-serif;
```

### Type Scale

| Element | Size (Desktop) | Size (Mobile) | Weight | Line Height |
|---------|----------------|---------------|--------|-------------|
| H1 | 54px | 34px | 700 | 1.05 |
| H2 | 28px | 20px | 700 | 1.2 |
| H3 | 16px | 14px | 600 | 1.3 |
| Body | 17px | 15px | 400 | 1.6 |
| Small | 14px | 14px | 400 | 1.5 |
| Caption | 12px | 12px | 400 | 1.5 |
| Timer/Stats | 28px | 22px | 700 | 1.2 |

Russo One is reserved for display/headlines and countdown numbers. Body text is always DM Sans. Numbers in timers, prices, and standings use `font-variant-numeric: tabular-nums`.

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Russo+One&family=Chakra+Petch:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## 3. Logo Usage

### Variants

| Variant | File | Use Case |
|---------|------|----------|
| EFK Wordmark Logo | public/sponsors/efk-logo.png | Headers, banners, footer |
| Blaze by Safaricom | public/sponsors/blaze-logo.png | Sponsor bar, trust bar, footer |
| M-Pesa | public/sponsors/mpesa-logo.png | Payment trust marks |
| M-Pesa Foundation | public/sponsors/mpesa-foundation.png | Community / foundation contexts |

### Rules

- Use ONLY official brand assets supplied by Safaricom / Blaze. Never download logos from Google images.
- Keep the sponsor bar top strip green (#9CCC65) with dark text, per Blaze's youth-esports kit.
- Footer must always read: "2026 eFootball Battles KE. Official Youth Esports Partner, Blaze by Safaricom" and "M-Pesa Payments Secured by Lipana."

### Don'ts

- Don't recolor or invert the Blaze or M-Pesa logos
- Don't crop, rotate, or add shadows/effects to official logos
- Don't place logos on low-contrast backgrounds
- Don't claim full Safaricom ownership — we are an "Official Youth Esports Partner"

---

## 4. Voice & Tone

### Brand Personality

| Trait | Description |
|-------|-------------|
| **Bold** | Confident, competitive energy |
| **Clear** | Direct, jargon-free, plain Swahili-friendly English |
| **Youth-first** | Speaks to Kenyan mobile gamers (18-25) |
| **Honest** | No fake testimonials, no inflated claims |

### Voice Chart

| Trait | We Are | We Are Not |
|-------|--------|------------|
| Bold | "Lock your spot. Only 32 in." | Corporate, formal |
| Clear | "Pay KES 100 with M-Pesa. Win KES 1,600." | Vague, aspirational |
| Youth-first | "Play on your phone, no PC needed." | Techy, intimidating |
| Honest | "First come, first served." | Overpromising |

### Tone by Context

| Context | Tone | Example |
|---------|------|---------|
| Marketing | Bold, urgent | "Only 32 spots. First come, first served." |
| How-to / Docs | Clear, instructional | "Enter your M-Pesa PIN on the STK push." |
| Errors | Calm, solution-focused | "Use a Safaricom number — M-Pesa only works on Safaricom." |
| Success | Brief, celebratory | "You're locked in!" |

### Prohibited Terms

| Avoid | Reason |
|-------|--------|
| Revolutionary | Overused |
| Best-in-class | Vague claim |
| Officially sponsored by Safaricom | Overstates relationship (partnership only) |
| "Guaranteed win" | False/unmarketed lure |
| Esports stars | Misleading for amateurs |

---

## 5. Imagery Guidelines

### Visual Style

- Dark, high-contrast esports aesthetic on Blaze black (#0A0A0A)
- Green neon-esque accents (#9CCC65) for glow, focus, and CTAs
- Fast, angular, competition-focused energy
- Real phone screenshots of eFootball gameplay as proof (not stock "gamer" photos)

### Icons

- Style: Outlined, 24px base grid
- Stroke: 2px consistent
- SVG only — never emojis as structural icons
- Palette: currentColor (inherit text color)

---

## 6. Design Components

### Buttons

| Type | Background | Text | Border Radius |
|------|------------|------|---------------|
| Primary | #9CCC65 | #0A0A0A | 10px |
| Secondary | Transparent | #C6C6BF | 10px |
| Danger | #2A1410 tint | #FF8A65 | 10px |
| WhatsApp | #25D366 | #0A0A0A | 10px |

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Compact elements |
| md | 16px | Standard spacing |
| lg | 24px | Section spacing |
| xl | 32px | Large gaps |
| 2xl | 48px | Section dividers |

### Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 10px |
| Cards | 12px |
| Inputs | 10px |
| Modals | 16px |
| Pills/Tags | 9999px |

---

## 7. Offer & Pricing Voice

### The Core Offer

- Entry: KES 100
- Field: 32 players, single-elimination
- 1st place: 50% of pot (KES 1,600)
- 2nd place: 20% of pot (KES 640)
- Platform: 30% (KES 960)

### Safety Rules (Legal)

- Must include Safaricom disclaimer page and CAK complaint link
- Must state "independent community tournament platform" (not a Konami/Safaricom product)
- Prize paid within 24 hours of the final
- Refunds only if the tournament is cancelled

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | September 2026 | Initial guidelines (dark Blaze esports theme) |