// Generate UUIDs for all chat and specialist IDs first
import {v4 as uuidv4} from "uuid";
import type {Chat} from "@/types/chats";

import {mockSpecialists} from "@/services/mock-specialists";

const chatAI1Id = uuidv4()
const chatSpecialist1Id = uuidv4()
const chatAI2Id = uuidv4()
const chatSpecialist2Id = uuidv4()
const chatAI3Id = uuidv4();
const chatSpecialist3Id = uuidv4();
const chatAI4Id = uuidv4();
const chatSpecialist4Id = uuidv4();
const chatAI5Id = uuidv4();
const chatSpecialist5Id = uuidv4();

// Mock данные для чатов
export const mockChatData: Chat[] = [
    // AI чат с Allura
    {
        id: chatAI1Id,
        title: "Поиск астролога",
        timestamp: Date.now() - 1000 * 60 * 30,
        messages: [
            {
                id: uuidv4(),
                type: "user",
                content: "Ищу хорошего астролога для консультации",
                timestamp: Date.now() - 1000 * 60 * 30,
                tags: []
            },
            {
                id: uuidv4(),
                type: "assistant",
                content: "Отлично! Я помогу вам найти подходящего астролога. Вот несколько специалистов с высоким рейтингом:",
                timestamp: Date.now() - 1000 * 60 * 29,
                specialists: [mockSpecialists[0]],
                tags: []
            },
        ],
        isAI: true,
        hasNew: false,
        createdAt: Date.now() - 1000 * 60 * 30,
    },

    // Чат с человеком-специалистом, но с сообщениями от Allura
    {
        id: chatSpecialist1Id,
        title: "Анна Петрова",
        timestamp: Date.now() - 1000 * 60 * 120,
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
            {
                id: uuidv4(),
                type: "assistant",
                content: "Изи родная, погнали?",
                timestamp: Date.now() - 1000 * 60 * 119,
                aiMessageType: "service",
            },
        ],
        isAI: false,
        hasNew: true,
        status: "waiting",
        createdAt: Date.now() - 1000 * 60 * 120,
    },

    // Еще один AI чат
    {
        id: chatAI2Id,
        title: "Поиск коуча",
        timestamp: Date.now() - 1000 * 60 * 60 * 25,
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
        isAI: true,
        hasNew: false,
        createdAt: Date.now() - 1000 * 60 * 60 * 25,
        footerContent: "Хотите узнать больше о любом из этих специалистов?",
        status: "confirmed",
    },

    // Чат с человеком
    {
        id: chatSpecialist2Id,
        title: "Михаил Сидоров",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
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
        isAI: false,
        hasNew: false,
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
    // AI chat about nutrition
    {
        id: chatAI3Id,
        title: "Поиск нутрициолога",
        timestamp: Date.now() - 1000 * 60 * 45,
        messages: [
            {
                id: uuidv4(),
                type: "user",
                content: "Ищу специалиста по питанию для составления индивидуального плана",
                timestamp: Date.now() - 1000 * 60 * 45,
            },
            {
                id: uuidv4(),
                type: "assistant",
                content: "Отлично! Вот проверенные нутрициологи, которые могут помочь:",
                timestamp: Date.now() - 1000 * 60 * 44,
                specialists: [mockSpecialists[2], mockSpecialists[3]],
            },
        ],
        isAI: true,
        hasNew: false,
        createdAt: Date.now() - 1000 * 60 * 45,
        footerContent: "Какой тип питания вас интересует?",
    },

    // Chat with a nutrition specialist
    {
        id: chatSpecialist3Id,
        title: "Елена Воробьева",
        timestamp: Date.now() - 1000 * 60 * 60 * 12,
        messages: [
            {
                id: uuidv4(),
                type: "user",
                content: "Здравствуйте! Хочу перейти на правильное питание",
                timestamp: Date.now() - 1000 * 60 * 60 * 12,
            },
            {
                id: uuidv4(),
                type: "specialist",
                content: "Приветствую! Расскажите, какие у вас цели и текущие пищевые привычки?",
                timestamp: Date.now() - 1000 * 60 * 60 * 11,
            },
            {
                id: uuidv4(),
                type: "assistant",
                content: "Елена запросила дополнительную информацию для составления оптимального плана",
                timestamp: Date.now() - 1000 * 60 * 60 * 10,
                aiMessageType: "service",
            },
        ],
        isAI: false,
        hasNew: true,
        status: "waiting",
        createdAt: Date.now() - 1000 * 60 * 60 * 12,
    },

    // AI chat about legal consultation
    {
        id: chatAI4Id,
        title: "Юридическая консультация",
        timestamp: Date.now() - 1000 * 60 * 60 * 48,
        messages: [
            {
                id: uuidv4(),
                type: "user",
                content: "Нужен юрист для консультации по разделу имущества",
                timestamp: Date.now() - 1000 * 60 * 60 * 48,
            },
            {
                id: uuidv4(),
                type: "assistant",
                content: "Понимаю ситуацию. Вот специалисты по семейному праву:",
                timestamp: Date.now() - 1000 * 60 * 60 * 47,
                specialists: [mockSpecialists[1]],
            },
        ],
        isAI: true,
        hasNew: false,
        createdAt: Date.now() - 1000 * 60 * 60 * 48,
        footerContent: "Укажите дополнительные детали для более точного подбора",
    },

    // Chat with a lawyer
    {
        id: chatSpecialist4Id,
        title: "Алексей Ковалев",
        timestamp: Date.now() - 1000 * 60 * 60 * 72,
        specialistId: mockSpecialists[1].id,
        messages: [
            {
                id: uuidv4(),
                type: "user",
                content: "Здравствуйте! У нас с супругой спор по разделу квартиры",
                timestamp: Date.now() - 1000 * 60 * 60 * 72,
            },
            {
                id: uuidv4(),
                type: "specialist",
                content: "Добрый день. Когда была приобретена квартира и на чьи средства?",
                timestamp: Date.now() - 1000 * 60 * 60 * 70,
            },
            {
                id: uuidv4(),
                type: "user",
                content: "Купили 3 года назад в браке, платили из общего бюджета",
                timestamp: Date.now() - 1000 * 60 * 60 * 68,
            },
            {
                id: uuidv4(),
                type: "assistant",
                content: "Алексей подготовил предварительный анализ вашей ситуации:",
                timestamp: Date.now() - 1000 * 60 * 60 * 65,
                aiMessageType: "service",
            },
            {
                id: uuidv4(),
                type: "specialist",
                content: "В таком случае квартира подлежит разделу в равных долях. Предлагаю встретиться для детального обсуждения.",
                timestamp: Date.now() - 1000 * 60 * 60 * 60,
            },
        ],
        isAI: false,
        hasNew: false,
        status: "confirmed",
        createdAt: Date.now() - 1000 * 60 * 60 * 72,
    },

    // AI chat with multiple specialist suggestions
    {
        id: chatAI5Id,
        title: "Подбор психолога",
        timestamp: Date.now() - 1000 * 60 * 60 * 96,
        messages: [
            {
                id: uuidv4(),
                type: "user",
                content: "Ищу психолога для работы с тревожностью",
                timestamp: Date.now() - 1000 * 60 * 60 * 96,
            },
            {
                id: uuidv4(),
                type: "assistant",
                content: "Вот несколько специалистов с разными подходами к работе с тревожностью:",
                timestamp: Date.now() - 1000 * 60 * 60 * 95,
                specialists: [mockSpecialists[1], mockSpecialists[2], mockSpecialists[3]],
            },
        ],
        isAI: true,
        hasNew: false,
        createdAt: Date.now() - 1000 * 60 * 60 * 96,
        footerContent: "Какой подход вам ближе: КПТ, психоанализ или гештальт?",
    },

    // Chat with declined request
    {
        id: chatSpecialist5Id,
        title: "Ольга Семенова",
        timestamp: Date.now() - 1000 * 60 * 60 * 120,
        specialistId: mockSpecialists[3].id,
        messages: [
            {
                id: uuidv4(),
                type: "user",
                content: "Добрый день! Хотела бы записаться на консультацию по поводу тревожности",
                timestamp: Date.now() - 1000 * 60 * 60 * 120,
            },
            {
                id: uuidv4(),
                type: "assistant",
                content: "Ваш запрос отправлен Ольге. Ожидайте ответа в течение 24 часов.",
                timestamp: Date.now() - 1000 * 60 * 60 * 119,
                aiMessageType: "service",
            },
            {
                id: uuidv4(),
                type: "specialist",
                content: "Благодарю за обращение! К сожалению, в ближайший месяц у меня нет свободных окон. Могу порекомендовать коллег.",
                timestamp: Date.now() - 1000 * 60 * 60 * 100,
            },
        ],
        isAI: false,
        hasNew: false,
        status: "declined",
        createdAt: Date.now() - 1000 * 60 * 60 * 120,
    }
]
