import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import TrekkingGuideIcon from "@/components/TrekkingGuideIcon"
import { 
  Landmark, Wallet, 
  ArrowLeft, HelpCircle, Check, AlertTriangle, Car 
} from "lucide-react"

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const titles: Record<string, string> = {
    "visa": "Nepal Digital Nomad Visa & Extensions Guide (2026)",
    "cost-of-living": "Cost of Living in Nepal for Remote Workers (2026 Budget)",
    "coworking": "Best Coworking Spaces in Kathmandu & Pokhara (Vetted)",
    "connectivity": "SIM Cards, Internet & Connectivity in Nepal for Nomads",
    "sim-cards": "SIM Cards, Internet & Connectivity in Nepal for Nomads",
    "transportation": "Transportation Guide: Pathao, InDrive & Flights in Nepal",
    "banking": "Banking, Money, ATMs & Payments in Nepal Guide",
  }

  const slug = params.slug.toLowerCase()
  const title = titles[slug] || "Nomad Resources Guide"

  return {
    title: `${title} | Digital Nomads in Nepal`,
    description: `Expert guide and survival checklist for digital nomads setting up in Nepal in 2026.`,
  }
}

export default function ResourceSlugPage({ params }: { params: { slug: string } }) {
  const slug = params.slug.toLowerCase()

  // Handle both slugs for SIM Card setup
  const normalizedSlug = slug === "sim-cards" ? "connectivity" : slug

  const validSlugs = ["visa", "cost-of-living", "coworking", "connectivity", "transportation", "banking"]
  if (!validSlugs.includes(normalizedSlug)) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <div className="mb-10">
            <Link href="/resources" className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-xs font-bold uppercase tracking-wider">
              <ArrowLeft size={14} /> Back to Resources
            </Link>
          </div>

          {/* DYNAMIC CONTENT SWITCH */}

          {/* 1. VISA GUIDE */}
          {normalizedSlug === "visa" && (
            <article className="space-y-10">
              <div className="border-b border-border pb-8">
                <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">Legal Status</span>
                <h1 className="text-4xl sm:text-5xl font-black text-foreground mt-4 leading-tight">
                  Nepal Digital Nomad Visa & Extensions (2026)
                </h1>
                <p className="text-muted text-lg mt-3">
                  A comprehensive guide to staying legally as a remote worker or freelancer in Nepal.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
                <h2 className="text-2xl font-bold text-foreground">The Current Framework</h2>
                <p className="text-muted leading-relaxed">
                  Nepal does not yet have a single designated &ldquo;Nomad Visa&rdquo; stamp, but handles remote workers using a combination of **Tourist Visas** and **Tourist Visa Extensions**, allowing you to legally live in the country for up to **150 days per calendar year**.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 bg-background border border-border rounded-xl">
                    <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                      <Check className="text-green-500" size={16} /> 1. Entry Visa
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      Obtain a 15, 30, or 90-day tourist visa on arrival at Tribhuvan International Airport (Kathmandu) or land borders. Fees are $30, $50, or $125 respectively (Cash USD/major currencies).
                    </p>
                  </div>
                  <div className="p-5 bg-background border border-border rounded-xl">
                    <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                      <Check className="text-green-500" size={16} /> 2. Extensions
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      Extend online via the Department of Immigration portal and pick up the sticker at Kathmandu (Kalikasthan) or Pokhara offices. Costs $3 per day (minimum 15 days).
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Step-by-Step Extension Process</h2>
                <div className="space-y-4">
                  {[
                    { step: "01", title: "Apply Online", text: "Go to the Nepal Immigration Online portal, select 'Visa Extension' and fill in your passport details and address." },
                    { step: "02", title: "Print Confirmation", text: "Download and print the generated application receipt PDF form and note the total calculation fee." },
                    { step: "03", title: "Visit Department of Immigration", text: "Visit either the Kathmandu office (Kalikasthan) or the Pokhara office (Lakeside). Bring your passport, printout receipt, and exact cash in NPR." },
                    { step: "04", title: "Collect Passport", text: "Submit your details at the counters. They will print your extension sticker directly on your passport in about 1-2 hours." }
                  ].map((s, i) => (
                    <div key={i} className="flex gap-4 p-5 bg-card border border-border rounded-xl">
                      <div className="text-2xl font-black text-primary font-mono">{s.step}</div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm mb-1">{s.title}</h4>
                        <p className="text-muted text-xs leading-relaxed">{s.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex gap-3 text-amber-500">
                <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
                <p className="text-xs leading-relaxed">
                  <strong>Important Note:</strong> Overstaying your tourist visa in Nepal is subject to severe daily fines ($5 per day of overstay + standard extension fees) and potential entry bans. Always apply for extensions at least 5-7 days before expiry.
                </p>
              </div>
            </article>
          )}

          {/* 2. COST OF LIVING */}
          {normalizedSlug === "cost-of-living" && (
            <article className="space-y-10">
              <div className="border-b border-border pb-8">
                <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">Budgeting</span>
                <h1 className="text-4xl sm:text-5xl font-black text-foreground mt-4 leading-tight">
                  Cost of Living in Nepal for Remote Workers (2026)
                </h1>
                <p className="text-muted text-lg mt-3">
                  Monthly budget breakdowns comparing Kathmandu and Pokhara for location-independent travelers.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl font-bold text-foreground mb-6">Estimated Monthly Budgets</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-background">
                        <th className="p-4 font-bold text-foreground">Expense Category</th>
                        <th className="p-4 font-bold text-foreground">Kathmandu (Mid-range)</th>
                        <th className="p-4 font-bold text-foreground">Pokhara (Lakeside)</th>
                        <th className="p-4 font-bold text-foreground">Bandipur (Local stay)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {[
                        { cat: "1-Bed Furnished Apartment / Airbnb", ktm: "$300 - $500", pok: "$250 - $400", ban: "$180 - $280" },
                        { cat: "Coworking Space Membership", ktm: "$80 - $120", pok: "$60 - $90", ban: "N/A (Cafe work)" },
                        { cat: "Eating Out (Cafes & Local eateries)", ktm: "$180 - $280", pok: "$150 - $220", ban: "$100 - $150" },
                        { cat: "Transport (Pathao, local taxi)", ktm: "$40 - $60", pok: "$20 - $40", ban: "$10 - $20" },
                        { cat: "SIM Card & Fiber Internet", ktm: "$15 - $25", pok: "$15 - $25", ban: "$15 - $20" },
                        { cat: "Coffee, gym, and entertainment", ktm: "$60 - $90", pok: "$50 - $80", ban: "$20 - $40" },
                        { cat: "Total Estimated Budget", ktm: "$675 - $1,075/mo", pok: "$545 - $855/mo", ban: "$325 - $510/mo" }
                      ].map((row, i) => (
                        <tr key={i} className={i === 6 ? "font-black bg-primary/5 text-primary" : "text-muted"}>
                          <td className="p-4 text-foreground font-semibold">{row.cat}</td>
                          <td className="p-4">{row.ktm}</td>
                          <td className="p-4">{row.pok}</td>
                          <td className="p-4">{row.ban}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="font-bold text-foreground text-lg">Money-Saving Survival Tips</h3>
                <ul className="space-y-3 text-sm text-muted">
                  <li className="leading-relaxed"><strong>🍜 Eat Local:</strong> Enjoy plates of momos ($1.50) or traditional Dal Bhat ($2.50) which features unlimited refills of rice, lentils, and curry!</li>
                  <li className="leading-relaxed"><strong>🏍️ Bike Ridehails:</strong> Moto-taxis on Pathao or InDrive cost a fraction of cars, and bypass congested Kathmandu traffic.</li>
                  <li className="leading-relaxed"><strong>🏠 Rent Monthly:</strong> Ask hosts directly on Airbnb for monthly discount margins (often 30-50% off standard nightly pricing).</li>
                </ul>
              </div>
            </article>
          )}

          {/* 3. COWORKING SPACES */}
          {normalizedSlug === "coworking" && (
            <article className="space-y-10">
              <div className="border-b border-border pb-8">
                <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">Workspaces</span>
                <h1 className="text-4xl sm:text-5xl font-black text-foreground mt-4 leading-tight">
                  Best Coworking Spaces in Nepal
                </h1>
                <p className="text-muted text-lg mt-3">
                  Nomad-vetted workspaces in Kathmandu and Pokhara tested for speed, backup generators, and community events.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl font-bold text-foreground mb-6">Top Recommended Coworking Hubs</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-background">
                        <th className="p-4 font-bold text-foreground">Space Name</th>
                        <th className="p-4 font-bold text-foreground">Location</th>
                        <th className="p-4 font-bold text-foreground">Internet Speed</th>
                        <th className="p-4 font-bold text-foreground">Power Backup</th>
                        <th className="p-4 font-bold text-foreground">Monthly Fee</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-muted">
                      {[
                        { name: "Work Around", loc: "Lalitpur (KTM)", speed: "150 Mbps", power: "Generator (Instant)", fee: "$100" },
                        { name: "Impact Hub", loc: "Sanepa (KTM)", speed: "100 Mbps", power: "Inverter & Solar", fee: "$110" },
                        { name: "Nomad Hub", loc: "Lakeside (Pokhara)", speed: "80 Mbps", power: "Solar/Battery Backup", fee: "$75" },
                        { name: "Bikalpa Art Center", loc: "Pulchowk (KTM)", speed: "100 Mbps", power: "Inverter Backup", fee: "$85" },
                        { name: "Workation Pokhara", loc: "Lakeside (Pokhara)", speed: "70 Mbps", power: "Battery Backup", fee: "$70" }
                      ].map((space, i) => (
                        <tr key={i} className="hover:bg-card/50">
                          <td className="p-4 text-foreground font-semibold">{space.name}</td>
                          <td className="p-4">{space.loc}</td>
                          <td className="p-4">{space.speed}</td>
                          <td className="p-4 font-semibold text-green-500">{space.power}</td>
                          <td className="p-4 font-bold text-primary">{space.fee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-5">
                  <h4 className="font-bold text-foreground mb-2">Cafe Working Etiquette</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Most modern cafes in Lalitpur and Lakeside welcome laptop workers. Standard courtesy is to purchase a coffee or meal every 2-3 hours. Look for cafes displaying &ldquo;WiFi&rdquo; signs on their entry doors.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-5">
                  <h4 className="font-bold text-foreground mb-2">Power Outages & Load-shedding</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Load-shedding is mostly a thing of the past in modern Nepal, but temporary maintenance power outages still occur. Vetted spaces guarantee battery/generator swap latency of under 5 seconds.
                  </p>
                </div>
              </div>
            </article>
          )}

          {/* 4. SIM CARDS & CONNECTIVITY */}
          {normalizedSlug === "connectivity" && (
            <article className="space-y-10">
              <div className="border-b border-border pb-8">
                <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">Connectivity</span>
                <h1 className="text-4xl sm:text-5xl font-black text-foreground mt-4 leading-tight">
                  SIM Cards, Internet & Mobile Data Setup
                </h1>
                <p className="text-muted text-lg mt-3">
                  How to acquire SIM cards, configuration settings, and stay connected anywhere in Nepal.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
                <h2 className="text-xl font-bold text-foreground">Getting a Local SIM Card</h2>
                <p className="text-muted leading-relaxed text-sm">
                  We highly recommend getting a local physical SIM card as soon as you arrive. You can purchase them at Kathmandu airport or small telecom kiosks on the street.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-background border border-border rounded-xl">
                    <div className="w-12 h-12 bg-red-600/10 text-red-600 rounded-lg flex items-center justify-center font-black">Ncell</div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">Ncell (Axiata Group)</h4>
                      <p className="text-xs text-muted leading-relaxed">Best speed and LTE coverage in major cities (Kathmandu, Pokhara, Lalitpur). Highly active promo packages on their Ncell App (e.g. 20GB for 700 NPR).</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 bg-background border border-border rounded-xl">
                    <div className="w-12 h-12 bg-blue-600/10 text-blue-600 rounded-lg flex items-center justify-center font-black">NTC</div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">Nepal Telecom (NTC)</h4>
                      <p className="text-xs text-muted leading-relaxed">Government-owned network. Best penetration in high-altitude mountain trekking zones (Annapurna, Everest trails) where Ncell might lose signal.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="font-bold text-foreground">Documents Required for Purchase</h3>
                <p className="text-muted text-sm leading-relaxed">
                  Due to government telecom security regulations, you must present the following at the kiosk to get a SIM:
                </p>
                <ul className="list-disc pl-5 text-xs text-muted space-y-2 leading-relaxed">
                  <li>Original physical Passport (with valid entry visa stamp).</li>
                  <li>One paper photocopy of your Passport photo page.</li>
                  <li>One passport-size printed photo (kiosks have cameras but physical is preferred).</li>
                  <li>Your fingerprint scan (taken directly on-site).</li>
                </ul>
              </div>
            </article>
          )}

          {/* 5. TRANSPORTATION */}
          {normalizedSlug === "transportation" && (
            <article className="space-y-10">
              <div className="border-b border-border pb-8">
                <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">Transportation</span>
                <h1 className="text-4xl sm:text-5xl font-black text-foreground mt-4 leading-tight">
                  Navigating Nepal: Ride-Sharing & Domestic Travel
                </h1>
                <p className="text-muted text-lg mt-3">
                  Essential apps, safety protocols, flight booking, and navigating traffic successfully.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-lg mb-2 flex items-center gap-2">
                      <Car className="text-primary" size={20} /> Pathao App
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mb-4">
                      The undisputed king of motorbike ride-sharing in Kathmandu. Allows you to book cheap, quick motorbike rides to slice through heavy city gridlocks. Also offers standard taxis.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-primary">Download on Google Play / App Store</span>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-lg mb-2 flex items-center gap-2">
                      <Car className="text-primary" size={20} /> InDrive App
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mb-4">
                      Very popular alternative. InDrive allows you to bargain / negotiate the fare directly with drivers before booking. Cash-based payment is standard.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-primary">Negotiable pricing model</span>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="font-bold text-foreground text-lg">Domestic Flights & Buses</h3>
                <p className="text-sm text-muted leading-relaxed">
                  Traveling between cities like Kathmandu and Pokhara is best done by air to avoid bumpy 6-9 hour road journeys.
                </p>
                <ul className="space-y-3 text-xs text-muted">
                  <li className="leading-relaxed"><strong>✈️ Domestic Air Travel:</strong> Yeti Airlines and Buddha Air offer multiple daily flights between KTM and PKR ($90-$120, 25-minute flight).</li>
                  <li className="leading-relaxed"><strong>🚌 Tourist Buses:</strong> Sofa-seat tourist buses (like Jagadamba or Baba Adventure) depart daily at 7:00 AM from Kathmandu ($15-$25).</li>
                </ul>
              </div>
            </article>
          )}

          {/* 6. BANKING & PAYMENTS */}
          {normalizedSlug === "banking" && (
            <article className="space-y-10">
              <div className="border-b border-border pb-8">
                <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">Finance</span>
                <h1 className="text-4xl sm:text-5xl font-black text-foreground mt-4 leading-tight">
                  Banking, ATM Cash & Digital QR Payments
                </h1>
                <p className="text-muted text-lg mt-3">
                  Guide to card acceptance, cash withdrawals, transaction fees, and mobile wallet apps.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
                <h2 className="text-xl font-bold text-foreground">Cash Dependency in Nepal</h2>
                <p className="text-muted leading-relaxed text-sm">
                  Nepal remains heavily cash-reliant, though QR codes are expanding rapidly. Cards (Visa/Mastercard) are accepted in upscale tourist hotels, cafes, and supermarkets, but local grocery stores, taxis, and small eateries require cash.
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-background border border-border rounded-xl">
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                      <Landmark className="text-primary" size={16} /> Best ATMs for Foreign Cards
                    </h4>
                    <p className="text-xs text-muted leading-relaxed mt-1">
                      Nabil Bank, Standard Chartered, and Himalayan Bank are the most reliable. They permit withdrawals of up to 35,000 NPR per transaction. Expect a local terminal card fee of 500 NPR ($3.80) per withdrawal.
                    </p>
                  </div>
                  <div className="p-4 bg-background border border-border rounded-xl">
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                      <Wallet className="text-primary" size={16} /> Local Mobile Wallets (eSewa / Khalti)
                    </h4>
                    <p className="text-xs text-muted leading-relaxed mt-1">
                      The primary digital payment option. Every vendor has a Fonepay QR code. While foreign tourists cannot easily link foreign cards to eSewa, some exchange shops can help load cash into your wallet balance.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-blue-500/10 border border-blue-500/30 rounded-xl flex gap-3 text-blue-500">
                <HelpCircle className="flex-shrink-0 mt-0.5" size={18} />
                <p className="text-xs leading-relaxed">
                  <strong>Wise / Revolut Tip:</strong> Always alert your bank about travel to Nepal before arrival, as many security systems automatically flag card transactions in Nepal as potential fraud.
                </p>
              </div>
            </article>
          )}

          {/* Connect with a local guide bottom banner */}
          <div className="mt-16 bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-black text-foreground flex items-center justify-center md:justify-start gap-2">
                Need customized expert help? <TrekkingGuideIcon size={18} />
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                Book a consultation with our verified local experts for personalized tips.
              </p>
            </div>
            <Link href="/guides" className="px-6 py-3 bg-primary hover:bg-primary/95 text-black font-black rounded-full transition-all whitespace-nowrap text-sm shadow-md">
              Connect with a Guide
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
