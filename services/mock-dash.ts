import { v4 as uuidv4 } from "uuid"
import { AlertTriangle, CheckCircle, Clock, MessageSquare, Repeat, TrendingUp, Users } from "lucide-react"
import type { DashboardStats, UpcomingActivity } from "@/types/dashboard"

export const mockUpcomingActivities: UpcomingActivity[] = [
  {
    id: uuidv4(),
    date: new Date(new Date().setHours(10, 0, 0, 0)),
    client: { id: uuidv4(), name: "Екатерина Смирнова" },
    service: { id: uuidv4(), name: "Анализ натальной карты", price: 4500 },
    format: "video",
  },
  {
    id: uuidv4(),
    date: new Date(new Date().setHours(11, 30, 0, 0)),
    client: { id: uuidv4(), name: "Александр Волков" },
    service: { id: uuidv4(), name: "Карьерный коучинг", price: 5000 },
    format: "in-person",
  },
  {
    id: uuidv4(),
    date: new Date(new Date().setHours(13, 0, 0, 0)),
    client: { id: uuidv4(), name: "Мария Лебедева" },
    service: { id: uuidv4(), name: "Сессия Таро", price: 3000 },
    format: "video",
  },
  {
    id: uuidv4(),
    date: new Date(new Date().setHours(14, 30, 0, 0)),
    client: { id: uuidv4(), name: "Дмитрий Попов" },
    service: { id: uuidv4(), name: "Бизнес-консультация", price: 7500 },
    format: "video",
  },
  {
    id: uuidv4(),
    date: new Date(new Date().setHours(16, 0, 0, 0)),
    client: { id: uuidv4(), name: "Ольга Морозова" },
    service: { id: uuidv4(), name: "Лайф-коучинг", price: 5000 },
    format: "in-person",
  },
]

export const mockDashboardStats: DashboardStats = {
  topStats: [
    {
      value: 4,
      label: "практики активны",
      subtext: "660 слотов подтверждены на следующие 180 дней",
      icon: CheckCircle,
    },
    {
      value: 5,
      label: "непрочитанных сообщений",
      subtext: "в чатах практик",
      icon: MessageSquare,
    },
    {
      value: 4,
      label: "мшью нуждаются во внимании",
      subtext: "2 касаются активности на сегодня",
      icon: AlertTriangle,
    },
  ],
  practiceOverview: {
    title: "Обзор практики",
    subtitle: "Следующие 30 дней",
    stats: [
      {
        value: 330,
        label: "Подтвержденные слоты",
        icon: CheckCircle,
      },
      {
        value: 120,
        label: "Клиенты",
        icon: Users,
      },
      {
        value: 20,
        label: "Очные встречи",
        icon: Users,
      },
      {
        value: 80,
        label: "Повторные бронирования",
        icon: Repeat,
      },
    ],
  },
  activityOverview: {
    title: "Обзор активности",
    stats: [
      {
        value: "1 060 066",
        label: "Прогноз выручки",
        icon: TrendingUp,
        isCurrency: true,
      },
      {
        value: "62%",
        label: "Глубина заполнения слотов",
        icon: Clock,
      },
    ],
  },
  upcomingActivities: {
    title: "Предстоящие активности на воскресенье 15 июля",
    activities: mockUpcomingActivities,
  },
}
