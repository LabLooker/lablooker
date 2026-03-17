# Build Task — Medical Calculators

## Context
LabLooker (lablooker.com) — Next.js 15 + Supabase + Tailwind v4.
Design system: sage (#2d6a5e), brick rose (#b85c5c), dark (#1a2e2b), light bg (#f0f7f6), border (#e0ebe9), placeholder (#577572).
All calculators live at /calculators/[slug].

## What to Build

Build a medical calculators suite. Each calculator is:
- A free standalone page (no login required)
- Clean, simple UI: input fields → result displayed inline
- Auto-populate note for premium users (see below)
- SEO-friendly with a brief clinical description
- Disclaimer: "For informational purposes only. Not medical advice."

There is already a /calculators page and possibly some calculators. Read the existing code first at src/app/(marketing)/calculators/ before building to avoid duplication.

---

### Calculator 1: Corrected Calcium
**URL:** /calculators/corrected-calcium
**Formula:** Corrected Ca = Measured Ca + 0.8 × (4.0 − Albumin)
**Inputs:**
- Measured Calcium (mg/dL)
- Albumin (g/dL)
**Output:** Corrected Calcium in mg/dL
**Clinical context:** Used for patients with low albumin (hypoalbuminemia). Standard calcium test can underestimate true calcium when albumin is low. Important for hypoparathyroidism patients on Yorvipath/PTH therapy, kidney disease, cancer patients.
**Normal range:** 8.5–10.5 mg/dL

### Calculator 2: HOMA-IR (Insulin Resistance)
**URL:** /calculators/homa-ir
**Formula:** HOMA-IR = (Fasting Glucose mg/dL × Fasting Insulin µIU/mL) ÷ 405
**Inputs:**
- Fasting Glucose (mg/dL)
- Fasting Insulin (µIU/mL)
**Output:** HOMA-IR score
**Interpretation:**
- < 1.0 = Optimal insulin sensitivity
- 1.0–1.9 = Early insulin resistance
- 2.0–2.9 = Significant insulin resistance
- ≥ 3.0 = Severe insulin resistance
**Note:** High SEO value — very searched by keto/carnivore/diabetes communities

### Calculator 3: Free Testosterone (Vermeulen Method)
**URL:** /calculators/free-testosterone
**Formula:** Uses the Vermeulen equation (standard clinical method)
Simplified approach: Free T (pg/mL) ≈ (Total T × 0.0311) when SHBG is not available
Full Vermeulen if all three inputs available.
**Inputs:**
- Total Testosterone (ng/dL)
- SHBG (nmol/L) — optional
- Albumin (g/dL) — optional, default 4.3
**Output:** Estimated Free Testosterone (pg/mL or nmol/L)
**Clinical context:** Important for BHRT/TRT patients — Quest total T is known to inflate results for women on BHRT. Free T gives a more accurate picture.

### Calculator 4: Iron Saturation %
**URL:** /calculators/iron-saturation
**Formula:** Iron Saturation % = (Serum Iron ÷ TIBC) × 100
**Inputs:**
- Serum Iron (µg/dL)
- TIBC (µg/dL)
**Output:** Transferrin Saturation percentage
**Interpretation:**
- < 16% = Iron deficiency (low saturation)
- 16–45% = Normal
- > 45% = Iron overload risk (hemochromatosis concern)
**Clinical context:** Standard iron panel interpretation. HFE/hemochromatosis screening uses this alongside ferritin.

### Calculator 5: Non-HDL Cholesterol
**URL:** /calculators/non-hdl-cholesterol
**Formula:** Non-HDL = Total Cholesterol − HDL
**Inputs:**
- Total Cholesterol (mg/dL)
- HDL Cholesterol (mg/dL)
**Output:** Non-HDL Cholesterol (mg/dL)
**Interpretation:**
- < 130 mg/dL = Optimal
- 130–159 = Near optimal
- 160–189 = Borderline high
- ≥ 190 = High
**Clinical context:** Better cardiovascular risk predictor than LDL alone. Includes VLDL and other atherogenic particles. Especially useful when triglycerides are elevated.

---

## Premium Auto-Populate Feature
Each calculator page should check if the user is logged in AND is_premium. If so, show a subtle message below the result:

"💡 These values match your recent results. [View in tracker →]"

Link to /dashboard/tracker/[testId] for the relevant test if a match is found. This is a nice-to-have — if complex, skip it and just add the note text as a placeholder.

---

## Navigation
Add all 5 calculators to the existing /calculators index page. If there's already a calculators index, add them to it. If not, create a simple grid page listing all calculators with a brief description each.

Also check if calculators appear in the Nav or Footer — add a "Calculators" link if not already there.

---

## Constraints
- No new dependencies
- Keep each calculator as a simple client component
- Mobile-friendly inputs (large touch targets)
- All design system colors
- Brief, patient-friendly language

## When Done
Run: openclaw system event --text "Done: Medical calculators built — Corrected Calcium, HOMA-IR, Free Testosterone, Iron Saturation, Non-HDL" --mode now
