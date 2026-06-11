import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer"
import ReadingProgressBar from "@/components/ReadingProgressBar"
import TableOfContents from "@/components/TableOfContents"
import NewsletterSignup from "@/components/NewsletterSignup"
import RelatedPosts from "@/components/RelatedPosts"
import { Calendar, Clock, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getFlattenedText(children: any): string {
  if (!children) return ""
  if (typeof children === "string") return children
  if (Array.isArray(children)) {
    return children.map(getFlattenedText).join("")
  }
  if (children.props && children.props.children) {
    return getFlattenedText(children.props.children)
  }
  return ""
}


export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({ select: { slug: true } })
    return posts.map((post) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } })
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } })

  if (!post) {
    notFound()
  }

  // Find related posts (same category, exclude current)
  const dbRelated = await prisma.post.findMany({
    where: { category: post.category, slug: { not: post.slug }, published: true },
    take: 3
  })
  
  const related = dbRelated.map(p => ({
    ...p,
    date: p.createdAt.toISOString()
  }))

  // Find next post (created after current post)
  const nextPost = await prisma.post.findFirst({
    where: {
      published: true,
      createdAt: { gt: post.createdAt }
    },
    orderBy: {
      createdAt: 'asc'
    },
    select: {
      title: true,
      slug: true,
      coverImage: true,
      createdAt: true
    }
  })

  // Find previous post (created before current post)
  const prevPost = await prisma.post.findFirst({
    where: {
      published: true,
      createdAt: { lt: post.createdAt }
    },
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      title: true,
      slug: true,
      coverImage: true,
      createdAt: true
    }
  })

  // Fetch recent posts (excluding current post)
  const recentPosts = await prisma.post.findMany({
    where: {
      published: true,
      id: { not: post.id }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5,
    select: {
      id: true,
      title: true,
      slug: true,
      coverImage: true,
      createdAt: true,
      readTime: true
    }
  })


  return (
    <>
      <ReadingProgressBar />
      <Navbar />
      <main className="min-h-screen bg-background pb-20">
        {/* Full-width Hero Banner */}
        <div className="relative w-full h-[55vh] md:h-[70vh] min-h-[460px] flex items-end">
          {/* Background Cover Image */}
          <div className="absolute inset-0 z-0">
            <Image 
              src={post.coverImage || "https://images.unsplash.com/photo-1544735716-392fe2449fee?auto=format&fit=crop&q=80"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            {/* Multi-layered Premium Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/35 z-10" />
            <div className="absolute inset-0 bg-black/20 z-10" />
          </div>
          
          {/* Content Overlaid on Hero */}
          <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 pt-28">
            <div className="max-w-4xl">
              {/* Category Badge */}
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-black bg-primary text-black uppercase tracking-wider mb-4 shadow-lg shadow-primary/10">
                {post.category}
              </span>
              
              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 leading-tight drop-shadow-md">
                {post.title}
              </h1>
              
              {/* Meta information */}
              <div className="flex flex-wrap items-center text-gray-300 text-sm gap-3">
                <span className="flex items-center gap-2 bg-black/45 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10">
                  <User size={14} className="text-primary" /> {post.author}
                </span>
                <span className="flex items-center gap-2 bg-black/45 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10">
                  <Calendar size={14} className="text-primary" /> {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-2 bg-black/45 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10">
                  <Clock size={14} className="text-primary" /> {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <article className="w-full lg:w-[70%] max-w-4xl">
            {post.affiliates && <AffiliateDisclaimer />}
            
            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-[#FFD700] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children, ...props }) => {
                    if (href && (href.includes("youtube.com") || href.includes("youtu.be"))) {
                      let videoId = ""
                      try {
                        if (href.includes("youtube.com/watch")) {
                          const urlObj = new URL(href)
                          videoId = urlObj.searchParams.get("v") || ""
                        } else if (href.includes("youtu.be/")) {
                          videoId = href.split("youtu.be/")[1]?.split("?")[0] || ""
                        } else if (href.includes("youtube.com/embed/")) {
                          videoId = href.split("youtube.com/embed/")[1]?.split("?")[0] || ""
                        }
                      } catch (e) {
                        console.error("Failed to parse YouTube URL:", e)
                      }
                      
                      if (videoId) {
                        return (
                          <span className="block my-8 w-full aspect-video rounded-xl overflow-hidden border border-border shadow-lg">
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </span>
                        )
                      }
                    }
                    return (
                      <a href={href} className="text-[#FFD700] no-underline hover:underline" target="_blank" rel="noopener noreferrer" {...props}>
                        {children}
                      </a>
                    )
                  },
                  h2: ({ children, ...props }) => {
                    const text = getFlattenedText(children)
                    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
                    return <h2 id={id} {...props}>{children}</h2>
                  },
                  h3: ({ children, ...props }) => {
                    const text = getFlattenedText(children)
                    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
                    return <h3 id={id} {...props}>{children}</h3>
                  }
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            <RelatedPosts posts={related} />

            {/* Newsletter Bottom */}
            <div className="mt-20 pt-10 border-t border-[#222222]">
              <NewsletterSignup />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-[30%] space-y-8 relative">
            {/* Post Navigation */}
            {(prevPost || nextPost) && (
              <div className="bg-[#141414] border border-[#222222] p-6 rounded-xl space-y-4">
                <h3 className="text-white font-bold uppercase tracking-wider text-sm border-b border-[#222222] pb-2">Post Navigation</h3>
                <div className="grid grid-cols-1 gap-4">
                  {prevPost && (
                    <a href={`/blog/${prevPost.slug}`} className="group block space-y-1">
                      <span className="text-xs text-[#A0A0A0] group-hover:text-primary transition-colors flex items-center gap-1 font-semibold uppercase">
                        ← Previous Post
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                        {prevPost.title}
                      </span>
                    </a>
                  )}
                  {prevPost && nextPost && <div className="border-t border-[#222222]" />}
                  {nextPost && (
                    <a href={`/blog/${nextPost.slug}`} className="group block space-y-1 text-right">
                      <span className="text-xs text-[#A0A0A0] group-hover:text-primary transition-colors flex items-center justify-end gap-1 font-semibold uppercase">
                        Next Post →
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                        {nextPost.title}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Recent Posts Thumbnail List */}
            {recentPosts && recentPosts.length > 0 && (
              <div className="bg-[#141414] border border-[#222222] p-6 rounded-xl space-y-6">
                <h3 className="text-white font-bold uppercase tracking-wider text-sm border-b border-[#222222] pb-2">Recent Posts</h3>
                <div className="space-y-4">
                  {recentPosts.map((rPost) => (
                    <a key={rPost.id} href={`/blog/${rPost.slug}`} className="flex gap-4 group">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-[#222222]">
                        <Image 
                          src={rPost.coverImage || "https://images.unsplash.com/photo-1544735716-392fe2449fee?auto=format&fit=crop&q=80"}
                          alt={rPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <span className="text-xs text-[#A0A0A0] mb-1">
                          {new Date(rPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {rPost.title}
                        </h4>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Table of Contents - Sticky at the bottom to avoid overlap */}
            <TableOfContents source={post.content} />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
