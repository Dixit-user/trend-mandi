from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.auth import get_current_user_id
from app.db.repository import Repository, get_repository
from app.schemas.generate import (
    GeneratedAsset,
    HookGenerationRequest,
    HookGenerationResponse,
    ScriptGenerationRequest,
    ScriptGenerationResponse,
)
from app.services.openai_service import OpenAIService, get_openai_service
from app.services.usage import ensure_feature_allowed


router = APIRouter(prefix="/generate", tags=["generate"])


def _load_profile_and_trend(repository: Repository, user_id: str, profile_id: str, trend_id: str) -> tuple[dict, dict]:
    profile = repository.get_profile(profile_id, user_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found.")

    trend = repository.get_trend(trend_id)
    if not trend:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trend not found.")

    return profile, trend


@router.post("/hooks", response_model=HookGenerationResponse)
async def generate_hooks(
    payload: HookGenerationRequest,
    user_id: str = Depends(get_current_user_id),
    repository: Repository = Depends(get_repository),
    openai_service: OpenAIService = Depends(get_openai_service),
) -> HookGenerationResponse:
    ensure_feature_allowed(repository, user_id, "generate_hooks")
    profile, trend = _load_profile_and_trend(repository, user_id, payload.profile_id, payload.trend_id)
    result = openai_service.generate_hooks(profile, trend, payload.style)
    repository.save_generated_asset(user_id, payload.trend_id, "hook", result.model_dump())
    repository.log_usage(user_id, "generate_hooks", tokens_estimated=600)
    return result


@router.post("/script", response_model=ScriptGenerationResponse)
async def generate_script(
    payload: ScriptGenerationRequest,
    user_id: str = Depends(get_current_user_id),
    repository: Repository = Depends(get_repository),
    openai_service: OpenAIService = Depends(get_openai_service),
) -> ScriptGenerationResponse:
    ensure_feature_allowed(repository, user_id, "generate_script")
    profile, trend = _load_profile_and_trend(repository, user_id, payload.profile_id, payload.trend_id)
    result = openai_service.generate_script(profile, trend, payload.duration_seconds)
    repository.save_generated_asset(user_id, payload.trend_id, "script", result.model_dump())
    repository.log_usage(user_id, "generate_script", tokens_estimated=1200)
    return result


@router.get("/recent", response_model=List[GeneratedAsset])
async def recent_generated_assets(
    user_id: str = Depends(get_current_user_id),
    repository: Repository = Depends(get_repository),
) -> List[GeneratedAsset]:
    rows = repository.list_recent_generated_assets(user_id)
    return [
        GeneratedAsset(
            id=row["id"],
            type=row["type"],
            output=row["output"],
            created_at=str(row.get("created_at", "")),
        )
        for row in rows
    ]
