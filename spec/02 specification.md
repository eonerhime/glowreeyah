# Software Design Document — Specification

**Project:** Glowreeyah Digital Platform
**Version:** 1.0.0
**Status:** Finalized
**Last Updated:** 2026-03-28
**Author:** Platform Team

---

## Document Control

| Version | Date | Change Summary |
|---|---|---|
| 1.0.0 | 2026-03-28 | Initial SDD-aligned specification |

---

## 1. Product Overview

The Glowreeyah Digital Platform is a content-driven digital identity system presenting Glowreeyah as a multidimensional brand across music, ministry, speaking, thought leadership, and social impact. It replaces a static WordPress-based website with a dynamic, database-driven, scalable application.

**Primary Objectives:**
- Deliver a brand-authentic digital presence aligned with the Glowreeyah identity
- Enable editorial independence — non-technical users can manage all content
- Establish a scalable content architecture that supports future product lines (courses, newsletters, gated content)
- Achieve sub-2-second page load times with strong SEO foundations

**Out of Scope for v1.0:**
- Payment processing
- Course delivery
- Email newsletter campaigns
- User accounts or authenticated public access

See `features.md` for the complete feature catalogue and `plan.md` for delivery phases.

---

## 2. Stakeholders & Users

### 2.1 Public Users

| User Type | Description | Primary Goals |
|---|---|---|
| Fan / Listener | Discovers music and personal story | Browse music, read content, connect |
| Event Organiser | Evaluating Glowreeyah for speaking or performance | View speaking profile, submit booking |
| Press / Media | Researching for coverage | Access press assets, bio, media gallery |

### 2.2 Internal Users

| User Type | Description | Primary Goals |
|---|---|---|
| Content Manager | Day-to-day editorial | Create/edit posts, songs, events |
| Brand Manager | Oversees brand output | Ensure all published content meets brand standards |

---

## 3. Functional Domains

### 3.1 Artist Profile

Provides the official Glowreeyah biography and speaking credentials.

**Data Requirements:**
- Biography in three length variants: short (≤160 chars), medium (≤500 chars), long (unlimited)
- Achievements list (array of strings)
- Speaking profile (rich text)
- Profile image (stored in object storage; URL in `artists` collection)
- Social links (Instagram, YouTube, Spotify, Twitter)

**Acceptance Criteria:**
- Biography variants render correctly in different contexts (hero, press kit, meta description)
- Profile image has required alt text
- Page fully generated from database — no hardcoded biography text

---

### 3.2 Music System

Structured catalogue of albums and songs. Supports audio and video playback, lyrics, and song narratives.

**Data Requirements — Albums:**
- Title, slug, release year, cover image URL, description, tags

**Data Requirements — Songs:**
- Title, slug, album reference, track number
- Description, lyrics, story behind the song
- Audio URL (object storage), video URL (embed or object storage)
- Cover image URL, tags, published flag

**Acceptance Criteria:**
- Music catalogue fully browsable at `/music` → album → song
- Audio player renders for songs with `audioUrl`
- Video player renders for songs with `videoUrl`
- Lyrics and story sections are optional; pages render without them
- All music content created and updated via admin dashboard

---

### 3.3 Content System

Long-form written content: blog posts, devotionals, and inspirational stories.

**Data Requirements:**
- Title, slug, category (`blog` | `devotional` | `story`)
- Body (rich text), excerpt, cover image URL
- Tags, published flag, published date

**Acceptance Criteria:**
- Posts list at `/blog` with pagination
- Individual post pages at `/blog/[slug]`
- Category and tag filtering functional
- RSS-compatible structure (slug, date, description)

---

### 3.4 Media & Press

Gallery of TV features, interviews, and press appearances.

**Data Requirements:**
- Title, type (`tv` | `interview` | `print` | `radio`)
- Thumbnail image URL, source URL (external), description
- Alt text (required), date, tags

**Acceptance Criteria:**
- Media items filterable by type
- External links open in new tab with `rel="noopener noreferrer"`
- All thumbnails have alt text

---

### 3.5 Speaking & Booking

Event listings and booking request submission.

**Event Data Requirements:**
- Title, slug, date, location, description, optional external link
- Upcoming flag, cover image

**Booking Submission Requirements:**
- Name, email, organisation, event type, event date (preferred), message
- Status field: `pending` | `reviewed` | `accepted` | `declined`

**Acceptance Criteria:**
- Upcoming events displayed prominently on `/speaking`
- Booking form at `/booking` validates required fields before submission
- Submissions stored in `bookings` collection
- Admin can view, filter, and update booking status

---

### 3.6 Impact & Initiatives

Showcases social impact projects including ZIDATA and other foundations.

**Data Requirements:**
- Title, slug, description, body (rich text)
- Cover image URL, external link, tags

**Acceptance Criteria:**
- Each initiative rendered as a card on `/impact`
- Individual initiative detail page accessible via slug
- Content fully managed via admin

---

### 3.7 SEO & Tag System

Unified tagging and metadata system across all content types.

**Tag Data Requirements:**
- Name, slug, optional description

**SEO Requirements per Content Item:**
- `seo.metaTitle` — overrides default title if set
- `seo.metaDescription` — overrides default excerpt if set
- Open Graph image defaults to content cover image or artist profile image

**Acceptance Criteria:**
- Tags stored in `tags` collection and referenced by ObjectId from all content types
- Tag archive pages at `/tag/[slug]` aggregate all tagged content
- `generateMetadata()` implemented on all dynamic routes
- Canonical URLs correct on all pages
- Sitemap auto-generated at `/sitemap.xml`

---

## 4. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | All page content rendered from database — no hardcoded copy | P1 |
| FR-02 | Media assets stored in object storage; MongoDB holds URL + metadata only | P1 |
| FR-03 | Admin users can create, update, and delete all content types | P1 |
| FR-04 | Users can search and filter songs and posts by keyword and tag | P2 |
| FR-05 | All image uploads require alt text before saving | P1 |
| FR-06 | Booking submissions stored and accessible in admin | P2 |
| FR-07 | Sitemap generated dynamically and submitted to search engines | P1 |
| FR-08 | Slugs auto-generated from titles; must be unique per collection | P1 |

---

## 5. Non-Functional Requirements

### Performance

| Metric | Target |
|---|---|
| Page load time (LCP) | < 2 seconds |
| Time to First Byte (TTFB) | < 500ms |
| Lighthouse Performance | ≥ 90 |

### Accessibility

- WCAG 2.1 AA compliance
- All images have `alt` text
- Semantic HTML throughout
- Keyboard navigable
- Mobile-first responsive design

### SEO

- `<title>` and `<meta description>` on every page
- Open Graph and Twitter Card metadata
- Structured data (JSON-LD) on song, event, and article pages
- Clean URLs (`/music/album-slug/song-slug`)
- No `?page=` query strings on canonical URLs

### Security

- Admin routes protected by middleware
- Environment variables never exposed to client except `NEXT_PUBLIC_` prefixed vars
- HTTP-only cookies for admin session
- Input validation (Zod) on all API routes
- No binary data accepted or stored in MongoDB

---

## 6. Data Model — Collection Reference

| Collection | Description | Key Fields |
|---|---|---|
| `artists` | Brand/artist identity | name, biographies, achievements, socialLinks |
| `albums` | Music albums | title, slug, releaseYear, coverImageUrl |
| `songs` | Individual tracks | title, slug, albumId, audioUrl, videoUrl, lyrics |
| `posts` | Blog / devotionals | title, slug, category, body, isPublished |
| `mediaAssets` | Upload registry | url, publicId, altText, type, linkedContentId |
| `events` | Speaking events | title, date, location, isUpcoming |
| `initiatives` | Impact projects | title, slug, body |
| `bookings` | Booking submissions | name, email, message, status |
| `tags` | Unified tags | name, slug |

Full schema definitions with TypeScript interfaces are in `implementation.md` §5.

---

## 7. Route Map

| Route | Page | Features |
|---|---|---|
| `/` | Home | Artist intro, latest music, latest posts |
| `/about` | Artist Profile | F-001 |
| `/music` | Music Catalogue | F-002, F-011 |
| `/music/[albumSlug]` | Album Detail | F-002, F-003 |
| `/music/[albumSlug]/[songSlug]` | Song Detail | F-003, F-004 |
| `/blog` | Blog List | F-005, F-011 |
| `/blog/[slug]` | Post Detail | F-005 |
| `/media` | Media Gallery | F-006 |
| `/speaking` | Speaking & Events | F-007 |
| `/booking` | Booking Form | F-008 |
| `/impact` | Initiatives | F-009 |
| `/tag/[slug]` | Tag Archive | F-010 |
| `/admin` | Admin Dashboard | F-012, F-013 |

---

*For implementation details, code, and deployment instructions see `implementation.md`.*
*For feature definitions and acceptance criteria see `features.md`.*
