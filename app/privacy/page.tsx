import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Privacy Policy | Digital Nomads in Nepal",
  description: "Learn how we handle your registration details, community forum profile, and workspace check-in privacy.",
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
              Privacy First
            </span>
            <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-sm mt-3">
              Last Updated: June 12, 2026
            </p>
          </div>

          {/* Details */}
          <div className="space-y-8 leading-relaxed text-sm md:text-base text-muted-foreground">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">1. Information We Collect</h2>
              <p>
                When you sign up for our community portal, we collect details to help you connect with others, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm">
                <li><strong>Registration Details:</strong> Your full name, email address, password hash, and origin country.</li>
                <li><strong>Nomad Profile:</strong> Optional current city in Nepal, work type (e.g. Developer, Designer), brief bio, and links to LinkedIn or Twitter.</li>
                <li><strong>Check-In Status:</strong> The specific workspace/coworking hub where you are checked in.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">2. Privacy-Safe Coworking Check-Ins</h2>
              <p>
                To help nomads meet up without exposing sensitive personal locations:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm">
                <li>Our public &ldquo;Active Check-Ins&rdquo; feed only displays your **first name** and **country flag** (e.g., &ldquo;John 🇩🇪 is working at Nomad Hub Lakeside&rdquo;).</li>
                <li>We do not publish your full last name or email address publicly in the check-ins section.</li>
                <li>You can check out of any hub at any time, which instantly removes your pin from the active check-in widget.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">3. Profile Visibility Controls</h2>
              <p>
                By default, your profile is listed in the **Nomad Directory** to let other remote workers message or connect with you. If you would like to make your profile private, hide it from the public directory, or delete your registration completely, please contact support or update your settings in the member dashboard.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">4. Email Alerts & Notifications</h2>
              <p>
                If you opt into our email alerts, we will send you updates on community events, spontaneous treks, and new workspace openings. You can unsubscribe at any time using the link in the footer of our emails or by toggling settings in your community dashboard. We never sell or share your email address with third-party advertisers.
              </p>
            </section>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
