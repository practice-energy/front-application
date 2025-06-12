"use client"

import type React from "react"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useProfileStore } from "@/stores/profile-store"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { cn } from "@/lib/utils"
import { mockUser, mockStats, mockSavedSpecialists, mockCalendarEvents } from "@/services/mock-data"
import type { ProfileSection } from "@/types/profile"

interface ProfileLayoutProps {
  children: React.ReactNode
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  const searchParams = useSearchParams()
  const {
    activeSection,
    sidebarCollapsed,
    isMobile,
    user,
    stats,
    setActiveSection,
    setIsMobile,
    setUser,
    setStats,
    setSavedSpecialists,
    setCalendarEvents,
  } = useProfileStore()

  // Initialize data
  useEffect(() => {
    if (!user) setUser(mockUser)
    if (!stats) setStats(mockStats)
    setSavedSpecialists(mockSavedSpecialists)
    setCalendarEvents(mockCalendarEvents)
  }, [user, stats, setUser, setStats, setSavedSpecialists, setCalendarEvents])

  // Handle URL section parameter
  useEffect(() => {
    const section = searchParams.get("section") as ProfileSection
    if (section && section !== activeSection) {
      setActiveSection(section)
    }
  }, [searchParams, setActiveSection])

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [setIsMobile])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "transition-all duration-300 z-50",
          isMobile ? "fixed inset-y-0 left-0" : "relative",
          isMobile && sidebarCollapsed && "-translate-x-full",
        )}
      >
        <ProfileSidebar />
      </div>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => useProfileStore.getState().setSidebarCollapsed(true)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  )
}
