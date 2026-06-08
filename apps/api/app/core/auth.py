from typing import Optional

from fastapi import Depends, HTTPException, Request, status

from app.core.config import Settings, get_settings
from app.db.supabase_client import get_supabase_client


def _extract_bearer_token(request: Request) -> Optional[str]:
    authorization = request.headers.get("authorization")
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    return token.strip()


async def get_current_user_id(
    request: Request,
    settings: Settings = Depends(get_settings),
) -> str:
    token = _extract_bearer_token(request)
    client = get_supabase_client()

    if not settings.supabase_configured or client is None:
        return settings.demo_user_id

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Supabase access token.",
        )

    try:
        response = client.auth.get_user(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Supabase access token.",
        ) from exc

    user = getattr(response, "user", None)
    user_id = getattr(user, "id", None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Supabase user response.",
        )

    return user_id
