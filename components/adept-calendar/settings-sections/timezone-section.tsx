"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import type { CalendarRestrictions } from "@/types/calendar-event"
import { LocationInput } from "@/components/location-input"

interface TimezoneSectionProps {
  restrictions: CalendarRestrictions
  onUpdate: (restrictions: CalendarRestrictions) => void
}

const timezones = [
  "GMT",
  "GMT+1",
  "GMT+2",
  "GMT+3",
  "GMT+4",
  "GMT+5",
  "GMT+6",
  "GMT+7",
  "GMT+8",
  "GMT+9",
  "GMT+10",
  "GMT+11",
  "GMT+12",
  "GMT-1",
  "GMT-2",
  "GMT-3",
  "GMT-4",
  "GMT-5",
  "GMT-6",
  "GMT-7",
  "GMT-8",
  "GMT-9",
  "GMT-10",
  "GMT-11",
  "GMT-12",
]

export function TimezoneSection({ restrictions, onUpdate }: TimezoneSectionProps) {
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleTimezoneSelect = (timezone: string) => {
    onUpdate({
      ...restrictions,
      gmt: timezone,
    })
    setShowTimezoneDropdown(false)
  }

  const handleLocationSelect = (location: string) => {
    onUpdate({
      ...restrictions,
      location: location,
    })
    setShowTimezoneDropdown(false)
  }

  // Закрываем dropdown при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTimezoneDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="space-y-2">
      <LocationInput value={restrictions.location || ""} onChange={handleLocationSelect} />

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
          className="flex items-center gap-2 px-3 py-1 text-sm border rounded-sm hover:bg-gray-50 w-full h-10"
        >
          <span>{restrictions.gmt || "GMT+3"}</span>
          <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${showTimezoneDropdown ? "rotate-180" : ""}`} />
        </button>

        {showTimezoneDropdown && (
          <div
              className="absolute right-0 z-50 mt-1 w-32 max-h-60 overflow-y-auto bg-white border rounded-md shadow-lg"
              style={{ zIndex: 100 }}
          >
            {timezones.map((tz) => (
              <div
                key={tz}
                onClick={() => handleTimezoneSelect(tz)}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  restrictions.gmt === tz ? "bg-violet-50 text-violet-600" : ""
                }`}
              >
                {tz}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
