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
        destination: '/practical-guides',
        permanent: true,
      },
      {
        source: '/resources',
        destination: '/practical-guides',
        permanent: true,
      },
      {
        source: '/resources/visa',
        destination: '/nomad-visa-guide',
        permanent: true,
      },
      {
        source: '/resources/transportation',
        destination: '/nepal-transportation-guide',
        permanent: true,
      },
      {
        source: '/resources/sim-cards',
        destination: '/nepal-sim-cards-guide',
        permanent: true,
      },
      {
        source: '/resources/connectivity',
        destination: '/nepal-sim-cards-guide',
        permanent: true,
      },
      {
        source: '/resources/banking',
        destination: '/nepal-banking-atm-guide',
        permanent: true,
      },
      {
        source: '/resources/cost-of-living',
        destination: '/nepal-cost-of-living-guide',
        permanent: true,
      },
      {
        source: '/resources/coworking',
        destination: '/workspaces',
        permanent: true,
      },
      {
        source: '/resources/coworking/register',
        destination: '/workspaces/register',
        permanent: true,
      },
      {
        source: '/resources/coworking/:slug',
        destination: '/workspaces/:slug',
        permanent: true,
      },
      {
        source: '/coworking',
        destination: '/workspaces',
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
        destination: '/nepal-sim-cards-guide',
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
        source: '/guides/register',
        destination: '/local-guides/register',
        permanent: true,
      },
      {
        source: '/guides/dashboard',
        destination: '/local-guides/dashboard',
        permanent: true,
      },
      {
        source: '/nomad-guides',
        destination: '/local-guides',
        permanent: true,
      },
      {
        source: '/local-experts',
        destination: '/local-guides',
        permanent: true,
      },
      {
        source: '/local-experts/:path*',
        destination: '/local-guides/:path*',
        permanent: true,
      },
      {
        source: '/guides',
        destination: '/local-guides',
        permanent: true,
      },
      {
        source: '/guides/:id',
        destination: '/local-guides/:id',
        permanent: true,
      },
      {
        source: '/guides/cost-of-living-nepal',
        destination: '/blog/cost-of-living-nepal-2026-nomad-budget',
        permanent: true,
      },
      {
        source: '/guides/cost-of-living-kathmandu',
        destination: '/blog/cost-of-living-kathmandu-nomad-guide',
        permanent: true,
      },
      {
        source: '/guides/cost-of-living-pokhara',
        destination: '/blog/cost-of-living-pokhara-nomad-guide',
        permanent: true,
      },
      {
        source: '/guides/nepal-food-cost',
        destination: '/blog/nepal-food-grocery-costs-nomads',
        permanent: true,
      },
      {
        source: '/guides/nepal-rent',
        destination: '/blog/nepal-rent-apartments-coliving-guide',
        permanent: true,
      },
      {
        source: '/guides/digital-nomad-kathmandu',
        destination: '/blog/digital-nomad-kathmandu-city-guide',
        permanent: true,
      },
      {
        source: '/guides/digital-nomad-pokhara',
        destination: '/blog/digital-nomad-pokhara-city-guide',
        permanent: true,
      },
      {
        source: '/guides/kathmandu-vs-pokhara',
        destination: '/blog/kathmandu-vs-pokhara-digital-nomads',
        permanent: true,
      },
      {
        source: '/guides/internet-in-nepal',
        destination: '/blog/internet-speed-fiber-wifi-nepal',
        permanent: true,
      },
      {
        source: '/guides/sim-cards-nepal',
        destination: '/blog/sim-cards-mobile-data-nepal-guide',
        permanent: true,
      },
      {
        source: '/guides/workation-nepal',
        destination: '/blog/workation-nepal-remote-work-guide',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

