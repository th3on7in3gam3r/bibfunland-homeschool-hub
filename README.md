# BibleFunLand Homeschool Hub

AI-powered printable worksheet packs for Christian homeschool families. Generate Bible-themed worksheets for ages 3–12 (Preschool through Grade 6) using Claude AI.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Auth | Clerk |
| Database | Turso (libSQL / SQLite) |
| AI | Anthropic Claude Haiku |
| Styling | Tailwind CSS 4 |
| Animations | Motion (Framer Motion) |
| Drag & Drop | dnd-kit |

## Features

- 🤖 **AI Pack Generation** — Claude generates 6 worksheets per pack from a Bible theme + grade range
- 📚 **Pack Library** — Browse, search, and filter packs by category
- 🖨️ **Print Preview** — Select worksheets, preview, and print/save as PDF
- ✏️ **Pack Editing** — Edit title, overview, grade range, and category
- 🔀 **Drag to Reorder** — Reorder worksheets within a pack
- 💡 **AI Expansion Ideas** — Generate 3 new worksheet ideas for any pack
- ⭐ **Featured Packs** — Admin-curated packs highlighted on the homepage
- 👤 **Profile Dashboard** — View all your packs and stats
- 💬 **Testimonials** — Community reviews from homeschool parents

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `CLERK_SECRET_KEY` | [Clerk Dashboard](https://dashboard.clerk.com) → API Keys |
| `TURSO_DATABASE_URL` | [Turso](https://turso.tech) → Your DB → Connect |
| `TURSO_AUTH_TOKEN` | [Turso](https://turso.tech) → Your DB → Connect |
| `ANTHROPIC_API_KEY` | [Anthropic Console](https://console.anthropic.com) → API Keys |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local dev |
| `ADMIN_USER_ID` | Your Clerk user ID (optional, enables feature toggle) |

### 3. Initialize the database

Start the dev server, then visit:

```
http://localhost:3000/api/init
```

You should see `{"ok":true,"message":"DB initialized"}`. This creates the `packs` and `worksheets` tables. Only needs to be done once.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

This app outputs a standalone Next.js build. Deploy to any Node.js host (Vercel, Railway, Fly.io, etc.).

Set all environment variables from `.env.example` in your hosting provider's dashboard. After first deploy, hit `/api/init` once to create the database tables.

## Admin: Featuring Packs

To feature a pack on the homepage, set `ADMIN_USER_ID` in your environment to your Clerk user ID, then call:

```bash
curl -X PATCH https://your-app.com/api/packs/<pack-id>/feature \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-session-token>" \
  -d '{"isFeatured": true}'
```

Featured packs appear in the "Featured Packs" section above "Recent Packs" on the homepage.

## Pack Categories

- Bible Story
- Thematic
- Academic Skill
- Memory Verse
- Character & Virtue
- Seasonal & Holiday

## Grade Ranges

- Preschool-K
- Grades 1-2
- Grades 3-4
- Grades 5-6
