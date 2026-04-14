"use client"
import { useState, useEffect } from "react"

export default function ReadingProgressBar() {
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollTop
      const heightWin = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scroll = `${(scrollTotal / heightWin) * 100}`
      setReadingProgress(Number(scroll))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[60] bg-transparent">
      <div 
        className="h-full bg-[#FFD700] transition-all duration-150 ease-out" 
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  )
}
