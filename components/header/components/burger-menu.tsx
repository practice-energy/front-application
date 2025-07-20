"use client"

import { Button } from "@/components/ui/button"
import { Menu, LayoutDashboard, Briefcase, BarChart3, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"
import type { BurgerMenuProps } from "../types/header.types"

export function BurgerMenu({
  isAuthenticated,
  showBurgerMenu,
  toggleBurgerMenu,
  setShowBurgerMenu,
  burgerMenuRef,
}: BurgerMenuProps) {
  if (!isAuthenticated) return null

  return (
    <div className="relative" ref={burgerMenuRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleBurgerMenu}
        className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-sm"
        aria-label="Specialist menu"
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </Button>

      {showBurgerMenu && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide">Dashboard</p>
          </div>

          <div className="py-1">
            <Link
              href="/specialist-dashboard?section=overview"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowBurgerMenu(false)}
            >
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Overview
            </Link>

            <Link
              href="/specialist-dashboard?section=services"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowBurgerMenu(false)}
            >
              <Briefcase className="mr-3 h-4 w-4" />
              Services
            </Link>

            <Link
              href="/specialist-dashboard?section=analytics"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowBurgerMenu(false)}
            >
              <BarChart3 className="mr-3 h-4 w-4" />
              Analytics
            </Link>

            <Link
              href="/specialist-dashboard?section=calendar"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowBurgerMenu(false)}
            >
              <Calendar className="mr-3 h-4 w-4" />
              Calendar
            </Link>

            <Link
              href="/specialist-dashboard?section=chats"
              className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowBurgerMenu(false)}
            >
              <MessageSquare className="mr-3 h-4 w-4" />
              Chats
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
