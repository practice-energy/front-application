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
import { cn } from "@/lib/utils"

export function MainDashboard() {
  const stats = mockDashboardStats

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  function pluralize(number, one, few, many) {
    const n = Math.abs(number)
    const n10 = n % 10
    const n100 = n % 100

    if (n10 === 1 && n100 !== 11) return one
    if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return few
    return many
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price)
  }

  function formatDate() {
    const today = new Date()

    // Названия дней недели
    const weekdays = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"]
    const weekday = weekdays[today.getDay()]

    // День месяца
    const day = today.getDate()

    // Названия месяцев
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
    <div className="space-y-6 pl-20">
      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Карточка 1: Активные практики */}
        <div className={cn("flex items-center w-full gap-3 shadow-md h-[72px] p-3 rounded-sm")}>
          <div className={cn("flex items-center justify-center h-10 w-10 rounded-sm bg-neutral-100")}>
            <LayoutGrid size={24} className={cn("text-neutral-600")} />
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium truncate flex-1">
                {`${stats.topStats.activePracticesCount} ${pluralize(stats.topStats.activePracticesCount, "практика активна", "практики активны", "практик активно")}`}
              </h3>
            </div>

            <div className="flex items-start">
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-gray-600 leading-relaxed line-clamp-1 w-full">
                  {`${stats.topStats.slotsApprovedCount} ${pluralize(stats.topStats.slotsApprovedCount, "слот подтвержден", "слота подтверждены", "слотов подтверждено")} на 90 дней`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Карточка 2: Непрочитанные сообщения */}
        <div className={cn("flex items-center w-full gap-3 shadow-md h-[72px] p-3 rounded-sm")}>
          <div className={cn("flex items-center justify-center h-10 w-10 rounded-sm bg-neutral-100")}>
            <MessageSquareText size={24} className={cn("text-neutral-600")} />
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium truncate flex-1">
                {`${stats.topStats.activePracticesCount} ${pluralize(stats.topStats.activePracticesCount, "непрочитанное сообщение", "непрочитанных сообщения", "непрочитанных сообщений")}`}
              </h3>
            </div>

            <div className="flex items-start">
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-gray-600 leading-relaxed line-clamp-1 w-full">в чатах практис</p>
              </div>
            </div>
          </div>
        </div>

        {/* Карточка 3: Ишью */}
        <div className={cn("flex items-center w-full gap-3 shadow-md h-[72px] p-3 rounded-sm")}>
          <div className={cn("flex items-center justify-center h-10 w-10 rounded-sm bg-neutral-100")}>
            <Flag size={24} className={cn("text-pink-500")} />
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium truncate flex-1">
                {`${stats.topStats.issuesCount} ${pluralize(stats.topStats.issuesCount, "ишью нуждается", "ишью нуждаются", "ишью нуждаются")} во внимании`}
              </h3>
            </div>

            <div className="flex items-start">
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-gray-600 leading-relaxed line-clamp-1 w-full">
                  {`${stats.topStats.unreadsForTodayactivities} ${pluralize(stats.topStats.unreadsForTodayactivities, "касается активности", "касаются активностей", "касаются активностей")} на сегодня`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Practice & Activity Overview - Wider Section */}
        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <div className="flex items-center">
                <CardTitle className="text-lg text-black">Обзор практик</CardTitle>
                <p className="text-sm text-gray-500 ml-auto">Cледующие 30 дней</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {" "}
                {/* Добавляем grid 2x2 с отступом 4 */}
                {/* Карточка 1 */}
                <div className="flex flex-col w-full p-4 border border-gray-200 rounded-sm bg-white">
                  <div className="flex items-end justify-between h-9 w-full">
                    <span className="text-3xl font-bold text-gray-900">{stats.practiceOverview.confirmedSlots}</span>
                    <div className="flex items-center justify-center h-9 w-9 rounded bg-neutral-100">
                      <CheckCheck size={24} className="text-neutral-600" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600">Подтвержденные слоты</p>
                  </div>
                </div>
                {/* Карточка 2 */}
                <div className="flex flex-col w-full p-4 border border-gray-200  rounded-sm bg-white">
                  <div className="flex items-end justify-between h-9 w-full">
                    <span className="text-3xl font-bold text-gray-900">{stats.practiceOverview.newInitiants}</span>
                    <div className="flex items-center justify-center h-9 w-9 rounded bg-neutral-100">
                      <User size={24} className="text-neutral-600" /> {/* Пример другой иконки */}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600">Новые иницианты</p>
                  </div>
                </div>
                {/* Карточка 3 */}
                <div className="flex flex-col w-full p-4 border border-gray-200  rounded-sm bg-white">
                  <div className="flex items-end justify-between h-9 w-full">
                    <span className="text-3xl font-bold text-gray-900">{stats.practiceOverview.personalMeetings}</span>
                    <div className="flex items-center justify-center h-9 w-9 rounded bg-neutral-100">
                      <Users size={24} className="text-neutral-600" /> {/* Пример другой иконки */}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600">Очные встречи</p>
                  </div>
                </div>
                {/* Карточка 4 */}
                <div className="flex flex-col w-full p-4 border border-gray-200  rounded-sm bg-white">
                  <div className="flex items-end justify-between h-9 w-full">
                    <span className="text-3xl font-bold text-gray-900">{stats.practiceOverview.repeatingMeetings}</span>
                    <div className="flex items-center justify-center h-9 w-9 rounded bg-neutral-100">
                      <Repeat2 size={24} className="text-neutral-600" /> {/* Пример другой иконки */}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600">Повторные</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Overview - Wider Section */}
          <Card className="border-0 shadow-md ">
            <CardHeader>
              <div className="flex items-center">
                <CardTitle className="text-lg text-black">Обзор практик</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {" "}
                {/* Добавляем grid 2x2 с отступом 4 */}
                {/* Карточка 1 */}
                <div className="flex flex-col w-full p-4 border border-gray-200 rounded-sm bg-white">
                  <div className="flex items-end justify-between h-9 w-full">
                    <span className="text-3xl font-bold text-gray-900">
                      {stats.activityOverview.totalEarningsPredict}
                    </span>
                    <div className="flex items-center justify-center h-9 w-9 rounded bg-neutral-100">
                      <RubleIcon size={24} bold={false} className="text-neutral-600" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600">Прогноз выручки</p>
                  </div>
                </div>
                {/* Карточка 2 */}
                <div className="flex flex-col w-full p-4 border border-gray-200  rounded-sm bg-white">
                  <div className="flex items-end justify-between h-9 w-full">
                    <span className="text-3xl font-bold text-gray-900">{stats.activityOverview.fillRate}%</span>
                    <div className="flex items-center justify-center h-9 w-9 rounded-sm bg-neutral-100">
                      <ChartPie size={24} className="text-neutral-600" /> {/* Пример другой иконки */}
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600">Плотность заполнения слотов</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - new upcoming activities section (1/3 width) */}
        <div className="space-y-6 w-full">
          <Card className="border-0 shadow-md min-h-full">
            <CardHeader>
              <div className="flex items-center">
                <CardTitle className="text-lg text-black">
                  Предстоящие активности на {weekday} {day} {month}
                </CardTitle>
                <p className="text-sm text-gray-500 ml-auto">Расписание</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Placeholder for upcoming activities */}
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  {stats.upcomingActivities.activities.length > 0 ? (
                    <></>
                  ) : (
                    <div>
                      <Calendar className="w-12 h-12 mb-2" />
                      <p>Запланированные активности появятся здесь</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
