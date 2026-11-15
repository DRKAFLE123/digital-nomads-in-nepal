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
    nepali: "काम र बसाइ दुवै — Coliving & Workation",
    badge: "Most Popular for Nomads",
    subtypes: [
      {
        value: "Coliving & Coworking Hub (Work + Stay)",
        label: "Coliving & Coworking Hub (Work + Stay)",
        nepali: "कोलिभिङ र कोवर्किङ हब",
        tagline: "Dedicated nomad community with private/shared rooms & work hall"
      },
      {
        value: "Digital Nomad Hostel & Coliving",
        label: "Digital Nomad Hostel & Coliving",
        nepali: "डिजिटल नोम्याड होस्टेल",
        tagline: "Social dorms/rooms with quiet fiber work room"
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
        tagline: "Mountain-view peace, organic food & remote work setup"
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
        tagline: "Flexible hot desks with 100+ Mbps fiber & backup power"
      },
      {
        value: "Hybrid Cafe & Work Lounge",
        label: "Hybrid Cafe & Work Lounge",
        nepali: "वर्क-फ्रेन्डली क्याफे र लाउन्ज",
        tagline: "Specialty coffee, quiet seating & work-friendly ambience"
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
      }
    ]
  },
  {
    value: "Stay Only",
    label: "Stay Only (बसाइ मात्र)",
    nepali: "बसाइ मात्र — Remote Living",
    badge: "Remote Living",
    subtypes: [
      {
        value: "Long-Term Nomad Villa & Apartment",
        label: "Long-Term Nomad Villa & Apartment",
        nepali: "लामो अवधिको भिल्ला वा अपार्टमेन्ट",
        tagline: "Self-contained apartments or villas for stays of 2 weeks to 6 months"
      },
      {
        value: "Boutique Guesthouse & Homestay",
        label: "Boutique Guesthouse & Homestay",
        nepali: "होमस्टे र गेस्टहाउस",
        tagline: "Authentic local family homestay with verified high-speed Wi-Fi"
      },
      {
        value: "Serviced Studio for Remote Workers",
        label: "Serviced Studio for Remote Workers",
        nepali: "स्टुडियो अपार्टमेन्ट",
        tagline: "Compact private studio with kitchen, desk and weekly cleaning"
      }
    ]
  }
]
