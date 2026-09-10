'use client';

import { useEffect, useState } from 'react';

const DISMISS_KEY = 'efk-pwa-dismissed';

export function PwaProvider() {
  const [deferred, setDeferred] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true
    );

    const ua = window.navigator.userAgent || '';
    const ios =
      /iPad|iPhone|iPod/.test(ua) ||
      (ua.includes('Mac') && 'ontouchend' in document);
    setIsIos(ios);

    if (sessionStorage.getItem(DISMISS_KEY) === '1') return;

    const onPrompt = (e) => {
      e.preventDefault();
      setDeferred(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);

    // iOS never fires beforeinstallprompt — offer Share → Add to Home Screen instead.
    if (ios && !window.navigator.standalone) {
      setShowBanner(true);
    }

    const onInstalled = () => {
      setShowBanner(false);
      setDeferred(null);
    };
    window.addEventListener('appinstalled', onInstalled);

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (isStandalone || !showBanner) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setShowBanner(false);
  };

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {
      // ignore
    }
    setDeferred(null);
    setShowBanner(false);
  };

  return (
    <div className="pwa-banner" role="region" aria-label="Install EFK Battles">
      <div className="pwa-banner-inner">
        <div className="pwa-banner-copy">
          <strong>Install EFK Battles</strong>
          <p>
            {isIos
              ? 'Tap Share, then “Add to Home Screen” for faster access and match alerts.'
              : 'Add this site to your home screen. Opens like an app, saves data.'}
          </p>
        </div>
        <div className="pwa-banner-actions">
          {!isIos && deferred ? (
            <button type="button" className="pwa-install-btn" onClick={install}>
              Install
            </button>
          ) : null}
          <button type="button" className="pwa-dismiss-btn" onClick={dismiss} aria-label="Dismiss install banner">
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
