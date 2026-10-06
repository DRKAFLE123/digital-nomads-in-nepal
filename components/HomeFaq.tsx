"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ArrowRight, HelpCircle } from "lucide-react"
import { ALL_FAQS, FaqItem } from "@/lib/faqs"

// Show the top high-volume search questions on the homepage (matching Google PAA trends)
const HOMEPAGE_TOP_FAQS: FaqItem[] = [
  ALL_FAQS.find(f => f.id === "who-is-digital-nomad")!,
  ALL_FAQS.find(f => f.id === "tourist-visa-duration-remote-work")!,
  ALL_FAQS.find(f => f.id === "internet-speed-kathmandu-pokhara")!,
  ALL_FAQS.find(f => f.id === "average-monthly-cost-living")!,
  ALL_FAQS.find(f => f.id === "kathmandu-vs-pokhara-for-nomads")!,
  ALL_FAQS.find(f => f.id === "how-to-become-digital-nomad")!,
  ALL_FAQS.find(f => f.id === "best-jobs-for-digital-nomads")!,
  ALL_FAQS.find(f => f.id === "trekking-while-working-fulltime")!,
].filter(Boolean)

export default function HomeFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setOpenIdx(prev => (prev === idx ? null : idx))
  }

  // Schema.org FAQPage structured data for Google rich snippets
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOMEPAGE_TOP_FAQS.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  }

  return (
    <section
      className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background relative"
      aria-label="Frequently Asked Questions"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-3xl mx-auto">
        {/* Header - Clean Google 'People also ask' aesthetic */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#222222]">
            <div>
              <h2 className="text-xl sm:text-2xl font-normal text-gray-900 dark:text-gray-100 tracking-tight">
                People also ask
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Top questions digital nomads search on Google about living and working in Nepal
              </p>
            </div>

            <Link
              href="/faq"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#B45309] dark:text-[#FFD400] hover:underline whitespace-nowrap"
            >
              <span>View all FAQs</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Google PAA Clean Accordion List */}
        <div className="divide-y divide-gray-200 dark:divide-[#222222]">
          {HOMEPAGE_TOP_FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div key={faq.id} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-3.5 sm:py-4 flex items-center justify-between gap-4 text-left cursor-pointer group focus:outline-none select-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] sm:text-[16px] text-gray-900 dark:text-gray-100 font-normal group-hover:text-[#B45309] dark:group-hover:text-[#FFD400] transition-colors leading-snug">
                    {faq.question}
                  </span>

                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-gray-200 dark:bg-[#282828] text-gray-900 dark:text-white rotate-180"
                        : "bg-gray-100 dark:bg-[#181818] text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-[#222222]"
                    }`}
                  >
                    <ChevronDown size={16} />
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-4 pt-0 pr-6 sm:pr-10 text-[14px] sm:text-[15px] text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>{faq.answer}</p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#1a1a1a] px-2 py-0.5 rounded">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA for All FAQs */}
        <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left border-t border-gray-200 dark:border-[#222222]">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Have more questions about internet, visas, coliving, or trekking?
          </p>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#181818] dark:hover:bg-[#222222] text-xs font-bold text-gray-900 dark:text-white border border-gray-200 dark:border-[#2A2A2A] transition-all hover:border-[#FFD400]"
          >
            <span>View All FAQs &amp; Search</span>
            <ArrowRight size={13} className="text-[#B45309] dark:text-[#FFD400]" />
          </Link>
        </div>
      </div>
    </section>
  )
}
