export default function manifest() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://efk-battles.vercel.app';

  return {
    id: '/',
    name: 'EFK Battles — eFootball Kenya Battles',
    short_name: 'EFK Battles',
    description:
      '1v1 eFootball Mobile tournaments in Kenya. KES 100 entry via M-Pesa, winner takes KES 1,600.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui', 'browser'],
    orientation: 'portrait',
    background_color: '#0A0A0A',
    theme_color: '#0A0A0A',
    lang: 'en-KE',
    dir: 'ltr',
    categories: ['games', 'sports', 'entertainment'],
    prefer_related_applications: false,
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Join tournament',
        short_name: 'Join',
        description: 'Register and pay KES 100 with M-Pesa',
        url: '/register',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'Live bracket',
        short_name: 'Live',
        description: 'Watch the current bracket',
        url: '/live',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
      {
        name: 'How to play',
        short_name: 'Guide',
        description: 'Rules, downloads, and store links',
        url: '/how-to-play',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
      },
    ],
  };
}
