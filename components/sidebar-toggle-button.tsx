"use client"

import type React from "react"
import { useReducer, useRef, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Animation constants
export const ANIMATION_DURATION = 300 // ms
export const ANIMATION_TIMING = "cubic-bezier(0.4, 0, 0.2, 1)" // ease-in-out equivalent

// Types
type SidebarState = {
  isCollapsed: boolean
  isAnimating: boolean
  retryCount: number
  lastToggleTime: number
}

type SidebarAction =
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "SET_ANIMATING"; payload: boolean }
  | { type: "SET_STATE"; payload: { isCollapsed: boolean } }
  | { type: "INCREMENT_RETRY" }
  | { type: "RESET_RETRY" }

interface SidebarToggleButtonProps {
  sidebarId: string
  className?: string
}

// Reducer for more reliable state management
function sidebarReducer(state: SidebarState, action: SidebarAction): SidebarState {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        isCollapsed: !state.isCollapsed,
        isAnimating: true,
        lastToggleTime: Date.now(),
      }
    case "SET_ANIMATING":
      return {
        ...state,
        isAnimating: action.payload,
      }
    case "SET_STATE":
      return {
        ...state,
        isCollapsed: action.payload.isCollapsed,
        retryCount: 0,
      }
    case "INCREMENT_RETRY":
      return {
        ...state,
        retryCount: state.retryCount + 1,
      }
    case "RESET_RETRY":
      return {
        ...state,
        retryCount: 0,
      }
    default:
      return state
  }
}

export function SidebarToggleButton({ sidebarId, className }: SidebarToggleButtonProps) {
  // Get initial state from localStorage
  const getInitialState = (): SidebarState => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebarCollapsed")
      return {
        isCollapsed: savedState !== null ? JSON.parse(savedState) : true,
        isAnimating: false,
        retryCount: 0,
        lastToggleTime: 0,
      }
    }
    return {
      isCollapsed: true,
      isAnimating: false,
      retryCount: 0,
      lastToggleTime: 0,
    }
  }

  const [state, dispatch] = useReducer(sidebarReducer, null, getInitialState)
  const [isLoading, setIsLoading] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Sync state with localStorage and listen for external changes
  useEffect(() => {
    const handleSidebarToggle = (event: CustomEvent) => {
      dispatch({
        type: "SET_STATE",
        payload: { isCollapsed: event.detail.isCollapsed },
      })
    }

    const handleAnimationComplete = () => {
      dispatch({ type: "SET_ANIMATING", payload: false })
      setIsLoading(false)
    }

    window.addEventListener("sidebarToggle", handleSidebarToggle as EventListener)
    window.addEventListener("sidebarAnimationComplete", handleAnimationComplete as EventListener)

    // Load initial state from localStorage
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      dispatch({
        type: "SET_STATE",
        payload: { isCollapsed: JSON.parse(savedState) },
      })
    }

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle as EventListener)
      window.removeEventListener("sidebarAnimationComplete", handleAnimationComplete as EventListener)

      // Clean up all timeouts
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current)
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
    }
  }, [])

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(state.isCollapsed))
  }, [state.isCollapsed])

  // Verify DOM state matches React state (redundant verification)
  useEffect(() => {
    const verifySidebarState = () => {
      const sidebarElement = document.querySelector(`#${sidebarId}`)

      // If sidebar doesn't exist, don't try to verify state
      if (!sidebarElement) {
        // Reset retry count since there's nothing to verify
        if (state.retryCount > 0) {
          dispatch({ type: "RESET_RETRY" })
        }
        return
      }

      const domState = sidebarElement.getAttribute("data-state") === "collapsed"
      if (domState !== state.isCollapsed && state.retryCount < 3) {
        console.debug("Sidebar state mismatch detected, retrying...", {
          reactState: state.isCollapsed ? "collapsed" : "expanded",
          domState: domState ? "collapsed" : "expanded",
          retryCount: state.retryCount,
        })

        dispatch({ type: "INCREMENT_RETRY" })

        // Retry toggle after a short delay
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = setTimeout(() => {
          toggleSidebar()
        }, 50)
      } else if (state.retryCount >= 3) {
        console.warn(
          `Sidebar #${sidebarId} state sync failed after 3 attempts - this may be expected if sidebar doesn't exist`,
        )
        dispatch({ type: "RESET_RETRY" })
      }
    }

    // Only verify if not animating and sidebar should exist
    if (!state.isAnimating) {
      verifySidebarState()
    }
  }, [state.isCollapsed, state.isAnimating, state.retryCount, sidebarId])

  // Main toggle function with debounce
  const toggleSidebar = () => {
    const now = Date.now()
    const timeSinceLastToggle = now - state.lastToggleTime

    // Debounce rapid clicks (max 1 toggle per 200ms)
    if (timeSinceLastToggle < 200 && debounceTimerRef.current) {
      return
    }

    // Check if sidebar exists before attempting to toggle
    const sidebarElement = document.querySelector(`#${sidebarId}`)
    if (!sidebarElement) {
      console.debug(`Sidebar #${sidebarId} not found - toggle ignored`)
      return
    }

    setIsLoading(true)
    dispatch({ type: "TOGGLE_SIDEBAR" })

    // Clear any existing animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }

    // Set timeout to match animation duration
    animationTimeoutRef.current = setTimeout(() => {
      dispatch({ type: "SET_ANIMATING", payload: false })
      setIsLoading(false)
    }, ANIMATION_DURATION)

    // Emit custom event with animation details for other components to sync with
    window.dispatchEvent(
      new CustomEvent("headerSidebarToggle", {
        detail: { isCollapsed: !state.isCollapsed },
      }),
    )

    // Debug logging
    console.debug("Sidebar toggle attempt", {
      newState: state.isCollapsed ? "expanded" : "collapsed",
      timestamp: new Date().toISOString(),
    })
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault()
      toggleSidebar()
    }
  }

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent event bubbling
    toggleSidebar()
  }

  // Emergency reset function (hidden)
  const emergencyReset = () => {
    const newState = true // Default to collapsed
    dispatch({
      type: "SET_STATE",
      payload: { isCollapsed: newState },
    })
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState))
    console.debug("Emergency sidebar state reset performed")

    window.dispatchEvent(
      new CustomEvent("headerSidebarToggle", {
        detail: { isCollapsed: newState },
      }),
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            ref={buttonRef}
            type="button"
            onClick={toggleSidebar}
            onMouseDown={handleMouseDown}
            onKeyDown={handleKeyDown}
            disabled={state.isAnimating && state.retryCount >= 3}
            aria-expanded={!state.isCollapsed}
            aria-controls={sidebarId}
            className={cn(
              "relative h-10 w-10 p-0 transition-all duration-300 ease-in-out",
              "hover:bg-gray-100 hover:scale-105 active:scale-95",
              "rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500",
              "touch-manipulation", // Improve touch response
              className,
            )}
            data-testid="sidebar-toggle-button"
          >
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "transition-transform duration-300 ease-in-out",
                {
                  "rotate-0": state.isCollapsed,
                  "rotate-180": !state.isCollapsed,
                  "scale-110": state.isAnimating,
                  "scale-100": !state.isAnimating,
                },
              )}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-700" />
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={cn("transition-colors duration-300", {
                    "text-gray-700": state.isCollapsed,
                    "text-violet-600": !state.isCollapsed,
                  })}
                >
                  <path
                    d="M15 3L15 13M15 17L15 21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  <path
                    d="M2 11V13C2 16.7712 2 18.6569 3.17157 19.8284C4.34315 21 6.22876 21 10 21H14C17.7712 21 19.6569 21 20.8284 19.8284C22 18.6569 22 16.7712 22 13V11C22 7.22876 22 5.34315 20.8284 4.17157C19.6569 3 17.7712 3 14 3H10C6.22876 3 4.34315 3 3.17157 4.17157C2.51839 4.82475 2.22937 5.69989 2.10149 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                </svg>
              )}
            </div>

            {/* Hidden emergency reset button */}
            <button
              type="button"
              onClick={emergencyReset}
              className="absolute opacity-0 w-1 h-1 -top-4 -left-4"
              aria-hidden="true"
              tabIndex={-1}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle sidebar</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
