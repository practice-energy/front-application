"use client"

import type React from "react"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useProfileStore } from "@/stores/profile-store"
import type { ProfileSection } from "@/types/profile"
import {mockSavedSpecialists} from "@/services/mock-specialists";

interface ProfileLayoutProps {
  children: React.ReactNode
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  const searchParams = useSearchParams()
  const {
    activeSection,
    setActiveSection,
    setIsMobile,
  } = useProfileStore()

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
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="w-full pt-24">
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  )
}
