'use client'

import { useCallback, useEffect, useState } from 'react'

export interface SavedItem {
  id: string
  toolId: string
  toolName: string
  toolHref: string
  content: string
  createdAt: string
  type: 'generation' | 'favorite' | 'draft'
}

const HISTORY_KEY = 'sonke-history'
const FAVORITES_KEY = 'sonke-favorites'
const MAX_HISTORY = 50

export function useSavedHistory() {
  const [history, setHistory] = useState<SavedItem[]>([])
  const [favorites, setFavorites] = useState<SavedItem[]>([])
  const [recentTools, setRecentTools] = useState<string[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const h = localStorage.getItem(HISTORY_KEY)
    const f = localStorage.getItem(FAVORITES_KEY)
    if (h) setHistory(JSON.parse(h))
    if (f) setFavorites(JSON.parse(f))

    // Extract recent tool IDs
    const all = h ? JSON.parse(h) as SavedItem[] : []
    const toolIds = Array.from(new Set(all.map((i) => i.toolId))).slice(0, 10)
    setRecentTools(toolIds)
  }, [])

  const addToHistory = useCallback((item: Omit<SavedItem, 'id' | 'createdAt'>) => {
    if (typeof window === 'undefined') return

    const newItem: SavedItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
    }

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))

      // Update recent tools
      const toolIds = Array.from(new Set(updated.map((i) => i.toolId))).slice(0, 10)
      setRecentTools(toolIds)

      return updated
    })
  }, [])

  const toggleFavorite = useCallback((item: SavedItem) => {
    if (typeof window === 'undefined') return

    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === item.id)
      let updated: SavedItem[]
      if (exists) {
        updated = prev.filter((f) => f.id !== item.id)
      } else {
        updated = [item, ...prev]
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(HISTORY_KEY)
    setHistory([])
    setRecentTools([])
  }, [])

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites],
  )

  return {
    history,
    favorites,
    recentTools,
    addToHistory,
    toggleFavorite,
    clearHistory,
    isFavorite,
  }
}
