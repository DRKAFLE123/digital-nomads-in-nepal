export interface DistrictOption {
  id: string
  name: string
  nepali: string
  cities: string[]
}

export const NEPAL_DISTRICT_DATA: DistrictOption[] = [
  {
    id: "kaski",
    name: "Kaski",
    nepali: "कास्की (पोखरा)",
    cities: [
      "Pokhara (Lakeside)",
      "Pokhara (Damside)",
      "Pokhara (Chipledhunga)",
      "Sarangkot",
      "Begnas Lake",
      "Other City / Town in Kaski"
    ]
  },
  {
    id: "kathmandu",
    name: "Kathmandu",
    nepali: "काठमाडौँ",
    cities: [
      "Kathmandu (Thamel)",
      "Kathmandu (Lazimpat / Baluwatar)",
      "Kathmandu (Baneshwor)",
      "Kathmandu (Boudha)",
      "Budhanilkantha",
      "Other City / Area in Kathmandu"
    ]
  },
  {
    id: "lalitpur",
    name: "Lalitpur",
    nepali: "ललितपुर",
    cities: [
      "Lalitpur (Jhamsikhel)",
      "Lalitpur (Sanepa)",
      "Lalitpur (Patan Durbar)",
      "Kupondole",
      "Bhaisepati",
      "Other City / Area in Lalitpur"
    ]
  },
  {
    id: "bhaktapur",
    name: "Bhaktapur",
    nepali: "भक्तपुर",
    cities: [
      "Bhaktapur City",
      "Nagarkot",
      "Thimi",
      "Other Area in Bhaktapur"
    ]
  },
  {
    id: "tanahun",
    name: "Tanahun",
    nepali: "तनहुँ (बन्दीपुर)",
    cities: [
      "Bandipur",
      "Damauli",
      "Dumre",
      "Other Area in Tanahun"
    ]
  },
  {
    id: "chitwan",
    name: "Chitwan",
    nepali: "चितवन (सौराहा)",
    cities: [
      "Sauraha",
      "Bharatpur",
      "Meghauli",
      "Narayangarh",
      "Other Area in Chitwan"
    ]
  },
  {
    id: "kavrepalanchok",
    name: "Kavrepalanchok",
    nepali: "काभ्रे (धुलिखेल)",
    cities: [
      "Dhulikhel",
      "Panauti",
      "Banepa",
      "Namobuddha",
      "Other Area in Kavre"
    ]
  },
  {
    id: "mustang",
    name: "Mustang",
    nepali: "मुस्ताङ",
    cities: [
      "Jomsom",
      "Marpha",
      "Muktinath",
      "Kagbeni",
      "Lo Manthang",
      "Other Area in Mustang"
    ]
  },
  {
    id: "solukhumbu",
    name: "Solukhumbu",
    nepali: "सोलुखुम्बु (नाम्चे)",
    cities: [
      "Namche Bazaar",
      "Lukla",
      "Phaplu",
      "Khumjung",
      "Other Area in Solukhumbu"
    ]
  },
  {
    id: "rupandehi",
    name: "Rupandehi",
    nepali: "रुपन्देही (लुम्बिनी)",
    cities: [
      "Lumbini",
      "Bhairahawa",
      "Butwal",
      "Other Area in Rupandehi"
    ]
  },
  {
    id: "makwanpur",
    name: "Makwanpur",
    nepali: "मकवानपुर",
    cities: [
      "Hetauda",
      "Daman",
      "Palung",
      "Other Area in Makwanpur"
    ]
  },
  {
    id: "ilam",
    name: "Ilam",
    nepali: "इलाम",
    cities: [
      "Ilam Bazaar",
      "Kanyam",
      "Antu Danda",
      "Other Area in Ilam"
    ]
  },
  {
    id: "other",
    name: "Other District",
    nepali: "अन्य जिल्ला",
    cities: [
      "Other City / Town (अन्य सहर / स्थान)"
    ]
  }
]

export interface CategoryOption {
  value: string
  label: string
  nepali: string
  badge: string
  subtypes: {
    value: string
    label: string
    nepali: string
    tagline: string
  }[]
}

export const PROPERTY_CATEGORY_OPTIONS: CategoryOption[] = [
  {
    value: "Work and Stay",
    label: "Work and Stay (काम र बसाइ दुवै)",
    nepali: "काम र बसाइ दुवै — Coliving, Hostel & Workation",
    badge: "Most Popular for Nomads",
    subtypes: [
      {
        value: "Coliving & Coworking Hub (Work + Stay)",
        label: "Coliving & Coworking Hub (Work + Stay)",
        nepali: "कोलिभिङ र कोवर्किङ हब",
        tagline: "Dedicated nomad community with private/shared rooms & 24/7 work hall"
      },
      {
        value: "Digital Nomad Hostel with Coworking",
        label: "Digital Nomad Hostel with Coworking",
        nepali: "डिजिटल नोम्याड होस्टेल र वर्क स्पेस",
        tagline: "Social hostel with shared dorms/rooms & dedicated fiber work room"
      },
      {
        value: "Work-Friendly Hotel & Resort",
        label: "Work-Friendly Hotel & Resort",
        nepali: "वर्क-फ्रेन्डली होटल/रिसोर्ट",
        tagline: "Hospitality rooms with in-room desk, fiber Wi-Fi & restaurant"
      },
      {
        value: "Himalayan Workation Retreat",
        label: "Himalayan Workation Retreat",
        nepali: "हिमालयन वर्केसन रिट्रिट",
        tagline: "Mountain-view peace, organic meals, yoga & remote work setup"
      },
      {
        value: "Homestay with Dedicated Workspace",
        label: "Homestay with Dedicated Workspace",
        nepali: "होमस्टे र वर्क डेक्स",
        tagline: "Authentic local family homestay with fiber Wi-Fi & workspace"
      },
      {
        value: "Nomad Guesthouse with Work Lounge",
        label: "Nomad Guesthouse with Work Lounge",
        nepali: "गेस्टहाउस र साझा वर्क लाउन्ज",
        tagline: "Cozy mountain/lakeside guesthouse with high-speed work terrace"
      }
    ]
  },
  {
    value: "Work Only",
    label: "Work Only (काम मात्र)",
    nepali: "काम मात्र — Coworking, Cafe & Offices",
    badge: "Day Desks & Workspaces",
    subtypes: [
      {
        value: "Coworking & Hot Desk Space",
        label: "Coworking & Hot Desk Space",
        nepali: "साझा कोवर्किङ र हट डेस्क",
        tagline: "Flexible hot desks with 100+ Mbps fiber, power backup & phone booths"
      },
      {
        value: "Hybrid Cafe & Work Lounge",
        label: "Hybrid Cafe & Work Lounge",
        nepali: "वर्क-फ्रेन्डली क्याफे र लाउन्ज",
        tagline: "Specialty coffee, quiet seating, charging ports & laptop ambience"
      },
      {
        value: "Private Dedicated Desk / Office",
        label: "Private Dedicated Desk / Office",
        nepali: "प्राइभेट अफिस र केबिन",
        tagline: "Lockable private rooms or dedicated workstations for teams"
      },
      {
        value: "Meeting & Event Work Hub",
        label: "Meeting & Event Work Hub",
        nepali: "मिटिङ हल र सेमिनार स्पेस",
        tagline: "Conference rooms, podcast gear & workshop event seating"
      },
      {
        value: "Library & Quiet Study Space",
        label: "Library & Quiet Study Space",
        nepali: "शान्त अध्ययन र कोडिङ स्पेस",
        tagline: "Silent focus environment ideal for software engineers & writers"
      },
      {
        value: "Creative Studio / Maker Space",
        label: "Creative Studio / Maker Space",
        nepali: "सिर्जनात्मक स्टुडियो र वर्कसप",
        tagline: "Photo/video studios, audio recording & maker workspaces"
      }
    ]
  },
  {
    value: "Stay Only",
    label: "Stay Only (बसाइ मात्र)",
    nepali: "बसाइ मात्र — Hostels, Villas & Homestays",
    badge: "Remote Living & Stays",
    subtypes: [
      {
        value: "Nomad & Backpacker Hostel",
        label: "Nomad & Backpacker Hostel",
        nepali: "होस्टेल / ब्याकप्याकर होस्टेल",
        tagline: "Budget shared dorms & private rooms, social vibe, community lounge"
      },
      {
        value: "Long-Term Nomad Villa & Apartment",
        label: "Long-Term Nomad Villa & Apartment",
        nepali: "लामो अवधिको भिल्ला वा अपार्टमेन्ट",
        tagline: "Self-contained furnished apartments/villas for stays of 2 weeks to 6 months"
      },
      {
        value: "Boutique Guesthouse & Bed & Breakfast",
        label: "Boutique Guesthouse & Bed & Breakfast",
        nepali: "गेस्टहाउस तथा B&B",
        tagline: "Charming rooms with home-cooked breakfast & peaceful setting"
      },
      {
        value: "Traditional Local Homestay",
        label: "Traditional Local Homestay",
        nepali: "गाउँले तथा सांस्कृतिक होमस्टे",
        tagline: "Cultural family stay with authentic home meals & mountain view"
      },
      {
        value: "Serviced Studio for Remote Workers",
        label: "Serviced Studio for Remote Workers",
        nepali: "फर्निस्ड स्टुडियो अपार्टमेन्ट",
        tagline: "Compact private studio with kitchen, desk and weekly cleaning"
      },
      {
        value: "Eco-Lodge & Nature Cottage",
        label: "Eco-Lodge & Nature Cottage",
        nepali: "इको-लज र कटेज",
        tagline: "Sustainable tranquil nature stays in Sauraha, Nagarkot or Bandipur"
      }
    ]
  }
]

export interface FoodDrinkOption {
  id: string
  label: string
  nepali: string
  description: string
}

export const FOOD_AND_DRINKS_OPTIONS: FoodDrinkOption[] = [
  {
    id: "food_breakfast",
    label: "Breakfast",
    nepali: "बिहानको खाजा / ब्रेकफास्ट",
    description: "Morning meals, eggs, toast, local tea or porridge"
  },
  {
    id: "food_lunch",
    label: "Lunch",
    nepali: "दिउँसोको खाना / लन्च",
    description: "Nepali Dal Bhat, noodles, sandwiches, or thali sets"
  },
  {
    id: "food_dinner",
    label: "Dinner",
    nepali: "साँझको खाना / डिनर",
    description: "Warm evening dinners, momos, curries, or international food"
  },
  {
    id: "food_snacks",
    label: "Snacks & Quick Bites",
    nepali: "खाजा तथा स्न्याक्स",
    description: "Light bites, pastries, energy bars, pakodas, fries"
  },
  {
    id: "food_drinks",
    label: "Specialty Coffee, Tea & Drinks",
    nepali: "कफी, चिया तथा पेय पदार्थ",
    description: "Himalayan organic coffee, masala chai, fresh juices"
  },
  {
    id: "food_kitchen",
    label: "Shared Guest Kitchen",
    nepali: "अतिथि स्वयंले पकाउन मिल्ने भान्सा",
    description: "Gas stove, refrigerator & utensils for nomads to cook their own food"
  },
  {
    id: "food_breakfast_included",
    label: "Free Breakfast Included with Stay",
    nepali: "बसाइमा बिहानको खाजा समावेश",
    description: "Complimentary daily morning breakfast for staying guests"
  }
]
