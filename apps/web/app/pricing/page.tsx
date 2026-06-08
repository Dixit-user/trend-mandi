import Link from "next/link";
import { CheckCircle2, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "Rs 0",
    description: "For testing your creator fit workflow.",
    features: ["3 profile analyses per month", "10 hook generations", "3 Reel scripts", "Basic trend catalog"],
    cta: "Start free",
    href: "/dashboard/analyze"
  },
  {
    name: "Pro",
    price: "Coming soon",
    description: "For creators and small teams publishing weekly.",
    features: ["Higher generation limits", "Priority trend sources", "Saved workspaces", "Razorpay billing placeholder"],
    cta: "Preview Pro",
    href: "/dashboard"
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-bold text-teal">
          Trend Mandi
        </Link>
        <div className="mt-8 max-w-2xl">
          <p className="text-sm font-bold uppercase text-coral">Pricing</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Simple limits for the MVP.</h1>
          <p className="mt-4 text-base leading-7 text-muted">
            The subscription table is included now. Razorpay checkout and webhook integration are marked for the
            next build phase.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <section key={plan.name} className="rounded-md border border-line bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black">{plan.name}</h2>
                {plan.name === "Pro" ? <Sparkles className="h-5 w-5 text-saffron" /> : null}
              </div>
              <p className="mt-3 text-3xl font-black">{plan.price}</p>
              <p className="mt-3 text-sm leading-6 text-muted">{plan.description}</p>
              <div className="mt-6 grid gap-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm font-semibold">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href={plan.href}
                className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-teal"
              >
                {plan.cta}
              </Link>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
