export type Test = {
  id: string
  test_name: string
  description: string | null
  cpt_codes: string[]
  category: string | null
  fasting_required: boolean
  turnaround: string | null
  related_tests: string[]
  notes: string | null
  prep_notes?: string | null
  community_notes?: string | null
  created_at: string
  updated_at: string
}

export type Symptom = {
  id: string
  name: string
  keywords: string[]
  related_test_ids: string[]
  created_at: string
}

export type ICD10Code = {
  id: string
  code: string
  description: string
  created_at: string
}

export type Lab = {
  id: string
  lab_name: string
  website: string | null
  ordering_type: 'direct' | 'intermediary' | 'at_home' | 'regional'
  uses_network: string | null
  affiliate_link: string | null
  notes: string | null
}

export type Pricing = {
  id: string
  test_id: string
  lab_id: string
  price: number
  requires_rx: boolean
  last_updated: string
}

export type TestICD10 = {
  test_id: string
  icd10_code_id: string
}

export type SavedProvider = {
  id: string
  user_id: string
  nickname: string
  provider_name: string
  practice_name: string | null
  fax_number: string | null
  npi: string | null
  created_at: string
}
