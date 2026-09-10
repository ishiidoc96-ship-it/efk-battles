"""Generate downloadable EFK rules / quick-start PDFs."""
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

OUT = Path('public/downloads')
OUT.mkdir(parents=True, exist_ok=True)

GREEN = HexColor('#9CCC65')
BG = HexColor('#0A0A0A')
SURFACE = HexColor('#141412')
TEXT = HexColor('#F4F4F0')
MUTED = HexColor('#C6C6BF')
DIM = HexColor('#8E8E88')


def wrap_text(c, text, font, size, max_width):
    words = text.split()
    lines, line = [], ''
    for w in words:
        trial = f'{line} {w}'.strip()
        if c.stringWidth(trial, font, size) <= max_width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = w
    if line:
        lines.append(line)
    return lines


def draw_footer(c, w, h):
    c.setStrokeColor(HexColor('#2A2A27'))
    c.setLineWidth(0.6)
    c.line(18 * mm, 16 * mm, w - 18 * mm, 16 * mm)
    c.setFont('Helvetica', 8)
    c.setFillColor(DIM)
    c.drawString(18 * mm, 10 * mm, 'eFootball Battles KE · Official Youth Esports Partner - Blaze by Safaricom')
    c.drawRightString(w - 18 * mm, 10 * mm, 'efk-battles.vercel.app')


def make_rules_pdf():
    path = OUT / 'efk-battles-rules.pdf'
    w, h = A4
    c = canvas.Canvas(str(path), pagesize=A4)

    # Header band
    c.setFillColor(BG)
    c.rect(0, h - 42 * mm, w, 42 * mm, fill=1, stroke=0)
    c.setFillColor(GREEN)
    c.rect(0, h - 44 * mm, w, 2 * mm, fill=1, stroke=0)

    c.setFillColor(GREEN)
    c.setFont('Helvetica-Bold', 22)
    c.drawString(18 * mm, h - 22 * mm, 'EFK BATTLES')
    c.setFillColor(TEXT)
    c.setFont('Helvetica', 11)
    c.drawString(18 * mm, h - 30 * mm, 'Tournament rules & quick start · 100 KES · 32 warriors · 1 champion')
    c.setFillColor(DIM)
    c.setFont('Helvetica', 9)
    c.drawString(18 * mm, h - 36 * mm, 'Mon / Wed / Fri · Kick-off 20:00 EAT · M-Pesa only')

    y = h - 54 * mm
    left = 18 * mm
    right = w - 18 * mm
    maxw = right - left

    sections = [
        ('What you need', [
            'eFootball Mobile (free on Play Store / App Store) with online Friend Match working.',
            'Active WhatsApp on the same Safaricom number you register with.',
            'Safaricom M-Pesa for the KES 100 entry and prize payout.',
        ]),
        ('How a tournament runs', [
            '32 players pay KES 100. First come, first served.',
            'Bracket auto-generates when all 32 have paid.',
            'WhatsApp sends your opponent tag, 4-digit room code, kick-off time, and upload link.',
            'Play on your phone in Friend Match using the room code.',
            'Both players upload the final-score screenshot. Matching scores auto-confirm.',
            'Winner advances until the final. Champion is paid via M-Pesa within 24 hours.',
        ]),
        ('Match rules', [
            'Format: single elimination · 32 players.',
            'Time: 2 × 4-minute halves. Extra time 3 minutes. Then penalties.',
            'No-show: not online within 10 minutes of kick-off = walkover 0-3.',
            'Disputes: mismatched scores go to admin review. Admin decision is final.',
            'Cheating / match-fixing: instant ban, entry fee forfeited.',
        ]),
        ('Payouts (full 32-player pot = KES 3,200)', [
            '1st place: KES 1,600 (50%)',
            'Runner-up: KES 640 (20%)',
            'Platform: KES 960 (30%)',
        ]),
        ('Safety notes', [
            'We never ask for your M-Pesa PIN on our site — PIN entry only happens on Safaricom STK.',
            'Independent community tournament. eFootball is a trademark of Konami. Not affiliated with Konami.',
            'Blaze by Safaricom partnership branding does not imply Safaricom operates prize logistics alone.',
        ]),
    ]

    for title, bullets in sections:
        c.setFont('Helvetica-Bold', 11)
        c.setFillColor(GREEN)
        c.drawString(left, y, title.upper())
        y -= 5 * mm
        for b in bullets:
            c.setFillColor(GREEN)
            c.circle(left + 1.2 * mm, y + 1.2 * mm, 0.9 * mm, fill=1, stroke=0)
            c.setFillColor(MUTED)
            c.setFont('Helvetica', 9.5)
            lines = wrap_text(c, b, 'Helvetica', 9.5, maxw - 6 * mm)
            for i, line in enumerate(lines):
                c.drawString(left + 5 * mm, y, line)
                y -= 4.2 * mm
            y -= 1.2 * mm
        y -= 4 * mm
        if y < 30 * mm:
            draw_footer(c, w, h)
            c.showPage()
            c.setFillColor(BG)
            c.rect(0, 0, w, h, fill=1, stroke=0)
            y = h - 20 * mm

    draw_footer(c, w, h)
    c.save()
    print('wrote', path, path.stat().st_size)


def make_checklist_pdf():
    path = OUT / 'efk-battles-matchday-checklist.pdf'
    w, h = A4
    c = canvas.Canvas(str(path), pagesize=A4)

    c.setFillColor(BG)
    c.rect(0, 0, w, h, fill=1, stroke=0)
    c.setFillColor(GREEN)
    c.rect(0, h - 8 * mm, w, 8 * mm, fill=1, stroke=0)

    c.setFillColor(TEXT)
    c.setFont('Helvetica-Bold', 18)
    c.drawString(18 * mm, h - 24 * mm, 'Matchday checklist')
    c.setFillColor(DIM)
    c.setFont('Helvetica', 10)
    c.drawString(18 * mm, h - 31 * mm, 'Print this or keep it on your lock screen before kick-off.')

    items = [
        'Phone charged · mobile data or stable Wi-Fi',
        'eFootball Mobile updated · Friend Match ready',
        'WhatsApp open on your Safaricom number',
        'Room code from WhatsApp written down',
        'Know your gamer tag and eFootball ID',
        'Online 10 minutes before 20:00 EAT kick-off',
        'After full time: screenshot the final score screen',
        'Upload screenshot + enter both scores on the match page',
        'Do not share your M-Pesa PIN with anyone',
    ]

    y = h - 48 * mm
    c.setFillColor(SURFACE)
    c.roundRect(16 * mm, y - len(items) * 12 * mm - 4 * mm, w - 32 * mm, len(items) * 12 * mm + 8 * mm, 3 * mm, fill=1, stroke=0)

    for item in items:
        c.setStrokeColor(GREEN)
        c.setLineWidth(1)
        c.rect(22 * mm, y - 2 * mm, 4.5 * mm, 4.5 * mm, fill=0, stroke=1)
        c.setFillColor(TEXT)
        c.setFont('Helvetica', 10)
        c.drawString(30 * mm, y - 1.2 * mm, item)
        y -= 12 * mm

    y -= 8 * mm
    c.setFillColor(GREEN)
    c.setFont('Helvetica-Bold', 10)
    c.drawString(18 * mm, y, 'Win path: 4 wins · KES 1,600 to M-Pesa within 24 hours of the final.')
    y -= 8 * mm
    c.setFillColor(DIM)
    c.setFont('Helvetica', 9)
    c.drawString(18 * mm, y, 'eFootball Battles KE · Official Youth Esports Partner - Blaze by Safaricom')
    draw_footer(c, w, h)
    c.save()
    print('wrote', path, path.stat().st_size)


if __name__ == '__main__':
    make_rules_pdf()
    make_checklist_pdf()
