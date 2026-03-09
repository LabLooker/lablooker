'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { SavedProvider } from '@/types/database'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

type ProviderForm = {
  nickname: string
  provider_name: string
  practice_name: string
  fax_number: string
  npi: string
}

const emptyForm: ProviderForm = {
  nickname: '',
  provider_name: '',
  practice_name: '',
  fax_number: '',
  npi: '',
}

const FREE_PROVIDER_LIMIT = 3

export default function SavedProviders() {
  const [providers, setProviders] = useState<SavedProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProviderForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [plan, setPlan] = useState<string>('free')

  const supabase = createClient()

  const loadProviders = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Load plan
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()
    if (profile) setPlan(profile.plan || 'free')

    const { data } = await supabase
      .from('saved_providers')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (data) setProviders(data)
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadProviders() }, [loadProviders])

  const isPremium = plan === 'pro' || plan === 'business'
  const atLimit = !isPremium && providers.length >= FREE_PROVIDER_LIMIT

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nickname.trim() || !form.provider_name.trim()) return
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    const payload = {
      user_id: user.id,
      nickname: form.nickname.trim(),
      provider_name: form.provider_name.trim(),
      practice_name: form.practice_name.trim() || null,
      fax_number: form.fax_number.trim() || null,
      npi: form.npi.trim() || null,
    }

    if (editingId) {
      await supabase.from('saved_providers').update(payload).eq('id', editingId)
    } else {
      await supabase.from('saved_providers').insert(payload)
    }

    setForm(emptyForm)
    setShowForm(false)
    setEditingId(null)
    setSaving(false)
    await loadProviders()
  }

  const handleEdit = (p: SavedProvider) => {
    setForm({
      nickname: p.nickname,
      provider_name: p.provider_name,
      practice_name: p.practice_name || '',
      fax_number: p.fax_number || '',
      npi: p.npi || '',
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('saved_providers').delete().eq('id', id)
    await loadProviders()
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setShowForm(false)
    setEditingId(null)
  }

  const inputClass = "mt-1 block w-full rounded-md border border-[#e0ebe9] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#1a2e2b] placeholder-[#a3bfbb] focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"

  if (loading) return null

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#1a2e2b]">Saved Providers</h2>
        {!showForm && (
          atLimit ? (
            <p className="text-xs text-[#c0826a]">Upgrade to Premium to save unlimited providers</p>
          ) : (
            <Button size="sm" onClick={() => setShowForm(true)}>Add Provider</Button>
          )
        )}
      </div>

      {providers.length === 0 && !showForm && (
        <p className="text-sm text-[#577572]">No saved providers yet. Add one to quickly fill in your doctor request templates.</p>
      )}

      {/* Provider cards */}
      <div className="space-y-3 mb-4">
        {providers.map(p => (
          <div
            key={p.id}
            className="flex items-start justify-between rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-4 py-3"
          >
            <div>
              <p className="font-semibold text-sm text-[#1a2e2b]">{p.nickname}</p>
              <p className="text-sm text-[#4a6b67]">{p.provider_name}</p>
              {p.practice_name && <p className="text-xs text-[#577572]">{p.practice_name}</p>}
              {p.fax_number && <p className="text-xs text-[#577572]">Fax: {p.fax_number}</p>}
              {p.npi && <p className="text-xs text-[#577572]">NPI: {p.npi}</p>}
            </div>
            <div className="flex gap-2 shrink-0 ml-4">
              <button onClick={() => handleEdit(p)} className="text-xs text-[#2d6a5e] hover:text-[#245a50] font-medium">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 hover:text-red-600 font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Inline form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-[#e0ebe9] bg-[#faf8f5] p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#4a6b67]">Nickname *</label>
              <input
                type="text"
                value={form.nickname}
                onChange={e => setForm({ ...form, nickname: e.target.value })}
                placeholder='e.g. "Wempe (PCP)"'
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4a6b67]">Provider Name *</label>
              <input
                type="text"
                value={form.provider_name}
                onChange={e => setForm({ ...form, provider_name: e.target.value })}
                placeholder="Dr. Jane Smith"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4a6b67]">Practice Name</label>
              <input
                type="text"
                value={form.practice_name}
                onChange={e => setForm({ ...form, practice_name: e.target.value })}
                placeholder="Austin Family Medicine"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4a6b67]">Fax Number</label>
              <input
                type="text"
                value={form.fax_number}
                onChange={e => setForm({ ...form, fax_number: e.target.value })}
                placeholder="(512) 555-0100"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4a6b67]">NPI</label>
              <input
                type="text"
                value={form.npi}
                onChange={e => setForm({ ...form, npi: e.target.value })}
                placeholder="1234567890"
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Provider' : 'Save Provider'}
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={handleCancel}>Cancel</Button>
          </div>
        </form>
      )}
    </Card>
  )
}
