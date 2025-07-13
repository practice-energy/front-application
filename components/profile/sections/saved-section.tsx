"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InstagramSpecialistCard } from "@/components/instagram-specialist-card"
import { InstagramServiceCard } from "@/components/instagram-service-card"
import { useLikes } from "@/hooks/use-likes"
import { HeartIcon, FolderOpenIcon, UsersIcon, BriefcaseIcon, TrashIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/components/main-sidebar/utils/sidebar.utils"
import {mockSavedSpecialists, mockServices} from "@/services/mock-data";
import {Service, Specialist} from "@/types/common";
import {v4 as uuidv4} from "uuid";
import {Pentagram} from "@/components/icons/icon-pentagram";

export function SavedSection() {
  const router = useRouter()
  const { getLikedItems } = useLikes()
  const [activeTab, setActiveTab] = useState<"specialists" | "services">("specialists")
  const [savedSpecialists, setSavedSpecialists] = useState<Specialist[]>([])
  const [savedServices, setSavedServices] = useState<Service[]>([])
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)

  // Load saved items - for demo, show all items as saved
  useEffect(() => {
    // In a real app, this would filter based on actual liked items
    // For demo purposes, we'll show all items as saved
    setSavedSpecialists(mockSavedSpecialists)
    setSavedServices(mockServices)
  }, [])

  const totalSaved = savedSpecialists.length + savedServices.length
  const currentItems = activeTab === "specialists" ? savedSpecialists : savedServices
  const currentCount = currentItems.length

  const handleClearAll = () => {
    if (activeTab === "specialists") {
      setSavedSpecialists([])
    } else {
      setSavedServices([])
    }
    setIsClearDialogOpen(false)
  }

  const handleBrowseSpecialists = () => {
    // Generate new search ID and navigate
    const newSearchId = uuidv4()
    router.push(`/search/${newSearchId}`)
  }

  const handleBrowseServices = () => {
    // Generate new search ID and navigate
    const newSearchId = uuidv4()
    router.push(`/search/${newSearchId}`)
  }

  return (
    <div className="w-full max-w-[935px] mx-auto px-4 lg:px-6 space-y-6 transition-all duration-300 gap-3">
      <div className="bg-white dark:bg-gray-800 rounded-sm shadow-sm  overflow-hidden max-w-4xl mx-auto border-none ">
      {/* Enhanced Tabs */}
        <div className="p-3 rounded-sm shadow-sm border-none rounded-b-none">
          <div className="flex space-x-3">
            <button
                onClick={() => setActiveTab("specialists")}
                className={cn(
                    "flex-1 px-4 lg:px-6 py-3 rounded-lg font-medium transition-all duration-200",
                    "flex items-center justify-center gap-3 lg:gap-3",
                    activeTab === "specialists"
                        ? "bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm ring-1 ring-violet-100 dark:ring-violet-800"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50",
                )}
            >
              <UsersIcon className="h-4 w-4" />
              <span className="text-sm lg:text-base">Specialists</span>
              {savedSpecialists.length > 0 && (
                  <Badge
                      variant="secondary"
                      className={cn(
                          "text-xs min-w-[20px] h-5",
                          activeTab === "specialists"
                              ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 "
                              : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300",
                      )}
                  >
                    {savedSpecialists.length}
                  </Badge>
              )}
            </button>
            <button
                onClick={() => setActiveTab("services")}
                className={cn(
                    "flex-1 px-4 lg:px-6 py-3 rounded-lg font-medium transition-all duration-200",
                    "flex items-center justify-center gap-2 lg:gap-3",
                    activeTab === "services"
                        ? "bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm ring-1 ring-violet-100 dark:ring-violet-800"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50",
                )}
            >
              <BriefcaseIcon className="h-4 w-4" />
              <span className="text-sm lg:text-base">Services</span>
              {savedServices.length > 0 && (
                  <Badge
                      variant="secondary"
                      className={cn(
                          "text-xs min-w-[20px] h-5",
                          activeTab === "services"
                              ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800"
                              : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300",
                      )}
                  >
                    {savedServices.length}
                  </Badge>
              )}
            </button>
          </div>
        </div>

        {/* Content Grid with Enhanced Spacing */}
        <div
            className="min-h-[420px] p-3 gap-3 p-3"
            style={{
              transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
            }}
        >
          {activeTab === "specialists" && (
              <>
                {savedSpecialists.length === 0 ? (
                    <Card className="p-9 lg:p-9 shadow-sm rounded-lg ">
                      <div className="text-center py-12">
                        <Pentagram className="mx-auto h-12 w-12 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No saved specialists</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                          Start exploring and save specialists you're interested in
                        </p>
                        <Button
                            onClick={handleBrowseSpecialists}
                            className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
                        >
                          Browse Specialists
                        </Button>
                      </div>
                    </Card>
                ) : (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3"
                        style={{
                          transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
                        }}
                    >
                      {savedSpecialists.map((specialist) => (
                          <div key={specialist.id} className="hover:scale-[1.02] transition-transform duration-200">
                            <InstagramSpecialistCard specialist={specialist} />
                          </div>
                      ))}
                    </div>
                )}
              </>
          )}

          {activeTab === "services" && (
              <>
                {savedServices.length === 0 ? (
                    <Card className="p-6 lg:p-8 shadow-sm rounded-lg">
                      <div className="text-center py-12">
                        <FolderOpenIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No saved services</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                          Discover amazing services and save the ones you'd like to try
                        </p>
                        <Button
                            onClick={handleBrowseServices}
                            className="bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
                        >
                          Browse Services
                        </Button>
                      </div>
                    </Card>
                ) : (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3"
                        style={{
                          transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
                        }}
                    >
                      {savedServices.map((service) => (
                          <div key={service.id} className="hover:scale-[1.02] transition-transform duration-200">
                            <InstagramServiceCard service={service} />
                          </div>
                      ))}
                    </div>
                )}
              </>
          )}
        </div>
      </div>
    </div>
  )
}
