"use client"

import { Button } from "@/components/ui/button"
import {Calendar, MessageSquare, CheckSquare, BarChart3, CalendarDays, MessageSquareText} from "lucide-react"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import {cn} from "@/lib/utils";
import {IconButton} from "@/components/icon-button";
import {usePathname} from "next/navigation";
import {CalendarButton} from "@/components/calendar-button";

interface NavigationButtonsProps {
  isAuthenticated: boolean
  hat: "adept" | "master" | "superviser"
  router: AppRouterInstance
}

export function NavigationButtons({ isAuthenticated, hat, router }: NavigationButtonsProps) {
  const pathname = usePathname()

  const handleChatsClick = () => {}

  const handleTasksClick = () => {
    // Placeholder for tasks functionality
    console.log("Tasks clicked")
  }

  const handleAnalyticsClick = () => {}

  const handleCalendarClick = () => {
    router.push("/calendar")
  }

  if (!isAuthenticated) return null

  return (
    <>
      {/* Navigation buttons for authenticated specialists only */}
      {hat === "master" && (
        <div className="items-center gap-6 flex flex-row">
          {/* Chat button */}
          <IconButton
              icon={MessageSquareText}
              onClick={handleChatsClick}
              disabled={true}
          />

          {/* Calendar button */}
          <CalendarButton
              onClick={handleCalendarClick}
              pathname={pathname}
          />

          {/* Tasks button */}
          <IconButton
              icon={CheckSquare}
              onClick={handleTasksClick}
              disabled={true}
          />

          {/* Analytics button */}
          <IconButton
              icon={BarChart3}
              onClick={handleAnalyticsClick}
              disabled={true}
          />
        </div>
      )}
    </>
  )
}
