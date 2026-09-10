import './globals.css';
import { SponsorBanner, SiteFooter } from './components/Sponsor';
import { SiteHeader } from './components/Header';

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
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'EFK Battles — eFootball Kenya Battles | Win Real Money',
    description:
      '1v1 eFootball Mobile tournaments in Kenya. KES 100 entry via M-Pesa. Winner takes KES 1,600.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EFK Battles — eFootball Kenya Battles',
    description:
      '1v1 eFootball Mobile tournaments in Kenya. KES 100 entry via M-Pesa. Winner takes KES 1,600.',
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
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}