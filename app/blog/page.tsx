import { prisma } from "@/lib/prisma"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BlogListClient from "./BlogListClient"
import Image from "next/image"

export const metadata = {
  title: 'Blog | Digital Nomads in Nepal',
  description: 'Read the latest guides, tips, and stories about living and working remotely in Nepal.',
}

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const dbPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" }
  })
  
  const posts = dbPosts.map(p => ({
    ...p,
    date: p.createdAt.toISOString(),
    tags: Array.isArray(p.tags) ? (p.tags as string[]) : []
  }))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pb-20">
        {/* Full-width Hero Banner for Blog Page */}
        <div className="relative w-full h-[45vh] md:h-[55vh] min-h-[360px] flex items-end">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/nepal-blog-hero-banner.png"
              alt="Himalayas and Kathmandu Valley"
              fill
              className="object-cover"
              priority
            />
            {/* Multi-layered Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/35 z-10" />
            <div className="absolute inset-0 bg-black/20 z-10" />
          </div>

          {/* Heading Content */}
          <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 pt-28">
            <div className="max-w-3xl">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-black bg-primary text-black uppercase tracking-wider mb-4 shadow-lg shadow-primary/10">
                Explore Nepal
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-md">
                Latest Blog Posts
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl border-l-4 border-primary pl-4 drop-shadow-sm leading-relaxed">
                Insights, guides, and stories from digital nomads living and working across Nepal.
              </p>
            </div>
          </div>
        </div>

        {/* Blog Listings Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <BlogListClient posts={posts} />
        </div>
      </main>
      <Footer />
    </>
  )
}
