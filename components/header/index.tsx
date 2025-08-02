"use client"

import { useAuth } from "@/hooks/use-auth"
import { useHeaderState } from "./hooks/use-header-state"
import { Logo } from "./components/logo"
import { NavigationButtons } from "./components/navigation-buttons"
import { ProfileMenu } from "./components/profile-menu"
import { ChatHeader } from "./components/chat-header"
import { CalendarMobileHeader } from "./components/calendar-mobile-header"
import { MainMobileHeader } from "./components/main-mobile-header"

export function Header() {
  const { isAuthenticated } = useAuth()
  const { currentView, isMobile } = useHeaderState()

  if (!isAuthenticated) {
    // Show minimal header for unauthenticated users
    return (
      <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <Logo />
        <div className="flex items-center gap-4">{/* You can add login/register buttons here */}</div>
      </header>
    )
  }

  if (isMobile) {
    switch (currentView) {
      case "chat":
        return <ChatHeader />
      case "calendar":
        return <CalendarMobileHeader />
      default:
        return <MainMobileHeader />
    }
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-6">
        <Logo />
        <NavigationButtons />
      </div>
      <ProfileMenu />
    </header>
  )
}
