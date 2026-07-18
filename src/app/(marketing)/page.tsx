import {
  Courses,
  Faq,
  FinalCta,
  Hero,
  HowWeConduct,
  Instructors,
  KidsAdults,
  Pricing,
  RegionsMarquee,
  Stats,
  Testimonials,
  WhyChoose,
} from "@/components/sections";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getPlans,
  getPublishedCourses,
  getPublishedFaqs,
  getPublishedTestimonials,
} from "@/lib/cms";
import {
  faqJsonLd,
  organizationJsonLd,
  reviewJsonLd,
} from "@/lib/seo";

export default async function HomePage() {
  const [courses, plans, faqs, testimonials] = await Promise.all([
    getPublishedCourses(),
    getPlans(),
    getPublishedFaqs(),
    getPublishedTestimonials(),
  ]);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={faqJsonLd(faqs)} />
      {testimonials.length ? (
        <JsonLd data={reviewJsonLd(testimonials)} />
      ) : null}
      <Hero />
      <RegionsMarquee />
      <Stats />
      <WhyChoose />
      <KidsAdults />
      <HowWeConduct />
      <Instructors />
      <Courses
        items={courses.map((c) => ({
          slug: c.slug,
          title: c.title,
          description: c.description,
          audience: c.audience,
          duration: c.duration,
        }))}
      />
      <Pricing plans={plans} />
      <Testimonials items={testimonials} />
      <FinalCta />
      <Faq />
    </>
  );
}
