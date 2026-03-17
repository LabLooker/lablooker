'use client'

import { useState } from 'react'
import { CalculatorShell, CalcInput, ResultDisplay } from '../_components'

export default function HomaIrPage() {
  const [glucose, setGlucose] = useState('')
  const [insulin, setInsulin] = useState('')

  const g = parseFloat(glucose)
  const i = parseFloat(insulin)
  const valid = !isNaN(g) && !isNaN(i) && g > 0 && i > 0
  const homaIr = valid ? (g * i) / 405 : null

  function getInterpretation(val: number) {
    if (val < 1.0) return { label: 'Optimal insulin sensitivity', color: 'text-[#2d6a5e]' }
    if (val < 2.0) return { label: 'Early insulin resistance', color: 'text-[#c59030]' }
    if (val < 3.0) return { label: 'Significant insulin resistance', color: 'text-[#b85c5c]' }
    return { label: 'Severe insulin resistance', color: 'text-[#b85c5c]' }
  }

  return (
    <CalculatorShell
      title="HOMA-IR Calculator"
      description="Estimates insulin resistance from fasting glucose and fasting insulin. Lower scores mean better insulin sensitivity. HOMA-IR is one of the most widely used markers for metabolic health."
    >
      {/* Formula */}
      <div className="rounded-xl border border-[#e0ebe9] bg-white px-5 py-4">
        <p className="text-xs font-medium text-[#577572] uppercase tracking-wide mb-1">Formula</p>
        <p className="text-sm text-[#1a2e2b]">HOMA-IR = (Fasting Glucose &times; Fasting Insulin) &divide; 405</p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <CalcInput label="Fasting Glucose" unit="mg/dL" value={glucose} onChange={setGlucose} />
        <CalcInput label="Fasting Insulin" unit={'\u00B5IU/mL'} value={insulin} onChange={setInsulin} />
      </div>

      {/* Result */}
      {homaIr !== null && (
        <ResultDisplay value={homaIr.toFixed(2)}>
          <span className={getInterpretation(homaIr).color}>
            {getInterpretation(homaIr).label}
          </span>
        </ResultDisplay>
      )}

      {/* Interpretation guide */}
      <div className="rounded-xl border border-[#e0ebe9] bg-white px-5 py-4">
        <p className="text-xs font-medium text-[#577572] uppercase tracking-wide mb-3">Interpretation</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#2d6a5e] shrink-0" />
            <span className="text-[#1a2e2b]"><strong>&lt; 1.0</strong> &mdash; Optimal insulin sensitivity</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#c59030] shrink-0" />
            <span className="text-[#1a2e2b]"><strong>1.0&ndash;1.9</strong> &mdash; Early insulin resistance</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#b85c5c] shrink-0" />
            <span className="text-[#1a2e2b]"><strong>2.0&ndash;2.9</strong> &mdash; Significant insulin resistance</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#b85c5c] shrink-0" />
            <span className="text-[#1a2e2b]"><strong>&ge; 3.0</strong> &mdash; Severe insulin resistance</span>
          </div>
        </div>
      </div>

      {/* Clinical context */}
      <div className="text-sm text-[#577572] leading-relaxed space-y-2">
        <p className="font-medium text-[#4a6b67]">When is this useful?</p>
        <p>HOMA-IR helps detect insulin resistance before blood sugar rises to prediabetic levels. It&apos;s widely used in metabolic health, diabetes prevention, and by people following keto, carnivore, or low-carb diets to track improvements in insulin sensitivity.</p>
        <p>Both values must be fasting (8&ndash;12 hours) for an accurate result.</p>
      </div>
    </CalculatorShell>
  )
}
