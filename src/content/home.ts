import { site } from "@/config/site";

export const homeHero = {
  eyebrow: "Trusted by 10,000+ Families Worldwide",
  headline: "Learn Quran Online with Certified Teachers",
  subheading:
    "Join our trusted online Quran academy for overseas Pakistani families, providing Quran classes with qualified teachers and a safe, Islamic learning environment. In our safe and nurturing Islamic learning environment, every student is guided with care, ensuring proper recitation, understanding, and love for the Quran. Helping your children stay connected to the Quran, no matter where you live.",
  priceLine: `Starting from just ${site.startingPrice}  |  3 Days Free Trial Available`,
  primaryCta: { label: "Book Free Trial Class", href: "/book" },
  secondaryCta: { label: "Explore Our Courses", href: "/courses" },
} as const;

export const homeStats = [
  { value: 10000, suffix: "+", label: "Happy Students" },
  { value: 500, suffix: "+", label: "Certified Teachers" },
  { value: 25, suffix: "+", label: "Countries Served" },
  { value: 20, suffix: "+", label: "Years Experience" },
] as const;

export const whyChoose = {
  eyebrow: "Why Parents Trust Us",
  heading: "Why Choose Our Academy?",
  intro:
    "We understand the unique needs of Muslim families living abroad. Our academy is built on trust, quality, and Islamic values.",
  features: [
    {
      title: "Experienced & Certified Teachers",
      description:
        "All our Quran teachers are qualified, experienced, and hold proper certification to teach Quran with Tajweed.",
    },
    {
      title: "Flexible Class Timings (24/7)",
      description:
        "We offer round-the-clock availability to accommodate students from UK, USA, Canada, and across the globe.",
    },
    {
      title: "One-to-One Personalized Sessions",
      description:
        "Every student receives undivided attention from their dedicated teacher, ensuring faster progress and deeper understanding.",
    },
    {
      title: "Free Trial Class Available",
      description:
        "Experience our teaching quality firsthand with a completely free trial class — no obligations, no pressure.",
    },
    {
      title: "Friendly & Islamic Environment",
      description:
        "We create a warm, supportive learning atmosphere rooted in Islamic values and respect for all students.",
    },
    {
      title: "Certified & Qualified Faculty",
      description:
        "All our teachers are well-qualified, certified, and trained to deliver quality Quranic education while respecting Islamic values.",
    },
  ],
} as const;

export const kidsAdults = {
  heading: "Online Quran Classes for Kids and Adults",
  body: "As Muslim parents, it is our core responsibility to teach our kids the basic teachings of Islam and Quran recitation with Tajweed. Due to a hectic schedule in this modern world, many of us can't easily manage this basic obligation. We offer online classes for kids and adults so your family can learn from home, at times that suit you.",
  learn: [
    "Quran Reading Online with Tajweed",
    "Complete Norani Qaida with Tajweed",
    "Complete Nazra Quran with Tajweed",
    "Quran Memorization (Hifz) with Tajweed",
    "Quran Translation",
    "Basic Rules of Arabic",
    "Kalmas",
    "Namaz (Prayers) & Daily Duas",
  ],
  badges: ["3 Days FREE Trial Classes", "Affordable Fee"],
  cta: { label: "Let's have a FREE Trial Class", href: "/book" },
} as const;

export const howWeConduct = {
  heading: "How We Conduct Classes",
  items: [
    "Zoom / Google Meet",
    "Audio & Video Live Classes",
    "One-to-One Sessions",
  ],
} as const;

export const instructors = {
  eyebrow: "Qualified Instructors",
  heading: "Learn from Certified Teachers",
  body: "At Dr Farhat Hashmi Online Quran Academy, we respect Islamic values and understand the importance of a comfortable learning environment. Our certified teachers are dedicated to providing quality Quranic education.",
  checklist: [
    "All teachers hold Al-Huda certification",
    "Experienced in teaching Tajweed, Hifz, and Qaida",
    "Background-verified and thoroughly trained",
    "Patient and supportive teaching approach",
  ],
  labels: ["Quran Teacher", "Online Quran Class"],
  cta: { label: "Meet Our Teachers", href: "/teachers" },
} as const;

export type HomeCourse = {
  slug: string;
  title: string;
  description: string;
  audience: string;
  duration: string;
};

export const homeCourses: HomeCourse[] = [
  {
    slug: "tajweed",
    title: "Tajweed Course",
    description:
      "Our Tajweed course is designed to help students recite the Quran correctly and beautifully, following proper rules of pronunciation.",
    audience: "All age groups and skill levels",
    duration: "6–12 months per level",
  },
  {
    slug: "hifz-ul-quran",
    title: "Hifz-ul-Quran",
    description:
      "Embark on the blessed journey of becoming a Hafiza. Our structured Hifz program with daily revision builds strong, lasting memorization.",
    audience: "Dedicated students committed to memorization",
    duration: "2–4 years",
  },
  {
    slug: "quran-translation-tafseer",
    title: "Quran Translation & Basic Tafseer",
    description:
      "This course helps students understand the message of the Quran through clear translation and basic tafseer.",
    audience: "Students wanting deeper understanding",
    duration: "Ongoing",
  },
  {
    slug: "islamic-duas-salah",
    title: "Islamic Duas and Salah",
    description:
      "Learn essential daily duas, the proper method of performing Salah, and fundamental Islamic practices.",
    audience: "New Muslims, children, anyone wanting basics",
    duration: "1–3 months",
  },
  {
    slug: "sahabiyat",
    title: "Sahabiyat Course",
    description:
      "Students will learn about the faith, character, sacrifices, and contributions of the Sahabiyat to early Islam.",
    audience: "Women and young girls",
    duration: "Ongoing",
  },
  {
    slug: "personal-development",
    title: "Personal Development & Life Skills",
    description:
      "A comprehensive course designed to help Muslim youth and women develop essential life skills while staying rooted in Islamic values.",
    audience: "Youth and women",
    duration: "One class per month",
  },
  {
    slug: "norani-qaida",
    title: "Norani Qaida with Tajweed",
    description:
      "The perfect starting point for absolute beginners. Master letter recognition, joining, and correct pronunciation to build a strong foundation for Quran reading.",
    audience: "Kids and adult beginners",
    duration: "3–6 months",
  },
  {
    slug: "nazra-quran",
    title: "Nazra Quran with Tajweed",
    description:
      "Complete fluent recitation of the whole Quran with Tajweed, verse by verse, under a teacher's guidance.",
    audience: "Students who have completed Qaida",
    duration: "1–2 years",
  },
];

export const coursesSection = {
  eyebrow: "What We Offer",
  heading: "Comprehensive Quran Education",
  intro:
    "From beginners to advanced learners, we have the perfect course for your Quranic journey.",
  cta: { label: "View All Courses & Pricing", href: "/courses" },
} as const;

export const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "$50",
    period: "/month",
    classesPerWeek: "3 Classes/Week",
    duration: "30 Minutes Each",
    popular: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: "$70",
    period: "/month",
    classesPerWeek: "5 Classes/Week",
    duration: "30 Minutes Each",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$99",
    period: "/month",
    classesPerWeek: "6 Classes/Week",
    duration: "45 Minutes Each",
    popular: false,
  },
] as const;

export const pricingSection = {
  eyebrow: "Affordable Pricing",
  heading: "Simple & Transparent Packages",
  ctaLabel: "Get Started",
} as const;

export const testimonials = [
  {
    quote:
      "My daughters have been learning with Dr Farhat Hashmi Online Quran Academy for 2 years. Having female teachers who understand our values has made such a difference. Highly recommend!",
    name: "Fatima Ahmed",
    location: "London, UK",
    rating: 5,
  },
  {
    quote:
      "The male teachers here are incredibly patient with my son. His Tajweed has improved remarkably, and he looks forward to every class.",
    name: "Mohammad Hassan",
    location: "Toronto, Canada",
    rating: 5,
  },
  {
    quote:
      "Finding qualified female Quran teachers in America was challenging until we found Dr Farhat Hashmi Online Quran Academy. The flexible timings work perfectly with our schedule.",
    name: "Aisha Khan",
    location: "New York, USA",
    rating: 5,
  },
] as const;

export const testimonialsSection = {
  eyebrow: "Testimonials",
  heading: "What Parents Say About Us",
} as const;

export const finalCta = {
  heading: "Start Your Child's Quranic Journey Today",
  body: "Book a FREE trial class and experience the Dr Farhat Hashmi Online Quran Academy difference. No commitments, no pressure — just quality Quran education tailored to your family's needs.",
  cta: { label: "Book Your Free Trial", href: "/book" },
} as const;

export const homeFaqs = [
  {
    id: "free-trial",
    question: "Do you offer a free trial class?",
    answer: `Yes. We offer ${site.trialOffer} so your family can experience our teaching quality with no obligation or pressure.`,
  },
  {
    id: "cost",
    question: "How much do classes cost?",
    answer:
      "Packages start from just $50/month for the Basic plan (3 classes/week). Standard is $70/month and Premium is $99/month — all with transparent pricing and no hidden fees.",
  },
  {
    id: "female-teachers",
    question: "Do you have female teachers for girls?",
    answer:
      "Yes. We have qualified female teachers for girls and women, and male teachers for boys — so every student learns in a comfortable, values-aligned environment.",
  },
  {
    id: "platform",
    question: "What platform are classes on (Zoom/Google Meet)?",
    answer:
      "Classes are conducted live over Zoom or Google Meet with audio and video, so students can learn from home anywhere in the world.",
  },
  {
    id: "timings",
    question: "What are your class timings/time zones?",
    answer:
      "We offer flexible 24/7 availability to accommodate families in the UK, USA, Canada, the Gulf, and worldwide. You choose preferred days and times when you book.",
  },
  {
    id: "beginners",
    question: "Which courses suit beginners?",
    answer:
      "Beginners typically start with Norani Qaida with Tajweed, then progress to Nazra Quran. Islamic Duas and Salah is also ideal for children and new Muslims.",
  },
  {
    id: "one-to-one",
    question: "How do one-to-one sessions work?",
    answer:
      "Every student is paired with a dedicated teacher for personalized live sessions. This focused attention helps students progress faster with proper Tajweed and understanding.",
  },
  {
    id: "get-started",
    question: "How do I get started?",
    answer: `Book your ${site.trialOffer} online, share your preferred schedule and teacher gender preference, and we will confirm your first class by email or WhatsApp.`,
  },
] as const;
