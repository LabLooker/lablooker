# Track Page Redesign — Build Task

## Context
LabLooker is a lab test comparison/tracking app. Next.js 15 + Supabase + Tailwind v4. 
Design system colors: sage (#2d6a5e), terracotta (#c0826a), dark (#1a2e2b), light bg (#f0f7f6), border (#e0ebe9).

The Track/dashboard page currently uses a card/tile grid that doesn't scale. We're redesigning it around a Markers + Reports model.

## Core Model
- **Markers** = normalized analytes tracked across reports over time (Ferritin, TSH, Glucose)
- **Reports** = imported lab sets/events (a PDF upload, CSV import, or manual entry)
- A report contains many markers. A marker appears across many reports.
- **Goals and ranges belong to markers, not reports.**

## What to Build

### 1. Dashboard/Track Page (`src/app/(app)/dashboard/page.tsx`)
Replace the current card grid with:

**Summary strip** at top:
- Markers tracked, In range, Out of range, Below goal, Needs update (>90 days)
- Clean stat chips, horizontal row

**Two tabs** (segmented control): **Markers** (default) | **Reports**
- NO "Goals" tab — goals are marker-level, accessed in marker detail

**Markers tab** — dense table/list:
- Columns: Marker name | Latest value + unit | Status | Trend | Goal | Date | Results count | Labs
- Status badges: "In Range" (green), "Low" (terracotta), "High" (terracotta), "No Range" (gray)
- Trend arrows: ↑ Rising, ↓ Falling, → Stable (colored appropriately)
- Goal column: blank dash "—" if no goal set, "✓ At goal" (green) or "Below goal (50+)" (terracotta) if set
- "Date" header (not "Updated")
- Entire row clickable → navigates to marker detail page
- Search bar + filter buttons (Out of range, Below goal, Needs update)

**Reports tab** — list of imported reports:
- Each row: date, source lab, panel title (auto-detected or "Manual Entry"), marker count, import method badge (PDF/CSV/Manual), unmatched count if >0
- Actions: View, Delete (with confirmation "Are you sure you want to delete this report and all its results?")

**Import buttons** at top right: Import PDF, Import CSV, Log Result

### 2. Marker Detail Page (`src/app/(app)/dashboard/tracker/[testId]/page.tsx`)
Redesign the existing detail page:

**Header**: Marker name (normalized) + subtitle showing alternate imported names
- Compact summary: "4 results · 2 labs · Last drawn Mar 3"
- Latest value + unit + status badge

**Trend chart** (keep existing chart library or use simple SVG):
- Range toggle chips below chart: Standard range | Functional range 🔒 | My goal
- Toggleable visual bands on chart
- Time range selector: All time | 1Y | 6M | 3M
- Remove the 3-month free tier limit on chart display for now (we'll add it back with premium later)

**Goal setting card**:
- Direction selector: Above / Below / Between
- Value fields matching the selected direction (single value for Above/Below, min+max for Between)
- Optional note field
- Save button

**Result history table**:
- Columns: Date | Value + unit | Reference range | Status | Lab | Source label | Notes
- Delete button per row — use a subtle trash icon, NOT prominently displayed. Clicking shows confirmation dialog.
- "Delete All [Marker] Data" button at bottom (also with confirmation)

### 3. Delete Functionality
- **Delete individual result**: trash icon per row in marker detail history, confirmation dialog
- **Delete entire report**: delete button per report in Reports tab, confirmation dialog ("This will delete X results from Y markers")
- **Delete all marker data**: button in marker detail, confirmation dialog
- **Delete all data / Delete account**: move to Settings page (`src/app/(app)/settings/page.tsx`), add a "Data Management" section at bottom with:
  - "Delete All My Data" — confirmation dialog requiring typing "DELETE" 
  - "Delete My Account" — confirmation dialog requiring typing "DELETE MY ACCOUNT"
  - Both should call Supabase to delete user data, then sign out

### 4. Database Changes
We need a `lab_reports` table to track import batches:
```sql
CREATE TABLE IF NOT EXISTS lab_reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source_lab text,
  panel_title text,
  import_method text DEFAULT 'manual' CHECK (import_method IN ('pdf', 'csv', 'manual')),
  drawn_at date,
  marker_count int DEFAULT 0,
  unmatched_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE lab_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own reports" ON lab_reports FOR ALL USING (auth.uid() = user_id);
```

Add `report_id uuid REFERENCES lab_reports(id) ON DELETE CASCADE` to `lab_results` table (nullable, for backward compat with existing manual entries).

When PDF/CSV import happens, create a report row first, then attach all results to it.

### 5. Affiliate Click Tracking
Add a simple click tracking table and utility:
```sql
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  provider text NOT NULL,
  test_name text,
  page_path text,
  page_type text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert clicks" ON affiliate_clicks FOR INSERT TO anon, authenticated WITH CHECK (true);
```

Create `src/lib/track-click.ts`:
```typescript
import { createClient } from '@/lib/supabase'
export async function trackAffiliateClick(provider: string, testName?: string, pageType?: string) {
  const supabase = createClient()
  await supabase.from('affiliate_clicks').insert({
    provider,
    test_name: testName,
    page_path: window.location.pathname,
    page_type: pageType
  })
}
```

Wire this into all affiliate outbound links on Compare page and Bundle pages — call trackAffiliateClick before opening the external link.

## Design Notes
- Use the existing design system colors (sage, terracotta, dark, light bg, borders)
- Keep it clean and scannable — this is a health tracking workspace, not a dashboard toy
- Table rows should have subtle hover state
- Mobile: table becomes a dense list (marker name + value on one line, status + date below)
- All confirmation dialogs should be modal with clear cancel/confirm buttons
- Status language must be consistent everywhere: In Range, Low, High, Out of Range, No Range

## Files to Reference
- Current dashboard: `src/app/(app)/dashboard/page.tsx`
- Current tracker detail: `src/app/(app)/dashboard/tracker/[testId]/page.tsx`
- Current card component: `src/components/tracker/TestSummaryCard.tsx`
- Settings page: `src/app/(app)/settings/page.tsx`
- PDF import: `src/app/api/parse-pdf/route.ts`
- CSV import modal: check for ImportModal in components
- Supabase client: `src/lib/supabase.ts`
- Current schema: `supabase/lab-tracker-schema.sql`

## Important
- Keep changes as simple as possible. Don't over-engineer.
- Preserve all existing functionality (PDF import, CSV import, manual log)
- The existing lab_results table and data must continue to work
- Generate SQL migration files in `supabase/` directory for Rosa to run manually
- Commit after each major piece is working

When completely finished, run this command to notify me:
openclaw system event --text "Done: Track page redesign complete — markers table, reports view, marker detail, delete functionality, affiliate click tracking" --mode now
