export const metadata = {
  title: 'FAQ — eFootball Battles KE',
};

export default function FAQPage() {
  const sections = [
    {
      title: 'Getting started',
      faqs: [
        { q: 'What is eFootball Battles KE?', a: 'An online eFootball Mobile tournament platform for Kenyan players. You register, pay KES 100 via M-Pesa, and compete in single-elimination brackets to win real money. All matches are played on your phone, no PC needed.' },
        { q: 'Do I need to be a pro player?', a: 'No. Anyone can join. The tournament is open to all skill levels. You just need eFootball Mobile installed on your phone and a Safaricom M-Pesa account.' },
        { q: 'What do I need to join?', a: 'Three things: (1) eFootball Mobile on your phone (free on Play Store / App Store), (2) an active WhatsApp number for receiving fixtures and results, (3) a Safaricom M-Pesa account with KES 100 for the entry fee.' },
        { q: 'Why must I use Safaricom?', a: 'M-Pesa is a Safaricom service, it only works on Safaricom SIM cards. Airtel, Telkom, and other networks cannot use M-Pesa. Your phone number must be Safaricom (070X, 071X, 072X, 074X, 075X, 076X, 078X, 079X).' },
        { q: 'Is this affiliated with Konami?', a: 'No. eFootball Battles KE is an independent community tournament platform. eFootball is a trademark of Konami Digital Entertainment.' },
        { q: 'Who runs this?', a: 'eFootball Battles KE is operated in partnership with Blaze by Safaricom as an official youth esports initiative.' },
      ],
    },
    {
      title: 'Registration & payment',
      faqs: [
        { q: 'How do I register?', a: 'Click "Join for KES 100" on the home page. Fill in your gamer tag, eFootball ID, and Safaricom phone number. Click pay and enter your M-Pesa PIN on the STK push. That\'s it, you\'re registered once payment is confirmed.' },
        { q: 'What is a gamer tag?', a: 'Your display name in the tournament. Other players will see this. Pick something recognizable, e.g. "Rongai Sniper" or your usual gaming name.' },
        { q: 'What is my eFootball ID?', a: 'Your profile ID in eFootball Mobile. You can find it in the game under your profile screen. This helps us verify it\'s really you playing.' },
        { q: 'What is the entry fee?', a: 'KES 100 per player per tournament. The total pot is KES 3,200 (32 players x KES 100).' },
        { q: 'Can I use an Airtel or Telkom number?', a: 'No. M-Pesa only works on Safaricom. Your number must be Safaricom (070X, 071X, 072X, 074X, 075X, 076X, 078X, 079X). The same number is used for both M-Pesa payment and WhatsApp notifications.' },
        { q: 'How does M-Pesa payment work?', a: 'After you click pay, Safaricom sends an STK push to your phone, the same prompt you get when paying any Lipa Na M-Pesa. Enter your PIN and the payment is processed automatically. The site detects it within a few seconds.' },
        { q: 'Can I register with two accounts?', a: 'No. One account per person per tournament. Duplicate registrations will be rejected.' },
        { q: 'What if the bracket is full?', a: 'Spots are first come, first serve. You can still register and pay, you\'ll be added to the waitlist. If a spot opens up, you\'re moved in automatically.' },
      ],
    },
    {
      title: 'Playing your match',
      faqs: [
        { q: 'When are the tournaments?', a: 'Three tournaments per week, Monday, Wednesday, and Friday at 8 PM EAT. Registration opens 48 hours before each tournament.' },
        { q: 'How do I know who my opponent is?', a: 'When the bracket generates (after 32 players pay), you receive a WhatsApp message on your Safaricom number with your opponent\'s gamer tag, a 4-digit room code, and the kick-off time.' },
        { q: 'How do I play the match?', a: 'Open eFootball Mobile, go to Friend Match, and enter the 4-digit room code from your WhatsApp message. Play the match as normal, 2 x 4-minute halves.' },
        { q: 'What if the match is a draw?', a: '3 minutes of extra time. If still a draw, it goes to penalties. There must be a winner.' },
        { q: 'What happens if my opponent doesn\'t show up?', a: 'A player is marked as a no-show if they\'re not online 10 minutes after kick-off. The opponent receives a walkover (3-0 win).' },
        { q: 'What if I can\'t make it?', a: 'Let us know before kick-off. If you no-show repeatedly, you may be banned from future tournaments.' },
      ],
    },
    {
      title: 'Results & disputes',
      faqs: [
        { q: 'How do I submit my result?', a: 'After the match, screenshot the final score screen. Click the upload link from your WhatsApp message. Enter your gamer tag, your goals, your opponent\'s goals, and upload the screenshot. Click submit.' },
        { q: 'What if we submit different scores?', a: 'The match goes to admin review. Both screenshots are checked. The admin\'s decision is final. For semi-finals and the final, a screen recording link is required.' },
        { q: 'How do I advance to the next round?', a: 'If your result is approved (scores match or admin confirms), you advance automatically. You\'ll get a WhatsApp message with your next opponent and room code.' },
        { q: 'What if I have a problem during the match?', a: 'Contact the admin via WhatsApp. We can help with connectivity issues, room code problems, or other technical difficulties.' },
      ],
    },
    {
      title: 'Prizes & payouts',
      faqs: [
        { q: 'How are prizes distributed?', a: 'Winner receives 50% of the pot (KES 1,600), runner-up receives 20% (KES 640), and the platform retains 30% (KES 960) for operations. Prizes are paid via M-Pesa to your Safaricom number within 24 hours of the final.' },
        { q: 'Can I get a refund?', a: 'Full refund if the tournament is cancelled. No refund once you\'ve played your first match. No refund for no-shows or voluntary withdrawal.' },
        { q: 'How is my data protected?', a: 'All data is stored securely in Supabase with row-level security. Payment processing uses Safaricom\'s PCI-compliant M-Pesa APIs. We never store your M-Pesa PIN.' },
      ],
    },
  ];

  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '64px', maxWidth: '700px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Frequently Asked Questions</h1>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Everything new players need to know. Also see the <a href="/how-to-play" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>step-by-step guide</a>.
      </p>

      {sections.map((section, si) => (
        <div key={si} style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--green)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{section.title}</h2>
          <div style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            {section.faqs.map((faq, fi) => (
              <div key={fi} style={{ borderBottom: '1px solid var(--border)', padding: '14px 0' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: 'var(--text)' }}>{faq.q}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ marginTop: '32px', textAlign: 'center', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Ready to play?</p>
        <a href="/register" className="form-btn" style={{ display: 'inline-block', width: 'auto', padding: '12px 32px', textDecoration: 'none' }}>Register for KES 100</a>
      </div>
    </div>
  );
}