# Task: Deepen Compare Prices + Search Pages (SEO + Destination Feel)

## Goal
Both the Compare Prices (`/compare`) and Search Tests (`/search`) pages are currently 100%
client-rendered shells. Static crawlers (Google, social link previews, Chekov's audit tool)
see almost no content. Real users see the full interactive experience, but it still feels
thin — there's a search bar, some results, and then footer. No educational depth, no "this
is a real product" signal.

Add server-rendered static content to both pages so they feel like genuine destination pages.
This improves SEO AND gives real users more context.

## Design System
- Primary/sage: `#2d6a5e`
- Brick rose: `#b85c5c`
- Dark: `#1a2e2b`
- Light bg: `#f0f7f6`
- Border: `#e0ebe9`
- Placeholder text: `#577572`
- All content cards: left-align text, center pills/tags

---

## Page 1: Compare Prices (`/compare`)

### Current state
`src/app/(marketing)/compare/page.tsx` — fully `'use client'` component. Has a search bar
and category buttons. Results are dynamic. 4 trust chips already added (Mar 30).

### What to add (BELOW the existing interactive tool)
Add a server-rendered `<section>` below the client component. Do NOT break the existing
interactive functionality — just add static HTML after it.

**Section 1: "How price comparison works"**
- 3-column (desktop) / stacked (mobile) explainer cards:
  1. 🔍 Search for a test — type the test name or browse by category
  2. 📊 Compare prices instantly — see retail self-pay prices across 6+ labs side by side
  3. 📋 Order directly — click through to order at the lab of your choice
- Keep it brief — 1 headline + 1-2 sentence explanation per card

**Section 2: "Labs included in our comparison"**
- Simple grid of lab names (text, not logos — no logo assets available):
  - Quest Diagnostics, LabCorp, Ulta Lab Tests, Walk-In Lab, Life Extension, empowerDX,
    Everlywell (at-home)
- Small note: "Prices verified twice weekly. Self-pay — no insurance required."

**Section 3: "Why self-pay lab testing?"**
- 3 honest bullet points or short paragraphs:
  1. No referral needed — order when you want, not when your doctor approves
  2. Often cheaper than insurance copays for out-of-network labs
  3. See your own results first — useful for chronic illness patients who track trends

**Section 4: Short FAQ (3 questions)**
Use simple `<details>/<summary>` or styled expand/collapse. Questions:
1. "Are these prices accurate?" → Yes, we verify them twice weekly via automated checks.
   Exact prices can vary by location.
2. "Do I need an account to compare prices?" → No — comparing is always free, no signup.
3. "What's the difference between these labs?" → Brief 1-liner on each type
   (national labs like Quest/LabCorp require physician order in some states; direct-to-
   consumer like Ulta/Walk-In Lab ship nationwide, no order needed).

---

## Page 2: Search Tests (`/search`)

### Current state
`src/app/(marketing)/search/page.tsx` — fully `'use client'`. Has a search bar and browse
shortcuts. We already removed the "Loading..." spinner and added "Browse 408+ lab tests"
static text (deployed Mar 30). Still feels thin below the search bar.

### What to add (BELOW the existing interactive tool)
Again — server-rendered section appended after the client component.

**Section 1: "What you can search for"**
- 3 short cards explaining the search:
  1. 🩸 Lab test names — search "ferritin", "TSH", "HbA1c", "CBC" etc.
  2. 🔤 Lab codes — paste codes from your lab report like "004267" or "006627"
  3. 🧬 Symptoms or conditions — search "fatigue", "thyroid", "iron deficiency"
- Keep it brief — this is orientation, not a feature pitch

**Section 2: "Popular tests right now"**
- Static list of ~12 common tests as text links to `/search?q=TestName`:
  - TSH (Thyroid), Free T3, Free T4, Ferritin, Vitamin D, B12, CBC, CMP, Cortisol,
    DHEA-S, Testosterone (Total), hs-CRP
- Display as a pill/tag grid (centered, soft sage background)

**Section 3: "Browse by health focus"**
- 6 category cards (2-col mobile, 3-col desktop) with icon + label + 1-line description:
  - 🦋 Thyroid — TSH, Free T3, Free T4, Anti-TPO, TRAb
  - ⚡ Energy & Iron — Ferritin, CBC, B12, Folate, Iron Panel
  - ⚖️ Hormones — Estradiol, Testosterone, Progesterone, DHEA-S, Cortisol
  - 🧠 Mood & Brain — Vitamin D, B12, Homocysteine, hs-CRP, Magnesium
  - 💪 Metabolic — HbA1c, Fasting Glucose, Insulin, Lipid Panel, ApoB
  - 🛡️ Immune & Inflammation — hs-CRP, ESR, ANA, Anti-TPO, Ferritin
- Each card links to the existing category browse functionality if possible, or just
  to `/search?q=category-name`

---

## Implementation Notes

### How to structure this in Next.js App Router:
The cleanest pattern is to keep the existing client component but wrap it in a server
component page. Example for compare:

```
// src/app/(marketing)/compare/page.tsx  (server component — no 'use client')
import CompareClient from '@/components/compare/CompareClient'  // existing client code moved here

export default function ComparePage() {
  return (
    <>
      <CompareClient />        {/* existing interactive tool */}
      <CompareStaticContent /> {/* new static SEO sections */}
    </>
  )
}
```

If refactoring the whole client component is risky/complex, it's also fine to just append
a static `<section>` at the bottom of the existing client component files. Static JSX
inside a client component still renders server-side in Next.js App Router (it just
hydrates). The SEO content will still be in the initial HTML payload.

**Use whichever approach is simpler and lower risk.**

### Styling
- Use existing Tailwind classes consistent with the rest of the site
- Section headings: `text-xl font-semibold` in `text-[#1a2e2b]`
- Cards: `bg-white rounded-xl border border-[#e0ebe9] p-5`
- Soft section backgrounds: `bg-[#f0f7f6]`
- No new dependencies

### Do NOT change
- The existing search/filter/results functionality
- The existing trust chips on the compare page
- Anything in the nav or footer
- Any other pages

---

## When done
Run:
```
openclaw system event --text "Done: Compare + Search pages deepened with static SEO content" --mode now
```

Then commit with message: `deepen compare + search pages with static educational content`
Use git author: `Scotty Russell <scotty@houserussell.com>`, then restore to `spock@the-forge`.
Push to main.
