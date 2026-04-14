import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events | Digital Nomads in Nepal",
  description: "Community events, meetups, workshops, and day trips for digital nomads in Nepal. Join fellow remote workers in Kathmandu and Pokhara.",
}

type Event = {
  id: number
  month: string
  day: number
  title: string
  time: string
  location: string
  price: "FREE" | string
  status: "upcoming" | "past"
  category: string
  online?: boolean
}

const events: Event[] = [
  {
    id: 1,
    month: "APR",
    day: 20,
    title: "DigiNomads Nepal — Monthly Meetup",
    time: "6:00 PM – 9:00 PM",
    location: "Jhamsikhel Co-work, Lalitpur, Kathmandu",
    price: "FREE",
    status: "past",
    category: "Meetup",
  },
  {
    id: 2,
    month: "APR",
    day: 27,
    title: "Remote Work Tools Workshop — AI, Async & Automation",
    time: "11:00 AM – 12:30 PM",
    location: "Online",
    price: "FREE",
    status: "past",
    category: "Workshop",
    online: true,
  },
  {
    id: 3,
    month: "MAY",
    day: 4,
    title: "Kathmandu Valley Day Trip — Nagarkot Sunrise & Bhaktapur",
    time: "5:00 AM – 2:00 PM",
    location: "Thamel (meeting point — Pumpernickel Bakery), Kathmandu",
    price: "FREE",
    status: "past",
    category: "Day Trip",
  },
  {
    id: 4,
    month: "MAY",
    day: 18,
    title: "Coworking Crawl — Explore the Best Spaces in Kathmandu",
    time: "10:00 AM – 4:00 PM",
    location: "Various — Kathmandu",
    price: "FREE",
    status: "upcoming",
    category: "Meetup",
  },
  {
    id: 5,
    month: "JUN",
    day: 7,
    title: "Pokhara Nomad Retreat Weekend",
    time: "Fri – Sun, All Day",
    location: "Lakeside, Pokhara",
    price: "NPR 3,500",
    status: "upcoming",
    category: "Retreat",
  },
  {
    id: 6,
    month: "JUN",
    day: 21,
    title: "Nepal Visa & Legal Setup for Digital Nomads — Online AMA",
    time: "7:00 PM – 8:30 PM",
    location: "Online",
    price: "FREE",
    status: "upcoming",
    category: "Workshop",
    online: true,
  },
]

const categoryColors: Record<string, string> = {
  Meetup: "bg-teal-600",
  Workshop: "bg-indigo-600",
  "Day Trip": "bg-amber-600",
  Retreat: "bg-rose-600",
}

export default function EventsPage() {
  const upcoming = events.filter((e) => e.status === "upcoming")
  const past = events.filter((e) => e.status === "past")

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted mb-10" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>›</span>
            <span className="text-foreground font-medium">Events</span>
          </nav>

          {/* Page Header */}
          <div className="mb-14">
            <span className="uppercase text-primary text-xs font-bold tracking-[0.2em] mb-4 block">
              Community Events
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-foreground leading-tight mb-5">
              Meet fellow nomads in Nepal
            </h1>
            <p className="text-muted text-lg max-w-xl leading-relaxed">
              Monthly meetups, skills workshops, co-working days, and social events across Nepal.
            </p>
          </div>

          {/* Upcoming Events */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              Upcoming events
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                {upcoming.length} events
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>

          {/* Past Events */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-8">Past events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>

          {/* Host CTA */}
          <div className="mt-20 border border-border rounded-2xl p-8 md:p-12 text-center bg-card">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Want to host an event?
            </h2>
            <p className="text-muted max-w-md mx-auto mb-8">
              We help digital nomads run meetups, workshops, and retreats across Nepal. Get in touch and we'll help you organize it.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-primary text-black font-bold rounded-full hover:bg-white hover:text-black transition-all"
            >
              Submit Your Event →
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}

function EventCard({ event }: { event: Event }) {
  const dateColor = categoryColors[event.category] ?? "bg-teal-600"

  return (
    <article className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group">
      {/* Date Block */}
      <div className={`${dateColor} relative px-6 py-5 flex flex-col items-center text-white`}>
        <span className="text-sm font-semibold tracking-widest uppercase opacity-90">{event.month}</span>
        <span className="text-5xl font-black leading-none mt-1">{event.day}</span>
        {/* Status Badge */}
        <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${event.status === "past" ? "bg-black/40 text-white/70" : "bg-white/20 text-white"}`}>
          {event.status === "past" ? "Past" : "Upcoming"}
        </span>
      </div>

      {/* Details */}
      <div className="p-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 block">{event.category}</span>
        <h3 className="text-foreground font-bold text-base leading-snug mb-4 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        <div className="space-y-2 text-sm text-muted">
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            {event.time}
          </div>
          <div className="flex items-start gap-2">
            <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span>{event.location}</span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-primary font-bold text-sm">{event.price}</span>
          <Link href={`/events/${event.id}`} className="text-xs font-semibold text-muted hover:text-primary transition-colors">
            Details →
          </Link>
        </div>
      </div>
    </article>
  )
}
