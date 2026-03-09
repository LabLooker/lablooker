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
    emoji: '',
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
    emoji: '',
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
  // ── IRON ───────────────────────────────────────────────────────────────────
  {
    id: 'iron',
    label: 'Iron',
    emoji: '',
    description: 'Iron testing is more than just "check my iron." Ferritin, serum iron, TIBC, and saturation each tell a different part of the story.',
    tests: [
      {
        testId: 'a0000072-0000-0000-0000-000000000000',
        testName: 'Ferritin',
        badge: '★ Most important single iron marker',
        highlight: true,
        measures: 'Your iron storage protein — the best indicator of how much iron your body has banked. Reflects long-term iron status.',
        orderIf: 'You have fatigue, hair loss, brain fog, restless legs, or your provider wants to assess iron stores.',
        bestFor: ['Fatigue investigation', 'Hair loss', 'Women of childbearing age', 'First-line screening'],
        note: 'Ferritin is an acute-phase reactant — it rises with inflammation, infection, or liver disease, which can mask true deficiency. Optimal for menstruating women is 50–150 ng/mL (not just "normal range").',
        pairWith: {
          testId: 'a0000075-0000-0000-0000-000000000000',
          label: 'Iron & TIBC Panel',
          reason: 'Ferritin alone can be falsely elevated by inflammation. The full iron panel (serum iron + TIBC + saturation) confirms whether iron is actually available for use.',
        },
      },
      {
        testId: 'a0000073-0000-0000-0000-000000000000',
        testName: 'Iron, Serum',
        badge: undefined,
        highlight: false,
        measures: 'The amount of iron circulating in your blood right now. Fluctuates throughout the day and with meals.',
        orderIf: 'It\'s part of a panel — rarely useful alone. Usually ordered alongside TIBC and ferritin.',
        bestFor: ['Part of iron panel', 'Anemia workup'],
        note: 'Serum iron by itself is unreliable — it swings with meals, time of day, and recent supplements. Always interpret alongside TIBC and ferritin.',
        pairWith: undefined,
      },
      {
        testId: 'a0000074-0000-0000-0000-000000000000',
        testName: 'TIBC (Total Iron Binding Capacity)',
        badge: undefined,
        highlight: false,
        measures: 'How much "room" your blood has to carry more iron. High TIBC = your body is hungry for iron.',
        orderIf: 'Your provider is doing a full iron workup and needs to calculate transferrin saturation.',
        bestFor: ['Iron deficiency diagnosis', 'Anemia classification', 'Iron overload screening'],
        note: 'TIBC goes UP in iron deficiency (body makes more transport protein) and DOWN in iron overload or chronic disease.',
        pairWith: undefined,
      },
      {
        testId: 'a0000075-0000-0000-0000-000000000000',
        testName: 'Iron & TIBC Panel',
        badge: '★ Most complete iron picture',
        highlight: false,
        measures: 'Bundled panel: serum iron, TIBC, and calculated transferrin saturation — all from one draw.',
        orderIf: 'You want the full picture of iron availability in one test, or your ferritin seems unreliable due to inflammation.',
        bestFor: ['Complete iron assessment', 'Anemia workup', 'Iron overload screening'],
        note: 'This panel plus ferritin gives the complete iron story. Transferrin saturation below 20% suggests deficiency; above 45% suggests overload.',
        pairWith: {
          testId: 'a0000072-0000-0000-0000-000000000000',
          label: 'Ferritin',
          reason: 'The panel shows iron availability; ferritin shows iron storage. Together they give the complete picture and help differentiate iron deficiency from chronic disease anemia.',
        },
      },
      {
        testId: 'a0000077-0000-0000-0000-000000000000',
        testName: 'Transferrin Saturation',
        badge: undefined,
        highlight: false,
        measures: 'The percentage of your iron transport protein (transferrin) that is loaded with iron. Calculated from serum iron ÷ TIBC.',
        orderIf: 'Your provider needs to screen for hemochromatosis (iron overload) or confirm iron deficiency.',
        bestFor: ['Hemochromatosis screening', 'HFE gene follow-up', 'Iron overload assessment'],
        note: 'Key cutoffs: below 20% = likely iron deficient. Above 45% = possible iron overload (order HFE gene test). Usually calculated from the iron panel, not ordered separately.',
        pairWith: undefined,
      },
      {
        testId: 'a0000078-0000-0000-0000-000000000000',
        testName: 'Soluble Transferrin Receptor (sTfR)',
        badge: undefined,
        highlight: false,
        measures: 'A marker of iron demand at the tissue level — rises when your cells need more iron, regardless of inflammation.',
        orderIf: 'Your ferritin is unreliable due to chronic inflammation, infection, or liver disease, and your provider needs to confirm true iron deficiency.',
        bestFor: ['Chronic disease + suspected iron deficiency', 'Inflammatory conditions', 'Autoimmune patients'],
        note: 'The specialty tool. sTfR is NOT affected by inflammation, making it the most reliable iron marker when CRP is elevated. Less commonly ordered and more expensive.',
        pairWith: undefined,
      },
    ],
  },

  // ── VITAMIN D ─────────────────────────────────────────────────────────────
  {
    id: 'vitamin-d',
    label: 'Vitamin D',
    emoji: '',
    description: 'Most people need the standard 25-OH test. The "active" form (1,25) is a specialty test for specific conditions — knowing which one to order matters.',
    tests: [
      {
        testId: 'a0000174-0000-0000-0000-000000000000',
        testName: 'Vitamin D, 25-OH (Total)',
        badge: '★ The standard vitamin D test',
        highlight: true,
        measures: 'Your vitamin D storage form — the best indicator of overall vitamin D status. Combines D2 and D3.',
        orderIf: 'You want to check your vitamin D level. This is the test your doctor means when they say "check vitamin D."',
        bestFor: ['Routine screening', 'Supplementation monitoring', 'Annual wellness'],
        note: 'Optimal range is debated: conventional says 30–100 ng/mL, but many functional providers target 50–70 ng/mL. Critical for calcium absorption, immune function, and mood.',
        pairWith: undefined,
      },
      {
        testId: 'a0000175-0000-0000-0000-000000000000',
        testName: 'Vitamin D, 25-OH (D2 + D3, LC/MS/MS)',
        badge: undefined,
        highlight: false,
        measures: 'Same as the standard 25-OH test but measured by mass spectrometry, which separately reports D2 (ergocalciferol) and D3 (cholecalciferol).',
        orderIf: 'You or your provider want to see D2 and D3 broken out separately — useful if you take prescription D2 (ergocalciferol) supplements.',
        bestFor: ['D2 vs D3 breakdown', 'Prescription D2 monitoring', 'Higher accuracy'],
        note: 'If you take over-the-counter D3 supplements (most people), the standard 25-OH Total test is sufficient. The LC/MS/MS version matters mainly when tracking prescription D2.',
        pairWith: undefined,
      },
      {
        testId: 'a0000176-0000-0000-0000-000000000000',
        testName: 'Vitamin D, 1,25-Dihydroxy (Active / Calcitriol)',
        badge: undefined,
        highlight: false,
        measures: 'The active hormone form of vitamin D — produced by your kidneys. Controls calcium absorption in real time.',
        orderIf: 'You have kidney disease, hypoparathyroidism, sarcoidosis, granulomatous disease, or unexplained hypercalcemia.',
        bestFor: ['Kidney disease', 'Hypoparathyroidism', 'Sarcoidosis', 'Hypercalcemia workup'],
        note: 'This is NOT a routine vitamin D test. Calcitriol can look normal or high even when 25-OH (storage) is critically low. Ordering this instead of 25-OH is a common mistake — only order it when specifically indicated.',
        pairWith: {
          testId: 'a0000174-0000-0000-0000-000000000000',
          label: 'Vitamin D, 25-OH (Total)',
          reason: 'Always check storage (25-OH) alongside active (1,25). Active D can be normal while storage is depleted — especially in granulomatous disease.',
        },
      },
    ],
  },

  // ── CORTISOL & ADRENAL ────────────────────────────────────────────────────
  {
    id: 'cortisol',
    label: 'Cortisol',
    emoji: '',
    description: 'Cortisol testing varies by method and timing. The right test depends on what your provider is looking for — screening, rhythm, or 24-hour output.',
    tests: [
      {
        testId: 'a0000040-0000-0000-0000-000000000000',
        testName: 'Cortisol, AM (Serum)',
        badge: '★ Standard screening test',
        highlight: true,
        measures: 'Morning cortisol level from a blood draw — reflects your peak cortisol output (highest point in the daily rhythm).',
        orderIf: 'Your provider suspects adrenal insufficiency (Addison\'s) or Cushing\'s, or you have unexplained fatigue, weight changes, or salt cravings.',
        bestFor: ['Initial screening', 'Adrenal insufficiency workup', 'Morning fatigue'],
        note: 'Must be drawn early morning (7–9 AM) fasting for accuracy. Values below 3 µg/dL suggest adrenal insufficiency; above 20 µg/dL is reassuring. The 10–20 range needs further testing.',
        pairWith: {
          testId: 'a0000037-0000-0000-0000-000000000000',
          label: 'DHEA-Sulfate (DHEA-S)',
          reason: 'DHEA-S is the other major adrenal output hormone. When cortisol is elevated but DHEA-S is low, it suggests chronic stress depleting adrenal reserve.',
        },
      },
      {
        testId: 'a0000041-0000-0000-0000-000000000000',
        testName: 'Cortisol, PM (Serum)',
        badge: undefined,
        highlight: false,
        measures: 'Afternoon/evening cortisol — should be significantly lower than morning. Tests whether cortisol drops appropriately.',
        orderIf: 'Your provider is screening for Cushing\'s (cortisol that stays high all day) or evaluating your cortisol rhythm.',
        bestFor: ['Cushing\'s screening', 'Cortisol rhythm assessment'],
        note: 'Typically drawn around 4 PM. Useful when paired with AM cortisol. Elevated PM cortisol is a red flag for Cushing\'s syndrome.',
        pairWith: undefined,
      },
      {
        testId: 'a0000043-0000-0000-0000-000000000000',
        testName: 'Cortisol, Salivary (4-point)',
        badge: '★ Best for daily rhythm',
        highlight: false,
        measures: 'Four saliva samples collected at morning, noon, evening, and bedtime — maps your cortisol curve across the entire day.',
        orderIf: 'You have energy crashes, insomnia, or "wired but tired" patterns, and your provider wants to see your full daily cortisol rhythm.',
        bestFor: ['Functional medicine', 'HPA axis evaluation', 'Fatigue/insomnia patterns'],
        note: 'Done at home — no blood draw. The gold standard for cortisol rhythm. Not widely ordered in conventional medicine but highly valued in integrative/functional practices. Often bundled with DHEA.',
        pairWith: undefined,
      },
      {
        testId: 'a0000042-0000-0000-0000-000000000000',
        testName: 'Cortisol, 24-Hour Urine Free',
        badge: undefined,
        highlight: false,
        measures: 'Total cortisol output over a full 24-hour period — collected by saving all urine for one day.',
        orderIf: 'Your provider is confirming Cushing\'s syndrome or needs to measure total daily cortisol production.',
        bestFor: ['Cushing\'s confirmation', 'Total cortisol output', 'Endocrinology workup'],
        note: 'The most definitive cortisol test for Cushing\'s diagnosis. Inconvenient (24-hour collection) but very accurate for total output. Not useful for adrenal fatigue evaluation.',
        pairWith: undefined,
      },
      {
        testId: 'a0000037-0000-0000-0000-000000000000',
        testName: 'DHEA-Sulfate (DHEA-S)',
        badge: undefined,
        highlight: false,
        measures: 'The sulfated form of DHEA — a long-lived adrenal hormone that reflects overall adrenal reserve. Stable throughout the day.',
        orderIf: 'You are evaluating adrenal function alongside cortisol, or your provider monitors DHEA-S for anti-aging or BHRT purposes.',
        bestFor: ['Adrenal function assessment', 'BHRT monitoring', 'Anti-aging panels'],
        note: 'DHEA-S declines with age — levels at 40 are roughly half of what they were at 20. Low DHEA-S with high cortisol suggests chronic stress. Some providers supplement DHEA based on this test.',
        pairWith: undefined,
      },
      {
        testId: 'a0000038-0000-0000-0000-000000000000',
        testName: 'DHEA (Unconjugated)',
        badge: undefined,
        highlight: false,
        measures: 'The free, unconjugated form of DHEA — fluctuates more than DHEA-S and is less commonly ordered.',
        orderIf: 'Your provider specifically wants unconjugated DHEA rather than DHEA-S, typically for adrenal tumor workup.',
        bestFor: ['Adrenal tumor evaluation', 'Specialty endocrinology'],
        note: 'DHEA-S is preferred for routine monitoring because it\'s more stable. Unconjugated DHEA is mainly used when DHEA-S doesn\'t tell the full story or adrenal pathology is suspected.',
        pairWith: undefined,
      },
    ],
  },

  // ── ESTROGEN & PROGESTERONE ───────────────────────────────────────────────
  {
    id: 'estrogen',
    label: 'Estrogen',
    emoji: '',
    description: 'Estrogen testing varies by hormone (E1, E2, E3), method (immunoassay vs LC/MS/MS), and clinical context. The right test depends on whether you\'re on BHRT, investigating symptoms, or screening.',
    tests: [
      {
        testId: 'a0000028-0000-0000-0000-000000000000',
        testName: 'Estradiol (E2)',
        badge: '★ Standard estrogen test',
        highlight: true,
        measures: 'The primary and most potent estrogen — produced by the ovaries (premenopausal) or from BHRT. The standard estrogen marker.',
        orderIf: 'You are checking estrogen levels for menopause symptoms, fertility, or BHRT monitoring.',
        bestFor: ['Menopause evaluation', 'BHRT monitoring', 'Fertility workup', 'General screening'],
        note: 'Standard immunoassay works well for most women. If you\'re on low-dose BHRT or levels seem inconsistent, consider the sensitive (LC/MS/MS) version for better accuracy at low levels.',
        pairWith: {
          testId: 'a0000032-0000-0000-0000-000000000000',
          label: 'Progesterone',
          reason: 'Estradiol and progesterone work in balance. Monitoring both is essential for BHRT, evaluating ovulation, and understanding hormonal symptoms.',
        },
      },
      {
        testId: 'a0000029-0000-0000-0000-000000000000',
        testName: 'Estradiol, Sensitive (LC/MS/MS)',
        badge: '★ Best for BHRT & low levels',
        highlight: false,
        measures: 'Estradiol measured by mass spectrometry — more accurate at low levels (postmenopausal, low-dose BHRT, or male estrogen monitoring).',
        orderIf: 'You are postmenopausal, on low-dose BHRT, or your standard estradiol results seem inconsistent or unexpectedly high/low.',
        bestFor: ['Postmenopausal women', 'Low-dose BHRT', 'Men checking estrogen', 'Precision monitoring'],
        note: 'Standard immunoassay can overestimate estradiol at low levels. LC/MS/MS is the gold standard when accuracy matters — especially for postmenopausal women and men.',
        pairWith: undefined,
      },
      {
        testId: 'a0000030-0000-0000-0000-000000000000',
        testName: 'Estrone (E1)',
        badge: undefined,
        highlight: false,
        measures: 'The weaker estrogen produced mainly by fat tissue and adrenals — the dominant estrogen after menopause.',
        orderIf: 'You are postmenopausal and your provider wants to assess total estrogen production, or you are evaluating estrogen dominance.',
        bestFor: ['Postmenopausal estrogen assessment', 'Estrogen dominance evaluation', 'Obesity-related estrogen'],
        note: 'Estrone rises with body fat. In postmenopausal women, it becomes the primary estrogen source. High E1 relative to E2 can indicate a pattern worth discussing with your provider.',
        pairWith: undefined,
      },
      {
        testId: 'a0000058-0000-0000-0000-000000000000',
        testName: 'Total Estrogen',
        badge: undefined,
        highlight: false,
        measures: 'Combined measurement of all estrogen forms (E1 + E2 + E3) — gives an overall estrogen picture.',
        orderIf: 'Your provider wants to see total estrogen production rather than individual forms.',
        bestFor: ['Overall estrogen assessment', 'Simplicity when individual forms aren\'t needed'],
        note: 'Less commonly ordered than individual estrogens. Most providers prefer E2 (or E2 + E1) for more actionable information.',
        pairWith: undefined,
      },
      {
        testId: 'a0000060-0000-0000-0000-000000000000',
        testName: 'Estrogen Metabolites (4-OHE, 2-OHE)',
        badge: undefined,
        highlight: false,
        measures: 'How your body breaks down estrogen — the ratio of "protective" (2-OHE) vs "potentially harmful" (4-OHE, 16α-OHE) metabolites.',
        orderIf: 'You have a family history of breast cancer, or your integrative provider evaluates estrogen metabolism patterns.',
        bestFor: ['Breast cancer risk assessment', 'Functional medicine', 'DIM/I3C supplement monitoring'],
        note: 'Primarily a functional/integrative medicine test. The 2:16 ratio and 4-OHE levels are used to guide supplement protocols (DIM, I3C, calcium-d-glucarate). Not standard in conventional medicine.',
        pairWith: undefined,
      },
      {
        testId: 'a0000032-0000-0000-0000-000000000000',
        testName: 'Progesterone',
        badge: undefined,
        highlight: false,
        measures: 'The primary progesterone hormone — essential for cycle regulation, pregnancy support, and BHRT balance with estrogen.',
        orderIf: 'You are on BHRT with progesterone, evaluating ovulation, or investigating irregular cycles or luteal phase deficiency.',
        bestFor: ['BHRT monitoring', 'Ovulation confirmation', 'Cycle irregularity'],
        note: 'Timing matters: in cycling women, progesterone peaks 7 days after ovulation (day 21 of a 28-day cycle). For BHRT, draw at trough. Standard immunoassay works for most situations.',
        pairWith: undefined,
      },
      {
        testId: '9ae1be61-437a-4127-94a2-4f99762e1da8',
        testName: 'Progesterone, LC-MS/MS',
        badge: undefined,
        highlight: false,
        measures: 'Progesterone measured by mass spectrometry — more precise, especially at low levels or when standard results seem inconsistent.',
        orderIf: 'Your standard progesterone results don\'t match your symptoms, or your provider needs precision monitoring for topical/vaginal progesterone.',
        bestFor: ['Topical progesterone monitoring', 'Precision measurement', 'Low-level detection'],
        note: 'Standard immunoassay may not accurately reflect progesterone from topical/vaginal routes. LC/MS/MS is the better choice when monitoring non-oral progesterone delivery.',
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
