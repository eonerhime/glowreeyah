# Features

**Project:** Glowreeyah Digital Platform
**Version:** 1.1.0
**Status:** In Progress
**Last Updated:** 2026-04-05

---

## Change Log

| Version | Date       | Change                                                                                                                                                                                                                                                                      |
| ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0.0   | 2026-03-28 | Initial feature catalogue                                                                                                                                                                                                                                                   |
| 1.1.0   | 2026-04-05 | Added F-018 Contact System, F-019 Gallery System, F-020 Live Chat, F-021 Site Settings; updated F-007 to reflect Events rename and expandable card pattern; updated F-008 with email notification; updated F-012/F-013 with new CMS capabilities; marked completed features |

---

## Feature Index

| Feature ID | Name                    | Domain        | Priority | Status         |
| ---------- | ----------------------- | ------------- | -------- | -------------- |
| F-001      | Artist Profile          | Artist        | P1       | ✅ Complete    |
| F-002      | Music Catalogue         | Music         | P1       | ✅ Complete    |
| F-003      | Audio / Video Playback  | Music         | P1       | ✅ Complete    |
| F-004      | Lyrics & Song Stories   | Music         | P2       | ✅ Complete    |
| F-005      | Blog & Devotionals      | Content       | P1       | ✅ Complete    |
| F-006      | Media & Press Gallery   | Media         | P2       | ✅ Complete    |
| F-007      | Events                  | Events        | P2       | ✅ Complete    |
| F-008      | Booking Form            | Booking       | P2       | ✅ Complete    |
| F-009      | Impact & Initiatives    | Impact        | P2       | ✅ Complete    |
| F-010      | Tag & Category System   | SEO           | P1       | ✅ Complete    |
| F-011      | Search & Filtering      | Discovery     | P2       | ⬜ Not Started |
| F-012      | CMS Content Dashboard   | CMS           | P1       | ✅ Complete    |
| F-013      | CMS Media Library       | CMS           | P1       | ✅ Complete    |
| F-014      | SEO Metadata System     | SEO           | P1       | 🔄 In Progress |
| F-015      | Newsletter Subscription | CRM           | P3       | Future         |
| F-016      | Gated / Premium Content | Monetisation  | P3       | Future         |
| F-017      | Courses Module          | Education     | P3       | Future         |
| F-018      | Contact System          | Communication | P1       | ✅ Complete    |
| F-019      | Gallery System          | Media         | P1       | ✅ Complete    |
| F-020      | Live Chat               | Communication | P2       | ✅ Complete    |
| F-021      | Site Settings CMS       | CMS           | P1       | ✅ Complete    |

**Priority Legend:** P1 = Must Have · P2 = Should Have · P3 = Future / Nice to Have

---

## Detailed Feature Specifications

---

### F-001 — Artist Profile ✅

**Domain:** Artist | **Priority:** P1
**Route:** `/about`

Dynamic artist biography page rendered from database. Supports short, medium, and long biography variants. Full-width hero image with name overlay. Social links as pill buttons. Back link to `/#about` when arriving from homepage.

**Completed:**

- Three biography variants in DB
- Achievements list
- Speaking profile section
- Social links (Instagram, YouTube, Spotify, Twitter)
- Open Graph and Twitter Card metadata
- Referer-based back link

---

### F-002 — Music Catalogue ✅

**Domain:** Music | **Priority:** P1
**Routes:** `/music`, `/music/[albumSlug]`

Browsable album catalogue. Album detail page shows track listing. Hero image on album detail pages. Back link to `/#music` when arriving from homepage.

---

### F-003 — Audio / Video Playback ✅

**Domain:** Music | **Priority:** P1
**Route:** `/music/[albumSlug]/[songSlug]`

Audio player on song pages when `audioUrl` present. Video embed when `videoUrl` present.

---

### F-004 — Lyrics & Song Stories ✅

**Domain:** Music | **Priority:** P2

Lyrics and story behind the song on song detail pages. Both optional — page renders gracefully without them.

---

### F-005 — Blog & Devotionals ✅

**Domain:** Content | **Priority:** P1
**Routes:** `/blog`, `/blog/[slug]`

Post listing and individual post pages. Cover image required. Excerpt auto-generated from body markdown with manual override. Hero image on post detail. Back link to `/#blog` when arriving from homepage.

---

### F-006 — Media & Press Gallery ✅

**Domain:** Media | **Priority:** P2
**Route:** `/media`

Grid of press and media appearances. External links open in new tab.

---

### F-007 — Events ✅ (formerly Speaking & Events)

**Domain:** Events | **Priority:** P2
**Route:** `/events` (permanent redirect from `/speaking`)

Two-column layout: Upcoming (left) and Past Events (right). Upcoming/Past status derived from date at render time — not from stored `isUpcoming` flag. Expandable cards — click to reveal cover image, full description, and external link. Upcoming count badge on column heading. Back link to `/#events` when arriving from homepage.

**CMS:** Full CRUD at `/cms/events`. Status badge auto-set from date picker with manual override toggle.

---

### F-008 — Booking Form ✅

**Domain:** Booking | **Priority:** P2
**Route:** `/booking`

Booking request form with fields: name, email, phone, organisation, event type, preferred date, message. Client-side and server-side validation. Scroll-to-top on success. "Make another booking" button on success state.

**CMS:** Expandable booking cards at `/cms/bookings`. Status update buttons (pending → reviewed → accepted → declined). Email notification sent to requestor via Resend on status change. Pending count badge on sidebar, clears on page visit.

---

### F-009 — Impact & Initiatives ✅

**Domain:** Impact | **Priority:** P2
**Routes:** `/impact`, `/impact/[slug]`

Initiative cards on listing page link to full detail pages. Hero image on detail page. Back link derived from referer (homepage `/#impact` or `/impact`). Content managed via CMS at `/cms/initiatives`.

---

### F-010 — Tag & Category System ✅

**Domain:** SEO | **Priority:** P1
**Route:** `/tag/[slug]`

Unified tagging across all content types. Tags creatable inline from any content form — no need to visit the Tags section separately. Tag archive pages aggregate all tagged content.

---

### F-011 — Search & Filtering ⬜

**Domain:** Discovery | **Priority:** P2

Site-wide search and per-section filtering. Not yet implemented. Planned for a future sprint.

---

### F-012 — CMS Content Dashboard ✅

**Domain:** CMS | **Priority:** P1
**Route:** `/cms/*`

Full CMS with:

- NextAuth.js Credentials authentication — unauthenticated requests redirect to `/cms-login`
- Collapsible sidebar navigation (mobile drawer on small screens)
- Pending bookings badge on Bookings nav item
- Dashboard stats overview
- CRUD for: posts, songs, albums, events, initiatives, gallery, tags, artist profile, site settings
- Cancel buttons on all create/edit forms
- Delete confirmation on all destructive actions
- Inline tag creation from all content forms
- `MediaPicker` with Library and Upload New tabs — no need to leave the form to upload images
- CMS fully mobile-responsive

---

### F-013 — CMS Media Library ✅

**Domain:** CMS | **Priority:** P1
**Route:** `/cms/media`

Upload interface accepts image, audio, and video files. Files uploaded to Cloudinary server-side. MongoDB `MediaAsset` record created with URL, `publicId`, altText, type. Alt text required. Grid browser with copy URL (+ checkmark feedback). Inline upload available from `MediaPicker` on all content forms.

---

### F-014 — SEO Metadata System 🔄

**Domain:** SEO | **Priority:** P1

- [x] `generateMetadata()` on all dynamic routes
- [x] Open Graph + Twitter Card on all content pages
- [x] Canonical URLs on all pages
- [x] `sitemap.ts` and `robots.ts`
- [x] ISR revalidation on all content pages
- [ ] JSON-LD structured data on song pages
- [ ] JSON-LD structured data on post pages
- [ ] JSON-LD structured data on event pages

---

### F-018 — Contact System ✅

**Domain:** Communication | **Priority:** P1
**Routes:** `/contact` (dedicated page), homepage contact section

Contact form with fields: name, email, phone, social handle, subject, message. Saves submission to `contactMessages` collection. Sends email notification via Resend to configured `CONTACT_EMAIL`. Success state with scroll-to-top. Dedicated `/contact` page also shows social handles and link to booking form.

---

### F-019 — Gallery System ✅

**Domain:** Media | **Priority:** P1
**Routes:** `/gallery` (public), `/cms/gallery` (CMS)

Photos and videos organised by event or initiative.

**Public:** `/gallery` with Events and Initiatives tabs. Each tab shows gallery cards. Clicking opens the full gallery for that event/initiative. Photos open in a lightbox (keyboard navigable). Videos show thumbnail + platform badge and open YouTube/Vimeo in new tab. Clear visual distinction between photos and videos.

**CMS:** Select event or initiative, bulk upload photos with per-photo captions, add YouTube/Vimeo video links, delete photos and videos. Captions editable inline.

---

### F-020 — Live Chat ✅

**Domain:** Communication | **Priority:** P2

Tawk.to floating chat widget on all public pages. Hidden from CMS pages entirely (loaded only in `(public)` layout). Configured via embed URL in `src/components/ui/TawkChat.tsx`.

---

### F-021 — Site Settings CMS ✅

**Domain:** CMS | **Priority:** P1
**Route:** `/cms/settings`

CMS page for editing site-wide content stored in the `SiteSettings` collection:

- Hero title, subtitle, image URL, logo URL
- Home intro text
- Blog page heading
- Impact page heading

Changes reflect on next ISR revalidation (3600s).

---

### F-015 — Newsletter Subscription _(Future)_

**Domain:** CRM | **Priority:** P3

Email capture with integration to a newsletter provider. Not in v1.0 scope.

---

### F-016 — Gated / Premium Content _(Future)_

**Domain:** Monetisation | **Priority:** P3

Access-controlled content for subscribers or purchasers. Not in v1.0 scope.

---

### F-017 — Courses Module _(Future)_

**Domain:** Education | **Priority:** P3

Structured course delivery. Not in v1.0 scope.

---

## Feature-to-Route Matrix

| Route                           | Feature(s)                               |
| ------------------------------- | ---------------------------------------- |
| `/`                             | F-001, F-002, F-005, F-007, F-009, F-018 |
| `/about`                        | F-001                                    |
| `/music`                        | F-002                                    |
| `/music/[albumSlug]`            | F-002, F-003                             |
| `/music/[albumSlug]/[songSlug]` | F-003, F-004                             |
| `/blog`                         | F-005                                    |
| `/blog/[slug]`                  | F-005                                    |
| `/events`                       | F-007                                    |
| `/booking`                      | F-008                                    |
| `/impact`                       | F-009                                    |
| `/impact/[slug]`                | F-009                                    |
| `/contact`                      | F-018                                    |
| `/gallery`                      | F-019                                    |
| `/media`                        | F-006                                    |
| `/tag/[slug]`                   | F-010                                    |
| `/cms/dashboard`                | F-012                                    |
| `/cms/posts/**`                 | F-012                                    |
| `/cms/songs/**`                 | F-012                                    |
| `/cms/albums/**`                | F-012                                    |
| `/cms/events/**`                | F-012                                    |
| `/cms/initiatives/**`           | F-012                                    |
| `/cms/gallery`                  | F-019                                    |
| `/cms/media`                    | F-013                                    |
| `/cms/bookings`                 | F-008, F-012                             |
| `/cms/tags`                     | F-010, F-012                             |
| `/cms/artist`                   | F-001, F-012                             |
| `/cms/settings`                 | F-021                                    |
