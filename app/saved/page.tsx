"use client"

import { useState, useEffect } from "react"
import { InstagramSpecialistCard } from "@/components/instagram-specialist-card"
import { mockSavedSpecialists } from "@/services/mock-specialists"
import { Specialist } from "@/types/specialist"

export default function SavedPage() {
  const [savedSpecialists, setSavedSpecialists] = useState<Specialist[]>([])

  useEffect(() => {
    setSavedSpecialists(mockSavedSpecialists)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {savedSpecialists.map((specialist) => (
                <div key={specialist.id} className="w-full max-w-[300px]">
                  <InstagramSpecialistCard specialist={specialist} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
