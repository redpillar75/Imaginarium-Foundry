from __future__ import annotations

import re
from urllib.parse import parse_qs, urlparse

from youtube_transcript_api import YouTubeTranscriptApi


def extract_video_id(url: str) -> str:
    parsed = urlparse(url.strip())
    host = parsed.netloc.lower().split(":")[0]
    if host == "youtu.be":
        return parsed.path.strip("/").split("/")[0]
    if "/shorts/" in parsed.path:
        return parsed.path.split("/shorts/", 1)[1].split("/", 1)[0]
    return parse_qs(parsed.query).get("v", [""])[0]


def fetch_transcript(url: str) -> dict:
    video_id = extract_video_id(url)
    if not video_id or not re.fullmatch(r"[A-Za-z0-9_-]{6,}", video_id):
        raise ValueError("Could not extract a valid YouTube video ID.")

    # youtube-transcript-api v1.x uses an instance method and returns
    # FetchedTranscriptSnippet objects. Convert them to plain dictionaries
    # so they can be serialized safely in the API response.
    api = YouTubeTranscriptApi()
    fetched = api.fetch(video_id, languages=["en"])
    segments = fetched.to_raw_data()
    text = " ".join(item["text"].strip() for item in segments if item.get("text"))
    return {"video_id": video_id, "text": text, "segments": segments}
