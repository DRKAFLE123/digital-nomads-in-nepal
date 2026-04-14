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
      <main className="min-h-screen bg-[#0B0B0B] pt-24 pb-20">
        {/* Header Cover */}
        <div className="relative w-full h-[40vh] md:h-[50vh] bg-[#141414] border-b border-[#222222]">
          {post.coverImage && (
            <Image 
              src={post.coverImage} 
              alt={post.title} 
              fill 
              className="object-cover opacity-50" 
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] to-transparent z-10" />
          <div className="absolute bottom-0 left-0 w-full z-20 px-4 sm:px-6 lg:px-8 pb-10">
            <div className="max-w-4xl mx-auto">
              <span className="bg-[#FFD700] text-black text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center text-[#A0A0A0] text-sm gap-6">
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
