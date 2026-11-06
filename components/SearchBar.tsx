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
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
        <Search size={20} />
      </div>
      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={handleChange}
        className="block w-full bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] rounded-full py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#C2410C] focus:ring-1 focus:ring-[#C2410C] shadow-sm transition-colors text-sm font-medium"
      />
    </div>
  )
}
