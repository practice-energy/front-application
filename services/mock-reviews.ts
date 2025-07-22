import {v4 as uuidv4} from "uuid"
import type {Review} from "@/types/common";

export const mockReviews: Review[] = [
    {
        id: uuidv4(),
        author: "Алексей Петров",
        avatar: "/avatars/1.jpg",
        comment: "Отличный сервис! Быстро и качественно выполнили работу. Рекомендую!",
        date: Date.now() - 1000 * 60 * 60 * 24 * 3,
        verified: true,
    },
    {
        id: uuidv4(),
        author: "Мария Иванова",
        avatar: "/avatars/2.jpg",
        comment: "Осталась довольна результатом. Специалисты вежливые и профессиональные.",
        date: Date.now() - 1000 * 60 * 60 * 24 * 3,
        verified: true,
    },
    {
        id: uuidv4(),
        author: "Дмитрий Смирнов",
        avatar: "/avatars/3.jpg",
        comment: "Цены немного выше среднего, но качество того стоит.",
        date: Date.now() - 1000 * 60 * 60 * 24 * 3,
        verified: false,
    },
    {
        id: uuidv4(),
        author: "Елена Кузнецова",
        avatar: "/avatars/4.jpg",
        comment: "Были небольшие задержки по срокам, но в итоге всё сделали хорошо.",
        date: Date.now() - 1000 * 60 * 60 * 24 * 3,
        verified: true,
    },
    {
        id: uuidv4(),
        author: "Анонимный пользователь",
        avatar: "",
        comment: "Не понравилось отношение сотрудников. Результат средний.",
        date: Date.now() - 1000 * 60 * 60 * 24 * 3,
        verified: false,
    },
]
