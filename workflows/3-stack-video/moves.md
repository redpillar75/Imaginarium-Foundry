# moves.md: "3-Stack AI Content System" (50s, Reels)

One beat per row. Claude builds 1 storyboard still per beat and lands each graphic on the **trigger word** using the Whisper timestamps. Timings are targets; the real ones come from the take after cuts.

Layout (1080x1920):
- Graphics: y 220–900 (top half, inside safe zone)
- Captions: y 1000–1180, just below center
- Face: center/lower frame; nothing over it
- Keep x > 950 clear (right 130px) and y > 1520 clear (bottom 400px)

## Talking points for the take (say these, in order, in your own words)

The hook is your first sentence, so it has to be said word for word. Everything else is loose.

1. "I don't edit videos anymore." (word for word)
2. Creators are stuck in one of three places: ideas, data, editing.
3. Stack 1: voice memo to article.
4. Stack 2: six agents to one insight.
5. Stack 3: one take to a finished video.
6. The time saved (only state a number you actually measured).
7. "Build three this weekend."

## Beats

| # | Time | Trigger word | Graphic | Motion | Assets needed |
|---|------|--------------|---------|--------|---------------|
| 1 | 0:00 | "I" | I DON'T EDIT VIDEOS ANYMORE: one word per hit, white, ANYMORE in accent | Each word slams in (scale 0→110→100%, 6 frames) | none |
| 2 | 0:03 | "ideas" | IDEAS card, red underline draws in | Pop + underline wipe L→R | none |
| 3 | 0:05 | "data" | DATA card stacks under IDEAS | Same | none |
| 4 | 0:07 | "editing" | EDITING card stacks under DATA | Same | none |
| 5 | 0:08 | "stack" / "one" | STACK 1: VOICE → ARTICLE | Slide down from top | none |
| 6 | 0:10 | "voice memo" | Phone voice-memo screen | Scale in, waveform pulses | `assets/screens/voice-memo.png` |
| 7 | 0:12 | "Claude" | Real Claude transcript screen recording, cropped to card | Scale in, 2s loop | `assets/screens/claude-transcribe.mov` |
| 8 | 0:14 | "article" | Draft doc with 3–5 section headers highlighting one by one | Headers tick in | `assets/screens/article-draft.png` |
| 9 | 0:15 | "two" | STACK 2: 6 AGENTS → 1 INSIGHT | Slide down | none |
| 10 | 0:17 | "scanner" | Flowchart nodes 1–3: SCANNER → ANALYST → NEWS | Nodes pop left to right, arrows draw | none |
| 11 | 0:19 | "whales" | Nodes 4–5: WHALES → RISK | Continue chain | none |
| 12 | 0:21 | "boss" | BOSS node; score counts 0→7, node glows green at ≥7 | Count-up + glow | none |
| 13 | 0:23 | "alert" / "text" | Real Telegram alert screenshot | Notification drop-in from top | `assets/screens/telegram-alert.png` |
| 14 | 0:25 | "three" | STACK 3: 1 TAKE → FINAL VIDEO | Slide down | none |
| 15 | 0:27 | "raw" | Before/after split: raw frame vs. captioned frame | Divider wipes across | auto: frames from this edit |
| 16 | 0:30 | "pauses" | Waveform timeline with gaps highlighted red, then collapsing | Gaps delete, timeline shortens | auto: from this take's audio |
| 17 | 0:32 | "graphics" | Mini grid of 4 storyboard stills from this edit | Grid pops in | auto: work/storyboard/ |
| 18 | 0:35 | "hours" | [MEASURED BEFORE] → [MEASURED AFTER] | Number counts down | your real numbers |
| 19 | 0:39 | "chain" | Full chain: MEMO → ARTICLE → DATA → VIDEO → POST | Each icon lights in sequence | none |
| 20 | 0:43 | "rule" | DON'T BUILD 45. BUILD 3. | 45 gets struck through in accent | none |
| 21 | 0:45 | "weekend" | BUILD 3 THIS WEEKEND + down arrow | Arrow bounces 2x | none |

21 beats over about 50s is roughly 1 every 2.4s. If the take runs long, Claude adds beats (key-word callouts) to hold about 2s.

## Rules
- Real screens only. If an asset in the right-hand column is missing, stop and ask; don't mock it up.
- Accent #FF3B30 only on keywords (ANYMORE, red underlines, struck 45, BUILD 3).
- No trading numbers, tickers or returns on screen. Beat 12 shows the scoring mechanic, not a trade.
