"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Overview from "@/components/specialist-dashboard/sections/overview"
import Services from "@/components/specialist-dashboard/sections/services"
import { SpecialistScheduleSection } from "@/components/specialist-schedule-section"
import { SpecialistGreeting } from "@/components/specialist-greeting"
import { SpecialistDashboardFeedbacks } from "@/components/specialist-dashboard/feedbacks"
import { SpecialistAnalytics } from "@/components/specialist-analytics"
import { LayoutDashboard, User, Briefcase, Calendar, MessageSquare, Star, BarChart3 } from "lucide-react"

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "greeting", label: "Greeting", icon: MessageSquare },
  { id: "feedbacks", label: "Feedbacks", icon: Star },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
]

export default function SpecialistDashboardOverview() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Initialize active tab from URL params
  useEffect(() => {
    const section = searchParams.get("section")
    if (section && tabs.some((tab) => tab.id === section)) {
      setActiveTab(section)
    }
  }, [searchParams])

  // TODO
  // if (!isAuthenticated || !user?.isSpecialist) {
  //   router.push("/")
  // }

  const renderTabContent = () => {
    switch (activeTab) {
      case "services":
        return <Services />
      case "schedule":
        return <SpecialistScheduleSection />
      case "greeting":
        return <SpecialistGreeting />
      case "feedbacks":
        return <SpecialistDashboardFeedbacks />
      case "analytics":
        return <SpecialistAnalytics />
      default:
        return <Overview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderTabContent()}</main>
    </div>
  )
}
