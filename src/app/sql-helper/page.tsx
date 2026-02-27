'use client'

import { useState } from 'react'

const FILES = [
  { name: 'Step 1: Schema (creates tables)', path: '/schema.sql' },
  { name: 'Step 2: Seed Data (357 tests + pricing)', path: '/seed-full.sql' },
  { name: 'Step 3: Lab Code Crosswalk', path: '/lab-codes.sql' },
  { name: 'Step 4: DrSays Pricing', path: '/drsays-pricing.sql' },
]

export default function SqlHelper() {
  const [contents, setContents] = useState<Record<string, string>>({})

  async function loadFile(path: string) {
    const res = await fetch(path)
    const text = await res.text()
    setContents((prev) => ({ ...prev, [path]: text }))
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2d6a5e' }}>🧪 LabLooker — Supabase Seeding</h1>
      <div style={{ background: '#e0ebe9', padding: 12, borderRadius: 8, marginBottom: 20 }}>
        <strong>How to use:</strong> Click a button → SQL appears → click inside the box → Ctrl+A (select all) → Ctrl+C (copy) → paste into Supabase SQL Editor → click Run. Do them in order 1-4.
      </div>
      {FILES.map((f) => (
        <div key={f.path} style={{ margin: '20px 0', padding: 16, background: 'white', border: '1px solid #e0ebe9', borderRadius: 8 }}>
          <h3>{f.name}</h3>
          <button
            onClick={() => loadFile(f.path)}
            style={{ background: '#2d6a5e', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 16, cursor: 'pointer' }}
          >
            {contents[f.path] ? '✅ Loaded — select & copy below' : `Show ${f.path.slice(1)}`}
          </button>
          {contents[f.path] && (
            <textarea
              readOnly
              value={contents[f.path]}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              style={{ width: '100%', height: 200, marginTop: 10, fontFamily: 'monospace', fontSize: 12, display: 'block' }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
