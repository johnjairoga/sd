# MAINTENANCE.md — SouthDesk CRM

## a. How to Run Locally and Redeploy

### Local Setup (5 minutes)
1. Clone and install: `git clone <repo> && cd sd && npm install`
https://github.com/johnjairoga/sd.git
2. Add `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
3. Verify database schema in Supabase exists (see schema below)
4. Run: `npm run dev` → http://localhost:3000

### Database Schema (Supabase SQL)
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT,
  source TEXT,
  seller TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON leads FOR SELECT USING (true);
CREATE POLICY "Allow insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update" ON leads FOR UPDATE USING (true);
CREATE POLICY "Allow delete" ON leads FOR DELETE USING (true);
```

### Redeploy (1 click)
Push to `main` → Vercel auto-deploys. If not connected, import to vercel.com and add env vars.

---

## b. Adding a New Feature (Example: Change Status Badge Color)

**Goal:** Change "Closed Won" badge from green to gold in table/kanban.

1. **Edit `components/TableView.tsx` or `components/KanbanBoard.tsx` (line ~36):**
   ```tsx
   closed_won: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
   ```

2. **Test locally:** `npm run dev` → check color change

3. **Deploy:**
   ```bash
   git add components/TableView.tsx
   git commit -m "style: change closed_won badge to gold"
   git push origin main
   ```

**Time:** 3 min. **Risk:** None (UI-only).

---

## c. Known Limitations & Risks

| Limitation | Risk | Fix |
|-----------|------|-----|
| **RLS permissive** | Anyone with env vars can read/write all leads | Add Supabase Auth + user-tied RLS |
| **No backups** | Data loss if incident | Enable Supabase paid tier backups |
| **Mobile drag-drop missing** | Users must use Edit button on mobile | Acceptable — Edit covers 95% of use cases |
| **No email alerts** | Manual checks needed for inactive leads | Add Resend/SendGrid integration |

---

## d. Handoff Scenario: If You Left Tomorrow

### Non-technical owner checklist
- [ ] Vercel account + password (redeploy, logs)
- [ ] Supabase account + password (data access)
- [ ] GitHub account + password (code changes)
- [ ] Backup: env vars `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`


### Docs to share
1. This file (MAINTENANCE.md)
2. AI-LOG.md (commit history)
3. GitHub repo URL + `main` branch
4. Supabase project name

### Common tasks for new dev
- **Bug fix:** 20–30 min (test locally, push)
- **Small feature (filter, color change):** 10–20 min
- **Database change:** 30 min (SQL + migration + test)
- **Emergency fix:** 5 min (push to main, auto-deploy)

### Weekly monitoring (10 min)
- Vercel: any deploy failures?
- Supabase: storage trending up?
- User feedback: complaints about performance?
