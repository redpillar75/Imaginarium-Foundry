# Claude Code prompt: 3-Stack video

Uses the `video-edit` skill (`.claude/skills/video-edit/`). Copy that folder to `~/.claude/skills/` so it works from any project folder. Then copy `moves.md`, `brand.md` and `notes.md` from here into `my-video/` and run Claude Code from there.

```
/video-edit raw/take01.mov, 50 seconds, creators building AI workflows.

Platform: Instagram Reels. best.mp4 is the edit to beat.
Follow moves.md beat by beat. The hook is my first sentence:
"I DON'T EDIT VIDEOS ANYMORE".
```

That's all. The skill holds the workflow, both approval stops, the checks, the export settings and the learning loop.

## After the first render

Give notes one at a time in chat ("hook 1s faster"). Claude applies each note, asks whether it's a rule or a one-off if unclear, and saves rules to `notes.md`. The next video starts with those rules already loaded.
