export const metadata = {
  title: 'How to Play — eFootball Battles KE',
};

export default function HowToPlayPage() {
  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '64px', maxWidth: '700px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>How to Play</h1>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '40px' }}>
        Everything you need to know to register, play, and win in your first EFK Battles tournament.
      </p>

      {/* Section: Before you start */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--green)' }}>Before you start</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          You need three things:
        </p>
        <ul style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '20px', listStyle: 'disc' }}>
          <li><strong>eFootball Mobile</strong>, free on Play Store / App Store. Make sure you can play online friendly matches.</li>
          <li><strong>WhatsApp</strong>, we send your fixtures, room codes, and results here. Must be active on the number you register.</li>
          <li><strong>Safaricom M-Pesa</strong>, for the KES 100 entry fee and for receiving prize money if you win. <strong>Must be a Safaricom SIM card</strong>, M-Pesa only works on Safaricom.</li>
        </ul>
        <div style={{ marginTop: '12px', padding: '12px 16px', background: '#FFF8E1', border: '1px solid #FFE082', borderRadius: '8px', fontSize: '13px', color: '#5D4037' }}>
          <strong>Important:</strong> Your phone number must be Safaricom (070X, 071X, 072X, 074X, 075X, 076X, 078X, 079X). Airtel, Telkom, and other networks cannot be used for M-Pesa payments.
        </div>
      </div>

      {/* Section: Step 1 - Register */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--green)' }}>Step 1: Register</h2>
        <ol style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '20px', listStyle: 'decimal' }}>
          <li>Click <strong>Join for KES 100</strong> on the home page.</li>
          <li>Enter your <strong>gamer tag</strong>, this is your display name in the tournament (e.g. &ldquo;Rongai Sniper&rdquo;). Other players will see this.</li>
          <li>Enter your <strong>eFootball in-game ID</strong>, your profile ID from eFootball Mobile. Found in your game profile screen.</li>
          <li>Enter your <strong>Safaricom phone number</strong>, the same number is used for both M-Pesa payment and WhatsApp notifications. Must be a Safaricom number (070X, 071X, 072X, 074X, 075X, 076X, 078X, 079X).</li>
          <li>Click <strong>Pay KES 100 with M-Pesa</strong>.</li>
        </ol>
      </div>

      {/* Section: Step 2 - Pay */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--green)' }}>Step 2: Pay</h2>
        <ol style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '20px', listStyle: 'decimal' }}>
          <li>An <strong>STK push</strong> will appear on your phone (a Safaricom prompt asking for your M-Pesa PIN).</li>
          <li>Enter your <strong>M-Pesa PIN</strong> and confirm.</li>
          <li>Wait a few seconds, the site will automatically detect the payment and confirm your spot.</li>
          <li>If it fails, go back to the register page and try again. You won&apos;t be charged twice for the same attempt.</li>
        </ol>
      </div>

      {/* Section: Step 3 - Get matched */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--green)' }}>Step 3: Get matched</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Once 32 players have paid, the bracket is generated automatically. You&apos;ll receive a <strong>WhatsApp message</strong> on your Safaricom number with:
        </p>
        <ul style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '20px', listStyle: 'disc' }}>
          <li>Your <strong>opponent&apos;s gamer tag</strong></li>
          <li>A <strong>4-digit room code</strong> (used to join the match in eFootball)</li>
          <li>The <strong>kick-off time</strong> (usually same evening at 8 PM EAT)</li>
          <li>A <strong>link to upload your result</strong></li>
        </ul>
      </div>

      {/* Section: Step 4 - Play */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--green)' }}>Step 4: Play your match</h2>
        <ol style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '20px', listStyle: 'decimal' }}>
          <li>Open <strong>eFootball Mobile</strong> on your phone.</li>
          <li>Go to <strong>Friend Match</strong> &rarr; <strong>Create Match</strong> or <strong>Join Match</strong>.</li>
          <li>Enter the <strong>4-digit room code</strong> from your WhatsApp message.</li>
          <li>Play the match. Standard rules: 2 x 4-minute halves. If it&apos;s a draw after full time, 3 minutes extra time. If still a draw, it goes to penalties.</li>
          <li><strong>Be there on time.</strong> If you&apos;re not online within 10 minutes of kick-off, your opponent gets a walkover (3-0 win).</li>
        </ol>
      </div>

      {/* Section: Step 5 - Upload result */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--green)' }}>Step 5: Upload the result</h2>
        <ol style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '20px', listStyle: 'decimal' }}>
          <li>After the match, <strong>screenshot the final score screen</strong>.</li>
          <li>Click the upload link from your WhatsApp message (or go to the site and enter your match ID).</li>
          <li>Enter your <strong>gamer tag</strong>, your <strong>goals</strong>, and your <strong>opponent&apos;s goals</strong>.</li>
          <li>Upload the <strong>screenshot</strong> (max 5MB, image only).</li>
          <li>Click <strong>Submit result</strong>.</li>
        </ol>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '12px' }}>
          Both players upload. If your scores match, the result is confirmed automatically and the
          next round updates. If they don&apos;t match, an admin reviews both screenshots.
        </p>
      </div>

      {/* Section: Advancing */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--green)' }}>If you win</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          If your result is approved, you advance to the next round. You&apos;ll get another WhatsApp message
          on your Safaricom number with your next opponent and room code. This continues until the final. The winner of the final
          gets KES 1,600 (50% of the pot) paid via M-Pesa within 24 hours. Runner-up gets KES 640.
        </p>
      </div>

      {/* Section: Disputes */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--green)' }}>What if there&apos;s a dispute?</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          If both players submit different scores, the match goes to admin review. Both screenshots are
          checked. The admin&apos;s decision is final. For semi-finals and the final, a screen recording link
          is required as additional proof.
        </p>
      </div>

      {/* Section: No-shows */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', color: 'var(--green)' }}>No-shows</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          If your opponent doesn&apos;t show up within 10 minutes of kick-off, you get a walkover win (3-0).
          If neither player shows up, both are eliminated. If you repeatedly no-show, you may be banned
          from future tournaments.
        </p>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
        <a href="/register" className="form-btn" style={{ display: 'inline-block', width: 'auto', padding: '14px 36px', textDecoration: 'none', fontSize: '15px' }}>
          Register for KES 100
        </a>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '12px' }}>
          Questions? Check the <a href="/faq" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>FAQ</a> or <a href="/terms" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>Terms &amp; Conditions</a>.
        </p>
      </div>
    </div>
  );
}