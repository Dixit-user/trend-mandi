export const trendMandiTokens = {
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
  radii: {
    control: "0.375rem",
    card: "0.375rem"
  },
  shadows: {
    soft: "0 16px 40px rgba(23, 25, 35, 0.10)"
  },
  spacing: {
    pageX: "1rem",
    sectionY: "3rem",
    dashboardGap: "1.5rem"
  }
} as const;

export type TrendMandiColor = keyof typeof trendMandiTokens.colors;
