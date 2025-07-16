import type { Booking } from "@/types/booking"

export const mockBookings: Booking[] = [
  {
    id: "1",
    clientId: "client-1",
    specialistId: "specialist-1",
    serviceId: "service-1",
    date: new Date(2025, 0, 15, 5, 0), // January 15, 2025, 05:00
    duration: 60,
    slots: 1, // 1 hour slot
    status: "confirmed",
    format: "offline",
    paymentStatus: "paid",
    totalAmount: 3000,
    notes: "Таро расклад на судьбу",
    service: {
      id: "service-1",
      name: "Таро расклад на судьбу",
      description: "Подробный расклад на судьбу",
      price: 3000,
      duration: 60,
      category: "Таро",
    },
    specialist: {
      id: "specialist-1",
      name: "Афалина",
      photo: "/placeholder-user.jpg",
      rating: 4.9,
      reviewsCount: 127,
    },
    client: {
      id: "client-1",
      name: "Иван Петров",
      photo: "/placeholder-user.jpg",
    },
  },
  {
    id: "2",
    clientId: "client-2",
    specialistId: "specialist-2",
    serviceId: "service-2",
    date: new Date(2025, 0, 15, 6, 0), // January 15, 2025, 06:00
    duration: 45,
    slots: 1, // 1 hour slot (45 minutes fits in 1 slot)
    status: "upcoming",
    format: "offline",
    paymentStatus: "pending",
    totalAmount: 1800,
    notes: "Таро расклад на судьбу",
    service: {
      id: "service-2",
      name: "Таро расклад на судьбу",
      description: "Краткий расклад на судьбу",
      price: 1800,
      duration: 45,
      category: "Таро",
    },
    specialist: {
      id: "specialist-2",
      name: "Афалина",
      photo: "/placeholder-user.jpg",
      rating: 4.9,
      reviewsCount: 127,
    },
    client: {
      id: "client-2",
      name: "Анна Сидорова",
      photo: "/placeholder-user.jpg",
    },
  },
  {
    id: "3",
    clientId: "client-3",
    specialistId: "specialist-3",
    serviceId: "service-3",
    date: new Date(2025, 0, 15, 17, 0), // January 15, 2025, 17:00
    duration: 90,
    slots: 2, // 2 hour slots (1.5 hours = 2 slots)
    status: "upcoming",
    format: "video",
    paymentStatus: "pending",
    totalAmount: 5000,
    notes: "Разбор натальной карты для женщин",
    service: {
      id: "service-3",
      name: "Разбор натальной карты для женщин",
      description: "Полный разбор натальной карты",
      price: 5000,
      duration: 90,
      category: "Астрология",
    },
    specialist: {
      id: "specialist-3",
      name: "Снежана",
      photo: "/placeholder-user.jpg",
      rating: 4.7,
      reviewsCount: 156,
    },
    client: {
      id: "client-3",
      name: "Елена Козлова",
      photo: "/placeholder-user.jpg",
    },
  },
  {
    id: "4",
    clientId: "client-4",
    specialistId: "specialist-4",
    serviceId: "service-4",
    date: new Date(2025, 0, 16, 10, 0), // January 16, 2025, 10:00
    duration: 120,
    slots: 2, // 2 hour slots
    status: "confirmed",
    format: "video",
    paymentStatus: "paid",
    totalAmount: 4000,
    notes: "Консультация по отношениям",
    service: {
      id: "service-4",
      name: "Консультация по отношениям",
      description: "Анализ совместимости партнеров",
      price: 4000,
      duration: 120,
      category: "Психология",
    },
    specialist: {
      id: "specialist-4",
      name: "Виктория",
      photo: "/placeholder-user.jpg",
      rating: 4.7,
      reviewsCount: 234,
    },
    client: {
      id: "client-4",
      name: "Дмитрий Волков",
      photo: "/placeholder-user.jpg",
    },
  },
  {
    id: "5",
    clientId: "client-5",
    specialistId: "specialist-5",
    serviceId: "service-5",
    date: new Date(2025, 0, 17, 14, 0), // January 17, 2025, 14:00
    duration: 180,
    slots: 3, // 3 hour slots
    status: "upcoming",
    format: "offline",
    paymentStatus: "pending",
    totalAmount: 7500,
    notes: "Интенсивная терапевтическая сессия",
    service: {
      id: "service-5",
      name: "Интенсивная терапевтическая сессия",
      description: "Глубокая проработка личных вопросов",
      price: 7500,
      duration: 180,
      category: "Психотерапия",
    },
    specialist: {
      id: "specialist-5",
      name: "Александра",
      photo: "/placeholder-user.jpg",
      rating: 4.9,
      reviewsCount: 67,
    },
    client: {
      id: "client-5",
      name: "Ольга Смирнова",
      photo: "/placeholder-user.jpg",
    },
  },
]
