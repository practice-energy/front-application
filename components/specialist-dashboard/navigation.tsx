"use client"
import { Card } from "@/components/ui/card"
import {
  TrendingUp,
  Edit,
  Settings,
  Calendar,
  MessageSquare,
  MessageCircleMore,
  BarChart3,
  ChevronDown,
} from "lucide-react"

interface SpecialistDashboardNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

export function SpecialistDashboardNavigation({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: SpecialistDashboardNavigationProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "profile", label: "Profile", icon: Edit },
    { id: "services", label: "Services", icon: Settings },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "greeting", label: "Greeting", icon: MessageSquare },
    { id: "feedbacks", label: "Feedbacks", icon: MessageCircleMore },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ]

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:block border-b border-gray-200 bg-white rounded-lg shadow-sm">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-violet-500 text-violet-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Current Tab Display */}
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {(() => {
                const currentTab = tabs.find((tab) => tab.id === activeTab)
                const Icon = currentTab?.icon || TrendingUp
                return (
                  <>
                    <Icon className="h-5 w-5 text-violet-600" />
                    <span className="font-medium text-gray-900">{currentTab?.label}</span>
                  </>
                )
              })()}
            </div>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                isMobileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </Card>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <Card className="mb-6 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? "bg-violet-50 text-violet-700 border-r-2 border-violet-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </Card>
        )}
      </div>
    </>
  )
}
