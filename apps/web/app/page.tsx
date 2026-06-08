import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, LineChart, PenLine, Sparkles, Wand2 } from "lucide-react";

const steps = [
  {
    title: "Analyze your style",
    copy: "Paste captions or add a handle. Trend Mandi reads niche, tone, language, audience, and format."
  },
  {
    title: "Match trends",
    copy: "Mock trend data is scored with a deterministic fit model before third-party trend APIs are needed."
  },
  {
    title: "Generate assets",
    copy: "Turn the best matches into hooks, captions, and Reel scripts in your creator voice."
  }
];

const problems = ["Copied trends feel off-brand", "Generic hooks waste good ideas", "Creators need fit, not just freshness"];

function HeroDashboardVisual() {
  return (
    <div className="relative min-h-[420px] w-full overflow-hidden rounded-md border border-line bg-white p-4 shadow-soft">
      <div className="grid gap-3">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <p className="text-xs font-semibold uppercase text-muted">Trend fit</p>
            <p className="text-lg font-black text-ink">Creator dashboard</p>
          </div>
          <span className="rounded-md bg-mint px-3 py-1 text-xs font-bold text-teal">Live MVP</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["Niche", "Tone", "Language"].map((label, index) => (
            <div key={label} className="rounded-md border border-line bg-paper p-3">
              <p className="text-xs font-semibold text-muted">{label}</p>
              <p className="mt-2 text-sm font-bold text-ink">
                {index === 0 ? "Business" : index === 1 ? "Direct" : "Hinglish"}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-md border border-line bg-[#f7fbfb] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="font-bold text-ink">AI tool stack for solo creators</p>
            <span className="rounded-md bg-[#fff0cf] px-2 py-1 text-xs font-bold text-[#8a5a00]">92</span>
          </div>
          <div className="h-2 rounded-full bg-[#e7eee9]">
            <div className="h-2 w-[92%] rounded-full bg-teal" />
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">
            Strong niche similarity, useful educational format, and a fresh enough trend window.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-line p-4">
            <p className="text-xs font-semibold uppercase text-coral">Hook</p>
            <p className="mt-2 text-sm font-bold leading-6 text-ink">
              Stop copying AI tool lists. Build the one your audience will actually use.
            </p>
          </div>
          <div className="rounded-md border border-line p-4">
            <p className="text-xs font-semibold uppercase text-teal">Script</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              0-3s hook, 4-12s workflow, 13-24s proof, final CTA for comments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-paper text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-black">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-white">
              <PenLine className="h-5 w-5" />
            </span>
            Trend Mandi
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/pricing" className="rounded-md px-3 py-2 text-sm font-semibold text-muted hover:text-ink">
              Pricing
            </Link>
            <Link href="/auth/signin" className="rounded-md px-3 py-2 text-sm font-semibold text-muted hover:text-ink">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-teal"
            >
              Start
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-line bg-[#fbf1e4]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-14">
          <div>
            <p className="mb-4 inline-flex rounded-md bg-white px-3 py-1 text-xs font-bold uppercase text-teal">
              Built for Indian creators
            </p>
            <h1 className="max-w-2xl text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
              Find trends that actually fit your creator style
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
              Trend Mandi turns captions into a creator profile, scores trend fit, and generates hooks and Reel
              scripts without exposing your OpenAI key in the browser.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/analyze"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-coral px-5 py-3 text-sm font-bold text-white hover:bg-[#d94f42]"
              >
                Analyze captions
                <BarChart3 className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/trends"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-white px-5 py-3 text-sm font-bold text-ink hover:border-teal hover:text-teal"
              >
                View trends
                <LineChart className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <HeroDashboardVisual />
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-coral">Problem</p>
            <h2 className="mt-2 text-3xl font-black">Trend chasing breaks creator trust.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {problems.map((problem) => (
              <div key={problem} className="rounded-md border border-line bg-paper p-4">
                <CheckCircle2 className="h-5 w-5 text-teal" />
                <p className="mt-3 text-sm font-bold leading-6">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase text-teal">How it works</p>
              <h2 className="mt-2 text-3xl font-black">From captions to content assets.</h2>
            </div>
            <Sparkles className="hidden h-8 w-8 text-saffron sm:block" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-md border border-line bg-white p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-sm font-black text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-black">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-coral">Pricing</p>
            <h2 className="mt-2 text-3xl font-black">Start free, upgrade when Razorpay lands.</h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              Free includes profile analysis, hook generation, script generation, and basic trends. Pro is wired as
              a product surface with backend placeholders for subscription enforcement.
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-teal sm:w-auto md:justify-self-end"
          >
            See pricing
            <Wand2 className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
