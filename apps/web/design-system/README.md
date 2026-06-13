# Trend Mandi Design System

Trend Mandi should feel clean, practical, and creator-business focused. The UI is for repeated work: analyzing Instagram profile links, comparing trends, generating assets, and copying outputs.

## Foundations

- Palette: warm paper base, ink text, teal confidence states, coral primary actions, saffron attention states.
- Shape: cards and controls use small `6px` radius via `rounded-md`; avoid oversized rounded cards.
- Density: dashboard pages should be compact enough to scan quickly.
- Typography: use system sans, no negative letter spacing, and reserve large type for public page hero sections.
- Motion: keep transitions short and functional.

## Component Layers

- `components/ui`: small primitives such as Button, Card, Badge, Input, Textarea.
- `components/layout`: app shell, navigation, route frames.
- `components/forms`: reusable product form blocks.
- `components/dashboard`: reusable authenticated dashboard surfaces.
- `components/marketing`: reusable public landing and pricing sections.

## Tokens

Shared values live in `design-system/tokens.ts` and are consumed by Tailwind. Add new colors or shadows there first, then use Tailwind class names in components.

## Product Rules

- Instagram profile link analysis must stay the first-class flow.
- Copy actions should be one click and visible near generated outputs.
- Trend freshness and score should be visible without opening a detail panel.
- Never place secrets, OpenAI calls, or service-role Supabase logic in frontend components.
