import { SubscriptionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function mapStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "active":
      return SubscriptionStatus.ACTIVE;
    case "past_due":
      return SubscriptionStatus.PAST_DUE;
    case "canceled":
      return SubscriptionStatus.CANCELED;
    case "trialing":
      return SubscriptionStatus.TRIALING;
    default:
      return SubscriptionStatus.INCOMPLETE;
  }
}

async function upsertSubscriptionFromStripe(
  subscription: Stripe.Subscription,
  fallbackUserId?: string,
  fallbackPlanId?: string,
) {
  const userId =
    subscription.metadata.userId ||
    fallbackUserId ||
    (
      await prisma.user.findFirst({
        where: { stripeCustomerId: String(subscription.customer) },
        select: { id: true },
      })
    )?.id;

  const planId = subscription.metadata.planId || fallbackPlanId;
  if (!userId || !planId) {
    console.warn("[stripe:webhook] missing user/plan", {
      userId,
      planId,
      sub: subscription.id,
    });
    return;
  }

  const rawPeriodEnd =
    (subscription as Stripe.Subscription & { current_period_end?: number })
      .current_period_end ??
    subscription.items.data[0]?.current_period_end ??
    subscription.ended_at;
  const periodEnd = rawPeriodEnd ? new Date(rawPeriodEnd * 1000) : null;

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      planId,
      stripeSubId: subscription.id,
      status: mapStatus(subscription.status),
      currentPeriodEnd: periodEnd,
    },
    create: {
      userId,
      planId,
      stripeSubId: subscription.id,
      status: mapStatus(subscription.status),
      currentPeriodEnd: periodEnd,
    },
  });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { ok: false, message: "Stripe webhook not configured" },
      { status: 503 },
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe:webhook] signature", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            String(session.subscription),
          );
          await upsertSubscriptionFromStripe(
            sub,
            session.metadata?.userId,
            session.metadata?.planId,
          );
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscriptionFromStripe(sub);
        break;
      }
      case "invoice.paid":
      case "invoice.payment_failed":
      case "invoice.finalized": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = String(invoice.customer ?? "");
        const user = customerId
          ? await prisma.user.findFirst({
              where: { stripeCustomerId: customerId },
            })
          : null;
        if (user && invoice.id) {
          await prisma.invoice.upsert({
            where: { stripeInvoiceId: invoice.id },
            update: {
              amountUsd: Math.round((invoice.amount_paid || invoice.amount_due || 0) / 100),
              status: invoice.status ?? "unknown",
              pdfUrl: invoice.invoice_pdf,
              hostedUrl: invoice.hosted_invoice_url,
            },
            create: {
              userId: user.id,
              stripeInvoiceId: invoice.id,
              amountUsd: Math.round((invoice.amount_paid || invoice.amount_due || 0) / 100),
              status: invoice.status ?? "unknown",
              pdfUrl: invoice.invoice_pdf,
              hostedUrl: invoice.hosted_invoice_url,
            },
          });
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("[stripe:webhook] handler", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
