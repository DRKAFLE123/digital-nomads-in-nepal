import { allPosts } from "contentlayer/generated"
import { compareDesc } from "date-fns"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import BlogListClient from "./BlogListClient"

export const metadata = {
  title: 'Blog | Digital Nomads in Nepal',
  description: 'Read the latest guides, tips, and stories about living and working remotely in Nepal.',
}

export default function BlogPage() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6">Latest Blog Posts</h1>
            <p className="text-xl text-muted-foreground max-w-2xl border-l-4 border-primary pl-4">
              Insights, guides, and stories from digital nomads living and working across Nepal.
            </p>
          </div>

          <BlogListClient posts={posts} />
        </div>
      </main>
      <Footer />
    </>
  )
}
