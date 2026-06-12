import HeroSection from "@/components/HeroSection"
import DestinationCard from "@/components/DestinationCard"
import BlogGrid from "@/components/BlogGrid"
import StickyCommunityCTA from "@/components/StickyCommunityCTA"
import NewsletterSignup from "@/components/NewsletterSignup"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Wallet, Wifi, MapPin, Mountain, MessageCircle, Camera, Video, MessageSquare } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Digital Nomads in Nepal | Vetted Remote Work Guides (2026)",
  description: "The definitive portal for digital nomads in Nepal. Get verified guides on the Nepal Nomad Visa, cost of living, coworking spaces, and trekking guides.",
}

export default async function Home() {
  const dbPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3
  })
  
  const posts = dbPosts.map(p => ({
    ...p,
    date: p.createdAt.toISOString()
  }))

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-between bg-background">
        <HeroSection />

        {/* Value Section */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-background border-t border-border">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card p-8 border border-border text-center rounded-xl hover:border-primary transition-colors">
              <Wallet className="mx-auto text-primary mb-4" size={40} />
              <h3 className="text-xl font-bold text-foreground mb-2">Cost of Living</h3>
              <p className="text-muted-foreground">From $500/month</p>
            </div>
            <div className="bg-card p-8 border border-border text-center rounded-xl hover:border-primary transition-colors">
              <Wifi className="mx-auto text-primary mb-4" size={40} />
              <h3 className="text-xl font-bold text-foreground mb-2">Internet</h3>
              <p className="text-muted-foreground">Fast fiber in cities</p>
            </div>
            <div className="bg-card p-8 border border-border text-center rounded-xl hover:border-primary transition-colors">
              <MapPin className="mx-auto text-primary mb-4" size={40} />
              <h3 className="text-xl font-bold text-foreground mb-2">Coworking</h3>
              <p className="text-muted-foreground">10+ spaces in Kathmandu</p>
            </div>
            <div className="bg-card p-8 border border-border text-center rounded-xl hover:border-primary transition-colors">
              <Mountain className="mx-auto text-primary mb-4" size={40} />
              <h3 className="text-xl font-bold text-foreground mb-2">Lifestyle</h3>
              <p className="text-muted-foreground">Mountains + culture</p>
            </div>
          </div>
        </section>

        {/* Featured Blogs Section */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end gap-4 mb-12 flex-wrap">
              <h2 className="text-3xl md:text-5xl font-black text-foreground px-2 border-l-4 border-primary">Latest from the Blog</h2>
              <a href="/blog" className="text-muted-foreground hover:text-primary transition-colors font-medium border-b border-transparent hover:border-primary">View All Posts &rarr;</a>
            </div>
            <BlogGrid posts={posts} />
          </div>
        </section>

        {/* Email Signup Section */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#111111]">
          <div className="max-w-4xl mx-auto">
            <NewsletterSignup />
          </div>
        </section>


        {/* Destinations Section */}
        <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-foreground px-2 border-l-4 border-primary mb-12 text-center mx-auto inline-block">Top Nomad Destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <DestinationCard name="Kathmandu" description="The bustling cultural and historical heart of Nepal." image="" slug="kathmandu" />
              <DestinationCard name="Pokhara" description="Lakeside calm and gateway to the Annapurna circuit." image="" slug="pokhara" />
              <DestinationCard name="Lalitpur" description="Artisan heritage meets modern expatriate cafes." image="" slug="lalitpur" />
              <DestinationCard name="Chitwan" description="Jungle safaris and warmer sub-tropical living." image="" slug="chitwan" />
            </div>
          </div>
        </section>

        {/* Why Nepal Section */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-foreground text-center mb-16">Why Choose Nepal?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="p-8 border border-border border-t-4 border-t-primary bg-background rounded-xl hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-foreground mb-4">Unbeatable Cost</h3>
                <p className="text-muted-foreground leading-relaxed">Nepal remains one of the most affordable countries in the world. You can find comfortable apartments, eat out daily, and enjoy a vibrant lifestyle for a fraction of the cost of Western cities.</p>
              </div>
              <div className="p-8 border border-border border-t-4 border-t-primary bg-background rounded-xl hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-foreground mb-4">Nature & Mountains</h3>
                <p className="text-muted-foreground leading-relaxed">Escape the screen and step into the Himalayas. Weekends can be spent hiking, trekking, and exploring eight of the world&apos;s highest peaks just a short trip from your desk.</p>
              </div>
              <div className="p-8 border border-border border-t-4 border-t-primary bg-background rounded-xl hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-foreground mb-4">Growing Remote Culture</h3>
                <p className="text-muted-foreground leading-relaxed">With fiber optic internet expanding and new dedicated coworking spaces opening up, Nepal is rapidly adjusting to accommodate the global remote workforce.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0B0B]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Join 2,000+ Nomads</h2>
            <p className="text-[#A0A0A0] text-lg mb-12">Connect with our active community to ask questions, meet up, and share advice.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="#" className="flex flex-col items-center justify-center p-6 bg-[#141414] border border-[#222222] rounded-xl hover:bg-[#1877F2]/10 hover:border-[#1877F2] transition-colors group">
                <MessageCircle size={32} className="text-[#A0A0A0] group-hover:text-[#1877F2] mb-3 transition-colors" />
                <span className="text-white font-medium mt-2">Facebook</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center p-6 bg-[#141414] border border-[#222222] rounded-xl hover:bg-[#E1306C]/10 hover:border-[#E1306C] transition-colors group">
                <Camera size={32} className="text-[#A0A0A0] group-hover:text-[#E1306C] mb-3 transition-colors" />
                <span className="text-white font-medium mt-2">Instagram</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center p-6 bg-[#141414] border border-[#222222] rounded-xl hover:bg-[#FF0000]/10 hover:border-[#FF0000] transition-colors group">
                <Video size={32} className="text-[#A0A0A0] group-hover:text-[#FF0000] mb-3 transition-colors" />
                <span className="text-white font-medium mt-2">YouTube</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center p-6 bg-[#141414] border border-[#222222] rounded-xl hover:bg-[#000000]/10 hover:border-white transition-colors group">
                <MessageSquare size={32} className="text-[#A0A0A0] group-hover:text-white mb-3 transition-colors" />
                <span className="text-white font-medium mt-2">X</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCommunityCTA />
    </>
  )
}
