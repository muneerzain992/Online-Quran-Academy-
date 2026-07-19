import { getSocialProfileUrls, site } from "@/config/site";
import { seoDefaults } from "@/config/seo-keywords";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function organizationJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: site.name,
    alternateName: [
      site.shortName,
      "Online Quran Academy",
      "Best Online Quran Academy",
    ],
    description: site.description,
    url,
    email: site.email,
    telephone: site.phone,
    logo: `${url}${site.logo}`,
    image: `${url}${site.logo}`,
    sameAs: getSocialProfileUrls(),
    areaServed: site.regions.map((name) => ({
      "@type": "Place",
      name,
    })),
    offers: {
      "@type": "Offer",
      name: site.trialOffer,
      price: "0",
      priceCurrency: "USD",
      description: "Free Quran trial class for new students",
      url: `${url}/book`,
    },
  };
}

export function websiteJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: seoDefaults.title,
    url,
    description: site.description,
    publisher: {
      "@type": "EducationalOrganization",
      name: site.name,
      url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function courseJsonLd(course: {
  title: string;
  description: string;
  slug: string;
}) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: `${url}/courses/${course.slug}`,
    provider: {
      "@type": "EducationalOrganization",
      name: site.name,
      url,
    },
    inLanguage: ["en", "ur", "ar"],
    isAccessibleForFree: false,
    offers: {
      "@type": "Offer",
      category: "Paid",
      url: `${url}/book`,
      description: `${site.trialOffer}. Plans from ${site.startingPrice}.`,
    },
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  authorName: string;
  tags?: string[];
  coverImage?: string | null;
}) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${url}/blog/${post.slug}`,
    mainEntityOfPage: `${url}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: `${url}${site.logo}`,
      },
    },
    image: post.coverImage
      ? post.coverImage.startsWith("http")
        ? post.coverImage
        : `${url}${post.coverImage}`
      : `${url}${site.logo}`,
    keywords: post.tags?.join(", "),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${url}${item.path}`,
    })),
  };
}

export function reviewJsonLd(
  testimonials: { name: string; quote: string; rating: number }[],
) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: site.name,
    url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue:
        testimonials.reduce((s, t) => s + t.rating, 0) /
        Math.max(testimonials.length, 1),
      reviewCount: testimonials.length,
      bestRating: 5,
    },
    review: testimonials.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewBody: t.quote,
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: 5,
      },
    })),
  };
}
