# Dr Farhat Hashmi Online Quran Academy

Premium full-stack website for an online Quran academy serving overseas Muslim families.

> **Brand & contact** live in [`src/config/site.ts`](src/config/site.ts). Change phone, email, or socials there — nowhere else.

## Phase status

| Phase | Status |
| --- | --- |
| 1. Scaffold (theme, layout, config) | Done |
| 2. Design system + motion | Done |
| 3. Home page (full copy) | Done |
| 4. 3D hero | Done |
| 5. Inner pages | Done |
| 6. Backend + email | Done |
| 7. Auth + dashboards | Done |
| 8. Stripe | Done |
| 9. CMS / admin | Done |
| 10. Blog + search | Done |
| 11. i18n, SEO, a11y | Done |
| 12. Polish + deploy | Done |

## Local setup

```bash
npm install
cp .env.example .env.local
# edit .env.local — at minimum DATABASE_URL, AUTH_SECRET, NEXT_PUBLIC_SITE_URL
docker compose up -d          # local Postgres
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts (after seed)

Password for all: `Admin123!`

| Role | Email |
| --- | --- |
| Admin | admin@dfhacademy.com |
| Teacher | teacher@dfhacademy.com |
| Student | student@dfhacademy.com |

### Email

1. **Resend** — `RESEND_API_KEY` + `EMAIL_FROM`, or  
2. **SMTP** — `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS`, or  
3. **Dev Ethereal** — automatic in development (preview URL in terminal).

### Stripe

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Pricing “Get Started” opens Checkout (sign-in required). Student billing: `/dashboard/billing`.

## Deploy to Vercel

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com).
2. Provision **Postgres** (Neon, Supabase, or Vercel Postgres) and set `DATABASE_URL`.
3. Add environment variables from [`.env.example`](.env.example), especially:

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Hosted Postgres connection string |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | Long random string |
| `AUTH_URL` / `NEXTAUTH_URL` | `https://your-domain.vercel.app` |
| `NEXT_PUBLIC_SITE_URL` | Same public URL (sitemap/OG/RSS) |
| `EMAIL_FROM` + `RESEND_API_KEY` or SMTP | Transactional mail |
| `ADMIN_EMAIL` | Booking/contact notifications |
| `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` | Live or test |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional for client UI |

4. In Vercel project settings, set **Build Command** to `prisma generate && next build` (also in `vercel.json`).
5. After the first deploy, run against production DB:

```bash
DATABASE_URL="your-production-url" npx prisma db push
DATABASE_URL="your-production-url" npm run db:seed
```

6. Stripe webhook endpoint: `https://your-domain/api/stripe/webhook`.
7. Enable **Vercel Analytics** in the project dashboard (package already wired).

### Social links

Configured in `site.ts`: Facebook, Instagram, TikTok, WhatsApp. Shown with logos in the footer and on `/contact`.

## Performance & Lighthouse

Targets from the product brief: **≥ 90 desktop / ≥ 80 mobile** Performance.

Already in place:

- Lazy-loaded R3F hero with CSS fallback + reduced-motion
- `next/image` for logo; AVIF/WebP formats enabled
- Transform/opacity motion; Lenis/GSAP respect reduced motion
- Security headers via `next.config.ts`
- Dynamic OG image at `/opengraph-image`
- Sitemap + robots + JSON-LD

**Before launch, run Lighthouse** in Chrome DevTools (or PageSpeed Insights) on production:

```bash
npm run build && npm run start
# open http://localhost:3000 → DevTools → Lighthouse
```

Tips if scores dip: keep 3D disabled on low-power devices (already gated), compress `public/logo.png`, and avoid loading Stripe/email SDKs on marketing pages (API-only today).

## Scripts

- `npm run dev` — development server
- `npm run build` — `prisma generate` + production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
- `npm run db:push` — sync Prisma schema to Postgres
- `npm run db:seed` — seed users, courses, plans, teachers, FAQs, testimonials, posts
- `npm run db:studio` — Prisma Studio

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Prisma · Auth.js · Stripe · next-intl (EN/UR/AR + RTL) · Resend / React Email · Framer Motion / GSAP / Lenis · R3F · TipTap CMS · Vercel Analytics

Language: navbar EN / اردو / العربية switcher (cookie-based). Set `NEXT_PUBLIC_SITE_URL` for sitemap/OG/RSS.
