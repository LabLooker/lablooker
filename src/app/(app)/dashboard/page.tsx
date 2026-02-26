'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Card from '@/components/ui/Card'

type Profile = {
  full_name: string | null
  plan: string
  plan_status: string
}

const stats = [
  { label: 'Total Records', value: '1,284', change: '+12%' },
  { label: 'Active Users', value: '23', change: '+3%' },
  { label: 'API Calls', value: '8.4k', change: '+18%' },
  { label: 'Uptime', value: '99.9%', change: '' },
]

const quickActions = [
  {
    title: 'Create New Record',
    description: 'Add a new entry to your database',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
  {
    title: 'View Analytics',
    description: 'Check your usage and performance',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    title: 'Invite Team',
    description: 'Add team members to your workspace',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
      </svg>
    ),
  },
]

const activity = [
  { action: 'Created new record', detail: 'Project Alpha', time: '2 minutes ago' },
  { action: 'Updated settings', detail: 'Notification preferences', time: '1 hour ago' },
  { action: 'Invited team member', detail: 'sarah@example.com', time: '3 hours ago' },
  { action: 'Exported data', detail: 'Q4 Report', time: 'Yesterday' },
  { action: 'Connected integration', detail: 'Slack webhook', time: '2 days ago' },
]

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, plan, plan_status')
          .eq('id', user.id)
          .single()
        if (data) setProfile(data)
      }
    }
    loadProfile()
  }, [supabase])

  const planBadgeColor =
    profile?.plan === 'business'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : profile?.plan === 'pro'
        ? 'bg-[#2d6a5e]/10 text-[#2d6a5e] border-[#2d6a5e]/20'
        : 'bg-[#faf8f5] text-[#6b8c88] border-[#e0ebe9]'

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a2e2b]">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <p className="text-sm text-[#6b8c88]">Here&apos;s what&apos;s happening today</p>
          {profile && (
            <span
              className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${planBadgeColor}`}
            >
              {profile.plan} plan
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-[#6b8c88]">{stat.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-2xl font-bold text-[#1a2e2b]">{stat.value}</p>
              {stat.change && (
                <span className="text-xs font-medium text-emerald-600">
                  {stat.change}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Quick actions */}
        <div className="lg:col-span-1">
          <h2 className="mb-4 text-lg font-semibold text-[#1a2e2b]">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Card key={action.title} hover>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-[#2d6a5e]/10 p-2.5 text-[#2d6a5e]">
                    {action.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1a2e2b]">{action.title}</p>
                    <p className="text-xs text-[#6b8c88]">{action.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-[#1a2e2b]">Recent Activity</h2>
          <Card>
            <div className="divide-y divide-[#e0ebe9]">
              {activity.map((item, i) => (
                <div key={i} className={`flex items-center justify-between ${i > 0 ? 'pt-4' : ''} ${i < activity.length - 1 ? 'pb-4' : ''}`}>
                  <div>
                    <p className="text-sm font-medium text-[#1a2e2b]">{item.action}</p>
                    <p className="text-xs text-[#6b8c88]">{item.detail}</p>
                  </div>
                  <span className="text-xs text-[#6b8c88] whitespace-nowrap ml-4">{item.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
