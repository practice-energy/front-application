"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Card } from "@/src/components/ui/card"
import { InstagramSpecialistCard } from "@/src/components/instagram-specialist-card"
import { useLikes } from "@/src/hooks/use-likes"
import { useRouter } from "next/navigation"
import { ANIMATION_DURATION, ANIMATION_TIMING } from "@/src/components/main-sidebar/utils/sidebar.utils"
import {v4 as uuidv4} from "uuid";
import {Pentagram} from "@/src/components/icons/icon-pentagram";
import {mockSavedSpecialists} from "@/src/services/mock-specialists";
import {mockServices} from "@/src/services/mock-services";
import {Service} from "@/src/types/service";
import {Specialist} from "@/src/types/specialist";

export function SavedSection() {
  const router = useRouter()
  const [activeTab] = useState<"specialists" | "services">("specialists")
  const [savedSpecialists, setSavedSpecialists] = useState<Specialist[]>([])
  const [savedServices, setSavedServices] = useState<Service[]>([])

  // Load saved items - for demo, show all items as saved
  useEffect(() => {
    // In a real app, this would filter based on actual liked items
    // For demo purposes, we'll show all items as saved
    setSavedSpecialists(mockSavedSpecialists)
    setSavedServices(mockServices)
  }, [])

  const handleBrowseSpecialists = () => {
    // Generate new search ID and navigate
    const newSearchId = uuidv4()
    router.push(`/search/${newSearchId}`)
  }

  return (
    <div className="w-full mx-auto px-4 transition-all duration-300 gap-3">
      <div className="bg-white rounded-sm shadow-sm  overflow-hidden max-w-4xl mx-auto border-none ">
        {/* Content Grid with Enhanced Spacing */}
        <div
            className="p-3 gap-3"
            style={{
              transition: `all ${ANIMATION_DURATION}ms ${ANIMATION_TIMING}`,
            }}
        >
          {savedSpecialists.length === 0 ? (
              <Card className="p-9 lg:p-9 shadow-sm rounded-sm ">
                <div className="text-center py-12">
                  <Pentagram className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No saved specialists</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Start exploring and save specialists you're interested in
                  </p>
                  <Button
                      onClick={handleBrowseSpecialists}
                      className="bg-colors-custom-accent hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-colors-custom-accent"
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
        </div>
      </div>
    </div>
  )
}
