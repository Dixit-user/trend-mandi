"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfileAnalysis, analyzeProfile } from "@/lib/api";
import { storeProfileId } from "@/lib/storage";

function parseCaptions(value: string) {
  return value
    .split(/\n+/)
    .map((caption) => caption.trim())
    .filter(Boolean)
    .slice(0, 10);
}

const analysisFields: Array<[keyof ProfileAnalysis, string]> = [
  ["niche", "Niche"],
  ["tone", "Tone"],
  ["language", "Language"],
  ["audience_type", "Audience"],
  ["content_style", "Content style"]
];

export default function AnalyzePage() {
  const [instagramHandle, setInstagramHandle] = useState("");
  const [captionText, setCaptionText] = useState("");
  const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await analyzeProfile({
        instagram_handle: instagramHandle.trim() || undefined,
        captions: parseCaptions(captionText)
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
      <div>
        <p className="text-sm font-bold uppercase text-coral">Analyzer</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Analyze creator profile</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">
                Instagram handle
                <Input
                  value={instagramHandle}
                  onChange={(event) => setInstagramHandle(event.target.value)}
                  placeholder="@trendmandi"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Captions
                <Textarea
                  value={captionText}
                  onChange={(event) => setCaptionText(event.target.value)}
                  placeholder={"How I plan a Reel in 20 minutes\n3 mistakes creators make before recording\nThis workflow saved my week"}
                />
              </label>
              {error ? <p className="rounded-md bg-[#ffe0dc] px-3 py-2 text-sm font-semibold text-[#9e2f24]">{error}</p> : null}
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
                {loading ? "Analyzing..." : "Analyze profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Profile output</CardTitle>
              {analysis ? <Badge tone="teal">{analysis.confidence}% confidence</Badge> : null}
            </div>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="grid gap-4">
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
              <div className="grid min-h-64 place-items-center rounded-md border border-dashed border-line bg-paper p-6 text-center">
                <p className="max-w-sm text-sm leading-6 text-muted">
                  Profile signals appear after analysis and are saved for trend matching.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
