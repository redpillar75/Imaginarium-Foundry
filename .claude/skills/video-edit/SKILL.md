---
name: video-edit
description: Edits one raw talking-head take into a finished 1080x1920 vertical video (pause cuts, word-timed captions, a graphic every ~2s, hook, music, -14 LUFS) using Whisper, ffmpeg and Puppeteer, and learns from every note via notes.md. Use when the user wants Claude to edit a raw take, a Reel/Short/TikTok, or run their video edit workflow.
---

# Video Edit

## Purpose
Turn one raw take into one finished vertical video, stopping twice for approval, and get better every video by turning the user's notes into rules in `notes.md`.

A plan or a still frame is not the deliverable. The deliverable is `out/final.mp4`.

---

## Inputs

**Check $ARGUMENTS first.** Expected: raw take path, target seconds, audience. Ask for anything missing.

Project folder (the current directory):

```
my-video/
├── raw/              # one take, mistakes fine
├── references/       # 5 outlier videos the user picked
├── best.mp4          # the edit to beat (optional; else the strongest reference)
├── assets/           # fonts/, music/, screens/, icons/, brand/logo.png
├── brand.md          # colors, type, placement, motion, audio
├── moves.md          # beat list; built from references on first run if missing
├── notes.md          # the user's rules from past notes; created if missing
├── work/             # transcript, cut list, storyboard, frames, checks
└── out/
```

---

## Step 0: Check tools

Run `ffmpeg -version`, `node -v`, `mlx_whisper --help` (or `whisper --help`), and `node -e "require('puppeteer')"`. If any are missing, tell the user the install line from the "Installs" section and stop.

## Step 1: Load the learning loop (before anything else)

Read `notes.md` in full. Every line is a rule for this edit. Where two rules conflict, the newer date wins. Then read `brand.md` and `moves.md`. Rules in `notes.md` override `brand.md`, `moves.md` and this skill's defaults.

Tell the user how many rules you loaded, in one line.

## Step 2: References → moves.md (first run, or when asked)

The user picks outliers (about 5x that creator's usual views). You can't check view counts from a file, so don't claim to.

For each reference: extract 1 frame per second and transcribe it. List its hook (first 3s), cut pace, graphics per second, and layouts. Keep moves seen in 2+ videos. Write them to `moves.md`. Skip this if `moves.md` already has a beat list.

## Step 3: Transcribe

`mlx_whisper raw/<take> --model mlx-community/whisper-large-v3-turbo --word-timestamps True --output-format json --output-dir work/` (Intel/Windows: `whisper ... --model turbo --word_timestamps True --output_format json`).

## Step 4: Cut list (STOP 1)

- Cut pauses down to 0.25s, only in true silence (check the audio level, not just Whisper gaps). Keep every word whole.
- Drop retakes: when a sentence restarts, keep the last clean version.
- Write `work/cutlist.md` (kept ranges with text, removed ranges with reason).

**STOP: show the cut list and wait for the user's "yes".**

## Step 5: Storyboard (STOP 2)

Map each beat in `moves.md` to its trigger word in the cut transcript. If a trigger word wasn't said, use the closest word and say so. Aim for a new graphic every ~2s on the top half, with the face below. Render one still per beat into `work/storyboard/`.

**STOP: wait for the user's "yes" before any render.**

## Step 6: Render

- Cut and join with ffmpeg; convert variable-frame-rate phone footage to 30fps CFR first.
- Graphics: Puppeteer at a 1080x1920 viewport, transparent PNG frames (`omitBackground: true`), each object landing on its word. Then overlay with ffmpeg.
- Hook: the first sentence, animated word by word on the spoken words.
- Captions: word-timed, per `brand.md`.
- Real app icons and screens from `assets/` only. Never mock up UI. If one is missing, ask the user to capture it. Never ask for passwords or logins.
- Music 12 dB under the voice, 1s fade-out.

## Step 7: Checks (run them; don't just claim them)

1. Extract a frame every 0.25s into `work/check/`. Look at them. Flag overlaps, crops and text over the face; fix and check again.
2. Nothing in the top 220px, bottom 400px or right 130px.
3. Count graphic changes vs `best.mp4`. If fewer, add beats and render again.
4. Go through `notes.md` rule by rule. Write `work/rules-check.md` with pass/fail and how each was verified. Fix every fail.

Report the results to the user: which checks passed, what was fixed, and any rule you couldn't verify.

## Step 8: Export

H.264 (yuv420p, `-movflags +faststart`), 1080x1920, 30fps, AAC 48kHz, two-pass `loudnorm=I=-14:TP=-1:LRA=11` → `out/final.mp4`, plus `out/cutlist.md`.

## Step 9: Notes → rules

The user gives notes one at a time. For each note:

1. Apply it and re-render only what changed.
2. Decide whether it's a **rule** ("hook under 2.5s") or a **one-off** ("move the logo on beat 7"). If unclear, ask.
3. Save rules to `notes.md` as `YYYY-MM-DD: rule`, phrased so it applies to any video. If it replaces an older rule, delete the old line rather than leaving both.

Don't add rules the user didn't give. Don't save one-offs.

---

## Installs (macOS, once)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install ffmpeg node pipx && pipx ensurepath
pipx install mlx-whisper          # Intel Mac / Windows: pipx install openai-whisper
npm install puppeteer             # inside my-video/
```

## If it breaks

| Problem | Fix |
|---|---|
| `command not found` after install | Open a new Terminal window |
| `externally-managed-environment` from pip3 | Use `pipx install` instead of `pip3 install` |
| Puppeteer can't find Chrome | `npx puppeteer browsers install chrome` |
| Audio drifts after cuts | Convert to CFR first: `-fps_mode cfr -r 30` |
| Washed-out colors | Phone shot HDR; turn off HDR video or tonemap to BT.709 |
