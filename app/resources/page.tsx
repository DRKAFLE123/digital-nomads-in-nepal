import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer"

const resources = {
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
      <main className="min-h-screen bg-[#0B0B0B] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Essential Tools for Nepal Nomads</h1>
            <p className="text-[#A0A0A0] text-lg">Curated resources to make your setup, connectivity, and accommodation seamless.</p>
          </div>
          
          <AffiliateDisclaimer />

          <div className="space-y-16 mt-12">
            {Object.entries(resources).map(([category, items]) => (
              <section key={category}>
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#222222] pb-3 text-[#FFD700]">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-[#141414] border border-[#222222] p-6 rounded-xl hover:border-[#FFD700] transition-colors flex flex-col">
                      <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                      <p className="text-[#A0A0A0] text-sm flex-grow mb-6">{item.desc}</p>
                      <button className="w-full py-2 bg-[#222222] text-[#A0A0A0] font-medium hover:bg-[#FFD700] hover:text-black transition-colors rounded-md text-sm uppercase tracking-wider">
                        Get Deal
                      </button>
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
