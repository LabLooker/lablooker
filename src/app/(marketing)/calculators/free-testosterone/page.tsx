'use client'

import { useState } from 'react'
import { CalculatorShell, CalcInput, ResultDisplay } from '../_components'

export default function FreeTestosteronePage() {
  const [totalT, setTotalT] = useState('')
  const [shbg, setShbg] = useState('')
  const [albumin, setAlbumin] = useState('4.3')

  const t = parseFloat(totalT)
  const s = parseFloat(shbg)
  const a = parseFloat(albumin)
  const hasShbg = !isNaN(s) && s > 0

  // Simplified estimate when SHBG not available
  const simpleFreeT = !isNaN(t) && t > 0 && !hasShbg ? t * 0.0311 : null

  // Vermeulen approximation when SHBG is available
  const vermeulenFreeT = !isNaN(t) && t > 0 && hasShbg ? (t * 10) / (1 + 0.0728 * s) : null

  const freeT = vermeulenFreeT ?? simpleFreeT
  const method = vermeulenFreeT !== null ? 'Vermeulen' : 'simplified'

  return (
    <CalculatorShell
      title="Free Testosterone Calculator"
      description="Estimates free (bioavailable) testosterone. Enter total testosterone alone for a quick estimate, or add SHBG for a more accurate Vermeulen calculation. Important for BHRT/TRT patients."
    >
      {/* Formula */}
      <div className="rounded-xl border border-[#e0ebe9] bg-white px-5 py-4">
        <p className="text-xs font-medium text-[#577572] uppercase tracking-wide mb-1">Method</p>
        <p className="text-sm text-[#1a2e2b]">Vermeulen equation (when SHBG provided), or simplified estimate: Free T &asymp; Total T &times; 0.0311</p>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        <CalcInput label="Total Testosterone" unit="ng/dL" value={totalT} onChange={setTotalT} />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <CalcInput label="SHBG" unit="nmol/L" value={shbg} onChange={setShbg} />
            <p className="mt-1 text-xs text-[#577572]">Optional — improves accuracy</p>
          </div>
          <div>
            <CalcInput label="Albumin" unit="g/dL" value={albumin} onChange={setAlbumin} />
            <p className="mt-1 text-xs text-[#577572]">Default 4.3 g/dL</p>
          </div>
        </div>
      </div>

      {/* Result */}
      {freeT !== null && (
        <ResultDisplay value={`${freeT.toFixed(1)} pg/mL`}>
          <span className="text-xs text-[#577572]">
            Estimated using {method} method
          </span>
        </ResultDisplay>
      )}

      {/* Clinical context */}
      <div className="text-sm text-[#577572] leading-relaxed space-y-2">
        <p className="font-medium text-[#4a6b67]">When is this useful?</p>
        <p>Only about 2&ndash;3% of testosterone circulates freely in the blood. The rest is bound to SHBG and albumin. Total testosterone can look normal while free testosterone is actually low (or vice versa).</p>
        <p>Especially relevant for women on BHRT &mdash; Quest total testosterone is known to inflate results for women on testosterone therapy. Free testosterone gives a more accurate picture of bioavailable hormone levels.</p>
        <p>For clinical decisions, a direct free testosterone measurement (equilibrium dialysis) is more accurate than any calculation.</p>
      </div>
    </CalculatorShell>
  )
}
