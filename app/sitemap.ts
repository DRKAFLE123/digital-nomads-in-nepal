import { MetadataRoute } from 'next'
import { allPosts } from 'contentlayer/generated'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://digitalnomadsinnepal.com'

  const blogs = allPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }))

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

  return [...routes, ...blogs]
}
