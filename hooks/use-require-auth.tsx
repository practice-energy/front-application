"use client"

import { useEffect } from "react"
import { useAuth } from "./use-auth"

export function useRequireAuth() {
  const { isAuthenticated, requireAuth } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      requireAuth()
    }
  }, [isAuthenticated, requireAuth])

  return isAuthenticated
}
