"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { initI18n } from "../lib/i18n"

interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        await initI18n()
        setIsInitialized(true)
      } catch (error) {
        console.error("Failed to initialize i18n:", error)
        setIsInitialized(true) // Render anyway to prevent blocking
      }
    }

    init()
  }, [])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
