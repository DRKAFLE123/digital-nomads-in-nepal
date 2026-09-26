const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const contentMarkdown = `**Pokhara, Nepal — September 17, 2026**

Pokhara is set to welcome digital nomads, entrepreneurs, and technology enthusiasts through **Nomads Basecamp Nepal 2026**, an initiative aiming to connect remote workers with Nepal’s growing technology and tourism ecosystem.

According to a report by TechPana, the event is planned for September 25–27 at Pokhara Event Center. The initiative aims to promote Pokhara as a destination for remote work, innovation, and international collaboration.

![Nomads Basecamp Nepal 2026 Conference at Pokhara Event Center](/images/pokhara-basecamp-summit.jpg)

### Why It Matters

With its lakeside lifestyle, mountain views, and growing digital community, Pokhara offers an attractive setting for people who want to work remotely while experiencing Nepal.

Nomads Basecamp 2026 could create opportunities for:

* **Networking among digital nomads and entrepreneurs**: Fostering lasting cross-border connections between global remote talent and Nepal's local builders.
* **Collaboration between technology and tourism businesses**: Bridging tech-driven nomadic lifestyles with Nepal’s renowned hospitality and adventure sectors.
* **Discussions around remote work, startups, and digital innovation**: Exploring visa policies, digital infrastructure, coworking hubs, and the future of work in the Himalayas.
* **Greater international interest in Pokhara as a remote-work destination**: Highlighting the city's unique balance of high-speed connectivity, tranquil lakeside cafes, and access to Annapurna trails.

![Digital Nomads Coworking and Networking by Phewa Lake, Pokhara](/images/pokhara-coworking-meetup.jpg)

### A Step Toward Nepal’s Digital Future

As remote work continues to connect people across borders, events like Nomads Basecamp can help bring fresh ideas, talent, and business opportunities to Nepal.

For digital nomads, freelancers, and aspiring entrepreneurs, Pokhara is becoming more than a travel destination — it is a place to work, connect, and build.

**Pokhara’s next chapter may be remote, connected, and full of possibilities.**

> ℹ️ **Schedule Note:** TechPana reports the event dates as September 25–27, 2026. Another tourism news result mentions September 1–7, so confirm the official schedule with the organizers before publishing the date as final or booking travel.

---

*Source: TechPana — “Nomads Basecamp 2026” report.*`

async function main() {
  const postData = {
    title: "Pokhara to Host Nomads Basecamp 2026: A New Chapter for Nepal’s Remote Work Community",
    slug: "pokhara-nomads-basecamp-2026",
    excerpt: "Pokhara is set to host Nomads Basecamp 2026, bringing digital nomads, entrepreneurs, and tech innovators together in Nepal.",
    content: contentMarkdown,
    coverImage: "/images/pokhara-nomads-basecamp-hero.jpg",
    category: "Community",
    tags: [
      "Digital Nomads Nepal",
      "Pokhara",
      "Remote Work",
      "Nomads Basecamp",
      "Tech News Nepal"
    ],
    readTime: "4 min read",
    affiliates: false,
    featured: true,
    author: "DR Kafle",
    published: true,
  }

  // Upsert post
  const post = await prisma.post.upsert({
    where: { slug: postData.slug },
    update: postData,
    create: postData,
  })

  console.log("✅ Post saved in database:", post.id, post.title)

  // Also add images to Media table if not existing
  const mediaItems = [
    {
      name: "pokhara-nomads-basecamp-hero",
      url: "/images/pokhara-nomads-basecamp-hero.jpg",
      size: 908172,
      alt: "Pokhara Nomads Basecamp 2026 Coworking with Annapurna View",
    },
    {
      name: "pokhara-basecamp-summit",
      url: "/images/pokhara-basecamp-summit.jpg",
      size: 946475,
      alt: "Nomads Basecamp Nepal 2026 Conference at Pokhara Event Center",
    },
    {
      name: "pokhara-coworking-meetup",
      url: "/images/pokhara-coworking-meetup.jpg",
      size: 985169,
      alt: "Digital Nomads Tech Meetup by Phewa Lake Pokhara",
    },
  ]

  for (const item of mediaItems) {
    const existing = await prisma.media.findFirst({ where: { url: item.url } })
    if (!existing) {
      await prisma.media.create({ data: item })
      console.log("✅ Media registered:", item.name)
    }
  }
}

main()
  .catch((e) => {
    console.error("❌ Error saving to database:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
