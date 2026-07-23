"use client"
import { useState, useMemo } from "react"
import BlogGrid from "@/components/BlogGrid"
import SearchBar from "@/components/SearchBar"
import Fuse from "fuse.js"

export type BlogPost = {
  title: string
  slug: string
  excerpt: string
  coverImage: string
  category: string
  readTime: string
  date: string
  tags?: string[]
}

export default function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")

  // Extract unique categories from posts and combine with defaults (including Coworking Spaces)
  const categories = useMemo(() => {
    const defaultCats = ["All", "Coworking Spaces", "Cost of Living", "Destinations", "Work Setup", "Lifestyle", "Visa"]
    const postCats = Array.from(new Set(posts.map(p => p.category).filter(Boolean)))
    return Array.from(new Set([...defaultCats, ...postCats]))
  }, [posts])

  // Initialize Fuse.js
  const fuse = useMemo(() => new Fuse(posts, {
    keys: ["title", "excerpt", "category", "tags"],
    threshold: 0.3,
  }), [posts])

  // Process filtering and searching
  const filteredPosts = useMemo(() => {
    let result = posts

    if (query) {
      const searchResults = fuse.search(query)
      result = searchResults.map(res => res.item)
    }

    if (category !== "All") {
      result = result.filter(post => {
        if (!post.category) return false
        const pCat = post.category.toLowerCase()
        const target = category.toLowerCase()
        if (target.includes("coworking")) {
          return pCat.includes("coworking") || (post.tags && post.tags.some(t => t.toLowerCase().includes("coworking")))
        }
        return pCat === target
      })
    }

    return result
  }, [posts, query, category, fuse])

  return (
    <>
      <SearchBar onSearch={setQuery} />
      
      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 text-sm font-medium transition-colors border ${
              category === cat 
                ? "bg-[#FFD700] text-black border-[#FFD700]" 
                : "bg-transparent text-[#A0A0A0] border-[#222222] hover:border-[#FFD700] hover:text-[#FFD700]"
            } rounded-full`}
          >
            {cat}
          </button>
        ))}
      </div>

      <BlogGrid posts={filteredPosts} />
    </>
  )
}
