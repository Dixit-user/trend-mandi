"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function getSupabaseConfigError() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const url = rawUrl?.trim();
  const anonKey = rawAnonKey?.trim();

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

  if (anonKey.split(".").length < 3) {
    return "Supabase anon key looks invalid. Use the anon public key from Supabase API settings.";
  }

  return null;
}

export function supabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() &&
      !getSupabaseConfigError()
  );
}

export function getSupabaseClient() {
  if (!supabaseConfigured()) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    );
  }

  return browserClient;
}
