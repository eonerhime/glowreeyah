# Project Plan

**Project:** Glowreeyah Digital Platform
**Version:** 1.1.0
**Last Updated:** 2026-04-05
**Status:** In Progress

---

## Change Log

| Version | Date       | Change                                                                                                                                |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0.0   | 2026-03-28 | Initial plan                                                                                                                          |
| 1.1.0   | 2026-04-05 | Updated to reflect actual delivery progress; phases 3–6 complete; phases 7–8 in progress; added new features built during development |

---

## Overview

This document defines the delivery phases, milestones, and sequencing for the Glowreeyah Digital Platform. Detailed implementation instructions live in `implementation.md`.

---

## Phase Summary

| Phase | Name                       | Duration | Status         |
| ----- | -------------------------- | -------- | -------------- |
| 1     | Discovery & Structuring    | 2–3 days | ✅ Complete    |
| 2     | Specification Finalization | 1–2 days | ✅ Complete    |
| 3     | Environment Setup          | 1 day    | ✅ Complete    |
| 4     | Core Development           | 5–7 days | ✅ Complete    |
| 5     | Media Integration          | 1–2 days | ✅ Complete    |
| 6     | CMS Build                  | 4–6 days | ✅ Complete    |
| 7     | SEO & Optimisation         | 2–3 days | 🔄 In Progress |
| 8     | Testing                    | 1–2 days | ⬜ Not Started |
| 9     | Deployment                 | 1 day    | ⬜ Not Started |
| 10    | Content Migration          | 2–4 days | ⬜ Not Started |

---

## Phase 1 — Discovery & Structuring ✅ Complete

WordPress export analysed, content types catalogued, data models confirmed, migration scope defined.

---

## Phase 2 — Specification Finalization ✅ Complete

All MongoDB schemas finalized, API routes confirmed, UI pages mapped, Cloudinary selected as media storage provider, P1 feature scope confirmed.

---

## Phase 3 — Environment Setup ✅ Complete

Full local development environment operational. MongoDB Atlas M0, Cloudinary, Vercel, and GitHub all connected. `npm run dev` starts without errors.

---

## Phase 4 — Core Development ✅ Complete

All public pages built including several added beyond original scope:

**Original scope (all complete):**

- Home, About, Music (catalogue + album + song), Blog, Events, Booking, Impact, Media, Tag archive

**Added during development:**

- `/contact` — Dedicated contact page with form + social handles
- `/gallery` — Photo and video gallery with lightbox, tabbed by Events/Initiatives
- `/impact/[slug]` — Individual initiative detail pages
- `/events` — Renamed from `/speaking`; permanent redirect added

**Additional models added:**

- `SiteSettings` — CMS-managed homepage configuration
- `ContactMessage` — Contact form submissions
- `GalleryPhoto` — Event/initiative photos
- `GalleryVideo` — Event/initiative video links

---

## Phase 5 — Media Integration ✅ Complete

Cloudinary fully integrated. `next/image` used throughout. Alt text validation enforced. `MediaPicker` component extended with inline upload tab so editors can upload images directly from content forms without visiting the Media section.

---

## Phase 6 — CMS Build ✅ Complete

Full CMS operational at `/cms`. All content types manageable. Key additions beyond original spec:

- **Gallery CMS** (`/cms/gallery`) — bulk photo upload and video links per event/initiative
- **Site Settings** (`/cms/settings`) — homepage hero and heading configuration
- **Inline tag creation** — tags creatable from any content form
- **Inline media upload** — `MediaPicker` has Library + Upload New tabs
- **Booking management** — expandable cards with status updates and email notifications via Resend
- **Pending bookings badge** — real-time notification in sidebar, clears on page visit
- **Mobile-responsive CMS** — collapsible sidebar drawer
- **Cancel buttons** on all create/edit forms
- **Auto-excerpt** on posts — generated from body markdown with manual override
- **Cover image required** on posts — form and API enforce this

---

## Phase 7 — SEO & Optimisation 🔄 In Progress

**Complete:**

- `generateMetadata()` on all dynamic routes
- Open Graph + Twitter Card metadata
- Canonical URLs
- `sitemap.ts` and `robots.ts`
- ISR revalidation (`revalidate = 3600`) on all content pages
- Skip navigation link
- `next/image` throughout

**Remaining:**

- JSON-LD structured data on song, post, and event pages
- Lighthouse audit — target Performance ≥ 90, Accessibility ≥ 90

---

## Phase 8 — Testing ⬜ Not Started

Manual testing checklist covering all public routes, API routes, CMS CRUD, mobile layout, contact form, booking flow, gallery, and redirect from `/speaking` to `/events`.

---

## Phase 9 — Deployment ⬜ Not Started

**Pre-flight checklist:**

1. `npm run build` — zero errors
2. `npx tsc --noEmit` — zero TypeScript errors
3. `npm run lint` — zero ESLint errors
4. Push to `main` on GitHub
5. Import to Vercel
6. Add all 13 environment variables
7. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to production domain
8. Deploy
9. MongoDB Atlas Network Access → `0.0.0.0/0`
10. Verify Tawk.to embed URL in `TawkChat.tsx`
11. Verify Resend domain or use `onboarding@resend.dev` for testing

---

## Phase 10 — Content Migration ⬜ Not Started

WordPress XML export → parse → import posts to MongoDB → upload media to Cloudinary → create `MediaAsset` records → update content body image references → validate.

---

## Future Phases (v1.1+)

| Phase | Feature                                           | Priority |
| ----- | ------------------------------------------------- | -------- |
| v1.1  | JSON-LD structured data (song, post, event pages) | P1       |
| v1.1  | Search & filtering (F-011)                        | P2       |
| v1.1  | Newsletter subscription integration               | P3       |
| v1.2  | Multi-user CMS with role-based access             | P3       |
| v1.2  | Gated / premium content                           | P3       |
| v1.3  | Courses module                                    | P3       |

---

_For task-level tracking see `tasks.md`. For implementation instructions see `implementation.md`._
