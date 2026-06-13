from __future__ import annotations

import json
import re
from typing import Dict, List

from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import Settings, get_settings
from app.schemas.generate import HookGenerationResponse, ScriptGenerationResponse
from app.schemas.profile import ProfileAnalysis


class OpenAIService:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self.client = OpenAI(api_key=self.settings.openai_api_key) if self.settings.openai_configured else None

    @retry(wait=wait_exponential(multiplier=1, min=1, max=8), stop=stop_after_attempt(3), reraise=True)
    def _json_completion(self, system: str, user: str) -> Dict:
        if self.client is None:
            raise RuntimeError("OpenAI is not configured.")

        response = self.client.chat.completions.create(
            model=self.settings.openai_model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            response_format={"type": "json_object"},
            temperature=0.45,
        )
        content = response.choices[0].message.content or "{}"
        return json.loads(content)

    def analyze_profile(self, captions: List[str], instagram_handle: str | None = None) -> ProfileAnalysis:
        fallback = self._fallback_profile_analysis(captions, instagram_handle)
        if self.client is None:
            return fallback

        system = (
            "You analyze Instagram creator captions for an Indian creator/business SaaS. "
            "Return only valid JSON matching this schema: "
            "{niche:string,tone:string,language:string,audience_type:string,"
            "content_style:string,summary:string,confidence:number}. "
            "Be specific, concise, and do not invent private user data."
        )
        user = json.dumps(
            {
                "instagram_handle": instagram_handle,
                "captions": captions,
                "instructions": "Infer the creator profile from these captions.",
            },
            ensure_ascii=True,
        )
        try:
            data = self._json_completion(system, user)
            ai_result = ProfileAnalysis.model_validate(data)
            return self._guard_profile_analysis(ai_result, fallback)
        except Exception:
            return fallback

    def generate_hooks(self, profile: Dict, trend: Dict, style: str) -> HookGenerationResponse:
        fallback = self._fallback_hooks(profile, trend, style)
        if self.client is None:
            return fallback

        system = (
            "Generate Instagram Reel hooks for a creator. Return only valid JSON with "
            "a hooks array of exactly 5 items. Each item must have hook and why_it_works. "
            "No markdown, no numbering outside JSON."
        )
        user = json.dumps(
            {
                "profile": profile,
                "trend": trend,
                "style": style,
                "instructions": "Write in the creator's tone and language style. Keep hooks copy-friendly.",
            },
            ensure_ascii=True,
        )
        try:
            data = self._json_completion(system, user)
            return HookGenerationResponse.model_validate(data)
        except Exception:
            return fallback

    def generate_script(self, profile: Dict, trend: Dict, duration_seconds: int) -> ScriptGenerationResponse:
        fallback = self._fallback_script(profile, trend, duration_seconds)
        if self.client is None:
            return fallback

        system = (
            "Generate a structured Instagram Reel script. Return only valid JSON matching: "
            "{reel_hook:string,scenes:[{timestamp:string,visual:string,voiceover:string}],"
            "voiceover:string,caption:string,cta:string,hashtags:string[]}. "
            "Keep it realistic for the requested duration."
        )
        user = json.dumps(
            {
                "profile": profile,
                "trend": trend,
                "duration_seconds": duration_seconds,
                "instructions": "Use Indian creator/business context when relevant. Avoid fake claims.",
            },
            ensure_ascii=True,
        )
        try:
            data = self._json_completion(system, user)
            return ScriptGenerationResponse.model_validate(data)
        except Exception:
            return fallback

    def _fallback_profile_analysis(self, captions: List[str], instagram_handle: str | None = None) -> ProfileAnalysis:
        text = " ".join([instagram_handle or "", *captions]).lower()
        niche_keywords = {
            "fitness": [
                "gym",
                "protein",
                "workout",
                "fat loss",
                "fitness",
                "muscle",
                "strength",
                "yoga",
                "diet",
                "calories",
                "steps",
                "training",
            ],
            "fashion": [
                "outfit",
                "style",
                "kurta",
                "streetwear",
                "fashion",
                "wardrobe",
                "dress",
                "saree",
                "styling",
                "lookbook",
                "fit check",
            ],
            "food": [
                "recipe",
                "tiffin",
                "snack",
                "cook",
                "food",
                "meal",
                "kitchen",
                "restaurant",
                "taste",
                "chutney",
                "lunchbox",
                "breakfast",
            ],
            "business": [
                "sales",
                "customer",
                "startup",
                "founder",
                "business",
                "profit",
                "pricing",
                "client",
                "marketing",
                "offer",
                "lead",
                "brand",
            ],
            "student life": [
                "exam",
                "study",
                "hostel",
                "college",
                "student",
                "assignment",
                "revision",
                "semester",
                "class",
                "notes",
                "campus",
            ],
            "AI/tools": [
                "ai",
                "prompt",
                "tool",
                "automation",
                "workflow",
                "chatgpt",
                "notion",
                "canva",
                "edit",
                "productivity",
                "software",
            ],
            "comedy": [
                "pov",
                "joke",
                "relatable",
                "skit",
                "funny",
                "meme",
                "roast",
                "when you",
                "that moment",
                "comedy",
            ],
            "motivation": [
                "discipline",
                "dream",
                "mindset",
                "consistent",
                "growth",
                "motivation",
                "self improvement",
                "habit",
                "focus",
                "goals",
            ],
            "skincare": [
                "skin",
                "serum",
                "routine",
                "spf",
                "acne",
                "sunscreen",
                "moisturizer",
                "cleanser",
                "barrier",
                "glow",
                "beauty",
            ],
            "local business": [
                "shop",
                "store",
                "counter",
                "local",
                "customer",
                "salon",
                "cafe",
                "bakery",
                "boutique",
                "orders",
                "delivery",
            ],
        }
        scores = {
            niche: sum(text.count(keyword) for keyword in keywords)
            for niche, keywords in niche_keywords.items()
        }
        sorted_scores = sorted(scores.items(), key=lambda item: item[1], reverse=True)
        niche = sorted_scores[0][0] if sorted_scores[0][1] > 0 else self._niche_from_text_hash(text)

        if any(word in text for word in ["pov", "haha", "funny", "relatable", "meme", "roast", "when you"]):
            tone = "funny and relatable"
        elif any(word in text for word in ["mistake", "how to", "tip", "workflow", "guide", "save this", "learn"]):
            tone = "educational and practical"
        elif any(word in text for word in ["journey", "younger self", "dream", "hard", "story", "wish", "felt"]):
            tone = "emotional and motivational"
        elif any(word in text for word in ["buy", "offer", "limited", "dm", "book", "order", "sale"]):
            tone = "direct and promotional"
        elif any(word in text for word in ["behind the scenes", "day in my life", "vlog", "routine"]):
            tone = "personal and behind-the-scenes"
        else:
            tone = "clear and practical"

        if re.search(r"[\u0900-\u097f]", text):
            language = "Hindi or mixed Hindi-English"
        elif re.search(r"\b(yaar|bhai|didi|kaise|nahi|acha|achha|desi|matlab|kyunki|hai|kya|apna|wala)\b", text):
            language = "Hinglish"
        elif re.search(r"\b(vanakkam|enna|nalla|tamil|telugu|kannada|malayalam)\b", text):
            language = "regional Indian English mix"
        else:
            language = "English"

        if any(word in text for word in ["carousel", "slides", "swipe", "save this checklist"]):
            content_style = "carousel education and saveable lists"
        elif any(word in text for word in ["pov", "skit", "voiceover", "reel", "video", "transition"]):
            content_style = "short-form Reel storytelling"
        elif any(word in text for word in ["review", "rating", "tested", "before and after"]):
            content_style = "review and comparison content"
        elif any(word in text for word in ["behind the scenes", "day in my life", "routine"]):
            content_style = "behind-the-scenes lifestyle content"
        else:
            content_style = "caption-led educational posts"

        audience_by_niche = {
            "fitness": "health-conscious beginners and busy young adults",
            "fashion": "style-conscious students and young professionals",
            "food": "home cooks, food lovers, and busy families",
            "business": "founders, freelancers, and small business owners",
            "student life": "college students and exam-focused learners",
            "AI/tools": "creators, operators, and productivity-focused professionals",
            "comedy": "young Indian audiences looking for relatable entertainment",
            "motivation": "self-improvement and productivity-focused followers",
            "skincare": "beauty and skincare beginners in Indian conditions",
            "local business": "nearby customers and local small business owners",
        }
        audience_type = audience_by_niche[niche]
        confidence = min(90, 54 + min(len(captions), 10) * 4 + min(sorted_scores[0][1], 8) * 2)

        return ProfileAnalysis(
            niche=niche,
            tone=tone,
            language=language,
            audience_type=audience_type,
            content_style=content_style,
            summary=f"This creator appears to make {tone} {niche} content for {audience_type}.",
            confidence=confidence,
        )

    def _niche_from_text_hash(self, text: str) -> str:
        fallback_niches = [
            "business",
            "motivation",
            "student life",
            "AI/tools",
            "local business",
            "fashion",
            "food",
            "fitness",
            "skincare",
            "comedy",
        ]
        return fallback_niches[sum(ord(char) for char in text) % len(fallback_niches)] if text else "business"

    def _guard_profile_analysis(self, ai_result: ProfileAnalysis, fallback: ProfileAnalysis) -> ProfileAnalysis:
        generic_niches = {"creator", "content creator", "lifestyle", "general", "business"}
        generic_tones = {"professional", "informative", "educational", "casual", "friendly"}
        generic_audiences = {"general audience", "followers", "creators", "young audience"}

        data = ai_result.model_dump()
        if data["niche"].strip().lower() in generic_niches and fallback.confidence >= 66:
            data["niche"] = fallback.niche
        if data["tone"].strip().lower() in generic_tones and fallback.confidence >= 66:
            data["tone"] = fallback.tone
        if data["audience_type"].strip().lower() in generic_audiences and fallback.confidence >= 66:
            data["audience_type"] = fallback.audience_type
        if not data["language"] or data["language"].strip().lower() == "unknown":
            data["language"] = fallback.language
        if not data["content_style"] or data["content_style"].strip().lower() in {"posts", "reels", "content"}:
            data["content_style"] = fallback.content_style

        data["confidence"] = max(min(int(data["confidence"]), 100), fallback.confidence)
        return ProfileAnalysis.model_validate(data)

    def _fallback_hooks(self, profile: Dict, trend: Dict, style: str) -> HookGenerationResponse:
        style_prefix = {
            "funny": "POV:",
            "emotional": "I wish someone told me this sooner:",
            "controversial": "Unpopular opinion:",
            "educational": "Steal this:",
            "direct": "Stop scrolling:",
        }.get(style, "Try this:")
        hooks = [
            {
                "hook": f"{style_prefix} {trend['title']} can work for {profile.get('niche', 'your niche')} creators too.",
                "why_it_works": "It connects the trend to the creator's own niche immediately.",
            },
            {
                "hook": f"Before you copy this trend, check if it fits your {profile.get('tone', 'tone')}.",
                "why_it_works": "It creates tension and promises a practical filter.",
            },
            {
                "hook": f"Here is the {trend['format'].lower()} version of this trend I would actually post.",
                "why_it_works": "It positions the creator as selective and useful.",
            },
            {
                "hook": f"Most creators use this trend wrong. Try this angle instead.",
                "why_it_works": "It frames the content as corrective and save-worthy.",
            },
            {
                "hook": f"If your audience is {profile.get('audience_type', 'busy')}, this is the hook I would use.",
                "why_it_works": "It makes the advice feel tailored to a specific audience.",
            },
        ]
        return HookGenerationResponse.model_validate({"hooks": hooks})

    def _fallback_script(self, profile: Dict, trend: Dict, duration_seconds: int) -> ScriptGenerationResponse:
        scenes = [
            {
                "timestamp": "0-3s",
                "visual": "Creator on camera with the trend title as a clean text overlay.",
                "voiceover": f"Before you jump on '{trend['title']}', make it fit your audience.",
            },
            {
                "timestamp": "4-12s",
                "visual": "Show two quick examples: a generic version and a tailored version.",
                "voiceover": f"For {profile.get('niche', 'your niche')}, the angle should sound {profile.get('tone', 'natural')}.",
            },
            {
                "timestamp": "13-24s",
                "visual": "Cut to bullet overlays with hook, proof, and CTA.",
                "voiceover": "Start with a specific problem, show one useful example, then ask a direct question.",
            },
            {
                "timestamp": f"25-{duration_seconds}s",
                "visual": "End on a copy-friendly caption screenshot or creator pointing to comments.",
                "voiceover": "Save this if you want trends that fit instead of trends that flop.",
            },
        ]
        return ScriptGenerationResponse.model_validate(
            {
                "reel_hook": f"Do not copy '{trend['title']}' until you adapt it to your creator style.",
                "scenes": scenes,
                "voiceover": " ".join(scene["voiceover"] for scene in scenes),
                "caption": f"Trends work better when they fit your niche, tone, and audience. Try this {trend['format'].lower()} angle and make it your own.",
                "cta": "Comment your niche and I will suggest a trend angle.",
                "hashtags": ["#TrendMandi", "#CreatorTips", "#InstagramReels", "#ContentStrategy"],
            }
        )


def get_openai_service() -> OpenAIService:
    return OpenAIService()
