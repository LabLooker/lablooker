# Migration Notes

## add-community-notes.sql

**Status:** Needs manual application

**Instructions:**
1. Go to the Supabase dashboard: https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir
2. Navigate to **SQL Editor**
3. Paste and run the contents of `add-community-notes.sql`:

```sql
ALTER TABLE tests ADD COLUMN IF NOT EXISTS community_notes TEXT;
```

4. Once the column exists, run the seed script to populate it:

```bash
cd /home/mightyyeti/lablooker
node supabase/seed-community-notes.mjs
```

**Why manual?** The Supabase REST API doesn't support DDL statements. This ALTER TABLE must be run via the SQL editor in the dashboard.

**What it adds:** Community/functional medicine notes for key tests — thyroid (TSH, Free T3, Free T4, Reverse T3, antibodies), hormones (testosterone, estradiol, progesterone, DHEA-S, cortisol), iron (ferritin), and vitamins/minerals (Vitamin D, magnesium, RBC magnesium, calcium). Reflects STTM, BHRT community, and functional medicine knowledge.

---

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

## saved_providers table
Run supabase/add-saved-providers.sql in the Supabase SQL Editor:
https://supabase.com/dashboard/project/cbeazeiehgiwhklxtdir/sql/new
