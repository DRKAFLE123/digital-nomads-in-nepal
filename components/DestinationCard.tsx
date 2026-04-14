import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface DestinationCardProps {
  name: string
  description: string
  image: string
  slug: string
}

export default function DestinationCard({ name, description, image, slug }: DestinationCardProps) {
  return (
    <Link href={`/destinations/${slug}`} className="group relative h-80 rounded-xl overflow-hidden block">
      <div className="absolute inset-0 bg-[#222222] z-0">
        {image ? (
            <Image 
              src={image} 
              alt={name} 
              fill 
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          ) : null}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-90" />
      <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end h-full">
        <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{name}</h3>
        <p className="text-[#A0A0A0] text-sm mb-4 line-clamp-2 transform translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          {description}
        </p>
        <div className="flex items-center text-[#FFD700] font-semibold text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
          Explore guide <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </Link>
  )
}
