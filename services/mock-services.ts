// Mock данные для услуг (обновлены ID)
import type {Service} from "@/types/common";
import {mockSpecialists} from "@/services/mock-specialists";
import {mockFeedbacks} from "@/services/mock-feedbacks";
import {v4 as uuidv4} from "uuid";
import {service1Id, service2Id, specialist1Id, specialist2Id} from "@/services/mock-data";

export const mockServices: Service[] = [
    {
        id: service1Id,
        title: "Натальная карта",
        description: "Подробный разбор натальной карты с рекомендациями",
        price: 3500,
        duration: "90 минут",
        images: [
            // "/placeholder.jpg",
            "/placeholder.jpg",
            "/placeholder.jpg",
        ],
        specialist: mockSpecialists[0],
        tags: ["астрология", "натальная карта", "личность"],
        reviews: mockFeedbacks,
        includes: ["Wipes", "Pencils", "Markers", "Wipes", "Pencils", "Markers"],
        format: "video",
        practice: "30 минут",
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
        reviews: mockFeedbacks,
        includes: ["Wipes", "Pencils", "Markers"],
        format: "video",
        practice: "30 минут",
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
        practice: "30 минут",
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
        practice: "30 минут",
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
        practice: "30 минут",
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
        practice: "30 минут",
    },
]
