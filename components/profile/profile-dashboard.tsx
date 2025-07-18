"use client"

import { Suspense, lazy } from "react"
import { useProfileStore } from "@/stores/profile-store"
import { ProfileLayout } from "@/components/profile/profile-layout"
import { OverviewSection } from "@/components/profile/sections/overview-section"

const SavedSection = lazy(() =>
  import("@/components/profile/sections/saved-section").then((m) => ({ default: m.SavedSection })),
)
const SecuritySection = lazy(() =>
  import("@/components/profile/sections/security-section").then((m) => ({ default: m.SecuritySection })),
)
const BalanceSection = lazy(() =>
  import("@/components/profile/sections/balance-section").then((m) => ({ default: m.BalanceSection })),
)
const PreferencesSection = lazy(() =>
  import("@/components/profile/sections/preferences-section").then((m) => ({ default: m.PreferencesSection })),
)

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded animate-pulse" />
      <div className="h-32 bg-gray-200 rounded animate-pulse" />
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
        return <OverviewSection />
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
      case "balance":
        return (
          <Suspense fallback={<LoadingSkeleton />}>
            <BalanceSection />
          </Suspense>
        )
      case "preferences":
        return (
          <Suspense fallback={<LoadingSkeleton />}>
            <PreferencesSection />
          </Suspense>
        )
      default:
        return <OverviewSection />
    }
  }

  return <ProfileLayout>{renderActiveSection()}</ProfileLayout>
}
