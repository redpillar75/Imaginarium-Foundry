# Claude Code prompt: 3-Stack video

Run from the `my-video/` folder after the installs in `../claude-video-editing.md`.

```
<goal>
Turn raw/take01.mov into a ~50-second Instagram Reel for creators building AI
workflows. One take in, one file out: out/final.mp4.
</goal>

<folder>
my-video/
  raw/take01.mov
  references/      5 outlier videos (best.mp4 is the one to match most closely)
  assets/          fonts/, music/, screens/ (real screenshots and recordings only)
  moves.md         beat list: trigger words, graphics, motion, assets
  brand.md         colors, type, placement, motion, audio
  notes.md         learnings from past edits; read first, update at the end
  work/            transcripts, cut lists, storyboard, frames
  out/
</folder>

<workflow>
1. Read notes.md, brand.md and moves.md. Study references/ for pacing and
   graphics density.
2. Transcribe with mlx_whisper, word-level timestamps, JSON into work/.
3. Cut every pause to 0.25s and drop retakes (keep the last clean take).
   STOP: show me the cut list (timestamps + text) and wait for my "yes".
4. Map each beat in moves.md to its trigger word in the cut transcript. If a
   trigger word wasn't said, pick the closest word and tell me.
5. Storyboard 1 still per beat into work/storyboard/.
   STOP: wait for my "yes" before rendering.
6. Render graphics with Puppeteer as transparent 1080x1920 PNG frames, each
   landing on its trigger word, and overlay them with ffmpeg.
7. Hook: the first sentence ("I don't edit videos anymore") animated
   word by word on the spoken words.
8. Word-timed captions per brand.md.
9. Music 12 dB under the voice.
</workflow>

<checks>
- Extract a frame every 0.25s, look at them, and fix any overlaps, crops,
  or text over the face.
- Nothing in the top 220px, bottom 400px or right 130px.
- Graphics never overlap captions.
- Compare graphics per second against best.mp4; add beats if below.
- If an asset listed in moves.md is missing, stop and ask; never mock up UI.
</checks>

<export>
H.264, 1080x1920, 30fps, AAC 48kHz, -14 LUFS / -1 dB TP → out/final.mp4.
Then append what I corrected to notes.md.
</export>
```
