# Tasks

**Project:** Glowreeyah Digital Platform
**Version:** 1.0.0
**Last Updated:** 2026-03-28

> Detailed instructions for every task below are in `implementation.md`.
> Phase definitions and sequencing are in `plan.md`.

---

## Phase 3 — Environment Setup

- [ ] Create MongoDB Atlas account and M0 cluster
- [ ] Create Cloudinary account and note credentials
- [ ] Create Vercel account and link GitHub
- [ ] Create GitHub repository `glowreeyah-platform`
- [ ] Scaffold Next.js app with TypeScript + Tailwind + App Router
- [ ] Install dependencies: `mongoose`, `slugify`, `zod`, `cloudinary`
- [ ] Create `.env.local` with all required variables
- [ ] Add `.env.local` to `.gitignore`
- [ ] Verify `npm run dev` starts without errors

---

## Phase 4 — Core Development

### Data Layer

- [ ] Create `src/lib/mongodb.ts`
- [ ] Create `src/lib/cloudinary.ts`
- [ ] Create `src/lib/utils.ts`
- [ ] Create `src/models/Artist.ts`
- [ ] Create `src/models/Album.ts`
- [ ] Create `src/models/Song.ts`
- [ ] Create `src/models/Post.ts`
- [ ] Create `src/models/MediaAsset.ts`
- [ ] Create `src/models/Event.ts`
- [ ] Create `src/models/Initiative.ts`
- [ ] Create `src/models/Booking.ts`
- [ ] Create `src/models/Tag.ts`

### API Routes

- [ ] Create `src/app/api/artists/route.ts`
- [ ] Create `src/app/api/albums/route.ts`
- [ ] Create `src/app/api/songs/route.ts`
- [ ] Create `src/app/api/posts/route.ts`
- [ ] Create `src/app/api/media/route.ts`
- [ ] Create `src/app/api/events/route.ts`
- [ ] Create `src/app/api/initiatives/route.ts`
- [ ] Create `src/app/api/bookings/route.ts`
- [ ] Create `src/app/api/tags/route.ts`
- [ ] Add Zod validators for all POST/PATCH routes

### UI Layer

- [ ] Create `src/app/layout.tsx`
- [ ] Create `src/components/layout/Navbar.tsx`
- [ ] Create `src/components/layout/Footer.tsx`
- [ ] Create `src/components/layout/PageWrapper.tsx`
- [ ] Create `src/components/ui/Button.tsx`
- [ ] Create `src/components/ui/Input.tsx`
- [ ] Create `src/components/ui/Tag.tsx`
- [ ] Create `src/components/ui/LoadingSpinner.tsx`
- [ ] Create `src/components/music/AlbumCard.tsx`
- [ ] Create `src/components/music/SongCard.tsx`
- [ ] Create `src/components/music/AudioPlayer.tsx`
- [ ] Create `src/components/content/PostCard.tsx`
- [ ] Create `src/components/content/RichText.tsx`
- [ ] Create `src/components/media/MediaCard.tsx`

### Public Pages

- [ ] Create `src/app/(public)/page.tsx` (Home)
- [ ] Create `src/app/(public)/about/page.tsx`
- [ ] Create `src/app/(public)/music/page.tsx`
- [ ] Create `src/app/(public)/music/[albumSlug]/page.tsx`
- [ ] Create `src/app/(public)/music/[albumSlug]/[songSlug]/page.tsx`
- [ ] Create `src/app/(public)/blog/page.tsx`
- [ ] Create `src/app/(public)/blog/[slug]/page.tsx`
- [ ] Create `src/app/(public)/media/page.tsx`
- [ ] Create `src/app/(public)/speaking/page.tsx`
- [ ] Create `src/app/(public)/booking/page.tsx`
- [ ] Create `src/app/(public)/impact/page.tsx`
- [ ] Create `src/app/(public)/tag/[slug]/page.tsx`

---

## Phase 5 — Media Integration

- [ ] Configure Cloudinary in `src/lib/cloudinary.ts`
- [ ] Implement upload API route `src/app/api/media/route.ts`
- [ ] Add Cloudinary domain to `next.config.ts` `remotePatterns`
- [ ] Replace all `<img>` with `next/image` using Cloudinary URLs
- [ ] Test image upload end-to-end (upload → Cloudinary → URL in MongoDB)
- [ ] Confirm alt text validation blocks saves without alt text

---

## Phase 6 — CMS Build

### Dependencies

- [ ] Install `next-auth`
- [ ] Install `@uiw/react-md-editor` and `react-markdown`
- [ ] Add `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `CMS_ADMIN_EMAIL`, `CMS_ADMIN_PASSWORD` to `.env.local`
- [ ] Add same vars to Vercel environment variables dashboard

### Authentication

- [ ] Create `src/app/api/auth/[...nextauth]/route.ts` (Credentials provider)
- [ ] Update `src/middleware.ts` to use `withAuth` from `next-auth/middleware`
- [ ] Create `src/app/(cms)/login/page.tsx`
- [ ] Test: unauthenticated visit to `/cms/dashboard` redirects to `/cms/login`
- [ ] Test: valid credentials grant access and persist session

### CMS Shell

- [ ] Create `src/app/(cms)/layout.tsx`
- [ ] Create `src/components/cms/CMSSidebar.tsx`
- [ ] Create `src/components/cms/CMSTopbar.tsx`
- [ ] Create `src/components/cms/CMSPageHeader.tsx`
- [ ] Create `src/components/cms/StatusBadge.tsx`
- [ ] Create `src/components/cms/ConfirmDialog.tsx`

### Shared Form Components

- [ ] Create `src/components/cms/SlugField.tsx` (auto-generates slug from title)
- [ ] Create `src/components/cms/PublishToggle.tsx`
- [ ] Create `src/components/cms/TagSelector.tsx`
- [ ] Create `src/components/cms/RichTextEditor.tsx` (wraps `@uiw/react-md-editor`)
- [ ] Create `src/components/cms/MediaPicker.tsx` (select existing asset)
- [ ] Create `src/components/cms/MediaUploader.tsx` (upload new file)
- [ ] Create `src/components/cms/ContentForm.tsx` (generic form wrapper)
- [ ] Create `src/components/cms/ContentTable.tsx` (reusable list table)

### Dashboard

- [ ] Create `src/app/(cms)/dashboard/page.tsx` (stats: songs, posts, albums, pending bookings, upcoming events)

### Posts

- [ ] Create `src/app/(cms)/posts/page.tsx` (list)
- [ ] Create `src/components/cms/PostForm.tsx`
- [ ] Create `src/app/(cms)/posts/new/page.tsx`
- [ ] Create `src/app/(cms)/posts/[id]/page.tsx`
- [ ] Test: create → list shows new post → edit → delete

### Songs

- [ ] Create `src/app/(cms)/songs/page.tsx`
- [ ] Create `src/components/cms/SongForm.tsx`
- [ ] Create `src/app/(cms)/songs/new/page.tsx`
- [ ] Create `src/app/(cms)/songs/[id]/page.tsx`
- [ ] Test: create → list → edit → delete

### Albums

- [ ] Create `src/app/(cms)/albums/page.tsx`
- [ ] Create `src/components/cms/AlbumForm.tsx`
- [ ] Create `src/app/(cms)/albums/new/page.tsx`
- [ ] Create `src/app/(cms)/albums/[id]/page.tsx`

### Events

- [ ] Create `src/app/(cms)/events/page.tsx`
- [ ] Create `src/components/cms/EventForm.tsx`
- [ ] Create `src/app/(cms)/events/new/page.tsx`
- [ ] Create `src/app/(cms)/events/[id]/page.tsx`

### Initiatives

- [ ] Create `src/app/(cms)/initiatives/page.tsx`
- [ ] Create `src/components/cms/InitiativeForm.tsx`
- [ ] Create `src/app/(cms)/initiatives/new/page.tsx`
- [ ] Create `src/app/(cms)/initiatives/[id]/page.tsx`

### Media Library

- [ ] Create `src/app/(cms)/media/page.tsx` (upload + grid browser)
- [ ] Test: upload image → appears in grid → URL copyable
- [ ] Test: alt text missing → save blocked with error message

### Bookings

- [ ] Create `src/app/(cms)/bookings/page.tsx` (list submissions with status)
- [ ] Add status update (PATCH `/api/bookings/[id]`) callable from bookings page

### Tags & Artist Profile

- [ ] Create `src/app/(cms)/tags/page.tsx` (create / delete tags)
- [ ] Create `src/app/(cms)/artist/page.tsx` (edit artist biography, images, social links)

### Final CMS Checks

- [ ] Confirm `/cms/*` is disallowed in `robots.txt`
- [ ] Confirm "View site ↗" link in topbar opens public frontend correctly
- [ ] Confirm logout clears session and redirects to `/cms/login`
- [ ] Confirm all content created in CMS appears correctly on public frontend

---

## Phase 7 — SEO & Optimisation

- [ ] Add `generateMetadata()` to all dynamic route pages
- [ ] Create `src/app/sitemap.ts`
- [ ] Create `src/app/robots.ts`
- [ ] Add JSON-LD structured data to song pages
- [ ] Add JSON-LD structured data to post pages
- [ ] Add JSON-LD structured data to event pages
- [ ] Add `revalidate` to all Server Component pages
- [ ] Run Lighthouse audit (target: Performance ≥ 90, SEO = 100)
- [ ] Fix any accessibility issues (keyboard nav, colour contrast, heading hierarchy)
- [ ] Verify mobile layout at 375px width

---

## Phase 8 — Deployment

- [ ] Run `npm run build` locally — confirm zero errors
- [ ] Push all code to GitHub `main`
- [ ] Import repository to Vercel
- [ ] Add all environment variables to Vercel dashboard
- [ ] Trigger deployment and verify production URL
- [ ] Configure MongoDB Atlas to allow all IPs (`0.0.0.0/0`)
- [ ] Test production environment end-to-end
- [ ] Configure custom domain (if applicable)
- [ ] Add domain to `NEXT_PUBLIC_SITE_URL` in Vercel

---

## Phase 9 — Content Migration

- [ ] Export WordPress content as XML
- [ ] Write and run migration script for posts
- [ ] Write and run migration script for media (upload to Cloudinary)
- [ ] Create `MediaAsset` records for all migrated media
- [ ] Update post body references to use new Cloudinary URLs
- [ ] Validate: document count matches WordPress export
- [ ] Spot-check 10 random migrated posts for accuracy
- [ ] Confirm all images resolve (no broken URLs in production)

---

## Post-Launch

- [ ] Verify Google Search Console ownership
- [ ] Submit sitemap at `https://search.google.com/search-console`
- [ ] Run final Lighthouse audit on production URL
- [ ] Confirm CMS login works on production domain (`/cms/login`)
- [ ] Test booking form on production
- [ ] Test all CMS CRUD operations on production
- [ ] Enable MongoDB Atlas automated backups

---

## Ongoing

- [ ] Review booking submissions weekly
- [ ] Publish content via CMS (`/cms/posts`, `/cms/songs`, etc.)
- [ ] Run `npm outdated` monthly and update dependencies
- [ ] Monitor Vercel and MongoDB Atlas dashboards for errors
