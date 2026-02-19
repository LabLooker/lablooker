import { createBrowserClient } from '@supabase/ssr'

// Fallback values allow the template to build without env vars set.
// At runtime, real values from .env.local are required.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key',
  )
}
