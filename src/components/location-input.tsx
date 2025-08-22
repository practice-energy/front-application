"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Input } from "@/src/components/ui/input"
import { Button } from "@/src/components/ui/button"
import { MapPin, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { cn } from "@/src/lib/utils"

interface LocationSuggestion {
  city: string
  country: string
  formatted: string
}

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
  error?: string
  disabled?: boolean
}

// Список стран СНГ для фильтрации
const CIS_COUNTRIES = [
  "Россия",
  "Азербайджан",
  "Армения",
  "Беларусь",
  "Казахстан",
  "Кыргызстан",
  "Молдова",
  "Таджикистан",
  "Туркменистан",
  "Узбекистан",
  "Украина",
]

function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function LocationInput({
  value,
  onChange,
  placeholder = "Страна, город",
  className,
  error,
  disabled = false,
}: LocationInputProps) {
  const [locationInput, setLocationInput] = useState(value)
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const locationRef = useRef<HTMLDivElement>(null)

  const formatLocation = useCallback((city: string, country: string) => {
    return `${city}, ${country}`
  }, [])

  const searchLocations = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) {
        setLocationSuggestions([])
        return
      }

      setIsFetchingSuggestions(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query,
          )}&addressdetails=1&limit=5&accept-language=ru&countrycodes=ru,az,am,by,kz,kg,md,tj,tm,uz,ua`,
        )

        if (!response.ok) {
          throw new Error("Failed to fetch location suggestions")
        }

        const results = await response.json()

        const suggestions: LocationSuggestion[] = results
          .map((item: any) => {
            const address = item.address
            const country = address.country || ""
            const city = address.city || address.town || address.village || address.county || ""

            if (city && CIS_COUNTRIES.some((cisCountry) => country.includes(cisCountry))) {
              return {
                city,
                country,
                formatted: formatLocation(city, country),
              }
            }
            return null
          })
          .filter(Boolean)

        setLocationSuggestions(suggestions)
      } catch (error) {
        console.error("Error fetching location suggestions:", error)
        setLocationSuggestions([])
      } finally {
        setIsFetchingSuggestions(false)
      }
    }, 300),
    [formatLocation],
  )

  const handleLocationInputChange = (inputValue: string) => {
    setLocationInput(inputValue)
    onChange(inputValue)
    searchLocations(inputValue)
    setShowSuggestions(true)
  }

  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    const formattedValue = suggestion.formatted
    setLocationInput(formattedValue)
    onChange(formattedValue)
    setShowSuggestions(false)
  }

  const getLocationFromGeolocation = async () => {
    setIsGettingLocation(true)
    setShowSuggestions(false)

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser")
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        })
      })

      const { latitude, longitude } = position.coords

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=ru`,
      )

      if (!response.ok) {
        throw new Error("Failed to get location name")
      }

      const responseData = await response.json()
      const address = responseData.address
      const country = address.country || ""
      const city = address.city || address.town || address.village || ""

      if (city && CIS_COUNTRIES.some((cisCountry) => country.includes(cisCountry))) {
        const locationString = `${city}, ${country}`
        onChange(locationString)
        setLocationInput(locationString)
      } else {
        throw new Error("Location outside CIS countries")
      }
    } catch (error) {
      console.error("Error getting location:", error)
      alert("Unable to get your location or it's outside CIS countries. Please enter it manually.")
    } finally {
      setIsGettingLocation(false)
    }
  }

  useEffect(() => {
    setLocationInput(value)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={cn("space-y-2", className)} ref={locationRef}>
      <div className="relative">
        <div className="relative">
          <Input
            value={locationInput}
            onChange={(e) => handleLocationInputChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "pr-20 transition-all duration-200",
              "bg-white dark:bg-gray-800",
              "text-gray-900 dark:text-gray-100",
              "focus:border-violet-500 dark:focus:border-violet-400",
              error && "border-red-500 focus:border-red-500",
              className,
            )}
            onFocus={() => setShowSuggestions(true)}
          />

          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 mr-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setShowSuggestions(!showSuggestions)}
              disabled={disabled}
            >
              {showSuggestions ? (
                <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 mr-1 bg-violet-500 dark:bg-violet-400 hover:bg-colors-custom-accent dark:hover:bg-violet-300"
              onClick={getLocationFromGeolocation}
              disabled={isGettingLocation || disabled}
            >
              {isGettingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin text-violet-500 dark:text-violet-400" />
              ) : (
                <MapPin className="h-4 w-4 text-white dark:text-black" />
              )}
            </Button>
          </div>
        </div>

        {/* Location suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {isFetchingSuggestions ? (
              <div className="px-4 py-3 text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Загрузка...
              </div>
            ) : locationSuggestions.length > 0 ? (
              <ul className="py-1">
                {locationSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {suggestion.formatted}
                  </li>
                ))}
              </ul>
            ) : locationInput.length > 2 ? (
              <div className="px-4 py-3 text-gray-500 dark:text-gray-400">Не найдено</div>
            ) : (
              <div className="px-4 py-3 text-gray-500 dark:text-gray-400">Введите хотя бы 3 буквы для поиска</div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  )
}
