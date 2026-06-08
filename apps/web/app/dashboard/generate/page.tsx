"use client";

import Link from "next/link";
import { Clipboard, Loader2, ScrollText, Wand2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HookResponse, ScriptResponse, Trend, generateHooks, generateScript, getTrends } from "@/lib/api";
import { getStoredProfileId } from "@/lib/storage";
import { cn } from "@/lib/utils";

const styles = ["funny", "emotional", "controversial", "educational", "direct"] as const;

function selectClasses() {
  return "focus-ring min-h-11 w-full rounded-md border border-line bg-white px-3 text-sm font-semibold text-ink";
}

function scriptToText(script: ScriptResponse) {
  return [
    `Hook: ${script.reel_hook}`,
    "",
    ...script.scenes.map((scene) => `${scene.timestamp}: ${scene.visual}\nVO: ${scene.voiceover}`),
    "",
    `Voiceover: ${script.voiceover}`,
    `Caption: ${script.caption}`,
    `CTA: ${script.cta}`,
    `Hashtags: ${script.hashtags.join(" ")}`
  ].join("\n");
}

export default function GeneratePage() {
  const [profileId, setProfileId] = useState("");
  const [trends, setTrends] = useState<Trend[]>([]);
  const [trendId, setTrendId] = useState("");
  const [style, setStyle] = useState<(typeof styles)[number]>("educational");
  const [duration, setDuration] = useState(30);
  const [hooks, setHooks] = useState<HookResponse | null>(null);
  const [script, setScript] = useState<ScriptResponse | null>(null);
  const [loading, setLoading] = useState<"hooks" | "script" | "">("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    setProfileId(getStoredProfileId());
    getTrends()
      .then((result) => {
        setTrends(result);
        setTrendId(result[0]?.id || "");
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const selectedTrend = useMemo(() => trends.find((trend) => trend.id === trendId), [trendId, trends]);

  async function copyText(label: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1400);
  }

  async function runHooks() {
    if (!profileId || !trendId) {
      setError("Analyze a profile and select a trend before generating.");
      return;
    }
    setError("");
    setLoading("hooks");
    try {
      setHooks(await generateHooks({ profile_id: profileId, trend_id: trendId, style }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hook generation failed.");
    } finally {
      setLoading("");
    }
  }

  async function runScript() {
    if (!profileId || !trendId) {
      setError("Analyze a profile and select a trend before generating.");
      return;
    }
    setError("");
    setLoading("script");
    try {
      setScript(await generateScript({ profile_id: profileId, trend_id: trendId, duration_seconds: duration }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Script generation failed.");
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm font-bold uppercase text-coral">Generator</p>
        <h1 className="mt-2 text-3xl font-black text-ink">Create hooks and Reel scripts</h1>
      </div>

      {!profileId ? (
        <div className="flex flex-col justify-between gap-3 rounded-md border border-line bg-white p-4 sm:flex-row sm:items-center">
          <p className="text-sm font-semibold text-muted">No analyzed profile is active yet.</p>
          <Link
            href="/dashboard/analyze"
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-teal"
          >
            Analyze now
          </Link>
        </div>
      ) : null}

      {error ? <p className="rounded-md bg-[#ffe0dc] px-4 py-3 text-sm font-semibold text-[#9e2f24]">{error}</p> : null}

      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <label className="grid gap-2 text-sm font-semibold">
              Trend
              <select className={selectClasses()} value={trendId} onChange={(event) => setTrendId(event.target.value)}>
                {trends.map((trend) => (
                  <option key={trend.id} value={trend.id}>
                    {trend.title}
                  </option>
                ))}
              </select>
            </label>

            {selectedTrend ? (
              <div className="rounded-md border border-line bg-paper p-4">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="neutral">{selectedTrend.niche}</Badge>
                  <Badge tone="teal">{selectedTrend.format}</Badge>
                  <Badge tone={selectedTrend.freshness_label === "Fresh" ? "fresh" : selectedTrend.freshness_label === "Peaking" ? "peaking" : "overused"}>
                    {selectedTrend.freshness_label}
                  </Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{selectedTrend.description}</p>
              </div>
            ) : null}

            <label className="grid gap-2 text-sm font-semibold">
              Hook style
              <select className={selectClasses()} value={style} onChange={(event) => setStyle(event.target.value as typeof style)}>
                {styles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold">
              Script duration
              <select className={selectClasses()} value={duration} onChange={(event) => setDuration(Number(event.target.value))}>
                {[15, 30, 45, 60, 90].map((seconds) => (
                  <option key={seconds} value={seconds}>
                    {seconds} seconds
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button onClick={runHooks} disabled={loading === "hooks"}>
                {loading === "hooks" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                Generate hooks
              </Button>
              <Button variant="secondary" onClick={runScript} disabled={loading === "script"}>
                {loading === "script" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScrollText className="h-4 w-4" />}
                Generate script
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Hooks</CardTitle>
                {hooks ? (
                  <Button
                    variant="outline"
                    className="min-h-9 px-3"
                    onClick={() => copyText("hooks", hooks.hooks.map((item) => item.hook).join("\n"))}
                  >
                    <Clipboard className="h-4 w-4" />
                    {copied === "hooks" ? "Copied" : "Copy"}
                  </Button>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              {hooks ? (
                <div className="grid gap-3">
                  {hooks.hooks.map((item, index) => (
                    <div key={item.hook} className="rounded-md border border-line bg-paper p-4">
                      <p className="text-xs font-bold uppercase text-coral">Hook {index + 1}</p>
                      <p className="mt-2 text-sm font-bold leading-6 text-ink">{item.hook}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{item.why_it_works}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-muted">Generated hooks appear here.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Reel script</CardTitle>
                {script ? (
                  <Button variant="outline" className="min-h-9 px-3" onClick={() => copyText("script", scriptToText(script))}>
                    <Clipboard className="h-4 w-4" />
                    {copied === "script" ? "Copied" : "Copy"}
                  </Button>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              {script ? (
                <div className="grid gap-4">
                  <div className="rounded-md bg-ink p-4 text-white">
                    <p className="text-xs font-bold uppercase text-[#b9fff7]">Reel hook</p>
                    <p className="mt-2 text-sm font-bold leading-6">{script.reel_hook}</p>
                  </div>
                  <div className="grid gap-3">
                    {script.scenes.map((scene) => (
                      <div key={scene.timestamp} className="rounded-md border border-line bg-paper p-4">
                        <p className="text-xs font-bold uppercase text-teal">{scene.timestamp}</p>
                        <p className="mt-2 text-sm font-bold leading-6 text-ink">{scene.visual}</p>
                        <p className="mt-2 text-sm leading-6 text-muted">{scene.voiceover}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-3">
                    {[
                      ["Caption", script.caption],
                      ["CTA", script.cta],
                      ["Hashtags", script.hashtags.join(" ")]
                    ].map(([label, value]) => (
                      <div key={label} className={cn("rounded-md border border-line bg-white p-4")}>
                        <p className="text-xs font-bold uppercase text-muted">{label}</p>
                        <p className="mt-2 text-sm leading-6 text-ink">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-6 text-muted">Generated scripts appear here.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
