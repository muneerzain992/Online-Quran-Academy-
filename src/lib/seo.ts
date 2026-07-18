import { getSocialProfileUrls, site } from "@/config/site";

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
    description: site.description,
    url,
    email: site.email,
    telephone: site.phone,
    logo: `${url}${site.logo}`,
    sameAs: getSocialProfileUrls(),
    areaServed: site.regions.map((name) => ({
      "@type": "Place",
      name,
    })),
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
