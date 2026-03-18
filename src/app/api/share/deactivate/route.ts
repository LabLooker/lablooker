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

    const body = await request.json()
    const { shareId } = body as { shareId: string }

    if (!shareId) {
      return NextResponse.json({ error: 'Share ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('lab_shares')
      .update({ is_active: false })
      .eq('id', shareId)
      .eq('user_id', user.id)

    if (error) {
      console.error('[share/deactivate] Error:', error)
      return NextResponse.json({ error: 'Failed to deactivate share link' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('[share/deactivate] Error:', error)
    return NextResponse.json({ error: 'Failed to deactivate share link' }, { status: 500 })
  }
}
