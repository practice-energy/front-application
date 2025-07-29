"use client"

import type { User } from "@/types/user"
import { ProfileIcon } from "@/components/profile-icon"
import { SettingsButton } from "@/components/calendar-settings-button"

interface CalendarMobileHeaderProps {
  user: User | null
  onSettings: () => void
  isAuthenticated: boolean
}

export function CalendarMobileHeader({ user, onSettings, isAuthenticated }: CalendarMobileHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-3">
        {user && <ProfileIcon user={user} size="sm" showOnlineStatus={false} />}
        <div>
          <h1 className="font-semibold text-lg">Календарь</h1>
          {user && <p className="text-sm text-gray-500">{user.name}</p>}
        </div>
      </div>

      <SettingsButton
        onClick={onSettings}
        className="bg-gray-100 hover:bg-gray-200"
        iconClassName="w-5 h-5 text-gray-600"
      />
    </div>
  )
}
