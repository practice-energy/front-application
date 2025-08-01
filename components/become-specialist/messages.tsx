import {v4 as uuidv4} from "uuid";
import {becomeSpecialistTags} from "@/services/become-specialist-tree-tag";


export const messageInitMaster = {
    id: uuidv4(),
    type: "become-specialist-drops" as const,
    tags: becomeSpecialistTags,
    content:
        "Приветствую вас на пути, где свет и тень вечного познания переплетаются с технологиями. Я - Alura, ваша спутница в этом путешествии\n\nНачинаем с выбора подходящих областей специализации. Какие ближе для ваших практис?",
    timestamp: Date.now(),
    footerContent: "Если часть вашей области пока не добавлена в чате выше, можете написать мне и она может появиться в ближайшее время а я вернусь к вам с оповещением, как только это произойдет.",
    aiMessageType: "become-specialist-drops" as const,
}

interface SelectorQuestion {
    question: string;
    variants: string[];
}

interface SelectorModel {
    questions: SelectorQuestion[];
}

const personalitySelector: SelectorModel = {
    questions: [
        {
            question: "Ваша реакция на неопределённость:",
            variants: [
                "Исследую возможности",
                "Составляю план",
                "Наблюдаю закономерности"
            ]
        },
        {
            question: "Источник жизненных сил:",
            variants: [
                "Социальная активность",
                "Достижение целей",
                "Внутренняя гармония"
            ]
        },
        {
            question: "Отношение к ошибкам:",
            variants: [
                "Это эксперимент",
                "Урок для улучшения",
                "Часть жизненного пути"
            ]
        },
        {
            question: "Ценность времени:",
            variants: [
                "Новый опыт",
                "Результат",
                "Осмысленность"
            ]
        }
    ]
};