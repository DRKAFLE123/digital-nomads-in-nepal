import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { MapPin, Compass, Wifi, Sparkles } from "lucide-react"

export const metadata = {
  title: "Nepal Digital Nomad Map | Kathmandu, Pokhara, & Himalayan Hubs",
  description: "Browse the interactive guide map of remote working hubs, trekking spots, and connectivity locations across Nepal.",
}

const pins = [
  { name: "Kathmandu Valley", type: "Main Tech Hub", lat: "27.7172", lng: "85.3240", wifi: "100-300 Mbps", desc: "Fastest fiber internet, major coworking spaces, cafes, and historical monuments." },
  { name: "Pokhara Lakeside", type: "Lakeside Paradise", lat: "28.2096", lng: "83.9856", wifi: "80-200 Mbps", desc: "Peaceful lakeside vibes, cafes with mountain views, paragliding, and trekking basecamp." },
  { name: "Bandipur Town", type: "Hilltop Retreat", lat: "27.9392", lng: "84.4163", wifi: "40-100 Mbps", desc: "No vehicle noise, Newari architecture, quiet town for deep developers focus." },
  { name: "Namche Bazaar", type: "Everest Work Stop", lat: "27.8069", lng: "86.7140", wifi: "10-30 Mbps", desc: "High-altitude gateway to Everest Base Camp. Good 4G and Ncell/NTC connectivity." },
]

export default function MapPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
              Explore Geography
            </span>
            <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
              Nepal Nomad Map
            </h1>
            <p className="text-muted-foreground text-sm mt-3">
              Explore locations across Nepal suited for remote workers. Filtered by internet reliability and altitude.
            </p>
          </div>

          {/* Map Display Simulation */}
          <div className="relative w-full h-[450px] bg-zinc-900 border border-border rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center group">
            {/* Background Map Placeholder */}
            <div className="absolute inset-0 bg-[radial-gradient(#2b2b2b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            
            {/* Visual simulation elements */}
            <div className="absolute top-1/4 left-1/3 bg-purple-500/20 border border-purple-500/40 w-40 h-40 rounded-full blur-2xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 bg-primary/10 border border-primary/20 w-56 h-56 rounded-full blur-3xl pointer-events-none" />

            <div className="z-10 text-center space-y-4 max-w-md p-6">
              <Compass className="text-primary mx-auto animate-spin-slow" size={48} />
              <h3 className="text-xl font-bold text-white">Interactive Terrain Guide</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Visualizing pins for Kathmandu valley, Pokhara lake, and Himalayan trails. Drag and zoom functionality requires active maps account integration.
              </p>
              <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[10px] text-gray-300 font-bold uppercase tracking-wider">
                <Sparkles size={11} className="text-primary" />
                Vetted Pins Loaded Below
              </div>
            </div>
          </div>

          {/* Pins Listing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pins.map((pin) => (
              <div key={pin.name} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/20 transition-all duration-300 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-foreground text-sm">{pin.name}</h3>
                    <span className="bg-background border border-border text-[9px] font-semibold text-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {pin.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{pin.desc}</p>
                  
                  <div className="flex items-center gap-4 text-[10px] font-semibold text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <Wifi size={12} className="text-green-400" /> Wifi: {pin.wifi}
                    </span>
                    <span>Lat: {pin.lat} • Lng: {pin.lng}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
