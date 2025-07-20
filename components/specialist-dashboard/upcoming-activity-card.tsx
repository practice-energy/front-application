"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Video, MapPin } from "lucide-react"

interface UpcomingActivityCardProps {
  startTime: string
  endTime: string
  service: {
    name: string
  }
  client: {
    name: string
    avatar?: string
  }
  duration: string
  format: "video" | "offline"
}

export function UpcomingActivityCard({
  startTime,
  endTime,
  service,
  client,
  duration,
  format,
}: UpcomingActivityCardProps) {
  return (
    <div className="h-21 p-1 flex items-start gap-5">
      {/* Left column - time and avatar */}
      <div className="flex flex-col items-center">
        <div className="text-sm font-medium text-black">{startTime}</div>
        <Avatar className="h-6 w-6 aspect-square my-1">
          <AvatarImage src={client.avatar || "/placeholder.jpg"} />
          <AvatarFallback className="text-xs">{client.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-sm text-gray-500">{endTime}</div>
      </div>

      {/* Service and client info */}
      <div className="flex-1 min-w-0">
        <div className="pb-2">
          <p className="text-sm font-medium text-black truncate">{service.name}</p>
          <p className="text-sm font-medium text-black truncate">{service.name}</p>
        </div>
        <p className="text-xs text-gray-600 truncate">{client.name}</p>
      </div>

      {/* Duration and format badges */}
      <div className="flex flex-col gap-1">
        <Badge variant="outline" className="h-8 text-xs bg-gray-100 text-gray-700 rounded-sm border-transparent">
          {duration}
        </Badge>
        <Badge variant="outline" className="h-8 text-xs bg-gray-100 text-gray-700 rounded-sm border-transparent">
          {format === "video" ? (
            <>
              <Video className="h-3 w-3 mr-1" />
              Видео
            </>
          ) : (
            <>
              <MapPin className="h-3 w-3 mr-1" />
              Очно
            </>
          )}
        </Badge>
      </div>

      {/* Right column - similar to chat-item structure */}
      <div className="flex flex-col items-end">
        <div className="text-xs text-gray-500">строка 1</div>
        <div className="text-xs text-gray-500">строка 2</div>
        <div className="text-xs text-gray-500">строка 3</div>
      </div>
    </div>
  )
}
