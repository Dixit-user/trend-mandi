from __future__ import annotations

from datetime import datetime, timezone
from typing import Dict, List, Optional
from uuid import uuid4

from app.db.supabase_client import get_supabase_client
from app.services.trend_catalog import MOCK_TRENDS


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _extract_hashtags(caption: str) -> List[str]:
    return [word[1:] for word in caption.split() if word.startswith("#") and len(word) > 1]


class MemoryStore:
    def __init__(self) -> None:
        self.profiles: Dict[str, Dict] = {}
        self.samples: Dict[str, Dict] = {}
        self.trends: Dict[str, Dict] = {trend["id"]: trend for trend in MOCK_TRENDS}
        self.trend_scores: Dict[str, Dict] = {}
        self.generated_assets: Dict[str, Dict] = {}
        self.usage_logs: Dict[str, Dict] = {}
        self.subscriptions: Dict[str, Dict] = {}


_memory_store = MemoryStore()


class Repository:
    def __init__(self, client, memory_store: MemoryStore) -> None:
        self.client = client
        self.memory = memory_store

    @property
    def configured(self) -> bool:
        return self.client is not None

    def save_profile(self, user_id: str, instagram_handle: Optional[str], analysis: dict) -> Dict:
        payload = {
            "id": str(uuid4()),
            "user_id": user_id,
            "instagram_handle": instagram_handle,
            "niche": analysis["niche"],
            "tone": analysis["tone"],
            "language": analysis["language"],
            "audience_type": analysis["audience_type"],
            "content_style": analysis["content_style"],
            "updated_at": _now(),
        }
        if self.configured:
            response = self.client.table("users_profile").insert(payload).execute()
            return response.data[0]

        payload["created_at"] = _now()
        self.memory.profiles[payload["id"]] = payload
        return payload

    def save_content_samples(self, user_id: str, captions: List[str], source: str) -> None:
        rows = [
            {
                "id": str(uuid4()),
                "user_id": user_id,
                "source": source,
                "caption": caption,
                "hashtags": _extract_hashtags(caption),
            }
            for caption in captions
        ]
        if not rows:
            return

        if self.configured:
            self.client.table("content_samples").insert(rows).execute()
            return

        for row in rows:
            row["created_at"] = _now()
            self.memory.samples[row["id"]] = row

    def get_profile(self, profile_id: str, user_id: str) -> Optional[Dict]:
        if self.configured:
            response = (
                self.client.table("users_profile")
                .select("*")
                .eq("id", profile_id)
                .eq("user_id", user_id)
                .limit(1)
                .execute()
            )
            return response.data[0] if response.data else None

        profile = self.memory.profiles.get(profile_id)
        return profile if profile and profile["user_id"] == user_id else None

    def list_trends(self) -> List[Dict]:
        if self.configured:
            response = self.client.table("trends").select("*").order("first_seen_at", desc=True).execute()
            return response.data or MOCK_TRENDS
        return list(self.memory.trends.values())

    def get_trend(self, trend_id: str) -> Optional[Dict]:
        if self.configured:
            response = self.client.table("trends").select("*").eq("id", trend_id).limit(1).execute()
            return response.data[0] if response.data else None
        return self.memory.trends.get(trend_id)

    def save_trend_score(self, user_id: str, trend_id: str, score: int, reason: str) -> Dict:
        payload = {
            "id": str(uuid4()),
            "user_id": user_id,
            "trend_id": trend_id,
            "score": score,
            "reason": reason,
        }
        if self.configured:
            response = self.client.table("trend_scores").insert(payload).execute()
            return response.data[0]

        payload["created_at"] = _now()
        self.memory.trend_scores[payload["id"]] = payload
        return payload

    def save_generated_asset(self, user_id: str, trend_id: str, asset_type: str, output: Dict) -> Dict:
        payload = {
            "id": str(uuid4()),
            "user_id": user_id,
            "trend_id": trend_id,
            "type": asset_type,
            "output": output,
        }
        if self.configured:
            response = self.client.table("generated_assets").insert(payload).execute()
            return response.data[0]

        payload["created_at"] = _now()
        self.memory.generated_assets[payload["id"]] = payload
        return payload

    def list_recent_generated_assets(self, user_id: str, limit: int = 6) -> List[Dict]:
        if self.configured:
            response = (
                self.client.table("generated_assets")
                .select("id,type,output,created_at")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
            return response.data or []

        rows = [row for row in self.memory.generated_assets.values() if row["user_id"] == user_id]
        rows.sort(key=lambda row: row.get("created_at", ""), reverse=True)
        return rows[:limit]

    def log_usage(self, user_id: str, feature_used: str, tokens_estimated: Optional[int] = None) -> None:
        payload = {
            "id": str(uuid4()),
            "user_id": user_id,
            "feature_used": feature_used,
            "tokens_estimated": tokens_estimated,
        }
        if self.configured:
            self.client.table("usage_logs").insert(payload).execute()
            return

        payload["created_at"] = _now()
        self.memory.usage_logs[payload["id"]] = payload

    def count_usage_since(self, user_id: str, feature_used: str, since: datetime) -> int:
        since_iso = since.isoformat()
        if self.configured:
            response = (
                self.client.table("usage_logs")
                .select("id")
                .eq("user_id", user_id)
                .eq("feature_used", feature_used)
                .gte("created_at", since_iso)
                .execute()
            )
            return len(response.data or [])

        return len(
            [
                row
                for row in self.memory.usage_logs.values()
                if row["user_id"] == user_id
                and row["feature_used"] == feature_used
                and row.get("created_at", "") >= since_iso
            ]
        )

    def get_subscription_plan(self, user_id: str) -> str:
        if self.configured:
            response = (
                self.client.table("subscriptions")
                .select("plan,status")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
            if response.data:
                row = response.data[0]
                if row.get("status") == "active":
                    return row.get("plan", "free")
            return "free"

        row = self.memory.subscriptions.get(user_id)
        return row.get("plan", "free") if row and row.get("status") == "active" else "free"


def get_repository() -> Repository:
    return Repository(get_supabase_client(), _memory_store)
