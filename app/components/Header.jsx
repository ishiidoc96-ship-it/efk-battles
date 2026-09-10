'use client';

import { useState, useEffect } from 'react';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const links = [
    { href: '/how-to-play', label: 'How to Play' },
    { href: '/live', label: 'Live Bracket' },
    { href: '/faq', label: 'FAQ' },
  ];

  const isCurrent = (href) => pathname === href;

  return (
    <header className="site-header">
      <div className="container">
        <a href="/" className="logo" aria-label="EFK Battles home">
          <img src="/sponsors/efk-logo.png" alt="EFK Battles logo" height={36} width={90} style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
          <span className="display">EFK BATTLES</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((l) => (
            <a key={l.href} href={l.href} aria-current={isCurrent(l.href) ? 'page' : undefined}>
              {l.label}
            </a>
          ))}
          <a href="/register" className="cta" aria-current={isCurrent('/register') ? 'page' : undefined}>
            Join for KES 100
          </a>
        </nav>
        <button
          className="mobile-menu-btn"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div id="mobile-nav" className={`mobile-nav${open ? ' open' : ''}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={isCurrent(l.href) ? 'page' : undefined}>
              {l.label}
            </a>
          ))}
          <a href="/register" className="cta" onClick={() => setOpen(false)} aria-current={isCurrent('/register') ? 'page' : undefined}>
            Join for KES 100
          </a>
        </div>
      </div>
    </header>
  );
}