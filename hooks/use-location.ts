'use client'

import { useEffect, useState } from 'react'
import type { GeoLocationData, SeasonalContext } from '@/lib/geolocation'

interface LocationState {
  location: GeoLocationData | null
  season: SeasonalContext | null
  loading: boolean
  error: string | null
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    season: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false

    async function fetchLocation() {
      try {
        // Check cache first
        const cached = sessionStorage.getItem('sonke-location')
        if (cached) {
          const parsed = JSON.parse(cached)
          if (!cancelled) {
            setState({
              location: parsed.location,
              season: parsed.season,
              loading: false,
              error: null,
            })
          }
          return
        }

        const res = await fetch('/api/location')
        if (!res.ok) throw new Error('Location fetch failed')

        const data = await res.json()

        if (!cancelled) {
          const payload = {
            location: data.location,
            season: data.season,
          }
          sessionStorage.setItem('sonke-location', JSON.stringify(payload))
          setState({
            location: data.location,
            season: data.season,
            loading: false,
            error: null,
          })
        }
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: (err as Error).message }))
        }
      }
    }

    fetchLocation()
    return () => { cancelled = true }
  }, [])

  return state
}
