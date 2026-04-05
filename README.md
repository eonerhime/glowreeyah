# Glowreeyah Digital Platform

A full-stack Next.js 15 digital platform for Glowreeyah (music artist and minister), featuring a built-in CMS, MongoDB Atlas database, and Cloudinary media storage.

---

## Tech Stack

| Layer         | Technology                                               | Version                                    |
| ------------- | -------------------------------------------------------- | ------------------------------------------ |
| Framework     | Next.js (App Router)                                     | 15.x                                       |
| Language      | TypeScript                                               | 5.x                                        |
| Styling       | Tailwind CSS                                             | 4.x (CSS-first, `@theme` in `globals.css`) |
| Database      | MongoDB via Mongoose                                     | Atlas M0+                                  |
| Media Storage | Cloudinary                                               | 2.x                                        |
| Auth          | NextAuth.js (Credentials)                                | 4.x                                        |
| Validation    | Zod                                                      | 3.x                                        |
| Rich Text     | `@uiw/react-md-editor` (CMS) + `react-markdown` (public) | —                                          |
| Email         | Resend                                                   | latest                                     |
| Live Chat     | Tawk.to (client-side widget)                             | —                                          |
| Hosting       | Vercel                                                   | —                                          |

---

## Getting Started

### Prerequisites

- Node.js 18.17.0+
- npm 9.x+
- Git 2.x+
- MongoDB Atlas account (M0 cluster)
- Cloudinary account
- Resend account (for email notifications)
- Tawk.to account (for live chat)
- Vercel account (for deployment)

### Local Setup

```bash
# Clone the repository
git clone https://github.com/your-org/glowreeyah-platform.git
cd glowreeyah-platform

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Fill in all required values (see Environment Variables below)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site.
The CMS is at [http://localhost:3000/cms](http://localhost:3000/cms).

---

## Environment Variables

Create a `.env.local` file in the project root. **Never commit this file to Git.**

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/glowreeyah?retryWrites=true&w=majority

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Glowreeyah

# CMS Auth (NextAuth)
NEXTAUTH_SECRET=your_random_32_char_string
NEXTAUTH_URL=http://localhost:3000
CMS_ADMIN_EMAIL=admin@glowreeyah.com
CMS_ADMIN_PASSWORD=your_secure_password

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key
CONTACT_EMAIL=your@email.com
```

---

## Project Structure

```
src/
├── app/
│   ├── (public)/               ← Public-facing pages
│   │   ├── page.tsx            ← Homepage
│   │   ├── about/
│   │   ├── music/[albumSlug]/
│   │   ├── blog/[slug]/
│   │   ├── events/             ← Speaking & Events (was /speaking)
│   │   ├── booking/
│   │   ├── impact/[slug]/
│   │   ├── contact/
│   │   ├── gallery/
│   │   ├── media/
│   │   └── tag/[slug]/
│   ├── cms/                    ← Content Management System
│   │   ├── dashboard/
│   │   ├── posts/
│   │   ├── songs/
│   │   ├── albums/
│   │   ├── events/
│   │   ├── initiatives/
│   │   ├── gallery/
│   │   ├── media/
│   │   ├── bookings/
│   │   ├── tags/
│   │   ├── artist/
│   │   └── settings/
│   ├── api/                    ← API route handlers
│   │   ├── auth/[...nextauth]/
│   │   ├── artists/
│   │   ├── albums/[id]/
│   │   ├── songs/[id]/
│   │   ├── posts/[id]/
│   │   ├── events/[id]/
│   │   ├── initiatives/[id]/
│   │   ├── bookings/[id]/
│   │   ├── tags/[id]/
│   │   ├── media/[id]/
│   │   ├── gallery/photos/[id]/
│   │   ├── gallery/videos/[id]/
│   │   ├── contact/
│   │   ├── settings/
│   │   └── cms/bookings-seen/
│   ├── layout.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/                 ← Navbar, Footer, PageWrapper
│   ├── cms/                    ← All CMS-specific components
│   ├── music/                  ← AlbumCard, SongCard, AudioPlayer
│   ├── content/                ← PostCard, RichText, InitiativeCard, EventCard
│   ├── contact/                ← ContactForm
│   ├── gallery/                ← GalleryGrid, GalleryTabs, Lightbox
│   └── ui/                     ← Button, Input, Tag, LoadingSpinner, TawkChat
├── lib/
│   ├── mongodb.ts
│   ├── cloudinary.ts
│   └── validators/             ← Zod schemas for all content types
└── models/                     ← Mongoose models
    ├── Artist.ts
    ├── Album.ts
    ├── Song.ts
    ├── Post.ts
    ├── MediaAsset.ts
    ├── Event.ts
    ├── Initiative.ts
    ├── Booking.ts
    ├── Tag.ts
    ├── SiteSettings.ts
    ├── ContactMessage.ts
    ├── GalleryPhoto.ts
    └── GalleryVideo.ts
```

---

## Key Commands

```bash
# Development
npm run dev

# Production build (run before deploying)
npm run build

# Run production build locally
npm run start

# TypeScript check
npx tsc --noEmit

# Lint
npm run lint

# Format
npx prettier --write src/
```

---

## Public Routes

| Route                           | Page                                                                     |
| ------------------------------- | ------------------------------------------------------------------------ |
| `/`                             | Homepage with hero, music, about, blog, events, impact, contact sections |
| `/about`                        | Artist profile — biography, achievements, social links                   |
| `/music`                        | Album catalogue                                                          |
| `/music/[albumSlug]`            | Album detail with song listing                                           |
| `/music/[albumSlug]/[songSlug]` | Song detail with audio/video player                                      |
| `/blog`                         | Blog post listing                                                        |
| `/blog/[slug]`                  | Full blog post                                                           |
| `/events`                       | Upcoming and past events (two-column, expandable cards)                  |
| `/booking`                      | Booking request form                                                     |
| `/impact`                       | Initiative cards                                                         |
| `/impact/[slug]`                | Initiative detail page                                                   |
| `/contact`                      | Contact form + social handles                                            |
| `/gallery`                      | Photo and video gallery (Events / Initiatives tabs)                      |
| `/media`                        | Press and media appearances                                              |
| `/tag/[slug]`                   | Tag archive page                                                         |

---

## CMS Routes

All CMS routes require authentication. Login at `/cms-login`.

| Route              | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| `/cms/dashboard`   | Overview stats                                 |
| `/cms/posts`       | Blog post management                           |
| `/cms/songs`       | Song management                                |
| `/cms/albums`      | Album management                               |
| `/cms/events`      | Event management                               |
| `/cms/initiatives` | Initiative management                          |
| `/cms/gallery`     | Gallery photo and video management             |
| `/cms/media`       | Media library (upload + browse)                |
| `/cms/bookings`    | Booking request management with status updates |
| `/cms/tags`        | Tag management                                 |
| `/cms/artist`      | Artist profile editing                         |
| `/cms/settings`    | Site settings (hero content, headings)         |

---

## Notable Features

- **Inline tag creation** — tags can be created directly from any content form without visiting the Tags section
- **Booking status management** — accept, decline, or mark as reviewed with automatic email notifications to the requestor via Resend
- **Pending bookings badge** — red notification badge on the Bookings sidebar item, clears when the page is visited
- **Gallery system** — bulk photo upload and YouTube/Vimeo video links attached to specific events or initiatives, with a lightbox viewer on the public gallery page
- **Smart back links** — detail pages (blog, album, initiative, about, events) detect whether the user came from the homepage and link back to the correct section anchor (`/#blog`, `/#music`, `/#impact`, etc.)
- **Auto-generated excerpts** — blog post excerpts are auto-generated from the body with manual override
- **Mobile-responsive CMS** — collapsible sidebar drawer on mobile
- **Tawk.to live chat** — floating chat widget on all public pages, hidden from the CMS
- **Contact form** — on homepage and dedicated `/contact` page, saves to MongoDB and sends email notification via Resend

---

## Deployment

### Vercel (Recommended)

1. Push code to the `main` branch on GitHub
2. Import the repository at [vercel.com](https://vercel.com)
3. Add all environment variables from `.env.local` to the Vercel dashboard
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your production domain
5. Deploy

All future pushes to `main` trigger automatic production deployments.

### MongoDB Atlas

Set Network Access → `0.0.0.0/0` to allow Vercel's dynamic IPs.

### Tawk.to

Replace the embed URL in `src/components/ui/TawkChat.tsx` with your property's script URL from the Tawk.to dashboard under **Administration → Chat Widget**.

---

## Branch History

| Branch               | Status                 |
| -------------------- | ---------------------- |
| `scaffolding`        | Merged to `main`       |
| `data-layer`         | Merged to `main`       |
| `ui-component-layer` | Merged to `main`       |
| `cms`                | Merged to `main`       |
| `seo-implementation` | Current working branch |

---

## Remaining Work

- JSON-LD structured data on song, post, and event pages (§11)
- Lighthouse audit — target Performance ≥ 90, Accessibility ≥ 90 (§12)
- Full manual testing pass (§13)
- Production deployment and env var configuration (§14)
- WordPress content migration (§15)
- Google Search Console setup and sitemap submission (§16)
