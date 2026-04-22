# SouthDesk CRM

A lightweight lead management web app designed to solve a common problem in consulting teams: lost leads, missed follow-ups, and lack of pipeline visibility.

## Built With

* **Next.js 16** with TypeScript and Tailwind CSS
* **Supabase** (PostgreSQL) for leads database
* **@hello-pangea/dnd** for drag-and-drop Kanban board
* **Vercel** for deployment

## Core Features

* **Kanban pipeline:** Visualize and manage leads across 5 stages (New → Contacted → Proposal Sent → Closed Won → Lost)
* **Lead management:** Create, edit, and update leads with essential contact information
* **Actionable metrics:**

  * Total leads
  * Leads by status
  * Conversion rate
  * Inactive leads (to prevent missed follow-ups)
* **Table view:** Alternative list view for quick scanning and editing

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
