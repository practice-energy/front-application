"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useProfileStore } from "@/stores/profile-store"
import { cn } from "@/lib/utils"
import { User, Calendar, Heart, Shield, MessageSquare, CreditCard, ChevronLeft, Menu } from "lucide-react"
import type { ProfileSection } from "@/types/profile"

const sidebarItems = [
  { id: "overview" as ProfileSection, label: "Overview", icon: User },
  { id: "calendar" as ProfileSection, label: "Calendar", icon: Calendar },
  { id: "saved" as ProfileSection, label: "Saved", icon: Heart },
  { id: "security" as ProfileSection, label: "Security", icon: Shield },
  { id: "balance" as ProfileSection, label: "Balance", icon: CreditCard },
]

export function ProfileSidebar() {
  const { activeSection, sidebarCollapsed, isMobile, stats, setActiveSection, setSidebarCollapsed } = useProfileStore()

  const handleSectionChange = (section: ProfileSection) => {
    setActiveSection(section)
    // Update URL
    const url = new URL(window.location.href)
    if (section === "overview") {
      url.searchParams.delete("section")
    } else {
      url.searchParams.set("section", section)
    }
    window.history.replaceState({}, "", url.toString())

    // Close sidebar on mobile after selection
    if (isMobile) {
      setSidebarCollapsed(true)
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div
      className={cn(
        "h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        isMobile ? "w-64" : sidebarCollapsed ? "w-16" : "w-60",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {(!sidebarCollapsed || isMobile) && <h2 className="text-lg font-semibold text-gray-900">Profile</h2>}
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className="h-8 w-8 p-0">
            {isMobile ? (
              <Menu className="h-4 w-4" />
            ) : (
              <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            const badge =
              item.id === "chats"
                ? stats?.unreadMessages
                : item.id === "calendar"
                  ? stats?.activeBookings
                  : item.id === "saved"
                    ? stats?.totalSaved
                    : undefined

            return (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-10",
                    isActive && "bg-purple-50 text-purple-700 hover:bg-purple-100",
                    sidebarCollapsed && !isMobile && "justify-center px-2",
                  )}
                  onClick={() => handleSectionChange(item.id)}
                >
                  <Icon className={cn("h-5 w-5", sidebarCollapsed && !isMobile ? "mx-auto" : "mr-3")} />
                  {(!sidebarCollapsed || isMobile) && (
                    <>
                      <span>{item.label}</span>
                      {badge && badge > 0 && (
                        <Badge className="ml-auto bg-purple-100 text-purple-800 text-xs" variant="secondary">
                          {badge}
                        </Badge>
                      )}
                    </>
                  )}
                  {sidebarCollapsed && !isMobile && badge && badge > 0 && (
                    <div className="absolute top-1 right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {badge}
                    </div>
                  )}
                </Button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
