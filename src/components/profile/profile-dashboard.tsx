"use client"

import { Suspense, lazy } from "react"
import { useProfileStore } from "@/src/stores/profile-store"
import { ProfileLayout } from "@/src/components/profile/profile-layout"
import { OverviewSection } from "@/src/components/profile/sections/overview-section"

const SavedSection = lazy(() =>
  import("@/src/components/profile/sections/saved-section").then((m) => ({ default: m.SavedSection })),
)
const SecuritySection = lazy(() =>
  import("@/src/components/profile/sections/security-section").then((m) => ({ default: m.SecuritySection })),
)

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-[406px] w-[845px] bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}

export function ProfileDashboard() {
  const { activeSection } = useProfileStore()

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
         return (
             <Suspense fallback={<LoadingSkeleton />}>
              <OverviewSection />
             </Suspense>
         )
      case "saved":
        return (
          <Suspense fallback={<LoadingSkeleton />}>
            <SavedSection />
          </Suspense>
        )
      case "security":
        return (
          <Suspense fallback={<LoadingSkeleton />}>
            <SecuritySection />
          </Suspense>
        )
      default:
        return <OverviewSection />
    }
  }

  return <ProfileLayout>{renderActiveSection()}</ProfileLayout>
}
