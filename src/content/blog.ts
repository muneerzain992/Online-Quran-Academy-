export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  coverImage?: string | null;
  tags: string[];
  authorName: string;
  publishedAt: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-start-quran-learning-at-home",
    title: "How to Start Quran Learning at Home",
    excerpt:
      "A practical guide for overseas families beginning a consistent Quran routine with children — without overwhelm.",
    contentHtml: `
      <p>Starting Quran education at home can feel daunting, especially when you are balancing school, work, and a busy household abroad. The good news is that a calm, consistent routine matters more than perfection.</p>
      <h2>Begin with intention and a short daily slot</h2>
      <p>Choose a fixed 20–30 minute window that works with your time zone. Consistency builds muscle memory for both parent and child.</p>
      <h2>Choose the right starting course</h2>
      <p>Most beginners thrive with Norani Qaida and Tajweed foundations before moving into Nazra. If your child already knows letters, a Tajweed-focused path may suit better.</p>
      <h2>Why a live teacher helps</h2>
      <p>One-to-one sessions catch pronunciation mistakes early and keep motivation high — something apps alone rarely achieve for younger learners.</p>
      <blockquote>Book a free trial to experience how personalized online classes fit your family's schedule.</blockquote>
    `,
    tags: ["beginners", "parents", "routine"],
    authorName: "Academy Admin",
    publishedAt: "2026-01-15T10:00:00.000Z",
  },
  {
    slug: "why-female-teachers-matter-for-girls",
    title: "Why Female Teachers Matter for Girls' Quran Education",
    excerpt:
      "How a values-aligned learning environment helps girls and women feel comfortable, confident, and consistent.",
    contentHtml: `
      <p>Many Muslim families prefer female teachers for daughters and women students. Comfort and trust directly affect attendance, focus, and long-term progress.</p>
      <h2>A safe, respectful space</h2>
      <p>Female instructors understand cultural expectations around modesty and can create a calm classroom where students ask questions freely.</p>
      <h2>Role models in faith and character</h2>
      <p>Beyond tajweed and memorization, teachers model adab, patience, and sincerity — qualities that shape how students relate to the Quran.</p>
      <h2>How we support families</h2>
      <p>At Dr Farhat Hashmi Online Quran Academy, you can request a female teacher when booking your free trial so every student learns in a values-aligned setting.</p>
    `,
    tags: ["teachers", "girls", "families"],
    authorName: "Academy Admin",
    publishedAt: "2026-02-10T10:00:00.000Z",
  },
  {
    slug: "tajweed-tips-for-busy-families",
    title: "Tajweed Tips for Busy Overseas Families",
    excerpt:
      "Small habits that improve pronunciation between live classes — even with a packed UK, US, or Gulf schedule.",
    contentHtml: `
      <p>You do not need hours every day to improve Tajweed. Short, focused practice between live lessons compounds quickly.</p>
      <h2>Listen before you recite</h2>
      <p>Replay a short recording of your teacher or a trusted qari for two minutes before your own practice. The ear trains the tongue.</p>
      <h2>One rule at a time</h2>
      <p>Pick a single focus for the week — madd, noon sakinah, or heavy letters — instead of trying to fix everything at once.</p>
      <h2>Keep revision short and daily</h2>
      <p>Five minutes of yesterday's lesson beats an hour once a week. Pair it with a fixed cue, like after Maghrib or before bedtime.</p>
    `,
    tags: ["tajweed", "practice", "tips"],
    authorName: "Academy Admin",
    publishedAt: "2026-03-05T10:00:00.000Z",
  },
];
