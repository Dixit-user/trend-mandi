"use client";

import Link from "next/link";
import { Loader2, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trend, TrendMatch, getTrends, matchTrend } from "@/lib/api";
import { getStoredProfileId } from "@/lib/storage";

function freshnessTone(label: Trend["freshness_label"]) {
  if (label === "Fresh") return "fresh";
  if (label === "Peaking") return "peaking";
  return "overused";
}

export default function TrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [matches, setMatches] = useState<Record<string, TrendMatch>>({});
  const [loadingTrendId, setLoadingTrendId] = useState("");
  const [profileId, setProfileId] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setProfileId(getStoredProfileId());
    getTrends()
      .then(setTrends)
      .catch((err: Error) => setError(err.message));
  }, []);

  const filteredTrends = useMemo(() => {
    const search = query.toLowerCase().trim();
    if (!search) return trends;
    return trends.filter((trend) =>
      [trend.title, trend.niche, trend.description, trend.format].some((value) => value.toLowerCase().includes(search))
    );
  }, [query, trends]);

  async function calculate(trendId: string) {
    if (!profileId) {
      setError("Analyze a profile before calculating match scores.");
      return;
    }
    setError("");
    setLoadingTrendId(trendId);
    try {
      const result = await matchTrend({ profile_id: profileId, trend_id: trendId });
      setMatches((current) => ({ ...current, [trendId]: result }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trend scoring failed.");
    } finally {
      setLoadingTrendId("");
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase text-coral">Trends</p>
          <h1 className="mt-2 text-3xl font-black text-ink">Score trend fit</h1>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted" />
          <Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search niche or format" />
        </div>
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTrends.map((trend) => {
          const match = matches[trend.id];
          return (
            <Card key={trend.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{trend.title}</CardTitle>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge tone="neutral">{trend.niche}</Badge>
                      <Badge tone={freshnessTone(trend.freshness_label)}>{trend.freshness_label}</Badge>
                      <Badge tone="teal">{trend.format}</Badge>
                    </div>
                  </div>
                  {match ? (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-ink text-sm font-black text-white">
                      {match.score}
                    </span>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p className="text-sm leading-6 text-muted">{trend.description}</p>
                {match ? (
                  <div className="grid gap-3">
                    <div className="h-2 rounded-full bg-[#e7eee9]">
                      <div className="h-2 rounded-full bg-teal" style={{ width: `${match.score}%` }} />
                    </div>
                    <p className="text-sm leading-6 text-ink">{match.reason}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-muted">
                      {Object.entries(match.breakdown).map(([key, value]) => (
                        <span key={key} className="rounded-md bg-paper px-2 py-2">
                          {key.replaceAll("_", " ")}: {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                <Button onClick={() => calculate(trend.id)} disabled={loadingTrendId === trend.id}>
                  {loadingTrendId === trend.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {match ? "Recalculate score" : "Calculate score"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
