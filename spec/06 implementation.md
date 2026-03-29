# Implementation Guide

**Project:** Glowreeyah Digital Platform
**Document Type:** Software Design Document (SDD) — Single Source of Truth
**Version:** 1.1.0
**Last Updated:** 2026-03-28
**Status:** In Progress

---

## Progress Tracker

| Section | Title                       | Status         |
| ------- | --------------------------- | -------------- |
| §1      | System Architecture         | ✅ Complete    |
| §2      | Tech Stack & Dependencies   | ✅ Complete    |
| §3      | Environment Setup           | ✅ Complete    |
| §4      | Project Scaffolding         | ✅ Complete    |
| §5      | Database Design             | 🔄 In Progress |
| §6      | API Layer                   | 🔄 In Progress |
| §7      | UI & Component Layer        | ✅ Complete    |
| §8      | Page Implementation         | ✅ Complete    |
| §9      | Media Integration           | 🔄 In Progress |
| §10     | CMS                         | ⬜ Not Started |
| §11     | SEO Implementation          | ⬜ Not Started |
| §12     | Performance & Accessibility | ⬜ Not Started |
| §13     | Testing                     | ⬜ Not Started |
| §14     | Deployment                  | ⬜ Not Started |
| §15     | Content Migration           | ⬜ Not Started |
| §16     | Post-Launch                 | ⬜ Not Started |

> Update this table as each section is completed. Change `⬜ Not Started` → `🔄 In Progress` → `✅ Complete`.

---

## Document Purpose

This document is the **single source of truth** for end-to-end implementation and execution of the Glowreeyah digital platform. It covers environment setup, project scaffolding, database configuration, API development, UI development, media integration, admin system, SEO, deployment, and content migration — in sequential order.

Cross-references:

- Feature definitions → `features.md`
- Brand rules and constraints → `constitution.md`
- Data models and domain spec → `specification.md`
- Execution phases and milestones → `plan.md`
- Outstanding tasks → `tasks.md`

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
│   (public)/* — Public website    (cms)/* — Content Studio    │
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
```

**Deployment targets:**

- Public frontend + CMS + API routes → Vercel (single deployment)
- Database → MongoDB Atlas
- Media → Cloudinary

---

## 2. Tech Stack & Dependencies ✅

### Core

| Package                | Version | Purpose                                  |
| ---------------------- | ------- | ---------------------------------------- |
| `next`                 | 14.x    | Framework (App Router)                   |
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

| Package               | Version | Purpose                 |
| --------------------- | ------- | ----------------------- |
| `cloudinary`          | 2.x     | Media upload + delivery |
| `@next/third-parties` | latest  | Optimised embeds        |

### Utilities

| Package                | Version | Purpose                                 |
| ---------------------- | ------- | --------------------------------------- |
| `next-auth`            | 4.x     | CMS authentication + session management |
| `@uiw/react-md-editor` | 3.x     | Markdown rich text editor (CMS)         |
| `react-markdown`       | 9.x     | Render markdown on public frontend      |
| `slugify`              | 1.x     | URL-safe slug generation                |
| `zod`                  | 3.x     | Schema validation                       |
| `next-seo`             | 6.x     | SEO helpers (optional)                  |

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

Ensure the following are installed on your local machine before starting:

| Tool    | Minimum Version | Install             |
| ------- | --------------- | ------------------- |
| Node.js | 18.17.0         | https://nodejs.org  |
| npm     | 9.x             | Bundled with Node   |
| Git     | 2.x             | https://git-scm.com |

Verify installations:

```bash
node --version
npm --version
git --version
```

- [x] Node.js installed and verified
- [x] npm installed and verified
- [x] Git installed and verified

---

### 3.2 Accounts Required ✅

- [x] MongoDB Atlas account created — M0 cluster running, database user created, connection string copied
- [x] Cloudinary account created — Cloud Name, API Key, API Secret noted
- [x] Vercel account created and linked to GitHub
- [x] GitHub repository `glowreeyah-platform` created

---

### 3.3 Environment Variables ✅

Create a `.env.local` file in the project root with the following keys. **Never commit this file to Git.**

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
```

Add `.env.local` to `.gitignore`:

```bash
echo ".env.local" >> .gitignore
```

- [x] `.env.local` created in project root with all required variables
- [x] `.env.local` added to `.gitignore`

---

## 4. Project Scaffolding ✅

### 4.1 Create the Next.js Application ✅

Run the following command from your chosen parent directory:

```bash
npx create-next-app@latest glowreeyah-platform \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

When prompted, select:

- Would you like to use Turbopack? → **No** (more stable for production)

Navigate into the project:

```bash
cd glowreeyah-platform
```

- [x] Next.js app scaffolded with TypeScript, Tailwind, ESLint, App Router, `src/` dir
- [x] `npm run dev` starts without errors

---

### 4.2 Install Dependencies ✅

```bash
npm install mongoose slugify zod cloudinary next-auth @uiw/react-md-editor react-markdown
npm install --save-dev prettier @types/node
```

- [x] All dependencies installed
- [x] No install errors in terminal

- [x] All dependencies installed
- [x] No install errors in terminal

---

### 4.3 Directory Structure ✅

- [x] All directories created via `mkdir` commands below
- [x] Directory tree matches the structure above

Create the complete directory structure manually or run the commands below:

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx              ← Home
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── music/
│   │   │   ├── page.tsx
│   │   │   └── [albumSlug]/
│   │   │       ├── page.tsx
│   │   │       └── [songSlug]/
│   │   │           └── page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── media/
│   │   │   └── page.tsx
│   │   ├── speaking/
│   │   │   └── page.tsx
│   │   ├── booking/
│   │   │   └── page.tsx
│   │   ├── impact/
│   │   │   └── page.tsx
│   │   └── tag/
│   │       └── [slug]/
│   │           └── page.tsx
│   ├── (cms)/
│   │   ├── layout.tsx                ← CMS shell (sidebar + topbar)
│   │   ├── login/
│   │   │   └── page.tsx              ← Login page
│   │   ├── dashboard/
│   │   │   └── page.tsx              ← Overview: counts, recent activity
│   │   ├── songs/
│   │   │   ├── page.tsx              ← Songs list
│   │   │   ├── new/page.tsx          ← Create song
│   │   │   └── [id]/page.tsx         ← Edit song
│   │   ├── albums/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── posts/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── initiatives/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── media/
│   │   │   └── page.tsx              ← Upload + media browser
│   │   ├── bookings/
│   │   │   └── page.tsx              ← Booking submissions
│   │   ├── tags/
│   │   │   └── page.tsx              ← Tag management
│   │   └── artist/
│   │       └── page.tsx              ← Edit artist profile
│   ├── api/
│   │   ├── artists/
│   │   │   └── route.ts
│   │   ├── albums/
│   │   │   └── route.ts
│   │   ├── songs/
│   │   │   └── route.ts
│   │   ├── posts/
│   │   │   └── route.ts
│   │   ├── media/
│   │   │   └── route.ts
│   │   ├── events/
│   │   │   └── route.ts
│   │   ├── initiatives/
│   │   │   └── route.ts
│   │   ├── bookings/
│   │   │   └── route.ts
│   │   └── tags/
│   │       └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── PageWrapper.tsx
│   ├── cms/
│   │   ├── CMSSidebar.tsx            ← Persistent left nav for CMS
│   │   ├── CMSTopbar.tsx             ← Top bar with user info + logout
│   │   ├── CMSPageHeader.tsx         ← Page title + action button (e.g. "New Song")
│   │   ├── ContentTable.tsx          ← Reusable list/table for all content types
│   │   ├── ContentForm.tsx           ← Generic form wrapper with save/cancel
│   │   ├── RichTextEditor.tsx        ← Rich text input (prose content)
│   │   ├── MediaPicker.tsx           ← Select existing media asset
│   │   ├── MediaUploader.tsx         ← Upload new file to Cloudinary
│   │   ├── TagSelector.tsx           ← Multi-select tag input
│   │   ├── PublishToggle.tsx         ← Published / Draft toggle
│   │   ├── SlugField.tsx             ← Auto-generates slug from title
│   │   ├── ConfirmDialog.tsx         ← Confirmation modal for deletes
│   │   └── StatusBadge.tsx           ← Pill badge (Published, Draft, Pending)
│   ├── music/
│   │   ├── AlbumCard.tsx
│   │   ├── SongCard.tsx
│   │   └── AudioPlayer.tsx
│   ├── content/
│   │   ├── PostCard.tsx
│   │   └── RichText.tsx
│   ├── media/
│   │   └── MediaCard.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Tag.tsx
│   │   └── LoadingSpinner.tsx
│   └── seo/
│       └── MetaTags.tsx
├── lib/
│   ├── mongodb.ts                ← DB connection
│   ├── cloudinary.ts             ← Media client
│   └── utils.ts                  ← Shared helpers
├── models/
│   ├── Artist.ts
│   ├── Album.ts
│   ├── Song.ts
│   ├── Post.ts
│   ├── MediaAsset.ts
│   ├── Event.ts
│   ├── Initiative.ts
│   ├── Booking.ts
│   └── Tag.ts
└── services/
    ├── artistService.ts
    ├── albumService.ts
    ├── songService.ts
    ├── postService.ts
    └── mediaService.ts
```

Create all directories:

```bash
mkdir -p src/app/\(public\)/{about,music,blog,media,speaking,booking,impact}
mkdir -p src/app/\(public\)/music/\[albumSlug\]/\[songSlug\]
mkdir -p src/app/\(public\)/blog/\[slug\]
mkdir -p src/app/\(public\)/tag/\[slug\]
mkdir -p src/app/\(cms\)/{login,dashboard,media,bookings,tags,artist}
mkdir -p src/app/\(cms\)/songs/{new,\[id\]}
mkdir -p src/app/\(cms\)/albums/{new,\[id\]}
mkdir -p src/app/\(cms\)/posts/{new,\[id\]}
mkdir -p src/app/\(cms\)/events/{new,\[id\]}
mkdir -p src/app/\(cms\)/initiatives/{new,\[id\]}
mkdir -p src/app/api/{artists,albums,songs,posts,media,events,initiatives,bookings,tags}
mkdir -p src/app/api/admin
mkdir -p src/components/{layout,cms,music,content,media,ui,seo}
mkdir -p src/lib src/models src/services
```

---

### 4.4 Tailwind Configuration ✅

This project uses **Tailwind v4**, which removes `tailwind.config.ts` entirely. All theme customisation lives in `src/app/globals.css` using the CSS-first `@theme` block. There is no config file to create.

**File:** `src/app/globals.css` — replace all existing content with:

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

Tailwind v4 generates all utility classes from the `@theme` block automatically — `bg-brand-gold`, `text-brand-deep`, `text-brand-warm`, `font-serif`, etc. are all available in components without any additional setup.

**File:** `postcss.config.js` — confirm it reads exactly:

```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

> **Note:** Do not use the old `tailwindcss` key in `postcss.config.js` — that is Tailwind v3 syntax and will cause a build error on v4.

- [x] `globals.css` replaced with `@import "tailwindcss"` + `@theme` block including teal, gold, deep, warm, accent
- [x] `postcss.config.js` uses `@tailwindcss/postcss`
- [x] VS Code `unknownAtRules` warning suppressed via `.vscode/settings.json`
- [x] Brand colour classes (`bg-brand-teal`, `text-brand-deep`, etc.) resolve correctly in dev

---

## 5. Database Design 🔄

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
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
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
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
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
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
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
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
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
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
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
  publicId: string; // Cloudinary public_id for deletion/transforms
  altText: string;
  type: 'image' | 'video' | 'audio';
  linkedContentId: mongoose.Types.ObjectId;
  linkedContentType: string; // 'Song' | 'Post' | 'Album' etc.
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

**Section 5 Checklist:**

- [ ] `src/lib/mongodb.ts` created and tested — `connectDB()` resolves without error
- [ ] `src/lib/cloudinary.ts` created (see §9.1)
- [ ] `src/lib/utils.ts` created
- [ ] `src/models/Artist.ts` created
- [ ] `src/models/Album.ts` created
- [ ] `src/models/Song.ts` created
- [ ] `src/models/Post.ts` created
- [ ] `src/models/MediaAsset.ts` created
- [ ] `src/models/Event.ts` created
- [ ] `src/models/Booking.ts` created
- [ ] `src/models/Tag.ts` created
- [ ] `src/models/Initiative.ts` created
- [ ] All models import without TypeScript errors (`npx tsc --noEmit`)

---

## 6. API Layer ⬜

### 6.1 Route Pattern

All API routes follow the same structure:

```
GET    /api/[resource]          → list all (with optional query params)
POST   /api/[resource]          → create new
GET    /api/[resource]/[id]     → get single
PATCH  /api/[resource]/[id]     → update
DELETE /api/[resource]/[id]     → delete
```

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
  { params }: { params: { id: string } }
) {
  await connectDB();
  const song = await Song.findById(params.id)
    .populate('albumId', 'title slug')
    .populate('tags', 'name slug')
    .lean();
  if (!song) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: song });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
  const song = await Song.findByIdAndUpdate(params.id, update, { new: true });
  if (!song) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: song });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Song.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
```

---

### 6.3 Albums Route

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
  { params }: { params: { id: string } }
) {
  await connectDB();
  const album = await Album.findById(params.id)
    .populate('tags', 'name slug')
    .lean();
  if (!album) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: album });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
  const album = await Album.findByIdAndUpdate(params.id, update, { new: true });
  if (!album) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: album });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Album.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
```

---

### 6.4 Posts Route

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

**File:** `src/app/api/posts/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Post from '@/models/Post';
import slugify from 'slugify';
import { PostSchema } from '@/lib/validators/postValidator';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const post = await Post.findById(params.id)
    .populate('tags', 'name slug')
    .lean();
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: post });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
  const post = await Post.findByIdAndUpdate(params.id, update, { new: true });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: post });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Post.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
```

---

### 6.5 Events Route

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
  { params }: { params: { id: string } }
) {
  await connectDB();
  const event = await Event.findById(params.id).lean();
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: event });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
  const event = await Event.findByIdAndUpdate(params.id, update, { new: true });
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: event });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Event.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
```

---

### 6.6 Initiatives Route

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
  { params }: { params: { id: string } }
) {
  await connectDB();
  const initiative = await Initiative.findById(params.id)
    .populate('tags', 'name slug')
    .lean();
  if (!initiative)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: initiative });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
  const initiative = await Initiative.findByIdAndUpdate(params.id, update, {
    new: true,
  });
  if (!initiative)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: initiative });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Initiative.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
```

---

### 6.7 Tags Route

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
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Tag.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
```

> Tags use `name` not `title` for slug generation — note `slugify(parsed.data.name, ...)` in the POST handler.

---

### 6.8 Artists Route

No slug. Single artist document — GET returns the first (and only) artist record. POST creates it on first setup. PATCH updates it.

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
  { params }: { params: { id: string } }
) {
  await connectDB();
  const body = await req.json();
  const parsed = ArtistSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }
  const artist = await Artist.findByIdAndUpdate(params.id, parsed.data, {
    new: true,
  });
  if (!artist)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: artist });
}
```

---

### 6.9 Bookings Route

No slug. Submissions only come in via POST from the public booking form. Status updates via PATCH from the CMS.

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

const VALID_STATUSES = ['pending', 'reviewed', 'accepted', 'declined'] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const { status } = await req.json();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: { status: ['Invalid status value'] } },
      { status: 422 }
    );
  }
  const booking = await Booking.findByIdAndUpdate(
    params.id,
    { status },
    { new: true }
  );
  if (!booking)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: booking });
}
```

---

### 6.10 Media Route

Entirely different — handles `FormData`, not JSON. Uploads to Cloudinary before writing to MongoDB. No slug. See §9 for Cloudinary setup.

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

**File:** `src/app/api/media/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import cloudinary from '@/lib/cloudinary';
import MediaAsset from '@/models/MediaAsset';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const asset = await MediaAsset.findById(params.id);
  if (!asset) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Delete from Cloudinary first, then remove the DB record
  await cloudinary.uploader.destroy(asset.publicId);
  await asset.deleteOne();

  return NextResponse.json({ ok: true });
}
```

---

### 6.11 Validators

Create one file per resource in `src/lib/validators/`.

**`albumValidator.ts`**

```typescript
import { z } from 'zod';
export const AlbumSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  releaseYear: z.number({ required_error: 'Release year is required' }),
  coverImageUrl: z.string().url('Must be a valid URL'),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),
});
export type AlbumInput = z.infer<typeof AlbumSchema>;
```

**`postValidator.ts`**

```typescript
import { z } from 'zod';
export const PostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum(['blog', 'devotional', 'story']).default('blog'),
  body: z.string().min(1, 'Body is required'),
  excerpt: z.string().max(300).optional(),
  coverImageUrl: z.string().url().optional(),
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
  externalLink: z.string().url().optional(),
  isUpcoming: z.boolean().default(true),
  coverImageUrl: z.string().url().optional(),
});
export type EventInput = z.infer<typeof EventSchema>;
```

**`initiativeValidator.ts`**

```typescript
import { z } from 'zod';
export const InitiativeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  body: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  externalLink: z.string().url().optional(),
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
  biographyShort: z.string().max(160, 'Max 160 characters'),
  biographyMedium: z.string().max(500, 'Max 500 characters'),
  biographyLong: z.string(),
  achievements: z.array(z.string()).optional(),
  speakingProfile: z.string().optional(),
  profileImageUrl: z.string().url('Must be a valid URL'),
  socialLinks: z
    .object({
      instagram: z.string().url().optional(),
      youtube: z.string().url().optional(),
      spotify: z.string().url().optional(),
      twitter: z.string().url().optional(),
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

**`songValidator.ts`** (updated full version)

```typescript
import { z } from 'zod';
export const SongSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  albumId: z.string().min(1, 'Album is required'),
  trackNumber: z.number().optional(),
  description: z.string().optional(),
  lyrics: z.string().optional(),
  storyBehindSong: z.string().optional(),
  audioUrl: z.string().url('Must be a valid URL').optional(),
  videoUrl: z.string().url('Must be a valid URL').optional(),
  coverImageUrl: z.string().url('Must be a valid URL').optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(true),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),
});
export type SongInput = z.infer<typeof SongSchema>;
```

---

### 6.12 Key Differences Summary

| Route         | Slug field | Slug source | Query filters     | Special behaviour                                            |
| ------------- | ---------- | ----------- | ----------------- | ------------------------------------------------------------ |
| `songs`       | ✅         | `title`     | `albumId`, `tag`  | Filters by `isPublished` on GET                              |
| `albums`      | ✅         | `title`     | `tag`             | Sorted by `releaseYear` desc                                 |
| `posts`       | ✅         | `title`     | `category`, `tag` | Sets `publishedAt` on publish                                |
| `events`      | ✅         | `title`     | `upcoming`        | Sorted by `date` asc                                         |
| `initiatives` | ✅         | `title`     | none              | —                                                            |
| `tags`        | ✅         | `name`      | none              | DELETE only on `[id]`                                        |
| `artists`     | ❌         | —           | none              | GET returns single record                                    |
| `bookings`    | ❌         | —           | `status`          | PATCH updates status only                                    |
| `media`       | ❌         | —           | none              | Uses `FormData`, not JSON; deletes from Cloudinary on DELETE |

**Section 6 Checklist:**

**Validators** (`src/lib/validators/`)

- [ ] `songValidator.ts`
- [ ] `albumValidator.ts`
- [ ] `postValidator.ts`
- [ ] `eventValidator.ts`
- [ ] `initiativeValidator.ts`
- [ ] `tagValidator.ts`
- [ ] `artistValidator.ts`
- [ ] `bookingValidator.ts`

**Route files** (`src/app/api/`)

- [ ] `songs/route.ts` — GET (filters: `albumId`, `tag`, `isPublished`), POST
- [ ] `songs/[id]/route.ts` — GET, PATCH, DELETE
- [ ] `albums/route.ts` — GET (filters: `tag`), POST
- [ ] `albums/[id]/route.ts` — GET, PATCH, DELETE
- [ ] `posts/route.ts` — GET (filters: `category`, `tag`, `isPublished`), POST
- [ ] `posts/[id]/route.ts` — GET, PATCH, DELETE
- [ ] `events/route.ts` — GET (filters: `upcoming`), POST
- [ ] `events/[id]/route.ts` — GET, PATCH, DELETE
- [ ] `initiatives/route.ts` — GET, POST
- [ ] `initiatives/[id]/route.ts` — GET, PATCH, DELETE
- [ ] `tags/route.ts` — GET, POST
- [ ] `tags/[id]/route.ts` — DELETE only
- [ ] `artists/route.ts` — GET (single record), POST
- [ ] `artists/[id]/route.ts` — PATCH only
- [ ] `bookings/route.ts` — GET (filters: `status`), POST
- [ ] `bookings/[id]/route.ts` — PATCH (status update only)
- [ ] `media/route.ts` — GET, POST (FormData + Cloudinary upload)
- [ ] `media/[id]/route.ts` — DELETE (removes from Cloudinary + MongoDB)

**Verification**

- [ ] `npx tsc --noEmit` — zero TypeScript errors across all route files
- [ ] All routes tested via REST client — correct status codes and response shapes

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

### 7.2 Navbar & Footer

**File:** `src/components/layout/Navbar.tsx` `src/components/layout/Footer.tsx`

```typescript
'use client'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/',         label: 'Home' },
  { href: '/about',    label: 'About' },
  { href: '/music',    label: 'Music' },
  { href: '/blog',     label: 'Blog' },
  { href: '/media',    label: 'Media' },
  { href: '/speaking', label: 'Speaking' },
  { href: '/impact',   label: 'Impact' },
  { href: '/booking',  label: 'Book' },
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

| Page Type                  | Strategy                                  | Reason                         |
| -------------------------- | ----------------------------------------- | ------------------------------ |
| Home, About, Music List    | Server Component + `generateStaticParams` | SEO + performance              |
| Song / Post / Album detail | Server Component + ISR (revalidate: 3600) | Fresh content, cacheable       |
| Search / Filter            | Client Component                          | Real-time interaction          |
| CMS dashboard + forms      | Client Component                          | Full interactivity, form state |
| Booking form               | Client Component                          | Form state management          |

**Section 7 Checklist:**

- [x] `src/app/layout.tsx` — root layout with Navbar and Footer wired up
- [x] `src/components/layout/Navbar.tsx` — responsive, mobile menu working
- [x] `src/components/layout/Footer.tsx` — created
- [x] `src/components/layout/PageWrapper.tsx` — created
- [x] `src/components/ui/Button.tsx` — created
- [x] `src/components/ui/Input.tsx` — created
- [x] `src/components/ui/Tag.tsx` — created
- [x] `src/components/ui/LoadingSpinner.tsx` — created
- [x] `src/components/music/AlbumCard.tsx` — created
- [x] `src/components/music/SongCard.tsx` — created
- [x] `src/components/music/AudioPlayer.tsx` — created
- [x] `src/components/content/PostCard.tsx` — created
- [x] `src/components/content/RichText.tsx` — created
- [x] `src/components/media/MediaCard.tsx` — created
- [x] `src/components/seo/MetaTags.tsx` — created
- [x] `npm run dev` renders root layout with Navbar and Footer, no console errors

---

## 8. Page Implementation ✅

### 8.1 Home Page — `src/app/(public)/page.tsx`

```typescript
import { connectDB } from '@/lib/mongodb'
import Song from '@/models/Song'
import Post from '@/models/Post'

export const revalidate = 3600

export default async function HomePage() {
  await connectDB()

  const [latestSongs, latestPosts] = await Promise.all([
    Song.find({ isPublished: true }).sort({ createdAt: -1 }).limit(3).lean(),
    Post.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(3).lean(),
  ])

  return (
    <div>
      {/* Hero section */}
      <section className="min-h-[90vh] flex items-center justify-center bg-brand-deep text-white text-center px-6">
        <div>
          <h1 className="font-serif text-5xl md:text-7xl text-brand-teal mb-4">Glowreeyah</h1>
          <p className="text-xl md:text-2xl text-brand-warm">Music. Ministry. Movement.</p>
        </div>
      </section>

      {/* Latest music section */}
      {/* Latest posts section */}
    </div>
  )
}
```

Follow the same Server Component data-fetching pattern for all public pages.

---

### 8.2 Dynamic Route Example — Song Detail

**File:** `src/app/(public)/music/[albumSlug]/[songSlug]/page.tsx`

```typescript
import { connectDB } from '@/lib/mongodb';
import Song from '@/models/Song';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: { albumSlug: string; songSlug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const song = await Song.findOne({ slug: params.songSlug }).lean();
  if (!song) return {};
  return {
    title: song.seo?.metaTitle || song.title,
    description: song.seo?.metaDescription || song.description,
  };
}

export default async function SongPage({ params }: Props) {
  await connectDB();
  const song = await Song.findOne({ slug: params.songSlug })
    .populate('albumId')
    .populate('tags')
    .lean();

  if (!song) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-serif text-4xl text-brand-deep mb-2">{song.title}</h1>
      {song.audioUrl && (
        <audio controls src={song.audioUrl} className="w-full my-6" />
      )}
      {song.lyrics && (
        <section>
          <h2 className="font-serif text-2xl mb-4">Lyrics</h2>
          <pre className="whitespace-pre-wrap font-sans">{song.lyrics}</pre>
        </section>
      )}
    </article>
  );
}
```

**Section 8 Checklist:**

- [x] `src/app/(public)/page.tsx` — hero renders, no console errors
- [x] `src/app/(public)/about/page.tsx` — loads with fallback UI when no artist document exists
- [x] `src/app/(public)/music/page.tsx` — loads with empty state, no errors
- [x] `src/app/(public)/music/[albumSlug]/page.tsx` — 404s correctly on unknown slug
- [x] `src/app/(public)/music/[albumSlug]/[songSlug]/page.tsx` — 404s correctly on unknown slug
- [x] `src/app/(public)/blog/page.tsx` — loads with empty state, no errors
- [x] `src/app/(public)/blog/[slug]/page.tsx` — 404s correctly on unknown slug
- [x] `src/app/(public)/media/page.tsx` — loads with empty state, no errors
- [x] `src/app/(public)/speaking/page.tsx` — loads with empty state, no errors
- [x] `src/app/(public)/booking/page.tsx` — form renders and submits without errors
- [x] `src/app/(public)/impact/page.tsx` — loads with empty state, no errors
- [x] `src/app/(public)/tag/[slug]/page.tsx` — 404s correctly on unknown slug
- [x] `generateMetadata()` implemented on all dynamic routes
- [x] `notFound()` used on slug-based routes, fallback UI used on single-document routes
- [ ] All pages re-verified with live data after CMS is built in §10

> Full data rendering will be verified in §13 Testing after the CMS is complete and the database is seeded.

- [ ] All pages verified at correct URLs in browser with no console errors

---

## 9. Media Integration ⬜

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
import cloudinary from '@/lib/cloudinary';
import { connectDB } from '@/lib/mongodb';
import MediaAsset from '@/models/MediaAsset';

export async function POST(req: NextRequest) {
  await connectDB();
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const altText = formData.get('altText') as string;
  const type = formData.get('type') as string;

  if (!altText) {
    return NextResponse.json(
      { error: 'Alt text is required' },
      { status: 422 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadResult = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'glowreeyah', resource_type: 'auto' },
      (err, result) => (err ? reject(err) : resolve(result))
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

---

### 9.3 Storage Rules (enforced)

| Data        | Location                       |
| ----------- | ------------------------------ |
| Image files | Cloudinary (object storage)    |
| Audio files | Cloudinary or S3               |
| Video files | Cloudinary or YouTube embed    |
| File URLs   | MongoDB (`MediaAsset.url`)     |
| Alt text    | MongoDB (`MediaAsset.altText`) |
| Binary data | **Never stored in MongoDB**    |

**Section 9 Checklist:**

- [ ] `src/lib/cloudinary.ts` created with correct env var references
- [ ] `src/app/api/media/route.ts` POST handler uploads to Cloudinary successfully
- [ ] `MediaAsset` document created in MongoDB after upload (URL, publicId, altText, type)
- [ ] Upload blocked with `422` when `altText` is missing
- [ ] `next.config.ts` updated with Cloudinary `remotePatterns`
- [ ] All `<img>` tags replaced with `next/image` using Cloudinary URLs
- [ ] Test upload end-to-end: file → Cloudinary → URL resolves in browser

---

## 10. CMS — Content Management System ⬜

The CMS is a protected section of the same Next.js application, served at `/cms/*`. It shares the MongoDB database, models, API routes, and Cloudinary config with the public frontend — no separate service, no separate deployment.

---

### 10.1 CMS Architecture

```
/cms/* routes  →  (cms) route group  →  CMS layout (sidebar + topbar)
                                         ↓
                                   Client Components
                                   (forms, tables, editors)
                                         ↓
                               /api/* route handlers  (shared)
                                         ↓
                                   MongoDB Atlas  (shared)
                                   Cloudinary     (shared)
```

The `(cms)` route group uses a dedicated layout with sidebar navigation. It is completely isolated from the public `(public)` route group — they share no layout but share all backend resources.

---

### 10.2 Authentication

The CMS uses **NextAuth.js** with a Credentials provider for v1.0. This replaces the earlier secret-token approach and gives proper session management, logout, and extensibility to OAuth providers in future.

**Install NextAuth:**

```bash
npm install next-auth
```

**Add to `.env.local`:**

```env
NEXTAUTH_SECRET=your_random_32_char_string
NEXTAUTH_URL=http://localhost:3000

CMS_ADMIN_EMAIL=admin@glowreeyah.com
CMS_ADMIN_PASSWORD=your_secure_password
```

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
  pages: {
    signIn: '/cms/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
```

---

### 10.3 CMS Middleware

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

This redirects any unauthenticated request to `/cms/*` (except `/cms/login`) to the login page.

---

### 10.4 CMS Layout

**File:** `src/app/(cms)/layout.tsx`

```typescript
import CMSSidebar from '@/components/cms/CMSSidebar'
import CMSTopbar  from '@/components/cms/CMSTopbar'

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <CMSSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <CMSTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

### 10.5 CMS Sidebar

**File:** `src/components/cms/CMSSidebar.tsx`

```typescript
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/cms/dashboard',    label: 'Dashboard',   icon: '⊞' },
  { href: '/cms/posts',        label: 'Posts',        icon: '✎' },
  { href: '/cms/songs',        label: 'Songs',        icon: '♪' },
  { href: '/cms/albums',       label: 'Albums',       icon: '◉' },
  { href: '/cms/events',       label: 'Events',       icon: '◷' },
  { href: '/cms/initiatives',  label: 'Initiatives',  icon: '◈' },
  { href: '/cms/media',        label: 'Media',        icon: '⊡' },
  { href: '/cms/bookings',     label: 'Bookings',     icon: '✉' },
  { href: '/cms/tags',         label: 'Tags',         icon: '#' },
  { href: '/cms/artist',       label: 'Artist Profile', icon: '✦' },
]

export default function CMSSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-brand-deep text-white flex flex-col shrink-0">
      <div className="px-6 py-5 border-b border-white/10">
        <span className="text-brand-teal font-serif font-bold text-lg">Glowreeyah</span>
        <p className="text-white/40 text-xs mt-0.5">Content Studio</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(item => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                ${active
                  ? 'bg-brand-teal/20 text-brand-teal'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-4 py-4 border-t border-white/10 text-xs text-white/30">
        CMS v1.0
      </div>
    </aside>
  )
}
```

---

### 10.6 CMS Topbar

**File:** `src/components/cms/CMSTopbar.tsx`

```typescript
'use client'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export default function CMSTopbar() {
  const { data: session } = useSession()

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="text-sm text-gray-500 hover:text-brand-teal transition-colors"
        >
          View site ↗
        </Link>
        <span className="text-sm text-gray-600">{session?.user?.email}</span>
        <button
          onClick={() => signOut({ callbackUrl: '/cms/login' })}
          className="text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
```

---

### 10.7 Dashboard Page

**File:** `src/app/(cms)/dashboard/page.tsx`

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

### 10.8 Content List Page Pattern

Every content type (songs, posts, albums, etc.) follows this pattern for its list page.

**Example — Posts List:** `src/app/(cms)/posts/page.tsx`

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
        <table className="w-full text-sm">
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
                <td className="px-4 py-3 font-medium text-brand-deep">{post.title}</td>
                <td className="px-4 py-3 text-gray-500 capitalize">{post.category}</td>
                <td className="px-4 py-3">
                  <StatusBadge published={post.isPublished} />
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/cms/posts/${post._id}`}
                    className="text-brand-teal hover:underline text-xs"
                  >
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

Apply the same pattern for songs, albums, events, initiatives, and tags.

---

### 10.9 Content Form Pattern

Create and Edit pages share the same Client Component form. The page passes either empty defaults (new) or fetched data (edit).

**Example — Post Form:** `src/components/cms/PostForm.tsx`

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
  post?: any      // undefined = new, populated = edit
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
    tags:          post?.tags          ?? [],
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
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        />
      </div>

      {/* Slug */}
      <SlugField
        sourceValue={form.title}
        value={form.slug}
        onChange={slug => setForm(f => ({ ...f, slug }))}
      />

      {/* Category */}
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

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
        <textarea
          rows={2}
          value={form.excerpt}
          onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-teal outline-none"
        />
      </div>

      {/* Body */}
      <RichTextEditor
        value={form.body}
        onChange={body => setForm(f => ({ ...f, body }))}
      />

      {/* Cover Image */}
      <MediaPicker
        value={form.coverImageUrl}
        onChange={url => setForm(f => ({ ...f, coverImageUrl: url }))}
      />

      {/* Tags */}
      <TagSelector
        allTags={tags}
        selected={form.tags}
        onChange={tags => setForm(f => ({ ...f, tags }))}
      />

      {/* Publish */}
      <PublishToggle
        value={form.isPublished}
        onChange={val => setForm(f => ({ ...f, isPublished: val }))}
      />

      {/* Actions */}
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

### 10.10 Shared CMS Components

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

### 10.11 Rich Text Editor

Use the `@uiw/react-md-editor` package for markdown-based rich text. It is lightweight, has no server-side dependencies, and outputs clean markdown stored as a string in MongoDB.

```bash
npm install @uiw/react-md-editor
```

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

On the public frontend, render markdown with:

```bash
npm install react-markdown
```

```typescript
import ReactMarkdown from 'react-markdown'
// ...
<ReactMarkdown>{post.body}</ReactMarkdown>
```

---

### 10.12 Media Upload & Browser

**File:** `src/app/(cms)/media/page.tsx`

```typescript
'use client'
import { useState, useEffect } from 'react'
import MediaUploader from '@/components/cms/MediaUploader'

export default function CMSMediaPage() {
  const [assets, setAssets] = useState<any[]>([])

  async function load() {
    const res  = await fetch('/api/media')
    const data = await res.json()
    setAssets(data.data)
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-brand-deep mb-6">Media Library</h1>
      <MediaUploader onUploaded={load} />
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8">
        {assets.map((a: any) => (
          <div key={a._id} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img src={a.url} alt={a.altText} className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => navigator.clipboard.writeText(a.url)}
                className="text-white text-xs bg-brand-teal px-2 py-1 rounded"
              >
                Copy URL
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

### 10.13 Bookings Manager

**File:** `src/app/(cms)/bookings/page.tsx`

```typescript
import { connectDB } from '@/lib/mongodb'
import Booking from '@/models/Booking'
import StatusBadge from '@/components/cms/StatusBadge'

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

### 10.14 CMS Route Summary

| Route                   | Purpose               | Component Type          |
| ----------------------- | --------------------- | ----------------------- |
| `/cms/login`            | Authentication        | Client                  |
| `/cms/dashboard`        | Overview stats        | Server                  |
| `/cms/posts`            | List all posts        | Server                  |
| `/cms/posts/new`        | Create post           | Client (PostForm)       |
| `/cms/posts/[id]`       | Edit post             | Client (PostForm)       |
| `/cms/songs`            | List all songs        | Server                  |
| `/cms/songs/new`        | Create song           | Client (SongForm)       |
| `/cms/songs/[id]`       | Edit song             | Client (SongForm)       |
| `/cms/albums`           | List all albums       | Server                  |
| `/cms/albums/new`       | Create album          | Client (AlbumForm)      |
| `/cms/albums/[id]`      | Edit album            | Client (AlbumForm)      |
| `/cms/events`           | List all events       | Server                  |
| `/cms/events/new`       | Create event          | Client (EventForm)      |
| `/cms/events/[id]`      | Edit event            | Client (EventForm)      |
| `/cms/initiatives`      | List initiatives      | Server                  |
| `/cms/initiatives/new`  | Create initiative     | Client (InitiativeForm) |
| `/cms/initiatives/[id]` | Edit initiative       | Client (InitiativeForm) |
| `/cms/media`            | Upload + browse media | Client                  |
| `/cms/bookings`         | View submissions      | Server                  |
| `/cms/tags`             | Manage tags           | Client                  |
| `/cms/artist`           | Edit artist profile   | Client                  |

**Section 10 Checklist:**

- [ ] `next-auth`, `@uiw/react-md-editor`, `react-markdown` installed
- [ ] `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `CMS_ADMIN_EMAIL`, `CMS_ADMIN_PASSWORD` added to `.env.local`
- [ ] `src/app/api/auth/[...nextauth]/route.ts` created
- [ ] `src/middleware.ts` updated to use `withAuth`
- [ ] `src/app/(cms)/layout.tsx` created
- [ ] `src/components/cms/CMSSidebar.tsx` created — all nav links present, active state highlights
- [ ] `src/components/cms/CMSTopbar.tsx` created — logout works, "View site" link opens public site
- [ ] `src/components/cms/CMSPageHeader.tsx` created
- [ ] `src/components/cms/StatusBadge.tsx` created
- [ ] `src/components/cms/ConfirmDialog.tsx` created
- [ ] `src/components/cms/SlugField.tsx` created — auto-generates from title
- [ ] `src/components/cms/PublishToggle.tsx` created
- [ ] `src/components/cms/TagSelector.tsx` created
- [ ] `src/components/cms/RichTextEditor.tsx` created — renders markdown editor
- [ ] `src/components/cms/MediaPicker.tsx` created
- [ ] `src/components/cms/MediaUploader.tsx` created
- [ ] `src/app/(cms)/login/page.tsx` — login form works with correct credentials
- [ ] `src/app/(cms)/dashboard/page.tsx` — stat counts render correctly
- [ ] `src/components/cms/PostForm.tsx` + posts list/new/[id] pages — full CRUD working
- [ ] `src/components/cms/SongForm.tsx` + songs list/new/[id] pages — full CRUD working
- [ ] `src/components/cms/AlbumForm.tsx` + albums list/new/[id] pages — full CRUD working
- [ ] `src/components/cms/EventForm.tsx` + events list/new/[id] pages — full CRUD working
- [ ] `src/components/cms/InitiativeForm.tsx` + initiatives list/new/[id] pages — full CRUD working
- [ ] `src/app/(cms)/media/page.tsx` — upload works, grid renders, URL copyable
- [ ] `src/app/(cms)/bookings/page.tsx` — submission list renders with status colours
- [ ] `src/app/(cms)/tags/page.tsx` — tag create and delete working
- [ ] `src/app/(cms)/artist/page.tsx` — artist profile editable and saves to DB
- [ ] Unauthenticated visit to `/cms/dashboard` redirects to `/cms/login` ✓
- [ ] Logout clears session and redirects to `/cms/login` ✓
- [ ] Content created in CMS appears on public frontend ✓
- [ ] `/cms/*` confirmed disallowed in `robots.txt` ✓

---

## 11. SEO Implementation ⬜

### 11.1 Metadata Per Page

Implement `generateMetadata()` on every dynamic route returning:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: seo.metaTitle || content.title,
    description: seo.metaDescription || content.excerpt,
    openGraph: {
      title: seo.metaTitle || content.title,
      description: seo.metaDescription || content.excerpt,
      images: [{ url: content.coverImageUrl }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.metaTitle || content.title,
      description: seo.metaDescription || content.excerpt,
      images: [content.coverImageUrl],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.slug}`,
    },
  };
}
```

---

### 11.2 Sitemap

**File:** `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/mongodb';
import Song from '@/models/Song';
import Post from '@/models/Post';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const songs = await Song.find({ isPublished: true })
    .select('slug updatedAt')
    .lean();
  const posts = await Post.find({ isPublished: true })
    .select('slug updatedAt')
    .lean();

  const BASE = process.env.NEXT_PUBLIC_SITE_URL!;

  return [
    { url: BASE, lastModified: new Date() },
    { url: `${BASE}/about`, lastModified: new Date() },
    { url: `${BASE}/music`, lastModified: new Date() },
    { url: `${BASE}/blog`, lastModified: new Date() },
    ...songs.map((s) => ({
      url: `${BASE}/music/${s.slug}`,
      lastModified: s.updatedAt,
    })),
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updatedAt,
    })),
  ];
}
```

---

### 11.3 Robots.txt

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

**Section 11 Checklist:**

- [ ] `generateMetadata()` implemented on every dynamic public route (songs, posts, albums, events, tags)
- [ ] Open Graph `title`, `description`, and `images` present on all content pages
- [ ] Twitter Card metadata present on all content pages
- [ ] Canonical URLs correct — no duplicate or missing canonicals
- [ ] JSON-LD structured data added to song pages (`MusicRecording`)
- [ ] JSON-LD structured data added to post pages (`Article`)
- [ ] JSON-LD structured data added to event pages (`Event`)
- [ ] `src/app/sitemap.ts` created — `/sitemap.xml` resolves and includes all published songs and posts
- [ ] `src/app/robots.ts` created — `/robots.txt` resolves, `/cms/` is disallowed
- [ ] Test metadata in browser DevTools → Elements → `<head>` for a song and post page

---

## 12. Performance & Accessibility ⬜

### Performance Checklist

- [ ] `next/image` used for all images — no raw `<img>` tags in public pages
- [ ] `next/font` used for Inter — no layout shift on load
- [ ] `loading="lazy"` on all video embeds
- [ ] `revalidate` set on all Server Component content pages
- [ ] Client Component usage minimised — no unnecessary `'use client'` in content pages
- [ ] `npm run build` output reviewed — no large bundle warnings
- [ ] Lighthouse Performance score ≥ 90 on Home, Music, and Blog pages

### Accessibility Checklist

- [ ] All images have `alt` text — enforced at upload time in CMS
- [ ] Semantic HTML used throughout: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`
- [ ] Colour contrast ratio ≥ 4.5:1 verified for body text against backgrounds
- [ ] Keyboard navigation works on Navbar, booking form, and CMS forms
- [ ] `aria-label` on icon-only buttons (Navbar mobile menu toggle, etc.)
- [ ] Skip navigation link present at top of root layout
- [ ] Lighthouse Accessibility score ≥ 90

---

## 13. Testing ⬜

### 13.1 Manual Testing Checklist

Before each deployment, verify:

- [ ] All public pages load without errors
- [ ] Dynamic routes resolve correctly (music, blog, tags)
- [ ] API routes return correct status codes
- [ ] Media uploads succeed and URLs resolve
- [ ] CMS CRUD operations work for all content types
- [ ] CMS login, logout, and session expiry work correctly
- [ ] Mobile layout renders correctly at 375px width
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`

---

## 14. Deployment ⬜

### 14.1 Pre-Deployment Steps

Complete these steps before deploying for the first time:

- [ ] All environment variables confirmed working locally in `.env.local`
- [ ] MongoDB Atlas cluster running, connection string valid
- [ ] Cloudinary credentials active and upload tested
- [ ] All code pushed to `main` branch on GitHub
- [ ] `npm run build` passes locally with zero errors
- [ ] `npx tsc --noEmit` passes with zero TypeScript errors

---

### 14.2 Deploy to Vercel

**Step 1 — Log in to Vercel**

Go to https://vercel.com and log in with your GitHub account.

**Step 2 — Import repository**

- Click **"Add New Project"**
- Select **"Import Git Repository"**
- Find and select `glowreeyah-platform`
- Click **"Import"**

**Step 3 — Configure project settings**

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `./` (default)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)

**Step 4 — Add environment variables**

In the "Environment Variables" section, add all variables from your `.env.local` file one by one:

| Key                                 | Value                                                  |
| ----------------------------------- | ------------------------------------------------------ |
| `MONGODB_URI`                       | Your Atlas connection string                           |
| `CLOUDINARY_CLOUD_NAME`             | Your Cloudinary cloud name                             |
| `CLOUDINARY_API_KEY`                | Your Cloudinary API key                                |
| `CLOUDINARY_API_SECRET`             | Your Cloudinary API secret                             |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name                             |
| `NEXT_PUBLIC_SITE_URL`              | Your production domain (e.g. `https://glowreeyah.com`) |
| `NEXT_PUBLIC_SITE_NAME`             | `Glowreeyah`                                           |
| `NEXTAUTH_SECRET`                   | A strong random 32-character string                    |
| `NEXTAUTH_URL`                      | Your production domain (e.g. `https://glowreeyah.com`) |
| `CMS_ADMIN_EMAIL`                   | CMS login email                                        |
| `CMS_ADMIN_PASSWORD`                | CMS login password                                     |

**Step 5 — Deploy**

Click **"Deploy"**. Vercel will build and deploy the application. This takes 2–5 minutes.

**Step 6 — Add custom domain (optional)**

- Go to **Project → Settings → Domains**
- Add your custom domain (e.g. `glowreeyah.com`)
- Follow DNS configuration instructions for your registrar

---

### 14.3 Subsequent Deployments

All future deployments are automatic. Any push to the `main` branch triggers a production deployment on Vercel. Pushes to other branches create Preview deployments.

To manually trigger a deployment:

```bash
git add .
git commit -m "your commit message"
git push origin main
```

---

### 14.4 MongoDB Atlas Production Configuration

1. Go to https://cloud.mongodb.com
2. Select your cluster → **Network Access**
3. Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) for Vercel (Vercel uses dynamic IPs)
4. Confirm your database user has **readWrite** permission on the `glowreeyah` database
5. Enable **Atlas backups** on your cluster (recommended)

**Section 14 Checklist:**

- [ ] `npm run build` passes locally — zero errors
- [ ] `npx tsc --noEmit` passes — zero TypeScript errors
- [ ] Code pushed to `main` branch on GitHub
- [ ] Repository imported into Vercel
- [ ] All environment variables added to Vercel dashboard (all 11 vars from Appendix C)
- [ ] `NEXTAUTH_URL` updated to production domain in Vercel (not `localhost`)
- [ ] `NEXT_PUBLIC_SITE_URL` updated to production domain in Vercel
- [ ] First deployment successful — production URL loads
- [ ] MongoDB Atlas Network Access set to `0.0.0.0/0`
- [ ] Database user has `readWrite` permission on `glowreeyah` database
- [ ] Atlas automated backups enabled
- [ ] Custom domain configured (if applicable) and DNS propagated
- [ ] Production URL loads public frontend correctly
- [ ] `/cms/login` accessible on production domain
- [ ] Future pushes to `main` trigger automatic Vercel deployments ✓

---

## 15. Content Migration ⬜

### 15.1 WordPress Export

**Step 1 — Export from WordPress**

In your WordPress admin:

- Go to **Tools → Export**
- Select **All Content**
- Download the `.xml` export file

**Step 2 — Parse the export**

Install a WordPress XML parser locally:

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

**Step 3 — Upload media**

For each image URL in the WordPress export:

1. Download the image
2. Upload to Cloudinary via the upload API
3. Record the new Cloudinary URL in the `MediaAsset` collection
4. Update all references in content

**Step 4 — Validate migrated content**

- Count posts: compare WordPress post count vs MongoDB document count
- Spot-check 10 random posts for content integrity
- Confirm all images resolve (no broken URLs)
- Check all slugs are unique

**Section 15 Checklist:**

- [ ] WordPress `.xml` export downloaded
- [ ] `scripts/migrate.ts` written and tested locally against dev DB
- [ ] All posts imported — document count matches WordPress export count
- [ ] All media downloaded from WordPress and uploaded to Cloudinary
- [ ] `MediaAsset` records created for each migrated media file
- [ ] All post body image references updated to Cloudinary URLs
- [ ] 10 random posts spot-checked for content accuracy
- [ ] Zero broken image URLs in production
- [ ] All slugs unique — no duplicate key errors in MongoDB
- [ ] Migrated content visible and rendering correctly on production frontend

---

## 16. Post-Launch ⬜

### Immediate (Day 1)

- [ ] Verify Google Search Console ownership
- [ ] Submit sitemap: `https://search.google.com/search-console` → Sitemaps → `https://glowreeyah.com/sitemap.xml`
- [ ] Lighthouse audit run on production — Performance ≥ 90, SEO = 100, Accessibility ≥ 90
- [ ] CMS login confirmed working on production domain (`/cms/login`)
- [ ] All CMS CRUD operations tested end-to-end on production
- [ ] Booking form tested on production — submission appears in `/cms/bookings`

### Week 1

- [ ] Vercel deployment logs reviewed — no runtime errors
- [ ] MongoDB Atlas metrics reviewed — connection count and query times normal
- [ ] Cloudinary usage reviewed against free tier limits
- [ ] Initial user feedback collected and logged

### Ongoing

- [ ] Booking submissions reviewed and actioned weekly
- [ ] New blog / devotional content published via CMS (`/cms/posts`)
- [ ] SEO rankings monitored monthly
- [ ] Dependencies updated monthly: `npm outdated` → update and re-test

---

## Appendix A — File Creation Order

Execute file creation in this sequence to avoid import errors:

1. `src/lib/mongodb.ts`
2. `src/lib/cloudinary.ts`
3. `src/lib/utils.ts`
4. `src/models/*.ts` (all models)
5. `src/app/api/**/*.ts` (all route handlers, including `api/auth/[...nextauth]/route.ts`)
6. `src/components/layout/*.tsx`
7. `src/components/ui/*.tsx`
8. `src/components/cms/*.tsx` (sidebar, topbar, forms, shared components)
9. `src/components/music/*.tsx`
10. `src/components/content/*.tsx`
11. `src/app/(cms)/layout.tsx`
12. `src/app/(cms)/login/page.tsx`
13. `src/app/(cms)/dashboard/page.tsx`
14. `src/app/(cms)/**/*.tsx` (all CMS pages)
15. `src/app/layout.tsx`
16. `src/app/(public)/page.tsx`
17. `src/app/(public)/**/*.tsx` (all public pages)
18. `src/app/sitemap.ts`
19. `src/app/robots.ts`
20. `src/middleware.ts`

---

## Appendix B — Quick Reference Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Check for TypeScript errors
npx tsc --noEmit

# Lint
npm run lint

# Format code
npx prettier --write src/
```

---

## Appendix C — Environment Variable Checklist

| Variable                            | Required | Used In                 |
| ----------------------------------- | -------- | ----------------------- |
| `MONGODB_URI`                       | ✅       | `src/lib/mongodb.ts`    |
| `CLOUDINARY_CLOUD_NAME`             | ✅       | `src/lib/cloudinary.ts` |
| `CLOUDINARY_API_KEY`                | ✅       | `src/lib/cloudinary.ts` |
| `CLOUDINARY_API_SECRET`             | ✅       | `src/lib/cloudinary.ts` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅       | Client components       |
| `NEXT_PUBLIC_SITE_URL`              | ✅       | SEO, sitemap            |
| `NEXT_PUBLIC_SITE_NAME`             | ✅       | Metadata                |
| `NEXTAUTH_SECRET`                   | ✅       | CMS auth                |
| `NEXTAUTH_URL`                      | ✅       | CMS auth                |
| `CMS_ADMIN_EMAIL`                   | ✅       | CMS login credentials   |
| `CMS_ADMIN_PASSWORD`                | ✅       | CMS login credentials   |

---

_This document supersedes all previous implementation notes. For feature definitions see `features.md`. For brand and architectural constraints see `constitution.md`._
