# Project Plan

**Project:** Glowreeyah Digital Platform
**Version:** 1.0.0
**Last Updated:** 2026-03-28
**Status:** Pre-Development

---

## Overview

This document defines the delivery phases, milestones, and sequencing for the Glowreeyah Digital Platform. It is a roadmap document — detailed implementation instructions live in `implementation.md`.

---

## Delivery Phases

---

### Phase 1 — Discovery & Structuring

**Goal:** Understand all existing content and define a complete data architecture before writing code.

**Activities:**
- Analyse WordPress XML backup export
- Catalogue all existing content types (posts, pages, media)
- Count total posts, media assets, and custom fields
- Identify content that maps to new data models
- Flag orphaned or low-quality content for exclusion

**Outputs:**
- Content inventory spreadsheet
- Confirmed list of data models (cross-referenced with `specification.md` §6)
- Migration scope decision (what to migrate vs. what to start fresh)

**Dependency:** Access to WordPress admin or export file
**Estimated Duration:** 2–3 days

---

### Phase 2 — Specification Finalization

**Goal:** Lock all design decisions before development begins. No schemas should change after this phase without a formal decision.

**Activities:**
- Finalize all MongoDB schemas (reference `implementation.md` §5)
- Confirm all API routes (`implementation.md` §6.1)
- Map all UI pages to routes (`specification.md` §7)
- Confirm media storage strategy (Cloudinary selected as primary)
- Review `features.md` and confirm P1 scope for v1.0

**Outputs:**
- Signed-off `specification.md`
- Signed-off `features.md`
- Signed-off `implementation.md`

**Estimated Duration:** 1–2 days

---

### Phase 3 — Environment Setup

**Goal:** Full local development environment operational; all external services connected.

**Activities (in order):**
1. Create accounts: MongoDB Atlas, Cloudinary, Vercel, GitHub
2. Create and configure MongoDB Atlas M0 cluster
3. Create GitHub repository
4. Scaffold Next.js application (follow `implementation.md` §4)
5. Configure Tailwind CSS
6. Create `.env.local` with all required variables
7. Verify MongoDB connection via `connectDB()`
8. Verify Cloudinary connection via test upload
9. Confirm `npm run dev` starts without errors

**Reference:** `implementation.md` §3 and §4
**Estimated Duration:** 1 day

---

### Phase 4 — Core Development

**Goal:** Functioning data layer and foundational UI in place.

#### Step 4.1 — Data Layer

**File creation order:**
1. `src/lib/mongodb.ts`
2. `src/lib/cloudinary.ts`
3. `src/lib/utils.ts`
4. All models in `src/models/*.ts`
5. All API route handlers in `src/app/api/**/*.ts`
6. Zod validators in `src/lib/validators/*.ts`

**Verification:** Test all API routes using a REST client (curl, Postman, or VS Code REST Client extension). Confirm correct response shapes and status codes for GET, POST, PATCH, DELETE.

#### Step 4.2 — UI Layer

1. `src/app/layout.tsx` (root layout with Navbar and Footer)
2. `src/components/layout/Navbar.tsx`
3. `src/components/layout/Footer.tsx`
4. Core UI primitives: `Button`, `Input`, `Tag`, `LoadingSpinner`
5. Content components: `AlbumCard`, `SongCard`, `PostCard`, `MediaCard`

#### Step 4.3 — Public Pages

Build pages in this order (each depends on the previous):
1. `/` (Home)
2. `/about`
3. `/music` and `/music/[albumSlug]` and `/music/[albumSlug]/[songSlug]`
4. `/blog` and `/blog/[slug]`
5. `/media`
6. `/speaking`
7. `/booking`
8. `/impact`
9. `/tag/[slug]`

**Reference:** `implementation.md` §7 and §8
**Estimated Duration:** 5–7 days

---

### Phase 5 — Media Integration

**Goal:** Object storage connected; upload and retrieval working end-to-end.

**Activities:**
1. Configure Cloudinary client (`src/lib/cloudinary.ts`)
2. Implement upload API route (`src/app/api/media/route.ts`)
3. Test image upload → Cloudinary → URL stored in `MediaAsset`
4. Implement `next/image` with Cloudinary domain in `next.config.ts`
5. Confirm alt text validation enforced on upload

Add to `next.config.ts`:

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}
```

**Reference:** `implementation.md` §9
**Estimated Duration:** 1–2 days

---

### Phase 6 — Admin System

**Goal:** Content editors can manage all content without developer involvement.

**Activities:**
1. Implement admin authentication (`src/middleware.ts`, `/api/admin/auth`)
2. Build admin layout with sidebar navigation
3. Build CRUD forms for: songs, albums, posts, events, initiatives, tags
4. Build media browser (list uploaded assets, select for content linking)
5. Build bookings view (list submissions, update status)
6. Test all admin operations end-to-end

**Reference:** `implementation.md` §10
**Estimated Duration:** 3–5 days

---

### Phase 7 — SEO & Optimisation

**Goal:** All pages meet performance and SEO targets.

**Activities:**
1. Implement `generateMetadata()` on all dynamic routes
2. Implement `src/app/sitemap.ts`
3. Implement `src/app/robots.ts`
4. Add JSON-LD structured data to song, post, and event pages
5. Replace all `<img>` tags with `next/image`
6. Implement ISR (`revalidate`) on all content pages
7. Run Lighthouse audit — resolve any issues below targets
8. Accessibility pass: alt text, heading hierarchy, keyboard nav, colour contrast

**Reference:** `implementation.md` §11 and §12
**Estimated Duration:** 2–3 days

---

### Phase 8 — Deployment

**Goal:** Application live on production URL with all services connected.

**Activities (in order):**
1. Confirm `npm run build` completes without errors locally
2. Push all code to `main` branch on GitHub
3. Import repository to Vercel
4. Add all environment variables in Vercel dashboard
5. Deploy and verify production URL loads
6. Configure custom domain (if available)
7. Confirm MongoDB Atlas network access allows Vercel
8. Run post-deployment checklist (`implementation.md` §16)

**Reference:** `implementation.md` §14
**Estimated Duration:** 1 day

---

### Phase 9 — Content Migration

**Goal:** All WordPress content accurately imported and validated in MongoDB.

**Activities:**
1. Export WordPress content as XML
2. Parse XML and map to MongoDB schema
3. Upload all media assets to Cloudinary
4. Create `MediaAsset` records with new Cloudinary URLs
5. Update content body references to use new URLs
6. Import posts, pages, and other content to MongoDB
7. Validate: count documents, spot-check 10+ records, verify images

**Reference:** `implementation.md` §15
**Estimated Duration:** 2–4 days (depends on content volume)

---

## Phase Summary

| Phase | Name | Duration | Dependencies |
|---|---|---|---|
| 1 | Discovery & Structuring | 2–3 days | WordPress access |
| 2 | Specification Finalization | 1–2 days | Phase 1 complete |
| 3 | Environment Setup | 1 day | Accounts created |
| 4 | Core Development | 5–7 days | Phase 3 complete |
| 5 | Media Integration | 1–2 days | Phase 4 partial |
| 6 | Admin System | 3–5 days | Phase 4 complete |
| 7 | SEO & Optimisation | 2–3 days | Phase 6 complete |
| 8 | Deployment | 1 day | Phase 7 complete |
| 9 | Content Migration | 2–4 days | Phase 8 complete |
| **Total** | | **18–28 days** | |

---

## Future Phases (v1.1+)

| Phase | Feature | Spec Ref |
|---|---|---|
| v1.1 | Newsletter subscription integration | F-015 |
| v1.2 | Gated / premium content | F-016 |
| v1.3 | Courses module | F-017 |
| v1.x | NextAuth.js — replace secret-based admin auth | §10.1 |

---

*For task-level tracking see `tasks.md`. For implementation instructions see `implementation.md`.*
