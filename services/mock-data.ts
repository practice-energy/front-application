import {v4 as uuidv4} from "uuid"
import {Booking} from "@/types/booking";
import {User} from "@/types/user"
import {ProfileStats} from "@/types/profile-stats";
import {CalendarEvent} from "@/types/calendar-event";
import {Review, Service, Specialist} from "@/types/common";
import {Chat, ChatItem, Message, SearchResult} from "@/types/chats";

// Generate UUIDs for all chat and specialist IDs first
const chatAI1Id = uuidv4();
const chatSpecialist1Id = uuidv4();
const chatAI2Id = uuidv4();
const chatSpecialist2Id = uuidv4();

const specialist1Id = uuidv4();
const specialist2Id = uuidv4();

const service1Id = uuidv4();
const service2Id = uuidv4();

function createMockFile(name: string, type: string = 'image/svg+xml'): File {
  // Упрощенный SVG с текстом
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" fill="none"><rect width="1200" height="1200" fill="#EAEAEA" rx="3"/><g opacity=".5"><g opacity=".5"><path fill="#FAFAFA" d="M600.709 736.5c-75.454 0-136.621-61.167-136.621-136.62 0-75.454 61.167-136.621 136.621-136.621 75.453 0 136.62 61.167 136.62 136.621 0 75.453-61.167 136.62-136.62 136.62Z"/><path stroke="#C9C9C9" stroke-width="2.418" d="M600.709 736.5c-75.454 0-136.621-61.167-136.621-136.62 0-75.454 61.167-136.621 136.621-136.621 75.453 0 136.62 61.167 136.62 136.621 0 75.453-61.167 136.62-136.62 136.62Z"/></g><path stroke="url(#a)" stroke-width="2.418" d="M0-1.209h553.581" transform="scale(1 -1) rotate(45 1163.11 91.165)"/><path stroke="url(#b)" stroke-width="2.418" d="M404.846 598.671h391.726"/><path stroke="url(#c)" stroke-width="2.418" d="M599.5 795.742V404.017"/><path stroke="url(#d)" stroke-width="2.418" d="m795.717 796.597-391.441-391.44"/><path fill="#fff" d="M600.709 656.704c-31.384 0-56.825-25.441-56.825-56.824 0-31.384 25.441-56.825 56.825-56.825 31.383 0 56.824 25.441 56.824 56.825 0 31.383-25.441 56.824-56.824 56.824Z"/><g clip-path="url(#e)"><path fill="#666" fill-rule="evenodd" d="M616.426 586.58h-31.434v16.176l3.553-3.554.531-.531h9.068l.074-.074 8.463-8.463h2.565l7.18 7.181V586.58Zm-15.715 14.654 3.698 3.699 1.283 1.282-2.565 2.565-1.282-1.283-5.2-5.199h-6.066l-5.514 5.514-.073.073v2.876a2.418 2.418 0 0 0 2.418 2.418h26.598a2.418 2.418 0 0 0 2.418-2.418v-8.317l-8.463-8.463-7.181 7.181-.071.072Zm-19.347 5.442v4.085a6.045 6.045 0 0 0 6.046 6.045h26.598a6.044 6.044 0 0 0 6.045-6.045v-7.108l1.356-1.355-1.282-1.283-.074-.073v-17.989h-38.689v23.43l-.146.146.146.147Z" clip-rule="evenodd"/></g><path stroke="#C9C9C9" stroke-width="2.418" d="M600.709 656.704c-31.384 0-56.825-25.441-56.825-56.824 0-31.384 25.441-56.825 56.825-56.825 31.383 0 56.824 25.441 56.824 56.825 0 31.383-25.441 56.824-56.824 56.824Z"/></g><defs><linearGradient id="a" x1="554.061" x2="-.48" y1=".083" y2=".087" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><linearGradient id="b" x1="796.912" x2="404.507" y1="599.963" y2="599.965" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><linearGradient id="c" x1="600.792" x2="600.794" y1="403.677" y2="796.082" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><linearGradient id="d" x1="404.85" x2="796.972" y1="403.903" y2="796.02" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><clipPath id="e"><path fill="#fff" d="M581.364 580.535h38.689v38.689h-38.689z"/></clipPath></defs></svg>`;

  const blob = new Blob([svgContent], { type: 'image/svg+xml' });

  return new File([blob], name, {
    type: 'image/svg+xml',
    lastModified: Date.now()
  });
}

// Использование
export const mockImages = [
  createMockFile("profile.svg"),
  createMockFile("session.svg"),
  createMockFile("session.svg"),
  createMockFile("session.svg"),
  createMockFile("session.svg"),
];

// Mock User Data
export const mockUser: User = {
  id: "1",
  first_name: "Ivan",
  last_name: "Ivanov",
  email: {
    address: "ivan.ivanov@example.com",
    verified: true,
  },
  location: "",
  images: mockImages,
  created_at: "2023-01-15T00:00:00Z",
  account_balance: 125.5,
  tier: "Pro",
  isSpecialist: true,
  bio: "With over 15 years of experience in spiritual guidance and life coaching, I help clients find clarity, purpose, and balance. My approach combines traditional astrological wisdom with modern coaching techniques to create personalized paths for growth and transformation.",
  fullBio: "With over 15 years of experience in spiritual guidance and life coaching, I help clients find clarity, purpose, and balance. My approach combines traditional astrological wisdom with modern coaching techniques to create personalized paths for growth and transformation. I believe that everyone has the power to create positive change in their lives, and my role is to provide the tools, insights, and support needed to unlock that potential. Through personalized astrology readings, I help clients understand their unique cosmic blueprint and how planetary influences affect their daily lives. My life coaching sessions focus on practical goal-setting, overcoming limiting beliefs, and developing sustainable habits that lead to lasting transformation. I also offer meditation guidance to help clients develop mindfulness practices that support their overall well-being and spiritual growth.",
  education: [
    {
      description: "Certified Life Coach, International Coach Federation",
      certificate: {
        name: "life-coach-certificate.pdf",
        size: 2456789,
        type: "application/pdf",
        lastModified: Date.now(),
        // В реальном приложении здесь будет File объект или ссылка на файл
      } as unknown as File // Приведение типа для мока
    },
    {
      description: "Master's in Psychology, Stanford University",
      certificate: {
        name: "psychology-degree.jpg",
        size: 3456789,
        type: "image/jpeg",
        lastModified: Date.now(),
      } as unknown as File
    },
    {
      description: "Yoga Instructor Certification",
      certificate: null // Пример отсутствующего сертификата
    }
  ],
  experience: [
    {
      description: "Senior Life Coach at Mindful Living Center (2015-Present)",
      certificate: null,
    },
    {
      description: "Spiritual Guide at Wellness Collective (2010-2015)",
      certificate: null,
    }
  ],
  hat: "adept"
}

// Mock Calendar Events
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: uuidv4(),
    specialist: {
      name: "Dr. Anna Smith",
      photo: "/placeholder.svg?height=40&width=498900",
    },
    date: new Date(2023, 6, 25, 14, 0),
    duration: 60,
    type: "video",
    status: "upcoming",
    title: "Therapy Session",
    price: 85,
  },
  {
    id: uuidv4(),
    specialist: {
      name: "Michael Johnson",
      photo: "/placeholder.svg?height=40&width=401",
    },
    date: new Date(2023, 6, 27, 10, 30),
    duration: 45,
    type: "voice",
    status: "upcoming",
    title: "Career Coaching",
    price: 65,
  },
  {
    id: uuidv4(),
    specialist: {
      name: "Sarah Williams",
      photo: "/placeholder.svg?height=40&width=4013",
    },
    date: new Date(2023, 6, 15, 16, 0),
    duration: 60,
    type: "video",
    status: "completed",
    title: "Nutrition Consultation",
    price: 75,
  },
  {
    id: uuidv4(),
    specialist: {
      name: "Robert Brown",
      photo: "/placeholder.svg?height=40&width=4012",
    },
    date: new Date(2023, 6, 10, 11, 0),
    duration: 30,
    type: "voice",
    status: "completed",
    title: "Fitness Assessment",
    price: 55,
  },
]

// Mock данные для чатов (обновлены ID)
export const mockSidebarChats: ChatItem[] = [
  {
    id: chatSpecialist1Id, // Соответствует chat-specialist-1 в mockChatData
    title: "Анна Петрова",
    description: "Консультация по астрологии",
    avatar: "/placeholder-user.jpg",
    status: "waiting",
    timestamp: Date.now() - 1000 * 60 * 30, // 30 минут назад
    updatedAt: Date.now() - 1000 * 60 * 30,
    isAIEnabled: true,
    isAI: false,
  },
  {
    id: chatSpecialist2Id, // Соответствует chat-specialist-2 в mockChatData
    title: "Михаил Сидоров",
    description: "Коучинг сессия",
    avatar: "/placeholder-user.jpg",
    status: "confirmed",
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 часа назад
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
    isAIEnabled: false,
    isAI: false,
  },
  {
    id: uuidv4(),
    title: "Елена Иванова",
    description: "Массаж и релаксация",
    avatar: "/placeholder-user.jpg",
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 день назад
    updatedAt: Date.now() - 1000 * 60 * 60 * 24,
    isAIEnabled: false,
    isAI: false,
  },
  {
    id: uuidv4(),
    title: "Дмитрий Козлов",
    description: "Психологическая консультация",
    avatar: "/placeholder-user.jpg",
    status: "waiting",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 дня назад
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    isAIEnabled: true,
    isAI: false,
  },
  {
    id: uuidv4(),
    title: "Ольга Смирнова",
    description: "Йога и медитация",
    avatar: "/placeholder-user.jpg",
    status: "confirmed",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 дней назад
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    isAIEnabled: false,
    isAI: false,
  },
  {
    id: uuidv4(),
    title: "Александр Волков",
    description: "Бизнес консультация",
    avatar: "/placeholder-user.jpg",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 15, // 15 дней назад
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
    isAIEnabled: false,
    isAI: false,
    isMuted: true
  },
  {
    id: uuidv4(),
    title: "Мария Федорова",
    description: "Нутрициология",
    avatar: "/placeholder-user.jpg",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 45, // 45 дней назад
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 45,
    isAIEnabled: true,
    isAI: false,
    isMuted: true
  },
  {
    id: chatAI1Id,
    title: "Аллюра",
    description: "Поиск себя",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 41,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 41,
    isAIEnabled: true,
    isAI: true
  },
]

// Mock данные для специалистов (обновлены ID)
export const mockSpecialists: Specialist[] = [
  {
    id: specialist1Id,
    name: "Анна Петрова",
    title: "Астролог и таролог",
    avatar: "/placeholder-user.jpg",
    images: ["/placeholder.jpg","/placeholder.jpg"],
    reviewCount: 127,
    price: 3500,
    location: "Москва",
    description:
        "Профессиональный астролог с 10-летним опытом. Помогу разобраться в жизненных вопросах через призму астрологии.",
    specialties: ["Натальная астрология", "Таро", "Нумерология"],
    languages: ["Русский", "Английский"],
    education: [
      {
        description: "Изучение основ натальной астрологии и прогностических техник",
        certificate: null,
      },
    ],
    experience: [
      {
        description: "Проведение индивидуальных консультаций, обучение начинающих астрологов",
      },
    ],
    reviews: [
      {
        id: uuidv4(),
        author: "Мария К.",
        avatar: "/placeholder-user.jpg",
        comment: "Анна очень точно описала мою ситуацию и дала полезные рекомендации. Рекомендую!",
        date: "2024-01-15",
        verified: true,
      },
    ],
    availability: [],
    services: [],
  },
  {
    id: specialist2Id,
    name: "Михаил Сидоров",
    title: "Лайф-коуч и бизнес-тренер",
    avatar: "/placeholder-user.jpg",
    images: ["/placeholder.jpg","/placeholder.jpg","/placeholder.jpg"],
    reviewCount: 89,
    price: 5000,
    location: "Санкт-Петербург",
    description:
        "Помогаю людям достигать целей и раскрывать потенциал. Специализируюсь на карьерном росте и личностном развитии.",
    specialties: ["Лайф-коучинг", "Бизнес-коучинг", "Карьерное консультирование"],
    languages: ["Русский", "Английский", "Немецкий"],
    education: [
      {
        description: "Обучение в карьерном росте и личностном развитии",
        certificate: null,
      },
    ],
    experience: [],
    reviews: [],
    availability: [],
    services: [],
  }
]

// Новые моки для чатов (обновлены ID)
export const mockChatData: Chat[] = [
  // AI чат с Allura
  {
    id: chatAI1Id,
    title: "Поиск астролога",
    timestamp: "14:30",
    messages: [
      {
        id: uuidv4(),
        type: "user",
        content: "Ищу хорошего астролога для консультации",
        timestamp: Date.now() - 1000 * 60 * 30,
      },
      {
        id: uuidv4(),
        type: "assistant",
        content: "Отлично! Я помогу вам найти подходящего астролога. Вот несколько специалистов с высоким рейтингом:",
        timestamp: Date.now() - 1000 * 60 * 29,
        specialists: [mockSpecialists[0]],
      },
    ],
    searchQueries: ["астролог", "консультация"],
    isAi: true,
    hasNew: false,
    createdAt: Date.now() - 1000 * 60 * 30,
    footerContent: "Выберите подходящего специалиста или уточните ваши предпочтения.",
  },

  // Чат с человеком-специалистом, но с сообщениями от Allura
  {
    id: chatSpecialist1Id,
    title: "Анна Петрова",
    timestamp: "12:15",
    messages: [
      {
        id: uuidv4(),
        type: "user",
        content: "Здравствуйте! Хотел бы записаться на консультацию по натальной карте",
        timestamp: Date.now() - 1000 * 60 * 120,
      },
      {
        id: uuidv4(),
        type: "assistant",
        content: "Анна Петрова сейчас недоступна, но я могу помочь вам с записью. Вот информация о её услугах:",
        timestamp: Date.now() - 1000 * 60 * 119,
        specialists: [mockSpecialists[0]],
      },
      {
        id: uuidv4(),
        type: "specialist",
        content:
            "Добрый день! Спасибо за интерес к моим услугам. Да, я провожу консультации по натальным картам. Когда вам удобно?",
        timestamp: Date.now() - 1000 * 60 * 60,
      },
      {
        id: uuidv4(),
        type: "user",
        content: "Отлично! Может быть завтра вечером?",
        timestamp: Date.now() - 1000 * 60 * 30,
      },
    ],
    searchQueries: ["натальная карта", "астрология"],
    isAi: false,
    hasNew: true,
    createdAt: Date.now() - 1000 * 60 * 120,
  },

  // Еще один AI чат
  {
    id: chatAI2Id,
    title: "Поиск коуча",
    timestamp: "вчера",
    messages: [
      {
        id: uuidv4(),
        type: "user",
        content: "Нужен лайф-коуч для работы над целями",
        timestamp: Date.now() - 1000 * 60 * 60 * 25,
      },
      {
        id: uuidv4(),
        type: "assistant",
        content: "Понимаю! Работа с целями - важная задача. Вот специалисты, которые помогут вам:",
        timestamp: Date.now() - 1000 * 60 * 60 * 25 + 1000,
        specialists: [mockSpecialists[1]],
      },
    ],
    searchQueries: ["лайф-коуч", "цели"],
    isAi: true,
    hasNew: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 25,
    footerContent: "Хотите узнать больше о любом из этих специалистов?",
  },

  // Чат с человеком
  {
    id: chatSpecialist2Id,
    title: "Михаил Сидоров",
    timestamp: "10:45",
    messages: [
      {
        id: uuidv4(),
        type: "user",
        content: "Здравствуйте! Интересует бизнес-коучинг",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
      },
      {
        id: uuidv4(),
        type: "specialist",
        content:
            "Привет! Отлично, что решили заняться развитием. Расскажите, какие у вас сейчас основные вызовы в бизнесе?",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 15,
      },
      {
        id: uuidv4(),
        type: "user",
        content: "Сложно с планированием и приоритизацией задач",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 30,
      },
      {
        id: uuidv4(),
        type: "assistant",
        content: "Михаил специализируется именно на таких вопросах! Вот его подход к решению подобных задач:",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 31,
      },
      {
        id: uuidv4(),
        type: "specialist",
        content:
            "Да, это частая проблема. Предлагаю начать с аудита ваших текущих процессов. Можем назначить сессию на следующей неделе?",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 45,
      },
    ],
    searchQueries: ["бизнес-коучинг", "планирование"],
    isAi: false,
    hasNew: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
]

export const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Алексей Петров',
    avatar: '/avatars/1.jpg',
    comment: 'Отличный сервис! Быстро и качественно выполнили работу. Рекомендую!',
    date: '2023-05-15',
    verified: true
  },
  {
    id: '2',
    author: 'Мария Иванова',
    avatar: '/avatars/2.jpg',
    comment: 'Осталась довольна результатом. Специалисты вежливые и профессиональные.',
    date: '2023-06-22',
    verified: true
  },
  {
    id: '3',
    author: 'Дмитрий Смирнов',
    avatar: '/avatars/3.jpg',
    comment: 'Цены немного выше среднего, но качество того стоит.',
    date: '2023-07-10',
    verified: false
  },
  {
    id: '4',
    author: 'Елена Кузнецова',
    avatar: '/avatars/4.jpg',
    comment: 'Были небольшие задержки по срокам, но в итоге всё сделали хорошо.',
    date: '2023-08-05',
    verified: true
  },
  {
    id: '5',
    author: 'Анонимный пользователь',
    avatar: '',
    comment: 'Не понравилось отношение сотрудников. Результат средний.',
    date: '2023-09-12',
    verified: false
  }
];

// Mock данные для услуг (обновлены ID)
export const mockServices: Service[] = [
  {
    id: service1Id,
    title: "Натальная карта",
    description: "Подробный разбор натальной карты с рекомендациями",
    price: 3500,
    duration: "90 минут",
    category: "Астрология",
    images: ["/placeholder.jpg"],
    specialist: mockSpecialists[0],
    tags: ["астрология", "натальная карта", "личность"],
    reviews: mockReviews,
    includes: ["Wipes", "Pencils", "Markers"]
  },
  {
    id: service2Id,
    title: "Коучинг сессия",
    description: "Индивидуальная коучинг сессия для достижения целей",
    price: 5000,
    duration: "90 минут",
    category: "Коучинг",
    images: ["/placeholder.jpg"],
    specialist: mockSpecialists[0],
    tags: ["коучинг", "цели", "развитие"],
    reviews: mockReviews,
    includes: ["Wipes", "Pencils", "Markers"]
  },
]

const fallbackMeetings: Booking[] = [
  {
    id: "1",
    specialist: {
      id: "1",
      name: "Dr. Anna Smith",
      photo: "/placeholder.svg?height=40&width=40",
    },
    service: {
      id: uuidv4(),
      name: "Натальная карта",
      price: 500,
    },
    date: new Date(Date.now() + 86400000),
    duration: 60,
    format: "video",
    status: "upcoming",
    requiresConfirmation: true,
  },
  {
    id: "2",
    specialist: {
      id: "2",
      name: "Michael Johnson",
      photo: "/placeholder.svg?height=40&width=40",
    },
    service: {
      id: uuidv4(),
      name: "Натальная карта",
      price: 500,
    },
    date: new Date(Date.now() + 86400000),
    duration: 45,
    format: "in-person",
    status: "upcoming",
    requiresConfirmation: true,
  },
  {
    id: uuidv4(),
    specialist: {
      id: "3",
      name: "Sarah Williams",
      photo: "/placeholder.svg?height=40&width=40",
    },
    service: {
      id: uuidv4(),
      name: "Натальная карта",
      price: 500,
    },
    date: new Date(Date.now() + 86400000),
    duration: 60,
    format: "video",
    status: "completed",
    requiresConfirmation: false,
  },
]

// Mock данные для результатов поиска (обновлены ID)
export const mockSearchResults: SearchResult[] = [
  {
    id: uuidv4(),
    query: "астрология",
    specialists: [mockSpecialists[0]],
    services: [mockServices[0]],
    timestamp: Date.now(),
  },
]

// Функции для группировки чатов по времени (остаются без изменений)
export const groupChatsByTime = (chats: ChatItem[]) => {
  const now = Date.now()
  const oneDayAgo = now - 24 * 60 * 60 * 1000
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000

  return {
    today: chats.filter((chat) => chat.updatedAt > oneDayAgo),
    last7Days: chats.filter((chat) => chat.updatedAt <= oneDayAgo && chat.updatedAt > sevenDaysAgo),
    older: chats.filter((chat) => chat.updatedAt <= sevenDaysAgo),
  }
}

// Функция для форматирования времени (остается без изменений)
export const formatTimestamp = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) {
    return 'сейчас'
  } else if (minutes < 60) {
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

// Helper функции для получения данных по ID (остаются без изменений)
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
  return mockSidebarChats.find((chat) => chat.id === id)
}

// Новые helper функции для работы с чатами
export const getChatDataById = (id: string): Chat | undefined => {
  return mockChatData.find((chat) => chat.id === id)
}

// Функция для добавления сообщения в чат
export const addMessageToChat = (chat: Chat, message: Omit<Message, "id">): Chat => {
  const newMessage: Message = {
    ...message,
    id: uuidv4(),
  }

  return {
    ...chat,
    messages: [...chat.messages, newMessage],
    timestamp: new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }
}

// Экспорт для совместимости со старым кодом
export const mockSavedSpecialists = mockSpecialists
export const mockSpecialist = mockSpecialists[0]
