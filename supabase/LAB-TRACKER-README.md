# Lab Tracker Database Setup

## ⚠️ Action Required: Apply Database Schema

The Lab Tracker feature requires 3 new tables. Because the Supabase database is IPv6-only
and cannot be reached via psql from this server, you must apply the schema manually.

---

## Option A: Supabase Dashboard SQL Editor (Recommended)

1. Go to: https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir/sql/new
2. Copy-paste the full contents of `supabase/lab-tracker-schema.sql`
3. Click **Run**

---

## Option B: Management API Script

If you have a Supabase personal access token:

```bash
SUPABASE_ACCESS_TOKEN=<your-token> node supabase/apply-lab-tracker-schema.mjs
```

Get a token at: https://supabase.com/dashboard/account/tokens

---

## Tables Created

### `lab_results`
Stores individual lab result entries per user per test.
- `user_id` — links to auth.users
- `test_id` — links to tests table
- `value` — numeric result
- `unit` — e.g. "ng/mL"
- `drawn_at` — date blood was drawn
- `lab_name` — Quest, LabCorp, etc.
- `ref_range_low / high` — optional reference range from the lab slip
- `notes` — fasting info, timing, etc.

### `lab_goals`
Personal target ranges per user per test (unique per user+test).
- `target_value` — single target value
- `target_direction` — "above", "below", or "range"
- `target_low / high` — for range-type goals

### `lab_shares`
Tokenized public share links.
- `share_token` — random hex token for public URL
- `test_ids` — array of test UUIDs included in the share
- `title` / `note` — optional user-added context
- `is_active` — can be toggled off to revoke access

---

## RLS Policies
All tables have Row Level Security enabled:
- Users can only read/write their own data
- `lab_shares`: public can read active shares by token (for the /shared/[token] page)
