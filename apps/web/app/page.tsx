import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Flame,
  LineChart,
  LockKeyhole,
  PenLine,
  Radar,
  Sparkles,
  Target,
  TrendingUp,
  Wand2
} from "lucide-react";

const steps = [
  {
    title: "Profile intelligence",
    copy: "Paste an Instagram profile link and extract the signals that matter: niche, tone, language, style, and audience."
  },
  {
    title: "Fit-ranked trends",
    copy: "Compare opportunities by niche match, tone fit, freshness, format fit, and audience relevance."
  },
  {
    title: "Publish-ready direction",
    copy: "Turn matching trends into hooks, Reel scripts, captions, CTAs, and hashtags with a clear content angle."
  }
];

const scoreRows = [
  { label: "Niche similarity", value: 35, width: "w-[92%]" },
  { label: "Tone fit", value: 25, width: "w-[86%]" },
  { label: "Freshness", value: 20, width: "w-[76%]" },
  { label: "Audience relevance", value: 10, width: "w-[88%]" }
];

const useCases = [
  "Creators planning weekly Reels",
  "Local brands testing content angles",
  "Agencies preparing client briefs",
  "Founders turning market questions into posts"
];

const proofPoints = [
  { value: "5", label: "profile signals" },
  { value: "100", label: "fit score scale" },
  { value: "3", label: "asset types" },
  { value: "1", label: "focused workflow" }
];

const signalPills = ["Niche", "Tone", "Language", "Audience", "Format", "Freshness"];

const decisionCards = [
  {
    title: "Creator profile",
    copy: "A clean strategic read of what the account is about and who it speaks to.",
    icon: Radar,
    tone: "bg-mint text-teal"
  },
  {
    title: "Trend fit",
    copy: "A weighted score so creators can skip trends that look popular but feel wrong.",
    icon: Target,
    tone: "bg-[#fff0cf] text-[#8a5a00]"
  },
  {
    title: "Content direction",
    copy: "Hooks, scripts, CTAs, and hashtags shaped around the creator's actual positioning.",
    icon: Wand2,
    tone: "bg-[#ffe0dc] text-[#9e2f24]"
  }
];

function BrandMark() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-ink shadow-soft">
      <PenLine className="h-5 w-5" />
    </span>
  );
}

function ProductScene() {
  return (
    <div className="relative min-h-[540px] overflow-hidden rounded-md border border-white/12 bg-[#20232d] p-4 shadow-soft lg:min-h-[620px]">
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute right-5 top-5 hidden rounded-md border border-white/12 bg-white/10 px-3 py-2 text-xs font-black uppercase text-white/72 backdrop-blur sm:block">
        Live workspace
      </div>
      <div className="relative grid h-full gap-4">
        <div className="rounded-md border border-white/12 bg-white p-4 text-ink shadow-soft">
          <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
            <div>
              <p className="text-xs font-black uppercase text-muted">Profile analysis</p>
              <p className="mt-1 text-lg font-black">instagram.com/fitcoachdelhi</p>
            </div>
            <span className="rounded-md bg-mint px-3 py-1 text-xs font-black text-teal">Fit profile</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["Fitness", "Educational", "Short-form Reels"].map((item) => (
              <div key={item} className="rounded-md border border-line bg-paper p-3">
                <p className="text-xs font-bold uppercase text-muted">{item.split(" ")[0]}</p>
                <p className="mt-2 text-sm font-black">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {signalPills.map((item) => (
              <span key={item} className="rounded-md border border-line bg-white px-2.5 py-1 text-xs font-black text-muted">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-md border border-white/12 bg-[#10131b] p-4 text-white shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black">Trend Match Score</p>
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-coral text-sm font-black shadow-soft">93</span>
            </div>
            <div className="mt-5 grid gap-4">
              {scoreRows.map((row) => (
                <div key={row.label}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-white/72">
                    <span>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/12">
                    <div className={`h-2 rounded-full bg-teal ${row.width}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-white/12 bg-white p-4 text-ink shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-coral">Recommended trend</p>
                <h2 className="mt-2 text-xl font-black leading-7">What I eat in a high-protein Indian day</h2>
              </div>
              <TrendingUp className="h-5 w-5 shrink-0 text-teal" />
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">Strong niche match, educational tone, saveable format, and high relevance for beginners.</p>
            <div className="mt-4 grid gap-2">
              {["Hook: Stop copying diet reels that do not fit Indian meals.", "CTA: Comment your goal and save this plan."].map((item) => (
                <div key={item} className="rounded-md border border-line bg-paper px-3 py-2 text-sm font-bold leading-6">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-md border border-white/12 bg-[#f4a62a] p-4 text-ink shadow-soft">
            <p className="text-xs font-black uppercase">Output</p>
            <p className="mt-2 text-base font-black">30-second Reel script with hook, scene beats, voiceover, caption, CTA, and hashtags.</p>
          </div>
          <div className="rounded-md border border-white/12 bg-white/10 p-4 text-white backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-white/70">
              <Clock3 className="h-4 w-4 text-[#f4a62a]" />
              Decision time
            </div>
            <p className="mt-2 text-2xl font-black">2 min</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-paper text-ink">
      <section className="relative min-h-[88svh] overflow-hidden border-b border-line bg-ink text-white">
        <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle_at_20%_20%,#39c9bd_0,transparent_24%),radial-gradient(circle_at_80%_10%,#f4a62a_0,transparent_18%),linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:100%_100%,100%_100%,56px_56px,56px_56px]" />
        <header className="relative">
          <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3 font-black">
              <BrandMark />
              Trend Mandi
            </Link>
            <nav className="flex items-center gap-2">
              <Link href="/pricing" className="rounded-md px-3 py-2 text-sm font-semibold text-white/72 hover:text-white">
                Pricing
              </Link>
              <Link href="/auth/signin" className="rounded-md px-3 py-2 text-sm font-semibold text-white/72 hover:text-white">
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex min-h-10 items-center gap-2 rounded-md bg-coral px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-[#d94f42]"
              >
                Start
                <ArrowRight className="h-4 w-4" />
              </Link>
            </nav>
          </div>
        </header>

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:px-8 lg:pb-14 lg:pt-16">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-md border border-white/16 bg-white/8 px-3 py-1 text-xs font-bold uppercase text-[#b9fff7]">
              Creator trend intelligence
            </p>
            <h1 className="text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              Stop guessing trends. Start ranking creator fit.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-white/78 sm:text-xl">
              Trend Mandi turns an Instagram profile into a content decision system: profile signals, trend fit scores,
              and ready-to-shape Reel directions in one focused workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/analyze"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-coral px-5 py-3 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#d94f42]"
              >
                Analyze profile link
                <BarChart3 className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard/trends"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/20 bg-white/8 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                Explore trend fit
                <LineChart className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
              {proofPoints.map((item) => (
                <div key={item.label} className="border-l border-white/18 pl-3">
                  <p className="text-xl font-black text-white">{item.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase leading-5 text-white/58">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <ProductScene />
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-coral">Why it matters</p>
            <h2 className="mt-2 text-3xl font-black leading-tight">Trend hunting is easy. Fit is where creators win.</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Avoid off-brand trend chasing", Flame],
              ["Generate from positioning, not prompts", Wand2],
              ["Protect backend keys and auth flows", LockKeyhole]
            ].map(([title, Icon]) => (
              <div key={String(title)} className="rounded-md border border-line bg-paper p-4">
                <Icon className="h-5 w-5 text-teal" />
                <p className="mt-3 text-sm font-bold leading-6">{String(title)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 pt-12 sm:px-6 md:grid-cols-3 lg:px-8">
          {decisionCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="rounded-md border border-line bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-teal">
                <span className={`flex h-11 w-11 items-center justify-center rounded-md ${card.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-black">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{card.copy}</p>
              </div>
            );
          })}
        </div>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase text-teal">Workflow</p>
              <h2 className="mt-2 text-3xl font-black">From profile link to content plan.</h2>
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

      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-coral">Built for</p>
            <h2 className="mt-2 text-3xl font-black leading-tight">Creators who need direction before generation.</h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              Trend Mandi keeps the experience focused: understand the creator, rank the opportunity, then create the
              asset. The product is intentionally narrow so the decision feels fast.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {useCases.map((item) => (
              <div key={item} className="flex min-h-16 items-center gap-3 rounded-md border border-line bg-paper px-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-teal" />
                <span className="text-sm font-bold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff7ea]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase text-coral">Pricing</p>
            <h2 className="mt-2 text-3xl font-black">Start with the creator workflow today.</h2>
            <p className="mt-4 text-sm leading-6 text-muted">
              Use the free plan to analyze profiles, match trends, and generate content direction. Pro is designed for
              creators and teams who need higher limits and saved workflows.
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
