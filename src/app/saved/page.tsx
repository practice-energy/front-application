"use client"

import { useState, useEffect } from "react"
import { InstagramSpecialistCard } from "@/src/components/instagram-specialist-card"
import { mockSavedSpecialists } from "@/src/services/mock-specialists"
import { Specialist } from "@/src/types/specialist"
import { useSidebar } from "@/src/contexts/sidebar-context"
import { cn } from "@/src/lib/utils"

export default function SavedPage() {
  const [savedSpecialists, setSavedSpecialists] = useState<Specialist[]>([])
  const { isCollapsed } = useSidebar()

  useEffect(() => {
    setSavedSpecialists(mockSavedSpecialists)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out",
        isCollapsed ? "ml-0" : "ml-[400px]"
      )}>
        <div className="flex justify-center mt-[66px]">
          <div className="w-full ">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {savedSpecialists.map((specialist) => (
                <div key={specialist.id} className="w-full">
                  <InstagramSpecialistCard specialist={specialist} showActionButtons={true}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
