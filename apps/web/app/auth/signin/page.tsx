"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, PenLine } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { GoogleOAuthButton } from "@/components/auth/google-oauth-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSupabaseClient, supabaseConfigured } from "@/lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabaseConfigured() || !supabase) {
      router.push("/dashboard");
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-paper px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/" className="mb-5 flex items-center gap-3 font-black text-ink">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-white">
              <PenLine className="h-5 w-5" />
            </span>
            Trend Mandi
          </Link>
          <CardTitle>Sign in</CardTitle>
          <p className="mt-2 text-sm leading-6 text-muted">
            {supabaseConfigured() ? "Use your Supabase account." : "Demo mode is active until Supabase env vars are set."}
          </p>
        </CardHeader>
        <CardContent>
          <GoogleOAuthButton label="Continue with Google" onError={setError} />
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <span className="text-xs font-bold uppercase text-muted">or</span>
            <div className="h-px flex-1 bg-line" />
          </div>
          <form onSubmit={submit} className="grid gap-4">
            <label className="grid gap-2 text-sm font-semibold">
              Email
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Password
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required={supabaseConfigured()}
              />
            </label>
            {error ? <p className="rounded-md bg-[#ffe0dc] px-3 py-2 text-sm font-semibold text-[#9e2f24]">{error}</p> : null}
            <Button type="submit" disabled={loading}>
              <LogIn className="h-4 w-4" />
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-5 text-sm text-muted">
            New here?{" "}
            <Link href="/auth/signup" className="font-bold text-teal">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
