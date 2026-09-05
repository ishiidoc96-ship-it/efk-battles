'use client';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <a href="/" className="logo">
          <img src="/sponsors/efk-logo.png" alt="EFK" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
          <span>EFK BATTLES</span>
        </a>
        <nav className="desktop-nav">
          <a href="/how-to-play">How to Play</a>
          <a href="/live">Live Bracket</a>
          <a href="/faq">FAQ</a>
          <a href="/register" className="cta">Join for KES 100</a>
        </nav>
        <button className="mobile-menu-btn" onClick={() => { document.querySelector('.mobile-nav')?.classList.toggle('open'); }} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="mobile-nav">
          <a href="/how-to-play">How to Play</a>
          <a href="/live">Live Bracket</a>
          <a href="/faq">FAQ</a>
          <a href="/register" className="cta">Join for KES 100</a>
        </div>
      </div>
    </header>
  );
}