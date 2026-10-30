# Sample: Imaginarium Foundry, Bauhaus kinetic poster

A 10-second motion-design film made entirely in code, using the [mg-styles-15](https://github.com/Vincentwei1021/mg-styles-15) renderer (MIT) and its Geometric / Bauhaus style.

- **File:** `imaginarium-foundry-bauhaus.mp4`, 1920×1080, 30 fps, exactly 10.000 s, H.264 with 48 kHz stereo AAC, −14 LUFS
- **Preview:** `contact-sheet.jpg`

## Story (120 BPM, one action per beat)

| Time | What happens |
|---|---|
| 0–2 s | Grid hairlines draw. A red circle (the idea) drops and lands. The dividing rule draws. |
| 2–6 s | One shape lands per beat: blue bar, yellow quarter, black triangle, splitting block, red semicircle, blue dot. Then the type: **IMAGINARIUM** (vertical), **FOUNDRY**, and *IDEA · SYSTEM · PRODUCT*. |
| 6–8 s | Hero moment: a 16×9 field of quarter-circle tiles cascades out from the centre on the drop, turns twice, then collapses from the edges inward. |
| 8–10 s | The finished poster locks. A clock hand in the red circle ticks on each beat. |

Palette: cream `#F1E9DA`, red `#E03C31`, yellow `#F2B705`, blue `#1E4FA3`, ink `#111111`. Fonts: Inter / Inter Display (OFL). Music and sound effects are synthesised by the repo's `lib/audio` toolkit, with no samples or third-party audio.

## Re-render

```bash
git clone --depth 1 https://github.com/Vincentwei1021/mg-styles-15 && cd mg-styles-15
npm install --ignore-scripts
uv venv -p 3.12 .venv && uv pip install -p .venv numpy scipy soundfile numba pedalboard pyloudnorm librosa pillow matplotlib
mkdir -p demos/imaginarium && cp <this folder>/source/* demos/imaginarium/
.venv/bin/python demos/imaginarium/audio.py               # → demos/imaginarium/out/audio.wav
MG_CHROME=/path/to/chrome MG_GPU_ARGS="--no-sandbox" \
  node harness/render.mjs demos/imaginarium --workers 4   # → demos/imaginarium/out/video.mp4
```

The film uses Canvas2D only, with no WebGL. On a 4-core cloud container with no GPU, it renders in about 90 s (0.25 s per frame with 4× motion blur).
