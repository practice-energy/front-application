"use client"

import { render, fireEvent, waitFor } from "@testing-library/react"
import { SidebarToggleV2 } from "@/components/sidebar-toggle-v2"

describe("SidebarToggleV2", () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it("should handle rapid clicks without breaking", async () => {
    const onToggle = jest.fn()
    const { getByRole } = render(<SidebarToggleV2 onToggle={onToggle} />)

    const button = getByRole("button")

    // Simulate 1000 rapid clicks
    for (let i = 0; i < 1000; i++) {
      fireEvent.click(button)
    }

    // Should debounce and only register reasonable number of toggles
    await waitFor(() => {
      expect(onToggle).toHaveBeenCalledTimes(expect.any(Number))
      expect(onToggle).not.toHaveBeenCalledTimes(1000)
    })
  })

  it("should respond to keyboard events", () => {
    const onToggle = jest.fn()
    const { getByRole } = render(<SidebarToggleV2 onToggle={onToggle} />)

    const button = getByRole("button")

    fireEvent.keyDown(button, { key: "Enter" })
    expect(onToggle).toHaveBeenCalledWith(false) // toggled from initial true

    fireEvent.keyDown(button, { key: " " })
    expect(onToggle).toHaveBeenCalledWith(true) // toggled back
  })

  it("should persist state in localStorage", () => {
    const { getByRole } = render(<SidebarToggleV2 />)
    const button = getByRole("button")

    fireEvent.click(button)

    expect(localStorage.getItem("sidebarCollapsed")).toBe("false")
  })

  it("should have proper ARIA attributes", () => {
    const { getByRole } = render(<SidebarToggleV2 />)
    const button = getByRole("button")

    expect(button).toHaveAttribute("aria-expanded")
    expect(button).toHaveAttribute("aria-controls", "main-sidebar")
    expect(button).toHaveAttribute("aria-label", "Toggle sidebar")
  })
})
