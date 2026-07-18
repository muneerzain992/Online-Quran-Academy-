import type { Metadata } from "next";
import { auth } from "@/auth";
import { PortalButton } from "@/components/billing/PortalButton";
import { Card, Button } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { stripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const subscription = session?.user?.id
    ? await prisma.subscription.findUnique({
        where: { userId: session.user.id },
        include: { plan: true },
      })
    : null;
  const invoices = session?.user?.id
    ? await prisma.invoice.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 12,
      })
    : [];

  return (
    <div className="space-y-6">
      {params.success ? (
        <Card className="border-cyan/30 bg-cyan/10 text-sm text-foreground">
          Payment received — your subscription will appear here once Stripe
          confirms (webhook).
        </Card>
      ) : null}

      <Card>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Subscription
        </h2>
        {subscription ? (
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="text-muted">Plan:</span>{" "}
              <span className="text-foreground">{subscription.plan.name}</span>
            </p>
            <p>
              <span className="text-muted">Status:</span>{" "}
              <span className="text-sky">{subscription.status}</span>
            </p>
            {subscription.currentPeriodEnd ? (
              <p>
                <span className="text-muted">Renews:</span>{" "}
                {subscription.currentPeriodEnd.toLocaleDateString()}
              </p>
            ) : null}
            <div className="pt-3">
              <PortalButton />
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>No active subscription yet.</p>
            <Button href="/courses#pricing">View packages</Button>
            {!stripeConfigured() ? (
              <p className="text-xs text-gold">
                Add Stripe test keys to `.env.local` to enable checkout.
              </p>
            ) : null}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="font-display text-lg font-semibold text-foreground">
          Invoices
        </h2>
        <ul className="mt-4 space-y-3">
          {invoices.length === 0 ? (
            <li className="text-sm text-muted">No invoices yet.</li>
          ) : (
            invoices.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 text-sm"
              >
                <span className="text-foreground">
                  ${inv.amountUsd} · {inv.status}
                </span>
                {inv.hostedUrl || inv.pdfUrl ? (
                  <a
                    href={inv.hostedUrl ?? inv.pdfUrl ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky hover:underline"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-muted">
                    {inv.createdAt.toLocaleDateString()}
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
