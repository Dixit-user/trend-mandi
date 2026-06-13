from datetime import datetime
from typing import Dict, Literal, Optional

from pydantic import BaseModel, Field


FreshnessLabel = Literal["Fresh", "Peaking", "Overused"]


class Trend(BaseModel):
    id: str
    title: str
    niche: str
    description: str
    format: str
    freshness_label: FreshnessLabel
    source: str
    first_seen_at: Optional[datetime] = None


class TrendMatchRequest(BaseModel):
    profile_id: str
    trend_id: str


class ScoreBreakdown(BaseModel):
    niche_similarity: int = Field(ge=0, le=35)
    tone_fit: int = Field(ge=0, le=25)
    freshness: int = Field(ge=0, le=20)
    format_fit: int = Field(ge=0, le=10)
    audience_relevance: int = Field(ge=0, le=10)


class TrendMatchResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    reason: str
    breakdown: ScoreBreakdown


class RecommendedTrend(TrendMatchResponse, Trend):
    pass
