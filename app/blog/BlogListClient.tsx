"use client"
import { useState, useMemo } from "react"
import BlogGrid from "@/components/BlogGrid"
import SearchBar from "@/components/SearchBar"
import Fuse from "fuse.js"

export default function BlogListClient({ posts }: { posts: any[] }) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")

  const categories = ["All", "Cost of Living", "Destinations", "Work Setup", "Lifestyle", "Visa"]

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
      result = result.filter(post => post.category === category)
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
