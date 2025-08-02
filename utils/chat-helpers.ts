import { v4 as uuidv4 } from "uuid"
import type { Message } from "@/types/chats"
import { personalitySelector, createPersonalityTestMessage } from "@/services/personality-selector"

export const createPersonalityTestMessages = (): Message[] => {
  return personalitySelector.map((question) => ({
    id: uuidv4(),
    ...createPersonalityTestMessage(question),
  }))
}

export const getNextPersonalityQuestion = (answeredQuestions: Record<string, string>): Message | null => {
  const answeredIds = Object.keys(answeredQuestions)
  const nextQuestion = personalitySelector.find((q) => !answeredIds.includes(q.id))

  if (!nextQuestion) return null

  return {
    id: uuidv4(),
    ...createPersonalityTestMessage(nextQuestion),
  }
}
