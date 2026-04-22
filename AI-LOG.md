# AI-LOG — Development Iteration Log

## [Commit e89b4fe] — Scaffold Next.js app with TypeScript and Tailwind

**Prompt:** Scaffold a new Next.js project with TypeScript, Tailwind CSS, and App Router. Use the import alias `@/*` for cleaner imports.

**Result:** Generated Next.js scaffold using `create-next-app@latest` with the specified options. Project structure created with all necessary config files and dependencies.

**Adjustment:** No adjustment needed. Scaffold worked as expected.

---

## [Commit 08b8b23] — Add Supabase client and env config

**Prompt:** Create a Supabase browser client singleton at `lib/supabase.ts` that initializes the Supabase client using environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Also create `.env.local.example` as a template for environment configuration.

**Result:** Generated `lib/supabase.ts` with a simple client initialization using `createClient()` from `@supabase/supabase-js`. Created `.env.local.example` template file.

**Adjustment:** No adjustment needed. Supabase client is properly exported for use in API routes and components. Modified `.gitignore` to allow `.env.local.example` to be committed while keeping `.env.local` private.

---

## [Commit 279e7f9] — Fix API routes for Next.js 16 async params

**Prompt:** Create PATCH and DELETE API routes for individual leads with proper type safety.

**Result:** Initial implementation used `{ params: { id: string } }` which worked in earlier Next.js versions.

**Adjustment:** Next.js 16 changed route segment config to use `params: Promise<{ id: string }>`. Fixed by:
- Awaiting `params` before accessing `id`
- Updated both PATCH and DELETE handlers to use async params
- Build now passes without TypeScript errors
This is a common gotcha in Next.js 16 migrations — the framework moved to Promise-based params for better performance.

---

## [Commit 0012b97] — Improve responsive design and modal UX

**Prompt:** Refactor the LeadModal to be mobile-friendly. The modal should not fully block the Kanban board, should use a lighter overlay, and behave as a bottom sheet on mobile while centered on desktop. Also improve the overall app responsiveness for all screen sizes.

**Result:** Initial implementation had a heavy dark overlay (bg-black/50) that completely blocked the background, and fixed modal positioning without responsive breakpoints. This created a poor mobile UX where users couldn't see the context of the Kanban board.

**Adjustment:** 
- Changed overlay from `bg-black/50` to `bg-black/20` with `backdrop-blur-sm` for a modern, lightweight feel
- Added responsive positioning: `items-end sm:items-center` (bottom sheet on mobile, centered on desktop)
- Updated modal styling: `rounded-t-lg sm:rounded-lg` and `p-4 sm:p-6` for responsive padding
- Made buttons stack vertically on mobile with `flex-col sm:flex-row` 
- Added horizontal scroll to Kanban columns for small screens: `overflow-x-auto` + `min-w-min`
- Applied responsive text sizing throughout: `text-2xl sm:text-3xl lg:text-4xl`
- Enabled background visibility with lighter overlay and added `max-h-[90vh] overflow-y-auto` for modal overflow handling

This significantly improves UX on all devices while keeping the Kanban context visible.

---
