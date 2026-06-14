"use client";

import { getSupabaseClient } from "@/lib/supabase";

function cleanEnvValue(value: string | undefined) {
  return value?.trim().replace(/^['"]|['"]$/g, "").trim();
}

function runningLocally() {
  if (typeof window === "undefined") {
    return process.env.NODE_ENV !== "production";
  }

  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

function getConfiguredApiBaseUrl() {
  const apiBaseUrl = cleanEnvValue(process.env.NEXT_PUBLIC_API_BASE_URL);
  if (apiBaseUrl) {
    return apiBaseUrl.replace(/\/$/, "");
  }

  if (runningLocally()) {
    return "http://localhost:8000";
  }

  return "";
}

const API_BASE_URL = getConfiguredApiBaseUrl();

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("API URL is missing. Add NEXT_PUBLIC_API_BASE_URL in Vercel, then redeploy.");
  }

  try {
    return new URL(API_BASE_URL).toString().replace(/\/$/, "");
  } catch {
    throw new Error("API URL is invalid. Check NEXT_PUBLIC_API_BASE_URL in Vercel.");
  }
}

export type ProfileAnalysis = {
  profile_id: string;
  source: string;
  source_note: string;
  niche: string;
  tone: string;
  language: string;
  audience_type: string;
  content_style: string;
  summary: string;
  confidence: number;
};

export type Trend = {
  id: string;
  title: string;
  niche: string;
  description: string;
  format: string;
  freshness_label: "Fresh" | "Peaking" | "Overused";
  source: string;
  first_seen_at?: string | null;
};

export type TrendMatch = {
  score: number;
  reason: string;
  breakdown: {
    niche_similarity: number;
    tone_fit: number;
    freshness: number;
    format_fit: number;
    audience_relevance: number;
  };
};

export type RecommendedTrend = Trend & TrendMatch;

export type Usage = {
  plan: string;
  profile_analyses_used: number;
  hook_generations_used: number;
  script_generations_used: number;
  limits: {
    profile_analyses: number;
    hook_generations: number;
    script_generations: number;
  };
};

export type HookResponse = {
  hooks: Array<{
    hook: string;
    why_it_works: string;
  }>;
};

export type ScriptResponse = {
  reel_hook: string;
  scenes: Array<{
    timestamp: string;
    visual: string;
    voiceover: string;
  }>;
  voiceover: string;
  caption: string;
  cta: string;
  hashtags: string[];
};

export type GeneratedAsset = {
  id: string;
  type: string;
  output: Record<string, unknown>;
  created_at: string;
};

async function accessToken() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await accessToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const detail = typeof payload.detail === "string" ? payload.detail : "Request failed.";
    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

export function analyzeProfile(input: { instagram_handle: string }) {
  return apiFetch<ProfileAnalysis>("/profile/analyze", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function getTrends() {
  return apiFetch<Trend[]>("/trends");
}

export function getRecommendedTrends(profileId: string) {
  return apiFetch<RecommendedTrend[]>(`/trends/recommended/${profileId}`);
}

export function matchTrend(input: { profile_id: string; trend_id: string }) {
  return apiFetch<TrendMatch>("/trends/match", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function generateHooks(input: {
  profile_id: string;
  trend_id: string;
  style: "funny" | "emotional" | "controversial" | "educational" | "direct";
}) {
  return apiFetch<HookResponse>("/generate/hooks", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function generateScript(input: { profile_id: string; trend_id: string; duration_seconds: number }) {
  return apiFetch<ScriptResponse>("/generate/script", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function getUsage() {
  return apiFetch<Usage>("/usage/me");
}

export function getRecentAssets() {
  return apiFetch<GeneratedAsset[]>("/generate/recent");
}
