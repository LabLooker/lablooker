'use client'

import { useState } from 'react'
import { CalculatorShell, CalcInput, ResultDisplay } from '../_components'

export default function IronSaturationPage() {
  const [iron, setIron] = useState('')
  const [tibc, setTibc] = useState('')

  const fe = parseFloat(iron)
  const tb = parseFloat(tibc)
  const valid = !isNaN(fe) && !isNaN(tb) && tb > 0
  const saturation = valid ? (fe / tb) * 100 : null

  function getInterpretation(val: number) {
    if (val < 16) return { label: 'Low — suggests iron deficiency', color: 'text-[#b85c5c]' }
    if (val <= 45) return { label: 'Normal range', color: 'text-[#2d6a5e]' }
    return { label: 'High — iron overload risk', color: 'text-[#b85c5c]' }
  }

  return (
    <CalculatorShell
      title="Iron Saturation Calculator"
      description="Calculates transferrin saturation — the percentage of your iron-carrying protein that is loaded with iron. A key marker for both iron deficiency and iron overload."
    >
      {/* Formula */}
      <div className="rounded-xl border border-[#e0ebe9] bg-white px-5 py-4">
        <p className="text-xs font-medium text-[#577572] uppercase tracking-wide mb-1">Formula</p>
        <p className="text-sm text-[#1a2e2b]">Iron Saturation % = (Serum Iron &divide; TIBC) &times; 100</p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <CalcInput label="Serum Iron" unit={'\u00B5g/dL'} value={iron} onChange={setIron} />
        <CalcInput label="TIBC" unit={'\u00B5g/dL'} value={tibc} onChange={setTibc} />
      </div>

      {/* Result */}
      {saturation !== null && (
        <ResultDisplay value={`${saturation.toFixed(1)}%`}>
          <span className={getInterpretation(saturation).color}>
            {getInterpretation(saturation).label}
          </span>
        </ResultDisplay>
      )}

      {/* Interpretation guide */}
      <div className="rounded-xl border border-[#e0ebe9] bg-white px-5 py-4">
        <p className="text-xs font-medium text-[#577572] uppercase tracking-wide mb-3">Interpretation</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#b85c5c] shrink-0" />
            <span className="text-[#1a2e2b]"><strong>&lt; 16%</strong> &mdash; Iron deficiency (low saturation)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#2d6a5e] shrink-0" />
            <span className="text-[#1a2e2b]"><strong>16&ndash;45%</strong> &mdash; Normal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#b85c5c] shrink-0" />
            <span className="text-[#1a2e2b]"><strong>&gt; 45%</strong> &mdash; Iron overload risk (hemochromatosis concern)</span>
          </div>
        </div>
      </div>

      {/* Clinical context */}
      <div className="text-sm text-[#577572] leading-relaxed space-y-2">
        <p className="font-medium text-[#4a6b67]">When is this useful?</p>
        <p>Transferrin saturation is part of a standard iron panel. Low values suggest your body doesn&apos;t have enough iron, while high values may indicate iron overload conditions like hemochromatosis.</p>
        <p>HFE/hemochromatosis screening typically uses transferrin saturation alongside ferritin. A saturation consistently above 45% warrants further evaluation.</p>
      </div>
    </CalculatorShell>
  )
}
