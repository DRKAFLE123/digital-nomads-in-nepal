import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://digitalnomadsinnepal.com'

  const routes = [
    '',
    '/blog',
    '/destinations',
    '/living-in-nepal',
    '/guides',
    '/resources',
    '/community',
    '/privacy-policy',
    '/disclaimer'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))

  try {
    const allPosts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true }
    })

    const blogs = allPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
    }))

    return [...routes, ...blogs]
  } catch (error) {
    console.warn("Could not fetch posts for sitemap during build:", error)
    return routes
  }
}
