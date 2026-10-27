# Claude Video Editing Workflow

## Purpose

Have Claude Code edit a raw talking-head take into a finished 1080x1920 vertical video: pauses cut, word-timed captions, a graphic every ~2 seconds, and Claude checking its own output. No timeline work.

Adapted from Charlie Hills' "Claude video editing: the 7 installs and the prompt", with the install commands, folder setup and common fixes filled in.

## Requirements

- Paid Claude plan (Claude Code)
- Mac on Apple Silicon (M1 or later) for `mlx-whisper`; see the Intel/Windows notes for other machines
- About 5 GB free disk space (the Whisper model and Chrome for Puppeteer)

## The 7 Installs

Paste these into Terminal one at a time.

```bash
# 1. Claude Code: runs the edit
curl -fsSL https://claude.ai/install.sh | bash

# 2. Codex (optional): OpenAI alternative
npm install -g @openai/codex        # run this after step 6 if you don't have Node yet

# 3. Homebrew: installs everything else
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# 4. ffmpeg: cuts, joins, mixes and exports
brew install ffmpeg

# 5. mlx-whisper: transcribes and times every word (Apple Silicon)
brew install pipx && pipx ensurepath
pipx install mlx-whisper

# 6. Node.js: runs the graphics code
brew install node

# 7. Puppeteer: renders graphics frames (install inside the project folder; see Folder Setup)
npm install puppeteer
```

Check that everything works:

```bash
claude --version && ffmpeg -version | head -1 && node -v && mlx_whisper --help | head -1
```

### Intel Mac / Windows

Replace step 5 with OpenAI's Whisper:

```bash
pipx install openai-whisper
# usage: whisper raw/take01.mov --model turbo --word_timestamps True --output_format json
```

On Windows, install ffmpeg and Node with `winget install Gyan.FFmpeg OpenJS.NodeJS` and skip Homebrew.

## Folder Setup

```bash
mkdir -p ~/video-edit/{raw,references,assets/{icons,screens,music,fonts},out,work}
cd ~/video-edit
npm init -y && npm install puppeteer
touch STYLE.md LEARNINGS.md
```

```
video-edit/
├── raw/          # the 1 raw take (e.g. take01.mov)
├── references/   # 5 outlier videos whose editing style you want copied
├── assets/
│   ├── icons/    # real app icons (PNG/SVG)
│   ├── screens/  # real app screenshots
│   ├── music/    # background track
│   └── fonts/    # caption fonts
├── work/         # transcripts, cut lists, storyboards, frames (scratch)
├── out/          # final export
├── STYLE.md      # how you edit; written once by you
└── LEARNINGS.md  # notes Claude adds after every edit
```

Open Claude Code from this folder: `cd ~/video-edit && claude`.

## The Prompt

Fill in the bracketed parts and paste it into Claude Code.

```
Goal: Turn raw/[take01.mov] into a finished [45]-sec video for [Instagram Reels],
for [audience, e.g. "small business owners new to AI"]. One file out: out/[final].mp4.

Before planning, read STYLE.md and LEARNINGS.md. Study the 5 videos in references/
for pacing, graphics per second, caption style and hook style.

Workflow:
1. Transcribe with mlx_whisper (word timestamps, JSON) into work/.
2. Cut every pause down to 0.25s and drop retakes (keep the last clean take).
   STOP and show me the cut list (timestamps + text) before cutting.
3. Storyboard 1 still per beat into work/storyboard/.
   STOP and wait for my "yes" before rendering.
4. Put a new graphic on the top half every 2s, slamming in on the exact word
   (from the Whisper timestamps). Render graphics with Puppeteer as transparent
   PNG frames at 1080x1920, then overlay them with ffmpeg.
5. Use only real app icons and screens from assets/. Never invent logos or UI.
   If an asset is missing, ask me.
6. Turn the first sentence into an animated hook.
7. Burn in word-timed captions in the style from STYLE.md.
8. Put music from assets/music/ 12 dB under the voice and fade it out over the last 1s.

Checks before export:
- Extract a frame every 0.25s, look at them, and fix any text overlaps or crops.
- Keep all text out of the top 220px, bottom 400px and right 130px.
- Compare the graphic count per second against the references; add beats if
  it comes in under.

Export: H.264, 1080x1920, 30fps, AAC 48kHz, loudness -14 LUFS (true peak -1 dB)
to out/[final].mp4.

When I approve the final, add what worked and what I corrected to LEARNINGS.md.
```

## STYLE.md template

```markdown
# My Editing Style

## Voice & pacing
- Energy: fast, no breaths left in. Max silence 0.25s.
- Retakes: when I flub a sentence I restart it; always keep the LAST version.

## Captions
- Font: Montserrat ExtraBold (assets/fonts/), white, 6px black stroke
- 3 words max per line; highlight the key word in #FFD400
- Position: just below vertical center

## Graphics
- Top half only, rounded cards, soft drop shadow
- Entry: scale 0 → 110% → 100% over 6 frames, landing on the spoken word
- Never cover my face

## Hook
- First sentence: big kinetic text, one word at a time, under 2.5s

## Music
- Lo-fi / minimal beats, ducked under the voice

## Never
- Stock footage, emoji as graphics, fake UI, transitions longer than 4 frames
```

## LEARNINGS.md template

```markdown
# Learnings
Newest first. Claude appends an entry after each approved edit.

## YYYY-MM-DD: take name / topic
- What I corrected:
- What worked:
- Asset notes (outdated icons, preferred screenshots):
- Rule to apply next time:
```

## How You Use It

1. Install the 7 tools once.
2. Drop 1 raw take in `raw/` and 5 reference videos in `references/`.
3. Paste the prompt with your clip name, target length, platform and audience filled in.
4. Approve the cut list (stop 1), then the storyboard (stop 2).
5. Review `out/`, give notes, and let Claude update `LEARNINGS.md`.

## Common Fixes

| Problem | Fix |
|---|---|
| `brew: command not found` after installing | Run the two `brew shellenv` lines from step 3, then open a new Terminal window. |
| `mlx_whisper: command not found` | Run `pipx ensurepath` and open a new Terminal window. |
| The first transcription is slow | It downloads the model the first time (~1.5 GB). Later runs are fast. |
| Audio drifts out of sync after cuts | iPhone footage is variable frame rate. Convert it first: `ffmpeg -i raw/take01.mov -fps_mode cfr -r 30 -c:a aac work/take01_cfr.mp4` |
| Colors look washed out | The phone recorded in HDR (HEVC). Turn off HDR video in the camera settings, or ask Claude to tonemap to SDR (BT.709). |
| Puppeteer can't find Chrome | `npx puppeteer browsers install chrome` |
| Graphics render with a white background | Screenshot with `omitBackground: true` and a transparent page `background`. |
| Captions are cut off or in the wrong place | Confirm the safe zones (top 220 / bottom 400 / right 130 px) are in the prompt and re-run the frame check. |
| Final loudness is off | Two-pass `loudnorm=I=-14:TP=-1:LRA=11` in ffmpeg. |
| Claude skips the approval stops | Keep "STOP and wait" in capitals in the prompt; reply "no" to send it back. |
