import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import NewsletterSignup from "@/components/NewsletterSignup"
import { Send, Sparkles, ShieldCheck, Mail } from "lucide-react"

export const metadata = {
  title: "Join the Newsletter | Digital Nomads in Nepal",
  description: "Subscribe to the Nepal Digital Nomad Starter Kit and receive weekly cost breakdowns, visa guides, and meetup invites.",
}

export default function NewsletterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 pb-24 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
              Stay Connected
            </span>
            <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
              Nomad Newsletter Sign Up
            </h1>
            <p className="text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
              Get the Nepal Digital Nomad Starter Kit delivered directly to your inbox. Weekly updates on the ecosystem, guides, and meetups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-card border border-border rounded-3xl p-6 md:p-10 shadow-2xl">
            {/* Left side: Newsletter signup component */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Mail className="text-primary" size={20} />
                Subscribe Now
              </h2>
              <NewsletterSignup />
            </div>

            {/* Right side: Benefits lists */}
            <div className="space-y-4 md:pl-6 border-t md:border-t-0 md:border-l border-border/60 pt-6 md:pt-0">
              <h3 className="font-bold text-foreground text-sm">What you&apos;ll receive:</h3>
              
              <ul className="space-y-3 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ShieldCheck className="text-green-500 shrink-0 mt-0.5" size={14} />
                  <span>Cost of Living changes, coworking discounts, and SIM data promotions in Kathmandu and Pokhara.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="text-primary shrink-0 mt-0.5" size={14} />
                  <span>Direct email alerts for weekend trekking invitations, social meetups, and local workshops.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Send className="text-purple-400 shrink-0 mt-0.5" size={14} />
                  <span>Updates on digital nomad visa policies and Department of Immigration online renewal guidelines.</span>
                </li>
              </ul>

              <p className="text-[10px] text-gray-500 pt-2 leading-relaxed">
                * We hate spam as much as you do. You can unsubscribe in a single click at any time. Your email is fully secure.
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
