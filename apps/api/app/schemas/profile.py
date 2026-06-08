from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class ProfileAnalyzeRequest(BaseModel):
    instagram_handle: Optional[str] = Field(default=None, max_length=80)
    captions: List[str] = Field(default_factory=list, max_length=10)

    @field_validator("captions")
    @classmethod
    def normalize_captions(cls, captions: List[str]) -> List[str]:
        cleaned = [caption.strip() for caption in captions if caption and caption.strip()]
        if len(cleaned) > 10:
            raise ValueError("Use at most 10 captions.")
        return cleaned


class ProfileAnalysis(BaseModel):
    niche: str
    tone: str
    language: str
    audience_type: str
    content_style: str
    summary: str
    confidence: int = Field(ge=0, le=100)


class ProfileAnalyzeResponse(ProfileAnalysis):
    profile_id: str
