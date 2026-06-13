import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer"
import Link from "next/link"

const resources: Record<string, { name: string; desc: string; link?: string }[]> = {
  "SIM Cards": [
    { name: "Ncell", desc: "Best overall coverage and 4G speeds for nomads." },
    { name: "NTC", desc: "Government provider, better in deep remote mountain areas." },
    { name: "Airalo eSIM", desc: "Get connected instantly before you even land in Kathmandu." }
  ],
  "Banking & Money": [
    { name: "Wise", desc: "Incredibly useful for low-fee transfers to local bank accounts." },
    { name: "Revolut", desc: "Great for ATM withdrawals with low exchange fees." },
    { name: "Payoneer", desc: "Alternative for freelancers receiving USD." }
  ],
  "VPNs": [
    { name: "NordVPN", desc: "Fast and reliable, necessary for accessing home bank accounts." },
    { name: "ExpressVPN", desc: "Premium speeds, great for streaming while in Asia." },
    { name: "Surfshark", desc: "Budget friendly with unlimited device connections." }
  ],
  "Accommodation": [
    { name: "Booking.com", desc: "Best for booking your first few nights in Thamel or Lakeside." },
    { name: "Hostelworld", desc: "Ideal for solo nomads looking to socialize." }
  ],
  "Coworking": [
    { name: "Work Around", desc: "Kathmandu's premier modern coworking space." },
    { name: "Bikalpa Art Center", desc: "Community-driven hub in Pulchowk." },
  ],
  "Platform Guides": [
    { name: "List Your Workspace", desc: "Are you a workspace or hub owner? Read our guide on how to register and list your space.", link: "/blog/how-to-list-coworking-space-nepal" },
    { name: "Register as a Local Guide", desc: "Licensed guides and adventure experts, learn how to build your profile here.", link: "/blog/how-to-register-local-guide-nepal" }
  ]
}

export const metadata = {
  title: 'Resources & Tools | Digital Nomads in Nepal',
  description: 'Essential tools, VPNs, banking apps, and coworking spaces for living in Nepal.',
}

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">Essential Tools for Nepal Nomads</h1>
            <p className="text-muted text-lg">Curated resources to make your setup, connectivity, and accommodation seamless.</p>
          </div>
          
          <AffiliateDisclaimer />

          <div className="space-y-16 mt-12">
            {Object.entries(resources).map(([category, items]) => (
              <section key={category}>
                <h2 className="text-2xl font-bold mb-6 border-b border-border pb-3 text-primary">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-card border border-border p-6 rounded-xl hover:border-primary transition-colors flex flex-col">
                      <h3 className="text-xl font-bold text-foreground mb-2">{item.name}</h3>
                      <p className="text-muted text-sm flex-grow mb-6">{item.desc}</p>
                      {item.link ? (
                        <Link
                          href={item.link}
                          className="w-full py-2 bg-background border border-border text-foreground font-medium hover:bg-primary hover:text-black transition-colors rounded-md text-sm uppercase tracking-wider text-center block"
                        >
                          Read Guide
                        </Link>
                      ) : (
                        <button className="w-full py-2 bg-background border border-border text-foreground font-medium hover:bg-primary hover:text-black transition-colors rounded-md text-sm uppercase tracking-wider">
                          Get Deal
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
