"use client"
import Link from "next/link"
import { Building, Compass, ShieldCheck, Users, ArrowRight } from "lucide-react"

export default function ServicesSection() {
  const services = [
    {
      title: "Coworking & Work Hubs",
      description: "Discover and book hand-verified workspaces with stable power backup, ergonomic setup, and high-speed fiber internet in major cities.",
      icon: Building,
      href: "/resources/coworking",
      linkText: "Explore Hubs",
      colorClass: "text-green-400 bg-green-500/10 border-green-500/20",
      hoverGlow: "group-hover:shadow-[0_0_20px_rgba(74,222,128,0.15)] group-hover:border-green-400/30"
    },
    {
      title: "Verified Trekking Guides",
      description: "Connect with certified local guides for custom mountain treks, cultural tours, and weekend escapes directly from your remote desk.",
      icon: Compass,
      href: "/guides",
      linkText: "Find a Guide",
      colorClass: "text-primary bg-primary/10 border-primary/20",
      hoverGlow: "group-hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] group-hover:border-primary/30"
    },
    {
      title: "Visa & Legal Support",
      description: "Step-by-step assistance, checklist of required documents, and renewal guides for Nepal's Tourist Visa and Digital Nomad options.",
      icon: ShieldCheck,
      href: "/resources/visa",
      linkText: "Read Visa Guide",
      colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      hoverGlow: "group-hover:shadow-[0_0_20px_rgba(96,165,250,0.15)] group-hover:border-blue-400/30"
    },
    {
      title: "Active Nomad Community",
      description: "Access our forum, location check-ins, group treks, and meetup notifications to plug into a network of global remote workers.",
      icon: Users,
      href: "/community",
      linkText: "Explore Community",
      colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      hoverGlow: "group-hover:shadow-[0_0_20px_rgba(192,132,252,0.15)] group-hover:border-purple-400/30"
    }
  ]

  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold uppercase tracking-wider">
            Our Services
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Tailored Services for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Digital Nomads in Nepal
            </span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            We provide the essential infrastructure, local expert connections, and community networks to help you transition, work, and thrive smoothly in the Himalayas.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon
            return (
              <div 
                key={idx}
                className={`group relative flex flex-col justify-between bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl p-6 transition-all duration-300 ${service.hoverGlow}`}
              >
                <div className="space-y-4">
                  {/* Icon Container */}
                  <div className={`inline-flex items-center justify-center p-3 rounded-xl border ${service.colorClass} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={24} />
                  </div>
                  
                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* CTA Link */}
                <div className="pt-6 mt-4 border-t border-white/5">
                  <Link 
                    href={service.href}
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 group-hover:text-primary transition-colors"
                  >
                    {service.linkText}
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
