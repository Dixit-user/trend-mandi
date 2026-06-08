from app.schemas.trends import ScoreBreakdown


def _words(value: str) -> set[str]:
    return {word.strip(".,:;!?()[]{}").lower() for word in value.split() if len(word.strip()) > 2}


def _niche_similarity(profile_niche: str, trend_niche: str) -> int:
    profile = profile_niche.lower()
    trend = trend_niche.lower()
    if profile == trend or trend in profile or profile in trend:
        return 35

    related = {
        "business": {"local business", "AI/tools", "motivation"},
        "local business": {"business", "food", "fashion"},
        "fitness": {"food", "motivation"},
        "fashion": {"skincare", "student life"},
        "student life": {"motivation", "AI/tools"},
        "AI/tools": {"business", "student life"},
        "comedy": {"student life", "local business"},
        "skincare": {"fashion", "motivation"},
    }
    if trend in related.get(profile, set()) or profile in related.get(trend, set()):
        return 24

    overlap = _words(profile_niche) & _words(trend_niche)
    return 18 if overlap else 8


def _tone_fit(tone: str, trend: dict) -> int:
    text = f"{tone} {trend['title']} {trend['description']} {trend['format']}".lower()
    if any(word in text for word in ["funny", "comedy", "pov", "relatable", "skit"]):
        return 25
    if any(word in text for word in ["educational", "tip", "mistake", "audit", "breakdown", "tool"]):
        return 23
    if any(word in text for word in ["emotional", "letter", "calm", "discipline", "storytelling"]):
        return 21
    if any(word in text for word in ["direct", "sales", "customer", "business"]):
        return 20
    return 17


def _freshness(label: str) -> int:
    return {"Fresh": 20, "Peaking": 15, "Overused": 8}.get(label, 10)


def _format_fit(content_style: str, trend_format: str) -> int:
    style = content_style.lower()
    fmt = trend_format.lower()
    if "reel" in style and "reel" in fmt:
        return 10
    if "carousel" in style and "carousel" in fmt:
        return 10
    if "story" in style and "story" in fmt:
        return 9
    if any(word in style for word in ["short", "video", "voiceover"]) and "reel" in fmt:
        return 8
    if any(word in style for word in ["educational", "list", "tips"]) and "carousel" in fmt:
        return 8
    return 5


def _audience_relevance(audience: str, trend: dict) -> int:
    text = f"{audience} {trend['niche']} {trend['description']}".lower()
    if any(word in text for word in ["creator", "founder", "business", "customer", "student", "fitness", "beauty"]):
        return 10
    if any(word in text for word in ["beginner", "young", "urban", "professional"]):
        return 8
    return 6


def calculate_trend_match(profile: dict, trend: dict) -> tuple[int, ScoreBreakdown, str]:
    breakdown = ScoreBreakdown(
        niche_similarity=_niche_similarity(profile.get("niche", ""), trend.get("niche", "")),
        tone_fit=_tone_fit(profile.get("tone", ""), trend),
        freshness=_freshness(trend.get("freshness_label", "")),
        format_fit=_format_fit(profile.get("content_style", ""), trend.get("format", "")),
        audience_relevance=_audience_relevance(profile.get("audience_type", ""), trend),
    )
    score = sum(breakdown.model_dump().values())
    reason = (
        f"This trend scores {score}/100 because it is a {trend['freshness_label'].lower()} "
        f"{trend['format'].lower()} in {trend['niche']} with a strong fit for your "
        f"{profile.get('tone', 'creator')} tone and {profile.get('content_style', 'content')} style."
    )
    return score, breakdown, reason
