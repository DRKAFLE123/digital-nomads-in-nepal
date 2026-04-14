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
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-2 leading-tight drop-shadow-xl tracking-wide">
          Elevate Your Life.
        </h1>
        <h2 className="text-2xl md:text-4xl text-white/90 italic mb-10 font-medium drop-shadow-md">
          Work From the Roof of the World.
        </h2>
        <Link href="/community" className="px-10 py-4 bg-primary text-black font-bold rounded-full hover:bg-white hover:text-black transition-colors text-xl text-center shadow-lg mb-6">
          Join the Community
        </Link>
        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto font-medium tracking-wide drop-shadow-sm uppercase">
          Live. Work. Explore Nepal as a Digital Nomad.
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
