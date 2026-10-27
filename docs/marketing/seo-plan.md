# SEO Plan: Imaginarium Foundry + 100 Income Streams

Status: draft v0.1 · Owner: Red Pillar · Tooling: [Claude SEO](https://github.com/AgriciDaniel/claude-seo) (`/seo` commands)

---

## 1. Scope and assumptions

| Item | Assumption (confirm or correct) |
|---|---|
| Properties | **Imaginarium Foundry**: the product (Command Center, starting with YouTube Content Intelligence). **100 Income Streams**: a public content hub that catalogs 100 ways to earn, each tied to Foundry workflows. |
| Domain | Not live yet. Plan assumes one domain with the hub in a subfolder (`foundry.example/income-streams/`) so both properties share authority. A separate domain is only worth it if 100 Income Streams becomes its own brand. |
| Stack | `apps/web` (Next.js App Router). Today it is a single client-rendered page with one global `metadata` block. |
| Audience | Creators, educators, entrepreneurs and small teams (from `docs/product/mvp-spec.md`). |

Keyword volumes and difficulty below are **hypotheses**. Validate them with `/seo plan`, `/seo cluster` and the DataForSEO extension before writing pages.

---

## 2. Goals and KPIs

| Horizon | Goal | KPI |
|---|---|---|
| 0–30 days | Technically sound, indexable site | 100% of key pages indexed, 0 critical issues in `/seo audit`, mobile CWV "Good" |
| 30–90 days | Hub launched (first 30 streams) | 30 stream pages indexed, first non-brand impressions in Search Console |
| 90–180 days | Organic demand | 100 stream pages live, 1K+ monthly organic clicks, cited by at least 1 AI engine (ChatGPT, Perplexity, AI Overviews) for a stream query |
| Ongoing | Revenue link | Hub → Foundry sign-up conversion rate, email list growth, affiliate/product revenue per stream page |

---

## 3. Site architecture

```text
/                                   Foundry home (product + positioning)
/product/youtube-content-intelligence   MVP feature page
/use-cases/{creators|educators|small-business}
/tools/{free tool}                  free utilities = link magnets (see §8)
/income-streams/                    100 Income Streams hub (ItemList of all 100)
/income-streams/{category}/         10 category pages
/income-streams/{category}/{stream} 100 stream pages (one template)
/playbooks/{workflow}               Foundry workflows that power a stream
/blog/                              news, case studies, data studies
```

Rules:

- Every stream page links **up** to its category and the hub, **across** to 2–4 related streams, and **down** to the Foundry workflow or tool that helps run it. This internal linking is what turns the hub into Foundry sign-ups.
- Keep URLs short, lowercase and hyphenated. Never change a slug after launch without a 301.
- Breadcrumbs on every hub page.

---

## 4. The 100 Income Streams (taxonomy)

10 categories × 10 streams. Each line is one target page; the slug is the primary keyword idea.

**1. Content creation**: YouTube channel ads · YouTube Shorts fund/revenue share · podcasting · newsletter (paid subscriptions) · blogging with display ads · TikTok creator rewards · Instagram Reels bonuses/brand deals · faceless YouTube channels · live streaming tips/subs · UGC creator

**2. Content repurposing services** (direct Foundry fit): short-form clipping service · video captioning · podcast-to-blog service · YouTube SEO service · thumbnail design · video editing retainers · transcript and show-notes service · social media management · ghostwriting for creators · content strategy consulting

**3. Digital products**: e-books · Notion templates · Canva templates · prompt packs · stock photos/video · printables · presets/LUTs · spreadsheets/financial models · digital planners · design asset kits

**4. Education**: online courses · cohort courses · coaching · tutoring · workshops/webinars · paid community · membership site · certification programs · corporate training · curriculum licensing

**5. AI services and products**: AI automation agency · custom GPTs/agents · AI chatbot setup · AI content agency · AI consulting · AI-generated art sales · AI voiceover services · AI SaaS micro-tool · AI workflow templates · prompt engineering freelance

**6. Software and tech**: micro-SaaS · browser extensions · mobile apps · WordPress/Shopify plugins · APIs · freelance web development · no-code builds · website flipping · bug bounties · technical writing

**7. Commerce**: print on demand · dropshipping · private label · Etsy shop · Amazon KDP · merch for creators · reselling/flipping · subscription boxes · handmade goods · wholesale

**8. Marketing and partnerships**: affiliate marketing · sponsorships · brand ambassador · lead generation · referral programs · paid newsletter ads · influencer management · marketplace listing services · local SEO for businesses · email marketing services

**9. Community and events**: live events/tickets · virtual summits · meetups · mastermind groups · Discord/Skool paid communities · crowdfunding · fan memberships (Patreon) · grants and fellowships · speaking fees · hackathons/competitions

**10. Assets and licensing**: music licensing · footage licensing · IP/character licensing · domain investing · royalty-earning books/audiobooks · photography licensing · course licensing to platforms · white-label products · franchising a system · Web3/digital collectibles (high-risk; label clearly)

> Prioritize the first 30 pages from categories 2, 5 and 1. They have the strongest overlap with what the Foundry already does, so each page can recommend a real Foundry workflow.

---

## 5. Keyword strategy

| Cluster | Example head terms | Intent | Page type |
|---|---|---|---|
| Hub head | "income streams", "multiple streams of income", "passive income ideas", "side hustle ideas" | Informational (very competitive) | `/income-streams/` hub |
| Stream "how to" | "how to start a clipping agency", "how to make money with Notion templates" | Informational → commercial | Stream page |
| Stream "how much" | "how much do YouTube clippers make", "Shorts revenue per 1000 views" | Informational | Stream page section + data study |
| Tool/product | "YouTube transcript to blog", "AI clip finder", "YouTube video summarizer" | Commercial/transactional | `/product/…`, `/tools/…` |
| Brand | "Imaginarium Foundry", "100 Income Streams" | Navigational | Home, hub |

Approach:

1. Head terms are a long game. Win the **long tail first** (stream-level "how to", "how much", "tools for") and let the hub rank on the strength of 100 linked pages.
2. One primary keyword per page. Run `/seo cluster` on the full list to catch cannibalization (e.g. "AI content agency" vs "AI automation agency").
3. Map the product's own features to tool keywords. The MVP already does transcript retrieval, summaries, key moments, titles and captions, and each of those has search demand as a free tool.

---

## 6. Stream page template

Every stream page uses the same structure so it can be produced at scale without becoming thin:

1. **Snapshot box**: startup cost, time to first dollar, skill level, income model (one-off / recurring), risk. Short factual lines that AI engines can quote.
2. **What it is**: 2–3 sentences, plain definition.
3. **How it makes money**: the actual revenue mechanics.
4. **Realistic earnings**: ranges with **cited sources** and dates. No guarantees.
5. **Step-by-step start plan** (first 30 days).
6. **Tools**: including the matching Foundry workflow, with honest alternatives.
7. **Real example or case study**: Red Pillar's own test results where possible (first-hand experience is the strongest E-E-A-T signal).
8. **Risks and who it's not for.**
9. **Related streams** (internal links).
10. **Embedded video** (from the YouTube series, §9) with transcript excerpt.

Minimum bar before publishing: original insight or data the top 3 results lack. Run `/seo content` and `/seo page` on each draft. Avoid producing 100 near-identical AI pages: that is exactly what Google's scaled-content-abuse policy targets.

---

## 7. Technical SEO for `apps/web`

Current gaps found in the repo:

| Issue | Where | Fix |
|---|---|---|
| Home page is `"use client"`; content is rendered client-side | `apps/web/app/page.tsx` | Keep the interactive form as a client component, but render marketing/hub pages as server components with static generation (`generateStaticParams`). |
| One global title/description for every page | `apps/web/app/layout.tsx` | Per-page `generateMetadata` with title template (`%s · Imaginarium Foundry`), description, canonical, Open Graph and Twitter cards. |
| No sitemap or robots | — | Add `app/sitemap.ts` (hub, categories, streams, product pages) and `app/robots.ts`. |
| No structured data | — | JSON-LD per page type (below). |
| No `metadataBase`, OG images | — | Set `metadataBase`; generate OG images with `opengraph-image.tsx` per stream. |
| App/workflow pages are not meant for search | `/v1/workflows/*` results UI | `noindex` on app/dashboard routes; keep them out of the sitemap. |

Structured data:

| Page | Schema.org types |
|---|---|
| Home | `Organization`, `WebSite` |
| Product | `SoftwareApplication` (with `offers` once pricing exists) |
| Hub | `CollectionPage` + `ItemList` of the 100 streams, `BreadcrumbList` |
| Stream | `Article` (author = real person with bio page), `BreadcrumbList`, `VideoObject` when a video is embedded |

Skip `FAQPage` and `HowTo` for rich-result purposes: Google limited FAQ rich results to authoritative government/health sites and retired HowTo rich results in 2023. Validate with `/seo schema`.

Performance targets: LCP < 2.5s, INP < 200ms, CLS < 0.1 on mobile. Check with `/seo technical` and the PageSpeed/CrUX extension once deployed.

---

## 8. AI search (GEO) and links

**Getting cited by AI engines** (`/seo geo`, `/seo agentic`):

- Allow AI search crawlers in `robots.ts` (`OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`, `Googlebot`). Decide separately whether to allow training crawlers (`GPTBot`, `ClaudeBot`, `Google-Extended`); blocking training does not block search citations.
- Lead each section with a direct, quotable answer; keep the snapshot box factual and dated.
- Publish **original data** AI engines can't find elsewhere: e.g. a yearly "State of 100 Income Streams" survey or the Foundry's own earnings experiments.
- Keep entity signals consistent: same name, logo and description across the site, YouTube, LinkedIn, GitHub and Crunchbase-style profiles.

**Link building:**

- **Free tools** as link magnets, each built from MVP capabilities: YouTube transcript extractor, video-to-blog converter, hook/title generator, income stream picker quiz.
- Data studies (above) pitched to creator-economy newsletters and journalists.
- Guest appearances on creator/entrepreneur podcasts, with the episode run through the Foundry pipeline (dogfooding plus backlinks from show notes).
- Open-source: the GitHub repo and skills are themselves linkable assets.

---

## 9. Content engine: dogfood the Foundry

The fastest way to produce 100 good pages is to use the product being marketed:

```text
Record 1 video per stream (YouTube series "100 Income Streams")
      ↓
Foundry YouTube Content Intelligence workflow
      ↓
Transcript + summary + key moments + titles + captions
      ↓
Draft stream page (template §6)  +  3–5 Shorts/Reels/TikToks
      ↓
Human review + /seo content + /seo page
      ↓
Publish → internal links → distribute → measure
```

This gives each page a video (`VideoObject`, YouTube search presence), first-hand experience for E-E-A-T, and a public case study of the Foundry working. Use the existing `youtube-search` and `competitor-intel` skills to research what top creators already rank for on each stream.

YouTube SEO for the series: keyword-led titles, chapters from the key-moments output, description linking to the stream page, one playlist per category.

---

## 10. Trust, compliance and E-E-A-T

Income content is close to "Your Money or Your Life" territory, and Google holds it to a higher standard.

- Real author bylines with bio pages and credentials; disclose AI assistance in the editorial policy.
- **No earnings guarantees.** Use ranges, cite sources, and add an earnings disclaimer site-wide.
- FTC-compliant disclosure on any page with affiliate links, above the first link.
- Clearly label high-risk streams (Web3, dropshipping, trading-adjacent) and say who should avoid them.
- Review each stream page at least yearly; show a "last reviewed" date.

---

## 11. 90-day roadmap

| Weeks | Work | Claude SEO commands |
|---|---|---|
| 1–2 | Confirm domain and brand structure. Validate keyword list. Competitor review of top "income streams" / "side hustle" sites. | `/seo setup`, `/seo plan`, `/seo competitor-pages`, `/seo cluster` |
| 2–4 | Technical foundation in `apps/web`: server-rendered pages, metadata, sitemap, robots, JSON-LD, OG images. Connect Search Console + GA4. | `/seo technical`, `/seo schema`, `/seo google` |
| 3–6 | Build stream page template and hub/category pages. Publish first 10 streams + 1 free tool. | `/seo content-brief`, `/seo page`, `/seo content` |
| 6–10 | Publish streams 11–30 with videos. Launch first data study. Start podcast/newsletter outreach. | `/seo geo`, `/seo backlinks` |
| 10–13 | Full audit, fix, and set a baseline. Plan streams 31–100 (≈10 per month). | `/seo audit`, `/seo drift` |

---

## 12. Measurement

- **Search Console**: impressions, clicks and average position by folder (`/income-streams/`, `/product/`, `/tools/`).
- **GA4**: hub → product page → sign-up funnel; email captures per stream page.
- **AI visibility**: monthly manual check of 20 stream queries in ChatGPT, Perplexity and Google AI Overviews; log citations.
- **Monthly**: `/seo drift` to catch regressions; quarterly `/seo audit`.

---

## 13. Open decisions

1. Domain: one domain with `/income-streams/` (recommended) or a separate 100 Income Streams site?
2. Is 100 Income Streams also a product (course, directory, book), or only a content hub that feeds the Foundry?
3. Affiliate monetization on stream pages: yes or no? This affects disclosures and how tools are presented.
4. Which 30 streams has Red Pillar actually tried? Those should go first, since first-hand experience is the main ranking advantage.
