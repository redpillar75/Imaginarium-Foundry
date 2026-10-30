# AI Video Repos for Claude Code

A vetted list of open-source repos for making videos with Claude Code. These come from a social post, "8 FREE GitHub Repos to Create AI Videos Using Claude Code." Each repo was checked against its GitHub page on **2026-10-30**. Star counts and dates are from that day and will drift.

All eight repos exist and are public. None of them use a video-generation model. Claude writes code (Canvas, WebGL, p5.js, three.js) that draws each frame, a headless browser captures the frames, and ffmpeg encodes them into an MP4. This fits the **Creative Foundry** layer of Imaginarium Foundry: short-form video, explainers, and brand motion graphics.

## At a glance

| # | Repo | Type | Stars | License | Best for |
|---|---|---|---|---|---|
| 1 | [lemomo-ai/lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) | Toolkit + Claude Code plugin | ~9.5k | MIT (code); CC BY 4.0 (films) | End-to-end short films in 66 styles |
| 2 | [Vincentwei1021/mg-styles-15](https://github.com/Vincentwei1021/mg-styles-15) | Prompts + renderer | ~2.6k | MIT | 10-second motion-design / brand promos |
| 3 | [JohnHeibel/ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase) | Starter kit | ~2.3k | MIT | Hand-painted cartoon animation |
| 4 | [mexicat/pdoom-video](https://github.com/mexicat/pdoom-video) | Reference project | ~3.6k | MIT (code only; song excluded) | Music video with synced lyric typography |
| 5 | [JohnHeibel/PDoomVideo](https://github.com/JohnHeibel/PDoomVideo) | Reference project | ~2.7k | **None shown** | Studying a multi-chapter, multi-agent build |
| 6 | [joeseesun/opus-video-prompts](https://github.com/joeseesun/opus-video-prompts) | Prompt library + guide | ~841 | **None shown** | Learning the workflow, cost expectations |
| 7 | [athemeroy/awesome-claude-5-5-videos](https://github.com/athemeroy/awesome-claude-5-5-videos) | Curated list / research | ~835 | CC BY 4.0 (writing) | Research on what styles and workflows work |
| 8 | [yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos) | Curated prompt list | ~12.6k | MIT | Large prompt bank (700+) for one-file HTML videos |

## Recommended starting points

- **Producing finished videos:** start with **lemo-opuscar** (1). It installs as a Claude Code plugin, has the most complete pipeline (visuals, music, TTS narration), and has a clear license.
- **Short branded promos:** use **mg-styles-15** (2). Swap the "Creative seed" in a prompt for our brand, story, and colors. It also supports vertical 1080×1920 output for Shorts and Reels.
- **Character / cartoon content:** use **ClaudeAnimationBase** (3).
- **Ideas and prompts:** browse **awesome-opus5-5-videos** (8) and **opus-video-prompts** (6).

Repos 4 and 5 are mostly useful as worked examples. Repo 7 is research material.

## Repo notes

### 1. lemo-opuscar
66 code-made film styles, each with a style prompt and demo film. Canvas/WebGL rendering, original music, and TTS narration.

```bash
claude plugin marketplace add lemomo-ai/lemo-opuscar
claude plugin install lemo-opuscar@lemolab
# then in Claude Code:
/lemo-opuscar:lemo-opuscar
```

- Requires Node 20+, **ffmpeg 7+** (Ubuntu 24.04's ffmpeg 6.1 is too old), and Python 3.11+ or uv.
- Styles are tuned for Opus 5.5. One film takes about 30–60 minutes of agent time and a lot of tokens.
- Default output: 1920×1080 at 24 fps.

### 2. mg-styles-15
Fifteen 10-second motion-design films, each in a different style, with style notes, prompt, and source. Includes a renderer (`harness/render.mjs`), a sound toolkit (`lib/audio`), a review rubric (`rubric.md`), and a template for new styles (`template.md`).

- Requires Node 22.12+, Google Chrome (set `MG_CHROME` if it isn't in the default location), ffmpeg, and Python 3.11+. Blender is needed only for the 3D style. Fonts are not included.
- To use it, paste a prompt from `prompts/` into Claude Code in an empty folder.

### 3. ClaudeAnimationBase
Starter kit for animating the Clawd character with p5.js and p5.brush. Includes 31 acted emotions and an `ANIMATION_GUIDE.md` the model follows.

- Example request: *"Read ANIMATION_GUIDE.md, then make a 15-second video of Clawd trying to catch a butterfly."* Output goes to `out/video.mp4`.
- Requires Node.js, Chrome, and ffmpeg. A GPU is recommended because watercolour fills render slowly without one. On Linux, use `--soft-gl` (no GPU) or `--gpu-angle=gl-egl` (headless NVIDIA).

### 4. pdoom-video (mexicat)
Code-rendered music video for "I'm Upping My P(doom)," with word-synced karaoke typography. TypeScript, three.js, bun, and Vite. Exports 1080p60 or 4K60.

- Requires bun, Chrome, and ffmpeg with libx264. Regenerating the timing data needs about 4 GB of stems and models that aren't in the repo.
- The MIT license covers the code only. **The song, lyrics, and audio are not licensed for reuse.**

### 5. PDoomVideo (JohnHeibel)
Another code-made music video for the same song, in nine chapters, painted with p5.js and p5.brush. `ANIMATION_GUIDE.md` (the brief Opus wrote for its parallel subagents) and `STORYBOARD.md` show how a long video was split into parallel work.

- **No license is shown.** Read it for ideas, but don't copy its code into our projects.

### 6. opus-video-prompts
18 full prompts, 54 public cases, and 9 technical approaches (Canvas, p5.js, Three.js, Remotion, Manim, Blender). It also covers using external video models for realistic footage.

- Cost guide from the repo: a one-line short costs a few dollars, and a multi-minute music video costs around $200. Many "one-shot" results took two or more rounds.
- Security tip worth adopting: keep API keys in `.env` and deny Claude read access to it in `.claude/settings.json`.
- **No license is shown.** Use it for learning, but don't redistribute its prompts.

### 7. awesome-claude-5-5-videos
Curated, source-linked catalog of 424 Claude 5.5 video posts, sorted by model. Includes research findings on content, style, color, and production workflow, plus a unified CSV (`data/collection-index.csv`). It's a research resource, not a tool.

### 8. awesome-opus5-5-videos
703 prompts (`prompts/`, `data/videos.json`) for viral Opus 5.5 videos, grouped into motion graphics, explainers, 3D scenes, and games. Most prompts produce a single HTML file you screen-record or render into a video.

## Shared requirements

To run most of these in a dev environment, you need:

- Node.js 20+ (22.12+ for mg-styles-15), plus bun for pdoom-video
- Google Chrome or Chromium for headless frame capture
- ffmpeg (7+ for lemo-opuscar)
- Python 3.11+ or uv for audio and analysis tools
- Optional: a GPU, Blender, and TTS or music API keys

## Cautions

- **Review before running.** Installing a plugin or cloning a repo and letting Claude run it executes third-party code. Read the repo first, per the Foundry security principles (least privilege, human approval).
- **Licensing.** Repos 5 and 6 show no license. The P(doom) song in repos 4 and 5 isn't licensed for reuse. Only publish output whose code, music, and assets we have rights to.
- **Cost and time.** Code-rendered video takes a lot of tokens. Budget for several revision rounds, not one shot.
- **Model tuning.** Most styles are tuned for Opus 5.5, so other models may not reproduce them well.
