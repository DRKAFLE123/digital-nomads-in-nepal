import type { Metadata } from "next";
import CoworkingMarketplaceClient from "@/components/coworking/CoworkingMarketplaceClient";

export const metadata: Metadata = {
  title: "Stay & Work in Nepal | Work-Friendly Hotels, Hostels & Coliving Marketplace",
  description: "Find verified work-friendly accommodations across Nepal for digital nomads: boutique hotels, hostels, serviced apartments, and coliving spaces with high-speed fiber internet and power backup.",
  alternates: {
    canonical: "https://digitalnomadsinnepal.com/stay",
  },
  openGraph: {
    title: "Stay & Work in Nepal | Work-Friendly Hotels, Hostels & Coliving Marketplace",
    description: "Find verified work-friendly accommodations across Nepal for digital nomads: boutique hotels, hostels, serviced apartments, and coliving spaces with high-speed fiber internet and power backup.",
    url: "https://digitalnomadsinnepal.com/stay",
    siteName: "Digital Nomads in Nepal",
    locale: "en_US",
    type: "website",
  },
};

export default function StayPage() {
  return <CoworkingMarketplaceClient defaultOfferingType="stay" />;
}
