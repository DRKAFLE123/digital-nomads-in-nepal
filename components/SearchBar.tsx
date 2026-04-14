"use client"
import { useState } from "react"
import { Search } from "lucide-react"

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-10">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#A0A0A0]">
        <Search size={20} />
      </div>
      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={handleChange}
        className="block w-full bg-[#141414] border border-[#222222] rounded-full py-4 pl-12 pr-4 text-white placeholder-[#A0A0A0] focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-colors"
      />
    </div>
  )
}
