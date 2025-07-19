import type { Booking } from "@/types/booking"
import { v4 as uuidv4 } from "uuid"

export const mockBookings: Booking[] = [
  {
    id: uuidv4(),
    service: {
      id: uuidv4(),
      title: "Таро расклад на судьбу",
      description: "Подробный расклад на жизненный путь",
      price: 3000,
      duration: 60,
    },
    specialist: {
      id: uuidv4(),
      name: "Афалина Дионисовна",
      avatar: "/placeholder.jpg",
      practiceCount: 100
    },
    date: new Date(2025, 6, 13, 5, 0), // 13 июля 2025, 05:00
    duration: 60,
    slots: 1,
    format: "in-person",
    status: "confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    service: {
      id: uuidv4(),
      title: "Таро расклад на судьбу",
      description: "Подробный расклад на жизненный путь",
      price: 3000,
      duration: 60,
    },
    specialist: {
      id: uuidv4(),
      name: "Афалина Дионисовна",
      avatar: "/placeholder.jpg",
      practiceCount: 100
    },
    date: new Date(2025, 6, 13, 6, 0), // 13 июля 2025, 06:00
    duration: 60,
    slots: 1,
    format: "in-person",
    status: "waiting",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    service: {
      id: uuidv4(),
      title: "Таро расклад на судьбу",
      description: "Подробный расклад на жизненный путь",
      price: 3000,
      duration: 60,
    },
    specialist: {
      id: uuidv4(),
      name: "Афалина Дионисовна",
      avatar: "/placeholder.jpg",
      practiceCount: 100
    },
    date: new Date(2025, 6, 13, 17, 0), // 13 июля 2025, 17:00
    duration: 120,
    slots: 2,
    format: "video",
    status: "waiting",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    service: {
      id: uuidv4(),
      title: "Таро расклад на судьбу",
      description: "Подробный расклад на жизненный путь",
      price: 3000,
      duration: 60,
    },
    specialist: {
      id: uuidv4(),
      name: "Афалина Дионисовна",
      avatar: "/placeholder.jpg",
      practiceCount: 100
    },
    date: new Date(2025, 6, 14, 10, 0), // 14 июля 2025, 10:00
    duration: 90,
    slots: 2,
    format: "video",
    status: "confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    service: {
      id: uuidv4(),
      title: "Таро расклад на судьбу",
      description: "Подробный расклад на жизненный путь",
      price: 3000,
      duration: 60,
    },
    specialist: {
      id: uuidv4(),
      name: "Афалина Дионисовна",
      avatar: "/placeholder.jpg",
      practiceCount: 100
    },
    date: new Date(2025, 6, 15, 14, 0), // 15 июля 2025, 14:00
    duration: 180,
    slots: 3,
    format: "in-person",
    status: "confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    service: {
      id: uuidv4(),
      title: "Таро расклад на судьбу",
      description: "Подробный расклад на жизненный путь",
      price: 3000,
      duration: 60,
    },
    specialist: {
      id: uuidv4(),
      name: "Афалина Дионисовна",
      avatar: "/placeholder.jpg",
      practiceCount: 100
    },
    date: new Date(new Date().setHours(9, 0, 0, 0)), // Today at 9:00
    duration: 30,
    slots: 1,
    format: "video",
    status: "confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: uuidv4(),
    service: {
      id: uuidv4(),
      title: "Таро расклад на судьбу",
      description: "Подробный расклад на жизненный путь",
      price: 3000,
      duration: 60,
    },
    specialist: {
      id: uuidv4(),
      name: "Афалина Дионисовна",
      avatar: "/placeholder.jpg",
      practiceCount: 100
    },
    date: new Date(new Date().setHours(15, 0, 0, 0)), // Today at 15:00
    duration: 90,
    slots: 2,
    format: "in-person",
    status: "confirmed",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
