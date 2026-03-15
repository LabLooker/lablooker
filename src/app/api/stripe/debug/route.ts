export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET() {
  const stripeKeys = Object.keys(process.env).filter(k => k.toUpperCase().includes('STRIPE'))
  return NextResponse.json({
    hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
    secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'MISSING',
    stripeEnvKeys: stripeKeys,
    nodeEnv: process.env.NODE_ENV,
    allEnvCount: Object.keys(process.env).length,
  })
}
