import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://digitalnomadsinnepal.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/destinations`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/practical-guides`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/workspaces`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/nomad-visa-guide`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/nepal-cost-of-living-guide`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/nepal-sim-cards-guide`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/nepal-transportation-guide`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/nepal-banking-atm-guide`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/local-guides`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/stay`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/insurance`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/map`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/partners`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/newsletter`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/sitemap`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ]

  try {
    const [allPosts, allDestinations, allHubs, allGuides] = await Promise.all([
      prisma.post.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true }
      }).catch(() => []),
      prisma.destination.findMany({
        select: { slug: true, updatedAt: true }
      }).catch(() => []),
      prisma.workHub.findMany({
        select: { slug: true, updatedAt: true }
      }).catch(() => []),
      prisma.guide.findMany({
        where: { isVerified: true },
        select: { id: true, createdAt: true }
      }).catch(() => []),
    ])

    const blogs: MetadataRoute.Sitemap = allPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const destinations: MetadataRoute.Sitemap = allDestinations.map((dest) => ({
      url: `${baseUrl}/destinations/${dest.slug}`,
      lastModified: new Date(dest.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.9,
    }))

    const hubs: MetadataRoute.Sitemap = allHubs.map((hub) => ({
      url: `${baseUrl}/workspaces/${hub.slug}`,
      lastModified: new Date(hub.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const guides: MetadataRoute.Sitemap = allGuides.map((guide) => ({
      url: `${baseUrl}/local-guides/${guide.id}`,
      lastModified: new Date(guide.createdAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    return [...staticRoutes, ...destinations, ...hubs, ...blogs, ...guides]
  } catch (error) {
    console.warn("Could not fetch dynamic items for sitemap:", error)
    return staticRoutes
  }
}
