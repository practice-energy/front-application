"use client"

import type React from "react"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useProfileStore } from "@/stores/profile-store"
import type { ProfileSection } from "@/types/profile"
import {mockSavedSpecialists} from "@/services/mock-specialists";
import {cn} from "@/lib/utils";
import {useIsMobile} from "@/hooks/use-mobile";

interface ProfileLayoutProps {
  children: React.ReactNode
}

export function ProfileLayout({ children }: ProfileLayoutProps) {
  const searchParams = useSearchParams()
  const {
    activeSection,
    setActiveSection,
  } = useProfileStore()
  const isMobile = useIsMobile()

  // Handle URL section parameter
  useEffect(() => {
    const section = searchParams.get("section") as ProfileSection
    if (section && section !== activeSection) {
      setActiveSection(section)
    }
  }, [searchParams, setActiveSection])

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className={cn("w-full", !isMobile && "pt-24")}>
        <div className="mx-auto">{children}</div>
      </div>
    </div>
  )
}
