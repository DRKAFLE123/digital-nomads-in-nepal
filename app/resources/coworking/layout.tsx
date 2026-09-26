import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Best Coworking Spaces in Nepal (2026 Directory) | Digital Nomads",
  description: "Browse verified coworking spaces and remote work hubs in Kathmandu, Pokhara, and across Nepal with verified WiFi speeds and power backup.",
  alternates: {
    canonical: "https://digitalnomadsinnepal.com/resources/coworking",
  },
}

export default function CoworkingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
