# Folder Map

```txt
trend-mandi/
  apps/
    web/
      app/                  Next.js routes
      components/
        ui/                 UI primitives
        layout/             Navigation and shells
        forms/              Reusable form assemblies
        dashboard/          Authenticated product components
        marketing/          Public page components
      design-system/        Tokens and design rules
      lib/                  API clients and browser utilities
    api/
      app/
        core/               Settings and auth dependencies
        db/                 Supabase repository boundary
        routes/             FastAPI route modules
        schemas/            Pydantic request/response contracts
        services/           OpenAI, scoring, usage, providers
  docs/
    system-design/          Architecture and folder documentation
  supabase/
    migrations/             Schema and RLS SQL
    seed.sql                Mock trend catalog
```

Add route-specific code close to the route. Promote it into `components/**`, `services/**`, or `lib/**` only after reuse or when it protects a clear boundary.
