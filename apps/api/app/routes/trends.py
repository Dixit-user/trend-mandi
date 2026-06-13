from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.auth import get_current_user_id
from app.db.repository import Repository, get_repository
from app.schemas.trends import RecommendedTrend, Trend, TrendMatchRequest, TrendMatchResponse
from app.services.scoring import calculate_trend_match


router = APIRouter(prefix="/trends", tags=["trends"])


@router.get("", response_model=List[Trend])
async def list_trends(repository: Repository = Depends(get_repository)) -> List[Trend]:
    return [Trend.model_validate(trend) for trend in repository.list_trends()]


@router.get("/recommended/{profile_id}", response_model=List[RecommendedTrend])
async def recommended_trends(
    profile_id: str,
    user_id: str = Depends(get_current_user_id),
    repository: Repository = Depends(get_repository),
) -> List[RecommendedTrend]:
    profile = repository.get_profile(profile_id, user_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found.")

    recommendations = []
    for trend in repository.list_trends():
        score, breakdown, reason = calculate_trend_match(profile, trend)
        recommendations.append(
            RecommendedTrend(
                **Trend.model_validate(trend).model_dump(),
                score=score,
                reason=reason,
                breakdown=breakdown,
            )
        )

    return sorted(recommendations, key=lambda trend: trend.score, reverse=True)


@router.post("/match", response_model=TrendMatchResponse)
async def match_trend(
    payload: TrendMatchRequest,
    user_id: str = Depends(get_current_user_id),
    repository: Repository = Depends(get_repository),
) -> TrendMatchResponse:
    profile = repository.get_profile(payload.profile_id, user_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found.")

    trend = repository.get_trend(payload.trend_id)
    if not trend:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trend not found.")

    score, breakdown, reason = calculate_trend_match(profile, trend)
    repository.save_trend_score(user_id, payload.trend_id, score, reason)
    return TrendMatchResponse(score=score, reason=reason, breakdown=breakdown)
