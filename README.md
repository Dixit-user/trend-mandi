# Trend Mandi

Trend Mandi is an MVP SaaS for creators who want trends that fit their niche, tone, language, audience, and content style. The manual caption flow works without Instagram login or scraping.

## Stack

- Frontend: Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase Auth client
- Backend: FastAPI, Pydantic, OpenAI Python SDK, Supabase Python client
- Database: Supabase Postgres with RLS

## Project Structure

```txt
trend-mandi/
  apps/
    web/
      app/
      components/
      lib/
      .env.example
    api/
      app/
        main.py
        routes/
        services/
        schemas/
        db/
        core/
      requirements.txt
      .env.example
  supabase/
    migrations/
    seed.sql
```

## Environment Variables

Frontend, `apps/web/.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Backend, `apps/api/.env`:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
CORS_ORIGINS=http://localhost:3000
```

`OPENAI_API_KEY` is only read by the backend. The frontend never calls OpenAI directly.

## Setup

1. Install frontend dependencies:

```bash
cd apps/web
npm install
```

2. Install backend dependencies:

```bash
cd apps/api
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

3. Copy environment files:

```bash
copy apps\web\.env.example apps\web\.env.local
copy apps\api\.env.example apps\api\.env
```

4. Add Supabase and OpenAI values to the copied env files.

## Supabase Migrations

Apply the SQL in `supabase/migrations/001_initial_schema.sql` to your Supabase project, then run `supabase/seed.sql` to load the 20 mock trends.

With the Supabase CLI:

```bash
supabase db push
supabase db execute --file supabase/seed.sql
```

The migration enables RLS. User-owned rows are scoped to `auth.uid()`, and `trends` are public read.

## Run Locally

Backend:

```bash
cd apps/api
uvicorn app.main:app --reload
```

Frontend:

```bash
cd apps/web
npm run dev
```

Open `http://localhost:3000`.

If Supabase env vars are empty, the backend uses a local demo user and in-memory persistence so the MVP flow can be tested. Configure Supabase for real auth and database persistence.

## API Endpoints

- `GET /health`
- `POST /profile/analyze`
- `GET /trends`
- `POST /trends/match`
- `POST /generate/hooks`
- `POST /generate/script`
- `GET /generate/recent`
- `GET /usage/me`

## Main User Flow

1. Sign up or use demo mode locally.
2. Paste 5-10 captions on `/dashboard/analyze`.
3. Save the analyzed profile returned by the API.
4. View mock trends on `/dashboard/trends`.
5. Calculate a Trend Match Score.
6. Generate hooks or a Reel script on `/dashboard/generate`.
7. Copy outputs for publishing workflow.

## Known Limitations

- Instagram scraping is intentionally isolated behind `InstagramProvider`; the current provider is mock-only.
- Trend data is seeded mock data, not a live trend API.
- Razorpay is not implemented yet. The subscription table and Pro plan placeholder are ready for checkout and webhook integration.
- Without `OPENAI_API_KEY`, the backend returns deterministic fallback analysis and generated assets for local development.

## Next Steps

- Add Razorpay checkout, subscription webhooks, and server-side plan reconciliation.
- Add saved workspaces and trend collections.
- Add a real trend provider behind the existing trend service boundary.
- Add background jobs for trend refresh and usage analytics.
- Add automated tests for API limits, RLS assumptions, and frontend workflow states.
