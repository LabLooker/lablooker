/**
 * Test Bundles — curated panels for common patient needs.
 * These are NOT database entities; they're editorial groupings
 * that help users understand which tests to order together.
 *
 * Each bundle maps to real test_name values in the DB.
 */

export type TestBundle = {
  slug: string
  name: string
  shortName: string
  icon: string
  description: string
  whoNeeds: string
  tests: string[]  // test_name values (must match DB exactly)
  notes?: string
}

export const TEST_BUNDLES: TestBundle[] = [
  {
    slug: 'thyroid-complete',
    name: 'Thyroid Complete Panel',
    shortName: 'Thyroid Complete',
    icon: '🦋',
    description: 'The full thyroid picture — not just TSH. Includes free hormones, antibodies, and reverse T3 for a complete assessment.',
    whoNeeds: 'Anyone with thyroid symptoms, Hashimoto\'s, hypothyroidism, or on thyroid medication. Especially if your doctor only checks TSH.',
    tests: [
      'TSH (Thyroid Stimulating Hormone)',
      'Free T4 (Thyroxine)',
      'Free T3 (Triiodothyronine)',
      'Reverse T3 (rT3)',
      'Anti-TPO (Thyroid Peroxidase Antibody)',
      'Anti-Thyroglobulin Antibody',
    ],
    notes: 'Most doctors only check TSH. If you\'re symptomatic but TSH is "normal," Free T3 and antibodies often reveal the real problem.',
  },
  {
    slug: 'pre-hrt-female',
    name: 'Pre-HRT Panel (Female / BHRT)',
    shortName: 'Pre-HRT Female',
    icon: '🌸',
    description: 'Baseline hormone panel before starting bioidentical hormone replacement therapy. Establishes your starting point for estrogen, progesterone, testosterone, and supporting markers.',
    whoNeeds: 'Women considering or starting BHRT, perimenopause, or menopause hormone therapy.',
    tests: [
      'Estradiol (E2)',
      'Progesterone',
      'Testosterone, Total',
      'Testosterone, Free (Calculated)',
      'SHBG (Sex Hormone Binding Globulin)',
      'DHEA-S (Dehydroepiandrosterone Sulfate)',
      'FSH (Follicle Stimulating Hormone)',
      'LH (Luteinizing Hormone)',
      'Free T3 (Triiodothyronine)',
      'TSH (Thyroid Stimulating Hormone)',
      'Cortisol, AM',
      'CBC (Complete Blood Count) with Differential',
      'CMP (Comprehensive Metabolic Panel)',
    ],
    notes: 'Get this panel BEFORE starting hormones so you have a true baseline. Retest at 6-8 weeks after starting, then every 3-6 months.',
  },
  {
    slug: 'trt-monitoring',
    name: 'TRT Monitoring Panel (Male)',
    shortName: 'TRT Monitoring',
    icon: '💪',
    description: 'Essential monitoring labs for men on testosterone replacement therapy. Tracks hormone levels, red blood cell count, and organ function.',
    whoNeeds: 'Men currently on TRT or considering it. Should be run before starting, at 6-8 weeks, then every 3-6 months.',
    tests: [
      'Testosterone, Total',
      'Testosterone, Free (Calculated)',
      'Estradiol (E2)',
      'SHBG (Sex Hormone Binding Globulin)',
      'LH (Luteinizing Hormone)',
      'FSH (Follicle Stimulating Hormone)',
      'Prolactin',
      'PSA (Prostate-Specific Antigen)',
      'CBC (Complete Blood Count) with Differential',
      'CMP (Comprehensive Metabolic Panel)',
      'Lipid Panel',
      'Hemoglobin A1c (HbA1c)',
    ],
    notes: 'Watch hematocrit on TRT — if it climbs above 54%, discuss with your provider. Estradiol management is key to avoiding side effects.',
  },
  {
    slug: 'pcos-panel',
    name: 'PCOS Diagnostic & Monitoring Panel',
    shortName: 'PCOS Panel',
    icon: '🎀',
    description: 'Comprehensive panel for diagnosing and monitoring polycystic ovary syndrome. Covers hormones, insulin resistance, and commonly missed markers.',
    whoNeeds: 'Women with suspected or diagnosed PCOS. Also useful for irregular periods, acne, hirsutism, or unexplained weight gain.',
    tests: [
      'Testosterone, Total',
      'Testosterone, Free (Calculated)',
      'DHEA-S (Dehydroepiandrosterone Sulfate)',
      'SHBG (Sex Hormone Binding Globulin)',
      'LH (Luteinizing Hormone)',
      'FSH (Follicle Stimulating Hormone)',
      'Estradiol (E2)',
      'Progesterone',
      'AMH (Anti-Mullerian Hormone)',
      'Insulin, Fasting',
      'Glucose, Fasting',
      'Hemoglobin A1c (HbA1c)',
      'Prolactin',
      'Progesterone, 17-OH (17-Hydroxyprogesterone)',
      'Free T3 (Triiodothyronine)',
      'TSH (Thyroid Stimulating Hormone)',
    ],
    notes: 'LH:FSH ratio > 2:1 is a classic PCOS finding but not required for diagnosis. Insulin resistance is present in ~70% of PCOS cases even at normal weight.',
  },
  {
    slug: 'iron-deep-dive',
    name: 'Iron & Anemia Deep Dive',
    shortName: 'Iron Deep Dive',
    icon: '🩸',
    description: 'Goes beyond basic iron to find the root cause of anemia or iron issues. Includes storage, transport, and production markers.',
    whoNeeds: 'Anyone with low ferritin, anemia symptoms (fatigue, brain fog, hair loss), heavy periods, or unexplained low iron despite supplementation.',
    tests: [
      'Ferritin',
      'Serum Iron',
      'TIBC (Total Iron Binding Capacity)',
      'Transferrin Saturation',
      'CBC (Complete Blood Count) with Differential',
      'Reticulocyte Count',
      'Vitamin B12',
      'Folate (Folic Acid)',
      'Haptoglobin',
    ],
    notes: 'Ferritin is the most important single marker. Optimal is 50-150 for women — many labs flag "normal" at 12+, which is NOT optimal. If ferritin is low despite supplementation, check for absorption issues or occult bleeding.',
  },
  {
    slug: 'longevity-baseline',
    name: 'Longevity & Prevention Baseline',
    shortName: 'Longevity Baseline',
    icon: '🧬',
    description: 'The proactive annual panel for people who want to catch problems early. Covers metabolic health, cardiovascular risk, inflammation, and key nutrients.',
    whoNeeds: 'Health-conscious adults who want comprehensive annual bloodwork beyond what most doctors order.',
    tests: [
      'CBC (Complete Blood Count) with Differential',
      'CMP (Comprehensive Metabolic Panel)',
      'Lipid Panel',
      'Apolipoprotein B (ApoB)',
      'Lipoprotein(a) [Lp(a)]',
      'Hemoglobin A1c (HbA1c)',
      'Insulin, Fasting',
      'hs-CRP (High Sensitivity C-Reactive Protein)',
      'Homocysteine',
      'Vitamin D, 25-Hydroxy',
      'Ferritin',
      'TSH (Thyroid Stimulating Hormone)',
      'Free T3 (Triiodothyronine)',
      'DHEA-S (Dehydroepiandrosterone Sulfate)',
      'GGT (Gamma-Glutamyl Transferase)',
      'Uric Acid',
    ],
    notes: 'ApoB is increasingly considered a better predictor of cardiovascular risk than LDL alone. Fasting insulin catches metabolic issues years before glucose or A1c go out of range.',
  },
]
