'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsPremium(false)
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single()

      setIsPremium(data?.is_premium ?? false)
      setLoading(false)
    }

    check()
  }, [])

  return { isPremium, loading }
}
