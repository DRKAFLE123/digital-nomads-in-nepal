import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Terms of Service | Digital Nomads in Nepal",
  description: "Read the rules of engagement, discussion forum policies, and workspace booking terms for our community.",
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
              Agreement
            </span>
            <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
              Terms of Service
            </h1>
            <p className="text-muted-foreground text-sm mt-3">
              Last Updated: June 12, 2026
            </p>
          </div>

          {/* Details */}
          <div className="space-y-8 leading-relaxed text-sm md:text-base text-muted-foreground">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By registering for an account, checking in to workspaces, booking tables, or posting messages in the community forum, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use this portal.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Code of Conduct</h2>
              <p>
                Digital Nomads in Nepal is a welcoming community of location-independent professionals from all backgrounds. We enforce a zero-tolerance policy for harassment, hate speech, spam, and commercial advertising in non-designated areas.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm">
                <li>Be respectful of local Nepalese customs, cultures, and guidelines.</li>
                <li>Do not scrape the member directory or spam members with unsolicited business pitches.</li>
                <li>Avoid publishing malicious links or pirated streaming guides.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Member Registrations & Security</h2>
              <p>
                You are responsible for safeguarding the credentials of your account. You agree to provide accurate information when registering (such as actual work type, country of origin, and profile details). We reserve the right to suspend or terminate accounts that use fake names, emails, or spam bios.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Coworking Space Bookings</h2>
              <p>
                Our portal allows you to pre-book hot desks or monthly packages at partnered hubs in Kathmandu and Pokhara. We act as a booking facilitator. The actual contract for workspace usage, amenities, power backup, and refunds is directly between you and the coworking space operator.
              </p>
            </section>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
