import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface TopStatsCardProps {
  icon: ReactNode
  title: string
  subtitle: string
}

export function TopStatsCard({ icon, title, subtitle }: TopStatsCardProps) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black leading-tight">{title}</p>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
