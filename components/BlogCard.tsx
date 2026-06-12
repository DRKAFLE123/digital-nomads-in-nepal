import Link from "next/link"
import Image from "@/components/ImageWithFallback"
import { Calendar, Clock } from "lucide-react"

interface BlogCardProps {
  title: string
  slug: string
  excerpt: string
  coverImage: string
  category: string
  readTime: string
  date: string
}

export default function BlogCard({ title, slug, excerpt, coverImage, category, readTime, date }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block h-full">
      <article className="bg-[#141414] border border-[#222222] rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:scale-[1.02] hover:border-[#FFD700] hover:shadow-[0_0_15px_rgba(255,215,0,0.15)]">
        <div className="relative h-48 w-full overflow-hidden bg-[#222222]">
          <Image
            src={coverImage || "https://images.unsplash.com/photo-1544735716-392fe2449fee?auto=format&fit=crop&q=80"}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 bg-[#FFD700] text-black text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {category}
          </span>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-[#FFD700] transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-[#A0A0A0] text-sm mb-4 line-clamp-3 flex-grow">
            {excerpt}
          </p>
          <div className="flex items-center text-xs text-[#A0A0A0] gap-4 mt-auto border-t border-[#222222] pt-4">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {date}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {readTime}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
