import './globals.css';
import { SponsorBanner, SiteFooter } from './components/Sponsor';
import { SiteHeader } from './components/Header';

export const metadata = {
  title: 'EFK Battles — eFootball Kenya Battles',
  description: '100 KES eFootball Mobile tournaments. 32 players. 1 champion. Official Youth Esports Partner, Blaze by Safaricom.',
};

export function generateViewport() {
  return { themeColor: '#FAFAF7', width: 'device-width', initialScale: 1 };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SponsorBanner />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}