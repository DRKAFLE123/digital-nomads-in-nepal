import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        {/* Placeholder Nepal/Nature Video. User can replace the src URL with their own drone footage */}
        <source src="https://cdn.pixabay.com/video/2022/11/22/140111-774431835_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay for text readability (kept explicitly dark because it's overlaid on video) */}
      <div className="absolute inset-0 z-10 bg-black/40" />

      {/* Text Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-medium text-white mb-6 leading-tight drop-shadow-lg tracking-wide">
          Elevate Your Life. <br className="hidden lg:block" /> Work From the Roof of the World.
        </h1>
        <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-10 font-normal drop-shadow-md">
          The Leading Community of Digital Nomads <br className="hidden sm:block" /> & Remote Professionals in Nepal
        </p>
        <Link href="/community" className="px-10 py-4 bg-accent text-white font-medium rounded-full hover:opacity-90 transition-opacity text-lg text-center shadow-lg">
          JOIN NOW
        </Link>
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
