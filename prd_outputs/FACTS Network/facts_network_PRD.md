# F.A.C.T.S. Network — Product Requirements Document

**Version:** 1.0
**Date:** 2026-10-02
**Author:** PRD Generator
**Status:** Draft

> **Assumptions used in this document** (override any before build):
> - "F.A.C.T.S." = **F**ood, **A**rt, **C**lothes, **T**ech, **S**helter. **Culture** and **Transportation** from the source notes are treated as two additional cross-cutting categories, so the directory has 7 top-level categories.
> - V1 is a **directory and network** (browse, search, list, inquire, join). It does **not** process transactions between members and vendors. Payments between parties, escrow and booking are P2.
> - **App/platform first, device later.** V1 ships as a responsive web app / PWA. The "preloaded family phone/tablet" is a Phase 2 device program, specified at requirements level only (FR-017).
> - Two-sided: **member households** (demand) and **vendors/creators/hosts** (supply).
> - Revenue is a **membership subscription** (Free, Family, Family Plus) billed through Stripe. Vendor listing fees are post-V1.
> - Stack: Next.js + Node.js/TypeScript API, PostgreSQL with PostGIS, Redis queue, S3-compatible storage, Clerk auth, Stripe billing, hosted on Vercel and Railway/AWS.
> - Closed alpha target: 200 member households and 100 vendors, 90-day build, one launch region (to be chosen; see Open Questions).
> - Topics named in the notes (specific teachers, formulas, cultures and communities) are modeled as **configurable, community-curated taxonomy and content**, not hard-coded features. Seed lists come from the notes and are editable by admins.

---

## 1. Executive Summary

The F.A.C.T.S. Network is a membership platform that connects families to trusted sources of food, art, clothing, technology and shelter, along with the cultural knowledge, transportation and community that surround them. Families join as a household, browse and search a curated directory of growers, artists, makers, manufacturers, hosts and communities, and contact them directly. Vendors, creators and hosts get verified listings, profiles and an audience of aligned households. The core problem is that these resources are scattered across unrelated marketplaces, social feeds and word of mouth, with no single trusted network built around community needs. The expected outcome is a self-sustaining membership community where households find what they need quickly, vendors earn qualified leads, and recurring membership revenue funds growth toward transactions and a preloaded family device.

---

## 2. Problem Statement

**Current state:** A family looking for plant-based food sources, a designer to make apparel, a clothing manufacturer, off-grid land, a culturally grounded education resource or a ride has to use many separate platforms (marketplaces, social media, Airbnb-style sites, Alibaba-style sourcing sites, maps). Vendors in these niches rely on scattered social posts and trade shows. No platform treats the household as the unit, curates for community values, or combines the five basic needs with culture.

**Pain points:**
1. Discovery is fragmented across many unrelated platforms, so people miss trusted sources.
2. No trust layer: members cannot easily tell which vendors, manufacturers and hosts are verified or community-vouched.
3. Creators and small makers (artists, designers, growers) lack affordable audience and sourcing tools. Manufacturing contacts (cut and sew, print on demand, tech packs, factories by region) are hard to find and compare.
4. Culturally specific products, knowledge and communities are buried in general-purpose search and algorithmic feeds.
5. Households (including children and elders) have no single, safe, simple entry point to technology that connects them to these resources.

**Impact:** Households spend hours per week assembling resources and often pay marketplace margins or accept low-quality results. Vendors lose revenue and some never reach their audience. For the platform owner, not solving this means no recurring membership base and no defensible community network.

---

## 3. Goals & Success Metrics

| Goal | Metric | Target (closed alpha) | Measurement Method |
|------|--------|-----------------------|--------------------|
| Build the member base | Households with completed profile | 200 | `household_created` events |
| Build supply | Verified, published vendor listings | 100 across all 7 categories, at least 8 per category | Listings with status `published` and `verified` |
| Fast discovery | Median time from landing to first listing view | ≤ 60 s | Event timestamps |
| Useful search | Search-to-inquiry rate | ≥ 15% of searching sessions | `search_performed` → `inquiry_sent` |
| Vendor value | Vendors receiving at least 1 inquiry in first 30 days | ≥ 60% | Inquiry counts per vendor |
| Recurring revenue | Free-to-paid household conversion | ≥ 8% by day 60 | Stripe subscription events |
| Retention | Week-4 household retention | ≥ 35% | Cohort analysis |
| Trust | Reported-listing resolution time | ≤ 48 h median | Safety case timestamps |
| Quality | Share of listings with complete required fields and verification | ≥ 90% | Listing completeness score |

**Non-goals (V1):** processing payments between members and vendors; escrow and booking; hardware devices; native iOS/Android apps; a no-code storefront builder; AR/VR galleries; vehicle or lodging inventory management; any medical claims or health advice.

---

## 4. User Personas

#### Household Lead (primary, demand side)
- **Role:** Parent or guardian managing a family's needs
- **Goals:** Find trusted food, clothing, art, tech and housing options; learn from culture and community resources; keep the family safe online
- **Pain points:** Too many platforms, unclear trust, no household-level accounts
- **Technical proficiency:** Low to Medium
- **Usage context:** Phone first, evenings and weekends; sometimes shared with children and elders

#### Vendor / Creator / Host (primary, supply side)
- **Role:** Grower, herbalist, artist, designer, clothing maker or manufacturer, tech provider, landlord/host, community organizer or transportation provider
- **Goals:** Get verified, show offerings, receive qualified inquiries, reach aligned households
- **Pain points:** No affordable audience, hard to be found, no simple listing tools, cannot prove legitimacy
- **Technical proficiency:** Low to High (many are no-code users)
- **Usage context:** Mobile and desktop; updates listings weekly

#### Community Curator / Admin (secondary)
- **Role:** Network staff or volunteer curator
- **Goals:** Verify vendors, maintain taxonomy and culture content, handle reports
- **Pain points:** Manual verification, inconsistent standards, safety and policy edge cases
- **Technical proficiency:** Medium
- **Usage context:** Desktop admin console daily

---

## 5. Functional Requirements

Priority split: 7 of 20 features are P0 (35%), 8 are P1 (40%), 5 are P2 (25%).

#### FR-001: Accounts & Household Profiles

**Description:** Adults create an account and a household profile; household members get limited sub-profiles.

**User story:** As a household lead, I want one household account for my family so that everyone can use the network safely.

**Acceptance criteria:**
- [ ] Sign-up supports email/password and Google via Clerk; users confirm they are 18 or older
- [ ] A household has one owner and up to 6 member profiles; each profile has a role (adult, teen 13–17, child under 13)
- [ ] Child profiles are browse-only: no messaging, no inquiries, no external links without an adult PIN
- [ ] Owner can add or remove members and delete the household and all data
- [ ] Household stores region, interests (selected from the 7 categories) and communication preferences
- [ ] Authorization tests confirm no user can read another household's data

**Priority:** P0

**Dependencies:** None

#### FR-002: Category Directory & Taxonomy

**Description:** A browsable directory organized into 7 top-level categories with a configurable sub-category taxonomy.

**User story:** As a household lead, I want to browse by need so that I find the right resources without knowing vendor names.

**Acceptance criteria:**
- [ ] Top-level categories: Food, Art, Clothes, Tech, Shelter, Culture, Transportation
- [ ] Sub-categories are admin-editable and seeded from the notes (e.g., Food: agriculture, horticulture, plant-based, herbs; Art: painters, illustrators, graphic design, videography, 3D, AR/VR, digital arts, martial arts; Clothes: apparel, wholesale, print on demand, cut and sew, embroidery, tech packs, leather goods, linen, hemp, manufacturers; Shelter: rentals, homesteads, camping, off-grid, eco and solar-punk communities; Transportation: ride share, car rental, car sales, limo)
- [ ] Taxonomy changes publish without a deploy and appear within 60 seconds
- [ ] Each category page loads the first 20 listings in under 2 seconds
- [ ] A listing can belong to 1 primary and up to 2 secondary categories

**Priority:** P0

**Dependencies:** FR-001

#### FR-003: Search & Filter

**Description:** Keyword and filter search across all listings.

**User story:** As a household lead, I want to search and filter so that I find the right vendor quickly.

**Acceptance criteria:**
- [ ] Full-text search over title, description, tags and category, returning results in under 1.5 seconds at p95 for up to 10,000 listings
- [ ] Filters: category, sub-category, region/distance, verified-only, price range (where provided), rating (once FR-010 exists)
- [ ] Sort options: relevance, distance, newest
- [ ] Empty results show suggestions and a "Request this" action
- [ ] Search queries are logged without personal identifiers

**Priority:** P0

**Dependencies:** FR-002

#### FR-004: Vendor Onboarding & Listing Creation

**Description:** Vendors apply, get verified and create listings.

**User story:** As a vendor, I want to apply and publish a listing so that households can find me.

**Acceptance criteria:**
- [ ] Application collects business/personal name, category, region, contact method, links, and required documents by category (see FR-006)
- [ ] New vendors are `pending` until an admin approves; target review time 3 business days
- [ ] A listing has title, description (max 2,000 chars), up to 12 images, category, tags, region, price info and contact preference
- [ ] Vendors can save drafts and publish only when required fields are complete
- [ ] Vendors can edit or unpublish at any time; edits to risk-flagged categories re-enter review
- [ ] Image uploads accept JPG/PNG/WEBP up to 10 MB each and are scanned for unsupported content

**Priority:** P0

**Dependencies:** FR-001

#### FR-005: Listing Detail & Inquiry

**Description:** Listing pages with a contact/inquiry flow instead of in-app checkout.

**User story:** As a household lead, I want to contact a vendor from a listing so that I can ask questions or start an order.

**Acceptance criteria:**
- [ ] Listing page shows media, description, category, region, verification badge, vendor profile link and a clear "Send inquiry" button
- [ ] Inquiry form has message (max 1,000 chars) and optional phone/email share toggle; adults only
- [ ] Vendors receive the inquiry by email and in a vendor inbox within 60 seconds
- [ ] A member can send at most 10 inquiries per day (rate limit)
- [ ] External links display an "leaving the network" notice
- [ ] Every inquiry creates a record with timestamp, listing, sender household and status

**Priority:** P0

**Dependencies:** FR-003, FR-004

#### FR-006: Trust, Verification, Moderation & Reporting

**Description:** Verification by category, content policies and a reporting system.

**User story:** As a household lead, I want to trust the listings I see so that my family is safe.

**Acceptance criteria:**
- [ ] Verification levels: `unverified`, `identity_verified`, `category_verified` (e.g., business license for manufacturers and lodging, vehicle insurance for transportation, food handling/permits where required)
- [ ] Badge displayed on listings and profiles; `category_verified` required to publish in Shelter and Transportation
- [ ] Prohibited content policy enforced: counterfeit or trademark-infringing goods (including knock-off "designer brands"), unlicensed lodging or vehicles, hate or harassment content, and unsubstantiated medical or cure claims
- [ ] Listings in Food (herbs, supplements) and wellness-related sub-categories must show a standard disclaimer ("Not medical advice; statements have not been evaluated by the FDA") and cannot claim to treat, cure or prevent disease; violations are blocked at publish
- [ ] Every listing and profile has a "Report" action; reports create a Safety Case visible in the admin console within 60 seconds
- [ ] Admins can unpublish a listing, suspend a vendor or household, each logged as an audit event
- [ ] Appeals: vendors can contest an action; response within 5 business days

**Priority:** P0

**Dependencies:** FR-004

#### FR-007: Membership Tiers & Billing

**Description:** Free and paid household memberships via Stripe.

**User story:** As a household lead, I want to choose a membership so that I get more access and support the network.

**Acceptance criteria:**
- [ ] Tiers in config: Free (browse, 5 inquiries/month), Family ($ amount set in config; unlimited inquiries, saved lists, culture hub), Family Plus (adds event access and early features)
- [ ] Checkout, upgrades, downgrades, cancellation and invoices via Stripe Checkout and Customer Portal
- [ ] Tier entitlements apply within 30 seconds of a confirmed Stripe event
- [ ] Webhooks are idempotent by Stripe event ID; replayed events never double-apply
- [ ] Failed payments move the household to a 7-day grace period, then downgrade to Free without data loss

**Priority:** P0

**Dependencies:** FR-001

#### FR-008: Culture Hub

**Description:** Curated cultural content (articles, video, audio, events, reading lists) organized by configurable culture collections.

**User story:** As a household lead, I want trusted cultural resources so that my family can learn history and traditions.

**Acceptance criteria:**
- [ ] Admins create collections (e.g., hip-hop, jazz, African, Caribbean, Indigenous, Egyptian, Moorish, Islamic, Hebrew Israelite and other community collections seeded from the notes) and add content with source attribution
- [ ] Each item shows author/source, date and content type; user-submitted content is moderated before publish
- [ ] Content policy prohibits hate speech and harassment; the network does not endorse any single group's claims, and items are labeled with their source
- [ ] Members can follow collections and see new items in their feed
- [ ] Collections page loads in under 2 seconds

**Priority:** P1

**Dependencies:** FR-002, FR-006

#### FR-009: Saved Lists & Household Needs Board

**Description:** Members save listings and post needs that vendors can answer.

**User story:** As a household lead, I want to save options and post what I need so that vendors come to me.

**Acceptance criteria:**
- [ ] Members can create named lists and save any listing; up to 20 lists, 200 items each
- [ ] A "need" post has category, description, region and budget range; visible to verified vendors in that category
- [ ] Vendors can respond to a need once; responses are delivered as inquiries
- [ ] Needs expire after 30 days unless renewed

**Priority:** P1

**Dependencies:** FR-005

#### FR-010: Vendor Profiles, Reviews & Ratings

**Description:** Public vendor profiles with verified-interaction reviews.

**User story:** As a household lead, I want to read reviews so that I can choose with confidence.

**Acceptance criteria:**
- [ ] Vendor profile shows bio, listings, verification badges and rating summary
- [ ] Only households that sent an inquiry and confirmed contact can post a review (1–5 stars plus text up to 1,000 chars)
- [ ] Vendors can respond once per review; reviews can be reported
- [ ] Rating averages update within 60 seconds

**Priority:** P1

**Dependencies:** FR-005, FR-006

#### FR-011: In-App Messaging

**Description:** Threaded messaging between adult members and vendors.

**User story:** As a member, I want to continue a conversation with a vendor in the app so that I don't have to share my personal contact details.

**Acceptance criteria:**
- [ ] Inquiries convert into message threads; messages deliver in under 2 seconds
- [ ] Block and report actions on every thread; blocked users cannot message again
- [ ] Email notification when offline, with an unsubscribe option
- [ ] Messages are retained 12 months, then deleted unless under a Safety Case

**Priority:** P1

**Dependencies:** FR-005

#### FR-012: Events & Trade Show Calendar

**Description:** Calendar of workshops, trade shows, markets and community events.

**User story:** As a member or vendor, I want to find events so that I can meet people and sources in person.

**Acceptance criteria:**
- [ ] Verified vendors and admins can post events with date, location, category and link
- [ ] Calendar filters by category, region and date; events display in the viewer's timezone
- [ ] Members can mark "Interested" and add to a calendar file (.ics)
- [ ] Past events auto-archive after 7 days

**Priority:** P1

**Dependencies:** FR-004

#### FR-013: Referrals & Community Credits

**Description:** Invite links that earn membership credit after a referred household activates.

**User story:** As a member, I want to earn credit for inviting families so that the network grows.

**Acceptance criteria:**
- [ ] Each household gets one referral link
- [ ] Credit applies only after the referred household completes its profile and sends a first inquiry
- [ ] Self-referral and duplicate-household patterns are blocked or held for review
- [ ] Credit is shown as a Stripe customer balance with a stated amount and expiry

**Priority:** P1

**Dependencies:** FR-007

#### FR-014: Map & Region View

**Description:** Map view of listings with a location, including homesteads, communities and campgrounds.

**User story:** As a household lead, I want to see options on a map so that I can find places near me.

**Acceptance criteria:**
- [ ] Map shows listing pins clustered by zoom level; tapping a pin opens a card
- [ ] Vendors choose whether to show exact address or an approximate area (default approximate, within 1 km)
- [ ] Radius filter returns results in under 2 seconds
- [ ] Residential and off-grid listings never expose an exact address until the vendor accepts an inquiry

**Priority:** P1

**Dependencies:** FR-003

#### FR-015: Manufacturer & Sourcing Directory (Clothes)

**Description:** A structured sub-directory for apparel production partners with capability filters.

**User story:** As a designer, I want to compare manufacturers so that I can pick a production partner.

**Acceptance criteria:**
- [ ] Manufacturer listings include fields: capabilities (cut and sew, silkscreen, vinyl, embroidery, all-over print, print on demand, pattern design, tech packs, leather, linen, hemp), materials (e.g., Egyptian cotton), minimum order quantity, lead time range, country/region, certifications
- [ ] Filter and sort by any structured field
- [ ] Designers can upload a tech pack (PDF, max 25 MB) to attach to an inquiry; files are private to the sender and recipient
- [ ] Listings from any country are allowed; each shows country of manufacture and a note on import/duty responsibilities

**Priority:** P1

**Dependencies:** FR-004, FR-005

#### FR-016: Transactions & Escrow

**Description:** In-app payment between member and vendor with marketplace fee and held funds.

**User story:** As a member, I want to pay a vendor in-app so that I'm protected.

**Acceptance criteria:**
- [ ] Stripe Connect onboarding for vendors; platform fee configurable per category
- [ ] Funds held until the member confirms delivery or a timeout passes
- [ ] Refund and dispute workflow with admin override
- [ ] All state changes logged immutably

**Priority:** P2

**Dependencies:** FR-005, FR-007

#### FR-017: Preloaded Family Device Program

**Description:** Branded phone/tablet with the network apps preinstalled and a family mode.

**User story:** As a household lead, I want a ready-to-use family device so that my family is connected without setup.

**Acceptance criteria:**
- [ ] Android build with launcher and preinstalled PWA/app, enrolled with a mobile device management (MDM) service
- [ ] Family mode honors household roles (child profiles restricted)
- [ ] Device ships with a membership trial attached to the household
- [ ] Remote lock and wipe available to the household owner

**Priority:** P2

**Dependencies:** FR-001, FR-007

#### FR-018: Creator Tools & No-Code Storefronts

**Description:** No-code storefront and print-on-demand connections for art and clothing creators.

**User story:** As a creator, I want a storefront without coding so that I can sell my work.

**Acceptance criteria:**
- [ ] Creator picks a template, adds products and publishes a hosted page in under 15 minutes
- [ ] Connectors for at least 2 print-on-demand or drop-ship providers
- [ ] Orders sync to a vendor dashboard

**Priority:** P2

**Dependencies:** FR-016

#### FR-019: Booking for Shelter & Transportation

**Description:** Availability calendars and reservation requests.

**User story:** As a member, I want to book a stay or ride so that I can plan ahead.

**Acceptance criteria:**
- [ ] Hosts set availability and rules; members submit a reservation request with dates
- [ ] Host accepts or declines within 48 hours; unanswered requests auto-expire
- [ ] Double-booking is prevented at the database level

**Priority:** P2

**Dependencies:** FR-016, FR-014

#### FR-020: 3D, AR and Video Galleries for Art

**Description:** Richer media for art listings, including 3D models and AR preview.

**User story:** As an artist, I want to show 3D and AR work so that buyers can preview it.

**Acceptance criteria:**
- [ ] Listings accept GLB models up to 50 MB and videos up to 500 MB
- [ ] Viewer supports rotate/zoom and an AR-view button on supported devices
- [ ] Files are transcoded or validated before display

**Priority:** P2

**Dependencies:** FR-004

---

## 6. Non-Functional Requirements

#### Performance
- Page load time: under 3 seconds on typical mobile 4G
- API response time: p95 under 400 ms (search under 1.5 s)
- Concurrent users supported: 500 at alpha, 5,000 at public beta

#### Security
- Authentication method: Clerk-issued JWT verified server-side on every request
- Data encryption: TLS 1.2+ in transit, AES-256 at rest
- Compliance requirements: COPPA (child profiles collect no personal data), GDPR/CCPA principles, PCI handled entirely by Stripe, FTC rules on endorsements and health claims, FDA rules for supplement-style claims
- Server-side authorization on every household, listing, inquiry and admin action; role-based access for admins
- Rate limits on login, inquiries, uploads and reporting

#### Scalability
- Expected initial load: 200 households, 100 vendors, ~5,000 searches per week
- Growth target: 20,000 households and 3,000 vendors in 12 months
- Scaling approach: stateless API (horizontal), managed PostgreSQL with read replica, search index (Postgres full-text first, Meilisearch or OpenSearch if needed)

#### Availability
- Uptime target: 99.5% monthly
- Backup frequency: database every 6 hours with point-in-time recovery
- Disaster recovery: RTO 4 hours, RPO 6 hours

#### Accessibility and Inclusion
- WCAG 2.1 AA for core flows; keyboard and screen-reader support
- Low-bandwidth mode: text-first pages under 300 KB; images lazy-loaded
- Plain-language UI at about a 6th-grade reading level; multi-language support is a post-V1 item

---

## 7. Technical Architecture

#### System Overview
A responsive Next.js web app (installable as a PWA) talks to a TypeScript/Node API. The API uses PostgreSQL (with PostGIS for location) as the system of record, Redis for queues and rate limiting, and S3-compatible storage for media. Clerk handles identity and Stripe handles billing. A moderation worker scans uploads and text. An admin console provides verification, curation and safety tools.

#### Technology Stack
- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS, installable PWA
- **Backend:** Node.js 22, TypeScript, Fastify, Zod
- **Database:** PostgreSQL 16 with PostGIS, Prisma ORM
- **Queue/cache:** Redis with BullMQ
- **Storage:** S3-compatible bucket with CDN and signed URLs
- **Auth:** Clerk
- **Payments:** Stripe (Checkout, Billing, Customer Portal; Connect in P2)
- **Hosting:** Vercel (web), Railway or AWS (API and workers)
- **Key libraries:** TanStack Query, MapLibre GL, Sharp, Resend (email), Playwright, Vitest

#### Architecture Diagram (Description)
"A member's browser loads the Next.js PWA from Vercel. API calls carry a Clerk JWT to the Fastify API. Search requests hit PostgreSQL full-text and PostGIS queries and return paginated listings. Vendor uploads go directly to S3 via pre-signed URLs, then a BullMQ worker validates and moderates them before the listing can publish. An inquiry is written to PostgreSQL, which triggers an email through Resend and an entry in the vendor inbox. Stripe webhooks hit a signature-verified endpoint that updates household entitlements idempotently. The admin console reads the verification queue, safety cases and audit log."

---

## 8. API Specifications

All endpoints are prefixed `/api/v1`. Authenticated endpoints require `Authorization: Bearer <Clerk JWT>`.

#### GET /api/v1/listings

**Purpose:** Search and browse listings.

**Authentication:** Optional (Free-tier limits apply to anonymous users)

**Request (query):**
```json
{
  "q": "string — keyword, optional",
  "category": "string — food | art | clothes | tech | shelter | culture | transportation",
  "subcategory": "string — optional",
  "lat": "number — optional",
  "lng": "number — optional",
  "radius_km": "number — optional, max 500",
  "verified_only": "boolean — default false",
  "sort": "string — relevance | distance | newest",
  "cursor": "string — pagination cursor"
}
```

**Response (200):**
```json
{
  "items": [
    {
      "id": "uuid",
      "title": "string",
      "category": "string",
      "region": "string",
      "verification": "unverified | identity_verified | category_verified",
      "thumbnail_url": "string",
      "distance_km": "number | null"
    }
  ],
  "next_cursor": "string | null"
}
```

**Error responses:**
- 400: Invalid category, radius or cursor
- 429: Rate limit exceeded

#### POST /api/v1/households

**Purpose:** Create a household after sign-up.

**Authentication:** Required

**Request:**
```json
{
  "name": "string — 1-80 chars",
  "region": "string — region code",
  "interests": ["string — category slugs"],
  "age_confirmed_18_plus": "boolean — must be true"
}
```

**Response (201):**
```json
{
  "household_id": "uuid",
  "tier": "free",
  "created_at": "ISO-8601 timestamp"
}
```

**Error responses:**
- 400: `age_confirmed_18_plus` is not true or invalid region
- 401: Not authenticated
- 409: User already owns a household

#### POST /api/v1/vendors/applications

**Purpose:** Apply to become a vendor.

**Authentication:** Required

**Request:**
```json
{
  "display_name": "string",
  "primary_category": "string",
  "region": "string",
  "contact_method": "string — email | phone | form",
  "documents": ["uuid — uploaded document IDs"],
  "links": ["string — URLs"]
}
```

**Response (201):**
```json
{
  "application_id": "uuid",
  "status": "pending",
  "estimated_review_by": "ISO-8601 timestamp"
}
```

**Error responses:**
- 400: Missing required documents for the category
- 401: Not authenticated
- 409: Pending application already exists

#### POST /api/v1/listings

**Purpose:** Create a draft listing (approved vendors).

**Authentication:** Required (vendor role)

**Request:**
```json
{
  "title": "string — 5-120 chars",
  "description": "string — max 2000 chars",
  "primary_category": "string",
  "secondary_categories": ["string — max 2"],
  "tags": ["string — max 10"],
  "region": "string",
  "location": { "lat": "number", "lng": "number", "precision": "approximate | exact" },
  "price_info": "string — optional",
  "image_ids": ["uuid — max 12"]
}
```

**Response (201):**
```json
{
  "listing_id": "uuid",
  "status": "draft",
  "completeness_score": "number — 0 to 100"
}
```

**Error responses:**
- 400: Field validation failed
- 403: Vendor not approved or category requires verification
- 422: Content blocked by policy (response includes `reason_code`)

#### POST /api/v1/listings/{listing_id}/inquiries

**Purpose:** Send an inquiry to a vendor.

**Authentication:** Required (adult household member)

**Request:**
```json
{
  "message": "string — max 1000 chars",
  "share_contact": "boolean",
  "attachment_ids": ["uuid — optional, e.g. tech pack"]
}
```

**Response (201):**
```json
{
  "inquiry_id": "uuid",
  "status": "sent",
  "remaining_today": "integer"
}
```

**Error responses:**
- 403: Child profile or suspended household
- 404: Listing not found or unpublished
- 429: Daily inquiry limit reached or Free-tier monthly limit reached

#### POST /api/v1/reports

**Purpose:** Report a listing, profile, message or content item.

**Authentication:** Required

**Request:**
```json
{
  "target_type": "string — listing | vendor | message | culture_item",
  "target_id": "uuid",
  "category": "string — counterfeit | unsafe | hate_harassment | medical_claim | fraud | other",
  "details": "string — max 1000 chars"
}
```

**Response (201):**
```json
{
  "safety_case_id": "uuid",
  "status": "open"
}
```

**Error responses:**
- 400: Invalid target or category
- 404: Target not found

#### POST /api/v1/webhooks/stripe

**Purpose:** Receive Stripe events and update memberships.

**Authentication:** None (verified by Stripe signature header)

**Request:** Raw Stripe event body

**Response (200):**
```json
{ "received": true }
```

**Error responses:**
- 400: Invalid signature
- 200 with `"duplicate": true` if the event ID was already processed

---

## 9. UI/UX Requirements

#### Home / Landing

**Purpose:** Explain the network and route people to join or browse.

**Key elements:**
- Seven category tiles (Food, Art, Clothes, Tech, Shelter, Culture, Transportation)
- Primary CTA "Join as a family"; secondary CTA "List your work"
- Featured verified vendors and upcoming events

**User flow:**
1. Visitor lands and picks a category or a CTA
2. System shows the directory or sign-up
3. Visitor browses without signing in; sign-in is required to send inquiries

**States:**
- Empty state: seeded featured content when no region data exists
- Loading state: skeleton tiles
- Error state: retry banner with cached content

#### Household Setup

**Purpose:** Capture household basics in under 3 minutes.

**Key elements:**
- Household name, region, interest chips, member profiles (adult/teen/child), child-safe PIN

**User flow:**
1. User creates account and confirms 18+
2. User sets up household and members
3. System lands on a personalized directory

**States:**
- Empty state: skip option for member profiles
- Loading state: inline progress
- Error state: field-level messages

#### Directory & Search

**Purpose:** Browse and filter listings.

**Key elements:**
- Search bar, category chips, filter drawer, list/map toggle, sort
- Listing cards with badge, region, thumbnail

**User flow:**
1. User picks a category or searches
2. System returns paginated results
3. User opens a listing

**States:**
- Empty state: "Nothing here yet" with "Request this" action
- Loading state: skeleton cards
- Error state: retry with offline cache of last results

#### Listing Detail

**Purpose:** Evaluate a vendor and make contact.

**Key elements:**
- Gallery, description, structured fields (e.g., MOQ for manufacturers), verification badge, vendor profile link, Report button, Send inquiry button

**User flow:**
1. User reads details
2. User taps Send inquiry and writes a message
3. System confirms and shows next steps

**States:**
- Empty state: n/a
- Loading state: skeleton
- Error state: "This listing was removed" with similar listings

#### Vendor Dashboard

**Purpose:** Manage listings, inquiries and verification status.

**Key elements:**
- Application status, listings table with completeness score, inbox, basic analytics (views, inquiries)

**User flow:**
1. Vendor applies and uploads documents
2. Admin approves
3. Vendor creates and publishes listings

**States:**
- Empty state: guided first-listing checklist
- Loading state: skeleton
- Error state: save-failed banner with retry

#### Culture Hub

**Purpose:** Explore curated cultural collections.

**Key elements:**
- Collection grid, content cards with source labels, follow button

**States:**
- Empty state: suggested collections
- Loading state: skeleton
- Error state: retry banner

#### Admin Console

**Purpose:** Verification, curation, safety and audit.

**Key elements:**
- Verification queue, Safety Cases, taxonomy editor, culture content queue, audit log, suspend/unpublish actions

**States:**
- Empty state: "Queue is clear"
- Loading state: skeleton table
- Error state: action-failed banner with retry

---

## 10. Data Models

#### User

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| clerk_user_id | string | Yes | External auth ID |
| email | string | Yes | Account email |
| role | enum | Yes | member, vendor, curator, admin |
| age_confirmed_at | timestamp | No | 18+ confirmation |
| status | enum | Yes | active, suspended, deleted |
| created_at | timestamp | Yes | Creation timestamp |

**Relationships:**
- Has one Household (owner) or belongs to one HouseholdMember; may have one Vendor

**Indexes:**
- clerk_user_id (unique), email (unique)

#### Household

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| owner_id | UUID | Yes | FK to User |
| name | string | Yes | Display name |
| region | string | Yes | Region code |
| interests | string[] | No | Category slugs |
| tier | enum | Yes | free, family, family_plus |
| stripe_customer_id | string | No | Stripe customer |
| created_at | timestamp | Yes | Creation timestamp |

**Relationships:**
- Has many HouseholdMembers, SavedLists, Inquiries

**Indexes:**
- owner_id (unique), region

#### HouseholdMember

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| household_id | UUID | Yes | FK to Household |
| display_name | string | Yes | First name or nickname only |
| role | enum | Yes | adult, teen, child |
| pin_hash | string | No | Adult PIN for child-mode exits |

**Relationships:**
- Belongs to Household

**Indexes:**
- household_id

#### Vendor

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| user_id | UUID | Yes | FK to User |
| display_name | string | Yes | Public name |
| primary_category | string | Yes | Category slug |
| region | string | Yes | Region code |
| status | enum | Yes | pending, approved, rejected, suspended |
| verification_level | enum | Yes | unverified, identity_verified, category_verified |
| created_at | timestamp | Yes | Creation timestamp |

**Relationships:**
- Has many Listings, VerificationDocuments

**Indexes:**
- user_id (unique), (primary_category, status)

#### VerificationDocument

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| vendor_id | UUID | Yes | FK to Vendor |
| type | string | Yes | business_license, insurance, id, permit |
| storage_key | string | Yes | Private S3 key |
| status | enum | Yes | pending, accepted, rejected |
| reviewed_by | UUID | No | Admin user |
| expires_at | timestamp | No | Document expiry |

**Relationships:**
- Belongs to Vendor

**Indexes:**
- (vendor_id, status)

#### Category

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| parent_id | UUID | No | FK to Category (null for top-level) |
| slug | string | Yes | URL-safe key |
| name | string | Yes | Display name |
| risk_level | enum | Yes | standard, restricted (requires category verification) |
| active | boolean | Yes | Published flag |
| sort_order | integer | Yes | Display order |

**Relationships:**
- Self-referencing parent/child; has many Listings

**Indexes:**
- slug (unique), parent_id

#### Listing

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| vendor_id | UUID | Yes | FK to Vendor |
| title | string | Yes | 5–120 chars |
| description | text | Yes | Max 2,000 chars |
| primary_category_id | UUID | Yes | FK to Category |
| secondary_category_ids | UUID[] | No | Max 2 |
| tags | string[] | No | Max 10 |
| attributes | jsonb | No | Category-specific fields (e.g., MOQ, materials) |
| location | geography(Point) | No | PostGIS point |
| location_precision | enum | Yes | approximate, exact |
| status | enum | Yes | draft, in_review, published, unpublished, removed |
| search_vector | tsvector | Yes | Full-text index |
| created_at | timestamp | Yes | Creation timestamp |

**Relationships:**
- Belongs to Vendor; has many MediaAssets and Inquiries

**Indexes:**
- GIN(search_vector), GIST(location), (primary_category_id, status)

#### Inquiry

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| listing_id | UUID | Yes | FK to Listing |
| household_id | UUID | Yes | FK to Household |
| sender_member_id | UUID | Yes | FK to HouseholdMember (adult) |
| message | text | Yes | Max 1,000 chars |
| share_contact | boolean | Yes | Default false |
| status | enum | Yes | sent, read, replied, closed |
| created_at | timestamp | Yes | Creation timestamp |

**Relationships:**
- Belongs to Listing and Household; has many Messages

**Indexes:**
- (listing_id, created_at), (household_id, created_at)

#### CultureCollection

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| slug | string | Yes | URL-safe key |
| title | string | Yes | Display title |
| description | text | No | Collection summary |
| curator_id | UUID | Yes | FK to User |
| active | boolean | Yes | Published flag |

**Relationships:**
- Has many CultureItems

**Indexes:**
- slug (unique)

#### CultureItem

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| collection_id | UUID | Yes | FK to CultureCollection |
| type | enum | Yes | article, video, audio, event, reading_list |
| title | string | Yes | Display title |
| source_attribution | string | Yes | Author or source |
| url_or_storage_key | string | Yes | External link or stored file |
| status | enum | Yes | pending, published, removed |

**Relationships:**
- Belongs to CultureCollection

**Indexes:**
- (collection_id, status)

#### Subscription

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| household_id | UUID | Yes | FK to Household |
| stripe_subscription_id | string | Yes | Stripe ID |
| tier | enum | Yes | family, family_plus |
| status | enum | Yes | active, past_due, canceled |
| current_period_end | timestamp | Yes | Billing period end |

**Relationships:**
- Belongs to Household

**Indexes:**
- household_id, stripe_subscription_id (unique)

#### SafetyCase

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| target_type | string | Yes | listing, vendor, message, culture_item |
| target_id | UUID | Yes | Target ID |
| reporter_id | UUID | No | FK to User |
| category | string | Yes | counterfeit, unsafe, hate_harassment, medical_claim, fraud, other |
| status | enum | Yes | open, in_review, resolved, appealed |
| resolution | text | No | Outcome |
| created_at | timestamp | Yes | Creation timestamp |

**Relationships:**
- References any target entity

**Indexes:**
- status, (target_type, target_id)

#### AuditEvent

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary key |
| actor_id | UUID | No | User or admin |
| action | string | Yes | e.g. listing.unpublished |
| target_type | string | Yes | Entity type |
| target_id | string | Yes | Entity ID |
| metadata | jsonb | No | Context |
| created_at | timestamp | Yes | Append-only |

**Relationships:**
- References any entity

**Indexes:**
- (target_type, target_id), actor_id

---

## 11. Integration Points

#### Clerk

**Purpose:** Authentication and session management.

**Integration type:** SDK and JWT verification

**Data exchanged:**
- Inbound: user identity, session tokens
- Outbound: none beyond configuration

**Authentication:** Publishable key in client, secret key server-side

**Rate limits:** Clerk default

**Fallback behavior:** Valid JWTs continue working until expiry if Clerk is down; new sign-ins show a status message

#### Stripe

**Purpose:** Membership billing and customer portal (Connect in P2).

**Integration type:** SDK, Checkout, Customer Portal, Webhooks

**Data exchanged:**
- Inbound: subscription, payment and invoice events
- Outbound: customer ID, price IDs, checkout session parameters

**Authentication:** Secret key server-side; webhook signing secret

**Rate limits:** Stripe default

**Fallback behavior:** Idempotent webhooks by event ID; nightly reconciliation compares Stripe to entitlements and alerts on drift

#### Email (Resend or equivalent)

**Purpose:** Inquiry notifications, verification outcomes, receipts.

**Integration type:** REST API

**Data exchanged:**
- Inbound: delivery status
- Outbound: recipient, template ID, variables (no message bodies containing sensitive documents)

**Authentication:** API key server-side

**Rate limits:** Provider default

**Fallback behavior:** Queue and retry with backoff for 24 hours; in-app inbox always shows the notification

#### Maps and Geocoding (MapLibre with an OSM-based geocoder)

**Purpose:** Region search, map view, distance filters.

**Integration type:** REST API and client SDK

**Data exchanged:**
- Inbound: coordinates, place names
- Outbound: address or place query (never full residential addresses for approximate listings)

**Authentication:** API key

**Rate limits:** Provider default; results cached

**Fallback behavior:** Fall back to region-code search if geocoding fails

#### Moderation provider

**Purpose:** Text and image safety scanning.

**Integration type:** REST API

**Data exchanged:**
- Inbound: category scores, allow/review/block decision
- Outbound: listing text or image

**Authentication:** API key

**Rate limits:** Provider default

**Fallback behavior:** Fail closed for publishing: new or edited listings go to manual review if the provider is unavailable

---

## 12. Edge Cases & Error Handling

#### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| A child profile tries to send an inquiry or open an external link | Blocked; prompt for adult PIN; no data is collected from child profiles beyond a nickname |
| Vendor lists a herbal product with a cure or treatment claim | Publish blocked with the reason; listing remains a draft until the claim is removed |
| Listing appears to sell counterfeit or knock-off designer goods | Auto-flagged for review; unpublished pending vendor proof of authenticity |
| Shelter or vehicle listing without required license or insurance | Cannot publish; vendor sees a checklist of missing documents |
| Residential or off-grid host's exact address | Hidden until the host accepts an inquiry; map shows an approximate area |
| Verification document expires | Vendor notified 30 days prior; listing is downgraded to `unverified` on expiry |
| Member exceeds Free-tier inquiry limit | Friendly upgrade prompt; no data loss |
| Stripe webhook arrives twice or out of order | Processed once by event ID; state checks prevent regressions |
| Culture content is reported as hateful or harassing | Hidden pending review; curator decides; reporter notified of outcome |
| Vendor outside the launch region applies | Waitlisted with an email when the region opens |
| Household deletes account | All personal data and child profiles purged within 30 days; Stripe records retained as legally required |
| Search returns nothing | Show related categories and a "Request this" prompt that creates a need (FR-009 when enabled) |

#### Error Handling Strategy

- **User-facing errors:** Plain language, specific cause, one recovery action
- **System errors:** Structured JSON logs with request ID; alert when error rate exceeds 2% over 10 minutes
- **Retry logic:** Email and webhook processing retry with exponential backoff; client retries idempotent GETs once
- **Graceful degradation:** If search is down, category browse still works; if Stripe is down, membership features show cached tier and block only upgrades

---

## 13. Testing Requirements

#### Unit Tests
- Tier entitlement and inquiry-limit logic
- Category risk rules (restricted categories require category verification)
- Policy filter for prohibited medical-claim and counterfeit phrases
- Referral eligibility and fraud rules
- Location precision masking

#### Integration Tests
- Stripe webhook handler: duplicate, out-of-order, invalid signature
- Authorization: every endpoint rejects cross-household and non-admin access
- Vendor application to published listing flow with verification gating
- Search relevance, filters and geo-radius queries on seeded data
- Account deletion removes household, child profiles, inquiries and media

#### E2E Tests
- Visitor browses → signs up → creates household → searches → sends inquiry → vendor receives it
- Vendor applies → admin approves → vendor publishes listing → listing appears in search
- Household upgrades to Family via Stripe → entitlements change → cancels → downgrades
- Report a listing → admin unpublishes → listing disappears from search

#### Performance Tests
- 500 concurrent users browsing and searching: p95 under 1.5 s for search
- 10,000-listing dataset: category page first 20 results under 2 s
- Map radius query with 5,000 pins under 2 s

---

## 14. Implementation Notes for AI

#### Build Order
1. PostgreSQL schema and migrations (User, Household, HouseholdMember, Vendor, Category, Listing, Inquiry, AuditEvent)
2. Auth (Clerk), roles, household creation and child-profile rules
3. Category/taxonomy admin with seed data from the source notes
4. Vendor application, verification documents and admin review queue
5. Listing CRUD with media upload, moderation worker and completeness score
6. Directory, full-text search, filters, PostGIS radius search
7. Inquiry flow, vendor inbox, email notifications
8. Reporting, Safety Cases, suspend/unpublish tools, audit log
9. Stripe membership tiers and entitlements
10. Culture Hub, saved lists and needs board, reviews, messaging
11. Map view, events calendar, manufacturer directory fields, referrals
12. P2 items: transactions, device program, creator storefronts, booking, 3D/AR

#### File Structure Suggestion
```
/apps
  /web                 # Next.js PWA
    /app
    /components
    /lib
  /api                 # Fastify API
    /routes
    /services          # households, vendors, listings, search, inquiries, billing, safety
    /workers           # moderation, email, verification expiry
    /db                # prisma schema and migrations
/packages
  /shared              # Zod schemas and types shared by web and api
  /config              # tiers, limits, policy phrase lists, taxonomy seeds
/tests
  /e2e
```

#### Critical Implementation Details
- **Config over code:** Categories, sub-categories, tier limits, inquiry caps and policy phrase lists live in DB/config so curators can edit them without a deploy.
- **Category risk levels:** Each category has `risk_level`. Restricted categories (Shelter, Transportation, supplements/herbs claims, manufacturers) require `category_verified` before publish. Enforce in the API, not only the UI.
- **Child safety first:** Child profiles never store contact data, cannot message, and cannot follow external links. Treat COPPA as a design constraint from day one.
- **Location privacy:** Store exact coordinates server-side only. Return approximate points (rounded/jittered within 1 km) unless the vendor chose exact precision or the inquiry is accepted.
- **Fail closed on moderation:** If the moderation provider fails, new and edited listings go to manual review; they never auto-publish.
- **Taxonomy-driven attributes:** Use a `attributes` JSONB column validated by a per-category Zod schema (e.g., manufacturers: MOQ, lead time, capabilities) so new categories need schema entries, not new tables.
- **Idempotency:** Stripe webhook handling and inquiry creation use unique keys to prevent duplicates.
- **Neutral culture content:** Culture collections are data, not code. Every item carries source attribution; do not hard-code claims about any group, teacher or formula into the product.
- **Dates:** Store UTC, display in the user's timezone.

#### Code Style Preferences
- TypeScript strict mode, no `any` in service code
- Zod schemas shared between web and API
- kebab-case file names, PascalCase components, camelCase functions, snake_case DB columns
- Thin routes, one service per domain

#### Libraries to Use
- Prisma for ORM — type-safe migrations
- PostGIS via Prisma raw queries — geospatial search
- TanStack Query — caching and pagination
- MapLibre GL — open-source maps without per-load fees
- Zod — single validation source
- BullMQ — background jobs
- Vitest and Playwright — tests

#### Libraries to Avoid
- Client-only checks for tier limits or verification — must be server-enforced
- Third-party analytics that capture page content on child-profile screens — privacy risk
- Heavy UI kits that break low-bandwidth mode

#### Common Pitfalls
- **Over-scoping V1:** The notes span many industries. Ship the directory, trust layer and membership first; add transactions only after inquiry volume proves demand.
- **Unverified high-risk listings:** Lodging, vehicles and supplement-style products carry legal exposure. Never let them publish without the verification gate.
- **Leaking addresses:** Test that approximate listings never expose exact coordinates in API responses, images or metadata.
- **Cold-start emptiness:** Seed supply before opening to households; set a minimum of 8 verified listings per category before launch.
- **Taxonomy sprawl:** Cap sub-category depth at 2 levels and review additions weekly.

#### Testing Approach
- Write tests first for authorization, child-profile restrictions, tier entitlements, location masking and the moderation gate
- Use mocked providers for automated tests; run a small live smoke test for Stripe test mode
- Skip snapshot tests for layout; test behavior and accessibility instead
- Use Vitest for unit/integration and Playwright for E2E

---

## 15. Open Questions

1. Which launch region (country/state/city) opens first, and which categories have the strongest existing supply there?
2. What are the membership price points for Family and Family Plus?
3. Which verification documents are required per category and jurisdiction (lodging, vehicles, food/herbal products, manufacturers)? Legal review needed.
4. Who curates the Culture Hub, and what is the written editorial and content policy for community collections?
5. For the Preloaded Family Device: hardware partner, Android build approach, budget per unit and whether devices are sold, subsidized or bundled with membership?
6. When do transactions turn on (FR-016), and what platform fee per category?
7. Is vendor listing free during alpha, and what is the post-alpha vendor pricing?
8. Do any categories need age or license restrictions beyond those listed (e.g., martial arts instruction, transportation)?

---

## 16. Release Criteria (Closed Alpha)

- [ ] All P0 features (FR-001 to FR-007) meet their acceptance criteria
- [ ] At least 100 verified vendor listings live, with at least 8 in each of the 7 categories
- [ ] Authorization, child-profile and location-masking tests pass in CI
- [ ] Moderation, reporting, suspension, unpublish and appeals are operable from the admin console
- [ ] Stripe billing tested end to end in test mode, including cancel, failure and replayed webhooks
- [ ] Content policy, verification requirements, privacy policy, terms and COPPA statement are published and linked in product flows
- [ ] Legal review complete for health-claims language, lodging and vehicle listings, and child profiles
- [ ] Analytics events implemented and validated for the full funnel
