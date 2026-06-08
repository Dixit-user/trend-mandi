from fastapi import APIRouter, Depends

from app.core.auth import get_current_user_id
from app.db.repository import Repository, get_repository
from app.schemas.usage import UsageResponse
from app.services.usage import build_usage_response


router = APIRouter(prefix="/usage", tags=["usage"])


@router.get("/me", response_model=UsageResponse)
async def get_my_usage(
    user_id: str = Depends(get_current_user_id),
    repository: Repository = Depends(get_repository),
) -> UsageResponse:
    return build_usage_response(repository, user_id)
