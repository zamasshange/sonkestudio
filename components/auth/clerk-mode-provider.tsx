"use client"

import { createContext, useContext, type ReactNode } from 'react'

const ClerkModeContext = createContext({ disabled: false })

export function ClerkModeProvider({
  disabled,
  children,
}: {
  disabled: boolean
  children: ReactNode
}) {
  return <ClerkModeContext.Provider value={{ disabled }}>{children}</ClerkModeContext.Provider>
}

export function useClerkMode() {
  return useContext(ClerkModeContext)
}
