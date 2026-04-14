import BlogGrid from "./BlogGrid"

export default function RelatedPosts({ posts }: { posts: any[] }) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="mt-20 pt-10 border-t border-[#222222]">
      <h3 className="text-2xl font-bold text-white mb-8">Related Posts</h3>
      <BlogGrid posts={posts.slice(0, 3)} />
    </section>
  )
}
