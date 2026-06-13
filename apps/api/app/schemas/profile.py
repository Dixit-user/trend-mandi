from pydantic import BaseModel, Field


class ProfileAnalyzeRequest(BaseModel):
    instagram_handle: str = Field(min_length=1, max_length=240)


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
    source: str
    source_note: str
