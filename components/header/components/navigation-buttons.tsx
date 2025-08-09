"use client"

import { Button } from "@/components/ui/button"
import {
  Calendar,
  MessageSquare,
  CheckSquare,
  BarChart3,
  CalendarDays,
  MessageSquareText,
  Pentagon,
  SettingsIcon
} from "lucide-react"
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import {cn} from "@/lib/utils";
import {IconButton} from "@/components/icon-button";
import {usePathname, useRouter} from "next/navigation";
import {CalendarButton} from "@/components/calendar-button";
import {PentagramIcon} from "@phosphor-icons/react";

interface NavigationButtonsProps {
  isAuthenticated: boolean
  isBecomeSpecialist: boolean
  hat: "adept" | "master" | "superviser"
  router: AppRouterInstance
  onChatsClick: () => void
}

export function NavigationButtons({ isAuthenticated, isBecomeSpecialist, hat, router, onChatsClick }: NavigationButtonsProps) {
  const pathname = usePathname()

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
      {/* Chat button */}
      {!isBecomeSpecialist && (<IconButton
          icon={MessageSquareText}
          onClick={onChatsClick}
          disabled={false}
      />)}

      {/* Calendar button */}
      {!isBecomeSpecialist && (<CalendarButton
          onClick={handleCalendarClick}
          pathname={pathname}
      />)}

      {/* Tasks button */}
      {/*{!isBecomeSpecialist && hat === "master" && ( <IconButton*/}
      {/*    icon={CheckSquare}*/}
      {/*    onClick={handleTasksClick}*/}
      {/*    disabled={true}*/}
      {/*/>)}*/}

      {/* Analytics button */}
      {/*{!isBecomeSpecialist && hat === "master" && (<IconButton*/}
      {/*    icon={BarChart3}*/}
      {/*    onClick={handleAnalyticsClick}*/}
      {/*    disabled={true}*/}
      {/*/>)}*/}

      {!isBecomeSpecialist && (<IconButton icon={SettingsIcon} onClick={() => {}} disabled={false} />)}

      {/* User likes icon */}
      {!isBecomeSpecialist && hat === "adept" && (
          <IconButton icon={PentagramIcon}
                      onClick={() => {
                        router.push("/saved")
                      }}
                      disabled={false}
                      className={cn(pathname === "/saved" && " border border-neutral-900 shadow-md")}
        />)}

      {/* Security button */}
      {/*<IconButton*/}
      {/*    icon={Pentagon}*/}
      {/*    onClick={handleSecrityClick}*/}
      {/*    disabled={false}*/}
      {/*/>*/}
    </>
  )
}
