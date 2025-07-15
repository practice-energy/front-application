import type { ComponentType } from "react"

export interface TopStat {
  value: number | string
  label: string
  subtext: string
  icon: ComponentType<{ className?: string }>
}

export interface OverviewStat {
  value: number | string
  label: string
  icon: ComponentType<{ className?: string }>
}

export interface ActivityStat {
  value: number | string
  label: string
  icon: ComponentType<{ className?: string }>
  isCurrency?: boolean
}

export interface PracticeOverview {
  title: string
  subtitle: string
  stats: OverviewStat[]
}

export interface ActivityOverview {
  title: string
  stats: ActivityStat[]
}

export interface UpcomingActivity {
  id: string
  date: Date
  client: {
    id: string
    name: string
  }
  service: {
    id: string
    name: string
    price: number
  }
  format: "video" | "in-person"
}

export interface DashboardStats {
  topStats: TopStat[]
  practiceOverview: PracticeOverview
  activityOverview: ActivityOverview
  upcomingActivities: {
    title: string
    activities: UpcomingActivity[]
  }
}
