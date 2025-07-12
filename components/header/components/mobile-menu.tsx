"use client"

import {
  User,
  Calendar,
  Heart,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  LayoutDashboard,
  Briefcase,
  BarChart3,
  MessageSquare,
} from "lucide-react"
import { SwatchIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import type { MobileMenuProps } from "../types/header.types"

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
    <div className="md:hidden border-t dark:border-gray-800 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
      {isAuthenticated ? (
        <>
          <div>
            {/* Role toggle button in mobile */}
            {isAuthenticated && user?.specialistProfile !== null && (
              <button
                onClick={handleRoleToggle}
                className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-sm"
              >
                <User className="mr-3 h-4 w-4" />
                {role === "specialist" ? "К режиму пользователя" : "К режиму мастера"}
              </button>
            )}

            <Link
              href="/profile?section=overview"
              className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-sm"
              onClick={() => setShowProfileMenu(false)}
            >
              <User className="mr-3 h-4 w-4" />
              Profile Overview
            </Link>

            <Link
              href="/profile?section=calendar"
              className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-sm"
              onClick={() => setShowProfileMenu(false)}
            >
              <Calendar className="mr-3 h-4 w-4" />
              Calendar
            </Link>

            <Link
              href="/profile?section=saved"
              className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-sm"
              onClick={() => setShowProfileMenu(false)}
            >
              <Heart className="mr-3 h-4 w-4" />
              Saved
            </Link>

            <Link
              href="/profile?section=security"
              className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-sm"
              onClick={() => setShowProfileMenu(false)}
            >
              <Shield className="mr-3 h-4 w-4" />
              Security
            </Link>

            <Link
              href="/profile?section=balance"
              className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-sm"
              onClick={() => setShowProfileMenu(false)}
            >
              <CreditCard className="mr-3 h-4 w-4" />
              Balance
            </Link>

            <Link
              href="/profile?section=preferences"
              className="flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-sm"
              onClick={() => setShowProfileMenu(false)}
            >
              <SwatchIcon className="mr-3 h-4 w-4" />
              Preferences
            </Link>
          </div>

          {isSpecialist && (
            <>
              <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
              <div className="px-3 py-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Specialist Dashboard
                </p>
              </div>

              <Link
                href="/specialist-dashboard?section=overview"
                className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LayoutDashboard className="mr-3 h-4 w-4" />
                Overview
              </Link>

              <Link
                href="/specialist-dashboard?section=services"
                className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Briefcase className="mr-3 h-4 w-4" />
                Services
              </Link>

              <Link
                href="/specialist-dashboard?section=analytics"
                className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 className="mr-3 h-4 w-4" />
                Analytics
              </Link>

              <Link
                href="/specialist-dashboard?section=calendar"
                className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="mr-3 h-4 w-4" />
                Calendar
              </Link>

              <Link
                href="/specialist-dashboard?section=chats"
                className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageSquare className="mr-3 h-4 w-4" />
                Chats
              </Link>
            </>
          )}

          <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

          <Link
            href="/help"
            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <HelpCircle className="mr-3 h-4 w-4" />
            Help / FAQ
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-sm transition-colors text-left"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => openAuthModal("login")}
          className="flex items-center w-full px-3 py-2 text-sm bg-violet-600 hover:bg-violet-700 text-white rounded-sm transition-colors text-left justify-center"
        >
          <User className="mr-3 h-4 w-4" />
          Log in / Register
        </button>
      )}
    </div>
  )
}
