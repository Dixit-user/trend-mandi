"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, Loader2, Radar, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ProfileAnalysis, analyzeProfile } from "@/lib/api";
import { storeProfileId } from "@/lib/storage";

const analysisFields: Array<[keyof ProfileAnalysis, string]> = [
  ["niche", "Niche"],
  ["tone", "Tone"],
  ["language", "Language"],
  ["audience_type", "Audience"],
  ["content_style", "Content style"]
];

export default function AnalyzePage() {
  const [instagramHandle, setInstagramHandle] = useState("");
  const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await analyzeProfile({
        instagram_handle: instagramHandle.trim()
      });
      setAnalysis(result);
      storeProfileId(result.profile_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profile analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="overflow-hidden rounded-md border border-line bg-ink text-white shadow-soft">
        <div className="relative px-5 py-6 sm:px-6">
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase text-[#b9fff7]">Analyzer</p>
              <h1 className="mt-2 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl">
                Convert a profile link into a creator-fit brief.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/72">
                Use the brief to rank trends, generate hooks, and build content that feels native to the account.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {["Signals", "Fit", "Assets"].map((item) => (
                <div key={item} className="rounded-md border border-white/12 bg-white/8 px-3 py-2">
                  <p className="text-xs font-black uppercase text-white/58">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-mint text-teal">
                <Radar className="h-4 w-4" />
              </span>
              <CardTitle>Profile input</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">
                Instagram profile link or handle
                <Input
                  value={instagramHandle}
                  onChange={(event) => setInstagramHandle(event.target.value)}
                  placeholder="https://instagram.com/creatorname"
                  required
                />
              </label>
              <p className="rounded-md bg-[#fff0cf] px-3 py-2 text-sm font-semibold leading-6 text-[#8a5a00]">
                Paste a public Instagram profile link or handle. Trend Mandi will build a creator-fit profile for
                trend scoring and content generation.
              </p>
              <div className="grid gap-2 rounded-md border border-line bg-paper p-3">
                {["Niche and content category", "Tone and language pattern", "Audience and format clues"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-semibold text-muted">
                    <CheckCircle2 className="h-4 w-4 text-teal" />
                    {item}
                  </div>
                ))}
              </div>
              {error ? <p className="rounded-md bg-[#ffe0dc] px-3 py-2 text-sm font-semibold text-[#9e2f24]">{error}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
                {loading ? "Analyzing..." : "Analyze profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#ffe0dc] text-[#9e2f24]">
                  <Sparkles className="h-4 w-4" />
                </span>
                <CardTitle>Creator brief</CardTitle>
              </div>
              {analysis ? <Badge tone="teal">{analysis.confidence}% confidence</Badge> : null}
            </div>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="grid gap-4">
                <div className="rounded-md border border-line bg-mint p-4">
                  <p className="text-xs font-bold uppercase text-teal">Analysis source</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-ink">{analysis.source_note}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {analysisFields.map(([key, label]) => (
                    <div key={key} className="rounded-md border border-line bg-paper p-4">
                      <p className="text-xs font-bold uppercase text-muted">{label}</p>
                      <p className="mt-2 text-sm font-bold leading-6 text-ink">{String(analysis[key])}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-md border border-line bg-white p-4">
                  <p className="text-xs font-bold uppercase text-muted">Summary</p>
                  <p className="mt-2 text-sm leading-6 text-ink">{analysis.summary}</p>
                </div>
                <Link
                  href="/dashboard/trends"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-bold text-white hover:bg-teal"
                >
                  Score matching trends
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="grid min-h-80 place-items-center rounded-md border border-dashed border-line bg-paper p-6 text-center">
                <div className="max-w-sm">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-white text-teal shadow-soft">
                    <BarChart3 className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-base font-black text-ink">Your creator brief will appear here.</p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Profile signals are saved automatically and used for trend matching in the next step.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
