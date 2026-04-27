# Project Instructions — Do Not Change

These rules are permanent and must be followed by any AI agent or developer working on this project.

---

## UI / Design System

**DO NOT change the visual design language.** The current design uses an **editorial/minimalist** aesthetic:

- **Fonts**: `Instrument Serif` (display, italic headings) + `Plus Jakarta Sans` (body)
- **Colors**: Warm neutrals — `#FAFAF8` background, `#1A1A1A` text, `#E85D3A` accent
- **Inputs**: Bottom-border only, transparent background — never boxed/bordered inputs
- **Buttons**: Dark fill (primary), pill-shaped ghost (secondary), accent (CTA)
- **Borders**: Ultra-subtle `rgba(0,0,0,0.06)` — never thick or dark borders
- **Animations**: `fadeUp` with `cubic-bezier(0.22, 1, 0.36, 1)` easing
- **Radius**: `10px` (`var(--radius)`)

**When adding new pages or components**, always match this system. Reference `globals.css` `:root` variables. Do not introduce:
- Blue/corporate color themes
- Boxed input fields with visible borders on all sides
- Generic UI frameworks or component libraries
- Different font families

## CSS Variables (Source of Truth)

All styles must use the CSS custom properties defined in `:root` in `globals.css`. Never hardcode colors or font stacks.

## Navigation Pattern

All authenticated pages must use the nav pattern from `welcome/page.tsx`:
- "AM" logo badge (dark, rounded)
- "Asset Management" brand text
- User name + email on the right
- "Sign out" ghost button

## Architecture

- **Database**: Prisma ORM + SQLite (see `DATABASE.md` for migration guide)
- **Auth**: NextAuth.js v5 with JWT strategy
- **Data layer**: Repository functions in `src/lib/` (e.g., `users.ts`, `assets.ts`)
- **API routes**: Next.js route handlers in `src/app/api/`
- **Middleware**: Edge-compatible auth config in `auth.config.ts`

## Placeholder Data

See `PLACEHOLDERS.md` for all temporary values that need real data before production.
