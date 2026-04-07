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
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Email change state
  const [editingEmail, setEditingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emailSaving, setEmailSaving] = useState(false)
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Password reset state
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordSending, setPasswordSending] = useState(false)

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

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmail || newEmail === profile?.email) return
    setEmailSaving(true)
    setEmailMsg(null)
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (error) {
      setEmailMsg({ type: 'error', text: error.message })
    } else {
      setEmailMsg({ type: 'success', text: 'Confirmation sent to both emails. Check your inbox to verify the change.' })
      setEditingEmail(false)
      setNewEmail('')
    }
    setEmailSaving(false)
  }

  async function handlePasswordReset() {
    if (!profile?.email) return
    setPasswordSending(true)
    setPasswordMsg(null)
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${window.location.origin}/settings`,
    })
    if (error) {
      setPasswordMsg({ type: 'error', text: error.message })
    } else {
      setPasswordMsg({ type: 'success', text: `Password reset email sent to ${profile.email}. Check your inbox.` })
    }
    setPasswordSending(false)
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

  async function handleDeleteAllData() {
    const confirmation = prompt('This will permanently delete all your data. Type "DELETE" to confirm:')
    if (confirmation !== 'DELETE') return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Delete all user data
    await supabase.from('lab_results').delete().eq('user_id', user.id)
    await supabase.from('lab_goals').delete().eq('user_id', user.id)
    await supabase.from('lab_reports').delete().eq('user_id', user.id)
    await supabase.from('lab_shares').delete().eq('user_id', user.id)

    alert('All your data has been deleted.')
    router.push('/dashboard')
  }

  async function handleDeleteAccount() {
    const confirmation = prompt('This will permanently delete your account and all data. Type "DELETE MY ACCOUNT" to confirm:')
    if (confirmation !== 'DELETE MY ACCOUNT') return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Delete all user data
    await supabase.from('lab_results').delete().eq('user_id', user.id)
    await supabase.from('lab_goals').delete().eq('user_id', user.id)
    await supabase.from('lab_reports').delete().eq('user_id', user.id)
    await supabase.from('lab_shares').delete().eq('user_id', user.id)
    await supabase.from('profiles').delete().eq('id', user.id)

    // Sign out
    await supabase.auth.signOut()

    alert('Your account has been deleted.')
    router.push('/')
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
            <label htmlFor="dob" className="block text-sm font-medium text-[#4a6b67]">
              Date of birth <span className="font-normal text-[#577572]">(used to prepopulate lab request letters)</span>
            </label>
            <input
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="mt-1 block w-full rounded-md border border-[#e0ebe9] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#1a2e2b] focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#4a6b67] mb-1">Email</label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="block w-full rounded-md border border-[#e0ebe9] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#577572] cursor-not-allowed"
            />
            {!editingEmail && (
              <button
                type="button"
                onClick={() => { setEditingEmail(true); setNewEmail(profile?.email || '') }}
                className="mt-1.5 text-xs text-[#2d6a5e] hover:underline"
              >
                Change email address →
              </button>
            )}
            {editingEmail && (
              <form onSubmit={handleEmailChange} className="mt-3 space-y-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="Enter new email address"
                  className="block w-full rounded-md border border-[#2d6a5e] bg-white px-4 py-2.5 text-sm text-[#1a2e2b] placeholder-[#577572] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
                />
                <p className="text-xs text-[#577572]">
                  ⚠️ A confirmation link will be sent to both your current and new email. You must verify the new address before the change takes effect.
                </p>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={emailSaving || !newEmail || newEmail === profile?.email}
                    className="rounded-lg bg-[#2d6a5e] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#245549] disabled:opacity-50"
                  >
                    {emailSaving ? 'Sending...' : 'Send confirmation'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditingEmail(false); setEmailMsg(null) }}
                    className="rounded-lg border border-[#e0ebe9] px-3 py-1.5 text-xs font-medium text-[#577572] hover:border-[#2d6a5e]/40"
                  >
                    Cancel
                  </button>
                </div>
                {emailMsg && (
                  <p className={`text-xs ${emailMsg.type === 'success' ? 'text-emerald-600' : 'text-[#b85c5c]'}`}>
                    {emailMsg.text}
                  </p>
                )}
              </form>
            )}
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

      {/* Security Section */}
      <Card className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-[#1a2e2b]">Security</h2>
        <div>
          <p className="text-sm text-[#4a6b67] mb-3">
            To change your password, we'll send a reset link to your email.
          </p>
          <button
            onClick={handlePasswordReset}
            disabled={passwordSending}
            className="rounded-lg border border-[#e0ebe9] bg-white px-4 py-2 text-sm font-medium text-[#1a2e2b] hover:border-[#2d6a5e]/40 hover:bg-[#2d6a5e]/5 disabled:opacity-50 transition-colors"
          >
            {passwordSending ? 'Sending...' : 'Send password reset email'}
          </button>
          {passwordMsg && (
            <p className={`mt-2 text-xs ${passwordMsg.type === 'success' ? 'text-emerald-600' : 'text-[#b85c5c]'}`}>
              {passwordMsg.text}
            </p>
          )}
        </div>
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

      {/* Data Management */}
      <Card className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-[#1a2e2b]">Data Management</h2>
        <div className="space-y-4">
          <div className="rounded-lg border border-[#b85c5c]/30 bg-[#b85c5c]/5 p-4">
            <h3 className="text-sm font-semibold text-[#b85c5c] mb-2">Delete All My Data</h3>
            <p className="text-xs text-[#577572] mb-3">
              This will permanently delete all your lab results, goals, reports, and shares. Your account will remain active.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteAllData}
              className="text-[#b85c5c] hover:bg-[#b85c5c]/10"
            >
              Delete All My Data
            </Button>
          </div>

          <div className="rounded-lg border border-red-300 bg-red-50 p-4">
            <h3 className="text-sm font-semibold text-red-800 mb-2">Delete My Account</h3>
            <p className="text-xs text-red-700 mb-3">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteAccount}
              className="text-red-800 hover:bg-red-100"
            >
              Delete My Account
            </Button>
          </div>
        </div>
      </Card>

      {/* Account */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-[#1a2e2b]">Account</h2>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </Card>
    </div>
  )
}
