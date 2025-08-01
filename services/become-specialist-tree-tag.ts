import {Tag} from "@/types/chats";

export const becomeSpecialistTags: Tag[] = [
    {
        name: "Важное",
        subtags: [
            { name: "Срочно" },
            { name: "Приоритет" },
        ],
    },
    {
        name: "Тема",
        subtags: [
            { name: "Дизайн" },
            { name: "Разработка", subtags: [{ name: "Frontend" }, { name: "Backend" }] },
            { name: "Маркетинг" },
        ],
    },
    {
        name: "Статус",
        subtags: [
            { name: "Новый" },
            { name: "В работе" },
            { name: "Завершен" },
        ],
    },
    {
        name: "Клиент",
        subtags: [
            { name: "VIP" },
            { name: "Постоянный" },
            { name: "Новый" },
        ],
    },
    {
        name: "Технологии",
        subtags: [
            { name: "React" },
            { name: "Node.js" },
            { name: "UI/UX" },
        ],
    },
];