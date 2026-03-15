import Stripe from 'stripe'

// Lazy singleton — only instantiated when first called, not at module load time
// This prevents build-time errors when STRIPE_SECRET_KEY is not set
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      const envKeys = Object.keys(process.env).filter(k => k.includes('STRIPE')).join(', ')
      throw new Error(`STRIPE_SECRET_KEY is not set. Available STRIPE env vars: ${envKeys || 'none'}`)
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return _stripe
}

// Legacy named export for compatibility
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
