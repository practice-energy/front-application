"use client"

import { useState, useEffect } from "react"
import { InstagramSpecialistCard } from "@/src/components/instagram-specialist-card"
import { mockSavedSpecialists } from "@/src/services/mock-specialists"
import { Specialist } from "@/src/types/specialist"

export default function SavedPage() {
  const [savedSpecialists, setSavedSpecialists] = useState<Specialist[]>([])

  useEffect(() => {
    setSavedSpecialists(mockSavedSpecialists)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
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
