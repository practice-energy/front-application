"use client"

import { Button } from "@/components/ui/button"
import { UserSwitch } from "@/components/icons/icon-user-switch"
import Link from "next/link"

interface MobileMenuProps {
  isMobileMenuOpen: boolean
  isAuthenticated: boolean
  user: any
  role: string
  isSpecialist: boolean
  handleRoleToggle: () => void
  setShowProfileMenu: (show: boolean) => void
  setIsMobileMenuOpen: (open: boolean) => void
  handleLogout: () => void
  openAuthModal: (mode: "login" | "signup") => void
}

export function MobileMenu({
  isMobileMenuOpen,
  isAuthenticated,
  user,
  role,
  isSpecialist,
  handleRoleToggle,
  setShowProfileMenu,
  setIsMobileMenuOpen,
  handleLogout,
  openAuthModal,
}: MobileMenuProps) {
  if (!isMobileMenuOpen) return null

  return (
    <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-4 z-50">
      {isAuthenticated ? (
        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name || "User"}</div>

          {/* Role toggle for mobile */}
          {user?.specialistProfile !== null && (
            <Button
              onClick={() => {
                handleRoleToggle()
                setIsMobileMenuOpen(false)
              }}
              variant="outline"
              className="w-full justify-start"
            >
              <UserSwitch className="mr-2 h-4 w-4" />
              Переключить на {role === "specialist" ? "Инициант" : "Мастер"}
            </Button>
          )}

          <Link
            href="/profile"
            className="block py-2 text-sm text-gray-700 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Profile
          </Link>

          <button
            onClick={() => {
              handleLogout()
              setIsMobileMenuOpen(false)
            }}
            className="block w-full text-left py-2 text-sm text-red-600 dark:text-red-400"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <Button
            onClick={() => {
              openAuthModal("login")
              setIsMobileMenuOpen(false)
            }}
            className="w-full"
          >
            Log in / Register
          </Button>
        </div>
      )}
    </div>
  )
}
