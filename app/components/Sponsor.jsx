export function SponsorBanner() {
  return (
    <div className="sponsor-bar">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
          <img src="/sponsors/efk-logo.png" alt="eFootball Battles KE" style={{ height: '18px', width: 'auto', objectFit: 'contain' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>EFK Battles</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#1A1A1A', flexShrink: 0 }}>
          <img src="/sponsors/blaze-logo.png" alt="Blaze by Safaricom" style={{ height: '18px', width: 'auto', objectFit: 'contain' }} />
          <span style={{ whiteSpace: 'nowrap' }}>Blaze by Safaricom</span>
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
          <img src="/sponsors/efk-logo.png" alt="EFK" style={{ height: '28px', width: 'auto', opacity: 0.8, objectFit: 'contain' }} />
          <img src="/sponsors/blaze-logo.png" alt="Blaze" style={{ height: '24px', width: 'auto', opacity: 0.8, objectFit: 'contain' }} />
          <img src="/sponsors/mpesa-logo.png" alt="M-Pesa" style={{ height: '24px', width: 'auto', opacity: 0.8, objectFit: 'contain' }} />
        </div>
        <p className="footer-text">
          2026 eFootball Battles KE. Official Youth Esports Partner, Blaze by Safaricom
        </p>
        <p className="footer-text" style={{ marginTop: '4px' }}>
          M-Pesa Payments Secured by Lipana. Safaricom M-Pesa Terms Apply.
        </p>
        <div className="footer-links">
          <a href="/how-to-play">How to Play</a>
          <a href="/faq">FAQ</a>
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/safaricom-disclaimer">Safaricom Disclaimer</a>
        </div>
        <div style={{ marginTop: '12px', fontSize: '10px', color: 'var(--text-muted)', lineHeight: '1.5', maxWidth: '480px', margin: '12px auto 0', wordWrap: 'break-word' }}>
          <p>eFootball Battles KE is an independent community tournament platform. M-Pesa is a service of Safaricom PLC. eFootball is a trademark of Konami Digital Entertainment.</p>
        </div>
        <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
          <p>Consumer complaints: <a href="https://cak.go.ke" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>Competition Authority of Kenya (CAK)</a></p>
        </div>
      </div>
    </footer>
  );
}