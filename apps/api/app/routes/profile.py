from fastapi import APIRouter, Depends, HTTPException, status

from app.core.auth import get_current_user_id
from app.db.repository import Repository, get_repository
from app.schemas.profile import ProfileAnalyzeRequest, ProfileAnalyzeResponse
from app.services.instagram_provider import InstagramProvider, get_instagram_provider
from app.services.openai_service import OpenAIService, get_openai_service
from app.services.usage import ensure_feature_allowed


router = APIRouter(prefix="/profile", tags=["profile"])


@router.post("/analyze", response_model=ProfileAnalyzeResponse)
async def analyze_profile(
    payload: ProfileAnalyzeRequest,
    user_id: str = Depends(get_current_user_id),
    repository: Repository = Depends(get_repository),
    instagram_provider: InstagramProvider = Depends(get_instagram_provider),
    openai_service: OpenAIService = Depends(get_openai_service),
) -> ProfileAnalyzeResponse:
    instagram_handle = (payload.instagram_handle or "").strip()
    if not instagram_handle:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide an Instagram profile link or handle.",
        )

    captions = instagram_provider.get_recent_captions(instagram_handle)
    source = "instagram_provider"
    source_note = (
        "Analyzed from the configured Instagram profile provider and converted into creator-fit signals."
    )

    ensure_feature_allowed(repository, user_id, "profile_analyze")
    analysis = openai_service.analyze_profile(captions, instagram_handle)
    profile = repository.save_profile(user_id, instagram_handle, analysis.model_dump())
    repository.save_content_samples(user_id, captions, source=source)
    repository.log_usage(
        user_id,
        "profile_analyze",
        tokens_estimated=max(1, sum(len(caption) for caption in captions) // 4),
    )
    return ProfileAnalyzeResponse(
        profile_id=profile["id"],
        source=source,
        source_note=source_note,
        **analysis.model_dump(),
    )
