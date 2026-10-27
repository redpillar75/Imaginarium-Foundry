# 3-Stack Content Chain

One voice memo in; a Substack article, a thread and a finished vertical video out.

```
voice-memo.m4a ──/voice-to-article──▶ article.md + thread.md + talking-points.md
                                          │
                       (optional) data ───┤  only with a source link
                                          ▼
raw take + talking points ──/video-edit──▶ out/final.mp4
```

Skills: `.claude/skills/voice-to-article/` and `.claude/skills/video-edit/`. Copy both to `~/.claude/skills/` to use them from any folder.

## Run it

1. **Record the memo.** A 5-15 min brain dump on your phone. Say real numbers and examples out loud; the article won't invent them.
2. **Stack 1: write.** In `my-content/`, run `/voice-to-article voice-memo.m4a`. Approve the outline, then review `article.md`, `thread.md` and the list of `[NEEDS SOURCE]` / `[LINK]` placeholders.
3. **Stack 2: data (optional).** Fill each `[NEEDS SOURCE]` with something you can link to. A trading-desk alert is a lead, not a source: only use what you can verify, and don't present trade signals as advice.
4. **Stack 3: video.** Record one take from `talking-points.md`: the hook line word for word, the rest in your own words. Don't read the article; it's about 7 minutes long. Copy the take into `my-video/raw/` and run `/video-edit raw/take01.mov, 50 seconds, creators building AI workflows`. Approve the cut list, then the storyboard.
5. **Post.** Publish the article with `final.mp4` embedded, then put the Substack link into post 5 of `thread.md` and post it.

## Measure before you claim

Write down how long each step actually took for your first 3 runs. Use those numbers in any "old way vs. new way" post, and in the beat-19/21 counters in `3-stack-video/moves.md`. Video renders take more than a few minutes; Puppeteer renders frame by frame.

## Watch out for

- **`.md` file names in posts.** `article.md` is also a web address (`.md` is Moldova's domain), so many apps turn it into a link to a stranger's website. In public posts, write "the article file" or put the name in code formatting.
- **Credit.** The chain is built on Divyanshi's voice-memo automation, Marc's agent desk and Charlie Hills' video edit. Name and link them; don't republish their paid content.
