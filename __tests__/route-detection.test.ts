import { renderHook } from "@testing-library/react"
import { useActiveRoute, getRouteHref } from "@/utils/route-detection"

// Mock Next.js hooks
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}))

describe("Route Detection", () => {
  describe("useActiveRoute", () => {
    it("should detect active primary route", () => {
      const mockUsePathname = require("next/navigation").usePathname
      const mockUseSearchParams = require("next/navigation").useSearchParams

      mockUsePathname.mockReturnValue("/schedule")
      mockUseSearchParams.mockReturnValue(new URLSearchParams())

      const { result } = renderHook(() => useActiveRoute())

      expect(result.current.isActiveRoute("/schedule")).toBe(true)
      expect(result.current.isActiveRoute("/profile")).toBe(false)
    })

    it("should detect active legacy route", () => {
      const mockUsePathname = require("next/navigation").usePathname
      const mockUseSearchParams = require("next/navigation").useSearchParams

      mockUsePathname.mockReturnValue("/profile")
      mockUseSearchParams.mockReturnValue(new URLSearchParams("section=calendar"))

      const { result } = renderHook(() => useActiveRoute())

      expect(result.current.isActiveRoute("/schedule", "/profile?section=calendar")).toBe(true)
    })
  })

  describe("getRouteHref", () => {
    it("should return primary route when available and not using legacy", () => {
      const href = getRouteHref("/schedule", "/profile?section=calendar", true, false)
      expect(href).toBe("/schedule")
    })

    it("should return legacy route when using legacy routes", () => {
      const href = getRouteHref("/schedule", "/profile?section=calendar", true, true)
      expect(href).toBe("/profile?section=calendar")
    })

    it("should fallback to legacy route when primary not available", () => {
      const href = getRouteHref("/schedule", "/profile?section=calendar", false, false)
      expect(href).toBe("/profile?section=calendar")
    })
  })
})
