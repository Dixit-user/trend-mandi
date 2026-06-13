"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getSupabaseClient, supabaseConfigured } from "@/lib/supabase";

export function GoogleOAuthButton({ label, onError }: { label: string; onError?: (message: string) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function continueWithGoogle() {
    setLoading(true);
    const supabase = getSupabaseClient();

    if (!supabaseConfigured() || !supabase) {
      router.push("/dashboard");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      setLoading(false);
      onError?.(error.message);
    }
  }

  return (
    <Button variant="outline" className="w-full" onClick={continueWithGoogle} disabled={loading}>
      <span className="flex h-5 w-5 items-center justify-center rounded-sm border border-line bg-white text-xs font-black text-ink">
        G
      </span>
      {loading ? "Opening Google..." : label}
    </Button>
  );
}
