export const metadata = {
  title: 'Privacy Policy — eFootball Battles KE',
};

export default function PrivacyPage() {
  return (
    <div className="container" style={{ paddingTop: '40px', paddingBottom: '64px', maxWidth: '700px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>Privacy Policy</h1>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>Last updated: September 2026</p>

      <div style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>1. Information We Collect</h2>
        <p style={{ marginBottom: '8px' }}>When you register for eFootball Battles KE, we collect:</p>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '4px' }}>Safaricom phone number (used for both M-Pesa payment and WhatsApp notifications)</li>
          <li style={{ marginBottom: '4px' }}>Gamer tag / username (display name in tournaments)</li>
          <li style={{ marginBottom: '4px' }}>Game ID (your eFootball mobile identifier)</li>
          <li style={{ marginBottom: '4px' }}>M-Pesa transaction IDs (for payment verification)</li>
          <li style={{ marginBottom: '4px' }}>Match results and tournament history</li>
        </ul>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>2. How We Use Your Information</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '4px' }}>To process your M-Pesa payments and verify transactions</li>
          <li style={{ marginBottom: '4px' }}>To send match fixtures, results, and tournament updates via WhatsApp</li>
          <li style={{ marginBottom: '4px' }}>To display your gamer tag in brackets and leaderboards</li>
          <li style={{ marginBottom: '4px' }}>To distribute prize money to winners</li>
          <li style={{ marginBottom: '4px' }}>To resolve disputes and enforce fair play</li>
        </ul>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>3. Data Storage &amp; Security</h2>
        <p style={{ marginBottom: '16px' }}>All data is stored in Supabase (PostgreSQL) with row-level security. Payment processing is handled through Safaricom M-Pesa APIs (Lipana SDK / Daraja API), which are PCI-compliant. We do not store M-Pesa PINs or full card details on our servers.</p>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>4. Data Sharing</h2>
        <p style={{ marginBottom: '8px' }}>We do not sell or share your personal data with third parties except:</p>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '4px' }}>Safaricom (M-Pesa), for payment processing only</li>
          <li style={{ marginBottom: '4px' }}>Meta (WhatsApp Business API), for sending notifications (if Meta API is used)</li>
          <li style={{ marginBottom: '4px' }}>When required by law or to resolve payment disputes</li>
        </ul>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>5. WhatsApp Communications</h2>
        <p style={{ marginBottom: '16px' }}>By providing your phone number, you consent to receive tournament-related messages via WhatsApp. These include match fixtures, room codes, results, and prize notifications. You may opt out by messaging "STOP" to our WhatsApp number, but this may affect your ability to participate.</p>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>6. Data Retention</h2>
        <p style={{ marginBottom: '16px' }}>We retain your data for as long as your account is active or as needed to provide services. Tournament records (results, payments) are retained for 12 months for audit purposes. You may request deletion of your data by contacting us.</p>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>7. Your Rights</h2>
        <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
          <li style={{ marginBottom: '4px' }}>Access: Request a copy of the data we hold about you</li>
          <li style={{ marginBottom: '4px' }}>Correction: Request correction of inaccurate data</li>
          <li style={{ marginBottom: '4px' }}>Deletion: Request deletion of your data (subject to legal retention requirements)</li>
          <li style={{ marginBottom: '4px' }}>Portability: Request your data in a machine-readable format</li>
        </ul>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>8. Cookies &amp; Tracking</h2>
        <p style={{ marginBottom: '16px' }}>Our website uses essential session cookies for authentication and bracket display. We do not use third-party analytics or advertising trackers.</p>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>9. Children's Privacy</h2>
        <p style={{ marginBottom: '16px' }}>Players under 18 must have parental consent to use the platform. We do not knowingly collect additional data from minors beyond what is required for tournament participation.</p>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>10. Changes to This Policy</h2>
        <p style={{ marginBottom: '16px' }}>We may update this Privacy Policy at any time. Changes will be posted on this page with an updated date. Continued use of the platform constitutes acceptance of the revised policy.</p>

        <h2 style={{ fontSize: '16px', fontWeight: 600, marginTop: '24px', marginBottom: '8px' }}>11. Contact</h2>
        <p>For privacy-related inquiries, contact us via WhatsApp at +254 700 000 000 or email admin@efkbattles.co.ke.</p>
      </div>
    </div>
  );
}