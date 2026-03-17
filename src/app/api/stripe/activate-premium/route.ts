export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get profile with stripe_customer_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, is_premium')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Already premium — no action needed
    if (profile.is_premium) {
      return NextResponse.json({ activated: false, reason: 'already_premium' })
    }

    if (!profile.stripe_customer_id) {
      return NextResponse.json({ activated: false, reason: 'no_customer_id' })
    }

    // Look up active subscriptions for this customer
    const stripe = getStripe()
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      // Also check for trialing subscriptions
      const trialingSubs = await stripe.subscriptions.list({
        customer: profile.stripe_customer_id,
        status: 'trialing',
        limit: 1,
      })
      if (trialingSubs.data.length === 0) {
        return NextResponse.json({ activated: false, reason: 'no_active_subscription' })
      }
    }

    // Active subscription exists — activate premium via service role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    await supabaseAdmin
      .from('profiles')
      .update({
        is_premium: true,
        plan: 'pro',
        plan_status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    console.log(`[activate-premium] Activated premium for user ${user.id} (customer ${profile.stripe_customer_id})`)

    return NextResponse.json({ activated: true })
  } catch (error: any) {
    console.error('[activate-premium] Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to activate premium' },
      { status: 500 },
    )
  }
}
