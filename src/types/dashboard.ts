import {ActivityStatus, Format} from "@/types/common";

export interface PracticeOverview {
  confirmedSlots: number
  newInitiants: number
  personalMeetings: number
  repeatingMeetings: number
}

export interface ActivityOverview {
  fillRate: number
  totalEarningsPredict: number
}

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
  isRepeat: boolean
  service: {
    id: string
    name: string
    price: number
    description: string
  }
  practiceCount?: number
}

export interface DashboardStats {
  practiceOverview: PracticeOverview
  activityOverview: ActivityOverview
  upcomingActivities: {
    activities: UpcomingActivity[]
  }
}
