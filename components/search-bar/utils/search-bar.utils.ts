import type React from "react"
import type { SearchCategory } from "../types/search-bar.types"

export const searchCategories: SearchCategory[] = [
  { key: "cognition", label: "Познание" },
  { key: "initiation", label: "Инициация" },
  { key: "integration", label: "Интеграция" },
  { key: "translation", label: "Трансляция" },
]

export const preventEmoji = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  // Prevent emoji input
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u

  if (emojiRegex.test(e.key)) {
    e.preventDefault()
    return false
  }
}

export const createSearchParams = (message: string, selectedCategory: string | null) => {
  return new URLSearchParams({
    q: message,
    ...(selectedCategory && { category: selectedCategory }),
  }).toString()
}

export const generateChatTitle = (message: string) => {
  return message.length > 30 ? `${message.substring(0, 30)}...` : message || "New Chat"
}
