import type { Tag } from "@/types/chats"

export const personalitySelector: Tag[][] = [
  // Question 1: Как вы предпочитаете работать?
  [{ name: "В команде" }, { name: "Индивидуально" }, { name: "Смешанный подход" }, { name: "Зависит от проекта" }],
  // Question 2: Что вас больше мотивирует?
  [
    { name: "Творческие задачи" },
    { name: "Технические вызовы" },
    { name: "Помощь людям" },
    { name: "Финансовая стабильность" },
  ],
  // Question 3: Как вы относитесь к дедлайнам?
  [
    { name: "Всегда соблюдаю" },
    { name: "Стараюсь соблюдать" },
    { name: "Иногда нарушаю" },
    { name: "Работаю в своем темпе" },
  ],
  // Question 4: Ваш подход к обучению?
  [
    { name: "Постоянно изучаю новое" },
    { name: "Изучаю по необходимости" },
    { name: "Предпочитаю проверенные методы" },
    { name: "Учусь на практике" },
  ],
]

export const personalityQuestions = [
  "Как вы предпочитаете работать?",
  "Что вас больше мотивирует?",
  "Как вы относитесь к дедлайнам?",
  "Ваш подход к обучению?",
]

// Helper function to create personality test message
export const createPersonalityTestMessage = (questionIndex: number, content: string) => {
  return {
    type: "assistant" as const,
    content,
    timestamp: Date.now(),
    aiMessageType: "profile-test" as const,
    tags: personalitySelector[questionIndex] || [],
    questionId: `question-${questionIndex + 1}`,
  }
}
