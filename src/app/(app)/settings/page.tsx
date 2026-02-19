
'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

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
      <h1 className="mb-8 text-2xl font-bold text-white">Settings</h1>

      {/* Profile Section */}
      <Card className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Profile</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300">
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="mt-1 block w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-zinc-500 cursor-not-allowed"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
            {saved && (
              <span className="text-sm text-emerald-400">Saved!</span>
            )}
          </div>
        </form>
      </Card>

      {/* Billing Section */}
      <Card className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Billing</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-white">Current Plan</p>
              <p className="text-xs text-zinc-500">
                {planLabel} plan
                {profile?.plan_status === 'canceled' && ' (cancels at period end)'}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                profile?.plan === 'pro' || profile?.plan === 'business'
                  ? 'bg-primary-500/10 text-primary-400'
                  : 'bg-zinc-800 text-zinc-400'
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
        <h2 className="mb-4 text-lg font-semibold text-white">Account</h2>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </Card>
    </div>
  )
}
