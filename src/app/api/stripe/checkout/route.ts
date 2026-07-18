import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { site } from "@/config/site";
import { appBaseUrl } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const schema = z.object({
  planName: z.enum(["Basic", "Standard", "Premium"]),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { ok: false, message: "Please sign in to subscribe." },
        { status: 401 },
      );
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local.",
        },
        { status: 503 },
      );
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: "Invalid plan." }, { status: 400 });
    }

    const plan = await prisma.plan.findUnique({
      where: { name: parsed.data.planName },
    });
    if (!plan) {
      return NextResponse.json({ ok: false, message: "Plan not found." }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json({ ok: false, message: "User not found." }, { status: 404 });
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const lineItem = plan.stripePriceId
      ? { price: plan.stripePriceId, quantity: 1 }
      : {
          price_data: {
            currency: "usd",
            unit_amount: plan.priceUsd * 100,
            recurring: { interval: "month" as const },
            product_data: {
              name: `${site.shortName} — ${plan.name}`,
              description: `${plan.classesPerWeek} classes/week · ${plan.minutesPerClass} min`,
            },
          },
          quantity: 1,
        };

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [lineItem],
      success_url: `${appBaseUrl()}/dashboard/billing?success=1`,
      cancel_url: `${appBaseUrl()}/courses#pricing`,
      metadata: {
        userId: user.id,
        planId: plan.id,
        planName: plan.name,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planId: plan.id,
        },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ ok: true, url: checkout.url });
  } catch (error) {
    console.error("[api/stripe/checkout]", error);
    return NextResponse.json(
      { ok: false, message: "Could not start checkout." },
      { status: 500 },
    );
  }
}
