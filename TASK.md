# LabLooker — Share Results Feature
_March 18, 2026_

## Goal
Let premium users generate a shareable link to their lab results. The recipient page (`/shared/[token]`) already exists and works — we just need to build the UI to CREATE a share link from the dashboard.

---

## Background

- `lab_shares` table already exists in Supabase with columns:
  `id, user_id, share_token, test_ids (uuid[]), title, note, is_active, created_at`
- View page at `src/app/(marketing)/shared/[token]/page.tsx` already exists — shows charts + results to anyone with the link, with a LabLooker signup CTA at the bottom
- Need to check exact column names with a quick Supabase query before building

---

## Task: Share Button + Modal on Dashboard

**Where:** `src/app/(app)/dashboard/page.tsx`

### 1. "Share Results" button

Add a "Share" or "Share Results" button near the top of the dashboard (near the Export button). Only show for users with saved results.

### 2. Share Modal

When clicked, open a modal with:

**Step 1 — Configure the share:**
- Optional title field (placeholder: "My Thyroid Results" or "Results for Dr. Smith")
- Optional note field (placeholder: "Here are my recent labs for your review")
- Test selector: checkboxes for each test the user has saved results for — they pick which ones to include in the share
- "Generate Link" button

**Step 2 — Link generated:**
- Show the full URL: `https://lablooker.com/shared/[token]`
- Large "Copy Link" button (copies to clipboard, shows "Copied!" confirmation)
- Small note: "Anyone with this link can view these results. No account required."
- "Done" button to close

### 3. API route to create share

**Create:** `src/app/api/share/create/route.ts`

- POST request, requires authenticated user
- Body: `{ title?: string, note?: string, testIds: string[] }`
- Validate: at least one testId required
- Generate a random token: `crypto.randomUUID()` or a shorter 12-char random string (use `nanoid`-style: `Math.random().toString(36).slice(2, 14)`)
- Insert into `lab_shares`: `{ user_id, share_token, test_ids, title, note, is_active: true }`
- Return: `{ token, url: "https://lablooker.com/shared/[token]" }`

### 4. Manage existing shares (stretch goal — do if time allows)

On the dashboard, below the share button or in a small "Shared Links" section:
- List any existing active share links the user has created
- Show: title (or "Untitled"), date created, "Copy" button, "Deactivate" button
- Deactivate sets `is_active = false` — the link then shows "invalid or deactivated" to visitors

---

## Share token format

Use a 16-char alphanumeric token for URLs that look clean:
```ts
const token = Array.from(crypto.getRandomValues(new Uint8Array(12)))
  .map(b => b.toString(36).padStart(2, '0'))
  .join('')
  .slice(0, 16)
```
Or just use `crypto.randomUUID()` if the above is complex — UUIDs are fine.

---

## Style Notes

- Modal style: match existing modals in the codebase (white card, sage border/accents, brick rose for destructive actions)
- Copy button: sage background, shows "Copied ✓" for 2 seconds after click
- Deactivate button: brick rose text, confirmation before deactivating
- The share page already has the LabLooker branding and signup CTA — no changes needed there

---

## Commit Instructions

After completing:
1. `git config user.email "scotty@houserussell.com" && git config user.name "Scotty Russell"`
2. `git add -A && git commit -m "feat: share results — generate shareable links from dashboard"`
3. `git push`
4. `git config user.email "spock@the-forge" && git config user.name "Spock"`

Then notify:
`openclaw system event --text "Share results feature done: users can generate shareable links from dashboard" --mode now`
