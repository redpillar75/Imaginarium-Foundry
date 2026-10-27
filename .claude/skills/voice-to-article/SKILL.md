---
name: voice-to-article
description: Turns one voice memo (a 5-15 min brain dump) into a ~1000-word Substack article, a 5-post X/Threads thread, and talking points for a 50s video take, in the speaker's own voice and claims, and learns from every note via writing-notes.md. Use when the user has a voice memo or recording they want turned into an article, a thread, or the first stage of their content chain.
---

# Voice to Article

## Purpose
One voice memo in; `article.md`, `thread.md` and `talking-points.md` out. No blank page, and nothing the speaker didn't say.

---

## Inputs

**Check $ARGUMENTS first.** Expected: memo path, audience (default: creators building AI systems). Ask for anything missing.

```
my-content/
├── voice-memo.m4a      # 5-15 min brain dump, mistakes fine
├── writing-notes.md    # the user's writing rules from past notes; created if missing
├── work/               # transcript, outline
├── article.md
├── thread.md
└── talking-points.md
```

## Step 1: Load the learning loop

Read `writing-notes.md`. Every line is a rule, and newer rules win. Rules override the style defaults below.

## Step 2: Transcribe

`mlx_whisper voice-memo.m4a --model mlx-community/whisper-large-v3-turbo --output-format json --output-dir work/` (Intel/Windows: `whisper ... --model turbo`). Fix obvious mis-hearings of names and tools; list each fix.

## Step 3: Outline (STOP)

Group the transcript into 3-5 sections with H2 headers. For each section: the point, the strongest line the speaker actually said (with timestamp), and any example they gave. Then list:
- **Hook options:** 2-3 contradictions or numbers taken from the memo.
- **Claims needing a source:** stats, prices, results, or anything about other people's products.

**STOP: show the outline and wait for the user's "yes".**

## Step 4: Write article.md

- 1000 words (800-1200), conversational, for the audience given.
- Hook: a contradiction or number in the first 2 sentences, from the memo.
- Body: Problem → Solution → Result.
- End with one actionable step.
- Use the speaker's phrasing where it's good; keep their opinions as theirs.
- Don't add facts, numbers, results, quotes or examples that aren't in the memo. Where the article needs one, write `[NEEDS SOURCE: what]` instead.
- Credit any named person's work by name, with `[LINK]` for the user to fill in.

## Step 5: Write thread.md

5 posts, separated by `---`:
1. Hook (the article's first sentence, tightened)
2-4. The 3 key points, one per post
5. CTA + "Full article on Substack: [LINK]"

Each post must fit X's 280 characters, counting the link as 23. Threads allows 500, so the same text works on both.

## Step 6: Write talking-points.md (for the video take)

A 50s take is about 130 spoken words, not the article read aloud. Write:
- **Hook line:** one sentence, said word for word (it becomes the animated hook).
- **5-7 talking points:** a few words each, in order, said in the speaker's own words.
- **3 quotable lines** from the article that are short enough to say on camera. The video edit only shows a quote on screen if it's actually said in the take.

## Step 7: Checks (run them; don't just claim them)

- `wc -w article.md` is between 800 and 1200.
- Measure every thread post's length with a script (link counted as 23); all fit in 280.
- No filler openers: "In today's world", "AI is changing", "In this article", "Let's dive in", "game-changer".
- Paragraphs are 3 sentences or fewer.
- Every `[NEEDS SOURCE]` and `[LINK]` is listed for the user.

Report the results: word count, post lengths, and the open placeholders.

## Step 8: Notes → rules

Same as the video-edit skill. Apply each note, ask whether it's a rule or a one-off if unclear, and save rules to `writing-notes.md` as `YYYY-MM-DD: rule`. Replace older rules instead of stacking them.

---

## Style defaults
- Direct, no fluff, like talking to a smart friend.
- Simple words; explain any jargon in one sentence.
- Short paragraphs, 2-3 sentences.

## Install (once)

```bash
brew install pipx && pipx ensurepath
pipx install mlx-whisper          # Intel Mac / Windows: pipx install openai-whisper
```
