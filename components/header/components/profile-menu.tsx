"use client"

import { Button } from "@/components/ui/button"
import {User, CalendarDays, Shield, CreditCard, HelpCircle, LogOut, Settings, LucideSettings2} from "lucide-react"
import { UserSwitch } from "@/components/icons/icon-user-switch"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ProfileMenuProps } from "../types/header.types"
import { Pentagram } from "@/components/icons/icon-pentagram"

export function ProfileMenu({
  isAuthenticated,
  user,
  showProfileMenu,
  toggleProfileMenu,
  setShowProfileMenu,
  profileMenuRef,
  handleLogout,
  isMobile = false,
  role,
  handleRoleToggle,
  isSpecialist = false,
}: ProfileMenuProps) {
  if (!isAuthenticated) return null

  const buttonComponent = (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleProfileMenu}
      className={cn(
        "h-15 w-15 p-0 rounded-sm transition-all duration-200",
        showProfileMenu
          ? "border-3 border-violet-600"
          : "border-3 border-transparent hover:bg-violet-50 dark:hover:bg-violet-900/20",
      )}
      aria-label="Profile menu"
    >
      <div
        className={cn(
          "h-12 w-12 rounded-sm flex items-center justify-center",
          "bg-violet-100 dark:bg-violet-900",
          showProfileMenu && "bg-violet-200 dark:bg-violet-800",
        )}
      >
        <User className="h-12 w-12 text-violet-600 dark:text-violet-400" />
      </div>
    </Button>
  )

  if (isMobile) {
    return buttonComponent
  }

  return (
    <div className="relative" ref={profileMenuRef}>
      {buttonComponent}

      {showProfileMenu && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-gray-800 rounded-sm shadow-md border border-gray-200 dark:border-gray-700 py-0 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.name || "User"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>

          {/* Role toggle button */}
          {user?.specialistProfile !== null && handleRoleToggle && isSpecialist && (
              <button
                  onClick={() => {
                    handleRoleToggle()
                    setShowProfileMenu(false)
                  }}
                  className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-colors w-full"
              >
                <UserSwitch className="mr-3 h-4 w-4" />
                {role === "specialist" ? "Инициант" : "Мастер"}
              </button>
          )}

          <div>
            <Link
              href="/profile?section=overview"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              onClick={() => setShowProfileMenu(false)}
            >
              <User className="mr-3 h-4 w-4" />
              Профиль
            </Link>

            <Link
              href="/profile?section=calendar"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              onClick={() => setShowProfileMenu(false)}
            >
              <CalendarDays className="mr-3 h-4 w-4" />
              Календарь
            </Link>

            <Link
              href="/profile?section=saved"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              onClick={() => setShowProfileMenu(false)}
            >
              <Pentagram className="mr-3 h-4 w-4" />
              Сохраненные
            </Link>

            <Link
              href="/profile?section=security"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              onClick={() => setShowProfileMenu(false)}
            >
              <Shield className="mr-3 h-4 w-4" />
              Безопасность
            </Link>

            <Link
              href="/profile?section=balance"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              onClick={() => setShowProfileMenu(false)}
            >
              <CreditCard className="mr-3 h-4 w-4" />
              Баланс
            </Link>

            <Link
              href="/profile?section=preferences"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              onClick={() => setShowProfileMenu(false)}
            >
              <LucideSettings2 className="mr-3 h-4 w-4" />
              Настройки
            </Link>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 py-2">
            <Link
              href="/help"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              onClick={() => setShowProfileMenu(false)}
            >
              <HelpCircle className="mr-3 h-4 w-4" />
              Help / FAQ
            </Link>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 py-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
