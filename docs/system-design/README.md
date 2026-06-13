# Trend Mandi System Design

Trend Mandi is split into a Next.js web app and a FastAPI API. The frontend owns user experience and Supabase Auth sessions. The backend owns OpenAI calls, usage limits, trend matching, persistence, and provider integrations.

## Runtime Boundaries

- `apps/web`: browser-facing Next.js app. Uses only public Supabase env vars and `NEXT_PUBLIC_API_BASE_URL`.
- `apps/api`: server-side FastAPI app. Uses `OPENAI_API_KEY`, Supabase service role, usage enforcement, and provider interfaces.
- `supabase`: database schema, RLS policies, and mock trend seed data.

## Request Flow

1. User signs in with Supabase Auth or runs local demo mode.
2. Frontend sends API requests with the Supabase bearer token when available.
3. Backend verifies the token through Supabase when configured.
4. Backend reads/writes user-owned rows and never exposes service keys to the frontend.
5. OpenAI generation happens only in `app/services/openai_service.py`.

## Provider Boundaries

- Instagram scraping belongs behind `InstagramProvider`.
- Trend APIs should be added behind a trend provider/service boundary.
- Razorpay should be added through checkout and webhook handlers, then reconciled into `subscriptions`.
