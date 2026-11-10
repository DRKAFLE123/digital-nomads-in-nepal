import type { Metadata } from "next"
import CoworkingMarketplacePage from "@/app/resources/coworking/page"

export const metadata: Metadata = {
  title: "Workspaces in Nepal | Verified Coworking & Hot Desks for Digital Nomads",
  description: "Explore verified coworking spaces, hot desks, private offices, and work-friendly hubs across Kathmandu, Pokhara, and Nepal with 24/7 power backup and high-speed fiber Wi-Fi.",
  alternates: {
    canonical: "https://digitalnomadsinnepal.com/workspaces",
  },
  openGraph: {
    title: "Workspaces in Nepal | Verified Coworking & Hot Desks for Digital Nomads",
    description: "Explore verified coworking spaces, hot desks, private offices, and work-friendly hubs across Kathmandu, Pokhara, and Nepal with 24/7 power backup and high-speed fiber Wi-Fi.",
    url: "https://digitalnomadsinnepal.com/workspaces",
    siteName: "Digital Nomads in Nepal",
    locale: "en_US",
    type: "website",
  },
}

export default function WorkspacesPage() {
  return <CoworkingMarketplacePage />
}
