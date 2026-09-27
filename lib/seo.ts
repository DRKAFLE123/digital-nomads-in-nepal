export const SITE_URL = "https://digitalnomadsinnepal.com";

export interface ArticleJsonLdProps {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string | null;
  author: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
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
  const modifiedDate = post.updatedAt
    ? typeof post.updatedAt === "string"
      ? post.updatedAt
      : post.updatedAt.toISOString()
    : publishedDate;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: postUrl,
    image: [imageUrl],
    datePublished: publishedDate,
    dateModified: modifiedDate,
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
        url: `${SITE_URL}/webisteofficiallogo-removebg-preview.png`,
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

export interface CoworkingJsonLdProps {
  name: string;
  slug: string;
  city: string;
  address: string;
  description?: string | null;
  photoUrl?: string | null;
  openingHours?: string | null;
  priceDaily?: number | null;
  priceMonthly?: number | null;
  rating?: number;
  totalReviews?: number;
  contactEmail?: string | null;
  website?: string | null;
  isVerified?: boolean;
}

/**
 * Generates Schema.org CoworkingSpace & LocalBusiness structured data.
 * Validates aggregateRating only if genuine reviews and ratings exist.
 */
export function generateCoworkingJsonLd(hub: CoworkingJsonLdProps) {
  const hubUrl = `${SITE_URL}/resources/coworking/${hub.slug}`;
  let imageUrl = `${SITE_URL}/hero-bg.png`;
  if (hub.photoUrl) {
    try {
      if (hub.photoUrl.startsWith("[")) {
        const parsed = JSON.parse(hub.photoUrl);
        if (Array.isArray(parsed) && parsed[0]) imageUrl = parsed[0];
      } else if (hub.photoUrl.includes(",")) {
        imageUrl = hub.photoUrl.split(",")[0].trim();
      } else {
        imageUrl = hub.photoUrl;
      }
    } catch {
      // fallback
    }
  }

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "CoworkingSpace"],
    name: hub.name,
    description: hub.description || `${hub.name} verified coworking hub in ${hub.city}, Nepal.`,
    url: hubUrl,
    image: [imageUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: hub.address,
      addressLocality: hub.city,
      addressRegion: "Bagmati/Gandaki",
      addressCountry: "NP",
    },
    openingHours: hub.openingHours || "Mo-Su 08:00-20:00",
  };

  if (hub.contactEmail) {
    schema.email = hub.contactEmail;
  }
  if (hub.website) {
    schema.sameAs = hub.website;
  }
  if (hub.priceDaily || hub.priceMonthly) {
    schema.priceRange = hub.priceDaily ? `NPR ${hub.priceDaily}` : `NPR ${hub.priceMonthly}`;
  }

  // Google rule: only output AggregateRating if genuine review count > 0 and rating > 0
  if (hub.totalReviews && hub.totalReviews > 0 && hub.rating && hub.rating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: hub.rating,
      reviewCount: hub.totalReviews,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

export interface StayJsonLdProps {
  id: string;
  name: string;
  type: string;
  city: string;
  area: string;
  price: string;
  monthlyPrice: string;
  rating?: number;
  reviews?: number;
  photoUrl: string;
  description: string;
  amenities: string[];
}

/**
 * Generates Schema.org LodgingBusiness / Hotel / Hostel structured data matching the actual accommodation type.
 */
export function generateStayJsonLd(stay: StayJsonLdProps) {
  const stayUrl = `${SITE_URL}/stay#${stay.id}`;
  const imageUrl = stay.photoUrl.startsWith("http") ? stay.photoUrl : `${SITE_URL}${stay.photoUrl}`;

  // Match legitimate subtype accurately
  let schemaType = "LodgingBusiness";
  const lowerType = (stay.type || "").toLowerCase();
  if (lowerType.includes("hotel")) {
    schemaType = "Hotel";
  } else if (lowerType.includes("hostel")) {
    schemaType = "Hostel";
  } else if (lowerType.includes("resort")) {
    schemaType = "Resort";
  } else {
    schemaType = "LodgingBusiness"; // Coliving, serviced apartments, long-stay properties
  }

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: stay.name,
    description: stay.description,
    url: stayUrl,
    image: [imageUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: stay.area,
      addressLocality: stay.city,
      addressCountry: "NP",
    },
    priceRange: `${stay.price} (${stay.monthlyPrice})`,
    amenityFeature: stay.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    })),
  };

  if (stay.reviews && stay.reviews > 0 && stay.rating && stay.rating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: stay.rating,
      reviewCount: stay.reviews,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

export interface GuideJsonLdProps {
  id: string;
  name: string;
  bio: string;
  location: string;
  specialties?: string[];
  photoUrl?: string | null;
  contactEmail?: string;
  avgRating?: number;
  totalReviews?: number;
  isVerified?: boolean;
}

/**
 * Generates Schema.org Person structured data for verified local experts and guides.
 * Avoids keyword stuffing and reflects the individual entity accurately.
 */
export function generateGuideJsonLd(guide: GuideJsonLdProps) {
  const guideUrl = `${SITE_URL}/guides/${guide.id}`;
  const imageUrl = guide.photoUrl ? (guide.photoUrl.startsWith("http") ? guide.photoUrl : `${SITE_URL}${guide.photoUrl}`) : `${SITE_URL}/hero-bg.png`;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: guide.name,
    description: guide.bio,
    url: guideUrl,
    image: imageUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: guide.location,
      addressCountry: "NP",
    },
    knowsAbout: guide.specialties && guide.specialties.length > 0 ? guide.specialties : ["Nepal Local Knowledge", "Trekking & Exploration"],
  };

  if (guide.contactEmail) {
    schema.email = guide.contactEmail;
  }

  if (guide.totalReviews && guide.totalReviews > 0 && guide.avgRating && guide.avgRating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: guide.avgRating,
      reviewCount: guide.totalReviews,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

export interface ItemListEntry {
  name: string;
  url: string;
  position?: number;
}

/**
 * Generates Schema.org ItemList structured data for major directory landing pages.
 * Every item points to a unique standalone canonical detail page.
 */
export function generateItemListJsonLd(name: string, items: ItemListEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: item.position ?? index + 1,
      name: item.name,
      url: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Generates Schema.org FAQPage structured data for high-intent queries.
 */
export function generateFaqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
