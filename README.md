# SouthDesk CRM

A lightweight lead management web app designed to solve a common problem in consulting teams: lost leads, missed follow-ups, and lack of pipeline visibility.

## Development Stats

* **Total Development Time:** 3 hours 49 minutes
* **Commits:** 27
* **Period:** April 21, 2026 (23:30) → April 22, 2026 (03:19)
* **Status:** ✅ Production-ready

## Built With

* **Next.js 16** with TypeScript and Tailwind CSS
* **Supabase** (PostgreSQL) for leads database
* **@hello-pangea/dnd** for drag-and-drop Kanban board
* **Vercel** for deployment

## Core Features

* **Kanban pipeline:** Visualize and manage leads across 5 stages (New → Contacted → Proposal Sent → Closed Won → Lost)
* **Lead management:** Create, edit, and update leads with essential contact information
* **Seller assignment:** Assign leads to one of three sellers (Seller_1, Seller_2, Seller_3) for team collaboration
* **Seller filters:** Filter leads by assigned seller across both Kanban and Table views (filter persists between views)
* **Actionable metrics:**

  * Total leads
  * Leads by status
  * Conversion rate
  * Inactive leads (to prevent missed follow-ups)
* **Table view:** Alternative list view with seller column for quick scanning and editing
* **Dual-view interface:** Switch between Kanban and Table views with synchronized data

## Key Design Decisions

* Prioritized **pipeline visibility** through a Kanban board to directly address lost leads and missed follow-ups
* Focused on **simple, actionable metrics** instead of a complex dashboard
* Designed for **single-user workflow**, avoiding unnecessary authentication complexity
* Used **Supabase** for rapid backend setup and real-time data handling

## What Was Intentionally Out of Scope

* **Interaction log:** Would require additional schema and UI (~1.5h)
* **AI suggestions:** Requires external APIs and historical data to be meaningful
* **Email notifications:** Not critical for initial pipeline visibility
* **Authentication:** Not required for single-user prototype; database-level control is sufficient

## Getting Started

See `MAINTENANCE.md` for local setup and deployment instructions.
