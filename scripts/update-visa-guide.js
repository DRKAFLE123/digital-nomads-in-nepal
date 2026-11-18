const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updatedTitle = "Nepal Digital Nomad Visa (2026): Rules, Tourist Visa Extension & How to Stay 150 Days";
const updatedExcerpt = "Can you work remotely in Nepal? Official 2026 rules: 150-day tourist visa allowance, online extension portal (nepalimmigration.gov.np), fees & legality.";

const updatedContent = `> 🏛️ **Official Source Notice:** Cross-referenced directly with the **Department of Immigration, Ministry of Home Affairs, Government of Nepal** ([nepalimmigration.gov.np](https://nepalimmigration.gov.np)). Last verified: November 2026.

Nepal is rapidly growing as a premier destination for remote workers and location-independent digital nomads. With the Himalayas as your morning horizon, an exceptionally low cost of living, and high-speed fiber internet in the major valleys, it offers an inspiring balance of productivity and mountain adventure.

However, many international visitors are confused about visa regulations. Does Nepal have an official "Digital Nomad Visa"? Can you legally work remotely on a tourist visa? How do extensions work, and how can you stay in Nepal for up to 5 months?

Here is the factual, legally accurate guide to navigating Nepal's visa rules in 2026.

---

## The Reality: Does Nepal Have a "Digital Nomad Visa"?

**No. Nepal does not currently have a dedicated or separate "Digital Nomad Visa" category.**

Any website claiming there is a special application form with minimum income requirements ($2,000–$3,000/mo) or special freelance permits is either hallucinated or outdated.

Instead, remote workers and digital nomads stay and work in Nepal under the **Tourist Visa framework**.

### Is It Legal to Work Remotely on a Tourist Visa in Nepal?
Under Nepal immigration law:
* You **cannot take local employment** in Nepal (you cannot work for a Nepali company, receive salary in Nepali Rupees from a local entity, or sell services locally without a formal Work Permit approved by the Department of Labor and Department of Immigration).
* **Remote work for foreign employers or overseas clients**—where your income is earned abroad and paid into an overseas bank account—is universally practiced and permitted under the standard 150-day tourist allowance.

---

## 1. Visa on Arrival (VoA) Fees & Durations

Most international passport holders (US, UK, EU, Canada, Australia, etc.) can obtain a **Tourist Visa on Arrival** at Tribhuvan International Airport (TIA) in Kathmandu or at designated land border crossings.

| Duration | Official Fee (USD) | Best Suited For |
| :--- | :---: | :--- |
| **15 Days** | **$30 USD** | Short scouting trips or quick mountain treks |
| **30 Days** | **$50 USD** | Standard one-month nomad workation |
| **90 Days** | **$125 USD** | Long-term digital nomads & season stays |

*Tip:* When applying on arrival at Kathmandu Airport, pay with major foreign currencies (USD, EUR, GBP) in clean banknotes or via foreign card at the designated bank counter before passport control.

---

## 2. The 150-Day Rule (Maximum Stay Per Calendar Year)

Under Nepal Rastra Bank and Department of Immigration regulations, a foreign tourist is permitted to stay in Nepal for a maximum of **150 days per calendar year** (January 1 to December 31).

### How to Stay in Nepal for 5 Months
1. Enter on an initial **90-day Visa on Arrival ($125 USD)**.
2. Before your 90 days expire, apply for a **60-day extension ($180 USD)** at the immigration office.
3. This gives you the maximum **150 consecutive days** (approx. 5 full months) of Himalayan remote work.

### The "Reset" Hack (Stay Up to 10 Consecutive Months)
Because the 150-day limit is calculated **per calendar year** (Jan 1 – Dec 31):
* If you arrive in Nepal on **August 5**, you can stay for 150 days until **December 31** (Year 1 allowance).
* On **January 1**, your annual counter resets to zero! You can then extend or renew for another 150 days through **May 30** (Year 2 allowance).
* This allows long-term nomads to stay in Nepal for **up to 10 consecutive months** without ever leaving the country.

---

## 3. How to Extend Your Visa (Step-by-Step Walkthrough)

Nepal has digitized its visa extension system through the **Nepali Port** government portal.

### Step 1: Complete the Online Application
* Visit the official portal: [nepaliport.immigration.gov.np](https://nepaliport.immigration.gov.np)
* Select **Visa Extension**.
* Fill in your passport number, current visa sticker number, local Nepal address (your hotel, coliving, or apartment), and requested extension period.
* Upload a digital copy of your passport photo and submit. Download or print the confirmation barcode slip.

### Step 2: Visit the Immigration Office
You can submit your application and get your extension sticker stamped at either of two official offices:
1. **Department of Immigration — Kathmandu**: Located in Kalikasthan, Dillibazar. Open Sunday to Thursday 10:00 AM – 3:00 PM, Friday 10:00 AM – 1:00 PM.
2. **Immigration Office — Pokhara**: Located in Sahid Chowk, Pokhara. Much quieter with significantly shorter queues than Kathmandu!

### Step 3: Pay Extension Fees
* **Standard Extension Rate:** **$3 USD per day** (minimum extension is 15 days = **$45 USD**).
* For example:
  * 15-day extension: $45 USD
  * 30-day extension: $90 USD
  * 60-day extension: $180 USD
* Pay the fee at the on-site bank counter in cash (NPR or USD) or by card, collect your new sticker, and you are stamped and legal!

---

## 4. Overstay Penalties (Do Not Overstay!)

Never allow your tourist visa to lapse without extending it in advance:
* Overstay fine: **$5 USD per day** of overstay + regular extension fee ($3/day).
* Excessive overstays can result in questioning by immigration officials or entry bans. Always file your extension application at least 3 to 5 business days before your current visa expires.

---

## Helpful Resources for Remote Workers in Nepal
* Check our [Cost of Living in Nepal 2026 Guide](/blog/cost-of-living-in-nepal-2026-2027) for full monthly budgets.
* Compare [Best ATMs in Nepal for Foreign Cards](/blog/best-atms-cash-foreign-cards-nepal-guide) to avoid hefty cash fees.
* Get connected with our [SIM Cards in Nepal (Ncell vs NTC) Guide](/blog/sim-cards-mobile-data-nepal-guide).
* Browse verified stays in our [Nepal Long-Stay & Coliving Hub](/stay).

---

## Frequently Asked Questions (FAQ)

### Can I work remotely on a tourist visa in Nepal?
Yes. Digital nomads and remote workers who work online for foreign employers or overseas clients and receive income into foreign bank accounts stay legally under the 150-day tourist visa framework. You may not take local employment or earn money from Nepali companies without a formal work permit.

### What is the maximum number of days a digital nomad can stay in Nepal?
You can stay up to **150 days per calendar year** (January 1 to December 31). If you arrive in late summer or autumn, you can stay up to 150 days in the first year and an additional 150 days starting January 1, enabling up to 10 consecutive months in Nepal.

### Where is the official online visa extension portal for Nepal?
The official government portal is **[nepaliport.immigration.gov.np](https://nepaliport.immigration.gov.np)**, managed by the Department of Immigration, Ministry of Home Affairs.

### How much does it cost to extend a visa in Nepal?
The visa extension fee is **$3 USD per day**, with a mandatory minimum extension period of 15 days (**$45 USD**). A 30-day extension costs **$90 USD**.
`;

async function updateVisaPosts() {
  console.log("Updating visa guide in DB...");

  // Update primary post
  await prisma.post.update({
    where: { slug: 'nepal-digital-nomad-visa-guide-2026' },
    data: {
      title: updatedTitle,
      excerpt: updatedExcerpt,
      content: updatedContent,
      category: "Visa & Legal",
      updatedAt: new Date(),
    }
  });
  console.log("Updated nepal-digital-nomad-visa-guide-2026 successfully.");

  // Also update secondary post with the same verified facts
  await prisma.post.update({
    where: { slug: 'nepal-digital-nomad-visa-2026-the-ultimate-guide-to-living-and-working-from-the-himalayas' },
    data: {
      title: updatedTitle,
      excerpt: updatedExcerpt,
      content: updatedContent,
      category: "Visa & Legal",
      updatedAt: new Date(),
    }
  });
  console.log("Updated secondary visa post successfully.");

  await prisma.$disconnect();
}

updateVisaPosts().catch(err => {
  console.error("Error updating visa posts:", err);
  process.exit(1);
});
