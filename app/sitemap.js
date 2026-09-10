const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://efk-battles.vercel.app';

export default function sitemap() {
  const routes = [
    '',
    '/register',
    '/how-to-play',
    '/live',
    '/faq',
    '/terms',
    '/privacy',
    '/safaricom-disclaimer',
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}