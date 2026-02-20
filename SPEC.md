# LabLooker — Product Specification

**Version:** 1.0  
**Date:** February 20, 2026  
**Owner:** Rosa Russell  
**Domain:** lablooker.com (register ASAP)

---

## 1. The Problem

Getting lab tests ordered, priced, and paid for in the US is unnecessarily opaque:

- Patients don't know what tests exist or what they're called
- Patients don't know which CPT or ICD-10 codes apply to their situation
- Prices vary wildly across labs — the same test can be $28 at Ulta Lab Tests or $900 at a hospital
- Insurance coverage is impossible to verify without knowing both the CPT code AND the right ICD-10 diagnosis code
- Lab requisitions are tied to one lab's proprietary codes — switching labs means starting over
- Doctors order more easily when patients come in with specific codes and clinical justification

Patients who want to advocate for their own healthcare have no single tool that helps them navigate all of this.

---

## 2. The Solution

**LabLooker** is a consumer-facing web app that lets patients:

1. Search any lab test by name, symptom, or lab-specific code
2. See the universal CPT code and plain-English description
3. Compare self-pay pricing across all major labs
4. Find ICD-10 codes that support insurance coverage for that test
5. Translate codes between labs (CPL → Quest, LabCorp → Ulta, etc.)
6. Generate a doctor request template with all codes included

One tool. Everything a patient needs to research, price, and request a lab test.

---

## 3. Target Users

### Primary (B2C)
- Chronically ill patients managing complex conditions (autoimmune, thyroid, hormonal, etc.)
- High-deductible health plan (HDHP) holders paying near full price until deductible clears
- Self-pay / uninsured patients seeking cheapest options
- "Quantified self" / health optimization community
- Patient advocates and healthcare researchers

### Secondary (B2B — future roadmap)
- Independent physicians, NPs, PAs in small/solo practices
- Functional and integrative medicine providers
- Concierge medicine practices
- Employer health benefits programs

### Persona: Rosa
> *53-year-old woman managing hypoparathyroidism, hypothyroidism, and multiple complex conditions. Has had 78+ lab draws across 15+ years. Wants to know exactly which tests to request, what codes to give her doctor, and what it'll cost — before she walks in the door. Currently spends hours researching this manually.*

---

## 4. Core Features — V1

### 4.1 Test Search
- Search by test name (e.g., "gastrin," "IGF-1," "testosterone")
- Search by symptom (e.g., "fatigue and hair loss" → suggests TSH, ferritin, cortisol, etc.)
- Search by any lab's proprietary code (e.g., enter CPL code → app identifies test)
- Results show: test name, what it measures (plain English), CPT code(s), related tests

### 4.2 CPT Code Lookup
- Every test displays its CPT code(s)
- Plain-English explanation of what the test measures and why it's ordered
- Related/similar tests (e.g., searching "TSH" also surfaces Free T3, Free T4, Reverse T3)
- Notes on variants (e.g., fasting vs. non-fasting, different methodologies)

### 4.3 Self-Pay Price Comparison
Side-by-side pricing across all major national options:

**Direct Labs (draw at their own locations):**
- Quest Diagnostics
- LabCorp / LabCorp OnDemand
- Any Lab Test Now
- CPL (Clinical Pathology Laboratories — TX regional)

**Online Intermediaries (order online, draw at Quest/LabCorp — often 30-50% cheaper than direct):**
- Ulta Lab Tests
- Walk-In Lab
- Request A Test
- HealthLabs.com
- Private MD Labs
- DirectLabs
- Personalabs
- Life Extension (LEF)

**At-Home Kit Services (limited test menu, finger prick or mail-in — separate category):**
- Everlywell
- LetsGetChecked

**Regional Labs (Phase 2 expansion):**
- CompuNet (Ohio/Midwest)
- HNL Lab Medicine (Pennsylvania)
- Others added by region over time

Displays for each: cash/self-pay price, whether doctor's requisition required, draw location type, turnaround time, notes. Flags which intermediaries use which underlying lab network (Quest vs. LabCorp).

### 4.4 ICD-10 Code Guide
- For each test, show common ICD-10 diagnosis codes that are typically accepted by insurance
- Plain-English label for each ICD-10 code (e.g., "E03.9 — Hypothyroidism, unspecified")
- Guidance on which ICD-10 + CPT combinations are most likely to get approved
- Disclaimer: *"ICD-10 codes are assigned by your provider. This information helps you have an informed conversation — it is not medical advice."*

### 4.5 Lab Code Crosswalk
- User enters any lab's proprietary order code (e.g., CPL 1234)
- App maps it to the universal CPT code
- Displays equivalent order codes at all other supported labs
- Use case: patient has a CPL requisition and wants to use Quest instead

### 4.6 Symptom-to-Test Lookup
- Free-text symptom entry (e.g., "always cold, hair falling out, exhausted")
- AI layer (OpenAI API) maps symptoms to commonly ordered lab tests
- Results show suggested tests with CPT codes, pricing, and ICD-10 codes
- Disclaimer: *"These tests are commonly associated with these symptoms. This is not a diagnosis. Discuss with your healthcare provider."*

### 4.7 Doctor Request Template
- One-click generation of a plain-text or printable request
- Includes: test name, CPT code, suggested ICD-10 codes, preferred lab, self-pay price or insurance note
- User can edit before saving/printing
- Can be emailed directly to provider's office via patient portal (copy/paste)

**Example output:**
> *"I would like to request the following lab test at my upcoming appointment:*
> *Test: Gastrin, Fasting | CPT Code: 82938 | Suggested ICD-10: K31.89 (Other specified diseases of stomach) | Preferred Lab: Quest Diagnostics | Estimated self-pay cost: $38"*

---

## 5. User Experience

### Platform
- **Web app** (responsive — works on mobile browser and desktop)
- No app store required — accessible via lablooker.com on any device
- Native mobile app (iOS/Android via Capacitor) — roadmap V2

### Navigation
- **Home:** Search bar (prominent), quick links to common panels (thyroid panel, hormone panel, metabolic panel, etc.)
- **Search Results:** Test card with CPT code, pricing table, ICD-10 section, crosswalk, doctor template button
- **Symptom Lookup:** Separate entry point — "I don't know the test name, I have symptoms"
- **My Tests (Premium):** Saved tests, past lookups, custom panels
- **Account:** Free vs. Premium status, insurance info (optional, for coverage estimates)

### Tone
- Plain English throughout — no jargon without explanation
- Patient-first framing ("You want to request..." not "The physician should order...")
- Empowering, not clinical

---

## 6. Monetization

### Free Tier
- Test search (unlimited)
- CPT code lookup
- Basic self-pay pricing (top 2-3 labs)
- Symptom-to-test lookup (limited — 3 searches/day)
- Doctor request template (basic)

### Premium ($6/month or $50/year)
- Full pricing across all labs
- ICD-10 code guidance
- Lab code crosswalk
- Unlimited symptom searches
- Saved tests and custom panels
- Full doctor request template with editing

### Affiliate Revenue (Day One)
- Referral links to Ulta Lab Tests, Walk-In Lab, Any Lab Test Now
- Commission: ~8-12% of order value (~$7-14 per completed order)
- Displayed as: "Order this test now — no doctor's order required in most states"

### B2B (Roadmap — post 10K users)
- LabLooker Practice: $99-199/month per provider
- Bulk patient tools, HIPAA compliance, EHR-friendly export
- Claim optimization (ICD-10 combinations that reduce denial rates)

---

## 7. Data Sources

| Data Type | Source |
|---|---|
| CPT codes | CMS public database (annual updates) |
| ICD-10 codes | CMS ICD-10-CM public database |
| Lab pricing (Quest, LabCorp) | Publicly accessible test catalogs + web scraping |
| Lab pricing (Ulta, Walk-In Lab) | Published online, affiliate data feeds |
| Proprietary lab order codes | Lab test catalogs (Quest, LabCorp published; CPL/regional = manual research) |
| Symptom-to-test mapping | OpenAI API (GPT-4o) with curated prompt + medical references |

**Pricing maintenance:** Quarterly review and update cycle. Prices change — flag "last updated" date on all pricing.

---

## 8. Legal & Compliance

- **HIPAA:** V1 B2C is designed to avoid PHI storage. Users are not required to enter personal health information — the tool provides general information only. No PHI = no HIPAA obligation for V1.
- **Disclaimers:** Present on every page — "Not medical advice. For informational purposes only. Consult your healthcare provider before ordering any lab test."
- **ICD-10 guidance disclaimer:** Codes are for informational and conversational use only; diagnosis codes are assigned by licensed providers.
- **State variations — Direct Access Testing (DAT) laws:**
DTC lab ordering is legal in ~35+ states but restricted or prohibited in others. LabLooker handles this gracefully:

- **Fully restricted** (no DTC ordering): New York, New Jersey, Rhode Island
- **Partially restricted** (varies by test): Arkansas, California, Illinois, Kansas, Maine, Maryland, Michigan, Mississippi, Missouri, Nevada, Utah
- **Open** (DTC allowed): All remaining states including Texas

**UX handling:**
- User sets state on first use (or via location detection)
- Open states: full self-pay ordering options with affiliate links displayed
- Restricted states: ALL core features remain fully available — test research, CPT codes, ICD-10 codes, pricing reference, lab code crosswalk, symptom lookup, and doctor request template. Only self-ordering affiliate links are hidden/grayed out with a brief note: *"Self-ordering may be restricted in your state — but you can use the Doctor Request Template to have your provider order this at your preferred lab."*
- State restriction data stored in database — updatable as laws change
- Key principle: restricted-state users lose only the self-ordering step. They gain everything else — and the Doctor Request Template is arguably *more* valuable to them since they must go through a provider anyway. LabLooker equips them to make that conversation specific and informed.
- Insurance code lookup, ICD-10 guidance, and price comparison as reference are fully available regardless of state

---

## 9. Technical Stack

Follows the Forge standard stack:
- **Frontend:** Next.js 15 (App Router) + TypeScript
- **Backend/DB:** Supabase (Postgres)
- **Styling:** Tailwind CSS v4
- **AI layer:** OpenAI API (GPT-4o) for symptom-to-test lookup
- **Hosting:** Vercel
- **Payments:** Stripe (premium subscription)

---

## 10. MVP Scope (What Gets Built First)

The goal of V1 is to validate demand and generate affiliate revenue before investing in premium features.

**V1 ships with:**
- [ ] Test search by name
- [ ] CPT code display + plain-English description
- [ ] Self-pay pricing (Quest, LabCorp, Ulta Lab Tests, Walk-In Lab)
- [ ] ICD-10 codes per test
- [ ] Symptom-to-test lookup (AI-powered)
- [ ] Lab code crosswalk (CPT as universal bridge)
- [ ] Doctor request template (basic)
- [ ] Affiliate links to Ulta Lab Tests + Walk-In Lab
- [ ] Free tier (no account required)
- [ ] Premium subscription (Stripe)

**V1 defers:**
- Native mobile app
- Insurance plan-specific coverage verification
- EHR integration
- B2B/practice tier
- User accounts with saved history (premium feature)

---

## 11. Competitive Landscape

| Tool | What it does | Gap |
|---|---|---|
| LabCost.org | Basic cost estimator (hospital vs Quest/LabCorp) | No ICD-10, no crosswalk, no templates, ~100 tests |
| Ulta Lab Tests | Self-pay ordering (their lab only) | No comparison, no codes, no insurance guidance |
| Quest / LabCorp websites | Find a test at their lab | Single-lab only, no pricing, no ICD-10 |
| Insurance portals | Check coverage if you already know the CPT | Requires CPT knowledge, buried UX |
| **LabLooker** | **All of the above, unified** | **The gap nobody has filled** |

---

## 12. Success Metrics

| Metric | 3-Month Target | 6-Month Target |
|---|---|---|
| Monthly Active Users | 2,000 | 10,000 |
| Affiliate conversions | 50/mo | 300/mo |
| Premium subscribers | 50 | 500 |
| Monthly revenue | $500 | $3,500 |

---

## 13. Next Steps

1. [ ] Register lablooker.com domain
2. [ ] Build CPT + ICD-10 test database (seed with 200 most common tests)
3. [ ] Scrape/compile self-pay pricing from Quest, LabCorp, Ulta Lab Tests, Walk-In Lab
4. [ ] Build V1 with Claude Code
5. [ ] Seed in patient advocacy communities (thyroid, autoimmune, HDHP forums)
6. [ ] Collect feedback, iterate
