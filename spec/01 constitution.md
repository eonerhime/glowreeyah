# Constitution

**Project:** Glowreeyah Digital Platform
**Version:** 1.0.0
**Document Type:** Architectural & Brand Governance
**Last Updated:** 2026-03-28
**Status:** Active — All decisions in this document are binding

---

## 1. Purpose

This document defines the governing principles, technical constraints, and non-negotiable rules for the Glowreeyah digital platform. It is read before any technical decision is made. No feature, design choice, or implementation pattern may contradict the rules defined here.

The platform exists to present Glowreeyah as a multidimensional brand spanning music, ministry, speaking, thought leadership, and social impact. It must evolve from a static website into a scalable, database-driven digital identity system.

---

## 2. Brand Governance

### 2.1 Brand Values (enforced in all design and content decisions)

Every feature, page, component, and piece of content must reflect:

| Value | Application |
|---|---|
| Warmth | Approachable copy tone, warm colour palette, generous white space |
| Spirituality | Language, imagery, and content themes reflect faith and ministry identity |
| Intelligence | Clear information hierarchy, no clutter, purposeful copy |
| Elegance | Refined typography, restrained animations, high-quality imagery only |
| Expressiveness | Bold hero sections, rich media, lyric and story sections |

### 2.2 Visual Identity Rules

- Primary typeface: Serif for headings (Georgia or equivalent), Sans-serif for body (Inter)
- Colour palette: Gold (`#C9A84C`), Deep Navy (`#1A1A2E`), Warm Off-White (`#F5EDE0`), Accent Purple (`#8B5CF6`)
- No stock-looking imagery; authentic photography and branded graphics only
- Minimum colour contrast ratio for body text: 4.5:1 (WCAG AA)

---

## 3. Architectural Principles

### 3.1 Content as a System

All content must be database-driven:

- **No hardcoded page copy.** Biography, song titles, blog posts, and event details must be stored in MongoDB and rendered dynamically.
- **Reusable content blocks.** Components receive data as props; they never contain inline content strings.
- **Dynamic rendering.** All content pages use Server Components with data fetched from MongoDB at render time (ISR where appropriate).

### 3.2 Performance by Default

| Rule | Implementation |
|---|---|
| Fast load times | Target LCP < 2 seconds; ISR revalidation on all content pages |
| Optimised media | All images via `next/image`; Cloudinary handles transforms and CDN |
| Minimal JS | Prefer Server Components; use Client Components only where interactivity requires it |
| No blocking resources | Fonts via `next/font`; third-party scripts loaded asynchronously |

### 3.3 Editorial Independence

Non-technical team members must be able to:
- Create, update, and delete songs, albums, posts, events, and initiatives
- Upload and manage media
- Publish and unpublish content
- Manage booking submissions

No content operation should require a developer or a code deployment.

### 3.4 SEO as Architecture

SEO is not a post-development concern — it is baked into the architecture:

- Clean URLs (`/music/album-slug/song-slug`, never `/music?id=123`)
- `generateMetadata()` on every dynamic route
- Semantic HTML throughout (`<article>`, `<nav>`, `<main>`, `<header>`, `<footer>`)
- JSON-LD structured data on music, blog, and event pages
- Sitemap auto-generated from database content
- Tag system drives discoverability and internal linking

### 3.5 Media Governance (Strict)

| Rule | Detail |
|---|---|
| Binary data never stored in MongoDB | Images, audio, and video go to object storage only |
| MongoDB stores metadata only | URL, `publicId`, `altText`, `type`, `linkedContentId` |
| Alt text is mandatory | Upload API returns `422` if `altText` is missing |
| GridFS not used | URL references to object storage only |
| Cloudinary is the primary provider | S3 or Supabase may substitute; the storage provider must be interchangeable |

### 3.6 Extensibility

The system must support future addition of the following without architectural rework:

- Bookings (foundation in v1.0)
- Courses module
- Newsletter subscription
- Gated / premium content
- User accounts

These are defined in `features.md` as P3 (Future). No v1.0 component should be designed in a way that prevents these additions.

---

## 4. Technical Constraints

### 4.1 Approved Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 14.x |
| Styling | Tailwind CSS | 3.x |
| Language | TypeScript | 5.x |
| Database | MongoDB (via Mongoose) | Atlas M0+ |
| Media Storage | Cloudinary | 2.x |
| Hosting | Vercel | — |
| Validation | Zod | 3.x |

**No deviations from this stack without a documented architectural decision.** Replacing any approved technology requires updating this document and `implementation.md` before development proceeds.

### 4.2 MongoDB Rules

| Rule | Rationale |
|---|---|
| No binary data in BSON documents | MongoDB is not a file store; large BSON documents degrade performance |
| Store only URL references to media | Object storage is designed for this; MongoDB is not |
| GridFS only as last resort | If offline/airgapped storage is required, document the decision |
| All collections use Mongoose schemas with TypeScript interfaces | Type safety and consistent validation |

### 4.3 Storage Decision Matrix

| Data Type | Storage Location |
|---|---|
| Structured content (posts, songs, events) | MongoDB |
| Metadata about media (URL, alt text, type) | MongoDB |
| Images | Cloudinary (object storage) |
| Audio files | Cloudinary (object storage) |
| Video files | Cloudinary or YouTube embed URL |
| Session data | HTTP-only cookies (server-side) |
| Secrets and credentials | Environment variables only |

### 4.4 Security Rules

- `ADMIN_SECRET` and all API credentials stored as environment variables only
- No credentials committed to Git under any circumstances
- Admin routes protected by `src/middleware.ts`
- All form inputs validated server-side with Zod before persistence
- `Content-Security-Policy` header configured at Vercel level before launch

---

## 5. Governance

### 5.1 Document Authority

This constitution takes precedence over all other documents. In the event of a conflict:

1. `constitution.md` (this document)
2. `specification.md`
3. `implementation.md`
4. `features.md`
5. `plan.md`
6. `tasks.md`

### 5.2 Change Control

Any change to this document requires:
1. A written rationale
2. An update to the relevant implementation files if the change affects code
3. A version bump and date update in the document header

### 5.3 Definition of Done

A feature is complete when:
- [ ] All acceptance criteria in `features.md` are met
- [ ] No hardcoded content (all data from database)
- [ ] `generateMetadata()` implemented if the feature adds a new route
- [ ] Media assets stored in object storage (not MongoDB)
- [ ] Alt text present on all images
- [ ] Page loads in < 2 seconds on a standard connection
- [ ] Mobile layout correct at 375px
- [ ] Admin can create, update, and delete the content type
