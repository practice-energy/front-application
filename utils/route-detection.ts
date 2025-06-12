"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export interface RouteAvailability {
  [key: string]: boolean
}

/**
 * Hook to detect which routes are available in the app
 */
export function useRouteAvailability(): RouteAvailability {
  const [availability, setAvailability] = useState<RouteAvailability>({})

  useEffect(() => {
    const checkRouteAvailability = async () => {
      const routesToCheck = ["/profile", "/schedule", "/saved"]
      const results: RouteAvailability = {}

      for (const route of routesToCheck) {
        try {
          // Check if route exists by attempting to fetch it
          const response = await fetch(route, { method: "HEAD" })
          results[route] = response.status !== 404
        } catch {
          // If fetch fails, assume route doesn't exist
          results[route] = false
        }
      }

      setAvailability(results)
    }

    checkRouteAvailability()
  }, [])

  return availability
}

/**
 * Hook to determine active route state for both legacy and new formats
 */
export function useActiveRoute() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActiveRoute = (primaryRoute: string, legacyRoute?: string): boolean => {
    // Check primary route
    if (pathname === primaryRoute) {
      return true
    }

    // Check legacy route format
    if (legacyRoute && legacyRoute.includes("?")) {
      const [basePath, queryString] = legacyRoute.split("?")
      if (pathname === basePath) {
        const params = new URLSearchParams(queryString)
        for (const [key, value] of params.entries()) {
          if (searchParams.get(key) === value) {
            return true
          }
        }
      }
    }

    return false
  }

  return { isActiveRoute, pathname, searchParams }
}

/**
 * Get the appropriate route based on availability and legacy support
 */
export function getRouteHref(
  primaryRoute: string,
  legacyRoute: string | undefined,
  isAvailable: boolean,
  useLegacyRoutes: boolean,
): string {
  if (useLegacyRoutes && legacyRoute) {
    return legacyRoute
  }

  if (!isAvailable && legacyRoute) {
    return legacyRoute
  }

  return primaryRoute
}
