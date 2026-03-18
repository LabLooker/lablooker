# LabLooker — Overnight Build Tasks
_Last updated: March 18, 2026_

## Overview
Three features to build tonight. Work through them in order. Each is independent.

---

## Task 1: Import Plausibility Check (Flag Impossible Values)

**Goal:** Before saving imported lab results, flag values that are physiologically impossible. Show a warning but still allow the user to save if they want.

**Where:** `src/components/tracker/PdfImportModal.tsx` and `src/components/tracker/ImportModal.tsx`

**How it should work:**
- After parsing but BEFORE the user clicks "Save", check each result value against a range table
- If any value is outside the plausible range, show a yellow warning banner: "⚠️ Some values look unusual — please verify before saving"
- List the flagged markers with their values (e.g. "Calcium: 4.5 mg/dL — unusually low, expected 7.5–11.0")
- Still allow the user to save — this is a warning, not a blocker

**Plausibility ranges to check** (physiologically impossible if outside these):
```
Calcium (Total): 4.0–14.0 mg/dL
Sodium: 110–170 mEq/L
Potassium: 1.5–7.5 mEq/L
Glucose: 20–700 mg/dL
Creatinine: 0.2–20.0 mg/dL
Hemoglobin: 4.0–20.0 g/dL
TSH: 0.001–100 mIU/L
Ferritin: 1.0–3000 ng/mL
Vitamin D (25-OH): 4.0–200 ng/mL
Albumin: 1.0–6.0 g/dL
ALT: 1–1000 U/L
AST: 1–1000 U/L
WBC: 0.5–50.0 K/uL
Platelets: 10–1000 K/uL
```

**Matching:** Match by test name (case-insensitive, partial match OK). If a test doesn't appear in the table, skip it — no warning.

**Implementation notes:**
- Create a `src/lib/plausibility.ts` file with the range table and a `checkPlausibility(results)` function
- Returns an array of `{testName, value, unit, message}` for any flagged results
- Call it in both PdfImportModal and ImportModal after parsing, before the save button

---

## Task 2: Lab Visit View (Grouped by Draw Date)

**Goal:** A new "Lab Visits" tab on the dashboard that shows all results grouped by draw date — so users can see their complete lab report from a single visit.

**Where:** Dashboard at `src/app/(app)/dashboard/page.tsx`

**Current state:** The dashboard has tabs (or filter pills) for different views. Currently shows individual marker trends. We want to add a "Lab Visits" tab.

**What the Lab Visits tab should show:**
- List of distinct draw dates (from `lab_results.drawn_at`), sorted newest first
- Each visit card shows:
  - Draw date (formatted nicely, e.g. "March 15, 2026")
  - Lab name (from `lab_results.lab_name`) if available
  - Count of markers ("14 markers")
  - Expandable/collapsible: click to expand and see all markers from that draw
  - When expanded: table of Marker Name | Value | Unit | Status (in-range / out-of-range based on reference ranges if available)
- Group by `drawn_at` date (use date portion only — ignore time)
- If multiple imports on the same date exist (same drawn_at), merge them into one visit card

**Status color for each marker row:**
- Use the same logic as the dashboard tracker: compare value against `normal_range` from the `tests` table
- If no reference range available, show value without status color

**Data query:**
- `lab_results` joined with `tests` (for test name + normal_range)
- Filter by `user_id = current user`
- Order by `drawn_at DESC`, then by `tests.name ASC` within each visit

**UI style:**
- Match existing dashboard card style (sage/brick rose design system)
- Visit cards: white card with sage border, date bold, lab name in muted text below
- Expand/collapse with a chevron icon
- Marker rows: compact, alternating subtle background

**Premium gate:** Lab Visits tab should be premium-only (same as the tracker). Show the existing premium upgrade nudge for free users.

---

## Task 3: Corrected Calcium Calculator — Yorvipath Clinical Callout

**Goal:** Add a clinical note to the Corrected Calcium calculator page that's relevant for hypoparathyroidism patients on Yorvipath/PTH therapy.

**Where:** Find the corrected calcium calculator page — likely at `src/app/(marketing)/calculators/corrected-calcium/page.tsx` or similar path. Search for it.

**What to add:** After the calculator results section (or below the main explanation), add a styled callout box:

```
💊 Note for Hypoparathyroidism Patients (Yorvipath / PTH Therapy)

Albumin-adjusted calcium is especially important when you have hypoparathyroidism 
and are managing your calcium levels with PTH replacement therapy (such as Yorvipath).

Even when your albumin is normal (4.0 g/dL), using the corrected formula helps 
standardize how your calcium is tracked over time — because small shifts in albumin 
(common with dietary changes, illness, or hydration) can make your measured calcium 
appear falsely high or low.

Target range for most Yorvipath patients: 8.0–9.5 mg/dL (corrected).
Always follow your endocrinologist's specific targets, which may differ.
```

**Style:** Use a light sage background callout box (matching the site's design system — sage #2d6a5e border, light sage bg). Keep it visually distinct from the calculator itself.

---

## Task 4: Add MTHFR Gene Test to Database

**Goal:** Add MTHFR gene test to the `tests` table so we can add empowerDX pricing for it.

**How:** Run a Supabase REST API insert. The Supabase project URL is `https://cbeazeiehgiwhklxtdir.supabase.co` and the service role key is in `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`.

Insert this test:
```json
{
  "name": "MTHFR Gene Mutation",
  "category": "genetics",
  "description": "Detects mutations in the MTHFR gene (C677T and A1298C variants) that affect folate metabolism, homocysteine processing, and methylation. Elevated homocysteine from MTHFR variants is linked to cardiovascular risk, clotting disorders, and neural tube defects.",
  "why_it_matters": "MTHFR variants affect how your body processes folate and B vitamins. Knowing your status can guide supplementation (methylfolate vs folic acid) and help explain elevated homocysteine, recurrent pregnancy loss, or cardiovascular risk.",
  "normal_range": "No mutation detected (wild type)",
  "unit": "",
  "cpt_code": "81291",
  "aliases": ["MTHFR", "MTHFR Mutation", "Methylenetetrahydrofolate Reductase", "MTHFR C677T", "MTHFR A1298C"]
}
```

After inserting, print the new test's UUID so we can use it for empowerDX pricing.

Then insert empowerDX pricing:
- empowerDX lab_id is: `5b498b82-5aea-440c-b5a5-d59960c164a7`
- Price: $89.00
- Use the new test's UUID as test_id

Check the `.env.local` file for the service role key.

---

## Commit Instructions

After completing all tasks:
1. `git config user.email "scotty@houserussell.com" && git config user.name "Scotty Russell"`
2. `git add -A && git commit -m "feat: import plausibility check, lab visits view, calcium callout, MTHFR test"`
3. `git push`
4. `git config user.email "spock@the-forge" && git config user.name "Spock"`

Then notify:
`openclaw system event --text "Overnight build done: plausibility check, lab visits tab, calcium callout, MTHFR gene test added" --mode now`
