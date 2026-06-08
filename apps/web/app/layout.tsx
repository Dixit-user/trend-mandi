import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Trend Mandi",
  description: "Find creator trends that fit your niche, tone, and audience."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
