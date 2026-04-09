# Implementation Guide

**Project:** Glowreeyah Digital Platform
**Document Type:** Software Design Document (SDD) — Single Source of Truth
**Version:** 2.1.0
**Last Updated:** 2026-04-09
**Status:** Pre-deployment

---

## Progress Tracker

| Section | Title                       | Status         |
| ------- | --------------------------- | -------------- |
| §1      | System Architecture         | ✅ Complete    |
| §2      | Tech Stack & Dependencies   | ✅ Complete    |
| §3      | Environment Setup           | ✅ Complete    |
| §4      | Project Scaffolding         | ✅ Complete    |
| §5      | Database Design             | ✅ Complete    |
| §6      | API Layer                   | ✅ Complete    |
| §7      | UI & Component Layer        | ✅ Complete    |
| §8      | Page Implementation         | ✅ Complete    |
| §9      | Media Integration           | ✅ Complete    |
| §10     | CMS                         | ✅ Complete    |
| §11     | SEO Implementation          | 🔄 In Progress |
| §12     | Performance & Accessibility | ⬜ Not Started |
| §13     | Testing                     | ⬜ Not Started |
| §14     | Deployment                  | ⬜ Not Started |
| §15     | Content Migration           | ⬜ Not Started |
| §16     | Post-Launch                 | ⬜ Not Started |
| §17     | Multi-Tenant Roles          | ⬜ Not Started |
| §18     | Paystack Payments           | ⬜ Not Started |

> Update this table as each section is completed. Change `⬜ Not Started` → `🔄 In Progress` → `✅ Complete`.

---

## Document Purpose

This document is the **single source of truth** for end-to-end implementation and execution of the Glowreeyah digital platform. It covers environment setup, project scaffolding, database configuration, API development, UI development, media integration, admin system, SEO, deployment, and content migration — in sequential order.

Cross-references:

- Feature definitions → `04_features.md`
- Brand rules and constraints → `01_constitution.md`
- Data models and domain spec → `02_specification.md`
- Execution phases and milestones → `03_plan.md`
- Outstanding tasks → `05_tasks.md`

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Environment Setup](#3-environment-setup)
4. [Project Scaffolding](#4-project-scaffolding)
5. [Database Design](#5-database-design)
6. [API Layer](#6-api-layer)
7. [UI & Component Layer](#7-ui--component-layer)
8. [Page Implementation](#8-page-implementation)
9. [Media Integration](#9-media-integration)
10. [CMS — Content Management System](#10-cms--content-management-system)
11. [SEO Implementation](#11-seo-implementation)
12. [Performance & Accessibility](#12-performance--accessibility)
13. [Testing](#13-testing)
14. [Deployment](#14-deployment)
15. [Content Migration](#15-content-migration)
16. [Post-Launch](#16-post-launch)

---

## 1. System Architecture ✅

```
┌──────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│   (public)/* — Public website    cms/* — Content Studio      │
└──────────────────┬───────────────────────┬───────────────────┘
                   │ HTTP / fetch           │ HTTP / fetch
┌──────────────────▼───────────────────────▼───────────────────┐
│                  Next.js API Routes (/api/*)                  │
│              Shared route handlers — same codebase            │
└──────────┬──────────────────────────────┬────────────────────┘
           │                              │
┌──────────▼──────┐           ┌───────────▼──────────────────┐
│  MongoDB Atlas   │           │  Object Storage               │
│  (all content,   │           │  Cloudinary                   │
│   CMS sessions)  │           │  (images, audio, video)       │
└─────────────────┘           └──────────────────────────────┘
                                           │
                               ┌───────────▼──────────────────┐
                               │  External Services            │
                               │  Resend (email notifications) │
                               │  Tawk.to (live chat)          │
                               └──────────────────────────────┘
```

**Deployment targets:**

- Public frontend + CMS + API routes → Vercel (single deployment)
- Database → MongoDB Atlas
- Media → Cloudinary
- Email → Resend
- Chat → Tawk.to (client-side embed)

**Route groups:**

- `src/app/(public)/` — public-facing website, no auth required
- `src/app/cms/` — real directory (not a route group) for the CMS, protected by NextAuth middleware
- `src/app/api/` — shared REST API consumed by both public pages and CMS

> **Note:** The CMS uses a real `cms/` directory rather than a `(cms)` route group. This resolves a route conflict that occurred with the route group approach in Next.js 15.

---

## 2. Tech Stack & Dependencies ✅

### Core

| Package                | Version | Purpose                                  |
| ---------------------- | ------- | ---------------------------------------- |
| `next`                 | 15.x    | Framework (App Router)                   |
| `react`                | 18.x    | UI runtime                               |
| `react-dom`            | 18.x    | DOM rendering                            |
| `typescript`           | 5.x     | Type safety                              |
| `tailwindcss`          | 4.x     | Utility-first styling (CSS-first config) |
| `@tailwindcss/postcss` | 4.x     | PostCSS integration for Tailwind v4      |

### Database

| Package    | Version | Purpose     |
| ---------- | ------- | ----------- |
| `mongoose` | 8.x     | MongoDB ODM |

### Media

| Package      | Version | Purpose                 |
| ------------ | ------- | ----------------------- |
| `cloudinary` | 2.x     | Media upload + delivery |

### Auth & Communication

| Package     | Version | Purpose                                 |
| ----------- | ------- | --------------------------------------- |
| `next-auth` | 4.x     | CMS authentication + session management |
| `resend`    | latest  | Transactional email (booking alerts)    |

### Utilities

| Package                | Version | Purpose                            |
| ---------------------- | ------- | ---------------------------------- |
| `@uiw/react-md-editor` | 3.x     | Markdown rich text editor (CMS)    |
| `react-markdown`       | 9.x     | Render markdown on public frontend |
| `slugify`              | 1.x     | URL-safe slug generation           |
| `zod`                  | 3.x     | Schema validation                  |

### Dev Dependencies

| Package        | Purpose                |
| -------------- | ---------------------- |
| `eslint`       | Linting                |
| `prettier`     | Code formatting        |
| `@types/node`  | Node type definitions  |
| `@types/react` | React type definitions |

---

## 3. Environment Setup ✅

### 3.1 Prerequisites ✅

| Tool    | Minimum Version | Install             |
| ------- | --------------- | ------------------- |
| Node.js | 18.17.0         | https://nodejs.org  |
| npm     | 9.x             | Bundled with Node   |
| Git     | 2.x             | https://git-scm.com |

- [x] Node.js installed and verified
- [x] npm installed and verified
- [x] Git installed and verified

---

### 3.2 Accounts Required ✅

- [x] MongoDB Atlas account — M0 cluster running, database user created, connection string copied
- [x] Cloudinary account — Cloud Name, API Key, API Secret noted
- [x] Vercel account — linked to GitHub
- [x] GitHub repository created (`glowreeyah-platform`)
- [x] Resend account — API key created, sending domain verified
- [x] Tawk.to account — property created, embed script URL noted

---

### 3.3 Environment Variables ✅

**File:** `.env.local` — never commit this file to Git.

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
RESEND_FROM_EMAIL=noreply@glowreeyah.com
RESEND_TO_EMAIL=admin@glowreeyah.com
```

- [x] `.env.local` created with all required variables
- [x] `.env.local` added to `.gitignore`

---

## 4. Project Scaffolding ✅

### 4.1 Create the Next.js Application ✅

```bash
npx create-next-app@latest glowreeyah-platform \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

When prompted: **Turbopack → No** (more stable for production).

- [x] Next.js app scaffolded with TypeScript, Tailwind, ESLint, App Router, `src/` dir
- [x] `npm run dev` starts without errors

---

### 4.2 Install Dependencies ✅

```bash
npm install mongoose slugify zod cloudinary next-auth resend @uiw/react-md-editor react-markdown
npm install --save-dev prettier @types/node
```

---

### 4.3 Directory Structure ✅

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    ← Home
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── music/
│   │   │   ├── page.tsx
│   │   │   └── [albumSlug]/
│   │   │       └── page.tsx            ← Album detail (AlbumPlayer)
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx            ← Post detail
│   │   ├── media/
│   │   │   └── page.tsx
│   │   ├── events/                     ← renamed from /speaking
│   │   │   └── page.tsx
│   │   ├── booking/
│   │   │   └── page.tsx
│   │   ├── impact/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx            ← Initiative detail
│   │   └── tag/
│   │       └── [slug]/
│   │           └── page.tsx
│   ├── cms/                            ← Real directory (not route group)
│   │   ├── layout.tsx                  ← CMSShell (sidebar drawer + topbar)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── songs/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── albums/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── posts/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx                ← Mobile card layout (not table)
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── initiatives/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── media/
│   │   │   └── page.tsx
│   │   ├── bookings/
│   │   │   └── page.tsx                ← Status updates + Resend email
│   │   ├── tags/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx                ← SiteSettings (hero images, etc.)
│   │   └── artist/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/route.ts
│   │   ├── artists/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── albums/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── songs/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── posts/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── media/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── events/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── initiatives/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── bookings/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── tags/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── settings/
│   │   │   └── route.ts                ← SiteSettings GET/PATCH
│   │   └── cms/
│   │       └── bookings-seen/
│   │           └── route.ts            ← Cookie-based seen tracking
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── PageWrapper.tsx
│   ├── cms/
│   │   ├── CMSShell.tsx                ← Outer shell with mobile drawer state
│   │   ├── CMSSidebar.tsx              ← Nav links + collapsible on mobile
│   │   ├── CMSTopbar.tsx               ← Hamburger + bookings badge + logout
│   │   ├── CMSPageHeader.tsx
│   │   ├── CMSRowActions.tsx
│   │   ├── MarkBookingsSeen.tsx        ← Sets seen cookie on mount
│   │   ├── ContentTable.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── MediaPicker.tsx
│   │   ├── MediaUploader.tsx
│   │   ├── TagSelector.tsx
│   │   ├── PublishToggle.tsx
│   │   ├── SlugField.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── PostForm.tsx
│   │   ├── SongForm.tsx
│   │   ├── AlbumForm.tsx
│   │   ├── EventForm.tsx               ← deriveIsUpcoming() at module scope
│   │   └── InitiativeForm.tsx
│   ├── music/
│   │   ├── AlbumCard.tsx
│   │   ├── SongCard.tsx
│   │   └── AlbumPlayer.tsx             ← Inline play, floating bar, prev/next
│   ├── content/
│   │   ├── PostCard.tsx
│   │   └── RichText.tsx
│   ├── media/
│   │   └── MediaCard.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Tag.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── mongodb.ts
│   ├── cloudinary.ts
│   ├── resend.ts
│   ├── utils.ts
│   └── validators/
│       ├── albumValidator.ts
│       ├── artistValidator.ts
│       ├── bookingValidator.ts
│       ├── eventValidator.ts
│       ├── initiativeValidator.ts
│       ├── postValidator.ts
│       ├── songValidator.ts
│       └── tagValidator.ts
├── models/
│   ├── Artist.ts
│   ├── Album.ts
│   ├── Song.ts
│   ├── Post.ts
│   ├── MediaAsset.ts
│   ├── Event.ts
│   ├── Initiative.ts
│   ├── Booking.ts
│   ├── Tag.ts
│   └── SiteSettings.ts                 ← heroImageUrl, heroImageMobileUrl, etc.
└── middleware.ts
```

---

### 4.4 Tailwind Configuration ✅

This project uses **Tailwind v4** — no `tailwind.config.ts`. All theme config lives in `src/app/globals.css`.

**File:** `src/app/globals.css`

```css
@import 'tailwindcss';

@theme {
  --color-brand-gold: #c9a84c;
  --color-brand-teal: #39afb9;
  --color-brand-deep: #1a1a2e;
  --color-brand-warm: #f5ede0;
  --color-brand-accent: #8b5cf6;

  --font-family-serif: Georgia, serif;
  --font-family-sans: Inter, sans-serif;
}
```

**File:** `postcss.config.js`

```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

> Do **not** use the old `tailwindcss` key — that is v3 syntax and will cause a build error on v4.

- [x] `globals.css` replaced with `@import "tailwindcss"` + `@theme` block
- [x] `postcss.config.js` uses `@tailwindcss/postcss`
- [x] Brand colour classes resolve correctly in dev

---

### 4.5 next.config.ts ✅

**File:** `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    qualities: [75, 80],
  },
  async redirects() {
    return [
      {
        source: '/speaking',
        destination: '/events',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

- [x] Cloudinary `remotePatterns` set — `next/image` works with Cloudinary URLs
- [x] `qualities: [75, 80]` for optimised delivery
- [x] `/speaking` → `/events` permanent redirect

---

## 5. Database Design ✅

### 5.1 MongoDB Connection

**File:** `src/lib/mongodb.ts`

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

let cached = (global as any).mongoose ?? { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
```

---

### 5.2 Data Models

#### Artist — `src/models/Artist.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IArtist extends Document {
  name: string;
  slugName: string;
  biographyShort: string;
  biographyMedium: string;
  biographyLong: string;
  achievements: string[];
  speakingProfile: string;
  profileImageUrl: string;
  socialLinks: {
    instagram?: string;
    youtube?: string;
    spotify?: string;
    twitter?: string;
  };
  seo: { metaTitle: string; metaDescription: string };
  updatedAt: Date;
}

const ArtistSchema = new Schema<IArtist>(
  {
    name: { type: String, required: true },
    slugName: { type: String, required: true, unique: true },
    biographyShort: { type: String, required: true, maxlength: 160 },
    biographyMedium: { type: String, required: true, maxlength: 500 },
    biographyLong: { type: String, required: true },
    achievements: [{ type: String }],
    speakingProfile: { type: String },
    profileImageUrl: { type: String, required: true },
    socialLinks: {
      instagram: String,
      youtube: String,
      spotify: String,
      twitter: String,
    },
    seo: { metaTitle: String, metaDescription: String },
  },
  { timestamps: true }
);

export default mongoose.models.Artist ||
  mongoose.model<IArtist>('Artist', ArtistSchema);
```

---

#### Album — `src/models/Album.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IAlbum extends Document {
  title: string;
  slug: string;
  releaseYear: number;
  coverImageUrl: string;
  description: string;
  tags: mongoose.Types.ObjectId[];
  isSingle: boolean;       // true = single track release, false = album
  price: number;           // price in kobo (Paystack unit); 0 = free
  seo: { metaTitle: string; metaDescription: string };
}

const AlbumSchema = new Schema<IAlbum>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    releaseYear: { type: Number, required: true },
    coverImageUrl: { type: String, required: true },
    description: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    isSingle: { type: Boolean, default: false },
    price: { type: Number, default: 0 },   // 0 = free / streaming only
    seo: { metaTitle: String, metaDescription: String },
  },
  { timestamps: true }
);

export default mongoose.models.Album ||
  mongoose.model<IAlbum>('Album', AlbumSchema);
```

---

#### Song — `src/models/Song.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ISong extends Document {
  title: string;
  slug: string;
  albumId: mongoose.Types.ObjectId;
  trackNumber: number;
  description: string;
  lyrics: string;
  storyBehindSong: string;
  audioUrl: string;
  videoUrl: string;
  coverImageUrl: string;
  tags: mongoose.Types.ObjectId[];
  isPublished: boolean;
  price: number;           // price in kobo; 0 = free / included in album price
  seo: { metaTitle: string; metaDescription: string };
}

const SongSchema = new Schema<ISong>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    albumId: { type: Schema.Types.ObjectId, ref: 'Album', required: true },
    trackNumber: { type: Number },
    description: { type: String },
    lyrics: { type: String },
    storyBehindSong: { type: String },
    audioUrl: { type: String },
    videoUrl: { type: String },
    coverImageUrl: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    isPublished: { type: Boolean, default: true },
    price: { type: Number, default: 0 },
    seo: { metaTitle: String, metaDescription: String },
  },
  { timestamps: true }
);

export default mongoose.models.Song ||
  mongoose.model<ISong>('Song', SongSchema);
```

---

#### Post — `src/models/Post.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  category: 'blog' | 'devotional' | 'story';
  body: string;
  excerpt: string;
  coverImageUrl: string;
  tags: mongoose.Types.ObjectId[];
  isPublished: boolean;
  publishedAt: Date;
  seo: { metaTitle: string; metaDescription: string };
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['blog', 'devotional', 'story'],
      default: 'blog',
    },
    body: { type: String, required: true },
    excerpt: { type: String, maxlength: 300 },
    coverImageUrl: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    seo: { metaTitle: String, metaDescription: String },
  },
  { timestamps: true }
);

export default mongoose.models.Post ||
  mongoose.model<IPost>('Post', PostSchema);
```

---

#### MediaAsset — `src/models/MediaAsset.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IMediaAsset extends Document {
  url: string;
  publicId: string;
  altText: string;
  type: 'image' | 'video' | 'audio';
  linkedContentId: mongoose.Types.ObjectId;
  linkedContentType: string;
  tags: mongoose.Types.ObjectId[];
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    altText: { type: String, required: true },
    type: { type: String, enum: ['image', 'video', 'audio'], required: true },
    linkedContentId: { type: Schema.Types.ObjectId },
    linkedContentType: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  },
  { timestamps: true }
);

export default mongoose.models.MediaAsset ||
  mongoose.model<IMediaAsset>('MediaAsset', MediaAssetSchema);
```

---

#### Tag — `src/models/Tag.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  name: string;
  slug: string;
  description: string;
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema);
```

---

#### Event — `src/models/Event.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  slug: string;
  date: Date;
  location: string;
  description: string;
  externalLink: string;
  isUpcoming: boolean;
  coverImageUrl: string;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String },
    externalLink: { type: String },
    isUpcoming: { type: Boolean, default: true },
    coverImageUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Event ||
  mongoose.model<IEvent>('Event', EventSchema);
```

---

#### Booking — `src/models/Booking.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  name: string;
  email: string;
  organisation: string;
  eventType: string;
  eventDate: string;
  message: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
}

const BookingSchema = new Schema<IBooking>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    organisation: { type: String },
    eventType: { type: String },
    eventDate: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model<IBooking>('Booking', BookingSchema);
```

---

#### Initiative — `src/models/Initiative.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IInitiative extends Document {
  title: string;
  slug: string;
  description: string;
  body: string;
  coverImageUrl: string;
  externalLink: string;
  tags: mongoose.Types.ObjectId[];
}

const InitiativeSchema = new Schema<IInitiative>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    body: { type: String },
    coverImageUrl: { type: String },
    externalLink: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  },
  { timestamps: true }
);

export default mongoose.models.Initiative ||
  mongoose.model<IInitiative>('Initiative', InitiativeSchema);
```

---

#### SiteSettings — `src/models/SiteSettings.ts`

New model added this session. Stores site-wide configurable values managed in `/cms/settings`.

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  heroImageUrl: string; // Desktop hero image
  heroImageMobileUrl: string; // Mobile hero image (stacked layout)
  heroHeadline: string;
  heroSubheadline: string;
  siteTagline: string;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    heroImageUrl: { type: String },
    heroImageMobileUrl: { type: String },
    heroHeadline: { type: String },
    heroSubheadline: { type: String },
    siteTagline: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
```

**API route:** `src/app/api/settings/route.ts` — GET returns first document (upserts on first save), PATCH updates it.

**CMS page:** `src/app/cms/settings/page.tsx` — form for hero images, headline, tagline. Uses `MediaPicker` for both `heroImageUrl` and `heroImageMobileUrl`.

---

**Section 5 Checklist:**

- [x] `src/lib/mongodb.ts` — `connectDB()` resolves without error
- [x] `src/models/Artist.ts`
- [x] `src/models/Album.ts`
- [x] `src/models/Song.ts`
- [x] `src/models/Post.ts`
- [x] `src/models/MediaAsset.ts`
- [x] `src/models/Event.ts`
- [x] `src/models/Booking.ts`
- [x] `src/models/Tag.ts`
- [x] `src/models/Initiative.ts`
- [x] `src/models/SiteSettings.ts`
- [x] All models import without TypeScript errors (`npx tsc --noEmit`)

---

## 6. API Layer ✅

### 6.1 Route Pattern

All API routes follow the same structure:

```
GET    /api/[resource]          → list all (with optional query params)
POST   /api/[resource]          → create new
GET    /api/[resource]/[id]     → get single
PATCH  /api/[resource]/[id]     → update
DELETE /api/[resource]/[id]     → delete
```

**Next.js 15 async params:** All `[id]` route handlers use `Promise<{ id: string }>` for params and must `await` before use:

```typescript
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // use id, not params.id
}
```

This pattern applies uniformly across **all** `[id]` route handlers: songs, albums, posts, events, initiatives, tags, artists, bookings, media.

---

### 6.2 Songs Route ✅

**File:** `src/app/api/songs/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Song from '@/models/Song';
import slugify from 'slugify';
import { SongSchema } from '@/lib/validators/songValidator';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const albumId = searchParams.get('albumId');
  const tag = searchParams.get('tag');

  const query: Record<string, string | boolean | mongoose.Types.ObjectId> = {
    isPublished: true,
  };
  if (albumId) query.albumId = albumId;
  if (tag) query.tags = tag;

  const songs = await Song.find(query)
    .populate('albumId', 'title slug')
    .populate('tags', 'name slug')
    .sort({ trackNumber: 1 })
    .lean();

  return NextResponse.json({ data: songs });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = SongSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const song = await Song.create({
    ...parsed.data,
    slug: slugify(parsed.data.title, { lower: true, strict: true }),
  });
  return NextResponse.json({ data: song }, { status: 201 });
}
```

**File:** `src/app/api/songs/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Song from '@/models/Song';
import slugify from 'slugify';
import { SongSchema } from '@/lib/validators/songValidator';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const song = await Song.findById(id)
    .populate('albumId', 'title slug')
    .populate('tags', 'name slug')
    .lean();
  if (!song) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: song });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const parsed = SongSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const update = parsed.data.title
    ? {
        ...parsed.data,
        slug: slugify(parsed.data.title, { lower: true, strict: true }),
      }
    : parsed.data;
  const song = await Song.findByIdAndUpdate(id, update, { new: true });
  if (!song) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: song });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await Song.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
```

---

### 6.3 Albums Route ✅

**File:** `src/app/api/albums/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';
import slugify from 'slugify';
import { AlbumSchema } from '@/lib/validators/albumValidator';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag');

  const query: Record<string, string> = {};
  if (tag) query.tags = tag;

  const albums = await Album.find(query)
    .populate('tags', 'name slug')
    .sort({ releaseYear: -1 })
    .lean();

  return NextResponse.json({ data: albums });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = AlbumSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const album = await Album.create({
    ...parsed.data,
    slug: slugify(parsed.data.title, { lower: true, strict: true }),
  });
  return NextResponse.json({ data: album }, { status: 201 });
}
```

**File:** `src/app/api/albums/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Album from '@/models/Album';
import slugify from 'slugify';
import { AlbumSchema } from '@/lib/validators/albumValidator';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const album = await Album.findById(id).populate('tags', 'name slug').lean();
  if (!album) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: album });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const parsed = AlbumSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const update = parsed.data.title
    ? {
        ...parsed.data,
        slug: slugify(parsed.data.title, { lower: true, strict: true }),
      }
    : parsed.data;
  const album = await Album.findByIdAndUpdate(id, update, { new: true });
  if (!album) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: album });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await Album.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
```

---

### 6.4 Posts Route ✅

**File:** `src/app/api/posts/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';
import slugify from 'slugify';
import { PostSchema } from '@/lib/validators/postValidator';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');

  const query: Record<string, string | boolean> = { isPublished: true };
  if (category) query.category = category;
  if (tag) query.tags = tag;

  const posts = await Post.find(query)
    .populate('tags', 'name slug')
    .sort({ publishedAt: -1 })
    .lean();

  return NextResponse.json({ data: posts });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const post = await Post.create({
    ...parsed.data,
    slug: slugify(parsed.data.title, { lower: true, strict: true }),
    publishedAt: parsed.data.isPublished ? new Date() : null,
  });
  return NextResponse.json({ data: post }, { status: 201 });
}
```

**File:** `src/app/api/posts/[id]/route.ts` — PATCH fix: params awaited before use. `coverImageUrl` is `.optional().or(z.literal(''))` in the validator so empty string passes validation.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';
import slugify from 'slugify';
import { PostSchema } from '@/lib/validators/postValidator';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const post = await Post.findById(id).populate('tags', 'name slug').lean();
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: post });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ← was params.id before fix
  await connectDB();
  const body = await req.json();
  const parsed = PostSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const update: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.title)
    update.slug = slugify(parsed.data.title, { lower: true, strict: true });
  if (parsed.data.isPublished) update.publishedAt = new Date();
  const post = await Post.findByIdAndUpdate(id, update, { new: true });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: post });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await Post.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
```

---

### 6.5 Events Route ✅

**File:** `src/app/api/events/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import slugify from 'slugify';
import { EventSchema } from '@/lib/validators/eventValidator';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const upcoming = searchParams.get('upcoming');

  const query: Record<string, boolean> = {};
  if (upcoming === 'true') query.isUpcoming = true;
  if (upcoming === 'false') query.isUpcoming = false;

  const events = await Event.find(query).sort({ date: 1 }).lean();
  return NextResponse.json({ data: events });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = EventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const event = await Event.create({
    ...parsed.data,
    slug: slugify(parsed.data.title, { lower: true, strict: true }),
  });
  return NextResponse.json({ data: event }, { status: 201 });
}
```

**File:** `src/app/api/events/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Event from '@/models/Event';
import slugify from 'slugify';
import { EventSchema } from '@/lib/validators/eventValidator';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const event = await Event.findById(id).lean();
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: event });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const parsed = EventSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const update = parsed.data.title
    ? {
        ...parsed.data,
        slug: slugify(parsed.data.title, { lower: true, strict: true }),
      }
    : parsed.data;
  const event = await Event.findByIdAndUpdate(id, update, { new: true });
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: event });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await Event.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
```

---

### 6.6 Initiatives Route ✅

**File:** `src/app/api/initiatives/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Initiative from '@/models/Initiative';
import slugify from 'slugify';
import { InitiativeSchema } from '@/lib/validators/initiativeValidator';

export async function GET() {
  await connectDB();
  const initiatives = await Initiative.find()
    .populate('tags', 'name slug')
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ data: initiatives });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = InitiativeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const initiative = await Initiative.create({
    ...parsed.data,
    slug: slugify(parsed.data.title, { lower: true, strict: true }),
  });
  return NextResponse.json({ data: initiative }, { status: 201 });
}
```

**File:** `src/app/api/initiatives/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Initiative from '@/models/Initiative';
import slugify from 'slugify';
import { InitiativeSchema } from '@/lib/validators/initiativeValidator';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const initiative = await Initiative.findById(id)
    .populate('tags', 'name slug')
    .lean();
  if (!initiative)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: initiative });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const parsed = InitiativeSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const update = parsed.data.title
    ? {
        ...parsed.data,
        slug: slugify(parsed.data.title, { lower: true, strict: true }),
      }
    : parsed.data;
  const initiative = await Initiative.findByIdAndUpdate(id, update, {
    new: true,
  });
  if (!initiative)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: initiative });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await Initiative.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
```

---

### 6.7 Tags Route ✅

Tags use `name` (not `title`) for slug generation: `slugify(parsed.data.name, ...)`. DELETE only on `[id]` — no PATCH (rename by delete + recreate).

**File:** `src/app/api/tags/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Tag from '@/models/Tag';
import slugify from 'slugify';
import { TagSchema } from '@/lib/validators/tagValidator';

export async function GET() {
  await connectDB();
  const tags = await Tag.find().sort({ name: 1 }).lean();
  return NextResponse.json({ data: tags });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = TagSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const tag = await Tag.create({
    ...parsed.data,
    slug: slugify(parsed.data.name, { lower: true, strict: true }),
  });
  return NextResponse.json({ data: tag }, { status: 201 });
}
```

**File:** `src/app/api/tags/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Tag from '@/models/Tag';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  await Tag.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
```

---

### 6.8 Artists Route ✅

Single document. GET returns `Artist.findOne()`. POST creates on first setup. PATCH via `[id]` route.

**File:** `src/app/api/artists/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Artist from '@/models/Artist';
import { ArtistSchema } from '@/lib/validators/artistValidator';

export async function GET() {
  await connectDB();
  const artist = await Artist.findOne().lean();
  return NextResponse.json({ data: artist });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = ArtistSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const artist = await Artist.create(parsed.data);
  return NextResponse.json({ data: artist }, { status: 201 });
}
```

**File:** `src/app/api/artists/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Artist from '@/models/Artist';
import { ArtistSchema } from '@/lib/validators/artistValidator';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const body = await req.json();
  const parsed = ArtistSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const artist = await Artist.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!artist)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: artist });
}
```

---

### 6.9 Bookings Route ✅

Public POST (no auth). CMS GET (all bookings with optional `?status=` filter). PATCH (`[id]`) updates status and triggers Resend email notification (see §6.11).

**File:** `src/app/api/bookings/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { BookingSchema } from '@/lib/validators/bookingValidator';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const query: Record<string, string> = {};
  if (status) query.status = status;

  const bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: bookings });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const booking = await Booking.create(parsed.data);
  return NextResponse.json({ data: booking }, { status: 201 });
}
```

**File:** `src/app/api/bookings/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { sendBookingStatusEmail } from '@/lib/resend';

const VALID_STATUSES = ['pending', 'reviewed', 'accepted', 'declined'] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const { status } = await req.json();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: { status: ['Invalid status value'] } },
      { status: 422 }
    );
  }
  const booking = await Booking.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  if (!booking)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Send email notification when status changes
  await sendBookingStatusEmail(booking);

  return NextResponse.json({ data: booking });
}
```

---

### 6.10 Media Route ✅

Handles `FormData` for upload. `DELETE /api/media/[id]` removes a single asset from Cloudinary then MongoDB. `DELETE /api/media` (collection-level) accepts `{ ids: string[] }` and bulk-removes from Cloudinary (`Promise.allSettled`) then MongoDB. Full code in §9.2.

---

### 6.11 Resend Email Integration ✅

**File:** `src/lib/resend.ts`

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingStatusEmail(booking: any) {
  const { name, email, status } = booking;

  const subjectMap: Record<string, string> = {
    reviewed: 'Your booking request has been reviewed',
    accepted: 'Your booking request has been accepted!',
    declined: 'Update on your booking request',
  };

  if (!subjectMap[status]) return; // Don't email on 'pending'

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: subjectMap[status],
    html: `<p>Hi ${name},</p><p>Your booking status has been updated to: <strong>${status}</strong>.</p>`,
  });
}
```

---

### 6.12 Bookings Seen Route ✅

Cookie-based tracking for the pending bookings badge in the CMS sidebar.

**File:** `src/app/api/cms/bookings-seen/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set('bookings_seen_at', new Date().toISOString(), {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
  });
  return NextResponse.json({ ok: true });
}
```

---

### 6.13 Settings Route ✅

**File:** `src/app/api/settings/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function GET() {
  await connectDB();
  const settings = await SiteSettings.findOne().lean();
  return NextResponse.json({ data: settings ?? {} });
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $set: body },
    { new: true, upsert: true }
  );
  return NextResponse.json({ data: settings });
}
```

---

### 6.14 Validators ✅

All validators live in `src/lib/validators/`. URL fields use `.optional().or(z.literal(''))` to allow empty strings without validation errors.

**`songValidator.ts`**

```typescript
import { z } from 'zod';
export const SongSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  albumId: z.string().min(1, 'Album is required'),
  trackNumber: z.number().optional(),
  description: z.string().optional(),
  lyrics: z.string().optional(),
  storyBehindSong: z.string().optional(),
  audioUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(true),
  price: z.number().min(0).default(0),   // kobo; 0 = free / included in album
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),
});
export type SongInput = z.infer<typeof SongSchema>;
```

**`postValidator.ts`**

```typescript
import { z } from 'zod';
export const PostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['blog', 'devotional', 'story']).default('blog'),
  body: z.string().min(1, 'Body is required'),
  excerpt: z.string().max(300).optional(),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),
});
export type PostInput = z.infer<typeof PostSchema>;
```

**`eventValidator.ts`**

```typescript
import { z } from 'zod';
export const EventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  externalLink: z.string().url().optional().or(z.literal('')),
  isUpcoming: z.boolean().default(true),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
});
export type EventInput = z.infer<typeof EventSchema>;
```

**`albumValidator.ts`**

```typescript
import { z } from 'zod';
export const AlbumSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  releaseYear: z.number({ required_error: 'Release year is required' }),
  coverImageUrl: z.string().url('Must be a valid URL'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isSingle: z.boolean().default(false),
  price: z.number().min(0).default(0),   // kobo; 0 = free
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),
});
export type AlbumInput = z.infer<typeof AlbumSchema>;
```

**`initiativeValidator.ts`**

```typescript
import { z } from 'zod';
export const InitiativeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  body: z.string().optional(),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  externalLink: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
});
export type InitiativeInput = z.infer<typeof InitiativeSchema>;
```

**`tagValidator.ts`**

```typescript
import { z } from 'zod';
export const TagSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});
export type TagInput = z.infer<typeof TagSchema>;
```

**`artistValidator.ts`**

```typescript
import { z } from 'zod';
export const ArtistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slugName: z.string().min(1, 'Slug is required'),
  biographyShort: z.string().max(160),
  biographyMedium: z.string().max(500),
  biographyLong: z.string(),
  achievements: z.array(z.string()).optional(),
  speakingProfile: z.string().optional(),
  profileImageUrl: z.string().url('Must be a valid URL'),
  socialLinks: z
    .object({
      instagram: z.string().url().optional().or(z.literal('')),
      youtube: z.string().url().optional().or(z.literal('')),
      spotify: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
    })
    .optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),
});
export type ArtistInput = z.infer<typeof ArtistSchema>;
```

**`bookingValidator.ts`**

```typescript
import { z } from 'zod';
export const BookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Must be a valid email'),
  organisation: z.string().optional(),
  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});
export type BookingInput = z.infer<typeof BookingSchema>;
```

---

### 6.15 Key Differences Summary

| Route       | Slug field | Slug source | Query filters                    | Special behaviour                          |
| ----------- | ---------- | ----------- | -------------------------------- | ------------------------------------------ |
| songs       | `slug`     | `title`     | `albumId`, `tag`, `isPublished`  | `trackNumber` sort                         |
| albums      | `slug`     | `title`     | `tag`                            | No `isPublished` filter                    |
| posts       | `slug`     | `title`     | `category`, `tag`, `isPublished` | `publishedAt` set on publish               |
| events      | `slug`     | `title`     | `isUpcoming`                     | `isUpcoming` derived from date             |
| initiatives | `slug`     | `title`     | —                                | No publish toggle                          |
| tags        | `slug`     | `name`      | —                                | DELETE only (no PATCH)                     |
| artists     | none       | —           | —                                | Single document, GET + POST + PATCH        |
| bookings    | none       | —           | `status`                         | POST public, PATCH triggers Resend email   |
| media       | none       | —           | —                                | `FormData` upload, Cloudinary DELETE first |
| settings    | none       | —           | —                                | Single document, upsert on PATCH           |

---

**Section 6 Checklist:**

**Validators** (`src/lib/validators/`)

- [x] `songValidator.ts`
- [x] `albumValidator.ts`
- [x] `postValidator.ts`
- [x] `eventValidator.ts`
- [x] `initiativeValidator.ts`
- [x] `tagValidator.ts`
- [x] `artistValidator.ts`
- [x] `bookingValidator.ts`

**Route files** (`src/app/api/`)

- [x] `songs/route.ts` — GET (filters: `albumId`, `tag`, `isPublished`), POST
- [x] `songs/[id]/route.ts` — GET, PATCH, DELETE
- [x] `albums/route.ts` — GET (filters: `tag`), POST
- [x] `albums/[id]/route.ts` — GET, PATCH, DELETE
- [x] `posts/route.ts` — GET (filters: `category`, `tag`, `isPublished`), POST
- [x] `posts/[id]/route.ts` — GET, PATCH, DELETE
- [x] `events/route.ts` — GET (filters: `upcoming`), POST
- [x] `events/[id]/route.ts` — GET, PATCH, DELETE
- [x] `initiatives/route.ts` — GET, POST
- [x] `initiatives/[id]/route.ts` — GET, PATCH, DELETE
- [x] `tags/route.ts` — GET, POST
- [x] `tags/[id]/route.ts` — DELETE only
- [x] `artists/route.ts` — GET (single record), POST
- [x] `artists/[id]/route.ts` — PATCH only
- [x] `bookings/route.ts` — GET (filters: `status`), POST
- [x] `bookings/[id]/route.ts` — PATCH (status update + Resend email)
- [x] `media/route.ts` — GET, POST (FormData + Cloudinary upload)
- [x] `media/[id]/route.ts` — DELETE (removes from Cloudinary + MongoDB)
- [x] `settings/route.ts` — GET, PATCH (upsert)
- [x] `cms/bookings-seen/route.ts` — POST (sets seen cookie)

**Verification**

- [x] `npx tsc --noEmit` — zero TypeScript errors across all route files
- [x] All routes tested via REST client — correct status codes and response shapes

---

## 7. UI & Component Layer ✅

### 7.1 Root Layout

**File:** `src/app/layout.tsx`

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'Glowreeyah', template: '%s | Glowreeyah' },
  description: 'Music. Ministry. Movement.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-brand-warm text-brand-deep`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

---

### 7.2 Navbar

**File:** `src/components/layout/Navbar.tsx`

```typescript
'use client'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/',        label: 'Home' },
  { href: '/about',   label: 'About' },
  { href: '/music',   label: 'Music' },
  { href: '/blog',    label: 'Blog' },
  { href: '/media',   label: 'Media' },
  { href: '/events',  label: 'Events' },
  { href: '/impact',  label: 'Impact' },
  { href: '/booking', label: 'Book' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-brand-deep text-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-brand-teal font-serif text-xl font-bold">
        Glowreeyah
      </Link>
      <ul className="hidden md:flex gap-6 text-sm">
        {links.map(l => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-brand-teal transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <button
        className="md:hidden"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      {open && (
        <ul className="absolute top-full left-0 w-full bg-brand-deep flex flex-col gap-4 px-6 py-4 md:hidden">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)} className="hover:text-brand-gold">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
```

---

### 7.3 Rendering Strategy

| Page Type                  | Strategy                                    | Reason                         |
| -------------------------- | ------------------------------------------- | ------------------------------ |
| Home, About, Music List    | Server Component + `revalidate`             | SEO + performance              |
| Song / Post / Album detail | Server Component + ISR (`revalidate: 3600`) | Fresh content, cacheable       |
| Search / Filter            | Client Component                            | Real-time interaction          |
| CMS dashboard + forms      | Client Component                            | Full interactivity, form state |
| Booking form               | Client Component                            | Form state management          |

---

### 7.4 CMS Components

**CMSShell** (`src/components/cms/CMSShell.tsx`) — outer shell that manages mobile drawer open/close state. Renders `CMSSidebar` (as a slide-in drawer on mobile, persistent on desktop) and `CMSTopbar`.

**CMSSidebar** (`src/components/cms/CMSSidebar.tsx`) — navigation links. Collapsible on mobile via CMSShell state. Highlights active route.

```
Nav items: Dashboard, Posts, Songs, Albums, Events, Initiatives, Media, Bookings, Tags, Artist Profile, Settings
```

**CMSTopbar** (`src/components/cms/CMSTopbar.tsx`) — hamburger menu button (mobile), pending bookings badge, "View site" link, user email, logout button.

The **pending bookings badge** shows the count of bookings created after the `bookings_seen_at` cookie timestamp. It is computed server-side in the CMS layout and passed as a prop.

**MarkBookingsSeen** (`src/components/cms/MarkBookingsSeen.tsx`) — client component that calls `POST /api/cms/bookings-seen` on mount when the user lands on `/cms/bookings`. Clears the badge count.

**CMSRowActions** (`src/components/cms/CMSRowActions.tsx`) — Edit link for list rows. No router dependency (removed unused `router`).

**EventForm** (`src/components/cms/EventForm.tsx`) — `deriveIsUpcoming()` is defined at module scope (outside the component). Called when the date field changes to auto-set `isUpcoming`. `PublishToggle` is not present in EventForm.

---

### 7.5 Music Components

**AlbumPlayer** (`src/components/music/AlbumPlayer.tsx`) — replaces `SongCard` on album detail pages. Features:

- Inline play/pause per track
- Floating player bar (fixed bottom) that appears when a track is playing
- Previous / Next track navigation
- Volume control
- Auto-advance to next track on completion

**AlbumCard** (`src/components/music/AlbumCard.tsx`) — card used on the Music index page. Links to `/music/[albumSlug]`.

**SongCard** (`src/components/music/SongCard.tsx`) — retained for use in contexts outside AlbumPlayer (e.g. tag pages).

---

### 7.6 Content Components

**PostCard** (`src/components/content/PostCard.tsx`) — card with cover image, title, excerpt, category, date. Cover image uses explicit `width` and `height` props with `object-cover` (not `fill`).

**RichText** (`src/components/content/RichText.tsx`) — renders markdown body via `react-markdown`.

---

**Section 7 Checklist:**

- [x] `src/app/layout.tsx` — root layout with Navbar and Footer, `next/font` Inter, no layout shift
- [x] `src/components/layout/Navbar.tsx` — responsive, mobile menu, links updated to `/events`
- [x] `src/components/layout/Footer.tsx` — created
- [x] `src/components/layout/PageWrapper.tsx` — created
- [x] `src/components/ui/Button.tsx` — created
- [x] `src/components/ui/Input.tsx` — created
- [x] `src/components/ui/Tag.tsx` — created
- [x] `src/components/ui/LoadingSpinner.tsx` — created
- [x] `src/components/music/AlbumCard.tsx` — created
- [x] `src/components/music/SongCard.tsx` — created
- [x] `src/components/music/AlbumPlayer.tsx` — inline play, floating bar, prev/next, volume, auto-advance
- [x] `src/components/content/PostCard.tsx` — explicit width/height, object-cover (not fill)
- [x] `src/components/content/RichText.tsx` — react-markdown renderer
- [x] `src/components/media/MediaCard.tsx` — created
- [x] `npm run dev` renders root layout with Navbar and Footer, no console errors

---

## 8. Page Implementation ✅

### 8.1 Public Routes

| Route                | Page file                             | Notes                                     |
| -------------------- | ------------------------------------- | ----------------------------------------- |
| `/`                  | `(public)/page.tsx`                   | Dual hero, events section, impact cards   |
| `/about`             | `(public)/about/page.tsx`             | `object-top`, fixed height hero container |
| `/music`             | `(public)/music/page.tsx`             | Album cards grid                          |
| `/music/[albumSlug]` | `(public)/music/[albumSlug]/page.tsx` | AlbumPlayer — inline + floating bar       |
| `/blog`              | `(public)/blog/page.tsx`              | Post cards, category filter               |
| `/blog/[slug]`       | `(public)/blog/[slug]/page.tsx`       | Hero image + referer-based back link      |
| `/events`            | `(public)/events/page.tsx`            | Cards grid (renamed from `/speaking`)     |
| `/booking`           | `(public)/booking/page.tsx`           | Contact + booking form                    |
| `/impact`            | `(public)/impact/page.tsx`            | Initiative image cards linking to detail  |
| `/impact/[slug]`     | `(public)/impact/[slug]/page.tsx`     | Initiative detail                         |
| `/media`             | `(public)/media/page.tsx`             | Gallery grid                              |
| `/tag/[slug]`        | `(public)/tag/[slug]/page.tsx`        | Tagged content list                       |

---

### 8.2 Homepage Hero — Dual Layout ✅

The homepage hero renders two separate layouts controlled by Tailwind breakpoints:

```tsx
{/* Mobile — stacked image above text */}
<section className="md:hidden">
  <Image src={settings.heroImageMobileUrl} ... />
  <div className="p-6">
    <h1>{settings.heroHeadline}</h1>
    ...
  </div>
</section>

{/* Desktop — text overlaid on full-width image */}
<section className="hidden md:flex relative">
  <Image src={settings.heroImageUrl} fill ... />
  <div className="absolute inset-0 flex flex-col justify-center px-16">
    <h1>{settings.heroHeadline}</h1>
    ...
  </div>
</section>
```

Both `heroImageUrl` (desktop) and `heroImageMobileUrl` (mobile) are stored in `SiteSettings` and managed via `/cms/settings`.

---

### 8.3 Blog Post Detail — Referer Back Link ✅

The blog post detail page reads the `Referer` header on the server and renders a back link that goes to the referring page if it is within the same origin, otherwise defaults to `/blog`.

```typescript
// In generateMetadata or the page component:
const headersList = await headers();
const referer = headersList.get('referer') ?? '';
const backHref = referer.includes(process.env.NEXT_PUBLIC_SITE_URL!)
  ? referer
  : '/blog';
```

---

### 8.4 generateMetadata ✅

Every dynamic public route implements `generateMetadata()`:

```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  // fetch content...
  return {
    title: content.seo?.metaTitle || content.title,
    description: content.seo?.metaDescription || content.excerpt,
    openGraph: {
      title: content.seo?.metaTitle || content.title,
      description: content.seo?.metaDescription || content.excerpt,
      images: [{ url: content.coverImageUrl }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.seo?.metaTitle || content.title,
      description: content.seo?.metaDescription || content.excerpt,
      images: [content.coverImageUrl],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}`,
    },
  };
}
```

---

### 8.5 Initiative Image Cards ✅

Initiative cards on `/impact` use explicit `width` / `height` with `object-cover` (not `fill`). Each card links to `/impact/[slug]`.

```tsx
<Image
  src={initiative.coverImageUrl}
  alt={initiative.title}
  width={600}
  height={400}
  className="w-full h-48 object-cover"
/>
```

---

### 8.6 Events Homepage Section ✅

The homepage events section shows cards for upcoming events (not a single featured event). Fetches events where `isUpcoming: true`, sorted by date ascending.

---

### 8.7 Home Page Server Component Pattern

**File:** `src/app/(public)/page.tsx`

```typescript
import { connectDB } from '@/lib/mongodb'
import Song from '@/models/Song'
import Post from '@/models/Post'
import Event from '@/models/Event'
import Initiative from '@/models/Initiative'
import SiteSettings from '@/models/SiteSettings'
import Image from 'next/image'

export const revalidate = 3600

export default async function HomePage() {
  await connectDB()

  const [latestSongs, latestPosts, upcomingEvents, initiatives, settings] = await Promise.all([
    Song.find({ isPublished: true }).sort({ createdAt: -1 }).limit(3).lean(),
    Post.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(3).lean(),
    Event.find({ isUpcoming: true }).sort({ date: 1 }).limit(3).lean(),
    Initiative.find().sort({ createdAt: -1 }).limit(4).lean(),
    SiteSettings.findOne().lean(),
  ])

  return (
    <div>
      {/* Mobile hero — stacked */}
      <section className="md:hidden">
        {settings?.heroImageMobileUrl && (
          <Image src={settings.heroImageMobileUrl} alt="Hero" width={800} height={600} className="w-full object-cover" />
        )}
        <div className="p-6 bg-brand-deep text-white text-center">
          <h1 className="font-serif text-4xl text-brand-teal mb-2">{settings?.heroHeadline ?? 'Glowreeyah'}</h1>
          <p className="text-brand-warm">{settings?.heroSubheadline ?? 'Music. Ministry. Movement.'}</p>
        </div>
      </section>

      {/* Desktop hero — overlay */}
      <section className="hidden md:flex relative min-h-[90vh] items-center">
        {settings?.heroImageUrl && (
          <Image src={settings.heroImageUrl} alt="Hero" fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 px-16 text-white">
          <h1 className="font-serif text-7xl text-brand-teal mb-4">{settings?.heroHeadline ?? 'Glowreeyah'}</h1>
          <p className="text-2xl text-brand-warm">{settings?.heroSubheadline ?? 'Music. Ministry. Movement.'}</p>
        </div>
      </section>

      {/* Events section, impact section, latest songs, latest posts... */}
    </div>
  )
}
```

---

### 8.8 Dynamic Route Pattern

All dynamic slug-based pages follow this server component pattern.

**Example — Album detail:** `src/app/(public)/music/[albumSlug]/page.tsx`

```typescript
import { connectDB } from '@/lib/mongodb'
import Album from '@/models/Album'
import Song from '@/models/Song'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import AlbumPlayer from '@/components/music/AlbumPlayer'

interface Props {
  params: Promise<{ albumSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { albumSlug } = await params
  await connectDB()
  const album = await Album.findOne({ slug: albumSlug }).lean()
  if (!album) return {}
  return {
    title: album.seo?.metaTitle || album.title,
    description: album.seo?.metaDescription || album.description,
    openGraph: { images: [{ url: album.coverImageUrl }] },
  }
}

export default async function AlbumPage({ params }: Props) {
  const { albumSlug } = await params
  await connectDB()
  const album = await Album.findOne({ slug: albumSlug }).lean()
  if (!album) notFound()

  const songs = await Song.find({ albumId: album._id, isPublished: true })
    .sort({ trackNumber: 1 })
    .lean()

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl text-brand-deep mb-2">{album.title}</h1>
      <p className="text-gray-500 mb-8">{album.releaseYear}</p>
      <AlbumPlayer songs={songs} album={album} />
    </main>
  )
}
```

---

**Section 8 Checklist:**

- [x] `src/app/(public)/page.tsx` — dual hero renders correctly; events, initiatives, songs, posts sections present
- [x] `src/app/(public)/about/page.tsx` — loads with fallback UI when no artist document; `object-top`, fixed height hero
- [x] `src/app/(public)/music/page.tsx` — album cards grid, empty state handled
- [x] `src/app/(public)/music/[albumSlug]/page.tsx` — AlbumPlayer renders, floating bar works
- [x] `src/app/(public)/blog/page.tsx` — post cards, category filter, empty state handled
- [x] `src/app/(public)/blog/[slug]/page.tsx` — full post renders, referer-aware back link
- [x] `src/app/(public)/events/page.tsx` — event cards grid (renamed from `/speaking`)
- [x] `src/app/(public)/booking/page.tsx` — form renders and submits without errors
- [x] `src/app/(public)/impact/page.tsx` — initiative image cards render, link to detail
- [x] `src/app/(public)/impact/[slug]/page.tsx` — initiative detail renders, 404s on unknown slug
- [x] `src/app/(public)/media/page.tsx` — gallery renders, empty state handled
- [x] `src/app/(public)/tag/[slug]/page.tsx` — 404s correctly on unknown slug
- [x] `/speaking` → `/events` redirect verified (301)
- [x] `generateMetadata()` implemented on all dynamic routes
- [x] `notFound()` used on all slug-based routes
- [ ] All pages re-verified with live data after DB is seeded

---

## 9. Media Integration ✅

### 9.1 Cloudinary Configuration

**File:** `src/lib/cloudinary.ts`

```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

---

### 9.2 Upload API Route

**File:** `src/app/api/media/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';
import MediaAsset from '@/models/MediaAsset';

export async function GET() {
  await connectDB();
  const assets = await MediaAsset.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: assets });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const altText = formData.get('altText') as string;
  const type = formData.get('type') as string;

  if (!altText) {
    return NextResponse.json(
      { error: { altText: ['Alt text is required'] } },
      { status: 422 }
    );
  }
  if (!file) {
    return NextResponse.json(
      { error: { file: ['File is required'] } },
      { status: 422 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadResult = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'glowreeyah', resource_type: 'auto' },
      (err, result) => {
        if (err || !result) return reject(err);
        resolve(result);
      }
    );
    stream.end(buffer);
  });

  const asset = await MediaAsset.create({
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    altText,
    type,
  });

  return NextResponse.json({ data: asset }, { status: 201 });
}
```

**Bulk delete** is also handled on the collection route via `DELETE /api/media` with a JSON body `{ ids: string[] }`. This allows the frontend to delete multiple assets in one request.

**File:** `src/app/api/media/route.ts` — add `DELETE` handler below the existing `POST`:

```typescript
// Bulk delete — body: { ids: string[] }
export async function DELETE(req: NextRequest) {
  await connectDB();

  let ids: string[];
  try {
    const body = await req.json();
    ids = body.ids;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { error: 'ids must be a non-empty array' },
      { status: 422 }
    );
  }

  const assets = await MediaAsset.find({ _id: { $in: ids } });

  if (assets.length === 0) {
    return NextResponse.json(
      { error: 'No matching assets found' },
      { status: 404 }
    );
  }

  // Delete from Cloudinary in parallel — tolerate individual Cloudinary failures
  await Promise.allSettled(
    assets.map((a) => cloudinary.uploader.destroy(a.publicId))
  );

  // Remove all from MongoDB
  await MediaAsset.deleteMany({ _id: { $in: ids } });

  return NextResponse.json({ ok: true, deleted: assets.length });
}
```

**File:** `src/app/api/media/[id]/route.ts` — single delete (unchanged):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';
import MediaAsset from '@/models/MediaAsset';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();

  const asset = await MediaAsset.findById(id);
  if (!asset) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await cloudinary.uploader.destroy(asset.publicId);
  await asset.deleteOne();

  return NextResponse.json({ ok: true });
}
```

> Single delete (`DELETE /api/media/[id]`) is used by the per-card delete button. Bulk delete (`DELETE /api/media` with `{ ids }` body) is used by the "Delete N selected" toolbar button. Both remove from Cloudinary first, then MongoDB. Cloudinary failures are tolerated with `Promise.allSettled` in the bulk path so a missing Cloudinary asset does not block the MongoDB cleanup.

---

### 9.3 Storage Rules

| Data        | Location                       |
| ----------- | ------------------------------ |
| Image files | Cloudinary                     |
| Audio files | Cloudinary                     |
| Video files | Cloudinary or YouTube embed    |
| File URLs   | MongoDB (`MediaAsset.url`)     |
| Alt text    | MongoDB (`MediaAsset.altText`) |
| Binary data | **Never stored in MongoDB**    |

---

**Section 9 Checklist:**

- [x] `src/lib/cloudinary.ts` created
- [x] `src/app/api/media/route.ts` — GET, POST, DELETE (bulk)
- [x] `src/app/api/media/[id]/route.ts` — DELETE (single, Cloudinary first then MongoDB)
- [x] `next.config.ts` — Cloudinary `remotePatterns` + `qualities: [75, 80]`
- [x] `next/image` used throughout — no raw `<img>` in public pages
- [x] Initiative cards use explicit `width`/`height`, not `fill`
- [ ] Cloudinary env vars confirmed in `.env.local`
- [ ] Test single upload + delete end-to-end in dev
- [ ] Test bulk delete — confirm Cloudinary assets removed and MongoDB docs deleted
- [ ] Verify `MediaAsset` doc created in MongoDB Atlas after upload

---

## 10. CMS — Content Management System ✅

### 10.1 CMS Architecture

```
/cms/* routes  →  cms/ directory  →  CMS layout (CMSShell)
                                       ↓
                            CMSSidebar (collapsible mobile drawer)
                            CMSTopbar  (badge + logout)
                                       ↓
                              Client Component forms
                                       ↓
                          /api/* route handlers (shared)
                                       ↓
                          MongoDB Atlas + Cloudinary (shared)
```

The CMS is implemented as a real `src/app/cms/` directory (not a `(cms)` route group) to avoid route conflicts in Next.js 15. It shares all backend resources with the public frontend.

---

### 10.2 Authentication ✅

**NextAuth.js** Credentials provider. Credentials validated against `CMS_ADMIN_EMAIL` and `CMS_ADMIN_PASSWORD` env vars. JWT session strategy.

**File:** `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          credentials?.email === process.env.CMS_ADMIN_EMAIL &&
          credentials?.password === process.env.CMS_ADMIN_PASSWORD
        ) {
          return { id: '1', name: 'Admin', email: credentials.email };
        }
        return null;
      },
    }),
  ],
  pages: { signIn: '/cms/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
```

---

### 10.3 CMS Middleware ✅

**File:** `src/middleware.ts`

```typescript
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/cms/login' },
});

export const config = {
  matcher: ['/cms/((?!login).*)'],
};
```

Redirects all unauthenticated `/cms/*` requests (except login) to `/cms/login`.

---

### 10.4 CMS Layout ✅

**File:** `src/app/cms/layout.tsx`

```typescript
import CMSShell from '@/components/cms/CMSShell';
import { connectDB } from '@/lib/mongodb';
import Booking from '@/models/Booking';
import { cookies } from 'next/headers';

export default async function CMSLayout({ children }: { children: React.ReactNode }) {
  // Compute pending badge count server-side
  await connectDB();
  const cookieStore = await cookies();
  const seenAt = cookieStore.get('bookings_seen_at')?.value;
  const query = seenAt
    ? { status: 'pending', createdAt: { $gt: new Date(seenAt) } }
    : { status: 'pending' };
  const pendingCount = await Booking.countDocuments(query);

  return <CMSShell pendingCount={pendingCount}>{children}</CMSShell>;
}
```

---

### 10.5 CMSShell & Mobile Responsive Sidebar ✅

**File:** `src/components/cms/CMSShell.tsx`

Client component that holds the `sidebarOpen` state for mobile. Renders the hamburger trigger in `CMSTopbar` and the slide-in `CMSSidebar` drawer on mobile.

```typescript
'use client';
import { useState } from 'react';
import CMSSidebar from './CMSSidebar';
import CMSTopbar from './CMSTopbar';

interface Props {
  children: React.ReactNode;
  pendingCount: number;
}

export default function CMSShell({ children, pendingCount }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile, persistent on desktop */}
      <div
        className={`fixed md:relative z-30 h-full transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <CMSSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <CMSTopbar
          pendingCount={pendingCount}
          onMenuClick={() => setSidebarOpen(o => !o)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
```

---

### 10.6 Pending Bookings Badge ✅

The badge in `CMSTopbar` shows new pending bookings since the last time the admin viewed `/cms/bookings`. Flow:

1. CMS layout computes `pendingCount` server-side using the `bookings_seen_at` cookie
2. `CMSTopbar` receives `pendingCount` and renders a red badge if > 0
3. When the admin navigates to `/cms/bookings`, `MarkBookingsSeen` (client component) fires `POST /api/cms/bookings-seen` on mount
4. Cookie is updated; next page load shows badge = 0

---

### 10.7 EventForm — Past Event Lock ✅

Past events are **viewable but not editable**. All fields render as `readOnly`, the Save button is disabled and visually muted, and an amber notice banner explains why. Delete remains available.

Two module-level helpers drive this:

```typescript
// At module level — NOT inside the component

function deriveIsUpcoming(dateStr: string): boolean {
  if (!dateStr) return true
  return new Date(dateStr) >= new Date()
}

function isPastEvent(event?: EventData): boolean {
  if (!event?._id) return false          // new events always editable
  if (event.isUpcoming === false) return true
  if (event.date) return new Date(event.date) < new Date()
  return false
}
```

Key implementation details:

- `isPast` is derived once at component initialisation from `isPastEvent(event)` — not state, not recalculated on render
- A shared `inputCls` string switches between the normal focus ring and a greyed-out style (`bg-gray-50 text-gray-400 cursor-not-allowed`) based on `isPast`
- Every `onChange` handler is guarded with `!isPast &&` so keyboard entry is silently ignored even if `readOnly` is bypassed
- `SlugField` and `MediaPicker` (both interactive components) are replaced with plain readonly `<input>` elements when `isPast` is true
- The Save button gets `disabled={isPast || saving}` plus `cursor-not-allowed` styling and a `title` tooltip
- `handleSubmit` has a `if (isPast) return` early exit as a second line of defence
- `PublishToggle` is **not** present in `EventForm`

**File:** `src/components/cms/EventForm.tsx` — full implementation delivered as a separate file.

---

### 10.8 CMS Events Page — Mobile Card Layout ✅

The CMS events list page at `src/app/cms/events/page.tsx` uses **cards on all screen sizes** rather than a table, because the event date/location combination did not fit legibly in a table on mobile.

---

### 10.9 CMS Initiatives — Truncation Fix ✅

The CMS initiatives list applies `line-clamp-1` on long titles and `table-fixed` on the table to prevent overflow:

```tsx
<table className="w-full text-sm table-fixed">
  ...
  <td className="px-4 py-3 font-medium text-brand-deep truncate line-clamp-1 max-w-xs">
    {initiative.title}
  </td>
```

---

### 10.10 Content Form Pattern

Create and Edit pages share the same Client Component form. The page passes either empty defaults (new) or fetched data (edit). Example pattern:

```
src/app/cms/posts/new/page.tsx  → renders <PostForm />  (no post prop)
src/app/cms/posts/[id]/page.tsx → fetches post, renders <PostForm post={post} />
```

**Example — PostForm:** `src/components/cms/PostForm.tsx`

```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SlugField      from './SlugField'
import PublishToggle  from './PublishToggle'
import TagSelector    from './TagSelector'
import RichTextEditor from './RichTextEditor'
import MediaPicker    from './MediaPicker'

interface Props {
  post?: any
  tags:  any[]
}

export default function PostForm({ post, tags }: Props) {
  const router = useRouter()
  const isEdit = !!post?._id

  const [form, setForm] = useState({
    title:         post?.title         ?? '',
    slug:          post?.slug          ?? '',
    category:      post?.category      ?? 'blog',
    excerpt:       post?.excerpt       ?? '',
    body:          post?.body          ?? '',
    coverImageUrl: post?.coverImageUrl ?? '',
    tags:          post?.tags?.map((t: any) => t._id ?? t) ?? [],
    isPublished:   post?.isPublished   ?? false,
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  async function handleSubmit() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(
        isEdit ? `/api/posts/${post._id}` : '/api/posts',
        {
          method:  isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(form),
        }
      )
      if (!res.ok) throw new Error('Save failed')
      router.push('/cms/posts')
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this post? This cannot be undone.')) return
    await fetch(`/api/posts/${post._id}`, { method: 'DELETE' })
    router.push('/cms/posts')
    router.refresh()
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        />
      </div>

      <SlugField
        sourceValue={form.title}
        value={form.slug}
        onChange={slug => setForm(f => ({ ...f, slug }))}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="blog">Blog</option>
          <option value="devotional">Devotional</option>
          <option value="story">Story</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
        <textarea
          rows={2}
          value={form.excerpt}
          onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        />
      </div>

      <RichTextEditor
        value={form.body}
        onChange={body => setForm(f => ({ ...f, body }))}
      />

      <MediaPicker
        value={form.coverImageUrl}
        onChange={url => setForm(f => ({ ...f, coverImageUrl: url }))}
      />

      <TagSelector
        allTags={tags}
        selected={form.tags}
        onChange={tags => setForm(f => ({ ...f, tags }))}
      />

      <PublishToggle
        value={form.isPublished}
        onChange={val => setForm(f => ({ ...f, isPublished: val }))}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-brand-teal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 disabled:opacity-50"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Post'}
        </button>
        {isEdit && (
          <button
            onClick={handleDelete}
            className="text-red-500 text-sm hover:underline"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
```

Apply the same form pattern for: `SongForm`, `AlbumForm`, `EventForm`, `InitiativeForm`.

---

### 10.11 Shared CMS Components

#### SlugField — `src/components/cms/SlugField.tsx`

Auto-generates a URL-safe slug from the title. User can override manually.

```typescript
'use client'
import { useEffect } from 'react'
import slugify from 'slugify'

interface Props {
  sourceValue: string
  value:       string
  onChange:    (slug: string) => void
}

export default function SlugField({ sourceValue, value, onChange }: Props) {
  useEffect(() => {
    if (!value) {
      onChange(slugify(sourceValue, { lower: true, strict: true }))
    }
  }, [sourceValue])

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
      <input
        value={value}
        onChange={e => onChange(slugify(e.target.value, { lower: true, strict: true }))}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-brand-teal outline-none"
      />
      <p className="text-xs text-gray-400 mt-1">URL: /{value}</p>
    </div>
  )
}
```

#### PublishToggle — `src/components/cms/PublishToggle.tsx`

```typescript
'use client'
interface Props { value: boolean; onChange: (v: boolean) => void }

export default function PublishToggle({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${value ? 'bg-brand-teal' : 'bg-gray-300'}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${value ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
      <span className="text-sm text-gray-700">{value ? 'Published' : 'Draft'}</span>
    </div>
  )
}
```

#### StatusBadge — `src/components/cms/StatusBadge.tsx`

```typescript
interface Props { published: boolean }

export default function StatusBadge({ published }: Props) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
      ${published
        ? 'bg-green-100 text-green-700'
        : 'bg-yellow-100 text-yellow-700'
      }`}
    >
      {published ? 'Published' : 'Draft'}
    </span>
  )
}
```

#### CMSPageHeader — `src/components/cms/CMSPageHeader.tsx`

```typescript
import Link from 'next/link'

interface Props {
  title:       string
  createHref:  string
  createLabel: string
}

export default function CMSPageHeader({ title, createHref, createLabel }: Props) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-serif font-bold text-brand-deep">{title}</h1>
      <Link
        href={createHref}
        className="bg-brand-teal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-teal/90 transition-colors"
      >
        + {createLabel}
      </Link>
    </div>
  )
}
```

---

### 10.12 Rich Text Editor

**File:** `src/components/cms/RichTextEditor.tsx`

```typescript
'use client'
import dynamic from 'next/dynamic'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Props { value: string; onChange: (v: string) => void }

export default function RichTextEditor({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
      <MDEditor
        value={value}
        onChange={v => onChange(v ?? '')}
        height={400}
      />
    </div>
  )
}
```

On the public frontend, `ReactMarkdown` renders the stored markdown string:

```tsx
import ReactMarkdown from 'react-markdown';

<article className="prose prose-gray max-w-none">
  <ReactMarkdown>{post.body}</ReactMarkdown>
</article>;
```

If initiative body content is also markdown, apply the same pattern in the initiative detail page.

---

### 10.13 Media Upload & Browser

Supports single delete (per-card button), bulk delete (checkbox + toolbar button), select-all, and Copy URL. Selection state is local — cleared on every reload.

**File:** `src/app/cms/media/page.tsx`

```typescript
'use client'
import { useState, useEffect, useCallback } from 'react'
import MediaUploader from '@/components/cms/MediaUploader'

interface Asset {
  _id: string
  url: string
  altText: string
  type: string
}

export default function CMSMediaPage() {
  const [assets, setAssets]     = useState<Asset[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading]   = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const res  = await fetch('/api/media')
    const data = await res.json()
    setAssets(data.data ?? [])
    setSelected(new Set())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  // ── selection helpers ──────────────────────────────────────
  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected(
      selected.size === assets.length
        ? new Set()
        : new Set(assets.map(a => a._id))
    )
  }

  // ── single delete ──────────────────────────────────────────
  async function deleteSingle(id: string) {
    if (!confirm('Delete this file? This cannot be undone.')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setAssets(prev => prev.filter(a => a._id !== id))
      setSelected(prev => { const n = new Set(prev); n.delete(id); return n })
    } catch {
      alert('Delete failed — please try again.')
    } finally {
      setDeleting(false)
    }
  }

  // ── bulk delete ────────────────────────────────────────────
  async function deleteSelected() {
    if (selected.size === 0) return
    if (!confirm(`Delete ${selected.size} file${selected.size > 1 ? 's' : ''}? This cannot be undone.`)) return
    setDeleting(true)
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selected) }),
      })
      if (!res.ok) throw new Error()
      const gone = new Set(selected)
      setAssets(prev => prev.filter(a => !gone.has(a._id)))
      setSelected(new Set())
    } catch {
      alert('Delete failed — please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const allSelected  = assets.length > 0 && selected.size === assets.length
  const someSelected = selected.size > 0

  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-brand-deep">Media Library</h1>
        {someSelected && (
          <button
            onClick={deleteSelected}
            disabled={deleting}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50
                       text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {deleting ? 'Deleting…' : `Delete ${selected.size} selected`}
          </button>
        )}
      </div>

      {/* ── Uploader ── */}
      <MediaUploader onUploaded={load} />

      {/* ── Select-all toolbar ── */}
      {assets.length > 0 && (
        <div className="flex items-center gap-3 mt-8 mb-3">
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-600">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="w-4 h-4 rounded accent-brand-teal cursor-pointer"
            />
            {allSelected ? 'Deselect all' : 'Select all'}
          </label>
          {someSelected && (
            <span className="text-sm text-gray-400">
              {selected.size} of {assets.length} selected
            </span>
          )}
        </div>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <p className="text-sm text-gray-400 mt-6">Loading…</p>
      ) : assets.length === 0 ? (
        <p className="text-sm text-gray-400 mt-6">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map(asset => {
            const isSelected = selected.has(asset._id)
            return (
              <div
                key={asset._id}
                onClick={() => toggleOne(asset._id)}
                className={`group relative aspect-square rounded-lg overflow-hidden bg-gray-100
                            ring-2 cursor-pointer transition-all
                            ${isSelected ? 'ring-brand-teal' : 'ring-transparent'}`}
              >
                {/* Thumbnail */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset.url} alt={asset.altText} className="object-cover w-full h-full" />

                {/* Checkbox — top-left; always visible when selected, hover otherwise */}
                <div
                  className={`absolute top-2 left-2 transition-opacity
                              ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  onClick={e => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleOne(asset._id)}
                    className="w-4 h-4 rounded accent-brand-teal cursor-pointer"
                  />
                </div>

                {/* Hover overlay — Copy URL + Delete */}
                <div
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                              transition-opacity flex flex-col items-center justify-center gap-2"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => navigator.clipboard.writeText(asset.url)}
                    className="text-white text-xs bg-brand-teal hover:bg-brand-teal/80
                               px-2 py-1 rounded w-20 transition-colors"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => deleteSingle(asset._id)}
                    disabled={deleting}
                    className="text-white text-xs bg-red-500 hover:bg-red-600
                               disabled:opacity-50 px-2 py-1 rounded w-20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

---

### 10.14 Bookings Manager

**File:** `src/app/cms/bookings/page.tsx`

```typescript
import { connectDB } from '@/lib/mongodb'
import Booking from '@/models/Booking'
import MarkBookingsSeen from '@/components/cms/MarkBookingsSeen'

const statusColours: Record<string, string> = {
  pending:  'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
}

export default async function CMSBookingsPage() {
  await connectDB()
  const bookings = await Booking.find().sort({ createdAt: -1 }).lean()

  return (
    <div>
      <MarkBookingsSeen />
      <h1 className="text-2xl font-serif font-bold text-brand-deep mb-6">Booking Requests</h1>
      <div className="space-y-4">
        {bookings.map((b: any) => (
          <div key={b._id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-brand-deep">{b.name}</p>
                <p className="text-sm text-gray-500">{b.email} · {b.organisation}</p>
                <p className="text-sm text-gray-500 mt-1">Event: {b.eventType} · {b.eventDate}</p>
                <p className="text-sm text-gray-700 mt-2">{b.message}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColours[b.status]}`}>
                {b.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

### 10.15 CMS Dashboard

**File:** `src/app/cms/dashboard/page.tsx`

```typescript
import { connectDB } from '@/lib/mongodb'
import Song        from '@/models/Song'
import Post        from '@/models/Post'
import Album       from '@/models/Album'
import Booking     from '@/models/Booking'
import Event       from '@/models/Event'

export default async function CMSDashboard() {
  await connectDB()

  const [songs, posts, albums, bookings, events] = await Promise.all([
    Song.countDocuments(),
    Post.countDocuments(),
    Album.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    Event.countDocuments({ isUpcoming: true }),
  ])

  const stats = [
    { label: 'Songs',            value: songs,    href: '/cms/songs' },
    { label: 'Posts',            value: posts,    href: '/cms/posts' },
    { label: 'Albums',           value: albums,   href: '/cms/albums' },
    { label: 'Pending Bookings', value: bookings, href: '/cms/bookings' },
    { label: 'Upcoming Events',  value: events,   href: '/cms/events' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-brand-deep mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map(s => (
          <a
            key={s.label}
            href={s.href}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-brand-teal transition-colors"
          >
            <p className="text-3xl font-bold text-brand-teal">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
```

---

### 10.16 Content List Page Pattern

Every content type follows this server component pattern for its list page.

**Example — Posts List:** `src/app/cms/posts/page.tsx`

```typescript
import { connectDB } from '@/lib/mongodb'
import Post from '@/models/Post'
import Link from 'next/link'
import CMSPageHeader from '@/components/cms/CMSPageHeader'
import StatusBadge   from '@/components/cms/StatusBadge'

export default async function CMSPostsPage() {
  await connectDB()
  const posts = await Post.find().sort({ createdAt: -1 }).lean()

  return (
    <div>
      <CMSPageHeader title="Posts" createHref="/cms/posts/new" createLabel="New Post" />
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((post: any) => (
              <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-brand-deep truncate line-clamp-1">{post.title}</td>
                <td className="px-4 py-3 text-gray-500 capitalize">{post.category}</td>
                <td className="px-4 py-3">
                  <StatusBadge published={post.isPublished} />
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/cms/posts/${post._id}`} className="text-brand-teal hover:underline text-xs">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

Apply the same pattern for songs, albums, events (card layout on mobile), initiatives, and tags.

---

### 10.17 CMS Route Summary

| Route                   | Purpose               | Component Type            |
| ----------------------- | --------------------- | ------------------------- |
| `/cms/login`            | Authentication        | Client                    |
| `/cms/dashboard`        | Overview stats        | Server                    |
| `/cms/posts`            | List all posts        | Server                    |
| `/cms/posts/new`        | Create post           | Client (PostForm)         |
| `/cms/posts/[id]`       | Edit post             | Client (PostForm)         |
| `/cms/songs`            | List all songs        | Server                    |
| `/cms/songs/new`        | Create song           | Client (SongForm)         |
| `/cms/songs/[id]`       | Edit song             | Client (SongForm)         |
| `/cms/albums`           | List all albums       | Server                    |
| `/cms/albums/new`       | Create album          | Client (AlbumForm)        |
| `/cms/albums/[id]`      | Edit album            | Client (AlbumForm)        |
| `/cms/events`           | List all events       | Server (card layout)      |
| `/cms/events/new`       | Create event          | Client (EventForm)        |
| `/cms/events/[id]`      | Edit event            | Client (EventForm)        |
| `/cms/initiatives`      | List initiatives      | Server                    |
| `/cms/initiatives/new`  | Create initiative     | Client (InitiativeForm)   |
| `/cms/initiatives/[id]` | Edit initiative       | Client (InitiativeForm)   |
| `/cms/media`            | Upload + browse media | Client                    |
| `/cms/bookings`         | View submissions      | Server + MarkBookingsSeen |
| `/cms/tags`             | Manage tags           | Client                    |
| `/cms/artist`           | Edit artist profile   | Client                    |
| `/cms/settings`         | Site settings         | Client                    |

---

**Section 10 Checklist:**

- [x] `src/app/api/auth/[...nextauth]/route.ts`
- [x] `src/middleware.ts` — protects `/cms/*` (except login)
- [x] `src/app/cms/layout.tsx` — CMSShell with pending badge
- [x] `src/components/cms/CMSShell.tsx` — mobile drawer state
- [x] `src/components/cms/CMSSidebar.tsx` — collapsible on mobile
- [x] `src/components/cms/CMSTopbar.tsx` — hamburger + badge + logout
- [x] `src/components/cms/MarkBookingsSeen.tsx`
- [x] `src/app/api/cms/bookings-seen/route.ts`
- [x] `src/app/cms/settings/page.tsx` + `src/app/api/settings/route.ts`
- [x] `src/app/cms/media/page.tsx` — checkbox selection, bulk delete toolbar, single delete per card, Copy URL
- [x] `src/app/api/media/route.ts` — DELETE bulk handler added
- [x] All CRUD pages: posts, songs, albums, events, initiatives, bookings, tags, artist
- [x] EventForm — `deriveIsUpcoming()` at module scope, no `PublishToggle`
- [x] Events CMS page — card layout on mobile
- [x] Initiatives list — `line-clamp-1` truncation, `table-fixed`
- [x] Booking status updates send Resend email notifications
- [ ] Login verified with production credentials
- [ ] Single delete tested — Cloudinary asset removed + MongoDB doc deleted
- [ ] Bulk delete tested — multiple assets removed in one request
- [ ] All CRUD operations verified end-to-end with live data

---

## 11. SEO Implementation 🔄

### 11.1 Metadata Per Page ✅

`generateMetadata()` implemented on all dynamic routes. See §8.4 for the pattern.

---

### 11.2 Sitemap ✅

**File:** `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongodb';
import Song from '@/models/Song';
import Post from '@/models/Post';
import Album from '@/models/Album';
import Event from '@/models/Event';
import Initiative from '@/models/Initiative';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const [songs, posts, albums, events, initiatives] = await Promise.all([
    Song.find({ isPublished: true })
      .select('albumId slug updatedAt')
      .populate('albumId', 'slug')
      .lean(),
    Post.find({ isPublished: true }).select('slug updatedAt').lean(),
    Album.find().select('slug updatedAt').lean(),
    Event.find({ isUpcoming: true }).select('slug updatedAt').lean(),
    Initiative.find().select('slug updatedAt').lean(),
  ]);

  const BASE = process.env.NEXT_PUBLIC_SITE_URL!;

  return [
    { url: BASE, lastModified: new Date() },
    { url: `${BASE}/about`, lastModified: new Date() },
    { url: `${BASE}/music`, lastModified: new Date() },
    { url: `${BASE}/blog`, lastModified: new Date() },
    { url: `${BASE}/events`, lastModified: new Date() },
    { url: `${BASE}/impact`, lastModified: new Date() },
    ...albums.map((a) => ({
      url: `${BASE}/music/${a.slug}`,
      lastModified: a.updatedAt,
    })),
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updatedAt,
    })),
    ...initiatives.map((i) => ({
      url: `${BASE}/impact/${i.slug}`,
      lastModified: i.updatedAt,
    })),
  ];
}
```

---

### 11.3 Robots.ts ✅

**File:** `src/app/robots.ts`

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/cms/'] },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
```

---

### 11.4 JSON-LD Structured Data ⬜

Add JSON-LD to three page types. Implement as an inline `<script>` in each Server Component page.

#### Song Page — `MusicRecording`

```tsx
// In src/app/(public)/music/[albumSlug]/[songSlug]/page.tsx (if this route exists)
// or on the album page per track
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicRecording',
  name: song.title,
  byArtist: {
    '@type': 'MusicGroup',
    name: 'Glowreeyah',
  },
  inAlbum: {
    '@type': 'MusicAlbum',
    name: album.title,
  },
  description: song.description,
  url: `${process.env.NEXT_PUBLIC_SITE_URL}/music/${album.slug}`,
};

// In JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>;
```

#### Blog Post Page — `Article`

```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.excerpt,
  image: post.coverImageUrl,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: {
    '@type': 'Person',
    name: 'Glowreeyah',
  },
  url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
};
```

#### Event Page — `Event`

```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: event.title,
  startDate: event.date,
  location: {
    '@type': 'Place',
    name: event.location,
  },
  description: event.description,
  url: event.externalLink || `${process.env.NEXT_PUBLIC_SITE_URL}/events`,
  image: event.coverImageUrl,
  organizer: {
    '@type': 'Person',
    name: 'Glowreeyah',
  },
};
```

---

**Section 11 Checklist:**

- [x] `generateMetadata()` on all dynamic public routes
- [x] Open Graph `title`, `description`, `images` on all content pages
- [x] Twitter Card metadata on all content pages
- [x] Canonical URLs correct
- [x] `src/app/sitemap.ts` — covers albums, posts, initiatives, events, static pages
- [x] `src/app/robots.ts` — `/cms/` disallowed
- [ ] JSON-LD `MusicRecording` added to song/album pages
- [ ] JSON-LD `Article` added to blog post pages
- [ ] JSON-LD `Event` added to events page
- [ ] Validate JSON-LD at https://search.google.com/test/rich-results

---

## 12. Performance & Accessibility ⬜

### 12.1 Performance Checklist

- [x] `next/image` used for all images — no raw `<img>` in public pages
- [x] `qualities: [75, 80]` set in `next.config.ts`
- [x] Client Component usage minimised
- [x] `npm run build` — no large bundle warnings
- [ ] `loading="lazy"` on all iframe/video embeds
- [ ] `revalidate` export on content Server Component pages (set to `60` or `3600`)
- [ ] Lighthouse Performance ≥ 90 on Home, Music, Blog
- [ ] Image sizes appropriate — verify no oversized images shipped

### 12.2 Accessibility Checklist

- [x] All images have `alt` text — enforced at upload (CMS requires altText)
- [x] Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`
- [x] Colour contrast ≥ 4.5:1 for body text
- [x] Keyboard navigation works on Navbar, booking form, CMS forms
- [x] `aria-label` on icon-only buttons (hamburger menu)
- [ ] Skip navigation link at top of root layout
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Test with screen reader (VoiceOver or NVDA)

### 12.3 Adding Revalidation

Add this export to each public Server Component page that fetches from the DB:

```typescript
export const revalidate = 3600; // revalidate at most every hour
```

Or use `revalidate = 60` for more frequently updated content (events, bookings).

---

## 13. Testing ⬜

### 13.1 Manual Testing Checklist

**Public Site**

- [ ] Home page loads — dual hero correct at mobile (375px) and desktop (1280px)
- [ ] `/about` — hero image uses `object-top`, correct height
- [ ] `/music` — album cards grid renders
- [ ] `/music/[albumSlug]` — AlbumPlayer loads tracks, play/pause works, floating bar appears, prev/next work, auto-advance works
- [ ] `/blog` — post cards render with cover images
- [ ] `/blog/[slug]` — full post renders, back link goes to correct referer
- [ ] `/events` — event cards render
- [ ] `/speaking` → `/events` redirect works (301)
- [ ] `/impact` — initiative image cards render and link to detail
- [ ] `/impact/[slug]` — initiative detail page renders
- [ ] `/booking` — form submits, success state shown, booking appears in CMS
- [ ] `/media` — gallery renders
- [ ] `/tag/[slug]` — tagged content lists correctly
- [ ] `/sitemap.xml` — resolves, includes albums, posts, initiatives
- [ ] `/robots.txt` — resolves, `/cms/` is disallowed

**CMS**

- [ ] `/cms/login` — login with correct credentials → redirected to `/cms/dashboard`
- [ ] `/cms/dashboard` — stat counts render from DB
- [ ] `/cms/posts` — list renders, new post creates, edit updates, delete works, publish toggle works
- [ ] `/cms/songs` — list renders, new song creates (title field updates correctly), edit updates
- [ ] `/cms/albums` — CRUD works
- [ ] `/cms/events` — card layout on mobile, create with date auto-sets `isUpcoming`
- [ ] `/cms/initiatives` — truncation works, CRUD works
- [ ] `/cms/media` — upload to Cloudinary works, delete removes from both Cloudinary and MongoDB
- [ ] `/cms/bookings` — pending badge appears, `MarkBookingsSeen` clears it on visit, status update sends email
- [ ] `/cms/tags` — create and delete work
- [ ] `/cms/artist` — profile saves, reflects on `/about`
- [ ] `/cms/settings` — hero images save, reflect on homepage
- [ ] Unauthenticated `/cms/dashboard` → redirect to `/cms/login`
- [ ] Logout → redirect to `/cms/login`, session cleared

**API**

- [ ] `GET /api/songs?albumId=xxx` — returns songs for album
- [ ] `POST /api/songs` with missing title → 422
- [ ] `PATCH /api/posts/[id]` with empty `coverImageUrl` → 200 (not 422)
- [ ] `DELETE /api/media/[id]` — Cloudinary asset deleted + MongoDB record removed
- [ ] `POST /api/bookings` → booking created, appears in CMS
- [ ] `PATCH /api/bookings/[id]` with `status: accepted` → email sent via Resend
- [ ] `POST /api/cms/bookings-seen` → `bookings_seen_at` cookie set

---

## 14. Deployment ⬜

### 14.1 Pre-Deployment Checklist

- [ ] `npm run build` passes locally — zero errors
- [ ] `npx tsc --noEmit` passes — zero TypeScript errors
- [ ] `npm run lint` passes — zero lint errors
- [ ] All changes committed to `feature/platform-v1` branch
- [ ] Branch merged to `main` on GitHub
- [ ] MongoDB Atlas cluster running, connection string valid
- [ ] Cloudinary credentials active
- [ ] Resend API key active, sending domain verified (`glowreeyah.com`)
- [ ] Tawk.to embed script URL noted

---

### 14.2 MongoDB Atlas Production Configuration

1. Log in to https://cloud.mongodb.com
2. Select cluster → **Network Access**
3. Add IP → **Allow Access from Anywhere** (`0.0.0.0/0`) — required because Vercel uses dynamic IPs
4. Confirm database user has **readWrite** on `glowreeyah`
5. Enable **Atlas automated backups**

---

### 14.3 Deploy to Vercel

**Step 1** — Go to https://vercel.com, log in with GitHub.

**Step 2** — Add New Project → Import Git Repository → select `glowreeyah-platform` → Import.

**Step 3** — Framework: Next.js (auto-detected). Root dir: `./`. Build: `npm run build`. Output: `.next`.

**Step 4** — Add all environment variables:

| Key                                 | Value                                        |
| ----------------------------------- | -------------------------------------------- |
| `MONGODB_URI`                       | Atlas connection string                      |
| `CLOUDINARY_CLOUD_NAME`             | Cloudinary cloud name                        |
| `CLOUDINARY_API_KEY`                | Cloudinary API key                           |
| `CLOUDINARY_API_SECRET`             | Cloudinary API secret                        |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                        |
| `NEXT_PUBLIC_SITE_URL`              | `https://glowreeyah.com` (production domain) |
| `NEXT_PUBLIC_SITE_NAME`             | `Glowreeyah`                                 |
| `NEXTAUTH_SECRET`                   | Strong random 32-char string                 |
| `NEXTAUTH_URL`                      | `https://glowreeyah.com` (production domain) |
| `CMS_ADMIN_EMAIL`                   | CMS login email                              |
| `CMS_ADMIN_PASSWORD`                | CMS login password                           |
| `RESEND_API_KEY`                    | Resend API key                               |
| `RESEND_FROM_EMAIL`                 | `noreply@glowreeyah.com`                     |
| `RESEND_TO_EMAIL`                   | Admin notification email                     |

**Step 5** — Click **Deploy**. First build takes 2–5 minutes.

**Step 6** — Add custom domain: Project → Settings → Domains → add `glowreeyah.com`.

---

### 14.4 Tawk.to Integration

Add the Tawk.to embed script to `src/app/layout.tsx` as a `<Script>` tag with `strategy="afterInteractive"`:

```typescript
import Script from 'next/script';

// In root layout JSX:
<Script
  id="tawkto"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
      (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
      })();
    `,
  }}
/>
```

Replace `YOUR_PROPERTY_ID` and `YOUR_WIDGET_ID` with values from your Tawk.to dashboard (Administration → Chat Widget → Direct Chat Link).

---

### 14.5 Subsequent Deployments

All future deployments are automatic. Push to `main` → production deployment on Vercel. Other branches → Preview deployments.

```bash
git add .
git commit -m "your commit message"
git push origin main
```

---

**Section 14 Checklist:**

- [x] `npm run build` passes locally
- [x] `npx tsc --noEmit` passes
- [x] Code pushed to `main` on GitHub
- [x] Repository imported into Vercel
- [x] All 14 env vars added to Vercel dashboard
- [x] `NEXTAUTH_URL` set to production domain (not `localhost`)
- [x] `NEXT_PUBLIC_SITE_URL` set to production domain
- [x] First deployment successful
- [x] MongoDB Atlas Network Access → `0.0.0.0/0`
- [x] Atlas automated backups enabled
- [ ] Custom domain configured and DNS propagated
- [x] Production URL loads public frontend
- [x] `/cms-login` accessible on production
- [x] Tawk.to embed verified (chat widget appears)
- [x] Resend domain verified — booking email sends successfully

---

## 15. Content Migration ⬜

### 15.1 WordPress Export

**Step 1** — In WordPress admin: Tools → Export → All Content → download `.xml`.

**Step 2** — Parse the export:

```bash
npm install wordpress-export-parser
```

Write a migration script at `scripts/migrate.ts`:

```typescript
import { connectDB } from '../src/lib/mongodb';
import Post from '../src/models/Post';
import slugify from 'slugify';
// Parse WordPress XML and insert into MongoDB
```

**Step 3** — Upload media:

For each image URL in the WordPress export:

1. Download the image
2. Upload to Cloudinary via the upload API
3. Record the Cloudinary URL in `MediaAsset`
4. Update content body references

**Step 4** — Validate:

- Post count in MongoDB matches WordPress export
- Spot-check 10 random posts for content integrity
- All images resolve (no broken URLs)
- All slugs unique

---

**Section 15 Checklist:**

- [ ] WordPress `.xml` export downloaded
- [ ] `scripts/migrate.ts` written and tested locally
- [ ] All posts imported — count matches WordPress
- [ ] All media uploaded to Cloudinary
- [ ] `MediaAsset` records created for each file
- [ ] Post body image references updated to Cloudinary URLs
- [ ] 10 random posts spot-checked
- [ ] Zero broken image URLs in production
- [ ] All slugs unique

---

## 16. Post-Launch ⬜

### Immediate (Day 1)

- [ ] Verify Google Search Console ownership
- [ ] Submit sitemap: https://search.google.com/search-console → Sitemaps → `https://glowreeyah.com/sitemap.xml`
- [ ] Lighthouse audit on production — Performance ≥ 90, SEO = 100, Accessibility ≥ 90
- [ ] CMS login confirmed on production domain
- [ ] All CMS CRUD operations tested on production
- [ ] Booking form tested — submission appears in `/cms/bookings`
- [ ] Booking status update sends Resend email on production

### Week 1

- [ ] Vercel deployment logs — no runtime errors
- [ ] MongoDB Atlas metrics — connection count and query times normal
- [ ] Cloudinary usage within free tier limits
- [ ] Initial user feedback collected

### Ongoing

- [ ] Booking submissions reviewed weekly
- [ ] New blog / devotional content via `/cms/posts`
- [ ] SEO rankings monitored monthly
- [ ] Dependencies updated monthly: `npm outdated` → update → re-test

---

---

## 17. Multi-Tenant Support & CMS Roles ⬜

### 17.1 Overview

Replace the single hardcoded admin credential with a `CMSUser` collection supporting three roles:

| Role      | Permissions                                                                          |
| --------- | ------------------------------------------------------------------------------------ |
| `admin`   | Full access — all CRUD, settings, user management, bookings                          |
| `editor`  | Create and edit content — no settings, no user management                            |
| `creator` | Create content only — cannot edit or delete others' content, no settings             |

---

### 17.2 CMSUser Model — `src/models/CMSUser.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ICMSUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'editor' | 'creator';
  isActive: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

const CMSUserSchema = new Schema<ICMSUser>(
  {
    name:         { type: String, required: true },
    email:        { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: ['admin', 'editor', 'creator'], default: 'editor' },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

CMSUserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash);
};

export default mongoose.models.CMSUser ||
  mongoose.model<ICMSUser>('CMSUser', CMSUserSchema);
```

Install bcryptjs:

```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

---

### 17.3 Updated NextAuth Handler

**File:** `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/mongodb';
import CMSUser from '@/models/CMSUser';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await CMSUser.findOne({
          email:    credentials.email.toLowerCase(),
          isActive: true,
        });
        if (!user) return null;
        const valid = await user.comparePassword(credentials.password);
        if (!valid) return null;
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: { signIn: '/cms/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

### 17.4 NextAuth Type Augmentation

**File:** `src/types/next-auth.d.ts`

```typescript
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User { role?: string }
  interface Session {
    user: { name?: string; email?: string; image?: string; role?: string }
  }
}

declare module 'next-auth/jwt' {
  interface JWT { role?: string }
}
```

---

### 17.5 Role-Based Route Guard

**File:** `src/lib/requireRole.ts`

```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

type Role = 'admin' | 'editor' | 'creator';
const HIERARCHY: Record<Role, number> = { admin: 3, editor: 2, creator: 1 };

export async function requireRole(minimum: Role) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as any)?.role as Role | undefined;
  if (!role || HIERARCHY[role] < HIERARCHY[minimum]) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null; // authorised
}
```

Usage in any API route:

```typescript
export async function DELETE(req: NextRequest, ...) {
  const denied = await requireRole('admin');
  if (denied) return denied;
  // ...proceed
}
```

---

### 17.6 Permission Matrix

| API Action                         | creator | editor | admin |
| ---------------------------------- | ------- | ------ | ----- |
| GET any content                    | ✅      | ✅     | ✅    |
| POST (create) content              | ✅      | ✅     | ✅    |
| PATCH (edit) content               | ❌      | ✅     | ✅    |
| DELETE content                     | ❌      | ❌     | ✅    |
| GET/PATCH settings                 | ❌      | ❌     | ✅    |
| GET/PATCH bookings                 | ❌      | ✅     | ✅    |
| GET/POST/DELETE media              | ❌      | ✅     | ✅    |
| CMS user management (`/cms/users`) | ❌      | ❌     | ✅    |

---

### 17.7 CMS Users API

**File:** `src/app/api/cms/users/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import CMSUser from '@/models/CMSUser';
import { requireRole } from '@/lib/requireRole';

export async function GET() {
  const denied = await requireRole('admin');
  if (denied) return denied;
  await connectDB();
  const users = await CMSUser.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: users });
}

export async function POST(req: NextRequest) {
  const denied = await requireRole('admin');
  if (denied) return denied;
  await connectDB();
  const { name, email, password, role } = await req.json();
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await CMSUser.create({ name, email, passwordHash, role });
  return NextResponse.json({ data: { _id: user._id, name, email, role } }, { status: 201 });
}
```

**File:** `src/app/api/cms/users/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import CMSUser from '@/models/CMSUser';
import { requireRole } from '@/lib/requireRole';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireRole('admin');
  if (denied) return denied;
  const { id } = await params;
  await connectDB();
  const { role, isActive } = await req.json();
  const user = await CMSUser.findByIdAndUpdate(id, { role, isActive }, { new: true })
    .select('-passwordHash');
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: user });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireRole('admin');
  if (denied) return denied;
  const { id } = await params;
  await connectDB();
  await CMSUser.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
```

---

### 17.8 Sidebar — Admin-Only Users Link

```typescript
// In CMSSidebar.tsx
const { data: session } = useSession()
const isAdmin = (session?.user as any)?.role === 'admin'

// Add to nav array:
...(isAdmin ? [{ href: '/cms/users', label: 'Users', icon: '👤' }] : [])
```

---

### 17.9 Seed First Admin

**File:** `scripts/seedAdmin.ts`

```typescript
import { connectDB } from '../src/lib/mongodb';
import CMSUser from '../src/models/CMSUser';
import bcrypt from 'bcryptjs';

async function seed() {
  await connectDB();
  const exists = await CMSUser.findOne({ email: 'admin@glowreeyah.com' });
  if (exists) { console.log('Admin already exists'); process.exit(0); }
  const passwordHash = await bcrypt.hash('your-secure-password', 12);
  await CMSUser.create({ name: 'Admin', email: 'admin@glowreeyah.com', passwordHash, role: 'admin' });
  console.log('Admin created');
  process.exit(0);
}

seed().catch(console.error);
```

Run once: `npx tsx scripts/seedAdmin.ts`

After confirming DB login works, remove `CMS_ADMIN_EMAIL` and `CMS_ADMIN_PASSWORD` from env vars.

---

**Section 17 Checklist:**

- [ ] `npm install bcryptjs && npm install --save-dev @types/bcryptjs`
- [ ] `src/models/CMSUser.ts` created
- [ ] `src/types/next-auth.d.ts` created — role in JWT and session
- [ ] `src/app/api/auth/[...nextauth]/route.ts` updated — DB lookup, role callbacks, `authOptions` exported
- [ ] `src/lib/requireRole.ts` created
- [ ] `requireRole('admin')` applied to: DELETE media, DELETE tags, DELETE any content, GET/PATCH settings
- [ ] `requireRole('editor')` applied to: PATCH content, GET/PATCH bookings, media upload
- [ ] `src/app/api/cms/users/route.ts` and `[id]/route.ts` created
- [ ] `/cms/users` page created
- [ ] `CMSSidebar` — Users link visible to admin only
- [ ] `scripts/seedAdmin.ts` run — first admin confirmed in MongoDB
- [ ] Login with seeded admin verified
- [ ] Editor returns 403 on DELETE — verified
- [ ] `CMS_ADMIN_EMAIL` / `CMS_ADMIN_PASSWORD` retired after DB login confirmed

---

## 18. Paystack Payment Integration ⬜

### 18.1 Overview

Paystack handles purchasing of individual songs and full albums (including singles). `price` is stored in **kobo** on both `Album` and `Song` models. `price: 0` means free/streaming only.

```
User clicks "Buy"  →  POST /api/payments/initialize  →  Paystack checkout URL
                                                               ↓
                                               User pays on Paystack hosted page
                                                               ↓
                                   Paystack webhook → POST /api/payments/webhook
                                                               ↓
                                           Order record updated → accessGranted: true
                                                               ↓
                                              Resend email with download/access link
```

---

### 18.2 Install & Env

No SDK required — use Paystack's REST API directly with `fetch`.

```env
PAYSTACK_SECRET_KEY=sk_live_xxxxx           # sk_test_xxxxx in dev
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxx # only needed for inline widget
```

---

### 18.3 Order Model — `src/models/Order.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  email: string;
  itemType: 'song' | 'album';
  itemId: mongoose.Types.ObjectId;
  itemTitle: string;
  amountKobo: number;
  paystackReference: string;
  paystackStatus: 'pending' | 'success' | 'failed';
  accessGranted: boolean;
}

const OrderSchema = new Schema<IOrder>(
  {
    email:             { type: String, required: true, lowercase: true },
    itemType:          { type: String, enum: ['song', 'album'], required: true },
    itemId:            { type: Schema.Types.ObjectId, required: true },
    itemTitle:         { type: String, required: true },
    amountKobo:        { type: Number, required: true },
    paystackReference: { type: String, required: true, unique: true },
    paystackStatus:    { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    accessGranted:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>('Order', OrderSchema);
```

---

### 18.4 Initialize Payment — `src/app/api/payments/initialize/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import Album from '@/models/Album';
import Song from '@/models/Song';

export async function POST(req: NextRequest) {
  await connectDB();
  const { email, itemType, itemId } = await req.json();

  if (!email || !itemType || !itemId) {
    return NextResponse.json({ error: 'email, itemType, and itemId are required' }, { status: 422 });
  }

  const item = itemType === 'album'
    ? await Album.findById(itemId).lean()
    : await Song.findById(itemId).lean();

  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  if (!item.price || item.price === 0) {
    return NextResponse.json({ error: 'This item is free' }, { status: 400 });
  }

  const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: item.price,
      metadata: { itemType, itemId: itemId.toString(), itemTitle: item.title },
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/verify`,
    }),
  });

  const paystackData = await paystackRes.json();
  if (!paystackData.status) {
    return NextResponse.json({ error: 'Paystack initialization failed' }, { status: 502 });
  }

  await Order.create({
    email, itemType, itemId,
    itemTitle: item.title,
    amountKobo: item.price,
    paystackReference: paystackData.data.reference,
    paystackStatus: 'pending',
  });

  return NextResponse.json({ checkoutUrl: paystackData.data.authorization_url });
}
```

---

### 18.5 Webhook Handler — `src/app/api/payments/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature') ?? '';
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex');

  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === 'charge.success') {
    await connectDB();
    await Order.findOneAndUpdate(
      { paystackReference: event.data.reference },
      { paystackStatus: 'success', accessGranted: true }
    );
    // TODO: send download/access email via Resend
  }

  return NextResponse.json({ ok: true });
}
```

> Register webhook URL in Paystack dashboard: `https://glowreeyah.com/api/payments/webhook`

---

### 18.6 Verify After Redirect — `src/app/api/payments/verify/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  const reference = new URL(req.url).searchParams.get('reference');
  if (!reference) return NextResponse.json({ error: 'No reference' }, { status: 400 });

  const paystackRes = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
  );
  const data = await paystackRes.json();

  if (data.data?.status === 'success') {
    await connectDB();
    await Order.findOneAndUpdate(
      { paystackReference: reference },
      { paystackStatus: 'success', accessGranted: true }
    );
    return NextResponse.json({ status: 'success' });
  }

  return NextResponse.json({ status: data.data?.status ?? 'failed' });
}
```

---

### 18.7 Public Buy Button

On album and song detail pages, show a Buy button when `price > 0`:

```typescript
// Price display helper — kobo to naira
function formatPrice(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString('en-NG')}`
}

// Button (client component)
<button onClick={() => handleBuy(item._id, itemType)}>
  Buy — {formatPrice(item.price)}
</button>
```

`handleBuy` collects the user's email (inline input or modal), POSTs to `/api/payments/initialize`, then redirects to the returned `checkoutUrl`.

---

### 18.8 CMS Orders Page

Add `/cms/orders` to the CMS sidebar (admin and editor). Lists all orders with: purchaser email, item name, item type, amount, Paystack status badge, access granted flag, date.

---

**Section 18 Checklist:**

- [ ] `PAYSTACK_SECRET_KEY` added to `.env.local` and Vercel
- [ ] `src/models/Order.ts` created
- [ ] `src/app/api/payments/initialize/route.ts` created
- [ ] `src/app/api/payments/webhook/route.ts` created — signature verified
- [ ] `src/app/api/payments/verify/route.ts` created
- [ ] Webhook URL registered in Paystack dashboard
- [ ] `Album.isSingle`, `Album.price`, `Song.price` wired into AlbumForm and SongForm
- [ ] Buy button renders on public album/song pages when `price > 0`
- [ ] Test end-to-end in test mode (`sk_test_` key)
- [ ] Webhook fires → `accessGranted` flips to `true`
- [ ] `/cms/orders` page renders orders correctly

---

## Appendix A — File Creation Order

Execute in this sequence to avoid import errors:

1. `src/lib/mongodb.ts`
2. `src/lib/cloudinary.ts`
3. `src/lib/resend.ts`
4. `src/lib/utils.ts`
5. `src/lib/validators/*.ts` (all validators)
6. `src/models/*.ts` (all models)
7. `src/app/api/auth/[...nextauth]/route.ts`
8. `src/app/api/**/*.ts` (all route handlers)
9. `src/middleware.ts`
10. `src/components/layout/*.tsx`
11. `src/components/ui/*.tsx`
12. `src/components/cms/*.tsx`
13. `src/components/music/*.tsx`
14. `src/components/content/*.tsx`
15. `src/app/cms/layout.tsx`
16. `src/app/cms-login/page.tsx`
17. `src/app/cms/dashboard/page.tsx`
18. `src/app/cms/**/*.tsx` (all CMS pages)
19. `src/app/layout.tsx`
20. `src/app/(public)/page.tsx`
21. `src/app/(public)/**/*.tsx` (all public pages)
22. `src/app/sitemap.ts`
23. `src/app/robots.ts`

---

## Appendix B — Quick Reference Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# TypeScript check
npx tsc --noEmit

# Lint
npm run lint

# Format code
npx prettier --write src/
```

---

## Appendix C — Environment Variable Checklist

| Variable                            | Required        | Used In                                                       |
| ----------------------------------- | --------------- | ------------------------------------------------------------- |
| `MONGODB_URI`                       | ✅              | `src/lib/mongodb.ts`                                          |
| `CLOUDINARY_CLOUD_NAME`             | ✅              | `src/lib/cloudinary.ts`                                       |
| `CLOUDINARY_API_KEY`                | ✅              | `src/lib/cloudinary.ts`                                       |
| `CLOUDINARY_API_SECRET`             | ✅              | `src/lib/cloudinary.ts`                                       |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅              | Client components                                             |
| `NEXT_PUBLIC_SITE_URL`              | ✅              | SEO, sitemap, JSON-LD, referer back links                     |
| `NEXT_PUBLIC_SITE_NAME`             | ✅              | Metadata                                                      |
| `NEXTAUTH_SECRET`                   | ✅              | CMS auth                                                      |
| `NEXTAUTH_URL`                      | ✅              | CMS auth                                                      |
| `CMS_ADMIN_EMAIL`                   | ⚠️ retire after §17 | Env-var login — replaced by `CMSUser` DB auth in §17     |
| `CMS_ADMIN_PASSWORD`                | ⚠️ retire after §17 | Env-var login — replaced by `CMSUser` DB auth in §17     |
| `RESEND_API_KEY`                    | ✅              | `src/lib/resend.ts` — booking emails                          |
| `RESEND_FROM_EMAIL`                 | ✅              | `src/lib/resend.ts` — sender address                          |
| `RESEND_TO_EMAIL`                   | ✅              | `src/lib/resend.ts` — admin notifications                     |
| `PAYSTACK_SECRET_KEY`               | ✅ (§18)        | `src/app/api/payments/*` — server-side Paystack calls         |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`   | optional (§18)  | Client-side Paystack inline widget                            |

---

## Appendix D — What Changed Across Sessions

### Session 1 — 2026-04-06

**API fixes**
- All `[id]` route handlers updated to `params: Promise<{ id: string }>` and `await params` (Next.js 15)
- Post PATCH 404 fix — `params.id` → awaited `id`
- Post validator — `coverImageUrl` now `.optional().or(z.literal(''))`, all URL fields same pattern
- Song form — `onChange` for title field fixed (was updating `date`)

**New models & routes**
- `SiteSettings` model — `heroImageUrl`, `heroImageMobileUrl`, `heroHeadline`, `heroSubheadline`, `siteTagline`
- `GET/PATCH /api/settings` route — upsert pattern
- `POST /api/cms/bookings-seen` route — cookie-based seen tracking
- `DELETE /api/media` bulk handler — accepts `{ ids: string[] }`, uses `Promise.allSettled` on Cloudinary

**CMS**
- CMS route group `(cms)` → real `cms/` directory (resolved Next.js 15 route conflict)
- `CMSShell` — outer client component for mobile drawer state
- `CMSSidebar` — collapsible on mobile, persistent on desktop
- `CMSTopbar` — hamburger button + pending bookings badge
- `MarkBookingsSeen` — client component, fires on `/cms/bookings` mount
- `EventForm` — `deriveIsUpcoming()` at module scope; `PublishToggle` removed
- `CMSRowActions` — removed unused `router`
- Events CMS page — mobile card layout replacing table
- Initiatives page — `line-clamp-1` + `table-fixed`
- Booking status PATCH — triggers Resend email via `sendBookingStatusEmail()`
- `/cms/settings` page + `SiteSettings` CMS form

**Public site**
- Homepage hero — dual layout (mobile stacked `md:hidden`, desktop overlay `hidden md:flex`)
- `heroImageMobileUrl` field added to `SiteSettings`, settings API, CMS settings page
- Album detail — `SongCard` → `AlbumPlayer` (inline play, floating player, prev/next, volume, auto-advance)
- Blog post detail — hero image layout + referer-based back link
- About page — `object-top`, fixed height hero container
- Events homepage section — cards grid (was single featured event)
- Impact/initiatives homepage — image cards linking to detail pages
- Initiative detail pages added (`/impact/[slug]`)
- `/speaking` renamed to `/events` throughout
- `next.config.ts` — `qualities: [75, 80]`, `/speaking` → `/events` redirect

---

### Session 2 — 2026-04-09

**Media library**
- CMS media page — checkbox selection per card, select-all toolbar, "Delete all N" button (visible only when select-all is checked), per-card Delete button on hover overlay
- Audio file icon placeholder — `asset.type === 'audio'` renders musical note SVG instead of broken `<img>`
- ESLint fix — bare ternary in `toggleOne` → explicit `if/else`

**EventForm — past event lock**
- `isPastEvent()` module-level helper — checks `isUpcoming === false` then falls back to date comparison
- All fields `readOnly` + greyed-out `inputCls` when past
- Amber notice banner at top of form
- Save button `disabled` + `cursor-not-allowed` + `title` tooltip
- `handleSubmit` early-exits if `isPast`; Delete still enabled
- `SlugField` and `MediaPicker` replaced with plain readonly inputs when past

**New features — models & routes**
- `Album.isSingle: boolean` — marks a release as a single (default `false`)
- `Album.price: number` — price in kobo for Paystack (default `0` = free)
- `Song.price: number` — price in kobo for individual track purchase (default `0`)
- `albumValidator` — `isSingle` and `price` fields added
- `songValidator` — `price` field added
- §17 Multi-tenant CMS roles — `CMSUser` model (bcrypt), updated NextAuth handler with DB lookup, role embedded in JWT/session, `requireRole()` guard, `/cms/users` page, admin seed script
- §18 Paystack payments — `Order` model, `initialize`/`webhook`/`verify` API routes, public buy button pattern, `/cms/orders` page

---

_This document supersedes all previous implementation notes. Version 2.1.0. For feature definitions see `04_features.md`. For brand and architectural constraints see `01_constitution.md`._