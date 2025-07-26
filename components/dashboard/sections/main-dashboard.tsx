"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCheck, LayoutGrid, Repeat2, User, Users, SquarePlus } from "lucide-react"
import { mockDashboardStats } from "@/services/mock-dash"
import { OverviewStatCard } from "../overview-stat-card"
import { UpcomingActivityCard } from "../upcoming-activity-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {AwaitingActivityCard} from "@/components/dashboard/awaiting-activity-card";

export function MainDashboard() {
  const stats = mockDashboardStats

  function pluralize(number: number, one: string, few: string, many: string) {
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
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ]
    const month = months[today.getMonth()]
    return { weekday, day, month }
  }

  const { weekday, day, month } = formatDate()

  return (
    <div className="flex justify-center w-full pt-16">
      <div className="flex gap-6 p-2 w-[1150px] pb-32">
        {/* Left column - Top Stats and left section */}
        <div className="flex flex-col flex-1 gap-6 w-[450px] flex-shrink-0 h-[850px]">
          {/* Top Stats Card with Add button */}
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <LayoutGrid size={24} className="text-neutral-600" />
                <div>
                  <p className="text-sm font-medium">
                    {`${stats.topStats.activePracticesCount} ${pluralize(stats.topStats.activePracticesCount, "практика активна", "практики активны", "практик активно")}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {`${stats.topStats.slotsApprovedCount} ${pluralize(stats.topStats.slotsApprovedCount, "слот подтвержден", "слота подтверждены", "слотов подтверждено")} на 90 дней`}
                  </p>
                </div>
              </div>
              <button className="gap-1 bg-violet-600 text-white aspect-square w-9 h-9 p-1.5 rounded-sm items-center">
                <SquarePlus size={24} />
              </button>
            </CardHeader>
          </Card>

          {/* Overview Stats Card */}
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

          {/* Upcoming Activities block for left section */}
          <Card className="border-0 shadow-md flex-1 rounded-sm">
            <CardHeader>
              <CardTitle className="text-lg text-neutral-700">Ожидают внимания</CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[316px] relative">
              {stats.upcomingActivities.activities.length > 0 ? (
                <>
                  <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
                  <ScrollArea className="h-full px-6">
                    <div className="space-y-2 py-4">
                      {stats.upcomingActivities.activities
                          .filter(activity => activity.status === "waiting")
                          .map((activity, index) => {
                            const isBackToBack =
                                index > 0 &&
                                stats.upcomingActivities.activities[index - 1].end.getTime() === activity.start.getTime()

                            return (
                                <div key={activity.id} className="pb-1">
                                  <AwaitingActivityCard
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
                                      duration={activity.duration}
                                      format={activity.format}
                                      isBackToBack={isBackToBack}
                                      isRepeat={activity.isRepeat}
                                      status={activity.status}
                                      date={activity.start}
                                  />
                                </div>
                            )
                          })}
                    </div>
                  </ScrollArea>
                  <div className="absolute -bottom-1 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Calendar className="w-12 h-12 mb-2" />
                  <p>Запланированные активности появятся здесь</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Upcoming Activities */}
        <div className="flex-1 h-[850px]">
          <Card className="border-0 shadow-md h-full">
            <CardHeader>
              <div className="flex items-center">
                <CardTitle className="text-lg text-black">
                  Предстоящие активности на {weekday} {day} {month}
                </CardTitle>
                <p className="text-sm text-gray-500 ml-auto">Расписание</p>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[746px] relative">
              {stats.upcomingActivities.activities.length > 0 ? (
                <>
                  <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
                  <ScrollArea className="h-full px-6">
                    <div className="space-y-2 py-4">
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
                              duration={activity.duration}
                              format={activity.format}
                              isBackToBack={isBackToBack}
                              isRepeat={activity.isRepeat}
                              status={activity.status}
                              practiceCount={activity.practiceCount || 0}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                  <div className="absolute -bottom-1 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Calendar className="w-12 h-12 mb-2" />
                  <p>Запланированные активности появятся здесь</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
