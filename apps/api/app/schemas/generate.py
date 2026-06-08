from typing import Dict, List, Literal

from pydantic import BaseModel, Field


HookStyle = Literal["funny", "emotional", "controversial", "educational", "direct"]


class HookGenerationRequest(BaseModel):
    profile_id: str
    trend_id: str
    style: HookStyle = "educational"


class Hook(BaseModel):
    hook: str
    why_it_works: str


class HookGenerationResponse(BaseModel):
    hooks: List[Hook] = Field(min_length=1, max_length=5)


class ScriptGenerationRequest(BaseModel):
    profile_id: str
    trend_id: str
    duration_seconds: int = Field(default=30, ge=15, le=90)


class ScriptScene(BaseModel):
    timestamp: str
    visual: str
    voiceover: str


class ScriptGenerationResponse(BaseModel):
    reel_hook: str
    scenes: List[ScriptScene]
    voiceover: str
    caption: str
    cta: str
    hashtags: List[str]


class GeneratedAsset(BaseModel):
    id: str
    type: str
    output: Dict
    created_at: str
