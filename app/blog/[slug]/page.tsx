import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "@/components/ImageWithFallback"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer"
import ReadingProgressBar from "@/components/ReadingProgressBar"
import TableOfContents from "@/components/TableOfContents"
import NewsletterSignup from "@/components/NewsletterSignup"
import RelatedPosts from "@/components/RelatedPosts"
import InternalLinkingEngine from "@/components/InternalLinkingEngine"
import { Calendar, Clock, User, ChevronRight, Camera } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Metadata } from "next"
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateFaqJsonLd, SITE_URL } from "@/lib/seo"

function extractFaqsFromContent(content: string): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = []
  const faqSectionMatch = content.match(/(?:##|###)\s*(?:Frequently Asked Questions|FAQ)[\s\S]*$/i)
  const targetText = faqSectionMatch ? faqSectionMatch[0] : content

  const regex = /(?:###|\*\*Q:?\*\*)\s*([^\n\?]+\?)\s*\n+([\s\S]*?)(?=(?:###|\*\*Q:?\*\*)|(?:##\s)|$)/gi
  let match
  while ((match = regex.exec(targetText)) !== null) {
    const question = match[1].replace(/\*\*/g, "").trim()
    const answer = match[2].replace(/\*\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim()
    if (question.length > 5 && answer.length > 10 && faqs.length < 8) {
      faqs.push({ question, answer: answer.slice(0, 450) })
    }
  }
  return faqs
}

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } })
  if (!post) return {}
  
  const postUrl = `${SITE_URL}/blog/${params.slug}`
  const imageUrl = post.coverImage || `${SITE_URL}/hero-bg.png`

  return {
    title: `${post.title} | Digital Nomads in Nepal`,
    description: post.excerpt,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: "Digital Nomads in Nepal",
      locale: "en_US",
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author || "Digital Nomads in Nepal"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    },
  }
}

export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } })

  if (!post) {
    notFound()
  }

  // Find related posts (same category, exclude current, limit to 6)
  const dbRelated = await prisma.post.findMany({
    where: { category: post.category, slug: { not: post.slug }, published: true },
    take: 6
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


  const articleJsonLd = generateArticleJsonLd(post)
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Blog", item: "/blog" },
    { name: post.title, item: `/blog/${post.slug}` },
  ])

  const faqs = extractFaqsFromContent(post.content)
  const faqJsonLd = faqs.length > 0 ? generateFaqJsonLd(faqs) : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ReadingProgressBar />
      <Navbar />
      <main className="min-h-screen bg-background pb-20">
        {/* Editorial Masthead Header */}
        <header className="pt-28 sm:pt-32 pb-8 sm:pb-10 px-5 sm:px-8 lg:px-10 max-w-5xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 overflow-x-auto scrollbar-none py-0.5">
            <Link href="/" className="hover:text-foreground transition-colors shrink-0">Home</Link>
            <ChevronRight size={12} className="opacity-50 shrink-0" />
            <Link href="/blog" className="hover:text-foreground transition-colors shrink-0">Field Guides</Link>
            <ChevronRight size={12} className="opacity-50 shrink-0" />
            <span className="text-[#C2410C] dark:text-[#FB923C] font-semibold truncate max-w-[220px] sm:max-w-sm">
              {post.category || "Guide"}
            </span>
          </nav>

          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] font-bold bg-[#C2410C] text-white uppercase tracking-wider shadow-xs">
              {post.category}
            </span>
          </div>

          {/* Majestic Editorial Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold text-gray-900 dark:text-[#F5F5F4] leading-[1.14] tracking-tight mb-6">
            {post.title}
          </h1>

          {/* Optional Excerpt / Lede Subtitle */}
          {post.excerpt && (
            <p className="font-serif italic text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6 max-w-3xl">
              {post.excerpt}
            </p>
          )}

          {/* Author Byline & Publishing Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#E8E2D8] dark:border-[#26262A] text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C2410C] to-[#9A3412] text-white flex items-center justify-center font-black text-xs shadow-xs select-none ring-2 ring-[#C2410C]/20">
                {post.author?.[0]?.toUpperCase() || "D"}
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-white block leading-tight">
                  {post.author}
                </span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  Nepal Field Correspondent
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-[#C2410C] dark:text-[#FB923C]" />
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} className="text-[#C2410C] dark:text-[#FB923C]" />
                {post.readTime}
              </span>
            </div>
          </div>
        </header>

        {/* Cinematic Cover Image (Full Resolution, 16:9 / 21:9 Aspect Ratio, NO blur, NO foggy gradient, NO overlapping card) */}
        <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 mb-10 sm:mb-12">
          <div className="relative aspect-[16/10] sm:aspect-[21/10] w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8E2D8] dark:border-[#26262A] shadow-xl bg-[#141416]">
            <Image 
              src={post.coverImage || "https://images.unsplash.com/photo-1544735716-392fe2449fee?auto=format&fit=crop&q=80"}
              alt={post.title}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2.5 px-1 flex items-center gap-1.5 italic">
            <Camera size={12} className="opacity-60 shrink-0" />
            Field photography • {post.category || "Nomad Guide"} in Nepal
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 flex flex-col lg:flex-row justify-between items-start gap-10 xl:gap-14">
          {/* Main Focused Reading Column (Thin-Long Measure, ~720px for optimal reading cadence) */}
          <article className="w-full lg:max-w-[720px] xl:max-w-[740px] shrink-0 mx-auto lg:mx-0">
            {post.affiliates && <AffiliateDisclaimer />}
            
            <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none text-[17.5px] sm:text-[18px] leading-[1.85] tracking-normal text-gray-800 dark:text-gray-300 prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-950 dark:prose-headings:text-gray-50 prose-p:text-gray-800 dark:prose-p:text-gray-300 prose-p:leading-[1.85] prose-p:mb-8 prose-a:text-[#C2410C] dark:prose-a:text-[#FB923C] hover:prose-a:underline prose-strong:text-gray-950 dark:prose-strong:text-white prose-strong:font-bold prose-img:rounded-2xl prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-[#C2410C] prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-lg sm:prose-blockquote:text-xl prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:my-8 prose-blockquote:pl-6 [&>p:first-of-type]:first-letter:float-left [&>p:first-of-type]:first-letter:text-5xl [&>p:first-of-type]:first-letter:sm:text-6xl [&>p:first-of-type]:first-letter:font-serif [&>p:first-of-type]:first-letter:font-bold [&>p:first-of-type]:first-letter:mr-3.5 [&>p:first-of-type]:first-letter:leading-none [&>p:first-of-type]:first-letter:text-gray-950 dark:[&>p:first-of-type]:first-letter:text-white">
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
                      <a href={href} className="text-[#C2410C] dark:text-[#FB923C] hover:underline" target="_blank" rel="noopener noreferrer" {...props}>
                        {children}
                      </a>
                    )
                  },
                  h2: ({ children, ...props }) => {
                    const text = getFlattenedText(children)
                    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
                    return <h2 id={id} className="text-gray-900 dark:text-white font-serif font-bold text-2xl sm:text-3xl mt-12 mb-5 pt-6 border-t border-gray-100 dark:border-[#222225] first:border-t-0 first:pt-0" {...props}>{children}</h2>
                  },
                  h3: ({ children, ...props }) => {
                    const text = getFlattenedText(children)
                    const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
                    return <h3 id={id} className="text-gray-900 dark:text-white font-serif font-bold text-xl sm:text-2xl mt-9 mb-3.5" {...props}>{children}</h3>
                  }
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Semantic Cross-Linking Engine */}
            <InternalLinkingEngine
              type="article"
              title={post.title}
              tags={Array.isArray(post.tags) ? (post.tags as string[]) : []}
              content={post.content}
            />

            <RelatedPosts posts={related} />

            {/* Newsletter Bottom */}
            <div className="mt-20 pt-10 border-t border-[#222222]">
              <NewsletterSignup />
            </div>
          </article>

          {/* Sticky Editorial Sidebar */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-8 relative">
            {/* Recent Posts Thumbnail List */}
            {recentPosts && recentPosts.length > 0 && (
              <div className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] p-6 rounded-2xl shadow-xs space-y-6">
                <h3 className="text-gray-900 dark:text-white font-bold uppercase tracking-wider text-xs border-b border-gray-100 dark:border-[#222225] pb-2.5">
                  Recent Guides
                </h3>
                <div className="space-y-4">
                  {recentPosts.map((rPost) => (
                    <a key={rPost.id} href={`/blog/${rPost.slug}`} className="flex gap-4 group">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 dark:border-[#26262A]">
                        <Image 
                          src={rPost.coverImage || "https://images.unsplash.com/photo-1544735716-392fe2449fee?auto=format&fit=crop&q=80"}
                          alt={rPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <span className="text-[11px] text-gray-400 mb-1">
                          {new Date(rPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors line-clamp-2 leading-snug">
                          {rPost.title}
                        </h4>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Sticky Wrapper on Desktop for Table of Contents and Post Navigation */}
            <div className="lg:sticky lg:top-28 space-y-8">
              {/* Table of Contents - Hidden on mobile/tablet */}
              <div className="hidden lg:block">
                <TableOfContents source={post.content} />
              </div>

              {/* Post Navigation - Always visible below Table of Contents */}
              {(prevPost || nextPost) && (
                <div className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] p-6 rounded-2xl shadow-xs space-y-4">
                  <h3 className="text-gray-900 dark:text-white font-bold uppercase tracking-wider text-xs border-b border-gray-100 dark:border-[#222225] pb-2.5">
                    Post Navigation
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {prevPost && (
                      <a href={`/blog/${prevPost.slug}`} className="group block space-y-1">
                        <span className="text-[11px] text-gray-400 group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors flex items-center gap-1 font-semibold uppercase">
                          ← Previous Post
                        </span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors line-clamp-2">
                          {prevPost.title}
                        </span>
                      </a>
                    )}
                    {prevPost && nextPost && <div className="border-t border-gray-100 dark:border-[#222225]" />}
                    {nextPost && (
                      <a href={`/blog/${nextPost.slug}`} className="group block space-y-1 text-right">
                        <span className="text-[11px] text-gray-400 group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors flex items-center justify-end gap-1 font-semibold uppercase">
                          Next Post →
                        </span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-[#C2410C] dark:group-hover:text-[#FB923C] transition-colors line-clamp-2">
                          {nextPost.title}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
