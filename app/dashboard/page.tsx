"use client"

import { Suspense } from "react"
import {useRouter, useSearchParams} from "next/navigation"
import { MainDashboard } from "@/components/dashboard/sections/main-dashboard"
import {useAuth} from "@/hooks/use-auth";
import {useIsMobile} from "@/components/ui/use-mobile";
import {useProfileStore} from "@/stores/profile-store";

function DashboardContent() {
  const searchParams = useSearchParams()
  const section = searchParams.get("section") || "main"
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const isMobile = useIsMobile()
  const { user } = useProfileStore()

  if (isMobile) {
    return null
  }

  if (!isAuthenticated || user?.hat !== "master") {
    router.push("/")
  }

  const renderSection = () => {
    switch (section) {
      default:
        return <MainDashboard />
    }
  }

  return (
      <div className="flex-1 space-y-4 p-8 h-screen">{renderSection()}</div>
  )
}

export default function SpecialistDashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
