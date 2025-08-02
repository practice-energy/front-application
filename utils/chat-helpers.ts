import { v4 as uuidv4 } from "uuid"
import type { Message } from "@/types/chats"
import { personalityQuestions, createPersonalityTestMessage } from "@/services/personality-selector"

export const createPersonalityTestMessages = (): Message[] => {
  return personalityQuestions.map((question) => ({
    id: uuidv4(),
    ...createPersonalityTestMessage(question),
  }))
}

export const getNextPersonalityQuestion = (answeredQuestions: Record<string, string>): Message | null => {
  const answeredIds = Object.keys(answeredQuestions)
  const nextQuestion = personalityQuestions.find((q) => !answeredIds.includes(q.id))

  if (!nextQuestion) return null

  return {
    id: uuidv4(),
    ...createPersonalityTestMessage(nextQuestion),
  }
}
