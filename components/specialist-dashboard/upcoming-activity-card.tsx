import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface UpcomingActivityCardProps {
  startTime: string
  endTime: string
  client: {
    name: string
    avatar?: string
  }
  service: {
    name: string
  }
  duration: string
  format: string
  isBackToBack?: boolean
}

export function UpcomingActivityCard({
  startTime,
  endTime,
  client,
  service,
  duration,
  format,
  isBackToBack = false,
}: UpcomingActivityCardProps) {
  return (
    <div className="h-21 p-1 flex items-start gap-5">
      {/* Left column - times and avatar */}
      <div className="flex flex-col items-center">
        <div className={`text-sm font-medium ${isBackToBack ? "text-pink-500" : ""}`}>{startTime}</div>
        <Avatar className="w-6 h-6 aspect-square my-1">
          <AvatarImage src={client.avatar || "/placeholder.svg"} />
          <AvatarFallback>
            <img src="/placeholder.jpg" alt="Client" className="w-full h-full object-cover" />
          </AvatarFallback>
        </Avatar>
        <div className="text-sm text-gray-500">{endTime}</div>
      </div>

      {/* Service and client info */}
      <div className="flex-1 ml-5">
        <div className="pb-2">
          <div className="text-sm font-medium">{service.name}</div>
          <div className="text-sm font-medium">{service.name}</div>
        </div>
        <div className="text-sm text-gray-600">{client.name}</div>
      </div>

      {/* Duration and format tags */}
      <div className="flex flex-col gap-1">
        <Badge variant="secondary" className="h-8 text-xs">
          {duration}
        </Badge>
        <Badge variant="outline" className="h-8 text-xs">
          {format}
        </Badge>
      </div>

      {/* Right column - 3 lines similar to chat-item */}
      <div className="flex flex-col justify-between h-full text-xs text-gray-500">
        <div>•</div>
        <div>•</div>
        <div>•</div>
      </div>
    </div>
  )
}
