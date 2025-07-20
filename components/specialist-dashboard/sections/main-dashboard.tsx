"use client"
import { mockDashboardStats } from "@/services/mock-dash"
import { CalendarDays, DollarSign, Users, Clock } from "lucide-react"
import { StatsCard } from "../components/stats-card"
import { RevenueChartCard } from "../components/revenue-chart-card"
import { RecentBookingsCard } from "../components/recent-bookings-card"
import { UpcomingAppointmentsCard } from "../components/upcoming-appointments-card"
import { PerformanceMetricsCard } from "../components/performance-metrics-card"

export function MainDashboard() {
  const { topStats, practiceOverview, activityOverview, upcomingActivities } = mockDashboardStats

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Общий доход"
          value="₽45,231"
          change="+20.1% с прошлого месяца"
          changeType="positive"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Клиенты"
          value="+2350"
          change="+180.1% с прошлого месяца"
          changeType="positive"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Записи"
          value="+12,234"
          change="+19% с прошлого месяца"
          changeType="positive"
          icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Активные сейчас"
          value="+573"
          change="+201 с прошлого часа"
          changeType="positive"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChartCard />
        <RecentBookingsCard />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <UpcomingAppointmentsCard />
        <PerformanceMetricsCard />
      </div>
    </div>
  )
}
