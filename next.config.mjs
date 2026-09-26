/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
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
    ]
  },
}

export default nextConfig
