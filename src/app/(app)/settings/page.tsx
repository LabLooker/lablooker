'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import SavedProviders from '@/components/settings/SavedProviders'

type Profile = {
  full_name: string | null
  email: string | null
  plan: string
  plan_status: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, email, plan, plan_status')
          .eq('id', user.id)
          .single()
        if (data) {
          setProfile(data)
          setFullName(data.full_name || '')
        }
      }
    }
    loadProfile()
  }, [supabase])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq('id', user.id)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  async function handleManageBilling() {
    const res = await fetch('/api/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
  }

  async function handleUpgrade() {
    router.push('/pricing')
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const planLabel =
    profile?.plan === 'business'
      ? 'Business'
      : profile?.plan === 'pro'
        ? 'Pro'
        : 'Free'

  return (
    <div className="max-w-2xl">
      <h1 className="mb-8 text-2xl font-bold text-[#1a2e2b]">Settings</h1>

      {/* Profile Section */}
      <Card className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-[#1a2e2b]">Profile</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-[#4a6b67]">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-[#e0ebe9] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#1a2e2b] placeholder-[#a3bfbb] focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4a6b67]">
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="mt-1 block w-full rounded-md border border-[#e0ebe9] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#577572] cursor-not-allowed"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
            {saved && (
              <span className="text-sm text-emerald-600">Saved!</span>
            )}
          </div>
        </form>
      </Card>

      {/* Saved Providers */}
      <SavedProviders />

      {/* Billing Section */}
      <Card className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-[#1a2e2b]">Billing</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-[#e0ebe9] bg-[#faf8f5] px-4 py-3">
            <div>
              <p className="text-sm font-medium text-[#1a2e2b]">Current Plan</p>
              <p className="text-xs text-[#577572]">
                {planLabel} plan
                {profile?.plan_status === 'canceled' && ' (cancels at period end)'}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                profile?.plan === 'pro' || profile?.plan === 'business'
                  ? 'bg-[#2d6a5e]/10 text-[#2d6a5e]'
                  : 'bg-[#faf8f5] text-[#577572]'
              }`}
            >
              {planLabel}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {profile?.plan === 'free' ? (
              <Button size="sm" onClick={handleUpgrade}>
                Upgrade Plan
              </Button>
            ) : (
              <>
                <Button size="sm" variant="secondary" onClick={handleManageBilling}>
                  Manage Billing
                </Button>
                <Button size="sm" variant="secondary" onClick={handleUpgrade}>
                  Change Plan
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-[#1a2e2b]">Account</h2>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </Card>
    </div>
  )
}
