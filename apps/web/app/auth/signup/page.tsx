"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PenLine, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSupabaseClient, supabaseConfigured } from "@/lib/supabase";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const supabase = getSupabaseClient();
    if (!supabaseConfigured() || !supabase) {
      router.push("/dashboard/analyze");
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setMessage("Account created. Check your email if confirmations are enabled, then sign in.");
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
          <CardTitle>Create account</CardTitle>
          <p className="mt-2 text-sm leading-6 text-muted">
            Email auth is powered by Supabase. Instagram passwords are never requested.
          </p>
        </CardHeader>
        <CardContent>
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
                minLength={6}
                required={supabaseConfigured()}
              />
            </label>
            {error ? <p className="rounded-md bg-[#ffe0dc] px-3 py-2 text-sm font-semibold text-[#9e2f24]">{error}</p> : null}
            {message ? <p className="rounded-md bg-mint px-3 py-2 text-sm font-semibold text-teal">{message}</p> : null}
            <Button type="submit" disabled={loading}>
              <UserPlus className="h-4 w-4" />
              {loading ? "Creating..." : "Create account"}
            </Button>
          </form>
          <p className="mt-5 text-sm text-muted">
            Already have an account?{" "}
            <Link href="/auth/signin" className="font-bold text-teal">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
