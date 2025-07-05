"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDownIcon, UserIcon, ArrowRightOnRectangleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ProfileDropdownV2Props {
  legacyRoutes?: boolean
  onLogout?: () => void
}

export function ProfileDropdownV2({ legacyRoutes = false, onLogout }: ProfileDropdownV2Props) {
  const [isOpen, setIsOpen] = useState(false)
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

  const handleLogout = () => {
    setIsOpen(false)
    if (onLogout) {
      onLogout()
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "flex items-center space-x-2 px-3 py-2",
          "min-h-[44px]", // Ensure minimum touch target
          "rounded-lg transition-all duration-300 ease-in-out",
          "hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800",
          "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
          "touch-manipulation cursor-pointer",
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Profile menu"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Profile" />
          <AvatarFallback className="bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400">
            JD
          </AvatarFallback>
        </Avatar>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-gray-500 dark:text-gray-400"
        >
          <ChevronDownIcon className="h-4 w-4" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute right-0 top-full mt-2 w-56",
              "bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700",
              "py-2 z-50 overflow-hidden",
            )}
            role="menu"
          >
            {/* Profile Section */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
                  <AvatarFallback className="bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-400">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">John Doe</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">john.doe@example.com</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300",
                  "hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700",
                  "focus:outline-none transition-colors duration-200",
                )}
                role="menuitem"
              >
                <UserIcon className="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                Profile
              </Link>

              <Link
                href="/profile?section=preferences"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300",
                  "hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700",
                  "focus:outline-none transition-colors duration-200",
                )}
                role="menuitem"
              >
                <Cog6ToothIcon className="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                Preferences
              </Link>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 my-1" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300",
                "hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700",
                "focus:outline-none transition-colors duration-200 text-left",
              )}
              role="menuitem"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
