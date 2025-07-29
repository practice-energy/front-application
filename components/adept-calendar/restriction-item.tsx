"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Restriction } from "@/types/calendar-event"
import { User, Video, Clock } from "lucide-react"

interface RestrictionItemProps {
  restriction: Restriction
  onUpdate: (restriction: Restriction) => void
  showDate?: boolean
  date?: string
}

export function RestrictionItem({ restriction, onUpdate, showDate, date }: RestrictionItemProps) {
  return (
    <div>
      {showDate && date && <div className="text-sm text-gray-600 mb-2">{date}</div>}
      <Card className="p-4">
        <CardContent className="p-0">
          <div className="space-y-4">
            {/* Time slots */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">09:00</span>
                <div className="w-8 h-px bg-gray-300"></div>
                <span className="text-sm">15:00</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">00:00</span>
                <div className="w-4 h-4 bg-green-400 rounded"></div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">13:00</span>
                <Clock className="w-4 h-4" />
                <span className="text-sm">17:00</span>
                <Clock className="w-4 h-4" />
                <span className="text-sm">00:00</span>
              </div>
            </div>

            {/* Format buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                <User className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
