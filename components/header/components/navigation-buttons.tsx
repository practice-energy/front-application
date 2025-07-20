"use client"

import { Button } from "@/components/ui/button"
import { Calendar, MessageSquare, CheckSquare, BarChart3 } from "lucide-react"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

interface NavigationButtonsProps {
  isAuthenticated: boolean
  role: "user" | "specialist"
  router: AppRouterInstance
}

export function NavigationButtons({ isAuthenticated, role, router }: NavigationButtonsProps) {

  const handleChatsClick = () => {
    if (role === "specialist") {
      router.push("/specialist-dashboard?section=chats")
    }
  }

  const handleTasksClick = () => {
    // Placeholder for tasks functionality
    console.log("Tasks clicked")
  }

  const handleAnalyticsClick = () => {
    if (role === "specialist") {
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
      {role === "specialist" && (
        <div className="hidden md:flex items-center space-x-2 ml-4">
          {/* Chat button */}
          <Button
            onClick={handleChatsClick}
            className="bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 active:bg-violet-600 dark:active:bg-violet-600 active:hover:bg-violet-700 dark:hover:active:bg-violet-600 text-gray-900 dark:text-white active:text-white dark:active:text-white active:border-violet-600 dark:active:border-violet-600 px-3 py-2 h-9 font-medium transition-colors duration-200 flex items-center gap-1 border border-gray-200 dark:border-gray-700"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="sr-only">Чаты</span>
          </Button>

          {/* Calendar button */}
          <Button
            onClick={handleCalendarClick}
            className="bg-white dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-700 active:bg-violet-600 dark:active:bg-violet-600 active:hover:bg-violet-700 dark:hover:active:bg-violet-600 text-gray-900 dark:text-white active:text-white dark:active:text-white active:border-violet-600 dark:active:border-violet-600 px-3 py-2 h-9 font-medium transition-colors duration-200 flex items-center gap-1 border border-gray-200 dark:border-gray-700"
          >
            <Calendar className="h-4 w-4" />
            <span className="sr-only">Календарь</span>
          </Button>

          {/* Tasks button - inactive for specialists */}
          <Button
            onClick={handleTasksClick}
            disabled
            className="bg-white dark:bg-gray-800 text-gray-400 px-3 py-2 h-9 font-medium transition-colors duration-200 flex items-center gap-1 border border-gray-200 dark:border-gray-700 cursor-not-allowed"
          >
            <CheckSquare className="h-4 w-4" />
            <span className="sr-only">Задачи</span>
          </Button>

          {/* Analytics button - inactive for specialists */}
          <Button
            onClick={handleAnalyticsClick}
            disabled
            className="bg-white dark:bg-gray-800 text-gray-400 px-3 py-2 h-9 font-medium transition-colors duration-200 flex items-center gap-1 border border-gray-200 dark:border-gray-700 cursor-not-allowed"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="sr-only">Аналитика</span>
          </Button>
        </div>
      )}
    </>
  )
}
