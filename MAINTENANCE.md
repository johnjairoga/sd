# MAINTENANCE.md — SouthDesk CRM

## How to Run Locally and Redeploy

### Prerequisites
- Node.js 18+
- Supabase account with a project
- Vercel account (for deployment)

### Local Development

1. **Clone the repo and install dependencies:**
   ```bash
   git clone <repo-url>
   cd sd
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

3. **Create the database table:**
   In your Supabase dashboard (SQL Editor), run the SQL from the plan documentation to create the `leads` table and set up RLS policies.

4. **Run the dev server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 in your browser.

### Redeploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "chore: [your message]"
   git push origin main
   ```

2. **Vercel will auto-deploy** when you push to `main` (if connected).

3. **If not connected:**
   - Go to vercel.com and import the repository
   - Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Deploy

---

## How Someone Else Would Add a New Feature

### Example: Add a lead filtering dropdown in the Kanban board

1. **Open `components/KanbanBoard.tsx`:**
   - Add a `useEffect` to fetch leads once on mount (already done)
   - Add a filter state: `const [filterSource, setFilterSource] = useState('');`

2. **Filter the leads before grouping:**
   ```tsx
   const filteredLeads = filterSource
     ? leads.filter(l => l.source === filterSource)
     : leads;
   ```

3. **Create a filter dropdown UI** above the Kanban columns:
   ```tsx
   <select onChange={(e) => setFilterSource(e.target.value)}>
     <option value="">All Sources</option>
     <option value="Website">Website</option>
     <option value="Referral">Referral</option>
   </select>
   ```

4. **Use `filteredLeads` instead of `leads` when building the board columns.**

5. **Test locally, commit, and deploy:**
   ```bash
   git add components/KanbanBoard.tsx
   git commit -m "feat: add source filter dropdown to Kanban board"
   git push origin main
   ```

---

## Known Limitations and Risks

### RLS Policy (Security)
**Status:** Currently permissive (`using (true)` for all operations).
**Risk:** Anyone with the Supabase keys can read/write all leads.
**Recommendation:** Before production, add user authentication via Supabase Auth and row-level policies tied to user IDs. See Supabase docs on RLS.

### No Backup
**Risk:** Supabase auto-backups exist, but no explicit daily backups are configured.
**Recommendation:** Set up Supabase automatic backups in the dashboard (paid tier).

### Drag-and-drop only works on desktop
**Status:** @hello-pangea/dnd does not support mobile touch drag-and-drop out of the box.
**Workaround:** Users can edit leads via the "Edit" button on cards, which works on mobile.

### No email notifications
**Status:** Inactive leads (>7 days) are shown in metrics but no emails are sent.
**Recommendation:** Integrate with a service like Resend or SendGrid to email users when leads become inactive.

---

## Handoff Scenario: If You Left Tomorrow

### Non-technical owner needs to know:

**Where is the app?**
- Live at: (Vercel URL)
- GitHub repo: (public link)
- Database: Supabase dashboard

**Who do they hire if something breaks?**
- A Next.js / React developer (mid-level)
- Supabase SQL knowledge is a plus

**What access/docs do they need?**
1. **Vercel login** — to redeploy or check logs
2. **Supabase login** — to view/backup data or adjust RLS
3. **GitHub access** — to push code changes
4. **This MAINTENANCE.md file** — for onboarding a new dev
5. **A list of Supabase env var names** — `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Common tasks a new dev should handle:**
- Adding features: see example above (30 min per small feature)
- Fixing bugs: run locally, test, push, Vercel auto-deploys
- Scaling: if >1000 leads, add database indexes on `created_at` and `status`

**Monitoring:**
- No crash logging set up (Sentry, LogRocket optional)
- Check Supabase dashboard for storage usage monthly
- Review Vercel analytics for load/performance

---

**Last updated:** April 2026
