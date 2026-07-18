import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { appBaseUrl } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { ok: false, message: "Stripe is not configured." },
        { status: 503 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { ok: false, message: "No billing customer found. Subscribe to a plan first." },
        { status: 400 },
      );
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appBaseUrl()}/dashboard/billing`,
    });

    return NextResponse.json({ ok: true, url: portal.url });
  } catch (error) {
    console.error("[api/stripe/portal]", error);
    return NextResponse.json(
      { ok: false, message: "Could not open billing portal." },
      { status: 500 },
    );
  }
}
