"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Blog", href: "/blog" },
    { name: "Destinations", href: "/destinations" },
    { name: "Guides", href: "/guides" },
    { name: "Resources", href: "/resources" },
    { name: "Community", href: "/community" },
  ]

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? "bg-[#0B0B0B] border-b border-[#222222]" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="text-[#FFD700] font-bold text-2xl tracking-tighter">
              DN Nepal
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-white hover:text-[#FFD700] transition-colors font-medium">
                {link.name}
              </Link>
            ))}
            <Link href="/community" className="px-5 py-2.5 border-2 border-[#FFD700] text-[#FFD700] font-semibold hover:bg-[#FFD700] hover:text-black transition-colors rounded-none">
              Join Community
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white hover:text-[#FFD700]">
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0B0B] border-b border-[#222222]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="block px-3 py-2 text-base font-medium text-white hover:text-[#FFD700]">
                {link.name}
              </Link>
            ))}
            <Link href="/community" className="block w-full text-center mt-4 px-5 py-2.5 bg-transparent border-2 border-[#FFD700] text-[#FFD700] font-bold hover:bg-[#FFD700] hover:text-black transition-colors rounded-none">
              Join Community
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
