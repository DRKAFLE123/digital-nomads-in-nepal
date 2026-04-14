"use client"
import { useEffect, useState } from "react"

type TOCItem = { id: string; text: string; level: number }

export default function TableOfContents({ source }: { source: string }) {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    // Simple regex to extract headings (H2 and H3)
    const headingsRegex = /^(##|###)\s+(.+)$/gm
    const matches = Array.from(source.matchAll(headingsRegex))
    const extractedToc = matches.map((match) => ({
      level: match[1].length,
      text: match[2],
      id: match[2].toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
    }))
    setToc(extractedToc)

    const handleScroll = () => {
      const headingElements = extractedToc.map(item => document.getElementById(item.id))
      let currentId = ""
      for (const element of headingElements) {
        if (element && element.getBoundingClientRect().top < 100) {
          currentId = element.id
        }
      }
      setActiveId(currentId)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [source])

  if (toc.length === 0) return null

  return (
    <div className="sticky top-28 bg-[#141414] border border-[#222222] p-6 rounded-xl hidden lg:block">
      <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm border-b border-[#222222] pb-2">Table of Contents</h3>
      <ul className="space-y-3">
        {toc.map((item, index) => (
          <li key={index} className={`${item.level === 3 ? "ml-4" : ""}`}>
            <a 
              href={`#${item.id}`} 
              className={`text-sm transition-colors block ${activeId === item.id ? "text-[#FFD700] font-medium" : "text-[#A0A0A0] hover:text-white"}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
