"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useProfileStore } from "@/stores/profile-store"
import { Heart, MessageSquare, Star } from "lucide-react"
import type { SavedSpecialist } from "@/types/profile"

interface SpecialistCardGridProps {
  specialists: SavedSpecialist[]
}

export function SpecialistCardGrid({ specialists }: SpecialistCardGridProps) {
  const { removeSpecialist } = useProfileStore()

  const handleRemoveSpecialist = (specialistId: string) => {
    removeSpecialist(specialistId)
  }

  const handleMessageSpecialist = (specialistId: string) => {
    console.log("Messaging specialist:", specialistId)
    // Navigate to chat or open message modal
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {specialists.map((specialist) => (
        <Card key={specialist.id} className="relative group hover:shadow-lg transition-shadow">
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleRemoveSpecialist(specialist.id)}
              aria-label={`Remove ${specialist.name} from saved specialists`}
            >
              <Heart className="h-4 w-4 fill-current" />
            </Button>
          </div>

          <CardHeader className="text-center pt-6">
            <div className="relative mx-auto">
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarImage src={specialist.photo || "/placeholder.svg"} alt={specialist.name} />
                <AvatarFallback className="text-lg">
                  {specialist.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {specialist.isOnline && (
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <CardTitle className="text-lg">{specialist.name}</CardTitle>
            <CardDescription>
              <div className="flex items-center justify-center space-x-1 mb-2">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-medium">{specialist.rating}</span>
                <span className="text-gray-500">({specialist.reviewCount})</span>
              </div>
              <div className="text-lg font-semibold">${specialist.hourlyRate}/hour</div>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-1 justify-center">
              {specialist.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
            <div className="text-xs text-gray-500 text-center">
              Saved on {specialist.savedDate.toLocaleDateString()}
            </div>
          </CardContent>

          <CardFooter className="flex space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleMessageSpecialist(specialist.id)}
              tabIndex={0}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button className="flex-1" style={{ backgroundColor: "#8A4FFF" }}>
              Book Session
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
