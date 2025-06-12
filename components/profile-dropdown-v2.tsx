"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Calendar, Heart, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useActiveRoute, useRouteAvailability, getRouteHref } from "@/utils/route-detection"
import { cn } from "@/lib/utils"
import type { RouteConfig } from "@/types/header"

interface ProfileDropdownProps {
  legacyRoutes?: boolean
  onLogout: () => void
}

const navigationItems: RouteConfig[] = [
  {
    primary: "/profile?section=overview",
    legacy: "/profile?section=overview",
    label: "Profile",
    icon: User,
  },
  {
    primary: "/profile?section=calendar",
    legacy: "/profile?section=calendar",
    label: "Meetings & Schedule",
    icon: Calendar,
  },
  {
    primary: "/profile?section=saved",
    legacy: "/profile?section=saved",
    label: "Saved",
    icon: Heart,
  },
]

export function ProfileDropdownV2({ legacyRoutes = false, onLogout }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const { isActiveRoute } = useActiveRoute()
  const routeAvailability = useRouteAvailability()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleItemClick = () => {
    setIsOpen(false)
  }

  const handleLogoutClick = () => {
    setIsOpen(false)
    onLogout()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-center",
          "h-10 w-10 min-h-[44px] min-w-[44px]", // Ensure 44x44px minimum
          "rounded-full transition-colors duration-200",
          "hover:bg-gray-100 focus:bg-gray-100",
          "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2",
          "touch-manipulation cursor-pointer",
        )}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Profile menu"
      >
        <div className="h-8 w-8 rounded-full bg-violet-100 flex items-center justify-center">
          <User className="h-5 w-5 text-violet-600" />
        </div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute right-0 top-full mt-2 w-64",
              "bg-white rounded-lg shadow-lg border border-gray-200",
              "py-2 z-50 overflow-hidden",
            )}
            role="menu"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>

            {/* Navigation Items */}
            <div className="py-1">
              {navigationItems.map((item) => {
                const isActive = isActiveRoute(item.primary, item.legacy)
                const isAvailable = routeAvailability[item.primary] !== false
                const href = getRouteHref(item.primary, item.legacy, isAvailable, legacyRoutes)

                return (
                  <Link
                    key={item.primary}
                    href={href}
                    onClick={handleItemClick}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm transition-colors",
                      "hover:bg-gray-50 focus:bg-gray-50",
                      "focus:outline-none",
                      isActive ? "text-violet-600 bg-violet-50 border-r-2 border-violet-600" : "text-gray-700",
                    )}
                    role="menuitem"
                  >
                    <item.icon className={cn("mr-3 h-4 w-4", isActive ? "text-violet-600" : "text-gray-400")} />
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-violet-600 rounded-full ml-2"
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Logout */}
            <div className="border-t border-gray-100 py-1">
              <button
                onClick={handleLogoutClick}
                className={cn(
                  "flex items-center w-full px-4 py-2 text-sm text-gray-700",
                  "hover:bg-gray-50 focus:bg-gray-50",
                  "focus:outline-none transition-colors",
                )}
                role="menuitem"
              >
                <LogOut className="mr-3 h-4 w-4 text-gray-400" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
