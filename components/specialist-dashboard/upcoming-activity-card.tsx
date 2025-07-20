import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Repeat2, User } from "lucide-react"
import { RubleIcon } from "@/components/ui/ruble-sign"

interface Client {
  name: string
  avatar?: string
}

interface Service {
  name: string
  price: number
}

interface Status {
  text: string
  color: string
}

interface UpcomingActivityCardProps {
  startTime: string
  endTime: string
  client: Client
  service: Service
  duration: string
  format: string
  isBackToBack?: boolean
  isRepeat?: boolean
  status: Status
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
  status,
}: UpcomingActivityCardProps) {
  return (
    <div className="h-21 p-1 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex h-full">
        {/* Left column - Time and Avatar */}
        <div className="flex flex-col items-center justify-between py-1 pr-2">
          <div className={`text-xs font-medium ${isBackToBack ? "text-pink-500" : "text-gray-900"}`}>{startTime}</div>
          <Avatar className="w-6 h-6">
            <AvatarImage src={client.avatar || "/placeholder.svg"} alt={client.name} />
            <AvatarFallback className="text-xs">{client.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-xs text-gray-500">{endTime}</div>
        </div>

        {/* Main content */}
        <div className="flex-1 ml-5 py-1">
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-900 line-clamp-2">{service.name}</div>
            <div className="pb-2">
              <div className="text-xs text-gray-600">{client.name}</div>
            </div>
          </div>
        </div>

        {/* Right column - Tags and Status */}
        <div className="flex flex-col justify-between items-end py-1 pl-2">
          {/* Status row */}
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-600">{status.text}</span>
            <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: status.color }} />
          </div>

          {/* Icon row */}
          <div className="flex items-center">
            {isRepeat ? <Repeat2 size={14} className="text-gray-500" /> : <User size={14} className="text-gray-500" />}
          </div>

          {/* Price row */}
          <div className="flex items-center space-x-1">
            <span className="text-xs font-medium text-gray-900">{service.price}</span>
            <RubleIcon size={12} className="text-gray-900" />
          </div>

          {/* Tags row */}
          <div className="flex flex-col space-y-1">
            <Badge variant="secondary" className="h-8 text-xs px-2">
              {duration}
            </Badge>
            <Badge variant="secondary" className="h-8 text-xs px-2">
              {format}
            </Badge>
          </div>

          {/* Menu dots */}
          <div className="flex items-center">
            <MoreHorizontal size={14} className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
