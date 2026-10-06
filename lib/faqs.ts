export interface FaqItem {
  id: string
  question: string
  answer: string
  category: "General & Lifestyle" | "Visa & Legal" | "Internet & Tech" | "Cost & Budget" | "Destinations & Workspaces" | "Banking & Money" | "Trekking & Guides"
  googleSearchVolume?: "High" | "Trending" | "Popular"
}

export const ALL_FAQS: FaqItem[] = [
  // 1. Google "People also ask" high-volume baseline questions
  {
    id: "who-is-digital-nomad",
    question: "Who is a digital nomad?",
    answer: "A digital nomad is a location-independent professional who uses telecommunications and internet technologies to earn a living while traveling or living across different cities and countries. Digital nomads include remote software engineers, writers, designers, digital marketers, startup founders, consultants, and online business owners.",
    category: "General & Lifestyle",
    googleSearchVolume: "High"
  },
  {
    id: "how-to-become-digital-nomad",
    question: "How do I become a digital nomad?",
    answer: "To become a digital nomad: 1) Transition your current job to remote work or build in-demand freelance skills (coding, copy, SEO, UI/UX). 2) Establish a reliable remote income and build 3–6 months of emergency savings. 3) Select an affordable, safe destination with high-speed internet like Nepal. 4) Pack minimal remote work gear (laptop, power bank, universal adapter). 5) Join local digital nomad communities on arrival.",
    category: "General & Lifestyle",
    googleSearchVolume: "High"
  },
  {
    id: "best-jobs-for-digital-nomads",
    question: "What jobs are best for digital nomads?",
    answer: "The most popular jobs for digital nomads in Nepal and globally include: Software engineering and web development, content writing and copywriting, UX/UI and graphic design, SEO and digital marketing, remote project management, customer success, virtual assistance, and online tutoring.",
    category: "General & Lifestyle",
    googleSearchVolume: "High"
  },
  {
    id: "5-essential-items-digital-nomad",
    question: "What are 5 essential items for a digital nomad?",
    answer: "The 5 must-have essentials are: 1) A reliable laptop with good battery life. 2) A high-capacity power bank (20,000mAh+ with 65W PD charging). 3) A universal travel adapter with surge protection. 4) Active noise-canceling headphones for video calls. 5) An unlocked smartphone for local eSIM / SIM cards (Ncell or NTC in Nepal).",
    category: "General & Lifestyle",
    googleSearchVolume: "Popular"
  },
  {
    id: "which-country-best-digital-nomads",
    question: "Which country is the best for digital nomads in South Asia?",
    answer: "Nepal is consistently rated one of the top destinations for digital nomads looking for incredible natural scenery, low cost of living ($600–$1,200/month), English-friendly locals, warm hospitality, and mountain adventure. With fiber-optic internet (100–300 Mbps) in Kathmandu and Pokhara, Nepal provides a rare balance of productive work hubs and world-class Himalayan trekking.",
    category: "General & Lifestyle",
    googleSearchVolume: "Popular"
  },
  {
    id: "remote-areas-nepal-work",
    question: "What are some remote areas in Nepal where you can still work online?",
    answer: "While extreme trekking circuits have satellite Wi-Fi, hill towns like Bandipur, Nagarkot, Dhulikhel, and Tansen offer peaceful, scenic rural atmospheres combined with reliable 4G cellular data and boutique resorts with fiber internet. For lakeside serenity with all modern amenities, Pokhara (Lakeside) remains Nepal's premier nomad base.",
    category: "Destinations & Workspaces",
    googleSearchVolume: "Popular"
  },

  // 2. Visa & Legal
  {
    id: "tourist-visa-duration-remote-work",
    question: "How long can digital nomads legally stay and work remotely in Nepal?",
    answer: "Most remote workers enter on the standard Nepal Tourist Visa, issued on arrival at Tribhuvan International Airport (Kathmandu) for 15, 30, or 90 days. You can extend your tourist visa at Department of Immigration offices in Kathmandu (Kalikasthan) or Pokhara up to a maximum of 150 days per calendar year (January 1 to December 31). Extensions cost $3 USD per day.",
    category: "Visa & Legal",
    googleSearchVolume: "High"
  },
  {
    id: "nepal-digital-nomad-visa-2026",
    question: "Is there a dedicated Digital Nomad Visa for Nepal in 2026?",
    answer: "Nepal's government and tourism board have recognized the growing remote work ecosystem and are actively drafting formal digital nomad visa guidelines. In the interim, remote professionals legally use the 150-day tourist visa allowance while working exclusively for foreign employers and foreign clients without taking local Nepali employment.",
    category: "Visa & Legal",
    googleSearchVolume: "Trending"
  },
  {
    id: "visa-run-from-nepal",
    question: "Can I do a 'visa run' to reset my 150-day visa limit in Nepal?",
    answer: "The 150-day tourist visa cap is strictly calculated per calendar year (January 1 – December 31). Leaving Nepal to India or Thailand will not reset the 150-day limit within the same year. However, if you arrive around August or September, you can stay 150 days until December 31, and then immediately renew for up to another 150 days starting January 1 of the new calendar year—giving you up to 300 consecutive days in Nepal.",
    category: "Visa & Legal",
    googleSearchVolume: "High"
  },

  // 3. Internet & Tech
  {
    id: "internet-speed-kathmandu-pokhara",
    question: "How fast and reliable is the internet & Wi-Fi in Kathmandu and Pokhara?",
    answer: "Fiber optic broadband (FTTH) in Kathmandu and Pokhara is fast and reliable. Providers like WorldLink, Subisu, and DishHome deliver speeds between 100 Mbps and 300 Mbps with low ping. Top coworking spaces (such as Work Around, The Hub, and Bodhi Coworking) feature dual redundant fiber connections and dedicated uninterrupted power supply (UPS) systems.",
    category: "Internet & Tech",
    googleSearchVolume: "High"
  },
  {
    id: "load-shedding-power-cuts",
    question: "What happens during power cuts or load shedding in Nepal?",
    answer: "Historic load shedding ended years ago in Nepal. However, brief localized outages (10–30 minutes) can happen during monsoon rainstorms. Verified coworking spaces, coliving hubs, and reputable hotels all have automatic solar power, commercial battery inverters, or diesel generators that kick in within seconds, ensuring your Wi-Fi and laptop charging never drop.",
    category: "Internet & Tech",
    googleSearchVolume: "Popular"
  },
  {
    id: "best-sim-card-esim-nepal",
    question: "Which SIM card or eSIM is best for digital nomads in Nepal: Ncell or NTC?",
    answer: "Both Ncell and Nepal Telecom (NTC) offer 4G/5G data with extensive coverage. Ncell has faster customer service and simple app-based package refills, while NTC provides better coverage on remote trekking trails. You can buy a physical SIM card right outside Tribhuvan Airport arrival hall for around NPR 300 ($2.50 USD) with your passport and photo, or purchase an Airalo / Nomad eSIM before boarding.",
    category: "Internet & Tech",
    googleSearchVolume: "High"
  },

  // 4. Cost of Living & Budget
  {
    id: "average-monthly-cost-living",
    question: "What is the average monthly cost of living for a digital nomad in Nepal?",
    answer: "Most digital nomads spend between $600 and $1,200 USD per month total: Private furnished apartment or coliving room: $200–$450/month; Eating out daily at cafes and local eateries: $200–$350/month; Coworking desk pass: $60–$120/month; Mobile data & local transport: $30–$60/month. Nepal offers one of the lowest costs of living and highest quality of life ratios in Asia.",
    category: "Cost & Budget",
    googleSearchVolume: "High"
  },
  {
    id: "cost-of-rent-and-apartments",
    question: "How much does a furnished 1-bedroom apartment or coliving space cost in Nepal?",
    answer: "In central expat and nomad neighborhoods like Patan/Jhamsikhel or Pokhara Lakeside, a modern 1-bedroom furnished apartment costs between NPR 25,000 and 45,000 ($190–$340 USD) per month with utilities and high-speed Wi-Fi included. Budget private studio rooms and boutique guest houses range between NPR 15,000 and 25,000 ($115–$190 USD).",
    category: "Cost & Budget",
    googleSearchVolume: "Popular"
  },

  // 5. Destinations & Workspaces
  {
    id: "kathmandu-vs-pokhara-for-nomads",
    question: "Which city is best for my first base: Kathmandu or Pokhara?",
    answer: "Kathmandu (specifically Patan / Jhamsikhel) is the dynamic creative capital—ideal for networking, modern coworking hubs, historic courtyards, international dining, and airport access. Pokhara (Lakeside) offers clean air, mountain serenity, relaxed coffee shops overlooking Phewa Lake, paragliding, and weekend Himalayan hikes.",
    category: "Destinations & Workspaces",
    googleSearchVolume: "High"
  },
  {
    id: "best-neighborhoods-to-live",
    question: "What are the best neighborhoods for digital nomads to stay in Kathmandu?",
    answer: "The top 3 neighborhoods in Kathmandu are: 1) Jhamsikhel / Sanepa (Patan) – the premier expat and startup hub, full of modern cafes, quiet residential lanes, and top coworking spaces. 2) Lazimpat – upscale, quiet, and close to embassies and supermarkets. 3) Thamel / Chhauni – lively, full of gear shops and live music, ideal for short initial stays.",
    category: "Destinations & Workspaces",
    googleSearchVolume: "High"
  },

  // 6. Banking & Money
  {
    id: "atm-fees-and-international-cards",
    question: "Can I use foreign credit cards, and how much are ATM fees in Nepal?",
    answer: "Visa and Mastercard are accepted at major hotels, supermarkets, and coworking hubs. However, day-to-day purchases (street food, local cafes, taxis, and fruit stalls) require cash (Nepali Rupees - NPR). ATMs from Nabil Bank, Standard Chartered, and Siddhartha Bank dispense up to NPR 35,000 per withdrawal. Most local ATMs charge a standard ATM operator fee of NPR 500 (~$3.75 USD) per international withdrawal.",
    category: "Banking & Money",
    googleSearchVolume: "High"
  },
  {
    id: "nepal-qr-payments-for-foreigners",
    question: "Can foreign digital nomads use Nepal's Fonepay QR code payment system?",
    answer: "Currently, Fonepay and eSewa QR payment networks require a Nepali bank account linked to a local citizenship or PAN card. However, international travelers from India can use UPI directly via PhonePe. Non-Indian nomads should carry sufficient cash or use a Wise / Revolut card for ATM withdrawals.",
    category: "Banking & Money",
    googleSearchVolume: "Popular"
  },

  // 7. Trekking & Guides
  {
    id: "trekking-while-working-fulltime",
    question: "How can I balance a full-time remote work schedule with Himalayan trekking?",
    answer: "You do not need to pause your job for two weeks. From Pokhara, you can easily take 3-to-4 day long weekend treks (such as Australian Camp, Poon Hill, or Mardi Himal High Camp) between Friday afternoon and Monday evening. For high-altitude treks like Everest Base Camp or the Annapurna Circuit, nomads either take annual leave or travel with certified local guides and satellite communicators.",
    category: "Trekking & Guides",
    googleSearchVolume: "High"
  },
  {
    id: "is-guide-mandatory-for-trekking",
    question: "Is it mandatory to hire a licensed guide for trekking in Nepal?",
    answer: "Yes, under Nepal Tourism Board and TAAN regulations, foreign solo trekkers in most national parks and conservation areas (including Annapurna, Langtang, and Manaslu) are required to trek with a licensed government-registered guide for safety and environmental protection. Licensed guides can be hired through verified local experts on Digital Nomads in Nepal.",
    category: "Trekking & Guides",
    googleSearchVolume: "High"
  }
]
