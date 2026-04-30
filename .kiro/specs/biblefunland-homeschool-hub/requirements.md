# Requirements Document

## Introduction

BibleFunLand Homeschool Hub is a Next.js web application that enables Christian homeschool educators to generate, manage, browse, and print AI-powered Bible-themed worksheet packs for children aged 3–12 (Preschool through Grade 6). The system has been migrated from Firebase to a modern stack: Clerk for authentication, Turso (libSQL) for persistent storage, and Anthropic Claude Haiku for AI content generation. The Hub is a subdomain application (`homeschool.biblefunland.com`) that cross-links with the main BibleFunLand site (`biblefunland.com`).

---

## Glossary

- **Hub**: The BibleFunLand Homeschool Hub Next.js application.
- **Pack**: A named collection of exactly 6 AI-generated, Bible-themed printable worksheets targeting a specific grade range and theme.
- **Worksheet**: A single printable page within a Pack, containing a title, learning objective, parent instructions, content markup, Bible verse, and grade level.
- **Educator**: An authenticated user who creates and manages Packs.
- **Visitor**: An unauthenticated user who can browse and view Packs but cannot create or modify them.
- **AI_Generator**: The server-side Claude Haiku integration (`lib/ai.ts`) responsible for generating Pack and Worksheet content.
- **Pack_API**: The set of Next.js API route handlers under `/api/packs`.
- **Auth_System**: The Clerk-based authentication layer, including middleware and the `useAuth()` hook.
- **DB**: The Turso (libSQL) database accessed via `lib/db.ts`.
- **Testimonial**: A community review submitted by an authenticated user, stored in the `testimonials` table.
- **Profile_Dashboard**: The `/profile` page showing an Educator's stats and their Packs.
- **Print_Preview**: The modal UI on the Pack detail page that allows worksheet selection before printing or saving as PDF.
- **Grade_Range**: One of four fixed values: `Preschool-K`, `Grades 1-2`, `Grades 3-4`, `Grades 5-6`.
- **Theme**: A free-text or preset description of the Bible story or topic for a Pack.
- **Sort_Order**: An integer field on each Worksheet that determines its display and print sequence within a Pack.

---

## Requirements

### Requirement 1: User Authentication

**User Story:** As a homeschool educator, I want to sign in with my account, so that I can create and manage my own worksheet packs.

#### Acceptance Criteria

1. THE Auth_System SHALL provide sign-in via Clerk's modal-based `SignInButton` component on any page.
2. WHEN a Visitor navigates to `/generate`, THE Auth_System SHALL redirect or block access until the Visitor authenticates.
3. WHEN an Educator is authenticated, THE Hub SHALL display the Educator's avatar, first name, and a sign-out button in the Navbar.
4. WHEN an Educator signs out, THE Auth_System SHALL clear the session and return the user to the unauthenticated state.
5. THE Auth_System SHALL expose a `useAuth()` hook that returns `{ user, loading, logout }` with a consistent `AuthContextUser` shape (`uid`, `displayName`, `email`, `photoURL`).
6. WHILE the authentication state is loading, THE Hub SHALL render a loading indicator rather than flashing unauthenticated UI.
7. IF an API route requires authentication and no valid session exists, THEN THE Pack_API SHALL return HTTP 401 with `{ "error": "Unauthorized" }`.

---

### Requirement 2: Database Initialization

**User Story:** As a system operator, I want the database tables to be created automatically, so that the application works correctly after first deployment without manual SQL setup.

#### Acceptance Criteria

1. THE DB SHALL contain a `packs` table with columns: `id` (TEXT PRIMARY KEY), `title`, `overview`, `grade_range`, `theme`, `created_by`, `created_at`.
2. THE DB SHALL contain a `worksheets` table with columns: `id` (TEXT PRIMARY KEY), `pack_id` (FK → `packs.id` ON DELETE CASCADE), `title`, `grade_level`, `objective`, `parent_instructions`, `content_markup`, `bible_verse`, `sort_order`, `created_at`.
3. THE DB SHALL contain a `testimonials` table with columns: `id`, `user_name`, `role`, `content`, `rating`, `created_by`, `created_at`.
4. WHEN `GET /api/init` is called, THE DB SHALL execute `CREATE TABLE IF NOT EXISTS` for the `packs` and `worksheets` tables.
5. WHEN `GET /api/testimonials` or `POST /api/testimonials` is called, THE DB SHALL execute `CREATE TABLE IF NOT EXISTS` for the `testimonials` table before any read or write.
6. IF a table already exists, THEN THE DB SHALL leave the existing table and its data unchanged.

---

### Requirement 3: AI Worksheet Pack Generation

**User Story:** As a homeschool educator, I want to generate a complete worksheet pack from a Bible theme and grade range, so that I have ready-to-print materials without manual authoring.

#### Acceptance Criteria

1. WHEN an authenticated Educator submits a `theme` and `gradeRange` to `POST /api/packs`, THE AI_Generator SHALL call Claude Haiku with a structured prompt and return a `WorksheetPack` JSON object.
2. THE AI_Generator SHALL produce a Pack containing exactly 6 Worksheets.
3. THE AI_Generator SHALL produce Worksheets that rotate through these types: Bible story sequencing, Scripture tracing/coloring instructions, Math problems using story themes, Reading comprehension, Creative drawing/writing prompts, and Matching/Word Search.
4. EACH Worksheet produced by THE AI_Generator SHALL include: `title`, `gradeLevel`, `objective`, `parentInstructions`, `contentMarkup` (detailed markdown), and `bibleVerse` (full verse text with reference in NIV or ESV).
5. THE AI_Generator SHALL use only biblically accurate content and include a scripture reference for every Worksheet.
6. IF the Claude API returns a non-JSON or malformed response, THEN THE Pack_API SHALL return HTTP 500 with `{ "error": "<message>" }`.
7. IF `theme` or `gradeRange` is missing from the request body, THEN THE Pack_API SHALL return HTTP 400 with `{ "error": "theme and gradeRange are required" }`.
8. WHEN generation succeeds, THE Pack_API SHALL persist the Pack and all 6 Worksheets to THE DB and return `{ "packId": "<uuid>" }`.

---

### Requirement 4: Pack Browsing and Discovery

**User Story:** As a visitor or educator, I want to browse all available worksheet packs, so that I can find materials relevant to my lesson plan.

#### Acceptance Criteria

1. WHEN `GET /api/packs` is called, THE Pack_API SHALL return up to 50 Packs ordered by `created_at` descending, as `{ "packs": [...] }`.
2. THE Pack_API SHALL accept an optional `limit` query parameter to override the default of 50.
3. THE Hub SHALL render the `/browse` page with a searchable grid and list view of all Packs.
4. WHEN a Visitor types in the search field on `/browse`, THE Hub SHALL filter the displayed Packs client-side by `title` or `theme` (case-insensitive).
5. THE Hub SHALL allow toggling between grid view and list view on the `/browse` page.
6. WHILE Packs are loading on `/browse`, THE Hub SHALL display a loading state message.
7. IF no Packs match the search term, THEN THE Hub SHALL display an empty-state message with a prompt to try a different search.

---

### Requirement 5: Pack Detail View and Printing

**User Story:** As a homeschool educator, I want to view and print a worksheet pack, so that I can produce physical copies for my students.

#### Acceptance Criteria

1. WHEN `GET /api/packs/[id]` is called, THE Pack_API SHALL return the Pack metadata and all associated Worksheets ordered by `sort_order` ascending.
2. IF the requested Pack does not exist, THEN THE Pack_API SHALL return HTTP 404 with `{ "error": "Pack not found" }`.
3. THE Hub SHALL render the `/pack/[id]` page with a sidebar showing Pack metadata and a main area listing all Worksheets.
4. WHEN an Educator clicks "Download Pack as PDF", THE Hub SHALL open the Print_Preview modal showing thumbnail previews of all Worksheets.
5. WITHIN the Print_Preview modal, THE Hub SHALL allow the Educator to select or deselect individual Worksheets for inclusion in the print job.
6. WHEN the Educator confirms printing, THE Hub SHALL close the modal and trigger the browser's native print dialog.
7. THE Hub SHALL hide all navigation, controls, and non-worksheet UI elements during printing via `print:hidden` CSS classes.
8. THE Hub SHALL allow each Worksheet to be viewed in an interactive preview mode with zoom controls (range 0.5×–2.0×) and toggles for parent instructions and Bible verse visibility.
9. WHEN a Visitor clicks the share button on `/pack/[id]`, THE Hub SHALL copy the current page URL to the clipboard and display a "Link Copied!" confirmation.

---

### Requirement 6: Pack Ownership and Editing

**User Story:** As the creator of a worksheet pack, I want to edit my pack's metadata and reorder worksheets, so that I can refine the content after generation.

#### Acceptance Criteria

1. WHEN an authenticated Educator views a Pack they created, THE Hub SHALL display an edit button on the Pack sidebar.
2. WHEN the Educator activates edit mode, THE Hub SHALL render inline form fields for `title`, `overview`, and `gradeRange`.
3. WHEN the Educator submits the edit form, THE Hub SHALL send `PATCH /api/packs/[id]` with the updated fields.
4. IF the authenticated user is not the Pack's creator, THEN THE Pack_API SHALL return HTTP 403 with `{ "error": "Forbidden" }` for PATCH and DELETE requests.
5. WHEN `PATCH /api/packs/[id]` succeeds, THE Pack_API SHALL update `title`, `overview`, and `grade_range` in THE DB and return `{ "ok": true }`.
6. WHEN an authenticated Educator drags a Worksheet to a new position, THE Hub SHALL optimistically reorder the list and send `PATCH /api/packs/[id]/worksheets/reorder` with the new `sort_order` values.
7. WHEN `PATCH /api/packs/[id]/worksheets/reorder` is called by the Pack owner, THE Pack_API SHALL update the `sort_order` of each specified Worksheet in THE DB.
8. IF the reorder request is made by a non-owner, THEN THE Pack_API SHALL return HTTP 403.

---

### Requirement 7: Pack Deletion

**User Story:** As the creator of a worksheet pack, I want to delete my pack, so that I can remove content I no longer need.

#### Acceptance Criteria

1. WHEN an authenticated Educator sends `DELETE /api/packs/[id]`, THE Pack_API SHALL verify the requesting user is the Pack's creator.
2. IF the Pack does not exist, THEN THE Pack_API SHALL return HTTP 404.
3. IF the requesting user is not the Pack's creator, THEN THE Pack_API SHALL return HTTP 403.
4. WHEN deletion is authorized, THE Pack_API SHALL delete all associated Worksheets from THE DB and then delete the Pack record, returning `{ "ok": true }`.
5. WHEN an Educator deletes a Pack from the Profile_Dashboard, THE Hub SHALL remove the Pack from the displayed list and decrement the `totalPacks` stat without a full page reload.

---

### Requirement 8: AI Worksheet Expansion Ideas

**User Story:** As the creator of a worksheet pack, I want to generate AI-suggested worksheet ideas for my existing pack, so that I can expand it with additional content.

#### Acceptance Criteria

1. WHEN an authenticated Pack owner clicks "Generate Ideas" on `/pack/[id]`, THE Hub SHALL send `POST /api/packs/[id]/ideas`.
2. THE AI_Generator SHALL return exactly 3 Worksheet idea objects, each containing `title`, `gradeLevel`, `objective`, `parentInstructions`, `contentMarkup`, and `bibleVerse`.
3. THE AI_Generator SHALL ground every idea in scriptural truth and align it with the Pack's existing `title`, `overview`, and `grade_range`.
4. WHEN ideas are returned, THE Hub SHALL display them as cards with title, grade level, learning objective, and key scripture.
5. WHEN an Educator clicks "Add to Pack" on an idea card, THE Hub SHALL send `POST /api/packs/[id]/worksheets` to persist the new Worksheet and append it to the displayed list.
6. WHEN a Worksheet is successfully added, THE Hub SHALL remove the corresponding idea card from the suggestions panel.
7. IF the ideas generation request is made by a non-authenticated user, THEN THE Pack_API SHALL return HTTP 401.

---

### Requirement 9: Educator Profile Dashboard

**User Story:** As a homeschool educator, I want to view my profile dashboard, so that I can see all my created packs and my overall contribution stats.

#### Acceptance Criteria

1. WHEN an authenticated Educator navigates to `/profile`, THE Hub SHALL fetch `GET /api/profile` and display the Educator's avatar, full name, email, and join date.
2. THE Pack_API SHALL return from `GET /api/profile` the Educator's Packs ordered by `created_at` descending and stats: `totalPacks` and `totalWorksheets`.
3. THE Hub SHALL display `totalPacks` and `totalWorksheets` as stat cards on the Profile_Dashboard.
4. THE Hub SHALL render a grid of the Educator's Packs, each with a "View & Print" link and a delete button.
5. IF the Educator has no Packs, THEN THE Hub SHALL display an empty-state with a call-to-action link to `/generate`.
6. IF an unauthenticated Visitor navigates to `/profile`, THEN THE Hub SHALL display a sign-in prompt rather than profile data.
7. WHEN `GET /api/profile` is called without a valid session, THE Pack_API SHALL return HTTP 401.

---

### Requirement 10: Community Testimonials

**User Story:** As a homeschool parent, I want to submit and read community testimonials, so that I can share my experience and learn from others.

#### Acceptance Criteria

1. WHEN `GET /api/testimonials` is called, THE Pack_API SHALL return up to 10 Testimonials ordered by `created_at` descending.
2. WHEN an authenticated user submits a testimonial via `POST /api/testimonials`, THE Pack_API SHALL persist it with `user_name`, `content`, `rating` (default 5), `role` (default `"Homeschool Parent"`), `created_by`, and `created_at`.
3. IF `content` is empty or whitespace, THEN THE Pack_API SHALL return HTTP 400 with `{ "error": "Content is required" }`.
4. WHEN an authenticated user sends `DELETE /api/testimonials?id=<id>`, THE Pack_API SHALL delete the Testimonial only if `created_by` matches the requesting user's ID.
5. IF the requesting user did not create the Testimonial, THE Pack_API SHALL silently perform no deletion (the SQL WHERE clause filters by both `id` and `created_by`).
6. IF an unauthenticated user attempts to POST or DELETE a Testimonial, THEN THE Pack_API SHALL return HTTP 401.

---

### Requirement 11: Navigation and Cross-Site Linking

**User Story:** As a user, I want consistent navigation between the Homeschool Hub and the main BibleFunLand site, so that I can move between the two experiences without confusion.

#### Acceptance Criteria

1. THE Hub SHALL render a fixed top Navbar on every page containing: the BibleFunLand logo/home link, a "Library" link to `/browse`, a "Creator Workspace" link to `/generate`, and a "← Main Site" link to `https://biblefunland.com`.
2. THE Navbar SHALL be hidden during print via `print:hidden`.
3. WHEN an Educator is signed in, THE Navbar SHALL display the Educator's avatar (or a fallback icon) and first name as a link to `/profile`.
4. WHEN a Visitor views the Navbar, THE Navbar SHALL display a "Sign In" button that opens the Clerk modal.
5. THE Hub SHALL display the "← Main Site" link as an external link opening in a new tab with `rel="noopener noreferrer"`.

---

### Requirement 12: Security and API Key Protection

**User Story:** As a system operator, I want all secret API keys and credentials to remain server-side only, so that they are never exposed to the browser.

#### Acceptance Criteria

1. THE Hub SHALL access `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ANTHROPIC_API_KEY`, and `CLERK_SECRET_KEY` exclusively within Next.js API route handlers and server-side modules.
2. THE DB client (`lib/db.ts`) SHALL be imported only in server-side files (API routes) and SHALL NOT be imported in any `'use client'` component.
3. THE AI_Generator (`lib/ai.ts`) SHALL be imported only in server-side files (API routes) and SHALL NOT be imported in any `'use client'` component.
4. THE Hub SHALL expose only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `NEXT_PUBLIC_APP_URL` as public environment variables accessible in client components.
5. WHEN the Clerk middleware processes a request to a protected route, THE Auth_System SHALL validate the session token server-side before allowing the request to proceed.
