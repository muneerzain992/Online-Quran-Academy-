import { Gender, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { blogPosts } from "../src/content/blog";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@dfhacademy.com" },
    update: { role: Role.ADMIN, passwordHash, name: "Academy Admin" },
    create: {
      email: "admin@dfhacademy.com",
      name: "Academy Admin",
      role: Role.ADMIN,
      passwordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: "teacher@dfhacademy.com" },
    update: { role: Role.TEACHER, passwordHash, name: "Demo Teacher" },
    create: {
      email: "teacher@dfhacademy.com",
      name: "Demo Teacher",
      role: Role.TEACHER,
      passwordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: "student@dfhacademy.com" },
    update: { role: Role.STUDENT, passwordHash, name: "Demo Student" },
    create: {
      email: "student@dfhacademy.com",
      name: "Demo Student",
      role: Role.STUDENT,
      passwordHash,
    },
  });

  const courses = [
    {
      slug: "tajweed",
      title: "Tajweed Course",
      shortDesc:
        "Our Tajweed course is designed to help students recite the Quran correctly and beautifully, following proper rules of pronunciation.",
      longDesc:
        "Master the rules of Tajweed so every letter is pronounced from its correct origin. Lessons are paced to your level with regular feedback in one-to-one sessions.",
      audience: "All age groups and skill levels",
      duration: "6–12 months per level",
      level: "Beginner to Advanced",
      order: 1,
    },
    {
      slug: "hifz-ul-quran",
      title: "Hifz-ul-Quran",
      shortDesc:
        "Embark on the blessed journey of becoming a Hafiza. Our structured Hifz program with daily revision builds strong, lasting memorization.",
      longDesc:
        "A structured memorization journey with daily new lessons and revision under a dedicated teacher who tracks progress carefully.",
      audience: "Dedicated students committed to memorization",
      duration: "2–4 years",
      level: "Intermediate to Advanced",
      order: 2,
    },
    {
      slug: "quran-translation-tafseer",
      title: "Quran Translation & Basic Tafseer",
      shortDesc:
        "This course helps students understand the message of the Quran through clear translation and basic tafseer.",
      longDesc:
        "Understand the meaning of the Quran through clear translation and accessible tafseer, connecting verses to daily life and Islamic values.",
      audience: "Students wanting deeper understanding",
      duration: "Ongoing",
      level: "All levels",
      order: 3,
    },
    {
      slug: "islamic-duas-salah",
      title: "Islamic Duas and Salah",
      shortDesc:
        "Learn essential daily duas, the proper method of performing Salah, and fundamental Islamic practices.",
      longDesc:
        "Learn essential daily duas, the method of Salah, and foundational Islamic practices in a warm, supportive environment.",
      audience: "New Muslims, children, anyone wanting basics",
      duration: "1–3 months",
      level: "Beginner",
      order: 4,
    },
    {
      slug: "sahabiyat",
      title: "Sahabiyat Course",
      shortDesc:
        "Students will learn about the faith, character, sacrifices, and contributions of the Sahabiyat to early Islam.",
      longDesc:
        "Explore the lives of the Sahabiyat — designed especially for women and young girls.",
      audience: "Women and young girls",
      duration: "Ongoing",
      level: "All levels",
      order: 5,
    },
    {
      slug: "personal-development",
      title: "Personal Development & Life Skills",
      shortDesc:
        "A comprehensive course designed to help Muslim youth and women develop essential life skills while staying rooted in Islamic values.",
      longDesc:
        "Build practical life skills while staying rooted in Islamic values for Muslim youth and women.",
      audience: "Youth and women",
      duration: "One class per month",
      level: "Youth & women",
      order: 6,
    },
    {
      slug: "norani-qaida",
      title: "Norani Qaida with Tajweed",
      shortDesc:
        "The perfect starting point for absolute beginners. Master letter recognition, joining, and correct pronunciation to build a strong foundation for Quran reading.",
      longDesc:
        "The ideal starting point for absolute beginners. Letter recognition, joining, and correct pronunciation with Tajweed foundations.",
      audience: "Kids and adult beginners",
      duration: "3–6 months",
      level: "Beginner",
      order: 7,
    },
    {
      slug: "nazra-quran",
      title: "Nazra Quran with Tajweed",
      shortDesc:
        "Complete fluent recitation of the whole Quran with Tajweed, verse by verse, under a teacher's guidance.",
      longDesc:
        "Complete fluent recitation of the whole Quran with Tajweed after finishing Qaida — guided in live one-to-one classes.",
      audience: "Students who have completed Qaida",
      duration: "1–2 years",
      level: "Beginner to Intermediate",
      order: 8,
    },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: course,
      create: course,
    });
  }

  const plans = [
    {
      name: "Basic",
      priceUsd: 50,
      classesPerWeek: 3,
      minutesPerClass: 30,
      features: ["3 Classes/Week", "30 Minutes Each", "One-to-one live sessions", "Flexible scheduling"],
      popular: false,
    },
    {
      name: "Standard",
      priceUsd: 70,
      classesPerWeek: 5,
      minutesPerClass: 30,
      features: ["5 Classes/Week", "30 Minutes Each", "One-to-one live sessions", "Flexible scheduling"],
      popular: true,
    },
    {
      name: "Premium",
      priceUsd: 99,
      classesPerWeek: 6,
      minutesPerClass: 45,
      features: ["6 Classes/Week", "45 Minutes Each", "One-to-one live sessions", "Flexible scheduling"],
      popular: false,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  const teachers = [
    {
      slug: "aisha-rahman",
      name: "Ustadha Aisha Rahman",
      gender: Gender.FEMALE,
      bio: "Al-Huda certified teacher with a patient, structured approach for girls and women. Specializes in Tajweed refinement and Hifz.",
      certifications: ["Al-Huda Certification", "Tajweed Ijazah pathway"],
      subjects: ["Tajweed", "Hifz-ul-Quran", "Norani Qaida"],
      rating: 5,
    },
    {
      slug: "fatima-siddiqui",
      name: "Ustadha Fatima Siddiqui",
      gender: Gender.FEMALE,
      bio: "Warm and encouraging with beginners — especially children overseas.",
      certifications: ["Al-Huda Certification", "Child education training"],
      subjects: ["Norani Qaida", "Nazra Quran", "Islamic Duas and Salah"],
      rating: 5,
    },
    {
      slug: "maryam-hassan",
      name: "Ustadha Maryam Hassan",
      gender: Gender.FEMALE,
      bio: "Helps students connect with the meaning of the Quran and the legacy of the Sahabiyat.",
      certifications: ["Al-Huda Certification", "Tafseer studies"],
      subjects: [
        "Quran Translation & Basic Tafseer",
        "Sahabiyat Course",
        "Personal Development & Life Skills",
      ],
      rating: 5,
    },
    {
      slug: "omar-farooq",
      name: "Ustadh Omar Farooq",
      gender: Gender.MALE,
      bio: "Experienced with boys and young men across UK, USA, and Canada time zones.",
      certifications: ["Al-Huda Certification", "Tajweed specialization"],
      subjects: ["Tajweed", "Nazra Quran", "Norani Qaida"],
      rating: 5,
    },
    {
      slug: "yusuf-ahmed",
      name: "Ustadh Yusuf Ahmed",
      gender: Gender.MALE,
      bio: "Guides dedicated students through structured Hifz with careful revision cycles.",
      certifications: ["Al-Huda Certification", "Hifz program training"],
      subjects: ["Hifz-ul-Quran", "Tajweed", "Nazra Quran"],
      rating: 5,
    },
    {
      slug: "ibrahim-malik",
      name: "Ustadh Ibrahim Malik",
      gender: Gender.MALE,
      bio: "Supports new Muslims and young beginners with Kalmas, Salah, daily duas, and early Quran reading.",
      certifications: ["Al-Huda Certification", "New Muslim mentoring"],
      subjects: ["Islamic Duas and Salah", "Norani Qaida", "Basic Rules of Arabic"],
      rating: 5,
    },
  ];

  for (const teacher of teachers) {
    await prisma.teacher.upsert({
      where: { slug: teacher.slug },
      update: teacher,
      create: teacher,
    });
  }

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Fatima Ahmed",
        location: "London, UK",
        rating: 5,
        quote:
          "My daughters have been learning with Dr Farhat Hashmi Online Quran Academy for 2 years. Having female teachers who understand our values has made such a difference. Highly recommend!",
        order: 1,
      },
      {
        name: "Mohammad Hassan",
        location: "Toronto, Canada",
        rating: 5,
        quote:
          "The male teachers here are incredibly patient with my son. His Tajweed has improved remarkably, and he looks forward to every class.",
        order: 2,
      },
      {
        name: "Aisha Khan",
        location: "New York, USA",
        rating: 5,
        quote:
          "Finding qualified female Quran teachers in America was challenging until we found Dr Farhat Hashmi Online Quran Academy. The flexible timings work perfectly with our schedule.",
        order: 3,
      },
    ],
  });

  await prisma.fAQ.deleteMany();
  await prisma.fAQ.createMany({
    data: [
      {
        question: "Do you offer a free trial class?",
        answer:
          "Yes. We offer 3 Days Free Trial Classes so your family can experience our teaching quality with no obligation or pressure.",
        order: 1,
      },
      {
        question: "How much do classes cost?",
        answer:
          "Packages start from just $50/month for the Basic plan (3 classes/week). Standard is $70/month and Premium is $99/month — all with transparent pricing and no hidden fees.",
        order: 2,
      },
      {
        question: "Do you have female teachers for girls?",
        answer:
          "Yes. We have qualified female teachers for girls and women, and male teachers for boys — so every student learns in a comfortable, values-aligned environment.",
        order: 3,
      },
      {
        question: "What platform are classes on (Zoom/Google Meet)?",
        answer:
          "Classes are conducted live over Zoom or Google Meet with audio and video, so students can learn from home anywhere in the world.",
        order: 4,
      },
      {
        question: "What are your class timings/time zones?",
        answer:
          "We offer flexible 24/7 availability to accommodate families in the UK, USA, Canada, the Gulf, and worldwide. You choose preferred days and times when you book.",
        order: 5,
      },
      {
        question: "Which courses suit beginners?",
        answer:
          "Beginners typically start with Norani Qaida with Tajweed, then progress to Nazra Quran. Islamic Duas and Salah is also ideal for children and new Muslims.",
        order: 6,
      },
      {
        question: "How do one-to-one sessions work?",
        answer:
          "Every student is paired with a dedicated teacher for personalized live sessions. This focused attention helps students progress faster with proper Tajweed and understanding.",
        order: 7,
      },
      {
        question: "How do I get started?",
        answer:
          "Book your 3 Days Free Trial Classes online, share your preferred schedule and teacher gender preference, and we will confirm your first class by email or WhatsApp.",
        order: 8,
      },
    ],
  });

  const admin = await prisma.user.findUnique({
    where: { email: "admin@dfhacademy.com" },
  });

  for (const post of blogPosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        contentJson: post.contentHtml,
        tags: post.tags,
        published: true,
        publishedAt: new Date(post.publishedAt),
        authorId: admin?.id,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        contentJson: post.contentHtml,
        tags: post.tags,
        published: true,
        publishedAt: new Date(post.publishedAt),
        authorId: admin?.id,
      },
    });
  }

  console.log(
    "Seed complete: users, courses, plans, teachers, testimonials, FAQs, posts",
  );
  console.log(
    "Demo logins (password Admin123!): admin@dfhacademy.com | teacher@dfhacademy.com | student@dfhacademy.com",
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
