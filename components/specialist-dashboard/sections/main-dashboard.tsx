"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Users,
  Repeat,
  TrendingUp,
  Clock,
  Video,
  MapPin,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Slot } from "@/types/slot"
import Link from "next/link"
import {RubleIcon} from "@/components/ui/ruble-sign";

// Mock data for slots
const mockSlots: Slot[] = [
  {
    id: "1",
    client: { id: "c1", name: "Снежана" },
    service: { id: "s1", name: "Таро расклад на отношения он-лайн", price: 2500 },
    date: new Date("2024-07-15T13:00:00"),
    duration: 60,
    format: "video",
    status: "upcoming",
    requiresConfirmation: false,
  },
  {
    id: "2",
    client: { id: "c2", name: "Снежана" },
    service: { id: "s2", name: "Таро расклад на судьбу в кабинете", price: 3000 },
    date: new Date("2024-07-15T15:00:00"),
    duration: 90,
    format: "in-person",
    status: "upcoming",
    requiresConfirmation: true,
    location: "Кабинет на Невском",
  },
  {
    id: "3",
    client: { id: "c3", name: "Снежана" },
    service: { id: "s3", name: "Разбор натальной карты для пары у клиента", price: 4500 },
    date: new Date("2024-07-15T16:00:00"),
    duration: 120,
    format: "in-person",
    status: "upcoming",
    requiresConfirmation: false,
    location: "У клиента",
  },
]

export function MainDashboard() {
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
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-black">4</p>
                <p className="text-sm text-gray-600">практики активны</p>
                <p className="text-xs text-gray-500 mt-1">660 слотов подтверждены на следующие 180 дней</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-black">5</p>
                <p className="text-sm text-gray-600">непрочитанных сообщений</p>
                <p className="text-xs text-gray-500 mt-1">в чатах практик</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-black">4</p>
                <p className="text-sm text-gray-600">мшью нуждаются во внимании</p>
                <p className="text-xs text-gray-500 mt-1">2 касаются активности на сегодня</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Practice Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-black">Обзор практики</h3>

          <div className="grid gap-4 grid-cols-2">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-black">330</p>
                    <p className="text-xs text-gray-600">Подтвержденные слоты</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className=" border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-black">120</p>
                    <p className="text-xs text-gray-600">Клиенты</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-black">20</p>
                    <p className="text-xs text-gray-600">Очные встречи</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className=" border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                    <Repeat className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-black">80</p>
                    <p className="text-xs text-gray-600">Повторные бронирования</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Overview */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-black">Обзор активности</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-black">1.060.066</p>
                    <RubleIcon/>
                    <p className="text-xs text-gray-600">Прогноз выручки</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-black">62%</p>
                    <p className="text-xs text-gray-600">Глубина заполнения слотов</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Activities */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black">Предстоящие активности на воскресенье 15 июля</h3>
            <p className="text-sm text-gray-500">Следующие 30 дней</p>
          </div>

          <div className="space-y-3">
            {mockSlots.map((slot) => (
              <Card key={slot.id} className="bg-white border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium text-black">{formatTime(slot.date)}</div>

                      <Link href={`/service/${slot.service.id}`}>
                        <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80">
                          <AvatarImage src="/placeholder-user.jpg" />
                          <AvatarFallback>{slot.client.name[0]}</AvatarFallback>
                        </Avatar>
                      </Link>

                      <div className="flex-1">
                        <Link
                          href={`/service/${slot.service.id}`}
                          className="text-sm font-medium text-black hover:text-purple-600 cursor-pointer"
                        >
                          {slot.service.name}
                        </Link>
                        <div className="flex items-center space-x-2 mt-1">
                          <Link
                            href={`/specialist/${slot.client.id}`}
                            className="text-xs text-gray-600 hover:text-purple-600 cursor-pointer"
                          >
                            {slot.client.name}
                          </Link>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">1 клиент</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">1 слот</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {slot.format === "video" ? (
                          <Badge  className="text-xs bg-gray-100 text-gray-700">
                            <Video className="h-3 w-3 mr-1" />
                            Видео
                          </Badge>
                        ) : (
                          <Badge className="text-xs bg-gray-100 text-gray-700">
                            <MapPin className="h-3 w-3 mr-1" />
                            Очно
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {slot.requiresConfirmation && (
                        <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">
                          Ожидание подготовки
                        </Badge>
                      )}

                      <div className="text-sm font-medium text-black">{formatPrice(slot.service.price)} ₽</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
