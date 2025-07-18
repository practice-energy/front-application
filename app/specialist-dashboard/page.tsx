"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MainDashboard } from "@/components/specialist-dashboard/sections/main-dashboard"
import Overview from "@/components/specialist-dashboard/sections/overview";

function SpecialistDashboardContent() {
  const searchParams = useSearchParams()
  const section = searchParams.get("section") || "main"

  const renderSection = () => {
    switch (section) {
      case "main":
      case "":
        return <MainDashboard />
      case "overview":
        return <Overview />
      default:
        return <MainDashboard />
    }
  }

  return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">{renderSection()}</div>
  )
}

export default function SpecialistDashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpecialistDashboardContent />
    </Suspense>
  )
}
