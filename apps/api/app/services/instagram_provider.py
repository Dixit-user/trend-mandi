from typing import List, Protocol


class InstagramProvider(Protocol):
    def get_recent_captions(self, handle: str) -> List[str]:
        """Return public captions for a handle.

        Real scraping or third-party APIs should be implemented here only, never in
        route handlers, and never by asking users for passwords or access tokens.
        """


class MockInstagramProvider:
    def get_recent_captions(self, handle: str) -> List[str]:
        clean_handle = handle.strip().lstrip("@") or "creator"
        return [
            f"Behind the scenes from @{clean_handle}: how I plan this week's content in 30 minutes.",
            "3 small mistakes I made before my posts started getting saves and shares.",
            "A quick tip for creators who want better reach without copying everyone else.",
            "This is the exact workflow I use before recording a Reel.",
            "Your content should sound like you, not like a recycled trend template.",
        ]


def get_instagram_provider() -> InstagramProvider:
    return MockInstagramProvider()
