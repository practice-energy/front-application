import { v4 as uuidv4 } from "uuid"
import { becomeSpecialistTags } from "@/services/become-specialist-tree-tag"

export const messageInitMaster = {
  id: uuidv4(),
  type: "become-specialist-drops" as const,
  tags: becomeSpecialistTags,
  content:
    "Приветствую вас на пути, где свет и тень вечного познания переплетаются с технологиями. Я - Alura, ваша спутница в этом путешествии\n\nНачинаем с выбора подходящих областей специализации. Какие ближе для ваших практис?",
  timestamp: Date.now(),
  footerContent:
    "Если часть вашей области пока не добавлена в чате выше, можете написать мне и она может появиться в ближайшее время а я вернусь к вам с оповещением, как только это произойдет.",
  aiMessageType: "become-specialist-drops" as const,
}

interface SelectorQuestion {
  question: string
  variants: string[]
}

interface SelectorModel {
  questions: SelectorQuestion[]
  v1: string[] // Вопросы для версии V1 (Молодая)
  v2: string[] // Вопросы для версии V2 (Зрелая)
  v3: string[] // Вопросы для версии V3 (Мудрая)
}

export const personalitySelector: SelectorModel = {
  questions: [
    {
      question: "Ваша реакция на неопределённость:",
      variants: ["Исследую возможности", "Составляю план", "Наблюдаю закономерности"],
    },
    {
      question: "Источник жизненных сил:",
      variants: ["Социальная активность", "Достижение целей", "Внутренняя гармония"],
    },
    {
      question: "Отношение к ошибкам:",
      variants: ["Это эксперимент", "Урок для улучшения", "Часть жизненного пути"],
    },
    {
      question: "Ценность времени:",
      variants: ["Новый опыт", "Результат", "Осмысленность"],
    },
  ],
  v1: [
    "Я готов пробовать новое без плана",
    "Риск делает жизнь интереснее",
    "Я часто откладываю скучные задачи",
    "Спонтанность лучше плана",
    "Вечеринка с незнакомцами - это круто",
    "Одиночество угнетает меня",
    "Я помогаю, если это весело",
    "Конкуренция важнее сотрудничества",
    "Я волнуюсь перед новыми событиями",
    "Неудачи не испортят мой день",
  ],
  v2: [
    "Изучаю новое только если полезно",
    "Инновации должны иметь практическую ценность",
    "Расписание — мой главный инструмент",
    "Всё должно быть сделано идеально",
    "Работа в команде повышает эффективность",
    "Светские беседы — пустая трата времени",
    "Наставничество — моя ответственность",
    "Критиковать важно для роста",
    "Ошибки заставляют пересматривать планы",
    "Стресс мобилизует меня",
  ],
  v3: [
    "Созерцание природы даёт новые инсайты",
    "Простота — высшая форма сложности",
    "Гибкость важнее строгого плана",
    "Перфекционизм мешает гармонии",
    "Глубокий диалог ценнее вечеринки",
    "Молчание — мощный инструмент",
    "Принимаю людей такими, какие есть",
    "Конфликты разрешаются через понимание",
    "Жизненные трудности — уроки мудрости",
    "Внутренний покой не зависит от обстоятельств",
  ],
}

// Helper function to get version-specific questions
export const getVersionQuestions = (version: 1 | 2 | 3): string[] => {
  switch (version) {
    case 1:
      return personalitySelector.v1
    case 2:
      return personalitySelector.v2
    case 3:
      return personalitySelector.v3
    default:
      return personalitySelector.v1
  }
}

// Helper function to create version-specific messages
export const createVersionMessage = (question: string, index: number, content: string = "", footer: string ="") => ({
  id: uuidv4(),
  type: "assistant",
  content: content,
  timestamp: Date.now(),
  aiMessageType: "version-test" as const,
  testQuestion: question,
  questionIndex: index,
  footerContent: footer,
  isAI: true,
})

export const initVersionTestMessage = "Теперь, когда области специальнсти определены, давайте углубимся в ваши внутренние миры.\n\nОтветы позволят мне лучше понять, каких инициантов для вас подбирать:"

export const initVersionTestMessageFooter = "Ответы в безопасности и надёжно защищены: только вы и я имеем к ним доступ."