import type { Tag } from "@/types/chats"

export interface PersonalityQuestion {
  id: string
  question: string
  options: Tag[]
}

export const personalityQuestions: PersonalityQuestion[] = [
  {
    id: "work-style",
    question: "Как вы предпочитаете работать?",
    options: [{ name: "Самостоятельно" }, { name: "В команде" }, { name: "Гибридно" }, { name: "По ситуации" }],
  },
  {
    id: "communication",
    question: "Какой стиль общения вам ближе?",
    options: [{ name: "Прямой" }, { name: "Дипломатичный" }, { name: "Дружелюбный" }, { name: "Формальный" }],
  },
  {
    id: "problem-solving",
    question: "Как вы решаете сложные задачи?",
    options: [
      { name: "Анализирую детально" },
      { name: "Ищу творческие решения" },
      { name: "Консультируюсь с другими" },
      { name: "Действую интуитивно" },
    ],
  },
  {
    id: "time-management",
    question: "Как вы планируете свое время?",
    options: [
      { name: "Строгий график" },
      { name: "Гибкое планирование" },
      { name: "По приоритетам" },
      { name: "Спонтанно" },
    ],
  },
]
