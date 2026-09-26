import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | Digital Nomads in Nepal",
  description: "Get in touch with the Digital Nomads in Nepal team for partnerships, corrections, guide verification, or community support.",
  alternates: {
    canonical: "https://digitalnomadsinnepal.com/contact",
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
