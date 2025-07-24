"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  PieChartIcon as ChartPie,
  CheckCheck,
  Flag,
  LayoutGrid,
  MessageSquareText,
  Repeat2,
  User,
  Users,
} from "lucide-react"
import { RubleIcon } from "@/components/ui/ruble-sign"
import { mockDashboardStats } from "@/services/mock-dash"
import { TopStatsCard } from "../top-stats-card"
import { OverviewStatCard } from "../overview-stat-card"
import { UpcomingActivityCard } from "../upcoming-activity-card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function MainDashboard() {
  const stats = mockDashboardStats

  function pluralize(number: number, one: string, few: string, many:string) {
    const n = Math.abs(number)
    const n10 = n % 10
    const n100 = n % 100

    if (n10 === 1 && n100 !== 11) return one
    if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return few
    return many
  }

  function formatDate() {
    const today = new Date()
    const weekdays = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"]
    const weekday = weekdays[today.getDay()]
    const day = today.getDate()
    const months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря",
    ]
    const month = months[today.getMonth()]
    return { weekday, day, month }
  }

  const { weekday, day, month } = formatDate()

  return (
      <div className="flex justify-center w-full">
        <div className="flex flex-col space-y-6 p-2 w-[1150px]">
          {/* Top Stats Cards - full width */}
          <div className="flex gap-6 w-full">
            <TopStatsCard
                icon={<LayoutGrid size={24} className="text-neutral-600" />}
                title={`${stats.topStats.activePracticesCount} ${pluralize(stats.topStats.activePracticesCount, "практика активна", "практики активны", "практик активно")}`}
                subtitle={`${stats.topStats.slotsApprovedCount} ${pluralize(stats.topStats.slotsApprovedCount, "слот подтвержден", "слота подтверждены", "слотов подтверждено")} на 90 дней`}
            />
            <TopStatsCard
                icon={<MessageSquareText size={24} className="text-neutral-600" />}
                title={`${stats.topStats.activePracticesCount} ${pluralize(stats.topStats.activePracticesCount, "непрочитанное сообщение", "непрочитанных сообщения", "непрочитанных сообщений")}`}
                subtitle="в чатах практис"
            />
            <TopStatsCard
                icon={<Flag size={24} className="text-pink-500" />}
                title={`${stats.topStats.issuesCount} ${pluralize(stats.topStats.issuesCount, "ишью нуждается", "ишью нуждаются", "ишью нуждаются")} во внимании`}
                subtitle={`${stats.topStats.unreadsForTodayactivities} ${pluralize(stats.topStats.unreadsForTodayactivities, "касается активности", "касаются активностей", "касаются активностей")} на сегодня`}
            />
          </div>

          {/* Main content area - using flex without width constraint */}
          <div className="flex gap-6 w-full">
            {/* Left section - fixed 450px width */}
            <div className="flex flex-col gap-6 w-[450px] flex-shrink-0">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center">
                    <CardTitle className="text-lg text-black">Обзор практик</CardTitle>
                    <p className="text-sm text-gray-500 ml-auto">Cледующие 30 дней</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <OverviewStatCard
                        value={stats.practiceOverview.confirmedSlots}
                        label="Подтвержденные слоты"
                        icon={<CheckCheck size={24} className="text-neutral-600" />}
                    />
                    <OverviewStatCard
                        value={stats.practiceOverview.newInitiants}
                        label="Новые иницианты"
                        icon={<User size={24} className="text-neutral-600" />}
                    />
                    <OverviewStatCard
                        value={stats.practiceOverview.personalMeetings}
                        label="Очные встречи"
                        icon={<Users size={24} className="text-neutral-600" />}
                    />
                    <OverviewStatCard
                        value={stats.practiceOverview.repeatingMeetings}
                        label="Повторные"
                        icon={<Repeat2 size={24} className="text-neutral-600" />}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center">
                    <CardTitle className="text-lg text-black">Обзор активности</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <OverviewStatCard
                        value={stats.activityOverview.totalEarningsPredict}
                        label="Прогноз выручки"
                        icon={<RubleIcon size={24} bold={false} className="text-neutral-600" />}
                    />
                    <OverviewStatCard
                        value={`${stats.activityOverview.fillRate}%`}
                        label="Плотность заполнения слотов"
                        icon={<ChartPie size={24} className="text-neutral-600" />}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right section - fixed 652px width */}
            <div className="flex-1 w-full"> {/* Allows this section to grow but not shrink below content */}
              <Card className="border-0 shadow-md h-full">
                <CardHeader>
                  <div className="flex items-center">
                    <CardTitle className="text-lg text-black">
                      Предстоящие активности на {weekday} {day} {month}
                    </CardTitle>
                    <p className="text-sm text-gray-500 ml-auto">Расписание</p>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {stats.upcomingActivities.activities.length > 0 ? (
                      <div className="relative">
                        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
                        <ScrollArea className="h-[490px] px-6">
                          <div className="space-y-2">
                            {stats.upcomingActivities.activities.map((activity, index) => {
                              const isBackToBack =
                                  index > 0 &&
                                  stats.upcomingActivities.activities[index - 1].end.getTime() === activity.start.getTime()

                              return (
                                  <div key={activity.id} className="pb-1">
                                    <UpcomingActivityCard
                                        startTime={activity.start.toLocaleTimeString("ru-RU", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                        endTime={activity.end.toLocaleTimeString("ru-RU", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                        client={activity.client}
                                        service={activity.service}
                                        duration={`${activity.duration} мин`}
                                        format={activity.format}
                                        isBackToBack={isBackToBack}
                                        isRepeat={activity.isRepeat}
                                        status={activity.status}
                                    />
                                  </div>
                              )
                            })}
                          </div>
                        </ScrollArea>
                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
                      </div>
                  ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-400 h-[600px] px-6 w-[652px]">
                        <Calendar className="w-12 h-12 mb-2" />
                        <p>Запланированные активности появятся здесь</p>
                      </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
  )
}