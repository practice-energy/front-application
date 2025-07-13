"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Video } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
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

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold text-black">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shrink-0">
                  <stat.icon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Practice & Activity Overview - Wider Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-black">{practiceOverview.title}</CardTitle>
                <p className="text-sm text-gray-500">{practiceOverview.subtitle}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {practiceOverview.stats.map((stat, index) => (
                  <Card key={index} className="border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0">
                          <stat.icon className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-black">{stat.value}</p>
                          <p className="text-xs text-gray-600">{stat.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-black">{activityOverview.title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-9 grid-cols-1 sm:grid-cols-2">
              {activityOverview.stats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0">
                    <stat.icon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-black flex items-center">
                      {stat.value}
                      {stat.isCurrency && <RubleIcon className="ml-1 h-4 w-4" />}
                    </p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Activities - Narrower Section */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-sm h-full">
            <CardContent className="p-4 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-black mb-4 shrink-0">{upcomingActivities.title}</h3>
              <div className="relative flex-1 min-h-0">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
                <ScrollArea className="h-full pr-4 -mr-4">
                  <div className="space-y-3">
                    {upcomingActivities.activities.map((activity) => (
                      <Card key={activity.id} className="bg-white border border-gray-200 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center space-x-4 min-w-0">
                              <div className="text-sm font-medium text-black pt-1">{formatTime(activity.date)}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <Link href={`/specialist/${activity.client.id}`}>
                                    <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80">
                                      <AvatarImage src="/placeholder-user.jpg" />
                                      <AvatarFallback>{activity.client.name[0]}</AvatarFallback>
                                    </Avatar>
                                  </Link>
                                  <div>
                                    <Link
                                      href={`/service/${activity.service.id}`}
                                      className="text-sm font-medium text-black hover:text-purple-600 cursor-pointer truncate block"
                                    >
                                      {activity.service.name}
                                    </Link>
                                    <Link
                                      href={`/specialist/${activity.client.id}`}
                                      className="text-xs text-gray-600 hover:text-purple-600 cursor-pointer truncate block"
                                    >
                                      {activity.client.name}
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1 shrink-0">
                              <div className="text-sm font-medium text-black whitespace-nowrap">
                                {formatPrice(activity.service.price)} ₽
                              </div>
                              {activity.format === "video" ? (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-gray-100 text-gray-700 rounded-sm border-transparent hover:bg-gray-100"
                                >
                                  <Video className="h-3 w-3 mr-1" />
                                  Видео
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-gray-100 text-gray-700 rounded-sm border-transparent hover:bg-gray-100"
                                >
                                  <MapPin className="h-3 w-3 mr-1" />
                                  Очно
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
