'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const RESTRICTED_STATES = ['NY', 'NJ', 'RI']
const STORAGE_KEY = 'lablooker_user_state'

type StateRestrictionContextType = {
  userState: string | null
  isRestricted: boolean
  setUserState: (state: string) => void
  clearUserState: () => void
  showStatePicker: boolean
  setShowStatePicker: (show: boolean) => void
}

const StateRestrictionContext = createContext<StateRestrictionContextType>({
  userState: null,
  isRestricted: false,
  setUserState: () => {},
  clearUserState: () => {},
  showStatePicker: false,
  setShowStatePicker: () => {},
})

export function useStateRestriction() {
  return useContext(StateRestrictionContext)
}

export function StateRestrictionProvider({ children }: { children: React.ReactNode }) {
  const [userState, setUserStateRaw] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [showStatePicker, setShowStatePicker] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setUserStateRaw(stored)
    setLoaded(true)
  }, [])

  const setUserState = useCallback((state: string) => {
    localStorage.setItem(STORAGE_KEY, state)
    setUserStateRaw(state)
    setShowStatePicker(false)
  }, [])

  const clearUserState = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUserStateRaw(null)
  }, [])

  const isRestricted = userState ? RESTRICTED_STATES.includes(userState) : false

  if (!loaded) return <>{children}</>

  return (
    <StateRestrictionContext.Provider
      value={{ userState, isRestricted, setUserState, clearUserState, showStatePicker, setShowStatePicker }}
    >
      {children}
    </StateRestrictionContext.Provider>
  )
}

// Inline state picker modal
export function StatePickerModal() {
  const { showStatePicker, setShowStatePicker, setUserState } = useStateRestriction()

  if (!showStatePicker) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-[#e0ebe9] bg-white p-8 shadow-xl">
        <h3 className="text-lg font-semibold text-[#1a2e2b]">Select Your State</h3>
        <p className="mt-1 text-sm text-[#577572]">
          Some states restrict direct-to-consumer lab ordering. We&apos;ll customize your experience accordingly.
        </p>
        <select
          onChange={(e) => {
            if (e.target.value) setUserState(e.target.value)
          }}
          defaultValue=""
          className="mt-4 w-full rounded-lg border border-[#d4e5e1] bg-white px-4 py-2.5 text-sm text-[#1a2e2b] focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
        >
          <option value="" disabled>Choose your state...</option>
          {US_STATES.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>
        <button
          onClick={() => setShowStatePicker(false)}
          className="mt-3 w-full text-center text-xs text-[#577572] hover:text-[#577572]"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}

// Banner shown when user is in a restricted state
export function StateRestrictionBanner() {
  const { userState, isRestricted, clearUserState } = useStateRestriction()

  if (!isRestricted) return null

  const stateNames: Record<string, string> = { NY: 'New York', NJ: 'New Jersey', RI: 'Rhode Island' }

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
      <div className="flex items-start gap-3">
        <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-300">
            DTC lab ordering is restricted in {stateNames[userState!] || userState}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-200/70">
            {stateNames[userState!] || userState} requires a physician&apos;s order for lab tests.
            Direct-to-consumer ordering links are not available for your state. You can still use
            {' '}LabLooker to research tests, compare information, and prepare for your doctor visit.
          </p>
          <button
            onClick={clearUserState}
            className="mt-2 text-xs text-amber-300/60 underline hover:text-amber-300"
          >
            Change state
          </button>
        </div>
      </div>
    </div>
  )
}

const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' },
]
