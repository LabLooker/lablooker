# Build Task — Dashboard UX Mar 17

## Context
LabLooker (lablooker.com) — Next.js 15 + Supabase + Tailwind v4.
Design system: sage (#2d6a5e), brick rose (#b85c5c), dark (#1a2e2b), light bg (#f0f7f6), border (#e0ebe9), placeholder (#577572).

## Items to Build

---

### 1. Favicon — Dark Mode Fix

**Problem:** The favicon disappears on dark browser tabs/chrome because it's light-colored with a transparent background.

**Fix:** Edit `src/app/layout.tsx` to serve a dark-mode variant.
- In the `<head>`, add a dark-mode favicon link alongside the existing one using `media="(prefers-color-scheme: dark)"`
- The dark variant should use `/favicon-dark.png` or similar
- Also create a simple SVG favicon with a solid sage (#2d6a5e) background as a fallback that works on both

Check what favicon files exist in `/public/` first, then implement the most practical solution. If there's a single .ico or .png, the best fix is to add an SVG favicon with a solid sage background baked in — add it to `/public/favicon.svg` and reference it in layout.tsx. SVG favicons are supported by all modern browsers.

SVG favicon template (solid sage background, white "L" mark):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#2d6a5e"/>
  <text x="16" y="23" font-family="Georgia,serif" font-size="20" font-weight="bold" text-anchor="middle" fill="white">L</text>
</svg>
```
Adjust the letter/mark to match the actual logo if needed — look at the existing favicon files to understand the logo shape, then replicate it in SVG with the solid background.

---

### 2. Delete Imported Tests

**Problem:** Users can import a PDF (via PdfImportModal) or CSV (via ImportModal) but have no way to delete those results if they made an error. There's no `import_session_id` being tracked, so we can't do batch deletes by import session.

**Solution:** 

#### 2a. Add import_session_id to lab_results inserts

In `src/components/dashboard/PdfImportModal.tsx`:
- Generate a UUID at the start of import: `const importSessionId = crypto.randomUUID()`
- Add `import_session_id: importSessionId` to each row in the `inserts` array

In `src/components/tracker/ImportModal.tsx` (CSV import):
- Same — generate a UUID and add to inserts

NOTE: The `import_session_id` column may not exist yet in Supabase. We need to handle this gracefully. Add the field to inserts but wrap in a try-catch — if it fails due to missing column, fall back to insert without it. Also create a SQL migration file at `supabase/add-import-session.sql`:
```sql
ALTER TABLE lab_results ADD COLUMN IF NOT EXISTS import_session_id uuid;
CREATE INDEX IF NOT EXISTS lab_results_import_session_idx ON lab_results(import_session_id);
```

#### 2b. Delete UI on Dashboard

In `src/app/(app)/dashboard/page.tsx`, add a way to delete individual results or by import session.

**Approach — individual result delete:**
- On each marker row in the dashboard list, add a small delete (trash) icon that appears on hover
- Clicking it shows a confirmation modal: "Delete [Test Name]? This will remove all [N] saved results for this test. This cannot be undone." with Cancel / Delete buttons
- On confirm: `DELETE FROM lab_results WHERE user_id = $userId AND test_id = $testId`
- After delete, remove the marker from the list (optimistic update)
- Style: trash icon in `text-[#577572]`, hover `text-[#b85c5c]`. Confirmation modal uses brick rose for the Delete button.

The confirmation modal can be a simple inline component (not a separate file needed — just a small modal overlay with the standard border/bg styling).

---

### 3. Button Renaming on Dashboard

In `src/app/(app)/dashboard/page.tsx`, update the action button labels:
- "Import" (triggers PdfImportModal) → **"Upload Lab Report"**
- "Log" (triggers ResultLogModal for single result) → **"Log Result"**

Also update the empty state text (currently "Import a lab PDF or log a result to get started") to match the new labels:
→ "Upload a lab report or log a result to get started."

---

## Constraints
- Keep changes minimal and focused — don't refactor unrelated code
- Always confirm before destructive DB operations (show modal)
- No new dependencies
- All new UI must use the existing design system colors listed above
- Test that dashboard still loads correctly after changes

## When Done
Run: openclaw system event --text "Done: Dashboard UX build complete — favicon fix, delete results UI, button renames" --mode now
