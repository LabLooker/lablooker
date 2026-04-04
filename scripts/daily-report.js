#!/usr/bin/env node
// LabLooker Daily Signup Report — run from /home/mightyyeti/lablooker
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Load .env.local manually (no dotenv dependency needed)
try {
  const env = fs.readFileSync('.env.local', 'utf8')
  for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && v.length) process.env[k.trim()] = v.join('=').trim()
  }
} catch {}

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const COMPED = ['banoo32@gmail.com', 'padfieldc@gmail.com']

async function main() {
  const { data, error } = await sb.from('profiles').select('email,is_premium,created_at')
  if (error) { console.error('ERROR:', error.message); process.exit(1) }

  const organic = data.filter(u => !COMPED.includes(u.email))
  const today = new Date().toISOString().split('T')[0]
  const newToday = organic.filter(u => u.created_at && u.created_at.startsWith(today))
  const paying = organic.filter(u => u.is_premium)

  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'America/Chicago'
  })

  console.log(`📊 LabLooker Daily Signup Report`)
  console.log(`${now}`)
  console.log(``)
  console.log(`👥 Organic users: ${organic.length}`)
  console.log(`💳 Paying subscribers: ${paying.length}`)
  console.log(`🆕 New today: ${newToday.length}`)
}

main()
