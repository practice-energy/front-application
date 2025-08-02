import type { Tag } from "@/types/chats"

export interface PersonalityQuestion {
  id: string
  question: string
  options: Tag[]
}

export const personalitySelector: PersonalityQuestion[] = [
  {
    id: "question-1",
    question: "Как вы предпочитаете работать с клиентами?",
    options: [{ name: "Индивидуально" }, { name: "В группе" }, { name: "Смешанный формат" }, { name: "Онлайн только" }],
  },
  {
    id: "question-2",
    question: "Какой стиль общения вам ближе?",
    options: [{ name: "Формальный" }, { name: "Дружеский" }, { name: "Профессиональный" }, { name: "Творческий" }],
  },
  {
    id: "question-3",
    question: "Как вы относитесь к нестандартным запросам?",
    options: [
      { name: "Принимаю с энтузиазмом" },
      { name: "Осторожно изучаю" },
      { name: "Предпочитаю стандарт" },
      { name: "Избегаю" },
    ],
  },
  {
    id: "question-4",
    question: "Ваш подход к планированию работы?",
    options: [
      { name: "Строгое расписание" },
      { name: "Гибкий график" },
      { name: "По настроению" },
      { name: "Спонтанно" },
    ],
  },
]

// Helper function to create personality test message
export const createPersonalityTestMessage = (
  question: PersonalityQuestion,
): Omit<import("@/types/chats").Message, "id"> => {
  return {
    type: "assistant",
    content: question.question,
    timestamp: Date.now(),
    aiMessageType: "profile-test",
    questionId: question.id,
    tags: question.options,
  }
}
