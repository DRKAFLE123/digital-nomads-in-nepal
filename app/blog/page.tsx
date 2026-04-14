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
      <main className="min-h-screen bg-[#0B0B0B] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 border-b-4 border-[#FFD700] inline-block pb-2">Digital Nomad Blog</h1>
            <p className="text-[#A0A0A0] text-lg max-w-2xl">
              Everything you need to know to successfully transition to a remote working lifestyle in the Himalayas.
            </p>
          </div>

          <BlogListClient posts={posts} />
        </div>
      </main>
      <Footer />
    </>
  )
}
