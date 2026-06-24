import hashlib
import re
from typing import List, Protocol
from urllib.parse import urlparse


class InstagramProvider(Protocol):
    def get_recent_captions(self, handle: str) -> List[str]:
        """Return public captions for a handle.

        Real scraping or third-party APIs should be implemented here only, never in
        route handlers, and never by asking users for passwords or access tokens.
        """


class MockInstagramProvider:
    niche_samples = {
        "fitness": [
            "My 30 minute strength workout for busy people who still want visible progress.",
            "Three protein mistakes I see beginners make every week.",
            "Save this simple gym plan before your next leg day.",
            "A realistic Indian meal prep day with protein counts and swaps.",
            "Stop chasing random exercises and build a repeatable weekly routine.",
        ],
        "fashion": [
            "Styling one kurta five ways for college, office, errands, dinner, and festive plans.",
            "Budget streetwear finds under Rs 999 that still look polished.",
            "The easiest color combinations for Indian skin tones and daily outfits.",
            "Before you buy another shirt, check these fit details.",
            "Save this outfit formula for days when nothing looks good.",
        ],
        "food": [
            "One pan tiffin recipe that takes 12 minutes and tastes like home.",
            "Testing regional snacks and ranking them by crunch, spice, and nostalgia.",
            "Three lunchbox ideas for busy weekdays with simple Indian ingredients.",
            "This chutney trick makes leftovers taste new again.",
            "Save this grocery list before your next weekly meal prep.",
        ],
        "business": [
            "How I turned one customer question into a week of content ideas.",
            "The pricing mistake that quietly kills small business profit.",
            "Behind the counter: what a real day running this shop looks like.",
            "Stop posting offers before your audience understands the problem.",
            "A simple sales script for the first paying customer.",
        ],
        "student life": [
            "Realistic study sprint before exams with breaks, distractions, and reset moments.",
            "Hostel room upgrades under Rs 500 that actually make life easier.",
            "How I plan assignments when everything is due in the same week.",
            "Three mistakes that made my revision slower than it needed to be.",
            "Save this timetable if you keep starting too late.",
        ],
        "AI/tools": [
            "My AI tool stack for planning, scripting, editing, and scheduling creator content.",
            "Bad prompt vs useful prompt: the exact rewrite that gives better ideas.",
            "A simple automation workflow for solo creators who post every week.",
            "Stop asking AI for generic captions; give it your audience and format first.",
            "Save this prompt template before your next content planning session.",
        ],
        "comedy": [
            "POV: your family discovers content creation is your actual job.",
            "Mumbai local inner monologue when your Reel idea arrives at the worst time.",
            "The difference between planning content and pretending to plan content.",
            "Relatable creator problems nobody puts in their portfolio.",
            "When a client says this will only take five minutes.",
        ],
        "motivation": [
            "Discipline is built in boring reps, not one dramatic Monday reset.",
            "A letter to my younger self about patience, work, and comparison.",
            "Small promises kept daily changed my confidence more than big goals.",
            "Stop waiting for perfect motivation and lower the starting friction.",
            "Save this when consistency feels slow.",
        ],
        "skincare": [
            "Simple skincare routine for humid monsoon days in India.",
            "Ingredient red flags explained in plain English before you buy.",
            "Three mistakes that made my skin barrier worse.",
            "Patch testing is boring until one product ruins your week.",
            "Save this AM routine if sunscreen keeps feeling heavy.",
        ],
        "local business": [
            "Behind the counter: a real day serving customers at our local shop.",
            "Customer questions that became our best content series.",
            "How we prepare before opening and what people never see.",
            "A simple offer change that made customers understand the value faster.",
            "Save this if you run a small business and need content ideas.",
        ],
    }

    keyword_to_niche = {
        "fit": "fitness",
        "gym": "fitness",
        "yoga": "fitness",
        "style": "fashion",
        "fashion": "fashion",
        "wear": "fashion",
        "food": "food",
        "chef": "food",
        "recipe": "food",
        "founder": "business",
        "business": "business",
        "shop": "local business",
        "store": "local business",
        "student": "student life",
        "college": "student life",
        "study": "student life",
        "ai": "AI/tools",
        "tool": "AI/tools",
        "tech": "AI/tools",
        "funny": "comedy",
        "comedy": "comedy",
        "meme": "comedy",
        "motivation": "motivation",
        "mindset": "motivation",
        "skin": "skincare",
        "beauty": "skincare",
        "salon": "skincare",
    }

    tone_samples = [
        "practical and checklist-driven",
        "direct and opinionated",
        "warm and story-led",
        "premium and polished",
        "relatable and conversational",
        "high-energy and challenge-based",
    ]

    format_samples = [
        "uses quick Reel hooks, text overlays, and saveable tips",
        "leans on before-after comparisons and simple breakdowns",
        "turns daily routines into short educational videos",
        "mixes personal stories with practical takeaways",
        "uses list-style captions and comment prompts",
        "builds content around myths, mistakes, and fixes",
    ]

    audience_samples = [
        "beginners who want simple next steps",
        "busy young professionals with limited time",
        "students and early-career followers",
        "small business owners looking for practical ideas",
        "Indian urban audiences who prefer realistic examples",
        "creators who want repeatable content systems",
    ]

    city_keywords = {
        "delhi": "Delhi",
        "mumbai": "Mumbai",
        "bangalore": "Bengaluru",
        "bengaluru": "Bengaluru",
        "pune": "Pune",
        "jaipur": "Jaipur",
        "ahmedabad": "Ahmedabad",
        "surat": "Surat",
        "hyderabad": "Hyderabad",
        "chennai": "Chennai",
        "kolkata": "Kolkata",
    }

    def normalize_handle(self, handle: str) -> str:
        raw = handle.strip()
        if not raw:
            return "creator"

        if raw.startswith("http://") or raw.startswith("https://"):
            parsed = urlparse(raw)
            path_parts = [part for part in parsed.path.split("/") if part]
            raw = path_parts[0] if path_parts else parsed.netloc

        raw = raw.strip().lstrip("@")
        raw = re.sub(r"[^A-Za-z0-9._]", "", raw)
        return raw or "creator"

    def infer_demo_niche(self, handle: str) -> str:
        lowered = handle.lower()
        for keyword, niche in self.keyword_to_niche.items():
            if keyword in lowered:
                return niche

        niches = list(self.niche_samples.keys())
        digest = hashlib.sha256(lowered.encode("utf-8")).hexdigest()
        return niches[int(digest[:2], 16) % len(niches)]

    def _pick(self, handle: str, items: List[str], offset: int = 0) -> str:
        digest = hashlib.sha256(f"{handle}:{offset}".encode("utf-8")).hexdigest()
        return items[int(digest[:4], 16) % len(items)]

    def _secondary_niche(self, handle: str, primary_niche: str) -> str:
        niches = [niche for niche in self.niche_samples if niche != primary_niche]
        return self._pick(handle, niches, offset=7)

    def _city_context(self, handle: str) -> str | None:
        lowered = handle.lower()
        for keyword, city in self.city_keywords.items():
            if keyword in lowered:
                return city
        return None

    def _handle_signal_captions(self, handle: str, niche: str) -> List[str]:
        tone = self._pick(handle, self.tone_samples, offset=1)
        content_format = self._pick(handle, self.format_samples, offset=2)
        audience = self._pick(handle, self.audience_samples, offset=3)
        secondary_niche = self._secondary_niche(handle, niche)
        city = self._city_context(handle)
        city_phrase = f" for {city} followers" if city else ""

        return [
            f"Creator positioning note: this @{handle} page feels {tone}{city_phrase}.",
            f"Content pattern: the account {content_format} for {audience}.",
            f"Audience cue: posts should serve {audience} with examples from {niche} and occasional {secondary_niche} angles.",
        ]

    def get_recent_captions(self, handle: str) -> List[str]:
        clean_handle = self.normalize_handle(handle)
        niche = self.infer_demo_niche(clean_handle)
        secondary_niche = self._secondary_niche(clean_handle, niche)
        primary_captions = self.niche_samples[niche]
        secondary_captions = self.niche_samples[secondary_niche]
        selected = [
            primary_captions[int(hashlib.sha256(f"{clean_handle}:p0".encode("utf-8")).hexdigest()[:2], 16) % len(primary_captions)],
            primary_captions[int(hashlib.sha256(f"{clean_handle}:p1".encode("utf-8")).hexdigest()[:2], 16) % len(primary_captions)],
            primary_captions[int(hashlib.sha256(f"{clean_handle}:p2".encode("utf-8")).hexdigest()[:2], 16) % len(primary_captions)],
            secondary_captions[int(hashlib.sha256(f"{clean_handle}:s0".encode("utf-8")).hexdigest()[:2], 16) % len(secondary_captions)],
            *self._handle_signal_captions(clean_handle, niche),
        ]
        return [f"@{clean_handle}: {caption}" for caption in selected]


def get_instagram_provider() -> InstagramProvider:
    return MockInstagramProvider()
