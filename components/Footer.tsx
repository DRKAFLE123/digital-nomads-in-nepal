import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0B] border-t border-[#222222] py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="text-[#FFD700] font-bold text-2xl tracking-tighter">
            DN Nepal
          </Link>
          <p className="mt-4 text-[#A0A0A0] text-sm">
            Live. Work. Explore Nepal Remotely. The ultimate guide and community for digital nomads in the Himalayas.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Explore</h3>
          <ul className="space-y-2">
            <li><Link href="/destinations" className="text-[#A0A0A0] hover:text-[#FFD700] text-sm transition-colors">Destinations</Link></li>
            <li><Link href="/living-in-nepal" className="text-[#A0A0A0] hover:text-[#FFD700] text-sm transition-colors">Living in Nepal</Link></li>
            <li><Link href="/guides" className="text-[#A0A0A0] hover:text-[#FFD700] text-sm transition-colors">Nomad Guides</Link></li>
            <li><Link href="/resources" className="text-[#A0A0A0] hover:text-[#FFD700] text-sm transition-colors">Resources</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Company</h3>
          <ul className="space-y-2">
            <li><Link href="/about" className="text-[#A0A0A0] hover:text-[#FFD700] text-sm transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-[#A0A0A0] hover:text-[#FFD700] text-sm transition-colors">Contact</Link></li>
            <li><Link href="/privacy-policy" className="text-[#A0A0A0] hover:text-[#FFD700] text-sm transition-colors">Privacy Policy</Link></li>
            <li><Link href="/disclaimer" className="text-[#A0A0A0] hover:text-[#FFD700] text-sm transition-colors">Disclaimer</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Newsletter</h3>
          <p className="text-[#A0A0A0] text-sm mb-4">Get the latest tips for working from Nepal.</p>
          <Link href="/newsletter" className="inline-block px-4 py-2 bg-[#FFD700] text-black font-semibold hover:bg-white transition-colors">
            Subscribe Free
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[#222222] text-center md:text-left flex flex-col md:flex-row justify-between items-center">
        <p className="text-[#A0A0A0] text-sm">
          &copy; {new Date().getFullYear()} Digital Nomads in Nepal. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
