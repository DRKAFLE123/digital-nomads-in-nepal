import Image from "./ImageWithFallback"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface DestinationCardProps {
  name: string
  description?: string
  image: string
  slug: string
  counts?: string
}

const DEFAULT_COUNTS: Record<string, string> = {
  kathmandu: "22 workspaces · 15 stays",
  pokhara: "14 workspaces · 12 stays",
  lalitpur: "11 workspaces · 8 stays",
  bandipur: "3 workspaces · 6 stays",
}

export default function DestinationCard({ name, image, slug, counts }: DestinationCardProps) {
  const displayCounts = counts || DEFAULT_COUNTS[slug.toLowerCase()] || "Verified nomad hub"

  return (
    <Link
      href={`/destinations/${slug}`}
      className="group relative h-72 sm:h-80 rounded-2xl overflow-hidden block border border-black/10 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="absolute inset-0 bg-[#1A1A1C] z-0">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : null}
      </div>

      {/* Ambient gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />

      {/* Content Pin & Subtitle */}
      <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 z-20 flex flex-col justify-end">
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 tracking-tight flex items-center gap-1.5">
          <span>{name}</span>
        </h3>
        <p className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1 mb-2">
          <span>{displayCounts}</span>
        </p>
        <div className="inline-flex items-center text-xs font-bold text-[#FB923C] group-hover:translate-x-1 transition-transform">
          <span>Explore destination</span>
          <ArrowRight size={12} className="ml-1" />
        </div>
      </div>
    </Link>
  )
}
