import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Wifi, BatteryCharging, Shield, CheckCircle } from "lucide-react"

export const metadata = {
  title: "Internet & Remote Work Setup in Nepal | Digital Nomads",
  description: "Practical guide to setting up high-speed fiber internet, power backups, and working setups for digital nomads in Kathmandu & Pokhara.",
}

export default function SetupPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
              Tech Setup
            </span>
            <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
              Internet & Remote Setup
            </h1>
            <p className="text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
              How to ensure a productive working environment while living in Nepal, dealing with seasonal challenges.
            </p>
          </div>

          {/* Details */}
          <div className="space-y-8 leading-relaxed text-sm md:text-base text-muted-foreground">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Wifi className="text-green-400" size={20} />
                1. Fiber Broadband Providers
              </h2>
              <p>
                Nepal&apos;s internet infrastructure has improved significantly. Most apartments and hotels in Kathmandu and Pokhara use high-speed fiber networks. The two primary ISPs you should ask for are:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm">
                <li><strong>Worldlink:</strong> The largest fiber ISP, generally reliable with strong customer service in Kathmandu and Lakeside Pokhara.</li>
                <li><strong>Vianet:</strong> Popular alternative, known for fast speeds and good pricing packages.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <BatteryCharging className="text-amber-500" size={20} />
                2. Power Cuts & Backups
              </h2>
              <p>
                While &ldquo;load-shedding&rdquo; (planned daily power cuts) has been resolved in major cities, occasional local grid cuts and transformer failures still occur—especially during the monsoon season (June to August).
              </p>
              <p>
                <strong>The Nomad Fix:</strong> When renting an apartment or booking a hostel, verify they have either an **automatic generator backup** or a dedicated **inverter battery system** that powers the Wi-Fi router and wall outlets during cuts. Carrying a high-capacity laptop power bank (e.g. 20,000+ mAh with PD output) is highly recommended.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Shield className="text-purple-400" size={20} />
                3. Remote Working Checklist
              </h2>
              <p>
                To work seamlessly from anywhere in Nepal, configure this setup:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-card border border-border rounded-xl flex items-start gap-3">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-xs">Dual SIM: Buy both Ncell (fastest) and NTC (coverage) SIM cards for redundancy.</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-xl flex items-start gap-3">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-xs">VPN: Have a reliable VPN installed to bypass geolocation blocks on home bank accounts.</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-xl flex items-start gap-3">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-xs">UPS for Router: Buy a cheap mini-UPS (approx $15) locally to keep your router running during power flips.</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-xl flex items-start gap-3">
                  <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-xs">Local QR Payments: Link your international credit card to payments apps where possible, or carry cash.</p>
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
