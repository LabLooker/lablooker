// ─── Compare / "Which test should I order?" Content ─────────────────────────
// Educational content for the test comparison feature.
// Each group contains test variants that patients commonly confuse.
// Add new groups here; they auto-appear in the Compare page.

export type CompareTestContent = {
  testId: string
  testName: string
  badge?: string           // e.g. "★ Most common starting point"
  highlight?: boolean      // green border / primary CTA styling
  measures: string         // plain-language "what it measures"
  orderIf: string          // "Order this if..."
  bestFor: string[]        // short tags, 2–4 max
  note: string             // caveat or pro-tip
  pairWith?: {
    testId: string
    label: string
    reason: string
  }
}

export type CompareGroup = {
  id: string
  label: string
  emoji: string
  description: string
  tests: CompareTestContent[]
}

export const COMPARE_GROUPS: CompareGroup[] = [
  // ── TESTOSTERONE ──────────────────────────────────────────────────────────
  {
    id: 'testosterone',
    label: 'Testosterone',
    emoji: '⚡',
    description: 'Understand which testosterone test fits your situation — from basic screening to BHRT monitoring.',
    tests: [
      {
        testId: 'a0000022-0000-0000-0000-000000000000',
        testName: 'Testosterone, Total',
        badge: '★ Best starting point',
        highlight: false,
        measures: 'All testosterone in your blood — both bound (inactive) and unbound (active). The standard screening test.',
        orderIf: 'Getting a baseline check, screening for low T, or your doctor said "check testosterone."',
        bestFor: ['First-time testing', 'General screening', 'Annual wellness'],
        note: 'Can look normal even when active testosterone is low. If symptoms persist, follow up with Free T.',
        pairWith: {
          testId: 'a0000024-0000-0000-0000-000000000000',
          label: 'Testosterone, Free (Calculated)',
          reason: 'Total T alone can miss low active testosterone. Most providers order both together for a complete picture.',
        },
      },
      {
        testId: 'a0000024-0000-0000-0000-000000000000',
        testName: 'Testosterone, Free (Calculated)',
        badge: '★ Best for BHRT monitoring',
        highlight: true,
        measures: 'The active, unbound testosterone your cells can actually use. Calculated from Total T and SHBG.',
        orderIf: "You're on BHRT, have symptoms of low T despite normal Total T, or your provider monitors hormone therapy.",
        bestFor: ['BHRT patients', 'Hormone monitoring', 'Low T symptoms'],
        note: 'Standard calculated method — widely accepted, more affordable than Direct. Requires SHBG result.',
        pairWith: undefined,
      },
      {
        testId: 'a0000025-0000-0000-0000-000000000000',
        testName: 'Testosterone, Free (Direct)',
        badge: undefined,
        highlight: false,
        measures: 'Directly measured free testosterone — more precise, especially at very low levels.',
        orderIf: "Your provider wants the most accurate free T reading, or calculated free T doesn't match symptoms.",
        bestFor: ['Precise monitoring', 'Low-normal range', 'When calculated is borderline'],
        note: 'Less widely available and more expensive. Typically ordered when the calculated method is insufficient.',
        pairWith: undefined,
      },
      {
        testId: 'a0000026-0000-0000-0000-000000000000',
        testName: 'Testosterone, Bioavailable',
        badge: undefined,
        highlight: false,
        measures: 'Free T plus albumin-bound T — the portion actually available for tissue use.',
        orderIf: 'You have abnormal SHBG levels that make Free T calculations unreliable.',
        bestFor: ['Abnormal SHBG', 'Functional medicine', 'Detailed hormone panels'],
        note: 'Less commonly ordered. Most useful when SHBG is notably elevated or suppressed.',
        pairWith: undefined,
      },
      {
        testId: 'a0000052-0000-0000-0000-000000000000',
        testName: 'Free Testosterone + Total Testosterone',
        badge: '★ Most complete picture',
        highlight: false,
        measures: 'Panel combining Total T and Free T (calculated) in one draw.',
        orderIf: 'You want both numbers at once — good for initial evaluation or comprehensive screening.',
        bestFor: ['Initial workup', 'Value panel', 'Comprehensive screening'],
        note: 'Two results from one blood draw. Great starting point for anyone investigating testosterone levels.',
        pairWith: undefined,
      },
      {
        testId: 'a0000023-0000-0000-0000-000000000000',
        testName: 'Testosterone, Total (LC/MS/MS)',
        badge: undefined,
        highlight: false,
        measures: 'Total testosterone measured by a highly accurate mass spectrometry method.',
        orderIf: 'You are a woman, child, or anyone with low testosterone levels where standard assays may be inaccurate.',
        bestFor: ['Women on BHRT', 'Children', 'Low-range accuracy'],
        note: 'Gold standard for low-range detection. Standard immunoassay inflates results in women — LC/MS/MS is the better choice for BHRT monitoring.',
        pairWith: undefined,
      },
      {
        testId: '0321e130-13bd-4e16-998d-84cb18ab5dbd',
        testName: 'Dihydrotestosterone (DHT)',
        badge: undefined,
        highlight: false,
        measures: 'DHT — the potent androgen converted from testosterone, involved in hair loss and prostate health.',
        orderIf: 'You are experiencing hair loss, or your provider is evaluating androgen excess or prostate concerns.',
        bestFor: ['Hair loss investigation', 'Prostate health', 'Androgen excess'],
        note: 'Not part of standard hormone panels. Order specifically when DHT-driven symptoms (androgenic alopecia, acne) are the concern.',
        pairWith: undefined,
      },
    ],
  },

  // ── THYROID ───────────────────────────────────────────────────────────────
  {
    id: 'thyroid',
    label: 'Thyroid',
    emoji: '🦋',
    description: 'Navigate thyroid testing — from initial TSH screening to the advanced markers your integrative provider wants.',
    tests: [
      {
        testId: 'a0000001-0000-0000-0000-000000000000',
        testName: 'TSH (Thyroid Stimulating Hormone)',
        badge: '★ Always the first test',
        highlight: false,
        measures: 'TSH from your pituitary — the hormone that tells your thyroid how hard to work. The standard thyroid screen.',
        orderIf: 'Starting thyroid evaluation, routine wellness check, or your doctor wants to screen thyroid function.',
        bestFor: ['Routine screening', 'First-time thyroid check', 'Monitoring on levothyroxine'],
        note: 'TSH alone can miss early thyroid disease. If TSH is abnormal or symptoms persist, add Free T4 and Free T3.',
        pairWith: {
          testId: 'a0000002-0000-0000-0000-000000000000',
          label: 'Free T4 (Thyroxine, Free)',
          reason: 'TSH and Free T4 together give a complete picture of thyroid output. Most standard thyroid panels include both.',
        },
      },
      {
        testId: 'a0000002-0000-0000-0000-000000000000',
        testName: 'Free T4 (Thyroxine, Free)',
        badge: '★ Standard with TSH',
        highlight: true,
        measures: 'The unbound form of T4 — the primary thyroid hormone. What your thyroid actually produces.',
        orderIf: 'Your TSH is abnormal, you have hypothyroid symptoms, or you are on levothyroxine (Synthroid/Tirosint).',
        bestFor: ['Hypothyroidism management', 'Levothyroxine dosing', 'Standard thyroid panel'],
        note: 'T4 converts to T3 in your body. Normal Free T4 with low Free T3 may indicate a conversion problem — order both.',
        pairWith: {
          testId: 'a0000003-0000-0000-0000-000000000000',
          label: 'Free T3 (Triiodothyronine, Free)',
          reason: 'T4 must convert to active T3. If you still feel bad despite normal T4, Free T3 tells you if conversion is the issue.',
        },
      },
      {
        testId: 'a0000003-0000-0000-0000-000000000000',
        testName: 'Free T3 (Triiodothyronine, Free)',
        badge: '★ Essential for T3 therapy',
        highlight: false,
        measures: 'The active thyroid hormone your cells use. Free T3 is the biologically available form.',
        orderIf: "You are on T3 therapy (liothyronine/Cytomel), have ongoing symptoms despite normal TSH/T4, or your provider monitors T3 levels.",
        bestFor: ['T3 therapy monitoring', 'Hypothyroid symptoms with normal T4', 'Functional/integrative medicine'],
        note: 'Not routinely ordered by conventional doctors but critical if you are on T3. Time the draw at the right point in your dosing cycle (typically 13+ hours post-dose for trough).',
        pairWith: undefined,
      },
      {
        testId: 'a0000006-0000-0000-0000-000000000000',
        testName: 'Reverse T3 (rT3)',
        badge: undefined,
        highlight: false,
        measures: 'An inactive form of T3 your body produces during stress, illness, or fasting. Competes with active T3.',
        orderIf: 'Your Free T3 is normal but you still have hypothyroid symptoms, or you have been under prolonged physical or emotional stress.',
        bestFor: ['High stress/illness recovery', 'Functional medicine evaluation', 'Unexplained fatigue'],
        note: 'Controversial in conventional medicine. Most useful when your Free T3:rT3 ratio is being tracked over time by an integrative provider.',
        pairWith: {
          testId: 'a0000003-0000-0000-0000-000000000000',
          label: 'Free T3 (Triiodothyronine, Free)',
          reason: 'The Free T3 to Reverse T3 ratio is the key metric — you need both values to calculate it.',
        },
      },
      {
        testId: 'a0000009-0000-0000-0000-000000000000',
        testName: 'Anti-TPO (Thyroid Peroxidase Antibody)',
        badge: undefined,
        highlight: false,
        measures: 'Antibodies that attack the thyroid enzyme TPO — the primary marker for Hashimoto\'s thyroiditis.',
        orderIf: "Your TSH is high or trending up, you have a family history of thyroid disease, or your provider suspects autoimmune hypothyroidism.",
        bestFor: ['Hashimoto\'s diagnosis', 'Autoimmune thyroid disease', 'Family history of thyroid disease'],
        note: 'Elevated Anti-TPO with normal TSH means your immune system is targeting your thyroid — often years before TSH changes. Ask your provider for monitoring.',
        pairWith: undefined,
      },
      {
        testId: 'a0000015-0000-0000-0000-000000000000',
        testName: 'Thyroid Panel with TSH',
        badge: undefined,
        highlight: false,
        measures: 'Bundled panel including TSH, Free T4, and sometimes Total T3 — depends on the lab.',
        orderIf: 'You want a standard thyroid workup in one draw without selecting individual tests.',
        bestFor: ['Convenient bundled testing', 'Initial evaluation', 'Cost-saving panels'],
        note: 'Panel contents vary by lab — always confirm what\'s included. May not contain Free T3 or antibodies.',
        pairWith: undefined,
      },
      {
        testId: 'a0000016-0000-0000-0000-000000000000',
        testName: 'Comprehensive Thyroid Panel',
        badge: '★ Most complete thyroid picture',
        highlight: false,
        measures: 'Full thyroid evaluation: TSH, Free T3, Free T4, Reverse T3, Anti-TPO, and Anti-Thyroglobulin antibodies.',
        orderIf: "You want the most thorough thyroid assessment in one draw, especially for integrative or functional medicine evaluation.",
        bestFor: ['Comprehensive evaluation', 'Functional medicine', 'Ruling out autoimmune disease'],
        note: 'Panel contents vary by lab — confirm exactly what\'s included. Most useful for initial deep-dive evaluation or when starting T3 therapy.',
        pairWith: undefined,
      },
    ],
  },
]

// Helper: get content for a specific test by ID
export function getTestContent(testId: string): CompareTestContent | undefined {
  for (const group of COMPARE_GROUPS) {
    const found = group.tests.find(t => t.testId === testId)
    if (found) return found
  }
  return undefined
}

// Helper: get the group for a specific test ID
export function getGroupForTest(testId: string): CompareGroup | undefined {
  return COMPARE_GROUPS.find(g => g.tests.some(t => t.testId === testId))
}
