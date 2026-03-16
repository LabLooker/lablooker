'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type UserRow = {
  id: string
  email: string
  created_at: string
  is_premium: boolean
  is_admin: boolean
}

type Stats = {
  totalUsers: number
  premiumUsers: number
  newSignups7d: number
}

export default function AdminPage() {
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<UserRow[]>([])
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, premiumUsers: 0, newSignups7d: 0 })
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  useEffect(() => {
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) {
        setAccessDenied(true)
        setLoading(false)
        return
      }

      setLoading(false)
      loadStats()
      loadUsers('')
    }
    checkAccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadStats() {
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: premiumUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_premium', true)

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const { count: newSignups7d } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())

    setStats({
      totalUsers: totalUsers ?? 0,
      premiumUsers: premiumUsers ?? 0,
      newSignups7d: newSignups7d ?? 0,
    })
  }

  async function loadUsers(query: string) {
    let q = supabase
      .from('profiles')
      .select('id, email, created_at, is_premium, is_admin')
      .order('created_at', { ascending: false })
      .limit(50)

    if (query.trim()) {
      q = q.ilike('email', `%${query.trim()}%`)
    }

    const { data } = await q

    setUsers(
      (data ?? []).map((p: any) => ({
        id: p.id,
        email: p.email ?? '—',
        created_at: p.created_at,
        is_premium: p.is_premium ?? false,
        is_admin: p.is_admin ?? false,
      })),
    )
  }

  async function handlePremiumAction(userId: string, action: 'grant' | 'revoke') {
    setActionLoading(userId)
    try {
      const res = await fetch('/api/admin/grant-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast(`Premium ${action === 'grant' ? 'granted' : 'revoked'} successfully`, 'success')
      loadUsers(search)
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  async function handleGrantAdmin(userId: string) {
    setActionLoading(userId)
    try {
      const res = await fetch('/api/admin/grant-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'grant-admin' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showToast('Admin granted successfully', 'success')
      loadUsers(search)
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    loadUsers(search)
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[#577572]">Loading…</p>
      </div>
    )
  }

  if (accessDenied) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1a2e2b]">Access denied</h1>
          <p className="mt-2 text-[#577572]">You do not have admin privileges.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1a2e2b]">Admin Dashboard</h1>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 rounded-lg border px-4 py-3 text-sm shadow-lg transition-all ${
            toast.type === 'success'
              ? 'border-[#2d6a5e]/30 bg-[#f0f7f6] text-[#2d6a5e]'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Stats strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#e0ebe9] bg-white px-5 py-4">
          <p className="text-sm text-[#577572]">Total users</p>
          <p className="mt-1 text-2xl font-bold text-[#1a2e2b]">{stats.totalUsers}</p>
        </div>
        <div className="rounded-xl border border-[#e0ebe9] bg-white px-5 py-4">
          <p className="text-sm text-[#577572]">Premium users</p>
          <p className="mt-1 text-2xl font-bold text-[#2d6a5e]">{stats.premiumUsers}</p>
        </div>
        <div className="rounded-xl border border-[#e0ebe9] bg-white px-5 py-4">
          <p className="text-sm text-[#577572]">New signups (7d)</p>
          <p className="mt-1 text-2xl font-bold text-[#1a2e2b]">{stats.newSignups7d}</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          placeholder="Search by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-[#e0ebe9] bg-white px-4 py-2.5 text-sm text-[#1a2e2b] placeholder-[#577572]/60 focus:border-[#2d6a5e] focus:outline-none focus:ring-1 focus:ring-[#2d6a5e]"
        />
        <button
          type="submit"
          className="rounded-xl bg-[#2d6a5e] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#245549]"
        >
          Search
        </button>
      </form>

      {/* Users table */}
      <div className="overflow-x-auto rounded-xl border border-[#e0ebe9] bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#e0ebe9] text-[#577572]">
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Premium</th>
              <th className="px-4 py-3 font-medium">Admin</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#577572]">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-[#e0ebe9] last:border-0 transition-colors hover:bg-[#f0f7f6]"
                >
                  <td className="px-4 py-3 text-[#1a2e2b]">{u.email}</td>
                  <td className="px-4 py-3 text-[#577572]">
                    {new Date(u.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {u.is_premium ? (
                      <span className="inline-block rounded-full bg-[#2d6a5e]/10 px-2.5 py-0.5 text-xs font-medium text-[#2d6a5e]">
                        Premium
                      </span>
                    ) : (
                      <span className="text-[#577572]">Free</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.is_admin ? (
                      <span className="inline-block rounded-full bg-[#b85c5c]/10 px-2.5 py-0.5 text-xs font-medium text-[#b85c5c]">
                        Admin
                      </span>
                    ) : (
                      <span className="text-[#577572]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {u.is_premium ? (
                        <button
                          onClick={() => handlePremiumAction(u.id, 'revoke')}
                          disabled={actionLoading === u.id}
                          className="rounded-lg border border-[#b85c5c]/30 px-3 py-1 text-xs font-medium text-[#b85c5c] transition-colors hover:bg-[#b85c5c]/10 disabled:opacity-50"
                        >
                          {actionLoading === u.id ? '…' : 'Revoke Premium'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePremiumAction(u.id, 'grant')}
                          disabled={actionLoading === u.id}
                          className="rounded-lg border border-[#2d6a5e]/30 px-3 py-1 text-xs font-medium text-[#2d6a5e] transition-colors hover:bg-[#2d6a5e]/10 disabled:opacity-50"
                        >
                          {actionLoading === u.id ? '…' : 'Grant Premium'}
                        </button>
                      )}
                      {!u.is_admin && (
                        <button
                          onClick={() => handleGrantAdmin(u.id)}
                          disabled={actionLoading === u.id}
                          className="rounded-lg border border-[#e0ebe9] px-3 py-1 text-xs font-medium text-[#577572] transition-colors hover:bg-[#f0f7f6] disabled:opacity-50"
                        >
                          {actionLoading === u.id ? '…' : 'Grant Admin'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
