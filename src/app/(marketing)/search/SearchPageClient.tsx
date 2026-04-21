'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import type { Test, Symptom } from '@/types/database'
import { TEST_BUNDLES, type TestBundle } from '@/config/test-bundles'

type RedFlagGroup = {
  keywords: string[]
  resource: { label: string; url: string }
}

const RED_FLAG_GROUPS: RedFlagGroup[] = [
  {
    keywords: ['chest pain', 'chest tightness', 'heart attack'],
    resource: { label: 'Learn warning signs — American Heart Association', url: 'https://www.heart.org/en/health-topics/heart-attack/warning-signs-of-a-heart-attack' },
  },
  {
    keywords: ['stroke', 'numbness', 'paralysis', 'slurred speech'],
    resource: { label: 'Stroke warning signs — American Stroke Association', url: 'https://www.stroke.org/en/about-stroke/stroke-symptoms' },
  },
  {
    keywords: ['difficulty breathing', 'shortness of breath', 'can\'t breathe', 'trouble breathing'],
    resource: { label: 'When to seek emergency care — American Lung Association', url: 'https://www.lung.org/lung-health-diseases/warning-signs-of-lung-disease/shortness-of-breath/symptoms-diagnosis' },
  },
  {
    keywords: ['suicidal', 'suicide', 'self-harm'],
    resource: { label: 'Call or text 988 — Suicide & Crisis Lifeline', url: 'https://988lifeline.org/' },
  },
  {
    keywords: ['seizure', 'convulsions'],
    resource: { label: 'Seizure first aid — Epilepsy Foundation', url: 'https://www.epilepsy.com/first-aid/seizure-first-aid' },
  },
  {
    keywords: ['severe allergic', 'anaphylaxis'],
    resource: { label: 'Anaphylaxis emergency — ACAAI', url: 'https://acaai.org/allergies/allergic-conditions/anaphylaxis/' },
  },
  {
    keywords: ['severe bleeding', 'coughing blood', 'vomiting blood'],
    resource: { label: 'When bleeding is an emergency — Red Cross', url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/bleeding.html' },
  },
  {
    keywords: ['vision loss', 'sudden vision', 'loss of vision', 'blind'],
    resource: { label: 'Sudden vision loss — American Academy of Ophthalmology', url: 'https://www.aao.org/eye-health/symptoms/sudden-vision-loss' },
  },
  {
    keywords: ['loss of consciousness', 'fainting', 'unconscious'],
    resource: { label: 'Fainting — when to call 911 — Mayo Clinic', url: 'https://www.mayoclinic.org/first-aid/first-aid-fainting/basics/art-20056606' },
  },
]

function getRedFlagMatch(query: string): RedFlagGroup | null {
  const q = query.toLowerCase().trim()
  if (!q) return null
  return RED_FLAG_GROUPS.find((group) =>
    group.keywords.some((kw) => q.includes(kw))
  ) || null
}

function isRedFlagQuery(query: string): boolean {
  return getRedFlagMatch(query) !== null
}

const FM_PRIORITY_TESTS = [
  'Ferritin',
  'Free T3', 'Free T4', 'Reverse T3', 'Total T3', 'Total T4',
  'Insulin', 'Fasting Insulin', 'HOMA',
  'Vitamin D', 'Magnesium, RBC', 'RBC Magnesium', 'Vitamin B12', 'B12', 'Folate',
  'Cortisol', 'DHEA', 'Estradiol', 'Progesterone', 'Testosterone, Free', 'Free Testosterone', 'Testosterone, Total',
  'hs-CRP', 'CRP', 'Homocysteine',
  'Iron', 'TIBC', 'Transferrin Saturation',
  'CBC', 'CMP', 'BMP', 'HbA1c', 'Glucose',
  'TSH',
  'Lp(a)', 'ApoB', 'LDL', 'HDL', 'Triglycerides', 'Lipid Panel',
]

function sortByFmPriority(testList: Test[]): Test[] {
  return [...testList].sort((a, b) => {
    const aIdx = FM_PRIORITY_TESTS.findIndex(p => a.test_name.toLowerCase().includes(p.toLowerCase()))
    const bIdx = FM_PRIORITY_TESTS.findIndex(p => b.test_name.toLowerCase().includes(p.toLowerCase()))
    if (aIdx === -1 && bIdx === -1) return a.test_name.localeCompare(b.test_name)
    if (aIdx === -1) return 1
    if (bIdx === -1) return -1
    return aIdx - bIdx
  })
}

const CATEGORY_LABELS: Record<string, string> = {
  thyroid: 'Thyroid', parathyroid: 'Parathyroid', hormones: 'Hormones', iron_blood: 'Iron & Blood',
  hematology: 'Hematology', iron: 'Iron', coagulation: 'Coagulation',
  metabolic: 'Metabolic', lipids: 'Lipids', cardiovascular: 'Cardiovascular',
  vitamins: 'Vitamins', vitamins_minerals: 'Vitamins & Minerals',
  minerals: 'Minerals', kidney: 'Kidney', kidney_liver: 'Kidney & Liver',
  liver: 'Liver', inflammation: 'Inflammation', immune: 'Immune',
  autoimmune: 'Autoimmune', autoimmune_gi: 'Autoimmune / GI',
  infectious: 'Infectious Disease', cancer: 'Cancer Markers',
  cancer_screening: 'Cancer Screening', genetics: 'Genetics',
  allergy: 'Allergy', gi_digestive: 'GI & Digestive',
  nutrition: 'Nutrition', drug_monitoring: 'Drug Monitoring',
  pregnancy: 'Pregnancy & Fertility', pediatric: 'Pediatric',
  mental_health: 'Mental Health', longevity: 'Longevity', cardiac: 'Cardiac',
}

type HealthTopic = {
  slug: string
  icon?: string
  label: string
  categories?: string[]
  keywords?: string[]
  priority?: string[]
}

const HEALTH_TOPICS: HealthTopic[] = [
  {
    slug: 'thyroid', label: 'Thyroid & Endocrine',
    categories: ['thyroid'],
    priority: ['Free T3', 'Free T4', 'Reverse T3', 'Anti-TPO', 'Anti-Thyroglobulin', 'Thyroglobulin Antibod', 'TSH', 'Total T3', 'Total T4', 'Thyroid Panel', 'T3 Uptake'],
  },
  {
    slug: 'heart', label: 'Heart & Cholesterol',
    categories: ['cardiovascular', 'lipids'],
    priority: ['ApoB', 'Apolipoprotein B', 'Lp(a)', 'Lipoprotein(a)', 'hs-CRP', 'Homocysteine', 'Oxidized LDL', 'Small Dense LDL', 'Triglycerides', 'HDL', 'LDL', 'Omega', 'Fibrinogen', 'Total Cholesterol', 'Lipid Panel', 'Lipoprotein'],
  },
  {
    slug: 'testosterone', label: 'Testosterone & TRT',
    keywords: ['testosterone', 'shbg', 'free testosterone', 'estradiol', 'prolactin', 'dht', 'dihydrotestosterone', 'bioavailable testosterone'],
    priority: ['Total Testosterone', 'Testosterone, Total', 'Free Testosterone', 'Testosterone, Free', 'SHBG', 'Estradiol', 'LH', 'FSH', 'Prolactin', 'PSA', 'DHEA', 'DHT', 'Dihydrotestosterone', 'Hematocrit', 'CBC', 'Cortisol', 'Bioavailable'],
  },
  {
    slug: 'bhrt', label: 'Menopause & BHRT',
    keywords: ['estradiol', 'progesterone', 'fsh', 'lh', 'dhea', 'shbg', 'amh', 'menopause', 'estrone', 'estriol', 'estrogen', 'sex hormone panel, female', 'testosterone', 'cortisol', 'pregnenolone'],
    priority: ['Estradiol', 'Progesterone', 'Testosterone', 'DHEA', 'SHBG', 'FSH', 'LH', 'Cortisol', 'Free T3', 'TSH', 'AMH', 'Estrone', 'Vitamin D', 'Pregnenolone'],
  },
  {
    slug: 'inflammation', label: 'Inflammation & Autoimmune',
    categories: ['inflammation', 'autoimmune'],
    priority: ['hs-CRP', 'CRP', 'ESR', 'Homocysteine', 'Ferritin', 'Fibrinogen', 'ANA', 'Anti-TPO', 'Anti-Thyroglobulin', 'Anti-dsDNA', 'RF', 'Anti-CCP', 'Complement', 'TNF', 'IL-6', 'Interleukin'],
  },
  {
    slug: 'metabolism', label: 'Weight & Metabolism',
    categories: ['metabolic'],
    priority: ['Insulin', 'Fasting Insulin', 'HOMA', 'HbA1c', 'Hemoglobin A1c', 'Glucose', 'Leptin', 'Free T3', 'TSH', 'Cortisol', 'Triglycerides', 'DHEA', 'Adiponectin', 'Testosterone', 'Reverse T3', 'Lipid'],
  },
  {
    slug: 'iron', label: 'Iron & Anemia',
    categories: ['iron', 'hematology'],
    priority: ['Ferritin', 'Serum Iron', 'Iron', 'TIBC', 'Transferrin Saturation', 'Iron Saturation', 'Transferrin', 'CBC', 'Reticulocyte', 'Hemoglobin', 'Hematocrit', 'RBC', 'MCV', 'MCH', 'RDW'],
  },
  {
    slug: 'vitamins', label: 'Vitamins & Minerals',
    categories: ['vitamins', 'minerals'],
    priority: ['Vitamin D', '25-OH', 'B12', 'Cobalamin', 'Magnesium, RBC', 'RBC Magnesium', 'Folate', 'Methylmalonic', 'Zinc', 'Selenium', 'Iodine', 'Omega', 'Copper', 'Magnesium', 'Vitamin A', 'Retinol', 'Vitamin K', 'Ceruloplasmin'],
  },
  {
    slug: 'mental-health', label: 'Mood & Mental Health',
    keywords: ['cortisol', 'dhea', 'b12', 'folate', 'vitamin d', 'magnesium', 'zinc', 'omega', 'serotonin', 'melatonin', 'homocysteine', 'ferritin', 'free t3', 'tsh', 'insulin', 'glucose'],
    priority: ['Vitamin D', 'B12', 'Ferritin', 'Free T3', 'TSH', 'Folate', 'Homocysteine', 'Cortisol', 'DHEA', 'Magnesium', 'RBC Magnesium', 'Zinc', 'Omega', 'Iron', 'Insulin', 'HbA1c'],
  },
  {
    slug: 'diabetes', label: 'Diabetes & Blood Sugar',
    keywords: ['glucose', 'a1c', 'insulin', 'hba1c', 'glycated', 'diabetes', 'c-peptide', 'homa-ir', 'fructosamine', 'ogtt', 'adiponectin', 'uric acid'],
    priority: ['Insulin', 'Fasting Insulin', 'HbA1c', 'Hemoglobin A1c', 'Glucose', 'HOMA', 'C-Peptide', 'Fructosamine', 'Triglycerides', 'Uric Acid', 'Adiponectin'],
  },
  {
    slug: 'kidney-liver', label: 'Kidney & Liver',
    categories: ['kidney', 'liver'],
    priority: ['GGT', 'ALT', 'AST', 'Albumin', 'Bilirubin', 'ALP', 'Alkaline Phosphatase', 'Creatinine', 'BUN', 'eGFR', 'Cystatin', 'Uric Acid', 'CMP', 'BMP', 'Phosphorus', 'Total Protein'],
  },
  {
    slug: 'immune', label: 'Immune & Infections',
    categories: ['immune', 'infectious'],
    priority: ['Vitamin D', 'CBC', 'WBC', 'Lymphocyte', 'Neutrophil', 'IgG', 'IgA', 'IgM', 'NK Cell', 'CD4', 'CD8', 'ANA', 'EBV', 'Epstein', 'Complement', 'Zinc', 'Ferritin'],
  },
  {
    slug: 'sexual-health', label: 'Sexual Health & STD',
    keywords: ['hiv', 'chlamydia', 'gonorrhea', 'syphilis', 'herpes', 'hsv', 'hepatitis', 'trichomonas', 'std', 'sti', 'sexual health', 'std panel', 'bacterial vaginosis'],
    priority: ['HIV', 'Chlamydia', 'Gonorrhea', 'Syphilis', 'Herpes Simplex', 'HSV', 'Hepatitis B', 'Hepatitis C', 'Trichomonas', 'Bacterial Vaginosis'],
  },
  {
    slug: 'compliance', label: 'Immunity Tests',
    keywords: ['titer', 'immunity', 'mmr', 'varicella', 'rubella', 'measles', 'mumps', 'rabies', 'hepatitis b antibody', 'tuberculosis', 'quantiferon'],
    priority: ['MMR Titer', 'Varicella', 'Rubella', 'Measles', 'Mumps', 'Rabies', 'Hepatitis B Surface Antibody', 'QuantiFERON'],
  },
]

// Map health topic slugs → best matching bundle slug
const TOPIC_BUNDLE_MAP: Record<string, string> = {
  'thyroid': 'thyroid-complete',
  'bhrt': 'hormone-baseline',
  'testosterone': 'trt-monitoring',
  'iron': 'energy-fatigue',
  'metabolism': 'weight-metabolism',
  'inflammation': 'inflammation-immune',
}

// Topics that map to two bundles (show first only)
const TOPIC_BUNDLE_ALT: Record<string, string> = {
  'iron': 'iron-deep-dive',
}

function getBundleForTopic(topicSlug: string): TestBundle | null {
  const bundleSlug = TOPIC_BUNDLE_MAP[topicSlug]
  if (!bundleSlug) return null
  return TEST_BUNDLES.find(b => b.slug === bundleSlug) ?? null
}

export default function SearchPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [tests, setTests] = useState<Test[]>([])
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [loading, setLoading] = useState(true)
  const [codeMatch, setCodeMatch] = useState<{ testId: string; testName: string; labName: string; code: string } | null>(null)
  const [testMap, setTestMap] = useState<Record<string, string>>({})

  // Initialize topic filter from URL on mount
  const initialTopic = searchParams.get('topic')
  const initialTopicData = initialTopic ? HEALTH_TOPICS.find(t => t.slug === initialTopic) : null
  const [activeTopicSlug, setActiveTopicSlug] = useState<string | null>(initialTopic)
  const [categoryFilter, setCategoryFilter] = useState<string[] | null>(
    initialTopicData?.categories ?? null
  )
  const [keywordFilter, setKeywordFilter] = useState<string[] | null>(
    initialTopicData?.keywords ?? null
  )
  const [redFlagDismissed, setRedFlagDismissed] = useState(false)
  const [redFlagTriggered, setRedFlagTriggered] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data } = await supabase
        .from('tests')
        .select('id, test_name, category, description, cpt_codes, fasting_required, turnaround, related_tests, notes')
        .order('test_name')
      if (data) {
        const typed = data as unknown as Test[]
        setTests(typed)
        const map: Record<string, string> = {}
        typed.forEach((t: Test) => { map[t.test_name] = t.id })
        setTestMap(map)
      }
      setLoading(false)
    }
    load()
  }, [])

  // Lab code lookup — when query looks like a proprietary code, search lab_codes table
  useEffect(() => {
    const q = query.trim()
    // Match patterns like "140103", "004515", "P4310", "322000" (3-8 alphanumeric chars)
    if (!q || !/^[A-Za-z0-9]{3,8}$/.test(q)) {
      setCodeMatch(null)
      return
    }
    // Don't trigger for short words that are likely test names
    if (/^[a-zA-Z]+$/.test(q) && q.length < 5) {
      setCodeMatch(null)
      return
    }
    const supabase = createClient()
    let cancelled = false
    async function lookup() {
      const { data } = await supabase
        .from('lab_codes')
        .select('proprietary_code, lab_name, test_id, tests(id, test_name)')
        .eq('proprietary_code', q)
        .limit(1)
      if (cancelled || !data || data.length === 0) {
        if (!cancelled) setCodeMatch(null)
        return
      }
      const row = data[0] as any
      if (row.tests) {
        setCodeMatch({
          testId: row.tests.id,
          testName: row.tests.test_name,
          labName: row.lab_name,
          code: row.proprietary_code,
        })
      }
    }
    lookup()
    return () => { cancelled = true }
  }, [query])

  const categories = useMemo(() => {
    const cats = new Set(tests.map((t) => t.category).filter(Boolean))
    return Array.from(cats).sort() as string[]
  }, [tests])

  // Show red flag only after explicit submit
  const showRedFlag = redFlagTriggered && !redFlagDismissed

  // Reset flags when query changes
  useEffect(() => {
    setRedFlagDismissed(false)
    setRedFlagTriggered(false)
  }, [query])

  const redFlagMatch = useMemo(() => getRedFlagMatch(query), [query])

  function handleSearchSubmit() {
    if (isRedFlagQuery(query)) {
      setRedFlagTriggered(true)
    }
  }

  // Filter tests
  const filteredTests = useMemo(() => {
    let result = tests
    if (categoryFilter && categoryFilter.length > 0) {
      result = result.filter((t) => t.category && categoryFilter.includes(t.category))
    }
    if (keywordFilter && keywordFilter.length > 0) {
      result = result.filter((t) =>
        keywordFilter.some(kw => t.test_name.toLowerCase().includes(kw))
      )
    }
    // Priority sort for active topics
    const activeTopic = HEALTH_TOPICS.find(t => t.slug === activeTopicSlug)
    if (activeTopic?.priority) {
      result = [...result].sort((a, b) => {
        const aIdx = activeTopic.priority!.findIndex(p =>
          a.test_name.toLowerCase().includes(p.toLowerCase())
        )
        const bIdx = activeTopic.priority!.findIndex(p =>
          b.test_name.toLowerCase().includes(p.toLowerCase())
        )
        if (aIdx === -1 && bIdx === -1) return a.test_name.localeCompare(b.test_name)
        if (aIdx === -1) return 1
        if (bIdx === -1) return -1
        return aIdx - bIdx
      })
    }
    if (!query.trim()) return result
    const q = query.toLowerCase()
    const words = q.split(/\s+/).filter(Boolean)
    // Only match on test name, CPT codes, or category — not description.
    // Description matches cause symptom words (e.g. "fatigue") to surface irrelevant tests.
    // Symptom-based lookup belongs on the Explore page.
    return result.filter(
      (t) =>
        words.every(w => t.test_name.toLowerCase().includes(w)) ||
        t.cpt_codes.some((c) => c.includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
    )
  }, [tests, query, categoryFilter, keywordFilter, activeTopicSlug])

  // Group tests by category for browse-all view
  const groupedByCategory = useMemo(() => {
    const groups: { category: string; label: string; tests: Test[] }[] = []
    const catMap = new Map<string, Test[]>()
    filteredTests.forEach(t => {
      const cat = t.category || 'other'
      if (!catMap.has(cat)) catMap.set(cat, [])
      catMap.get(cat)!.push(t)
    })
    const sorted = Array.from(catMap.entries()).sort((a, b) => a[0].localeCompare(b[0]))
    for (const [cat, catTests] of sorted) {
      groups.push({ category: cat, label: CATEGORY_LABELS[cat] || cat, tests: catTests })
    }
    return groups
  }, [filteredTests])

  const isBrowseAll = !query.trim() && !categoryFilter && !keywordFilter

  function toggleCategory(cat: string) {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }



  return (
    <section className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a2e2b] mb-3">
            Search lab tests
          </h1>
          <p className="text-lg text-[#4a6b67]">
            Search by test name, CPT code, or lab code. Free, no account required.
          </p>
        </div>

        {/* Search bar */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="relative">
            <div className="flex items-center rounded-xl border-2 border-[#2d6a5e] bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-[#2d6a5e]/20">
              <svg className="h-5 w-5 shrink-0 text-[#577572]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setCategoryFilter(null)
                  setKeywordFilter(null)
                  setActiveTopicSlug(null)
                  if (!e.target.value) router.replace('/search')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchSubmit()
                }}
                placeholder="Search by test name, CPT code, or lab code..."
                className="ml-3 flex-1 bg-transparent text-[#1a2e2b] placeholder-[#577572] focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setCategoryFilter(null); setKeywordFilter(null); setActiveTopicSlug(null); router.replace('/search') }}
                  className="ml-2 text-[#577572] hover:text-[#1a2e2b] transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#e0ebe9] border-t-[#2d6a5e]" />
            <p className="mt-4 text-sm text-[#577572]">Loading tests...</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Health topic cards — show when browsing (no query and no active topic filter) */}
            {!query.trim() && !categoryFilter && !keywordFilter && (
              <div className="mt-8 mx-auto max-w-4xl">
                <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-[#577572] mb-1">Browse tests by category</h2>
                <p className="text-center text-xs text-[#a0b8b4] mb-4">Filter the test list by area — or search by name above. Looking for symptom guidance? <a href="/explore" className="text-[#2d6a5e] hover:underline">Try Explore →</a></p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {HEALTH_TOPICS.map((topic) => (
                    <button
                      key={topic.label}
                      onClick={() => {
                        router.push(`/search?topic=${topic.slug}`)
                        setActiveTopicSlug(topic.slug)
                        if (topic.categories) {
                          setCategoryFilter(topic.categories)
                          setKeywordFilter(null)
                        } else if (topic.keywords) {
                          setKeywordFilter(topic.keywords)
                          setCategoryFilter(null)
                        }
                      }}
                      className="group flex flex-col items-center gap-2 rounded-xl border border-[#e0ebe9] bg-white p-4 transition-all hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5"
                    >
                      <span className="text-sm font-medium text-[#1a2e2b] group-hover:text-[#2d6a5e] text-center leading-tight">{topic.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex-1 border-t border-[#e0ebe9]" />
                  <span className="text-xs text-[#577572]">or browse all {tests.length} tests below</span>
                  <div className="flex-1 border-t border-[#e0ebe9]" />
                </div>
              </div>
            )}

            {/* Category back button + active topic label — show when a category or keyword filter is active */}
            {!query.trim() && !!(categoryFilter?.length || keywordFilter?.length) && (
              <div className="mt-6 mx-auto max-w-5xl flex items-center justify-between">
                <button
                  onClick={() => { setCategoryFilter(null); setKeywordFilter(null); setActiveTopicSlug(null); router.replace('/search') }}
                  className="flex items-center gap-2 text-sm text-[#577572] hover:text-[#2d6a5e] transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                  Back to all topics
                </button>
                {activeTopicSlug && (() => {
                  const t = HEALTH_TOPICS.find(t => t.slug === activeTopicSlug)
                  return t ? (
                    <span className="text-sm font-semibold text-[#1a2e2b]">
                      {t.label}
                    </span>
                  ) : null
                })()}
              </div>
            )}

            {/* Contextual bundle card — show when a topic pill is active and has a mapped bundle */}
            {activeTopicSlug && !query.trim() && (() => {
              const bundle = getBundleForTopic(activeTopicSlug)
              return bundle ? <TopicBundleCard bundle={bundle} testMap={testMap} /> : null
            })()}

            {/* Results count + view toggle */}
            <div className="mt-6 flex items-center justify-between mx-auto max-w-5xl">
              <p className="text-sm text-[#577572]">
                {query.trim() ? (
                  <>{filteredTests.length} test{filteredTests.length !== 1 ? 's' : ''} found</>
                ) : (
                  `${filteredTests.length} tests available`
                )}
              </p>
              <div className="flex items-center gap-1 rounded-lg border border-[#e0ebe9] bg-white p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-md p-1.5 transition-colors ${viewMode === 'list' ? 'bg-[#2d6a5e] text-white' : 'text-[#577572] hover:text-[#1a2e2b]'}`}
                  title="List view"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-md p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-[#2d6a5e] text-white' : 'text-[#577572] hover:text-[#1a2e2b]'}`}
                  title="Grid view"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Lab code exact match — show prominently */}
            {codeMatch && (
              <div className="mt-6 mx-auto max-w-5xl">
                <Link
                  href={`/search/${codeMatch.testId}`}
                  className="flex items-center gap-4 rounded-xl border-2 border-[#2d6a5e] bg-[#f0f7f6] p-5 transition-all hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2d6a5e]">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#2d6a5e] mb-0.5">
                      Exact code match — {codeMatch.labName}
                    </div>
                    <div className="text-base font-bold text-[#1a2e2b]">{codeMatch.testName}</div>
                    <div className="text-sm text-[#4a6b67] mt-0.5">
                      Code <span className="font-mono font-semibold text-[#1a2e2b]">{codeMatch.code}</span> → View test details, pricing & lab codes
                    </div>
                  </div>
                  <svg className="h-5 w-5 shrink-0 text-[#2d6a5e]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            )}



            {/* Test results */}
            {!showRedFlag && (
              <>
                {isBrowseAll ? (
                  /* Browse-all: collapsible category groups */
                  <div className="mt-4 mx-auto max-w-5xl flex flex-col gap-2">
                    {groupedByCategory.map(({ category, label, tests: catTests }) => {
                      const isOpen = expandedCategories.has(category)
                      return (
                        <div key={category}>
                          <button
                            onClick={() => toggleCategory(category)}
                            className="w-full flex items-center justify-between rounded-lg border border-[#e0ebe9] bg-white px-5 py-3.5 transition-all hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5 cursor-pointer"
                          >
                            <span className="text-sm font-semibold text-[#1a2e2b]">{label}</span>
                            <div className="flex items-center gap-2">
                              <span className="rounded-full bg-[#f0f7f6] px-2.5 py-0.5 text-xs font-medium text-[#2d6a5e]">
                                {catTests.length} test{catTests.length !== 1 ? 's' : ''}
                              </span>
                              <svg
                                className={`h-4 w-4 text-[#577572] transition-transform ${isOpen ? 'rotate-90' : ''}`}
                                fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                              </svg>
                            </div>
                          </button>
                          {isOpen && (
                            <div className="ml-2 mt-1 mb-2 flex flex-col gap-1.5 border-l-2 border-[#e0ebe9] pl-4">
                              {catTests.map((test) => (
                                <TestListItem key={test.id} test={test} />
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (() => {
                  const displayTests = filteredTests
                  return viewMode === 'grid' ? (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {displayTests.map((test) => (
                        <TestCard key={test.id} test={test} />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 mx-auto max-w-5xl flex flex-col gap-2">
                      {displayTests.map((test) => (
                        <TestListItem key={test.id} test={test} />
                      ))}
                    </div>
                  )
                })()}

                {filteredTests.length === 0 && (
                  <div className="mt-16 text-center">
                    <p className="text-lg text-[#577572]">No tests found for &ldquo;{query}&rdquo;.</p>
                    <p className="mt-2 text-sm text-[#577572]">
                      Try searching by test name, CPT code, or lab code.
                    </p>
                    <div className="mt-6 inline-block rounded-xl border border-[#e0ebe9] bg-[#f0f7f6] px-6 py-4 text-left max-w-sm">
                      <p className="text-sm font-semibold text-[#1a2e2b] mb-1">Looking for guidance by symptom or condition?</p>
                      <p className="text-xs text-[#577572] mb-3">Explore can help you figure out which tests are commonly discussed for what you&apos;re experiencing.</p>
                      <a href="/explore" className="inline-flex items-center gap-1 text-xs font-semibold text-[#2d6a5e] hover:underline">
                        Go to Explore →
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Red-flag interstitial */}
        {showRedFlag && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a2e2b]/70 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#1a2e2b]">Important Safety Notice</h3>
              </div>

              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center">
                <p className="text-2xl font-bold text-[#1a2e2b]">
                  If this is an emergency, call 911.
                </p>
                <p className="mt-3 text-sm text-red-700">
                  These symptoms may indicate a medical emergency. Do not delay seeking care.
                </p>
              </div>

              {redFlagMatch && (
                <a
                  href={redFlagMatch.resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-2 rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-4 py-3 text-sm font-medium text-[#2d6a5e] transition-colors hover:bg-[#e0ebe9]"
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  {redFlagMatch.resource.label}
                </a>
              )}

              <p className="mt-4 text-xs leading-relaxed text-[#577572]">
                LabLooker is a research tool, not a substitute for emergency medical care.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => { setQuery(''); setRedFlagTriggered(false); setRedFlagDismissed(false) }}
                  className="flex-1 rounded-lg border border-[#e0ebe9] px-4 py-3 text-sm font-medium text-[#4a6b67] transition-colors hover:border-[#2d6a5e] hover:text-[#1a2e2b]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setRedFlagDismissed(true)}
                  className="flex-1 rounded-lg bg-[#4a6b67] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3d5a56]"
                >
                  Continue to search results
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function TestListItem({ test }: { test: Test }) {
  return (
    <Link
      href={`/search/${test.id}`}
      className="group flex items-center gap-4 rounded-lg border border-[#e0ebe9] bg-white px-5 py-4 transition-all duration-200 hover:border-[#2d6a5e]/30 hover:bg-[#2d6a5e]/5"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-[#1a2e2b] group-hover:text-[#2d6a5e] truncate">
            {test.test_name}
          </h3>
          {test.cpt_codes.length > 0 && (
            <span className="shrink-0 text-xs font-mono text-[#577572]">
              CPT {test.cpt_codes[0]}
            </span>
          )}
          {test.fasting_required && (
            <span className="shrink-0 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-700">
              Fasting
            </span>
          )}
        </div>
        {test.description && (
          <p className="mt-1 text-xs leading-relaxed text-[#577572] line-clamp-1">
            {test.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {test.category && (
          <span className="hidden sm:inline-block rounded-full bg-[#f0f7f6] border border-[#e0ebe9] px-2.5 py-0.5 text-[10px] font-medium text-[#2d6a5e]">
            {CATEGORY_LABELS[test.category] || test.category}
          </span>
        )}
        <svg className="h-4 w-4 text-[#577572] group-hover:text-[#2d6a5e] transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </Link>
  )
}

function TestCard({ test }: { test: Test }) {
  const [showDesc, setShowDesc] = useState(false)
  return (
    <div className="group rounded-xl border border-[#e0ebe9] bg-white p-6 transition-all duration-200 hover:border-[#2d6a5e]/30">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/search/${test.id}`} className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-[#1a2e2b] group-hover:text-[#2d6a5e]">
            {test.test_name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 shrink-0">
          {test.fasting_required && (
            <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs font-medium text-amber-700">
              Fasting
            </span>
          )}
          {test.description && (
            <button
              onClick={() => setShowDesc(v => !v)}
              className="text-xs text-[#2d6a5e] hover:underline whitespace-nowrap"
            >
              {showDesc ? 'Hide' : 'Why order this?'}
            </button>
          )}
        </div>
      </div>
      {test.cpt_codes.length > 0 && (
        <p className="mt-1 text-xs font-mono text-[#2d6a5e]/70">
          CPT: {test.cpt_codes.join(', ')}
        </p>
      )}
      {showDesc && test.description && (
        <p className="mt-2 text-xs leading-relaxed text-[#4a6b67] bg-[#f0f7f6] rounded-lg px-3 py-2">
          {test.description}
        </p>
      )}
      <div className="mt-3 flex items-center justify-between">
        {test.category && (
          <span className="rounded-full bg-[#e0ebe9] px-2 py-0.5 text-xs text-[#577572]">
            {CATEGORY_LABELS[test.category] || test.category}
          </span>
        )}
        <Link href={`/search/${test.id}`} className="text-xs font-medium text-[#2d6a5e] opacity-0 transition-opacity group-hover:opacity-100">
          View Details →
        </Link>
      </div>
    </div>
  )
}

function TopicBundleCard({
  bundle,
  testMap,
}: {
  bundle: TestBundle
  testMap: Record<string, string>
}) {
  const [expanded, setExpanded] = useState(false)

  function getTestMatches() {
    return bundle.tests.map(name => {
      let id = testMap[name] || null
      if (!id) {
        const lower = name.toLowerCase()
        const entry = Object.entries(testMap).find(([k]) => k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase()))
        if (entry) id = entry[1]
      }
      return { name, id, found: !!id }
    })
  }

  const matches = getTestMatches()

  return (
    <div className="mx-auto max-w-5xl mt-6">
      <div
        className={`rounded-2xl border-[1.5px] transition-all ${
          expanded ? 'border-[#2d6a5e] shadow-lg shadow-[#2d6a5e]/5' : 'border-[#2d6a5e]/30'
        }`}
        style={{ backgroundColor: '#f0f7f6' }}
      >
        {/* Card header */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full text-left p-5 sm:p-6 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <span className="text-2xl flex-shrink-0 mt-0.5">{bundle.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2d6a5e]">
                  Recommended panel
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-bold text-[#1a2e2b] sm:text-lg">
                  {bundle.name}
                </h3>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-[#2d6a5e]">
                    {bundle.tests.length} tests
                  </span>
                  <svg
                    className={`h-5 w-5 text-[#577572] transition-transform ${expanded ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>
              <p className="mt-1.5 text-sm text-[#4a6b67] leading-relaxed">
                {bundle.description}
              </p>
            </div>
          </div>
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="px-5 pb-5 sm:px-6 sm:pb-6 border-t border-[#2d6a5e]/10">
            {/* Who needs this */}
            <div className="mt-5 rounded-xl bg-white p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#2d6a5e] mb-2">
                Who should order this?
              </p>
              <p className="text-sm text-[#4a6b67] leading-relaxed">
                {bundle.whoNeeds}
              </p>
            </div>

            {/* Test list */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#577572] mb-3">
                Tests included
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {matches.map((test, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <svg className="h-4 w-4 text-[#2d6a5e] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {test.id ? (
                      <a
                        href={`/search/${test.id}`}
                        className="text-sm text-[#4a6b67] hover:text-[#2d6a5e] transition-colors"
                      >
                        {test.name}
                      </a>
                    ) : (
                      <span className="text-sm text-[#4a6b67]">{test.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {bundle.notes && (
              <div className="mt-5 flex gap-3 rounded-xl border border-[#e0ebe9] bg-white p-4">
                <svg className="h-5 w-5 text-[#b85c5c] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <p className="text-sm text-[#4a6b67] leading-relaxed">
                  {bundle.notes}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href={`/bundles#${bundle.slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2d6a5e] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#245a50]"
              >
                View full panel
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-[#2d6a5e] transition-colors hover:bg-[#e0ebe9]"
              >
                Compare prices
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
