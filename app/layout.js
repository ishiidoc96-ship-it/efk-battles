import './globals.css';
import { SponsorBanner, SiteFooter } from './components/Sponsor';
import { SiteHeader } from './components/Header';
import { PwaProvider } from './components/Pwa';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://efk-battles.vercel.app';
const SITE_NAME = 'EFK Battles';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'EFK Battles — eFootball Kenya Battles | Win Real Money',
    template: '%s — EFK Battles',
  },
  description:
    '1v1 eFootball Mobile tournaments in Kenya. KES 100 entry via M-Pesa, 32 players, winner takes 50% of the pot (KES 1,600). Official Youth Esports Partner, Blaze by Safaricom.',
  keywords: [
    'eFootball', 'eFootball Mobile Kenya', 'eFootball tournament Kenya',
    'M-Pesa esports', 'play eFootball for money', 'Kenya mobile gaming',
    'EFK Battles', 'Blaze by Safaricom esports',
  ],
  applicationName: SITE_NAME,
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'maskable', url: '/icons/icon-192-maskable.png', sizes: '192x192' },
      { rel: 'maskable', url: '/icons/icon-512-maskable.png', sizes: '512x512' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'EFK Battles — eFootball Kenya Battles | Win Real Money',
    description:
      '1v1 eFootball Mobile tournaments in Kenya. KES 100 entry via M-Pesa. Winner takes KES 1,600.',
    images: [{ url: '/icons/og-cover.png', width: 1200, height: 630, alt: 'EFK Battles' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EFK Battles — eFootball Kenya Battles',
    description:
      '1v1 eFootball Mobile tournaments in Kenya. KES 100 entry via M-Pesa. Winner takes KES 1,600.',
    images: ['/icons/og-cover.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export function generateViewport() {
  return {
    themeColor: '#0A0A0A',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    viewportFit: 'cover',
  };
}

export default function RootLayout({ children }) {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/sponsors/efk-logo.png`,
        description:
          'Community eFootball Mobile tournament platform for Kenya, in partnership with Blaze by Safaricom.',
      },
      {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],
  };

  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <a href="#main" className="skip-link">Skip to main content</a>
        <SponsorBanner />
        <SiteHeader />
        <PwaProvider />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}