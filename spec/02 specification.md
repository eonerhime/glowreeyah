# Software Design Document — Specification

**Project:** Glowreeyah Digital Platform
**Version:** 1.1.0
**Status:** In Progress
**Last Updated:** 2026-04-05
**Author:** Platform Team

---

## Document Control

| Version | Date       | Change Summary                                                                                                                                                                                                                                     |
| ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0.0   | 2026-03-28 | Initial SDD-aligned specification                                                                                                                                                                                                                  |
| 1.1.0   | 2026-04-05 | Updated stack to Next.js 15 + Tailwind v4; added contact system, gallery system, Tawk.to chat, Resend email, `/events` route, `SiteSettings` model, `ContactMessage` model, `GalleryPhoto` model, `GalleryVideo` model; renamed Speaking to Events |

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

---

## 2. Stakeholders & Users

### 2.1 Public Users

| User Type       | Description                                       | Primary Goals                           |
| --------------- | ------------------------------------------------- | --------------------------------------- |
| Fan / Listener  | Discovers music and personal story                | Browse music, read content, connect     |
| Event Organiser | Evaluating Glowreeyah for speaking or performance | View event listing, submit booking      |
| Press / Media   | Researching for coverage                          | Access press assets, bio, media gallery |
| General Visitor | Wants to reach out                                | Submit contact form, start live chat    |

### 2.2 Internal Users

| User Type       | Description           | Primary Goals                                      |
| --------------- | --------------------- | -------------------------------------------------- |
| Content Manager | Day-to-day editorial  | Create/edit posts, songs, events, gallery          |
| Brand Manager   | Oversees brand output | Ensure all published content meets brand standards |

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

- Biography variants render correctly in different contexts
- Profile image has required alt text
- Page fully generated from database — no hardcoded biography text
- Back link to homepage (`/#about`) shown when user arrived from homepage

---

### 3.2 Music System

Structured catalogue of albums and songs. Supports audio and video playback, lyrics, and song narratives.

**Data Requirements — Albums:**

- Title, slug, release year, cover image URL, description, tags, SEO fields

**Data Requirements — Songs:**

- Title, slug, album reference, track number
- Description, lyrics, story behind the song
- Audio URL, video URL, cover image URL, tags, published flag

**Acceptance Criteria:**

- Music catalogue fully browsable at `/music` → album → song
- Audio player renders for songs with `audioUrl`
- Video player renders for songs with `videoUrl`
- Back link to homepage (`/#music`) shown when user arrived from homepage
- All music content created and updated via CMS

---

### 3.3 Content System

Long-form written content: blog posts, devotionals, and inspirational stories.

**Data Requirements:**

- Title, slug, category (`blog` | `devotional` | `story`)
- Body (markdown rich text), excerpt (auto-generated from body, manually overridable), cover image URL (required)
- Tags, published flag, published date

**Acceptance Criteria:**

- Posts list at `/blog`
- Individual post pages at `/blog/[slug]`
- Cover image is required — form blocks save without it
- Excerpt auto-generated from body markdown with manual override
- Back link to homepage (`/#blog`) shown when user arrived from homepage

---

### 3.4 Media & Press

Gallery of TV features, interviews, and press appearances.

**Data Requirements:**

- Title, type (`tv` | `interview` | `print` | `radio`)
- Thumbnail image URL, source URL (external), description, alt text, date, tags

**Acceptance Criteria:**

- Media items listed at `/media`
- External links open in new tab with `rel="noopener noreferrer"`
- All thumbnails have alt text

---

### 3.5 Events (formerly Speaking & Events)

Event listings and booking request submission. The public route is `/events`. The old `/speaking` route redirects to `/events` permanently.

**Event Data Requirements:**

- Title, slug, date, location, description, optional external link
- Upcoming status (derived from date at render time — not stored `isUpcoming` flag)
- Cover image

**Booking Submission Requirements:**

- Name, email, phone, organisation, event type, event date (preferred), message
- Status field: `pending` | `reviewed` | `accepted` | `declined`

**Acceptance Criteria:**

- Events page at `/events` shows two columns: Upcoming and Past
- Upcoming/Past status derived from date, not stored flag
- Expandable cards — click to reveal full detail inline
- Booking form at `/booking` validates required fields
- Submissions stored in `bookings` collection
- Admin can view, expand, and update booking status in CMS
- Status change triggers email notification to requestor via Resend
- Pending booking count shown as badge on CMS sidebar, clears on page visit
- Back link to homepage (`/#events`) shown when user arrived from homepage

---

### 3.6 Impact & Initiatives

Showcases social impact projects including ZIDATA and other foundations.

**Data Requirements:**

- Title, slug, description, body (markdown rich text)
- Cover image URL, external link, tags

**Acceptance Criteria:**

- Initiative cards at `/impact` link to individual detail pages
- Individual detail page at `/impact/[slug]`
- Back link to homepage (`/#impact`) or `/impact` based on referer
- Content fully managed via CMS

---

### 3.7 Gallery

Photo and video gallery organised by event or initiative.

**Photo Data Requirements:**

- URL (Cloudinary), caption, linked type (`event` | `initiative`), linked ID, order

**Video Data Requirements:**

- Video URL (YouTube or Vimeo), platform, auto-generated thumbnail URL (YouTube), caption, linked type, linked ID

**Acceptance Criteria:**

- Public gallery at `/gallery` with Events and Initiatives tabs
- Each tab shows gallery cards per event/initiative
- Clicking a card opens the full gallery for that event/initiative
- Photos open in a lightbox with keyboard navigation (← →, Esc)
- Videos show thumbnail with platform badge; clicking opens YouTube/Vimeo in new tab
- Clear visual distinction between photos and videos in the grid
- CMS gallery manager at `/cms/gallery` allows bulk photo upload and video link addition per event/initiative
- Captions editable per photo directly in the CMS grid
- Photos deletable from CMS with hover reveal of delete button

---

### 3.8 Contact System

Contact form accessible from the homepage and a dedicated `/contact` page.

**ContactMessage Data Requirements:**

- Name, email, phone (optional), social handle (optional), subject (optional), message

**Acceptance Criteria:**

- Contact form on homepage and at `/contact`
- Form saves submission to `contactMessages` collection in MongoDB
- Email notification sent to configured `CONTACT_EMAIL` via Resend
- Success state shown after submission with scroll-to-top
- `/contact` page also shows social handles and link to booking form
- Live chat widget (Tawk.to) floats bottom-right on all public pages
- Live chat hidden from CMS pages entirely

---

### 3.9 SEO & Tag System

Unified tagging and metadata system across all content types.

**Tag Data Requirements:**

- Name, slug, optional description

**SEO Requirements per Content Item:**

- `seo.metaTitle` — overrides default title if set
- `seo.metaDescription` — overrides default excerpt if set
- Open Graph image defaults to content cover image

**Acceptance Criteria:**

- Tags stored in `tags` collection and referenced by ObjectId from all content types
- Tags can be created inline from any content form (no need to visit Tags section separately)
- Tag archive pages at `/tag/[slug]`
- `generateMetadata()` implemented on all dynamic routes
- Canonical URLs correct on all pages
- Sitemap auto-generated at `/sitemap.xml`
- `robots.txt` disallows `/cms/`

---

### 3.10 Site Settings

CMS-managed site-wide configuration stored in a single `SiteSettings` document.

**Data Requirements:**

- Hero title, hero subtitle, hero image URL, hero logo URL
- Home intro text
- Blog page heading, impact page heading

**Acceptance Criteria:**

- All homepage hero content editable via `/cms/settings`
- Changes reflect immediately on next revalidation (ISR, 3600s)

---

## 4. Functional Requirements

| ID    | Requirement                                                              | Priority |
| ----- | ------------------------------------------------------------------------ | -------- |
| FR-01 | All page content rendered from database — no hardcoded copy              | P1       |
| FR-02 | Media assets stored in object storage; MongoDB holds URL + metadata only | P1       |
| FR-03 | Admin users can create, update, and delete all content types             | P1       |
| FR-04 | Cover image required on blog posts — form and API block save without it  | P1       |
| FR-05 | All image uploads require alt text before saving                         | P1       |
| FR-06 | Booking submissions stored, viewable, and status-updatable in CMS        | P1       |
| FR-07 | Sitemap generated dynamically and submitted to search engines            | P1       |
| FR-08 | Slugs auto-generated from titles; must be unique per collection          | P1       |
| FR-09 | Contact form saves to DB and sends email notification via Resend         | P1       |
| FR-10 | Gallery photos and videos linked to events or initiatives                | P1       |
| FR-11 | Event upcoming/past status derived from date at render time              | P1       |
| FR-12 | CMS mobile-responsive with collapsible sidebar                           | P1       |
| FR-13 | Back links on detail pages route to correct homepage section anchor      | P2       |
| FR-14 | Tags creatable inline from content forms                                 | P2       |

---

## 5. Non-Functional Requirements

### Performance

| Metric                    | Target      |
| ------------------------- | ----------- |
| Page load time (LCP)      | < 2 seconds |
| Time to First Byte (TTFB) | < 500ms     |
| Lighthouse Performance    | ≥ 90        |

### Accessibility

- WCAG 2.1 AA compliance
- All images have `alt` text
- Semantic HTML throughout
- Keyboard navigable (including lightbox: ← → Esc)
- Mobile-first responsive design
- Skip navigation link in root layout

### SEO

- `<title>` and `<meta description>` on every page
- Open Graph and Twitter Card metadata
- Structured data (JSON-LD) on song, event, and article pages
- Clean URLs
- Canonical URLs on all pages

### Security

- Admin routes protected by NextAuth.js middleware
- Environment variables never exposed to client except `NEXT_PUBLIC_` prefixed vars
- HTTP-only cookies for admin session
- Input validation (Zod) on all API routes
- No binary data accepted or stored in MongoDB

---

## 6. Data Model — Collection Reference

| Collection        | Description              | Key Fields                                                                           |
| ----------------- | ------------------------ | ------------------------------------------------------------------------------------ |
| `artists`         | Brand/artist identity    | name, biographies, achievements, socialLinks                                         |
| `albums`          | Music albums             | title, slug, releaseYear, coverImageUrl, seo                                         |
| `songs`           | Individual tracks        | title, slug, albumId, audioUrl, videoUrl, lyrics, seo                                |
| `posts`           | Blog / devotionals       | title, slug, category, body, excerpt, coverImageUrl (required), isPublished, seo     |
| `mediaAssets`     | Upload registry          | url, publicId, altText, type, linkedContentId                                        |
| `events`          | Events / speaking        | title, slug, date, location, isUpcoming, coverImageUrl                               |
| `initiatives`     | Impact projects          | title, slug, body, coverImageUrl                                                     |
| `bookings`        | Booking submissions      | name, email, phone, organisation, eventType, eventDate, message, status              |
| `tags`            | Unified tags             | name, slug                                                                           |
| `siteSettings`    | Homepage/site config     | heroTitle, heroSubtitle, heroImageUrl, homeIntro, blogPageHeading, impactPageHeading |
| `contactMessages` | Contact form submissions | name, email, phone, socialHandle, subject, message                                   |
| `galleryPhotos`   | Event/initiative photos  | url, caption, linkedType, linkedId, order                                            |
| `galleryVideos`   | Event/initiative videos  | videoUrl, platform, thumbnailUrl, caption, linkedType, linkedId                      |

---

## 7. Route Map

| Route                           | Page              | Notes                                                      |
| ------------------------------- | ----------------- | ---------------------------------------------------------- |
| `/`                             | Home              | Hero, music, about, blog, events, impact, contact sections |
| `/about`                        | Artist Profile    | Full biography, achievements, social links                 |
| `/music`                        | Music Catalogue   | Album grid                                                 |
| `/music/[albumSlug]`            | Album Detail      | Songs listing                                              |
| `/music/[albumSlug]/[songSlug]` | Song Detail       | Audio/video player, lyrics                                 |
| `/blog`                         | Blog List         | Post cards                                                 |
| `/blog/[slug]`                  | Post Detail       | Full post with hero image                                  |
| `/events`                       | Events            | Two-column, expandable cards                               |
| `/booking`                      | Booking Form      | Submission with success state                              |
| `/impact`                       | Initiatives       | Card grid linking to detail pages                          |
| `/impact/[slug]`                | Initiative Detail | Full content page                                          |
| `/contact`                      | Contact           | Form + social handles                                      |
| `/gallery`                      | Gallery           | Tabs: Events / Initiatives                                 |
| `/media`                        | Press Gallery     | Media appearances                                          |
| `/tag/[slug]`                   | Tag Archive       | All content by tag                                         |
| `/cms/*`                        | CMS               | Protected by NextAuth middleware                           |
| `/speaking`                     | —                 | Permanent redirect to `/events`                            |
