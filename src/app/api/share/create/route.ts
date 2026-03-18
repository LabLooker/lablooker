export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', user.id)
      .single()

    if (!profile?.is_premium) {
      return NextResponse.json({ error: 'Premium required' }, { status: 403 })
    }

    const body = await request.json()
    const { title, note, testIds } = body as { title?: string; note?: string; testIds: string[] }

    if (!testIds || !Array.isArray(testIds) || testIds.length === 0) {
      return NextResponse.json({ error: 'At least one test is required' }, { status: 400 })
    }

    // Generate a 16-char alphanumeric token
    const token = crypto.randomUUID().replace(/-/g, '').slice(0, 16)

    const { error } = await supabase
      .from('lab_shares')
      .insert({
        user_id: user.id,
        share_token: token,
        test_ids: testIds,
        title: title || null,
        note: note || null,
        is_active: true,
      })

    if (error) {
      console.error('[share/create] Insert error:', error)
      return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 })
    }

    return NextResponse.json({
      token,
      url: `https://lablooker.com/shared/${token}`,
    })
  } catch (error: unknown) {
    console.error('[share/create] Error:', error)
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 })
  }
}
