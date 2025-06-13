"use client"

import { Heart, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "@/hooks/use-translations"

interface Specialist {
  id: number
  image: string
  name: string
  title: string
  location: string
  rating: number
  reviews: number
  specialties: string[]
  isNew: boolean
}

interface SpecialistCardProps {
  specialist: Specialist
  onClick?: () => void
  showSpecialties?: boolean
}

export function SpecialistCard({ specialist, onClick, showSpecialties = false }: SpecialistCardProps) {
  const { t } = useTranslations()

  return (
    <Card
      className="group cursor-pointer border border-border shadow-sm hover:shadow-md transition-all duration-200 rounded-xl overflow-hidden bg-card"
      onClick={onClick || (() => console.log(`Viewing profile of ${specialist.name}`))}
    >
      <div className="relative">
        {/* Profile Image */}
        <div className="relative aspect-square rounded-t-xl overflow-hidden">
          <img
            src={specialist.image || "/placeholder.svg"}
            alt={specialist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />

          {/* Heart button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation()
              console.log(`Added ${specialist.name} to favorites`)
            }}
          >
            <Heart className="h-3.5 w-3.5 text-gray-600" />
          </Button>

          {/* New badge */}
          {specialist.isNew && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 text-xs px-2 py-0.5">
              {t("common.new")}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Name and Rating */}
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 mr-2">
              <h3 className="font-bold text-base text-gray-900 mb-0.5">{specialist.name}</h3>
              <p className="text-xs text-gray-600">{specialist.title}</p>
            </div>
            <div className="flex items-center space-x-1 bg-gray-50 rounded-full px-1.5 py-0.5">
              <Star className="h-3 w-3 fill-current text-yellow-400" />
              <span className="text-xs font-medium text-gray-900">{specialist.rating}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3 text-gray-400" />
            <span className="text-xs text-gray-500">{specialist.location}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">
              {specialist.reviews} {t("specialist.practices")}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
