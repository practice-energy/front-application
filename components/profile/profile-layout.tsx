"use client"

import type React from "react"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useProfileStore } from "@/stores/profile-store"
import type { ProfileSection } from "@/types/profile"
import {mockUser} from "@/services/mock-user";
import {mockSavedSpecialists} from "@/services/mock-specialists";

interface ProfileLayoutProps {
  children: React.ReactNode
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  const searchParams = useSearchParams()
  const {
    activeSection,
    user,
    stats,
    setActiveSection,
    setIsMobile,
    setUser,
    setStats,
    setSavedSpecialists,
  } = useProfileStore()

  // Initialize data
  useEffect(() => {
    if (!user) setUser(mockUser)
    setSavedSpecialists(mockSavedSpecialists)
  }, [user, stats, setUser, setStats, setSavedSpecialists])

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="w-full">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  )
}
