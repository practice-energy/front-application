"use client"

import { User, Shield, Calendar, MessageCircle, Wallet, Heart } from "lucide-react"
import { useTranslations } from "@/hooks/use-translations"

interface ProfileData {
  first_name: string
  last_name: string
  photo_url: string
  email: {
    address: string
    verified: boolean
  }
  time_on_platform: string
}

interface ProfileSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  profileData: ProfileData
}

export function ProfileSidebar({ activeSection, onSectionChange, profileData }: ProfileSidebarProps) {
  const { t } = useTranslations()

  const sidebarItems = [
    { id: "overview", label: t("profile.personalInfo"), icon: User },
    { id: "security", label: t("profile.loginSecurity"), icon: Shield },
    { id: "calendar", label: t("profile.calendar"), icon: Calendar },
    { id: "chats", label: t("profile.messages"), icon: MessageCircle },
    { id: "saved", label: t("profile.savedSpecialists"), icon: Heart },
    { id: "balance", label: t("profile.balance"), icon: Wallet },
  ]

  return (
    <div className="lg:w-72 flex-shrink-0">
      <div className="flex flex-col items-center mb-6 lg:mb-8">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center mb-3">
          {profileData.photo_url ? (
            <img
              src={profileData.photo_url || "/placeholder.svg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-xl font-bold">
              {profileData.first_name[0]}
              {profileData.last_name[0]}
            </span>
          )}
        </div>
        <h3 className="font-bold text-base text-center">
          {profileData.first_name} {profileData.last_name}
        </h3>
      </div>

      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border border-violet-200"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
