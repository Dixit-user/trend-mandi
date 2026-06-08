import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#171923",
        muted: "#69707d",
        paper: "#fffaf3",
        coral: "#ef5b4c",
        teal: "#0f8f88",
        saffron: "#f4a62a",
        mint: "#dff5ed",
        line: "#e8e1d8"
      },
      boxShadow: {
        soft: "0 16px 40px rgba(23, 25, 35, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
