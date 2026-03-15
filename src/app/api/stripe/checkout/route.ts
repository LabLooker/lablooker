export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 })
    }

    let stripe: ReturnType<typeof getStripe>
    try {
      stripe = getStripe()
    } catch {
      // If env var missing, try creating Stripe directly with the test key
      const Stripe = (await import('stripe')).default
      const fallbackKey = process.env.STRIPE_SECRET_KEY
      if (!fallbackKey) {
        return NextResponse.json(
          { error: `STRIPE_SECRET_KEY not found. Env keys with STRIPE: ${Object.keys(process.env).filter(k => k.includes('STRIPE')).join(', ') || 'none'}` },
          { status: 500 }
        )
      }
      stripe = new Stripe(fallbackKey)
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_uid: user.id },
      })
      customerId = customer.id

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID || 'price_1TAvGEA5UDbT7PJWkiqgvTMl'
    const isMonthly = priceId === monthlyPriceId

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${origin}/dashboard?upgraded=true`,
      cancel_url: `${origin}/pricing`,
      subscription_data: {
        metadata: { supabase_uid: user.id },
      },
      ...(isMonthly && {
        custom_text: {
          submit: {
            message: '💡 Save 39% with annual billing ($59/year) — go back to switch plans before subscribing.',
          },
        },
      }),
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to create checkout session' },
      { status: 500 },
    )
  }
}
