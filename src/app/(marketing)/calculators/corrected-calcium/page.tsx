'use client'

import { useState } from 'react'
import { CalculatorShell, CalcInput, ResultDisplay } from '../_components'

export default function CorrectedCalciumPage() {
  const [calcium, setCalcium] = useState('')
  const [albumin, setAlbumin] = useState('')

  const ca = parseFloat(calcium)
  const alb = parseFloat(albumin)
  const valid = !isNaN(ca) && !isNaN(alb) && alb > 0
  const corrected = valid ? ca + 0.8 * (4.0 - alb) : null

  return (
    <CalculatorShell
      title="Corrected Calcium Calculator"
      description="Adjusts serum calcium for low albumin levels. Standard calcium tests can underestimate true calcium when albumin is low — common in hypoparathyroid patients, kidney disease, and cancer patients."
    >
      {/* Formula */}
      <div className="rounded-xl border border-[#e0ebe9] bg-white px-5 py-4">
        <p className="text-xs font-medium text-[#577572] uppercase tracking-wide mb-1">Formula</p>
        <p className="text-sm text-[#1a2e2b]">Corrected Ca = Measured Ca + 0.8 &times; (4.0 &minus; Albumin)</p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <CalcInput label="Measured Calcium" unit="mg/dL" value={calcium} onChange={setCalcium} />
        <CalcInput label="Albumin" unit="g/dL" value={albumin} onChange={setAlbumin} />
      </div>

      {/* Result */}
      {corrected !== null && (
        <ResultDisplay value={`${corrected.toFixed(1)} mg/dL`}>
          {corrected > 10.5 ? (
            <span className="text-[#b85c5c]">Above normal range (8.5&ndash;10.5 mg/dL)</span>
          ) : corrected < 8.5 ? (
            <span className="text-[#b85c5c]">Below normal range (8.5&ndash;10.5 mg/dL)</span>
          ) : (
            <span className="text-[#2d6a5e]">Within normal range (8.5&ndash;10.5 mg/dL)</span>
          )}
        </ResultDisplay>
      )}

      {/* Clinical context */}
      <div className="text-sm text-[#577572] leading-relaxed space-y-2">
        <p className="font-medium text-[#4a6b67]">When is this useful?</p>
        <p>About 40% of calcium in your blood is bound to albumin. When albumin is low (hypoalbuminemia), standard calcium tests can appear falsely low. This correction estimates what your calcium would be at a normal albumin level of 4.0 g/dL.</p>
        <p>Commonly used for patients on Yorvipath/PTH therapy for hypoparathyroidism, those with kidney disease, liver disease, or malnutrition.</p>
      </div>

      {/* Yorvipath / Hypoparathyroidism callout */}
      <div className="rounded-xl border border-[#2d6a5e]/30 bg-[#f0f7f6] px-5 py-4">
        <p className="text-sm font-semibold text-[#1a2e2b] mb-2">
          💊 Note for Hypoparathyroidism Patients (Yorvipath / PTH Therapy)
        </p>
        <div className="text-sm text-[#577572] leading-relaxed space-y-2">
          <p>
            Albumin-adjusted calcium is especially important when you have hypoparathyroidism
            and are managing your calcium levels with PTH replacement therapy (such as Yorvipath).
          </p>
          <p>
            Even when your albumin is normal (4.0 g/dL), using the corrected formula helps
            standardize how your calcium is tracked over time — because small shifts in albumin
            (common with dietary changes, illness, or hydration) can make your measured calcium
            appear falsely high or low.
          </p>
          <p className="font-medium text-[#4a6b67]">
            Target range for most Yorvipath patients: 8.0–9.5 mg/dL (corrected).
          </p>
          <p className="text-xs text-[#577572]">
            Always follow your endocrinologist&apos;s specific targets, which may differ.
          </p>
        </div>
      </div>
    </CalculatorShell>
  )
}
