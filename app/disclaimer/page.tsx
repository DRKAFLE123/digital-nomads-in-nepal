import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import AffiliateDisclaimer from "@/components/AffiliateDisclaimer"
import { AlertTriangle, ShieldCheck } from "lucide-react"

export const metadata = {
  title: "Legal Disclaimer | Digital Nomads in Nepal",
  description: "Read the legal information and affiliate disclosure guidelines for the Digital Nomads in Nepal portal.",
}

export default function DisclaimerPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
              Legal Info
            </span>
            <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
              Website Disclaimer
            </h1>
            <p className="text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
              Please read this disclaimer carefully before using this community portal.
            </p>
          </div>

          <AffiliateDisclaimer />

          {/* Details */}
          <div className="space-y-8 leading-relaxed text-sm md:text-base text-muted-foreground">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="text-amber-500" size={20} />
                1. General Information Disclaimer
              </h2>
              <p>
                All information on this website (including but not limited to visa rules, cost of living estimates, co-working spaces speed tests, and transport updates) is provided in good faith for general educational and informational purposes only. We make no representations or warranties of any kind regarding the completeness, accuracy, reliability, or availability of any data.
              </p>
              <p>
                <strong>Visa & Legal Status:</strong> Immigration guidelines and visa fees in Nepal can change overnight. While we strive to maintain accurate guides for the year 2026, you must always cross-reference official details with the Nepal Department of Immigration before making travel arrangements.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="text-green-400" size={20} />
                2. Trekking & Outdoors Risk Disclosure
              </h2>
              <p>
                Trekking, hiking, and peak climbing in the Himalayas carries inherent risks including high-altitude pulmonary/cerebral edema (HAPE/HACE), unpredictable weather shifts, landslides, and physical exertion. Any guides listed on this site are vetted local experts, but you choose to trek at your own discretion.
              </p>
              <p>
                We highly recommend that all nomads carry comprehensive travel insurance covering high-altitude helicopter rescue (above 3,000m to 5,000m depending on the route).
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                3. Affiliate Links & Financial Disclosure
              </h2>
              <p>
                Some pages on this portal contain affiliate links to third-party services (such as VPN software, travel insurers, and hotel bookings). This means that if you click on a link and make a purchase, the community volunteers may receive a small commission at no additional cost to you. These earnings go directly toward maintaining the server costs and database hosting of the Digital Nomads in Nepal platform.
              </p>
            </section>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
