import { v4 as uuidv4 } from "uuid"

// Типы данных
export interface ChatItem {
  id: string
  title: string
  description: string
  avatar?: string
  status: "waiting" | "confirmed" | "completed"
  timestamp: number
  updatedAt: number
  isAIEnabled?: boolean
}

export interface Specialist {
  id: string
  name: string
  title: string
  avatar: string
  rating: number
  reviewCount: number
  price: number
  location: string
  description: string
  specialties: string[]
  languages: string[]
  experience: number
  education: Education[]
  workExperience: WorkExperience[]
  reviews: Review[]
  availability: AvailabilitySlot[]
  services: Service[]
}

export interface Service {
  id: string
  title: string
  description: string
  price: number
  duration: number
  category: string
  image: string
  specialist: {
    id: string
    name: string
    avatar: string
    rating: number
  }
  tags: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startYear: number
  endYear: number
  description?: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
  current: boolean
}

export interface Review {
  id: string
  author: string
  avatar: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

export interface AvailabilitySlot {
  id: string
  date: string
  startTime: string
  endTime: string
  available: boolean
}

export interface SearchResult {
  id: string
  query: string
  specialists: Specialist[]
  services: Service[]
  timestamp: number
}

// Mock данные для чатов
export const mockChats: ChatItem[] = [
  {
    id: uuidv4(),
    title: "Анна Петрова",
    description: "Консультация по астрологии",
    avatar: "/placeholder-user.jpg",
    status: "waiting",
    timestamp: Date.now() - 1000 * 60 * 30, // 30 минут назад
    updatedAt: Date.now() - 1000 * 60 * 30,
    isAIEnabled: true,
  },
  {
    id: uuidv4(),
    title: "Михаил Сидоров",
    description: "Коучинг сессия",
    avatar: "/placeholder-user.jpg",
    status: "confirmed",
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 часа назад
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: uuidv4(),
    title: "Елена Иванова",
    description: "Массаж и релаксация",
    avatar: "/placeholder-user.jpg",
    status: "completed",
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 день назад
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    id: uuidv4(),
    title: "Дмитрий Козлов",
    description: "Психологическая консультация",
    avatar: "/placeholder-user.jpg",
    status: "waiting",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 дня назад
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: uuidv4(),
    title: "Ольга Смирнова",
    description: "Йога и медитация",
    avatar: "/placeholder-user.jpg",
    status: "confirmed",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 дней назад
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: uuidv4(),
    title: "Александр Волков",
    description: "Бизнес консультация",
    avatar: "/placeholder-user.jpg",
    status: "completed",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 15, // 15 дней назад
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
  },
  {
    id: uuidv4(),
    title: "Мария Федорова",
    description: "Нутрициология",
    avatar: "/placeholder-user.jpg",
    status: "completed",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 45, // 45 дней назад
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 45,
  },
]

// Mock данные для специалистов
export const mockSpecialists: Specialist[] = [
  {
    id: "1",
    name: "Анна Петрова",
    title: "Астролог и таролог",
    avatar: "/placeholder-user.jpg",
    rating: 4.9,
    reviewCount: 127,
    price: 3500,
    location: "Москва",
    description:
      "Профессиональный астролог с 10-летним опытом. Помогу разобраться в жизненных вопросах через призму астрологии.",
    specialties: ["Натальная астрология", "Таро", "Нумерология"],
    languages: ["Русский", "Английский"],
    experience: 10,
    education: [
      {
        id: "1",
        institution: "Московский институт астрологии",
        degree: "Сертификат",
        field: "Классическая астрология",
        startYear: 2013,
        endYear: 2014,
        description: "Изучение основ натальной астрологии и прогностических техник",
      },
    ],
    workExperience: [
      {
        id: "1",
        company: "Центр астрологии 'Звездный путь'",
        position: "Ведущий астролог",
        startDate: "2014-01-01",
        endDate: "2020-12-31",
        description: "Проведение индивидуальных консультаций, обучение начинающих астрологов",
        current: false,
      },
      {
        id: "2",
        company: "Частная практика",
        position: "Астролог-консультант",
        startDate: "2021-01-01",
        endDate: "",
        description: "Индивидуальные консультации, ведение онлайн-курсов",
        current: true,
      },
    ],
    reviews: [
      {
        id: "1",
        author: "Мария К.",
        avatar: "/placeholder-user.jpg",
        rating: 5,
        comment: "Анна очень точно описала мою ситуацию и дала полезные рекомендации. Рекомендую!",
        date: "2024-01-15",
        verified: true,
      },
    ],
    availability: [],
    services: [],
  },
  {
    id: "2",
    name: "Михаил Сидоров",
    title: "Лайф-коуч и бизнес-тренер",
    avatar: "/placeholder-user.jpg",
    rating: 4.8,
    reviewCount: 89,
    price: 5000,
    location: "Санкт-Петербург",
    description:
      "Помогаю людям достигать целей и раскрывать потенциал. Специализируюсь на карьерном росте и личностном развитии.",
    specialties: ["Лайф-коучинг", "Бизнес-коучинг", "Карьерное консультирование"],
    languages: ["Русский", "Английский", "Немецкий"],
    experience: 8,
    education: [
      {
        id: "2",
        institution: "СПбГУ",
        degree: "Магистр",
        field: "Психология",
        startYear: 2010,
        endYear: 2012,
      },
    ],
    workExperience: [],
    reviews: [],
    availability: [],
    services: [],
  },
]

// Mock данные для услуг
export const mockServices: Service[] = [
  {
    id: "1",
    title: "Натальная карта",
    description: "Подробный разбор натальной карты с рекомендациями",
    price: 3500,
    duration: 90,
    category: "Астрология",
    image: "/placeholder.jpg",
    specialist: {
      id: "1",
      name: "Анна Петрова",
      avatar: "/placeholder-user.jpg",
      rating: 4.9,
    },
    tags: ["астрология", "натальная карта", "личность"],
  },
  {
    id: "2",
    title: "Коучинг сессия",
    description: "Индивидуальная коучинг сессия для достижения целей",
    price: 5000,
    duration: 60,
    category: "Коучинг",
    image: "/placeholder.jpg",
    specialist: {
      id: "2",
      name: "Михаил Сидоров",
      avatar: "/placeholder-user.jpg",
      rating: 4.8,
    },
    tags: ["коучинг", "цели", "развитие"],
  },
]

// Mock данные для результатов поиска
export const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    query: "астрология",
    specialists: [mockSpecialists[0]],
    services: [mockServices[0]],
    timestamp: Date.now(),
  },
]

// Функции для группировки чатов по времени
export const groupChatsByTime = (chats: ChatItem[]) => {
  const now = Date.now()
  const oneDayAgo = now - 24 * 60 * 60 * 1000
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000

  return {
    today: chats.filter((chat) => chat.updatedAt > oneDayAgo),
    last7Days: chats.filter((chat) => chat.updatedAt <= oneDayAgo && chat.updatedAt > sevenDaysAgo),
    last30Days: chats.filter((chat) => chat.updatedAt <= sevenDaysAgo && chat.updatedAt > thirtyDaysAgo),
    older: chats.filter((chat) => chat.updatedAt <= thirtyDaysAgo),
  }
}

// Функция для форматирования времени
export const formatTimestamp = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes} мин`
  } else if (hours < 24) {
    return `${hours} ч`
  } else if (days < 7) {
    return `${days} дн`
  } else {
    return new Date(timestamp).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    })
  }
}

// Helper функции для получения данных по ID
export const getSpecialistById = (id: string): Specialist | undefined => {
  return mockSpecialists.find((specialist) => specialist.id === id)
}

export const getServiceById = (id: string): Service | undefined => {
  return mockServices.find((service) => service.id === id)
}

export const getSearchResultsById = (id: string): SearchResult | undefined => {
  return mockSearchResults.find((result) => result.id === id)
}

export const getChatById = (id: string): ChatItem | undefined => {
  return mockChats.find((chat) => chat.id === id)
}
