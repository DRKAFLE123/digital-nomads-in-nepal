import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/admin/*',
        '/api/*',
        '/dashboard',
        '/dashboard/*',
        '/auth/*',
        '/owner/*',
        '/nomad/*',
        '/guides/dashboard',
        '/guides/dashboard/*',
        '/community',
        '/community/*',
        '/search',
        '/search/*',
      ],
    },
    sitemap: 'https://digitalnomadsinnepal.com/sitemap.xml',
  }
}
