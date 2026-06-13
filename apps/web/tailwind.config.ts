import type { Config } from "tailwindcss";

import { trendMandiTokens } from "./design-system/tokens";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./design-system/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: trendMandiTokens.colors,
      borderRadius: trendMandiTokens.radii,
      boxShadow: trendMandiTokens.shadows
    }
  },
  plugins: []
};

export default config;
