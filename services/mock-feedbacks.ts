import {v4 as uuidv4} from "uuid"

import {Feedback} from "@/types/feedback";

export const mockFeedbacks: Feedback[] = [
    {
        id: uuidv4(),
        author: "Алексей Петров",
        avatar: "/test-photo.jpg",
        comment: "Отличный сервис! Быстро и качественно выполнили работу. Рекомендую!",
        date: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
    {
        id: uuidv4(),
        author: "Мария Иванова",
        avatar: "/test-photo.jpg",
        comment: "Осталась довольна результатом. Специалисты вежливые и профессиональные.",
        date: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
    {
        id: uuidv4(),
        author: "Дмитрий Смирнов",
        avatar: "/test-photo-2.jpg",
        comment: "Цены немного выше среднего, но качество того стоит.",
        date: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
    {
        id: uuidv4(),
        author: "Елена Кузнецова",
        avatar: "/test-photo-2.jpg",
        comment: "Были небольшие задержки по срокам, но в итоге всё сделали хорошо.",
        date: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
    {
        id: uuidv4(),
        author: "Анонимный пользователь",
        avatar: "",
        comment: "Не понравилось отношение сотрудников. Результат средний.",
        date: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
]
