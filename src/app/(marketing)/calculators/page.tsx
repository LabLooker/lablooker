'use client'

import { useState } from 'react'

// ─── Calculator Components ──────────────────────────────────────────────────

function CorrectedCalciumCalc() {
  const [calcium, setCalcium] = useState('')
  const [albumin, setAlbumin] = useState('')

  const ca = parseFloat(calcium)
  const alb = parseFloat(albumin)
  const valid = !isNaN(ca) && !isNaN(alb) && alb > 0
  const corrected = valid ? ca + 0.8 * (4.0 - alb) : null

  return (
    <CalculatorCard
      title="Corrected Calcium (Albumin-Adjusted)"
      description="Adjusts serum calcium for low albumin levels. Normal albumin is ~4.0 g/dL; low albumin makes calcium appear falsely low."
      relevantFor="Hypoparathyroid patients, kidney disease, anyone on calcium monitoring"
    >
      <div className="grid grid-cols-2 gap-4">
        <CalcInput label="Serum Calcium" unit="mg/dL" value={calcium} onChange={setCalcium} />
        <CalcInput label="Albumin" unit="g/dL" value={albumin} onChange={setAlbumin} />
      </div>
      {corrected !== null && (
        <ResultDisplay value={`${corrected.toFixed(1)} mg/dL`}>
          {corrected > 10.2 ? (
            <span className="text-[#b85c5c]">Above upper normal (10.2 mg/dL)</span>
          ) : corrected < 8.5 ? (
            <span className="text-[#b85c5c]">Below lower normal (8.5 mg/dL)</span>
          ) : (
            <span className="text-[#2d6a5e]">Within normal range (8.5 &ndash; 10.2 mg/dL)</span>
          )}
        </ResultDisplay>
      )}
    </CalculatorCard>
  )
}

function HomaIrCalc() {
  const [glucose, setGlucose] = useState('')
  const [insulin, setInsulin] = useState('')

  const g = parseFloat(glucose)
  const i = parseFloat(insulin)
  const valid = !isNaN(g) && !isNaN(i) && g > 0 && i > 0
  const homaIr = valid ? (g * i) / 405 : null

  function getInterpretation(val: number) {
    if (val < 1.0) return { label: 'Optimal', color: 'text-[#2d6a5e]' }
    if (val < 2.0) return { label: 'Early insulin resistance', color: 'text-[#c59030]' }
    if (val < 2.9) return { label: 'Significant insulin resistance', color: 'text-[#b85c5c]' }
    return { label: 'High insulin resistance', color: 'text-[#b85c5c]' }
  }

  return (
    <CalculatorCard
      title="HOMA-IR (Insulin Resistance)"
      description="Estimates insulin resistance from fasting glucose and insulin. Lower values indicate better insulin sensitivity."
      relevantFor="Metabolic health, diabetes prevention, weight management"
    >
      <div className="grid grid-cols-2 gap-4">
        <CalcInput label="Fasting Glucose" unit="mg/dL" value={glucose} onChange={setGlucose} />
        <CalcInput label="Fasting Insulin" unit={'\u00B5IU/mL'} value={insulin} onChange={setInsulin} />
      </div>
      {homaIr !== null && (
        <ResultDisplay value={homaIr.toFixed(2)}>
          <span className={getInterpretation(homaIr).color}>
            {getInterpretation(homaIr).label}
          </span>
          <span className="block text-xs text-[#577572] mt-1">
            {'<'}1.0 optimal &middot; 1.0&ndash;1.9 early resistance &middot; {'\u2265'}2.0 significant &middot; {'\u2265'}2.9 high
          </span>
        </ResultDisplay>
      )}
    </CalculatorCard>
  )
}

function FreeTestosteroneCalc() {
  const [totalT, setTotalT] = useState('')
  const [shbg, setShbg] = useState('')
  const [albumin, setAlbumin] = useState('4.3')

  const t = parseFloat(totalT)
  const s = parseFloat(shbg)
  const valid = !isNaN(t) && !isNaN(s) && t > 0 && s > 0

  // Simplified Vermeulen approximation
  const freeT = valid ? (t * 10) / (1 + 0.0728 * s) : null

  return (
    <CalculatorCard
      title="Free Testosterone (Calculated)"
      description="Estimates free testosterone using a simplified Vermeulen approximation. Note: this is an approximation. For clinical use, direct free testosterone measurement is more accurate."
      relevantFor="BHRT/TRT patients, women on testosterone therapy"
    >
      <div className="grid grid-cols-3 gap-4">
        <CalcInput label="Total Testosterone" unit="ng/dL" value={totalT} onChange={setTotalT} />
        <CalcInput label="SHBG" unit="nmol/L" value={shbg} onChange={setShbg} />
        <CalcInput label="Albumin" unit="g/dL" value={albumin} onChange={setAlbumin} />
      </div>
      {freeT !== null && (
        <ResultDisplay value={`${freeT.toFixed(1)} pg/mL`}>
          <span className="text-xs text-[#577572]">
            Approximation based on simplified Vermeulen method
          </span>
        </ResultDisplay>
      )}
    </CalculatorCard>
  )
}

function IronSaturationCalc() {
  const [iron, setIron] = useState('')
  const [tibc, setTibc] = useState('')

  const fe = parseFloat(iron)
  const tb = parseFloat(tibc)
  const valid = !isNaN(fe) && !isNaN(tb) && tb > 0
  const saturation = valid ? (fe / tb) * 100 : null

  function getInterpretation(val: number) {
    if (val < 20) return { label: 'Low \u2014 suggests iron deficiency', color: 'text-[#b85c5c]' }
    if (val <= 50) return { label: 'Normal range', color: 'text-[#2d6a5e]' }
    return { label: 'High \u2014 may suggest iron overload', color: 'text-[#b85c5c]' }
  }

  return (
    <CalculatorCard
      title="Iron Saturation %"
      description="Calculates the percentage of transferrin that is saturated with iron. Useful for evaluating iron status."
      relevantFor="Iron deficiency anemia, hemochromatosis screening"
    >
      <div className="grid grid-cols-2 gap-4">
        <CalcInput label="Serum Iron" unit={'\u00B5g/dL'} value={iron} onChange={setIron} />
        <CalcInput label="TIBC" unit={'\u00B5g/dL'} value={tibc} onChange={setTibc} />
      </div>
      {saturation !== null && (
        <ResultDisplay value={`${saturation.toFixed(1)}%`}>
          <span className={getInterpretation(saturation).color}>
            {getInterpretation(saturation).label}
          </span>
          <span className="block text-xs text-[#577572] mt-1">
            Normal: 20&ndash;50%. {'<'}20% deficiency. {'>'}50% possible overload.
          </span>
        </ResultDisplay>
      )}
    </CalculatorCard>
  )
}

function NonHdlCholesterolCalc() {
  const [total, setTotal] = useState('')
  const [hdl, setHdl] = useState('')

  const tc = parseFloat(total)
  const h = parseFloat(hdl)
  const valid = !isNaN(tc) && !isNaN(h) && tc > h
  const nonHdl = valid ? tc - h : null

  function getInterpretation(val: number) {
    if (val < 130) return { label: 'Optimal', color: 'text-[#2d6a5e]' }
    if (val < 160) return { label: 'Near optimal', color: 'text-[#2d6a5e]' }
    if (val < 190) return { label: 'Borderline high', color: 'text-[#c59030]' }
    return { label: 'High', color: 'text-[#b85c5c]' }
  }

  return (
    <CalculatorCard
      title="Non-HDL Cholesterol"
      description="Subtracts HDL from total cholesterol to estimate atherogenic cholesterol. Considered a better predictor of cardiovascular risk than LDL alone."
      relevantFor="Cardiovascular risk assessment"
    >
      <div className="grid grid-cols-2 gap-4">
        <CalcInput label="Total Cholesterol" unit="mg/dL" value={total} onChange={setTotal} />
        <CalcInput label="HDL Cholesterol" unit="mg/dL" value={hdl} onChange={setHdl} />
      </div>
      {nonHdl !== null && (
        <ResultDisplay value={`${nonHdl.toFixed(0)} mg/dL`}>
          <span className={getInterpretation(nonHdl).color}>
            {getInterpretation(nonHdl).label}
          </span>
          <span className="block text-xs text-[#577572] mt-1">
            Optimal {'<'}130 &middot; Near optimal 130&ndash;159 &middot; Borderline 160&ndash;189 &middot; High {'\u2265'}190
          </span>
        </ResultDisplay>
      )}
    </CalculatorCard>
  )
}

// ─── Shared UI Components ───────────────────────────────────────────────────

function CalculatorCard({
  title,
  description,
  relevantFor,
  children,
}: {
  title: string
  description: string
  relevantFor: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#e0ebe9] bg-white p-6 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#1a2e2b]">{title}</h2>
        <p className="mt-1 text-sm text-[#577572] leading-relaxed">{description}</p>
      </div>
      {children}
      <p className="text-xs text-[#577572]">
        <span className="font-medium text-[#4a6b67]">Relevant for:</span> {relevantFor}
      </p>
    </div>
  )
}

function CalcInput({
  label,
  unit,
  value,
  onChange,
}: {
  label: string
  unit: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a2e2b] mb-1.5">
        {label} <span className="text-xs text-[#577572] font-normal">({unit})</span>
      </label>
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#e0ebe9] px-3 py-2 text-sm focus:border-[#2d6a5e] focus:outline-none"
        placeholder="0"
      />
    </div>
  )
}

function ResultDisplay({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[#f0f7f6] border border-[#e0ebe9] px-4 py-3">
      <p className="text-xl font-bold text-[#1a2e2b]">{value}</p>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

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
            Calculate derived values from your lab results. All calculators are free.
          </p>
        </div>

        {/* Calculator grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CorrectedCalciumCalc />
          <HomaIrCalc />
          <FreeTestosteroneCalc />
          <IronSaturationCalc />
          <NonHdlCholesterolCalc />
        </div>

        {/* Disclaimer */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-xs text-amber-800 text-center">
          These calculators are for educational purposes only. Always confirm results with your healthcare provider before making medical decisions.
        </div>
      </div>
    </div>
  )
}
