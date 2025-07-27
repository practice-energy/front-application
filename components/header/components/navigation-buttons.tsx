"use client"

import { Button } from "@/components/ui/button"
import {Calendar, MessageSquare, CheckSquare, BarChart3, CalendarDays, MessageSquareText} from "lucide-react"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import {cn} from "@/lib/utils";
import {IconButton} from "@/components/icon-button";
import {usePathname} from "next/navigation";

interface NavigationButtonsProps {
  isAuthenticated: boolean
  hat: "adept" | "master" | "superviser"
  router: AppRouterInstance
}

export function NavigationButtons({ isAuthenticated, hat, router }: NavigationButtonsProps) {
  const pathname = usePathname()

  const handleChatsClick = () => {
    // if (hat === "master") {
    //   router.push("/dashboard?section=chats")
    // }
  }

  const handleTasksClick = () => {
    // Placeholder for tasks functionality
    console.log("Tasks clicked")
  }

  const handleAnalyticsClick = () => {
    // if (hat === "master") {
    //   router.push("/dashboard?section=analytics")
    // }
  }

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
          <IconButton
              icon={CalendarDays}
              onClick={handleCalendarClick}
              className={cn(
                  pathname === "/calendar" && " bg-violet-600 border-0 shadow-md",
              )}
              iconClassName={cn(
                  pathname === "/calendar" && " text-white",
              )}
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
