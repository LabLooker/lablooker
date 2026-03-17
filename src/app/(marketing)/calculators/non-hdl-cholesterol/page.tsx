'use client'

import { useState } from 'react'
import { CalculatorShell, CalcInput, ResultDisplay } from '../_components'

export default function NonHdlCholesterolPage() {
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
    <CalculatorShell
      title="Non-HDL Cholesterol Calculator"
      description="Subtracts HDL from total cholesterol to estimate all atherogenic (artery-clogging) cholesterol. Considered a better predictor of cardiovascular risk than LDL alone."
    >
      {/* Formula */}
      <div className="rounded-xl border border-[#e0ebe9] bg-white px-5 py-4">
        <p className="text-xs font-medium text-[#577572] uppercase tracking-wide mb-1">Formula</p>
        <p className="text-sm text-[#1a2e2b]">Non-HDL Cholesterol = Total Cholesterol &minus; HDL Cholesterol</p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <CalcInput label="Total Cholesterol" unit="mg/dL" value={total} onChange={setTotal} />
        <CalcInput label="HDL Cholesterol" unit="mg/dL" value={hdl} onChange={setHdl} />
      </div>

      {/* Result */}
      {nonHdl !== null && (
        <ResultDisplay value={`${nonHdl.toFixed(0)} mg/dL`}>
          <span className={getInterpretation(nonHdl).color}>
            {getInterpretation(nonHdl).label}
          </span>
        </ResultDisplay>
      )}

      {/* Interpretation guide */}
      <div className="rounded-xl border border-[#e0ebe9] bg-white px-5 py-4">
        <p className="text-xs font-medium text-[#577572] uppercase tracking-wide mb-3">Interpretation</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#2d6a5e] shrink-0" />
            <span className="text-[#1a2e2b]"><strong>&lt; 130 mg/dL</strong> &mdash; Optimal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#2d6a5e] shrink-0" />
            <span className="text-[#1a2e2b]"><strong>130&ndash;159 mg/dL</strong> &mdash; Near optimal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#c59030] shrink-0" />
            <span className="text-[#1a2e2b]"><strong>160&ndash;189 mg/dL</strong> &mdash; Borderline high</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#b85c5c] shrink-0" />
            <span className="text-[#1a2e2b]"><strong>&ge; 190 mg/dL</strong> &mdash; High</span>
          </div>
        </div>
      </div>

      {/* Clinical context */}
      <div className="text-sm text-[#577572] leading-relaxed space-y-2">
        <p className="font-medium text-[#4a6b67]">When is this useful?</p>
        <p>Non-HDL cholesterol captures all the &ldquo;bad&rdquo; cholesterol particles — not just LDL, but also VLDL, IDL, and lipoprotein(a). This makes it a more complete cardiovascular risk marker.</p>
        <p>Especially useful when triglycerides are elevated (above 200 mg/dL), because elevated triglycerides make calculated LDL less reliable.</p>
      </div>
    </CalculatorShell>
  )
}
