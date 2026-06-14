from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routes import generate, profile, trends, usage


settings = get_settings()

app = FastAPI(
    title="Trend Mandi API",
    description="Creator trend matching and generation API for Trend Mandi.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://trend-mandi-web.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile.router)
app.include_router(trends.router)
app.include_router(generate.router)
app.include_router(usage.router)


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "service": "trend-mandi-api"}
