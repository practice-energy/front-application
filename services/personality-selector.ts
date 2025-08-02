export interface PersonalityQuestion {
  id: string
  question: string
  options: string[]
}

export const personalityQuestions: PersonalityQuestion[] = [
  {
    id: "question-1",
    question: "Как вы предпочитаете работать с клиентами?",
    options: ["Индивидуально", "В группе", "Смешанный формат", "Онлайн только"],
  },
  {
    id: "question-2",
    question: "Какой стиль общения вам ближе?",
    options: ["Формальный", "Дружеский", "Профессиональный", "Творческий"],
  },
  {
    id: "question-3",
    question: "Как вы относитесь к нестандартным запросам?",
    options: ["Принимаю с энтузиазмом", "Осторожно изучаю", "Предпочитаю стандарт", "Избегаю"],
  },
  {
    id: "question-4",
    question: "Ваш подход к планированию работы?",
    options: ["Строгое расписание", "Гибкий график", "По настроению", "Спонтанно"],
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
    tags: question.options.map((option) => ({ name: option })),
  }
}
