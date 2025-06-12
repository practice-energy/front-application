"use client"

import type React from "react"

import { useReducer, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarToggleState {
  isCollapsed: boolean
  isAnimating: boolean
  lastToggleTime: number
}

type SidebarToggleAction =
  | { type: "TOGGLE" }
  | { type: "SET_ANIMATING"; payload: boolean }
  | { type: "SET_COLLAPSED"; payload: boolean }

interface SidebarToggleProps {
  className?: string
  onToggle?: (isCollapsed: boolean) => void
}

const DEBOUNCE_DELAY = 150 // ms
const ANIMATION_DURATION = 300 // ms

function sidebarToggleReducer(state: SidebarToggleState, action: SidebarToggleAction): SidebarToggleState {
  switch (action.type) {
    case "TOGGLE":
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
    case "SET_COLLAPSED":
      return {
        ...state,
        isCollapsed: action.payload,
        isAnimating: false,
      }
    default:
      return state
  }
}

export function SidebarToggleV2({ className, onToggle }: SidebarToggleProps) {
  const [state, dispatch] = useReducer(sidebarToggleReducer, {
    isCollapsed: true,
    isAnimating: false,
    lastToggleTime: 0,
  })

  const buttonRef = useRef<HTMLButtonElement>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout>()

  // Load initial state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState !== null) {
      dispatch({ type: "SET_COLLAPSED", payload: JSON.parse(savedState) })
    }
  }, [])

  // Persist state changes
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(state.isCollapsed))
    onToggle?.(state.isCollapsed)
  }, [state.isCollapsed, onToggle])

  // Handle animation completion
  useEffect(() => {
    if (state.isAnimating) {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }

      animationTimeoutRef.current = setTimeout(() => {
        dispatch({ type: "SET_ANIMATING", payload: false })
      }, ANIMATION_DURATION)
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [state.isAnimating])

  const handleToggle = useCallback(() => {
    const now = Date.now()
    const timeSinceLastToggle = now - state.lastToggleTime

    // Debounce rapid clicks
    if (timeSinceLastToggle < DEBOUNCE_DELAY) {
      return
    }

    dispatch({ type: "TOGGLE" })

    // Emit custom event for other components
    window.dispatchEvent(
      new CustomEvent("sidebarToggle", {
        detail: { isCollapsed: !state.isCollapsed },
      }),
    )
  }, [state.isCollapsed, state.lastToggleTime])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        handleToggle()
      }
    },
    [handleToggle],
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      handleToggle()
    },
    [handleToggle],
  )

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={handleToggle}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      disabled={state.isAnimating}
      aria-expanded={!state.isCollapsed}
      aria-controls="main-sidebar"
      aria-label="Toggle sidebar"
      className={cn(
        "relative flex items-center justify-center",
        "h-11 w-11 min-h-[44px] min-w-[44px]", // Ensure 44x44px minimum
        "rounded-lg transition-colors duration-200",
        "hover:bg-gray-100 focus:bg-gray-100",
        "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "touch-manipulation cursor-pointer",
        className,
      )}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <AnimatePresence mode="wait">
        {state.isAnimating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
          </motion.div>
        ) : (
          <motion.div
            key="icon"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{
              opacity: 1,
              rotate: state.isCollapsed ? 0 : 180,
            }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cn("transition-colors duration-300", state.isCollapsed ? "text-gray-600" : "text-violet-600")}
            >
              <path d="M15 3L15 13M15 17L15 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path
                d="M2 11V13C2 16.7712 2 18.6569 3.17157 19.8284C4.34315 21 6.22876 21 10 21H14C17.7712 21 19.6569 21 20.8284 19.8284C22 18.6569 22 16.7712 22 13V11C22 7.22876 22 5.34315 20.8284 4.17157C19.6569 3 17.7712 3 14 3H10C6.22876 3 4.34315 3 3.17157 4.17157C2.51839 4.82475 2.22937 5.69989 2.10149 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
