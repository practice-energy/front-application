import { v4 as uuidv4 } from "uuid"
import type { Booking } from "@/types/booking"

export const mockBookings: Booking[] = [
  {
    id: uuidv4(),
    specialist: {
      id: "1",
      name: "Афалина",
      photo: "/placeholder-user.jpg",
    },
    service: {
      id: uuidv4(),
      name: "Таро расклад на судьбу",
      price: 3500,
    },
    date: new Date(2025, 6, 13, 5, 0), // July 13, 2025, 5:00 AM
    duration: 60,
    format: "in-person",
    status: "confirmed",
    requiresConfirmation: false,
  },
  {
    id: uuidv4(),
    specialist: {
      id: "2",
      name: "Снежана",
      photo: "/placeholder-user.jpg",
    },
    service: {
      id: uuidv4(),
      name: "Разбор натальной карты для женщин",
      price: 5000,
    },
    date: new Date(2025, 6, 13, 17, 0), // July 13, 2025, 5:00 PM
    duration: 90,
    format: "video",
    status: "upcoming",
    requiresConfirmation: true,
  },
  {
    id: uuidv4(),
    specialist: {
      id: "3",
      name: "Анна Петрова",
      photo: "/placeholder-user.jpg",
    },
    service: {
      id: uuidv4(),
      name: "Консультация по астрологии",
      price: 4000,
    },
    date: new Date(2025, 6, 14, 10, 0), // July 14, 2025, 10:00 AM
    duration: 60,
    format: "video",
    status: "upcoming",
    requiresConfirmation: false,
  },
  {
    id: uuidv4(),
    specialist: {
      id: "4",
      name: "Михаил Сидоров",
      photo: "/placeholder-user.jpg",
    },
    service: {
      id: uuidv4(),
      name: "Коучинг сессия",
      price: 6000,
    },
    date: new Date(2025, 6, 15, 14, 30), // July 15, 2025, 2:30 PM
    duration: 90,
    format: "in-person",
    status: "confirmed",
    requiresConfirmation: false,
  },
]
