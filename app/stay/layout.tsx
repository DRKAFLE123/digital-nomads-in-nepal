import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Nomad Coliving & Long-Term Stays in Nepal | Digital Nomads in Nepal",
  description: "Discover curated nomad stays, coliving spaces, and serviced apartments in Kathmandu and Pokhara with high-speed internet and power backup.",
  alternates: {
    canonical: "https://digitalnomadsinnepal.com/stay",
  },
}

export default function StayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
