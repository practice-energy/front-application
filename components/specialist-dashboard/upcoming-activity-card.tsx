import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Repeat2, User } from "lucide-react"
import { RubleIcon } from "@/components/ui/ruble-sign"

interface UpcomingActivityCardProps {
  startTime: string
  endTime: string
  client: {
    name: string
    avatar?: string
  }
  service: {
    name: string
    price: number
  }
  duration: string
  format: string
  isBackToBack?: boolean
  isRepeat?: boolean
  status?: {
    text: string
    color: string
  }
}

export function UpcomingActivityCard({
  startTime,
  endTime,
  client,
  service,
  duration,
  format,
  isBackToBack = false,
  isRepeat = false,
  status = { text: "Подтверждено", color: "bg-green-500" },
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

      {/* Right column - status, repeat/user icon, price */}
      <div className="flex flex-col justify-between h-full text-xs">
        {/* Status line */}
        <div className="flex items-center gap-1">
          <span className="text-gray-600">{status.text}</span>
          <div className={`w-2 h-2 rounded-sm ${status.color}`} />
        </div>

        {/* Repeat/User icon line */}
        <div className="flex items-center justify-center">
          {isRepeat ? <Repeat2 size={12} className="text-gray-500" /> : <User size={12} className="text-gray-500" />}
        </div>

        {/* Price line */}
        <div className="flex items-center gap-1">
          <span className="text-gray-600">{service.price}</span>
          <RubleIcon size={12} className="text-gray-600" />
        </div>
      </div>
    </div>
  )
}
