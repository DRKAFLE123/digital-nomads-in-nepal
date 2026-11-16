import type { Metadata } from "next";
import CoworkingMarketplaceClient from "@/components/coworking/CoworkingMarketplaceClient";

export const metadata: Metadata = {
  title: "Coworking & Work Hubs in Nepal | Verified Wi-Fi & Workspaces",
  description: "Browse verified coworking spaces, desks, private offices, and coliving hubs across Kathmandu, Pokhara, and Nepal with 24/7 backup power and high-speed internet.",
  alternates: {
    canonical: "https://digitalnomadsinnepal.com/resources/coworking",
  },
};

export default function CoworkingMarketplacePage() {
  return <CoworkingMarketplaceClient defaultOfferingType="all" />;
}
