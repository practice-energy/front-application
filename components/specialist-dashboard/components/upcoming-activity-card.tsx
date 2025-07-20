"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface UpcomingActivityCardProps {
  activity: {
    id: string
    startTime: string
    endTime: string
    duration: string
    format: "video" | "in-person"
    service: {
      id: string
      name: string
    }
    client: {
      id: string
      name: string
      avatar?: string
    }
  }
}

export function UpcomingActivityCard({ activity }: UpcomingActivityCardProps) {
  return (
    <Card className="h-21 p-1">
      <CardContent className="p-0 h-full flex">
        {/* Left column - times and avatar */}
        <div className="flex flex-col items-center justify-between py-1">
          <div className="text-xs font-medium text-black">{activity.startTime}</div>
          <Link href={`/specialist/${activity.client.id}`}>
            <Avatar className="h-6 w-6 aspect-square cursor-pointer hover:opacity-80">
              <AvatarImage src={activity.client.avatar || "/placeholder.jpg"} />
              <AvatarFallback className="text-xs">{activity.client.name[0]}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="text-xs text-gray-600">{activity.endTime}</div>
        </div>

        {/* Middle column - service and client info */}
        <div className="ml-5 flex-1 flex flex-col justify-center">
          <Link
            href={`/service/${activity.service.id}`}
            className="text-sm font-medium text-black hover:text-purple-600 cursor-pointer truncate block"
          >
            {activity.service.name}
          </Link>
          <div className="pb-2" />
          <Link
            href={`/specialist/${activity.client.id}`}
            className="text-xs text-gray-600 hover:text-purple-600 cursor-pointer truncate block"
          >
            {activity.client.name}
          </Link>
        </div>

        {/* Right column - duration and format badges */}
        <div className="flex flex-col justify-center space-y-1">
          <Badge
            variant="outline"
            className="h-8 text-xs bg-gray-100 text-gray-700 rounded-sm border-transparent hover:bg-gray-100"
          >
            {activity.duration}
          </Badge>
          <Badge
            variant="outline"
            className="h-8 text-xs bg-gray-100 text-gray-700 rounded-sm border-transparent hover:bg-gray-100"
          >
            {activity.format === "video" ? "Видео" : "Очно"}
          </Badge>
        </div>

        {/* Far right column - chat item style (3 lines) */}
        <div className="flex flex-col justify-center ml-2">
          <div className="w-1 h-1 bg-gray-300 rounded-full mb-1"></div>
          <div className="w-1 h-1 bg-gray-300 rounded-full mb-1"></div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </CardContent>
    </Card>
  )
}
