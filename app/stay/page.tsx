/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ArrowRight, ShieldCheck, MapPin, Building } from "lucide-react"
import { ACCOMMODATIONS } from "@/lib/accommodations"
import InternalLinkingEngine from "@/components/InternalLinkingEngine"

export default function StayPage() {
  const [selectedType, setSelectedType] = useState<string>("All")

  const filteredStays = ACCOMMODATIONS.filter(stay => {
    if (selectedType === "All") return true
    return stay.type.toLowerCase() === selectedType.toLowerCase()
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Top Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground font-semibold">Stay &amp; Work</span>
          </nav>

          {/* Hero Section */}
          <div className="bg-card border border-border rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
            <div className="max-w-3xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest">
                <Building size={13} /> Stay &amp; Work • Nomad Accommodations
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                Stay &amp; Work in Nepal — Vetted Nomad Stays
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                Work-friendly hotels, coliving spaces, hostels, and serviced apartments across Nepal equipped with high-speed fiber internet, dedicated desks, and power backup.
              </p>
              <div className="pt-2 flex items-center justify-center">
                <Link
                  href="/resources/coworking"
                  className="px-5 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-black border border-primary/40 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95"
                >
                  <Building size={14} />
                  Looking for Coworking Desks &amp; Workspaces? Explore Marketplace ➔
                </Link>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2">
            {["All", "Hotels", "Hostels", "Coliving", "Long-Term Stays"].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                  selectedType.toLowerCase() === type.toLowerCase()
                    ? "bg-primary text-black border-primary shadow-md shadow-primary/20"
                    : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {type}
              </button>
            ))}
            <Link
              href="/resources/coworking"
              className="px-4 py-2 rounded-xl text-xs font-black transition-all border bg-primary/10 border-primary/40 text-primary hover:bg-primary hover:text-black flex items-center gap-1.5 shadow-md shadow-primary/10"
            >
              🏢 Coworking & Workspaces ➔
            </Link>
          </div>

          {/* Stays Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredStays.map(stay => (
              <div key={stay.id} className="bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/40 transition-all flex flex-col sm:flex-row group shadow-md">
                <div className="sm:w-2/5 h-48 sm:h-auto bg-muted relative overflow-hidden">
                  <img src={stay.photoUrl} alt={stay.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 bg-primary text-black font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {stay.type}
                  </span>
                </div>
                <div className="sm:w-3/5 p-6 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                      <MapPin size={13} /> {stay.area}, {stay.city}
                    </div>
                    <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors mt-1">
                      {stay.name}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1 line-clamp-2">
                      {stay.description}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-border pt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <ShieldCheck size={13} className="text-emerald-500" /> {stay.speed}
                      </span>
                      <span className="font-mono text-primary font-black">{stay.monthlyPrice}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-muted-foreground">
                        ⭐ <strong className="text-foreground">{stay.rating}</strong> ({stay.reviews} reviews)
                      </span>
                      <Link
                        href="/resources/coworking#book"
                        className="inline-flex items-center gap-1 text-xs font-black text-black bg-primary hover:bg-yellow-400 px-3.5 py-1.5 rounded-xl transition-all"
                      >
                        Reserve <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Automated Internal Linking Engine */}
          <InternalLinkingEngine 
            type="stay" 
            city="Pokhara" 
            className="mt-12" 
          />

        </div>
      </main>
      <Footer />
    </>
  )
}
