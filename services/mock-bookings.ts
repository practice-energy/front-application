import type { Booking } from "@/types/booking"

export const mockBookings: Booking[] = [
  {
    id: "1",
    date: new Date(2025, 0, 16, 9, 0), // Today at 9 AM
    service: {
      id: "tarot-reading",
      name: "Таро расклад на судьбу",
      description: "Подробный расклад на жизненную ситуацию",
      price: 3000,
      duration: 60,
    },
    specialist: {
      id: "afanina",
      name: "Афалина",
      photo: "/placeholder-user.jpg",
      rating: 4.8,
      reviewCount: 127,
    },
    format: "in-person",
    paymentStatus: "paid",
    slots: 1,
    duration: 60,
  },
  {
    id: "2",
    date: new Date(2025, 0, 16, 17, 0), // Today at 5 PM
    service: {
      id: "natal-chart",
      name: "Разбор натальной карты для начинающих",
      description: "Детальный анализ натальной карты",
      price: 4500,
      duration: 120,
    },
    specialist: {
      id: "snezhana",
      name: "Снежана",
      photo: "/placeholder-user.jpg",
      rating: 4.9,
      reviewCount: 89,
    },
    format: "video",
    paymentStatus: "pending",
    slots: 2,
    duration: 120,
  },
  {
    id: "3",
    date: new Date(2025, 0, 17, 14, 0), // Tomorrow at 2 PM
    service: {
      id: "astro-consultation",
      name: "Астрологическая консультация",
      description: "Персональная консультация по астрологии",
      price: 5000,
      duration: 90,
    },
    specialist: {
      id: "marina",
      name: "Марина",
      photo: "/placeholder-user.jpg",
      rating: 4.7,
      reviewCount: 156,
    },
    format: "video",
    paymentStatus: "paid",
    slots: 2,
    duration: 90,
  },
  {
    id: "4",
    date: new Date(2025, 0, 18, 11, 0), // Day after tomorrow at 11 AM
    service: {
      id: "rune-reading",
      name: "Рунический расклад",
      description: "Гадание на рунах",
      price: 2500,
      duration: 45,
    },
    specialist: {
      id: "elena",
      name: "Елена",
      photo: "/placeholder-user.jpg",
      rating: 4.6,
      reviewCount: 203,
    },
    format: "in-person",
    paymentStatus: "paid",
    slots: 1,
    duration: 45,
  },
]
