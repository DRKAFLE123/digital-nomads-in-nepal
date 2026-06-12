import Image from "@/components/ImageWithFallback"
import Link from "next/link"
import { GridPost } from "./BlogGrid"

export default function RelatedPosts({ posts }: { posts: GridPost[] }) {
  if (!posts || posts.length === 0) return null

  return (
    <section className="mt-20 pt-10 border-t border-[#222222]">
      <div className="mb-8 border-b border-[#222222] pb-3">
        <h3 className="text-xl font-bold uppercase tracking-wider text-white relative inline-block">
          Related Posts
          <span className="absolute bottom-[-13px] left-0 w-16 h-0.5 bg-primary" />
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="flex gap-4 group">
            <div className="relative w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-[#222222] bg-neutral-900 shadow-md">
              <Image
                src={post.coverImage || "https://images.unsplash.com/photo-1544735716-392fe2449fee?auto=format&fit=crop&q=80"}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">
                {post.category}
              </span>
              <h4 className="text-sm md:text-base font-bold text-white group-hover:text-primary transition-colors leading-snug line-clamp-2">
                {post.title}
              </h4>
              <span className="text-[11px] text-gray-500 mt-1">
                {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
