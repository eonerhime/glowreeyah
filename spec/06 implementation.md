# Implementation Guide

**Project:** Glowreeyah Digital Platform
**Document Type:** Software Design Document (SDD) — Single Source of Truth
**Version:** 1.0.0
**Last Updated:** 2026-03-28
**Status:** Active

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
10. [Admin System](#10-admin-system)
11. [SEO Implementation](#11-seo-implementation)
12. [Performance & Accessibility](#12-performance--accessibility)
13. [Testing](#13-testing)
14. [Deployment](#14-deployment)
15. [Content Migration](#15-content-migration)
16. [Post-Launch](#16-post-launch)

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT (Browser)                  │
│         Next.js App Router — RSC + Client           │
└────────────────────┬────────────────────────────────┘
                     │ HTTP / fetch
┌────────────────────▼────────────────────────────────┐
│              Next.js API Routes (/api/*)             │
│                  Route Handlers                      │
└──────────┬──────────────────────┬───────────────────┘
           │                      │
┌──────────▼──────┐    ┌──────────▼──────────────────┐
│   MongoDB Atlas  │    │   Object Storage             │
│  (Structured     │    │   Cloudinary / S3 / Supabase │
│   metadata)      │    │   (Images, Audio, Video)     │
└─────────────────┘    └──────────────────────────────┘
```

**Deployment targets:**
- Frontend + API routes → Vercel
- Database → MongoDB Atlas
- Media → Cloudinary (primary recommendation)

---

## 2. Tech Stack & Dependencies

### Core

| Package | Version | Purpose |
|---|---|---|
| `next` | 14.x | Framework (App Router) |
| `react` | 18.x | UI runtime |
| `react-dom` | 18.x | DOM rendering |
| `typescript` | 5.x | Type safety |
| `tailwindcss` | 3.x | Utility-first styling |

### Database

| Package | Version | Purpose |
|---|---|---|
| `mongoose` | 8.x | MongoDB ODM |

### Media

| Package | Version | Purpose |
|---|---|---|
| `cloudinary` | 2.x | Media upload + delivery |
| `@next/third-parties` | latest | Optimised embeds |

### Utilities

| Package | Version | Purpose |
|---|---|---|
| `slugify` | 1.x | URL-safe slug generation |
| `zod` | 3.x | Schema validation |
| `next-seo` | 6.x | SEO helpers (optional) |

### Dev Dependencies

| Package | Purpose |
|---|---|
| `eslint` | Linting |
| `prettier` | Code formatting |
| `@types/node` | Node type definitions |
| `@types/react` | React type definitions |

---

## 3. Environment Setup

### 3.1 Prerequisites

Ensure the following are installed on your local machine before starting:

| Tool | Minimum Version | Install |
|---|---|---|
| Node.js | 18.17.0 | https://nodejs.org |
| npm | 9.x | Bundled with Node |
| Git | 2.x | https://git-scm.com |

Verify installations:

```bash
node --version
npm --version
git --version
```

---

### 3.2 Accounts Required

Create accounts on these platforms before proceeding:

1. **MongoDB Atlas** — https://cloud.mongodb.com
   - Create a free M0 cluster
   - Create a database user (username + password)
   - Whitelist your IP address (or use `0.0.0.0/0` for development)
   - Copy the connection string

2. **Cloudinary** — https://cloudinary.com
   - Create a free account
   - Note your: Cloud Name, API Key, API Secret

3. **Vercel** — https://vercel.com
   - Create a free account
   - Connect to your GitHub account

4. **GitHub** — https://github.com
   - Create a new private repository named `glowreeyah-platform`

---

### 3.3 Environment Variables

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

# Admin Auth (change before production)
ADMIN_SECRET=your_secure_random_string
```

Add `.env.local` to `.gitignore`:

```bash
echo ".env.local" >> .gitignore
```

---

## 4. Project Scaffolding

### 4.1 Create the Next.js Application

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

---

### 4.2 Install Dependencies

```bash
npm install mongoose slugify zod cloudinary
npm install --save-dev prettier @types/node
```

---

### 4.3 Directory Structure

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
│   ├── admin/
│   │   └── page.tsx
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
mkdir -p src/app/admin
mkdir -p src/app/api/{artists,albums,songs,posts,media,events,initiatives,bookings,tags}
mkdir -p src/components/{layout,music,content,media,ui,seo}
mkdir -p src/lib src/models src/services
```

---

### 4.4 Tailwind Configuration

Replace `tailwind.config.ts` with:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold:   '#C9A84C',
          deep:   '#1A1A2E',
          warm:   '#F5EDE0',
          accent: '#8B5CF6',
        },
      },
      fontFamily: {
        serif:  ['Georgia', 'serif'],
        sans:   ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

---

## 5. Database Design

### 5.1 MongoDB Connection

**File:** `src/lib/mongodb.ts`

```typescript
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined')
}

let cached = (global as any).mongoose ?? { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
```

---

### 5.2 Data Models

#### Artist — `src/models/Artist.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose'

export interface IArtist extends Document {
  name: string
  slugName: string
  biographyShort: string
  biographyMedium: string
  biographyLong: string
  achievements: string[]
  speakingProfile: string
  profileImageUrl: string
  socialLinks: {
    instagram?: string
    youtube?: string
    spotify?: string
    twitter?: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
  }
  updatedAt: Date
}

const ArtistSchema = new Schema<IArtist>({
  name:              { type: String, required: true },
  slugName:          { type: String, required: true, unique: true },
  biographyShort:    { type: String, required: true, maxlength: 160 },
  biographyMedium:   { type: String, required: true, maxlength: 500 },
  biographyLong:     { type: String, required: true },
  achievements:      [{ type: String }],
  speakingProfile:   { type: String },
  profileImageUrl:   { type: String, required: true },
  socialLinks:       {
    instagram: String,
    youtube:   String,
    spotify:   String,
    twitter:   String,
  },
  seo: {
    metaTitle:       String,
    metaDescription: String,
  },
}, { timestamps: true })

export default mongoose.models.Artist || mongoose.model<IArtist>('Artist', ArtistSchema)
```

---

#### Album — `src/models/Album.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose'

export interface IAlbum extends Document {
  title: string
  slug: string
  releaseYear: number
  coverImageUrl: string
  description: string
  tags: mongoose.Types.ObjectId[]
  seo: { metaTitle: string; metaDescription: string }
}

const AlbumSchema = new Schema<IAlbum>({
  title:         { type: String, required: true },
  slug:          { type: String, required: true, unique: true },
  releaseYear:   { type: Number, required: true },
  coverImageUrl: { type: String, required: true },
  description:   { type: String },
  tags:          [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  seo: {
    metaTitle:       String,
    metaDescription: String,
  },
}, { timestamps: true })

export default mongoose.models.Album || mongoose.model<IAlbum>('Album', AlbumSchema)
```

---

#### Song — `src/models/Song.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose'

export interface ISong extends Document {
  title: string
  slug: string
  albumId: mongoose.Types.ObjectId
  trackNumber: number
  description: string
  lyrics: string
  storyBehindSong: string
  audioUrl: string
  videoUrl: string
  coverImageUrl: string
  tags: mongoose.Types.ObjectId[]
  isPublished: boolean
  seo: { metaTitle: string; metaDescription: string }
}

const SongSchema = new Schema<ISong>({
  title:            { type: String, required: true },
  slug:             { type: String, required: true, unique: true },
  albumId:          { type: Schema.Types.ObjectId, ref: 'Album', required: true },
  trackNumber:      { type: Number },
  description:      { type: String },
  lyrics:           { type: String },
  storyBehindSong:  { type: String },
  audioUrl:         { type: String },
  videoUrl:         { type: String },
  coverImageUrl:    { type: String },
  tags:             [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  isPublished:      { type: Boolean, default: true },
  seo: {
    metaTitle:       String,
    metaDescription: String,
  },
}, { timestamps: true })

export default mongoose.models.Song || mongoose.model<ISong>('Song', SongSchema)
```

---

#### Post — `src/models/Post.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose'

export interface IPost extends Document {
  title: string
  slug: string
  category: 'blog' | 'devotional' | 'story'
  body: string
  excerpt: string
  coverImageUrl: string
  tags: mongoose.Types.ObjectId[]
  isPublished: boolean
  publishedAt: Date
  seo: { metaTitle: string; metaDescription: string }
}

const PostSchema = new Schema<IPost>({
  title:         { type: String, required: true },
  slug:          { type: String, required: true, unique: true },
  category:      { type: String, enum: ['blog', 'devotional', 'story'], default: 'blog' },
  body:          { type: String, required: true },
  excerpt:       { type: String, maxlength: 300 },
  coverImageUrl: { type: String },
  tags:          [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  isPublished:   { type: Boolean, default: false },
  publishedAt:   { type: Date },
  seo: {
    metaTitle:       String,
    metaDescription: String,
  },
}, { timestamps: true })

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)
```

---

#### MediaAsset — `src/models/MediaAsset.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose'

export interface IMediaAsset extends Document {
  url: string
  publicId: string          // Cloudinary public_id for deletion/transforms
  altText: string
  type: 'image' | 'video' | 'audio'
  linkedContentId: mongoose.Types.ObjectId
  linkedContentType: string // 'Song' | 'Post' | 'Album' etc.
  tags: mongoose.Types.ObjectId[]
}

const MediaAssetSchema = new Schema<IMediaAsset>({
  url:               { type: String, required: true },
  publicId:          { type: String, required: true },
  altText:           { type: String, required: true },
  type:              { type: String, enum: ['image', 'video', 'audio'], required: true },
  linkedContentId:   { type: Schema.Types.ObjectId },
  linkedContentType: { type: String },
  tags:              [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
}, { timestamps: true })

export default mongoose.models.MediaAsset || mongoose.model<IMediaAsset>('MediaAsset', MediaAssetSchema)
```

---

#### Tag — `src/models/Tag.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose'

export interface ITag extends Document {
  name: string
  slug: string
  description: string
}

const TagSchema = new Schema<ITag>({
  name:        { type: String, required: true, unique: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String },
}, { timestamps: true })

export default mongoose.models.Tag || mongoose.model<ITag>('Tag', TagSchema)
```

---

#### Event — `src/models/Event.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose'

export interface IEvent extends Document {
  title: string
  slug: string
  date: Date
  location: string
  description: string
  externalLink: string
  isUpcoming: boolean
  coverImageUrl: string
}

const EventSchema = new Schema<IEvent>({
  title:         { type: String, required: true },
  slug:          { type: String, required: true, unique: true },
  date:          { type: Date, required: true },
  location:      { type: String, required: true },
  description:   { type: String },
  externalLink:  { type: String },
  isUpcoming:    { type: Boolean, default: true },
  coverImageUrl: { type: String },
}, { timestamps: true })

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema)
```

---

#### Booking — `src/models/Booking.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose'

export interface IBooking extends Document {
  name: string
  email: string
  organisation: string
  eventType: string
  eventDate: string
  message: string
  status: 'pending' | 'reviewed' | 'accepted' | 'declined'
}

const BookingSchema = new Schema<IBooking>({
  name:         { type: String, required: true },
  email:        { type: String, required: true },
  organisation: { type: String },
  eventType:    { type: String },
  eventDate:    { type: String },
  message:      { type: String, required: true },
  status:       { type: String, enum: ['pending','reviewed','accepted','declined'], default: 'pending' },
}, { timestamps: true })

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema)
```

---

#### Initiative — `src/models/Initiative.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose'

export interface IInitiative extends Document {
  title: string
  slug: string
  description: string
  body: string
  coverImageUrl: string
  externalLink: string
  tags: mongoose.Types.ObjectId[]
}

const InitiativeSchema = new Schema<IInitiative>({
  title:         { type: String, required: true },
  slug:          { type: String, required: true, unique: true },
  description:   { type: String },
  body:          { type: String },
  coverImageUrl: { type: String },
  externalLink:  { type: String },
  tags:          [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
}, { timestamps: true })

export default mongoose.models.Initiative || mongoose.model<IInitiative>('Initiative', InitiativeSchema)
```

---

## 6. API Layer

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

### 6.2 Example: Songs Route

**File:** `src/app/api/songs/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Song from '@/models/Song'
import slugify from 'slugify'

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const albumId = searchParams.get('albumId')
  const tag     = searchParams.get('tag')

  const query: Record<string, any> = { isPublished: true }
  if (albumId) query.albumId = albumId
  if (tag)     query.tags    = tag

  const songs = await Song.find(query)
    .populate('albumId', 'title slug')
    .populate('tags', 'name slug')
    .sort({ trackNumber: 1 })
    .lean()

  return NextResponse.json({ data: songs })
}

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  body.slug  = slugify(body.title, { lower: true, strict: true })

  const song = await Song.create(body)
  return NextResponse.json({ data: song }, { status: 201 })
}
```

Apply the same pattern for: `/api/albums`, `/api/posts`, `/api/events`, `/api/initiatives`, `/api/bookings`, `/api/tags`, `/api/artists`, `/api/media`.

---

### 6.3 Validation with Zod

**File:** `src/lib/validators/songValidator.ts`

```typescript
import { z } from 'zod'

export const SongSchema = z.object({
  title:   z.string().min(1, 'Title is required'),
  albumId: z.string().min(1, 'Album is required'),
  audioUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  isPublished: z.boolean().default(true),
})

export type SongInput = z.infer<typeof SongSchema>
```

Use in route handlers before saving:

```typescript
const parsed = SongSchema.safeParse(body)
if (!parsed.success) {
  return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
}
```

---

## 7. UI & Component Layer

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
      <Link href="/" className="text-brand-gold font-serif text-xl font-bold">
        Glowreeyah
      </Link>
      <ul className="hidden md:flex gap-6 text-sm">
        {links.map(l => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-brand-gold transition-colors">
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

| Page Type | Strategy | Reason |
|---|---|---|
| Home, About, Music List | Server Component + `generateStaticParams` | SEO + performance |
| Song / Post / Album detail | Server Component + ISR (revalidate: 3600) | Fresh content, cacheable |
| Search / Filter | Client Component | Real-time interaction |
| Admin dashboard | Client Component | Full interactivity |
| Booking form | Client Component | Form state management |

---

## 8. Page Implementation

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
          <h1 className="font-serif text-5xl md:text-7xl text-brand-gold mb-4">Glowreeyah</h1>
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
import { connectDB } from '@/lib/mongodb'
import Song from '@/models/Song'
import Album from '@/models/Album'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: { albumSlug: string; songSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB()
  const song = await Song.findOne({ slug: params.songSlug }).lean()
  if (!song) return {}
  return {
    title: song.seo?.metaTitle || song.title,
    description: song.seo?.metaDescription || song.description,
  }
}

export default async function SongPage({ params }: Props) {
  await connectDB()
  const song = await Song.findOne({ slug: params.songSlug })
    .populate('albumId')
    .populate('tags')
    .lean()

  if (!song) notFound()

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
  )
}
```

---

## 9. Media Integration

### 9.1 Cloudinary Configuration

**File:** `src/lib/cloudinary.ts`

```typescript
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary
```

---

### 9.2 Upload API Route

**File:** `src/app/api/media/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
import { connectDB } from '@/lib/mongodb'
import MediaAsset from '@/models/MediaAsset'

export async function POST(req: NextRequest) {
  await connectDB()
  const formData  = await req.formData()
  const file      = formData.get('file') as File
  const altText   = formData.get('altText') as string
  const type      = formData.get('type') as string

  if (!altText) {
    return NextResponse.json({ error: 'Alt text is required' }, { status: 422 })
  }

  const bytes  = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadResult = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'glowreeyah', resource_type: 'auto' },
      (err, result) => err ? reject(err) : resolve(result)
    )
    stream.end(buffer)
  })

  const asset = await MediaAsset.create({
    url:      uploadResult.secure_url,
    publicId: uploadResult.public_id,
    altText,
    type,
  })

  return NextResponse.json({ data: asset }, { status: 201 })
}
```

---

### 9.3 Storage Rules (enforced)

| Data | Location |
|---|---|
| Image files | Cloudinary (object storage) |
| Audio files | Cloudinary or S3 |
| Video files | Cloudinary or YouTube embed |
| File URLs | MongoDB (`MediaAsset.url`) |
| Alt text | MongoDB (`MediaAsset.altText`) |
| Binary data | **Never stored in MongoDB** |

---

## 10. Admin System

### 10.1 Authentication

The admin system uses a simple secret token for v1.0. Upgrade to NextAuth.js for v1.1+.

**File:** `src/app/api/admin/auth/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { secret } = await req.json()

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const cookieStore = cookies()
  cookieStore.set('admin_session', process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, // 8 hours
  })

  return NextResponse.json({ ok: true })
}
```

---

### 10.2 Admin Middleware

**File:** `src/middleware.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const session = req.cookies.get('admin_session')
    if (!session || session.value !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

---

### 10.3 Admin Dashboard Structure

The admin section (`/admin`) provides:

- `/admin` — Dashboard overview (counts, recent submissions)
- `/admin/songs` — Song CRUD
- `/admin/albums` — Album CRUD
- `/admin/posts` — Post CRUD
- `/admin/media` — Media upload and browser
- `/admin/events` — Event CRUD
- `/admin/bookings` — View and manage booking submissions
- `/admin/tags` — Tag management

Each admin page is a Client Component with form state, API calls via `fetch`, and confirmation dialogs.

---

## 11. SEO Implementation

### 11.1 Metadata Per Page

Implement `generateMetadata()` on every dynamic route returning:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title:       seo.metaTitle || content.title,
    description: seo.metaDescription || content.excerpt,
    openGraph: {
      title:       seo.metaTitle || content.title,
      description: seo.metaDescription || content.excerpt,
      images:      [{ url: content.coverImageUrl }],
      type:        'article',
    },
    twitter: {
      card:        'summary_large_image',
      title:       seo.metaTitle || content.title,
      description: seo.metaDescription || content.excerpt,
      images:      [content.coverImageUrl],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.slug}`,
    },
  }
}
```

---

### 11.2 Sitemap

**File:** `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next'
import { connectDB } from '@/lib/mongodb'
import Song from '@/models/Song'
import Post from '@/models/Post'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB()

  const songs = await Song.find({ isPublished: true }).select('slug updatedAt').lean()
  const posts = await Post.find({ isPublished: true }).select('slug updatedAt').lean()

  const BASE = process.env.NEXT_PUBLIC_SITE_URL!

  return [
    { url: BASE, lastModified: new Date() },
    { url: `${BASE}/about`, lastModified: new Date() },
    { url: `${BASE}/music`, lastModified: new Date() },
    { url: `${BASE}/blog`, lastModified: new Date() },
    ...songs.map(s => ({ url: `${BASE}/music/${s.slug}`, lastModified: s.updatedAt })),
    ...posts.map(p => ({ url: `${BASE}/blog/${p.slug}`,  lastModified: p.updatedAt })),
  ]
}
```

---

### 11.3 Robots.txt

**File:** `src/app/robots.ts`

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules:   { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
```

---

## 12. Performance & Accessibility

### Performance Checklist

- Use `next/image` for all images (automatic WebP conversion, lazy loading, size optimisation)
- Use `next/font` for all fonts (no layout shift)
- Use `loading="lazy"` on video embeds
- Implement ISR (`revalidate`) on all content pages
- Avoid large client bundles — prefer Server Components
- Run Lighthouse audit before each deployment

### Accessibility Checklist

- All images must have `alt` text (enforced at upload time)
- Semantic HTML: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`
- Colour contrast ratio ≥ 4.5:1 for body text
- Keyboard navigation works on all interactive elements
- `aria-label` on icon-only buttons
- Skip navigation link at top of layout

---

## 13. Testing

### 13.1 Manual Testing Checklist

Before each deployment, verify:

- [ ] All public pages load without errors
- [ ] Dynamic routes resolve correctly (music, blog, tags)
- [ ] API routes return correct status codes
- [ ] Media uploads succeed and URLs resolve
- [ ] Admin CRUD operations work for all content types
- [ ] Forms validate and submit correctly
- [ ] Mobile layout renders correctly at 375px width
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`

---

## 14. Deployment

### 14.1 Pre-Deployment Steps

Complete these steps before deploying for the first time:

1. Ensure all environment variables are set locally in `.env.local` and tested
2. Confirm MongoDB Atlas cluster is running and connection string is valid
3. Confirm Cloudinary account is active and API credentials work
4. Push all code to the GitHub repository
5. Verify the build passes locally:

```bash
npm run build
```

Fix any TypeScript or build errors before proceeding.

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

| Key | Value |
|---|---|
| `MONGODB_URI` | Your Atlas connection string |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `NEXT_PUBLIC_SITE_URL` | Your production domain (e.g. `https://glowreeyah.com`) |
| `NEXT_PUBLIC_SITE_NAME` | `Glowreeyah` |
| `ADMIN_SECRET` | A strong random string |

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

---

## 15. Content Migration

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
import { connectDB } from '../src/lib/mongodb'
import Post from '../src/models/Post'
import slugify from 'slugify'
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

---

## 16. Post-Launch

### Immediate (Day 1)

- [ ] Verify Google Search Console ownership
- [ ] Submit sitemap to Google: `https://search.google.com/search-console`
- [ ] Run Lighthouse audit → target scores: Performance 90+, SEO 100, Accessibility 90+
- [ ] Test all forms end-to-end on production
- [ ] Confirm admin login works on production domain

### Week 1

- [ ] Monitor Vercel deployment logs for errors
- [ ] Monitor MongoDB Atlas metrics (connections, query times)
- [ ] Review Cloudinary usage against free tier limits
- [ ] Collect initial user feedback

### Ongoing

- [ ] Review and action booking submissions weekly
- [ ] Publish new blog / devotional content via admin dashboard
- [ ] Monitor SEO rankings monthly
- [ ] Keep dependencies updated monthly: `npm outdated`

---

## Appendix A — File Creation Order

Execute file creation in this sequence to avoid import errors:

1. `src/lib/mongodb.ts`
2. `src/lib/cloudinary.ts`
3. `src/lib/utils.ts`
4. `src/models/*.ts` (all models)
5. `src/app/api/**/*.ts` (all route handlers)
6. `src/components/layout/*.tsx`
7. `src/components/ui/*.tsx`
8. `src/components/music/*.tsx`
9. `src/components/content/*.tsx`
10. `src/app/layout.tsx`
11. `src/app/(public)/page.tsx`
12. `src/app/(public)/**/*.tsx` (all public pages)
13. `src/app/admin/**/*.tsx`
14. `src/app/sitemap.ts`
15. `src/app/robots.ts`
16. `src/middleware.ts`

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

| Variable | Required | Used In |
|---|---|---|
| `MONGODB_URI` | ✅ | `src/lib/mongodb.ts` |
| `CLOUDINARY_CLOUD_NAME` | ✅ | `src/lib/cloudinary.ts` |
| `CLOUDINARY_API_KEY` | ✅ | `src/lib/cloudinary.ts` |
| `CLOUDINARY_API_SECRET` | ✅ | `src/lib/cloudinary.ts` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅ | Client components |
| `NEXT_PUBLIC_SITE_URL` | ✅ | SEO, sitemap |
| `NEXT_PUBLIC_SITE_NAME` | ✅ | Metadata |
| `ADMIN_SECRET` | ✅ | Admin auth |

---

*This document supersedes all previous implementation notes. For feature definitions see `features.md`. For brand and architectural constraints see `constitution.md`.*
