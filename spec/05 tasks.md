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

## Phase 6 — Admin System

- [ ] Create `src/middleware.ts` (admin route protection)
- [ ] Create `src/app/api/admin/auth/route.ts`
- [ ] Create admin login page `src/app/admin/login/page.tsx`
- [ ] Create admin dashboard `src/app/admin/page.tsx`
- [ ] Create admin songs management page
- [ ] Create admin albums management page
- [ ] Create admin posts management page
- [ ] Create admin events management page
- [ ] Create admin initiatives management page
- [ ] Create admin bookings view page
- [ ] Create admin tags management page
- [ ] Create admin media browser page
- [ ] Test all admin CRUD operations
- [ ] Test admin auth (protected pages redirect unauthenticated users)

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
- [ ] Test booking form on production
- [ ] Confirm admin login on production domain
- [ ] Enable MongoDB Atlas automated backups

---

## Ongoing

- [ ] Review booking submissions weekly
- [ ] Publish content via admin dashboard
- [ ] Run `npm outdated` monthly and update dependencies
- [ ] Monitor Vercel and MongoDB Atlas dashboards for errors
