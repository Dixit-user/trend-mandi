from datetime import datetime, timezone
from typing import Dict

from fastapi import HTTPException, status

from app.db.repository import Repository
from app.schemas.usage import UsageLimits, UsageResponse


FREE_LIMITS = {
    "profile_analyses": 3,
    "hook_generations": 10,
    "script_generations": 3,
}

PRO_LIMITS = {
    "profile_analyses": 100,
    "hook_generations": 250,
    "script_generations": 100,
}

# TODO: Replace the placeholder Pro limits with Razorpay checkout and webhook verified subscription status.

FEATURE_TO_COUNTER = {
    "profile_analyze": "profile_analyses",
    "generate_hooks": "hook_generations",
    "generate_script": "script_generations",
}


def month_start() -> datetime:
    now = datetime.now(timezone.utc)
    return now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)


def limits_for_plan(plan: str) -> Dict[str, int]:
    return PRO_LIMITS if plan == "pro" else FREE_LIMITS


def ensure_feature_allowed(repository: Repository, user_id: str, feature_used: str) -> None:
    plan = repository.get_subscription_plan(user_id)
    counter_name = FEATURE_TO_COUNTER[feature_used]
    limit = limits_for_plan(plan)[counter_name]
    used = repository.count_usage_since(user_id, feature_used, month_start())
    if used >= limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Monthly free limit reached for {counter_name.replace('_', ' ')}.",
        )


def build_usage_response(repository: Repository, user_id: str) -> UsageResponse:
    start = month_start()
    plan = repository.get_subscription_plan(user_id)
    limits = limits_for_plan(plan)
    return UsageResponse(
        plan=plan,
        profile_analyses_used=repository.count_usage_since(user_id, "profile_analyze", start),
        hook_generations_used=repository.count_usage_since(user_id, "generate_hooks", start),
        script_generations_used=repository.count_usage_since(user_id, "generate_script", start),
        limits=UsageLimits(**limits),
    )
