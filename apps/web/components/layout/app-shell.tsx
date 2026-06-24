"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Home, LineChart, LogOut, PenLine, Sparkles, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/analyze", label: "Analyze", icon: BarChart3 },
  { href: "/dashboard/trends", label: "Trends", icon: LineChart },
  { href: "/dashboard/generate", label: "Generate", icon: Wand2 },
  { href: "/pricing", label: "Pricing", icon: Sparkles }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-line bg-white px-4 py-5 lg:block">
        <Link href="/" className="flex items-center gap-3 rounded-md px-2 py-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink text-white">
            <PenLine className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-black text-ink">Trend Mandi</span>
            <span className="block text-xs font-medium text-muted">Creator fit engine</span>
          </span>
        </Link>

        <nav className="mt-8 grid gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition",
                  active ? "bg-mint text-teal" : "text-muted hover:bg-paper hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4">
          <Button variant="outline" className="w-full justify-start" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-10 border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-black text-ink">
            <PenLine className="h-5 w-5" />
            Trend Mandi
          </Link>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Exit
          </Button>
        </div>
        <nav className="mt-3 grid grid-cols-4 gap-2">
          {navItems.slice(0, 4).map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "focus-ring flex min-h-10 items-center justify-center rounded-md text-xs font-semibold transition",
                  active ? "bg-mint text-teal" : "bg-paper text-muted"
                )}
                title={item.label}
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
