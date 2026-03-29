# Features

**Project:** Glowreeyah Digital Platform
**Version:** 1.0.0
**Status:** Pre-Development
**Last Updated:** 2026-03-28

---

## Overview

This document catalogues all platform features grouped by functional domain. Each feature is assigned a unique ID, priority, status, and traceability reference back to the Specification (`specification.md`) and Implementation (`implementation.md`).

---

## Feature Index

| Feature ID | Name                    | Domain       | Priority | Status  |
| ---------- | ----------------------- | ------------ | -------- | ------- |
| F-001      | Artist Profile          | Artist       | P1       | Planned |
| F-002      | Music Catalogue         | Music        | P1       | Planned |
| F-003      | Audio / Video Playback  | Music        | P1       | Planned |
| F-004      | Lyrics & Song Stories   | Music        | P2       | Planned |
| F-005      | Blog & Devotionals      | Content      | P1       | Planned |
| F-006      | Media & Press Gallery   | Media        | P2       | Planned |
| F-007      | Speaking & Events       | Booking      | P2       | Planned |
| F-008      | Booking / Contact Form  | Booking      | P2       | Planned |
| F-009      | Impact & Initiatives    | Impact       | P2       | Planned |
| F-010      | Tag & Category System   | SEO          | P1       | Planned |
| F-011      | Search & Filtering      | Discovery    | P2       | Planned |
| F-012      | CMS Content Dashboard   | CMS          | P1       | Planned |
| F-013      | CMS Media Library       | CMS          | P1       | Planned |
| F-014      | SEO Metadata System     | SEO          | P1       | Planned |
| F-015      | Newsletter Subscription | CRM          | P3       | Future  |
| F-016      | Gated / Premium Content | Monetisation | P3       | Future  |
| F-017      | Courses Module          | Education    | P3       | Future  |

**Priority Legend:** P1 = Must Have · P2 = Should Have · P3 = Future / Nice to Have

---

## Detailed Feature Specifications

---

### F-001 — Artist Profile

**Domain:** Artist
**Priority:** P1
**Spec Ref:** §3.1
**Description:** Dynamic artist biography page rendered from database content. Supports short, medium, and long biography variants for different contexts (social cards, press kits, full page).

**Acceptance Criteria:**

- Biography exists in three length variants in the database
- Achievements list is editable via Admin
- Speaking profile section is independently manageable
- Page generates Open Graph and Twitter Card metadata automatically

**Data:** `artists` collection
**Route:** `/about`

---

### F-002 — Music Catalogue

**Domain:** Music
**Priority:** P1
**Spec Ref:** §3.2
**Description:** Browsable catalogue of albums and individual songs. Albums contain ordered song listings. All content is database-driven with no hardcoded entries.

**Acceptance Criteria:**

- Albums list page shows cover art, title, release year
- Album detail page shows track listing
- Song detail page accessible from track listing
- Filtering by album, tag, or release year works correctly

**Data:** `albums`, `songs` collections
**Routes:** `/music`, `/music/[albumSlug]`, `/music/[albumSlug]/[songSlug]`

---

### F-003 — Audio / Video Playback

**Domain:** Music
**Priority:** P1
**Spec Ref:** §3.2
**Description:** Embedded audio and video players on song and media pages. Audio served from object storage via URL; video embedded from YouTube / Vimeo or stored in object storage.

**Acceptance Criteria:**

- Audio player renders on song detail pages when `audioUrl` is present
- Video player (embed or native) renders when `videoUrl` is present
- Players do not block page rendering (lazy loaded)
- Mobile playback functions correctly

**Data:** `audioUrl`, `videoUrl` fields on `songs`
**Storage:** Object storage (Cloudinary / S3)

---

### F-004 — Lyrics & Song Stories

**Domain:** Music
**Priority:** P2
**Spec Ref:** §3.2
**Description:** Each song may optionally include full lyrics and a narrative "story behind the song." Rich text rendered as semantic HTML.

**Acceptance Criteria:**

- Lyrics displayed in structured, readable format
- Story behind the song renders as rich text
- Both fields are optional and page renders gracefully without them

**Data:** `lyrics`, `description` fields on `songs`

---

### F-005 — Blog & Devotionals

**Domain:** Content
**Priority:** P1
**Spec Ref:** §3.3
**Description:** Long-form content system supporting blog posts, devotionals, and inspirational stories. Each post has category, tags, author, and publication date.

**Acceptance Criteria:**

- Posts list page renders with pagination
- Individual post pages render from database
- Category and tag filtering works
- Posts support rich text with embedded media
- RSS-compatible structure (slug, date, description)

**Data:** `posts` collection
**Routes:** `/blog`, `/blog/[slug]`

---

### F-006 — Media & Press Gallery

**Domain:** Media
**Priority:** P2
**Spec Ref:** §3.4
**Description:** Gallery and listing of TV features, interviews, and press appearances. Each entry links to external source or hosted media file.

**Acceptance Criteria:**

- Media items filterable by type (TV, Interview, Print, Radio)
- Thumbnail images served from object storage
- External links open in new tab
- Alt text required on all images

**Data:** `mediaAssets` collection
**Route:** `/media`

---

### F-007 — Speaking & Events

**Domain:** Booking
**Priority:** P2
**Spec Ref:** §3.5
**Description:** Public-facing page listing upcoming and past speaking engagements and events. Events sourced from database.

**Acceptance Criteria:**

- Upcoming events displayed prominently
- Past events archived and browsable
- Each event has: title, date, location, description, optional link

**Data:** `events` collection
**Route:** `/speaking`

---

### F-008 — Booking / Contact Form

**Domain:** Booking
**Priority:** P2
**Spec Ref:** §3.5
**Description:** Form allowing event organisers or collaborators to submit booking requests. Submissions stored in database and optionally trigger an email notification.

**Acceptance Criteria:**

- Form validates required fields client-side and server-side
- Submission saved to `bookings` collection
- Confirmation message shown on successful submission
- Admin can view and manage submissions in dashboard

**Data:** `bookings` collection
**Route:** `/booking`

---

### F-009 — Impact & Initiatives

**Domain:** Impact
**Priority:** P2
**Spec Ref:** §3.6
**Description:** Dedicated section highlighting social impact projects such as ZIDATA, foundations, and outreach programmes. Content fully database-driven.

**Acceptance Criteria:**

- Each initiative has: title, description, images, links
- Page renders initiative cards dynamically
- Rich text supported per initiative

**Data:** `initiatives` collection
**Route:** `/impact`

---

### F-010 — Tag & Category System

**Domain:** SEO
**Priority:** P1
**Spec Ref:** §3.7
**Description:** Unified tagging system applied across songs, posts, media, and events. Tags drive discoverability and internal linking.

**Acceptance Criteria:**

- Tags stored in dedicated `tags` collection
- Tags reusable across all content types
- Tag pages aggregate all content sharing that tag
- Tags surfaced in page metadata

**Data:** `tags` collection
**Routes:** `/tag/[slug]`

---

### F-011 — Search & Filtering

**Domain:** Discovery
**Priority:** P2
**Spec Ref:** §FR4
**Description:** Site-wide search and per-section filtering allowing users to find songs, posts, and media by keyword or tag.

**Acceptance Criteria:**

- Search input on music and blog pages
- Results update without full page reload (client component)
- Filter by tag works on all content list pages
- Empty state handled gracefully

---

### F-012 — CMS Content Dashboard

**Domain:** CMS
**Priority:** P1
**Spec Ref:** §FR3
**Description:** Built-in Content Management System served at `/cms/*` within the same Next.js application. Shares the MongoDB database and API layer with the public frontend. Allows non-technical editors to manage all content types without developer involvement.

**Acceptance Criteria:**

- Authentication via NextAuth.js — unauthenticated requests redirect to `/cms/login`
- Persistent sidebar navigation to all content sections
- Dashboard overview showing counts for songs, posts, albums, pending bookings, upcoming events
- CRUD operations for: songs, albums, posts, events, initiatives, tags, artist profile
- Slug auto-generated from title; editable before save
- Published/Draft toggle on all content types
- Confirmation dialog before any delete operation
- "View site ↗" link in topbar opens public frontend in new tab

**Route:** `/cms/*`

---

### F-013 — CMS Media Upload & Library

**Domain:** CMS
**Priority:** P1
**Spec Ref:** §3 (Media Governance)
**Description:** Media library within the CMS for uploading images and files to Cloudinary. MongoDB stores only metadata. Media browser allows selection when creating or editing content.

**Acceptance Criteria:**

- Upload interface at `/cms/media` accepts image, audio, and video files
- Files uploaded directly to Cloudinary via server-side route
- MongoDB `MediaAsset` record created with URL, `publicId`, altText, type
- Alt text required — form blocks save without it
- Media browser displays all uploaded assets in a grid
- "Copy URL" available on each asset for manual use
- `MediaPicker` component allows selecting an existing asset when editing content

**Route:** `/cms/media`

---

### F-014 — SEO Metadata System

**Domain:** SEO
**Priority:** P1
**Spec Ref:** §NFR (SEO), §FR1
**Description:** Every page generates title, description, canonical URL, Open Graph, and Twitter Card metadata from database content. No hardcoded meta tags.

**Acceptance Criteria:**

- `generateMetadata()` implemented on all dynamic routes
- Open Graph image defaults to artist photo if no content image available
- Structured data (JSON-LD) present on song, event, and post pages
- Canonical URLs correct on all pages

---

### F-015 — Newsletter Subscription _(Future)_

**Domain:** CRM
**Priority:** P3
**Spec Ref:** §2.7 (Extensibility)
**Description:** Email capture with integration to a newsletter provider (Mailchimp / ConvertKit). Not in v1.0 scope.

---

### F-016 — Gated / Premium Content _(Future)_

**Domain:** Monetisation
**Priority:** P3
**Spec Ref:** §2.7 (Extensibility)
**Description:** Access-controlled content for subscribers or purchasers. Not in v1.0 scope.

---

### F-017 — Courses Module _(Future)_

**Domain:** Education
**Priority:** P3
**Spec Ref:** §2.7 (Extensibility)
**Description:** Structured course delivery with lessons, progress tracking, and completion certificates. Not in v1.0 scope.

---

## Feature-to-Route Matrix

| Route                                                               | Feature(s)                       |
| ------------------------------------------------------------------- | -------------------------------- |
| `/`                                                                 | F-001, F-002, F-005 (highlights) |
| `/about`                                                            | F-001                            |
| `/music`                                                            | F-002, F-011                     |
| `/music/[albumSlug]`                                                | F-002, F-003                     |
| `/music/[albumSlug]/[songSlug]`                                     | F-003, F-004                     |
| `/blog`                                                             | F-005, F-011                     |
| `/blog/[slug]`                                                      | F-005                            |
| `/media`                                                            | F-006                            |
| `/speaking`                                                         | F-007                            |
| `/booking`                                                          | F-008                            |
| `/impact`                                                           | F-009                            |
| `/tag/[slug]`                                                       | F-010                            |
| `/cms/login`                                                        | F-012                            |
| `/cms/dashboard`                                                    | F-012                            |
| `/cms/posts`, `/cms/posts/new`, `/cms/posts/[id]`                   | F-012                            |
| `/cms/songs`, `/cms/songs/new`, `/cms/songs/[id]`                   | F-012                            |
| `/cms/albums`, `/cms/albums/new`, `/cms/albums/[id]`                | F-012                            |
| `/cms/events`, `/cms/events/new`, `/cms/events/[id]`                | F-012                            |
| `/cms/initiatives`, `/cms/initiatives/new`, `/cms/initiatives/[id]` | F-012                            |
| `/cms/media`                                                        | F-013                            |
| `/cms/bookings`                                                     | F-012                            |
| `/cms/tags`                                                         | F-012                            |
| `/cms/artist`                                                       | F-012                            |

---

## Change Log

| Version | Date       | Change                            |
| ------- | ---------- | --------------------------------- |
| 1.0.0   | 2026-03-28 | Initial feature catalogue created |
