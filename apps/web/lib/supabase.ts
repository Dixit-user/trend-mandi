"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

function cleanEnvValue(value: string | undefined) {
  return value?.trim().replace(/^['"]|['"]$/g, "").trim();
}

function getSupabaseConfig() {
  const url = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return { url, anonKey };
}

export function getSupabaseConfigError() {
  const { url, anonKey } = getSupabaseConfig();

  if (!url && !anonKey) {
    return null;
  }

  if (!url || !anonKey) {
    return "Supabase URL and anon key must both be set in Vercel.";
  }

  try {
    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return "Supabase URL must start with https://.";
    }
  } catch {
    return "Supabase URL is invalid. Use the Project URL from Supabase API settings.";
  }

  if (/\s/.test(anonKey)) {
    return "Supabase anon key has spaces or line breaks. Paste it again as one line.";
  }

  if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(anonKey)) {
    return "Supabase anon key looks invalid. Use the anon public key from Supabase API settings.";
  }

  return null;
}

export function supabaseConfigured() {
  const { url, anonKey } = getSupabaseConfig();

  return Boolean(
    url &&
      anonKey &&
      !getSupabaseConfigError()
  );
}

export function getSupabaseClient() {
  if (!supabaseConfigured()) {
    return null;
  }

  if (!browserClient) {
    const { url, anonKey } = getSupabaseConfig();
    browserClient = createClient(url as string, anonKey as string);
  }

  return browserClient;
}
