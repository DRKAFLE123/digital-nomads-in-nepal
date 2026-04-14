import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0B0B]">
      {/* Mountain Peak Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-bg.png" 
          alt="Cinematic Himalayan Mountain Peak in Nepal" 
          fill 
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Dark Overlay for text readability (matches the image's deep navy/black overlay design seamlessly) */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0B0B0B] via-black/50 to-black/20" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center py-16 md:py-24">
        
        {/* H1 */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-xl mb-4">
          Live and Work in Nepal<br className="hidden sm:block" />{" "}
          <span className="text-primary">on a Nomad Visa</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-gray-200 font-medium drop-shadow-md max-w-2xl mb-2 px-2">
          Cost of living, visa, internet, and the best cities to live and work remotely in Nepal.
        </p>

        {/* Extra SEO Line */}
        <p className="text-xs sm:text-sm text-primary/90 font-medium drop-shadow mb-8 tracking-wide px-2">
          Guides for digital nomads in Kathmandu, Pokhara, and across Nepal.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none">
          {/* Primary CTA */}
          <Link
            href="/community"
            className="w-full sm:w-auto bg-primary text-black font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all transform hover:scale-105 hover:bg-white hover:shadow-xl text-base sm:text-lg text-center"
          >
            Join the Free Nomad Community →
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/blog"
            className="w-full sm:w-auto text-white font-semibold border-2 border-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:border-primary hover:text-primary transition-all text-base sm:text-lg text-center"
          >
            Read the Blog →
          </Link>
        </div>

        {/* Trust Line — hidden on very small screens to reduce clutter */}
        <p className="hidden sm:block mt-8 text-gray-400 text-sm italic font-medium tracking-wide">
          Join thousands of digital nomads already working remotely from Nepal.
        </p>
      </div>

      {/* Curved Arch Edge SVG mask at the bottom smoothly transitioning into the theme */}
      <div className="absolute bottom-0 left-0 w-full z-20 overflow-hidden leading-none pointer-events-none translate-y-[2px] text-background">
        <svg className="relative block w-[calc(100%+5px)] h-[50px] md:h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M600,112.77C268.63,112.77,0,65.52,0,7.23V120H1200V7.23C1200,65.52,931.37,112.77,600,112.77Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  )
}
