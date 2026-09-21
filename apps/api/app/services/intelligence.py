from __future__ import annotations

import json
import os

from openai import OpenAI

SYSTEM_PROMPT = """You are the Imaginarium Foundry content-intelligence analyst. Return valid JSON only with keys: summary, chapters, clip_candidates, hooks, captions, titles. Keep claims grounded in the transcript. Each clip candidate must include start_hint, end_hint, reason, and suggested_title. Generate practical short-form content ideas without inventing facts."""


def analyze_transcript(text: str, audience: str | None, goal: str | None) -> dict:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured.")

    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        temperature=0.2,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": json.dumps({"audience": audience, "goal": goal, "transcript": text}),
            },
        ],
    )
    content = response.choices[0].message.content or "{}"
    return json.loads(content)
