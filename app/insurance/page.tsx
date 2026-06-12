import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Check, Heart, ShieldAlert, Sparkles } from "lucide-react"

export const metadata = {
  title: "Nomad Travel Insurance for Nepal | High-Altitude Rescue Coverage",
  description: "Get the best travel and health insurance recommendations for digital nomads in Nepal, with high-altitude helicopter rescue coverage.",
}

export default function InsurancePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
              Stay Protected
            </span>
            <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
              Nomad Travel Insurance
            </h1>
            <p className="text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
              Crucial insurance guidelines for remote workers staying in Nepal, including trekking emergency requirements.
            </p>
          </div>

          {/* Alert Box */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 md:p-8 flex items-start gap-4">
            <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={24} />
            <div className="space-y-2">
              <h3 className="font-bold text-foreground text-sm">CRITICAL: High-Altitude Helicopter Rescue</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Standard travel insurance policies often do **not** cover medical emergencies or helicopter evacuations above 3,000 meters (approx. 9,840 feet). If you plan to trek popular routes like Everest Base Camp or the Annapurna Circuit, you must ensure your policy specifically covers evacuations up to 5,000+ meters.
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8 leading-relaxed text-sm md:text-base text-muted-foreground">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Recommended Nomad Insurers</h2>
              <p>
                Two main insurance providers cater specifically to remote workers and location-independent professionals in Nepal:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-6 bg-card border border-border rounded-2xl space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                      SafetyWing <Sparkles className="text-primary" size={16} />
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                      Affordable subscription-style travel medical insurance. Highly flexible; you can purchase it even if you have already left your home country.
                    </p>
                    <ul className="text-xs space-y-1.5 mt-4">
                      <li className="flex items-center gap-1.5"><Check className="text-green-500" size={13} /> Covers motorbikes (standard license)</li>
                      <li className="flex items-center gap-1.5"><Check className="text-green-500" size={13} /> Includes COVID-19 coverage</li>
                      <li className="flex items-center gap-1.5"><Check className="text-green-500" size={13} /> Great for Pokhara lakeside stay</li>
                    </ul>
                  </div>
                  <a
                    href="https://safetywing.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-accent hover:bg-primary hover:text-black transition-colors text-foreground text-center font-bold rounded-xl py-2.5 text-xs mt-6 inline-block"
                  >
                    Visit SafetyWing
                  </a>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                      World Nomads <Heart className="text-rose-400" size={16} />
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                      Premium coverage for active travelers. Offers an Explorer Plan that includes high-altitude trekking evacuation and coverage for adventure sports.
                    </p>
                    <ul className="text-xs space-y-1.5 mt-4">
                      <li className="flex items-center gap-1.5"><Check className="text-green-500" size={13} /> Covers trekking up to 6,000 meters</li>
                      <li className="flex items-center gap-1.5"><Check className="text-green-500" size={13} /> High-altitude rescue included</li>
                      <li className="flex items-center gap-1.5"><Check className="text-green-500" size={13} /> Gear theft protection (laptops, cameras)</li>
                    </ul>
                  </div>
                  <a
                    href="https://worldnomads.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-accent hover:bg-primary hover:text-black transition-colors text-foreground text-center font-bold rounded-xl py-2.5 text-xs mt-6 inline-block"
                  >
                    Visit World Nomads
                  </a>
                </div>
              </div>
            </section>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
