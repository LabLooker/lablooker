import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Lab Calculators — Free Medical Calculation Tools',
  description: 'Free lab calculators: Corrected Calcium, HOMA-IR insulin resistance, Free Testosterone (Vermeulen), Iron Saturation %, and Non-HDL Cholesterol.',
  openGraph: {
    title: 'Lab Calculators | LabLooker',
    description: 'Free medical calculators for lab results. Calculate corrected calcium, HOMA-IR, free testosterone, iron saturation, and non-HDL cholesterol.',
  },
}

const calculators = [
  {
    title: 'Corrected Calcium',
    href: '/calculators/corrected-calcium',
    description: 'Adjusts serum calcium for low albumin levels. Important for hypoparathyroid patients, kidney disease, and calcium monitoring.',
    formula: 'Ca + 0.8 \u00d7 (4.0 \u2212 Albumin)',
    inputs: 'Calcium, Albumin',
  },
  {
    title: 'HOMA-IR (Insulin Resistance)',
    href: '/calculators/homa-ir',
    description: 'Estimates insulin resistance from fasting glucose and insulin. Key marker for metabolic health and diabetes prevention.',
    formula: '(Glucose \u00d7 Insulin) \u00f7 405',
    inputs: 'Fasting Glucose, Fasting Insulin',
  },
  {
    title: 'Free Testosterone',
    href: '/calculators/free-testosterone',
    description: 'Estimates free testosterone using the Vermeulen method. Essential for BHRT/TRT patients and hormone therapy monitoring.',
    formula: 'Vermeulen equation',
    inputs: 'Total T, SHBG (optional), Albumin',
  },
  {
    title: 'Iron Saturation %',
    href: '/calculators/iron-saturation',
    description: 'Calculates transferrin saturation percentage. Screens for both iron deficiency and hemochromatosis iron overload.',
    formula: '(Serum Iron \u00f7 TIBC) \u00d7 100',
    inputs: 'Serum Iron, TIBC',
  },
  {
    title: 'Non-HDL Cholesterol',
    href: '/calculators/non-hdl-cholesterol',
    description: 'Better cardiovascular risk predictor than LDL alone. Includes VLDL and other atherogenic particles.',
    formula: 'Total Cholesterol \u2212 HDL',
    inputs: 'Total Cholesterol, HDL',
  },
]

export default function CalculatorsPage() {
  return (
    <div className="pt-28 pb-20">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[#1a2e2b] sm:text-4xl">
            Lab Calculators
          </h1>
          <p className="mt-4 text-lg text-[#577572] max-w-2xl mx-auto">
            Calculate derived values from your lab results. All calculators are free — no login required.
          </p>
        </div>

        {/* Calculator grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {calculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group rounded-2xl border border-[#e0ebe9] bg-white p-6 transition-colors hover:border-[#2d6a5e]/30 hover:bg-[#faf8f5]"
            >
              <h2 className="text-lg font-bold text-[#1a2e2b] group-hover:text-[#2d6a5e] transition-colors">
                {calc.title}
              </h2>
              <p className="mt-2 text-sm text-[#577572] leading-relaxed">
                {calc.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#577572]">
                <span>
                  <span className="font-medium text-[#4a6b67]">Formula:</span> {calc.formula}
                </span>
                <span>
                  <span className="font-medium text-[#4a6b67]">Inputs:</span> {calc.inputs}
                </span>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#2d6a5e]">
                Open calculator
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-xs text-amber-800 text-center">
          For informational purposes only. Not medical advice. Always confirm results with your healthcare provider before making medical decisions.
        </div>
      </div>
    </div>
  )
}
