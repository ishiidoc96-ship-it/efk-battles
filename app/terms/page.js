export const metadata = {
  title: 'Terms & Conditions — eFootball Battles KE',
};

export default function TermsPage() {
  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '64px', maxWidth: '700px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Terms &amp; Conditions</h1>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>Last updated: September 2026</p>

      <div style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>1. Acceptance of Terms</h2>
        <p style={{ marginBottom: '16px' }}>By registering for or participating in any eFootball Battles KE tournament, you agree to be bound by these Terms and Conditions. If you do not agree, do not register or participate.</p>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>2. Eligibility</h2>
        <p style={{ marginBottom: '16px' }}>Open to all residents of Kenya aged 13 and above. Players under 18 must have parental or guardian consent. Each player may hold one account and one registration per tournament. Players must have a Safaricom SIM card, M-Pesa payments only work on Safaricom.</p>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>3. Entry Fee &amp; Payments</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '4px' }}>Entry fee is KES 100 per player per tournament, payable via M-Pesa STK push (Lipa Na M-Pesa or Daraja API).</li>
          <li style={{ marginBottom: '4px' }}>Players must use a Safaricom phone number. Airtel, Telkom, and other network numbers are not accepted.</li>
          <li style={{ marginBottom: '4px' }}>The same Safaricom phone number is used for both M-Pesa payment and WhatsApp notifications.</li>
          <li style={{ marginBottom: '4px' }}>Payment must be completed before registration is confirmed.</li>
          <li style={{ marginBottom: '4px' }}>All payments are final and non-refundable except where stated in the Refund section below.</li>
        </ul>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>4. Tournament Format</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '4px' }}>Single-elimination bracket. 32 players per tournament.</li>
          <li style={{ marginBottom: '4px' }}>Three tournaments per week (Monday, Wednesday, Friday).</li>
          <li style={{ marginBottom: '4px' }}>Match time is 4 minutes per half. Extra time: 3 minutes.</li>
          <li style={{ marginBottom: '4px' }}>Each match is assigned a unique 4-digit room code, shared 15 minutes before kick-off.</li>
          <li style={{ marginBottom: '4px' }}>Results are submitted by both players; mismatches go to admin resolution.</li>
        </ul>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>5. Prizes</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '4px' }}>Winner: 50% of total pot (KES 1,600 when full).</li>
          <li style={{ marginBottom: '4px' }}>Runner-up: 20% of total pot (KES 640 when full).</li>
          <li style={{ marginBottom: '4px' }}>Platform fee: 30% of total pot (KES 960 when full).</li>
          <li style={{ marginBottom: '4px' }}>Prizes are paid via M-Pesa within 24 hours of the tournament final.</li>
        </ul>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>6. No-Show Policy</h2>
        <p style={{ marginBottom: '16px' }}>A player is considered a no-show if they are not online at least 10 minutes after the scheduled kick-off time. No-shows result in a walkover (0-3) for the opponent. Repeat no-shows may result in account suspension.</p>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>7. Fair Play &amp; Cheating</h2>
        <p style={{ marginBottom: '16px' }}>Any form of cheating, hacking, match-fixing, or collusion is strictly prohibited. Violations result in immediate disqualification, forfeiture of entry fee, and potential permanent ban. Admin decisions on fair play matters are final.</p>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>8. Refund Policy</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '4px' }}>Full refund if the tournament is cancelled by the organizer.</li>
          <li style={{ marginBottom: '4px' }}>Full refund if a player is eliminated before their first match due to a technical issue on the platform.</li>
          <li style={{ marginBottom: '4px' }}>No refund once the player has played their first match.</li>
          <li style={{ marginBottom: '4px' }}>No refund for no-shows or voluntary withdrawal.</li>
        </ul>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>9. Limitation of Liability</h2>
        <p style={{ marginBottom: '16px' }}>eFootball Battles KE and its partners (including Blaze by Safaricom) are not responsible for: internet connectivity issues, device malfunctions, lost entries due to network failure, or any damages arising from participation in the tournament.</p>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>10. Amendments</h2>
        <p style={{ marginBottom: '16px' }}>We reserve the right to modify these Terms at any time. Changes take effect upon posting. Continued participation after changes constitutes acceptance of the new Terms.</p>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>11. Contact</h2>
        <p style={{ marginBottom: '16px' }}>For questions about these Terms, contact us via WhatsApp at +254 700 000 000 or email admin@efkbattles.co.ke.</p>
      </div>
    </div>
  );
}