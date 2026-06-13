const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const coworkingGuideContent = `Running a coworking space, workspace cafe, or nomad hub in Nepal is a fantastic way to connect with remote workers from all over the globe. Digital Nomads in Nepal is the premier platform mapping out digital infrastructure, cafes, and hubs across Kathmandu, Lalitpur, Pokhara, and beyond.

By listing your hub on our directory, you gain direct visibility, increase daily coworking check-ins, and build a local community of developers, designers, and entrepreneurs.

Here is a comprehensive, step-by-step guide to registering, managing, and showcasing your workspace on our website.

---

## Why List Your Workspace?

* **Targeted Visibility**: Reach remote workers who are specifically looking for verified, high-speed internet hubs in Nepal.
* **Daily Check-Ins**: Our community members actively "check-in" to local spaces so others can find co-working buddies in real time.
* **Free Exposure**: Creating and publishing your listing is entirely free.

---

## Step 1: Prepare Your Workspace Details
Before filling out the registration form, gather the following details to ensure a high-quality listing:

1. **Fiber Internet Speed**: Digital nomads prioritize internet speed above all else. Run a speed test (e.g. speedtest.net) and note down the download/upload speeds.
2. **Pricing Plans**: Details on day passes, weekly rates, and monthly packages in Nepalese Rupees (NPR).
3. **Key Amenities**: Back-up power/generator details (crucial for load shedding), ergonomic chairs, meeting rooms, skype booths, free tea/coffee, etc.
4. **Photos**: High-quality landscape photos of the working area, desks, and exterior.
5. **Accurate Coordinates**: Physical address and Google Maps location.

---

## Step 2: Fill Out the Registration Form

To submit your space:
1. Navigate to the [Workspace Registration Page](/resources/coworking/register).
2. Enter your workspace's official name, address, contact email, and phone number.
3. Select the city (e.g., Kathmandu, Pokhara, Lalitpur, or Other).
4. Specify the **Internet Speed** (in Mbps) and upload speed backup options.
5. Describe your space, highlighting what makes it special for creative professionals and coders.
6. Provide price points so nomads can plan their monthly budgets.
7. Click **Submit Listing**.

---

## Step 3: Admin Review and Verification
Our team reviews each submission to prevent spam and ensure the workspace meets the needs of remote workers. Once approved:
* Your space will appear in our main [Coworking Directory](/resources/coworking).
* Nomads will be able to select and check in to your workspace from the [Community Dashboard](/community).

---

## Tips for a Premium Workspace Listing
* **List Backup Power**: Always mention if you have an inverter, UPS, or generator backup so nomads know they won't lose connection during outages.
* **Keep Speeds Updated**: If you upgrade your fiber package, update your listing to reflect the new speeds.
* **Offer a Free Day Trial**: Host a "Nomad Day" or offer a first-day-free deal to encourage check-ins and ratings!`;

const guideGuideContent = `Trekking, hiking, and cultural tours are central to the digital nomad experience in Nepal. Many nomads stay for months, working during the week and hitting the mountains on weekends. To do this safely and responsibly, they look for trusted, experienced, and local guide experts.

Digital Nomads in Nepal features a **Guide Directory** connecting remote workers directly with verified guides, mountaineering experts, and cultural hosts. 

Whether you lead Everest Base Camp treks, Annapurna circuits, historical Kathmandu food walks, or yoga retreats, here is how you can register and build a professional profile on our platform.

---

## Advantages of Listing as a Local Expert

* **Direct Connections**: Digital nomads contact and hire you directly, meaning no massive platform fee commissions.
* **Custom Trips**: Nomads often travel in small groups or seek customized weekend treks, allowing you to design unique itineraries.
* **Credibility & Trust**: A verified badge on our directory showcases your government license, safety training, and reviews to an international client base.

---

## Step-by-Step Registration Process

### Step 1: Go to the Guide Registration Form
Visit the [Local Guide Registration Page](/guides/register).

### Step 2: Enter Profile Information
* **Full Name & Contact Details**: Provide your active WhatsApp/phone number and email address.
* **Location/Base**: Where are you located when not trekking? (e.g. Kathmandu, Pokhara, Lukla).
* **Bio / Experience**: Tell your story. Mention how many years you've been guiding, languages you speak, and your familiarity with mountain safety.

### Step 3: Select Specialties & Regions
* Choose the types of tours you lead (e.g., High-altitude Trekking, Rock Climbing, Cultural Sightseeing, Mountain Biking).
* List the regions you cover (e.g., Khumbu/Everest, Annapurna, Langtang, Manaslu, Mustang, Kathmandu Valley).

### Step 4: Upload Credentials
* **Profile Photo**: A friendly, professional headshot or active photo of you in the mountains.
* **Guiding License (Optional but Recommended)**: Government-issued guide license, first-aid certificates, or tourism registration documents.

### Step 5: Submit and Verify
Click **Register as Guide**. Our administration team will cross-reference your license details. Once verified, your profile goes live in the guide marketplace!

---

## How to Get Hired by Digital Nomads
1. **Highlight Wi-Fi & Electricity Logistics**: Nomads need to plan work. If you know which tea houses on the Annapurna circuit have stable Wi-Fi and solar charging, write that in your bio!
2. **Collect Reviews**: After guiding a nomad, ask them to leave a review on your profile to build social proof for future clients.
3. **Be Clear on Pricing**: List estimated costs for permits, porter services, transport, and your daily rate to build immediate trust.`

async function main() {
  const blogs = [
    {
      title: "How to Register and List Your Coworking Space or Nomad Hub in Nepal",
      slug: "how-to-list-coworking-space-nepal",
      excerpt: "A step-by-step guide for local workspace owners and coworking hubs to register, manage, and showcase their spaces to our growing digital nomad community.",
      content: coworkingGuideContent,
      coverImage: "/blog-list-workspace.png",
      category: "Community",
      tags: ["coworking", "hosting-nomads", "workspace-setup", "list-workspace"],
      readTime: "4 min read",
      affiliates: false,
      featured: false,
      author: "DR kafle",
      published: true,
    },
    {
      title: "How to Register and Get Verified as a Local Guide Expert in Nepal",
      slug: "how-to-register-local-guide-nepal",
      excerpt: "Want to lead trekking groups, host cultural city tours, or offer expert travel guidance to remote workers? Here is how to create a verified Guide profile.",
      content: guideGuideContent,
      coverImage: "/blog-list-guides.png",
      category: "Guides",
      tags: ["guides", "trekking-nepal", "local-expert", "travel-hosts"],
      readTime: "5 min read",
      affiliates: false,
      featured: false,
      author: "DR kafle",
      published: true,
    }
  ]

  for (const postData of blogs) {
    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: postData,
      create: postData,
    })
    console.log(`✅ Seeded blog post: "${post.title}" (slug: ${post.slug})`)
  }
}

main()
  .catch(e => {
    console.error("❌ Error seeding posts:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
