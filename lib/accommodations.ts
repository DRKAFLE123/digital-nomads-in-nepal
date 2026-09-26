export interface Accommodation {
  id: string
  name: string
  type: string
  city: string
  area: string
  price: string
  monthlyPrice: string
  rating: number
  reviews: number
  speed: string
  power: string
  photoUrl: string
  description: string
  amenities: string[]
}

export const ACCOMMODATIONS: Accommodation[] = [
  {
    id: "stay-1",
    name: "Kathmandu Nomad Coliving Hub",
    type: "Coliving",
    city: "Kathmandu",
    area: "Jhamsikhel, Lalitpur",
    price: "$28 / night",
    monthlyPrice: "$450 / month",
    rating: 4.9,
    reviews: 38,
    speed: "200 Mbps Fiber",
    power: "24/7 Generator",
    photoUrl: "/blog-lakeside-pokhara.png",
    description: "Modern coliving space with dedicated hot desks, high-speed fiber internet, and weekly community dinners in Jhamsikhel.",
    amenities: ["Dedicated Desk", "High-Speed WiFi", "Community Dinners", "Daily Housekeeping", "24/7 Access"]
  },
  {
    id: "stay-2",
    name: "Lakeside Nomad Suites",
    type: "Hotels",
    city: "Pokhara",
    area: "Lakeside Street 6",
    price: "$35 / night",
    monthlyPrice: "$600 / month",
    rating: 4.8,
    reviews: 52,
    speed: "150 Mbps Fiber",
    power: "Automatic UPS + Solar",
    photoUrl: "/blog-cost-of-living.png",
    description: "Quiet lakefront hotel with ergonomic desk setups, private balconies overlooking Fewa Lake, and rooftop coworking.",
    amenities: ["Balcony View", "Ergonomic Chair", "Rooftop Workspace", "Breakfast Included", "Power Backup"]
  },
  {
    id: "stay-3",
    name: "Thamel Backpackers & Work Hostel",
    type: "Hostels",
    city: "Kathmandu",
    area: "Thamel, Kathmandu",
    price: "$12 / night",
    monthlyPrice: "$220 / month",
    rating: 4.7,
    reviews: 64,
    speed: "100 Mbps",
    power: "UPS Backup",
    photoUrl: "/hero-bg.png",
    description: "Vibrant community hostel designed for remote workers on a budget. Includes quiet call booths and social events.",
    amenities: ["Dorm & Private Rooms", "Call Booths", "Bar & Cafe", "Organized Treks", "Free Coffee"]
  },
  {
    id: "stay-4",
    name: "Pokhara Long-Term Nomad Residency",
    type: "Long-Term Stays",
    city: "Pokhara",
    area: "Sedibag, Lakeside",
    price: "$22 / night",
    monthlyPrice: "$400 / month",
    rating: 4.9,
    reviews: 29,
    speed: "200 Mbps Fiber",
    power: "Full Generator Backup",
    photoUrl: "/blog-top-10-destinations.png",
    description: "Fully furnished apartments designed for 1–6 month stays with fully equipped kitchens, laundry, and private fiber WiFi.",
    amenities: ["Full Kitchen", "Private Fiber Line", "Washing Machine", "Mountain Views", "Weekly Cleaning"]
  }
]
