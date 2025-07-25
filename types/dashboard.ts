export interface PracticeOverview {
  confirmedSlots: number
  newInitiants: number
  personalMeetings: number
  repeatingMeetings: number
}

export interface TopStats {
  activePracticesCount: number
  unreadCount: number
  issuesCount: number
  slotsApprovedCount: number
  unreadsForTodayactivities: number
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
  format: "video" | "in-person"
  status?: "waiting" | "confirmed" | "request"
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
  topStats: TopStats
  practiceOverview: PracticeOverview
  activityOverview: ActivityOverview
  upcomingActivities: {
    activities: UpcomingActivity[]
  }
  awaitingAttention: {
    activities: UpcomingActivity[]
  }

}
