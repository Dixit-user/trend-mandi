# Deploy Trend Mandi

Recommended production setup:

- Frontend: Vercel, root directory `apps/web`
- Backend API: Railway, root directory `apps/api`
- Database/auth: Supabase

## 1. Prepare Supabase

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/migrations/001_initial_schema.sql`.
4. Run `supabase/seed.sql`.
5. Copy these values:
   - Project URL
   - Anon/public key
   - Service role key

Keep the service role key backend-only.

## 2. Deploy API to Railway

1. Push this repository to GitHub.
2. Create a Railway project.
3. Choose Deploy from GitHub repo.
4. Select this repo.
5. Set the service root directory to `apps/api`.
6. Railway will use `apps/api/railway.json`.
7. Add these Railway variables:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

8. Generate a public Railway domain.
9. Confirm `https://your-railway-api.../health` returns `{"status":"ok"}`.

## 3. Deploy Web to Vercel

1. Import the same GitHub repo in Vercel.
2. Set Root Directory to `apps/web`.
3. Keep framework as Next.js.
4. Add these Vercel environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_BASE_URL=https://your-railway-api.up.railway.app
```

5. Deploy.

## 4. Connect CORS

After Vercel gives you the final domain, update Railway:

```env
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

For preview deploys, add each preview origin or temporarily include the preview URL you are testing.

## 5. Production Checks

- Visit the Vercel URL.
- Sign up with Supabase Auth.
- Add an Instagram profile link and analyze a profile.
- Open `/dashboard/trends` and confirm recommendations are sorted for that profile.
- Generate hooks and scripts.
- Check Railway logs if the frontend shows `Failed to fetch`.

## Common Failures

- `Failed to fetch`: API URL is wrong, API is down, or CORS does not include the Vercel origin.
- `401`: Supabase auth token missing or Supabase backend env vars are wrong.
- OpenAI output fallback only: `OPENAI_API_KEY` is missing or invalid in Railway.
- Empty trends: `supabase/seed.sql` was not run.
