import {v4 as uuidv4} from "uuid"
import type {User} from "@/types/user"
import type {CalendarEvent} from "@/types/calendar-event"
import type {Review, Service, Specialist} from "@/types/common"
import type {ChatItem} from "@/types/chats"

const specialist1Id = uuidv4()
const specialist2Id = uuidv4()
const specialist3Id = uuidv4();
const specialist4Id = uuidv4();
const specialist5Id = uuidv4();

const service1Id = uuidv4()
const service2Id = uuidv4()

function createMockFile(name: string, type = "image/svg+xml"): File {
  // Упрощенный SVG с текстом
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" fill="none"><rect width="1200" height="1200" fill="#EAEAEA" rx="3"/><g opacity=".5"><g opacity=".5"><path fill="#FAFAFA" d="M600.709 736.5c-75.454 0-136.621-61.167-136.621-136.62 0-75.454 61.167-136.621 136.621-136.621 75.453 0 136.62 61.167 136.62 136.621 0 75.453-61.167 136.62-136.62 136.62Z"/><path stroke="#C9C9C9" stroke-width="2.418" d="M600.709 736.5c-75.454 0-136.621-61.167-136.621-136.62 0-75.454 61.167-136.621 136.621-136.621 75.453 0 136.62 61.167 136.62 136.621 0 75.453-61.167 136.62-136.62 136.62Z"/></g><path stroke="url(#a)" stroke-width="2.418" d="M0-1.209h553.581" transform="scale(1 -1) rotate(45 1163.11 91.165)"/><path stroke="url(#b)" stroke-width="2.418" d="M404.846 598.671h391.726"/><path stroke="url(#c)" stroke-width="2.418" d="M599.5 795.742V404.017"/><path stroke="url(#d)" stroke-width="2.418" d="m795.717 796.597-391.441-391.44"/><path fill="#fff" d="M600.709 656.704c-31.384 0-56.825-25.441-56.825-56.824 0-31.384 25.441-56.825 56.825-56.825 31.383 0 56.824 25.441 56.824 56.825 0 31.383-25.441 56.824-56.824 56.824Z"/><g clip-path="url(#e)"><path fill="#666" fill-rule="evenodd" d="M616.426 586.58h-31.434v16.176l3.553-3.554.531-.531h9.068l.074-.074 8.463-8.463h2.565l7.18 7.181V586.58Zm-15.715 14.654 3.698 3.699 1.283 1.282-2.565 2.565-1.282-1.283-5.2-5.199h-6.066l-5.514 5.514-.073.073v2.876a2.418 2.418 0 0 0 2.418 2.418h26.598a2.418 2.418 0 0 0 2.418-2.418v-8.317l-8.463-8.463-7.181 7.181-.071.072Zm-19.347 5.442v4.085a6.045 6.045 0 0 0 6.046 6.045h26.598a6.044 6.044 0 0 0 6.045-6.045v-7.108l1.356-1.355-1.282-1.283-.074-.073v-17.989h-38.689v23.43l-.146.146.147Z" clip-rule="evenodd"/></g><path stroke="#C9C9C9" stroke-width="2.418" d="M600.709 656.704c-31.384 0-56.825-25.441-56.825-56.824 0-31.384 25.441-56.825 56.825-56.825 31.383 0 56.824 25.441 56.824 56.825 0 31.383-25.441 56.824-56.824 56.824Z"/></g><defs><linearGradient id="a" x1="554.061" x2="-.48" y1=".083" y2=".087" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><linearGradient id="b" x1="796.912" x2="404.507" y1="599.963" y2="599.965" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><linearGradient id="c" x1="600.792" x2="600.794" y1="403.677" y2="796.082" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><linearGradient id="d" x1="404.85" x2="796.972" y1="403.903" y2="796.02" gradientUnits="userSpaceOnUse"><stop stop-color="#C9C9C9" stop-opacity="0"/><stop offset=".208" stop-color="#C9C9C9"/><stop offset=".792" stop-color="#C9C9C9"/><stop offset="1" stop-color="#C9C9C9" stop-opacity="0"/></linearGradient><clipPath id="e"><path fill="#fff" d="M581.364 580.535h38.689v38.689h-38.689z"/></clipPath></defs></svg>`

  const blob = new Blob([svgContent], { type: "image/svg+xml" })

  return new File([blob], name, {
    type: "image/svg+xml",
    lastModified: Date.now(),
  })
}

// Использование
export const mockImages = [
  createMockFile("profile.svg"),
  createMockFile("session.svg"),
  createMockFile("session.svg"),
  createMockFile("session.svg"),
  createMockFile("session.svg"),
]

// Mock User Data
export const mockUser: User = {
  id: uuidv4(),
  first_name: "Ivan",
  last_name: "Ivanov",
  email: {
    address: "ivan.ivanov@example.com",
    verified: true,
  },
  images: [],
  location: "",
  timezone: "GMT+3",
  createdAt: new Date(2023, 6, 10, 11, 0),
  tier: "basic",
  isSpecialist: true,
  bio: "With over 15 years of experience in spiritual guidance and life coaching, I help clients find clarity, purpose, and balance. My approach combines traditional astrological wisdom with modern coaching techniques to create personalized paths for growth and transformation.",
  education: [
    {
      description: "Certified Life Coach, International Coach Federation",
      certificate: {
        name: "life-coach-certificate.pdf",
        size: 2456789,
        type: "application/pdf",
        lastModified: Date.now(),
        // В реальном приложении здесь будет File объект или ссылка на файл
      } as unknown as File, // Приведение типа для мока
    },
    {
      description: "Master's in Psychology, Stanford University",
      certificate: {
        name: "psychology-degree.jpg",
        size: 3456789,
        type: "image/jpeg",
        lastModified: Date.now(),
      } as unknown as File,
    },
    {
      description: "Yoga Instructor Certification",
      certificate: null, // Пример отсутствующего сертификата
    },
  ],
  experience: [
    {
      description: "Senior Life Coach at Mindful Living Center (2015-Present)",
    },
    {
      description: "Spiritual Guide at Wellness Collective (2010-2015)",
    },
  ],
  certifcates: [
    {
      description: "Certified Life Coach, International Coach Federation",
      certificate: {
        name: "life-coach-certificate.pdf",
        size: 2456789,
        type: "application/pdf",
        lastModified: Date.now(),
        // В реальном приложении здесь будет File объект или ссылка на файл
      } as unknown as File, // Приведение типа для мока
    },
    {
      description: "Master's in Psychology, Stanford University",
      certificate: {
        name: "psychology-degree.jpg",
        size: 3456789,
        type: "image/jpeg",
        lastModified: Date.now(),
      } as unknown as File,
    },
    {
      description: "Yoga Instructor Certification",
      certificate: null, // Пример отсутствующего сертификата
    },
  ],
  hat: "adept",
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

// Mock данные для специалистов (обновлены ID)
export const mockSpecialists: Specialist[] = [
  {
    id: specialist1Id,
    name: "Апполинария Шлюхтенбург-Кронштадтская",
    title: "Астролог и таролог с уклоном в квантовую болгарскую филологию с терморектальным анализом",
    avatar: "/placeholder.jpg",
    images: ["/placeholder.jpg", "/placeholder.jpg"],
    practices: 127,
    price: 3500,
    location: "Москва",
    description:
      "Профессиональный астролог с 10-летним опытом. Помогу разобраться в жизненных вопросах через призму астрологии.",
    specialties: ["Натальная астрология", "Таро", "Нумерология"],
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
    services: [
      {
        id: uuidv4(),
        title: "Натальная карта",
        description: "Полный анализ натальной карты с разбором основных аспектов и домов",
        format: "in-person",
        price: 5000,
        duration: "1.5 часа",
        images: ["/placeholder.jpg"],
        includes: [
          "Подробный разбор планет в знаках",
          "Анализ аспектов",
          "Рекомендации по развитию",
          "Запись консультации",
        ],
        specialist: {
          id: specialist1Id,
          name: "Анна Петрова",
          title: "Астролог и таролог",
          avatar: "placeholder.svg",
        },
        tags: ["натальная карта", "астрология", "индивидуальная консультация"],
        reviews: [],
      },
      {
        id: uuidv4(),
        title: "Гадание на Таро",
        description: "Ответы на вопросы с помощью карт Таро с детальным толкованием",
        format: "in-person",
        price: 3000,
        duration: "1 час",
        images: ["/placeholder.jpg"],
        includes: ["Ответы на 3 ключевых вопроса", "Разбор текущей ситуации", "Рекомендации на ближайший месяц"],
        specialist: {
          id: specialist1Id,
          name: "Анна Петрова",
          title: "Астролог и таролог",
          avatar: "placeholder.svg",
        },
        tags: ["таро", "гадание", "предсказание"],
        reviews: [],
      },
      {
        id: uuidv4(),
        title: "Карьерный коучинг",
        description: "Индивидуальная сессия по поиску профессионального пути",
        format: "in-person",
        price: 6000,
        duration: "1.5 часа",
        images: ["/placeholder.jpg"],
        includes: [
          "Анализ текущей ситуации",
          "Определение сильных сторон",
          "Разработка плана развития",
          "Дополнительные материалы",
        ],
        specialist: {
          id: specialist2Id,
          name: "Михаил Сидоров",
          title: "Лайф-коуч и бизнес-тренер",
          avatar: "placeholder.svg",
        },
        tags: ["карьера", "коучинг", "профессиональное развитие"],
        reviews: [],
      },
      {
        id: uuidv4(),
        title: "Пакет из 5 коуч-сессий",
        format: "in-person",
        description: "Комплексная работа над достижением целей с сопровождением",
        price: 25000,
        duration: "5 сессий по 1 часу",
        images: ["/placeholder.jpg"],
        includes: [
          "Первичная диагностика",
          "5 индивидуальных сессий",
          "Промежуточные задания",
          "Поддержка между сессиями",
        ],
        specialist: {
          id: specialist2Id,
          name: "Михаил Сидоров",
          title: "Лайф-коуч и бизнес-тренер",
          avatar: "placeholder.svg",
        },
        tags: ["пакет", "коучинг", "личное развитие"],
        reviews: [],
      },
    ],
    skills: ["Ковыряться в носу", "Пить зеленеую фею литрами", "Поддерживать себя", "Завтракать пивчканским"],
    certifcates: [
      {
        description: "Обучение в карьерном росте и личностном развитии",
        certificate: null,
      },
      {
        description: "Курсы повышения квалификации министерства магии",
        certificate: null
      }
    ],
    likes: 1488,
  },
  {
    id: specialist2Id,
    name: "Михаил Сидоров",
    title: "Лайф-коуч и бизнес-тренер",
    avatar: "/placeholder.jpg",
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    practices: 89,
    price: 5000,
    location: "Санкт-Петербург",
    description:
      "Помогаю людям достигать целей и раскрывать потенциал. Специализируюсь на карьерном росте и личностном развитии.",
    specialties: ["Лайф-коучинг", "Бизнес-коучинг", "Карьерное консультирование"],
    education: [
      {
        description: "Обучение в карьерном росте и личностном развитии",
        certificate: null,
      },
    ],
    experience: [],
    services: [],
    skills: ["Ковыряться в носу", "Пить зеленеую фею литрами", "Поддерживать себя", "Завтракать пивчканским"],
    certifcates: [
      {
        description: "Обучение в карьерном росте и личностном развитии",
        certificate: null,
      },
      {
        description: "Курсы повышения квалификации министерства магии",
        certificate: null
      }
    ],
    likes: 1337,
  },
  {
    id: specialist3Id,
    name: "Анна Волкова",
    title: "Клинический психолог",
    avatar: "/placeholder.jpg",
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    practices: 124,
    price: 4500,
    location: "Москва",
    description:
        "Специализируюсь на когнитивно-поведенческой терапии. Помогаю при тревожных расстройствах, депрессии и проблемах в отношениях.",
    specialties: ["КПТ", "Семейная терапия", "Кризисное консультирование"],
    education: [
      {
        description: "МГУ, факультет психологии",
        certificate: null,
      },
    ],
    experience: [
      {
        description: "Частная практика - 7 лет"
      },
      {
        description: "Психолог в центре психического здоровья - 3 года"
      }
    ],
    services: [],
    skills: ["Эмпатия", "Аналитическое мышление", "Работа с сопротивлением", "Медитация"],
    certifcates: [
      {
        description: "Сертификат по когнитивно-поведенческой терапии",
        certificate: null,
      }
    ],
    likes: 892,
  },
  {
    id: specialist4Id,
    name: "Дмитрий Жуков",
    title: "Финансовый консультант",
    avatar: "/placeholder.jpg",
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    practices: 215,
    price: 7500,
    location: "Новосибирск",
    description:
        "Эксперт по управлению капиталом и инвестициям. Помогаю создать финансовую стратегию и достичь финансовой независимости.",
    specialties: ["Инвестиции", "Финансовое планирование", "Налоговая оптимизация"],
    education: [
      {
        description: "Финансовый университет при Правительстве РФ",
        certificate: null,
      },
    ],
    experience: [
      {description: "Управляющий активами - 5 лет"},
      {description: "Финансовый аналитик в банке - 3 года"}
    ],
    services: [],
    skills: ["Анализ рынков", "Excel", "Прогнозирование", "Криптовалюты"],
    certifcates: [
      {
        description: "CFA Level I",
        certificate: null,
      },
      {
        description: "Сертифицированный финансовый планировщик",
        certificate: null
      }
    ],
    likes: 1562,
  },
  {
    id: specialist5Id,
    name: "Екатерина Белова",
    title: "Нутрициолог и wellness-коуч",
    avatar: "/placeholder.jpg",
    images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
    practices: 178,
    price: 3800,
    location: "Казань",
    description:
        "Создаю индивидуальные программы питания для здоровья, похудения и спортивных результатов. Работаю с пищевым поведением.",
    specialties: ["Снижение веса", "Спортивное питание", "Детокс"],
    education: [
      {
        description: "Институт интегративной нутрициологии",
        certificate: null,
      },
    ],
    experience: [
      {
        description:      "Консультант в фитнес-сети - 4 года",
      },
      {
        description:      "Автор программы «Осознанное питание»"
      }
    ],
    services: [],
    skills: ["Биохимия питания", "Мотивация", "Гастрономия", "Функциональный тренинг"],
    certifcates: [
      {
        description: "Сертификат по спортивной нутрициологии",
        certificate: null,
      },
      {
        description: "Курс по психологии пищевого поведения",
        certificate: null
      }
    ],
    likes: 2045,
  }
]

export const mockReviews: Review[] = [
  {
    id: "1",
    author: "Алексей Петров",
    avatar: "/avatars/1.jpg",
    comment: "Отличный сервис! Быстро и качественно выполнили работу. Рекомендую!",
    date: Date.now() - 1000 * 60 * 60 * 24 * 3,
    verified: true,
  },
  {
    id: "2",
    author: "Мария Иванова",
    avatar: "/avatars/2.jpg",
    comment: "Осталась довольна результатом. Специалисты вежливые и профессиональные.",
    date: Date.now() - 1000 * 60 * 60 * 24 * 3,
    verified: true,
  },
  {
    id: "3",
    author: "Дмитрий Смирнов",
    avatar: "/avatars/3.jpg",
    comment: "Цены немного выше среднего, но качество того стоит.",
    date: Date.now() - 1000 * 60 * 60 * 24 * 3,
    verified: false,
  },
  {
    id: "4",
    author: "Елена Кузнецова",
    avatar: "/avatars/4.jpg",
    comment: "Были небольшие задержки по срокам, но в итоге всё сделали хорошо.",
    date: Date.now() - 1000 * 60 * 60 * 24 * 3,
    verified: true,
  },
  {
    id: "5",
    author: "Анонимный пользователь",
    avatar: "",
    comment: "Не понравилось отношение сотрудников. Результат средний.",
    date: Date.now() - 1000 * 60 * 60 * 24 * 3,
    verified: false,
  },
]

// Mock данные для услуг (обновлены ID)
export const mockServices: Service[] = [
  {
    id: service1Id,
    title: "Натальная карта",
    description: "Подробный разбор натальной карты с рекомендациями",
    price: 3500,
    duration: "90 минут",
    images: ["/placeholder.jpg"],
    specialist: mockSpecialists[0],
    tags: ["астрология", "натальная карта", "личность"],
    reviews: mockReviews,
    includes: ["Wipes", "Pencils", "Markers"],
    format: "video",
  },
  {
    id: service2Id,
    title: "Коучинг сессия",
    description: "Индивидуальная коучинг сессия для достижения целей",
    price: 5000,
    duration: "90 минут",
    images: ["/placeholder.jpg"],
    specialist: mockSpecialists[0],
    tags: ["коучинг", "цели", "развитие"],
    reviews: mockReviews,
    includes: ["Wipes", "Pencils", "Markers"],
    format: "video",
  },
  {
    id: uuidv4(),
    title: "Натальная карта",
    description: "Полный анализ натальной карты с разбором основных аспектов и домов",
    price: 5000,
    duration: "1.5 часа",
    images: ["/astrology-service1.jpg", "/astrology-service2.jpg"],
    includes: [
      "Подробный разбор планет в знаках",
      "Анализ аспектов",
      "Рекомендации по развитию",
      "Запись консультации",
    ],
    specialist: {
      id: specialist1Id,
      name: "Анна Петрова",
      title: "Астролог и таролог",
      avatar: "placeholder.svg"
    },
    tags: ["натальная карта", "астрология", "индивидуальная консультация"],
    reviews: [],
    format: "video",
  },
  {
    id: uuidv4(),
    title: "Гадание на Таро",
    description: "Ответы на вопросы с помощью карт Таро с детальным толкованием",
    price: 3000,
    duration: "1 час",
    images: ["/taro-service1.jpg"],
    includes: ["Ответы на 3 ключевых вопроса", "Разбор текущей ситуации", "Рекомендации на ближайший месяц"],
    specialist: {
      id: specialist1Id,
      name: "Анна Петрова",
      title: "Астролог и таролог",
      avatar: "placeholder.svg"
    },
    tags: ["таро", "гадание", "предсказание"],
    reviews: [],
    format: "in-person",
  },
  {
    id: uuidv4(),
    title: "Карьерный коучинг",
    description: "Индивидуальная сессия по поиску профессионального пути",
    price: 6000,
    duration: "1.5 часа",
    images: ["/coaching-service1.jpg", "/coaching-service2.jpg"],
    includes: [
      "Анализ текущей ситуации",
      "Определение сильных сторон",
      "Разработка плана развития",
      "Дополнительные материалы",
    ],
    specialist: {
      id: specialist2Id,
      name: "Михаил Сидоров",
      title: "Лайф-коуч и бизнес-тренер",
      avatar: "placeholder.svg"
    },
    tags: ["карьера", "коучинг", "профессиональное развитие"],
    reviews: [],
    format: "video",
  },
  {
    id: uuidv4(),
    title: "Пакет из 5 коуч-сессий",
    description: "Комплексная работа над достижением целей с сопровождением",
    price: 25000,
    duration: "5 сессий по 1 часу",
    images: ["/coaching-package.jpg"],
    includes: ["Первичная диагностика", "5 индивидуальных сессий", "Промежуточные задания", "Поддержка между сессиями"],
    specialist: {
      id: specialist2Id,
      name: "Михаил Сидоров",
      title: "Лайф-коуч и бизнес-тренер",
      avatar: "placeholder.svg"
    },
    tags: ["пакет", "коучинг", "личное развитие"],
    reviews: [],
    format: "video",
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

// Helper функции для получения данных по ID (остаются без изменений)
export const getSpecialistById = (id: string): Specialist | undefined => {
  return mockSpecialists.find((specialist) => specialist.id === id)
}

// Экспорт для совместимости со старым кодом
export const mockSavedSpecialists = mockSpecialists
export const mockSpecialist = mockSpecialists[0]
