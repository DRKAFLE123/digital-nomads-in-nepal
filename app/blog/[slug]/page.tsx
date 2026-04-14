import { allPosts } from "contentlayer/generated"
import { notFound } from "next/navigation"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer"
import ReadingProgressBar from "@/components/ReadingProgressBar"
import TableOfContents from "@/components/TableOfContents"
import NewsletterSignup from "@/components/NewsletterSignup"
import RelatedPosts from "@/components/RelatedPosts"
import { getMDXComponent } from "next-contentlayer/hooks"
import { Calendar, Clock, User } from "lucide-react"

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = allPosts.find((post) => post.slug === params.slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = allPosts.find((post) => post.slug === params.slug)

  if (!post) {
    notFound()
  }

  const MDXContent = getMDXComponent(post.body.code)
  
  // Find related posts (same category, exclude current)
  const related = allPosts.filter(p => p.category === post.category && p.slug !== post.slug)

  return (
    <>
      <ReadingProgressBar />
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8 border border-border">
              <Image 
                src={post.coverImage || "https://images.unsplash.com/photo-1544735716-392fe2449fee?auto=format&fit=crop&q=80"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
            </div>
            
            <div className="relative z-20 -mt-24 md:-mt-32 px-4 md:px-8">
              <div className="inline-block px-3 py-1 bg-primary text-black font-bold text-sm mb-4">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center text-muted-foreground text-sm gap-6">
                <span className="flex items-center gap-2"><User size={16} /> {post.author}</span>
                <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="flex items-center gap-2"><Clock size={16} /> {post.readTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <article className="w-full lg:w-[70%] max-w-4xl">
            {post.affiliates && <AffiliateDisclaimer />}
            
            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-[#FFD700] prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
              <MDXContent />
            </div>

            {/* Newsletter Bottom */}
            <div className="mt-20 pt-10 border-t border-[#222222]">
              <NewsletterSignup />
            </div>

            <RelatedPosts posts={related} />
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-[30%] relative">
            <TableOfContents source={post.body.raw} />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
