// Mock данные для специалистов (обновлены ID)
import {v4 as uuidv4} from "uuid";
import {
    service1Id, service2Id,
    specialist1Id,
    specialist2Id,
    specialist3Id,
    specialist4Id,
    specialist5Id
} from "@/services/mock-data";
import {Specialist} from "@/types/specialist";

export const mockSpecialists: Specialist[] = [
    {
        id: specialist1Id,
        name: "Апполинария Шлюхтенбург-Кронштадтская Фон Таргариен",
        title: "Астролог и таролог с уклоном в квантовую болгарскую филологию с терморектальным анализом Королева Андалов, Ройнаров и Первых Людей, Защитница Семи Королевств, Королева Миэрина, Кхалиси Великого Травяного Моря, Бурерожденная, Матерь Драконов, Разрушительница Оков, Неопалимая, Низвергательница Колдунов",
        avatar: "/test-photo.jpg",
        images: ["/placeholder.jpg", "/placeholder.jpg"],
        practices: 127,
        price: 3500,
        location: "Москва, Балашиха",
        description:
            "Профессиональный астролог с 10-летним опытом. Помогу разобраться в жизненных вопросах через призму астрологии. Унесу все ваши тревоги на единорогах. Конечно, Снежаночка: так осознанно описала параметры что можно выбрать буквально из 3 наиболее подходящих для тебя мастеров.",
        specialties: ["Натальная астрология", "Таро", "Нумерология"],
        education: [
            {
                title: "Академия эскортных искусств, факультет инстапсихологии кафедра ИУ-14",
                description: "Изучение основ натальной астрологии и прогностических техник шмурдяк вообще пох что лишь бы было напиши за меня сам придумай за что мне жать денег",
                certificate: "/placeholder.jpg",
            },
            {
                title: "Академия эскортных искусств, факультет инстапсихологии кафедра ИУ-14",
                description: "Изучение основ натальной астрологии и прогностических техник шмурдяк вообще пох что лишь бы было напиши за меня сам придумай за что мне жать денег",
            },
        ],
        experience: [
            {
                description: "Изучение основ натальной астрологии и прогностических техник шмурдяк вообще пох что лишь бы было напиши за меня сам придумай за что мне жать денег",
            },
            {
                description: "Изучение основ натальной астрологии и прогностических техник шмурдяк вообще пох что лишь бы было напиши за меня сам придумай за что мне жать денег",
            },
            {
                description: "Изучение основ натальной астрологии и прогностических техник шмурдяк вообще пох что лишь бы было напиши за меня сам придумай за что мне жать денег",
            },
            {
                description: "Изучение основ натальной астрологии и прогностических техник шмурдяк вообще пох что лишь бы было напиши за меня сам придумай за что мне жать денег",
            },
        ],
        services: [
            {
                id: service1Id,
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
                settings: {
                    video: {
                        practices: [],
                        score: 1,
                        enabled: true,
                    },
                    inPerson: {
                        practices: [],
                        score: 2,
                        enabled: false,
                    },
                },
            },
            {
                id: service2Id,
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
                settings: {
                    video: {
                        practices: [],
                        score: 1,
                        enabled: false,
                    },
                    inPerson: {
                        practices: [],
                        score: 2,
                        enabled: false,
                    },
                },
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
        skills: ["Ковыряться в носу", "Пить зеленеую фею литрами", "Поддерживать себя", "Завтракать пивчканским", "Ездить с папиками в Дубайск"],
        certificates: [
            {
                title: "Академия эскортных искусств, факультет инстапсихологии",
                description: "Изучение основ натальной астрологии и прогностических техник шмурдяк вообще пох что лишь бы было напиши за меня сам придумай за что мне жать денег",
                certificate: "/placeholder.jpg",
            },
        ],
        likes: 1488,
    },
    {
        id: specialist2Id,
        name: "Михаил Сидоров",
        title: "Лайф-коуч и бизнес-тренер",
        avatar: "/test-photo-2.jpg",
        images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
        practices: 89,
        price: 5000,
        location: "Санкт-Петербург",
        description:
            "Помогаю людям достигать целей и раскрывать потенциал. Специализируюсь на карьерном росте и личностном развитии.",
        specialties: ["Лайф-коучинг", "Бизнес-коучинг", "Карьерное консультирование"],
        education: [
            {
                title: "Академия эскортных искусств, факультет инстапсихологии",
                description: "Обучение в карьерном росте и личностном развитии",
            },
        ],
        experience: [],
        services: [],
        skills: ["Ковыряться в носу", "Пить зеленеую фею литрами", "Поддерживать себя", "Завтракать пивчканским"],
        certificates: [
            {
                title: "Академия эскортных искусств, факультет инстапсихологии",
                description: "Изучение основ натальной астрологии и прогностических техник",
                certificate: "/placeholder.jpg",
            },
            {
                title: "Академия эскортных искусств, факультет инстапсихологии",
                description: "Изучение основ натальной астрологии и прогностических техник",
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
        education: [],
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
        certificates: [],
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
        education: [],
        experience: [
            {description: "Управляющий активами - 5 лет"},
            {description: "Финансовый аналитик в банке - 3 года"}
        ],
        services: [],
        skills: ["Анализ рынков", "Excel", "Прогнозирование", "Криптовалюты"],
        certificates: [],
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
        education: [],
        experience: [
            {
                description: "Консультант в фитнес-сети - 4 года",
            },
            {
                description: "Автор программы «Осознанное питание»"
            }
        ],
        services: [],
        skills: ["Биохимия питания", "Мотивация", "Гастрономия", "Функциональный тренинг"],
        certificates: [],
        likes: 2045,
    }
]

// Экспорт для совместимости со старым кодом
// Helper функции для получения данных по ID (остаются без изменений)
export const getSpecialistById = (id: string): Specialist | undefined => {
    return mockSpecialists.find((specialist) => specialist.id === id)
}

export const mockSavedSpecialists = mockSpecialists
export const mockSpecialist = mockSpecialists[0]
