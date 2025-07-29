"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SettingsButton } from "@/components/calendar-settings-button"

interface CalendarMobileHeaderProps {
  user: any
  onSettings: () => void
  isAuthenticated: boolean
}

export function CalendarMobileHeader({ user, onSettings, isAuthenticated }: CalendarMobileHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.photo || "/placeholder-user.jpg"} />
          <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{user?.name || "Пользователь"}</span>
      </div>

      <SettingsButton onClick={onSettings} className="w-8 h-8" iconClassName="w-4 h-4" />
    </div>
  )
}
