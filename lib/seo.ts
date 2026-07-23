export const SITE_URL = "https://digitalnomadsinnepal.com";

export interface ArticleJsonLdProps {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string | null;
  author: string;
  createdAt: Date | string;
}

export interface DestinationJsonLdProps {
  name: string;
  description?: string | null;
  slug: string;
  image?: string | null;
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Generates Schema.org Article structured data for blog posts.
 */
export function generateArticleJsonLd(post: ArticleJsonLdProps) {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.coverImage || `${SITE_URL}/hero-bg.png`;
  const publishedDate =
    typeof post.createdAt === "string"
      ? post.createdAt
      : post.createdAt.toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    image: [imageUrl],
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      "@type": "Person",
      name: post.author || "Digital Nomads in Nepal Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Digital Nomads in Nepal",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/nomadlogo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };
}

/**
 * Generates Schema.org TouristDestination structured data for destination guides.
 */
export function generateDestinationJsonLd(dest: DestinationJsonLdProps) {
  const destUrl = `${SITE_URL}/destinations/${dest.slug}`;
  const imageUrl = dest.image || `${SITE_URL}/hero-bg.png`;

  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `${dest.name}, Nepal`,
    description: dest.description || `Digital Nomad guide for ${dest.name}, Nepal.`,
    url: destUrl,
    image: imageUrl,
    containedInPlace: {
      "@type": "Country",
      name: "Nepal",
    },
    touristType: ["Digital Nomad", "Remote Worker", "Expat", "Backpacker"],
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data.
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item.startsWith("http") ? item.item : `${SITE_URL}${item.item}`,
    })),
  };
}
