export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
    console.log(`[stripe-webhook] Received event: ${event.type} (id: ${event.id})`)
  } catch (err: any) {
    console.error('[stripe-webhook] Signature verification failed:', {
      error: err?.message,
      sigPresent: !!sig,
      bodyLength: body.length,
      secretPresent: !!process.env.STRIPE_WEBHOOK_SECRET,
    })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (!relevantEvents.has(event.type)) {
    console.log(`[stripe-webhook] Skipping irrelevant event: ${event.type}`)
    return NextResponse.json({ received: true })
  }

  try {
    const stripe = getStripe()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const subscriptionId = session.subscription as string
        console.log(`[stripe-webhook] checkout.session.completed — session: ${session.id}, subscription: ${subscriptionId}, customer: ${session.customer}`)

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const supabaseUid = subscription.metadata.supabase_uid
        console.log(`[stripe-webhook] supabase_uid from metadata: ${supabaseUid || 'MISSING'}`)

        if (supabaseUid) {
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({
              stripe_customer_id: session.customer as string,
              is_premium: true,
              plan: 'pro',
              plan_status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('id', supabaseUid)

          if (error) {
            console.error(`[stripe-webhook] Failed to update profile for ${supabaseUid}:`, error)
          } else {
            console.log(`[stripe-webhook] Activated premium for user ${supabaseUid}`)
          }
        } else {
          console.warn(`[stripe-webhook] No supabase_uid in subscription metadata for subscription ${subscriptionId}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const supabaseUid = subscription.metadata.supabase_uid
        const isCanceled = subscription.cancel_at_period_end
        console.log(`[stripe-webhook] subscription.updated — sub: ${subscription.id}, uid: ${supabaseUid || 'MISSING'}, cancel_at_period_end: ${isCanceled}`)

        if (supabaseUid) {
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({
              is_premium: !isCanceled,
              plan_status: isCanceled ? 'canceled' : 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('id', supabaseUid)

          if (error) {
            console.error(`[stripe-webhook] Failed to update subscription status for ${supabaseUid}:`, error)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const supabaseUid = subscription.metadata.supabase_uid
        console.log(`[stripe-webhook] subscription.deleted — sub: ${subscription.id}, uid: ${supabaseUid || 'MISSING'}`)

        if (supabaseUid) {
          const { error } = await supabaseAdmin
            .from('profiles')
            .update({
              is_premium: false,
              plan: 'free',
              plan_status: 'active',
              updated_at: new Date().toISOString(),
            })
            .eq('id', supabaseUid)

          if (error) {
            console.error(`[stripe-webhook] Failed to deactivate premium for ${supabaseUid}:`, error)
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error(`[stripe-webhook] Handler error for event ${event.type}:`, {
      message: error?.message,
      stack: error?.stack,
    })
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    )
  }
}
