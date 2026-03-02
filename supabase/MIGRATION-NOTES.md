# Migration Notes

## add-prep-notes.sql

**Status:** Needs manual application

**Instructions:**
1. Go to the Supabase dashboard: https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir
2. Navigate to **SQL Editor**
3. Paste and run the contents of `add-prep-notes.sql`:

```sql
ALTER TABLE tests ADD COLUMN IF NOT EXISTS prep_notes TEXT;
```

4. Once the column exists, run the seed script to populate it:

```bash
cd /home/mightyyeti/lablooker
node supabase/seed-prep-notes.mjs
```

**Why manual?** The Supabase REST API doesn't support DDL statements. The management API requires a personal access token. This ALTER TABLE must be run via the SQL editor in the dashboard.
