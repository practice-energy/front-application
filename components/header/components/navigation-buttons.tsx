"use client"

import { Button } from "@/components/ui/button"
import {Calendar, MessageSquare, CheckSquare, BarChart3, CalendarDays, MessageSquareText} from "lucide-react"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import {cn} from "@/lib/utils";

interface NavigationButtonsProps {
  isAuthenticated: boolean
  hat: "adept" | "master" | "supervisor"
  router: AppRouterInstance
}

export function NavigationButtons({ isAuthenticated, hat, router }: NavigationButtonsProps) {

  const handleChatsClick = () => {
    if (hat === "master") {
      router.push("/specialist-dashboard?section=chats")
    }
  }

  const handleTasksClick = () => {
    // Placeholder for tasks functionality
    console.log("Tasks clicked")
  }

  const handleAnalyticsClick = () => {
    if (hat === "master") {
      router.push("/specialist-dashboard?section=analytics")
    }
  }

  const handleCalendarClick = () => {
    router.push("/calendar")
  }

  if (!isAuthenticated) return null

  return (
    <>
      {/* Navigation buttons for authenticated specialists only */}
      {hat === "master" && (
        <div className="hidden md:flex items-center space-x-2 ml-4">
          {/* Chat button */}
          <div className={cn(
              "hidden md:flex items-center space-x-3 aspect-square rounded-sm shadow-sm h-10 w-10 p-1 pl-1 border",
          )}>
            <button onClick={handleChatsClick} disabled={true}>
              <MessageSquareText className="h-[30px] w-[30px] bold disabled" />
            </button>
          </div>

          {/* Calendar button */}
          <div className={cn(
              "hidden md:flex items-center space-x-3 aspect-square rounded-sm shadow-sm h-10 w-10 p-1 pl-1 border",
          )}>
            <button onClick={handleCalendarClick}>
              <CalendarDays className="h-[30px] w-[30px] bold" />
            </button>
          </div>

          {/* Tasks button - inactive for specialists */}
          <div className={cn(
              "hidden md:flex items-center space-x-3 aspect-square rounded-sm shadow-sm h-10 w-10 p-1 pl-1 border",
          )}>
            <button onClick={handleTasksClick}>
              <CheckSquare className="h-[30px] w-[30px] bold" />
            </button>
          </div>

          {/* Analytics button - inactive for specialists */}
          <div className={cn(
              "hidden md:flex items-center space-x-3 aspect-square rounded-sm shadow-sm h-10 w-10 p-1 pl-1 border",
          )}>
            <button onClick={handleAnalyticsClick}>
              <BarChart3 className="h-[30px] w-[30px] bold" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
