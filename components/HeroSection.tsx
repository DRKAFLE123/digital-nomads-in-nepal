import Link from "next/link"
import { ChevronDown } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background with Mountain Silhouette placeholder */}
      <div className="absolute inset-0 z-0 bg-[#0B0B0B]">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#111111] to-transparent z-10" />
        <svg className="absolute bottom-0 w-full h-auto text-[#141414] opacity-50" viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path d="M0,288L80,266.7C160,245,320,203,480,186.7C640,171,800,181,960,213.3C1120,245,1280,299,1360,325.3L1440,352L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" opacity="0.5"></path>
        </svg>
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-6 leading-tight">
          Live. Work. <span className="text-[#FFD700]">Explore</span> <br className="hidden md:block" /> Nepal Remotely.
        </h1>
        <p className="text-lg md:text-2xl text-[#A0A0A0] max-w-2xl mx-auto mb-10 font-light">
          The #1 resource for digital nomads in Nepal. Discover coworking spaces, visa guides, and lifestyle tips for the Himalayas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/blog" className="px-8 py-4 bg-[#FFD700] text-black font-bold rounded-none hover:bg-white transition-colors text-lg text-center">
            Read the Blog
          </Link>
          <Link href="/community" className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-none hover:border-[#FFD700] hover:text-[#FFD700] transition-colors text-lg text-center">
            Join Community
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center animate-bounce text-[#A0A0A0]">
        <span className="text-xs uppercase tracking-widest mb-2 font-semibold">Scroll</span>
        <ChevronDown size={24} />
      </div>
    </section>
  )
}
