import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ShieldCheck, Heart, Sparkles, Compass } from "lucide-react"

export const metadata = {
  title: "About Us | Digital Nomads in Nepal",
  description: "Learn about the mission, values, and community volunteers behind the definitive digital nomad portal in Nepal.",
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
              Our Mission
            </span>
            <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
              About Digital Nomads in Nepal
            </h1>
            <p className="text-muted-foreground text-lg mt-3 max-w-2xl mx-auto">
              Connecting remote workers with the roof of the world, fostering a sustainable local tourism ecosystem.
            </p>
          </div>

          {/* Main Story Content */}
          <div className="space-y-10 leading-relaxed text-sm md:text-base text-muted-foreground">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Why We Started</h2>
              <p>
                Nepal has always been a dream destination for trekkers, adventurers, and spiritual seekers. But as global remote work exploded, we noticed a new generation of visitors: developers, designers, writers, and digital entrepreneurs who wanted to stay longer, work productively, and immerse themselves in the local culture.
              </p>
              <p>
                However, setting up as a remote worker in Nepal presented unique challenges—finding stable fiber internet, securing power backup during seasonal cuts, understanding visa renewals, and finding verified local guides. We founded <strong>Digital Nomads in Nepal</strong> in 2026 to solve these exact hurdles.
              </p>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-6 bg-card border border-border rounded-2xl space-y-3">
                <Compass className="text-primary" size={24} />
                <h3 className="font-bold text-foreground">Reliable Vetted Data</h3>
                <p className="text-xs">
                  We verify internet speeds, power backups, and prices of coworking hubs first-hand, protecting nomads from unexpected connection dropouts.
                </p>
              </div>
              <div className="p-6 bg-card border border-border rounded-2xl space-y-3">
                <Heart className="text-rose-400" size={24} />
                <h3 className="font-bold text-foreground">Supporting Local Communities</h3>
                <p className="text-xs">
                  We support local guides and operators directly, connecting nomads with local experts without high-commission travel intermediaries.
                </p>
              </div>
              <div className="p-6 bg-card border border-border rounded-2xl space-y-3">
                <ShieldCheck className="text-green-400" size={24} />
                <h3 className="font-bold text-foreground">Privacy-Safe Sharing</h3>
                <p className="text-xs">
                  Our coworking check-in dashboard shares working locations securely using first-names and flags only, preserving member privacy.
                </p>
              </div>
              <div className="p-6 bg-card border border-border rounded-2xl space-y-3">
                <Sparkles className="text-purple-400" size={24} />
                <h3 className="font-bold text-foreground">High-Altitude Trek Safely</h3>
                <p className="text-xs">
                  We provide expert checklists for high-altitude acclimatization, flight bookings, and travel insurance coverage requirements.
                </p>
              </div>
            </section>

            <section className="space-y-4 pt-4">
              <h2 className="text-2xl font-bold text-foreground">A Community-Led Initiative</h2>
              <p>
                This platform is built and maintained by a global network of digital nomad volunteers and local Nepalese coordinators who love remote work and the Himalayas.
              </p>
              <p>
                Whether you are working from a cafe in Pokhara Lakeside, a coworking hub in Kathmandu, or taking a week-long trek in the Annapurna range, we are here to support your remote journey in Nepal.
              </p>
            </section>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
