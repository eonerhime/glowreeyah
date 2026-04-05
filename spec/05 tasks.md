# Tasks

**Project:** Glowreeyah Digital Platform
**Version:** 1.1.0
**Last Updated:** 2026-04-05

> Detailed instructions for every task are in `implementation.md`.
> Phase definitions and sequencing are in `plan.md`.

---

## Phase 3 — Environment Setup ✅ Complete

- [x] Create MongoDB Atlas account and M0 cluster
- [x] Create Cloudinary account and note credentials
- [x] Create Vercel account and link GitHub
- [x] Create GitHub repository `glowreeyah-platform`
- [x] Scaffold Next.js app with TypeScript + Tailwind + App Router
- [x] Install all dependencies
- [x] Create `.env.local` with all required variables
- [x] Add `.env.local` to `.gitignore`
- [x] Verify `npm run dev` starts without errors

---

## Phase 4 — Core Development ✅ Complete

### Data Layer

- [x] `src/lib/mongodb.ts`
- [x] `src/lib/cloudinary.ts`
- [x] `src/lib/utils.ts`
- [x] All models: `Artist`, `Album`, `Song`, `Post`, `MediaAsset`, `Event`, `Initiative`, `Booking`, `Tag`, `SiteSettings`, `ContactMessage`, `GalleryPhoto`, `GalleryVideo`
- [x] All Zod validators with `.optional().or(z.literal(''))` on URL fields
- [x] `coverImageUrl` required on `PostSchema` (blocks save without image)

### API Routes

- [x] All collection routes (GET, POST)
- [x] All `[id]` routes (GET, PATCH, DELETE) — typed as `Promise<{ id: string }>` for Next.js 15
- [x] `src/app/api/contact/route.ts`
- [x] `src/app/api/settings/route.ts`
- [x] `src/app/api/gallery/photos/route.ts` and `[id]/route.ts`
- [x] `src/app/api/gallery/videos/route.ts` and `[id]/route.ts`
- [x] `src/app/api/bookings/[id]/route.ts` with Resend email notification
- [x] `src/app/api/cms/bookings-seen/route.ts`

### UI Layer

- [x] Root layout with Navbar, Footer, TawkChat
- [x] All layout components: `Navbar`, `Footer`, `PageWrapper`
- [x] All UI components: `Button`, `Input`, `Tag`, `LoadingSpinner`, `TawkChat`
- [x] Music components: `AlbumCard`, `SongCard`, `AudioPlayer`
- [x] Content components: `PostCard`, `RichText`, `InitiativeCard`, `EventCard`
- [x] Gallery components: `GalleryGrid`, `GalleryTabs`, `Lightbox`
- [x] Contact component: `ContactForm`

### Public Pages

- [x] `/` — Home (hero, music, about, blog, events, impact, contact sections)
- [x] `/about` — Artist profile with hero image and back link
- [x] `/music` — Album catalogue
- [x] `/music/[albumSlug]` — Album detail with hero image and back link
- [x] `/music/[albumSlug]/[songSlug]` — Song detail
- [x] `/blog` — Blog listing
- [x] `/blog/[slug]` — Post detail with hero image and back link
- [x] `/events` — Two-column expandable event cards (was `/speaking`)
- [x] `/booking` — Booking form with success state and scroll-to-top
- [x] `/impact` — Initiative card grid
- [x] `/impact/[slug]` — Initiative detail with hero image and back link
- [x] `/contact` — Contact form + social handles
- [x] `/gallery` — Gallery with Events/Initiatives tabs and lightbox
- [x] `/media` — Press gallery
- [x] `/tag/[slug]` — Tag archive

---

## Phase 5 — Media Integration ✅ Complete

- [x] Cloudinary configured in `src/lib/cloudinary.ts`
- [x] Upload API route implemented
- [x] Cloudinary domain added to `next.config.ts` `remotePatterns`
- [x] `next/image` used throughout all public pages
- [x] Alt text validation enforced on upload
- [x] `MediaPicker` component has inline upload tab (Library + Upload new)

---

## Phase 6 — CMS ✅ Complete

### Authentication

- [x] NextAuth.js Credentials provider
- [x] `src/middleware.ts` with `withAuth` protecting `/cms/*`
- [x] Login page at `/cms-login`
- [x] Session provider in `CMSShell` client component

### CMS Shell

- [x] `src/app/cms/layout.tsx` — async server component fetching pending booking count
- [x] `CMSShell` client component wrapping `SessionProvider`
- [x] `CMSSidebar` with pending bookings badge and mobile drawer
- [x] `CMSTopbar` with hamburger button for mobile
- [x] Mobile-responsive — sidebar collapses to drawer on small screens

### Shared Form Components

- [x] `SlugField` — auto-generates slug from title
- [x] `PublishToggle`
- [x] `TagSelector` — with inline tag creation (POST /api/tags)
- [x] `RichTextEditor` — dynamic import of `@uiw/react-md-editor`
- [x] `MediaPicker` — library tab + inline upload tab
- [x] `MediaUploader` — standalone uploader for `/cms/media`
- [x] `StatusBadge`, `CMSRowActions`, `ConfirmDialog`, `CMSPageHeader`
- [x] `CharCountInput`, `PublishToggle`

### CMS Pages

- [x] `/cms/dashboard` — stats overview
- [x] `/cms/posts` + `new` + `[id]` — with Cancel button, auto-excerpt, cover image required
- [x] `/cms/songs` + `new` + `[id]` — with Cancel button
- [x] `/cms/albums` + `new` + `[id]`
- [x] `/cms/events` + `new` + `[id]` — status derived from date, Cancel button
- [x] `/cms/initiatives` + `new` + `[id]`
- [x] `/cms/gallery` — bulk photo upload + video links per event/initiative
- [x] `/cms/media` — upload + grid browser with copy URL
- [x] `/cms/bookings` — expandable booking cards with status update + email notification
- [x] `/cms/tags` — create/delete tags
- [x] `/cms/artist` — artist profile editor
- [x] `/cms/settings` — site settings editor

### Booking Notifications

- [x] Pending bookings count badge on sidebar
- [x] `MarkBookingsSeen` client component sets cookie via `/api/cms/bookings-seen`
- [x] Layout reads cookie to compute unseen count
- [x] `router.refresh()` after marking seen clears badge immediately

---

## Phase 7 — SEO Implementation 🔄 In Progress

- [x] `generateMetadata()` on all dynamic public routes
- [x] Open Graph + Twitter Card metadata on all routes
- [x] Canonical URLs on all pages
- [x] `src/app/sitemap.ts` created
- [x] `src/app/robots.ts` created — `/cms/` disallowed
- [x] `revalidate = 3600` on all Server Component content pages
- [x] Skip navigation link in root layout
- [ ] JSON-LD structured data on song pages (`MusicRecording`)
- [ ] JSON-LD structured data on post pages (`Article`)
- [ ] JSON-LD structured data on event pages (`Event`)

---

## Phase 8 — Performance & Accessibility 🔄 In Progress

- [x] `next/image` used for all images — no raw `<img>` in public pages
- [x] `next/font` used for Inter
- [x] Client Component usage minimised
- [x] `loading="lazy"` on video embeds
- [ ] Lighthouse Performance score ≥ 90 on Home, Music, Blog pages
- [ ] Lighthouse Accessibility score ≥ 90
- [ ] Colour contrast ratio verified ≥ 4.5:1 on all text

---

## Phase 9 — Testing ⬜ Not Started

- [ ] All public pages load without errors
- [ ] Dynamic routes resolve correctly (music, blog, tags, impact slugs, gallery)
- [ ] API routes return correct status codes
- [ ] CMS CRUD tested for all content types
- [ ] Mobile layout at 375px width
- [ ] `/sitemap.xml` accessible and correct
- [ ] `/robots.txt` accessible and correct
- [ ] Contact form saves to DB and sends email
- [ ] Booking form saves to DB and sends email on status change
- [ ] Gallery upload and lightbox working end-to-end
- [ ] `/speaking` redirects to `/events`

---

## Phase 10 — Deployment ⬜ Not Started

- [ ] `npm run build` passes locally — zero errors
- [ ] `npx tsc --noEmit` passes — zero TypeScript errors
- [ ] `npm run lint` passes — zero ESLint errors
- [ ] Code pushed to `main` branch on GitHub
- [ ] Repository imported into Vercel
- [ ] All 13 environment variables added to Vercel dashboard
- [ ] `NEXTAUTH_URL` updated to production domain
- [ ] `NEXT_PUBLIC_SITE_URL` updated to production domain
- [ ] First deployment successful
- [ ] MongoDB Atlas Network Access set to `0.0.0.0/0`
- [ ] Database user has `readWrite` permission
- [ ] Atlas automated backups enabled
- [ ] Custom domain configured
- [ ] `/cms-login` accessible on production domain
- [ ] Tawk.to widget embed URL confirmed in `TawkChat.tsx`
- [ ] Resend `from` domain verified (or switch to `onboarding@resend.dev` for testing)

---

## Phase 11 — Content Migration ⬜ Not Started

- [ ] WordPress `.xml` export downloaded
- [ ] Migration script written and tested locally
- [ ] All posts imported — document count matches WordPress export
- [ ] All media downloaded from WordPress and uploaded to Cloudinary
- [ ] `MediaAsset` records created for each migrated file
- [ ] Post body image references updated to Cloudinary URLs
- [ ] 10 random posts spot-checked for accuracy
- [ ] Zero broken image URLs in production
- [ ] All slugs unique — no duplicate key errors

---

## Post-Launch ⬜ Not Started

- [ ] Google Search Console ownership verified
- [ ] Sitemap submitted to Search Console
- [ ] Lighthouse audit on production — Performance ≥ 90, SEO = 100, Accessibility ≥ 90
- [ ] CMS login confirmed working on production
- [ ] All CMS CRUD operations tested on production
- [ ] Booking form tested on production
- [ ] Contact form tested on production
- [ ] Vercel deployment logs reviewed — no runtime errors
- [ ] MongoDB Atlas metrics reviewed
- [ ] Cloudinary usage reviewed against free tier limits
- [ ] MongoDB Atlas automated backups enabled

---

## Ongoing

- [ ] Review booking submissions weekly
- [ ] Review contact form submissions weekly
- [ ] Publish content via CMS
- [ ] Run `npm outdated` monthly and update dependencies
- [ ] Monitor Vercel and MongoDB Atlas dashboards for errors
