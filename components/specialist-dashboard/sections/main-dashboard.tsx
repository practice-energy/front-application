"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Clock, Users, CheckCircle, Repeat, MessageSquare, AlertTriangle, TrendingUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RubleIcon } from "@/components/ui/ruble-sign"
import { mockDashboardStats } from "@/services/mock-dash"
import { ScrollArea } from "@/components/ui/scroll-area"

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

  // Mock additional data to match the design
  const practiceStats = [
    { value: "110", label: "Подтвержденные слоты", icon: CheckCircle },
    { value: "90", label: "Новые инициативы", icon: Users },
    { value: "20", label: "Очные встречи", icon: Users },
    { value: "90", label: "Повторные", icon: Repeat },
  ]

  const activityStats = [
    { value: "1,060,066", label: "Прогноз выручки", icon: TrendingUp, currency: true },
    { value: "62%", label: "Плотность заполнения слотов", icon: Clock },
  ]

  // Extended mock activities to match the design
  const extendedActivities = [
    {
      id: "1",
      time: "15:00",
      client: {
        name: "Таро расклад на судьбу в кабинете таро расклад на судьбу в кабинете",
        avatar: "/placeholder-user.jpg",
      },
      duration: "60 минут",
      status: "Подтверждено",
      statusColor: "bg-green-500",
      price: "15,000",
      format: "offline",
    },
    {
      id: "2",
      time: "16:00",
      client: { name: "Снежана История древнего римского...", avatar: "/placeholder-user.jpg" },
      duration: "Очная",
      status: "Подтверждено",
      statusColor: "bg-green-500",
      price: "15,000",
      format: "offline",
    },
    {
      id: "3",
      time: "17:30",
      client: {
        name: "Таро расклад на судьбу в кабинете таро расклад на судьбу в кабинете",
        avatar: "/placeholder-user.jpg",
      },
      duration: "30 минут",
      status: "Ожидает",
      statusColor: "bg-gray-800",
      price: "5,000",
      format: "online",
    },
    {
      id: "4",
      time: "18:00",
      client: { name: "Снежана История древнего римского...", avatar: "/placeholder-user.jpg" },
      duration: "Онлайн",
      status: "Ожидает",
      statusColor: "bg-gray-800",
      price: "5,000",
      format: "online",
    },
    {
      id: "5",
      time: "18:00",
      client: {
        name: "Таро расклад на судьбу в кабинете таро расклад на судьбу в кабинете",
        avatar: "/placeholder-user.jpg",
      },
      duration: "30 минут",
      status: "Запрос",
      statusColor: "bg-gray-800",
      price: "5,000",
      format: "online",
    },
    {
      id: "6",
      time: "18:30",
      client: { name: "Снежана История древнего римского...", avatar: "/placeholder-user.jpg" },
      duration: "Онлайн",
      status: "Запрос",
      statusColor: "bg-gray-800",
      price: "5,000",
      format: "online",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-black">4</p>
                    <p className="text-sm font-medium text-black">практики активны</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">220 слотов подтверждены на 90 дней</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-black">5</p>
                    <p className="text-sm font-medium text-black">непрочитанных сообщений</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">в чатах практик</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-black">4</p>
                    <p className="text-sm font-medium text-black">ишью нуждаются во внимании</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">2 касаются активности на сегодня</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Practice Overview - 1/3 width */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-black">Обзор практик</CardTitle>
                <p className="text-sm text-gray-500">Следующие 30 дней</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {practiceStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <p className="text-3xl font-bold text-black mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Activities - 2/3 width */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-black">
                  Предстоящие активности на воскресенье 15 июля
                </CardTitle>
                <p className="text-sm text-gray-500">Расписание</p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] px-6">
                <div className="space-y-4 pb-4">
                  {extendedActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 py-2">
                      {/* Time */}
                      <div className="text-sm font-medium text-black w-12 flex-shrink-0">{activity.time}</div>

                      {/* Avatar */}
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={activity.client.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{activity.client.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      {/* Service Name */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">{activity.client.name}</p>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-1 text-xs text-gray-600 flex-shrink-0">
                        <Clock className="h-3 w-3" />
                        {activity.duration}
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-500">{activity.status}</span>
                        <div className={`w-2 h-2 rounded-full ${activity.statusColor}`} />
                      </div>

                      {/* Format & Price */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {activity.format === "online" ? (
                          <Video className="h-4 w-4 text-gray-600" />
                        ) : (
                          <Users className="h-4 w-4 text-gray-600" />
                        )}
                        <span className="text-sm font-medium text-black">{activity.price} ₽</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Overview */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-black">Обзор активности</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activityStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <stat.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-3xl font-bold text-black">{stat.value}</p>
                    {stat.currency && <RubleIcon className="h-6 w-6 text-black" />}
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
