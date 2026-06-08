from pydantic import BaseModel


class UsageLimits(BaseModel):
    profile_analyses: int
    hook_generations: int
    script_generations: int


class UsageResponse(BaseModel):
    plan: str
    profile_analyses_used: int
    hook_generations_used: int
    script_generations_used: int
    limits: UsageLimits
