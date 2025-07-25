import { v4 as uuidv4 } from "uuid"
import type { DashboardStats } from "@/types/dashboard"

const mockDashboardStats: DashboardStats = {
  topStats: {
    activePracticesCount: 10,
    unreadCount: 10,
    issuesCount: 10,
    slotsApprovedCount: 10,
    unreadsForTodayactivities: 10,
  },
  practiceOverview: {
    confirmedSlots: 24,
    newInitiants: 5,
    personalMeetings: 18,
    repeatingMeetings: 6
  },
  activityOverview: {
    fillRate: 78,
    totalEarningsPredict: 12500
  },
  awaitingAttention: {},
  upcomingActivities: {
    activities: [
      {
        id:uuidv4(),
        start: new Date("2023-05-15T10:00:00"),
        end: new Date("2023-05-15T11:00:00"),
        duration: 60,
        format: "video",
        status: "confirmed",
        client: {
          id: uuidv4(),
          name: "Иван Петров",
          avatar: "/placeholder.jpg"
        },
        isRepeat: true,
        service: {
          id: uuidv4(),
          name: "Консультация по тревожности из-за спазмов в шмурдяке и головном мозге единорога",
          price: 3500,
          description: "Боль моя дырка задница"
        }
      },
      {
        id:uuidv4(),
        start: new Date("2023-05-15T12:00:00"),
        end: new Date("2023-05-15T13:30:00"),
        duration: 90,
        format: "in-person",
        status: "waiting",
        isRepeat: true,
        client: {
          id: uuidv4(),
          name: "Иван Петров",
          avatar: "/placeholder.jpg"
        },
        service: {
          id: uuidv4(),
          name: "Консультация по тревожности",
          price: 3500,
          description: "Боль моя дырка задница"
        }
      },
      {
        id: uuidv4(),
        start: new Date("2023-05-16T09:00:00"),
        end: new Date("2023-05-16T09:50:00"),
        duration: 50,
        format: "video",
        status: "request",
        isRepeat: false,
        client: {
          id: uuidv4(),
          name: "Иван Петров",
          avatar: "/placeholder.jpg"
        },
        service: {
          id: uuidv4(),
          name: "Консультация по тревожности",
          price: 3500,
          description: "Боль моя дырка задница"
        }
      },
      {
        id: uuidv4(),
        start: new Date("2023-05-16T09:00:00"),
        end: new Date("2023-05-16T09:50:00"),
        duration: 50,
        format: "video",
        status: "request",
        isRepeat: false,
        client: {
          id: uuidv4(),
          name: "Иван Петров",
          avatar: "/placeholder.jpg"
        },
        service: {
          id: uuidv4(),
          name: "Консультация по тревожности",
          price: 3500,
          description: "Боль моя дырка задница"
        }
      },
      {
        id: uuidv4(),
        start: new Date("2023-05-16T09:00:00"),
        end: new Date("2023-05-16T09:50:00"),
        duration: 50,
        format: "video",
        status: "request",
        isRepeat: false,
        client: {
          id: uuidv4(),
          name: "Иван Петров",
          avatar: "/placeholder.jpg"
        },
        service: {
          id: uuidv4(),
          name: "Консультация по тревожности",
          price: 3500,
          description: "Боль моя дырка задница"
        }
      },
      {
        id: uuidv4(),
        start: new Date("2023-05-16T09:50:00"),
        end: new Date("2023-05-17T09:50:00"),
        duration: 50,
        format: "video",
        status: "request",
        isRepeat: false,
        client: {
          id: uuidv4(),
          name: "Иван Петров",
          avatar: "/placeholder.jpg"
        },
        service: {
          id: uuidv4(),
          name: "Консультация по тревожности",
          price: 11500,
          description: "Боль моя дырка задница"
        }
      },
      {
        id: uuidv4(),
        start: new Date("2023-05-16T09:50:00"),
        end: new Date("2023-05-17T09:50:00"),
        duration: 50,
        format: "video",
        status: "request",
        isRepeat: false,
        client: {
          id: uuidv4(),
          name: "Иван Петров",
          avatar: "/placeholder.jpg"
        },
        service: {
          id: uuidv4(),
          name: "Консультация по тревожности",
          price: 3500,
          description: "Боль моя дырка задница"
        }
      }
    ]
  }
};

export { mockDashboardStats };
