import {ActivityStatus, Format} from "@/types/common";

export interface UpcomingActivity {
  id: string
  start: Date
  end: Date
  duration: number
  format: Format
  status?: ActivityStatus
  client: {
    id: string
    name: string
    avatar?: string
  }
  specialist: {
    id: string
    name: string
    avatar?: string
  }
  isRepeat: boolean
  service: {
    id: string
    name: string
    description: string
  }
  price: number
  practiceCount?: number
}

export interface DashboardStats {
  upcomingActivities: {
    activities: UpcomingActivity[]
  }
}
