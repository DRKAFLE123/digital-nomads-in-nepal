/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/living-in-nepal',
        destination: '/resources',
        permanent: true,
      },
      {
        source: '/resources/connectivity',
        destination: '/resources/sim-cards',
        permanent: true,
      },
      {
        source: '/blog/cost-of-living-nepal-2026',
        destination: '/blog/cost-of-living-nepal-2026-nomad-budget',
        permanent: true,
      },
      {
        source: '/blog/best-cities-digital-nomads-nepal',
        destination: '/destinations',
        permanent: true,
      },
      {
        source: '/blog/internet-speed-nepal-guide',
        destination: '/resources/sim-cards',
        permanent: true,
      },
      {
        source: '/workspaces',
        destination: '/resources/coworking',
        permanent: true,
      },
      {
        source: '/coworking',
        destination: '/resources/coworking',
        permanent: true,
      },
      {
        source: '/stay-and-work',
        destination: '/stay',
        permanent: true,
      },
      {
        source: '/work-friendly-stays',
        destination: '/stay',
        permanent: true,
      },
      {
        source: '/accommodations',
        destination: '/stay',
        permanent: true,
      },
      {
        source: '/nomad-guides',
        destination: '/guides',
        permanent: true,
      },
      {
        source: '/local-guides',
        destination: '/guides',
        permanent: true,
      },
      {
        source: '/local-experts',
        destination: '/guides',
        permanent: true,
      },
      {
        source: '/local-experts/:path*',
        destination: '/guides/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

