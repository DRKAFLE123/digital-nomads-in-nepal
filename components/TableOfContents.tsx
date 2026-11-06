"use client"
import { useEffect, useState, ReactNode } from "react"
import ShareButtons from "@/components/blog/ShareButtons"

type TOCItem = { id: string; text: string; level: number }

interface TableOfContentsProps {
  source: string
  postTitle?: string
  children?: ReactNode
}

export default function TableOfContents({ source, postTitle, children }: TableOfContentsProps) {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    const headingsRegex = /^(##|###)\s+(.+)$/gm
    const extractedToc: TOCItem[] = []
    let match
    while ((match = headingsRegex.exec(source)) !== null) {
      extractedToc.push({
        level: match[1].length,
        text: match[2],
        id: match[2].toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      })
    }
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
    <div className="bg-white dark:bg-[#141416] border border-gray-200 dark:border-[#26262A] p-5 sm:p-6 rounded-2xl shadow-xs">
      <h3 className="text-gray-900 dark:text-white font-bold mb-4 uppercase tracking-wider text-xs border-b border-gray-100 dark:border-[#222225] pb-2.5">
        Table of Contents
      </h3>
      <ul className="space-y-2.5 max-h-[50vh] overflow-y-auto scrollbar-thin pr-1 text-xs sm:text-sm">
        {toc.map((item, index) => (
          <li key={index} className={`${item.level === 3 ? "ml-3.5" : ""}`}>
            <a 
              href={`#${item.id}`} 
              className={`transition-colors block py-0.5 leading-snug ${activeId === item.id ? "text-[#C2410C] dark:text-[#FB923C] font-bold" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}
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

      {/* Share Buttons at Bottom of Table of Contents */}
      {postTitle && (
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-[#222225]">
          <ShareButtons title={postTitle} />
        </div>
      )}

      {children}
    </div>
  )
}
