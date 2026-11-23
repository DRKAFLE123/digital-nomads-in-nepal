const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

const mdxPath = path.join(__dirname, '../content/blog/cost-of-living-in-kathmandu-2026.mdx');
const rawMdx = fs.readFileSync(mdxPath, 'utf8');

// Parse frontmatter
const match = rawMdx.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
if (!match) {
  console.error("Failed to parse MDX file frontmatter");
  process.exit(1);
}

const frontmatterRaw = match[1];
const content = match[2].trim();

const postData = {
  title: "Cost of Living in Kathmandu 2026: Nomad Budget Guide",
  slug: "cost-of-living-in-kathmandu-2026",
  excerpt: "How much does it cost to live in Kathmandu as a digital nomad? Real 2026 budgets for rent, food, coworking and transport, from $500 to $1,000 a month.",
  coverImage: "https://images.unsplash.com/photo-1544735716-392fe2449fee?auto=format&fit=crop&w=1200&q=80",
  category: "Cost of Living",
  tags: [
    "cost of living in Kathmandu",
    "Kathmandu digital nomad budget",
    "living in Kathmandu 2026",
    "Kathmandu rent for expats",
    "coworking Kathmandu",
    "Nepal digital nomad visa"
  ],
  readTime: "9 min read",
  affiliates: false,
  featured: true,
  author: "Damodar Kafle",
  published: true,
  content: content
};

async function seed() {
  console.log("Upserting Kathmandu Cost of Living 2026 Blog Post...");

  const post = await prisma.post.upsert({
    where: { slug: postData.slug },
    update: postData,
    create: postData,
  });

  console.log(`Success! Post created/updated: ${post.title} (${post.slug})`);

  // Also update legacy/cluster slug if present so users hitting old links get the rich content
  const legacySlug = "cost-of-living-kathmandu-nomad-guide";
  const existingLegacy = await prisma.post.findUnique({ where: { slug: legacySlug } });
  if (existingLegacy) {
    await prisma.post.update({
      where: { slug: legacySlug },
      data: {
        content: content,
        excerpt: postData.excerpt,
        title: postData.title,
        tags: postData.tags
      }
    });
    console.log(`Also updated legacy slug: ${legacySlug}`);
  }
}

seed()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
