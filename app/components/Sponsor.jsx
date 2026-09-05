export function SponsorBanner() {
  return (
    <div className="sponsor-bar">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/sponsors/efk-logo.png" alt="eFootball Battles KE" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>eFootball Battles KE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#1A1A1A' }}>
          <span>In Partnership with</span>
          <img src="/sponsors/blaze-logo.png" alt="Blaze by Safaricom" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-logos">
          <img src="/sponsors/efk-logo.png" alt="EFK" style={{ height: '36px', width: 'auto', objectFit: 'contain', opacity: 0.8 }} />
          <img src="/sponsors/blaze-logo.png" alt="Blaze" style={{ height: '32px', width: 'auto', objectFit: 'contain', opacity: 0.8 }} />
          <img src="/sponsors/mpesa-logo.png" alt="M-Pesa" style={{ height: '32px', width: 'auto', objectFit: 'contain', opacity: 0.8 }} />
        </div>
        <p className="footer-text">
          2026 eFootball Battles KE. Official Youth Esports Partner, Blaze by Safaricom
        </p>
        <p className="footer-text" style={{ marginTop: '4px' }}>
          M-Pesa Payments Secured by Lipana. Safaricom M-Pesa Terms Apply.
        </p>
        <div style={{ marginTop: '16px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/how-to-play" style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>How to Play</a>
          <a href="/faq" style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>FAQ</a>
          <a href="/terms" style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Terms</a>
          <a href="/privacy" style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Privacy</a>
          <a href="/safaricom-disclaimer" style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Safaricom Disclaimer</a>
        </div>
        <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '500px', margin: '16px auto 0' }}>
          <p>eFootball Battles KE is an independent community tournament platform. M-Pesa is a service of Safaricom PLC. eFootball is a trademark of Konami Digital Entertainment. This platform is not affiliated with, endorsed by, or formally partnered with Safaricom PLC, Konami, or any third-party unless stated in a signed agreement.</p>
        </div>
        <div style={{ marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
          <p>Consumer complaints: <a href="https://cak.go.ke" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>Competition Authority of Kenya (CAK)</a></p>
        </div>
      </div>
    </footer>
  );
}