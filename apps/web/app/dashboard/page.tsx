"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, FileText, LineChart, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GeneratedAsset, Usage, getRecentAssets, getUsage } from "@/lib/api";

function usageText(used: number, limit: number) {
  return `${used}/${limit}`;
}

function summarizeAsset(asset: GeneratedAsset) {
  if (asset.type === "hook" && Array.isArray(asset.output.hooks)) {
    const first = asset.output.hooks[0] as { hook?: string };
    return first?.hook || "Generated hooks";
  }
  if (asset.type === "script" && typeof asset.output.reel_hook === "string") {
    return asset.output.reel_hook;
  }
  return "Generated asset";
}

export default function DashboardPage() {
  const [usage, setUsage] = useState<Usage | null>(null);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getUsage(), getRecentAssets()])
      .then(([usageResponse, assetResponse]) => {
        setUsage(usageResponse);
        setAssets(assetResponse);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase text-coral">Dashboard</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Your creator intelligence workspace</h1>
        </div>
        <Link
          href="/dashboard/analyze"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-coral px-5 py-3 text-sm font-bold text-white hover:bg-[#d94f42]"
        >
          Analyze profile
          <BarChart3 className="h-4 w-4" />
        </Link>
      </div>

      {error ? <p className="rounded-md bg-[#ffe0dc] px-4 py-3 text-sm font-semibold text-[#9e2f24]">{error}</p> : null}

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile analyzer</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm leading-6 text-muted">
                Turn an Instagram profile link into the strategic signals needed to decide which trends are worth
                making.
              </p>
              <Link
                href="/dashboard/analyze"
                className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-bold text-white hover:bg-teal"
              >
                Open analyzer
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3">
              <div className="rounded-md border border-line bg-paper p-4">
                <p className="text-xs font-bold uppercase text-muted">Next step</p>
                <p className="mt-2 font-bold">Score trends after saving a profile.</p>
              </div>
              <div className="rounded-md border border-line bg-mint p-4 text-teal">
                <p className="text-xs font-bold uppercase">Creator fit engine</p>
                <p className="mt-2 font-bold">Profile signals power every trend score and generated asset.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent>
            {usage ? (
              <div className="grid gap-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-muted">Plan</span>
                  <Badge tone="teal">{usage.plan}</Badge>
                </div>
                <div className="grid gap-2 text-sm font-semibold">
                  <div className="flex justify-between gap-3">
                    <span>Profile analyses</span>
                    <span>{usageText(usage.profile_analyses_used, usage.limits.profile_analyses)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Hook generations</span>
                    <span>{usageText(usage.hook_generations_used, usage.limits.hook_generations)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Script generations</span>
                    <span>{usageText(usage.script_generations_used, usage.limits.script_generations)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">Loading usage...</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trend actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/dashboard/trends"
              className="flex min-h-24 items-center justify-between rounded-md border border-line bg-white p-4 font-bold hover:border-teal hover:text-teal"
            >
              Score trends
              <LineChart className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard/generate"
              className="flex min-h-24 items-center justify-between rounded-md border border-line bg-white p-4 font-bold hover:border-coral hover:text-coral"
            >
              Generate content
              <Wand2 className="h-5 w-5" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent generated assets</CardTitle>
          </CardHeader>
          <CardContent>
            {assets.length ? (
              <div className="grid gap-3">
                {assets.map((asset) => (
                  <div key={asset.id} className="rounded-md border border-line bg-paper p-3">
                    <div className="flex items-center justify-between gap-3">
                      <Badge tone={asset.type === "script" ? "saffron" : "teal"}>{asset.type}</Badge>
                      <FileText className="h-4 w-4 text-muted" />
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6">{summarizeAsset(asset)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-muted">Generated hooks and scripts will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
