"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {User, MapPin, AlertCircle, Images, ChevronDown, ChevronUp, Map} from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"
import { SquareImageGallery } from "@/components/square-image-gallery"
import { cn } from "@/lib/utils"
import {LocationInput} from "@/components/location-input";
import {EnhancedInput} from "@/components/enhanced-input";

interface ExperienceItem {
  description: string
  certificate?: string | null
}

interface ProfileData {
  first_name: string
  last_name: string
  bio: string
  location: string
  photos: File[]
}

interface PersonalInfoCardProps {
  data: ProfileData
  isEditMode: boolean
  onInputChange: (field: keyof ProfileData, value: string | string[] | File[]) => void
  errors: Record<string, string>
}

// Список стран СНГ для фильтрации
const CIS_COUNTRIES = [
  'Россия', 'Азербайджан', 'Армения', 'Беларусь', 'Казахстан',
  'Кыргызстан', 'Молдова', 'Таджикистан', 'Туркменистан', 'Узбекистан', 'Украина'
]

function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function PersonalInfoCard({ data, isEditMode, onInputChange, errors }: PersonalInfoCardProps) {
  const [locationInput, setLocationInput] = useState(data.location)
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const locationRef = useRef<HTMLDivElement>(null)

  interface LocationSuggestion {
    city: string
    country: string
    formatted: string
  }
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])

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
                  query
              )}&addressdetails=1&limit=5&accept-language=ru&countrycodes=ru,az,am,by,kz,kg,md,tj,tm,uz,ua`
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

                if (city && CIS_COUNTRIES.some(cisCountry => country.includes(cisCountry))) {
                  return {
                    city,
                    country,
                    formatted: formatLocation(city, country)
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
      [formatLocation]
  )

  const handleLocationInputChange = (value: string) => {
    setLocationInput(value)
    searchLocations(value)
    setShowSuggestions(true)
    onInputChange("location", value)
  }

  useEffect(() => {
    setLocationInput(data.location)
  }, [data.location])

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
      <Card className="shadow-sm border-border bg-card dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg text-foreground dark:text-gray-100">Personal Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Photos Section */}
          <div className="space-y-3">
            {isEditMode ? (
                <PhotoUpload
                    photos={data.photos}
                    onPhotosChange={(photos) => onInputChange("photos", photos)}
                    maxPhotos={5}
                    title="Profile Photos"
                    description="Add photos to showcase your practice"
                    showTitle={false}
                />
            ) : (
                <div>
                  {data.photos.length > 0 ? (
                      <SquareImageGallery
                          images={data.photos}
                          alt="Profile photos"
                          ratioWidth={4}
                          ratioHeight={5}
                          orientation="vertical"
                          thumbnailsPerView={5}
                          borderRadius={8}
                      />
                  ) : (
                      <div className="text-center py-12 text-muted-foreground dark:text-gray-400">
                        <Images className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No photos uploaded yet</p>
                      </div>
                  )}
                </div>
            )}
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {isEditMode ? (
                  <div>
                    <EnhancedInput
                      label="First Name"
                      value={data.first_name || ""}
                      onChange={(e) => onInputChange("first_name", e.target.value)}
                      error={errors.name}
                      required
                      placeholder="Enter your first name"
                      showEditIcon
                    />
                    {errors.first_name && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {errors.first_name}
                        </div>
                    )}
                  </div>
              ) : (
                  <div>
                    <Label
                        className={cn(
                            "text-sm font-medium flex items-center gap-2 text-foreground dark:text-gray-200",
                        )}
                    >
                      First name
                    </Label>
                    <p className="text-lg font-medium text-foreground dark:text-gray-100 py-2">
                      {data.first_name || "Not specified"}
                    </p>
                  </div>
              )}
            </div>

            <div className="space-y-2">
              {isEditMode ? (
                  <div>
                    <EnhancedInput
                        label="Last Name"
                        value={data.last_name || ""}
                        onChange={(e) => onInputChange("last_name", e.target.value)}
                        error={errors.name}
                        required
                        placeholder="Enter your last name"
                        showEditIcon
                    />
                    {errors.last_name && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {errors.last_name}
                        </div>
                    )}
                  </div>
              ) : (
                  <div>
                    <Label
                        className={cn(
                            "text-sm font-medium flex items-center gap-2 text-foreground dark:text-gray-200",
                        )}
                    >
                      Last name
                    </Label>
                    <p className="text-lg font-medium text-foreground dark:text-gray-100 py-2">
                      {data.last_name || "Not specified"}
                    </p>
                  </div>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-foreground dark:text-gray-200">
              Bio
            </Label>
            {isEditMode ? (
                <div>
                  <Textarea
                      id="bio"
                      value={data.bio}
                      onChange={(e) => onInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className={cn(
                          "resize-none transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100",
                          errors.bio && "border-destructive focus-visible:ring-destructive",
                      )}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <div>
                      {errors.bio && (
                          <div className="flex items-center gap-1 text-sm text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            {errors.bio}
                          </div>
                      )}
                    </div>
                  </div>
                </div>
            ) : (
                <p className="text-foreground dark:text-gray-100 py-2 leading-relaxed">{data.bio || "No bio provided"}</p>
            )}
          </div>

          {/* Location with CIS countries dropdown */}
          <div className="space-y-2" ref={locationRef}>
            <Label className="text-sm font-medium flex items-center gap-2 text-foreground dark:text-gray-200">
              Location (CIS countries only)
            </Label>
            {isEditMode ? (
                <LocationInput
                    value={data.location || ""}
                    onChange={(value) => handleLocationInputChange(value)}
                    error={errors.location}
                    placeholder="Enter your city"
                />
            ) : (
                <p className="text-foreground dark:text-gray-100 py-2">{data.location || "Not specified"}</p>
            )}
          </div>
        </CardContent>
      </Card>
  )
}
